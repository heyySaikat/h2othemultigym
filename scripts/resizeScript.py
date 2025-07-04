import os
from PIL import Image

# Get current working directory
base_folder = os.path.dirname(os.path.abspath(__file__))
output_folder = os.path.join(base_folder, "resized_images")

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Resolutions to generate
target_widths = [400, 800, 1200]

# Loop through all .webp files (ignore already resized ones)
for filename in os.listdir(base_folder):
    if filename.lower().endswith(".webp") and not any(f"-{w}.webp" in filename for w in target_widths):
        img_path = os.path.join(base_folder, filename)
        image = Image.open(img_path)
        original_name = os.path.splitext(filename)[0]

        for width in target_widths:
            aspect_ratio = image.height / image.width
            new_height = int(width * aspect_ratio)
            resized = image.resize((width, new_height), Image.LANCZOS)

            new_filename = f"{original_name}-{width}.webp"
            save_path = os.path.join(output_folder, new_filename)

            resized.save(save_path, "WEBP")
            print(f"Saved {new_filename} -> resized_images/")
