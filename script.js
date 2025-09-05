// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen faster for testing
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('Loading screen hidden');
            }, 500);
        }
    }, 1000); // Reduced from 3500ms to 1000ms
    
    // Fallback: Hide loading screen after window load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                loadingScreen.style.display = 'none';
                console.log('Loading screen hidden via fallback');
            }
        }, 2000);
    });
});

// Navigation
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

let io;
function ensureObserver() {
    if (!io && 'IntersectionObserver' in window) {
        io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, observerOptions);
    }
}

function observeAnimatedElements() {
    ensureObserver();
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    if (io) {
        animatedElements.forEach(el => io.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('visible'));
    }
}

function applyAnimationClasses() {
    // About section animations
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    const statItems = document.querySelectorAll('.stat-item');
    if (aboutText) aboutText.classList.add('slide-in-left');
    if (aboutImage) aboutImage.classList.add('slide-in-right');
    statItems.forEach((item, index) => {
        item.classList.add('scale-in');
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Projects section animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Skills section animations
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.classList.add('slide-in-left');
        category.style.animationDelay = `${index * 0.3}s`;
    });
}

// Initialize animations early
document.addEventListener('DOMContentLoaded', () => {
    applyAnimationClasses();
    observeAnimatedElements();
});

// Fallback: ensure elements become visible on load
window.addEventListener('load', () => {
    observeAnimatedElements();
    // Absolute fallback after a delay
    setTimeout(() => {
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in')
            .forEach(el => el.classList.add('visible'));
    }, 1500);
});

// Skills progress bars animation
const skillsSection = document.querySelector('#skills');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkillBars();
            skillsAnimated = true;
        }
    });
}, { threshold: 0.3 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        }, index * 200);
    });
}

// Project video hover controls (no play button)
document.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('.project-video');
    if (!video) return;
    card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

// Gallery Modal
const galleryModal = document.getElementById('gallery-modal');
const galleryBtn = document.querySelector('.gallery-btn');
const closeModal = document.querySelector('.close-modal');
const galleryImages = document.querySelectorAll('.gallery-img');
const galleryDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.gallery-prev');
const nextBtn = document.querySelector('.gallery-next');

let currentSlide = 0;

// Open gallery
if (galleryBtn) {
    galleryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}

// Close gallery
if (closeModal) {
    closeModal.addEventListener('click', () => {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close gallery when clicking outside
galleryModal?.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Gallery navigation
function showSlide(index) {
    galleryImages.forEach(img => img.classList.remove('active'));
    galleryDots.forEach(dot => dot.classList.remove('active'));
    
    if (galleryImages[index]) {
        galleryImages[index].classList.add('active');
    }
    if (galleryDots[index]) {
        galleryDots[index].classList.add('active');
    }
    currentSlide = index;
}

// Previous slide
prevBtn?.addEventListener('click', () => {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : galleryImages.length - 1;
    showSlide(currentSlide);
});

// Next slide
nextBtn?.addEventListener('click', () => {
    currentSlide = currentSlide < galleryImages.length - 1 ? currentSlide + 1 : 0;
    showSlide(currentSlide);
});

// Dot navigation
galleryDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (galleryModal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        } else if (e.key === 'Escape') {
            closeModal.click();
        }
    }
});

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Particle animation (enhanced background effect)
function createParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 28; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.5 ? '#72e8e6' : '#ff7d7d'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 12 + 14}s linear infinite;
            opacity: ${Math.random() * 0.35 + 0.2};
        `;
        particlesContainer.appendChild(particle);
    }
}

// Parallax scrolling effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const particles = document.getElementById('particles-container');
    if (particles) {
        particles.style.transform = `translateY(${rate}px)`;
    }
});

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Typing effect for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
window.addEventListener('load', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 100);
        }, 1000);
    }
});

// Cursor trail effect
let mouseX = 0;
let mouseY = 0;
let trail = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    trail.push({ x: mouseX, y: mouseY, time: Date.now() });
    
    // Limit trail length
    if (trail.length > 20) {
        trail.shift();
    }
});

// Animate cursor trail
function animateTrail() {
    const canvas = document.getElementById('cursor-trail');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    trail.forEach((point, index) => {
        const age = Date.now() - point.time;
        if (age < 800) {
            const opacity = 1 - (age / 800);
            const size = (1 - age / 800) * 4;
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(114, 232, 230, ${opacity * 0.22})`;
            ctx.fill();
        }
    });
    
    requestAnimationFrame(animateTrail);
}

// Create cursor trail canvas
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9998;
        opacity: 0.7;
    `;
    document.body.appendChild(canvas);
    animateTrail();
});

// Window resize handler
window.addEventListener('resize', () => {
    const canvas = document.getElementById('cursor-trail');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Performance optimization - Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Existing scroll handlers are already defined above
}, 16)); // ~60fps

// Preload images and videos for better performance
function preloadMedia() {
    const base = 'resource/';
    const mediaElements = [
        'AlnahshaRun.mp4',
        'cardMatching.mp4',
        'MineSweeper.mp4',
        'Slow_3d_runner.mp4',
        'BacktoRockPort1.webp',
        'BackToRockPort2.webp',
        'BackToRockPort3.webp'
    ];

    mediaElements.forEach(src => {
        const full = base + src;
        if (src.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = full;
            video.preload = 'metadata';
        } else {
            const img = new Image();
            img.src = full;
        }
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadMedia);

// Easter egg disabled for a cleaner, elegant experience
