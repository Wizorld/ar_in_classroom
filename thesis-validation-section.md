# Thesis — Validation & Conclusion

## 5. Validation

### 5.1 Validation Methodology

The prototype was subjected to two parallel validation streams prior to pilot deployment: (1) a **Subject Matter Expert (SME) content review** using a structured questionnaire distributed to chemistry educators, and (2) an **expert heuristic evaluation** conducted by two domain specialists using a structured walkthrough protocol. Together, these streams assessed content accuracy, pedagogical design, AR interaction quality, and classroom feasibility.

---

### 5.2 SME Content Review

#### 5.2.1 Participant Profile

Four SMEs participated in the review (Table 5.1). Participants were chemistry educators and instructional practitioners with experience ranging from under two years to over ten years.

| Respondent | Experience |
|---|---|
| R1 (anonymous) | Less than 2 years |
| R2 — P. Priyadharshini | Less than 2 years |
| R3 — Ayesha Nikhath | More than 10 years |
| R4 — Sherin | 5–10 years |

#### 5.2.2 Quantitative Ratings

SMEs rated each dimension on a 5-point Likert scale (1 = Strongly Disagree, 5 = Strongly Agree). Mean scores across all four respondents are summarised in Table 5.2.

| Dimension | Mean Score (out of 5) |
|---|:---:|
| Scientific accuracy of thermite reaction depiction | 4.75 |
| Concept cards appropriate for target level | 4.75 |
| Bloom's taxonomy tags match cognitive demand | 4.25 |
| Quiz questions accurately test reaction understanding | 4.50 |
| Predict-Observe-Explain (POE) flow pedagogically appropriate | 5.00 |
| Experiment steps mirror real lab workflow | 4.50 |
| Formative and summative assessments well-differentiated | 5.00 |
| Hint system supports learning without giving away answers | 4.75 |
| Visual feedback communicates reaction clearly | 4.75 |
| Could replace or supplement physical demonstration | 4.75 |
| Session length and pacing appropriate for 50-min class | 4.75 |

**Overall mean across all dimensions: 4.68 / 5.00**

The highest consensus scores (5.00) were recorded for the POE instructional flow and the differentiation between formative and summative assessments, reflecting strong validation of the core pedagogical design choices.

#### 5.2.3 Intended Usage

All four respondents indicated they would integrate the tool into their teaching practice. Three (75%) selected *Supplementary (alongside physical lab)* as their preferred mode of use; one (25%) chose *Pre-lab preparation / flipped classroom*, noting that prior exposure to the simulation could improve student performance in the physical lab.

#### 5.2.4 Qualitative Feedback

Respondent R2 noted that an activity series diagram is absent from the reaction explanation cards, which is a standard visual aid in undergraduate electrochemistry instruction. R3 suggested the inclusion of differentiation strategies and real-world application examples to broaden accessibility. R2 also flagged small font size in the quiz interface as a usability concern.

---

### 5.3 Expert Heuristic Evaluation

#### 5.3.1 Evaluator Profiles

Two expert evaluators independently conducted a heuristic walkthrough of the full application.

| Evaluator | Role | Experience | Evaluation Focus |
|---|---|---|---|
| E1 | Assistant Professor, Chemistry | 8 years | Content accuracy, pedagogical design, student learning flow |
| E2 | Senior Lecturer, Educational Technology | 11 years | AR interaction design, classroom feasibility, teacher workflow |

#### 5.3.2 Ratings

**Evaluator 1 (Pedagogical lens)**

| Dimension | Rating (/ 5) |
|---|:---:|
| Scientific accuracy of content | 4 |
| Alignment of quiz to learning objectives | 5 |
| Effectiveness of pedagogical scaffolding | 3 |
| Clarity of experiment instructions | 3 |
| Overall learning experience | 4 |

**Evaluator 2 (Classroom deployment lens)**

| Dimension | Rating (/ 5) |
|---|:---:|
| Visual fidelity of simulation | 5 |
| Quality of AR interaction design | 4 |
| Ease of classroom deployment | 2 |
| Teacher control and monitoring | 1 |
| Overall classroom readiness | 3 |

#### 5.3.3 Identified Issues

A total of **10 usability and pedagogical issues** were identified across the two evaluations and classified by severity (Table 5.3).

| Severity | Count | Issues |
|---|:---:|---|
| High | 2 | Broken POE loop (prediction never revisited post-reaction); No teacher dashboard or remote score access |
| Medium | 5 | Unimplemented experiments navigable without warning; No pre-session marker preparation guidance; No proximity feedback during marker placement; No teacher guide or pre-class setup instructions; No demo mode for projector-based delivery |
| Low | 3 | Misleading "Calibrating AR sensors" loading text; No confirmation dialog on restart; DEV debug panel accessible to students |

#### 5.3.4 Key Findings

**Strengths identified:**

- The thermite reaction particle simulation was described by E2 as "the most visually faithful digital representation of an exothermic reaction I have seen in an educational tool at this level."
- Bloom's-tagged learning objectives at entry and per-question Bloom's score breakdown on the results screen were highlighted by E1 as design choices rarely seen in digital labs.
- The hint system and concept cards were praised by both evaluators for enabling self-paced learning without requiring active teacher pacing.
- The experiment step sequence was noted to closely mirror a real wet-lab procedure, reducing interface learning overhead.

**Priority issues identified:**

1. **POE loop closure (High — E1):** The student's pre-reaction prediction is never surfaced again after the reaction occurs. The predict-observe-explain cycle is broken at the *explain* stage, which is where the deepest conceptual learning occurs in inquiry-based instruction. The recommended fix is to display the student's original prediction alongside the observed outcome immediately before the summative quiz, with a prompt for a brief written explanation.

2. **Teacher dashboard absence (High — E2):** Quiz scores are stored only in the student device's local storage and are inaccessible to the teacher without physical device access. For a tool whose stated purpose includes formative assessment, this is a significant gap. A lightweight score export mechanism (shareable results URL or downloadable CSV) is recommended before classroom deployment.

---

### 5.4 Validation Summary

The dual-stream validation confirms that the core academic design of the tool — its scientific accuracy, Bloom's-aligned assessment structure, POE instructional flow, and visual fidelity — is strong and well-received by subject matter experts, with an SME mean rating of **4.68 / 5.00** across all content and pedagogical dimensions. The expert heuristic evaluation corroborates these strengths while surfacing two high-priority gaps (POE loop closure and teacher score accessibility) and five medium-priority classroom deployment issues that should be addressed before wider rollout. The convergence of both SME and evaluator feedback on the POE loop and teacher workflow gaps provides clear, evidence-based direction for the next development iteration.

---

## 6. Conclusion

This work presented the design, development, and validation of an AR-based interactive laboratory for teaching the thermite reaction to undergraduate chemistry students. The system integrates marker-based augmented reality, a predict-observe-explain instructional framework, Bloom's taxonomy-aligned assessments, and a physics-based particle simulation — delivered as a zero-installation, browser-native application accessible on any camera-equipped device.

Expert validation across two streams — an SME content review (n = 4) and a heuristic evaluation by two domain specialists — confirmed the soundness of the core design. SME ratings averaged 4.68 / 5.00 across content accuracy, pedagogical structure, and classroom feasibility dimensions, with the POE instructional flow and formative-summative assessment differentiation receiving unanimous top scores. The heuristic evaluation corroborated these strengths while identifying two high-priority gaps — an incomplete POE closure loop and the absence of a teacher-facing score dashboard — alongside five medium-priority classroom deployment issues, providing a concrete, evidence-grounded agenda for the next iteration.

### Future Work

The present validation was limited to expert review and did not involve learners directly. The next phase of evaluation will address this gap through a **classroom-based empirical study** conducted in a school setting. The study will adopt a **controlled experimental design**, splitting student participants into two groups: a control group receiving conventional instruction on the thermite reaction, and an experimental group engaging with the AR lab platform. Pre- and post-test assessments aligned to the same Bloom's taxonomy levels as the in-app quiz will be used to measure learning gains across both groups, enabling a direct comparison of instructional effectiveness.

In parallel, the evaluator pool will be expanded to include a broader range of chemistry educators and instructional technologists to strengthen the generalisability of the heuristic findings. The two high-priority issues identified in the current evaluation — POE loop closure and teacher score export — will be resolved before the classroom study commences, ensuring the tool deployed in the empirical phase reflects a pedagogically complete implementation.

On the technical side, the current barcode marker-based tracking will be replaced with **natural image tracking**, where photographs of the actual laboratory props (ceramic pot, sand box, magnesium stick) serve directly as tracking targets. This eliminates the dependency on printed marker cards — a friction point raised by both expert evaluators — and produces a more robust tracking experience under varied classroom lighting and viewing angles. Image tracking also reduces setup burden for teachers, as no additional materials need to be prepared or distributed beyond the physical props already present in a chemistry laboratory.
