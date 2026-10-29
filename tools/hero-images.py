#!/usr/bin/env python3
"""Bosh ekran (hero) uchun toza rasmlar: Instagram postlaridagi logotip, «MUSAFFO TJM» yorlig'i
va pastki yashil qatlam olib tashlanadi.

Logotip va yorliq osmon/shift kabi tekis joyda turadi — o'rni atrofidagi piksellardan
silliq to'ldiriladi (Coons patch + yengil donadorlik), keyin pastki qatlam kesiladi.
Asl fayllar o'zgarmaydi; natija: assets/img/hero/*.webp

Ishga tushirish: python3 tools/hero-images.py
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'img', 'musaffo')
OUT = os.path.join(ROOT, 'assets', 'img', 'hero')

# fayl: (to'ldiriladigan to'rtburchaklar [x0, y0, x1, y1], kesish oynasi [x0, y0, x1, y1], natija, chegara silliqligi px)
JOBS = {
    'majmua-kechki.webp': ([(84, 60, 346, 292), (900, 60, 1440, 186)], (0, 0, 1440, 1330), 'musaffo-kechki.webp', 22),
    'dupleks-interyer.webp': ([(46, 18, 228, 170)], (0, 0, 1232, 1120), 'dupleks-interyer.webp', 8),
    'fasad-kunduzi.webp': ([], (0, 0, 1202, 1046), 'fasad-kunduzi.webp', 8),
}


def box_blur(a, r, axis):
    """1D o'rtacha filtr (chetlari takrorlanadi)."""
    if r < 1:
        return a
    pad = [(0, 0)] * a.ndim
    pad[axis] = (r, r)
    p = np.pad(a, pad, mode='edge')
    c = np.cumsum(p, axis=axis, dtype=np.float64)
    c = np.concatenate([np.zeros_like(np.take(c, [0], axis=axis)), c], axis=axis)
    n = a.shape[axis]
    hi = np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis)
    lo = np.take(c, np.arange(0, n), axis=axis)
    return (hi - lo) / (2 * r + 1)


def fill(img, box, rng, sm=6):
    """To'rtburchakni chegaralaridan silliq to'ldirish (Coons patch). Rasm chetiga tegsa — o'sha tomon ishlatilmaydi."""
    h, w, _ = img.shape
    x0, y0, x1, y1 = box
    x1, y1 = min(x1, w), min(y1, h)
    k = 4  # chegara qatorlari o'rtachasi (shovqinni kamaytirish)
    top = img[max(0, y0 - k):y0].mean(axis=0)[x0:x1] if y0 > 0 else None
    bot = img[y1:min(h, y1 + k)].mean(axis=0)[x0:x1] if y1 < h else None
    lef = img[y0:y1, max(0, x0 - k):x0].mean(axis=1) if x0 > 0 else None
    rig = img[y0:y1, x1:min(w, x1 + k)].mean(axis=1) if x1 < w else None
    top = box_blur(top, sm, 0) if top is not None else None
    bot = box_blur(bot, sm, 0) if bot is not None else None
    lef = box_blur(lef, sm, 0) if lef is not None else None
    rig = box_blur(rig, sm, 0) if rig is not None else None
    H, W = y1 - y0, x1 - x0
    v = (np.arange(H) + 1)[:, None, None] / (H + 1)
    u = (np.arange(W) + 1)[None, :, None] / (W + 1)
    vert = None
    if top is not None and bot is not None:
        vert = (1 - v) * top[None] + v * bot[None]
    elif top is not None or bot is not None:
        vert = np.repeat((top if top is not None else bot)[None], H, axis=0)
    horz = None
    if lef is not None and rig is not None:
        horz = (1 - u) * lef[:, None] + u * rig[:, None]
    elif lef is not None or rig is not None:
        horz = np.repeat((lef if lef is not None else rig)[:, None], W, axis=1)
    if vert is not None and horz is not None and lef is not None and rig is not None and top is not None and bot is not None:
        # Coons: ikki yo'nalish yig'indisi minus burchaklar bo'yicha bilinear
        c00, c01 = img[y0 - 1, x0 - 1], img[y0 - 1, x1]
        c10, c11 = img[y1, x0 - 1], img[y1, x1]
        bil = (1 - v) * (1 - u) * c00 + (1 - v) * u * c01 + v * (1 - u) * c10 + v * u * c11
        patch = vert + horz - bil
    elif vert is not None and horz is not None:
        # bir tomoni rasm cheti: yaqin chegaraga ko'proq og'irlik
        dy = np.minimum(v, 1 - v) if (top is not None and bot is not None) else np.full_like(v, .5)
        dx = np.minimum(u, 1 - u) if (lef is not None and rig is not None) else (u if lef is not None else 1 - u)
        wv, wh = 1 / (dy + .02), 1 / (dx + .02)
        patch = (vert * wv + horz * wh) / (wv + wh)
    else:
        patch = vert if vert is not None else horz
    # yengil donadorlik — atrofdagi renderdagi kabi
    patch = patch + rng.normal(0, 1.1, patch.shape)
    # chetlarda 6 px yumshoq o'tish
    f = 6
    my = np.clip(np.minimum(np.arange(H), H - 1 - np.arange(H)) / f, 0, 1)[:, None, None]
    mx = np.clip(np.minimum(np.arange(W), W - 1 - np.arange(W)) / f, 0, 1)[None, :, None]
    if y0 == 0: my[:f] = 1
    if y1 == h: my[-f:] = 1
    if x0 == 0: mx[:, :f] = 1
    if x1 == w: mx[:, -f:] = 1
    m = np.minimum(my, mx)
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - m) + patch * m


def main():
    os.makedirs(OUT, exist_ok=True)
    rng = np.random.default_rng(7)
    for src, (boxes, crop, out, sm) in JOBS.items():
        im = Image.open(os.path.join(SRC, src)).convert('RGB')
        a = np.asarray(im, dtype=np.float64).copy()
        for b in boxes:
            fill(a, b, rng, sm)
        res = Image.fromarray(np.clip(a + .5, 0, 255).astype(np.uint8)).crop(crop)
        res.save(os.path.join(OUT, out), 'WEBP', quality=84, method=6)
        print(out, res.size, os.path.getsize(os.path.join(OUT, out)) // 1024, 'KB')


if __name__ == '__main__':
    main()
