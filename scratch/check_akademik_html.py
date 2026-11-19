# scratch/check_akademik_html.py
import os
import re

akademik_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\akademik"
expected_pages = [
    "dashboard",
    "mahasiswa",
    "dosen",
    "program-studi",
    "matakuliah",
    "frs-krs",
    "validasi-nilai",
    "publikasi-nilai",
    "perbaikan-nilai",
    "khs-transkrip"
]

for p in expected_pages:
    fpath = os.path.join(akademik_dir, p, "index.html")
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            c = f.read()
        css_links = re.findall(r'<link rel="stylesheet"[^>]+>', c)
        has_shell = any("shell.css" in l for l in css_links)
        m_canvas = re.search(r'<div class="([^"]+)"', c)
        canvas_class = m_canvas.group(1) if m_canvas else "NONE"
        print(f"{p:18} | Has shell.css in link: {str(has_shell):5} | Container: {canvas_class}")
