# IMPORTANT: Import ALL models here so SQLAlchemy metadata knows all tables
from app.models.user import User
from app.models.analysis import Analysis
from app.models.result import Result
from app.models.treatment import Treatment
from app.models.progress import Progress
from app.models.chat import ChatSession, ChatMessage

from app.tasks.celery_app import celery_app
import asyncio
import json
import uuid
import asyncio
import json
import uuid
from app.tasks.celery_app import celery_app


@celery_app.task(bind=True, name="run_ml_inference")
def run_ml_inference(self, analysis_id: str, image_bytes_hex: str):
    """
    Main Celery task:
    1. Preprocess image
    2. Run 3 ML models
    3. Save results to DB
    4. Save treatments to DB
    5. Update analysis status
    """
    try:
        # Update task state to started
        self.update_state(state="STARTED", meta={"progress": 10})

        # Convert hex back to bytes
        image_bytes = bytes.fromhex(image_bytes_hex)

        # Run the async logic in a sync context
        result = asyncio.get_event_loop().run_until_complete(
            _run_inference(self, analysis_id, image_bytes)
        )
        return result

    except Exception as e:
        # Update analysis status to failed
        asyncio.get_event_loop().run_until_complete(
            _mark_failed(analysis_id, str(e))
        )
        raise


async def _run_inference(task, analysis_id: str, image_bytes: bytes) -> dict:
    """Async inference logic."""
    from app.db.session import AsyncSessionLocal
    from app.services.ml.preprocessor import preprocess_image, check_image_quality
    from app.services.ml.pipeline import pipeline
    from app.services.storage import upload_image
    from app.services.treatment_engine import get_treatments
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        try:
            # ── Step 1: Update status to processing ─────────
            task.update_state(state="STARTED", meta={"progress": 20})

            result_stmt = await db.execute(
                select(Analysis).where(Analysis.id == analysis_id)
            )
            analysis = result_stmt.scalar_one_or_none()
            if not analysis:
                raise Exception(f"Analysis {analysis_id} not found")

            analysis.status = "processing"
            await db.commit()

            # ── Step 2: Preprocess image ─────────────────────
            task.update_state(state="STARTED", meta={"progress": 40})
            tensor, face_detected = preprocess_image(image_bytes)

            if tensor is None:
                raise Exception("Image preprocessing failed")

            # ── Step 3: Run ML pipeline ──────────────────────
            task.update_state(state="STARTED", meta={"progress": 60})
            ml_result = pipeline.run(tensor)

            # ── Step 4: Save result to DB ────────────────────
            task.update_state(state="STARTED", meta={"progress": 75})
            result_id = str(uuid.uuid4())

            result = Result(
                id=result_id,
                analysis_id=analysis_id,
                has_acne=ml_result["has_acne"],
                acne_types=json.dumps(ml_result["acne_types"]),
                severity=ml_result.get("severity"),
                severity_score=ml_result.get("severity_score", 0.0),
                confidence=ml_result.get("confidence", 0.0),
            )
            db.add(result)
            await db.commit()
            await db.refresh(result)

            # ── Step 5: Save treatments ──────────────────────
            task.update_state(state="STARTED", meta={"progress": 85})
            if ml_result["has_acne"]:
                treatments = get_treatments(
                    severity=ml_result.get("severity"),
                    acne_types=ml_result["acne_types"]
                )
                for t in treatments:
                    treatment = Treatment(
                        id=str(uuid.uuid4()),
                        result_id=result_id,
                        type=t["type"],
                        name=t["name"],
                        description=t["description"],
                        active_ingredient=t.get("active_ingredient"),
                        application_method=t.get("application_method"),
                        frequency=t.get("frequency"),
                        severity_applicability=ml_result.get("severity"),
                        acne_types_applicability=json.dumps(ml_result["acne_types"])
                    )
                    db.add(treatment)

                # Save progress entry
                # Get user_id from analysis
                progress = Progress(
                    id=str(uuid.uuid4()),
                    user_id=analysis.user_id,
                    result_id=result_id,
                    severity_score=ml_result.get("severity_score", 0.0),
                )
                db.add(progress)

            await db.commit()

            # ── Step 6: Update analysis to completed ─────────
            task.update_state(state="STARTED", meta={"progress": 95})
            analysis.status = "completed"
            await db.commit()

            task.update_state(state="SUCCESS", meta={"progress": 100})

            return {
                "status": "completed",
                "result_id": result_id,
                "has_acne": ml_result["has_acne"],
                "severity": ml_result.get("severity")
            }

        except Exception as e:
            analysis.status = "failed"
            await db.commit()
            raise Exception(str(e))


async def _mark_failed(analysis_id: str, error: str):
    """Mark analysis as failed in DB."""
    from app.db.session import AsyncSessionLocal
    from app.models.analysis import Analysis
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Analysis).where(Analysis.id == analysis_id)
        )
        analysis = result.scalar_one_or_none()
        if analysis:
            analysis.status = "failed"
            await db.commit()