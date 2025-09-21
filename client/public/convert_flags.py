import os
from PIL import Image

src = "flags"
dst = "flags_grayscale"

os.makedirs(dst, exist_ok=True)

for filename in os.listdir(src):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        img = Image.open(os.path.join(src, filename)).convert("L")  # grayscale
        img.save(os.path.join(dst, filename))

