# Quickstart & Validation: Image Tracking Migration

This guide validates the migration end-to-end. Per Constitution Principle III, all AR-affecting
checks MUST be run on ≥1 real mobile device and ≥1 desktop browser, and results recorded in the
PR/commit.

## Prerequisites

- Repo checked out; no build tools required (static site).
- 8th Wall engine + image-targets vendored under `vendor/8thwall/` (see [research.md](research.md) R1).
- 6 image targets present: source PNGs in `Assets/ImageTargets/source/`, processed file(s) in
  `Assets/ImageTargets/processed/` (see [data-model.md](data-model.md), R2/R3).
- The 6 targets printed at the documented physical size.
- HTTPS context for camera access (GitHub Pages, or local TLS).

## Run locally

```bash
python -m http.server 8080
# visit https-tunneled URL on a phone, or http://localhost:8080 on desktop (camera needs HTTPS on mobile)
```

Open `lab.html`.

## Validation scenarios

Reference: [contracts/tracking-events.md](contracts/tracking-events.md), spec Success Criteria.

1. **Camera permission flow** (FR-010): Open `lab.html` → grant camera → live feed appears.
   - Deny camera → clear message + non-AR fallback offered (FR-008, SC-004). ✅/❌
2. **Acquire main station** (SC-001, US1): Point at the printed `main-station` image → apparatus
   appears anchored within 3 s. ✅/❌
3. **Registration stability** (FR-003, US1-AC2): Move camera closer/farther/tilt → content stays
   registered to the image. ✅/❌
4. **Correct mapping, no cross-map** (SC-002): Present each of the 6 images → the correct prop
   appears for each; two in view at once map independently. ✅/❌
5. **Lost state** (FR-004/005, SC-003, US2): Cover/move away from a tracked image → content
   disappears within 1 s and a "searching/lost" message shows; no stale/floating content. ✅/❌
6. **Re-acquire without reload** (FR-006): Bring the image back → content reappears anchored. ✅/❌
7. **Full lifecycle parity** (SC-005, US1-AC3): Run ignition → peak → cooldown → matches the
   current marker version (particles, drips, phases). ✅/❌
8. **Supporting flows** (FR-011): Quiz gating, lab-sheet download, proximity feedback still work.
   ✅/❌
9. **Teacher target swap** (FR-009a, US3, SC-006): Replace a source PNG, re-run the image-target
   CLI, reload → new image recognized for the same prop, no code edits. ✅/❌
10. **Unsupported device** (Principle V): On a browser without engine support → message + fallback.
    ✅/❌

## Record results

For each scenario log: device/browser, pass/fail, notes. Attach to the PR. A scenario is "done"
only when verified on both a mobile and a desktop browser (where applicable).
