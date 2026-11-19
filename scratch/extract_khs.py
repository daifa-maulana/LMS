# scratch/extract_khs.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

sub = "".join(lines[78653:83423])
chars = re.findall(r'"characters":\s*"([^"]+)"', sub)
print("\n==================== KHS & TRANSKRIP ====================")
for c in chars:
    print(c)
