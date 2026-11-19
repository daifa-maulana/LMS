# scratch/fix_akademik_blank_pages.py
import os

akademik_dir = r"C:\Users\Lenovo\Downloads\LMS\pages\akademik"
pages = ["validasi-nilai", "publikasi-nilai", "perbaikan-nilai", "khs-transkrip"]

for p in pages:
    page_dir = os.path.join(akademik_dir, p)
    
    # 1. Update index.html
    html_path = os.path.join(page_dir, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            c = f.read()
            
        # Add ../shell.css link if missing
        if '<link rel="stylesheet" href="../shell.css">' not in c:
            c = c.replace('<link rel="stylesheet" href="style.css">', 
                          '<link rel="stylesheet" href="../shell.css">\n  <link rel="stylesheet" href="style.css">')
        
        # Change siak-app-container to siak-app-canvas
        c = c.replace('class="siak-app-container"', 'class="siak-app-canvas"')
        
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(c)
        print(f"Updated {p}/index.html")
        
    # 2. Update style.css
    css_path = os.path.join(page_dir, "style.css")
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
        if "@import url('../shell.css');" in css:
            css = css.replace("@import url('../shell.css');", "/* Shell imported via HTML link */")
            with open(css_path, "w", encoding="utf-8") as f:
                f.write(css)
            print(f"Updated {p}/style.css")

print("Done updating akademik blank pages.")
