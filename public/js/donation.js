// donation.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form functionality
    initializeForm();
    
    // Handle file upload
    handleFileUpload();
    
    // Handle form submission
    handleFormSubmission();
    
    // Handle checkbox interactions
    handleCheckboxes();
});

function initializeForm() {
    // Add loading states to dropdowns
    const dropdowns = document.querySelectorAll('select.form-control');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            this.style.color = this.value ? '#333' : '#999';
        });
        
        // Set initial color
        dropdown.style.color = dropdown.value ? '#333' : '#999';
    });
    
    // Add focus effects to inputs
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

function handleFileUpload() {
    const fileInput = document.getElementById('photo-upload');
    const uploadLabel = document.querySelector('.upload-label');
    const uploadArea = document.querySelector('.upload-area');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Mohon pilih file gambar yang valid!');
                this.value = '';
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB!');
                this.value = '';
                return;
            }
            
            // Update upload area appearance
            uploadArea.style.borderColor = '#4CAF50';
            uploadArea.style.backgroundColor = '#f0f8f0';
            uploadLabel.innerHTML = `<i class="fas fa-check me-2"></i>${file.name}`;
            uploadLabel.style.color = '#4CAF50';
            
            // Preview image (optional)
            previewImage(file);
        }
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#4CAF50';
        this.style.backgroundColor = '#f0f8f0';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = '#f8f9fa';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change'));
        }
        
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = '#f8f9fa';
    });
}

function previewImage(file) {
    const reader = new FileReader();
    const uploadArea = document.querySelector('.upload-area');
    
    reader.onload = function(e) {
        // Create image preview
        const existingPreview = uploadArea.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        const preview = document.createElement('div');
        preview.className = 'image-preview mt-2';
        preview.innerHTML = `
            <img src="${e.target.result}" alt="Preview" style="max-width: 150px; max-height: 150px; border-radius: 8px; object-fit: cover;">
        `;
        
        uploadArea.appendChild(preview);
    };
    
    reader.readAsDataURL(file);
}

function handleCheckboxes() {
    const checkboxes = document.querySelectorAll('.form-check-input');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.parentElement.querySelector('.form-check-label');
            
            if (this.checked) {
                label.style.color = '#4CAF50';
                label.style.fontWeight = '500';
            } else {
                label.style.color = '#333';
                label.style.fontWeight = 'normal';
            }
        });
    });
}

function handleFormSubmission() {
    const submitBtn = document.getElementById('submitBtn');
    const form = document.querySelector('.form-container');
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Show loading state
            showLoadingState();
            
            // Simulate form submission
            setTimeout(() => {
                hideLoadingState();
                showSuccessModal();
                resetForm();
            }, 2000);
        }
    });
}

function validateForm() {
    const requiredFields = [
        { selector: 'input[placeholder="Cth: Toko A"]', name: 'Nama Donatur' },
        { selector: 'select', name: 'Jenis Donatur' },
        { selector: 'input[type="tel"]', name: 'No Handphone' },
        { selector: 'input[placeholder="Link Google Maps"]', name: 'Lokasi Penjemputan' },
        { selector: 'input[placeholder="Cth: Buah-buahan"]', name: 'Nama Makanan' },
        { selector: 'input[placeholder="DD/MM/YYYY"]', name: 'Tanggal Kadaluarsa' }
    ];
    
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(field => {
        const element = document.querySelector(field.selector);
        if (element && (!element.value || element.value.trim() === '')) {
            isValid = false;
            errors.push(field.name);
            
            // Add error styling
            element.style.borderColor = '#dc3545';
            element.addEventListener('input', function() {
                this.style.borderColor = '#e0e0e0';
            }, { once: true });
        }
    });
    
    // Check if at least one food condition checkbox is checked
    const conditionCheckboxes = document.querySelectorAll('.checkbox-group .form-check-input');
    const hasConditionChecked = Array.from(conditionCheckboxes).some(cb => cb.checked);
    
    if (!hasConditionChecked) {
        isValid = false;
        errors.push('Kondisi Makanan');
        
        // Highlight checkbox group
        const checkboxGroup = document.querySelector('.checkbox-group');
        checkboxGroup.style.border = '2px solid #dc3545';
        checkboxGroup.style.borderRadius = '8px';
        checkboxGroup.style.padding = '10px';
        
        setTimeout(() => {
            checkboxGroup.style.border = 'none';
            checkboxGroup.style.padding = '0';
        }, 3000);
    }
    
    if (!isValid) {
        alert(`Mohon lengkapi field berikut:\n• ${errors.join('\n• ')}`);
    }
    
    return isValid;
}

function showLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
    submitBtn.style.opacity = '0.7';
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit';
    submitBtn.style.opacity = '1';
}

function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
    
    // Auto close modal after 3 seconds
    setTimeout(() => {
        modal.hide();
    }, 3000);
}

function resetForm() {
    // Reset all form inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        if (input.type === 'file') {
            input.value = '';
        } else {
            input.value = '';
        }
        input.style.borderColor = '#e0e0e0';
        input.style.color = '#999';
    });
    
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        const label = checkbox.parentElement.querySelector('.form-check-label');
        label.style.color = '#333';
        label.style.fontWeight = 'normal';
    });
    
    // Reset file upload area
    const uploadArea = document.querySelector('.upload-area');
    const uploadLabel = document.querySelector('.upload-label');
    const imagePreview = uploadArea.querySelector('.image-preview');
    
    if (imagePreview) {
        imagePreview.remove();
    }
    
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = '#f8f9fa';
    uploadLabel.innerHTML = '<i class="fas fa-camera me-2"></i>Upload foto';
    uploadLabel.style.color = '#666';
}

// Additional utility functions
function formatPhoneNumber(input) {
    // Auto format phone number
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('0')) {
        value = '62' + value.substring(1);
    } else if (!value.startsWith('62')) {
        value = '62' + value;
    }
    
    // Format: +62 xxx xxx xxx
    if (value.length > 2) {
        value = '+' + value.substring(0, 2) + ' ' + value.substring(2);
    }
    
    input.value = value;
}

function validateDate(input) {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const value = input.value;
    
    if (value && !datePattern.test(value)) {
        input.setCustomValidity('Format tanggal harus DD/MM/YYYY');
    } else {
        input.setCustomValidity('');
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    // Phone number formatting
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
    
    // Date validation
    const dateInput = document.querySelector('input[placeholder="DD/MM/YYYY"]');
    if (dateInput) {
        dateInput.addEventListener('input', function() {
            validateDate(this);
        });
        
        // Add date picker pattern
        dateInput.addEventListener('focus', function() {
            this.placeholder = 'DD/MM/YYYY';
        });
    }
    
    // Smooth scroll for form sections
    const sections = document.querySelectorAll('.section-title');
    sections.forEach(section => {
        section.style.cursor = 'pointer';
        section.addEventListener('click', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Auto-save form data to prevent data loss
    const formInputs = document.querySelectorAll('.form-control, .form-check-input');
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            saveFormData();
        });
    });
    
    // Load saved form data
    loadFormData();
});

function saveFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('.form-control, .form-check-input');
    
    inputs.forEach((input, index) => {
        if (input.type === 'checkbox') {
            formData[`input_${index}`] = input.checked;
        } else if (input.type !== 'file') {
            formData[`input_${index}`] = input.value;
        }
    });
    
    // Note: In actual implementation, you would save to server
    // For demo purposes, we're using a temporary variable
    window.tempFormData = formData;
}

function loadFormData() {
    if (window.tempFormData) {
        const inputs = document.querySelectorAll('.form-control, .form-check-input');
        
        inputs.forEach((input, index) => {
            const savedValue = window.tempFormData[`input_${index}`];
            if (savedValue !== undefined) {
                if (input.type === 'checkbox') {
                    input.checked = savedValue;
                } else if (input.type !== 'file') {
                    input.value = savedValue;
                }
            }
        });
    }
}

// Export functions for external use
window.DonationForm = {
    validate: validateForm,
    reset: resetForm,
    save: saveFormData,
    load: loadFormData
};