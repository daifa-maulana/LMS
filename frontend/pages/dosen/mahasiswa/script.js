/**
 * SCRIPT.JS — Dosen / Data Mahasiswa (Node 2925)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Dosen: Data Mahasiswa initialized.');

  const courseSelect = document.getElementById('select-course');
  const courseMeta = document.getElementById('table-course-meta');
  const paginationInfo = document.getElementById('pagination-info');

  if (courseSelect) {
    courseSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'bd-3a') {
        courseMeta.textContent = '32 mahasiswa terdaftar · 3 SKS';
        paginationInfo.textContent = 'Menampilkan 1–8 dari 32 mahasiswa';
      } else if (val === 'algo-1a') {
        courseMeta.textContent = '36 mahasiswa terdaftar · 3 SKS';
        paginationInfo.textContent = 'Menampilkan 1–8 dari 36 mahasiswa';
      } else if (val === 'rpl-5a') {
        courseMeta.textContent = '28 mahasiswa terdaftar · 3 SKS';
        paginationInfo.textContent = 'Menampilkan 1–8 dari 28 mahasiswa';
      } else if (val === 'pbo-3b') {
        courseMeta.textContent = '32 mahasiswa terdaftar · 3 SKS';
        paginationInfo.textContent = 'Menampilkan 1–8 dari 32 mahasiswa';
      }
    });
  }
});

function exportDataMahasiswa() {
  const courseSelect = document.getElementById('select-course');
  const courseText = courseSelect.options[courseSelect.selectedIndex].text;
  alert(`Memproses ekspor daftar mahasiswa untuk:\n"${courseText}"\nFormat: CSV (UTF-8). File siap diunduh.`);
}

// Role Switcher Modal / Quick Redirect
function openRoleSwitcher() {
  const target = prompt("Ganti Peran ke:\n1. Mahasiswa\n2. Dosen (Aktif)\n3. Operator BAK\n\nKetik 1, 2, atau 3:", "2");
  if (target === "1") {
    window.location.href = "../../mahasiswa/dashboard/index.html";
  } else if (target === "3") {
    window.location.href = "../../admin/dashboard/index.html";
  }
}
