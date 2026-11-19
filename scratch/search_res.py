# scratch/search_res.py
res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for i, line in enumerate(lines):
    if 'Validasi Nilai' in line or 'Publikasi' in line or 'Perbaikan' in line or 'Transkrip' in line or 'FRAME' in line:
        if any(keyword in line for keyword in ['Validasi', 'Publikasi', 'Perbaikan', 'Transkrip']):
            print(f"Line {i}: {line.strip()[:100]}")
