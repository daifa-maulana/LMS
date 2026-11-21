/**
 * SCRIPT.JS — Operator BAK / Program Studi (Node 1243)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Operator BAK: Program Studi initialized.');

  const searchInput = document.getElementById('input-search-prodi');
  const fakultasSelect = document.getElementById('select-fakultas');
  const prodiGrid = document.getElementById('prodi-grid');

  function filterProdi() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const fak = fakultasSelect ? fakultasSelect.value.toLowerCase() : 'all';
    const cards = prodiGrid.querySelectorAll('.prodi-card');

    cards.forEach(card => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      const abbr = card.querySelector('.prodi-abbr-tile').textContent.toLowerCase();
      const cardFak = card.getAttribute('data-fakultas') || '';

      const matchesSearch = !query || title.includes(query) || abbr.includes(query);
      const matchesFak = (fak === 'all' || cardFak === fak);

      card.style.display = (matchesSearch && matchesFak) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterProdi);
  if (fakultasSelect) fakultasSelect.addEventListener('change', filterProdi);
});

function modalTambahProdi() {
  alert("Modal Tambah Program Studi:\nFormulir pembukaan program studi baru (Kode Dikti, Nama Prodi, Strata, Fakultas, SK Izin Operasional).");
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
