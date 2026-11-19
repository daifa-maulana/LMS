# SIAK UFD Design System & UI Specifications
## Single Source of Truth — Berpatok Langsung pada Mahasiswa Dashboard

Dokumen ini adalah acuan resmi desain antarmuka **SIAK UFD (Sistem Informasi Akademik Universitas Fatmawati Digital)** yang disarikan langsung dari implementasi kanvas **Dashboard Mahasiswa** (`pages/mahasiswa/dashboard/`, referensi FigCraft Node `3810`).

Seluruh modul dan halaman dalam sistem (Mahasiswa, Dosen, Operator BAK) **wajib tunduk 100%** pada struktur shell, tipografi, token warna, dan layout yang didokumentasikan di sini tanpa deviasi.

---

### 1. Token Warna (Emerald Design Tokens)

```css
:root {
  /* Emerald Primary */
  --primary: #237757;           /* Warna utama tombol, badge aktif, aksen */
  --primary-hover: #1b5e44;     /* State hover tombol utama */
  --primary-light: #EAF7F1;     /* Latar belakang mint (kartu aktif, banner) */
  --primary-btn: #45B98E;       /* Aksen hijau cerah (active bar indicator) */
  --primary-border: #C8EBD9;    /* Garis batas kartu aksen mint */

  /* Neutral Backgrounds */
  --bg-page: #F8FAFC;           /* Latar belakang kanvas workspace */
  --bg-card: #FFFFFF;           /* Latar kartu, sidebar, dan topbar */

  /* Typography Colors */
  --text-dark: #1D302D;         /* Teks utama (heading, judul halaman, nama) */
  --text-muted: #64736C;        /* Teks sekunder (deskripsi, subtitle, label) */
  --text-nav: #586560;          /* Teks menu sidebar non-aktif */

  /* Borders & Dividers */
  --border-subtle: #E8EEEB;     /* Garis batas kartu, tabel, dan pemisah */

  /* Badges & Secondary Tags */
  --badge-gray-bg: #F0F3F5;     /* Latar badge netral */
  --badge-gray-text: #5B6874;   /* Teks badge netral */

  /* Corner Radii */
  --radius-sm: 6px;             /* Tombol kecil, input form, badge */
  --radius-md: 8px;             /* Kartu widget, tile logo */
  --radius-lg: 10px;            /* Kartu utama dashboard */
  --radius-pill: 9999px;        /* Status badge bulat sempurna */

  /* Font & Animation */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

### 2. Standar Tipografi

1. **Font Family**: Wajib memuat Google Fonts **Inter** di setiap `<head>`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
   ```
2. **Bobot Font**:
   - `400` (Regular): Teks deskripsi, menu navigasi standar, isi tabel
   - `500` (Medium): Label breadcrumbs, nilai statistik, teks tautan
   - `600` (SemiBold): Judul kartu, nama profil, subkategori, menu aktif
   - `700` (Bold): Judul halaman (H2), nama brand H1, angka metrik besar
   - `800` (ExtraBold): Huruf logo "S", predikat nilai A
3. **Monospace**: Digunakan khusus untuk Kode Matkul (`TI2301`), NIM (`2023010042`), SKS, Jam (`08.00–09.40`), dan Angka Mutu:
   ```css
   font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
   ```

---

### 3. Arsitektur Shell Utama (Zero Shift Guarantee)

Seluruh halaman memiliki dimensi kontainer luar yang terkunci:

```
+-----------------------------------------------------------------------------------+
| .siak-app-canvas (100vw x 100vh, grid: 224px 1fr, overflow: hidden)               |
+-------------------+---------------------------------------------------------------+
|                   | .siak-topbar (height: 72px, padding: 0 36px)                  |
|                   +---------------------------------------------------------------+
|   .siak-sidebar   | .siak-workspace-scroll (padding: 28px 36px 24px)              |
|   (width: 224px)  |   .workspace-inner-container (max-width: 1136px; margin: 0 auto)|
|   (padding:       |     .workspace-header-row (H2 + Semester Selector)            |
|    24px 14px 18px)|     [Page Specific Content]                                   |
|                   |     .workspace-footer-strip (10px font, muted)                |
+-------------------+---------------------------------------------------------------+
```

---

### 4. Spesifikasi Standar Sidebar (Width: 224px)

Markup HTML wajib identik di seluruh halaman:

```html
<aside class="siak-sidebar">
  <div>
    <!-- Brand Row -->
    <div class="sidebar-header-box">
      <a href="../dashboard/index.html" class="siak-brand-row">
        <div class="siak-wordmark-tile">S</div>
        <div class="siak-brand-titles">
          <h1>SIAK UFD</h1>
        </div>
      </a>
      <p class="siak-brand-subtitle">Sistem Informasi Akademik</p>

      <!-- Active Role Widget -->
      <div class="active-role-widget" onclick="openRoleSwitcher()">
        <div class="role-info-wrap">
          <span class="role-title">Mahasiswa</span>
          <span class="role-sub">Ruang kerja akademik</span>
        </div>
        <span class="role-chevron">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
    </div>

    <!-- Main Navigation Links -->
    <div class="sidebar-nav-section">
      <div class="menu-category-title">MENU UTAMA</div>
      <ul class="siak-nav-list">
        <!-- 9 Menu Utama SIAK UFD Mahasiswa -->
        <li class="siak-nav-item"><a href="../dashboard/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- grid SVG --></span><span>Dashboard</span></a></li>
        <li class="siak-nav-item"><a href="../biodata/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- users SVG --></span><span>Biodata</span></a></li>
        <li class="siak-nav-item"><a href="../frs/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- file-text SVG --></span><span>FRS/KRS</span></a></li>
        <li class="siak-nav-item"><a href="../matakuliah/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- book-open SVG --></span><span>Mata Kuliah</span></a></li>
        <li class="siak-nav-item"><a href="../jadwal/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- calendar SVG --></span><span>Jadwal Kuliah</span></a></li>
        <li class="siak-nav-item"><a href="../hasilstudi/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- bar-chart-2 SVG --></span><span>Hasil Studi</span></a></li>
        <li class="siak-nav-item"><a href="../khs/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- file-check SVG --></span><span>KHS</span></a></li>
        <li class="siak-nav-item"><a href="../transkrip/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- file-text SVG --></span><span>Transkrip Akademik</span></a></li>
        <li class="siak-nav-item"><a href="../pengumuman/index.html"><span class="nav-active-marker"></span><span class="nav-icon"><!-- bell SVG --></span><span>Pengumuman</span></a></li>
      </ul>
    </div>
  </div>

  <!-- Sidebar Footer -->
  <div class="sidebar-footer-box">
    <div class="academic-help-card">
      <div class="academic-help-card-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <h6>Butuh bantuan?</h6>
      </div>
      <p>Hubungi layanan akademik</p>
      <a href="../pengumuman/index.html">
        <span>Pusat bantuan</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
      </a>
    </div>
    <div class="siak-footer-copyright">
      SIAK UFD © 2025
    </div>
  </div>
</aside>
```

---

### 5. Spesifikasi Standar Topbar (Height: 72px)

Markup HTML wajib identik di seluruh halaman:

```html
<header class="siak-topbar">
  <div class="topbar-breadcrumbs">
    <span class="crumb-muted">Akademik</span>
    <span class="crumb-muted">/</span>
    <span class="crumb-active">[Nama Halaman]</span>
  </div>

  <div class="topbar-right-controls">
    <div class="topbar-search-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" class="topbar-search-input" placeholder="Cari matkul, nilai, jadwal...">
    </div>

    <button class="topbar-btn-icon" title="Notifikasi" onclick="alert('Tidak ada notifikasi baru')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    </button>

    <div class="topbar-profile-divider"></div>

    <div class="topbar-profile-tile" onclick="location.href='../biodata/index.html'">
      <div class="topbar-profile-meta">
        <div class="topbar-profile-name">Alya Rahma Putri</div>
        <div class="topbar-profile-role">Mahasiswa</div>
      </div>
      <span class="topbar-chevron">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
    </div>
  </div>
</header>
```

---

### 6. Spesifikasi Workspace & Container (Max-Width: 1136px)

Untuk menjamin layout rapi dan tidak melebar tak terkendali (*over*), seluruh halaman wajib menggunakan:

```html
<main class="siak-workspace-scroll">
  <div class="workspace-inner-container">
    
    <!-- Title Row -->
    <div class="workspace-header-row">
      <div class="workspace-titles">
        <h2>[Judul Halaman]</h2>
        <p>[Deskripsi / Subtitle Halaman]</p>
      </div>

      <div class="semester-selector-box">
        <span>Ganjil 2025/2026</span>
        <span class="topbar-chevron">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
    </div>

    <!-- Konten Spesifik Halaman -->
    ...

    <!-- Footer Strip -->
    <div class="workspace-footer-strip">
      <span>Tahun akademik 2025/2026</span>
      <span>Terakhir diperbarui · 18 Agustus 2025, 08.30 WIB</span>
    </div>

  </div>
</main>
```

---

### 7. Pantangan Desain (Strict Do's & Don'ts)

| Larangan (Don'ts) | Kewajiban (Do's) |
|---|---|
| **DILARANG** menggunakan emoji atau unicode icon (`ðŸ“Š`, `âŠž`, `â–¼`) | **WAJIB** menggunakan Feather/Lucide vector SVG asli |
| **DILARANG** mengubah tinggi topbar selain `72px` | **WAJIB** `height: 72px; padding: 0 36px;` pada topbar |
| **DILARANG** mengubah lebar sidebar selain `224px` | **WAJIB** `width: 224px; padding: 24px 14px 18px;` |
| **DILARANG** membiarkan kartu melebar tanpa batas (*stretch 100vw*) | **WAJIB** membungkus isi dengan `.workspace-inner-container` (`max-width: 1136px`) |
| **DILARANG** menambahkan avatar circle di topbar yang berbeda antar halaman | **WAJIB** teks profil ringkas (`.topbar-profile-name` + `.topbar-profile-role`) + chevron |
| **DILARANG** menggunakan font sistem selain `Inter` | **WAJIB** memuat Google Fonts `Inter` secara konsisten |
