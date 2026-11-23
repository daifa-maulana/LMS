/**
 * SCRIPT.JS — SIAK UFD FRS & KRS Online Lifecycle Management
 * Logika Transisi:
 * 1. FRS (Formulir Rencana Studi): Terbuka saat rentang waktu aktif & belum di-ACC Dosen Wali. Mahasiswa dapat memilih/mengubah mata kuliah.
 * 2. KRS (Kartu Rencana Studi): Terbit resmi setelah disetujui (di-ACC) Dosen Wali atau saat periode FRS telah ditutup. Mode terkunci dan siap cetak/unduh PDF/DOC.
 */

const CURRENT_STUDENT_NIM = '2023010042';

function getFRSSnapshot() {
  if (window.siakStorage) {
    return window.siakStorage.getStudentFRS(CURRENT_STUDENT_NIM);
  }
  return { nim: CURRENT_STUDENT_NIM, status: 'approved', courses: [] };
}

function getStudentSnapshot() {
  if (window.siakStorage) {
    const data = window.siakStorage.get();
    return (data.students || []).find(s => s.nim === CURRENT_STUDENT_NIM) || {
      nama: 'Alya Rahma Putri',
      nim: CURRENT_STUDENT_NIM,
      prodi: 'S1 Teknik Informatika',
      fakultas: 'Teknologi Informasi & Desain',
      dosen_pa: 'Dr. Maya Lestari',
      dosen_pa_nidn: '0408098201'
    };
  }
  return {
    nama: 'Alya Rahma Putri',
    nim: CURRENT_STUDENT_NIM,
    prodi: 'S1 Teknik Informatika',
    fakultas: 'Teknologi Informasi & Desain',
    dosen_pa: 'Dr. Maya Lestari',
    dosen_pa_nidn: '0408098201'
  };
}

function renderFRSOrKRS() {
  const isOfficial = window.siakStorage ? window.siakStorage.isKRSOfficial(CURRENT_STUDENT_NIM) : true;
  const frsData = getFRSSnapshot();
  const student = getStudentSnapshot();
  const period = window.siakStorage ? window.siakStorage.getFRSPeriod() : { rentang_waktu: '18–29 Agustus 2025', is_open: true };

  const frsEditContainer = document.getElementById('frs-edit-container');
  const krsOfficialContainer = document.getElementById('krs-official-container');
  const pageHeading = document.getElementById('page-main-heading');
  const pageSubheading = document.getElementById('page-main-subheading');
  const bannerTitle = document.getElementById('banner-title');
  const bannerSubtitle = document.getElementById('banner-subtitle');
  const badgeStatus = document.getElementById('reg-badge-status');
  const topbarCrumb = document.getElementById('topbar-crumb-title');

  if (isOfficial) {
    // =========================================================================
    // MODE KRS RESMI: FRS dikunci & Kartu Rencana Studi resmi terbit
    // =========================================================================
    if (topbarCrumb) topbarCrumb.textContent = 'KRS Resmi';
    if (pageHeading) pageHeading.textContent = 'KRS — Kartu Rencana Studi';
    if (pageSubheading) pageSubheading.textContent = 'Dokumen resmi rencana studi yang telah disetujui (ACC) oleh Dosen Pembimbing Akademik';
    
    if (bannerTitle) bannerTitle.textContent = 'Kartu Rencana Studi (KRS) Resmi Terbit';
    if (bannerSubtitle) {
      if (!period.is_open) {
        bannerSubtitle.textContent = 'Masa pengisian FRS telah ditutup · Rencana studi terkunci dan terdaftar permanen di PDDikti';
      } else {
        bannerSubtitle.textContent = `Telah disetujui resmi (ACC) oleh Dosen Pembimbing Akademik (${frsData.dosen_pa || student.dosen_pa}) · Siap diunduh/dicetak`;
      }
    }

    if (badgeStatus) {
      badgeStatus.className = 'reg-status-badge approved';
      badgeStatus.textContent = 'Disetujui Dosen Wali (ACC)';
    }

    if (frsEditContainer) frsEditContainer.style.display = 'none';
    if (krsOfficialContainer) krsOfficialContainer.style.display = 'grid';

    renderOfficialKRSView(frsData, student);
  } else {
    // =========================================================================
    // MODE FRS EDIT: Masih dalam rentang waktu & belum di-ACC dosen wali
    // =========================================================================
    if (topbarCrumb) topbarCrumb.textContent = 'FRS Online';
    if (pageHeading) pageHeading.textContent = 'FRS — Formulir Rencana Studi';
    if (pageSubheading) pageSubheading.textContent = 'Pilih dan susun rencana studi Anda untuk diajukan ke Dosen Pembimbing Akademik';

    if (bannerTitle) bannerTitle.textContent = 'Periode Pengisian & Perubahan FRS Dibuka';
    if (bannerSubtitle) bannerSubtitle.textContent = `${period.rentang_waktu} · Maksimal 24 SKS berdasarkan IPS sebelumnya 3,86`;

    if (badgeStatus) {
      if (frsData.status === 'submitted') {
        badgeStatus.className = 'reg-status-badge submitted';
        badgeStatus.textContent = 'Terkirim ke DPA (Menunggu ACC)';
      } else {
        badgeStatus.className = 'reg-status-badge';
        badgeStatus.textContent = 'Draft Rencana Studi';
      }
    }

    if (frsEditContainer) frsEditContainer.style.display = 'grid';
    if (krsOfficialContainer) krsOfficialContainer.style.display = 'none';

    renderFRSEditView(frsData);
  }
}

function renderFRSEditView(frsData) {
  const tableBody = document.getElementById('frs-table-body');
  const countLabel = document.getElementById('frs-course-count');
  const sksChosenLabel = document.getElementById('frs-sks-chosen');
  const sksRemainingLabel = document.getElementById('frs-sks-remaining');
  const btnSubmit = document.getElementById('btn-submit-krs');

  if (!tableBody) return;

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

function renderOfficialKRSView(frsData, student) {
  const tbody = document.getElementById('krs-official-tbody');
  const totalSksEl = document.getElementById('krs-official-total-sks');
  const nameEl = document.getElementById('krs-doc-name');
  const nimEl = document.getElementById('krs-doc-nim');
  const prodiEl = document.getElementById('krs-doc-prodi');
  const fakultasEl = document.getElementById('krs-doc-fakultas');
  const dpaEl = document.getElementById('krs-doc-dpa');
  const sigStudentEl = document.getElementById('krs-sig-student');
  const sigDpaEl = document.getElementById('krs-sig-dpa');

  if (nameEl) nameEl.textContent = student.nama;
  if (nimEl) nimEl.textContent = student.nim;
  if (prodiEl) prodiEl.textContent = student.prodi;
  if (fakultasEl) fakultasEl.textContent = student.fakultas;
  if (dpaEl) dpaEl.textContent = frsData.dosen_pa || student.dosen_pa;
  if (sigStudentEl) sigStudentEl.textContent = student.nama;
  if (sigDpaEl) sigDpaEl.textContent = frsData.dosen_pa || student.dosen_pa;

  if (!tbody) return;

  const courses = frsData.courses || [];
  tbody.innerHTML = '';

  let totalSks = 0;
  courses.forEach((c, idx) => {
    totalSks += c.sks;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
      <td style="font-family: monospace; font-weight: 600;">${c.kode}</td>
      <td><strong>${c.matkul}</strong></td>
      <td style="text-align: center;"><span class="class-badge">${c.kelas}</span></td>
      <td style="text-align: center; font-family: monospace; font-weight: 600;">${c.sks}</td>
      <td style="font-size: 10.5px;">${c.hari || 'Senin'}, ${c.jam || '08.00 - 09.40'}<br><span style="color: #64748B;">${c.ruang || 'Lab Komputer'}</span></td>
      <td style="font-size: 10.5px;">${c.dosen}</td>
    `;
    tbody.appendChild(tr);
  });

  if (totalSksEl) totalSksEl.textContent = `${totalSks} SKS`;
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
  renderFRSOrKRS();
  showToast(`Mata kuliah ${course ? course.matkul : ''} berhasil dihapus.`);
}

function submitKRS() {
  const frsData = getFRSSnapshot();
  if (!frsData.courses || frsData.courses.length === 0) {
    alert("Silakan pilih minimal 1 mata kuliah sebelum mengajukan KRS.");
    return;
  }
  if (confirm("Ajukan formulir rencana studi ke Dosen Pembimbing Akademik (Dr. Maya Lestari)?")) {
    if (window.siakStorage) {
      window.siakStorage.saveStudentFRS(CURRENT_STUDENT_NIM, frsData.courses, 'submitted');
    }
    renderFRSOrKRS();
    showToast("FRS berhasil diajukan ke Dosen PA! Menunggu persetujuan (ACC).");
  }
}

function cancelSubmission() {
  const frsData = getFRSSnapshot();
  if (confirm("Apakah Anda ingin membatalkan pengajuan FRS untuk melakukan revisi rencana studi?")) {
    if (window.siakStorage) {
      window.siakStorage.saveStudentFRS(CURRENT_STUDENT_NIM, frsData.courses, 'draft');
    }
    renderFRSOrKRS();
    showToast("Pengajuan FRS dibatalkan. Kembali ke status Draft.");
  }
}

function simulateApproveDPA() {
  if (window.siakStorage) {
    window.siakStorage.approveStudentFRS(CURRENT_STUDENT_NIM);
  }
  renderFRSOrKRS();
  showToast("Dosen Wali telah menyetujui (ACC) rencana studi! Dokumen resmi Kartu Rencana Studi (KRS) berhasil diterbitkan.");
}

function simulateReopenFRS() {
  if (window.siakStorage) {
    window.siakStorage.reopenStudentFRS(CURRENT_STUDENT_NIM);
    window.siakStorage.setFRSPeriodOpen(true);
  }
  renderFRSOrKRS();
  showToast("Periode FRS dibuka kembali dalam Mode Edit. Anda dapat menambah atau mengubah mata kuliah.");
}

function bukaDokumenResmi() {
  window.open('../../../output/KRS_2023010042_Alya_Rahma_Putri.html', '_blank');
}

function unduhDokumenPDF() {
  const link = document.createElement('a');
  link.href = '../../../output/KRS_2023010042_Alya_Rahma_Putri.pdf';
  link.download = 'KRS_2023010042_Alya_Rahma_Putri.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Berkas PDF KRS resmi berhasil diunduh ke komputer Anda.');
}

function unduhDokumenWord() {
  const link = document.createElement('a');
  link.href = '../../../output/KRS_2023010042_Alya_Rahma_Putri.doc';
  link.download = 'KRS_2023010042_Alya_Rahma_Putri.doc';
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Berkas Word (.doc) KRS resmi berhasil diunduh ke komputer Anda.');
}

function printOfficialKRS() {
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
  renderFRSOrKRS();
});
