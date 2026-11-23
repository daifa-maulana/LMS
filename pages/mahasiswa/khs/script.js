/**
 * SCRIPT.JS — SIAK UFD KHS (Kartu Hasil Studi)
 * Dynamic rendering from LocalStorage (siakStorage)
 * Single Source of Truth: localStorage ('SIAK_UFD_LOCAL_STATE_V1')
 */

document.addEventListener('DOMContentLoaded', () => {
  renderKHSFromLocalStorage();
});

function renderKHSFromLocalStorage() {
  if (!window.siakStorage) {
    console.warn('[KHS] siakStorage engine not loaded.');
    return;
  }

  // Get active session username or fallback to test student Alya Rahma Putri
  let nim = '2023010042';
  try {
    const raw = sessionStorage.getItem('ACADEMIC_OS_SESSION');
    if (raw) {
      const sess = JSON.parse(raw);
      if (sess.username) nim = sess.username;
    }
  } catch (e) {}

  const khs = window.siakStorage.getStudentKHS(nim);
  if (!khs) return;

  // Set student metadata
  const nameEl = document.getElementById('khs-meta-name');
  const nimEl = document.getElementById('khs-meta-nim');
  const prodiEl = document.getElementById('khs-meta-prodi');
  const dpaEl = document.getElementById('khs-meta-dpa');

  if (nameEl) nameEl.textContent = khs.student.nama;
  if (nimEl) nimEl.textContent = khs.student.nim;
  if (prodiEl) prodiEl.textContent = khs.student.prodi;
  if (dpaEl) dpaEl.textContent = khs.student.dosen_pa;

  // Render table rows
  const tbody = document.getElementById('khs-grades-tbody');
  if (tbody) {
    if (!khs.courses || khs.courses.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 32px 16px; color: #64748B; font-size: 13px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: block; margin: 0 auto 8px; opacity: 0.5;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Belum ada nilai yang dipublikasikan oleh Biro Akademik (BAK) untuk semester ini.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = khs.courses.map((c, idx) => `
        <tr>
          <td class="text-center font-mono">${idx + 1}</td>
          <td class="font-mono">${c.kode_mk}</td>
          <td>${c.nama_mk} (${c.kelas})</td>
          <td class="text-center font-mono">${c.sks}</td>
          <td class="text-center font-bold" style="color: ${c.letter.startsWith('A') ? '#237757' : (c.letter.startsWith('B') ? '#165B9C' : '#D97706')}">${c.letter}</td>
          <td class="text-center font-mono">${c.bobot.toFixed(2).replace('.', ',')}</td>
          <td class="text-right font-mono">${c.mutu.toFixed(2).replace('.', ',')}</td>
        </tr>
      `).join('');
    }
  }

  // Update summary strip
  const sksEl = document.getElementById('khs-stat-sks');
  const mutuEl = document.getElementById('khs-stat-mutu');
  const ipsEl = document.getElementById('khs-stat-ips');
  const ipkEl = document.getElementById('khs-stat-ipk');

  const transcript = window.siakStorage.getStudentTranscript(nim);

  if (sksEl) sksEl.textContent = khs.totalSks;
  if (mutuEl) mutuEl.textContent = khs.totalMutu.toFixed(2).replace('.', ',');
  if (ipsEl) ipsEl.textContent = khs.ips.toFixed(2).replace('.', ',');
  if (ipkEl) ipkEl.textContent = transcript ? transcript.ipk.toFixed(2).replace('.', ',') : khs.ips.toFixed(2).replace('.', ',');
}

function bukaDokumenResmi() {
  window.open('../../../output/KHS_2023010042_Alya_Rahma_Putri.html', '_blank');
}

function unduhDokumenPDF() {
  const link = document.createElement('a');
  link.href = '../../../output/KHS_2023010042_Alya_Rahma_Putri.pdf';
  link.download = 'KHS_2023010042_Alya_Rahma_Putri.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Berkas PDF resmi (KHS) berhasil diunduh ke komputer Anda.');
}

function unduhDokumenWord() {
  const link = document.createElement('a');
  link.href = '../../../output/KHS_2023010042_Alya_Rahma_Putri.doc';
  link.download = 'KHS_2023010042_Alya_Rahma_Putri.doc';
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Berkas Word (.doc) resmi berhasil diunduh ke komputer Anda.');
}

function unduhDokumenResmi() {
  unduhDokumenPDF();
}

function cetakKePrinter() {
  window.print();
}

function downloadPDF() {
  unduhDokumenPDF();
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

