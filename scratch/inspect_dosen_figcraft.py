# scratch/inspect_dosen_figcraft.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

dosen_frames = [
    ("Dosen / Jadwal Mengajar", 99387, 105345),
    ("Dosen / Data Mahasiswa", 105345, 113271),
    ("Dosen / Input Nilai", 113271, 120496),
    ("Dosen / Input Presensi", 120496, 125548),
    ("Dosen / Validasi Nilai", 125548, 131432),
    ("Dosen / Riwayat Penilaian", 131432, 137000),
]

for title, start, end in dosen_frames:
    sub = "".join(lines[start:end])
    chars = re.findall(r'"characters":\s*"([^"]+)"', sub)
    sidebar_ignore = {'S', 'SIAK UFD', 'Sistem Informasi Akademik', 'Dosen', 'Ruang kerja akademik',
                      'MENU UTAMA', 'Dashboard', 'Mata Kuliah Saya', 'Jadwal Mengajar', 'Data Mahasiswa',
                      'Input Nilai', 'Input Presensi', 'Validasi Nilai', 'Riwayat Penilaian',
                      'Butuh bantuan?', 'Hubungi layanan akademik', 'Pusat bantuan  ↗', 'Pusat bantuan ↗',
                      'SIAK UFD © 2025', 'Akademik', 'Dr. Aditya Pratama'}
    content_chars = [c for c in chars if c not in sidebar_ignore]
    print(f"\n=======================================================")
    print(f" {title} (Lines {start} - {end})")
    print(f"=======================================================")
    print("Found content items:", len(content_chars))
    for idx, c in enumerate(content_chars):
        print(f"  {idx+1}. {c}")
