//daftarmitra.js:
// =========================
// DOM Elements
// =========================
const uploadArea = document.getElementById('uploadArea');
const logoUpload = document.getElementById('logoUpload');
const uploadPreview = document.getElementById('uploadPreview');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const deleteBtn = document.getElementById('deleteBtn');
const mitraForm = document.getElementById('mitraForm');

// =========================
// File Upload Logic
// =========================
uploadArea.addEventListener('click', () => logoUpload.click());

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

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFileUpload(file);
  }
});

logoUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFileUpload(file);
  }
});

function handleFileUpload(file) {
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran file terlalu besar. Maksimal 5MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    uploadArea.style.display = 'none';
    uploadPreview.style.display = 'block';
    animateElement(uploadPreview);
  };
  reader.readAsDataURL(file);
}

removeImageBtn.addEventListener('click', removeImage);
deleteBtn.addEventListener('click', removeImage);

function removeImage() {
  uploadPreview.style.display = 'none';
  uploadArea.style.display = 'flex';
  previewImage.src = '';
  logoUpload.value = '';
  animateElement(uploadArea);
}

function animateElement(element) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  setTimeout(() => {
    element.style.transition = 'all 0.3s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 100);
}

// =========================
// Form Submission - FIXED
// =========================
mitraForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // FIX: Gunakan ID yang benar dari HTML
  const formData = {
    namaMitra: document.getElementById('namaMitra').value.trim(),
    jenisMitra: document.getElementById('jenisMitra').value,
    alamatMitra: document.getElementById('alamatMitra').value.trim(),
    kontakMitra: document.getElementById('noHandphone').value.trim(), // FIXED: gunakan noHandphone
    logo: logoUpload.files[0] || null,
  };

  console.log('Form data:', formData);

  if (!validateForm(formData)) {
    console.log('Validasi gagal');
    return;
  }

  const submitBtn = document.querySelector('.btn-register');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mendaftar...';

  setTimeout(() => {
    mitraForm.reset();
    removeImage();

    // FIX: Tampilkan modal sukses alih-alih pesan biasa
    showSuccessModal();

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 2000);
});

// =========================
// Validation - FIXED
// =========================
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
    highlightError('noHandphone'); // FIXED: gunakan ID yang benar
  } else if (!validatePhone(data.kontakMitra)) {
    errors.push('Format nomor telepon tidak valid');
    highlightError('noHandphone'); // FIXED: gunakan ID yang benar
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
  document.querySelectorAll('.error-message').forEach((el) => el.remove());

  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message alert alert-danger mb-3';
  errorContainer.innerHTML = `
        <strong>Terjadi kesalahan:</strong>
        <ul class="mb-0 mt-2">${errors.map((err) => <li>${err}</li>).join('')}</ul>
    `;
  mitraForm.insertBefore(errorContainer, mitraForm.firstChild);

  errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => errorContainer.remove(), 5000);
}

// FIX: Fungsi untuk menampilkan modal sukses
function showSuccessModal() {
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();

  // Reset progress bar jika ada
  updateProgress();
}

// Fallback jika tidak ada modal (untuk kompatibilitas dengan kode lama)
function showSuccessMessage() {
  // Coba tampilkan modal dulu
  const modalElement = document.getElementById('successModal');
  if (modalElement) {
    showSuccessModal();
    return;
  }

  // Fallback ke pesan lama jika modal tidak ada
  const msg = document.querySelector('.success-message');
  if (!msg) return;

  msg.style.display = 'block';
  msg.style.opacity = '0';
  msg.style.transform = 'translateY(30px)';

  setTimeout(() => {
    msg.style.transition = 'all 0.5s ease';
    msg.style.opacity = '1';
    msg.style.transform = 'translateY(0)';
  }, 100);

  setTimeout(() => {
    msg.style.opacity = '0';
    msg.style.transform = 'translateY(-30px)';
    setTimeout(() => (msg.style.display = 'none'), 500);
  }, 10000);
}

// =========================
// Input Formatting - FIXED
// =========================
document.getElementById('noHandphone').addEventListener('input', (e) => {
  // FIXED: gunakan ID yang benar
  let val = e.target.value.replace(/\D/g, '');
  if (val.startsWith('0')) val = '62' + val.slice(1);
  if (!val.startsWith('62')) val = '62' + val;

  if (val.length > 2) {
    val = val.replace(/(\d{2})(\d{4})(\d{4})(\d*)/, '$1 $2 $3 $4').trim();
  }

  e.target.value = val;
});

// =========================
// UI Effects & Enhancements
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const formEls = document.querySelectorAll('.form-input, .upload-area, .btn-register');
  formEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'all 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 * (i + 1));
  });
});

document.querySelectorAll('.form-input').forEach((input) => {
  input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
  input.addEventListener('blur', () => input.parentElement.classList.remove('focused'));
});

document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('mouseenter', () => (btn.style.transform = 'translateY(-2px)'));
  btn.addEventListener('mouseleave', () => (btn.style.transform = 'translateY(0)'));
});

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    nav.style.backdropFilter = 'blur(10px)';
  } else {
    nav.style.backgroundColor = 'white';
    nav.style.backdropFilter = 'none';
  }
});

// =========================
// Field-Level Validation - FIXED
// =========================
document.getElementById('namaMitra').addEventListener('blur', function () {
  if (this.value.trim().length < 2) {
    this.style.borderColor = '#dc3545';
    showFieldError(this, 'Nama mitra minimal 2 karakter');
  } else {
    this.style.borderColor = '#28a745';
    hideFieldError(this);
  }
});

document.getElementById('alamatMitra').addEventListener('blur', function () {
  if (this.value.trim().length < 10) {
    this.style.borderColor = '#dc3545';
    showFieldError(this, 'Alamat minimal 10 karakter');
  } else {
    this.style.borderColor = '#28a745';
    hideFieldError(this);
  }
});

function showFieldError(field, msg) {
  const err = field.parentElement.querySelector('.field-error');
  if (err) err.remove();

  const div = document.createElement('div');
  div.className = 'field-error text-danger small mt-1';
  div.textContent = msg;
  field.parentElement.appendChild(div);
}

function hideFieldError(field) {
  const err = field.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

// =========================
// Progress Bar - FIXED
// =========================
function updateProgress() {
  const fields = ['namaMitra', 'jenisMitra', 'alamatMitra', 'noHandphone']; // FIXED: gunakan ID yang benar
  let filled = fields.filter((id) => {
    const el = document.getElementById(id);
    return el.value.trim() !== '' && el.value !== 'Pilih jenis mitra';
  }).length;

  const percent = (filled / fields.length) * 100;

  let barContainer = document.querySelector('.progress-bar-container');
  if (!barContainer) {
    barContainer = document.createElement('div');
    barContainer.className = 'progress-bar-container mb-3';
    barContainer.innerHTML = `
            <div class="progress" style="height: 4px; border-radius: 2px;">
                <div class="progress-bar bg-success" role="progressbar" style="width: 0%; transition: width 0.3s ease;"></div>
            </div>
            <small class="text-muted">Progress pengisian: <span class="progress-text">0%</span></small>
        `;
    document.querySelector('.form-title').after(barContainer);
  }

  const bar = barContainer.querySelector('.progress-bar');
  const text = barContainer.querySelector('.progress-text');
  bar.style.width = percent + '%';
  text.textContent = Math.round(percent) + '%';
}

document.querySelectorAll('.form-input').forEach((input) => {
  input.addEventListener('input', updateProgress);
  input.addEventListener('change', updateProgress);
});

// =========================
// Auto-Save / Load Form Data - FIXED
// =========================
function saveFormData() {
  try {
    window.tempFormData = {
      namaMitra: document.getElementById('namaMitra').value,
      jenisMitra: document.getElementById('jenisMitra').value,
      alamatMitra: document.getElementById('alamatMitra').value,
      kontakMitra: document.getElementById('noHandphone').value, // FIXED: gunakan ID yang benar
      timestamp: Date.now(),
    };
  } catch (e) {
    console.log('Form auto-save not available');
  }
}

function loadFormData() {
  try {
    const data = window.tempFormData;
    if (data && Date.now() - data.timestamp < 3600000) {
      document.getElementById('namaMitra').value = data.namaMitra || '';
      document.getElementById('jenisMitra').value = data.jenisMitra || '';
      document.getElementById('alamatMitra').value = data.alamatMitra || '';
      document.getElementById('noHandphone').value = data.kontakMitra || ''; // FIXED: gunakan ID yang benar
      updateProgress();
    }
  } catch (e) {
    console.log('Form auto-load not available');
  }
}

setInterval(saveFormData, 30000);
setTimeout(loadFormData, 500);
