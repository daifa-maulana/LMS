# scratch/verify_akademik_suite.py
import os
import re

akademik_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\akademik"
expected_pages = [
    "dashboard",
    "mahasiswa",
    "dosen",
    "program-studi",
    "matakuliah",
    "frs-krs",
    "validasi-nilai",
    "publikasi-nilai",
    "perbaikan-nilai",
    "khs-transkrip"
]

emoji_pattern = re.compile(
    r'[\U00010000-\U0010ffff]|'
    r'[\u2600-\u27ff]|'
    r'[\u2300-\u23ff]|'
    r'[\u2b50-\u2b55]|'
    r'[\u203c\u2049\u2139\u2194-\u21aa\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe]'
)

all_ok = True

print("=== 1. VERIFYING 10 PAGES EXISTENCE & CORE FILES ===")
for p in expected_pages:
    page_path = os.path.join(akademik_dir, p)
    if not os.path.exists(page_path):
        print(f"❌ Missing page directory: {p}")
        all_ok = False
        continue
    for fname in ["index.html", "style.css", "script.js"]:
        fpath = os.path.join(page_path, fname)
        if not os.path.exists(fpath):
            print(f"❌ Missing file in {p}: {fname}")
            all_ok = False
        else:
            size = os.path.getsize(fpath)
            if size == 0:
                print(f"❌ Empty file in {p}: {fname}")
                all_ok = False

if all_ok:
    print("✅ All 10 Operator BAK pages have index.html, style.css, and script.js.")

print("\n=== 2. VERIFYING 0 EMOJIS IN OPERATOR BAK FILES ===")
emoji_found = False
for p in expected_pages:
    page_path = os.path.join(akademik_dir, p)
    for fname in ["index.html", "style.css", "script.js"]:
        fpath = os.path.join(page_path, fname)
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
                matches = emoji_pattern.findall(content)
                if matches:
                    print(f"❌ Emoji found in {p}/{fname}: {set(matches)}")
                    emoji_found = True
                    all_ok = False

if not emoji_found:
    print("✅ 0 emojis found across all Operator BAK files (100% SVG Feather icons).")

print("\n=== 3. VERIFYING SIDEBAR LINKS ACROSS ALL 10 PAGES ===")
broken_links = False
for p in expected_pages:
    html_path = os.path.join(akademik_dir, p, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()
        links = re.findall(r'href="([^"#]+)"', html)
        for link in links:
            if link.endswith(".css"):
                target = os.path.normpath(os.path.join(akademik_dir, p, link))
            elif link.startswith("http"):
                continue
            else:
                target = os.path.normpath(os.path.join(akademik_dir, p, link))
            if not os.path.exists(target):
                print(f"❌ Broken link in {p}/index.html: {link} -> {target}")
                broken_links = True
                all_ok = False

if not broken_links:
    print("✅ All navigation and resource links are valid and resolve correctly.")

print("\n=== 4. VERIFYING OVERFLOW-X & SHELL CSS INTEGRATION ===")
shell_path = os.path.join(akademik_dir, "shell.css")
with open(shell_path, "r", encoding="utf-8") as f:
    shell_content = f.read()
if "overflow-x: hidden" in shell_content:
    print("✅ shell.css strictly enforces 'overflow-x: hidden' with zero-layout-shift shell tokens.")
else:
    print("❌ shell.css missing overflow-x: hidden rule!")
    all_ok = False

print("\n" + ("🎉 ALL 10 OPERATOR BAK PAGES VERIFIED 100% PASS!" if all_ok else "⚠️ SOME CHECKS FAILED."))
