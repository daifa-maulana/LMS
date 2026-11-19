import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    'https://student.digitechuniversity.ac.id/assets/theme_new/css_khusus/portal-login.css?v=1',
    headers={'User-Agent': 'Mozilla/5.0'}
)

try:
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        css = resp.read().decode('utf-8', errors='ignore')
        # find colors, fonts, layout classes
        colors = set(re.findall(r'#(?:[0-9a-fA-F]{3,8})|rgb[a]?\([^)]+\)', css))
        fonts = set(re.findall(r'font-family:\s*([^;]+);', css))
        print("CSS Length:", len(css))
        print("Colors sample:", list(colors)[:15])
        print("Fonts sample:", list(fonts)[:5])
        # print first 1500 chars of css
        print("\nCSS Snippet:\n", css[:1500])
except Exception as e:
    print("Error:", e)
