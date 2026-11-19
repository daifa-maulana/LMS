// SIAK UFD - Operator BAK Suite: Publikasi Nilai (FigCraft Alignment)

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('input-search-publikasi');
  const prodiSelect = document.getElementById('select-prodi-publikasi');
  const tableRows = document.querySelectorAll('#publikasi-tbody tr');

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const prodi = (prodiSelect?.value || 'all').toLowerCase();

    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchSearch = !query || text.includes(query);
      const matchProdi = prodi === 'all' || prodi === 'ti'; // In FigCraft TI-3A classes

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

function publikasikanKelas(mk, kelas, linkEl) {
  if (confirm(`Publikasikan nilai akhir untuk mata kuliah ${mk} (${kelas}) ke portal mahasiswa?`)) {
    const row = linkEl.closest('tr');
    if (row) {
      const statusBadge = row.querySelector('.badge-status-siap');
      if (statusBadge) {
        statusBadge.className = 'badge-status-terpublikasi';
        statusBadge.textContent = 'Terpublikasi';
      }
      linkEl.className = 'link-action-view';
      linkEl.textContent = 'Lihat nilai →';
      linkEl.setAttribute('onclick', `lihatNilaiTerbit('${mk}', '${kelas}')`);
    }
    alert(`Nilai ${mk} (${kelas}) berhasil dipublikasikan dan langsung terlihat di KHS mahasiswa!`);
  }
}

function lihatNilaiTerbit(mk, kelas) {
  alert(`Detail Publikasi Nilai:\nMata Kuliah: ${mk} (${kelas})\nStatus: Terpublikasi dan dapat diakses mahasiswa melalui menu KHS.`);
}

function publikasikanBatch() {
  alert('Memproses publikasi massal untuk seluruh kelas yang telah lolos validasi BAK.');
}

function openRoleSwitcher() {
  const roles = [
    { title: '1. Portal Login', url: '../../auth/login/index.html' },
    { title: '2. Mahasiswa - Dashboard', url: '../../mahasiswa/dashboard/index.html' },
    { title: '3. Dosen - Dashboard', url: '../../dosen/dashboard/index.html' },
    { title: '4. Operator BAK - Dashboard', url: '../dashboard/index.html' }
  ];
  const choice = prompt('PILIH ROLE / HALAMAN TUJUAN:\n' + roles.map(r => r.title).join('\n') + '\n\nKetik angka 1-4:');
  if (choice && roles[parseInt(choice, 10) - 1]) {
    window.location.href = roles[parseInt(choice, 10) - 1].url;
  }
}
