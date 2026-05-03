import os
import json
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# -------------------------
# PATHS
# -------------------------
DATASET_DIR = r"C:/AI-based-sign-language-detector-main/MyDataset/Alphabet"
MODEL_SAVE_PATH = r"C:/AI-based-sign-language-detector-main/test_model/model/alphabet_model.h5"
LABEL_MAP_PATH = r"C:/AI-based-sign-language-detector-main/test_model/model/alphabet_label_map.json"

# -------------------------
# IMAGE GENERATORS (NO AUGMENTATION)
# -------------------------
train_datagen = ImageDataGenerator(rescale=1/255.0, validation_split=0.2)

train_gen = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical",
    subset="training"
)

val_gen = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical",
    subset="validation"
)

# -------------------------
# SAVE LABEL MAP
# -------------------------
label_map = train_gen.class_indices
with open(LABEL_MAP_PATH, "w") as f:
    json.dump(label_map, f)

print("Alphabet Label Map Saved:", label_map)

# -------------------------
# BUILD MODEL (MobileNetV2)
# -------------------------
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation="relu")(x)
output = Dense(len(label_map), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# -------------------------
# TRAIN MODEL
# -------------------------
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=12,
)

# -------------------------
# SAVE MODEL
# -------------------------
model.save(MODEL_SAVE_PATH)
print("Alphabet Model Saved At:", MODEL_SAVE_PATH)
