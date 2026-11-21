/**
 * SCRIPT.JS — SIAK UFD Mahasiswa Dashboard
 * Exact match to FigCraft Node 3810
 */

const SIAK_STUDENT_STATE = {
  nama: "Alya Rahma Putri",
  nim: "2023010042",
  prodi: "S1 Teknik Informatika",
  semester: 5,
  status: "Status mahasiswa aktif",
  ipk: "3,78",
  predikat: "Predikat sangat memuaskan",
  ips: "3,86",
  ipsDiff: "↑ 0,09 dari semester lalu",
  sksDitempuh: "84 / 144",
  sksProgressPercent: "58%",
  sksSmt: "21",
  sksSmtCount: "7 mata kuliah direncanakan",
  semesterAktif: "Semester Ganjil 2025/2026",
  todayClasses: [
    {
      jam: "08.00 – 09.40",
      matkul: "Basis Data",
      sub: "Dr. Aditya Pratama · Lab 02",
      status: "Berlangsung",
      statusType: "active"
    },
    {
      jam: "10.00 – 11.40",
      matkul: "Jaringan Komputer",
      sub: "Rina Anggraini, M.Kom. · R. 204",
      status: "Berikutnya",
      statusType: "upcoming"
    },
    {
      jam: "13.00 – 14.40",
      matkul: "Statistika",
      sub: "Dwi Saputra, M.Si. · R. 301",
      status: "Berikutnya",
      statusType: "upcoming"
    }
  ],
  announcements: [
    {
      title: "Periode pengisian KRS dibuka",
      meta: "18–29 Agustus 2025 · Akademik",
      link: "../pengumuman/index.html"
    },
    {
      title: "Pendaftaran beasiswa prestasi",
      meta: "Hingga 5 September · Kemahasiswaan",
      link: "../pengumuman/index.html"
    },
    {
      title: "Kalender akademik 2025/2026",
      meta: "15 Agustus 2025 · Akademik",
      link: "../pengumuman/index.html"
    }
  ]
};

function renderDashboard() {
  // Render Schedule
  const scheduleBox = document.getElementById('today-schedule-list');
  if (scheduleBox) {
    scheduleBox.innerHTML = '';
    SIAK_STUDENT_STATE.todayClasses.forEach(item => {
      const row = document.createElement('div');
      row.className = 'schedule-item-row';
      row.innerHTML = `
        <div class="schedule-time-tag">${item.jam}</div>
        <div class="schedule-course-info">
          <div class="schedule-course-title">${item.matkul}</div>
          <div class="schedule-course-sub">${item.sub}</div>
        </div>
        <div class="schedule-status-badge ${item.statusType}">${item.status}</div>
      `;
      scheduleBox.appendChild(row);
    });
  }

  // Render Announcements
  const announceBox = document.getElementById('announcements-list-box');
  if (announceBox) {
    announceBox.innerHTML = '';
    SIAK_STUDENT_STATE.announcements.forEach(a => {
      const row = document.createElement('a');
      row.href = a.link;
      row.className = 'announcement-item-row';
      row.innerHTML = `
        <div class="announcement-meta">
          <div class="announcement-title">${a.title}</div>
          <div class="announcement-date">${a.meta}</div>
        </div>
        <div class="announcement-arrow">-></div>
      `;
      announceBox.appendChild(row);
    });
  }
}

function openRoleSwitcher() {
  if (confirm("Ganti peran (Role Switcher)? Anda akan diarahkan ke halaman login peran.")) {
    window.location.href = '../../auth/login/index.html';
  }
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
  renderDashboard();
});
