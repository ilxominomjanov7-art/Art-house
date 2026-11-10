"""work/final/<til>.json → js/guide-chapters.js (kabinetdagi «Video yo'riqnoma» boblari)"""
import json, os, sys
H = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'work'); dst = sys.argv[1] if len(sys.argv) > 1 else os.path.join(H, '..', '..', '..', 'js', 'guide-chapters.js')
L = ['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr']
rows = []
for l in L:
    f = os.path.join(H, 'final', l + '.json')
    if os.path.exists(f): rows.append('  %s: %s' % (l, json.dumps(json.load(open(f)), ensure_ascii=False, separators=(',', ':'))))
open(dst, 'w', encoding='utf-8').write("/* ART HOUSE — video yo'riqnoma boblari: vaqt soniyalarda (avtomatik yaratiladi: tools/guide → build.py, chapters.py) */\nwindow.AH_GUIDE = {\n" + ',\n'.join(rows) + '\n};\n')
print(dst, len(rows), 'til')
