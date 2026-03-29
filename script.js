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

    // Handle Plus One dynamically
    const plusOneCheckbox = document.getElementById('plus_one');
    const plusOneNameContainer = document.getElementById('plus-one-name-container');
    const plusOneNameInput = document.getElementById('plus_one_name');

    plusOneCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            plusOneNameContainer.style.display = 'block';
            plusOneNameInput.required = true;
        } else {
            plusOneNameContainer.style.display = 'none';
            plusOneNameInput.required = false;
            plusOneNameInput.value = '';
        }
    });

    // Handle Kids dynamically
    const kidsSelect = document.getElementById('kids');
    const kidsNamesContainer = document.getElementById('kids-names-container');

    kidsSelect.addEventListener('change', (e) => {
        const numKids = parseInt(e.target.value) || 0;
        kidsNamesContainer.innerHTML = ''; // Clear existing inputs
        
        for (let i = 1; i <= numKids; i++) {
            const kidGroup = document.createElement('div');
            kidGroup.style.marginBottom = '5px';
            kidGroup.innerHTML = `
                <label for="kid_name_${i}" style="font-size: 0.9rem; margin-bottom: 5px; display: block;">Kid ${i}'s Name</label>
                <input type="text" id="kid_name_${i}" name="kid_name_${i}" placeholder="Kid ${i}'s name" required style="width: 100%;">
            `;
            kidsNamesContainer.appendChild(kidGroup);
        }
    });

    // Handle form submission with Formspree AJAX
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent standard redirect

        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(rsvpForm);

        fetch(rsvpForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                rsvpForm.style.display = 'none';
                rsvpSuccess.classList.remove('hidden');
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form");
                    }
                    submitBtn.textContent = 'Send RSVP';
                    submitBtn.disabled = false;
                });
            }
        }).catch(error => {
            alert("Oops! There was a problem submitting your form");
            submitBtn.textContent = 'Send RSVP';
            submitBtn.disabled = false;
        });
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
