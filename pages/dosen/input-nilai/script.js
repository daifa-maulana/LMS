/**
 * SCRIPT.JS — Dosen / Input Nilai (Node 3089)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Dosen: Input Nilai initialized.');

  // Attach auto-recalculation listeners to all grade inputs
  const rows = document.querySelectorAll('#grades-tbody tr');
  rows.forEach(row => {
    const inputs = row.querySelectorAll('.grade-input-field');
    inputs.forEach(input => {
      input.addEventListener('input', () => recalculateRow(row));
    });
  });
});

function recalculateRow(row) {
  const tugas = parseFloat(row.querySelector('[data-type="tugas"]').value) || 0;
  const kuis = parseFloat(row.querySelector('[data-type="kuis"]').value) || 0;
  const uts = parseFloat(row.querySelector('[data-type="uts"]').value) || 0;
  const uas = parseFloat(row.querySelector('[data-type="uas"]').value) || 0;

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
    letter = 'A−';
    badgeClass = 'badge-grade-a';
  } else if (finalVal >= 75) {
    letter = 'B+';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 70) {
    letter = 'B';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 65) {
    letter = 'B−';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 60) {
    letter = 'C+';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 55) {
    letter = 'C';
    badgeClass = 'badge-grade-b';
  } else if (finalVal >= 40) {
    letter = 'D';
    badgeClass = 'badge-grade-b';
  }

  if (badgeWrap) {
    badgeWrap.textContent = letter;
    badgeWrap.className = badgeClass;
  }
}

function imporNilaiModal() {
  alert("Fitur Impor Nilai:\nSilakan unggah berkas template (.xlsx atau .csv) nilai mahasiswa.\nSistem akan memvalidasi NIM dan mengimpor nilai secara otomatis.");
}

function simpanDraftNilai() {
  alert("Draft nilai berhasil disimpan ke server SIAK UFD.\nAnda dapat melanjutkan pengisian sebelum finalisasi dan pengiriman validasi.");
}

// Role Switcher Modal / Quick Redirect
function openRoleSwitcher() {
  const target = prompt("Ganti Peran ke:\n1. Mahasiswa\n2. Dosen (Aktif)\n3. Operator BAK\n\nKetik 1, 2, atau 3:", "2");
  if (target === "1") {
    window.location.href = "../../mahasiswa/dashboard/index.html";
  } else if (target === "3") {
    window.location.href = "../../admin/dashboard/index.html";
  }
}
