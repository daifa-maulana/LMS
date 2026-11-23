/**
 * SCRIPT.JS — Dosen / Input Nilai (Node 3089)
 * Integrated with LocalStorage (siakStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Dosen: Input Nilai initialized with LocalStorage.');

  // Load from storage
  loadGradesFromStorage();

  // Attach auto-recalculation listeners to all grade inputs
  const rows = document.querySelectorAll('#grades-tbody tr');
  rows.forEach(row => {
    const inputs = row.querySelectorAll('.grade-input-field');
    inputs.forEach(input => {
      input.addEventListener('input', () => recalculateRow(row));
    });
  });

  // Course selector change listener
  const courseSelect = document.getElementById('select-course');
  if (courseSelect) {
    courseSelect.addEventListener('change', () => {
      loadGradesFromStorage();
    });
  }
});

function getSelectedClassId() {
  const select = document.getElementById('select-course');
  if (!select) return 'cls-bd-3a';
  if (select.value === 'bd-3a') return 'cls-bd-3a';
  if (select.value === 'algo-1a') return 'cls-algo-1a';
  if (select.value === 'pbo-3b' || select.value === 'oop-3b') return 'cls-oop-3b';
  return 'cls-bd-3a';
}

function loadGradesFromStorage() {
  if (!window.siakStorage) return;
  const classId = getSelectedClassId();
  const cls = window.siakStorage.getClassById(classId);
  if (!cls || !cls.students) return;

  const rows = document.querySelectorAll('#grades-tbody tr');
  rows.forEach(row => {
    const nim = row.getAttribute('data-student');
    const studentData = cls.students.find(s => s.nim === nim);
    if (studentData) {
      const tugasInput = row.querySelector('[data-type="tugas"]');
      const kuisInput = row.querySelector('[data-type="kuis"]');
      const utsInput = row.querySelector('[data-type="uts"]');
      const uasInput = row.querySelector('[data-type="uas"]');

      if (tugasInput && studentData.tugas !== undefined) tugasInput.value = studentData.tugas;
      if (kuisInput && studentData.kuis !== undefined) kuisInput.value = studentData.kuis;
      if (utsInput && studentData.uts !== undefined) utsInput.value = studentData.uts;
      if (uasInput && studentData.uas !== undefined) uasInput.value = studentData.uas;

      recalculateRow(row);
    }
  });
}

function recalculateRow(row) {
  const tugas = parseFloat(row.querySelector('[data-type="tugas"]')?.value) || 0;
  const kuis = parseFloat(row.querySelector('[data-type="kuis"]')?.value) || 0;
  const uts = parseFloat(row.querySelector('[data-type="uts"]')?.value) || 0;
  const uas = parseFloat(row.querySelector('[data-type="uas"]')?.value) || 0;

  // Formula: Tugas 20%, Kuis 20%, UTS 25%, UAS 35%
  const finalVal = (tugas * 0.20) + (kuis * 0.20) + (uts * 0.25) + (uas * 0.35);
  const finalCell = row.querySelector('.final-grade-cell');
  const badgeWrap = row.querySelector('.badge-grade-a, .badge-grade-b');

  if (finalCell) {
    finalCell.textContent = finalVal.toFixed(1);
  }

  // Determine letter grade
  let letter = 'E';
  let badgeClass = 'badge-grade-b';

  if (finalVal >= 85) {
    letter = 'A';
    badgeClass = 'badge-grade-a';
  } else if (finalVal >= 80) {
    letter = 'AB';
    badgeClass = 'badge-grade-a';
  } else if (finalVal >= 75) {
    letter = 'B';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 70) {
    letter = 'BC';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 65) {
    letter = 'C';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 55) {
    letter = 'D';
    badgeClass = 'badge-grade-b';
  } else {
    letter = 'E';
    badgeClass = 'badge-grade-b';
  }

  if (badgeWrap) {
    badgeWrap.textContent = letter;
    badgeWrap.className = badgeClass;
  }
}

function simpanDraftNilai() {
  if (!window.siakStorage) {
    alert('Draft nilai berhasil disimpan.');
    return;
  }

  const classId = getSelectedClassId();
  const rows = document.querySelectorAll('#grades-tbody tr');
  const studentRows = [];

  rows.forEach(r => {
    const nim = r.getAttribute('data-student');
    const tugas = parseFloat(r.querySelector('[data-type="tugas"]')?.value) || 0;
    const kuis = parseFloat(r.querySelector('[data-type="kuis"]')?.value) || 0;
    const uts = parseFloat(r.querySelector('[data-type="uts"]')?.value) || 0;
    const uas = parseFloat(r.querySelector('[data-type="uas"]')?.value) || 0;
    if (nim) {
      studentRows.push({ nim, tugas, kuis, uts, uas });
    }
  });

  window.siakStorage.saveClassGrades(classId, studentRows, 'DRAFT');
  alert('Berhasil! Draft nilai kelas telah disimpan ke LocalStorage.');
}

function kirimValidasiBak() {
  if (!window.siakStorage) {
    window.location.href = '../validasi-nilai/index.html';
    return;
  }

  const classId = getSelectedClassId();
  const rows = document.querySelectorAll('#grades-tbody tr');
  const studentRows = [];

  rows.forEach(r => {
    const nim = r.getAttribute('data-student');
    const tugas = parseFloat(r.querySelector('[data-type="tugas"]')?.value) || 0;
    const kuis = parseFloat(r.querySelector('[data-type="kuis"]')?.value) || 0;
    const uts = parseFloat(r.querySelector('[data-type="uts"]')?.value) || 0;
    const uas = parseFloat(r.querySelector('[data-type="uas"]')?.value) || 0;
    if (nim) {
      studentRows.push({ nim, tugas, kuis, uts, uas });
    }
  });

  window.siakStorage.saveClassGrades(classId, studentRows, 'SUBMITTED');
  alert('Berhasil! Nilai kelas telah dikunci dan disubmit ke antrean validasi BAK.');
  window.location.href = '../validasi-nilai/index.html';
}

function imporNilaiModal() {
  alert("Fitur Impor Nilai:\nSilakan unggah berkas template (.xlsx atau .csv) nilai mahasiswa.\nSistem akan memvalidasi NIM dan mengimpor nilai secara otomatis.");
}

