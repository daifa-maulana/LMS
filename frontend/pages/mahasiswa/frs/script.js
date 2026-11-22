/**
 * SCRIPT.JS — SIAK UFD FRS / KRS Online (Dynamic via siakStorage)
 * Single Source of Truth from LocalStorage
 * Exact match to FigCraft Node 4116, 6329, 6688
 */

const CURRENT_STUDENT_NIM = '2023010042';

function getFRSSnapshot() {
  if (window.siakStorage) {
    return window.siakStorage.getStudentFRS(CURRENT_STUDENT_NIM);
  }
  return { nim: CURRENT_STUDENT_NIM, status: 'draft', courses: [] };
}

function renderFRS() {
  const tableBody = document.getElementById('frs-table-body');
  const countLabel = document.getElementById('frs-course-count');
  const sksChosenLabel = document.getElementById('frs-sks-chosen');
  const sksRemainingLabel = document.getElementById('frs-sks-remaining');
  const badgeStatus = document.getElementById('reg-badge-status');
  const btnSubmit = document.getElementById('btn-submit-krs');

  if (!tableBody) return;

  const frsData = getFRSSnapshot();
  const currentCourses = frsData.courses || [];
  const krsStatus = frsData.status || 'draft';

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
          ? `<button class="btn-remove-course" onclick="removeCourse('${c.id}')">Hapus</button>`
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
  const frsData = getFRSSnapshot();
  if (frsData.status === 'submitted') {
    showToast("KRS telah diajukan. Batalkan pengajuan terlebih dahulu untuk mengubah mata kuliah.");
    return;
  }
  const course = (frsData.courses || []).find(c => c.id === id);
  const updatedCourses = (frsData.courses || []).filter(c => c.id !== id);
  
  if (window.siakStorage) {
    window.siakStorage.saveStudentFRS(CURRENT_STUDENT_NIM, updatedCourses);
  }
  renderFRS();
  showToast(`Mata kuliah ${course ? course.matkul : ''} berhasil dihapus.`);
}

function submitKRS() {
  const frsData = getFRSSnapshot();
  if (!frsData.courses || frsData.courses.length === 0) {
    alert("Silakan pilih minimal 1 mata kuliah sebelum mengajukan KRS.");
    return;
  }
  if (confirm("Ajukan rencana studi ke Dosen Pembimbing Akademik (Dr. Maya Lestari)?")) {
    if (window.siakStorage) {
      window.siakStorage.saveStudentFRS(CURRENT_STUDENT_NIM, frsData.courses, 'submitted');
    }
    renderFRS();
    showToast("KRS berhasil diajukan ke Dosen PA! Status kini: Menunggu Persetujuan.");
  }
}

function cancelSubmission() {
  const frsData = getFRSSnapshot();
  if (confirm("Apakah Anda ingin membatalkan pengajuan KRS untuk melakukan revisi rencana studi?")) {
    if (window.siakStorage) {
      window.siakStorage.saveStudentFRS(CURRENT_STUDENT_NIM, frsData.courses, 'draft');
    }
    renderFRS();
    showToast("Pengajuan dibatalkan. KRS kembali ke status Draft.");
  }
}

function bukaDokumenResmi() {
  window.open('../../../output/KRS_2023010042_Alya_Rahma_Putri.html', '_blank');
}

function unduhDokumenResmi() {
  const link = document.createElement('a');
  link.href = '../../../output/KRS_2023010042_Alya_Rahma_Putri.html';
  link.download = 'KRS_2023010042_Alya_Rahma_Putri.html';
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('File KRS Resmi berhasil diunduh ke komputer Anda.');
}

function printOfficialKRS() {
  const frsData = getFRSSnapshot();
  const printTbody = document.getElementById('krs-print-tbody');
  const printTotalSks = document.getElementById('krs-print-total-sks');
  const printableKrs = document.getElementById('printable-krs');
  
  if (!printTbody || !printableKrs) {
    window.print();
    return;
  }

  const courses = frsData.courses || [];
  let totalSks = 0;
  
  printTbody.innerHTML = courses.map((c, idx) => {
    totalSks += c.sks;
    return `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 6px 8px; text-align: center; font-family: monospace;">${idx + 1}</td>
        <td style="padding: 6px 8px; font-family: monospace; font-weight: 600;">${c.kode}</td>
        <td style="padding: 6px 8px;"><strong>${c.matkul}</strong></td>
        <td style="padding: 6px 8px; text-align: center;">${c.kelas}</td>
        <td style="padding: 6px 8px; text-align: center; font-family: monospace;">${c.sks}</td>
        <td style="padding: 6px 8px;">${c.hari || 'Senin'}, ${c.jam || '08.00 - 09.40'}<br><span style="color: #64748B; font-size: 10px;">${c.ruang || 'Lab Komputer'}</span></td>
        <td style="padding: 6px 8px;">${c.dosen}</td>
      </tr>
    `;
  }).join('');

  if (printTotalSks) printTotalSks.textContent = `${totalSks} SKS`;

  window.print();
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
