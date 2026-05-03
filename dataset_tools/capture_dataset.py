import cv2
import os

# Get project root (two levels up from this script)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATASET_PATH = os.path.join(PROJECT_ROOT, "MyDataset")

# Ensure dataset folder exists
os.makedirs(DATASET_PATH, exist_ok=True)

print("\nCategories:")
print("Alphabet")
print("Words")

category = input("\nEnter category (Alphabet/Words): ").strip()
label = input("Enter label name (A, B, Hello, Namaste, etc): ").strip()
count = int(input("How many images to capture: "))

label_path = os.path.join(DATASET_PATH, category, label)
os.makedirs(label_path, exist_ok=True)

print(f"\nImages will be saved to: {label_path}\n")
print("➡ Press SPACE to capture an image")
print("➡ Press Q to quit\n")

cap = cv2.VideoCapture(0)
i = 0

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    # Display progress text
    cv2.putText(frame, f"{label}: {i}/{count}", (10, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    cv2.imshow("Dataset Capture", frame)

    key = cv2.waitKey(1) & 0xFF  # FIXED FOR ALL KEYBOARDS

    # SPACE → capture image
    if key == ord(' '):
        img_path = os.path.join(label_path, f"{label}_{i}.jpg")
        saved = cv2.imwrite(img_path, frame)
        print(f"[SAVED] {img_path} → {saved}")
        i += 1

    # EXIT → Q or ESC
    if key in [ord('q'), ord('Q'), 27] or i >= count:
        print("\nExiting...")
        break

cap.release()
cv2.destroyAllWindows()

print("\nCapture Completed!")
print(f"Total images saved: {i}")
print(f"Saved Folder: {label_path}")
