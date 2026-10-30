"""Barcha qadamlar uchun ovoz (Microsoft Edge neyron ovozlari, edge-tts): work/tts/<til>/<segment>-<n>.mp3 + durations.json
   pip install edge-tts; proksi bo'lsa — SSL_CERT_FILE / HTTPS_PROXY muhit o'zgaruvchilari"""
import asyncio, json, os, ssl, subprocess
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'work'))
import edge_tts, edge_tts.communicate as C
CA = os.environ.get('SSL_CERT_FILE')
if CA: C._SSL_CTX = ssl.create_default_context(cafile=CA)
D = json.load(open('tts/items.json')); PX = os.environ.get('HTTPS_PROXY')
sem = asyncio.Semaphore(6)
async def one(it):
    out = 'tts/%s/%s-%02d.mp3' % (it['l'], it['seg'], it['i'])
    if os.path.exists(out) and os.path.getsize(out) > 1000: return
    os.makedirs(os.path.dirname(out), exist_ok=True)
    async with sem:
        for k in range(4):
            try:
                await edge_tts.Communicate(it['text'], D['voices'][it['l']], rate='+4%', proxy=PX).save(out); return
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
