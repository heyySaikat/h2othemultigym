// Page load overlay functionality
window.addEventListener("load", function () {
  // When the entire page (including images and CSS) is loaded
  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.style.opacity = "0"; // Optional fade-out effect
    setTimeout(() => {
      loadingOverlay.style.display = "none"; // Hide the overlay after fading out
    }, 500); // 500ms fade-out duration
  }
});

// Hide loading overlay when fonts are ready
document.fonts.ready.then(function () {
  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "none";
  }
});

// Smooth scrolling to contacts section on nav button click
const navBtn = document.querySelector("#navBtn");
if (navBtn) {
  navBtn.addEventListener("click", function () {
    const contacts = document.querySelector(".contacts");
    if (contacts) {
      contacts.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}
// Function to close notification manually
function closeNotification() {
  const notification = document.getElementById("browser-notification");
  if (notification) {
    notification.classList.remove("show");
  }
}
// Detect Safari browser and show notification after 2 seconds
window.onload = function () {
  const isSafari = navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1;
  if (isSafari) {
    setTimeout(showNotification, 2000);
  }
};

// jQuery for slider image click effect
jQuery(document).ready(function ($) {
  $(".sliderImg").on("click", function () {
    $(".sliderImg").removeClass("active");
    $(this).addClass("active");
  });
});

//dragging images
// const wrapper = document.querySelector(".wrapper");
// const carousel = document.querySelector(".carousel");
// const arrowBtns = document.querySelectorAll(".wrapper i");
// // const firstImgWidth = carousel.querySelector("img").offsetWidth;
// const images = carousel.querySelectorAll("img");
// const carouselChildren = [...carousel.children];

// let isDragging = false, startX, startScrollLeft, timeoutId;

// let imgPerView = Math.round(carousel.offsetWidth / images);

// carouselChildren.slice(-imgPerView).reverse().forEach(img => {
//   carousel.insertAdjacentHTML("afterBegin", img.outerHTML);
// });

// carouselChildren.slice(0, imgPerView).forEach(img => {
//   carousel.insertAdjacentHTML("beforeEnd", img.outerHTML);
// });

// arrowBtns.forEach(btn => {
//   btn.addEventListener("click", () => {
//     // Calculate current image index based on scrollLeft and total image widths
//     let currentIndex = Math.round(carousel.scrollLeft / images[0].offsetWidth);
    
//     // Ensure currentIndex stays within bounds
//     currentIndex = Math.min(Math.max(currentIndex, 0), images.length - 1);
    
//     // Use the width of the current image to scroll
//     const currentImgWidth = images[currentIndex]?.offsetWidth || images[0].offsetWidth;

//     // Adjust scrollLeft by current image width, depending on button direction
//     carousel.scrollLeft += btn.id === "arrLeft" ? -currentImgWidth : currentImgWidth;
//   });
// });


// const dragStart = (e) => {
//   isDragging = true;
//   carousel.classList.add("dragging");
//   startX = e.pageX;
//   startScrollLeft = carousel.scrollLeft;
// }

// const dragging = (e) => {
//   if (!isDragging) return;
//   carousel.scrollLeft = startScrollLeft - (e.pageX -startX);
// }

// const dragStop = () => {
//   isDragging = false;
//   carousel.classList.remove("dragging");
// }

// const autoPlay = () => {
//   timeoutId = setTimeout(() => carousel.scrollLeft += images[0].offsetWidth, 0);
// }
// autoPlay();
// const infiniteScroll = () => {
//   if(carousel.scrollLeft === 0) {
//     carousel.classList.add("no-transition");
//     carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
//     carousel.classList.remove("no-transition");
//   }
//   else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
//     carousel.classList.add("no-transition");
//     carousel.scrollLeft = carousel.offsetWidth;
//     carousel.classList.remove("no-transition");
//   }

//   clearTimeout(timeoutId);
//   if(!wrapper.matches(":hover")) autoPlay();
// }

// carousel.addEventListener("mousedown", dragStart);
// carousel.addEventListener("mousemove", dragging);
// document.addEventListener("mouseup", dragStop);
// carousel.addEventListener("scroll", infiniteScroll);
// wrapper.addEventListener("mouseenter", ()=> clearTimeout(timeoutId));
// wrapper.addEventListener("mouseleave", autoPlay);


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
    carousel.scrollLeft += images[0].offsetWidth;
    autoPlay();
  }, 1000);
}
autoPlay();

const infiniteScroll = () => {
  if(carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
    carousel.classList.remove("no-transition");
  }
  else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
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