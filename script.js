document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Match CSS transition duration
        });
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const switchThemeImages = (theme) => {
        const images = document.querySelectorAll('.theme-image');
        images.forEach(img => {
            const newSrc = theme === 'dark' ? img.dataset.dark : img.dataset.light;
            if (newSrc) img.src = newSrc;

            // Switch style classes based on theme
            img.classList.toggle('dark-style', theme === 'dark');
            img.classList.toggle('light-style', theme !== 'dark');
        });
    };

    // On page load: apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        switchThemeImages('dark');
        darkModeToggle?.querySelector('i')?.classList.replace('fa-moon', 'fa-sun');
    } else {
        switchThemeImages('light');
    }

    // On toggle click
    darkModeToggle?.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        switchThemeImages(isDark ? 'dark' : 'light');
        darkModeToggle?.querySelector('i')?.classList.replace(
            isDark ? 'fa-moon' : 'fa-sun',
            isDark ? 'fa-sun' : 'fa-moon'
        );
    });



    // --- Sticky Navbar & Active Link Highlighting ---
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function updateNavAndSticky() {
        // Sticky header
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Active link highlighting
        let currentActive = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight; // Adjust for sticky header height
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentActive = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(currentActive)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNavAndSticky);
    // Call on load to set initial state
    updateNavAndSticky();

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // --- Smooth Scroll for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - header.offsetHeight; // Adjust for sticky header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Hero Section Typing Animation ---
    const typingTextElement = document.getElementById('typing-text');
    const phrases = ["Creative Developer", "Web Designer", "Frontend Enthusiast", "Problem Solver"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100; // milliseconds per character
    const deletingSpeed = 50;
    const pauseBeforeDelete = 1500; // milliseconds
    const pauseBeforeType = 500;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            currentSpeed = pauseBeforeDelete;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            currentSpeed = pauseBeforeType;
        }

        setTimeout(typeWriter, currentSpeed);
    }

    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);

    // --- Scroll Animations (Intersection Observer API) ---
    const animateElements = document.querySelectorAll('.fade-in, .fade-in-up');
    const skillProgressBars = document.querySelectorAll('.progress-bar');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // For skill progress bars, set their actual width when they become active
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        progressBar.style.width = progressBar.style.width; // Re-apply width to trigger transition
                    }
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Manually trigger progress bar animation if already in view on load
    skillProgressBars.forEach(bar => {
        const skillCard = bar.closest('.skill-card');
        if (skillCard && skillCard.getBoundingClientRect().top < window.innerHeight) {
            skillCard.classList.add('active'); // Add active class to parent for general fade-in
            bar.style.width = bar.style.width; // Trigger width transition
        }
    });


    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Contact Form Validation and Custom Message Box ---
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    const messageBox = document.getElementById('messageBox');
    const messageBoxText = document.getElementById('messageBoxText');
    const messageBoxOkBtn = document.getElementById('messageBoxOkBtn');
    const messageBoxCloseBtn = messageBox.querySelector('.close-button');

    function showMessageBox(message) {
        messageBoxText.textContent = message;
        messageBox.classList.add('show');
        body.classList.add('no-scroll'); // Prevent scrolling behind modal
    }

    function hideMessageBox() {
        messageBox.classList.remove('show');
        body.classList.remove('no-scroll');
    }

    messageBoxOkBtn.addEventListener('click', hideMessageBox);
    messageBoxCloseBtn.addEventListener('click', hideMessageBox);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) { // Close if clicked outside content
            hideMessageBox();
        }
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        let isValid = true;

        // Name validation
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Name is required.';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required.';
            isValid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        // Message validation
        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Message is required.';
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters long.';
            isValid = false;
        } else {
            messageError.textContent = '';
        }

        if (isValid) {
            // In a real application, you would send this data to a server
            // using fetch() or XMLHttpRequest.
            console.log('Form Submitted Successfully!');
            console.log('Name:', nameInput.value);
            console.log('Email:', emailInput.value);
            console.log('Message:', messageInput.value);

            showMessageBox('Thank you for your message! I will get back to you soon.');

            // Clear the form
            contactForm.reset();
        } else {
            showMessageBox('Please correct the errors in the form.');
        }
    });


    // Banner ---------------------------------------------------------------------------
    const slides = document.getElementById('slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    const dotsContainer = document.getElementById('dotsContainer');
    let currentIndex = 0;
    let interval;
    let startX = 0; 

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dots span');
    const updateSlider = () => {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    };

    const startAutoSlide = () => {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }, 3000);
    };

    const stopAutoSlide = () => clearInterval(interval);

    // Dots click
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.index);
            updateSlider();
        });
    });

    // Arrows
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    // Pause on hover
    const banner = document.getElementById('bannerSlider');
    banner.addEventListener('mouseenter', stopAutoSlide);
    banner.addEventListener('mouseleave', startAutoSlide);

    // Swipe on mobile
    banner.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    });

    banner.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            } else {
                currentIndex = (currentIndex + 1) % totalSlides;
            }
            updateSlider();
        }

        startAutoSlide();
    });

    updateSlider();
    startAutoSlide();


    // Project data object to store details for each project
    const projectData = {
        'Jansatta': {
            overview: [
                'Digital news platform for Hindi readers',
                'Multi-platform presence (Web, Android, iOS)',
                'Real-time news updates and notifications'
            ],
            features: [
                'Live news updates',
                'Category-based news organization',
                'Push notifications for breaking news',
                'Offline reading capability'
            ],
            technologies: [
                'Selenium WebDriver',
                'Python',
                'Pytest',
                'Jenkins',
                'JIRA'
            ],
            role: [
                'Led end-to-end testing of web and mobile applications',
                'Developed automated test suites reducing testing time by 60%',
                'Implemented CI/CD pipeline for test automation',
                'Coordinated with development team for bug fixes'
            ]
        },
        'Loksatta': {
            overview: [
                'Marathi language news platform',
                'Digital transformation of traditional newspaper',
                'Focus on regional news coverage'
            ],
            features: [
                'Multilingual support',
                'Video content integration',
                'Social media sharing',
                'Personalized news feed'
            ],
            technologies: [
                'Selenium WebDriver',
                'Python',
                'TestNG',
                'Git',
                'JIRA'
            ],
            role: [
                'Managed test automation framework',
                'Created comprehensive test scenarios',
                'Performed cross-browser testing',
                'Tracked and reported bugs using JIRA'
            ]
        }
    };

    // --- Modal Functionality ---
    const modal = document.getElementById('projectModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const projectLinks = document.querySelectorAll('.project-link');

    function populateProjectModal(projectTitle) {
        const data = projectData[projectTitle] || {
            overview: ['Project details coming soon'],
            features: ['Features to be updated'],
            technologies: ['Technologies to be updated'],
            role: ['Role details to be updated']
        };

        document.getElementById('modalProjectTitle').textContent = projectTitle;
        
        // Helper function to populate lists
        const populateList = (listId, items) => {
            const ul = document.getElementById(listId);
            ul.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
        };

        // Populate all sections
        populateList('modalProjectOverview', data.overview);
        populateList('modalProjectFeatures', data.features);
        populateList('modalProjectTech', data.technologies);
        populateList('modalProjectRole', data.role);
    }

    // Function to toggle body scroll
    const toggleBodyScroll = (disable) => {
        document.body.style.overflow = disable ? 'hidden' : '';
        document.body.classList.toggle('modal-open', disable);
    };

    // Function to open modal
    const openModal = (projectTitle) => {
        populateProjectModal(projectTitle);
        modal.style.display = 'block';
        toggleBodyScroll(true);
    };

    // Function to close modal
    const closeModal = () => {
        modal.style.display = 'none';
        toggleBodyScroll(false);
    };

    // Event listeners for project links
    projectLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const projectTitle = link.closest('.portfolio-overlay').querySelector('h3').textContent;
            openModal(projectTitle);
        });
    });

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal();
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });


    // // Share button functionality
    // const shareButton = document.getElementById('shareButton');
    // const socialShareButtons = document.querySelector('.social-share-buttons');

    // shareButton.addEventListener('click', () => {
    //     socialShareButtons.classList.toggle('active');
    // });

    // Add click handlers for social media buttons
    const fbShare = document.querySelector('.social-share.facebook');
    const twitterShare = document.querySelector('.social-share.twitter');
    const linkedinShare = document.querySelector('.social-share.linkedin');
    const whatsappShare = document.querySelector('.social-share.whatsapp');

    // Get the current page URL
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    fbShare.addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank');
    });

    twitterShare.addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`, '_blank');
    });

    linkedinShare.addEventListener('click', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`, '_blank');
    });

    whatsappShare.addEventListener('click', () => {
        window.open(`https://api.whatsapp.com/send?text=${pageTitle} ${pageUrl}`, '_blank');
    });

    // Close social share buttons when clicking outside
    document.addEventListener('click', (e) => {
        if (!shareButton.contains(e.target) && !socialShareButtons.contains(e.target)) {
            socialShareButtons.classList.remove('active');
        }
    });
});
