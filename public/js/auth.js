// Utility Functions
const showAlert = (message, type = 'info') => {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) {
    console.error('alertContainer tidak ditemukan');
    return;
  }
  const alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <i class="fas fa-${getAlertIcon(type)} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  alertContainer.innerHTML = alertHTML;
  setTimeout(() => {
    const alert = alertContainer.querySelector('.alert');
    if (alert) {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 150);
    }
  }, 5000);
};

const getAlertIcon = (type) => {
  const icons = {
    success: 'check-circle',
    danger: 'exclamation-triangle',
    warning: 'exclamation-circle',
    info: 'info-circle',
  };
  return icons[type] || 'info-circle';
};

const showLoading = (show = true) => {
  const spinner = document.getElementById('loginSpinner') || document.getElementById('registerSpinner');
  const btn = document.getElementById('loginBtn') || document.getElementById('registerBtn');
  if (spinner && btn) {
    if (show) {
      spinner.classList.remove('d-none');
      btn.disabled = true;
      btn.style.opacity = '0.7';
    } else {
      spinner.classList.add('d-none');
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validateName = (name) => {
  return name.trim().length >= 2;
};

const validateForm = (formData, isLogin = false) => {
  const errors = [];
  if (!isLogin && !validateName(formData.nama)) {
    errors.push('Nama harus minimal 2 karakter');
  }
  if (!validateEmail(formData.email)) {
    errors.push('Email tidak valid');
  }
  if (!validatePassword(formData.password)) {
    errors.push('Password harus minimal 6 karakter');
  }
  return errors;
};

const validateField = (field, isValid, errorMessage) => {
  const feedback = field.parentNode.querySelector('.invalid-feedback') || document.getElementById('passwordError');
  if (isValid) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (feedback) feedback.classList.add('d-none');
  } else {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    if (feedback && feedback.id === 'passwordError') {
      feedback.classList.remove('d-none');
    } else if (!feedback) {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.className = 'invalid-feedback text-danger mt-1 small';
      feedbackDiv.textContent = errorMessage;
      field.parentNode.appendChild(feedbackDiv);
    }
  }
};

const setupRealTimeValidation = () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const namaInput = document.getElementById('nama');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, validateEmail(emailInput.value), 'Email tidak valid');
    });
  }
  if (passwordInput) {
    passwordInput.addEventListener('blur', () => {
      validateField(passwordInput, validatePassword(passwordInput.value), 'Password minimal 6 karakter');
    });
  }
  if (namaInput) {
    namaInput.addEventListener('blur', () => {
      validateField(namaInput, validateName(namaInput.value), 'Nama minimal 2 karakter');
    });
  }
};

const setupPasswordToggle = () => {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  if (togglePassword && passwordInput && eyeIcon) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.classList.toggle('fa-eye', isPassword);
      eyeIcon.classList.toggle('fa-eye-slash', !isPassword);
    });
  }
};

// Fungsi untuk menghasilkan data pengguna acak
const generateRandomUser = (email) => {
  const username = `user${Math.floor(Math.random() * 1000)}`;
  const password = `pass${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}`;
  return { username, email, password };
};

// Login Handler
const handleLogin = async (event) => {
  event.preventDefault();
  console.log('handleLogin dipanggil');
  const formData = new FormData(event.target);
  const loginData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  console.log('Mengirim data login:', loginData);
  const errors = validateForm(loginData, true);
  if (errors.length > 0) {
    showAlert(errors.join('<br>'), 'danger');
    return;
  }
  showLoading(true);

  // Ambil data pengguna dari localStorage
  const users = JSON.parse(localStorage.getItem('foodhive_users') || '[]');
  const user = users.find((u) => u.email === loginData.email && u.password === loginData.password);

  setTimeout(() => {
    showLoading(false);
    if (user) {
      localStorage.setItem('foodhive_current_user', JSON.stringify({ nama: user.username }));
      showAlert(`Selamat datang kembali, ${user.username}!`, 'success');
      console.log('Mengalihkan ke index.html');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);
    } else {
      showAlert('Email atau kata sandi salah.', 'danger');
    }
  }, 1500); // Simulasi delay API
};

// Registration Handler
const handleRegistration = async (event) => {
  event.preventDefault();
  console.log('handleRegistration dipanggil');
  const formData = new FormData(event.target);
  const userData = {
    username: formData.get('nama'),
    email: formData.get('email'),
    password: formData.get('password'),
  };
  console.log('Mengirim data registrasi:', userData);
  const errors = validateForm(userData, false);
  if (errors.length > 0) {
    showAlert(errors.join('<br>'), 'danger');
    return;
  }
  showLoading(true);

  // Periksa apakah email sudah terdaftar
  const users = JSON.parse(localStorage.getItem('foodhive_users') || '[]');
  if (users.find((u) => u.email === userData.email)) {
    showLoading(false);
    showAlert('Email sudah terdaftar.', 'danger');
    return;
  }

  // Tambahkan pengguna acak ke localStorage
  const randomUser = generateRandomUser(userData.email);
  users.push({
    id: Date.now(),
    username: userData.username || randomUser.username,
    email: userData.email,
    password: userData.password || randomUser.password,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('foodhive_users', JSON.stringify(users));

  setTimeout(() => {
    showLoading(false);
    showAlert(`Selamat datang, ${userData.username || randomUser.username}! Akun Anda berhasil dibuat.`, 'success');
    console.log('Mengalihkan ke login.html');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }, 1500); // Simulasi delay API
};

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  setupPasswordToggle();
  setupRealTimeValidation();
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm) {
    console.log('Menambahkan event listener untuk loginForm');
    loginForm.addEventListener('submit', handleLogin);
  }
  if (registerForm) {
    console.log('Menambahkan event listener untuk registerForm');
    registerForm.addEventListener('submit', handleRegistration);
  }
  const authForm = document.querySelector('.auth-form');
  const brandSection = document.querySelector('.brand-section');
  if (authForm) authForm.classList.add('slide-in-right');
  if (brandSection) brandSection.classList.add('slide-in-left');
  const inputs = document.querySelectorAll('.form-control');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentNode.style.transform = 'scale(1.02)';
      input.parentNode.style.transition = 'all 0.3s ease';
    });
    input.addEventListener('blur', () => {
      input.parentNode.style.transform = 'scale(1)';
    });
  });
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });
  });
});
