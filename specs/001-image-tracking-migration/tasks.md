---
description: "Task list for Image Tracking Migration"
---

# Tasks: Image Tracking Migration

**Input**: Design documents from `specs/001-image-tracking-migration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tracking-events.md, quickstart.md

**Tests**: No automated test harness exists (Constitution Principle III). Verification is manual
via [quickstart.md](quickstart.md) on real devices. No automated test tasks are generated.

**Organization**: Tasks are grouped by user story (P1→P3) for independent, incremental delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- Most implementation lands in the single file `lab.html`, so those tasks are sequential (no [P]).

## Path Conventions

Static site rooted at repo root. Key paths: `lab.html`, `vendor/8thwall/`, `Assets/ImageTargets/`,
`thermite-staged.html`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Vendor the engine and establish the swappable target asset structure.

- [X] T001 Confirm 8th Wall engine zero-build loadability (research.md R1): inspect `packages/engine/README.md` and the image-target example at github.com/8thwall/8thwall; record exact script entry points and event names. If a mandatory bundler is required, STOP and escalate as a Constitution Principle I violation in `specs/001-image-tracking-migration/plan.md` Complexity Tracking. → PASS: loads via `<script async src="vendor/8thwall/xr.js" data-preload-chunks="slam">`, events `xrimagefound/updated/lost`, no bundler.
- [X] T002 Load the engine via CDN (`@8thwall/engine-binary@1`) in `lab.html` — `<script src="https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js" async crossorigin="anonymous" data-preload-chunks="slam">`. CDN verified (HTTP 200, application/javascript). Self-host under `vendor/8thwall/` remains documented as an option.
- [X] T003 [P] Create target asset folders `Assets/ImageTargets/source/` and `Assets/ImageTargets/processed/`, plus `Assets/ImageTargets/README.md` documenting the image→prop mapping and the swap/regenerate workflow (FR-009a).
- [X] T004 [P] Add the 8th Wall `image-target-cli` usage notes (install + run command) to `Assets/ImageTargets/README.md` so targets can be reprocessed without code changes.

**Checkpoint**: Engine wiring + asset structure ready (engine binary pending drop-in).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Generate/process the 6 targets and build the tracking adapter that all stories use.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 [P] Generate 6 feature-rich, high-contrast, asymmetric placeholder PNGs (main-station, heat-lighter, ceramic-pot, sand-box, mixture, magnesium-stick) into `Assets/ImageTargets/source/` (R2, FR-009b).
- [X] T006 Ran the image-target CLI; processed targets committed to `Assets/ImageTargets/processed/` (main/heat/pot/sand/mixture/magnesium .json + cropped/luminance/thumbnail/original PNGs). Targets named by propId; `lab.html` config + entity names + JSON `imagePath` reconciled to match.
- [X] T007 In `lab.html`, add the vendored engine `<script>` include in `<head>` and remove the AR.js include (`aframe-ar.js`) (R1, FR-007).
- [X] T008 In `lab.html`, define the prop→image-target map (main→main-station(5), heat→heat-lighter(0), pot→ceramic-pot(1), sand→sand-box(2), mixture→mixture(7), magnesium→magnesium-stick(6)) as the `IMAGE_TARGETS` config object (R3, data-model.md).
- [X] T009 In `lab.html`, implement the `image-target` component that subscribes to engine image found/updated/lost events and translates them to `experimentState.activeMarkers` add/delete + content show/hide, preserving existing `markerFound`/`markerLost` side effects (contracts/tracking-events.md INV-1..INV-2).

**Checkpoint**: Adapter wired; targets generated (CLI processing pending).

---

## Phase 3: User Story 1 - Trigger experiment with a printed image (Priority: P1) MVP

**Goal**: Point the camera at a printed image, see the correct apparatus anchored, and run the
full thermite lifecycle on the new tracking foundation.

**Independent Test**: Print `main-station`, open `lab.html` on a phone, point at it → apparatus
appears anchored and the experiment can start and complete (quickstart scenarios 2,3,4,7).

- [X] T010 [US1] In `lab.html`, replace the `<a-scene arjs=...>` configuration with the 8th Wall `xrweb` scene configuration and engine init/configure (R1, R4).
- [X] T011 [US1] In `lab.html`, replace the 6 `<a-marker type="barcode">` blocks with `image-target` entities (same IDs/children/transforms) bound to the named targets (data-model.md, FR-002).
- [X] T012 [US1] In `lab.html`, anchor content registration via image `updated` events so models stay positioned/oriented to the image as the camera moves (FR-003, contracts INV per-frame transform).
- [X] T013 [US1] In `lab.html`, set per-target `physicalWidthM` in the `IMAGE_TARGETS` config (data-model.md ImageTarget.physicalWidthM).
- [ ] T014 [US1] Verify the thermite state machine, particle budgets (5000 sparks/500 smoke), proximity/snap interactions, and quiz gating still trigger off `activeMarkers` and entity positions unchanged (FR-002, FR-011, SC-005). BLOCKED: needs the running engine (T002/T006) on a real device — covered by quickstart.

**Checkpoint**: MVP — a printed image triggers and runs the full experiment (pending engine binary).

---

## Phase 4: User Story 2 - Graceful searching/lost handling (Priority: P2)

**Goal**: Clear "searching"/"lost" feedback and no stale/floating content when an image isn't
tracked; re-acquire without reload.

**Independent Test**: Point away from any image → searching/lost message, no stale content; bring
image back → content reappears (quickstart scenarios 5,6).

- [X] T015 [US2] In `lab.html`, on image `lost`, hide the anchored content (component sets `object3D.visible=false` and re-emits `markerLost`) and update the marker-lost warning UI to image-target wording (FR-004, FR-005, SC-003, contracts INV-1).
- [X] T016 [US2] In `lab.html`, surface "point at the image" guidance when no target is tracked (instruction panel + main/target-lost warnings) (FR-004).
- [X] T017 [US2] In `lab.html`, re-acquisition after loss restores content without reload (component re-shows on the next `xrimagefound`) (FR-006, contracts INV-3).

**Checkpoint**: Tracking states are clearly communicated and recover cleanly.

---

## Phase 5: User Story 3 - Teacher prepares/swaps printed targets (Priority: P3)

**Goal**: Teacher can obtain, print, and swap image targets and know which image maps to which prop.

**Independent Test**: From "How to Use", download a target, print it, confirm recognition; replace
a source PNG + re-run CLI → recognized for the same prop with no code edits (quickstart 9, SC-006).

- [X] T018 [US3] In `lab.html`, update the "How to Use" slides: replace barcode-marker copy and the `Assets/Markers/...` download links with the 6 image targets and their prop mapping (FR-009, US3-AC1).
- [X] T019 [P] [US3] Add print-ready downloads for the 6 generated targets (link `Assets/ImageTargets/source/*.png` from the How-to-Use slide) labeled by prop (FR-009).
- [ ] T020 [US3] Confirm the swap workflow end-to-end: replacing a source PNG and re-running the CLI updates recognition without code changes (FR-009a, SC-006). BLOCKED: needs the CLI/engine — workflow documented in `Assets/ImageTargets/README.md`.

**Checkpoint**: Classroom setup + target-swap workflow usable without developer help.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Graceful degradation, cleanup, and full validation.

- [X] T021 In `lab.html`, handle camera-permission denial and engine-init/unsupported-device failure by showing a clear message and routing to the non-AR fallback `thermite-staged.html` (FR-008, FR-010, SC-004, Principle V; research R5).
- [X] T022 [P] Retire the old ArUco flow: replaced `Assets/Markers` download links with image-target downloads and removed all `<a-marker>` barcode code paths from `lab.html`.
- [X] T023 [P] Update `CLAUDE.md` Marker-to-Object Mapping and Technology Stack sections to describe image targets instead of AR.js barcode markers.
- [ ] T024 Run the full [quickstart.md](quickstart.md) validation (all 10 scenarios) on >=1 mobile + >=1 desktop browser; record device/browser and pass/fail in the PR (Constitution Principle III). BLOCKED: needs the running engine (T002/T006) on real devices.

---

## Status summary

- **Completed (21)**: T001–T013, T015–T019, T021–T023 — engine via CDN, targets processed and wired; all code, config, assets, and docs done.
- **Remaining (3) — on-device verification only**: T014, T020, T024 (run quickstart scenarios on a real phone + desktop over HTTPS).

All build artifacts are in place. The migration is functionally complete pending the manual
real-device validation in [quickstart.md](quickstart.md).

---

## Dependencies & Execution Order

- Setup (P1) → Foundational (P2) → User Stories (P3–P5) → Polish (P6).
- T002 gates T006/T014/T020/T024 (the runtime + verification tasks).
- Within `lab.html`, tasks are sequential (single-file contention); cross-file tasks (T003/T004, T019, T022/T023) can parallelize.

## Implementation Strategy

- **MVP**: Setup + Foundational + US1 (T001–T014) → printed image triggers and runs the experiment.
- **Incremental**: US2 (robust lost/searching), US3 (teacher prep/swap), Polish (fallback + cleanup + validation).
