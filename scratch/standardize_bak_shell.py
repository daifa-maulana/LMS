# scratch/standardize_bak_shell.py
import os
import re

akademik_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\akademik"
ref_file = os.path.join(akademik_dir, "frs-krs", "index.html")

with open(ref_file, "r", encoding="utf-8") as f:
    ref_content = f.read()

# Extract reference sidebar
m_sidebar = re.search(r'(<!-- 1\. SIDEBAR \(224px\) — Operator BAK -->[\s\S]*?</aside>)', ref_content)
sidebar_template = m_sidebar.group(1)

pages = [
    ("validasi-nilai", "Validasi Nilai", "../validasi-nilai/index.html", "index.html"),
    ("publikasi-nilai", "Publikasi Nilai", "../publikasi-nilai/index.html", "index.html"),
    ("perbaikan-nilai", "Perbaikan Nilai", "../perbaikan-nilai/index.html", "index.html"),
    ("khs-transkrip", "KHS & Transkrip", "../khs-transkrip/index.html", "index.html")
]

for folder, title, old_href, new_href in pages:
    page_html = os.path.join(akademik_dir, folder, "index.html")
    with open(page_html, "r", encoding="utf-8") as f:
        content = f.read()

    # Create page-specific sidebar by setting active class
    page_sidebar = sidebar_template
    # In ref sidebar, frs-krs was active: <a href="index.html" class="active">
    page_sidebar = page_sidebar.replace('<a href="index.html" class="active">', '<a href="../frs-krs/index.html">')
    # Set this page active
    page_sidebar = page_sidebar.replace(f'<a href="{old_href}">', '<a href="index.html" class="active">')

    # Replace sidebar in target page
    content = re.sub(r'<aside class="siak-sidebar">[\s\S]*?</aside>', page_sidebar, content)

    # Standardize Topbar
    topbar_html = f'''<!-- TOPBAR (72px) -->
      <header class="siak-topbar">
        <div class="topbar-breadcrumb">
          <span>Akademik</span>
          <span class="sep">/</span>
          <span class="current">{title}</span>
        </div>

        <div class="topbar-right-actions">
          <div class="topbar-search-box">
            <span class="search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input type="text" placeholder="Cari di SIAK UFD...">
          </div>

          <button class="topbar-icon-btn" title="Notifikasi" onclick="alert('Tidak ada notifikasi baru')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>

          <div class="topbar-profile-widget" onclick="openRoleSwitcher()">
            <div class="user-avatar-initials">NP</div>
            <div class="user-meta-wrap">
              <span class="user-full-name">Nadia Putri</span>
              <span class="user-role-badge">Operator BAK</span>
            </div>
            <span class="user-chevron">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </div>
        </div>
      </header>'''

    content = re.sub(r'<header class="siak-topbar">[\s\S]*?</header>', topbar_html, content)

    # Save standardized HTML
    with open(page_html, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Standardized shell in {folder}/index.html")

print("Done standardizing all 4 BAK pages.")
