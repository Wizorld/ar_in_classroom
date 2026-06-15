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
| `lab.html` | Primary AR lab experience (main codebase, ~1300 lines) |
| `thermite-staged.html` | Standalone Three.js thermite simulation (no AR required) |
| `particle-test/index.html` | Dev sandbox for shader/particle work |
| `mirror-professional.html` | A-Frame mirror/reflection demo |

### Technology Stack

- **A-Frame** — WebGL-based VR/AR scene graph
- **8th Wall XR Engine (open source)** — Image-target tracking (printed images → digital overlays). Loaded via CDN: `<script src="https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js" async crossorigin="anonymous" data-preload-chunks="slam">`. Can be self-hosted under `vendor/8thwall/` instead (see that folder's README). Replaced AR.js as of the image-tracking migration.
- **Three.js** — Underlying 3D engine; also used directly for particle shaders
- **Custom GLSL shaders** — Particle rendering (sparks, smoke, molten drips)

### Image-Target-to-Object Mapping (`lab.html`)

Printed image targets drive the experiment. The `IMAGE_TARGETS` config and the custom
`image-target` A-Frame component map each target to a prop and re-dispatch legacy
`markerFound`/`markerLost` events so the experiment state machine is unchanged. Source images:
`Assets/ImageTargets/source/` (swappable — see that folder's README); processed engine targets:
`Assets/ImageTargets/processed/`.

| Image target | propId | Prop |
|--------------|--------|------|
| `heat-lighter` | heat | Heat/Lighter (ignition source) |
| `ceramic-pot` | pot | Ceramic Pot (container) |
| `sand-box` | sand | Sand Box (reagent container) |
| `mixture` | mixture | Mixture (Fe₂O₃ + Al powder) |
| `main-station` | main | Main Station (central apparatus) |
| `magnesium-stick` | magnesium | Magnesium Stick (ignition medium) |

### Thermite Reaction State Machine (`lab.html`)

The `experimentState` object tracks the full experiment lifecycle. The `thermite-reaction` A-Frame component runs the particle simulation with three phases:

| Phase | Time | Description |
|-------|------|-------------|
| 1 | 0–0.5s | Flash / ignition burst |
| 2 | 0.5–5s | Peak reaction — max sparks and flames |
| 3 | 5–18s | Cooldown — molten iron drips |

**Particle budgets:** 5000 sparks max, 500 smoke max. Physics: gravity + drag, ground collision.

### Quiz System

Right-side slide-in panel gating experiment progression. Questions defined in `quiz_qn.md`. Includes correct/incorrect feedback display.

### 3D Assets

GLB models in `Assets/Exothermic reaction/`. Loaded via A-Frame's `gltf-model` component with animation mixer support.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
`specs/001-image-tracking-migration/plan.md`
<!-- SPECKIT END -->
