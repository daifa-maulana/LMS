/**
 * SCRIPT.JS — Dosen / Input Presensi (Node 3304)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIAK UFD Dosen: Input Presensi initialized.');

  // Attach interactive click handlers to segmented attendance pills
  const pillButtons = document.querySelectorAll('.attendance-pill-btn');
  pillButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = this.closest('.attendance-segmented-control');
      if (!parent) return;

      // Remove active from siblings in this control
      parent.querySelectorAll('.attendance-pill-btn').forEach(b => b.classList.remove('active'));

      // Add active to clicked button
      this.classList.add('active');

      // Recalculate summary metrics
      updateAttendanceCounts();
    });
  });
});

function updateAttendanceCounts() {
  const activePills = document.querySelectorAll('.attendance-pill-btn.active');
  let hadir = 0, izin = 0, sakit = 0, alpa = 0;

  activePills.forEach(pill => {
    const status = pill.getAttribute('data-status');
    if (status === 'hadir') hadir++;
    else if (status === 'izin') izin++;
    else if (status === 'sakit') sakit++;
    else if (status === 'alpa') alpa++;
  });

  // Scale or update displayed numbers (table shows 8 of 32)
  const countHadir = document.getElementById('count-hadir');
  const countIzin = document.getElementById('count-izin');
  const countSakit = document.getElementById('count-sakit');
  const countAlpa = document.getElementById('count-alpa');

  // If user changed one of the 8 visible rows, reflect proportional count
  const baseHadir = 29 - 6; // other 24 students had 23 hadir, 1 izin, etc.
  if (countHadir) countHadir.textContent = baseHadir + hadir;
  if (countIzin) countIzin.textContent = (1) + izin;
  if (countSakit) countSakit.textContent = (0) + sakit;
  if (countAlpa) countAlpa.textContent = (0) + alpa;
}

function simpanPresensi() {
  const course = document.getElementById('select-course');
  const meeting = document.getElementById('select-meeting');
  const courseText = course ? course.options[course.selectedIndex].text : 'Mata Kuliah';
  const meetingText = meeting ? meeting.options[meeting.selectedIndex].text : 'Pertemuan';

  alert(`Presensi Berhasil Disimpan!\n\n• ${courseText}\n• ${meetingText}\n\nData kehadiran telah tercatat di SIAK UFD dan tersinkronisasi ke ruang mahasiswa.`);
}

// Role Switcher Modal / Quick Redirect
