// Dashboard initialization
const initDashboard = async () => {
    if (!requireAuth()) {
        return;
    }
    
    const user = getStoredUser();
    if (user) {
        updateUserInfo(user);
        await loadDashboardData();
    }
};

// Update user information in dashboard
const updateUserInfo = (user) => {
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElements = document.querySelectorAll('.user-email');
    
    userNameElements.forEach(el => {
        if (el) el.textContent = user.nama;
    });
    
    userEmailElements.forEach(el => {
        if (el) el.textContent = user.email;
    });
    
    // Update stats
    const totalDonationsEl = document.getElementById('totalDonations');
    const totalReceivedEl = document.getElementById('totalReceived');
    
    if (totalDonationsEl) totalDonationsEl.textContent = user.totalDonations || 0;
    if (totalReceivedEl) totalReceivedEl.textContent = user.totalReceived || 0;
};

// Load dashboard data
const loadDashboardData = async () => {
    try {
        await Promise.all([
            loadRecentDonations(),
            loadNearbyDonations(),
            loadUserStats()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Gagal memuat data dashboard', 'danger');
    }
};

// Load recent donations
const loadRecentDonations = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/donations?limit=5`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderDonations(data.donations, 'recent-donations');
        }
    } catch (error) {
        console.error('Error loading recent donations:', error);
    }
};

// Load nearby donations (with geolocation)
const loadNearbyDonations = async () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const token = localStorage.getItem('token');
                
                const response = await fetch(`${API_BASE_URL}/donations?lat=${latitude}&lng=${longitude}&radius=10&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    renderDonations(data.donations, 'nearby-donations');
                }
            } catch (error) {
                console.error('Error loading nearby donations:', error);
            }
        }, (error) => {
            console.error('Geolocation error:', error);
            // Load donations without location filter
            loadRecentDonations();
        });
    }
};

// Render donations in container
const renderDonations = (donations, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (donations.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Belum ada donasi tersedia</p>';
        return;
    }
    
    const html = donations.map(donation => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card donation-card h-100 shadow-sm">
                ${donation.images && donation.images.length > 0 ? 
                    `<img src="${API_BASE_URL.replace('/api', '')}/uploads/${donation.images[0].filename}" class="card-img-top" style="height: 200px; object-fit: cover;">` 
                    : 
                    '<div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;"><i class="fas fa-utensils fa-3x text-muted"></i></div>'
                }
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title fw-bold">${donation.title}</h6>
                    <p class="card-text text-muted small">${donation.description.substring(0, 80)}...</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-success">${donation.category}</span>
                            <small class="text-muted">${donation.quantity} ${donation.unit}</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-map-marker-alt me-1"></i>
                                ${donation.location.address.substring(0, 30)}...
                            </small>
                            <button class="btn btn-sm btn-outline-success" onclick="claimDonation('${donation._id}')">
                                <i class="fas fa-hand-holding me-1"></i>Ambil
                            </button>
                        </div>
                        <small class="text-muted d-block mt-1">
                            Oleh: ${donation.donatur.nama}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
};

// Claim donation
const claimDonation = async (donationId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/donations/${donationId}/claim`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Donasi berhasil diklaim!', 'success');
            // Reload dashboard data
            await loadDashboardData();
        } else {
            showToast(data.message || 'Gagal mengklaim donasi', 'danger');
        }
    } catch (error) {
        console.error('Error claiming donation:', error);
        showToast('Terjadi kesalahan saat mengklaim donasi', 'danger');
    }
};

// Load user statistics
const loadUserStats = async () => {
    try {
        const user = await getUserProfile();
        if (user) {
            updateUserInfo(user);
            // Update local storage with fresh data
            localStorage.setItem('user', JSON.stringify(user));
        }
    } catch (error) {
        console.error('Error loading user stats:', error);
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    }
});