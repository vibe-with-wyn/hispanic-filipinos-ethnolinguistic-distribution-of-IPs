// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== ACTIVE NAV LINK & SLIDE DOTS =====
const slides = document.querySelectorAll('.slide, .footer-slide');
const navAnchors = document.querySelectorAll('.nav-links a');
const slideDots = document.querySelectorAll('.slide-dot');

const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;

            // Update nav links
            navAnchors.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + id) {
                    a.classList.add('active');
                }
            });

            // Update slide dots
            slideDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.dataset.target === id) {
                    dot.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.4 });

slides.forEach(slide => slideObserver.observe(slide));

// ===== SLIDE DOT CLICK NAVIGATION =====
slideDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const target = document.getElementById(dot.dataset.target);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== TOUCH SUPPORT FOR IMAGE POPUPS (tablets) =====
const isTouchDevice = () => window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

function setupTouchImagePop() {
    if (!isTouchDevice()) return;
    // Only apply hover-popup touch behavior on tablets (>768px)
    // On mobile (<=768px) images are already shown as static thumbnails
    if (window.innerWidth <= 768) return;

    const hoverItems = document.querySelectorAll('.pyramid-level, .icon-strip-item');
    let currentActive = null;

    hoverItems.forEach(item => {
        item.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            if (currentActive && currentActive !== item) {
                currentActive.classList.remove('touch-active');
            }
            item.classList.toggle('touch-active');
            currentActive = item.classList.contains('touch-active') ? item : null;
        }, { passive: true });
    });

    document.addEventListener('touchstart', () => {
        if (currentActive) {
            currentActive.classList.remove('touch-active');
            currentActive = null;
        }
    }, { passive: true });
}

setupTouchImagePop();
window.addEventListener('resize', setupTouchImagePop);

// ===== KEYBOARD NAVIGATION =====
const slideIds = Array.from(document.querySelectorAll('.slide')).map(s => s.id);
document.addEventListener('keydown', (e) => {
    const currentSlide = slideIds.find(id => {
        const el = document.getElementById(id);
        const rect = el.getBoundingClientRect();
        return rect.top >= -100 && rect.top <= window.innerHeight / 2;
    });

    const currentIndex = slideIds.indexOf(currentSlide);

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = slideIds[Math.min(currentIndex + 1, slideIds.length - 1)];
        document.getElementById(next)?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = slideIds[Math.max(currentIndex - 1, 0)];
        document.getElementById(prev)?.scrollIntoView({ behavior: 'smooth' });
    }
});