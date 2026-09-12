# stats4PT Project Log

## 2026-09-12 - Causal Models and Clinical Reasoning Presentation

### Completed

- Added a 16-slide Clinical Inquiry I classroom presentation connecting
  scientific inquiry, population causal knowledge, clinical instantiation, and
  patient-specific reasoning across stats4PT, Physiolog, Models4PT, and the
  Clinical Inference Engine.
- Developed a recurring two-patient opening problem in which the same reduced
  six-minute walk distance supports different provisional causal explanations,
  counterfactuals, next questions, and intervention priorities.
- Added the revised heart failure/NMES Model 4D as an 18-variable, 29-claim DAG,
  including Strength Training -> Muscle Function and Muscle Function -> Balance,
  while preserving its draft and unvalidated status.
- Distinguished a causal graph from its scientific warrant by connecting causal
  claims to meaning, mechanisms, evidence, scope, provenance, and uncertainty.
- Presented critical-realist domains and stratification, including models nested
  across scales and purpose-dependent abstractions that remain fallible and
  revisable.
- Introduced clinical instantiation as the transformation
  `ℐ(M, E_t) = M_{p,t}` and used a paired activity and new evidence to demonstrate
  construction and revision of provisional patient-specific explanations.
- Added slide overview and navigation, responsive layouts, reduced-motion
  support, print styles, and a direct downloadable PDF. Presenter notes were
  removed from the public deck so they are not exposed to students.
- Added persistent author, affiliation, and portfolio attribution to the browser
  presentation and printed PDF, plus machine-readable author metadata.
- Configured all final-slide resources to open in a new browser tab without
  granting the destination access to the presentation's browsing context.
- Added restrained presentation discovery to the stats4PT homepage and
  documented presentations as a repository resource.

### Validation

- Verified all 16 slides at a 1,440 x 900 classroom viewport and checked narrow
  layouts at 390 x 844 with no horizontal page overflow.
- Verified keyboard/button navigation, hashes, overview, fullscreen controls,
  semantic labels, and editor diagnostics.
- Verified the revised Model 4D contains 18 nodes and 29 directed claims and
  remains acyclic.
- Generated and inspected a 16-page Letter-landscape PDF; corrected print-only
  responsive stacking so the title, DAG, instantiation equation, and closing
  synthesis render without clipping.
- Verified the attribution does not overlap the controls or cause horizontal
  overflow at 1,440 x 900 or 390 x 844, and that all five final-slide resource
  links use protected new-tab behavior.
- Regenerated and inspected the 16-page PDF with attribution on every page and
  no footer-only extra page.
- Verified the live slide 1 download link returns the 995,505-byte PDF as
  `application/pdf`.

### Release

- Presentation release commit: `3a4f663be423baaa1fbe9def8df5ac7bbe3097c7`
  (`Add causal models clinical reasoning presentation`).
- Attribution update commit: `e0940037de24e463ad6a894e95047961a6fbf2a9`
  (`Add presentation author attribution`).
- Branch: `main`.
- GitHub Pages workflow run: `34709306683` (`success`).
- GitHub Pages deployment: `6412592266` (`success`).
- Published presentation:
  <https://stats4pt.org/presentations/causal-models-clinical-reasoning.html>.

### Next priority

- Review the complete clinical inquiry ecosystem across stats4PT, Physiolog,
  Models4PT, the Clinical Inference Engine, and the main portfolio to decide
  whether and how this presentation should be integrated into each site. Preserve
  project ownership boundaries and distinguish reciprocal links, educational
  context, shared representations, and software or data integration before
  making cross-repository changes.

## 2026-08-25 - Lessons 7-8 Causal Modeling and Claim Audit

### Completed

- Corrected Lesson 7 so DAG roles depend on the causal question and complete
  graph, adjustment follows path structure, mechanisms remain in Bhaskar's real
  domain while activations are actual events, and additional causal depth makes
  hypotheses visible without validating them.
- Clarified that a DAG is not the statistical model from which its variables
  were drawn, that randomized assignment changes candidate confounding paths,
  and that effect modification is not established merely by adding a node.
- Added a fixed-graph Path and Adjustment Lab covering a common cause, mediator,
  collider, and mixed structure, with live conditioning sets and open/closed
  path consequences for a total-effect question.
- Reorganized Lesson 8 by separating where an error enters from whether it is a
  statistical error, study bias, causal fallacy, cognitive bias, or narrative
  error; corrected the study-design spectrum, randomization, Bradford Hill, and
  automatic causal-depth claims.
- Added a five-scenario Causal Claim Audit requiring learners to identify all
  supported threats, choose a warranted conclusion, and select evidence that
  discriminates among live explanations.
- Reserved patient-specific clinical instantiation for a future Clinical
  Inference Engine app or game while keeping stats4PT focused on discovery and
  Models4PT focused on integrative population causal knowledge.

### Validation

- Verified every path-state transition, sufficient adjustment set, claim-audit
  answer key, partial and invalid response, and reset path with deterministic
  Node assertions.
- Tested all four Lesson 7 structures and all five Lesson 8 claim scenarios in
  a browser, including incomplete and incorrect responses, with no console
  errors.
- Measured 1,280-pixel desktop and 390-pixel mobile layouts, 44-pixel controls,
  single-column mobile workspaces, and no horizontal overflow.

## 2026-08-25 - Lesson 6 Transportability and Clinical Instantiation

### Completed

- Added a population-to-context transportability lab with three study-to-target
  scenarios covering limitation profile, a proposed traction-responsive
  subgroup, and progressive-loading delivery fidelity.
- Added separate judgments for study-target alignment and evidence that a
  difference modifies the effect across population, intervention, outcome,
  setting, and mechanism dimensions.
- Added corrective feedback and four warranted conclusions: directly
  transportable, transportable with qualification, transportability uncertain,
  and not directly supported by the source evidence.
- Kept the activity at the level of evidence applicability rather than
  patient-specific treatment recommendations, with explicit warnings that a
  plausible mechanism is a testable hypothesis rather than an override.
- Distinguished transportability to another population or setting from clinical
  instantiation: the recursive transformation of a generic causal model and
  patient-specific evidence into a provisional instantiated causal model.
- Linked the lesson's terminology to Collins's paper, clarified that an
  instantiated model represents rather than creates operative mechanisms, and
  situated Bayesian updating and mechanistic reasoning within the resulting
  patient-specific representation.

### Validation

- Verified all four transportability classifications, supplied scenario answers,
  incorrect-answer detection, invalid-input handling, and JavaScript syntax
  with deterministic Node assertions.
- Tested incomplete submissions, all three scenarios, corrective feedback,
  warrant generation, correction of an overstated mechanism claim, and reset
  behavior in a browser with no console errors.
- Measured 1,280-pixel desktop and 390-pixel mobile layouts, 44-pixel mobile
  controls, single-column mobile judgments, and no horizontal overflow.

## 2026-08-25 - Lesson 5 Bayesian Evidence Synthesis Lab

### Completed

- Added a dependency-free normal-normal evidence synthesis lab with an explicit
  prior for the pooled mean, three editable study estimates and standard errors,
  supplied between-study heterogeneity, and a meaningful-effect threshold.
- Added consistent, conflicting, and imprecise evidence scenarios; posterior
  mean and credible interval; probabilities above zero and the selected MCID;
  and a predictive interval and probability for a new setting.
- Added a responsive forest plot separating the prior, individual studies,
  pooled posterior, and new-setting prediction, plus precision contributions
  and guided questions about skeptical priors, heterogeneity, and practical
  importance.
- Clarified that frequentist and Bayesian meta-analysis can both model
  heterogeneity, that adaptive-trial benefits are conditional on prespecified
  design choices, and that this simplified model does not assess bias or causal
  identification.

### Validation

- Verified inverse-variance pooling, prior precision, heterogeneity-dependent
  weighting, posterior probabilities, credible intervals, predictive intervals,
  limiting cases, and invalid-input guards with deterministic Node assertions.
- Tested every scenario, skeptical and weak priors, editable study values,
  heterogeneity, MCID, reset behavior, and preservation of the last valid result
  during partial input in a browser with no console errors.
- Measured 1,280-pixel desktop and 390-pixel mobile layouts, 44-pixel controls,
  full-width plot tracks, marker-label separation, and no page overflow.

## 2026-08-25 - Lesson 4 Diagnostic Updating Lab

### Completed

- Added a dependency-free Diagnostic Updating Lab with test-property,
  literature-example, and raw 2 × 2 count modes sharing the conventional
  finding-by-condition table.
- Added sensitivity, specificity, positive and negative likelihood ratios,
  predictive values, natural frequencies, positive and negative result updates,
  and an optional second finding with a conditional-independence warning.
- Added cited examples for Wainner's Spurling A and upper limb tension A tests
  and Laslett's SIJ provocation composite, with each estimate attached to its
  population, threshold, reference standard, source, and limitations.
- Corrected adjacent claims about which test properties drive positive and
  negative likelihood ratios, their relationship to causation, and how Fagan's
  nomogram incorporates evidence rates.

### Validation

- Verified the pure diagnostic engine against a known 2 × 2 table, both
  likelihood-ratio update paths, invalid-count handling, and limiting cases.
- Tested all three input modes, all literature values, raw-cell editing,
  positive and negative findings, sequential updates, reset behavior, and
  keyboard tab navigation in a browser with no console errors.
- Measured 1,280-pixel desktop and 390-pixel mobile layouts, 44-pixel controls,
  contained mobile table scrolling, no page overflow, and reduced-motion
  behavior.
- Confirmed Prettier formatting, JavaScript syntax, patch whitespace, local
  references, and editor diagnostics.

## 2026-08-25 - Lesson 3 Bayesian Updating Lab

### Completed

- Added a dependency-free Bayesian Updating Lab that compares two populations
  with different priors while holding P(E|H) and P(E|not H) constant.
- Added exact natural-frequency counts per 100,000 people, positive likelihood
  ratios, posterior probability bars, live interpretation, fallback content,
  responsive stacking, and reduced-motion behavior.
- Corrected Lesson 3's explanations of conditional probability, classical
  bivalence, Boolean truth values, and the evidential value of genuinely rare
  findings.
- Corrected the DVT posterior notation in Lesson 4.
- Revised Lesson 5's descriptions of adaptive trials, Bayesian
  meta-analysis, Bayesian networks, causal identification, and Models4PT's
  current project boundary; added the temporary Models4PT GPT link.

### Validation

- Verified canonical posterior calculations, edge cases, and exact
  natural-frequency counts, including a 0.1% prior with 99% sensitivity and a
  5% false-positive rate yielding a 1.94% posterior.
- Tested all four controls in a browser and confirmed the default 30.8% and
  80.0% posteriors update correctly.
- Measured desktop and 390-pixel mobile layouts, 44-pixel controls, mobile world
  stacking, no horizontal overflow, visible keyboard focus, reduced-motion
  behavior, correct links, and no browser errors.
- Confirmed Prettier formatting, JavaScript syntax, patch whitespace, local
  references, and editor diagnostics.

## 2026-08-25 - Lesson 2 causal reasoning activities

### Completed

- Added a Mechanism and Context Lab using an explicitly stipulated model to show
  how a responsive subgroup effect can be diluted in a heterogeneous population.
- Added a Bhaskar Domain Sort with explanatory feedback for empirical
  experiences, actual events, and real mechanisms and structures.
- Added a Causal Inference Lab that holds illustrative pre-post observations
  constant across several compatible causal explanations and updates warranted
  claims as learners strengthen the hypothetical study design.
- Added reflection prompts, live status messages, no-JavaScript alternatives,
  reduced-motion behavior, and responsive layouts to all three activities.
- Corrected nearby descriptions of hypothesis testing, latent variables,
  randomization, and Bhaskar's domains so the prose and activities use the same
  causal distinctions.
- Replaced the obsolete Models4PT beta description with the current
  population-level causal knowledge platform scope and added the Models4PT GPT
  as a clearly labeled temporary resource rather than the canonical project.

### Validation

- Verified deterministic causal-model logic, domain classifications, study
  design claim rules, and seeded cohort generation.
- Tested all activity controls and instructional state changes in a browser.
- Verified desktop, intermediate, and 390-pixel mobile layouts, no horizontal
  overflow, 44-pixel control heights, keyboard traversal, visible focus,
  reduced-motion behavior, fallback content, and successful asset loading.
- Confirmed Prettier formatting, JavaScript syntax, patch whitespace, local
  references, and editor diagnostics.

## 2026-08-25 - Lesson 1 Sampling Lab

### Completed

- Added a dependency-free Sampling Lab to Lesson 1 that connects dice-roll
  populations, observations, sample statistics, sampling distributions,
  standard error, and confidence-interval coverage.
- Added controls for one to five dice and sample sizes from 5 to 100, with
  actions for individual rolls, one complete sample, and batches of 100 samples.
- Added exact population histograms, sample summaries, a sampling-distribution
  histogram, recent confidence intervals, cumulative coverage, interpretation
  prompts, live status updates, and fallback content.
- Preserved the physical dice activity and clarified the distinction between
  the distribution of dice sums and the sampling distribution of a mean.

### Validation

- Verified the statistical engine for every selectable dice count and sample
  size, including exact population probabilities and means.
- Ran 500,000 simulated intervals across all 25 configurations; empirical
  coverage ranged from 94.0% to 95.4%.
- Tested sample, batch, reset, and configuration controls in a browser.
- Verified desktop and 390-pixel mobile layouts, 44-pixel control heights, no
  horizontal overflow, successful asset loading, Prettier formatting, and
  editor diagnostics.

## 2026-08-25 - Canonical and Open Graph metadata

### Completed

- Added an absolute canonical URL to the homepage, course orientation, and all
  eight lessons.
- Added page-specific Open Graph titles, descriptions, URLs, and content types.
- Added the stats4PT site name and shared wordmark metadata, including image
  dimensions and alternative text, to every public page.

### Validation

- Verified canonical path mapping and all 10 required Open Graph fields across
  the 10 public pages.
- Verified that Open Graph URLs match their canonical URLs, descriptions match
  the corresponding page descriptions, and the referenced image exists locally.

## 2026-08-24 - Curriculum revision and repository-native publishing

### Completed

- Reviewed the complete course and revised the eight-lesson sequence for a
  clearer progression from statistical inference and causality through Bayesian
  reasoning, mechanisms, causal diagrams, and statistical fallacies.
- Replaced the Getting Started placeholder with a course orientation.
- Added estimated times, learning objectives, prerequisites, key terms, and
  transitions to the lessons.
- Corrected conceptual boundaries: Bayesian updating does not establish
  causality, critical-realist domains remain ontologically distinct, mechanisms
  require evidence, and DAG arrows represent explicit causal assumptions.
- Clarified the roles of stats4PT, Physiolog, Models4PT, and the Clinical
  Inference Engine within the clinical inquiry ecosystem.
- Updated the homepage course descriptions, lesson order, author attribution,
  and project links.
- Established this repository as the sole source of truth for authoring and
  publishing stats4PT.
- Removed the obsolete Substack importer, link loader, bootstrap content list,
  platform-specific controls, and dead links.
- Updated the README and roadmap to reflect the repository-native workflow and
  completed curriculum work.

### Validation

- Formatted the homepage and all lesson pages with Prettier.
- Verified all 159 page references and local asset targets.
- Verified the complete lesson navigation chain.
- Confirmed `git diff --check` passes.
- Confirmed the revised production content at <https://stats4pt.org/>.

### Release

- Commit: `d06ad998896a1ad887d2d7d088d3cc56bccc8e2b`
  (`Revise stats4PT lesson curriculum`)
- Branch: `main`
- GitHub Pages workflow run: `32714979366`
- GitHub Pages deployment: `6060529299` (`success`)

### Next priorities

- Add canonical and Open Graph metadata to every page.
- Add last-reviewed dates, consistent equation rendering, in-page navigation,
  citations, and automated link checks.
- Add reciprocal ecosystem links when working in the corresponding project
  repositories.
