// Scroll reveal
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;

  reveals.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < windowHeight - 120) {
      section.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Hero slider
const heroSlides = document.querySelectorAll(".hero-slider img");
let currentSlide = 0;

function changeSlide() {
  heroSlides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % heroSlides.length;
  heroSlides[currentSlide].classList.add("active");
}

if (heroSlides.length > 0) {
  heroSlides[0].classList.add("active");
  setInterval(changeSlide, 5000);
}
