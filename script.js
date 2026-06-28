// ==========================================================================
// FITNESS SF - PREMIUM INTERACTION LOGIC
// ==========================================================================

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- 1. LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// --- 2. CUSTOM CURSOR ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if(window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Instant movement for dot
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Smooth trailing movement for outline using GSAP
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: "power2.out"
        });
    });
    
    // Add hover effect to links and buttons
    const hoverElements = document.querySelectorAll('a, button, .slider-handle, .faq-question');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// --- 3. SCROLL PROGRESS INDICATOR ---
window.addEventListener('scroll', () => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = `${scrollPx / winHeightPx * 100}%`;
    document.querySelector('.scroll-progress').style.width = scrolled;
});

// --- 4. LUXURY LOADING SCREEN ---
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    // Animate loader bar and percentage
    tl.to('.loader-bar', {
        width: '100%',
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: function() {
            const progress = Math.round(this.progress() * 100);
            document.querySelector('.loader-percentage').innerText = `${progress}%`;
        }
    })
    .to('.loader-content', {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
    })
    .to('.loader-bg-overlay', {
        height: 0,
        duration: 1,
        ease: 'power4.inOut'
    }, "-=0.2")
    .to('.loader-wrapper', {
        display: 'none',
        duration: 0
    })
    // Start Hero Animations
    .fromTo('.hero-title .text-line', 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power4.out' }
    )
    .fromTo('.hero-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.5"
    )
    .fromTo('.hero-actions',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.6"
    )
    .fromTo('.hero-athlete',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
        "-=1"
    );
});

// --- 5. HERO PARALLAX & PARTICLES ---
// Particles Generation
const particlesContainer = document.getElementById('particles-container');
if(particlesContainer) {
    for(let i = 0; i < 30; i++) {
        let particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = '#10b981';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.filter = 'blur(1px)';
        particlesContainer.appendChild(particle);
        
        // Float animation
        gsap.to(particle, {
            y: `-=${Math.random() * 100 + 50}`,
            x: `+=${Math.random() * 50 - 25}`,
            duration: Math.random() * 5 + 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// Mouse Parallax on Desktop
if(window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to('.hero-bg', { x: x, y: y, duration: 1, ease: 'power2.out' });
        gsap.to('.hero-athlete', { x: -x*1.5, y: -y*1.5, duration: 1, ease: 'power2.out' });
    });
}

// Scroll Parallax via ScrollTrigger
gsap.to('.hero-bg-image', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// --- 6. GSAP SCROLL REVEALS ---

// Reveal Up (Fade and slide up)
gsap.utils.toArray('.reveal-up').forEach(elem => {
    gsap.fromTo(elem, 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: elem, start: 'top 85%' }
        }
    );
});

// Reveal Scale (Image pop-ins)
gsap.utils.toArray('.reveal-scale').forEach(elem => {
    gsap.fromTo(elem, 
        { scale: 0.9, opacity: 0 },
        {
            scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: elem, start: 'top 85%' }
        }
    );
});

// Staggered Bento Cards
ScrollTrigger.batch(".bento-item", {
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out' }),
    start: "top 85%",
});
gsap.set(".bento-item", { y: 50, opacity: 0 }); // Initial state

// --- 7. NUMBER COUNTERS (STATS) ---
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        once: true,
        onEnter: () => {
            const target = +counter.getAttribute('data-target');
            const isDecimal = target % 1 !== 0;
            
            gsap.to(counter, {
                innerText: target,
                duration: 2,
                snap: { innerText: isDecimal ? 0.1 : 1 },
                ease: 'power2.out'
            });
        }
    });
});

// --- 8. SWIPER JS INITIALIZATIONS ---

// Trainers Slider
const trainersSwiper = new Swiper('.trainers-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.trainers-pagination',
        clickable: true,
    },
    breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    }
});

// Transformations Slider (Custom Navigation)
const transformSwiper = new Swiper('.transform-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next-transform',
        prevEl: '.swiper-button-prev-transform',
    }
});

// --- 9. BEFORE/AFTER SLIDER LOGIC ---
const baSliders = document.querySelectorAll('.ba-slider');
baSliders.forEach(slider => {
    const resizeBox = slider.querySelector('.resize-box');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;

    const drag = (e) => {
        if (!isDragging) return;
        
        let rect = slider.getBoundingClientRect();
        let x;
        if(e.type.includes('mouse')) {
            x = e.clientX - rect.left;
        } else {
            x = e.touches[0].clientX - rect.left;
        }
        
        // Constrain
        x = Math.max(0, Math.min(x, rect.width));
        let percentage = (x / rect.width) * 100;
        
        resizeBox.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    };

    slider.addEventListener('mousedown', () => isDragging = true);
    slider.addEventListener('touchstart', () => isDragging = true);
    
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);
    
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);
});

// --- 10. FAQ ACCORDION ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Close others
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        // Toggle current
        item.classList.toggle('active');
        
        // Refresh ScrollTrigger to account for height changes
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 400);
    });
});

// --- 11. MOBILE MENU & HEADER SCROLL ---
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Header background on scroll
window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        header.style.background = 'rgba(25, 25, 25, 0.8)';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
        header.style.background = 'var(--glass-bg)';
        header.style.boxShadow = 'none';
    }
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if(mobileMenu.classList.contains('active')) {
        icon.classList.remove('ph-list');
        icon.classList.add('ph-x');
    } else {
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
    }
});

// Close menu on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.replace('ph-x', 'ph-list');
    });
});

// --- 12. BACK TO TOP BUTTON ---
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if(window.scrollY > 500) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
});

backToTopBtn.addEventListener('click', () => {
    // Lenis smooth scroll to top
    lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
});

// --- 13. REVIEWS STACK ANIMATION ---
// Simple scroll interaction for the review stack
gsap.to('.review-card-1', {
    y: 10,
    scrollTrigger: { trigger: '.reviews-stack', start: 'top center', end: 'bottom center', scrub: 1 }
});
gsap.to('.review-card-2', {
    y: 30, opacity: 0.9, scale: 0.98,
    scrollTrigger: { trigger: '.reviews-stack', start: 'top center', end: 'bottom center', scrub: 1 }
});
gsap.to('.review-card-3', {
    y: 50, opacity: 0.7, scale: 0.95,
    scrollTrigger: { trigger: '.reviews-stack', start: 'top center', end: 'bottom center', scrub: 1 }
});
