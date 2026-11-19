# scratch/fix_arrows_akademik.py
import os

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

svg_icon = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; vertical-align: middle;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>'

for p in expected_pages:
    html_path = os.path.join(akademik_dir, p, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace Pusat bantuan  ↗
        if "Pusat bantuan  ↗" in content or "Pusat bantuan ↗" in content:
            new_content = content.replace("Pusat bantuan  ↗", f"<span>Pusat bantuan</span>{svg_icon}")
            new_content = new_content.replace("Pusat bantuan ↗", f"<span>Pusat bantuan</span>{svg_icon}")
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Fixed {p}/index.html")

print("Done replacing arrows.")
