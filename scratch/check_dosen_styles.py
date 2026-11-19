# scratch/check_dosen_styles.py
import os

dosen_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\dosen"
pages = ["dashboard", "matakuliah", "jadwal", "mahasiswa", "input-nilai", "presensi", "validasi-nilai", "riwayat-penilaian"]

for p in pages:
    css_path = os.path.join(dosen_dir, p, "style.css")
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            c = f.read()
        has_import = "@import" in c
        print(f"{p:18} | Has @import: {has_import}")
        if has_import:
            # Remove @import since it's already loaded in index.html
            c = c.replace("@import url('../shell.css');", "/* Shell loaded via HTML link */")
            with open(css_path, "w", encoding="utf-8") as f:
                f.write(c)
            print(f"  Cleaned @import in {p}/style.css")
