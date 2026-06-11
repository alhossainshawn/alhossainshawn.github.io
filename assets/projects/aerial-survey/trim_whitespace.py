"""
Trim near-white (and near-black) borders from all images in this folder.
Overwrites each image in-place.
"""
from pathlib import Path
from PIL import Image, ImageChops
import numpy as np

FOLDER = Path(__file__).parent
EXTS   = {'.png', '.jpg', '.jpeg', '.webp', '.jpx'}

# How close to pure white (255,255,255) a pixel must be to count as background
WHITE_THRESHOLD = 240   # pixels with ALL channels >= this are "white"
PADDING = 6             # px of padding to leave after trimming


def trim_image(path: Path) -> bool:
    """Return True if the image was changed and saved."""
    try:
        img = Image.open(path).convert('RGBA')
    except Exception as e:
        print(f"  SKIP {path.name}: {e}")
        return False

    arr = np.array(img)
    # Mask: pixels that are NOT near-white background
    rgb = arr[:, :, :3]
    mask = np.any(rgb < WHITE_THRESHOLD, axis=2)   # True = content pixel

    rows = np.any(mask, axis=1)   # which rows have content
    cols = np.any(mask, axis=0)   # which cols have content

    if not rows.any():
        print(f"  SKIP {path.name}: image appears entirely blank")
        return False

    r0, r1 = np.where(rows)[0][[0, -1]]
    c0, c1 = np.where(cols)[0][[0, -1]]

    h, w = arr.shape[:2]
    r0 = max(0,     r0 - PADDING)
    r1 = min(h - 1, r1 + PADDING)
    c0 = max(0,     c0 - PADDING)
    c1 = min(w - 1, c1 + PADDING)

    # Only save if we actually cut something off
    if r0 == 0 and r1 == h - 1 and c0 == 0 and c1 == w - 1:
        print(f"  OK   {path.name}: no trim needed")
        return False

    cropped = img.crop((c0, r0, c1 + 1, r1 + 1))

    # Save back in original format (fall back to PNG for anything exotic)
    fmt = img.format or 'PNG'
    if fmt == 'JPEG' or path.suffix.lower() in ('.jpg', '.jpeg'):
        cropped = cropped.convert('RGB')
        cropped.save(path, 'JPEG', quality=92)
    elif path.suffix.lower() == '.webp':
        cropped.save(path, 'WEBP', quality=92)
    else:
        cropped.save(path, 'PNG')

    print(f"  TRIM {path.name}: ({w}x{h}) -> ({c1-c0+1}x{r1-r0+1})")
    return True


changed = 0
for p in sorted(FOLDER.iterdir()):
    if p.suffix.lower() in EXTS and p.stem != 'trim_whitespace':
        if trim_image(p):
            changed += 1

print(f"\nDone. {changed} image(s) trimmed.")
