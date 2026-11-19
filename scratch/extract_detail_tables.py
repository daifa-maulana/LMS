# scratch/extract_detail_tables.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def print_frame_all_text(title, start, end):
    sub = "".join(lines[start:end])
    chars = re.findall(r'"characters":\s*"([^"]+)"', sub)
    print(f"\n==================== {title} ====================")
    for c in chars:
        print(c)

print_frame_all_text("VALIDASI NILAI", 58418, 65659)
print_frame_all_text("PERBAIKAN NILAI", 72031, 78653)
