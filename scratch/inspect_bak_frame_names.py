# scratch/inspect_bak_frame_names.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines[50000:85000], start=50000):
    if '"type": "FRAME"' in line or '"name": "Operator BAK' in line:
        # print next 3 lines
        context = "".join(lines[idx-1:idx+4])
        print(f"Line {idx}: {line.strip()}")
        m_name = re.search(r'"name":\s*"([^"]+)"', context)
        if m_name:
            print(f"   -> Name: {m_name.group(1)}")
