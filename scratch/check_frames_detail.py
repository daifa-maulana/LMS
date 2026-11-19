# scratch/check_frames_detail.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

frames = [
    ("Dashboard", 23800),
    ("Mahasiswa", 30772),
    ("Dosen", 37744),
    ("Program Studi", 44532),
    ("Mata Kuliah", 51336),
    ("FRS/KRS", 58418),
    ("Validasi Nilai", 65659),
    ("Publikasi Nilai", 72031),
    ("Perbaikan Nilai", 78653),
    ("KHS & Transkrip", 83423),
]

for i in range(len(frames)):
    name, start = frames[i]
    end = frames[i+1][1] if i+1 < len(frames) else 90000
    sub_lines = lines[start:end]
    # Find h1 / h2 characters
    header_chars = []
    for l in sub_lines:
        m = re.search(r'"characters":\s*"([^"]+)"', l)
        if m:
            val = m.group(1)
            if any(k in val for k in ["Validasi", "Publikasi", "Perbaikan", "KHS", "Transkrip", "Mata Kuliah", "FRS"]):
                header_chars.append(val)
    print(f"=== {name} (Line {start} to {end}) ===")
    print("Keywords found:", list(dict.fromkeys(header_chars))[:10])
