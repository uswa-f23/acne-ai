import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


async def upload_image(image_bytes: bytes, folder: str = "acneai/uploads") -> dict:
    """
    Upload image bytes to Cloudinary.
    Returns dict with url and public_id.
    """
    try:
        result = cloudinary.uploader.upload(
            image_bytes,
            folder=folder,
            resource_type="image",
            format="jpg",
            quality="auto",
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
        }
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {str(e)}")


async def upload_annotated_image(image_bytes: bytes, analysis_id: str) -> dict:
    """
    Upload annotated/processed image to Cloudinary.
    """
    return await upload_image(
        image_bytes,
        folder=f"acneai/annotated"
    )


def delete_image(public_id: str) -> bool:
    """Delete image from Cloudinary by public_id."""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception:
        return False