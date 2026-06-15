# Implementation Plan: Image Tracking Migration

**Branch**: `image-tracking` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-image-tracking-migration/spec.md`

## Summary

Replace the project's AR.js ArUco/barcode marker tracking with the open-sourced 8th Wall
(8thwall.org) Image Targets engine, preserving the existing thermite experiment behavior.
Each of the 6 props currently bound to a barcode marker is rebound to a distinct printed
image target. The engine is self-hosted as static assets (no build step) and integrated into
the existing A-Frame scene. An initial set of 6 generated, feature-rich placeholder target
images is produced and stored in a swappable assets folder so the user can later drop in their
own images without code changes. Searching/lost states drive on-screen guidance and hide stale
content; the non-AR fallback is preserved.

## Technical Context

**Language/Version**: HTML5 + ES2017+ vanilla JavaScript (no transpilation); GLSL shaders

**Primary Dependencies**: A-Frame 1.6.0 (CDN), 8th Wall open-source XR Engine + Image Targets
module (self-hosted static assets), Three.js (bundled with A-Frame), aframe-extras (CDN). AR.js
is removed for the migrated lab.

**Storage**: Static files only — GLB models under `Assets/`, image targets under a new
`Assets/ImageTargets/` folder, processed target file(s) produced by the 8th Wall image-target
CLI committed alongside source images.

**Testing**: No automated harness. Real-device manual verification (≥1 mobile + 1 desktop
browser) per Constitution Principle III, scripted in `quickstart.md`.

**Target Platform**: Modern mobile browsers (iOS Safari, Android Chrome) with camera + WebGL;
desktop Chrome/Edge for development. Served over HTTPS (camera requirement).

**Project Type**: Static single-page web application (GitHub Pages, no build/bundler).

**Performance Goals**: ≥30 fps during tracking + reaction; correct anchoring within 3 s of an
image entering view (SC-001); stale content removed within 1 s of image loss (SC-003).

**Constraints**: Zero build step (Constitution I); must run from static hosting over HTTPS;
graceful degradation when camera/tracking unavailable (Constitution V); preserve thermite state
machine + particle budgets (5000 sparks / 500 smoke).

**Scale/Scope**: Single experiment (thermite), 6 image targets, ~1 primary page (`lab.html`).
Other experiment cards remain greyed-out as today.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First, Zero-Build | ⚠ Verify | 8th Wall engine must load as static `<script>`/asset includes. Research confirms self-hostable engine binary + modules; if a mandatory bundler is discovered, this is a gate violation to escalate. See research.md R1. |
| II. Marker & Tracking Fidelity (NON-NEGOTIABLE) | ✅ Pass | 6 image targets map 1:1 to existing props; image found/lost events drive content visibility; "lost" hides content. |
| III. Real-Device Manual Verification | ✅ Pass | quickstart.md defines mobile + desktop verification covering permission, acquire, lost, lifecycle. |
| IV. Educational Clarity & Accessibility | ✅ Pass | Existing instructions/quiz/lab-sheet retained; "How to Use" updated for image targets. |
| V. Progressive Enhancement & Degradation | ✅ Pass | Non-AR fallback (`thermite-staged.html`) + explanatory messaging on unsupported/denied camera. |

**Gate result**: PASS with one item to confirm in Phase 0 (R1 — zero-build loadability of the
engine). No unjustified violations. Complexity Tracking not required unless R1 forces a bundler.

## Project Structure

### Documentation (this feature)

```text
specs/001-image-tracking-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── tracking-events.md
├── checklists/
│   └── requirements.md  # from /speckit-specify
└── tasks.md             # /speckit-tasks output (later)
```

### Source Code (repository root)

```text
lab.html                         # Primary AR lab — AR.js markers replaced with 8th Wall image targets
index.html                       # Landing page (unchanged behavior)
thermite-staged.html             # Non-AR fallback (referenced for graceful degradation)

vendor/8thwall/                  # NEW — self-hosted 8th Wall engine + image-targets module (static)
│   ├── xr-engine.js             #   engine bundle/binary loader (exact files per research R1)
│   └── image-targets.js         #   image-targets module / A-Frame integration

Assets/
├── Exothermic reaction/*.glb    # Existing 3D models (reused as-is)
├── ImageTargets/                # NEW — swappable image targets
│   ├── source/                  #   user-replaceable source PNGs (6 props)
│   ├── processed/               #   CLI-produced target file(s) consumed by the engine
│   └── README.md                #   mapping of each image → prop + how to swap/regenerate
└── Markers/                     # OLD ArUco PNGs (retire/remove from active flow)
```

**Structure Decision**: Single static project rooted at the repo. The 8th Wall engine is
vendored under `vendor/8thwall/` and image targets under `Assets/ImageTargets/`, both committed
so the site stays buildless and deployable to GitHub Pages. `lab.html` is the only page whose
tracking layer changes; the standalone simulation and landing page are untouched except for
fallback wiring.

## Complexity Tracking

> No constitution violations require justification at plan time. If Phase 0 research (R1)
> determines the 8th Wall engine cannot be loaded without a bundler/build step, record the
> violation and the rejected simpler alternative here before proceeding.
