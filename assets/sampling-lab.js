(() => {
  "use strict";

  const T_CRITICAL_95 = Object.freeze({
    4: 2.776,
    9: 2.262,
    24: 2.064,
    49: 2.01,
    99: 1.984,
  });

  function rollObservation(diceCount, random = Math.random) {
    let total = 0;

    for (let die = 0; die < diceCount; die += 1) {
      total += Math.floor(random() * 6) + 1;
    }

    return total;
  }

  function drawSample(diceCount, sampleSize, random = Math.random) {
    return Array.from({ length: sampleSize }, () =>
      rollObservation(diceCount, random),
    );
  }

  function mean(values) {
    return values.reduce((total, value) => total + value, 0) / values.length;
  }

  function sampleStandardDeviation(values, sampleMean = mean(values)) {
    const squaredDeviations = values.reduce(
      (total, value) => total + (value - sampleMean) ** 2,
      0,
    );

    return Math.sqrt(squaredDeviations / (values.length - 1));
  }

  function summarizeSample(values, populationMean) {
    const sampleMean = mean(values);
    const standardDeviation = sampleStandardDeviation(values, sampleMean);
    const standardError = standardDeviation / Math.sqrt(values.length);
    const criticalValue = T_CRITICAL_95[values.length - 1];

    if (!criticalValue) {
      throw new Error(`Unsupported sample size: ${values.length}`);
    }

    const marginOfError = criticalValue * standardError;
    const lowerBound = sampleMean - marginOfError;
    const upperBound = sampleMean + marginOfError;

    return {
      values,
      mean: sampleMean,
      standardDeviation,
      standardError,
      lowerBound,
      upperBound,
      capturesMean:
        lowerBound <= populationMean && populationMean <= upperBound,
    };
  }

  function populationDistribution(diceCount) {
    let counts = [1];

    for (let die = 0; die < diceCount; die += 1) {
      const nextCounts = Array(counts.length + 6).fill(0);

      counts.forEach((count, sum) => {
        for (let face = 1; face <= 6; face += 1) {
          nextCounts[sum + face] += count;
        }
      });

      counts = nextCounts;
    }

    const outcomeCount = 6 ** diceCount;

    return counts
      .map((count, sum) => ({
        sum,
        probability: count / outcomeCount,
      }))
      .filter(({ probability }) => probability > 0);
  }

  const samplingMath = {
    drawSample,
    mean,
    populationDistribution,
    rollObservation,
    sampleStandardDeviation,
    summarizeSample,
  };

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

  function formatNumber(value, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : "—";
  }

  function initializeSamplingLab(lab) {
    const diceInput = lab.querySelector("[data-dice-count]");
    const sampleSizeInput = lab.querySelector("[data-sample-size]");
    const populationChart = lab.querySelector("[data-population-chart]");
    const populationDescription = lab.querySelector(
      "[data-population-description]",
    );
    const observations = lab.querySelector("[data-observations]");
    const observationCount = lab.querySelector("[data-observation-count]");
    const samplingChart = lab.querySelector("[data-sampling-chart]");
    const intervalPlot = lab.querySelector("[data-interval-plot]");
    const status = lab.querySelector("[data-lab-status]");
    const interpretation = lab.querySelector("[data-interpretation]");
    const metrics = Object.fromEntries(
      [...lab.querySelectorAll("[data-metric]")].map((element) => [
        element.dataset.metric,
        element,
      ]),
    );
    const state = {
      diceCount: Number(diceInput.value),
      sampleSize: Number(sampleSizeInput.value),
      currentValues: [],
      summaries: [],
    };

    function populationMean() {
      return state.diceCount * 3.5;
    }

    function setMetric(name, value) {
      metrics[name].textContent = value;
    }

    function renderPopulation() {
      const distribution = populationDistribution(state.diceCount);
      const maximumProbability = Math.max(
        ...distribution.map(({ probability }) => probability),
      );
      const bars = distribution.map(({ sum, probability }) => {
        const bar = createElement("span", "sampling-lab__bar");
        bar.style.height = `${(probability / maximumProbability) * 100}%`;
        bar.title = `Sum ${sum}: ${(probability * 100).toFixed(1)}%`;
        return bar;
      });

      populationChart.replaceChildren(...bars);
      populationChart.setAttribute(
        "aria-label",
        `Exact distribution of sums from ${state.diceCount} fair ${state.diceCount === 1 ? "die" : "dice"}, ranging from ${state.diceCount} to ${state.diceCount * 6}.`,
      );
      populationDescription.textContent = `${state.diceCount} ${state.diceCount === 1 ? "die has" : "dice have"} a theoretical mean of ${formatNumber(populationMean(), 1)}. The bars show every possible sum and its exact probability.`;
      lab.querySelector("[data-population-min]").textContent = state.diceCount;
      lab.querySelector("[data-population-mean]").textContent = formatNumber(
        populationMean(),
        1,
      );
      lab.querySelector("[data-population-max]").textContent =
        state.diceCount * 6;
    }

    function renderObservations() {
      const visibleValues = state.currentValues.slice(0, 25);
      const valueElements = visibleValues.map((value) =>
        createElement("span", "sampling-lab__observation", String(value)),
      );

      if (state.currentValues.length > visibleValues.length) {
        valueElements.push(
          createElement(
            "span",
            "sampling-lab__observation sampling-lab__observation--more",
            `+${state.currentValues.length - visibleValues.length}`,
          ),
        );
      }

      if (valueElements.length === 0) {
        valueElements.push(
          createElement("span", "sampling-lab__empty", "No observations yet"),
        );
      }

      observations.replaceChildren(...valueElements);
      observationCount.textContent = `${state.currentValues.length} of ${state.sampleSize} observations`;
    }

    function renderLatestSummary() {
      const latest = state.summaries.at(-1);

      if (!latest) {
        setMetric("mean", "—");
        setMetric("sd", "—");
        setMetric("se", "—");
        setMetric("ci", "—");
        setMetric("result", "Draw a complete sample");
        return;
      }

      setMetric("mean", formatNumber(latest.mean));
      setMetric("sd", formatNumber(latest.standardDeviation));
      setMetric("se", formatNumber(latest.standardError));
      setMetric(
        "ci",
        `${formatNumber(latest.lowerBound)} to ${formatNumber(latest.upperBound)}`,
      );
      setMetric(
        "result",
        latest.capturesMean
          ? "Includes the population mean"
          : "Misses the population mean",
      );
      metrics.result.dataset.capturesMean = String(latest.capturesMean);
    }

    function renderSamplingDistribution() {
      if (state.summaries.length === 0) {
        samplingChart.replaceChildren(
          createElement(
            "span",
            "sampling-lab__empty",
            "Run samples to build the distribution",
          ),
        );
        samplingChart.removeAttribute("aria-label");
        return;
      }

      const minimum = state.diceCount;
      const maximum = state.diceCount * 6;
      const binCount = 20;
      const binWidth = (maximum - minimum) / binCount;
      const bins = Array(binCount).fill(0);

      state.summaries.forEach((summary) => {
        const index = Math.min(
          binCount - 1,
          Math.floor((summary.mean - minimum) / binWidth),
        );
        bins[Math.max(0, index)] += 1;
      });

      const maximumCount = Math.max(...bins);
      const bars = bins.map((count, index) => {
        const bar = createElement("span", "sampling-lab__bar");
        bar.style.height = `${(count / maximumCount) * 100}%`;
        bar.title = `${count} sample means from ${formatNumber(minimum + index * binWidth)} to ${formatNumber(minimum + (index + 1) * binWidth)}`;
        return bar;
      });

      samplingChart.replaceChildren(...bars);
      samplingChart.setAttribute(
        "aria-label",
        `Distribution of ${state.summaries.length} sample means. Their mean is ${formatNumber(mean(state.summaries.map((summary) => summary.mean)))} compared with the population mean of ${formatNumber(populationMean())}.`,
      );
    }

    function renderIntervals() {
      const recentSummaries = state.summaries.slice(-12);

      if (recentSummaries.length === 0) {
        intervalPlot.replaceChildren(
          createElement(
            "span",
            "sampling-lab__empty",
            "Confidence intervals will appear here",
          ),
        );
        return;
      }

      const plotMinimum = 0;
      const plotMaximum = state.diceCount * 7;
      const plotRange = plotMaximum - plotMinimum;
      const rows = recentSummaries.map((summary) => {
        const row = createElement(
          "span",
          `sampling-lab__interval-row${summary.capturesMean ? "" : " sampling-lab__interval-row--miss"}`,
        );
        const range = createElement("span", "sampling-lab__interval-range");
        const point = createElement("span", "sampling-lab__interval-point");
        const lowerBound = Math.max(plotMinimum, summary.lowerBound);
        const upperBound = Math.min(plotMaximum, summary.upperBound);
        const meanPosition = ((summary.mean - plotMinimum) / plotRange) * 100;

        range.style.left = `${((lowerBound - plotMinimum) / plotRange) * 100}%`;
        range.style.width = `${Math.max(0, ((upperBound - lowerBound) / plotRange) * 100)}%`;
        point.style.left = `${meanPosition}%`;
        row.append(range, point);
        return row;
      });
      const populationMarker = createElement(
        "span",
        "sampling-lab__population-marker",
      );
      populationMarker.style.left = `${(populationMean() / plotRange) * 100}%`;
      populationMarker.setAttribute("aria-hidden", "true");

      intervalPlot.replaceChildren(...rows, populationMarker);
      intervalPlot.setAttribute(
        "aria-label",
        `${recentSummaries.length} most recent confidence intervals; coral intervals miss the population mean.`,
      );
    }

    function renderCoverage() {
      const captured = state.summaries.filter(
        ({ capturesMean }) => capturesMean,
      ).length;
      const total = state.summaries.length;

      setMetric("samples", String(total));
      setMetric(
        "coverage",
        total === 0 ? "—" : `${((captured / total) * 100).toFixed(1)}%`,
      );

      if (total === 0) {
        interpretation.textContent =
          "Before you run 100 samples, predict what will vary and what will remain fixed.";
      } else if (total < 100) {
        interpretation.textContent =
          "One interval either captures the population mean or misses it. Coverage is a long-run property, so keep sampling.";
      } else {
        interpretation.textContent =
          "The population mean stays fixed while samples, estimates, and intervals vary. Repeat the batch and watch coverage fluctuate around 95%.";
      }
    }

    function render() {
      renderPopulation();
      renderObservations();
      renderLatestSummary();
      renderSamplingDistribution();
      renderIntervals();
      renderCoverage();
    }

    function addSample(values) {
      state.currentValues = values;
      state.summaries.push(summarizeSample(values, populationMean()));

      if (state.summaries.length > 5000) {
        state.summaries = state.summaries.slice(-5000);
      }
    }

    function reset(message = "Sampling Lab reset.") {
      state.currentValues = [];
      state.summaries = [];
      render();
      status.textContent = message;
    }

    lab.addEventListener("click", (event) => {
      const action = event.target.closest("button")?.dataset.action;

      if (action === "roll") {
        if (state.currentValues.length >= state.sampleSize) {
          state.currentValues = [];
        }

        state.currentValues.push(rollObservation(state.diceCount));

        if (state.currentValues.length === state.sampleSize) {
          addSample(state.currentValues);
          status.textContent = `Sample complete. Mean ${formatNumber(state.summaries.at(-1).mean)}.`;
        } else {
          status.textContent = `Rolled a sum of ${state.currentValues.at(-1)}.`;
        }

        render();
      }

      if (action === "sample") {
        addSample(drawSample(state.diceCount, state.sampleSize));
        render();
        status.textContent = `Drew one sample of ${state.sampleSize} observations.`;
      }

      if (action === "batch") {
        for (let sample = 0; sample < 100; sample += 1) {
          addSample(drawSample(state.diceCount, state.sampleSize));
        }

        render();
        status.textContent = `Added 100 samples. Coverage is now ${metrics.coverage.textContent}.`;
      }

      if (action === "reset") {
        reset();
      }
    });

    lab.addEventListener("change", (event) => {
      if (event.target === diceInput) {
        state.diceCount = Number(diceInput.value);
        reset(`Population changed to sums from ${state.diceCount} dice.`);
      }

      if (event.target === sampleSizeInput) {
        state.sampleSize = Number(sampleSizeInput.value);
        reset(`Sample size changed to ${state.sampleSize}.`);
      }
    });

    render();
  }

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-sampling-lab]")
      .forEach(initializeSamplingLab);
  }

  if (typeof window !== "undefined") {
    window.samplingLabMath = samplingMath;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = samplingMath;
  }
})();
