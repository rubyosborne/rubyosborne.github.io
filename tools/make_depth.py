"""Generate a depth map for an image using Depth Anything V2 (free, local).
Usage: python make_depth.py <input.jpg> <output.jpg>
Convention: brighter = nearer (matches the canopy shader's depth.r usage).
"""
import sys
import numpy as np
from PIL import Image
from transformers import pipeline

src, out = sys.argv[1], sys.argv[2]
print(f"Loading {src} ...")
img = Image.open(src).convert("RGB")

print("Loading Depth Anything V2 (downloads model on first run) ...")
pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")

print("Estimating depth ...")
res = pipe(img)
depth = np.array(res["depth"]).astype(np.float32)

# Normalize to 0..255. Depth Anything outputs inverse depth: near = high (bright).
depth -= depth.min()
if depth.max() > 0:
    depth /= depth.max()
depth8 = (depth * 255.0).astype(np.uint8)

# Match the source resolution so UVs line up exactly.
out_img = Image.fromarray(depth8).resize(img.size, Image.BILINEAR)
out_img.save(out, quality=95)
print(f"Saved {out}  size={out_img.size}  (bright=near, dark=far)")
