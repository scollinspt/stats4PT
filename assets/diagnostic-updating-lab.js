(() => {
  "use strict";

  const REFERENCE_POPULATION = 100000;

  const LITERATURE_PRESETS = Object.freeze({
    spurlingA: Object.freeze({
      label: "Spurling test A: cervical radiculopathy",
      sensitivityPercent: 50,
      specificityPercent: 86,
      population:
        "82 people referred with suspected cervical radiculopathy or carpal tunnel syndrome; 19 met the reference standard.",
      threshold: "Spurling test A performed without cervical rotation.",
      referenceStandard: "Needle EMG and nerve-conduction testing.",
      sourceLabel: "Wainner et al. (2003), summarized by Rubinstein et al.",
      sourceUrl: "https://europepmc.org/articles/PMC2200707#Tab4",
    }),
    ulttA: Object.freeze({
      label: "Upper limb tension test A: cervical radiculopathy",
      sensitivityPercent: 97,
      specificityPercent: 22,
      population:
        "82 people referred with suspected cervical radiculopathy or carpal tunnel syndrome; 19 met the reference standard.",
      threshold:
        "Upper limb tension test A as operationalized by Wainner et al.",
      referenceStandard: "Needle EMG and nerve-conduction testing.",
      sourceLabel: "Wainner et al. (2003), summarized by Rubinstein et al.",
      sourceUrl: "https://europepmc.org/articles/PMC2200707#Tab4",
    }),
    sijComposite: Object.freeze({
      label: "SIJ provocation composite: symptomatic SIJ",
      sensitivityPercent: 94,
      specificityPercent: 78,
      population: "48 people examined for suspected sacroiliac joint pain.",
      threshold: "Three or more positive tests in a six-test composite.",
      referenceStandard:
        "Pain response to intra-articular local-anesthetic SIJ injection.",
      sourceLabel: "Laslett et al. (2005)",
      sourceUrl: "https://europepmc.org/article/MED/16038856",
    }),
  });

  function assertPercentage(value, name) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new RangeError(`${name} must be between 0 and 100`);
    }
  }

  function assertCount(value, name) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} must be a nonnegative number`);
    }
  }

  function divideOrNull(numerator, denominator) {
    return denominator === 0 ? null : numerator / denominator;
  }

  function metricsFromCounts(a, b, c, d) {
    [a, b, c, d].forEach((value, index) => {
      assertCount(value, ["a", "b", "c", "d"][index]);
    });

    const conditionPresent = a + c;
    const conditionAbsent = b + d;
    const findingPositive = a + b;
    const findingNegative = c + d;
    const total = conditionPresent + conditionAbsent;
    const sensitivity = divideOrNull(a, conditionPresent);
    const specificity = divideOrNull(d, conditionAbsent);
    const falsePositiveRate = divideOrNull(b, conditionAbsent);
    const falseNegativeRate = divideOrNull(c, conditionPresent);
    const positivePredictiveValue = divideOrNull(a, findingPositive);
    const negativePredictiveValue = divideOrNull(d, findingNegative);
    const prevalence = divideOrNull(conditionPresent, total);
    const positiveLikelihoodRatio =
      sensitivity === null || falsePositiveRate === null
        ? null
        : falsePositiveRate === 0
          ? sensitivity === 0
            ? 0
            : Infinity
          : sensitivity / falsePositiveRate;
    const negativeLikelihoodRatio =
      falseNegativeRate === null || specificity === null
        ? null
        : specificity === 0
          ? falseNegativeRate === 0
            ? 0
            : Infinity
          : falseNegativeRate / specificity;

    return {
      cells: { a, b, c, d },
      totals: {
        conditionPresent,
        conditionAbsent,
        findingPositive,
        findingNegative,
        total,
      },
      sensitivity,
      specificity,
      falsePositiveRate,
      falseNegativeRate,
      positivePredictiveValue,
      negativePredictiveValue,
      positiveConditionProbability: positivePredictiveValue,
      negativeConditionProbability:
        negativePredictiveValue === null ? null : 1 - negativePredictiveValue,
      prevalence,
      positiveLikelihoodRatio,
      negativeLikelihoodRatio,
    };
  }

  function tableFromProperties(
    priorPercent,
    sensitivityPercent,
    specificityPercent,
    populationSize = REFERENCE_POPULATION,
  ) {
    assertPercentage(priorPercent, "priorPercent");
    assertPercentage(sensitivityPercent, "sensitivityPercent");
    assertPercentage(specificityPercent, "specificityPercent");

    if (!Number.isInteger(populationSize) || populationSize <= 0) {
      throw new RangeError("populationSize must be a positive integer");
    }

    const conditionPresent = populationSize * (priorPercent / 100);
    const conditionAbsent = populationSize - conditionPresent;
    const a = conditionPresent * (sensitivityPercent / 100);
    const c = conditionPresent - a;
    const d = conditionAbsent * (specificityPercent / 100);
    const b = conditionAbsent - d;

    return metricsFromCounts(a, b, c, d);
  }

  function posteriorFromPriorAndLikelihood(priorProbability, likelihoodRatio) {
    if (
      !Number.isFinite(priorProbability) ||
      priorProbability < 0 ||
      priorProbability > 1
    ) {
      throw new RangeError("priorProbability must be between 0 and 1");
    }

    if (
      likelihoodRatio === null ||
      Number.isNaN(likelihoodRatio) ||
      likelihoodRatio < 0
    ) {
      return null;
    }

    if (priorProbability === 0 || likelihoodRatio === 0) {
      return 0;
    }

    if (priorProbability === 1 || likelihoodRatio === Infinity) {
      return 1;
    }

    const priorOdds = priorProbability / (1 - priorProbability);
    const posteriorOdds = priorOdds * likelihoodRatio;
    return posteriorOdds / (1 + posteriorOdds);
  }

  const diagnosticUpdatingMath = {
    LITERATURE_PRESETS,
    REFERENCE_POPULATION,
    metricsFromCounts,
    posteriorFromPriorAndLikelihood,
    tableFromProperties,
  };

  function formatCount(value) {
    const options = Number.isInteger(value)
      ? { maximumFractionDigits: 0 }
      : { minimumFractionDigits: 1, maximumFractionDigits: 1 };
    return value.toLocaleString("en-US", options);
  }

  function formatPercent(value) {
    return value === null ? "Not estimable" : `${(value * 100).toFixed(1)}%`;
  }

  function formatRatio(value) {
    if (value === null) {
      return "Not estimable";
    }

    return Number.isFinite(value) ? value.toFixed(2) : "Infinite";
  }

  function initializeDiagnosticUpdatingLab(lab) {
    const modeButtons = [...lab.querySelectorAll("[data-diagnostic-mode]")];
    const modePanels = [...lab.querySelectorAll("[data-mode-panel]")];
    const firstResultButtons = [...lab.querySelectorAll("[data-first-result]")];
    const secondResultButtons = [
      ...lab.querySelectorAll("[data-second-result]"),
    ];
    const outputs = Object.fromEntries(
      [...lab.querySelectorAll("[data-diagnostic-output]")].map((element) => [
        element.dataset.diagnosticOutput,
        element,
      ]),
    );
    const controls = {
      prior: lab.querySelector("[data-property-prior]"),
      sensitivity: lab.querySelector("[data-property-sensitivity]"),
      specificity: lab.querySelector("[data-property-specificity]"),
      preset: lab.querySelector("[data-literature-preset]"),
      literaturePrior: lab.querySelector("[data-literature-prior]"),
      secondSensitivity: lab.querySelector("[data-second-sensitivity]"),
      secondSpecificity: lab.querySelector("[data-second-specificity]"),
    };
    const rawInputs = Object.fromEntries(
      [...lab.querySelectorAll("[data-raw-cell]")].map((input) => [
        input.dataset.rawCell,
        input,
      ]),
    );
    const tableValues = Object.fromEntries(
      [...lab.querySelectorAll("[data-table-value]")].map((element) => [
        element.dataset.tableValue,
        element,
      ]),
    );
    const sourceLink = lab.querySelector("[data-preset-source-link]");
    const status = lab.querySelector("[data-diagnostic-status]");
    const state = {
      mode: "properties",
      firstResult: "positive",
      secondResult: "negative",
    };

    function metricsForCurrentMode() {
      if (state.mode === "raw") {
        return metricsFromCounts(
          Number(rawInputs.a.value),
          Number(rawInputs.b.value),
          Number(rawInputs.c.value),
          Number(rawInputs.d.value),
        );
      }

      if (state.mode === "literature") {
        const preset = LITERATURE_PRESETS[controls.preset.value];
        return tableFromProperties(
          Number(controls.literaturePrior.value),
          preset.sensitivityPercent,
          preset.specificityPercent,
        );
      }

      return tableFromProperties(
        Number(controls.prior.value),
        Number(controls.sensitivity.value),
        Number(controls.specificity.value),
      );
    }

    function setPressed(buttons, selectedValue, dataName) {
      buttons.forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset[dataName] === selectedValue),
        );
      });
    }

    function renderMode() {
      modeButtons.forEach((button) => {
        const selected = button.dataset.diagnosticMode === state.mode;
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      modePanels.forEach((panel) => {
        panel.hidden = panel.dataset.modePanel !== state.mode;
      });
      Object.values(rawInputs).forEach((input) => {
        input.hidden = state.mode !== "raw";
      });
      Object.values(tableValues)
        .filter((element) => element.dataset.tableValue.length === 1)
        .forEach((element) => {
          element.hidden = state.mode === "raw";
        });
      lab.dataset.mode = state.mode;
    }

    function renderPreset() {
      const preset = LITERATURE_PRESETS[controls.preset.value];
      outputs.presetSensitivity.textContent = `${preset.sensitivityPercent}%`;
      outputs.presetSpecificity.textContent = `${preset.specificityPercent}%`;
      outputs.presetPopulation.textContent = preset.population;
      outputs.presetThreshold.textContent = preset.threshold;
      outputs.presetReference.textContent = preset.referenceStandard;
      sourceLink.textContent = preset.sourceLabel;
      sourceLink.href = preset.sourceUrl;
    }

    function renderTable(metrics) {
      const { a, b, c, d } = metrics.cells;
      const { totals } = metrics;
      const values = {
        a,
        b,
        c,
        d,
        findingPositive: totals.findingPositive,
        findingNegative: totals.findingNegative,
        conditionPresent: totals.conditionPresent,
        conditionAbsent: totals.conditionAbsent,
        total: totals.total,
      };

      Object.entries(values).forEach(([name, value]) => {
        tableValues[name].textContent = formatCount(value);
      });
    }

    function renderMetrics(metrics) {
      outputs.sensitivity.textContent = formatPercent(metrics.sensitivity);
      outputs.specificity.textContent = formatPercent(metrics.specificity);
      outputs.positiveLikelihoodRatio.textContent = formatRatio(
        metrics.positiveLikelihoodRatio,
      );
      outputs.negativeLikelihoodRatio.textContent = formatRatio(
        metrics.negativeLikelihoodRatio,
      );
      outputs.positivePredictiveValue.textContent = formatPercent(
        metrics.positivePredictiveValue,
      );
      outputs.negativePredictiveValue.textContent = formatPercent(
        metrics.negativePredictiveValue,
      );
      outputs.prevalence.textContent = formatPercent(metrics.prevalence);
    }

    function renderUpdates(metrics) {
      const firstIsPositive = state.firstResult === "positive";
      const firstPosterior = firstIsPositive
        ? metrics.positiveConditionProbability
        : metrics.negativeConditionProbability;
      const firstLikelihoodRatio = firstIsPositive
        ? metrics.positiveLikelihoodRatio
        : metrics.negativeLikelihoodRatio;
      const secondSensitivity = Number(controls.secondSensitivity.value) / 100;
      const secondSpecificity = Number(controls.secondSpecificity.value) / 100;
      const secondLikelihoodRatio =
        state.secondResult === "positive"
          ? 1 - secondSpecificity === 0
            ? secondSensitivity === 0
              ? 0
              : Infinity
            : secondSensitivity / (1 - secondSpecificity)
          : secondSpecificity === 0
            ? 1 - secondSensitivity === 0
              ? 0
              : Infinity
            : (1 - secondSensitivity) / secondSpecificity;
      const secondPosterior =
        firstPosterior === null
          ? null
          : posteriorFromPriorAndLikelihood(
              firstPosterior,
              secondLikelihoodRatio,
            );

      setPressed(firstResultButtons, state.firstResult, "firstResult");
      setPressed(secondResultButtons, state.secondResult, "secondResult");
      outputs.firstResultLabel.textContent = firstIsPositive
        ? "Positive finding"
        : "Negative finding";
      outputs.firstPrior.textContent = formatPercent(metrics.prevalence);
      outputs.firstLikelihoodRatio.textContent =
        formatRatio(firstLikelihoodRatio);
      outputs.firstPosterior.textContent = formatPercent(firstPosterior);
      outputs.firstPosteriorBar.style.width = `${(firstPosterior ?? 0) * 100}%`;
      outputs.secondSensitivityValue.textContent = `${controls.secondSensitivity.value}%`;
      outputs.secondSpecificityValue.textContent = `${controls.secondSpecificity.value}%`;
      outputs.secondResultLabel.textContent =
        state.secondResult === "positive"
          ? "Positive second finding"
          : "Negative second finding";
      outputs.secondPrior.textContent = formatPercent(firstPosterior);
      outputs.secondLikelihoodRatio.textContent = formatRatio(
        secondLikelihoodRatio,
      );
      outputs.secondPosterior.textContent = formatPercent(secondPosterior);
      outputs.secondPosteriorBar.style.width = `${(secondPosterior ?? 0) * 100}%`;
      status.textContent = `The ${state.firstResult} finding updates the probability to ${formatPercent(firstPosterior)}. The ${state.secondResult} second finding updates it to ${formatPercent(secondPosterior)}.`;
    }

    function render() {
      renderMode();
      renderPreset();
      const metrics = metricsForCurrentMode();
      renderTable(metrics);
      renderMetrics(metrics);
      renderUpdates(metrics);
      outputs.priorValue.textContent = `${controls.prior.value}%`;
      outputs.sensitivityValue.textContent = `${controls.sensitivity.value}%`;
      outputs.specificityValue.textContent = `${controls.specificity.value}%`;
      outputs.literaturePriorValue.textContent = `${controls.literaturePrior.value}%`;
    }

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.diagnosticMode;
        render();
      });
      button.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
          return;
        }

        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const currentIndex = modeButtons.indexOf(button);
        const nextIndex =
          (currentIndex + direction + modeButtons.length) % modeButtons.length;
        modeButtons[nextIndex].click();
        modeButtons[nextIndex].focus();
      });
    });
    firstResultButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.firstResult = button.dataset.firstResult;
        render();
      });
    });
    secondResultButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.secondResult = button.dataset.secondResult;
        render();
      });
    });
    Object.values(controls).forEach((control) => {
      control.addEventListener("input", render);
      control.addEventListener("change", render);
    });
    Object.values(rawInputs).forEach((input) => {
      input.addEventListener("input", render);
    });
    lab
      .querySelector("[data-diagnostic-reset]")
      .addEventListener("click", () => {
        state.mode = "properties";
        state.firstResult = "positive";
        state.secondResult = "negative";
        controls.prior.value = "10";
        controls.sensitivity.value = "80";
        controls.specificity.value = "80";
        controls.preset.value = "spurlingA";
        controls.literaturePrior.value = "20";
        controls.secondSensitivity.value = "90";
        controls.secondSpecificity.value = "70";
        Object.assign(rawInputs.a, { value: "80" });
        Object.assign(rawInputs.b, { value: "180" });
        Object.assign(rawInputs.c, { value: "20" });
        Object.assign(rawInputs.d, { value: "720" });
        render();
      });
    render();
  }

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-diagnostic-updating-lab]")
      .forEach(initializeDiagnosticUpdatingLab);
  }

  if (typeof window !== "undefined") {
    window.diagnosticUpdatingMath = diagnosticUpdatingMath;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = diagnosticUpdatingMath;
  }
})();
