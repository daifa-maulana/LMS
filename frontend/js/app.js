/**
 * APP.JS — Learnthru Dashboard Logic
 * Sesuai Gambar Referensi Baru (3-Column Layout)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFRSTable();
  renderJadwalTable();
  renderKHSTable();
});

// 1. Switch Navigation Page
function switchNavPage(viewId) {
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
  }

  // Update Left Sidebar Active State
  document.querySelectorAll('.nav-link-item').forEach(link => {
    link.classList.remove('active');
  });

  const mapping = {
    'view-dashboard': 'link-dashboard',
    'view-frs': 'link-classroom',
    'view-jadwal': 'link-live',
    'view-khs': 'link-library'
  };

  if (mapping[viewId]) {
    document.getElementById(mapping[viewId])?.classList.add('active');
  }
}

// 2. Render FRS Table
function renderFRSTable() {
  const tbody = document.getElementById('tableBodyFRS');
  if (!tbody) return;

  const list = window.lmsStore.frs_aktif;
  let html = '';

  list.forEach((item, idx) => {
    html += `
      <tr>
        <td style="width: 40px; text-align: center;">${idx + 1}</td>
        <td><strong>${item.kode}</strong></td>
        <td>
          <div style="font-weight: 600;">${item.nama}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${item.dosen}</div>
        </td>
        <td>${item.sks} SKS</td>
        <td>${item.hari}, ${item.jam} (${item.ruang})</td>
        <td><span class="status-bullet-done">Disetujui PA</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// 3. Render Jadwal Table
function renderJadwalTable() {
  const tbody = document.getElementById('tableBodyJadwal');
  if (!tbody) return;

  const list = window.lmsStore.frs_aktif;
  let html = '';

  list.forEach(item => {
    html += `
      <tr>
        <td><strong>${item.hari}</strong></td>
        <td>${item.jam}</td>
        <td>${item.ruang}</td>
        <td><strong>${item.kode}</strong> — ${item.nama}</td>
        <td>${item.sks} SKS</td>
        <td>${item.dosen}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// 4. Render KHS Table
function renderKHSTable() {
  const tbody = document.getElementById('tableBodyKHS');
  if (!tbody) return;

  const list = window.lmsStore.khs_semester;
  let html = '';

  list.forEach(item => {
    const total = item.sks * item.bobot;
    html += `
      <tr>
        <td><strong>${item.kode}</strong></td>
        <td>${item.nama}</td>
        <td>${item.sks}</td>
        <td>${item.nilai_angka}</td>
        <td><strong>${item.nilai_huruf}</strong></td>
        <td>${item.bobot.toFixed(2)}</td>
        <td><strong>${total.toFixed(2)}</strong></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Toast Notifikasi
function showToast(text) {
  const old = document.querySelector('.toast-badge');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-badge';
  toast.innerHTML = `<span>✓</span><span>${text}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 2200);
}
