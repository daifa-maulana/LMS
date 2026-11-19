// SIAK UFD - Operator BAK Suite: Perbaikan Nilai (FigCraft Alignment)

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('input-search-perbaikan');
  const prodiSelect = document.getElementById('select-prodi-perbaikan');
  const tableRows = document.querySelectorAll('#perbaikan-tbody tr');

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

function tinjauPermohonan(nama, mk, nilai) {
  alert(`Meninjau Permohonan Perbaikan Nilai:\nMahasiswa: ${nama}\nMata Kuliah: ${mk}\nNilai Awal: ${nilai}\nStatus: Siap diproses verifikasi dokumen & persetujuan Dekanat/BAK.`);
}

function tinjauSemuaPermohonan() {
  alert('Membuka antrean 4 permohonan baru perbaikan nilai semester Genap 2024/2025.');
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
