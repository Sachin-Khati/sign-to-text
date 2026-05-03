import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import json
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "model", "alphabet_model.h5")
LABEL_MAP_PATH = os.path.join(SCRIPT_DIR, "model", "alphabet_label_map.json")
TEST_IMAGE = os.path.join(SCRIPT_DIR, "test1.jpg")

# Load model
model = load_model(MODEL_PATH)

# Load label map
with open(LABEL_MAP_PATH, "r") as f:
    label_map = json.load(f)

index_to_label = {v: k for k, v in label_map.items()}

def preprocess(img_path):
    img = load_img(img_path, target_size=(224, 224))
    img = img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# Preprocess image
img = preprocess(TEST_IMAGE)

# Predict
pred = model.predict(img)
class_index = np.argmax(pred)
confidence = float(np.max(pred))

print("\n===== RESULT =====")
print("Predicted Alphabet:", index_to_label[class_index])
print("Confidence Score:", round(confidence, 4))
print("===================\n")
