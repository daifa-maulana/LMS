/**
 * SCRIPT.JS — Operator BAK / Mata Kuliah (Node 1427)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Operator BAK: Mata Kuliah initialized.');

  const searchInput = document.getElementById('input-search-mk');
  const prodiSelect = document.getElementById('select-prodi-mk');
  const tbody = document.getElementById('mk-tbody');

  function filterTable() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const prodi = prodiSelect ? prodiSelect.value.toLowerCase() : 'all';
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
      const title = row.querySelector('.course-title-cell').textContent.toLowerCase();
      const code = row.querySelector('.code-cell-tag').textContent.toLowerCase();
      const rowProdi = row.querySelector('.prodi-text').textContent.toLowerCase();

      const matchesSearch = !query || title.includes(query) || code.includes(query);
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

function modalTambahMataKuliah() {
  alert("Modal Tambah Mata Kuliah:\nFormulir penambahan mata kuliah baru (Kode MK, Nama MK, Bobot SKS, Semester Kurikulum, Jenis Mata Kuliah Wajib/Pilihan).");
}

// Role Switcher Modal / Quick Redirect
