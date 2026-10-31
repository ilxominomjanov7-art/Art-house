"""Saytni bitta faylga yig'ish: CSS, JS va rasmlar/video HTML ichiga joylanadi.
Ishlatish:  python3 tools/build-single.py   →  dist/index.html, dist/kabinet.html
"""
import base64, mimetypes, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dist')
MIME = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.png': 'image/png'}
SKIP_ASSETS = {'js/config.js', 'js/kabinet-stars.js', 'js/ig-reels.js', 'js/kabinet-instagram.js', 'js/menu-schema.js'}  # kabinet: bu fayllardagi rasm/videolar internetdan (link_assets)

def read(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()

CDN_MIN = 1_500_000  # bundan katta videolar fayl ichiga joylanmaydi — GitHub'dagi aniq versiyasi jsDelivr orqali olinadi
def cdn(p):
    """Fayl gitga yuklangan va o'zgarmagan bo'lsa — o'sha commit'ga bog'langan jsDelivr manzili, aks holda None"""
    try:
        git = lambda *a: subprocess.run(['git', '-C', ROOT] + list(a), capture_output=True, text=True)
        if git('diff', '--quiet', 'HEAD', '--', p).returncode != 0: return None
        sha = git('log', '-1', '--format=%H', '--', p).stdout.strip()
        m = re.search(r'github\.com[:/]([\w.-]+/[\w.-]+?)(?:\.git)?$', git('remote', 'get-url', 'origin').stdout.strip())
        return 'https://cdn.jsdelivr.net/gh/%s@%s/%s' % (m.group(1), sha, p) if sha and m else None
    except Exception:
        return None

def data_uri(p):
    with open(os.path.join(ROOT, p), 'rb') as f:
        b = base64.b64encode(f.read()).decode()
    return 'data:%s;base64,%s' % (MIME.get(os.path.splitext(p)[1], 'application/octet-stream'), b)

def inline_assets(text, only=''):
    """only — faqat shu papkadagi fayllar joylanadi (masalan, kabinet uchun yulduzlar rasmlari)"""
    def one(m):
        p = m.group(0)
        if not p.startswith(only): return p
        if p.endswith('.mp4') and os.path.getsize(os.path.join(ROOT, p)) > CDN_MIN: return cdn(p) or data_uri(p)
        return data_uri(p)
    return re.sub(r'assets/[\w./-]+\.(?:webp|jpg|svg|mp4|png)', one, text)

def link_assets(text):
    """Kabinet: loyiha rasmlari/videolari fayl ichiga joylanmaydi (kabinet yengil qoladi) — GitHub'dagi aniq versiyasi
    jsDelivr orqali olinadi; shuning uchun bitta kabinet.html telefonda ochilganda ham rejalar va videolar ko'rinadi.
    Yulduzlar rasmlari (assets/img/amb/) — kichik, fayl ichiga joylanadi."""
    def one(m):
        p = m.group(0)
        if p.startswith('assets/img/amb/'): return data_uri(p)
        return cdn(p) or p
    return re.sub(r'assets/[\w./-]+\.(?:webp|jpg|svg|mp4|png)', one, text)

def script(p, with_assets):
    js = read(p).replace('</script', '<\\/script')
    return '<script>\n' + (inline_assets(js) if with_assets or p not in SKIP_ASSETS else link_assets(js)) + '\n</script>'

def build(page, with_assets):
    """with_assets=False — config.js dagi rasm/video yo'llari joylanmaydi (kabinet uchun), qolganlari joylanadi."""
    html = inline_assets(read(page))
    html = re.sub(r'<link rel="stylesheet" href="(css/[\w.-]+)">', lambda m: '<style>\n' + inline_assets(read(m.group(1))) + '\n</style>', html)
    html = re.sub(r'<script src="(js/[\w.-]+)"></script>', lambda m: script(m.group(1), with_assets), html)
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, page), 'w', encoding='utf-8') as f:
        f.write(html)
    print(page, round(len(html) / 1048576, 2), 'MB')

build('index.html', True)
build('kabinet.html', False)
