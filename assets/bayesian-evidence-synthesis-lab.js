(() => {
  "use strict";

  const Z_95 = 1.959963984540054;

  const SCENARIOS = Object.freeze({
    consistent: Object.freeze({
      label: "Three broadly consistent studies",
      studies: Object.freeze([
        Object.freeze({ effect: 3.2, standardError: 1.1 }),
        Object.freeze({ effect: 2.4, standardError: 0.8 }),
        Object.freeze({ effect: 3.8, standardError: 1.4 }),
      ]),
      heterogeneity: 0.5,
    }),
    conflicting: Object.freeze({
      label: "Studies with conflicting estimates",
      studies: Object.freeze([
        Object.freeze({ effect: 4.5, standardError: 1.1 }),
        Object.freeze({ effect: -1.2, standardError: 0.8 }),
        Object.freeze({ effect: 2.8, standardError: 1.4 }),
      ]),
      heterogeneity: 2,
    }),
    imprecise: Object.freeze({
      label: "Small, imprecise studies",
      studies: Object.freeze([
        Object.freeze({ effect: 4.2, standardError: 2.8 }),
        Object.freeze({ effect: 1.1, standardError: 2.3 }),
        Object.freeze({ effect: 3.6, standardError: 3.1 }),
      ]),
      heterogeneity: 1,
    }),
  });

  function assertFinite(value, name) {
    if (!Number.isFinite(value)) {
      throw new RangeError(`${name} must be finite`);
    }
  }

  function assertPositive(value, name) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new RangeError(`${name} must be greater than 0`);
    }
  }

  function assertNonnegative(value, name) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} must be 0 or greater`);
    }
  }

  function normalCdf(value) {
    const sign = value < 0 ? -1 : 1;
    const absoluteValue = Math.abs(value) / Math.sqrt(2);
    const t = 1 / (1 + 0.3275911 * absoluteValue);
    const polynomial =
      ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
        t +
        0.254829592) *
      t;
    const errorFunction =
      sign * (1 - polynomial * Math.exp(-(absoluteValue ** 2)));
    return 0.5 * (1 + errorFunction);
  }

  function interval(mean, standardDeviation) {
    return {
      lower: mean - Z_95 * standardDeviation,
      upper: mean + Z_95 * standardDeviation,
    };
  }

  function synthesizeEvidence({
    priorMean,
    priorStandardDeviation,
    studies,
    heterogeneity,
    meaningfulThreshold = 0,
  }) {
    assertFinite(priorMean, "priorMean");
    assertPositive(priorStandardDeviation, "priorStandardDeviation");
    assertNonnegative(heterogeneity, "heterogeneity");
    assertFinite(meaningfulThreshold, "meaningfulThreshold");

    if (!Array.isArray(studies) || studies.length === 0) {
      throw new RangeError("studies must contain at least one study");
    }

    const priorVariance = priorStandardDeviation ** 2;
    const priorPrecision = 1 / priorVariance;
    const preparedStudies = studies.map((study, index) => {
      assertFinite(study.effect, `studies[${index}].effect`);
      assertPositive(study.standardError, `studies[${index}].standardError`);
      const samplingVariance = study.standardError ** 2;
      const marginalVariance = samplingVariance + heterogeneity ** 2;
      const precision = 1 / marginalVariance;

      return {
        effect: study.effect,
        standardError: study.standardError,
        samplingInterval: interval(study.effect, study.standardError),
        marginalVariance,
        precision,
      };
    });
    const studyPrecision = preparedStudies.reduce(
      (sum, study) => sum + study.precision,
      0,
    );
    const totalPrecision = priorPrecision + studyPrecision;
    const posteriorVariance = 1 / totalPrecision;
    const posteriorStandardDeviation = Math.sqrt(posteriorVariance);
    const posteriorMean =
      (priorMean * priorPrecision +
        preparedStudies.reduce(
          (sum, study) => sum + study.effect * study.precision,
          0,
        )) /
      totalPrecision;
    const predictiveStandardDeviation = Math.sqrt(
      posteriorVariance + heterogeneity ** 2,
    );

    return {
      prior: {
        mean: priorMean,
        standardDeviation: priorStandardDeviation,
        interval: interval(priorMean, priorStandardDeviation),
        precision: priorPrecision,
        weight: priorPrecision / totalPrecision,
      },
      studies: preparedStudies.map((study) => ({
        ...study,
        weight: study.precision / totalPrecision,
      })),
      heterogeneity,
      meaningfulThreshold,
      posterior: {
        mean: posteriorMean,
        standardDeviation: posteriorStandardDeviation,
        interval: interval(posteriorMean, posteriorStandardDeviation),
        probabilityAboveZero: normalCdf(
          posteriorMean / posteriorStandardDeviation,
        ),
        probabilityAboveThreshold: normalCdf(
          (posteriorMean - meaningfulThreshold) / posteriorStandardDeviation,
        ),
      },
      prediction: {
        mean: posteriorMean,
        standardDeviation: predictiveStandardDeviation,
        interval: interval(posteriorMean, predictiveStandardDeviation),
        probabilityAboveZero: normalCdf(
          posteriorMean / predictiveStandardDeviation,
        ),
      },
    };
  }

  const bayesianEvidenceSynthesisMath = {
    SCENARIOS,
    normalCdf,
    synthesizeEvidence,
  };

  function formatEffect(value) {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
  }

  function formatInterval(value) {
    return `${formatEffect(value.lower)} to ${formatEffect(value.upper)}`;
  }

  function formatProbability(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

  function initializeEvidenceSynthesisLab(lab) {
    const controls = {
      scenario: lab.querySelector("[data-synthesis-scenario]"),
      priorMean: lab.querySelector("[data-prior-mean]"),
      priorStandardDeviation: lab.querySelector("[data-prior-sd]"),
      heterogeneity: lab.querySelector("[data-heterogeneity]"),
      meaningfulThreshold: lab.querySelector("[data-meaningful-threshold]"),
    };
    const studyControls = [1, 2, 3].map((number) => ({
      effect: lab.querySelector(`[data-study-${number}-effect]`),
      standardError: lab.querySelector(`[data-study-${number}-se]`),
    }));
    const outputs = Object.fromEntries(
      [...lab.querySelectorAll("[data-synthesis-output]")].map((element) => [
        element.dataset.synthesisOutput,
        element,
      ]),
    );
    const plot = lab.querySelector("[data-synthesis-plot]");
    const status = lab.querySelector("[data-synthesis-status]");

    function valuesFromControls() {
      return {
        priorMean: Number(controls.priorMean.value),
        priorStandardDeviation: Number(controls.priorStandardDeviation.value),
        heterogeneity: Number(controls.heterogeneity.value),
        meaningfulThreshold: Number(controls.meaningfulThreshold.value),
        studies: studyControls.map((study) => ({
          effect: Number(study.effect.value),
          standardError: Number(study.standardError.value),
        })),
      };
    }

    function position(value, minimum, maximum) {
      return ((value - minimum) / (maximum - minimum)) * 100;
    }

    function plotRow(
      { label, detail, mean, interval: rowInterval, type },
      scale,
    ) {
      const row = document.createElement("div");
      row.className = `synthesis-lab__plot-row synthesis-lab__plot-row--${type}`;
      const text = document.createElement("div");
      text.className = "synthesis-lab__plot-label";
      text.innerHTML = `<strong>${label}</strong><span>${detail}</span>`;
      const track = document.createElement("div");
      track.className = "synthesis-lab__plot-track";
      const line = document.createElement("i");
      line.className = "synthesis-lab__plot-interval";
      const lower = Math.max(rowInterval.lower, scale.minimum);
      const upper = Math.min(rowInterval.upper, scale.maximum);
      line.style.left = `${position(lower, scale.minimum, scale.maximum)}%`;
      line.style.width = `${position(upper, scale.minimum, scale.maximum) - position(lower, scale.minimum, scale.maximum)}%`;
      const point = document.createElement("b");
      point.className = "synthesis-lab__plot-point";
      point.style.left = `${position(mean, scale.minimum, scale.maximum)}%`;
      track.append(line, point);
      row.append(text, track);
      return row;
    }

    function renderPlot(result) {
      const rows = [
        {
          label: "Prior",
          detail: `95% interval ${formatInterval(result.prior.interval)}`,
          mean: result.prior.mean,
          interval: result.prior.interval,
          type: "prior",
        },
        ...result.studies.map((study, index) => ({
          label: `Study ${index + 1}`,
          detail: `Estimate ${formatEffect(study.effect)}; 95% interval ${formatInterval(study.samplingInterval)}`,
          mean: study.effect,
          interval: study.samplingInterval,
          type: "study",
        })),
        {
          label: "Pooled posterior",
          detail: `95% credible interval ${formatInterval(result.posterior.interval)}`,
          mean: result.posterior.mean,
          interval: result.posterior.interval,
          type: "posterior",
        },
        {
          label: "New-setting prediction",
          detail: `95% predictive interval ${formatInterval(result.prediction.interval)}`,
          mean: result.prediction.mean,
          interval: result.prediction.interval,
          type: "prediction",
        },
      ];
      const values = rows.flatMap((row) => [
        row.interval.lower,
        row.interval.upper,
        row.mean,
      ]);
      values.push(0, result.meaningfulThreshold);
      const rawMinimum = Math.min(...values);
      const rawMaximum = Math.max(...values);
      const padding = Math.max((rawMaximum - rawMinimum) * 0.08, 0.5);
      const scale = {
        minimum: rawMinimum - padding,
        maximum: rawMaximum + padding,
      };

      plot.replaceChildren();
      const axis = document.createElement("div");
      axis.className = "synthesis-lab__plot-axis";
      axis.innerHTML = `<span>${formatEffect(scale.minimum)}</span><span>Effect estimate</span><span>${formatEffect(scale.maximum)}</span>`;
      plot.append(axis);
      const markers = document.createElement("div");
      markers.className = "synthesis-lab__plot-markers";
      const zeroMarker = document.createElement("i");
      zeroMarker.style.left = `${position(0, scale.minimum, scale.maximum)}%`;
      zeroMarker.dataset.label = "No effect";
      const thresholdMarker = document.createElement("i");
      thresholdMarker.style.left = `${position(result.meaningfulThreshold, scale.minimum, scale.maximum)}%`;
      thresholdMarker.dataset.label = "MCID";
      markers.append(zeroMarker, thresholdMarker);
      plot.append(markers);
      rows.forEach((row) => plot.append(plotRow(row, scale)));
    }

    function render() {
      try {
        const result = synthesizeEvidence(valuesFromControls());
        outputs.priorMeanValue.textContent = formatEffect(result.prior.mean);
        outputs.priorStandardDeviationValue.textContent =
          result.prior.standardDeviation.toFixed(1);
        outputs.heterogeneityValue.textContent =
          result.heterogeneity.toFixed(1);
        outputs.meaningfulThresholdValue.textContent = formatEffect(
          result.meaningfulThreshold,
        );
        outputs.posteriorMean.textContent = formatEffect(result.posterior.mean);
        outputs.credibleInterval.textContent = formatInterval(
          result.posterior.interval,
        );
        outputs.probabilityAboveZero.textContent = formatProbability(
          result.posterior.probabilityAboveZero,
        );
        outputs.probabilityAboveThreshold.textContent = formatProbability(
          result.posterior.probabilityAboveThreshold,
        );
        outputs.thresholdLabel.textContent = formatEffect(
          result.meaningfulThreshold,
        );
        outputs.predictiveInterval.textContent = formatInterval(
          result.prediction.interval,
        );
        outputs.predictiveProbability.textContent = formatProbability(
          result.prediction.probabilityAboveZero,
        );
        outputs.priorWeight.textContent = formatProbability(
          result.prior.weight,
        );
        result.studies.forEach((study, index) => {
          outputs[`study${index + 1}Weight`].textContent = formatProbability(
            study.weight,
          );
        });
        outputs.interpretation.textContent = `Given this prior, these three estimates, and τ = ${result.heterogeneity.toFixed(1)}, the posterior probability that the pooled mean effect is greater than zero is ${formatProbability(result.posterior.probabilityAboveZero)}. The probability that it exceeds the selected meaningful threshold of ${formatEffect(result.meaningfulThreshold)} is ${formatProbability(result.posterior.probabilityAboveThreshold)}.`;
        renderPlot(result);
        status.textContent = `Pooled posterior ${formatEffect(result.posterior.mean)} with ${formatProbability(result.posterior.probabilityAboveZero)} probability above zero.`;
      } catch (error) {
        status.textContent = error.message;
      }
    }

    function loadScenario() {
      const scenario = SCENARIOS[controls.scenario.value];
      scenario.studies.forEach((study, index) => {
        studyControls[index].effect.value = study.effect;
        studyControls[index].standardError.value = study.standardError;
      });
      controls.heterogeneity.value = scenario.heterogeneity;
      render();
    }

    controls.scenario.addEventListener("change", loadScenario);
    [
      controls.priorMean,
      controls.priorStandardDeviation,
      controls.heterogeneity,
      controls.meaningfulThreshold,
      ...studyControls.flatMap((study) => [study.effect, study.standardError]),
    ].forEach((control) => control.addEventListener("input", render));
    lab
      .querySelector("[data-synthesis-reset]")
      .addEventListener("click", () => {
        controls.scenario.value = "consistent";
        controls.priorMean.value = "0";
        controls.priorStandardDeviation.value = "4";
        controls.meaningfulThreshold.value = "2";
        loadScenario();
      });
    loadScenario();
  }

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-bayesian-evidence-synthesis-lab]")
      .forEach(initializeEvidenceSynthesisLab);
  }

  if (typeof window !== "undefined") {
    window.bayesianEvidenceSynthesisMath = bayesianEvidenceSynthesisMath;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = bayesianEvidenceSynthesisMath;
  }
})();
