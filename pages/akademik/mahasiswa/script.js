/**
 * SCRIPT.JS — Operator BAK / Mahasiswa (Node 871)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Operator BAK: Mahasiswa initialized.');

  const searchInput = document.getElementById('input-search-mhs');
  const prodiSelect = document.getElementById('select-prodi');
  const tbody = document.getElementById('mhs-tbody');

  function filterTable() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const prodi = prodiSelect ? prodiSelect.value.toLowerCase() : 'all';
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
      const name = row.querySelector('.student-name').textContent.toLowerCase();
      const nim = row.querySelector('.nim-text').textContent.toLowerCase();
      const rowProdi = row.querySelector('.prodi-text').textContent.toLowerCase();

      const matchesSearch = !query || name.includes(query) || nim.includes(query);
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

function modalTambahMahasiswa() {
  alert("Modal Tambah Mahasiswa:\nFormulir pendaftaran mahasiswa baru (NIM, Nama Lengkap, Program Studi, Jalur Masuk).\nData tersinkronisasi otomatis dengan PDDIKTI.");
}

function lihatDetailMhs(nim, name) {
  alert(`Detail Mahasiswa:\n• Nama: ${name}\n• NIM: ${nim}\n• Status: Terdaftar & Terverifikasi BAK\n• FRS/KRS: Disetujui\n\nMenampilkan berkas akademik & riwayat registrasi.`);
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
