"""
Convert + compress + rename all gallery photos for the website.
- JPEG/JPG: re-encode at q85, resize to max 1920px
- HEIC: decode via pillow-heif, output JPEG q85
- ARW (Sony RAW): demosaic via rawpy, output JPEG q85
- Original files are moved to a _originals/ subfolder (kept safe)
"""
import os
import shutil
import sys
from pathlib import Path
from PIL import Image, ImageOps
import pillow_heif
import rawpy

pillow_heif.register_heif_opener()

ROOT = Path(__file__).parent / "images" / "gallery"
MAX_DIM = 1920
JPEG_QUALITY = 85

# Process order: ARW first (slowest), then HEIC, then JPEG
EXT_PRIORITY = {".arw": 0, ".heic": 1, ".jpeg": 2, ".jpg": 2, ".png": 3}


def load_image(path: Path) -> Image.Image:
    """Load any supported format and return a PIL Image (RGB)."""
    ext = path.suffix.lower()
    if ext == ".arw":
        with rawpy.imread(str(path)) as raw:
            rgb = raw.postprocess(
                use_camera_wb=True,
                no_auto_bright=False,
                output_bps=8,
            )
        return Image.fromarray(rgb)
    # JPEG, HEIC (via pillow-heif), PNG all go through PIL
    img = Image.open(path)
    img.load()
    return img


def process_folder(folder: Path, prefix: str):
    if not folder.exists():
        print(f"  (skip — folder doesn't exist: {folder})")
        return

    originals_dir = folder / "_originals"
    originals_dir.mkdir(exist_ok=True)

    files = [
        f for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in EXT_PRIORITY
    ]
    files.sort(key=lambda f: (EXT_PRIORITY[f.suffix.lower()], f.name.lower()))

    if not files:
        print(f"  (no source files in {folder.name})")
        return

    print(f"\n--- {folder.name.upper()} ({len(files)} files) ---")

    for i, src in enumerate(files, start=1):
        out_name = f"{prefix}-{i:02d}.jpg"
        out_path = folder / out_name
        try:
            print(f"  [{i:02d}/{len(files)}] {src.name}  ->  {out_name}", flush=True)
            img = load_image(src)

            # Apply EXIF orientation (so phone portraits aren't sideways)
            img = ImageOps.exif_transpose(img)

            # Convert to RGB (HEIC/PNG may be RGBA/P)
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Resize so max dimension == 1920 (keep aspect ratio)
            img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)

            # Save as JPEG
            img.save(
                out_path,
                "JPEG",
                quality=JPEG_QUALITY,
                optimize=True,
                progressive=True,
            )

            # Move original out of the way
            shutil.move(str(src), str(originals_dir / src.name))

            size_kb = out_path.stat().st_size // 1024
            w, h = img.size
            print(f"           {w}x{h}  ~{size_kb} KB")

        except Exception as e:
            print(f"           !! FAILED: {e}")


if __name__ == "__main__":
    process_folder(ROOT / "tournaments", "tournament")
    process_folder(ROOT / "candids", "candid")
    print("\nDONE.")
