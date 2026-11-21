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

function downloadPDF() {
  window.print();
}

function printDocument() {
  window.print();
}

function openRoleSwitcher() {
  if (confirm("Ganti peran (Role Switcher)? Anda akan diarahkan ke halaman login peran.")) {
    window.location.href = '../../auth/login/index.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTranscript();
});
