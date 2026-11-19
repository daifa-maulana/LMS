# scratch/clean_akademik_imports.py
import os

akademik_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\akademik"

for root, dirs, files in os.walk(akademik_dir):
    for f in files:
        if f.endswith(".css"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8") as file:
                c = file.read()
            if "@import" in c:
                c = c.replace("@import url('../shell.css');", "/* Shell loaded via HTML link */")
                c = c.replace('@import url("../shell.css");', "/* Shell loaded via HTML link */")
                with open(fpath, "w", encoding="utf-8") as file:
                    file.write(c)
                print(f"Cleaned {fpath}")

print("Done cleaning all @import in akademik.")
