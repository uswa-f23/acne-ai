import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

# -----------------------------
# PATH TO LABELED TRAINING DATA
# -----------------------------
data_root = r"C:\Users\HP\Desktop\FYP\labeled"  # <-- UPDATE IF NEEDED

# -----------------------------
# TRANSFORMS
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# -----------------------------
# DATASET & DATALOADER
# -----------------------------
dataset = datasets.ImageFolder(data_root, transform=transform)
train_loader = DataLoader(dataset, batch_size=16, shuffle=True)

# -----------------------------
# NUMBER OF CLASSES
# -----------------------------
num_classes = 3   # Comedone, Papulopustular, Nodulocystic

# -----------------------------
# MODEL: ResNet50 (pretrained)
# -----------------------------
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)



# Replace final layer
model.fc = nn.Linear(model.fc.in_features, num_classes)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# -----------------------------
# LOSS & OPTIMIZER
# -----------------------------
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0001)

# -----------------------------
# TRAINING LOOP
# -----------------------------
epochs = 10  # you can increase to 20+

print("Training started...\n")

for epoch in range(epochs):
    model.train()
    running_loss = 0.0

    for imgs, labels in train_loader:
        imgs, labels = imgs.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    avg_loss = running_loss / len(train_loader)
    print(f"Epoch [{epoch+1}/{epochs}], Loss: {avg_loss:.4f}")

print("\nTraining completed!")

# -----------------------------
# SAVE MODEL
# -----------------------------
save_path = "acne_classifier.pt"
torch.save(model.state_dict(), save_path)
print(f"\nModel saved as: {save_path}")
