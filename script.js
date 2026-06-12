document.addEventListener('DOMContentLoaded', () => {

    // --- Password Protection ---
    const passwordOverlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    const passwordInput = document.getElementById('site-password');
    const submitBtn = document.getElementById('submit-password');
    const errorMsg = document.getElementById('password-error');

    // Simple password implementation
    const correctPassword = 'damian';

    if (sessionStorage.getItem('unlocked')) {
        passwordOverlay.style.display = 'none';
        mainContent.style.display = 'block';
    }

    function checkPassword() {
        if (passwordInput.value.toLowerCase() === correctPassword) {
            sessionStorage.setItem('unlocked', '1');
            passwordOverlay.style.opacity = '0';
            setTimeout(() => {
                passwordOverlay.style.display = 'none';
                mainContent.style.display = 'block';
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
    const guestsExtraGroup = document.getElementById('guests-extra-group');
    const guestsGroup = document.getElementById('guests-group');
    const rsvpSuccess = document.getElementById('rsvp-success');

    // Show/hide guest details based on attendance, toggle required fields
    attendanceSelect.addEventListener('change', (e) => {
        const attending = e.target.value === 'yes';
        guestsGroup.style.display = attending ? 'block' : 'none';
        if (guestsExtraGroup) guestsExtraGroup.style.display = attending ? 'flex' : 'none';

        const requiredWhenAttending = ['entree', 'main', 'plus_one', 'kids'];
        requiredWhenAttending.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.required = attending;
        });

        if (!attending) {
            const plusOneSelect = document.getElementById('plus_one');
            if (plusOneSelect) {
                plusOneSelect.value = '';
                plusOneSelect.dispatchEvent(new Event('change'));
            }
            const kidsSelect = document.getElementById('kids');
            if (kidsSelect) {
                kidsSelect.value = '';
                kidsSelect.dispatchEvent(new Event('change'));
            }
        }
    });

    // Handle Plus One dynamically
    const plusOneSelect = document.getElementById('plus_one');
    const plusOneNameContainer = document.getElementById('plus-one-name-container');
    const plusOneNameInput = document.getElementById('plus_one_name');

    plusOneSelect.addEventListener('change', (e) => {
        const plusOneEntree = document.getElementById('plus_one_entree');
        const plusOneMain = document.getElementById('plus_one_main');
        if (e.target.value === 'Yes') {
            plusOneNameContainer.style.display = 'block';
            plusOneNameInput.required = true;
            plusOneEntree.required = true;
            plusOneMain.required = true;
        } else {
            plusOneNameContainer.style.display = 'none';
            plusOneNameInput.required = false;
            plusOneNameInput.value = '';
            plusOneEntree.required = false;
            plusOneEntree.value = '';
            plusOneMain.required = false;
            plusOneMain.value = '';
        }
    });

    // Handle Kids dynamically
    const kidsSelect = document.getElementById('kids');
    const kidsNamesContainer = document.getElementById('kids-names-container');

    const kidsMenuNotice = document.getElementById('kids-menu-notice');

    kidsSelect.addEventListener('change', (e) => {
        const numKids = parseInt(e.target.value) || 0;
        kidsNamesContainer.innerHTML = '';
        kidsMenuNotice.style.display = numKids > 0 ? 'block' : 'none';

        for (let i = 1; i <= numKids; i++) {
            const kidGroup = document.createElement('div');
            kidGroup.style.marginBottom = '5px';
            kidGroup.innerHTML = `
                <label for="kid_name_${i}" style="font-size: 0.9rem; margin-bottom: 5px; display: block;">Kid ${i}'s Name</label>
                <input type="text" id="kid_name_${i}" name="10 - Kid ${i} Name" placeholder="Kid ${i}'s name" required style="width: 100%;">
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

        const isFrench = document.documentElement.lang === 'fr';
        const isSpanish = document.documentElement.lang === 'es';
        const isAttending = attendanceSelect.value === 'yes';

        const contactLine = `<p style="margin-top: 1rem; font-size: 0.9rem;">${isFrench
            ? 'Si quelque chose change de votre côté, contactez-nous à'
            : isSpanish ? 'Si algo cambia, contáctanos en'
            : 'If anything changes, just reach out to'
        } <a href="mailto:michael.cartier@me.com" style="text-decoration: underline;">michael.cartier@me.com</a> ${isFrench ? 'ou' : isSpanish ? 'o' : 'or'} <a href="mailto:kara.lopez@icloud.com" style="text-decoration: underline;">kara.lopez@icloud.com</a>.</p>`;

        if (isAttending) {
            rsvpSuccess.innerHTML = `<h3>${isFrench ? 'Merci !' : isSpanish ? '¡Gracias!' : 'Thank you!'}</h3>
                <p>${isFrench ? 'Votre RSVP a bien été reçu. Nous avons hâte de vous voir !' : isSpanish ? 'Hemos recibido tu confirmación. ¡No podemos esperar para verte!' : "Your RSVP has been received. We can't wait to see you!"}</p>
                ${contactLine}`;
        } else {
            rsvpSuccess.innerHTML = `<h3>${isFrench ? 'C\'est dommage !' : isSpanish ? '¡Te echaremos de menos!' : 'We\'ll miss you!'}</h3>
                <p>${isFrench ? 'Nous sommes tristes de ne pas pouvoir vous compter parmi nous.' : isSpanish ? 'Nos da pena que no puedas acompañarnos.' : "We're sad to hear you can't join us."}</p>
                ${contactLine}`;
        }

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

function addSecondSong() {
    var c = document.getElementById('song2-container');
    var btn = document.getElementById('add-song-btn');
    if (c) c.style.display = 'flex';
    if (btn) btn.style.display = 'none';
}

function removeSecondSong() {
    var c = document.getElementById('song2-container');
    var inp = document.getElementById('song2');
    var btn = document.getElementById('add-song-btn');
    if (c) c.style.display = 'none';
    if (inp) inp.value = '';
    if (btn) btn.style.display = 'inline-flex';
}

// Pikachu Easter egg — triple-click the logo
(function () {
    var clicks = 0, timer = null;
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-logo')) return;
        clicks++;
        clearTimeout(timer);
        if (clicks >= 3) {
            clicks = 0;
            showPikachu();
            return;
        }
        timer = setTimeout(function () { clicks = 0; }, 600);
    });

    function showPikachu() {
        var existing = document.getElementById('pikachu-egg');
        if (existing) existing.remove();
        var el = document.createElement('div');
        el.id = 'pikachu-egg';
        el.textContent = '\u26A1\uD83D\uDC2D\u26A1';
        document.body.appendChild(el);
        setTimeout(function () {
            el.classList.add('hiding');
            setTimeout(function () { el.remove(); }, 700);
        }, 2000);
    }
}());
