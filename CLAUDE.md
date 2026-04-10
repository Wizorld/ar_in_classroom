# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **AR-based educational platform** (M.Tech project) for teaching exothermic chemistry (thermite reaction). It's a pure static website — no build step, no package manager. All libraries are loaded via CDN. Deployed to GitHub Pages on push to `main`.

## Development

**Run locally:** Open HTML files directly in a browser, or use any static file server:
```bash
python -m http.server 8080
# then visit http://localhost:8080
```

**Deploy:** Push to `main` — GitHub Actions (`.github/workflows/static.yml`) auto-deploys to GitHub Pages.

## Architecture

### Entry Points

| File | Purpose |
|------|---------|
| `index.html` | Landing/menu page — links to lab experiments |
| `lab.html` | Primary AR lab experience (~1500 lines, all logic inline) |
| `thermite-staged.html` | Standalone Three.js thermite simulation (no AR required) |
| `particle-test/index.html` | Dev sandbox for shader/particle work |
| `mirror-professional.html` | A-Frame mirror/reflection demo |

### Technology Stack

- **A-Frame** — WebGL-based VR/AR scene graph
- **AR.js** — Barcode marker tracking (physical markers → digital overlays)
- **Three.js** — Underlying 3D engine; also used directly for particle shaders
- **Custom GLSL shaders** — Particle rendering (sparks, smoke, molten drips)

### Marker-to-Object Mapping (`lab.html`)

AR.js barcode markers drive the experiment. Each marker ID maps to a physical prop:
- `0` → Heat/Lighter (ignition source)
- `1` → Ceramic Pot (container)
- `2` → Sand Box (reagent container)
- `5` → Main Station (central apparatus)
- `6` → Magnesium Stick (ignition medium)
- `7` → Mixture (Fe₂O₃ + Al powder)

All markers use `smooth="true" smoothCount="8"` to reduce jitter from printed barcodes.

### Experiment State Machine (`lab.html`)

`experimentState` is the single source of truth. All UI and AR updates read from it — nothing is imperative. `getComputedStep()` maps state flags to a step index (0–5) that drives instructions, AR pulse, and quiz triggers.

**Step progression:**
- `0` No markers detected
- `1` Main station visible
- `2` Pot snapped to main station (`isPotAttached`)
- `3` Mixture snapped to pot (`isMixtureAttached`)
- `4` Magnesium stick attached, 5s fuse burning (`isStickAttached`)
- `5` Reaction complete (`thermiteCompleted`)

**Proximity-based snapping:** When two markers are within `proximityThreshold: 8.0` units, the child object animates to the parent, its original model hides, and the corresponding state flag is set. There is no click/touch input — all interaction is physical marker placement.

### Thermite Reaction Particle System (`lab.html`)

The `thermite-reaction` custom A-Frame component runs the 18-second simulation:

| Phase | Time | Description |
|-------|------|-------------|
| 1 | 0–0.5s | Flash / ignition burst (700 sparks) |
| 2 | 0.5–5s | Peak reaction — 180 sparks/frame, smoke |
| 3 | 5–18s | Cooldown — molten iron drips, fade out |

**Particle pooling:** 5000 spark + 500 smoke particles in typed `Float32Array` buffers with free-list allocation (O(1) spawn/recycle). Custom GLSL shaders handle per-particle color (phase-aware), glow, and alpha fade. Additive blending for realistic fire glow.

### Quiz System (`lab.html`)

Three distinct quiz phases gate experiment progression:

1. **Formative** — Prediction question shown before reaction starts; stores selections in `experimentState.formativePredictions`.
2. **Concept Cards** — Educational pause overlays triggered at four checkpoints (activation, setup, reaction, integration); no scoring.
3. **Summative** — 4 multi-choice questions after reaction completes, tagged by Bloom's Taxonomy level (Understand, Apply, Analyze, Evaluate). End screen shows score breakdown per cognitive level.

Quiz question definitions are in `quiz_qn.md`. The runtime objects are inline in `lab.html`.

### 3D Assets

GLB models in `Assets/Exothermic reaction/`. Loaded via A-Frame's `gltf-model` component with animation mixer support. Several alternate/variant models exist alongside the primary ones.

### Debug Panel

A hidden debug overlay (toggle via `#debugToggle`) shows live `experimentState` values — useful when testing with printed AR markers.
