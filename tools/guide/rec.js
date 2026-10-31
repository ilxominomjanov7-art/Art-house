/* Video-yo'riqnoma yozuvchisi: node tools/guide/rec.js <til> <phone|desktop>
   Sayt http://localhost:8765/ da ochiq bo'lishi kerak (GUIDE_URL bilan o'zgartiriladi).
   Natija: work/out/<til>-<seg>.webm va .json (har bir qadam va bob vaqti, soniyalarda) */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const S = require('./script.js'), seed = require('./seed.js');
const W = path.join(__dirname, 'work'), DUR = JSON.parse(fs.readFileSync(W + '/tts/durations.json'));
const [LANG, SEG] = process.argv.slice(2), PH = SEG === 'phone';
const B = process.env.GUIDE_URL || 'http://localhost:8765/';
const BEATS = PH ? S.PHONE : S.DESKTOP;

const OVERLAY = () => {
  if (window.top !== window) return;
  const css = `#vg-tap{position:fixed;z-index:2147483647;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;border:3px solid #F3DFA6;background:rgba(243,223,166,.3);pointer-events:none;opacity:0}
  #vg-tap.on{animation:vgt 1s ease}@keyframes vgt{0%{opacity:1;transform:scale(.45)}35%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.55)}}
  #vg-hl{position:fixed;z-index:2147483646;pointer-events:none;border:2.5px solid #F3DFA6;border-radius:10px;box-shadow:0 0 0 4000px rgba(2,16,12,.28),0 0 24px rgba(243,223,166,.55);opacity:0;transition:opacity .35s,left .45s cubic-bezier(.22,1,.36,1),top .45s cubic-bezier(.22,1,.36,1),width .45s,height .45s}
  #vg-hl.on{opacity:1}`;
  const mount = () => { if (document.getElementById('vg-tap')) return; const s = document.createElement('style'); s.textContent = css; document.documentElement.appendChild(s);
    ['vg-tap', 'vg-hl'].forEach(id => { const d = document.createElement('div'); d.id = id; document.documentElement.appendChild(d); }); };
  window.__tap = (x, y) => { mount(); const t = document.getElementById('vg-tap'); t.style.left = x + 'px'; t.style.top = y + 'px'; t.classList.remove('on'); void t.offsetWidth; t.classList.add('on'); };
  window.__hl = (r) => { mount(); const h = document.getElementById('vg-hl'); if (!r) { h.classList.remove('on'); return; } const p = 6; Object.assign(h.style, { left: (r.x - p) + 'px', top: (r.y - p) + 'px', width: (r.width + 2 * p) + 'px', height: (r.height + 2 * p) + 'px' }); h.classList.add('on'); };
  document.addEventListener('DOMContentLoaded', mount);
};

(async () => {
  const b = await chromium.launch();
  const vp = PH ? { width: 390, height: 844 } : { width: 1280, height: 720 };
  const raw = path.join(W, 'raw', LANG + '-' + SEG); fs.mkdirSync(raw, { recursive: true });
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: PH, hasTouch: PH, reducedMotion: 'no-preference',
    recordVideo: { dir: raw, size: vp } });
  await ctx.addInitScript(OVERLAY);
  await ctx.addInitScript((l) => { try { if (!sessionStorage.getItem('vg_l')) { localStorage.setItem('ah_lang', l); sessionStorage.setItem('vg_l', 1); } } catch (e) {} }, LANG);
  await ctx.addInitScript(seed);
  await ctx.route(/guide\/kabinet-\w+\.mp4/, r => r.fulfill({ path: path.join(W, 'out', fs.existsSync(path.join(W, 'out', 'uz-phone.sample.webm')) ? 'uz-phone.sample.webm' : 'uz-phone.webm'), contentType: 'video/webm' }));
  const GJ = path.join(W, 'final', 'uz.json');
  if (fs.existsSync(GJ)) { const g = JSON.parse(fs.readFileSync(GJ)); const CHT = S.CH; const o = { dur: g.dur, ch: g.ch.map(c => ({ id: c.id, t: c.t, title: CHT[c.id][LANG] })) };
    await ctx.route(/js\/guide-chapters\.js/, r => r.fulfill({ body: 'window.AH_GUIDE=' + JSON.stringify({ [LANG]: o }) + ';', contentType: 'text/javascript' })); }
  const p = await ctx.newPage();
  const t0 = Date.now(), now = () => (Date.now() - t0) / 1000;
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const w = ms => p.waitForTimeout(ms);
  const loc = async sel => { const l = p.locator(sel).filter({ visible: true }).first(); return (await l.count()) ? l : null; };
  const center = async l => { const bb = await l.boundingBox(); return bb && [bb.x + bb.width / 2, bb.y + bb.height / 2, bb]; };
  const h = {
    page: p,
    wait: w,
    async click(sel, after) { const l = await loc(sel); if (!l) { console.warn('yo\'q:', sel); return; } await l.scrollIntoViewIfNeeded(); await w(200); const c = await center(l); if (c) await p.evaluate(([x, y]) => window.__tap(x, y), c); await w(420); await l.click(); await w(after == null ? 700 : after); },
    async point(sel, ms) { const l = await loc(sel); if (!l) { console.warn('yo\'q:', sel); return; } await l.evaluate(e => e.scrollIntoView({ block: 'nearest', behavior: 'smooth' })); await w(450); const c = await center(l); if (!c) return; await p.evaluate(r => window.__hl(r), c[2]); await w(ms || 1500); await p.evaluate(() => window.__hl(null)); await w(200); },
    async scroll(sel) { const l = await loc(sel); if (l) await l.evaluate(e => e.scrollIntoView({ block: 'center', behavior: 'smooth' })); await w(700); },
    async scrollBy(px) { await p.evaluate(px => { window.scrollBy({ top: px, behavior: 'smooth' }); ['adm', 'mn'].forEach(id => { const e = document.getElementById(id); if (e) e.scrollBy({ top: px, behavior: 'smooth' }); }); }, px); await w(800); },
    async scrollTop() { await p.evaluate(() => { window.scrollTo(0, 0); ['adm', 'mn', 'cmB'].forEach(id => { const e = document.getElementById(id); if (e) e.scrollTop = 0; }); }); await w(200); },
    async type(sel, txt, clear) { const l = await loc(sel); if (!l) { console.warn('yo\'q:', sel); return; } await h.click(sel, 200); if (clear !== false) await l.fill(''); else await l.press('End'); await l.pressSequentially(txt, { delay: 55 }); await w(350); },
    async select(sel, v) { const l = await loc(sel); if (!l) { console.warn('yo\'q:', sel); return; } const c = await center(l); if (c) await p.evaluate(([x, y]) => window.__tap(x, y), c); await w(450); await l.selectOption(v); await w(700); },
    async upload(sel, file) { const l = await loc(sel); if (!l) { console.warn('yo\'q:', sel); return; } await l.scrollIntoViewIfNeeded(); const c = await center(l); if (c) await p.evaluate(([x, y]) => window.__tap(x, y), c); await w(450);
      const [fc] = await Promise.all([p.waitForEvent('filechooser'), l.click()]); await fc.setFiles(file); await w(1300); },
    async go(v) { if (PH) { const open = await p.evaluate(() => document.getElementById('ab').classList.contains('nav-open')); if (!open) await h.click('#sdm', 700); }
      await h.click('#nv [data-v="' + v + '"]', 900); await h.scrollTop(); }
  };
  await p.goto(B + 'index.html?intro=0#home', { waitUntil: 'load' }); await w(1800);
  const beats = [], chapters = [];
  for (let i = 0; i < BEATS.length; i++) {
    const bt = BEATS[i], d = DUR[LANG][SEG][i];
    if (bt.pre) await bt.pre(h); /* sahifa almashishi — ovozdan oldin */
    if (bt.ch) chapters.push({ id: bt.ch, t: now() });
    const ts = now();
    beats.push({ i, t: ts, dur: d, text: bt.s[LANG] });
    if (bt.do) await bt.do(h);
    const left = d - (now() - ts);
    await w(Math.max(450, left * 1000 + 450));
  }
  await w(1200);
  const tEnd = now(), v = p.video(); await p.close(); await ctx.close(); await b.close();
  const vp0 = await v.path(), out = path.join(W, 'out'); fs.mkdirSync(out, { recursive: true });
  const dst = path.join(out, LANG + '-' + SEG + '.webm'); fs.renameSync(vp0, dst);
  const vd = parseFloat(execSync('ffprobe -v error -show_entries format=duration -of csv=p=0 "' + dst + '"').toString()) || tEnd;
  const off = Math.max(0, vd - tEnd); /* video yozuvi sahifa ochilishidan biroz oldin boshlanadi */
  beats.forEach(x => x.t = +(x.t + off).toFixed(3)); chapters.forEach(x => x.t = +(x.t + off).toFixed(3));
  fs.writeFileSync(path.join(out, LANG + '-' + SEG + '.json'), JSON.stringify({ lang: LANG, seg: SEG, dur: vd, off, beats, chapters }, null, 1));
  console.log(LANG, SEG, 'video', vd.toFixed(1) + 's', 'offset', off.toFixed(2), errs.length ? 'ERR ' + errs.join(' | ') : 'ok');
})();
