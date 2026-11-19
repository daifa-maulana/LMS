# scratch/deep_inspect_bak.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def inspect_section(start, end, label):
    print(f"\n==================== {label} (Lines {start}-{end}) ====================")
    sub = "".join(lines[start:end])
    # Extract structure: Frame names and text characters
    for idx, l in enumerate(lines[start:end], start=start):
        if '"type": "FRAME"' in l or '"characters":' in l:
            m_c = re.search(r'"characters":\s*"([^"]+)"', l)
            if m_c:
                print(f"  [Text] {m_c.group(1)}")
            m_f = re.search(r'"name":\s*"([^"]+)"', l)
            if m_f:
                print(f"  [Frame] {m_f.group(1)}")

inspect_section(65659, 72031, "LINE 65659 (Publikasi Nilai)")
inspect_section(72031, 78653, "LINE 72031 (Perbaikan Nilai)")
inspect_section(78653, 83423, "LINE 78653 (KHS & Transkrip)")
inspect_section(221388, 226000, "LINE 221388 (Tinjau Nilai / Sub-screen)")
inspect_section(231658, 232000, "LINE 231658 (Publikasi Berhasil / Sub-screen)")
