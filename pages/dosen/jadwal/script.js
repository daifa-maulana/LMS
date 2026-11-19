/**
 * SCRIPT.JS — Dosen / Jadwal Mengajar (Node 2788)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Dosen: Jadwal Mengajar initialized.');
});

// Role Switcher Modal / Quick Redirect
function openRoleSwitcher() {
  const target = prompt("Ganti Peran ke:\n1. Mahasiswa\n2. Dosen (Aktif)\n3. Operator BAK\n\nKetik 1, 2, atau 3:", "2");
  if (target === "1") {
    window.location.href = "../../mahasiswa/dashboard/index.html";
  } else if (target === "3") {
    window.location.href = "../../admin/dashboard/index.html";
  }
}
