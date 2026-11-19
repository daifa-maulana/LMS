# scratch/find_dosen_frames.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'"name":\s*"Dosen\s*/\s*([^"]+)"', text)
print("Unique Dosen frames in resource_0:", set(matches))

with open(res_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if '"name": "Dosen /' in line:
            print(f"Line {idx}: {line.strip()}")
