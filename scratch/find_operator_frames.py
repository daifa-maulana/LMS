# scratch/find_operator_frames.py
import re

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for top-level screens or "Operator BAK /"
matches = re.findall(r'"name":\s*"Operator BAK\s*/\s*([^"]+)"', text)
print("Unique Operator BAK frames:", set(matches))

# Also search for lines with "Operator BAK /" and their line numbers
with open(res_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if '"name": "Operator BAK /' in line:
            print(f"Line {idx}: {line.strip()}")
