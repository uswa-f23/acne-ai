import random
from typing import Dict, Any


ACNE_TYPES = [
    "blackheads", "cysts", "nodules",
    "papules", "pustules", "whiteheads"
]

SEVERITY_LABELS = ["mild", "moderate", "severe", "very_severe"]
SEVERITY_SCORES = {"mild": 0.2, "moderate": 0.5, "severe": 0.75, "very_severe": 0.95}


class MockPipeline:
    def run(self, tensor) -> Dict[str, Any]:
        has_acne = random.random() > 0.3
        if not has_acne:
            return {
                "has_acne": False,
                "acne_types": [],
                "severity": None,
                "severity_score": 0.0,
                "confidence": round(random.uniform(0.75, 0.95), 4)
            }

        num_types = random.randint(1, 3)
        acne_types = random.sample(ACNE_TYPES, num_types)
        severity = random.choice(SEVERITY_LABELS)

        return {
            "has_acne": True,
            "acne_types": acne_types,
            "severity": severity,
            "severity_score": SEVERITY_SCORES[severity],
            "confidence": round(random.uniform(0.75, 0.95), 4)
        }


pipeline = MockPipeline()