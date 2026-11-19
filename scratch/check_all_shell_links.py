# scratch/check_all_shell_links.py
import os
import re

base_dir = r"C:\Users\Lenovo\Downloads\LMS\pages"

all_ok = True
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f == "index.html" and not root.endswith("pages") and not root.endswith("login"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8") as file:
                content = file.read()
            # check if shell.css is linked
            if "shell.css" not in content:
                print(f"❌ Missing shell.css in {fpath}")
                all_ok = False
            # check if container class is siak-app-canvas
            if 'class="siak-app-canvas"' not in content:
                print(f"⚠️ Not using siak-app-canvas: {fpath}")

if all_ok:
    print("✅ All HTML pages have shell.css properly linked!")
