/**
 * SCRIPT.JS — Dosen / Riwayat Penilaian (Node 3648)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Dosen: Riwayat Penilaian initialized.');

  const semesterFilter = document.getElementById('select-semester');
  const tbody = document.getElementById('riwayat-tbody');

  if (semesterFilter && tbody) {
    semesterFilter.addEventListener('change', (e) => {
      const val = e.target.value.toLowerCase();
      const rows = tbody.querySelectorAll('tr');

      rows.forEach(row => {
        const periode = row.querySelector('.periode-cell').textContent.toLowerCase();
        if (val === 'all') {
          row.style.display = '';
        } else if (val === 'ganjil' && periode.includes('ganjil')) {
          row.style.display = '';
        } else if (val === 'genap' && periode.includes('genap')) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
});

function eksporRiwayat() {
  const year = document.getElementById('select-year');
  const semester = document.getElementById('select-semester');
  const yearText = year ? year.options[year.selectedIndex].text : '';
  const semText = semester ? semester.options[semester.selectedIndex].text : '';

  alert(`Memproses ekspor riwayat penilaian:\n• Tahun Akademik: ${yearText}\n• Semester: ${semText}\n\nFormat CSV (UTF-8) siap diunduh.`);
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
