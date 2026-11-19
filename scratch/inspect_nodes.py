# scratch/inspect_nodes.py
import sys

res_path = 'C:/Users/Lenovo/.gemini/antigravity/brain/fed1e823-4c43-46e0-8e20-616905abb8cf/.system_generated/steps/1198/resource_0.txt'

with open(res_path, 'r', encoding='utf-8') as f:
    text = f.read()

import re

def inspect_node(node_id, title):
    print(f"\n==================== {title} (Node {node_id}) ====================")
    pattern = rf'Node id: "{node_id}"[\s\S]*?(?=Node id: "\d+"|$)'
    match = re.search(pattern, text)
    if match:
        snippet = match.group(0)
        # Find all characters: "..."
        chars = re.findall(r'characters:\s*"([^"]+)"', snippet)
        print("Found characters / texts:", len(chars))
        for c in chars[:40]:
            print(f" - {c}")
    else:
        print(f"Node {node_id} not found!")

inspect_node('1804', 'VALIDASI NILAI')
inspect_node('1998', 'PUBLIKASI NILAI')
inspect_node('2170', 'PERBAIKAN NILAI')
inspect_node('2349', 'KHS & TRANSKRIP')
