// Page load overlay functionality

window.addEventListener("load", function () {
  const loadingOverlay = document.getElementById("loading-overlay");

  if (loadingOverlay) {
    loadingOverlay.style.opacity = "0"; // Fade out
    setTimeout(() => {
      loadingOverlay.style.display = "none";
    }, 500); // 500ms fade duration matches CSS transition
  }
});


// Navbar scroll effect and Hamburger menu logic
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
let navTicking = false;
function handleNavbarScroll() {
  if (!navTicking) {
    window.requestAnimationFrame(() => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      if (navbar) {
        if (scrollPos > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
      navTicking = false;
    });
    navTicking = true;
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
// Also trigger on load in case the user refreshed mid-page
document.addEventListener('DOMContentLoaded', handleNavbarScroll);
handleNavbarScroll();

// Hamburger menu toggle
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close menu when a link is clicked
navLinks.forEach(n => n.addEventListener('click', () => {
  if (hamburger) hamburger.classList.remove('active');
  if (navMenu) navMenu.classList.remove('active');
}));
// jQuery for slider image click effect
jQuery(document).ready(function ($) {
  $(".sliderImg").on("click", function () {
    $(".sliderImg").removeClass("active");
    $(this).addClass("active");
  });
});

const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const images = carousel.querySelectorAll("img");
const carouselChildren = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;

let imgPerView = Math.round(carousel.offsetWidth / images[0].offsetWidth);

carouselChildren.slice(-imgPerView).reverse().forEach(img => {
  carousel.insertAdjacentHTML("afterBegin", img.outerHTML);
});

carouselChildren.slice(0, imgPerView).forEach(img => {
  carousel.insertAdjacentHTML("beforeEnd", img.outerHTML);
});

arrowBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    let currentIndex = Math.round(carousel.scrollLeft / images[0].offsetWidth);
    currentIndex = Math.min(Math.max(currentIndex, 0), images.length - 1);
    const currentImgWidth = images[currentIndex]?.offsetWidth || images[0].offsetWidth;
    carousel.scrollLeft += btn.id === "arrLeft" ? -currentImgWidth : currentImgWidth;
    autoPlay(); // Always resume autoplay after arrow navigation
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX || e.touches[0].pageX;
  startScrollLeft = carousel.scrollLeft;
  clearTimeout(timeoutId); // Stop autoplay during drag
}

const dragging = (e) => {
  if (!isDragging) return;
  const x = e.pageX || e.touches[0].pageX;
  carousel.scrollLeft = startScrollLeft - (x - startX);
}

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
  autoPlay(); // Resume autoplay after drag
}

const autoPlay = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    // Use the actual child image width for infinite scroll
    const currentIndex = Math.round(carousel.scrollLeft / carousel.children[0].offsetWidth);
    const currentImgWidth = carousel.children[currentIndex]?.offsetWidth || carousel.children[0].offsetWidth;
    carousel.scrollLeft += currentImgWidth;
    autoPlay();
  }, 1000);
}
autoPlay();

const infiniteScroll = () => {
  // Seamless infinite scroll
  if (carousel.scrollLeft <= 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth) - 1;
    carousel.classList.remove("no-transition");
  } else if (carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth + 1;
    carousel.classList.remove("no-transition");
  }
  if (!wrapper.matches(":hover")) autoPlay(); // Only restart autoplay if not hovered
}

// Mouse events
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);

// Touch events
carousel.addEventListener("touchstart", dragStart);
carousel.addEventListener("touchmove", dragging);
carousel.addEventListener("touchend", dragStop);

// Autoplay control for mouse enter/leave
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

// --- Premium UI Enhancements ---

// 1. Parallax Effect for Hero
let parallaxTicking = false;
window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      const heroBg = document.querySelector('.hero-bg');
      const heroBox = document.querySelector('.main > .box');
      
      // Only animate if we are reasonably close to the top
      if (scrollY < window.innerHeight) {
        if (heroBg) {
          heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
        }
        if (heroBox) {
            // Slowing down the content moving up relative to the scroll so it gives depth
          heroBox.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
        }
      }

      // Scroll Progress Bar Update
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollY / docHeight) * 100;
      const progressEl = document.getElementById('scroll-progress');
      if (progressEl) {
        progressEl.style.height = `${scrollPercent}%`;
      }

      parallaxTicking = false;
    });
    parallaxTicking = true;
  }
}, { passive: true });

// 2. Scroll Reveal Animation using IntersectionObserver
const revealElements = document.querySelectorAll('.reveal-up');
const revealOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15 // Trigger when 15% of the element is visible
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Once revealed, stop observing if we want to play animation only once. 
      // For a dynamic feel, we'll let it play every time it comes into view.
    } else {
      entry.target.classList.remove('in-view'); // Re-animate when scrolling back up
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealObserver.observe(el);
});