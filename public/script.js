// Unregister any lingering service workers to prevent old cache issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

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
        const notifPanel = document.getElementById('notificationPanel');
        if (scrollPos > 50) {
          navbar.classList.add('scrolled');
          if (notifPanel) notifPanel.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
          if (notifPanel) notifPanel.classList.remove('scrolled');
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

// Vanilla JS for slider image click effect
document.addEventListener('DOMContentLoaded', () => {
  const sliderImgs = document.querySelectorAll(".sliderImg");
  
  sliderImgs.forEach(img => {
    img.addEventListener("click", function (e) {
      // Prevent bubbling so document click doesn't immediately fire
      e.stopPropagation();
      sliderImgs.forEach(si => si.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Collapse images if user clicks outside of them
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".sliderImg")) {
      sliderImgs.forEach(si => si.classList.remove("active"));
    }
  });
});

const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper .nav-arrow");
const images = carousel.querySelectorAll("img");
const carouselChildren = [...carousel.children];

let isDragging = false, startX, startY, startScrollLeft, timeoutId;

let imgPerView = Math.round(carousel.offsetWidth / images[0].offsetWidth);

carouselChildren.slice(-imgPerView).reverse().forEach(img => {
  carousel.insertAdjacentHTML("afterBegin", img.outerHTML);
});

carouselChildren.slice(0, imgPerView).forEach(img => {
  carousel.insertAdjacentHTML("beforeEnd", img.outerHTML);
});

// CSS gap is 10px
const getImgWidth = () => images[0].offsetWidth + 10;

arrowBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id === "arrLeft" ? -getImgWidth() : getImgWidth();
    autoPlay(); 
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX || (e.touches && e.touches[0].pageX);
  startY = e.pageY || (e.touches && e.touches[0].pageY);
  startScrollLeft = carousel.scrollLeft;
  clearTimeout(timeoutId); 
}

const dragging = (e) => {
  if (!isDragging) return;
  const x = e.pageX || (e.touches && e.touches[0].pageX);
  const y = e.pageY || (e.touches && e.touches[0].pageY);
  
  if (e.touches && Math.abs(y - startY) > Math.abs(x - startX)) {
    isDragging = false;
    carousel.classList.remove("dragging");
    autoPlay();
    return;
  }
  
  carousel.scrollLeft = startScrollLeft - (x - startX);
}

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
  autoPlay(); 
}

const autoPlay = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    carousel.scrollLeft += getImgWidth();
    autoPlay();
  }, 2000); // 2000 defaults better for viewing carousels smoothly
}
autoPlay();

const infiniteScroll = () => {
  const originalWidth = images.length * getImgWidth();
  
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft += originalWidth;
    carousel.offsetHeight; // Force layout reflow
    carousel.classList.remove("no-transition");
  } else if (Math.ceil(carousel.scrollLeft) >= carousel.scrollWidth - carousel.offsetWidth) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft -= originalWidth;
    carousel.offsetHeight; // Force layout
    carousel.classList.remove("no-transition");
  }
  
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

// --- Premium UI Enhancements ---

// 1. Parallax Effect for Hero
let parallaxTicking = false;
window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      const heroBg = document.querySelector('.hero-carousel');
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

// --- Notification System ---
document.addEventListener('DOMContentLoaded', () => {
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationPanel = document.getElementById('notificationPanel');
  const closeNotificationPanel = document.getElementById('closeNotificationPanel');
  const notificationContent = document.getElementById('notificationContent');
  
  if (!notificationBtn || !notificationPanel) return;

  // Toggle panel
  notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = notificationPanel.classList.toggle('open');
    if (window.innerWidth <= 768) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  });
  
  closeNotificationPanel.addEventListener('click', () => {
    notificationPanel.classList.remove('open');
    document.body.style.overflow = '';
  });
  
  // Prevent background UI from scrolling on desktop when hovering over the panel
  notificationPanel.addEventListener('wheel', (e) => {
    const isScrollable = notificationContent.scrollHeight > notificationContent.clientHeight;
    // If panel doesn't have a scrollbar, stop the mouse wheel from reaching the body
    if (!isScrollable) {
      e.preventDefault();
    }
    // (If it is scrollable, the newly added CSS 'overscroll-behavior: contain' catches the boundaries)
  }, { passive: false });
  
  // Close if clicked outside
  document.addEventListener('click', (e) => {
    if (notificationPanel.classList.contains('open')) {
      if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationPanel.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
  
  // Fetch notifications
  // Using gviz/tq as it reliably provides CORS for public google sheets
  const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/1nkgpX6l6BOSFygyQF0BANZ9L68Cb1GYojZx8B02vnpQ/gviz/tq?tqx=out:csv&t=${new Date().getTime()}`;
  
  function parseCSV(str) {
    const arr = [];
    let quote = false;
    let row = 0, col = 0, c = 0;
    for (; c < str.length; c++) {
      let cc = str[c], nc = str[c+1];
      arr[row] = arr[row] || [];
      arr[row][col] = arr[row][col] || '';
      if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
      if (cc == '"') { quote = !quote; continue; }
      if (cc == ',' && !quote) { ++col; continue; }
      if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
      if (cc == '\n' && !quote) { ++row; col = 0; continue; }
      if (cc == '\r' && !quote) { ++row; col = 0; continue; }
      arr[row][col] += cc;
    }
    return arr;
  }
  
  fetch(SHEET_CSV_URL)
    .then(res => res.text())
    .then(csvText => {
      const data = parseCSV(csvText);
      const notifications = [];
      
      data.forEach(row => {
        if (!row || row.length === 0) return;
        let section = row[0] ? row[0].trim() : '';
        if (!section || section === '""') return; // Ignore empty sections
        
        // Remove surrounding quotes if any
        section = section.replace(/^"|"$/g, '').trim();
        
        // Check other columns for content
        for (let i = 1; i < row.length; i++) {
          let item = row[i] ? row[i].trim() : '';
          item = item.replace(/^"|"$/g, '').trim(); // Remove surrounding quotes
          if (item && item !== '-') { // Ignoring empty or just dashes
            notifications.push({ section: section, text: item });
          }
        }
      });
      
      if (notifications.length > 0) {
        notificationBtn.classList.add('has-notifications');
        // Render up to 3 notifications
        const limit = Math.min(notifications.length, 3);
        let html = '';
        for (let i = 0; i < limit; i++) {
          html += `
            <div class="notification-card">
              <div class="notif-section">${notifications[i].section}</div>
              <div class="notif-text">${notifications[i].text}</div>
            </div>
          `;
        }
        html += `<div class="translate-btn" id="translateBtn" data-lang="en">Translate in Bengali</div>`;
        notificationContent.innerHTML = html;

        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
          translateBtn.addEventListener('click', async () => {
            if (translateBtn.classList.contains('translating')) return;
            
            const currentLang = translateBtn.getAttribute('data-lang');
            const textNodes = document.querySelectorAll('.notification-card .notif-text');

            if (currentLang === 'en') {
              translateBtn.classList.add('translating');
              translateBtn.innerText = 'Translating...';
              
              try {
                for (let node of textNodes) {
                  // Save original English text
                  if (!node.hasAttribute('data-original')) {
                    node.setAttribute('data-original', node.innerText);
                  }
                  
                  // Use cached Bengali if available
                  if (node.hasAttribute('data-bengali')) {
                    node.innerText = node.getAttribute('data-bengali');
                  } else {
                    let text = node.innerText;
                    if (!text) continue;
                    
                    let mapped = [];
                    text = text.replace(/(H2O The MultiGym|H2O TheMultiGym)/gi, match => {
                      mapped.push(match);
                      return ` HZOMULTIGYMPROT${mapped.length - 1} `;
                    });
                    
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(text)}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    
                    if (data && data[0]) {
                      let translated = '';
                      data[0].forEach(part => {
                        if (part[0]) translated += part[0];
                      });
                      
                      translated = translated.replace(/[০-৯]/g, d => String.fromCharCode(d.charCodeAt(0) - 2534 + 48));
                      
                      translated = translated.replace(/HZOMULTIGYMPROT\s*(\d+)/gi, (match, idx) => {
                        return mapped[idx] !== undefined ? mapped[idx] : match;
                      });
                      
                      node.innerText = translated;
                      node.setAttribute('data-bengali', translated); // Cache it
                    }
                  }
                }
                translateBtn.innerText = 'Translate in English';
                translateBtn.setAttribute('data-lang', 'bn');
                translateBtn.classList.remove('translating');
              } catch (err) {
                console.error('Translation error:', err);
                translateBtn.innerText = 'Translation Failed';
                translateBtn.classList.remove('translating');
              }
            } else {
              // Switch back to English
              for (let node of textNodes) {
                if (node.hasAttribute('data-original')) {
                  node.innerText = node.getAttribute('data-original');
                }
              }
              translateBtn.innerText = 'Translate in Bengali';
              translateBtn.setAttribute('data-lang', 'en');
            }
          });
        }
      } else {
        notificationBtn.classList.remove('has-notifications');
        notificationContent.innerHTML = '<div class="no-notifications">No notifications</div>';
      }
    })
    .catch(err => {
      console.error('Error fetching notifications:', err);
      notificationContent.innerHTML = '<div class="no-notifications">No notifications</div>';
    });
});

// --- Hero Image Carousel Autoplay & Indicator Sync ---
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicators .indicator');
  const carouselEl = document.querySelector('.hero-carousel');
  if (slides.length === 0 || indicators.length === 0) return;

  let currentHeroSlide = 0;
  const totalHeroSlides = slides.length;
  let heroInterval;

  function showHeroSlide(index) {
    if (index === currentHeroSlide) return;

    // Determine navigation direction
    let direction = 'next';
    if (index === 0 && currentHeroSlide === totalHeroSlides - 1) {
      direction = 'next';
    } else if (index === totalHeroSlides - 1 && currentHeroSlide === 0) {
      direction = 'prev';
    } else if (index < currentHeroSlide) {
      direction = 'prev';
    }

    // Toggle corresponding direction class on the container
    if (carouselEl) {
      if (direction === 'next') {
        carouselEl.classList.remove('slide-prev');
        carouselEl.classList.add('slide-next');
      } else {
        carouselEl.classList.remove('slide-next');
        carouselEl.classList.add('slide-prev');
      }
    }

    // Apply slide classes
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('exit');
        slide.classList.add('active');
      } else if (i === currentHeroSlide) {
        slide.classList.remove('active');
        slide.classList.add('exit');
        const exitingSlide = slide;
        setTimeout(() => {
          exitingSlide.classList.remove('exit');
        }, 1200); // matches the 1.2s CSS transition duration
      } else {
        slide.classList.remove('active');
        slide.classList.remove('exit');
      }
    });

    // Sync indicators
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    currentHeroSlide = index;
  }

  function nextHeroSlide() {
    const next = (currentHeroSlide + 1) % totalHeroSlides;
    showHeroSlide(next);
  }

  function startHeroCarousel() {
    stopHeroCarousel();
    heroInterval = setInterval(nextHeroSlide, 5000); // 5 seconds autoplay timeout
  }

  function stopHeroCarousel() {
    if (heroInterval) {
      clearInterval(heroInterval);
    }
  }

  // Click handler for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showHeroSlide(index);
      startHeroCarousel(); // restart interval on manual click
    });
  });

  // Swipe Gestures & Dragging for Carousel
  if (carouselEl) {
    let startX = 0;
    let endX = 0;

    // Touch Event Listeners
    carouselEl.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carouselEl.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    }, { passive: true });

    // Mouse Event Listeners for Desktop Swiping
    carouselEl.addEventListener('mousedown', (e) => {
      startX = e.clientX;
    });

    carouselEl.addEventListener('mouseup', (e) => {
      endX = e.clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const threshold = 50; // minimum drag distance in pixels
      const swipeDistance = endX - startX;

      if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0) {
          // Swipe right -> Go to previous slide
          const prev = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
          showHeroSlide(prev);
          startHeroCarousel(); // reset autoplay timer
        } else {
          // Swipe left -> Go to next slide
          const next = (currentHeroSlide + 1) % totalHeroSlides;
          showHeroSlide(next);
          startHeroCarousel(); // reset autoplay timer
        }
      }
    }
  }

  // Initialize carousel
  startHeroCarousel();
});