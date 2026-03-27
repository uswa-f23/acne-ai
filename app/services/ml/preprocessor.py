import cv2
import numpy as np
from PIL import Image
import io
from typing import Optional, Tuple


def preprocess_image(image_bytes: bytes) -> Tuple[Optional[np.ndarray], bool]:
    """
    Takes raw image bytes, detects face, preprocesses for model input.
    Returns (tensor, face_detected)
    """
    try:
        # Decode image bytes
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return None, False

        # Convert to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Try face detection using OpenCV (lightweight, no mediapipe needed)
        face_detected = detect_face(img)

        # Resize to 224x224 (EfficientNet-B3 input)
        img_resized = cv2.resize(img_rgb, (224, 224))

        # Apply CLAHE for contrast enhancement
        img_clahe = apply_clahe(img_resized)

        # Normalize with ImageNet mean/std
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)

        img_normalized = img_clahe.astype(np.float32) / 255.0
        img_normalized = (img_normalized - mean) / std

        # Convert to NCHW format: [1, 3, 224, 224]
        img_tensor = np.transpose(img_normalized, (2, 0, 1))
        img_tensor = np.expand_dims(img_tensor, axis=0).astype(np.float32)

        return img_tensor, face_detected

    except Exception as e:
        print(f"Preprocessing error: {e}")
        return None, False


def detect_face(img: np.ndarray) -> bool:
    """
    Lightweight face detection using OpenCV Haar Cascade.
    Returns True if at least one face is detected.
    """
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        return len(faces) > 0
    except Exception:
        # If face detection fails, proceed anyway
        return True


def apply_clahe(img_rgb: np.ndarray) -> np.ndarray:
    """
    Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    to improve image quality for acne detection.
    """
    # Convert to LAB color space
    img_lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2LAB)

    # Apply CLAHE to L channel only
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    img_lab[:, :, 0] = clahe.apply(img_lab[:, :, 0])

    # Convert back to RGB
    img_clahe = cv2.cvtColor(img_lab, cv2.COLOR_LAB2RGB)
    return img_clahe


def check_image_quality(image_bytes: bytes) -> Tuple[bool, str]:
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return False, "Could not decode image"

        # Check image size (min 50x50 — relaxed from 100x100)
        h, w = img.shape[:2]
        if h < 50 or w < 50:
            return False, "Image too small"

        # Check brightness (not too dark — relaxed from 30 to 15)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray)
        if mean_brightness < 15:
            return False, "Image too dark"

        # Check blurriness — relaxed from 50 to 20
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < 20:
            return False, "Image too blurry"

        return True, "OK"

    except Exception as e:
        return False, str(e)