# Expert Evaluator Feedback — AR Chemistry Lab
## Usability Evaluation Report

**Application:** AR-Based Interactive Lab for Thermite Reaction (Exothermic Chemistry)
**Evaluation Method:** Heuristic Walkthrough
**Date:** April 2026
**Number of Evaluators:** 2

---

## Evaluator 1

| Field | Details |
|-------|---------|
| **Name** | [Evaluator 1 Name] |
| **Designation** | Assistant Professor, Department of Chemistry |
| **Experience** | 8 years (undergraduate chemistry instruction) |
| **Evaluation Focus** | Content accuracy, pedagogical design, student learning flow |

### Session Observations

I accessed the application on a tablet device and walked through the full experiment as a student would. The landing page clearly presents the three experiment options with associated learning objectives — presenting Bloom's-level tags upfront is a thoughtful design choice that I rarely see in digital labs.

The experiment flow (station setup → reagent assembly → reaction → quiz) mirrors a standard wet-lab sequence, which reduces the cognitive overhead of learning a new interface. The concept cards appearing between steps are particularly effective; they contextualise each action before the student performs it rather than after, which aligns with constructivist principles.

The summative quiz at the end is well-constructed. The seven questions span recall, comprehension, and application levels, and the per-question Bloom's breakdown on the score screen is excellent — it communicates not just a score but *where* the student's understanding gaps are.

My primary concern is the **formative prediction activity**. The student is asked to predict what will happen before the reaction, but after they submit their prediction and observe the reaction, the app moves directly to the summative quiz without ever surfacing the prediction again. The predict-observe-explain (POE) loop is broken at the explain stage. This is the most significant pedagogical shortcoming in the current version, because the comparison between prediction and observation is where the deepest learning occurs in inquiry-based instruction.

I also noted that the loading screen displays "Calibrating AR sensors," which is technically inaccurate and could cause students to pause unnecessarily, expecting some hardware interaction. A neutral phrase like "Loading laboratory..." would avoid this confusion.

### Issue Log

| # | Issue Observed | Location | Severity | Recommendation |
|---|---------------|----------|----------|----------------|
| 1 | Formative prediction result is never revisited after the reaction — breaks the predict-observe-explain loop | Prediction overlay → Post-reaction flow | **High** | Display student's original prediction alongside observed outcome before the summative quiz; prompt a brief written explanation |
| 2 | No pre-session instructions inform students to print markers before arriving | Onboarding / instructions slide | **Medium** | Add a "Before You Begin" screen or email/LMS notice listing materials needed |
| 3 | "Calibrating AR sensors" loading text is technically inaccurate | Loading screen | **Low** | Replace with neutral text: "Loading laboratory environment..." |
| 4 | No proximity approach feedback — students get no visual cue that a marker is getting close to the detection threshold | Marker placement steps | **Medium** | Show a distance indicator or colour change as the marker approaches the snap range |
| 5 | Restart button wipes all progress with no confirmation dialog | Top navigation bar | **Low** | Add a confirmation prompt: "Restart experiment? All progress will be lost." |

### Ratings

| Dimension | Rating (1–5) | Comments |
|-----------|-------------|---------|
| Scientific accuracy of content | 4 | Reaction chemistry is correctly depicted; energy release and products are accurate |
| Alignment of quiz to learning objectives | 5 | Strong alignment across Bloom's levels |
| Effectiveness of pedagogical scaffolding | 3 | Concept cards and hints are well done; POE loop is incomplete |
| Clarity of experiment instructions | 3 | In-app instructions are clear but pre-session prep is not communicated |
| Overall learning experience | 4 | Visually engaging and structurally sound; POE fix would make it excellent |

### Strengths

- Bloom's-tagged learning objectives are clearly stated at entry — sets appropriate expectations.
- Concept cards between each step scaffold understanding without interrupting flow.
- Summative quiz design and per-Bloom's score breakdown are genuinely impressive.
- The 30-second hint system supports independent learning without hand-holding.

### Recommendations

1. **Priority fix:** Close the POE loop by showing the student's original prediction alongside the observed reaction outcome before the quiz.
2. Add a pre-session material checklist accessible from the landing page so students arrive prepared.
3. Replace the loading text with something technically neutral.

---

## Evaluator 2

| Field | Details |
|-------|---------|
| **Name** | [Evaluator 2 Name] |
| **Designation** | Senior Lecturer, Department of Educational Technology |
| **Experience** | 11 years (EdTech integration, classroom deployment of digital tools) |
| **Evaluation Focus** | AR interaction design, classroom feasibility, teacher workflow |

### Session Observations

I evaluated the application from a classroom deployment perspective — specifically, whether a teacher could realistically set up and run this with 20–30 students in a 50-minute session.

The core AR experience is impressive. The particle simulation for the thermite reaction is the most visually faithful digital representation of an exothermic reaction I have seen in an educational tool at this level. Students who have never witnessed the reaction in person will come away with a strong mental model of its intensity and visual character.

However, deploying this at scale surfaces several gaps. Before class, a teacher has no guidance within the app on what to prepare — no marker download link, no recommended print size, no session duration estimate. I had to discover independently that six unique marker cards are needed. In a real classroom context, this gap alone could cause a session to fail if the teacher is not already familiar with the tool.

During the session, there is no teacher-facing view. Every student's progress is siloed to their own device. Quiz scores are saved to the device's local storage — inaccessible to the teacher without physically handling each device and opening developer tools. For a tool whose stated purpose includes formative assessment, this is a critical gap.

The "DEV" button in the AR interface is unlabelled and accessible to students. In a classroom, curious students will inevitably tap it. The debug overlay it reveals (marker distances, detection states) is useful for troubleshooting, but it should not be accessible without some form of access control.

I also noted that the two unimplemented experiments (Plant Cell, Acid-Base Reaction) present with full learning outcome cards and a "Continue to Experiment" button. A student who taps either one during a live session is taken to a non-functional lab with no explanation. This is a live classroom disruption risk.

### Issue Log

| # | Issue Observed | Location | Severity | Recommendation |
|---|---------------|----------|----------|----------------|
| 1 | No teacher dashboard — quiz scores are stored only on the student's device and cannot be accessed remotely | Post-quiz / data layer | **High** | Export scores via a shareable link, QR code, or Google Sheets integration; at minimum, provide a "Copy results" button |
| 2 | Unimplemented experiment cards (Plant Cell, Acid-Base) are fully navigable with no "coming soon" indicator | Landing page | **Medium** | Disable navigation on unimplemented cards; add a "Coming Soon" badge |
| 3 | No teacher guide or pre-class checklist inside the app | Landing page / onboarding | **Medium** | Add a teacher-facing "How to Run This Session" page with marker download, print instructions, and time estimate |
| 4 | DEV debug panel accessible to students with no access control | AR lab — top bar | **Low** | Rename button to something non-descriptive or require a long-press / PIN to open |
| 5 | No demo mode — teacher cannot show the reaction on a projector without physical markers | AR lab | **Medium** | Add a "Demo / Kiosk mode" that plays the reaction animation without marker tracking |

### Ratings

| Dimension | Rating (1–5) | Comments |
|-----------|-------------|---------|
| Ease of classroom deployment | 2 | Missing teacher guide, marker instructions, and class management features |
| Quality of AR interaction design | 4 | Marker tracking is responsive; proximity snapping feels natural once understood |
| Visual fidelity of the simulation | 5 | Particle effects and 3D models are highly realistic for a browser-based tool |
| Teacher control and monitoring | 1 | No dashboard, no remote score access, no way to lock students to one experiment |
| Overall classroom readiness | 3 | Strong student-facing experience; significant gaps on the teacher/deployment side |

### Strengths

- The thermite reaction particle simulation is visually compelling and likely to make a strong impression on students.
- The self-paced experiment flow (hint system, concept cards) means a teacher does not need to actively pace every student — the app scaffolds independently.
- The Bloom's-level score breakdown would be a genuinely useful formative data point *if* it could be collected by the teacher.
- The experiment steps map cleanly to a real lab procedure, making it easy to contextualise alongside a physical demonstration.

### Recommendations

1. **Priority fix:** Implement a lightweight score export mechanism (e.g., shareable results URL or downloadable CSV) so teachers can access class performance data.
2. Disable or visually mark unimplemented experiment cards before any classroom deployment.
3. Add a teacher guide page accessible from the landing page with pre-class setup instructions.
4. Add a demo/kiosk mode for projector-based classroom introduction.

---

## Consolidated Issue Summary

| # | Issue | Raised By | Severity |
|---|-------|-----------|----------|
| 1 | Formative prediction result never surfaced post-reaction (broken POE loop) | Evaluator 1 | High |
| 2 | No teacher dashboard or remote score access | Evaluator 2 | High |
| 3 | Unimplemented experiments navigable without warning | Evaluator 2 | Medium |
| 4 | No pre-session marker preparation guidance | Evaluator 1 & 2 | Medium |
| 5 | No proximity approach feedback during marker placement | Evaluator 1 | Medium |
| 6 | No teacher guide / pre-class setup instructions | Evaluator 2 | Medium |
| 7 | No demo mode for projector-based classroom introduction | Evaluator 2 | Medium |
| 8 | "Calibrating AR sensors" loading text is misleading | Evaluator 1 | Low |
| 9 | Restart has no confirmation dialog | Evaluator 1 | Low |
| 10 | DEV button accessible to students without access control | Evaluator 2 | Low |

---

*Feedback collected as part of expert heuristic evaluation prior to pilot deployment.*
