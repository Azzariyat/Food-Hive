// Teman FoodHive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Partner data with detailed information
    const partnerData = {
        'nirmala1': {
            name: 'Panti Asuhan Nirmala',
            address: 'Jl. Tgk. Chik Pante Kulu No. 23, Baiturrahman, Banda Aceh',
            residents: '45 anak',
            contact: 'Ibu Nurlaila (082167458921)'
        },
        'penyantun': {
            name: 'Panti Asuhan Penyantun Islam',
            address: 'Setui, Kec. Baiturrahman',
            residents: '60 anak',
            contact: 'Ibu Dewi (085237990120)'
        },
        'muhammadiyah': {
            name: 'Panti Asuhan Muhammadiyah',
            address: 'Jl. Pocut Baren No. 73, Kuta Alam, Banda Aceh',
            residents: '52 anak',
            contact: 'Ibu Fatimah (081360785412)'
        },
        'muhammadiyah2': {
            name: 'Panti Asuhan Muhammadiyah',
            address: 'Jl. Pocut Baren No. 73, Kuta Alam, Banda Aceh',
            residents: '52 anak',
            contact: 'Ibu Fatimah (081360785412)'
        },
        'harapan': {
            name: 'Rumah Singgah Harapan',
            address: 'Jl. Cut Mutia No. 15, Kuta Raja, Banda Aceh',
            residents: '23 orang',
            contact: 'Bapak Ridwan (085277893214)'
        },
        'pelangi1': {
            name: 'Rumah Singgah Pelangi',
            address: 'Jl. Syiah Kuala No. 47, Syiah Kuala, Banda Aceh',
            residents: '18 orang',
            contact: 'Ibu Aminah (082367451298)'
        },
        'pelangi2': {
            name: 'Rumah Singgah Pelangi',
            address: 'Jl. Syiah Kuala No. 47, Syiah Kuala, Banda Aceh',
            residents: '18 orang',
            contact: 'Ibu Aminah (082367451298)'
        },
        'foodbank': {
            name: 'Food Bank Unsyiah',
            address: 'Jl. Teuku Nyak Arief, Darussalam, Banda Aceh',
            residents: '150 mahasiswa',
            contact: 'Bapak Ahmad (081234567890)'
        },
        'foodbank2': {
            name: 'Food Bank Unsyiah',
            address: 'Jl. Teuku Nyak Arief, Darussalam, Banda Aceh',
            residents: '150 mahasiswa',
            contact: 'Bapak Ahmad (081234567890)'
        }
    };

    // Initialize partner cards
    initializePartnerCards();
    
    // Add smooth scrolling for navigation links
    addSmoothScrolling();
    
    // Add donation button functionality
    addDonationHandlers();

    function initializePartnerCards() {
        const partnerCards = document.querySelectorAll('.partner-card');
        
        partnerCards.forEach((card, index) => {
            // Add staggered animation delay
            card.style.animationDelay = `${(index % 3) * 0.1}s`;
            
            const partnerId = card.getAttribute('data-partner');
            const data = partnerData[partnerId];
            
            if (data) {
                // Update partner details in the hover section
                const detailsSection = card.querySelector('.partner-details');
                if (detailsSection) {
                    detailsSection.innerHTML = `
                        <p><strong>Jumlah Penghuni:</strong> ${data.residents}</p>
                        <p><strong>Kontak Pengelola:</strong> ${data.contact}</p>
                    `;
                }
            }
            
            // Add hover effects
            addCardHoverEffects(card);
        });
    }

    function addCardHoverEffects(card) {
        let hoverTimeout;
        
        card.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            
            // Add subtle animation to the card
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Show additional info with delay
            hoverTimeout = setTimeout(() => {
                const details = this.querySelector('.partner-details');
                if (details) {
                    details.style.transform = 'translateY(0)';
                }
            }, 200);
        });
        
        card.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            
            // Reset card position
            this.style.transform = 'translateY(0) scale(1)';
            
            // Hide additional info
            const details = this.querySelector('.partner-details');
            if (details) {
                details.style.transform = 'translateY(100%)';
            }
        });
    }

    function addSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function addDonationHandlers() {
        const donateButtons = document.querySelectorAll('.btn-donate');
        
        donateButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const card = this.closest('.partner-card');
                const partnerName = card.querySelector('h5').textContent;
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Show donation modal or redirect to donation page
                showDonationModal(partnerName);
            });
        });
    }

    function showDonationModal(partnerName) {
        // Simple alert for now - can be replaced with a proper modal
        alert(`Terima kasih atas niat baik Anda untuk berdonasi ke ${partnerName}!\n\nFitur donasi akan tersedia setelah Anda login ke akun FoodHive.`);
        
        // Optional: redirect to login page
        // window.location.href = 'login.html';
    }

    // Add scroll reveal animation for cards that come into view
    function addScrollRevealAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const cards = document.querySelectorAll('.partner-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    // Initialize scroll reveal
    addScrollRevealAnimation();

    // Add loading state management
    function showLoadingState() {
        const cards = document.querySelectorAll('.partner-card');
        cards.forEach(card => {
            card.style.opacity = '0.7';
            card.style.pointerEvents = 'none';
        });
    }

    function hideLoadingState() {
        const cards = document.querySelectorAll('.partner-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
    }

    // Add keyboard navigation support
    function addKeyboardNavigation() {
        const cards = document.querySelectorAll('.partner-card');
        
        cards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Donasi ke ${card.querySelector('h5').textContent}`);
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const donateBtn = this.querySelector('.btn-donate');
                    if (donateBtn) {
                        donateBtn.click();
                    }
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextCard = cards[index + 1];
                    if (nextCard) nextCard.focus();
                }
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevCard = cards[index - 1];
                    if (prevCard) prevCard.focus();
                }
            });
        });
    }

    // Initialize keyboard navigation
    addKeyboardNavigation();

    // Add search functionality (if needed in future)
    function initializeSearch() {
        const searchInput = document.getElementById('partner-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const cards = document.querySelectorAll('.partner-card');
                
                cards.forEach(card => {
                    const partnerName = card.querySelector('h5').textContent.toLowerCase();
                    const partnerAddress = card.querySelector('p').textContent.toLowerCase();
                    
                    if (partnerName.includes(searchTerm) || partnerAddress.includes(searchTerm)) {
                        card.style.display = 'block';
                        card.parentElement.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                        // Hide column if all cards in it are hidden
                        const siblingCards = card.parentElement.parentElement.querySelectorAll('.partner-card');
                        const visibleSiblings = Array.from(siblingCards).filter(c => c.style.display !== 'none');
                        if (visibleSiblings.length === 0) {
                            card.parentElement.style.display = 'none';
                        }
                    }
                });
            });
        }
    }

    // Add performance optimization for images
    function optimizeImages() {
        const images = document.querySelectorAll('.partner-image img');
        
        images.forEach(img => {
            // Add loading="lazy" for better performance
            img.setAttribute('loading', 'lazy');
            
            // Add error handling
            img.addEventListener('error', function() {
                this.src = '../images/placeholder.jpg'; // fallback image
                this.alt = 'Gambar tidak tersedia';
            });
            
            // Add load event for smooth appearance
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.3s ease';
            });
        });
    }

    // Initialize image optimization
    optimizeImages();

    // Add mobile touch enhancements
    function addMobileEnhancements() {
        if ('ontouchstart' in window) {
            const cards = document.querySelectorAll('.partner-card');
            
            cards.forEach(card => {
                let touchStartTime;
                
                card.addEventListener('touchstart', function() {
                    touchStartTime = Date.now();
                    this.classList.add('touch-active');
                });
                
                card.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                    
                    // If it's a quick tap (less than 300ms), show details
                    if (Date.now() - touchStartTime < 300) {
                        const details = this.querySelector('.partner-details');
                        if (details) {
                            details.classList.toggle('mobile-show');
                        }
                    }
                });
            });
        }
    }

    // Initialize mobile enhancements
    addMobileEnhancements();

    console.log('Teman FoodHive page initialized successfully!');
});