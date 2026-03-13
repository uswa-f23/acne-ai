import os

ML_MODE = os.getenv("ML_MODE", "real")

if ML_MODE == "real":
    try:
        from app.services.ml.real_pipeline import pipeline
        print(f"✅ ML Mode: REAL (ONNX inference)")
    except Exception as e:
        print(f"⚠️ Failed to load real pipeline: {e}")
        print("⚠️ Falling back to mock pipeline")
        from app.services.ml.mock_pipeline import pipeline
else:
    from app.services.ml.mock_pipeline import pipeline
    print(f"✅ ML Mode: MOCK (fake inference)")