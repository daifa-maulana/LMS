/**
 * SCRIPT.JS — Operator BAK / Dosen (Node 1057)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Operator BAK: Dosen initialized.');

  const searchInput = document.getElementById('input-search-dosen');
  const prodiSelect = document.getElementById('select-prodi-dosen');
  const tbody = document.getElementById('dosen-tbody');

  function filterTable() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const prodi = prodiSelect ? prodiSelect.value.toLowerCase() : 'all';
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
      const name = row.querySelector('.lecturer-name').textContent.toLowerCase();
      const nidn = row.querySelector('.nidn-text').textContent.toLowerCase();
      const rowProdi = row.querySelector('.prodi-text').textContent.toLowerCase();

      const matchesSearch = !query || name.includes(query) || nidn.includes(query);
      let matchesProdi = (prodi === 'all');
      if (prodi === 'ti' && rowProdi.includes('informatika')) matchesProdi = true;
      if (prodi === 'si' && rowProdi.includes('sistem informasi')) matchesProdi = true;
      if (prodi === 'mn' && rowProdi.includes('manajemen')) matchesProdi = true;
      if (prodi === 'ak' && rowProdi.includes('akuntansi')) matchesProdi = true;

      row.style.display = (matchesSearch && matchesProdi) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (prodiSelect) prodiSelect.addEventListener('change', filterTable);
});

function modalTambahDosen() {
  alert("Modal Tambah Dosen:\nFormulir penambahan data dosen (NIDN, Nama Lengkap & Gelar, Program Studi Homebase, Status Ikatan Kerja).");
}

function lihatDetailDosen(nidn, name) {
  alert(`Detail Dosen:\n• Nama: ${name}\n• NIDN: ${nidn}\n• Beban Mengajar: Sesuai SK Mengajar Semester Ganjil 2025/2026\n• Riwayat Pengajaran & BKD: Valid`);
}

// Role Switcher Modal / Quick Redirect
function openRoleSwitcher() {
  const target = prompt("Ganti Peran ke:\n1. Mahasiswa\n2. Dosen\n3. Operator BAK (Aktif)\n\nKetik 1, 2, atau 3:", "3");
  if (target === "1") {
    window.location.href = "../../mahasiswa/dashboard/index.html";
  } else if (target === "2") {
    window.location.href = "../../dosen/dashboard/index.html";
  }
}
