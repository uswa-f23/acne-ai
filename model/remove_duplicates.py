import os
from PIL import Image
import imagehash

# --------------------------------------
# PATHS
# --------------------------------------
labeled_root = r"C:\Users\HP\Desktop\FYP\labeled"
unlabeled_root = r"C:\Users\HP\Desktop\FYP\unlabeled"

labeled_hashes = {}     
unlabeled_hashes = {}   
deleted_count = 0

# --------------------------------------
# HASH FUNCTION
# --------------------------------------
def hash_image(path):
    try:
        img = Image.open(path)
        h = str(imagehash.phash(img))
        return h
    except:
        # corrupt image → delete ONLY from unlabeled
        print("Corrupt image removed:", path)
        try:
            os.remove(path)
        except:
            pass
        return None


# --------------------------------------
# STEP 1 — Index all labeled images (NEVER delete these)
# --------------------------------------
print("Indexing labeled images...")

for root, dirs, files in os.walk(labeled_root):
    for file in files:
        img_path = os.path.join(root, file)
        h = hash_image(img_path)
        if h:
            labeled_hashes[h] = img_path

print(f"Total labeled images indexed: {len(labeled_hashes)}")


# --------------------------------------
# STEP 2 — Remove duplicates from unlabeled only
# --------------------------------------
print("\nCleaning unlabeled images...")

for root, dirs, files in os.walk(unlabeled_root):
    for file in files:
        img_path = os.path.join(root, file)

        # ignore non-image files
        if not file.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        h = hash_image(img_path)
        if not h:
            continue

        # CASE 1 — duplicate of labeled → DELETE from unlabeled
        if h in labeled_hashes:
            print("Removed (duplicate of labeled):", img_path)
            os.remove(img_path)
            deleted_count += 1
            continue

        # CASE 2 — duplicate inside unlabeled → DELETE from unlabeled
        if h in unlabeled_hashes:
            print("Removed (duplicate inside unlabeled):", img_path)
            os.remove(img_path)
            deleted_count += 1
            continue

        # Keep image
        unlabeled_hashes[h] = img_path


print(f"\nTotal removed from unlabeled: {deleted_count}")
