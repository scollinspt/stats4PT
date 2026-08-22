(async function loadSubstackLinks() {
  const list = document.getElementById("substack-links");
  if (!list) return;

  try {
    const sourceUrl = new URL("../stats4PT%20main%20page%20info.txt", window.location.href);
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error("Could not read source file.");
    }

    const text = await response.text();
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));

    const entries = lines
      .map((line) => {
        const separatorIndex = line.indexOf("|");
        if (separatorIndex === -1) return null;
        const title = line.slice(0, separatorIndex).trim();
        const url = line.slice(separatorIndex + 1).trim();
        return [title, url];
      })
      .filter((parts) => parts && parts[0] && /^https:\/\//i.test(parts[1]));

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
