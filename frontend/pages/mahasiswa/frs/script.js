/**
 * SCRIPT.JS — SIAK UFD FRS / KRS Online
 * Exact match to FigCraft Node 4116, 6329, 6688
 */

const INITIAL_FRS_COURSES = [
  { id: 1, kode: "TI2301", matkul: "Basis Data", dosen: "Dr. Aditya Pratama", kelas: "TI-5A", sks: 3 },
  { id: 2, kode: "TI2302", matkul: "Jaringan Komputer", dosen: "Rina Anggraini, M.Kom.", kelas: "TI-5A", sks: 3 },
  { id: 3, kode: "TI2303", matkul: "Statistika", dosen: "Dwi Saputra, M.Si.", kelas: "TI-5A", sks: 3 },
  { id: 4, kode: "TI2304", matkul: "Sistem Operasi", dosen: "Dr. Maya Lestari", kelas: "TI-5A", sks: 3 },
  { id: 5, kode: "TI2305", matkul: "Pemrograman Web", dosen: "Fajar Hidayat, M.Kom.", kelas: "TI-5A", sks: 3 },
  { id: 6, kode: "TI2306", matkul: "Interaksi Manusia Komputer", dosen: "Dr. Indah Puspita", kelas: "TI-5A", sks: 3 },
  { id: 7, kode: "TI2307", matkul: "Bahasa Inggris Akademik", dosen: "Siti Nurhaliza, M.Pd.", kelas: "TI-5A", sks: 3 }
];

let currentCourses = JSON.parse(localStorage.getItem('siak_frs_courses')) || [...INITIAL_FRS_COURSES];
let krsStatus = localStorage.getItem('siak_frs_status') || 'draft'; // 'draft' | 'submitted'

function saveState() {
  localStorage.setItem('siak_frs_courses', JSON.stringify(currentCourses));
  localStorage.setItem('siak_frs_status', krsStatus);
}

function renderFRS() {
  const tableBody = document.getElementById('frs-table-body');
  const countLabel = document.getElementById('frs-course-count');
  const sksChosenLabel = document.getElementById('frs-sks-chosen');
  const sksRemainingLabel = document.getElementById('frs-sks-remaining');
  const badgeStatus = document.getElementById('reg-badge-status');
  const btnSubmit = document.getElementById('btn-submit-krs');

  if (!tableBody) return;

  tableBody.innerHTML = '';

  let totalSKS = 0;
  currentCourses.forEach((c) => {
    totalSKS += c.sks;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="course-meta-title">${c.matkul}</div>
        <div class="course-meta-sub">${c.kode} · ${c.dosen}</div>
      </td>
      <td style="text-align: center;"><span class="class-badge">${c.kelas}</span></td>
      <td style="text-align: center;"><span class="sks-tag font-mono">${c.sks}</span></td>
      <td style="text-align: right;">
        ${krsStatus === 'draft' 
          ? `<button class="btn-remove-course" onclick="removeCourse(${c.id})">Hapus</button>`
          : `<span style="font-size: 11px; color: #64748B;">Terkunci</span>`}
      </td>
    `;
    tableBody.appendChild(tr);
  });

  const maxSKS = 24;
  const remaining = Math.max(0, maxSKS - totalSKS);

  if (countLabel) countLabel.textContent = `${currentCourses.length} mata kuliah · Semester 5`;
  if (sksChosenLabel) sksChosenLabel.textContent = `${totalSKS} SKS`;
  if (sksRemainingLabel) sksRemainingLabel.textContent = `${remaining} SKS`;

  // Status badge update
  if (badgeStatus) {
    if (krsStatus === 'submitted') {
      badgeStatus.className = 'reg-status-badge submitted';
      badgeStatus.textContent = 'Terkirim ke DPA (Menunggu Persetujuan)';
    } else {
      badgeStatus.className = 'reg-status-badge';
      badgeStatus.textContent = 'Draft rencana studi';
    }
  }

  // Button update
  if (btnSubmit) {
    if (krsStatus === 'submitted') {
      btnSubmit.className = 'btn-submit-krs submitted';
      btnSubmit.innerHTML = `<span>Batalkan Pengajuan & Edit</span>`;
      btnSubmit.onclick = cancelSubmission;
    } else {
      btnSubmit.className = 'btn-submit-krs';
      btnSubmit.innerHTML = `<span>Ajukan KRS</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
      btnSubmit.onclick = submitKRS;
    }
  }
}

function removeCourse(id) {
  if (krsStatus === 'submitted') {
    showToast("KRS telah diajukan. Batalkan pengajuan terlebih dahulu untuk mengubah mata kuliah.");
    return;
  }
  const course = currentCourses.find(c => c.id === id);
  currentCourses = currentCourses.filter(c => c.id !== id);
  saveState();
  renderFRS();
  showToast(`Mata kuliah ${course ? course.matkul : ''} berhasil dihapus.`);
}

function submitKRS() {
  if (currentCourses.length === 0) {
    alert("Silakan pilih minimal 1 mata kuliah sebelum mengajukan KRS.");
    return;
  }
  if (confirm("Ajukan rencana studi ke Dosen Pembimbing Akademik (Dr. Maya Lestari)?")) {
    krsStatus = 'submitted';
    saveState();
    renderFRS();
    showToast("KRS berhasil diajukan ke Dosen PA! Status kini: Menunggu Persetujuan.");
  }
}

function cancelSubmission() {
  if (confirm("Apakah Anda ingin membatalkan pengajuan KRS untuk melakukan revisi rencana studi?")) {
    krsStatus = 'draft';
    saveState();
    renderFRS();
    showToast("Pengajuan dibatalkan. KRS kembali ke status Draft.");
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
  renderFRS();
});


// Role Switcher Navigation
function openRoleSwitcher() {
  if (confirm("Ganti peran (Role Switcher)? Anda akan diarahkan ke halaman login peran.")) {
    window.location.href = '../../auth/login/index.html';
  }
}
