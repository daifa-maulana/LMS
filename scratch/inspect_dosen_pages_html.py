# scratch/inspect_dosen_pages_html.py
import os
import re

dosen_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\dosen"
pages = ["jadwal", "mahasiswa", "input-nilai", "presensi", "validasi-nilai", "riwayat-penilaian"]

for p in pages:
    fpath = os.path.join(dosen_dir, p, "index.html")
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            c = f.read()
        css_links = re.findall(r'<link rel="stylesheet"[^>]+>', c)
        print(f"\n=== {p} CSS Links ===")
        for link in css_links:
            print("  ", link)
        # Check container class
        m_container = re.search(r'<div class="([^"]+)"', c)
        if m_container:
            print("   Top container class:", m_container.group(1))
        # Check topbar profile
        m_profile = re.search(r'<div class="topbar-profile-[^"]*"[^>]*>([\s\S]*?)</div>\s*</div>\s*</header>', c)
        if m_profile:
            print("   Profile HTML:", m_profile.group(0)[:150].strip())
