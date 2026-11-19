/**
 * SCRIPT.JS — Operator BAK / Dashboard (Node 680)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Operator BAK: Dashboard initialized.');
});

// Role Switcher Modal / Quick Redirect
function openRoleSwitcher() {
  const target = prompt("Ganti Peran ke:\n1. Mahasiswa\n2. Dosen\n3. Operator BAK (Aktif)\n\nKetik 1, 2, atau 3:", "3");
  if (target === "1") {
    window.location.href = "../../mahasiswa/dashboard/index.html";
  } else if (target === "2") {
    window.location.href = "../../dosen/dashboard/index.html";
  }
}
