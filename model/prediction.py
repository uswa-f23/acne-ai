import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

# ----------------------------
# 1. Image preprocessing
# ----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ----------------------------
# 2. Class names
# ----------------------------
type_classes = ["comedone", "papulopustular", "nodulocystic"]
severity_classes = ["mild", "moderate", "severe"]

# ----------------------------
# 3. Load Type Model (ResNet50)
# ----------------------------
type_model = models.resnet50(weights=None)
num_ftrs = type_model.fc.in_features
type_model.fc = nn.Linear(num_ftrs, 3)
type_model.load_state_dict(torch.load("acne_classifier.pt", map_location="cpu"))
type_model.eval()

# ----------------------------
# 4. Load Severity Model (ResNet18)
# ----------------------------
sev_model = models.resnet18(weights=None)
num_ftrs = sev_model.fc.in_features
sev_model.fc = nn.Linear(num_ftrs, 3)
sev_model.load_state_dict(torch.load("acne_severity_classifier.pt", map_location="cpu"))
sev_model.eval()

# ----------------------------
# 5. Predict function
# ----------------------------
def predict(image_path):
    img = Image.open(image_path).convert("RGB")
    img_t = transform(img).unsqueeze(0)  # shape: (1, 3, 224, 224)

    # ---- Predict Type ----
    with torch.no_grad():
        type_output = type_model(img_t)
        type_idx = type_output.argmax(1).item()
        acne_type = type_classes[type_idx]

    # ---- Predict Severity ----
    with torch.no_grad():
        sev_output = sev_model(img_t)
        sev_idx = sev_output.argmax(1).item()
        severity = severity_classes[sev_idx]

    return acne_type, severity

# ----------------------------
# 6. Run prediction
# ----------------------------
if __name__ == "__main__":
    image_path = "C:/Users/HP/Desktop/FYP/testImage.jpeg"   # <- replace with your image file
    acne_type, severity = predict(image_path)
    print("\n----- PREDICTION -----")
    print("Acne Type:", acne_type)
    print("Severity :", severity)
