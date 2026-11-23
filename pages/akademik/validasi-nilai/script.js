// SIAK UFD - Operator BAK Suite: Validasi Nilai (Integrated with LocalStorage)

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('input-search-validasi');
  const prodiSelect = document.getElementById('select-prodi-validasi');
  const tableRows = document.querySelectorAll('#validasi-tbody tr');

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const prodi = (prodiSelect?.value || 'all').toLowerCase();

    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const codeCell = row.querySelector('.course-code')?.textContent.toLowerCase() || '';

      const matchSearch = !query || text.includes(query);
      const matchProdi = prodi === 'all' || 
        (prodi === 'ti' && codeCell.startsWith('ti')) ||
        (prodi === 'si' && codeCell.startsWith('si')) ||
        (prodi === 'mn' && codeCell.startsWith('mn')) ||
        (prodi === 'ak' && codeCell.startsWith('ak'));

      if (matchSearch && matchProdi) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterTable);
  }

  if (prodiSelect) {
    prodiSelect.addEventListener('change', filterTable);
  }
});

function tinjauNilaiKelas(mk, kelas, dosen) {
  if (!window.siakStorage) {
    alert(`Meninjau Berkas Nilai:\nMata Kuliah: ${mk} (${kelas})\nDosen: ${dosen}`);
    return;
  }

  // Find class in storage
  const classes = window.siakStorage.get().classes;
  const match = classes.find(c => c.nama_mk.toLowerCase().includes(mk.toLowerCase()) || c.kelas === kelas) || classes[0];

  const action = confirm(
    `BERKAS NILAI KELAS:\n` +
    `Mata Kuliah: ${match.nama_mk} (${match.kelas})\n` +
    `Dosen: ${match.dosen_nama}\n` +
    `Status Saat Ini: [${match.status_penilaian}]\n\n` +
    `Klik [OK] untuk VALIDASI & SETUJUI nilai kelas ini,\natau klik [Batal] untuk kembali.`
  );

  if (action) {
    window.siakStorage.updateClassStatus(match.id, 'VALIDATED');
    alert(`Sukses! Nilai kelas ${match.nama_mk} (${match.kelas}) telah disetujui (VALIDATED) dan siap untuk dipublikasikan ke KHS.`);
    location.reload();
  }
}

function tinjauSemuaNilai() {
  if (!window.siakStorage) return;
  const ok = confirm('Validasi dan setujui seluruh kelas dalam antrean validasi ke LocalStorage?');
  if (ok) {
    const classes = window.siakStorage.get().classes;
    classes.forEach(c => {
      if (c.status_penilaian === 'SUBMITTED' || c.status_penilaian === 'DRAFT') {
        window.siakStorage.updateClassStatus(c.id, 'VALIDATED');
      }
    });
    alert('Sukses! Seluruh kelas dalam antrean telah divalidasi oleh Tim BAK.');
    location.reload();
  }
}

