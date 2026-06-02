/**
 * SEPTIAN PUTRA - PERSONAL PORTFOLIO LOGIC
 * Architecture: ES6+ Modular Pattern
 */

const Portfolio = {
    // Initialization
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.initTypewriter();
        this.initRevealObserver();
        this.updateYear();
        this.handleInitialTheme();
        this.updateActiveNav();
    },

    // 1. Select all needed DOM elements
    cacheDOM() {
        this.html = document.documentElement;
        this.navbar = document.querySelector('#navbar');
        this.themeToggle = document.querySelector('#theme-toggle');
        this.hamburger = document.querySelector('.hamburger-menu');
        this.navMenu = document.querySelector('.nav-menu');
        this.typingElement = document.querySelector('#typing-text');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.navLinks = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('section[id]');
        this.contactForm = document.querySelector('#contact-form');
        this.successModal = document.querySelector('#success-modal');
        this.closeModalBtn = document.querySelector('#close-modal-btn');
        this.currentYearSpan = document.querySelector('#current-year');
    },

    // 2. Event Listeners
    bindEvents() {
        // Scroll Effect for Navbar
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
            this.updateActiveNav();
        });

        // Dark/Light Mode
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Mobile Menu
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

        // Close Menu on Link Click (Mobile)
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Project Filtering
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterProjects(e));
        });

        // Contact Form Validation
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.validateForm(e));
        }

        // Close Modal
        this.closeModalBtn.addEventListener('click', () => this.toggleModal(false));
    },

    // --- FEATURE LOGICS ---

    // 3. Theme Management (Dark/Light)
    handleInitialTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.html.setAttribute('data-theme', savedTheme);
    },

    toggleTheme() {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animasi feedback kecil pada icon
        this.themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => this.themeToggle.style.transform = 'scale(1)', 200);
    },

    // 4. Navbar & Mobile Menu
    handleNavbarScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    updateActiveNav() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        let activeId = 'hero';

        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            if (scrollPosition >= sectionTop) {
                activeId = section.id;
            }
        });

        this.navLinks.forEach(link => {
            const target = link.getAttribute('href').replace('#', '');
            if (target === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    toggleMobileMenu() {
        const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
        this.hamburger.setAttribute('aria-expanded', !isExpanded);
        this.hamburger.classList.toggle('is-active');
        
        // Toggle nav-menu active state
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    },

    closeMobileMenu() {
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.hamburger.classList.remove('is-active');
        
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    },

    // 5. Typewriter Effect
    initTypewriter() {
        const roles = [
        "Primary School Educator",
    "Learning Media Creator",
    "Interactive Lesson Designer",
    "Classroom Problem Solver"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 150;

        const type = () => {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                this.typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                this.typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Diam sebentar setelah selesai ngetik
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };
        type();
    },

    // 6. Project Filter Logic
    filterProjects(e) {
        const filterValue = e.target.getAttribute('data-filter');
        
        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        this.projectCards.forEach(card => {
            // Animasi transisi halus saat filter
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            setTimeout(() => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            }, 300);
        });
    },

    // 7. Scroll Reveal (Intersection Observer)
    initRevealObserver() {
        const options = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once it's revealed (performa)
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },

    // 8. Form Validation
    validateForm(e) {
        e.preventDefault();
        let isValid = true;
        
        const nameInput = document.querySelector('#form-name');
        const emailInput = document.querySelector('#form-email');
        const messageInput = document.querySelector('#form-message');

        // Simple validation logic
        if (nameInput.value.length < 3) {
            this.showError(nameInput);
            isValid = false;
        } else {
            this.hideError(nameInput);
        }

        if (!this.isValidEmail(emailInput.value)) {
            this.showError(emailInput);
            isValid = false;
        } else {
            this.hideError(emailInput);
        }

        if (isValid) {
            // Simulasi pengiriman data
            const submitBtn = this.contactForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                this.toggleModal(true);
                this.contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, 1500);
        }
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showError(input) {
        const group = input.parentElement;
        group.classList.add('error');
    },

    hideError(input) {
        const group = input.parentElement;
        group.classList.remove('error');
    },

    // 9. UI Helpers
    toggleModal(show) {
        this.successModal.style.display = show ? 'grid' : 'none';
        if (show) {
            this.successModal.setAttribute('aria-hidden', 'false');
        } else {
            this.successModal.setAttribute('aria-hidden', 'true');
        }
    },

    updateYear() {
        if (this.currentYearSpan) {
            this.currentYearSpan.textContent = new Date().getFullYear();
        }
    }
};

// Start the engine
document.addEventListener('DOMContentLoaded', () => {
    Portfolio.init();
});