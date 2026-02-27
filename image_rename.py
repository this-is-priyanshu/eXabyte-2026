import os
from PIL import Image

output_dir = os.path.join(os.getcwd(), "assets", "about_us")
input_dir = os.path.join(os.path.expanduser("~"), "Downloads", "ABOUT_US_PICS")

os.makedirs(output_dir, exist_ok=True)

valid_extensions = (".png", ".jpeg", ".jpg", ".webp", ".bmp", ".tiff", ".gif")

for file in os.listdir(input_dir):
    if file.lower().endswith(valid_extensions):
        name, _ = os.path.splitext(file)
        new_name = name.replace("-", "_").replace(" ", "_").lower() + ".jpg"
        input_path = os.path.join(input_dir, file)
        output_path = os.path.join(output_dir, new_name)

        with Image.open(input_path) as img:
            rgb_img = img.convert("RGB")
            rgb_img.save(output_path, "JPEG")