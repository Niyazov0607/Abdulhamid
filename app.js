// Keep in-page navigation smooth when a link is activated from the keyboard.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", link.getAttribute("href"));
  });
});

const teamSlider = document.querySelector(".team-slider");

if (teamSlider) {
  const track = teamSlider.querySelector(".team-track");
  const slides = [...teamSlider.querySelectorAll(".team-slide")];
  const currentSlide = teamSlider.querySelector(".current-slide");
  const totalSlides = teamSlider.querySelector(".slide-total");
  const dots = teamSlider.querySelector(".team-slider-dots");
  const previousButton = teamSlider.querySelector(".team-prev");
  const nextButton = teamSlider.querySelector(".team-next");
  let activeIndex = 0;
  let touchStartX = 0;

  const visibleSlides = () => {
    if (window.matchMedia("(max-width: 600px)").matches) return 1;
    if (window.matchMedia("(max-width: 850px)").matches) return 2;
    return 3;
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "team-slider-dot";
    dot.setAttribute("aria-label", `Do'st ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.append(dot);
  });
  const paginationDots = [...dots.querySelectorAll(".team-slider-dot")];

  const showSlide = (index) => {
    const maxIndex = Math.max(0, slides.length - visibleSlides());
    activeIndex = Math.max(0, Math.min(index, maxIndex));
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${activeIndex * (slideWidth + gap)}px)`;
    const centerIndex = activeIndex + Math.floor(visibleSlides() / 2);
    currentSlide.textContent = String(Math.min(centerIndex + 1, slides.length)).padStart(2, "0");
    slides.forEach((slide, slideIndex) => {
      const isVisible = slideIndex >= activeIndex && slideIndex < activeIndex + visibleSlides();
      slide.setAttribute("aria-hidden", String(!isVisible));
      slide.classList.toggle("is-active", slideIndex === centerIndex);
      slide.classList.toggle("is-near", isVisible && slideIndex !== centerIndex);
    });
    paginationDots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === centerIndex;
      dot.classList.toggle("is-current", isCurrent);
      dot.setAttribute("aria-current", String(isCurrent));
    });
  };

  track.style.transition = "transform 650ms cubic-bezier(.2,.8,.2,1)";
  totalSlides.textContent = String(slides.length).padStart(2, "0");
  previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1));
  track.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
  teamSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1);
  });

  let resizeFrame;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => showSlide(activeIndex));
  });
  showSlide(0);
}
