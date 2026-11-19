import urllib.request
import urllib.error
import ssl
import json
import re

urls = {
    "elearning": "https://elearning.digitechuniversity.ac.id",
    "student": "https://student.digitechuniversity.ac.id/"
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

results = {}

for name, url in urls.items():
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req, timeout=15, context=ctx) as response:
            html = response.read().decode('utf-8', errors='ignore')
            status = response.status
            headers = dict(response.getheaders())
            
            # Extract title
            title_m = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
            title = title_m.group(1).strip() if title_m else ""
            
            # Detect CMS/tech
            tech = []
            if "moodle" in html.lower():
                tech.append("Moodle LMS")
            if "educampus" in html.lower():
                tech.append("EduCampus")
            if "bootstrap" in html.lower():
                tech.append("Bootstrap")
            if "tailwind" in html.lower():
                tech.append("Tailwind CSS")
            if "jquery" in html.lower():
                tech.append("jQuery")
            if "react" in html.lower():
                tech.append("React")
            if "vue" in html.lower():
                tech.append("Vue.js")
            if "laravel" in html.lower():
                tech.append("Laravel")
            if "codeigniter" in html.lower() or "ci_session" in str(headers):
                tech.append("CodeIgniter")
                
            # Extract forms / inputs
            inputs = re.findall(r'<input[^>]+name=[\'"]([^\'"]+)[\'"]', html, re.I)
            
            # Extract stylesheets
            css = re.findall(r'<link[^>]+rel=[\'"]stylesheet[\'"][^>]+href=[\'"]([^\'"]+)[\'"]', html, re.I)
            
            # Extract body preview
            clean_text = re.sub(r'<[^>]+>', ' ', html)
            clean_text = re.sub(r'\s+', ' ', clean_text).strip()[:1000]

            results[name] = {
                "url": url,
                "status": status,
                "title": title,
                "server": headers.get('Server', headers.get('server', 'N/A')),
                "tech_detected": tech,
                "input_names": inputs[:10],
                "stylesheets": css[:5],
                "text_snippet": clean_text
            }
    except Exception as e:
        results[name] = {
            "url": url,
            "error": str(e)
        }

print(json.dumps(results, indent=2))
