/**
 * SCRIPT.JS — SIAK UFD Clean Minimalist Sign-In Controller
 * Single Source of Truth: DESIGN.md & Academic OS Authentication
 */

let selectedRole = 'mahasiswa';

const DEMO_ACCOUNTS = {
  mahasiswa: {
    label: 'NIM / Username',
    value: '2023010042',
    password: 'SIAKUFD2025!',
    placeholder: 'Masukkan NIM Anda (contoh: 2023010042)',
    name: 'Alya Rahma Putri',
    targetUrl: '../../mahasiswa/dashboard/index.html'
  },
  dosen: {
    label: 'NIDN / Username',
    value: '0412088501',
    password: 'SIAKUFD2025!',
    placeholder: 'Masukkan NIDN Anda (contoh: 0412088501)',
    name: 'Dr. Aditya Pratama',
    targetUrl: '../../dosen/dashboard/index.html'
  },
  akademik: {
    label: 'NIP / Username',
    value: '198503152010121001',
    password: 'SIAKUFD2025!',
    placeholder: 'Masukkan NIP Staf Akademik BAK',
    name: 'Operator Biro Akademik (BAK)',
    targetUrl: '../../akademik/dashboard/index.html'
  }
};

function setLoginRole(role) {
  if (!DEMO_ACCOUNTS[role]) return;
  selectedRole = role;

  // Update tabs
  document.querySelectorAll('.role-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById('role-btn-' + role);
  if (activeBtn) activeBtn.classList.add('active');

  // Update label & placeholder
  const config = DEMO_ACCOUNTS[role];
  const labelEl = document.getElementById('label-username');
  const inputEl = document.getElementById('input-username');

  if (labelEl) labelEl.textContent = config.label;
  if (inputEl) {
    inputEl.placeholder = config.placeholder;
    inputEl.value = config.value;
  }
}

function quickFillRole(role) {
  setLoginRole(role);
  const config = DEMO_ACCOUNTS[role];
  const inputUser = document.getElementById('input-username');
  const inputPass = document.getElementById('input-password');

  if (inputUser) inputUser.value = config.value;
  if (inputPass) inputPass.value = config.password;
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('input-password');
  const eyeIcon = document.getElementById('eye-icon');
  if (!passInput) return;

  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (eyeIcon) {
      eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
    }
  } else {
    passInput.type = 'password';
    if (eyeIcon) {
      eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    }
  }
}

function handleForgotPassword() {
  alert("Layanan Pemulihan Akun:\n\nUntuk reset kata sandi akun resmi kampus, silakan hubungi unit Biro Administrasi Akademik & Kemahasiswaan (BAK) di Gedung Rektorat Lt. 1 atau melalui email: akademik@ufd.ac.id.");
}

function handleGoogleSignIn() {
  const config = DEMO_ACCOUNTS[selectedRole];
  const btn = document.querySelector('.btn-sso-provider');
  if (btn) {
    btn.style.opacity = '0.7';
    btn.innerHTML = `<span style="display:inline-block; animation: spin 0.8s linear infinite;">&#x21bb;</span> <span>Menghubungkan ke Google Workspace Kampus...</span>`;
  }

  setTimeout(() => {
    sessionStorage.setItem('ACADEMIC_OS_SESSION', JSON.stringify({
      role: selectedRole,
      username: config.value,
      nama: config.name,
      provider: 'google-workspace',
      loginAt: new Date().toISOString()
    }));
    window.location.href = config.targetUrl;
  }, 600);
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('input-username');
  const passwordInput = document.getElementById('input-password');
  const btnSubmit = document.getElementById('btn-submit');
  const btnSubmitText = document.getElementById('btn-submit-text');

  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';

  if (!username || !password) {
    alert("Silakan masukkan username dan password Anda.");
    return;
  }

  // Visual loading feedback
  if (btnSubmit && btnSubmitText) {
    btnSubmit.disabled = true;
    btnSubmit.style.opacity = '0.85';
    btnSubmitText.textContent = 'Memverifikasi kredensial...';
  }

  const config = DEMO_ACCOUNTS[selectedRole];

  setTimeout(() => {
    // Store authenticated session
    sessionStorage.setItem('ACADEMIC_OS_SESSION', JSON.stringify({
      role: selectedRole,
      username: username,
      nama: config.name,
      loginAt: new Date().toISOString()
    }));

    // Redirect to destination portal
    window.location.href = config.targetUrl;
  }, 450);
}

document.addEventListener('DOMContentLoaded', () => {
  setLoginRole('mahasiswa');
});
