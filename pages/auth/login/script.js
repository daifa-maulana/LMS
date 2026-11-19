/**
 * SCRIPT.JS — SIAK UFD Login Portal
 * Single Source of Truth: DESIGN.md & FigCraft Node 148 / 6488
 * Universitas Teknologi Digital / Universitas Fatmawati Digital
 */

let selectedRole = 'mahasiswa';
let currentCaptcha = '7K9B';

const DEMO_ACCOUNTS = {
  mahasiswa: {
    portalBadge: 'Portal Student',
    headingTitle: 'Selamat datang.',
    headingDesc: 'Akses informasi akademik dan layanan mahasiswa Anda.',
    label: 'Username / NIM',
    value: '2023010042',
    placeholder: 'Masukkan NIM Anda (contoh: 2023010042)',
    name: 'Alya Rahma Putri',
    hint: 'Akun Demo: <strong>Alya Rahma Putri</strong> (NIM: 2023010042)',
    targetUrl: '../../mahasiswa/dashboard/index.html'
  },
  dosen: {
    portalBadge: 'Portal Dosen & Pengajar',
    headingTitle: 'Selamat datang.',
    headingDesc: 'Akses kelas, jadwal mengajar, dan evaluasi mahasiswa Anda.',
    label: 'Username / NIDN',
    value: '0412088501',
    placeholder: 'Masukkan NIDN Anda (contoh: 0412088501)',
    name: 'Dr. Aditya Pratama',
    hint: 'Akun Demo: <strong>Dr. Aditya Pratama</strong> (NIDN: 0412088501)',
    targetUrl: '../../dosen/dashboard/index.html'
  },
  akademik: {
    portalBadge: 'Portal Biro Akademik (BAK)',
    headingTitle: 'Selamat datang.',
    headingDesc: 'Kelola master kurikulum, validasi nilai, dan publikasi KHS.',
    label: 'Username / NIP',
    value: '198503152010121001',
    placeholder: 'Masukkan NIP Staf Akademik BAK',
    name: 'Biro Administrasi Akademik (BAK)',
    hint: 'Akun Demo: <strong>Operator BAK</strong> (NIP: 198503152010121001)',
    targetUrl: '../../akademik/dashboard/index.html'
  }
};

function setLoginRole(role) {
  if (!DEMO_ACCOUNTS[role]) return;
  selectedRole = role;

  // Update tabs UI
  document.querySelectorAll('.role-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById('role-btn-' + role);
  if (activeBtn) activeBtn.classList.add('active');

  // Update inputs, headings & hints
  const config = DEMO_ACCOUNTS[role];
  const badgeEl = document.getElementById('portal-context-label');
  const headingTitleEl = document.getElementById('form-heading-title');
  const headingDescEl = document.getElementById('form-heading-desc');
  const labelEl = document.getElementById('label-username');
  const inputEl = document.getElementById('input-username');
  const hintEl = document.getElementById('demo-account-hint');

  if (badgeEl) badgeEl.textContent = config.portalBadge;
  if (headingTitleEl) headingTitleEl.textContent = config.headingTitle;
  if (headingDescEl) headingDescEl.textContent = config.headingDesc;
  if (labelEl) labelEl.textContent = config.label;
  if (inputEl) {
    inputEl.value = config.value;
    inputEl.placeholder = config.placeholder;
  }
  if (hintEl) hintEl.innerHTML = config.hint;
}

function fillDemoCredentials() {
  const config = DEMO_ACCOUNTS[selectedRole];
  const inputUser = document.getElementById('input-username');
  const inputPass = document.getElementById('input-password');
  const inputCaptcha = document.getElementById('input-captcha');

  if (inputUser) inputUser.value = config.value;
  if (inputPass) inputPass.value = 'SIAKUFD2025!';
  if (inputCaptcha) inputCaptcha.value = currentCaptcha;
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
      eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    }
  }
}

function refreshCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentCaptcha = result;

  const box = document.getElementById('captcha-box');
  const input = document.getElementById('input-captcha');
  if (box) box.textContent = currentCaptcha;
  if (input) input.value = currentCaptcha;
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('input-username').value.trim();
  const passwordInput = document.getElementById('input-password').value.trim();
  const captchaInput = document.getElementById('input-captcha').value.trim().toUpperCase();

  if (!usernameInput || !passwordInput) {
    alert('Silakan lengkapi Username dan Password Anda.');
    return;
  }

  if (captchaInput !== currentCaptcha) {
    alert(`Kode verifikasi tidak sesuai. Silakan masukkan kode: ${currentCaptcha}`);
    refreshCaptcha();
    return;
  }

  const account = DEMO_ACCOUNTS[selectedRole];
  const sessionData = {
    role: selectedRole,
    username: usernameInput,
    displayName: account.name,
    loginTime: new Date().toISOString()
  };

  try {
    sessionStorage.setItem('ACADEMIC_OS_SESSION', JSON.stringify(sessionData));
  } catch (e) {
    console.warn('Gagal menyimpan session:', e);
  }

  const btnSubmit = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-submit-text');
  if (btnSubmit) {
    btnSubmit.disabled = true;
    if (btnText) btnText.textContent = 'Memverifikasi Kredensial...';
  }

  setTimeout(() => {
    window.location.href = account.targetUrl;
  }, 450);
}

document.addEventListener('DOMContentLoaded', () => {
  setLoginRole('mahasiswa');
});
