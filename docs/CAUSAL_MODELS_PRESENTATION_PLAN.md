# Causal Models Presentation Plan

## Status

Approved for development on 2026-09-12. The next step is implementation in
stats4PT. This document is the continuity record for the presentation's
teaching purpose, source material, scope, and build requirements.

## Working title

**Causal Models: From What We Know to What We Think Is Happening**

Subtitle: *Representing population knowledge and reasoning about an individual
patient*

## Audience and setting

- Course: Clinical Inquiry I, Doctor of Physical Therapy program, Plymouth
  State University.
- Learners: first-semester DPT students.
- Duration: 60 minutes.
- Prior exposure: Bradford Hill considerations, questions of whether X causes Y,
  and introductory counterfactual reasoning.
- Instructional level: conceptual and clinically grounded. No programming or
  advanced causal-inference mathematics is required.
- Cases: fictional educational cases only. The presentation is not a clinical
  calculator or a source of patient-specific recommendations.

## Teaching purpose

The presentation should move beyond asking whether one variable causes another
and show why causal knowledge must be organized into an inspectable model.
Students should see two distinct operations:

1. Models4PT represents and curates population-level causal knowledge.
2. The Clinical Inference Engine uses generic causal knowledge together with
   evidence about a particular patient to construct a provisional,
   patient-specific explanatory representation.

The central distinction is:

- **Models4PT asks:** What do we collectively know about the possible causal
  organization of this kind of problem?
- **The Clinical Inference Engine asks:** Given that knowledge and the evidence
  available now, what may be happening in this person, and what should we
  examine or do next?

A population model constrains patient reasoning but does not determine a
patient conclusion.

## Learning objectives

By the end of the session, students should be able to:

1. Explain how a causal model differs from a list of facts, an association, and
   a causal claim considered in isolation.
2. Read a simple causal network as an inspectable representation of assumptions
   about how an outcome may arise.
3. Distinguish a population-level causal model from a provisional
   patient-specific model.
4. Use patient findings to identify plausible operative pathways and select a
   useful next observation without treating the model as proof.

## One-hour teaching arc

| Time | Focus | Teaching move |
| --- | --- | --- |
| 0-5 min | Opening problem | Present two patients with the same reduced six-minute walk distance and ask whether the same outcome implies the same cause or intervention. |
| 5-11 min | Connect to prior learning | Briefly connect Bradford Hill considerations and counterfactual questions to the need to represent more than one isolated X-causes-Y claim. |
| 11-18 min | The 2015 curriculum diagram | Reconstruct the historical logic from observations and inquiry to universals, causal networks, and reasoning about particulars. |
| 18-27 min | What a causal model represents | Introduce nodes, arrows, pathways, omitted detail, assumptions, mechanisms, context, uncertainty, and provenance. |
| 27-35 min | Models4PT | Build a simplified population model of limited walking capacity in heart failure and show what a knowledge representation must preserve beyond a diagram. |
| 35-43 min | Clinical instantiation | Introduce the transition from a generic causal model plus patient evidence to an instantiated causal model, using ordinary language before notation. |
| 43-52 min | Paired activity | Students construct different provisional models for two fictional patients who share the same measured outcome. |
| 52-57 min | Debrief and revision | Compare models, identify missing evidence, and show how a new finding revises rather than merely confirms a model. |
| 57-60 min | Synthesis | Return to the 2015 diagram and restate the population-knowledge/patient-reasoning boundary. |

## Proposed slide sequence

The target is approximately 16 slides. Several slides should progressively
reveal one network rather than presenting a dense completed diagram at once.

1. Causal Models: From What We Know to What We Think Is Happening
2. Same outcome, same cause?
3. What Bradford Hill considerations help us evaluate
4. What a counterfactual question asks
5. Why isolated X-causes-Y claims are not enough
6. The 2015 clinical inquiry diagram
7. Reading the diagram from observations to universals
8. A causal model is a structured set of claims
9. Every arrow is an assumption with a history
10. A population model of limited walking capacity
11. What Models4PT must preserve
12. The patient is not an average population member
13. Clinical instantiation
14. Patient A and Patient B activity
15. New evidence, revised model
16. Return to the 2015 diagram and closing synthesis

## Historical image

The uploaded 2015 Plymouth State DPT curriculum image is the conceptual spine
of the presentation, not decoration.

Use it three times:

1. Show it intact and ask students what movement of knowledge they see.
2. Highlight its sequence from particular observations through research and
   statistical inquiry to population-level universals and causal networks,
   followed by deduction and abduction in reasoning about a particular patient.
3. Return to it at the end with the current ecosystem vocabulary overlaid:

```text
stats4PT discovery + Physiolog mechanisms
                    |
                    v
       Models4PT population knowledge
                    |
                    v
          clinical instantiation
                    |
                    v
 Clinical Inference Engine patient reasoning
```

The explanation should state that the current ecosystem refines the 2015 idea
by separating population knowledge representation from patient-specific
reasoning.

Before implementation, place an authorized local copy of the image in the
stats4PT asset tree and record its source, date, and alternative text. Do not
hotlink the Substack image.

## Heart failure and NMES example

Use a simplified, explicitly developmental version of the existing heart
failure/neuromuscular electrical stimulation model. The shared observed outcome
is reduced six-minute walk distance.

A classroom-scale representation is:

```text
NMES -> muscle function --------------------+
                                             |
Cardiac output -> aerobic capacity ----------+
                                             +-> six-minute walk distance
Balance -> gait performance ----------------+
                                             |
Mechanical efficiency ----------------------+
```

The model should be built progressively and should preserve these ideas:

- Multiple causal pathways can converge on the same observed limitation.
- NMES primarily enters through a muscular pathway and should not be expected
  to address every causal configuration that limits walking.
- Population-level pathways identify scientifically plausible possibilities;
  they do not establish which pathway is operative in a particular patient.
- A graph alone does not preserve the evidence, provenance, assumptions,
  uncertainty, direction or magnitude of effect, enabling conditions, or
  disagreements that Models4PT ultimately needs.
- Every arrow shown in the presentation must be described as a candidate or
  draft claim unless its supporting evidence has been reviewed and attached.

The full Model 4D contains 17 variables and 27 edges. It is useful as historical
and developmental source material but is too dense for the introductory
classroom view.

### Developmental cautions

- Model 4D remains a draft causal diagram.
- Its translated causal claims currently have empty per-edge evidence lists.
- The four mechanisms converging on six-minute walk distance are proposed
  mechanisms pending author review, not curated scientific conclusions.
- The planned strength-versus-endurance enrichment and the relationship of the
  Attain/Sustain framework to model representation versus CIE reasoning remain
  unresolved.
- The presentation may use these unresolved features to show why knowledge
  curation is necessary, but it must not present them as validated findings.

## Active-learning exercise

Students work in pairs with two fictional patients who have the same reduced
six-minute walk distance.

### Patient A

- Marked quadriceps weakness.
- Stable cardiovascular response to activity.
- Preserved balance.
- Difficulty attaining enough force to rise and initiate walking.

### Patient B

- Adequate isolated strength.
- Early dyspnea and an abnormal exertional response.
- Preserved gait mechanics.
- Difficulty sustaining activity.

### Student prompts

1. Which pathways from the generic model appear most plausible for this
   patient?
2. Which pathways are not yet supported?
3. What one additional observation would best discriminate among the remaining
   explanations?
4. Would NMES target the represented limitation? Why or why not?

### Debrief

The exercise does not ask students to diagnose or prescribe. It asks them to
construct and criticize a provisional explanatory representation. The debrief
should reveal one new finding for each patient and require revision of the
current model.

## Clinical instantiation

Introduce the concept in ordinary language:

> Generic causal knowledge and current evidence about a patient jointly
> constrain a provisional model of what may be happening in that patient now.

Then introduce the paper's abstract notation:

\[
\mathcal{I}(M,E_t)=M_{p,t}
\]

where:

- \(M\) is the generic causal model;
- \(E_t\) is the patient-specific evidence available at time \(t\);
- \(M_{p,t}\) is the provisional instantiated causal model for patient \(p\) at
  time \(t\); and
- \(\mathcal{I}\) names a potentially composite representational process, not a
  settled mathematical operator or automated clinical answer.

Show its recursive character:

```text
Evidence -> instantiation -> mechanistic reasoning -> intervention
   ^                                                       |
   +----------------------- new evidence ------------------+
```

An instantiated model represents the clinician's current hypothesis about
operative mechanisms. It does not create those mechanisms, exhaust the
patient's reality, or convert population averages directly into individual
conclusions.

## Confirmed source map

### Models4PT sources

All paths below are relative to the Models4PT repository.

- `doc/case-studies/hf-nmes/synthesis/Collins - 2018 - Synthesis Causal Models, Causal Knowledge.pdf`
  is the prior published synthesis article and a primary conceptual source for
  causal models as representations of causal knowledge. The publication DOI is
  `10.1097/CPT.0000000000000101`.
- `doc/case-studies/hf-nmes/synthesis/Collins_KBP_ProjectExample.pdf` is prior
  project-example material.
- `doc/case-studies/hf-nmes/synthesis/PopKnowledgePatientReasoning.pdf` is a
  local snapshot of the population-knowledge/patient-reasoning work. For the
  presentation, the CIE source and public preprint listed below are canonical.
- `doc/case-studies/hf-nmes/synthesis/model1.png`, `model2a.png`, `Model3.png`,
  and `Model4.png` document successive historical model iterations.
- `doc/case-studies/hf-nmes/model/Model4b.docx` and
  `doc/case-studies/hf-nmes/model/model4d_dagitty.txt` contain the most complete
  draft Model 4D structure.
- `doc/case-studies/hf-nmes/model/model_4d.py` translates Model 4D into 17
  variables and 27 proposed causal claims.
- `doc/case-studies/hf-nmes/model/mechanisms.py` contains four draft
  population-level mechanisms converging on six-minute walk distance.
- `doc/case-studies/hf-nmes/synthesis/PCM5 - Quadrants.png`,
  `PCM5 Algorithm.png`, `Quadrant-Pathway-ThoughtProcess_1.5.png`,
  `Quadrant_Thought_Process_1.0.png`, `Quadrants_1.pdf`, and
  `HF-CPG-Algorithm.png` preserve prior Attain/Sustain and heart-failure
  clinical-reasoning artifacts.
- `doc/case-studies/hf-nmes/notes.md` records the current model gaps, unresolved
  design questions, and confirmed interpretation of the artifacts.

The synthesis directory is historical input. Do not edit those source artifacts
in place.

### Clinical Inference Engine sources

All paths below are relative to the Clinical-Inference-Engine repository.

- `From_Population_Knowledge_to_Patient_Reasoning/main.tex` is the canonical
  editable source for *From Population Knowledge to Patient Reasoning:
  Instantiation and Dynamic Clinical Inquiry*.
- `From_Population_Knowledge_to_Patient_Reasoning/references.bib` is its source
  bibliography and includes the 2018 synthesis article, the heart-failure
  clinical practice guideline, and the works supporting the paper's account of
  representation and clinical reasoning.
- Public preprint: <https://philpapers.org/rec/COLFPK>.
- Current status: 2026 preprint. No compiled PDF is tracked in the CIE project,
  so presentation quotations and definitions should be checked against
  `main.tex`, and the public link should point to PhilPapers.

The presentation should refer to this paper explicitly when defining generic
causal models, instantiated causal models, clinical instantiation, recursive
inquiry, and the distinction between \(\mathcal{I}\) and Pearl's intervention
operator \(do(\cdot)\).

### stats4PT sources

- `lessons/lesson-2-understanding-causality-in-clinical.html` supports the bridge
  from associations and isolated causal claims to mechanisms and context.
- `lessons/lesson-6-beyond-data-mechanisms-and-structures.html` already links
  the CIE preprint and introduces clinical instantiation.
- `lessons/lesson-7-practical-applications-building-a.html` establishes that
  every DAG arrow is a causal assumption and that diagrams expose assumptions
  rather than prove them.
- `docs/ECOSYSTEM_PRINCIPLES.md` governs all cross-project boundaries and
  terminology used in the presentation.

## Hosting and information architecture

Host the presentation on stats4PT as a standalone classroom resource, not as a
ninth numbered lesson.

Proposed public route:

`https://stats4pt.org/presentations/causal-models-clinical-reasoning.html`

Proposed repository structure:

```text
presentations/
  causal-models-clinical-reasoning.html
assets/
  presentation-causal-models.css
  presentation-causal-models.js
img/
  presentations/
    <authorized 2015 curriculum image>
    <presentation-specific derived images>
```

Add a restrained Classroom Presentations link from the stats4PT homepage. A
future Models4PT site may become the canonical research destination, but
stats4PT remains the appropriate host for this classroom experience. Any future
move should preserve or redirect the stable presentation URL.

## Deliverable requirements

Build a dependency-free, browser-native presentation consistent with the
existing static stats4PT site:

- semantic HTML with one clearly delimited section per slide;
- local visual assets rather than hotlinked images;
- presentation-specific CSS that retains recognizable stats4PT identity;
- keyboard, visible button, and touch navigation;
- previous/next controls, slide counter, and overview navigation;
- direct links to individual slides when practical;
- projector-friendly full-screen behavior;
- responsive desktop, tablet, and mobile layouts without text overlap;
- accessible headings, landmarks, focus order, alternative text, and live
  announcements where needed;
- reduced-motion support;
- print styles that produce a readable handout or PDF;
- graceful reading order and usable content when JavaScript is unavailable;
- presenter notes stored in source but hidden during presentation mode;
- a references/resources slide linking the 2018 synthesis article, Models4PT,
  the CIE preprint, relevant stats4PT lessons, and the heart-failure guideline;
- explicit labels distinguishing historical artifacts, draft model content,
  established sources, fictional patient evidence, and open research
  questions.

## Visual direction

The visual language should feel like an academic working model rather than a
marketing deck:

- high contrast and restrained use of the stats4PT palette;
- large, readable type suitable for projection;
- diagrams that build one causal relationship at a time;
- stable node positions across progressive reveals;
- distinct visual encodings for population knowledge, patient evidence,
  hypothesized operative pathways, uncertainty, and unsupported paths;
- no decorative cards around every section and no ornamental graphics unrelated
  to the model;
- the historical image displayed at a size that permits inspection and
  discussion.

## Validation and acceptance criteria

Before considering the presentation complete:

1. Review all scientific claims and patient cases against the named source
   artifacts and label unresolved claims as draft.
2. Confirm that Models4PT and CIE responsibilities match
   `docs/ECOSYSTEM_PRINCIPLES.md`.
3. Verify all internal links, local image references, canonical metadata, and
   external source links.
4. Test keyboard navigation, focus behavior, slide counter, overview, direct
   entry, reset/reload behavior, and no-JavaScript reading order.
5. Test at desktop projector dimensions and at least one narrow mobile viewport;
   verify no clipping, overflow, overlap, or illegibly small diagram labels.
6. Test reduced-motion behavior and print/PDF output.
7. Check the browser console for errors.
8. Rehearse against a 60-minute clock, including at least nine minutes for the
   paired exercise and five minutes for debrief.
9. Confirm that the final slide returns to the 2015 image and states the
   population-model/patient-reasoning distinction in student-ready language.

## Implementation sequence

1. Obtain and locally store the authorized 2015 curriculum image.
2. Draft the complete slide copy and presenter notes from the confirmed sources.
3. Build the static HTML shell and presentation navigation.
4. Implement progressive causal-model diagrams and the two-patient activity.
5. Add homepage discovery and source/reference links.
6. Validate accessibility, responsive behavior, printing, links, and timing.
7. Review scientific wording and artifact attribution with the project author.
8. Publish through the existing stats4PT GitHub Pages workflow.
