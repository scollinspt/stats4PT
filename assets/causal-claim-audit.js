(() => {
  "use strict";

  const THREATS = Object.freeze({
    regression: Object.freeze({
      label: "Regression to the mean",
      category: "Statistical error",
    }),
    comparison: Object.freeze({
      label: "No concurrent comparison",
      category: "Causal limitation",
    }),
    narrative: Object.freeze({
      label: "Causal coherence from sequence",
      category: "Narrative error",
    }),
    multiplicity: Object.freeze({
      label: "Unaddressed multiplicity",
      category: "Statistical error",
    }),
    selective: Object.freeze({
      label: "Selective emphasis or reporting",
      category: "Study/reporting bias",
    }),
    confounding: Object.freeze({
      label: "Open confounding path",
      category: "Causal limitation",
    }),
    selection: Object.freeze({
      label: "Selection or collider bias",
      category: "Study/causal bias",
    }),
    outcomeDensity: Object.freeze({
      label: "Outcome-density illusion",
      category: "Cognitive bias",
    }),
  });

  const SCENARIOS = Object.freeze({
    prepost: Object.freeze({
      label: "Improvement after treatment",
      design:
        "Twelve participants entered during a severe pain flare (mean 8.2/10), received manual therapy, and averaged 4.3/10 one week later. There was no concurrent comparison group.",
      claim:
        "Manual therapy caused a large and clinically important reduction in pain.",
      threats: Object.freeze(["regression", "comparison", "narrative"]),
      warrants: Object.freeze([
        Object.freeze({
          id: "causal",
          text: "Manual therapy produced the observed improvement.",
        }),
        Object.freeze({
          id: "descriptive",
          text: "Pain scores decreased after treatment; this design does not distinguish the treatment from recovery, regression, or other concurrent causes.",
        }),
        Object.freeze({
          id: "null",
          text: "Manual therapy had no effect.",
        }),
      ]),
      correctWarrant: "descriptive",
      nextSteps: Object.freeze([
        Object.freeze({
          id: "mechanism-only",
          text: "Add a plausible mechanism to the discussion.",
        }),
        Object.freeze({
          id: "comparison",
          text: "Use a concurrent comparison with credible treatment assignment and track cointerventions.",
        }),
        Object.freeze({
          id: "larger-prepost",
          text: "Repeat the same pre-post design with more participants.",
        }),
      ]),
      correctNextStep: "comparison",
      explanation:
        "Selection during an extreme flare makes regression to the mean especially plausible. Temporal order describes change but does not supply the missing counterfactual comparison.",
    }),
    multiplicity: Object.freeze({
      label: "One favorable result",
      design:
        "A trial reports 20 outcomes and subgroup contrasts without a prespecified multiplicity plan. One subgroup result has p = 0.03 and is the only result highlighted in the abstract.",
      claim:
        "The intervention is effective for this newly discovered subgroup.",
      threats: Object.freeze(["multiplicity", "selective"]),
      warrants: Object.freeze([
        Object.freeze({
          id: "confirmed",
          text: "The subgroup effect is confirmed because p is below 0.05.",
        }),
        Object.freeze({
          id: "exploratory",
          text: "The subgroup result is exploratory and compatible with chance and selective emphasis among many analyses.",
        }),
        Object.freeze({
          id: "impossible",
          text: "Subgroup effects can never be real.",
        }),
      ]),
      correctWarrant: "exploratory",
      nextSteps: Object.freeze([
        Object.freeze({
          id: "replication",
          text: "Prespecify the subgroup and analysis, address multiplicity, and seek replication.",
        }),
        Object.freeze({
          id: "smaller-p",
          text: "Search the existing analyses for a smaller p-value.",
        }),
        Object.freeze({
          id: "mechanism",
          text: "Accept the result if a mechanism can be proposed.",
        }),
      ]),
      correctNextStep: "replication",
      explanation:
        "A nominal p-value does not retain its usual false-positive interpretation after many unaddressed analyses, and selective prominence can exaggerate an exploratory finding.",
    }),
    confounding: Object.freeze({
      label: "Treatment chosen in practice",
      design:
        "In an observational cohort, people with lower baseline severity and better access to care more often choose supervised loading and also recover faster. The analysis adjusts only for age.",
      claim: "Supervised loading caused the faster recovery.",
      threats: Object.freeze(["confounding"]),
      warrants: Object.freeze([
        Object.freeze({
          id: "causal",
          text: "Age adjustment is enough to establish the treatment effect.",
        }),
        Object.freeze({
          id: "association",
          text: "Supervised loading is associated with faster recovery, but open backdoor paths may explain some or all of the association.",
        }),
        Object.freeze({
          id: "no-value",
          text: "Observational evidence has no scientific value.",
        }),
      ]),
      correctWarrant: "association",
      nextSteps: Object.freeze([
        Object.freeze({
          id: "causal-design",
          text: "Specify the causal graph and contrast, measure pre-exposure common causes, and use a design and analysis that address them.",
        }),
        Object.freeze({
          id: "all-covariates",
          text: "Adjust for every measured variable, including mediators and colliders.",
        }),
        Object.freeze({
          id: "larger",
          text: "Increase sample size without changing the design or variables.",
        }),
      ]),
      correctNextStep: "causal-design",
      explanation:
        "Baseline severity and access are candidate common causes of treatment received and recovery. Precision cannot close those backdoor paths.",
    }),
    selection: Object.freeze({
      label: "Analysis of follow-up completers",
      design:
        "A study analyzes only people who returned a 12-week survey. Return is more likely among participants satisfied with treatment and among those with persistent symptoms seeking more care.",
      claim:
        "The association among survey completers estimates the treatment effect in everyone enrolled.",
      threats: Object.freeze(["selection"]),
      warrants: Object.freeze([
        Object.freeze({
          id: "general",
          text: "Completers provide an unbiased estimate because they supplied complete data.",
        }),
        Object.freeze({
          id: "selected",
          text: "The completer estimate may be distorted because inclusion depends on causes related to treatment experience and outcome.",
        }),
        Object.freeze({
          id: "none",
          text: "No inference of any kind can be made from completers.",
        }),
      ]),
      correctWarrant: "selected",
      nextSteps: Object.freeze([
        Object.freeze({
          id: "retention",
          text: "Improve follow-up, compare retained with lost participants, and use justified selection-bias analyses.",
        }),
        Object.freeze({
          id: "complete-only",
          text: "Exclude more incomplete records until the dataset is clean.",
        }),
        Object.freeze({
          id: "adjust-outcome",
          text: "Condition on post-treatment satisfaction and outcome.",
        }),
      ]),
      correctNextStep: "retention",
      explanation:
        "Restricting analysis to a common effect of treatment experience and outcome can create a selected association that was absent in the enrolled cohort.",
    }),
    outcomeDensity: Object.freeze({
      label: "A treatment that usually works",
      design:
        "A clinician uses a modality during nearly every acute flare. Most flares improve, and the memorable sequence is treatment followed by relief. Untreated or differently treated episodes are rarely observed.",
      claim: "Repeated experience proves that the modality causes recovery.",
      threats: Object.freeze(["comparison", "narrative", "outcomeDensity"]),
      warrants: Object.freeze([
        Object.freeze({
          id: "experience-proof",
          text: "Consistent personal experience establishes the causal effect.",
        }),
        Object.freeze({
          id: "pattern",
          text: "The repeated sequence is a signal worth investigating, but it does not distinguish treatment benefit from common improvement and selective experience.",
        }),
        Object.freeze({
          id: "experience-useless",
          text: "Clinical experience cannot generate useful hypotheses.",
        }),
      ]),
      correctWarrant: "pattern",
      nextSteps: Object.freeze([
        Object.freeze({
          id: "structured-comparison",
          text: "Collect outcomes prospectively across credible treated and comparison conditions with prespecified measures.",
        }),
        Object.freeze({
          id: "more-use",
          text: "Use the modality more often and count additional improvements.",
        }),
        Object.freeze({
          id: "testimonials",
          text: "Collect only the clearest patient success stories.",
        }),
      ]),
      correctNextStep: "structured-comparison",
      explanation:
        "When treatment and improvement are both frequent, they often co-occur even without an effect. A coherent repeated story can strengthen belief while the missing comparison remains missing.",
    }),
  });

  function sameSet(first, second) {
    return (
      first.size === second.size &&
      [...first].every((value) => second.has(value))
    );
  }

  function evaluateClaimAudit(
    scenarioId,
    selectedThreats,
    warrantId,
    nextStepId,
  ) {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) throw new RangeError(`Unknown scenario: ${scenarioId}`);
    if (!Array.isArray(selectedThreats)) {
      throw new TypeError("selectedThreats must be an array");
    }
    const selected = new Set(selectedThreats);
    selected.forEach((id) => {
      if (!THREATS[id]) throw new RangeError(`Unknown threat: ${id}`);
    });
    const expected = new Set(scenario.threats);
    const missed = [...expected].filter((id) => !selected.has(id));
    const extra = [...selected].filter((id) => !expected.has(id));
    const threatsCorrect = sameSet(selected, expected);
    const warrantCorrect = warrantId === scenario.correctWarrant;
    const nextStepCorrect = nextStepId === scenario.correctNextStep;

    return {
      scenarioId,
      correct: threatsCorrect && warrantCorrect && nextStepCorrect,
      threats: {
        correct: threatsCorrect,
        missed,
        extra,
        expected: [...expected],
      },
      warrantCorrect,
      nextStepCorrect,
      explanation: scenario.explanation,
    };
  }

  const causalClaimAuditLogic = { THREATS, SCENARIOS, evaluateClaimAudit };

  function initializeCausalClaimAudit(lab) {
    const scenarioControl = lab.querySelector("[data-audit-scenario]");
    const design = lab.querySelector("[data-audit-design]");
    const claim = lab.querySelector("[data-audit-claim]");
    const threatControls = lab.querySelector("[data-audit-threats]");
    const warrantControls = lab.querySelector("[data-audit-warrants]");
    const nextStepControl = lab.querySelector("[data-audit-next-step]");
    const feedback = lab.querySelector("[data-audit-feedback]");
    const feedbackHeading = lab.querySelector("[data-audit-feedback-heading]");
    const feedbackBody = lab.querySelector("[data-audit-feedback-body]");
    const status = lab.querySelector("[data-audit-status]");

    function renderScenario() {
      const scenario = SCENARIOS[scenarioControl.value];
      design.textContent = scenario.design;
      claim.textContent = scenario.claim;
      threatControls.replaceChildren();
      Object.entries(THREATS).forEach(([id, threat]) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${id}"><span><strong>${threat.label}</strong><small>${threat.category}</small></span>`;
        threatControls.append(label);
      });
      warrantControls.replaceChildren();
      scenario.warrants.forEach((warrant) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="audit-warrant" value="${warrant.id}"><span>${warrant.text}</span>`;
        warrantControls.append(label);
      });
      nextStepControl.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Choose the most discriminating next step";
      nextStepControl.append(placeholder);
      scenario.nextSteps.forEach((nextStep) => {
        const option = document.createElement("option");
        option.value = nextStep.id;
        option.textContent = nextStep.text;
        nextStepControl.append(option);
      });
      feedback.hidden = true;
      status.textContent = `${scenario.label} scenario loaded. Complete all three audit steps.`;
    }

    function checkAudit() {
      const selectedThreats = [
        ...threatControls.querySelectorAll("input:checked"),
      ].map((input) => input.value);
      const selectedWarrant = warrantControls.querySelector("input:checked");
      if (
        selectedThreats.length === 0 ||
        !selectedWarrant ||
        !nextStepControl.value
      ) {
        status.textContent =
          "Select at least one threat, a warranted conclusion, and a next step.";
        return;
      }
      const evaluation = evaluateClaimAudit(
        scenarioControl.value,
        selectedThreats,
        selectedWarrant.value,
        nextStepControl.value,
      );
      const expectedLabels = evaluation.threats.expected
        .map((id) => THREATS[id].label)
        .join(", ");
      const parts = [
        `Threat audit: ${evaluation.threats.correct ? "aligned" : `reconsider; scenario-supported threats are ${expectedLabels}`}.`,
        `Warranted conclusion: ${evaluation.warrantCorrect ? "aligned" : "reconsider the strength of the claim"}.`,
        `Next evidence: ${evaluation.nextStepCorrect ? "aligned" : "choose the step that best distinguishes the live alternatives"}.`,
      ];
      feedback.dataset.correct = evaluation.correct;
      feedbackHeading.textContent = evaluation.correct
        ? "Claim audit aligned"
        : "Revise the claim audit";
      feedbackBody.textContent = `${parts.join(" ")} ${evaluation.explanation}`;
      feedback.hidden = false;
      status.textContent = feedbackHeading.textContent;
    }

    scenarioControl.addEventListener("change", renderScenario);
    lab
      .querySelector("[data-audit-check]")
      .addEventListener("click", checkAudit);
    lab.querySelector("[data-audit-reset]").addEventListener("click", () => {
      scenarioControl.value = "prepost";
      renderScenario();
    });
    renderScenario();
  }

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-causal-claim-audit]")
      .forEach(initializeCausalClaimAudit);
  }

  if (typeof window !== "undefined") {
    window.causalClaimAuditLogic = causalClaimAuditLogic;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = causalClaimAuditLogic;
  }
})();
