/**
 * SCRIPT.JS — SIAK UFD Biodata Mahasiswa
 * Exact match to FigCraft Node 3981
 */

const STUDENT_BIODATA = {
  nama: "Alya Rahma Putri",
  nim: "2023010042",
  prodi: "S1 Teknik Informatika",
  angkatan: "2023",
  semester: "Semester 5 · Kelas reguler",
  tempatLahir: "Jakarta",
  tanggalLahir: "14 Mei 2004",
  jenisKelamin: "Perempuan",
  agama: "Islam",
  alamat: "Jl. Margonda Raya No. 120, Beji, Depok",
  emailMhs: "alya.putri@mhs.ufd.ac.id",
  emailPribadi: "alya.rahmaputri@gmail.com",
  telepon: "0812-9876-5432",
  dpaNama: "Dr. Maya Lestari",
  dpaProdi: "Teknik Informatika",
  dpaEmail: "maya.lestari@ufd.ac.id",
  dpaJadwal: "Selasa, 10.00–12.00 WIB"
};

function openRoleSwitcher() {
  if (confirm("Ganti peran (Role Switcher)? Anda akan diarahkan ke halaman login peran.")) {
    window.location.href = '../../auth/login/index.html';
  }
}

function showToast(message) {
  const existing = document.getElementById('toast-alert');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-alert';
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.backgroundColor = '#1D302D';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '8px';
  toast.style.fontSize = '12px';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
  toast.style.zIndex = '9999';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '8px';
  toast.innerHTML = `<span style="color: #45B98E;">[OK]</span> <span>${message}</span>`;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Can be bound to reactive edits if needed
});
