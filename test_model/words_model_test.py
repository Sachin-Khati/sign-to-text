import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import json
import os

# -----------------------------
# PATHS
# -----------------------------
# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "model", "words_model.h5")
LABEL_MAP_PATH = os.path.join(SCRIPT_DIR, "model", "word_label_map.json")

# -----------------------------
# LOAD MODEL & LABEL MAP
# -----------------------------
print("📌 Loading Word Model...")

model = load_model(MODEL_PATH)

with open(LABEL_MAP_PATH, "r") as f:
    label_map = json.load(f)

index_to_label = {v: k for k, v in label_map.items()}

print("✅ Model & Label Map Loaded Successfully!")
print("Detected Classes:", index_to_label)

# -----------------------------
# PREDICT FUNCTION
# -----------------------------
def predict_word(image_path):
    print(f"\n🔍 Predicting for image: {image_path}")

    img = load_img(image_path, target_size=(224, 224))
    img = img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    class_index = np.argmax(preds)
    confidence = float(np.max(preds))

    predicted_word = index_to_label[class_index]

    print(f"📌 Prediction: {predicted_word}")
    print(f"📈 Confidence: {confidence:.4f}")


# -----------------------------
# TEST HERE
# -----------------------------
# Yaha apni test image ka path daalo
image_path = os.path.join(SCRIPT_DIR, "word_test.jpg")

if os.path.exists(image_path):
    predict_word(image_path)
else:
    print(f"❌ Test image not found at: {image_path}")
    print("Please provide a valid image path.")
