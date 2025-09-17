import torch
from torch.utils.data import Dataset, DataLoader, Sampler
import torch.nn.functional as F
from collections import defaultdict
from PIL import Image
from torchvision import transforms
import torch.nn as nn
import torch.optim as optim

class ProtoNet(nn.Module):
    def __init__(self, embedding_dim=32):
        super(ProtoNet, self).__init__()

        def conv_block(in_channels, out_channels):
            return nn.Sequential(
                nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=1, padding=1, bias=False),
                nn.BatchNorm2d(out_channels),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2)  # halve spatial resolution
            )

        # 224 → 112 → 56 → 28 → 14 → 7
        self.encoder = nn.Sequential(
            conv_block(3, 4),      # 224 → 112
            conv_block(4, 8),    # 112 → 56
            conv_block(8, 16),   # 56 → 28
            conv_block(16, 32),   # 28 → 14
            conv_block(32, embedding_dim),  # 14 → 7
            nn.AdaptiveAvgPool2d(1) # always → (1,1)
        )

    def forward(self, x):
        x = self.encoder(x)              # (B, embedding_dim, 1, 1)
        return x.view(x.size(0), -1)     # flatten → (B, embedding_dim)
    
class ProtoClassifier(nn.Module):
    def __init__(self, backbone, num_classes=41, embedding_dim=32):
        super().__init__()
        self.backbone = backbone
        # prototypes are learnable parameters
        self.class_prototypes = nn.Parameter(
            torch.randn(num_classes, embedding_dim)
        )

    def forward(self, x):
        embeddings = self.backbone(x)  # (B, embedding_dim)
        dists = torch.cdist(embeddings, self.class_prototypes)  # (B, num_classes)
        logits = -dists
        return logits, embeddings
    
def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((112, 112)),
        transforms.ToTensor(),
    ])
    image = Image.open(image_path).convert("RGB")
    return transform(image).unsqueeze(0)  # (1, C, H, W)

# --- Inference ---
def predict(image_path, model, device="cpu"):
    class_names = [
        'Alambadi',
        'Amritmahal',
        'Ayrshire',
        'Banni',
        'Bargur',
        'Bhadawari',
        'Brown_Swiss',
        'Dangi',
        'Deoni',
        'Gir',
        'Guernsey',
        'Hallikar',
        'Hariana',
        'Holstein_Friesian',
        'Jaffrabadi',
        'Jersey',
        'Kangayam',
        'Kankrej',
        'Kasargod',
        'Kenkatha',
        'Kherigarh',
        'Khillari',
        'Krishna_Valley',
        'Malnad_gidda',
        'Mehsana',
        'Murrah',
        'Nagori',
        'Nagpuri',
        'Nili_Ravi',
        'Nimari',
        'Ongole',
        'Pulikulam',
        'Rathi',
        'Red_Dane',
        'Red_Sindhi',
        'Sahiwal',
        'Surti',
        'Tharparkar',
        'Toda',
        'Umblachery',
        'Vechur'
    ]
    image = preprocess_image(image_path).to(device)
    with torch.no_grad():
        logits, _ = model(image)
        probs = F.softmax(logits, dim=1)
        pred_idx = probs.argmax(dim=1).item()
        return class_names[pred_idx], probs[0][pred_idx].item()

# --- Example usage ---
if __name__ == "__main__":
    # Define your class names (replace with your dataset’s labels)
    class_names = [
        'Alambadi',
        'Amritmahal',
        'Ayrshire',
        'Banni',
        'Bargur',
        'Bhadawari',
        'Brown_Swiss',
        'Dangi',
        'Deoni',
        'Gir',
        'Guernsey',
        'Hallikar',
        'Hariana',
        'Holstein_Friesian',
        'Jaffrabadi',
        'Jersey',
        'Kangayam',
        'Kankrej',
        'Kasargod',
        'Kenkatha',
        'Kherigarh',
        'Khillari',
        'Krishna_Valley',
        'Malnad_gidda',
        'Mehsana',
        'Murrah',
        'Nagori',
        'Nagpuri',
        'Nili_Ravi',
        'Nimari',
        'Ongole',
        'Pulikulam',
        'Rathi',
        'Red_Dane',
        'Red_Sindhi',
        'Sahiwal',
        'Surti',
        'Tharparkar',
        'Toda',
        'Umblachery',
        'Vechur'
    ]
    device = "cpu"
    model = ProtoClassifier(ProtoNet(32), num_classes=len(class_names), embedding_dim=32).to(device)
    model.load_state_dict(torch.load("model_weights.pth", map_location=device))
    model.eval()

    # Test image
    img_path = "Indian_bovine_breeds/Alambadi/Alambadi_1.png"
    pred_class, confidence = predict(img_path, model, device=device)

    print(f"Predicted: {pred_class} (confidence: {confidence:.2f})")