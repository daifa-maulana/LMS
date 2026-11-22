/**
 * SCRIPT.JS — SIAK UFD Transkrip Akademik (Dynamic via siakStorage)
 * Single Source of Truth from LocalStorage
 * Exact match to FigCraft Node 4969 & 5049
 */

function renderTranscript() {
  const tbody = document.getElementById('transkrip-tbody');
  const elTotalSks = document.getElementById('val-total-sks');
  const elTotalMutu = document.getElementById('val-total-mutu');
  const elIpk = document.getElementById('val-ipk');
  const elPredikat = document.getElementById('val-predikat');

  if (!tbody || !window.siakStorage) return;

  const transcriptData = window.siakStorage.getStudentTranscript('2023010042');
  tbody.innerHTML = '';

  transcriptData.semesters.forEach(sem => {
    // Semester Header
    const trSem = document.createElement('tr');
    trSem.className = 'semester-header-row';
    trSem.innerHTML = `<td colspan="7">${sem.nama_semester}</td>`;
    tbody.appendChild(trSem);

    // Courses
    sem.courses.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-center font-mono">${c.no}</td>
        <td class="font-mono">${c.kode}</td>
        <td>${c.nama}</td>
        <td class="text-center font-mono">${c.sks}</td>
        <td class="text-center font-bold">${c.nilai}</td>
        <td class="text-center font-mono">${c.bobot.toFixed(2).replace('.', ',')}</td>
        <td class="text-right font-mono">${c.mutu.toFixed(2).replace('.', ',')}</td>
      `;
      tbody.appendChild(tr);
    });
  });

  if (elTotalSks) elTotalSks.textContent = `${transcriptData.totalSks} SKS`;
  if (elTotalMutu) elTotalMutu.textContent = transcriptData.totalMutu.toFixed(2).replace('.', ',');
  if (elIpk) elIpk.textContent = transcriptData.ipk.toFixed(2).replace('.', ',');
  if (elPredikat) elPredikat.textContent = transcriptData.predikat;
}

function bukaDokumenResmi() {
  window.open('../../../output/Transkrip_2023010042_Alya_Rahma_Putri.html', '_blank');
}

function unduhDokumenResmi() {
  const link = document.createElement('a');
  link.href = '../../../output/Transkrip_2023010042_Alya_Rahma_Putri.html';
  link.download = 'Transkrip_2023010042_Alya_Rahma_Putri.html';
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('File Transkrip Resmi berhasil diunduh ke komputer Anda.');
}

function cetakKePrinter() {
  window.print();
}

function downloadPDF() {
  unduhDokumenResmi();
}

function printDocument() {
  cetakKePrinter();
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

function openRoleSwitcher() {
  if (confirm("Ganti peran (Role Switcher)? Anda akan diarahkan ke halaman login peran.")) {
    window.location.href = '../../auth/login/index.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTranscript();
});
