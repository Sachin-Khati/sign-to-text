import os
import cv2
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# YOUR CORRECT PATHS 👇
INPUT_DIR = r"D:\AI-based-sign-language-detector-main\MyDataset"
OUTPUT_DIR = r"D:\AI-based-sign-language-detector-main\MyDataset_Augmented"

# Create output root folder
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Augmentation settings
datagen = ImageDataGenerator(
    rotation_range=15,
    width_shift_range=0.15,
    height_shift_range=0.15,
    zoom_range=0.15,
    shear_range=0.10,
    brightness_range=[0.6, 1.3],
    horizontal_flip=True,
    fill_mode='nearest'
)

TARGET_SIZE = (224, 224)
AUG_PER_IMAGE = 5  # Each original → 5 augmented images

def is_image(fname):
    return fname.lower().endswith((".jpg", ".jpeg", ".png"))

print("\nStarting augmentation...\n")

for category in os.listdir(INPUT_DIR):
    category_path = os.path.join(INPUT_DIR, category)
    if not os.path.isdir(category_path):
        continue

    for label in os.listdir(category_path):
        label_path = os.path.join(category_path, label)
        if not os.path.isdir(label_path):
            continue

        print(f"\nAugmenting: {category} / {label}")

        # Create output label folder
        save_dir = os.path.join(OUTPUT_DIR, category, label)
        os.makedirs(save_dir, exist_ok=True)

        img_files = [f for f in os.listdir(label_path) if is_image(f)]
        count = 0

        for fname in img_files:
            fp = os.path.join(label_path, fname)
            img = cv2.imread(fp)

            if img is None:
                continue

            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # ⭐ FIXED LINE HERE ⭐
            img = cv2.resize(img, TARGET_SIZE)

            img = np.expand_dims(img, axis=0)

            # Generate augmentations
            aug_iter = datagen.flow(img, batch_size=1)

            for i in range(AUG_PER_IMAGE):
                aug_img = next(aug_iter)[0]
                aug_img = cv2.cvtColor(aug_img, cv2.COLOR_RGB2BGR)

                out_path = os.path.join(
                    save_dir,
                    f"{label}_aug_{count}.jpg"
                )
                cv2.imwrite(out_path, aug_img)
                count += 1

        print(f"Generated {count} augmented images for {label}")

print("\n✅ AUGMENTATION COMPLETE!")
print("Output saved to:", OUTPUT_DIR)
