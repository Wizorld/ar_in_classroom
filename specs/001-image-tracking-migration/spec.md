# Feature Specification: Image Tracking Migration

**Feature Branch**: `image-tracking`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "Need to migrate current project to work based on recent open sourced 8th walls' image tracking."

## Clarifications

### Session 2026-06-15

- Q: Image target source & rollout (project currently has ArUco codes only)? → A: Generate feature-rich target images now to unblock the migration; store them in a swappable assets location so the user can replace them with their own images later without code changes.
- Q: How many distinct image targets are needed? → A: One distinct image target per active prop — replace all 6 ArUco markers (Heat/Lighter, Pot, Sand Box, Mixture, Main Station, Magnesium Stick) with 6 images for full parity.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student triggers the thermite experiment with a printed image (Priority: P1)

A student points their device camera at a printed lab image (for example, the main station
image). The system recognizes the image, anchors the digital thermite apparatus onto it, and
the student can run the full experiment lifecycle — ignition, peak reaction, cooldown — as
they do today, but without needing the old square barcode markers.

**Why this priority**: This is the core value of the migration. If recognizing a printed
image and anchoring content to it works end to end, the platform delivers its primary
teaching experience on the new tracking foundation. Everything else is secondary.

**Independent Test**: Print the main-station image, open the lab experience on a phone, point
the camera at the image, and confirm the apparatus appears anchored to it and the experiment
can be started and completed.

**Acceptance Scenarios**:

1. **Given** the lab experience is open and camera access is granted, **When** the student
   points the camera at a recognized printed image, **Then** the corresponding digital
   content appears anchored to that image within a few seconds.
2. **Given** an image is being tracked and content is displayed, **When** the student moves
   the camera so the image fills more or less of the frame, **Then** the digital content
   stays correctly registered (position, scale, orientation) to the physical image.
3. **Given** the experiment has been triggered, **When** the student follows the guided
   steps, **Then** the thermite reaction runs through all phases exactly as it does on the
   current marker-based version.

---

### User Story 2 - Graceful handling when the image is lost or not yet found (Priority: P2)

While using the experience, the student moves the camera away from the image, covers it, or
hasn't found it yet. The system clearly communicates the current state — "looking for image"
or "image lost" — instead of showing stale, frozen, or floating content.

**Why this priority**: Tracking is inherently intermittent on classroom hardware. Clear state
feedback preserves trust in the simulation and prevents confusion, but it builds on the core
recognition capability from Story 1.

**Independent Test**: With the experience open, point the camera away from any recognized
image and confirm a clear "searching/lost" message appears and no stale content is shown;
then re-acquire the image and confirm content reappears correctly.

**Acceptance Scenarios**:

1. **Given** no recognized image is in view, **When** the camera is active, **Then** the
   system shows guidance prompting the student to point at the printed image.
2. **Given** an image was being tracked, **When** it leaves the frame or is covered, **Then**
   the system removes or hides the anchored content and indicates the image was lost.
3. **Given** an image was lost, **When** it returns to view, **Then** tracking re-acquires and
   content reappears anchored correctly without requiring a page reload.

---

### User Story 3 - Teacher prepares printed image targets for a class (Priority: P3)

A teacher needs to obtain and print the image targets used to trigger each experiment prop,
and understand which printed image maps to which part of the experiment, so they can set up a
classroom session.

**Why this priority**: Enables real classroom deployment but depends on Stories 1 and 2 being
functional first. It is a setup/documentation flow rather than the live AR experience.

**Independent Test**: From the experience's instructional content, locate and download the
printable image target(s), print them, and confirm each printed image is recognized and maps
to the documented experiment element.

**Acceptance Scenarios**:

1. **Given** the instructional ("How to Use") content, **When** the teacher looks for printable
   targets, **Then** the image target(s) and their mapping to experiment elements are clearly
   available and labeled.
2. **Given** a printed image target, **When** it is presented to the camera, **Then** it is
   recognized as the experiment element described in the instructions.

---

### Edge Cases

- What happens when the camera permission is denied or unavailable? The user MUST reach a
  meaningful fallback (e.g., the standalone non-AR simulation or an explanatory message)
  rather than a blank/broken screen.
- What happens under poor lighting or a low-contrast print where the image cannot be
  recognized? The system MUST keep showing the "searching" guidance rather than falsely
  anchoring content.
- What happens when two recognizable images are in view at once? The system MUST anchor each
  to its correct experiment element without cross-mapping.
- What happens on devices or browsers that do not support the tracking runtime? The user MUST
  be informed and offered the non-AR fallback.
- What happens if the printed image is partially occluded? Content registration MUST remain
  stable or the image MUST be treated as lost — never shown floating in incorrect position.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST recognize printed image targets through the device camera and
  anchor the corresponding digital experiment content to each recognized image.
- **FR-002**: The system MUST preserve the existing thermite experiment semantics — each
  tracked target maps to its defined physical/experiment element, and the experiment
  lifecycle (ignition, peak reaction, cooldown) behaves as it does in the current version.
- **FR-003**: The system MUST keep anchored content correctly registered (position, scale,
  orientation) to its image as the camera or image moves within the frame.
- **FR-004**: The system MUST surface a clear "searching for image" state when no recognized
  image is in view, and a clear "image lost" state when a tracked image leaves view.
- **FR-005**: The system MUST NOT display stale, frozen, or floating content after an image is
  lost; anchored content MUST be hidden or removed until the image is re-acquired.
- **FR-006**: The system MUST re-acquire tracking and restore anchored content when a
  previously lost image returns to view, without requiring a page reload.
- **FR-007**: The system MUST run as a static website with no build step, loading the tracking
  runtime via CDN or committed static assets.
- **FR-008**: The system MUST degrade gracefully when camera access or tracking is unavailable,
  routing the user to a non-AR fallback or an explanatory message.
- **FR-009**: The system MUST make printable image target(s) available to users, with each
  target clearly mapped to its corresponding experiment element in the instructional content.
- **FR-009a**: The system MUST provide an initial set of generated feature-rich target images
  stored in a swappable assets location, such that the user can replace them with their own
  images without code changes.
- **FR-009b**: The system MUST provide one distinct image target per active prop, replacing all
  6 current ArUco markers (Heat/Lighter, Pot, Sand Box, Mixture, Main Station, Magnesium Stick)
  to preserve full per-prop interaction parity.
- **FR-010**: The system MUST request camera permission through a clear flow and handle denial
  without breaking the rest of the experience.
- **FR-011**: The migration MUST retain existing supporting experiences (quiz gating, lab-sheet
  access, proximity/progression feedback) in working order.

### Key Entities *(include if feature involves data)*

- **Image Target**: A printed image the camera recognizes. Has an identity and a mapping to a
  specific experiment element; replaces the previous square barcode marker as the trigger.
- **Experiment Element**: A digital prop/overlay (e.g., main station, heat source, mixture,
  container) anchored to a specific image target.
- **Tracking State**: The current status of recognition for the active experience —
  searching, tracked, or lost — that drives on-screen guidance and content visibility.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A student pointing the camera at a recognized printed image sees correctly
  anchored content within 3 seconds under normal classroom lighting.
- **SC-002**: In at least 9 of 10 acquisition attempts under normal lighting, the correct
  experiment element is anchored to the correct image with no cross-mapping.
- **SC-003**: When a tracked image leaves view, stale/floating content disappears within 1
  second and the "image lost" state is shown.
- **SC-004**: 100% of sessions where camera or tracking is unavailable still reach a usable
  fallback rather than a blank or broken screen.
- **SC-005**: The full thermite experiment lifecycle completes successfully on the new tracking
  foundation with the same outcome as the current marker-based version.
- **SC-006**: A teacher can locate, download, and print the image target(s) and confirm
  recognition without developer assistance.

## Assumptions

- The target audience uses common classroom mobile devices and modern mobile browsers with
  camera support; behavior is also verified on at least one desktop browser.
- The 8th Wall open-sourced image-tracking runtime can be loaded into the existing static
  A-Frame/Three.js scene without introducing a build step.
- The current experiment scope (thermite reaction) is the migration target; other experiment
  cards remain greyed-out/unimplemented as today.
- The project currently has only ArUco codes, so an initial set of 6 feature-rich target
  images will be generated to unblock development; they are expected to be high-contrast and
  asymmetric for reliable tracking and printable at a reasonable size for classroom use.
- Generated targets are placeholders the user can swap for their own images later via the
  swappable assets location, without code changes.
- Existing 3D assets, shaders, quiz content, and lab-sheet downloads are reused as-is; only the
  tracking/trigger mechanism changes.
- The square barcode markers may be retired once image tracking reaches parity, but the spec
  does not require simultaneous support of both schemes.
