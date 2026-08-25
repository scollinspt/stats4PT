(() => {
  "use strict";

  const POPULATION_SIZE = 100000;

  function assertProbability(value, name) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new RangeError(`${name} must be between 0 and 100`);
    }
  }

  function calculateUpdate(
    priorPercent,
    evidenceGivenHypothesisPercent,
    evidenceWithoutHypothesisPercent,
    populationSize = POPULATION_SIZE,
  ) {
    assertProbability(priorPercent, "priorPercent");
    assertProbability(
      evidenceGivenHypothesisPercent,
      "evidenceGivenHypothesisPercent",
    );
    assertProbability(
      evidenceWithoutHypothesisPercent,
      "evidenceWithoutHypothesisPercent",
    );

    if (!Number.isInteger(populationSize) || populationSize <= 0) {
      throw new RangeError("populationSize must be a positive integer");
    }

    const prior = priorPercent / 100;
    const evidenceGivenHypothesis = evidenceGivenHypothesisPercent / 100;
    const evidenceWithoutHypothesis = evidenceWithoutHypothesisPercent / 100;
    const hypothesisCount = populationSize * prior;
    const withoutHypothesisCount = populationSize - hypothesisCount;
    const hypothesisWithEvidence = hypothesisCount * evidenceGivenHypothesis;
    const withoutHypothesisWithEvidence =
      withoutHypothesisCount * evidenceWithoutHypothesis;
    const evidenceCount =
      hypothesisWithEvidence + withoutHypothesisWithEvidence;
    const posterior =
      evidenceCount === 0 ? 0 : hypothesisWithEvidence / evidenceCount;
    const positiveLikelihoodRatio =
      evidenceWithoutHypothesis === 0
        ? evidenceGivenHypothesis === 0
          ? 0
          : Infinity
        : evidenceGivenHypothesis / evidenceWithoutHypothesis;

    return {
      populationSize,
      prior,
      evidenceGivenHypothesis,
      evidenceWithoutHypothesis,
      hypothesisCount,
      withoutHypothesisCount,
      hypothesisWithEvidence,
      withoutHypothesisWithEvidence,
      evidenceCount,
      posterior,
      positiveLikelihoodRatio,
    };
  }

  function comparePriors(
    firstPriorPercent,
    secondPriorPercent,
    evidenceGivenHypothesisPercent,
    evidenceWithoutHypothesisPercent,
    populationSize = POPULATION_SIZE,
  ) {
    return {
      first: calculateUpdate(
        firstPriorPercent,
        evidenceGivenHypothesisPercent,
        evidenceWithoutHypothesisPercent,
        populationSize,
      ),
      second: calculateUpdate(
        secondPriorPercent,
        evidenceGivenHypothesisPercent,
        evidenceWithoutHypothesisPercent,
        populationSize,
      ),
    };
  }

  const bayesianUpdatingMath = {
    POPULATION_SIZE,
    calculateUpdate,
    comparePriors,
  };

  function formatCount(value) {
    return Math.round(value).toLocaleString("en-US");
  }

  function formatPercent(value) {
    if (value === 0 || value >= 10) {
      return `${value.toFixed(1)}%`;
    }

    return `${value.toFixed(2)}%`;
  }

  function formatRatio(value) {
    return Number.isFinite(value) ? value.toFixed(1) : "infinite";
  }

  function initializeBayesianUpdatingLab(lab) {
    const controls = {
      firstPrior: lab.querySelector("[data-first-prior]"),
      secondPrior: lab.querySelector("[data-second-prior]"),
      evidenceGivenHypothesis: lab.querySelector(
        "[data-evidence-given-hypothesis]",
      ),
      evidenceWithoutHypothesis: lab.querySelector(
        "[data-evidence-without-hypothesis]",
      ),
    };
    const outputs = Object.fromEntries(
      [...lab.querySelectorAll("[data-bayes-output]")].map((element) => [
        element.dataset.bayesOutput,
        element,
      ]),
    );
    const status = lab.querySelector("[data-bayes-status]");

    function renderWorld(prefix, result) {
      outputs[`${prefix}Prior`].textContent = formatPercent(result.prior * 100);
      outputs[`${prefix}Hypothesis`].textContent = formatCount(
        result.hypothesisCount,
      );
      outputs[`${prefix}TrueEvidence`].textContent = formatCount(
        result.hypothesisWithEvidence,
      );
      outputs[`${prefix}AlternativeEvidence`].textContent = formatCount(
        result.withoutHypothesisWithEvidence,
      );
      outputs[`${prefix}Evidence`].textContent = formatCount(
        result.evidenceCount,
      );
      outputs[`${prefix}Posterior`].textContent = formatPercent(
        result.posterior * 100,
      );
      outputs[`${prefix}Bar`].style.width = `${result.posterior * 100}%`;
    }

    function render() {
      const comparison = comparePriors(
        Number(controls.firstPrior.value),
        Number(controls.secondPrior.value),
        Number(controls.evidenceGivenHypothesis.value),
        Number(controls.evidenceWithoutHypothesis.value),
      );

      Object.entries(controls).forEach(([name, input]) => {
        outputs[`${name}Value`].textContent = `${input.value}%`;
      });
      renderWorld("first", comparison.first);
      renderWorld("second", comparison.second);
      outputs.likelihoodRatio.textContent = formatRatio(
        comparison.first.positiveLikelihoodRatio,
      );
      outputs.interpretation.textContent = `The evidence is ${formatRatio(
        comparison.first.positiveLikelihoodRatio,
      )} times as likely when H holds as when H does not hold. Because that evidence is identical in both worlds, the different posteriors come from the different priors.`;
      status.textContent = `Updated posterior probabilities: ${formatPercent(
        comparison.first.posterior * 100,
      )} and ${formatPercent(comparison.second.posterior * 100)}.`;
    }

    Object.values(controls).forEach((input) => {
      input.addEventListener("input", render);
    });
    render();
  }

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-bayesian-updating-lab]")
      .forEach(initializeBayesianUpdatingLab);
  }

  if (typeof window !== "undefined") {
    window.bayesianUpdatingMath = bayesianUpdatingMath;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = bayesianUpdatingMath;
  }
})();
