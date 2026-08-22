(async function loadSubstackLinks() {
  const list = document.getElementById("substack-links");
  if (!list) return;

  try {
    const response = await fetch("stats4PT%20main%20page%20info.txt");
    if (!response.ok) {
      throw new Error("Could not read source file.");
    }

    const text = await response.text();
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));

    const entries = lines
      .map((line) => line.split("|").map((part) => part.trim()))
      .filter((parts) => parts.length === 2 && /^https?:\/\//i.test(parts[1]));

    if (!entries.length) {
      const item = document.createElement("li");
      item.textContent =
        "No valid links found yet. Add lines in the format: Lesson title | https://...";
      list.replaceChildren(item);
      return;
    }

    const items = entries.map(([title, url]) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = title;
      item.appendChild(link);
      return item;
    });
    list.replaceChildren(...items);
  } catch (error) {
    const item = document.createElement("li");
    item.textContent =
      "Could not load source file. Make sure /stats4PT main page info.txt exists in the repository root.";
    list.replaceChildren(item);
  }
})();
