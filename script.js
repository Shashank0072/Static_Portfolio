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
    document.querySelectorAll('.nav-link, .mobile-nav-link, .logo').forEach(anchor => {
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
                'A Hindi-language news platform under the Indian Express Group, offering real-time news, editorials, and multimedia content across multiple categories including politics, entertainment, and sports.',
                'High-traffic website with complex schema structures, SEO optimization, and dynamic content delivery.'
                
            ],
            features: [
                'Schema markup and SEO data validation (including multilingual schema support)',
                'Article publishing and CMS workflows',
                'Responsive UI across mobile, tablet, and desktop',
                'Video embedding, photo gallery rendering, and AMP (Accelerated Mobile Pages)',
                'Sitemap generation and validation for search engine indexing'
            ],
            technologies: [
                'JavaScript, Playwright',
                ' Postman, REST Assured',
                'Manual Testing',
                'Jenkins, GitHub',
                'Allure Reports',
                'JIRA',
                ' Lighthouse, Screaming Frog (SEO validation), Chrome DevTools'
            ],
            role: [
                'Developed end-to-end automation test suites for article creation, update, and rendering flows',
                'Created custom validators for schema markup (JSON-LD) to ensure SEO compliance',
                'Automated sitemap validation to detect malformed characters (Hindi, special ASCII)',
                'Performed mobile-first UI validation for responsive layout consistency',
                'Collaborated closely with editorial and SEO teams for test planning and release sign-off',
                'Configured test reporting and integrated Allure reports with CI pipelines'
            ],
            outcome:[
                'Reduced schema-related SEO issues by 70% through proactive automation checks',
                'Helped maintain 99.9% uptime and fast news publishing cycles during high-traffic events (elections, cricket, etc.)',
                'Identified multiple sitemap issues before search engine crawlers flagged them, improving indexing efficiency',
                'Significantly reduced manual QA effort with reusable automation suites'
            ],
            liveLink: 'https://www.jansatta.com/',
            githubLink: 'https://play.google.com/store/apps/details?id=com.jansatta.android&hl=en_IN', // No public GitHub repo for this project
            modalAppLink:'https://apps.apple.com/in/app/jansatta-hindi-news-epaper/id1087354876'

        },
        'Loksatta': {
           overview: [
                'A leading Marathi-language news portal under the Indian Express Group, delivering breaking news, regional updates, and multimedia content across various domains including politics, entertainment, and lifestyle.',
                'Focused on multilingual support, regional audience engagement, and fast content delivery.'
                
            ],
            features: [
                'CMS-driven article publishing, tagging, and categorization',
                'Schema markup validation for rich search results (with Marathi content)',
                'Sitemap generation for news and multimedia pages',
                'AMP (Accelerated Mobile Pages) rendering for mobile web',
                'Video carousel, trending news widgets, and infinite scroll behavior',
                'Ad placements, lazy loading, and performance optimization'
            ],
            technologies: [
                'JavaScript, Playwright',
                ' Postman, REST Assured',
                'Manual Testing',
                'Jenkins, GitHub',
                'Allure Reports',
                'JIRA',
                ' Lighthouse, Screaming Frog (SEO validation), Chrome DevTools'
            ],
            role: [
                'Created reusable Playwright scripts for E2E testing of core editorial workflows',
                'Built automated validators for schema compliance in Marathi language (including unicode/special character handling)',
                'Integrated sitemap sanity checks into CI pipeline to capture malformed entries proactively',
                'Conducted AMP testing to ensure proper rendering and tracking behavior',
                'Reported and tracked performance bottlenecks in homepage and listing pages',
                'Worked closely with SEO team to identify schema inconsistencies and fix regressions early'
            ],
            outcome:[
                'Prevented multiple SEO-related defects in schema and sitemap before production release',
                'Improved regression coverage of multilingual content by 80% through automation',
                'Boosted test execution speed with parallel test suites in CI/CD pipeline',
                'Enabled faster releases with minimal manual intervention by QA team'
            ],
            liveLink: 'https://www.loksatta.com/',
            githubLink: 'https://play.google.com/store/search?q=loksatta&c=apps&hl=en_IN',
            modalAppLink:'https://apps.apple.com/in/app/loksatta-marathi-news-epaper/id520802260'
        },
        'Trade India': {
            overview: [
                "A B2B e-commerce marketplace connecting buyers and suppliers across various industries with product listings, inquiries, lead management, and real-time chat.",
                "Supports high-volume traffic, multilingual content, and complex business workflows like RFQs (Request for Quotations) and buyer-seller negotiations."    
            ],
            features: [
                "Buyer and seller registration and login workflows (OTP/email verification)",
                "Product listing, search filters, and inquiry generation",
                "Lead tracking and message center modules",
                "Chat integration, contact form, and secure document upload",
                "Admin panel functionalities and vendor approval workflows",
                "SEO-critical pages like company profile, trade leads, and static URLs"
            ],
            technologies: ['Python','selenium','Manual Testing', 'JIRA', 'SQL', 'Postman'],
            role: [
                "Developed scalable automation suite for regression testing of buyer-seller interaction flows",
                "Automated API validation for lead generation and chat services",
                "Built custom scripts to verify large-scale sitemap entries and schema for product and company pages",
                "Performed cross-browser and mobile responsiveness testing for B2B workflows",
                "Collaborated with developers and product managers for sprint-wise test planning and demo validations",
                "Created test data pipelines for large-scale load simulation and marketplace behavior testing"
            ],
            outcome: [
                "ImprReduced manual testing time by 65% through robust automation coverage",
                "Identified critical search indexing bugs affecting 1,000+ product listings pre-release",
                "Improved accuracy of lead tracking features through API and UI-level validation",
                "Helped streamline CI-integrated QA processes, accelerating release cycles by 30%"
            ],
            liveLink: 'https://www.tradeindia.com/',
            githubLink: 'https://play.google.com/store/search?q=trade%20india&c=apps&hl=en_IN',
            modalAppLink:'https://apps.apple.com/in/app/tradeindia-b2b-business-app/id1049304422'
        },
        'TV9 News': {
           overview: [
                'Native news applications (Android & iOS) delivering real-time regional and national news in multiple Indian languages.',
                'Backed by a dynamic CMS for content publishing, media management, and breaking news alerts.',
                'Designed to handle high traffic, push notifications, and multimedia content (videos, carousels, galleries).'
                
            ],
            features: [
                'App onboarding, push notifications, and breaking news alerts',
                'Video player (custom & YouTube), live TV stream, and offline caching',
                'CMS publishing flow: story creation, media tagging, author and section management',
                'Search functionality, news filters, and personalized feeds',
                'Language toggle and localization support',
                'Integration with analytics SDKs and ad SDKs (Google Ads, Firebase)'
            ],
            technologies: [
                ' Postman, REST Assured',
                // 'Jenkins, GitHub',
                'Perfomance Testing',
                'Manual Testing',
                'Firebase Crashlytics',
                'Google Analytics',
                'JIRA',
                // 'Screaming Frog (SEO validation), Chrome DevTools'
            ],
            role: [
                'Designed and implemented hybrid testing strategy across mobile and CMS platforms',
                'Performed API validation for story publishing, notification dispatch, and video endpoints',
                'Conducted localization testing for Telugu, Kannada, Marathi, and Hindi news streams',
                'Led defect triage meetings across mobile, backend, and editorial teams',
                'Validated analytics event firing (Firebase, Mixpanel, Comscore) for user actions and tracking',
                // 'Worked closely with SEO team to identify schema inconsistencies and fix regressions early'
            ],
            outcome:[
                'Reduced mobile release testing time by 50% with robust automation pipelines',
                'Caught critical CMS publishing bug before app store deployment',
                'Improved coverage of edge-case scenarios like offline mode, push retries, and video fallback',
                'Enabled nightly automation on real devices using BrowserStack, boosting release confidence'
            ],
            liveLink: 'https://www.tv9hindi.com/',
            githubLink: 'https://play.google.com/store/apps/details?id=com.tv9news&hl=en_IN',
            modalAppLink:'https://apps.apple.com/in/app/tv9-news-app-live-tv-news/id1671484759'
        },
        'Proceum': {
           overview: [
                'Proceum is a SaaS-based platform that allows organizations to manage SOPs (Standard Operating Procedures), audits, and compliance workflows digitally.',
                'The platform supports multi-role access, document workflows, audit trails, notifications, and dashboards for compliance monitoring.'
                
            ],
            features: [
                'High-concurrency access to workflows and audit modules',
                'Concurrent SOP approvals, document uploads/downloads',
                'Load on notification and reminder dispatch system',
                'Dashboard rendering with real-time compliance status',
                'Role-based access handling under stress',
                // 'Ad placements, lazy loading, and performance optimization'
            ],
            technologies: [
                'Apache JMeter, BlazeMeter',
                ' Postman, REST Assured',
                // 'Jenkins, GitHub',
                // 'Allure Reports',
                'JIRA',
                // ' Lighthouse, Screaming Frog (SEO validation), Chrome DevTools'
            ],
            role: [
                'Designed and executed comprehensive load testing strategy simulating 500–1000 concurrent users',
                'Developed JMeter scripts covering critical business transactions like login, SOP creation, review, and approval',
                'Analyzed system performance under sustained load and during peak usage hours',
                'Identified key performance bottlenecks in backend APIs and DB queries',
                'Worked with DevOps to monitor and fine-tune server metrics (CPU, Memory, IOPS)',
                'Provided detailed load test reports with recommendations on scalability and system tuning'
            ],
            outcome:[
                'Improved API response time by 35% through optimizations suggested from load test results',
                'Prevented production downtime by uncovering DB connection leaks during testing',
                'Enabled the platform to scale for enterprise clients with >10,000 users',
                'Established recurring load test suite as part of the release pipeline to ensure consistent performance benchmarks'
            ],
            liveLink: '',
            githubLink: 'https://play.google.com/store/search?q=proceum&c=apps&hl=en_IN',
            modalAppLink:'https://apps.apple.com/in/app/proceum/id6470613362'
        },

        'Physics Wallah': {
            overview: [
                "An Ed-tech platform providing affordable and quality education for competitive exams.",
                "Caters to millions of students across India."
            ],
            features: ["Live classes", "Recorded lectures", "Online tests", "Doubt solving sessions"],
            technologies: ['Selenium WebDriver', 'Python', 'Pytest', 'Appium', 'JIRA'],
            role: [
                "Performed functional and regression testing on web and mobile platforms.",
                "Contributed to the automation framework for regression test suites.",
                "Validated new features and ensured they met quality standards before release."
            ],
            outcome: ["Ensured a stable and bug-free learning experience for students.", "Reduced manual testing effort through automation."],
            liveLink: 'https://www.pw.live/',
            githubLink: '',
            modalAppLink:''
        },
        // Add other projects here in the same format...
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
            role: ['Role details to be updated'],
            outcome: ['Outcome details to be updated'],
            liveLink: '',
            githubLink: '',
            modalAppLink:''
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
        populateList('modalProjectOutcome', data.outcome);

        // Populate project links
        const liveLinkBtn = document.getElementById('modalLiveLink');
        const githubLinkBtn = document.getElementById('modalGithubLink');
        const appLinkBtn = document.getElementById('modalAppLink');

        if (liveLinkBtn) {
            if (data.liveLink) {
                liveLinkBtn.href = data.liveLink;
                liveLinkBtn.style.display = 'inline-block';
            } else {
                liveLinkBtn.style.display = 'none';
            }
        }

        if (githubLinkBtn) {
            if (data.githubLink) {
                githubLinkBtn.href = data.githubLink;
                githubLinkBtn.style.display = 'inline-block';
            } else {
                githubLinkBtn.style.display = 'none';
            }
        }

        if(appLinkBtn){
            if (data.modalAppLink) {
                appLinkBtn.href = data.modalAppLink;
                appLinkBtn.style.display = 'inline-block';
            } else {
                appLinkBtn.style.display = 'none';
            }
        }
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
