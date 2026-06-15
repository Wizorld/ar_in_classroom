<!--
SYNC IMPACT REPORT
Version change: (uninitialized template) → 1.0.0
Bump rationale: Initial ratification of the project constitution (MAJOR baseline).
Modified principles: N/A (first definition)
Added sections:
  - Core Principles I–V
  - Technology & Platform Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (generic Constitution Check; compatible)
  - .specify/templates/spec-template.md ✅ (no mandatory-section conflicts)
  - .specify/templates/tasks-template.md ✅ (manual-verification tasks accommodated)
Follow-up TODOs: None
-->

# AR in Classroom Constitution

## Core Principles

### I. Static-First, Zero-Build Delivery
The platform MUST remain a pure static website: no build step, no bundler, and no
package manager required to run or deploy. All third-party libraries (A-Frame, AR.js,
Three.js, and the 8th Wall image-tracking runtime) MUST be loaded via CDN or committed
static assets. Any feature that would require a compilation or transpilation step MUST be
rejected or redesigned. Rationale: zero-build keeps the project deployable to GitHub Pages
on push, lowers the barrier for educators and contributors, and avoids toolchain drift.

### II. Marker & Tracking Fidelity (NON-NEGOTIABLE)
AR overlays MUST stay accurately registered to their physical targets. The migration to
8th Wall's open-sourced image tracking MUST preserve the existing experiment semantics:
each tracked target maps to a well-defined physical prop, and digital content MUST anchor
to the correct target. When a target is lost, the system MUST surface a clear "marker lost"
state rather than render stale or floating content. Tracking changes MUST be validated
against real printed targets before merge. Rationale: incorrect registration breaks the
core educational illusion and erodes trust in the simulation.

### III. Real-Device Manual Verification
Because there is no automated test harness, every AR-affecting change MUST be manually
verified on at least one real mobile device and one desktop browser before merge, covering
camera permission flow, target acquisition, target loss, and the full experiment lifecycle.
The verification steps and observed results MUST be recorded in the PR or commit. Rationale:
AR behavior depends on camera hardware and runtime quirks that cannot be confirmed by
reading code alone.

### IV. Educational Clarity & Accessibility
Features exist to teach. Every user-facing change MUST keep the learning flow legible:
clear instructions, readable on-screen guidance, and graceful messaging when AR is
unavailable. Quiz gating, lab-sheet access, and experiment progression MUST remain usable
on common classroom hardware. Rationale: the audience is students and teachers, not
developers; clarity outranks visual sophistication.

### V. Progressive Enhancement & Graceful Degradation
The site MUST degrade gracefully when AR or camera access is unavailable: users MUST still
reach a meaningful fallback (e.g., the standalone Three.js simulation or an explanatory
message) rather than a blank or broken screen. New capabilities MUST be layered on top of a
working baseline, never made a hard prerequisite for opening the site. Rationale: classroom
devices vary widely in capability and permissions.

## Technology & Platform Constraints

- Approved stack: A-Frame, AR.js, Three.js, custom GLSL shaders, and the 8th Wall
  open-sourced image-tracking runtime. Introducing a new core dependency requires
  justification in the plan's Complexity Tracking.
- Deployment target is GitHub Pages via `.github/workflows/static.yml` on push to `main`.
  Changes MUST remain compatible with static hosting (no server-side code, no secrets at
  runtime).
- 3D assets live under `Assets/` and are loaded via `gltf-model`. Asset additions MUST be
  size-conscious to protect load times on classroom networks.
- Image-tracking target images and their mapping to physical props MUST be documented and
  committed alongside the code that consumes them.

## Development Workflow & Quality Gates

- Work proceeds through the Spec Kit flow: specify → plan → tasks → implement, with the
  constitution checked at planning time.
- Before merge to `main`, every change MUST: (a) load and run as a static site locally,
  (b) pass the real-device manual verification in Principle III when AR is affected, and
  (c) preserve graceful degradation per Principle V.
- The thermite reaction state machine, particle budgets (5000 sparks / 500 smoke), and
  experiment phases are behavioral contracts; changes to them MUST be called out explicitly
  in the spec and re-verified.

## Governance

This constitution supersedes ad-hoc practices for the AR in Classroom project. Amendments
MUST be proposed via a change to this file, include a Sync Impact Report, and follow
semantic versioning: MAJOR for principle removals or incompatible redefinitions, MINOR for
new principles or materially expanded guidance, PATCH for clarifications. Every plan and PR
MUST verify compliance with these principles; deviations MUST be justified in the plan's
Complexity Tracking or rejected. Use `CLAUDE.md` for runtime and agent development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15
