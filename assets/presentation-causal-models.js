(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const presentation = document.querySelector("#presentation");
  const previousButton = document.querySelector("#previous-slide");
  const nextButton = document.querySelector("#next-slide");
  const overviewButton = document.querySelector("#overview-toggle");
  const fullscreenButton = document.querySelector("#fullscreen-toggle");
  const counter = document.querySelector("#slide-counter");
  const progressBar = document.querySelector("#progress-bar");

  if (!slides.length || !presentation) return;

  let currentIndex = 0;

  const indexFromHash = () => {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (!match) return 0;
    return Math.min(Math.max(Number(match[1]) - 1, 0), slides.length - 1);
  };

  const setSlide = (index, { updateHash = true, focus = false } = {}) => {
    currentIndex = Math.min(Math.max(index, 0), slides.length - 1);
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== currentIndex));
    });
    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    progressBar.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;

    if (updateHash) {
      window.history.replaceState(null, "", `#slide-${currentIndex + 1}`);
    }
    if (focus && !document.body.classList.contains("overview-mode")) {
      slides[currentIndex].focus({ preventScroll: true });
    }
  };

  const move = (amount) => setSlide(currentIndex + amount, { focus: true });

  const toggleOverview = () => {
    const isOverview = document.body.classList.toggle("overview-mode");
    document.body.classList.toggle("presentation-mode", !isOverview);
    overviewButton.setAttribute("aria-pressed", String(isOverview));
    if (!isOverview) slides[currentIndex].focus({ preventScroll: true });
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      fullscreenButton.textContent = "Unavailable";
    }
  };

  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  overviewButton.addEventListener("click", toggleOverview);
  fullscreenButton.addEventListener("click", toggleFullscreen);

  slides.forEach((slide, index) => {
    slide.addEventListener("click", () => {
      if (!document.body.classList.contains("overview-mode")) return;
      setSlide(index);
      toggleOverview();
    });
  });

  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setSlide(0, { focus: true });
    } else if (event.key === "End") {
      event.preventDefault();
      setSlide(slides.length - 1, { focus: true });
    } else if (event.key.toLowerCase() === "o") {
      toggleOverview();
    } else if (event.key.toLowerCase() === "f") {
      toggleFullscreen();
    } else if (event.key === "Escape" && document.body.classList.contains("overview-mode")) {
      toggleOverview();
    }
  });

  window.addEventListener("hashchange", () => setSlide(indexFromHash(), { updateHash: false }));

  document.body.classList.add("presentation-mode");
  setSlide(indexFromHash(), { updateHash: true });
})();