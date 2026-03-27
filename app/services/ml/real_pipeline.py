import onnxruntime as ort
import numpy as np
import os
from typing import Dict, Any, List
from app.core.config import settings

# Labels from your spec
ACNE_TYPES = [
    "blackheads", "cysts", "nodules",
    "papules", "pustules", "whiteheads"
]

SEVERITY_LABELS = {
    0: "mild",
    1: "moderate",
    2: "severe",
    3: "very_severe"
}

SEVERITY_SCORES = {
    "mild": 0.2,
    "moderate": 0.5,
    "severe": 0.75,
    "very_severe": 0.95
}

DETECTION_THRESHOLD = 0.50
TYPE_THRESHOLD = 0.40

# Get absolute base path of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


def get_abs_path(relative_path: str) -> str:
    """Convert relative model path to absolute path."""
    return os.path.join(BASE_DIR, relative_path)


class RealPipeline:
    def __init__(self):
        self._detection_session = None
        self._type_session = None
        self._severity_session = None
        self._loaded = False

    def _load_models(self):
        if self._loaded:
            return

        print("Loading ONNX models...")

        detection_path = get_abs_path(settings.DETECTION_MODEL_PATH)
        type_path = get_abs_path(settings.TYPE_MODEL_PATH)
        severity_path = get_abs_path(settings.SEVERITY_MODEL_PATH)

        print(f"Detection model: {detection_path}")
        print(f"Type model: {type_path}")
        print(f"Severity model: {severity_path}")

        # Verify files exist
        for path in [detection_path, type_path, severity_path]:
            if not os.path.exists(path):
                raise FileNotFoundError(f"Model file not found: {path}")

        opts = ort.SessionOptions()
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        self._detection_session = ort.InferenceSession(detection_path, sess_options=opts)
        self._type_session = ort.InferenceSession(type_path, sess_options=opts)
        self._severity_session = ort.InferenceSession(severity_path, sess_options=opts)

        self._loaded = True
        print("✅ All models loaded successfully")

    def run(self, tensor: np.ndarray) -> Dict[str, Any]:
        self._load_models()

        # Stage 1: Detection
        detection_input = {self._detection_session.get_inputs()[0].name: tensor}
        detection_output = self._detection_session.run(None, detection_input)
        detection_score = float(self._sigmoid(detection_output[0])[0][0])
        has_acne = detection_score >= DETECTION_THRESHOLD

        if not has_acne:
            return {
                "has_acne": False,
                "acne_types": [],
                "severity": None,
                "severity_score": 0.0,
                "confidence": round(1 - detection_score, 4)
            }

        # Stage 2: Type Classification
        type_input = {self._type_session.get_inputs()[0].name: tensor}
        type_output = self._type_session.run(None, type_input)
        type_scores = self._sigmoid(type_output[0])[0]
        acne_types = [
            ACNE_TYPES[i]
            for i, score in enumerate(type_scores)
            if score >= TYPE_THRESHOLD
        ]
        if not acne_types:
            top_idx = int(np.argmax(type_scores))
            acne_types = [ACNE_TYPES[top_idx]]

        # Stage 3: Severity Grading
        severity_input = {self._severity_session.get_inputs()[0].name: tensor}
        severity_output = self._severity_session.run(None, severity_input)
        severity_probs = self._softmax(severity_output[0])[0]
        severity_idx = int(np.argmax(severity_probs))
        severity_label = SEVERITY_LABELS[severity_idx]
        severity_score = SEVERITY_SCORES[severity_label]
        confidence = round(float(severity_probs[severity_idx]), 4)

        return {
            "has_acne": True,
            "acne_types": acne_types,
            "severity": severity_label,
            "severity_score": severity_score,
            "confidence": confidence
        }

    @staticmethod
    def _sigmoid(x: np.ndarray) -> np.ndarray:
        return 1 / (1 + np.exp(-x))

    @staticmethod
    def _softmax(x: np.ndarray) -> np.ndarray:
        e_x = np.exp(x - np.max(x, axis=1, keepdims=True))
        return e_x / e_x.sum(axis=1, keepdims=True)


pipeline = RealPipeline()