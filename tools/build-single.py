"""Saytni bitta faylga yig'ish: CSS, JS va rasmlar/video HTML ichiga joylanadi.
Ishlatish:  python3 tools/build-single.py   →  dist/index.html, dist/kabinet.html
"""
import base64, mimetypes, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dist')
MIME = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.png': 'image/png'}

def read(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()

def data_uri(p):
    with open(os.path.join(ROOT, p), 'rb') as f:
        b = base64.b64encode(f.read()).decode()
    return 'data:%s;base64,%s' % (MIME.get(os.path.splitext(p)[1], 'application/octet-stream'), b)

def inline_assets(text):
    return re.sub(r'assets/[\w./-]+\.(?:webp|jpg|svg|mp4|png)', lambda m: data_uri(m.group(0)), text)

def build(page, with_assets):
    html = read(page)
    html = re.sub(r'<link rel="stylesheet" href="(css/[\w.-]+)">', lambda m: '<style>\n' + read(m.group(1)) + '\n</style>', html)
    html = re.sub(r'<script src="(js/[\w.-]+)"></script>', lambda m: '<script>\n' + read(m.group(1)).replace('</script', '<\\/script') + '\n</script>', html)
    html = inline_assets(html) if with_assets else html.replace('assets/favicon.svg', data_uri('assets/favicon.svg'))
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, page), 'w', encoding='utf-8') as f:
        f.write(html)
    print(page, round(len(html) / 1048576, 2), 'MB')

build('index.html', True)
build('kabinet.html', False)
