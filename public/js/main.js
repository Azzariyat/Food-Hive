// Smooth scrolling for navigation links
const initSmoothScrolling = () => {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Navbar scroll effect
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }
};

// Intersection Observer for animations
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe cards
    const cards = document.querySelectorAll('.donation-card, .partner-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
};

// Counter animation for statistics
const initCounterAnimation = () => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
};

// Mobile menu toggle
const initMobileMenu = () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
};

// Form validation helper
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'Field ini harus diisi');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
};

const showFieldError = (field, message) => {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
};

const clearFieldError = (field) => {
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
};

// Show toast notification
const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
};

const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
};

// Check authentication status
const checkAuthStatus = () => {
    const user = JSON.parse(localStorage.getItem('foodhive_current_user'));
    const loginBtn = document.getElementById('loginBtn');

    if (user && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user-circle me-2"></i>${user.nama}`;
        loginBtn.href = '#';
        
        const logoutBtn = document.createElement('a');
        logoutBtn.className = 'btn btn-outline-danger rounded-pill px-4 ms-2';
        logoutBtn.textContent = 'Logout';
        logoutBtn.href = '#';
        logoutBtn.addEventListener('click', logout);

        loginBtn.parentNode.appendChild(logoutBtn);
    }
};

// Logout function
const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('foodhive_current_user');
    showToast('Berhasil logout', 'info');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initNavbarScroll();
    initScrollAnimations();
    initCounterAnimation();
    initMobileMenu();
    checkAuthStatus();
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    const swiper = new Swiper('.donation-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
                centeredSlides: false,
            },
            1024: {
                slidesPerView: 2.5,
                spaceBetween: 40,
                centeredSlides: true,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: true,
            }
        },
        effect: 'slide',
        speed: 600,
        grabCursor: true,
    });

    // Custom button navigation
    const prevBtn = document.querySelector('.custom-prev-btn');
    const nextBtn = document.querySelector('.custom-next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            swiper.slidePrev();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            swiper.slideNext();
        });
    }

    // Smooth scrolling for scrollable images
    const scrollableImages = document.querySelector('.scrollable-images');
    if (scrollableImages) {
        let isScrolling = false;
        
        scrollableImages.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            if (!isScrolling) {
                isScrolling = true;
                
                const scrollAmount = e.deltaY > 0 ? 150 : -150;
                
                scrollableImages.scrollTo({
                    top: scrollableImages.scrollTop + scrollAmount,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 150);
            }
        });
        
        // Auto scroll animation
        let autoScrollDirection = 1;
        let autoScrollPaused = false;
        
        function autoScroll() {
            if (!autoScrollPaused) {
                const maxScroll = scrollableImages.scrollHeight - scrollableImages.clientHeight;
                const currentScroll = scrollableImages.scrollTop;
                
                if (currentScroll >= maxScroll - 5) {
                    autoScrollDirection = -1;
                } else if (currentScroll <= 5) {
                    autoScrollDirection = 1;
                }
                
                scrollableImages.scrollTop += autoScrollDirection * 0.5;
            }
        }
        
        // Pause auto scroll on hover
        scrollableImages.addEventListener('mouseenter', () => {
            autoScrollPaused = true;
        });
        
        scrollableImages.addEventListener('mouseleave', () => {
            autoScrollPaused = false;
        });
        
        // Start auto scroll
        setInterval(autoScroll, 50);
    }

    // Add hover effects to donation cards
    const donasiCards = document.querySelectorAll('.donasi-card');
    donasiCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Tambahkan fungsi-fungsi ini ke dalam file main.js yang sudah ada

// FAQ Navigation and Integration
const initFAQNavigation = () => {
    // Update navigation highlighting for FAQ page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page
        if ((currentPath.includes('faq') && href.includes('faq')) ||
            (currentPath.includes('index') && href.includes('index')) ||
            (currentPath === '/' && href.includes('index'))) {
            link.classList.add('active');
        }
    });
};

// FAQ Search functionality (jika ada search box di FAQ)
const initFAQSearch = () => {
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            let visibleCount = 0;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm) || searchTerm === '') {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show "no results" message if no FAQ items match
            showNoResultsMessage(visibleCount === 0 && searchTerm !== '');
        });
    }
};

// Show/hide no results message
const showNoResultsMessage = (show) => {
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'text-center py-5';
        noResultsMsg.innerHTML = `
            <div class="text-muted">
                <i class="fas fa-search fa-3x mb-3"></i>
                <h5>Tidak ada hasil yang ditemukan</h5>
                <p>Coba gunakan kata kunci yang berbeda</p>
            </div>
        `;
        
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            faqContainer.appendChild(noResultsMsg);
        }
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
};

// FAQ Analytics (track which FAQ items are viewed)
const trackFAQInteraction = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question, index) => {
        question.addEventListener('click', function() {
            // Track FAQ interaction (you can send this to analytics)
            const faqTitle = this.textContent.trim();
            console.log(`FAQ Clicked: ${faqTitle}`);
            
            // You can add analytics tracking here
            // Example: gtag('event', 'faq_click', { 'faq_question': faqTitle });
        });
    });
};

// Add breadcrumb navigation
const initBreadcrumb = () => {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (breadcrumbContainer) {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);
        
        // Clear existing breadcrumb
        breadcrumbContainer.innerHTML = '';
        
        // Create breadcrumb structure
        const breadcrumbNav = document.createElement('nav');
        breadcrumbNav.className = 'container';
        
        // Home link
        const homeLink = document.createElement('a');
        homeLink.href = pathSegments.includes('pages') ? '../index.html' : 'index.html';
        homeLink.textContent = 'Beranda';
        breadcrumbNav.appendChild(homeLink);
        
        // Add separator and current page
        if (currentPath.includes('faq')) {
            const separator = document.createElement('span');
            separator.className = 'separator';
            separator.textContent = ' > ';
            breadcrumbNav.appendChild(separator);
            
            const current = document.createElement('span');
            current.className = 'current';
            current.textContent = 'FAQ';
            breadcrumbNav.appendChild(current);
        }
        
        breadcrumbContainer.appendChild(breadcrumbNav);
    }
};

// Enhanced mobile menu for FAQ
const initEnhancedMobileMenu = () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
};

// Back to top functionality
const initBackToTop = () => {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= 300) {
                        backToTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// FAQ specific scroll animations
const initFAQAnimations = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Initialize FAQ items for animation
        faqItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }
};

// FAQ Print functionality
const initFAQPrint = () => {
    const printBtn = document.getElementById('print-faq');
    
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // Expand all FAQ items before printing
            const faqAnswers = document.querySelectorAll('.faq-answer');
            const faqQuestions = document.querySelectorAll('.faq-question');
            
            faqAnswers.forEach(answer => answer.classList.add('active'));
            faqQuestions.forEach(question => question.classList.add('active'));
            
            // Print
            window.print();
            
            // Collapse FAQ items after printing
            setTimeout(() => {
                faqAnswers.forEach(answer => answer.classList.remove('active'));
                faqQuestions.forEach(question => question.classList.remove('active'));
            }, 1000);
        });
    }
};

// FAQ Share functionality
const initFAQShare = () => {
    const shareBtn = document.getElementById('share-faq');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'FAQ - FoodHive',
                text: 'Temukan jawaban untuk pertanyaan yang sering diajukan tentang FoodHive',
                url: window.location.href
            };
            
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback: copy to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    showToast('Link FAQ berhasil disalin ke clipboard!', 'success');
                }
            } catch (err) {
                console.error('Error sharing:', err);
                // Fallback: copy to clipboard
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    showToast('Link FAQ berhasil disalin ke clipboard!', 'success');
                } catch (clipboardErr) {
                    showToast('Gagal membagikan FAQ', 'error');
                }
            }
        });
    }
};

// Update the main initialization function
const initializeFAQFeatures = () => {
    // Check if we're on FAQ page
    if (window.location.pathname.includes('faq')) {
        initFAQSearch();
        initFAQAnimations();
        initFAQPrint();
        initFAQShare();
        trackFAQInteraction();
    }
    
    // These functions work on all pages
    initFAQNavigation();
    initBreadcrumb();
    initEnhancedMobileMenu();
    initBackToTop();
};

// Update the main DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Existing functions
    initSmoothScrolling();
    initNavbarScroll();
    initScrollAnimations();
    initCounterAnimation();
    initMobileMenu();
    checkAuthStatus();
    
    // New FAQ functions
    initializeFAQFeatures();
});

// Add keyboard navigation for FAQ
document.addEventListener('keydown', (e) => {
    if (window.location.pathname.includes('faq')) {
        const faqQuestions = document.querySelectorAll('.faq-question');
        const activeElement = document.activeElement;
        
        if (activeElement && activeElement.classList.contains('faq-question')) {
            const currentIndex = Array.from(faqQuestions).indexOf(activeElement);
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % faqQuestions.length;
                    faqQuestions[nextIndex].focus();
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex === 0 ? faqQuestions.length - 1 : currentIndex - 1;
                    faqQuestions[prevIndex].focus();
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    activeElement.click();
                    break;
            }
        }
    }
});

// FAQ URL handling for direct links to specific questions
const handleFAQUrlHash = () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#faq-')) {
        const faqId = hash.substring(1);
        const faqAnswer = document.getElementById(faqId);
        const faqQuestion = document.querySelector(`[data-faq="${faqId.split('-')[1]}"]`);
        
        if (faqAnswer && faqQuestion) {
            // Open the specific FAQ
            faqQuestion.classList.add('active');
            faqAnswer.classList.add('active');
            
            // Scroll to the FAQ item
            setTimeout(() => {
                faqQuestion.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    }
};

// Handle URL hash on page load and hash change
window.addEventListener('load', handleFAQUrlHash);
window.addEventListener('hashchange', handleFAQUrlHash);
// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);