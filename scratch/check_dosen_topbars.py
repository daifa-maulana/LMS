# scratch/check_dosen_topbars.py
import os
import re

dosen_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\dosen"
pages = ["dashboard", "matakuliah", "jadwal", "mahasiswa", "input-nilai", "presensi", "validasi-nilai", "riwayat-penilaian"]

for p in pages:
    fpath = os.path.join(dosen_dir, p, "index.html")
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            c = f.read()
        m = re.search(r'<header class="siak-topbar">([\s\S]*?)</header>', c)
        if m:
            print(f"\n=== Topbar in Dosen/{p} ===")
            print(m.group(1)[:300].strip())
