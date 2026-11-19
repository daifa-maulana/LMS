# scratch/dump_all_operator_pages.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

frames = [
    ("Line 51336", 51336, 58418),
    ("Line 58418", 58418, 65659),
    ("Line 65659", 65659, 72031),
    ("Line 72031", 72031, 78653),
    ("Line 78653", 78653, 83423),
    ("Line 83423", 83423, 90000),
]

for label, start, end in frames:
    sub = "".join(lines[start:end])
    chars = re.findall(r'"characters":\s*"([^"]+)"', sub)
    # Filter out sidebar items
    sidebar_items = {'S', 'SIAK UFD', 'Sistem Informasi Akademik', 'Operator BAK', 'Ruang kerja akademik', 
                     'MENU UTAMA', 'Dashboard', 'Mahasiswa', 'Dosen', 'Program Studi', 'Mata Kuliah', 
                     'FRS/KRS', 'Validasi Nilai', 'Publikasi Nilai', 'Perbaikan Nilai', 'KHS & Transkrip', 
                     'Butuh bantuan?', 'Hubungi layanan akademik', 'Pusat bantuan  ↗', 'SIAK UFD © 2025', 
                     'Akademik', 'Nadia Putri'}
    page_chars = [c for c in chars if c not in sidebar_items]
    print(f"\n==================== FRAME at {label} ====================")
    # First 30 items
    print(page_chars[:35])
