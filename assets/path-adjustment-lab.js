(() => {
  "use strict";

  const SCENARIOS = Object.freeze({
    confounder: Object.freeze({
      label: "Common cause",
      question:
        "Estimate the total effect of treatment received (X) on function (Y).",
      nodes: Object.freeze([
        Object.freeze({ id: "X", label: "Treatment received", x: 34, y: 68 }),
        Object.freeze({ id: "Y", label: "Function", x: 266, y: 68 }),
        Object.freeze({ id: "C", label: "Baseline severity", x: 150, y: 18 }),
      ]),
      edges: Object.freeze([
        Object.freeze({ from: "C", to: "X" }),
        Object.freeze({ from: "C", to: "Y" }),
        Object.freeze({ from: "X", to: "Y" }),
      ]),
      adjustable: Object.freeze(["C"]),
      expected: Object.freeze(["C"]),
      paths: Object.freeze([
        Object.freeze({
          id: "causal",
          label: "Causal path X → Y",
          type: "causal",
          defaultOpen: true,
          blockedBy: Object.freeze([]),
          openedBy: Object.freeze([]),
        }),
        Object.freeze({
          id: "backdoor",
          label: "Backdoor path X ← C → Y",
          type: "noncausal",
          defaultOpen: true,
          blockedBy: Object.freeze(["C"]),
          openedBy: Object.freeze([]),
        }),
      ]),
      lesson:
        "C is a common cause of X and Y. Conditioning on C closes the open backdoor path while leaving the causal path available for estimating the total effect.",
    }),
    mediator: Object.freeze({
      label: "Mediator",
      question:
        "Estimate the total effect of an exercise program (X) on function (Y).",
      nodes: Object.freeze([
        Object.freeze({ id: "X", label: "Exercise program", x: 34, y: 50 }),
        Object.freeze({ id: "M", label: "Training adaptation", x: 150, y: 50 }),
        Object.freeze({ id: "Y", label: "Function", x: 266, y: 50 }),
      ]),
      edges: Object.freeze([
        Object.freeze({ from: "X", to: "M" }),
        Object.freeze({ from: "M", to: "Y" }),
      ]),
      adjustable: Object.freeze(["M"]),
      expected: Object.freeze([]),
      paths: Object.freeze([
        Object.freeze({
          id: "mediated",
          label: "Causal path X → M → Y",
          type: "causal",
          defaultOpen: true,
          blockedBy: Object.freeze(["M"]),
          openedBy: Object.freeze([]),
        }),
      ]),
      lesson:
        "M carries part or all of the effect from X to Y. Conditioning on M blocks that pathway, so it is not appropriate when the target is the total effect.",
    }),
    collider: Object.freeze({
      label: "Collider",
      question:
        "Estimate the relationship between treatment preference (X) and recovery (Y) without creating a noncausal association.",
      nodes: Object.freeze([
        Object.freeze({ id: "X", label: "Treatment preference", x: 34, y: 18 }),
        Object.freeze({ id: "Y", label: "Recovery", x: 266, y: 18 }),
        Object.freeze({ id: "K", label: "Follow-up selection", x: 150, y: 78 }),
      ]),
      edges: Object.freeze([
        Object.freeze({ from: "X", to: "K" }),
        Object.freeze({ from: "Y", to: "K" }),
      ]),
      adjustable: Object.freeze(["K"]),
      expected: Object.freeze([]),
      paths: Object.freeze([
        Object.freeze({
          id: "collider",
          label: "Collider path X → K ← Y",
          type: "noncausal",
          defaultOpen: false,
          blockedBy: Object.freeze([]),
          openedBy: Object.freeze(["K"]),
        }),
      ]),
      lesson:
        "K is a common effect of X and Y, so the path is closed until K is conditioned on. Restricting or adjusting for K opens a noncausal path.",
    }),
    mixed: Object.freeze({
      label: "Mixed structure",
      question:
        "Estimate the total effect of progressive loading (X) on recovery (Y).",
      nodes: Object.freeze([
        Object.freeze({ id: "X", label: "Progressive loading", x: 34, y: 52 }),
        Object.freeze({ id: "Y", label: "Recovery", x: 266, y: 52 }),
        Object.freeze({ id: "C", label: "Baseline severity", x: 70, y: 8 }),
        Object.freeze({ id: "M", label: "Load adaptation", x: 150, y: 92 }),
        Object.freeze({ id: "K", label: "Analysis inclusion", x: 230, y: 8 }),
      ]),
      edges: Object.freeze([
        Object.freeze({ from: "C", to: "X" }),
        Object.freeze({ from: "C", to: "Y" }),
        Object.freeze({ from: "X", to: "M" }),
        Object.freeze({ from: "M", to: "Y" }),
        Object.freeze({ from: "X", to: "K" }),
        Object.freeze({ from: "Y", to: "K" }),
      ]),
      adjustable: Object.freeze(["C", "M", "K"]),
      expected: Object.freeze(["C"]),
      paths: Object.freeze([
        Object.freeze({
          id: "backdoor",
          label: "Backdoor path X ← C → Y",
          type: "noncausal",
          defaultOpen: true,
          blockedBy: Object.freeze(["C"]),
          openedBy: Object.freeze([]),
        }),
        Object.freeze({
          id: "mediated",
          label: "Causal path X → M → Y",
          type: "causal",
          defaultOpen: true,
          blockedBy: Object.freeze(["M"]),
          openedBy: Object.freeze([]),
        }),
        Object.freeze({
          id: "collider",
          label: "Collider path X → K ← Y",
          type: "noncausal",
          defaultOpen: false,
          blockedBy: Object.freeze([]),
          openedBy: Object.freeze(["K"]),
        }),
      ]),
      lesson:
        "For the total effect, C closes confounding, M should remain open as part of the causal pathway, and K should remain unconditioned so the collider path stays closed.",
    }),
  });

  function sameSet(first, second) {
    return (
      first.size === second.size &&
      [...first].every((value) => second.has(value))
    );
  }

  function analyzeAdjustment(scenarioId, selectedIds = []) {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) throw new RangeError(`Unknown scenario: ${scenarioId}`);
    const selected = new Set(selectedIds);
    const allowed = new Set(scenario.adjustable);
    selected.forEach((id) => {
      if (!allowed.has(id))
        throw new RangeError(`${id} cannot be conditioned on`);
    });

    const paths = scenario.paths.map((path) => {
      const opened = path.openedBy.some((id) => selected.has(id));
      const blocked = path.blockedBy.some((id) => selected.has(id));
      return {
        id: path.id,
        label: path.label,
        type: path.type,
        open: opened || (path.defaultOpen && !blocked),
        changed: opened || blocked,
      };
    });
    const openNoncausal = paths.filter(
      (path) => path.type === "noncausal" && path.open,
    );
    const blockedCausal = paths.filter(
      (path) => path.type === "causal" && !path.open,
    );
    const expected = new Set(scenario.expected);
    let id = "sufficient";
    let label = "Sufficient set for the total-effect question";
    if (openNoncausal.some((path) => path.id === "collider")) {
      id = "collider-opened";
      label = "Conditioning opened a collider path";
    } else if (openNoncausal.length > 0) {
      id = "confounding-open";
      label = "An open noncausal path remains";
    } else if (blockedCausal.length > 0) {
      id = "causal-blocked";
      label = "Part of the total causal effect was blocked";
    } else if (!sameSet(selected, expected)) {
      id = "unnecessary";
      label = "The set is not the intended minimal set";
    }

    return {
      scenarioId,
      selected: [...selected],
      expected: [...expected],
      correct: sameSet(selected, expected),
      paths,
      conclusion: { id, label },
      explanation: scenario.lesson,
    };
  }

  const pathAdjustmentLogic = { SCENARIOS, analyzeAdjustment };

  function initializePathAdjustmentLab(lab) {
    const scenarioControl = lab.querySelector("[data-path-scenario]");
    const question = lab.querySelector("[data-path-question]");
    const graph = lab.querySelector("[data-path-graph]");
    const controls = lab.querySelector("[data-path-controls]");
    const pathList = lab.querySelector("[data-path-list]");
    const result = lab.querySelector("[data-path-result]");
    const resultLabel = lab.querySelector("[data-path-result-label]");
    const resultExplanation = lab.querySelector(
      "[data-path-result-explanation]",
    );
    const status = lab.querySelector("[data-path-status]");
    let selected = new Set();

    function svgElement(name, attributes = {}) {
      const element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        name,
      );
      Object.entries(attributes).forEach(([key, value]) =>
        element.setAttribute(key, value),
      );
      return element;
    }

    function renderGraph(scenario) {
      graph.replaceChildren();
      const svg = svgElement("svg", {
        viewBox: "0 0 300 112",
        role: "img",
        "aria-label": `${scenario.label} directed acyclic graph`,
      });
      const defs = svgElement("defs");
      const marker = svgElement("marker", {
        id: "path-lab-arrow",
        viewBox: "0 0 10 10",
        refX: "8",
        refY: "5",
        markerWidth: "6",
        markerHeight: "6",
        orient: "auto-start-reverse",
      });
      marker.append(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 z" }));
      defs.append(marker);
      svg.append(defs);
      const nodeMap = Object.fromEntries(
        scenario.nodes.map((node) => [node.id, node]),
      );
      scenario.edges.forEach((edge) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        const horizontalDistance = to.x - from.x;
        const verticalDistance = to.y - from.y;
        const distance = Math.hypot(horizontalDistance, verticalDistance);
        const line = svgElement("line", {
          x1: from.x,
          y1: from.y,
          x2: to.x - (horizontalDistance / distance) * 16,
          y2: to.y - (verticalDistance / distance) * 16,
          "marker-end": "url(#path-lab-arrow)",
        });
        svg.append(line);
      });
      scenario.nodes.forEach((node) => {
        const group = svgElement("g", {
          class: selected.has(node.id) ? "is-conditioned" : "",
          transform: `translate(${node.x} ${node.y})`,
        });
        group.append(svgElement("circle", { r: "13" }));
        const id = svgElement("text", { y: "4", "text-anchor": "middle" });
        id.textContent = node.id;
        const label = svgElement("text", {
          y: node.y > 72 ? "-19" : "25",
          "text-anchor": "middle",
          class: "path-lab__node-label",
        });
        label.textContent = node.label;
        group.append(id, label);
        svg.append(group);
      });
      graph.append(svg);
    }

    function renderAnalysis() {
      const scenario = SCENARIOS[scenarioControl.value];
      const analysis = analyzeAdjustment(scenarioControl.value, [...selected]);
      renderGraph(scenario);
      controls
        .querySelectorAll("button")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            selected.has(button.dataset.node),
          ),
        );
      pathList.replaceChildren();
      analysis.paths.forEach((path) => {
        const item = document.createElement("li");
        item.dataset.open = path.open;
        item.innerHTML = `<strong>${path.open ? "Open" : "Closed"}</strong><span>${path.label}</span>`;
        pathList.append(item);
      });
      result.dataset.result = analysis.conclusion.id;
      resultLabel.textContent = analysis.conclusion.label;
      resultExplanation.textContent = analysis.explanation;
      status.textContent = `${analysis.conclusion.label}. ${analysis.paths.map((path) => `${path.label} is ${path.open ? "open" : "closed"}`).join("; ")}.`;
    }

    function loadScenario() {
      const scenario = SCENARIOS[scenarioControl.value];
      selected = new Set();
      question.textContent = scenario.question;
      controls.replaceChildren();
      if (scenario.adjustable.length === 0) {
        controls.textContent = "No eligible variables in this graph.";
      } else {
        scenario.adjustable.forEach((id) => {
          const node = scenario.nodes.find((candidate) => candidate.id === id);
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.node = id;
          button.setAttribute("aria-pressed", "false");
          button.textContent = `Condition on ${id}: ${node.label}`;
          button.addEventListener("click", () => {
            if (selected.has(id)) selected.delete(id);
            else selected.add(id);
            renderAnalysis();
          });
          controls.append(button);
        });
      }
      renderAnalysis();
    }

    scenarioControl.addEventListener("change", loadScenario);
    lab.querySelector("[data-path-reset]").addEventListener("click", () => {
      scenarioControl.value = "confounder";
      loadScenario();
    });
    loadScenario();
  }

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-path-adjustment-lab]")
      .forEach(initializePathAdjustmentLab);
  }

  if (typeof window !== "undefined") {
    window.pathAdjustmentLogic = pathAdjustmentLogic;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = pathAdjustmentLogic;
  }
})();
