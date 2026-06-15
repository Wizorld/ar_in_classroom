# Phase 1 Data Model: Image Tracking Migration

This is a client-side static app; "data" here means in-memory runtime structures and the static
target asset definitions, not a database.

## Entity: ImageTarget

Represents one printed image the engine recognizes.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `name` | string | Stable identifier (e.g., `main-station`) | Unique; matches a key in the prop map (R3) |
| `sourcePath` | string | Path to swappable source PNG | Under `Assets/ImageTargets/source/` |
| `processedRef` | string | Reference into the CLI-produced target file | Present in `Assets/ImageTargets/processed/` |
| `propId` | string | Experiment element it triggers | One of: main, heat, pot, sand, mixture, magnesium |
| `physicalWidthM` | number | Real printed width in meters (for scale) | > 0 |

**Relationships**: 1 ImageTarget → 1 ExperimentElement (`propId`).

## Entity: ExperimentElement

The digital prop/overlay anchored to an image target (unchanged from current props).

| Field | Type | Description |
|-------|------|-------------|
| `propId` | string | main / heat / pot / sand / mixture / magnesium |
| `modelPath` | string | GLB under `Assets/Exothermic reaction/` (reused as-is) |
| `anchorTarget` | string | `ImageTarget.name` it anchors to |

**Mapping (R3)**: main-station→main(5), heat-lighter→heat(0), ceramic-pot→pot(1),
sand-box→sand(2), mixture→mixture(7), magnesium-stick→magnesium(6).

## Entity: TrackingState (runtime)

Drives on-screen guidance and content visibility.

| Field | Type | Description |
|-------|------|-------------|
| `status` | enum | `searching` \| `tracked` \| `lost` (per target) |
| `activeMarkers` | Set<string> | Reused from existing `experimentState`; holds propIds currently tracked |
| `lastSeenAt` | number | Timestamp of last successful track (for lost-debounce) |

### State Transitions (per target)

```text
searching --image found--> tracked
tracked   --image lost-->  lost      (content hidden/removed within 1s — FR-005, SC-003)
lost      --image found--> tracked   (re-acquire without reload — FR-006)
```

**Invariants**:
- When `status != tracked`, the element's anchored content MUST NOT render (no stale/floating).
- `activeMarkers` membership exactly reflects the set of currently `tracked` propIds; the
  experiment state machine, proximity feedback, and quiz gating read from this set unchanged.
- Two targets in view simultaneously each map only to their own element (no cross-mapping —
  edge case + SC-002).
