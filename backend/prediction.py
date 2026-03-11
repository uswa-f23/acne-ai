import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

# ----------------------------
# Image preprocessing
# ----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# ----------------------------
# Classes
# ----------------------------
type_classes = ["comedone", "papulopustular", "nodulocystic"]
severity_classes = ["mild", "moderate", "severe"]

# ----------------------------
# Load Type Model
# ----------------------------
type_model = models.resnet50(weights=None)
type_model.fc = nn.Linear(type_model.fc.in_features, 3)
type_model.load_state_dict(
    torch.load("acne_classifier.pt", map_location="cpu")
)
type_model.eval()

# ----------------------------
# Load Severity Model
# ----------------------------
sev_model = models.resnet18(weights=None)
sev_model.fc = nn.Linear(sev_model.fc.in_features, 3)
sev_model.load_state_dict(
    torch.load("acne_severity_classifier.pt", map_location="cpu")
)
sev_model.eval()

# ----------------------------
# Prediction function
# ----------------------------
def predict_pil(img: Image.Image):
    img_tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        type_output = type_model(img_tensor)
        type_idx = type_output.argmax(1).item()
        acne_type = type_classes[type_idx]

        sev_output = sev_model(img_tensor)
        sev_idx = sev_output.argmax(1).item()
        severity = severity_classes[sev_idx]

    return acne_type, severity
