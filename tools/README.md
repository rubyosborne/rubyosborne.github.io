# Depth map generator (free, local — Depth Anything V2)

Generates a depth map for any image so the canopy shader's parallax is driven
by real neural depth (bright = near, dark = far) instead of luminance.

## One-time setup
```bash
python3 -m venv tools/depthenv
tools/depthenv/bin/pip install torch transformers pillow numpy
```

## Generate a depth map
```bash
tools/depthenv/bin/python tools/make_depth.py public/canopy.jpg public/canopy-depth.jpg
```
Then refresh the site — the shader auto-detects `public/canopy-depth.jpg`.

Works for any source image (e.g. a better landscape canopy photo, or the floor).
