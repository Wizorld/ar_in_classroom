# Image Targets

Printed images that trigger the AR lab experiment (replaces the old ArUco/barcode markers).

## Image → Prop mapping

| Source image | Prop (propId) | Old barcode value | Anchored model |
|--------------|---------------|-------------------|----------------|
| `source/main-station.png` | main | 5 | Sand box + snapped pot/stick + thermite effect |
| `source/heat-lighter.png` | heat | 0 | Lighter.glb |
| `source/ceramic-pot.png` | pot | 1 | Ceramic pot.glb |
| `source/sand-box.png` | sand | 2 | Sand inside square box.glb |
| `source/mixture.png` | mixture | 7 | Iron Oxide and Aluminium powder.glb |
| `source/magnesium-stick.png` | magnesium | 6 | Magnesium Stick.glb |

The propIds and the `name` values above must match the `IMAGE_TARGETS` config in `lab.html`.

## These are PLACEHOLDER images

`source/*.png` are auto-generated, feature-rich placeholder targets so development can proceed.
They track, but real photos/illustrations track more robustly. To use your own images, just
replace the PNGs in `source/` (keep the same filenames) and re-run the processing step below —
**no code changes are needed**.

Good targets are: feature-rich, high-contrast, asymmetric, with no large flat areas and no
repeating patterns.

## Processing targets (`image-target-cli`)

The engine consumes a processed **metadata JSON per target**, not the raw PNGs. Generate them
with the open-source 8th Wall `image-target-cli` (from
<https://github.com/8thwall/8thwall/tree/main/apps/image-target-cli>). For each source image the
CLI emits ~6 files (metadata JSON, cropped image, a 480×640 luminance image, thumbnail, etc.).

Run it once per source image and save the output so each target lands at
`processed/<name>.json` (plus its referenced image files), where `<name>` matches the source
filename / the `IMAGE_TARGETS` key in `lab.html`:

```bash
# build/run the CLI per the repo README, e.g.
image-target-cli   # prompts for image path, crop, and target name
```

`lab.html` fetches `processed/<name>.json` for each of the 6 names and passes the parsed array to
`XR8.XrController.configure({ imageTargetData })`. The source PNGs are already 480×640 (portrait),
matching the engine's luminance target size.

> NOTE: The engine runtime is loaded from CDN (`@8thwall/engine-binary` — see
> `../../vendor/8thwall/README.md`). Only the `image-target-cli` preprocessing must be run
> locally to produce the JSON files in `processed/`.

## Printing

Print each target at the physical width set in `lab.html` (`physicalWidthM`, default ~0.15 m).
Keep prints flat, well-lit, and unbent for reliable tracking.
