// SIAK UFD - Operator BAK Suite: KHS & Transkrip (FigCraft Alignment)

const studentDataMap = {
  '2023010042': {
    name: 'Alya Rahma Putri',
    avatar: 'AR',
    meta: '2023010042 · S1 Teknik Informatika · Angkatan 2023',
    ipk: '3,78',
    sks: '84'
  },
  '2023010048': {
    name: 'Bagas Pratama',
    avatar: 'BP',
    meta: '2023010048 · S1 Teknik Informatika · Angkatan 2023',
    ipk: '3,45',
    sks: '82'
  },
  '2023020015': {
    name: 'Citra Anindya',
    avatar: 'CA',
    meta: '2023020015 · S1 Sistem Informasi · Angkatan 2023',
    ipk: '3,82',
    sks: '84'
  },
  '2023010057': {
    name: 'Dimas Saputra',
    avatar: 'DS',
    meta: '2023010057 · S1 Teknik Informatika · Angkatan 2023',
    ipk: '3,60',
    sks: '80'
  },
  '2023040032': {
    name: 'Elena Maharani',
    avatar: 'EM',
    meta: '2023040032 · S1 Akuntansi · Angkatan 2023',
    ipk: '3,90',
    sks: '84'
  },
  '2023020043': {
    name: 'Farhan Maulana',
    avatar: 'FM',
    meta: '2023020043 · S1 Sistem Informasi · Angkatan 2023',
    ipk: '3,52',
    sks: '78'
  }
};

function changeStudentData(nim) {
  const data = studentDataMap[nim];
  if (!data) return;

  const avatarEl = document.getElementById('mhs-avatar');
  const nameEl = document.getElementById('mhs-name');
  const metaEl = document.getElementById('mhs-meta');
  const ipkEl = document.getElementById('mhs-ipk');
  const sksEl = document.getElementById('mhs-sks');

  if (avatarEl) avatarEl.textContent = data.avatar;
  if (nameEl) nameEl.textContent = data.name;
  if (metaEl) metaEl.textContent = data.meta;
  if (ipkEl) ipkEl.textContent = data.ipk;
  if (sksEl) sksEl.textContent = data.sks;
}

function refreshStudentView() {
  const select = document.getElementById('select-student-picker');
  if (select) {
    changeStudentData(select.value);
    alert(`Data berkas akademik untuk ${studentDataMap[select.value]?.name || 'mahasiswa'} berhasil dimuat.`);
  }
}

function unduhDokumenPDF(docType) {
  const select = document.getElementById('select-student-picker');
  const name = select ? (studentDataMap[select.value]?.name || 'Mahasiswa') : 'Mahasiswa';
  alert(`Menyiapkan unduhan dokumen sah PDF:\nJenis Dokumen: ${docType}\nNama: ${name}\nStatus: Siap diunduh dengan cap digital & QR validasi BAK.`);
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
