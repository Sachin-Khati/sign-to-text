import os
import cv2

ROOT = r"D:\AI-based-sign-language-detector-main\MyDataset"
TARGET_SIZE = (224, 224)
BLUR_THRESHOLD = 50.0  # lower = delete more blurry images

def is_image(fname):
    return fname.lower().endswith((".jpg", ".jpeg", ".png"))

def variance_of_laplacian(image):
    return cv2.Laplacian(image, cv2.CV_64F).var()

deleted = 0
processed = 0

for category in os.listdir(ROOT):
    cat_path = os.path.join(ROOT, category)
    if not os.path.isdir(cat_path): continue

    for label in os.listdir(cat_path):
        label_path = os.path.join(cat_path, label)
        if not os.path.isdir(label_path): continue

        print(f"\nCleaning → {category}/{label}")

        for fname in os.listdir(label_path):
            fp = os.path.join(label_path, fname)
            if not is_image(fname): continue

            img = cv2.imread(fp)
            if img is None:
                os.remove(fp)
                deleted += 1
                continue

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            score = variance_of_laplacian(gray)

            if score < BLUR_THRESHOLD:
                print("Deleting blurry:", fp, "score:", score)
                os.remove(fp)
                deleted += 1
                continue

            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, TARGET_SIZE)

            cv2.imwrite(fp, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
            processed += 1

print("\nDONE CLEANING!")
print("Processed images:", processed)
print("Deleted images:", deleted)
