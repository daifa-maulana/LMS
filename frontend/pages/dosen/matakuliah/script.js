/**
 * SCRIPT.JS — Dosen / Mata Kuliah Saya (SIAK UFD)
 * FigCraft Node 2647
 */

function openRoleSwitcher() {
  if (confirm("Ganti peran (Role Switcher)? Anda akan diarahkan ke halaman login peran.")) {
    window.location.href = '../../auth/login/index.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialized
});
