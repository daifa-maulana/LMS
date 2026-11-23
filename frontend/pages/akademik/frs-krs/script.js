// SIAK UFD - Operator BAK Suite: FRS / KRS Management (FigCraft Node 1613)

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('input-search-krs');
  const prodiSelect = document.getElementById('select-prodi-krs');
  const statusTabs = document.querySelectorAll('.status-tab-btn');
  const tableRows = document.querySelectorAll('#krs-tbody tr');

  let currentTab = 'all';

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const prodi = (prodiSelect?.value || 'all').toLowerCase();

    tableRows.forEach(row => {
      const rowStatus = (row.getAttribute('data-status') || '').toLowerCase();
      const text = row.textContent.toLowerCase();
      const prodiCell = row.querySelector('.prodi-text')?.textContent.toLowerCase() || '';

      const matchSearch = !query || text.includes(query);
      const matchProdi = prodi === 'all' || 
        (prodi === 'ti' && prodiCell.includes('informatika')) ||
        (prodi === 'si' && prodiCell.includes('sistem informasi')) ||
        (prodi === 'mn' && prodiCell.includes('manajemen')) ||
        (prodi === 'ak' && prodiCell.includes('akuntansi'));
      const matchTab = currentTab === 'all' || rowStatus === currentTab;

      if (matchSearch && matchProdi && matchTab) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-status') || 'all';
      filterTable();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterTable);
  }

  if (prodiSelect) {
    prodiSelect.addEventListener('change', filterTable);
  }
});

function tinjauKRS(nim, name, sks) {
  alert(`Meninjau Berkas KRS Mahasiswa:\nNama: ${name}\nNIM: ${nim}\nBeban: ${sks}\nStatus: Siap diproses.`);
}

