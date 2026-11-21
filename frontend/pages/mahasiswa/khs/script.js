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

  if (sksEl) sksEl.textContent = khs.totalSks;
  if (mutuEl) mutuEl.textContent = khs.totalMutu.toFixed(2).replace('.', ',');
  if (ipsEl) ipsEl.textContent = khs.ips.toFixed(2).replace('.', ',');
  if (ipkEl) ipkEl.textContent = khs.ips.toFixed(2).replace('.', ',');
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
