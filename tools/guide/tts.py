"""Barcha qadamlar uchun ovoz (Microsoft Edge neyron ovozlari, edge-tts): work/tts/<til>/<segment>-<n>.mp3 + durations.json
   Odam ovozi bilan almashtirish: tools/guide/voice/<til>/<segment>-<nn>.mp3 (matnlar: voice/SCRIPT-<til>.md)
   pip install edge-tts; proksi bo'lsa — SSL_CERT_FILE / HTTPS_PROXY muhit o'zgaruvchilari"""
import asyncio, json, os, re, ssl, subprocess
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'work'))
import edge_tts, edge_tts.communicate as C
CA = os.environ.get('SSL_CERT_FILE')
if CA: C._SSL_CTX = ssl.create_default_context(cafile=CA)
D = json.load(open('tts/items.json')); PX = os.environ.get('HTTPS_PROXY')
sem = asyncio.Semaphore(6)
# Til bo'yicha ovoz sozlamalari: o'zbekcha — «dadil» (tezroq va balandroq; reklama roligidagi boshlovchi tempiga moslangan)
OPTS = {'uz': {'rate': '+10%', 'pitch': '+32Hz'}}
def say(l, t):
    """Faqat ovoz uchun matn (subtitr o'zgarmaydi): xorijiy so'zlar o'qilishicha, oʻ/gʻ belgilari"""
    if l != 'uz': return t
    t = t.replace('Art House', 'Art Xaus')
    for a, b in (('AI', 'Ey-Ay'), ('CSV', 'Si-Es-Vi'), ('SMS', 'Es-Em-Es'), ('VIP', 'Vip')): t = re.sub(r'\b%s\b' % a, b, t)
    t = re.sub(r"([oOgG])'", lambda m: m.group(1) + 'ʻ', t)
    return t.replace("'", 'ʼ')
def human(it):
    """Odam ovozi: tools/guide/voice/<til>/<segment>-<nn>.(mp3|m4a|wav|ogg) bo'lsa — sun'iy ovoz o'rniga shu ishlatiladi"""
    for ext in ('mp3', 'm4a', 'wav', 'ogg'):
        f = os.path.join('..', 'voice', it['l'], '%s-%02d.%s' % (it['seg'], it['i'], ext))
        if os.path.exists(f): return f
async def one(it):
    out = 'tts/%s/%s-%02d.mp3' % (it['l'], it['seg'], it['i'])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    h = human(it)
    if h:  # boshidagi/oxiridagi jimlik qirqiladi, ovoz balandligi tekislanadi
        subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', h, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-18:TP=-2',
                               '-ac', '1', '-ar', '24000', '-b:a', '64k', out]); return
    if os.path.exists(out) and os.path.getsize(out) > 1000: return
    o = dict(rate='+4%', pitch='+0Hz')
    o.update(OPTS.get(it['l'], {}))
    async with sem:
        for k in range(4):
            try:
                await edge_tts.Communicate(say(it['l'], it['text']), D['voices'][it['l']], rate=o['rate'], pitch=o['pitch'], proxy=PX).save(out); return
            except Exception as e:
                await asyncio.sleep(2 + k * 2)
        print('FAIL', out)
async def main(): await asyncio.gather(*[one(it) for it in D['items']])
asyncio.run(main())
dur = {}
for it in D['items']:
    f = 'tts/%s/%s-%02d.mp3' % (it['l'], it['seg'], it['i'])
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode().strip() or 0)
    dur.setdefault(it['l'], {}).setdefault(it['seg'], {})[it['i']] = round(d, 3)
json.dump(dur, open('tts/durations.json', 'w'))
for l, v in dur.items(): print(l, 'phone %.0fs' % sum(v['phone'].values()), 'desktop %.0fs' % sum(v['desktop'].values()))
