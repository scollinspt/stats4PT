(() => {
  "use strict";

  const DOMAIN_ITEMS = Object.freeze([
    {
      id: "reported-pain",
      prompt: "A patient reports a pain rating of 4/10 during assessment.",
      domain: "empirical",
      explanation:
        "The pain event is experienced by the patient and reported to the clinician, placing this description in the empirical domain.",
    },
    {
      id: "unrecorded-flare",
      prompt:
        "A symptom flare occurs overnight but is never reported or measured.",
      domain: "actual",
      explanation:
        "The event occurs whether or not anyone observes or records it, so it belongs to the actual domain.",
    },
    {
      id: "tissue-capacity",
      prompt:
        "A tissue has a causal capacity to respond to a change in mechanical loading.",
      domain: "real",
      explanation:
        "A causal capacity or mechanism can generate events, whether or not it is activated or observed, placing it in the real domain.",
    },
    {
      id: "home-loading",
      prompt:
        "Mechanical loading occurs during an unobserved home exercise session.",
      domain: "actual",
      explanation:
        "The loading is an event that occurs without being observed by the clinician, so the actual domain is the best classification.",
    },
    {
      id: "access-structure",
      prompt:
        "A clinic scheduling policy systematically limits access to follow-up care.",
      domain: "real",
      explanation:
        "The policy functions as a social structure with causal powers that can shape subsequent events and experiences.",
    },
    {
      id: "observed-motion",
      prompt:
        "A clinician observes and records an improvement in cervical range of motion.",
      domain: "empirical",
      explanation:
        "The event is observed and recorded as part of experience, making it empirical as well as something that actually occurred.",
    },
  ]);

  const OBSERVED_STUDY = Object.freeze({
    before: Object.freeze([7, 6, 8, 5, 7, 9, 6, 8, 7, 6, 8, 5, 7]),
    after: Object.freeze([4, 4, 5, 3, 5, 6, 4, 5, 5, 4, 5, 4, 4]),
  });

  const CAUSAL_WORLDS = Object.freeze({
    breathing: {
      title: "Breathing-specific effect",
      pathway:
        "Breathing exercises activate a relevant mechanism, which contributes to improvement.",
    },
    conventional: {
      title: "Conventional PT effect",
      pathway:
        "Conventional physiotherapy changes pain, while breathing changes alongside it without adding benefit.",
    },
    recovery: {
      title: "Natural history and regression",
      pathway:
        "Symptoms improve over time and unusually high baseline scores move closer to their typical values.",
    },
    expectation: {
      title: "Expectation and measurement",
      pathway:
        "Expectations, repeated measurement, and reporting changes contribute to the observed difference.",
    },
    mixed: {
      title: "Multiple contingent causes",
      pathway:
        "Treatment components, recovery, expectations, and patient context contribute by different amounts across patients.",
    },
  });

  function mean(values) {
    return values.reduce((total, value) => total + value, 0) / values.length;
  }

  function observedStudySummary() {
    const beforeMean = mean(OBSERVED_STUDY.before);
    const afterMean = mean(OBSERVED_STUDY.after);

    return {
      beforeMean,
      afterMean,
      improvement: beforeMean - afterMean,
      participantCount: OBSERVED_STUDY.before.length,
    };
  }

  function evaluateStudyDesign(design) {
    const randomizedComparison = design.comparison && design.randomization;

    return [
      {
        id: "change",
        claim: "Pain scores decreased after the bundled intervention.",
        status: "described",
        explanation:
          "The pre-post observations directly describe change in this group.",
      },
      {
        id: "bundle",
        claim: "The intervention bundle caused the improvement.",
        status: randomizedComparison ? "distinguished" : "not-distinguished",
        explanation: randomizedComparison
          ? "A randomized comparison helps distinguish the bundle from recovery, regression to the mean, and other time-related explanations."
          : "A concurrent comparison and random assignment are needed to better distinguish the bundle from other explanations.",
      },
      {
        id: "breathing",
        claim: "Breathing exercises added benefit beyond conventional PT.",
        status:
          randomizedComparison && design.separateArms
            ? "distinguished"
            : "not-distinguished",
        explanation:
          randomizedComparison && design.separateArms
            ? "Randomized, separate intervention arms can estimate the added contribution of breathing exercises."
            : "Separate intervention arms with random assignment are needed to isolate the added contribution of breathing exercises.",
      },
      {
        id: "mechanism",
        claim: "The proposed respiratory mechanism generated the effect.",
        status:
          randomizedComparison &&
          design.separateArms &&
          design.mechanismMeasurement
            ? "investigated"
            : "not-distinguished",
        explanation:
          randomizedComparison &&
          design.separateArms &&
          design.mechanismMeasurement
            ? "Repeated mechanism measurements can investigate whether the proposed pathway changes in the expected temporal sequence."
            : "The mechanism must be measured over time within a design that also distinguishes the intervention effect.",
      },
      {
        id: "durability",
        claim: "The improvement persists beyond one week.",
        status: design.followUp ? "investigated" : "not-distinguished",
        explanation: design.followUp
          ? "Longer follow-up provides observations about whether improvement persists."
          : "The one-week observation cannot establish durability.",
      },
      {
        id: "cointerventions",
        claim: "Concurrent treatments did not explain the difference.",
        status:
          randomizedComparison && design.trackCointerventions
            ? "investigated"
            : "not-distinguished",
        explanation:
          randomizedComparison && design.trackCointerventions
            ? "Tracking concurrent treatments helps assess imbalance and alternative treatment explanations."
            : "Concurrent treatments must be measured and compared between groups.",
      },
    ];
  }

  function seededRandom(seed) {
    let state = seed >>> 0;

    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalRandom(random) {
    const first = Math.max(random(), Number.EPSILON);
    const second = random();
    return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
  }

  function averageFor(patients, predicate) {
    const selected = patients.filter(predicate);

    return {
      count: selected.length,
      mean:
        selected.length === 0
          ? null
          : mean(selected.map(({ improvement }) => improvement)),
    };
  }

  function difference(first, second) {
    return first.mean === null || second.mean === null
      ? null
      : first.mean - second.mean;
  }

  function simulateMechanismCohort(settings) {
    const random = seededRandom(settings.seed);
    const patients = Array.from({ length: settings.cohortSize }, () => {
      const treated = random() < 0.5;
      const mechanismPresent = random() < settings.mechanismPrevalence;
      const contextSupports = random() < settings.contextSupport;
      const mechanismActivated = treated && mechanismPresent && contextSupports;
      const naturalChange = 0.8 + normalRandom(random) * 0.9;
      const improvement =
        naturalChange +
        (mechanismActivated ? settings.activatedEffect : 0) +
        normalRandom(random) * 0.45;

      return {
        treated,
        mechanismPresent,
        contextSupports,
        mechanismActivated,
        improvement,
      };
    });
    const treated = averageFor(patients, (patient) => patient.treated);
    const comparison = averageFor(patients, (patient) => !patient.treated);
    const responsiveTreated = averageFor(
      patients,
      (patient) =>
        patient.treated && patient.mechanismPresent && patient.contextSupports,
    );
    const responsiveComparison = averageFor(
      patients,
      (patient) =>
        !patient.treated && patient.mechanismPresent && patient.contextSupports,
    );
    const nonresponsiveTreated = averageFor(
      patients,
      (patient) =>
        patient.treated &&
        !(patient.mechanismPresent && patient.contextSupports),
    );
    const nonresponsiveComparison = averageFor(
      patients,
      (patient) =>
        !patient.treated &&
        !(patient.mechanismPresent && patient.contextSupports),
    );

    return {
      patients,
      treated,
      comparison,
      overallEffect: difference(treated, comparison),
      responsiveEffect: difference(responsiveTreated, responsiveComparison),
      nonresponsiveEffect: difference(
        nonresponsiveTreated,
        nonresponsiveComparison,
      ),
      activatedCount: patients.filter(({ mechanismActivated }) =>
        Boolean(mechanismActivated),
      ).length,
    };
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function formatNumber(value, digits = 1) {
    if (value === null || !Number.isFinite(value)) {
      return "Not estimable";
    }

    const displayValue = Math.abs(value) < 0.05 ? 0 : value;
    return displayValue.toFixed(digits);
  }

  function initializeDomainSort(activity) {
    const itemContainer = activity.querySelector("[data-domain-items]");
    const progress = activity.querySelector("[data-domain-progress]");
    const summary = activity.querySelector("[data-domain-summary]");
    const status = activity.querySelector("[data-domain-status]");
    const answers = new Map();

    function renderProgress() {
      const correct = DOMAIN_ITEMS.filter(
        ({ id, domain }) => answers.get(id) === domain,
      ).length;
      progress.textContent = `${answers.size} of ${DOMAIN_ITEMS.length} classified`;

      if (answers.size === DOMAIN_ITEMS.length) {
        summary.hidden = false;
        summary.textContent = `${correct} of ${DOMAIN_ITEMS.length} classifications match. Remember that these domains are nested: an experienced event also occurs, while real mechanisms and structures may exist without generating an observed event.`;
      } else {
        summary.hidden = true;
      }
    }

    function buildItem(item, index) {
      const card = createElement("article", "causal-lab__sort-card");
      const heading = createElement(
        "h5",
        "causal-lab__sort-heading",
        `Scenario ${index + 1}`,
      );
      const prompt = createElement("p", null, item.prompt);
      const choices = createElement("div", "causal-lab__choice-group");
      const feedback = createElement("p", "causal-lab__feedback");
      choices.setAttribute("role", "group");
      choices.setAttribute(
        "aria-label",
        `Choose the best domain for scenario ${index + 1}`,
      );
      feedback.setAttribute("aria-live", "polite");

      ["empirical", "actual", "real"].forEach((domain) => {
        const button = createElement(
          "button",
          "causal-lab__choice",
          domain[0].toUpperCase() + domain.slice(1),
        );
        button.type = "button";
        button.dataset.domainId = item.id;
        button.dataset.domainAnswer = domain;
        button.setAttribute("aria-pressed", "false");
        choices.append(button);
      });

      card.append(heading, prompt, choices, feedback);
      return card;
    }

    itemContainer.replaceChildren(...DOMAIN_ITEMS.map(buildItem));
    renderProgress();

    activity.addEventListener("click", (event) => {
      const answerButton = event.target.closest("[data-domain-answer]");

      if (answerButton) {
        const item = DOMAIN_ITEMS.find(
          ({ id }) => id === answerButton.dataset.domainId,
        );
        const selectedDomain = answerButton.dataset.domainAnswer;
        const card = answerButton.closest(".causal-lab__sort-card");
        const isCorrect = selectedDomain === item.domain;

        answers.set(item.id, selectedDomain);
        card.querySelectorAll("[data-domain-answer]").forEach((button) => {
          button.setAttribute("aria-pressed", String(button === answerButton));
        });
        card.dataset.correct = String(isCorrect);
        card.querySelector(".causal-lab__feedback").textContent =
          `${isCorrect ? "Matches." : `Consider the ${item.domain} domain.`} ${item.explanation}`;
        status.textContent = `Scenario ${DOMAIN_ITEMS.indexOf(item) + 1}: ${isCorrect ? "classification matches" : "review the explanation"}.`;
        renderProgress();
      }

      if (event.target.closest("[data-domain-reset]")) {
        answers.clear();
        activity.querySelectorAll("[data-domain-answer]").forEach((button) => {
          button.setAttribute("aria-pressed", "false");
        });
        activity.querySelectorAll(".causal-lab__sort-card").forEach((card) => {
          delete card.dataset.correct;
          card.querySelector(".causal-lab__feedback").textContent = "";
        });
        status.textContent = "Domain Sort reset.";
        renderProgress();
      }
    });
  }

  function initializeMechanismLab(activity) {
    const prevalenceInput = activity.querySelector(
      "[data-mechanism-prevalence]",
    );
    const contextInput = activity.querySelector("[data-context-support]");
    const effectInput = activity.querySelector("[data-activated-effect]");
    const cohort = activity.querySelector("[data-mechanism-cohort]");
    const interpretation = activity.querySelector(
      "[data-mechanism-interpretation]",
    );
    const status = activity.querySelector("[data-mechanism-status]");
    const metrics = Object.fromEntries(
      [...activity.querySelectorAll("[data-mechanism-metric]")].map(
        (element) => [element.dataset.mechanismMetric, element],
      ),
    );
    let seed = 73;

    function settings() {
      return {
        seed,
        cohortSize: 400,
        mechanismPrevalence: Number(prevalenceInput.value) / 100,
        contextSupport: Number(contextInput.value) / 100,
        activatedEffect: Number(effectInput.value),
      };
    }

    function updateControlValues() {
      activity.querySelector("[data-prevalence-value]").textContent =
        `${prevalenceInput.value}%`;
      activity.querySelector("[data-context-value]").textContent =
        `${contextInput.value}%`;
      activity.querySelector("[data-effect-value]").textContent =
        `${effectInput.value} points`;
    }

    function renderBar(name, value, maximum) {
      const bar = activity.querySelector(`[data-effect-bar="${name}"]`);
      const width =
        value === null ? 0 : Math.min(100, (Math.abs(value) / maximum) * 100);
      bar.style.width = `${width}%`;
      bar.dataset.negative = String(value !== null && value < 0);
    }

    function render() {
      updateControlValues();
      const result = simulateMechanismCohort(settings());
      const visiblePatients = result.patients.slice(0, 100);
      const dots = visiblePatients.map((patient) => {
        let className = "causal-lab__person";

        if (patient.mechanismActivated) {
          className += " causal-lab__person--activated";
        } else if (patient.mechanismPresent && patient.contextSupports) {
          className += " causal-lab__person--responsive";
        } else if (patient.treated) {
          className += " causal-lab__person--treated";
        }

        return createElement("span", className);
      });

      cohort.replaceChildren(...dots);
      cohort.setAttribute(
        "aria-label",
        `First 100 people in a hypothetical cohort. ${result.activatedCount} of 400 people received treatment while both the mechanism and supportive context were present.`,
      );
      metrics.treated.textContent = `${formatNumber(result.treated.mean)} points`;
      metrics.comparison.textContent = `${formatNumber(result.comparison.mean)} points`;
      metrics.overall.textContent = `${formatNumber(result.overallEffect)} points`;
      metrics.responsive.textContent = `${formatNumber(result.responsiveEffect)} points`;
      metrics.nonresponsive.textContent = `${formatNumber(result.nonresponsiveEffect)} points`;
      metrics.activated.textContent = `${result.activatedCount} of 400`;
      renderBar("overall", result.overallEffect, settings().activatedEffect);
      renderBar(
        "responsive",
        result.responsiveEffect,
        settings().activatedEffect,
      );
      renderBar(
        "nonresponsive",
        result.nonresponsiveEffect,
        settings().activatedEffect,
      );
      interpretation.textContent =
        result.overallEffect < result.responsiveEffect * 0.5
          ? "The overall average substantially dilutes the effect in people for whom both the mechanism and supportive context are present."
          : "With this combination of prevalence and context, the overall average more closely reflects the responsive subgroup effect.";
    }

    activity.addEventListener("input", (event) => {
      if ([prevalenceInput, contextInput, effectInput].includes(event.target)) {
        render();
        status.textContent = "Hypothetical cohort updated.";
      }
    });

    activity.addEventListener("click", (event) => {
      if (event.target.closest("[data-rerun-cohort]")) {
        seed += 1;
        render();
        status.textContent = "Generated another hypothetical cohort.";
      }
    });

    render();
  }

  function initializeInferenceLab(activity) {
    const worldInput = activity.querySelector("[data-causal-world]");
    const observedChart = activity.querySelector("[data-observed-chart]");
    const worldTitle = activity.querySelector("[data-world-title]");
    const worldPathway = activity.querySelector("[data-world-pathway]");
    const claims = activity.querySelector("[data-design-claims]");
    const status = activity.querySelector("[data-inference-status]");
    const summary = observedStudySummary();

    function renderObservedData() {
      const rows = OBSERVED_STUDY.before.map((before, index) => {
        const row = createElement("div", "causal-lab__patient-row");
        const label = createElement(
          "span",
          "causal-lab__patient-label",
          `P${index + 1}`,
        );
        const bars = createElement("span", "causal-lab__paired-bars");
        const beforeBar = createElement(
          "span",
          "causal-lab__score causal-lab__score--before",
          String(before),
        );
        const afterBar = createElement(
          "span",
          "causal-lab__score causal-lab__score--after",
          String(OBSERVED_STUDY.after[index]),
        );
        beforeBar.style.width = `${before * 10}%`;
        afterBar.style.width = `${OBSERVED_STUDY.after[index] * 10}%`;
        bars.append(beforeBar, afterBar);
        row.append(label, bars);
        return row;
      });

      observedChart.replaceChildren(...rows);
      observedChart.setAttribute(
        "aria-label",
        `Illustrative pain scores for ${summary.participantCount} patients decreased from a mean of ${formatNumber(summary.beforeMean)} to ${formatNumber(summary.afterMean)}, an improvement of ${formatNumber(summary.improvement)} points.`,
      );
      activity.querySelector("[data-before-mean]").textContent = formatNumber(
        summary.beforeMean,
      );
      activity.querySelector("[data-after-mean]").textContent = formatNumber(
        summary.afterMean,
      );
      activity.querySelector("[data-change-mean]").textContent = formatNumber(
        summary.improvement,
      );
    }

    function renderWorld() {
      const world = CAUSAL_WORLDS[worldInput.value];
      worldTitle.textContent = world.title;
      worldPathway.textContent = world.pathway;
    }

    function currentDesign() {
      return Object.fromEntries(
        [...activity.querySelectorAll("[data-design-feature]")].map((input) => [
          input.dataset.designFeature,
          input.checked,
        ]),
      );
    }

    function renderClaims() {
      const claimElements = evaluateStudyDesign(currentDesign()).map((item) => {
        const card = createElement(
          "article",
          `causal-lab__claim causal-lab__claim--${item.status}`,
        );
        const heading = createElement("h5", null, item.claim);
        const label = createElement(
          "span",
          "causal-lab__claim-status",
          item.status === "described"
            ? "Described"
            : item.status === "distinguished"
              ? "Better distinguished"
              : item.status === "investigated"
                ? "Can be investigated"
                : "Not distinguished",
        );
        const explanation = createElement("p", null, item.explanation);
        card.append(label, heading, explanation);
        return card;
      });

      claims.replaceChildren(...claimElements);
    }

    activity.addEventListener("change", (event) => {
      if (event.target === worldInput) {
        renderWorld();
        status.textContent =
          "Possible explanation changed; the observed scores stayed the same.";
      }

      if (event.target.matches("[data-design-feature]")) {
        renderClaims();
        status.textContent = "Study design and warranted claims updated.";
      }
    });

    renderObservedData();
    renderWorld();
    renderClaims();
  }

  const causalityLabs = {
    CAUSAL_WORLDS,
    DOMAIN_ITEMS,
    OBSERVED_STUDY,
    evaluateStudyDesign,
    observedStudySummary,
    seededRandom,
    simulateMechanismCohort,
  };

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-domain-sort]")
      .forEach(initializeDomainSort);
    document
      .querySelectorAll("[data-mechanism-lab]")
      .forEach(initializeMechanismLab);
    document
      .querySelectorAll("[data-inference-lab]")
      .forEach(initializeInferenceLab);
  }

  if (typeof window !== "undefined") {
    window.causalityLabs = causalityLabs;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = causalityLabs;
  }
})();
