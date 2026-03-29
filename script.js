document.addEventListener('DOMContentLoaded', () => {

    // --- Password Protection ---
    const passwordOverlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('site-password');
    const submitBtn = document.getElementById('submit-password');
    const errorMsg = document.getElementById('password-error');

    // Simple password implementation - 'love' 
    const correctPassword = 'love';

    function checkPassword() {
        if (passwordInput.value.toLowerCase() === correctPassword) {
            passwordOverlay.style.opacity = '0';
            setTimeout(() => {
                passwordOverlay.style.display = 'none';
                mainContent.style.display = 'block';
                // Trigger reflow to ensure styles apply correctly after display:none
                window.dispatchEvent(new Event('resize'));
            }, 500);
        } else {
            errorMsg.style.display = 'block';
            passwordInput.style.borderColor = '#e74c3c';
            // Simple shake animation for error
            passwordInput.style.transform = 'translateX(-10px)';
            setTimeout(() => passwordInput.style.transform = 'translateX(10px)', 100);
            setTimeout(() => passwordInput.style.transform = 'translateX(-10px)', 200);
            setTimeout(() => passwordInput.style.transform = 'translateX(0)', 300);
        }
    }

    submitBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });


    // --- Navigation & Scroll Effects ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scroll effect for navbar background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- RSVP Form Handling ---
    const rsvpForm = document.getElementById('rsvp-form');
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guests-group');
    const rsvpSuccess = document.getElementById('rsvp-success');

    // Show/hide guest count based on attendance
    attendanceSelect.addEventListener('change', (e) => {
        if (e.target.value === 'yes') {
            guestsGroup.style.display = 'block';
        } else {
            guestsGroup.style.display = 'none';
        }
    });

    // Handle form submission
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Mock success
        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            rsvpForm.style.display = 'none';
            rsvpSuccess.classList.remove('hidden');
        }, 1000);
    });

    // --- Story Slideshow Handling ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slide-nav.prev');
    const nextBtn = document.querySelector('.slide-nav.next');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            // Handle wrap-around
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;

            // Remove active class from all
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Add active class to current
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() { showSlide(currentSlide + 1); }
        function prevSlide() { showSlide(currentSlide - 1); }

        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 4000); // Change image every 4 seconds
        }

        function resetSlideshow() {
            clearInterval(slideInterval);
            startSlideshow();
        }

        // Event Listeners for Manual Control
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideshow();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideshow();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideshow();
            });
        });

        // Start the automated slideshow
        startSlideshow();
    }


});
