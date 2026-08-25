(() => {
  "use strict";

  const SCENARIOS = Object.freeze({
    heartFailure: Object.freeze({
      label: "Heart failure training",
      study:
        "A trial found that aerobic and strength training both improved function in adults with heart failure and reduced exercise tolerance.",
      target:
        "The target context is adults with marked muscular weakness but little endurance limitation.",
      dimensions: Object.freeze([
        Object.freeze({
          id: "population",
          label: "Population",
          difference:
            "The dominant functional limitation differs: reduced exercise tolerance in the study and muscular weakness in the target.",
          alignment: "different",
          evidence: "plausible",
          explanation:
            "The difference is real and could modify benefit, but the scenario provides no subgroup estimate showing that limitation type changes the comparative effect.",
        }),
        Object.freeze({
          id: "intervention",
          label: "Intervention",
          difference:
            "The same aerobic and strength programs can be delivered in both contexts.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation:
            "No material intervention difference is described, so an effect-modification claim is unnecessary here.",
        }),
        Object.freeze({
          id: "outcome",
          label: "Outcome",
          difference:
            "Both contexts prioritize patient-relevant physical function.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation:
            "The outcome construct remains relevant even though the cause of functional limitation may differ.",
        }),
        Object.freeze({
          id: "setting",
          label: "Setting and delivery",
          difference:
            "Supervision, dose, resources, and adherence are described as comparable.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation:
            "The scenario gives no reason to expect delivery or setting to alter the effect.",
        }),
        Object.freeze({
          id: "mechanism",
          label: "Candidate mechanism",
          difference:
            "Aerobic training principally targets a limitation that is not prominent in the target context.",
          alignment: "different",
          evidence: "plausible",
          explanation:
            "This is a coherent reason to question equal benefit, but it remains an untested hypothesis about transportability in the information provided.",
        }),
      ]),
    }),
    traction: Object.freeze({
      label: "Traction and compressive sensitivity",
      study:
        "Trials in heterogeneous nonspecific low back pain populations found little average benefit from traction.",
      target:
        "The proposed target is a subgroup defined by symptoms thought to reflect compressive sensitivity.",
      dimensions: Object.freeze([
        Object.freeze({
          id: "population",
          label: "Population",
          difference:
            "The proposed subgroup may have been present but was not identified or analyzed in the source trials.",
          alignment: "uncertain",
          evidence: "plausible",
          explanation:
            "The subgroup's representation and response are unknown; naming it after the trial does not establish effect modification.",
        }),
        Object.freeze({
          id: "intervention",
          label: "Intervention",
          difference:
            "The traction procedure is assumed to match the procedure studied.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation:
            "No material difference in the intervention itself is supplied.",
        }),
        Object.freeze({
          id: "outcome",
          label: "Outcome",
          difference:
            "Pain and function outcomes are relevant in the study and proposed subgroup.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation:
            "The measured outcomes answer the same broad question in both contexts.",
        }),
        Object.freeze({
          id: "setting",
          label: "Setting and delivery",
          difference:
            "No meaningful difference in setting or delivery is described.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation:
            "Setting does not supply the reason for expecting a different effect in this scenario.",
        }),
        Object.freeze({
          id: "mechanism",
          label: "Candidate mechanism",
          difference:
            "Reducing compressive load is proposed as a pathway to benefit for the subgroup.",
          alignment: "different",
          evidence: "plausible",
          explanation:
            "A coherent pathway can motivate a subgroup test, but without empirical support it cannot overturn the average trial result.",
        }),
      ]),
    }),
    tendonLoading: Object.freeze({
      label: "Progressive tendon loading",
      study:
        "A supervised progressive-loading program improved pain and function when delivered with equipment, dose progression, and high adherence.",
      target:
        "A resource-limited service can offer only an unsupervised handout, without the studied equipment or progression checks.",
      dimensions: Object.freeze([
        Object.freeze({
          id: "population",
          label: "Population",
          difference:
            "Eligibility, symptom duration, and baseline irritability are comparable.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation: "No material population difference is described.",
        }),
        Object.freeze({
          id: "intervention",
          label: "Intervention",
          difference:
            "The target service cannot reproduce the studied progression, equipment, or supervision.",
          alignment: "different",
          evidence: "outside",
          explanation:
            "This is not merely a different patient characteristic; key components of the studied intervention are absent.",
        }),
        Object.freeze({
          id: "outcome",
          label: "Outcome",
          difference: "Pain and function remain the target outcomes.",
          alignment: "aligned",
          evidence: "irrelevant",
          explanation: "The target outcomes match those in the study.",
        }),
        Object.freeze({
          id: "setting",
          label: "Setting and delivery",
          difference:
            "The target lacks supervised progression and the adherence support used in the trial.",
          alignment: "different",
          evidence: "external",
          explanation:
            "Delivery fidelity is part of the causal pathway, and implementation evidence supports treating it as consequential rather than cosmetic.",
        }),
        Object.freeze({
          id: "mechanism",
          label: "Candidate mechanism",
          difference:
            "Progressive exposure and adaptation require a sufficiently delivered loading dose.",
          alignment: "different",
          evidence: "external",
          explanation:
            "The proposed action depends on intervention delivery; removing progression weakens the warrant for expecting the studied effect.",
        }),
      ]),
    }),
  });

  function classifyApplicability(judgments) {
    if (!Array.isArray(judgments) || judgments.length === 0) {
      throw new RangeError("judgments must contain at least one item");
    }

    const unresolved = judgments.filter(
      ({ alignment, evidence }) =>
        alignment === "uncertain" ||
        ((alignment === "different" || alignment === "uncertain") &&
          evidence === "plausible"),
    );
    const outside = judgments.filter(
      ({ alignment, evidence }) =>
        alignment === "different" && evidence === "outside",
    );
    const supportedModifiers = judgments.filter(
      ({ alignment, evidence }) =>
        alignment === "different" &&
        (evidence === "measured" || evidence === "external"),
    );

    if (outside.length > 0) {
      return {
        id: "not-direct",
        label: "Evidence does not directly support this target",
        explanation:
          "At least one essential population, intervention, or outcome element falls outside what the source study evaluated.",
      };
    }
    if (unresolved.length > 0) {
      return {
        id: "uncertain",
        label: "Transportability remains uncertain",
        explanation:
          "A potentially important difference remains untested. It supports a hypothesis about transportability, not a confident exception to the evidence.",
      };
    }
    if (supportedModifiers.length > 0) {
      return {
        id: "qualified",
        label: "Transportable with explicit qualification",
        explanation:
          "The evidence remains relevant, but supported effect-modifying differences limit an unqualified transfer of its average effect.",
      };
    }
    return {
      id: "direct",
      label: "Directly transportable within study uncertainty",
      explanation:
        "No identified difference has a supported or unresolved reason to change the expected effect.",
    };
  }

  function evaluateJudgment(dimension, judgment) {
    const alignmentCorrect = judgment.alignment === dimension.alignment;
    const evidenceCorrect = judgment.evidence === dimension.evidence;
    return {
      correct: alignmentCorrect && evidenceCorrect,
      alignmentCorrect,
      evidenceCorrect,
      explanation: dimension.explanation,
    };
  }

  const applicabilityLabLogic = {
    SCENARIOS,
    classifyApplicability,
    evaluateJudgment,
  };

  function initializeApplicabilityLab(lab) {
    const scenarioControl = lab.querySelector("[data-applicability-scenario]");
    const studyOutput = lab.querySelector("[data-applicability-study]");
    const targetOutput = lab.querySelector("[data-applicability-target]");
    const dimensionsOutput = lab.querySelector(
      "[data-applicability-dimensions]",
    );
    const result = lab.querySelector("[data-applicability-result]");
    const resultLabel = lab.querySelector("[data-applicability-result-label]");
    const resultExplanation = lab.querySelector(
      "[data-applicability-result-explanation]",
    );
    const status = lab.querySelector("[data-applicability-status]");

    function option(value, label) {
      const element = document.createElement("option");
      element.value = value;
      element.textContent = label;
      return element;
    }

    function selectFor(type, dimensionId) {
      const select = document.createElement("select");
      select.dataset[type] = dimensionId;
      select.setAttribute(
        "aria-label",
        type === "applicabilityAlignment"
          ? `Difference judgment for ${dimensionId}`
          : `Evidence status for ${dimensionId}`,
      );
      select.append(option("", "Choose one"));
      if (type === "applicabilityAlignment") {
        select.append(
          option("aligned", "Aligned"),
          option("uncertain", "Uncertain"),
          option("different", "Materially different"),
        );
      } else {
        select.append(
          option("irrelevant", "Unlikely to modify effect"),
          option("measured", "Measured effect modifier"),
          option("external", "Supported by external evidence"),
          option("plausible", "Plausible but untested"),
          option("outside", "Not represented by source evidence"),
        );
      }
      return select;
    }

    function renderScenario() {
      const scenario = SCENARIOS[scenarioControl.value];
      studyOutput.textContent = scenario.study;
      targetOutput.textContent = scenario.target;
      dimensionsOutput.replaceChildren();
      result.hidden = true;

      scenario.dimensions.forEach((dimension) => {
        const row = document.createElement("article");
        row.className = "applicability-lab__dimension";
        row.dataset.dimension = dimension.id;
        const heading = document.createElement("h5");
        heading.textContent = dimension.label;
        const difference = document.createElement("p");
        difference.textContent = dimension.difference;
        const controls = document.createElement("div");
        controls.className = "applicability-lab__judgments";
        const alignmentLabel = document.createElement("label");
        alignmentLabel.textContent = "Study-target relationship";
        alignmentLabel.append(
          selectFor("applicabilityAlignment", dimension.id),
        );
        const evidenceLabel = document.createElement("label");
        evidenceLabel.textContent = "Evidence that it changes the effect";
        evidenceLabel.append(selectFor("applicabilityEvidence", dimension.id));
        controls.append(alignmentLabel, evidenceLabel);
        const feedback = document.createElement("p");
        feedback.className = "applicability-lab__feedback";
        feedback.dataset.applicabilityFeedback = dimension.id;
        feedback.hidden = true;
        row.append(heading, difference, controls, feedback);
        dimensionsOutput.append(row);
      });
      status.textContent = `${scenario.label} scenario loaded. Complete five judgments.`;
    }

    function checkReasoning() {
      const scenario = SCENARIOS[scenarioControl.value];
      const judgments = scenario.dimensions.map((dimension) => ({
        id: dimension.id,
        alignment: lab.querySelector(
          `[data-applicability-alignment="${dimension.id}"]`,
        ).value,
        evidence: lab.querySelector(
          `[data-applicability-evidence="${dimension.id}"]`,
        ).value,
      }));

      if (
        judgments.some(({ alignment, evidence }) => !alignment || !evidence)
      ) {
        status.textContent =
          "Complete both judgments for all five dimensions before checking.";
        return;
      }

      let correctCount = 0;
      scenario.dimensions.forEach((dimension, index) => {
        const evaluation = evaluateJudgment(dimension, judgments[index]);
        const row = lab.querySelector(`[data-dimension="${dimension.id}"]`);
        const feedback = lab.querySelector(
          `[data-applicability-feedback="${dimension.id}"]`,
        );
        row.dataset.correct = evaluation.correct;
        feedback.hidden = false;
        feedback.textContent = `${evaluation.correct ? "Reasoning aligned." : "Reconsider this pair."} ${evaluation.explanation}`;
        if (evaluation.correct) correctCount += 1;
      });

      const conclusion = classifyApplicability(judgments);
      result.dataset.result = conclusion.id;
      resultLabel.textContent = conclusion.label;
      resultExplanation.textContent = conclusion.explanation;
      result.hidden = false;
      status.textContent = `${correctCount} of 5 judgments align with the supplied evidence. Warrant: ${conclusion.label}.`;
    }

    scenarioControl.addEventListener("change", renderScenario);
    lab
      .querySelector("[data-applicability-check]")
      .addEventListener("click", checkReasoning);
    lab
      .querySelector("[data-applicability-reset]")
      .addEventListener("click", () => {
        scenarioControl.value = "heartFailure";
        renderScenario();
      });
    renderScenario();
  }

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-applicability-lab]")
      .forEach(initializeApplicabilityLab);
  }

  if (typeof window !== "undefined") {
    window.applicabilityLabLogic = applicabilityLabLogic;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = applicabilityLabLogic;
  }
})();
