// SIAK UFD - Operator BAK Suite: Publikasi Nilai (Integrated with LocalStorage)

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
      const matchProdi = prodi === 'all' || prodi === 'ti';

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
  if (confirm(`Publikasikan nilai akhir untuk mata kuliah ${mk} (${kelas}) ke portal mahasiswa via LocalStorage?`)) {
    if (window.siakStorage) {
      const classes = window.siakStorage.get().classes;
      const match = classes.find(c => c.nama_mk.toLowerCase().includes(mk.toLowerCase()) || c.kelas === kelas);
      if (match) {
        window.siakStorage.updateClassStatus(match.id, 'PUBLISHED');
      }
    }

    const row = linkEl ? linkEl.closest('tr') : null;
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

    alert(`Sukses! Nilai ${mk} (${kelas}) berhasil dipublikasikan resmi. Nilai sekarang langsung tampil di KHS mahasiswa.`);
  }
}

function lihatNilaiTerbit(mk, kelas) {
  alert(`Detail Publikasi Nilai:\nMata Kuliah: ${mk} (${kelas})\nStatus: Terpublikasi dan dapat diakses mahasiswa melalui menu KHS.`);
}

function publikasikanBatch() {
  if (!window.siakStorage) return;
  const ok = confirm('Publikasikan seluruh kelas yang telah divalidasi ke KHS mahasiswa via LocalStorage?');
  if (ok) {
    window.siakStorage.publishBatchClasses();
    alert('Sukses! Seluruh kelas berstatus VALIDATED telah resmi diterbitkan ke KHS mahasiswa.');
    location.reload();
  }
}

