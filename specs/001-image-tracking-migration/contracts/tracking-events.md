# Contract: Tracking Event Adapter (UI ↔ Tracking Engine)

This app exposes no network API. Its meaningful internal contract is the **tracking adapter**
that translates 8th Wall image-target engine events into the existing experiment state, so the
experiment lifecycle, proximity feedback, and quiz gating remain decoupled from the tracking
backend.

## Adapter responsibilities

For each configured `ImageTarget` (R3 mapping), the adapter MUST:

1. Subscribe to the engine's image found / image updated / image lost events for that target.
2. On **found**: show the anchored `ExperimentElement`, `activeMarkers.add(propId)`, set status
   `tracked`. (Equivalent to old `markerFound`.)
3. On **updated**: keep the element registered (position/scale/orientation) to the image.
4. On **lost**: hide/remove the element, `activeMarkers.delete(propId)`, set status `lost`,
   within 1 second (FR-005, SC-003). (Equivalent to old `markerLost`.)
5. Preserve existing side effects currently fired in `markerFound`/`markerLost` handlers
   (e.g., main-station found triggering experiment readiness, proximity calculations).

## Event name mapping (AR.js → 8th Wall)

| Existing (AR.js) | New (8th Wall image targets) | Adapter output |
|------------------|------------------------------|----------------|
| `markerFound` | image found / `xrimagefound` (confirm exact name in R1) | `activeMarkers.add(propId)`, show, status=tracked |
| `markerLost` | image lost / `xrimagelost` | `activeMarkers.delete(propId)`, hide, status=lost |
| (per-frame transform) | image updated / `xrimageupdated` | update anchor transform |

> Exact engine event identifiers MUST be confirmed against the 8th Wall image-target example in
> Phase R1 and recorded here before implementation.

## Configuration contract (target declaration)

- The set of recognized targets is declared from `Assets/ImageTargets/processed/` (CLI output).
- Adding/replacing a target MUST require only: drop a new source PNG, re-run the image-target
  CLI, and add/adjust one entry in the prop map — **no other code changes** (FR-009a).

## Invariants (testable)

- INV-1: No anchored content renders unless its target status is `tracked`.
- INV-2: `activeMarkers` ⇔ exactly the set of `tracked` propIds at any instant.
- INV-3: Re-acquisition after loss restores content without page reload (FR-006).
- INV-4: Camera/engine init failure routes to fallback, never a blank scene (FR-008).
