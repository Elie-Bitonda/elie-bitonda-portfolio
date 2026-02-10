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


const images = document.querySelectorAll(".bg-images img");
let index = 0;

setInterval(() => {
  images[index].classList.remove("active");
  index = (index + 1) % images.length;
  images[index].classList.add("active");
}, 1000);

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
