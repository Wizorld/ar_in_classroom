# Phase 0 Research: Image Tracking Migration

## R1 — Loading the 8th Wall engine into a zero-build static site

**Decision**: Self-host the open-sourced 8th Wall XR Engine + Image Targets module under
`vendor/8thwall/` and include them with plain `<script>` tags in `lab.html`, following the
A-Frame integration the engine ships. No bundler is introduced.

**Rationale**: As of the Feb 2026 open-source transition, the XR Engine (including the
distributed engine binary with SLAM) and the Image Targets module are published under MIT
(binary under a binary-only license) at 8thwall.org / github.com/8thwall/8thwall, and are
explicitly documented to work with A-Frame, Three.js, Babylon.js, and PlayCanvas. The legacy
8th Wall model loaded via a single script include, so a static `<script>`-based self-host is the
expected integration shape. Hosted CDN/login services are offline, so files MUST be vendored
into the repo rather than referenced from 8thwall.com.

**Alternatives considered**:
- Keep AR.js NFT (natural feature tracking) instead of 8th Wall — rejected: the user explicitly
  wants the 8th Wall image tracking foundation; AR.js NFT tracking quality is weaker.
- Use the 8th Wall hosted cloud editor — rejected: hosted services are shut down.

**Open confirmation (implementation-time)**: Exact filenames/entry points and whether the engine
binary requires a specific loader script must be confirmed against `packages/engine/README.md`
and the `examples/` image-target sample in the repo. If a mandatory build/bundler step is
discovered, escalate as a Constitution Principle I gate violation and record in plan.md
Complexity Tracking before continuing.

## R2 — Generating and processing image targets

**Decision**: Generate 6 feature-rich, high-contrast, asymmetric placeholder PNGs (one per prop)
into `Assets/ImageTargets/source/`, then run the 8th Wall `image-target-cli` to produce the
processed target file(s) into `Assets/ImageTargets/processed/`. Commit both. Document the
image→prop mapping and regeneration steps in `Assets/ImageTargets/README.md`.

**Rationale**: The open-source release includes an `image-target-cli` ("Process image targets for
use in the engine") and an Image Target Processor utility. Pre-processing offline keeps the
runtime buildless. Generated images are placeholders the user can swap (FR-009a) by replacing the
source PNGs and re-running the CLI.

**Alternatives considered**:
- Runtime image processing in-browser — rejected: heavier, slower first paint, and not the
  documented workflow.
- Single combined target — rejected: clarification chose one target per prop (FR-009b).

## R3 — Mapping props to image targets (replacing barcode values)

**Decision**: Map each existing barcode value to a named image target, preserving the prop
semantics in `lab.html`:

| Prop | Old barcode value | New image target name |
|------|-------------------|------------------------|
| Main Station | 5 | `main-station` |
| Heat / Lighter | 0 | `heat-lighter` |
| Ceramic Pot | 1 | `ceramic-pot` |
| Sand Box | 2 | `sand-box` |
| Mixture (Fe₂O₃ + Al) | 7 | `mixture` |
| Magnesium Stick | 6 | `magnesium-stick` |

**Rationale**: Keeps the experiment state machine and proximity/snap interactions unchanged; only
the trigger source changes. (Note: code uses barcode `7` for mixture though CLAUDE.md lists `4` —
the live `lab.html` value `7` is authoritative for the mapping.)

**Alternatives considered**: Renumbering/renaming props — rejected, unnecessary churn and risks
breaking the state machine.

## R4 — Tracking events: AR.js → 8th Wall equivalents

**Decision**: Replace `<a-marker>` entities and their `markerFound`/`markerLost` listeners with
the engine's image-target entities and image found/lost (update/show/hide) events, routed through
a thin adapter so the existing `experimentState.activeMarkers` add/delete logic is reused.

**Rationale**: Minimizes blast radius — the experiment lifecycle, particle system, quiz gating,
and proximity feedback all key off `activeMarkers` and entity positions, which the adapter keeps
intact. Lost events MUST hide/remove anchored content within 1 s (SC-003, FR-005).

**Alternatives considered**: Rewriting the state machine around new events — rejected as high risk
for no functional gain.

## R5 — Graceful degradation & permissions

**Decision**: Detect missing camera permission / unsupported engine init and route the user to a
clear message plus the non-AR fallback (`thermite-staged.html`). Reuse existing
permission/marker-lost UI patterns already present in `lab.html`.

**Rationale**: Satisfies Constitution Principle V and FR-008/FR-010; classroom devices vary.

**Alternatives considered**: Hard failure / blank screen — rejected (violates Principle V).
