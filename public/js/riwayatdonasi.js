document.addEventListener('DOMContentLoaded', function() {
    // Check for pending donations and show alert
    checkPendingDonations();
    
    // Initialize tooltips if needed
    initializeTooltips();
    
    // Add smooth scrolling for any anchor links
    initializeSmoothScrolling();
});

/**
 * Check if there are any pending donations and show alert
 */
function checkPendingDonations() {
    const pendingDonations = document.querySelectorAll('.status-pending');
    const alert = document.getElementById('contactAdminAlert');
    
    if (pendingDonations.length > 0 && alert) {
        // Show the alert with animation
        setTimeout(() => {
            alert.classList.add('show');
        }, 500);
        
        // Auto-hide alert after 10 seconds
        setTimeout(() => {
            if (alert.classList.contains('show')) {
                alert.classList.remove('show');
            }
        }, 10000);
    }
}

/**
 * Handle contact admin button click
 */
function contactAdmin() {
    // Show confirmation modal or direct contact options
    const contactInfo = {
        phone: '+62 5677 8943 33',
        email: 'foodhive@gmail.com',
        whatsapp: '6256778943333'
    };
    
    // Create custom modal for contact options
    showContactModal(contactInfo);
}

/**
 * Show contact modal with admin contact information
 */
function showContactModal(contactInfo) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 16px; border: none;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px 16px 0 0;">
                        <h5 class="modal-title fw-bold" id="contactModalLabel" style="color: #2d5a3d;">
                            <i class="fas fa-headset me-2"></i>Hubungi Admin
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <p class="text-muted mb-4">Pilih cara menghubungi admin FoodHive:</p>
                        <div class="d-grid gap-3">
                            <a href="tel:${contactInfo.phone}" class="btn btn-outline-success d-flex align-items-center justify-content-start p-3 rounded-3">
                                <i class="fas fa-phone-alt me-3 text-success"></i>
                                <div class="text-start">
                                    <div class="fw-semibold">Telepon</div>
                                    <small class="text-muted">${contactInfo.phone}</small>
                                </div>
                            </a>
                            <a href="https://wa.me/${contactInfo.whatsapp}" target="_blank" class="btn btn-outline-success d-flex align-items-center justify-content-start p-3 rounded-3">
                                <i class="fab fa-whatsapp me-3 text-success"></i>
                                <div class="text-start">
                                    <div class="fw-semibold">WhatsApp</div>
                                    <small class="text-muted">Chat via WhatsApp</small>
                                </div>
                            </a>
                            <a href="mailto:${contactInfo.email}" class="btn btn-outline-success d-flex align-items-center justify-content-start p-3 rounded-3">
                                <i class="fas fa-envelope me-3 text-success"></i>
                                <div class="text-start">
                                    <div class="fw-semibold">Email</div>
                                    <small class="text-muted">${contactInfo.email}</small>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary rounded-pill" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('contactModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
    
    // Clean up modal after it's hidden
    document.getElementById('contactModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * Initialize tooltips for better UX
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Update donation status (for future use with real-time updates)
 */
function updateDonationStatus(donationId, newStatus) {
    const donationCard = document.querySelector([data-donation-id="${donationId}"]);
    if (!donationCard) return;
    
    const statusBadge = donationCard.querySelector('.status-badge');
    const statusText = donationCard.querySelector('.info-value');
    
    if (newStatus === 'received') {
        statusBadge.className = 'status-badge status-received';
        statusBadge.innerHTML = '<i class="fas fa-check-circle me-1"></i>Sudah Diterima';
        
        // Update status text if exists
        if (statusText) {
            statusText.textContent = 'Sudah Diterima';
            statusText.className = 'info-value text-success';
        }
        
        // Show success notification
        showNotification('Status donasi berhasil diperbarui!', 'success');
        
    } else if (newStatus === 'pending') {
        statusBadge.className = 'status-badge status-pending';
        statusBadge.innerHTML = '<i class="fas fa-clock me-1"></i>Belum Diterima';
        
        if (statusText) {
            statusText.textContent = 'Menunggu Penjemputan';
            statusText.className = 'info-value text-warning';
        }
    }
    
    // Recheck pending donations for alert
    setTimeout(checkPendingDonations, 500);
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'primary'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Add toast
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Show toast
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

/**
 * Filter donations by status (for future enhancement)
 */
function filterDonations(status) {
    const donations = document.querySelectorAll('.donation-card');
    
    donations.forEach(card => {
        const statusBadge = card.querySelector('.status-badge');
        const cardStatus = statusBadge.classList.contains('status-received') ? 'received' : 'pending';
        
        if (status === 'all' || cardStatus === status) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Search donations by name (for future enhancement)
 */
function searchDonations(query) {
    const donations = document.querySelectorAll('.donation-card');
    const searchTerm = query.toLowerCase();
    
    donations.forEach(card => {
        const donationName = card.querySelector('.donation-name').textContent.toLowerCase();
        const donorName = card.querySelector('.info-value').textContent.toLowerCase();
        
        if (donationName.includes(searchTerm) || donorName.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// Export functions for potential external use
window.FoodHiveHistory = {
    contactAdmin,
    updateDonationStatus,
    filterDonations,
    searchDonations,
    showNotification
};