# scratch/inspect_validasi_nilai.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = 65659
end = 72031

block = "".join(lines[start:end])
texts = re.findall(r'"characters":\s*"([^"]+)"', block)
print(f"Total characters in Validasi Nilai: {len(texts)}")
for t in texts:
    print(f"- {t}")
