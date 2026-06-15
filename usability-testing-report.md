# Usability Testing Report — AR Chemistry Lab

**Evaluator:** Claude Code (simulated teacher + student roles)
**Method:** Heuristic walkthrough based on full code review
**Date:** 2026-04-16

---

## Role 1: Student Perspective

### Simulated Session Flow

**Step 1 — Landing page (`index.html`)**

I see three experiment cards. The "Exothermic Reaction" card looks clickable, I tap it.

- A learning outcomes popup slides in with 4 Bloom's-tagged objectives. Good framing.
- I tap "Continue to Experiment" — taken to `lab.html`.

**Step 2 — Lab loads**

- A spinner appears saying "Preparing Laboratory... Calibrating AR sensors." **Confusing** — there are no AR sensors to calibrate; it's just loading JS libraries. This could make students think they need to hold still or do something.
- The instructions overlay auto-appears (4 slides). This is good.

**Step 3 — Marker setup**

- Slide 1: "6 Printed Marker Cards" — **Problem:** nowhere in this flow was I told to print anything before arriving. A student who didn't prep ahead is now stuck.
- Slide 3 (Experiment Flow) says steps 1–4/5 clearly. This is helpful.
- I close instructions and point camera at markers.

**Step 4 — Experiment steps**

| Step | What I do | What happens | Issue |
|------|-----------|--------------|-------|
| Show Station marker (value=5) | Point camera | 3D sand box appears, concept card fires | Good flow |
| Bring Pot marker (value=1) near | Physical proximity | Snaps to station | No visual "how close is close?" feedback |
| Formative prediction | Checkboxes | Submit → "Keep watching!" | **No result shown later — prediction is forgotten** |
| Bring Mixture marker near | | Animation triggers | The CLAUDE.md says marker ID=4 but code uses `value="7"` — student would need marker #7, not #4 |
| Bring Stick marker (value=6) | | Snaps | Fine |
| Hold Lighter (value=0) for 5s | | Fuse bar counts down, reaction fires | Impressive visually |
| Reaction completes | | Concept card → Summative quiz | 7 good questions |

**Identified Student-Facing Issues:**

1. **No pre-session prep prompt** — students need printed markers before arriving, but the app only mentions this inside the lab itself.

2. **Marker ID discrepancy**: `mixtureMarker` in code uses `value="7"` but the project docs say ID=4. Students printing the wrong marker would be stuck with no error message.

3. **Proximity feedback is binary** — the instruction panel doesn't show "you're getting closer." Students who are almost-but-not-quite in range get no indication. The debug panel shows distance but is hidden from students.

4. **Formative prediction result is never surfaced** — students select what they think will happen, the overlay closes with "Keep watching!" and the predictions vanish. The summative quiz doesn't reference them. This breaks the predict-observe-explain loop that's the whole pedagogical point of the formative.

5. **"Calibrating AR sensors" loading text** — misleading. Students expect hardware calibration, not CDN JS loading.

6. **No marker loss recovery UX** — if a marker is lost mid-step, the instruction panel still shows the current step. Students don't know if they've lost tracking or if they simply need to bring markers closer.

7. **Back button and Help button are crowded at top** — "Back to Menu," "How to Use," and "Restart" are all at the top of the AR view. On a phone held to scan markers, the top buttons are hard to tap without dropping the device.

8. **Plant Cell and Acid-Base experiments on landing page are not implemented** — clicking them shows real-looking outcomes and a "Continue to Experiment" button, which takes students to an AR lab that does nothing. This is a dead end with no error or "coming soon" message.

---

## Role 2: Teacher Perspective

### Simulated Session Flow

I want to run this with 20 students in a classroom. I open `index.html` on my laptop to preview, then tell students to open the same URL on their tablets.

**Pre-class setup:**
- No teacher setup screen. I need to print marker cards — but the app doesn't tell me how many, what size, or provide a download link. I'd have to find that externally.
- No way to lock students to a specific experiment — they can click any of the 3 cards including the 2 broken ones.

**During class:**

- I can see the "DEV" toggle button in the lab. Clicking it reveals a debug panel (marker states, distance). Good for troubleshooting one device. But I can't monitor all 20 students at once from my device.
- Concept cards and quiz are fully in-flow — I don't need to manually advance students.
- The hint system (30-second timeout → hint button appears) is a good autonomous scaffold.

**After class:**

- Scores are saved to `localStorage` with key `ar_lab_summative`. I cannot access students' scores from my device. I would need to go to each student's device and open developer tools.
- The Bloom's-level breakdown on the score card is excellent pedagogically — if I could collect it, it would directly inform remediation.

**Identified Teacher-Facing Issues:**

1. **No class management or student tracking** — scores are device-local. A teacher has no aggregate view of class performance, which is the main thing that makes AR labs useful for formative data.

2. **No pre-class checklist or teacher guide** — the app jumps straight into the student experience. A teacher viewing it for the first time doesn't know what markers to print, what size they should be, or what the expected session duration is.

3. **Unimplemented experiments are fully accessible** — a student in the middle of class who clicks "Plant Cell" and hits a dead end will be confused and disruptive. These cards should be marked "Coming Soon" and made non-navigable.

4. **No way to demo without markers** — teachers often need to demonstrate a tool to a class before students use it individually. Without markers, the teacher can't show what the reaction looks like on a projector.

5. **DEV panel shows distance/status but is unlabeled** — the toggle button says "DEV" which students might click accidentally. If the intent is teacher-only, it should require a tap+hold or a PIN.

6. **Restart wipes all state** — if a student accidentally hits restart mid-experiment, all progress is lost with no confirmation dialog.

---

## Summary: Priority Issues

| # | Issue | Severity | Role |
|---|-------|----------|------|
| 1 | Formative prediction result never surfaced after reaction | High | Student |
| 2 | No teacher dashboard / score export | High | Teacher |
| 3 | Marker ID mismatch (code `value="7"` vs documented ID 4) | High | Student |
| 4 | Unimplemented experiments navigable without warning | Medium | Both |
| 5 | No proximity approach feedback for students | Medium | Student |
| 6 | No pre-session marker prep instructions | Medium | Both |
| 7 | "Calibrating AR sensors" misleading loading text | Low | Student |
| 8 | Restart has no confirmation dialog | Low | Student |
| 9 | DEV button unlabeled / no access control | Low | Teacher |
| 10 | Top-bar button crowding on portrait mobile | Low | Student |

---

**Standout strengths:** The Bloom's-tagged summative quiz, concept cards between steps, hint system, and particle reaction visuals are all well-executed. The pedagogical scaffolding is genuinely strong — the biggest gaps are around data collection and the broken prediction-observe loop.
