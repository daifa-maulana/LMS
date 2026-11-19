# scratch/inspect_dosen_all.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

dosen_frames = [
    ("Line 89495", 89495, 94633),
    ("Line 94633", 94633, 99387),
    ("Line 99387", 99387, 105345),
    ("Line 105345", 105345, 113271),
    ("Line 113271", 113271, 120496),
    ("Line 120496", 120496, 125548),
    ("Line 125548", 125548, 131432),
]

for label, start, end in dosen_frames:
    sub = "".join(lines[start:end])
    chars = re.findall(r'"characters":\s*"([^"]+)"', sub)
    sidebar_ignore = {'S', 'SIAK UFD', 'Sistem Informasi Akademik', 'Dosen', 'Ruang kerja akademik',
                      'MENU UTAMA', 'Dashboard', 'Mata Kuliah Saya', 'Jadwal Mengajar', 'Data Mahasiswa',
                      'Input Nilai', 'Input Presensi', 'Validasi Nilai', 'Riwayat Penilaian',
                      'Butuh bantuan?', 'Hubungi layanan akademik', 'Pusat bantuan  ↗', 'Pusat bantuan ↗',
                      'SIAK UFD © 2025', 'Akademik', 'Dr. Aditya Pratama'}
    content_chars = [c for c in chars if c not in sidebar_ignore]
    print(f"\n=== FRAME at {label} ===")
    print("Top 10:", content_chars[:12])
