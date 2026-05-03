import os
import json
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import io

app = Flask(__name__)
CORS(app)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(PROJECT_ROOT, "test_model", "model")
ALPHABET_MODEL_PATH = os.path.join(MODEL_DIR, "alphabet_model.h5")
WORDS_MODEL_PATH = os.path.join(MODEL_DIR, "words_model.h5")
ALPHABET_LABEL_MAP_PATH = os.path.join(MODEL_DIR, "alphabet_label_map.json")
WORDS_LABEL_MAP_PATH = os.path.join(MODEL_DIR, "word_label_map.json")
alphabet_model = None
words_model = None
alphabet_index_to_label = None
words_index_to_label = None


def load_models():
    """Load models and label maps"""
    global alphabet_model, words_model, alphabet_index_to_label, words_index_to_label
    
    try:
        
        print(f"Loading alphabet model from {ALPHABET_MODEL_PATH}")
        alphabet_model = load_model(ALPHABET_MODEL_PATH)
        
        
        print(f"Loading words model from {WORDS_MODEL_PATH}")
        words_model = load_model(WORDS_MODEL_PATH)
        
        with open(ALPHABET_LABEL_MAP_PATH, "r") as f:
            alphabet_label_map = json.load(f)
        alphabet_index_to_label = {v: k for k, v in alphabet_label_map.items()}
        
        with open(WORDS_LABEL_MAP_PATH, "r") as f:
            words_label_map = json.load(f)
        words_index_to_label = {v: k for k, v in words_label_map.items()}
        
        print("✅ Models loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Error loading models: {str(e)}")
        return False


def preprocess_image(image_bytes, target_size=(224, 224)):
    """Preprocess image for model prediction"""
    try:
        if isinstance(image_bytes, str):
            # Remove data URL prefix if present
            if ',' in image_bytes:
                image_bytes = image_bytes.split(',')[1]
            image_bytes = base64.b64decode(image_bytes)
        

        img = Image.open(io.BytesIO(image_bytes))
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img = img.resize(target_size)
        img_array = img_to_array(img)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        raise


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "models_loaded": alphabet_model is not None and words_model is not None
    })


@app.route("/predict", methods=["POST"])
def predict():
    """Predict sign language from image"""
    try:
        data = request.json
        
        if not data or "image" not in data:
            return jsonify({"error": "image is required (base64)"}), 400
        
        model_type = data.get("type", "words")  # "alphabet" or "words"
        
        if model_type not in ["alphabet", "words"]:
            return jsonify({"error": "type must be 'alphabet' or 'words'"}), 400
        if model_type == "alphabet":
            model = alphabet_model
            index_to_label = alphabet_index_to_label
        else:
            model = words_model
            index_to_label = words_index_to_label
        
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500
        
        image_data = data["image"]
        img_array = preprocess_image(image_data)

        predictions = model.predict(img_array, verbose=0)
        class_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))
        
        label = index_to_label.get(class_index, "Unknown")
        
        if model_type == "words":
            label_mapping = {
                "ILoveYou": "I Love You",
                "ThankYou": "Thank You"
            }
            label = label_mapping.get(label, label)
        
        return jsonify({
            "label": label,
            "confidence": round(confidence, 4),
            "type": model_type
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🚀 Starting Sign Language Detection API...")
    
    if not load_models():
        print("⚠️  Warning: Models failed to load. API will start but predictions will fail.")
    
    port = int(os.environ.get("PYTHON_PORT", 5000))
    print(f"📡 API running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)

