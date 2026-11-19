# scratch/fix_remaining_emojis.py
import os

base_dir = r"C:\Users\Lenovo\Downloads\LMS\pages"

svg_external_icon = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; vertical-align: middle;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>'

# 1. Fix Dosen pages index.html (replace Pusat bantuan ↗)
dosen_dir = os.path.join(base_dir, "dosen")
for root, dirs, files in os.walk(dosen_dir):
    for f in files:
        if f.endswith(".html"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8") as file:
                content = file.read()
            if "Pusat bantuan  ↗" in content or "Pusat bantuan ↗" in content:
                content = content.replace("Pusat bantuan  ↗", f"<span>Pusat bantuan</span>{svg_external_icon}")
                content = content.replace("Pusat bantuan ↗", f"<span>Pusat bantuan</span>{svg_external_icon}")
                with open(fpath, "w", encoding="utf-8") as file:
                    file.write(content)
                print(f"Fixed Dosen html: {fpath}")

# 2. Fix Mahasiswa script.js (replace ✓ and ↗ with text [OK] or ->)
mhs_dir = os.path.join(base_dir, "mahasiswa")
for root, dirs, files in os.walk(mhs_dir):
    for f in files:
        if f.endswith(".js"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8") as file:
                content = file.read()
            if "✓" in content or "↗" in content:
                content = content.replace("✓", "[OK]")
                content = content.replace("↗", "->")
                with open(fpath, "w", encoding="utf-8") as file:
                    file.write(content)
                print(f"Fixed Mahasiswa js: {fpath}")

print("Clean-up finished!")
