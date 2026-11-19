/**
 * SCRIPT.JS — SIAK UFD
 * Mahasiswa: Hasil Studi (Node 4586)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Hasil Studi page loaded.');
});


// Role Switcher Navigation
function openRoleSwitcher() {
  if (confirm("Ganti peran (Role Switcher)? Anda akan diarahkan ke halaman login peran.")) {
    window.location.href = '../../auth/login/index.html';
  }
}
