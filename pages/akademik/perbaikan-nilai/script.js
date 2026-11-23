// SIAK UFD - Operator BAK Suite: Perbaikan Nilai (Dynamic via siakStorage)

function renderRevisions() {
  const tbody = document.getElementById('perbaikan-tbody');
  if (!tbody || !window.siakStorage) return;

  const revisions = window.siakStorage.getRevisions();
  tbody.innerHTML = '';

  if (revisions.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6" style="text-align: center; padding: 24px; color: #64748B;">Tidak ada permohonan perbaikan nilai saat ini.</td>`;
    tbody.appendChild(tr);
    return;
  }

  revisions.forEach(rev => {
    const initials = rev.nama.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const isApproved = rev.status === 'Disetujui';
    const isRejected = rev.status === 'Ditolak';
    const statusClass = isApproved ? 'badge-status-disetujui' : (isRejected ? 'badge-status-ditolak' : 'badge-status-menunggu');

    const tr = document.createElement('tr');
    tr.setAttribute('data-status', rev.status.toLowerCase());
    tr.innerHTML = `
      <td>
        <div class="student-profile-cell">
          <div class="student-avatar">${initials}</div>
          <div class="student-name-wrap">
            <span class="student-name">${rev.nama}</span>
            <span class="student-nim font-mono">${rev.nim}</span>
          </div>
        </div>
      </td>
      <td class="course-text">${rev.mata_kuliah}</td>
      <td><span class="grade-badge-cell font-bold">${rev.nilai_awal}</span> <span style="font-size: 11px; color: #64748B;">→</span> <span class="grade-badge-cell font-bold" style="color: #237757; background: #E6F4EA;">${rev.nilai_diajukan}</span></td>
      <td class="date-text">${rev.tanggal}</td>
      <td><span class="${statusClass}">${rev.status}</span></td>
      <td>
        ${rev.status === 'Menunggu' 
          ? `<a href="#" onclick="tinjauPermohonan('${rev.id}')" class="link-action-review">Tinjau →</a>`
          : `<span style="font-size: 11px; color: #64748B;">Selesai (${rev.status})</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function tinjauPermohonan(revisionId) {
  if (!window.siakStorage) return;
  const rev = window.siakStorage.getRevisions().find(r => r.id === revisionId);
  if (!rev) return;

  const decision = confirm(
    `PERMOHONAN PERBAIKAN NILAI:\n` +
    `Mahasiswa: ${rev.nama} (${rev.nim})\n` +
    `Mata Kuliah: ${rev.mata_kuliah}\n` +
    `Perubahan: ${rev.nilai_awal} -> ${rev.nilai_diajukan}\n` +
    `Alasan: ${rev.alasan}\n\n` +
    `Klik [OK] untuk MENYETUJUI perbaikan nilai ini.\n` +
    `Klik [Cancel] untuk MENOLAK permohonan.`
  );

  if (decision) {
    window.siakStorage.reviewRevision(revisionId, 'APPROVE');
    alert(`[OK] Permohonan perbaikan nilai ${rev.nama} telah DISETUJUI dan dicatat dalam jejak audit BAK.`);
  } else {
    const confirmReject = confirm(`Apakah Anda yakin ingin MENOLAK permohonan ini?`);
    if (confirmReject) {
      window.siakStorage.reviewRevision(revisionId, 'REJECT');
      alert(`[INFO] Permohonan perbaikan nilai ${rev.nama} telah DITOLAK.`);
    }
  }

  renderRevisions();
}

function tinjauSemuaPermohonan() {
  const revisions = window.siakStorage ? window.siakStorage.getRevisions() : [];
  const pending = revisions.filter(r => r.status === 'Menunggu');
  alert(`Terdapat ${pending.length} antrean permohonan perbaikan nilai yang berstatus 'Menunggu'.`);
}


document.addEventListener('DOMContentLoaded', () => {
  renderRevisions();

  const searchInput = document.getElementById('input-search-perbaikan');
  const prodiSelect = document.getElementById('select-prodi-perbaikan');

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#perbaikan-tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchSearch = !query || text.includes(query);
      row.style.display = matchSearch ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (prodiSelect) prodiSelect.addEventListener('change', filterTable);
});
