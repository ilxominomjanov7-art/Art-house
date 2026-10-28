"""Rasmlardagi o'zbekcha yozuvni yo'qotish: yozuv joyi kuchli xiralashtirilib, ustidan
yumshoq to'q gradient qo'yiladi. Yozuvning o'zi saytda HTML matn sifatida (har bir tilda) chiqadi.
Asl rasmlar assets/img/orig/ papkasida saqlanadi. Qayta ishlatish: python3 tools/clean-text.py"""
import os, shutil
from PIL import Image, ImageFilter, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# fayl: [(y0, y1, qorong'ilik, gradient yo'nalishi)]  — y0/y1 rasm balandligiga nisbatan
REGIONS = {
    'musaffo/avtoturargoh.webp':       [(.74, 1, .82, 'up')],
    'musaffo/bolalar-oyingohi.webp':   [(.76, 1, .82, 'up')],
    'musaffo/fitness-zona.webp':       [(.76, 1, .82, 'up')],
    'musaffo/kolyaska-velosiped.webp': [(.76, 1, .82, 'up')],
    'musaffo/zamonaviy-lift.webp':     [(.77, 1, .82, 'up')],
    'musaffo/dupleks-interyer.webp':   [(.74, 1, .78, 'up')],
    'musaffo/majmua-kechki.webp':      [(.70, 1, .80, 'up')],
    'musaffo/musaffo-aerial-ig.webp':  [(.72, 1, .82, 'up')],
    'musaffo/musaffo-cover.webp':      [(.32, .63, .0, 'flat')],
    'obod/obod-joylashuv.webp':        [(.21, .29, .0, 'flat'), (.72, 1, .82, 'up')],
}

def clean(rel, regs):
    src = os.path.join(ROOT, 'assets/img', rel)
    orig = os.path.join(ROOT, 'assets/img/orig', rel.replace('/', '__'))
    if not os.path.exists(orig): shutil.copy(src, orig)
    im = Image.open(orig).convert('RGB'); W, H = im.size
    for reg in regs:
        y0, y1, dark, mode = reg[:4]; x0, x1 = (reg[4], reg[5]) if len(reg) > 4 else (0, 1)
        a, b = int(H * y0), int(H * y1); xa = int(W * x0); W2 = int(W * x1) - xa
        band = im.crop((xa, a, xa + W2, b))
        r = max(18, int(W * .045)) * (2 if W2 < W else 1)
        bl = band.filter(ImageFilter.GaussianBlur(r)).filter(ImageFilter.GaussianBlur(r))
        # chegarada silliq o'tish uchun niqob
        m = Image.new('L', (W2, b - a), 255); d = ImageDraw.Draw(m); fe = max(8, int((b - a) * .18))
        for i in range(fe):
            v = int(255 * i / fe)
            if a > 0: d.line([(0, i), (W2, i)], fill=v)
            if b < H: d.line([(0, b - a - 1 - i), (W2, b - a - 1 - i)], fill=v)
        band = Image.composite(bl, band, m)
        if dark:
            g = Image.new('L', (W2, b - a)); gd = ImageDraw.Draw(g)
            for y in range(b - a):
                k = y / max(1, b - a - 1)
                gd.line([(0, y), (W2, y)], fill=int(255 * dark * (min(1, k * 1.6) if mode == 'up' else 1)))
            band = Image.composite(Image.new('RGB', band.size, (4, 22, 16)), band, g)
        im.paste(band, (xa, a))
    im.save(src, 'WEBP', quality=88, method=6)
    print(rel, im.size)

for k, v in REGIONS.items(): clean(k, v)
