// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const logoUpload = document.getElementById('logoUpload');
const uploadPreview = document.getElementById('uploadPreview');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const deleteBtn = document.getElementById('deleteBtn');
const mitraForm = document.getElementById('mitraForm');

// Upload functionality
uploadArea.addEventListener('click', () => {
    logoUpload.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2D5A3D';
    uploadArea.style.backgroundColor = '#f0f8f0';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#28a745';
    uploadArea.style.backgroundColor = 'white';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#28a745';
    uploadArea.style.backgroundColor = 'white';
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleFileUpload(files[0]);
    }
});

logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFileUpload(file);
    }
});

function handleFileUpload(file) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        uploadPreview.style.display = 'block';
        
        // Add animation
        uploadPreview.style.opacity = '0';
        uploadPreview.style.transform = 'translateY(20px)';
        setTimeout(() => {
            uploadPreview.style.transition = 'all 0.3s ease';
            uploadPreview.style.opacity = '1';
            uploadPreview.style.transform = 'translateY(0)';
        }, 100);
    };
    reader.readAsDataURL(file);
}

// Remove image
removeImageBtn.addEventListener('click', () => {
    removeImage();
});

deleteBtn.addEventListener('click', () => {
    removeImage();
});

function removeImage() {
    uploadPreview.style.display = 'none';
    uploadArea.style.display = 'flex';
    previewImage.src = '';
    logoUpload.value = '';
    
    // Reset upload area animation
    uploadArea.style.opacity = '0';
    uploadArea.style.transform = 'translateY(20px)';
    setTimeout(() => {
        uploadArea.style.transition = 'all 0.3s ease';
        uploadArea.style.opacity = '1';
        uploadArea.style.transform = 'translateY(0)';
    }, 100);
}

// Form validation and submission
mitraForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        namaMitra: document.getElementById('namaMitra').value.trim(),
        jenisMitra: document.getElementById('jenisMitra').value,
        alamatMitra: document.getElementById('alamatMitra').value.trim(),
        kontakMitra: document.getElementById('kontakMitra').value.trim(),
        logo: logoUpload.files[0] || null
    };
    
    // Validation
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-register');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mendaftar...';
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        mitraForm.reset();
        removeImage();
        
        // Show success message
        showSuccessMessage();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Scroll to success message
        document.querySelector('.success-message').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 2000);
});

function validateForm(data) {
    const errors = [];
    
    if (!data.namaMitra) {
        errors.push('Nama mitra harus diisi');
        highlightError('namaMitra');
    }
    
    if (!data.jenisMitra || data.jenisMitra === 'Pilih jenis mitra') {
        errors.push('Jenis mitra harus dipilih');
        highlightError('jenisMitra');
    }
    
    if (!data.alamatMitra) {
        errors.push('Alamat harus diisi');
        highlightError('alamatMitra');
    }
    
    if (!data.kontakMitra) {
        errors.push('Kontak harus diisi');
        highlightError('kontakMitra');
    } else if (!validatePhone(data.kontakMitra)) {
        errors.push('Format nomor telepon tidak valid');
        highlightError('kontakMitra');
    }
    
    if (errors.length > 0) {
        showErrors(errors);
        return false;
    }
    
    return true;
}

function validatePhone(phone) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function highlightError(fieldId) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
    
    setTimeout(() => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }, 3000);
}

function showErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message alert alert-danger mb-3';
    errorContainer.innerHTML = `
        <strong>Terjadi kesalahan:</strong>
        <ul class="mb-0 mt-2">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    // Insert before form
    mitraForm.insertBefore(errorContainer, mitraForm.firstChild);
    
    // Scroll to error
    errorContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

function showSuccessMessage() {
    const successMsg = document.querySelector('.success-message');
    successMsg.style.display = 'block';
    successMsg.style.opacity = '0';
    successMsg.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        successMsg.style.transition = 'all 0.5s ease';
        successMsg.style.opacity = '1';
        successMsg.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto hide after 10 seconds
    setTimeout(() => {
        successMsg.style.opacity = '0';
        successMsg.style.transform = 'translateY(-30px)';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 500);
    }, 10000);
}

// Input formatting
document.getElementById('kontakMitra').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format phone number
    if (value.startsWith('0')) {
        value = value.replace(/^0/, '62');
    }
    
    if (value.length > 0 && !value.startsWith('62')) {
        value = '62' + value;
    }
    
    // Add formatting
    if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})(\d*)/, '$1 $2 $3 $4').trim();
    }
    
    e.target.value = value;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to form elements
    const formElements = document.querySelectorAll('.form-input, .upload-area, .btn-register');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
    
    // Hide success message initially
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
});

// Add input focus animations
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Add hover effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'white';
        navbar.style.backdropFilter = 'none';
    }
});

// Form field validation on blur
document.getElementById('namaMitra').addEventListener('blur', function() {
    if (this.value.trim().length < 2) {
        this.style.borderColor = '#dc3545';
        showFieldError(this, 'Nama mitra minimal 2 karakter');
    } else {
        this.style.borderColor = '#28a745';
        hideFieldError(this);
    }
});

document.getElementById('alamatMitra').addEventListener('blur', function() {
    if (this.value.trim().length < 10) {
        this.style.borderColor = '#dc3545';
        showFieldError(this, 'Alamat minimal 10 karakter');
    } else {
        this.style.borderColor = '#28a745';
        hideFieldError(this);
    }
});

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger small mt-1';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Progress indicator
function updateProgress() {
    const formFields = ['namaMitra', 'jenisMitra', 'alamatMitra', 'kontakMitra'];
    let filledFields = 0;
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field.value.trim() !== '' && field.value !== 'Pilih jenis mitra') {
            filledFields++;
        }
    });
    
    const progress = (filledFields / formFields.length) * 100;
    
    // Create or update progress bar
    let progressBar = document.querySelector('.progress-bar-container');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-container mb-3';
        progressBar.innerHTML = `
            <div class="progress" style="height: 4px; border-radius: 2px;">
                <div class="progress-bar bg-success" role="progressbar" style="width: 0%; transition: width 0.3s ease;"></div>
            </div>
            <small class="text-muted">Progress pengisian: <span class="progress-text">0%</span></small>
        `;
        document.querySelector('.form-title').after(progressBar);
    }
    
    const bar = progressBar.querySelector('.progress-bar');
    const text = progressBar.querySelector('.progress-text');
    bar.style.width = progress + '%';
    text.textContent = Math.round(progress) + '%';
}

// Add progress tracking to form fields
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', updateProgress);
    input.addEventListener('change', updateProgress);
});

// Auto-save to localStorage (with fallback for unsupported environments)
function saveFormData() {
    try {
        const formData = {
            namaMitra: document.getElementById('namaMitra').value,
            jenisMitra: document.getElementById('jenisMitra').value,
            alamatMitra: document.getElementById('alamatMitra').value,
            kontakMitra: document.getElementById('kontakMitra').value,
            timestamp: Date.now()
        };
        
        // Since localStorage is not supported, we'll use a variable instead
        window.tempFormData = formData;
    } catch (e) {
        // Silently fail if storage is not available
        console.log('Form auto-save not available');
    }
}

function loadFormData() {
    try {
        const savedData = window.tempFormData;
        if (savedData && (Date.now() - savedData.timestamp) < 3600000) { // 1 hour
            document.getElementById('namaMitra').value = savedData.namaMitra || '';
            document.getElementById('jenisMitra').value = savedData.jenisMitra || '';
            document.getElementById('alamatMitra').value = savedData.alamatMitra || '';
            document.getElementById('kontakMitra').value = savedData.kontakMitra || '';
            updateProgress();
        }
    } catch (e) {
        // Silently fail if storage is not available
        console.log('Form auto-load not available');
    }
}

// Auto-save form data every 30 seconds
setInterval(saveFormData, 30000);

// Load saved data on page load
setTimeout(loadFormData, 500);