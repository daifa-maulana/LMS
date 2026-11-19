// SIAK UFD - Operator BAK Suite: Validasi Nilai (FigCraft Alignment)

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
  alert(`Meninjau Berkas Nilai:\nMata Kuliah: ${mk} (${kelas})\nDosen Pengampu: ${dosen}\nStatus: Siap divalidasi oleh Tim BAK.`);
}

function tinjauSemuaNilai() {
  alert('Memproses 18 kelas dalam antrean validasi nilai semester Genap 2024/2025.');
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
