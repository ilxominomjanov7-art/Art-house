/* =====================================================================
   ART HOUSE — server (Node.js 18+, tashqi kutubxonalarsiz)
   • Saytni tarqatadi (index.html, kabinet.html, css, js, assets)
   • REST API: izohlar, arizalar, qo'ng'iroqlar, sozlamalar, video va rasm fayllar
   • /api/cms: kabinet → Sozlamalar va Mavzular (bo'limlar, matnlar, ranglar) — barcha qurilmalar uchun
   • SSE (/api/events): kabinetdagi javob va mavzu o'zgarishlari saytda DARHOL ko'rinadi
   • WebRTC signal (/api/signal): mijoz ↔ menejer video-qo'ng'iroqlari
   Ishga tushirish:  node server/server.js   (PORT=8080 standart)
   ===================================================================== */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const MEDIA = path.join(DATA, 'media');
const DB_FILE = path.join(DATA, 'db.json');
const PORT = +process.env.PORT || 8080;
const MAX_JSON = 64 * 1024;
const MAX_MEDIA = 50 * 1024 * 1024;
const MAX_CMS = 4 * 1024 * 1024;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || ''; // sayt boshqa domenda bo'lsa: 'https://arthouse.uz'

fs.mkdirSync(MEDIA, { recursive: true });

/* ---------- kirish ma'lumotlari: js/config.js dagi CFG.ADMINS ---------- */
function loadAdmins() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8'), sandbox, { timeout: 1000 });
  return sandbox.window.CFG.ADMINS || {}; // { 'pbkdf2(login:parol)': 'owner' | 'manager' }
}
const ADMINS = loadAdmins();
const sessions = new Map(); // token → { role, user, exp }

/* ---------- ma'lumotlar bazasi (JSON fayl) ---------- */
let db = { reviews: [], leads: [], calls: [], settings: {}, cms: {}, crm: { days: {}, leads: [], exp: [], chats: [], calls: [], inv: {} } };
try { db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))); } catch (e) { /* birinchi ishga tushirish */ }
db.crm = Object.assign({ days: {}, leads: [], exp: [], chats: [], calls: [], inv: {} }, db.crm || {});
let saveT = null;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => { const tmp = DB_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(db)); fs.renameSync(tmp, DB_FILE); }, 200);
}

/* ---------- SSE ---------- */
const clients = new Set();
function broadcast(obj) { const s = 'data: ' + JSON.stringify(obj) + '\n\n'; clients.forEach(res => res.write(s)); }
setInterval(() => clients.forEach(res => res.write(': ping\n\n')), 25000);

/* ---------- yordamchilar ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };
const uid = () => Date.now().toString(36) + crypto.randomBytes(4).toString('hex');
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
function send(res, code, body, headers) {
  const h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers || {});
  res.writeHead(code, h); res.end(body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body));
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', c => { size += c.length; if (size > limit) { reject(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function json(req) { try { return JSON.parse((await readBody(req, MAX_JSON)).toString('utf8') || '{}'); } catch (e) { throw Object.assign(new Error('bad json'), { code: e.code || 400 }); } }
function auth(req) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || ''); if (!m) return null;
  const s = sessions.get(m[1]); if (!s || s.exp < Date.now()) { sessions.delete(m && m[1]); return null; }
  s.exp = Date.now() + 12 * 3600e3; return s;
}
/* Oddiy cheklov: bir IP dan daqiqasiga 40 ta yozish so'rovi */
const hits = new Map();
function limited(req) {
  const ip = req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : req.socket.remoteAddress;
  const now = Date.now(), h = (hits.get(ip) || []).filter(x => now - x < 60000); h.push(now); hits.set(ip, h);
  return h.length > 40;
}
setInterval(() => { const now = Date.now(); hits.forEach((v, k) => { if (!v.some(x => now - x < 60000)) hits.delete(k); }); }, 60000);

/* ---------- kiruvchi ma'lumotni tozalash ---------- */
const PROJECT_IDS = ['musaffo', 'kokcha', 'obod'];
const clean = {
  reviews(b) {
    const rating = Math.max(1, Math.min(5, Math.round(+b.rating || 0)));
    const link = /^https:\/\/\S+$/.test(b.link || '') ? str(b.link, 400) : '';
    const video = /^\/media\/[\w.-]+$/.test(b.video || '') ? b.video : '';
    if (str(b.name, 60).length < 2 || str(b.text, 1200).length < 10) return null;
    return { name: str(b.name, 60), rating, project: PROJECT_IDS.includes(b.project) ? b.project : '', text: str(b.text, 1200), video, link, hidden: false, reply: null, lang: str(b.lang, 4) };
  },
  leads(b) {
    if (str(b.name, 60).length < 2 || str(b.phone, 20).replace(/\D/g, '').length < 12) return null;
    const o = { src: ['book', 'callback', 'call'].includes(b.src) ? b.src : 'book', name: str(b.name, 60), phone: str(b.phone, 20), st: 'new', lang: str(b.lang, 4),
      project: PROJECT_IDS.includes(b.project) ? b.project : '', plan: str(b.plan, 80), topic: str(b.topic, 120), when: ['asap', 'day', 'eve'].includes(b.when) ? b.when : '' };
    ['area', 'price', 'pct', 'down', 'months', 'monthly'].forEach(k => { if (b[k] != null && isFinite(+b[k])) o[k] = +b[k]; });
    return o;
  },
  calls(b) { return { name: str(b.name, 60), phone: str(b.phone, 20), video: !!b.video, st: 'ringing', lang: str(b.lang, 4) }; }
};
const ADMIN_PATCH = { reviews: ['hidden', 'reply'], calls: ['st', 'dur'] };
const PUBLIC_PATCH = { calls: ['st', 'dur'] }; // mijoz o'z qo'ng'irog'i holatini yangilaydi

/* ---------- API ---------- */
async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean); // ['api', kind, id]
  const kind = parts[1], id = parts[2] && decodeURIComponent(parts[2]), me = auth(req);
  const write = req.method !== 'GET';
  if (write && kind !== 'events' && limited(req)) return send(res, 429, { error: 'rate' });

  if (kind === 'events' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 3000\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
  }
  if (kind === 'signal' && req.method === 'POST') {
    const b = await json(req);
    if (!b || typeof b.room !== 'string' || !['offer', 'answer', 'ice', 'bye', 'cancel', 'decline'].includes(b.type)) return send(res, 400, { error: 'bad' });
    if (b.role === 'manager' && !me) return send(res, 401, { error: 'auth' });
    broadcast({ t: 'signal', msg: { room: str(b.room, 40), type: b.type, data: b.data, role: b.role === 'manager' ? 'manager' : 'client', from: str(b.from, 40) } });
    return send(res, 204);
  }
  if (kind === 'translate' && req.method === 'POST') { if (!me) return send(res, 401, { error: 'auth' }); return translate(req, res); }
  if (kind === 'media' && req.method === 'POST') {
    const type = String(req.headers['content-type'] || '').split(';')[0];
    const ext = { 'video/webm': '.webm', 'video/mp4': '.mp4', 'video/quicktime': '.mov', 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }[type];
    if (!ext) return send(res, 415, { error: 'type' });
    if (type.indexOf('image/') === 0 && !me) return send(res, 401, { error: 'auth' }); // rasmlarni faqat kabinet yuklaydi
    const buf = await readBody(req, MAX_MEDIA), name = uid() + ext;
    fs.writeFileSync(path.join(MEDIA, name), buf);
    return send(res, 200, { url: '/media/' + name });
  }
  /* sayt sozlamalari va mavzular: o'qish — hamma uchun, yozish — kabinetga kirganlar uchun */
  if (kind === 'cms' && !id) {
    if (req.method === 'GET') return send(res, 200, db.cms || {});
    if (req.method !== 'PUT') return send(res, 405, { error: 'method' });
    if (!me) return send(res, 401, { error: 'auth' });
    let b; try { b = JSON.parse((await readBody(req, MAX_CMS)).toString('utf8')); } catch (e) { return send(res, e.code === 413 ? 413 : 400, { error: e.code === 413 ? 'too large' : 'bad json' }); }
    if (!b || typeof b !== 'object' || Array.isArray(b)) return send(res, 400, { error: 'bad' });
    b.v = Math.max(+b.v || 0, ((db.cms || {}).v || 0) + 1);
    db.cms = b; save();
    broadcast({ t: 'change', kind: 'cms', info: { v: b.v } });
    return send(res, 200, { v: b.v });
  }
  if (!['reviews', 'calls'].includes(kind)) return send(res, 404, { error: 'not found' });

  const rows = db[kind];
  if (req.method === 'GET' && !id) {
    if (kind === 'reviews') return send(res, 200, me ? rows : rows.filter(r => !r.hidden));
    if (!me) return send(res, 401, { error: 'auth' });
    return send(res, 200, rows);
  }
  if (req.method === 'POST' && !id) {
    const b = await json(req), o = clean[kind](b);
    if (!o) return send(res, 400, { error: 'invalid' });
    o.id = kind === 'calls' && /^[\w-]{6,40}$/.test(b.id || '') ? b.id : uid(); o.at = Date.now();
    rows.unshift(o); db[kind] = rows.slice(0, 5000); save();
    broadcast({ t: 'change', kind, info: { op: 'add', id: o.id } });
    return send(res, 201, o);
  }
  const row = rows.find(r => r.id === id);
  if (!row) return send(res, 404, { error: 'not found' });
  if (req.method === 'PATCH') {
    const b = await json(req), allowed = me ? ADMIN_PATCH[kind] : PUBLIC_PATCH[kind];
    if (!allowed) return send(res, 401, { error: 'auth' });
    allowed.forEach(k => {
      if (!(k in b)) return;
      if (k === 'reply') row.reply = b.reply && b.reply.text ? { text: str(b.reply.text, 1200), at: Date.now(), by: str(b.reply.by, 40) } : null;
      else if (k === 'hidden') row.hidden = !!b.hidden;
      else if (k === 'st') row.st = str(b.st, 12);
      else if (k === 'dur') row.dur = Math.max(0, Math.min(86400, +b.dur || 0));
    });
    save(); broadcast({ t: 'change', kind, info: { op: 'update', id } });
    return send(res, 204);
  }
  if (req.method === 'DELETE') {
    if (!me || me.role !== 'owner') return send(res, 403, { error: 'owner' });
    db[kind] = rows.filter(r => r.id !== id);
    if (kind === 'reviews' && row.video) fs.rm(path.join(MEDIA, path.basename(row.video)), () => {});
    save(); broadcast({ t: 'change', kind, info: { op: 'remove', id } });
    return send(res, 204);
  }
  return send(res, 405, { error: 'method' });
}

/* ---------- statik fayllar (video uchun Range qo'llab-quvvatlanadi) ---------- */
function serveFile(req, res, file) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const cache = /\.(html)$/.test(file) ? 'no-cache' : 'public, max-age=604800';
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (range) {
      const start = range[1] ? +range[1] : 0, end = range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
      if (start > end) return send(res, 416, '', { 'Content-Range': 'bytes */' + st.size });
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': cache });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': cache, 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

/* ---------- kabinet (CRM) API — eski kabinet bilan bir xil protokol ---------- */
const dk = t => new Date(t + 5 * 36e5).toISOString().slice(0, 10);
async function tgSend(text) {
  const token = process.env.TG_BOT_TOKEN, chat = process.env.TG_CHAT_ID || '-1004375647097';
  if (!token) return false;
  try { const r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text: String(text).slice(0, 4000) }) }); return r.ok; } catch (e) { return false; }
}
const mergeById = (arr, items) => { (items || []).forEach(x => { if (!x || !x.id) return; const i = arr.findIndex(y => y.id === x.id); if (i > -1) arr[i] = Object.assign(arr[i], x); else arr.unshift(x); }); return arr; };
async function crm(req, res, p) {
  const me = auth(req), C = db.crm;
  if (req.method !== 'GET' && limited(req)) return send(res, 429, { error: 'rate' });
  if (p === '/login' && req.method === 'POST') {
    const h = (await readBody(req, 256)).toString('utf8').trim(), role = ADMINS[h];
    await new Promise(r => setTimeout(r, 400));
    if (!/^[0-9a-f]{64}$/.test(h) || !role) return send(res, 401, { error: 'auth' });
    const token = crypto.randomBytes(24).toString('hex'); sessions.set(token, { role, user: '', exp: Date.now() + 12 * 3600e3 });
    return send(res, 200, { t: token, r: role });
  }
  if (p === '/settings' && req.method === 'GET') return send(res, 200, db.settings || {});
  if (p === '/patches' && req.method === 'GET') return send(res, 200, []);
  if (p === '/track' && req.method === 'POST') {
    let b = {}; try { b = JSON.parse((await readBody(req, 2048)).toString('utf8')); } catch (e) {}
    const e = ['v', 'pv', 'c', 'l'].includes(b.e) ? b.e : null; if (!e) return send(res, 204);
    const d = C.days[dk(Date.now())] || (C.days[dk(Date.now())] = { v: 0, pv: 0, c: 0, l: 0 }); d[e] = (d[e] || 0) + 1; save(); return send(res, 204);
  }
  if (p === '/lead' && req.method === 'POST') {
    const b = await json(req), l = b.lead || {};
    if (str(l.name, 80).length < 2 || str(l.phone, 25).replace(/\D/g, '').length < 9) return send(res, 400, { error: 'invalid' });
    const o = { id: /^[\w-]{4,40}$/.test(l.id || '') ? l.id : uid(), name: str(l.name, 80), phone: str(l.phone, 25), unit: str(l.unit, 120), area: +l.area || 0, slot: str(l.slot, 60),
      price: +l.price || 0, down: +l.down || 0, pct: +l.pct || 0, months: +l.months || 0, monthly: +l.monthly || 0, st: 'new', at: Date.now(), src: str(l.src, 12), project: str(l.project, 20), lang: str(l.lang, 4) };
    mergeById(C.leads, [o]); C.leads = C.leads.slice(0, 5000);
    const d = C.days[dk(Date.now())] || (C.days[dk(Date.now())] = { v: 0, pv: 0, c: 0, l: 0 }); d.l = (d.l || 0) + 1;
    save(); broadcast({ t: 'change', kind: 'crm', info: { op: 'lead', id: o.id } }); tgSend(b.text || ('Yangi ariza: ' + o.name + ' ' + o.phone));
    return send(res, 200, { ok: 1 });
  }
  if (p === '/chat' && req.method === 'POST') {
    const c = await json(req); if (!c || !/^[\w-]{3,60}$/.test(c.id || '')) return send(res, 400, { error: 'bad' });
    c.msgs = (Array.isArray(c.msgs) ? c.msgs : []).slice(-60).map(m => ({ r: m.r === 'u' ? 'u' : 'a', t: str(m.t, 700), at: +m.at || Date.now(), v: m.v ? 1 : undefined, vk: m.vk ? str(m.vk, 40) : undefined, dur: +m.dur || undefined }));
    ['name', 'phone', 'unit', 'lang'].forEach(k => { if (c[k] != null) c[k] = str(c[k], 120); });
    const i = C.chats.findIndex(x => x.id === c.id); if (i > -1) C.chats[i] = c; else C.chats.unshift(c); C.chats = C.chats.slice(0, 2000);
    save(); broadcast({ t: 'change', kind: 'crm', info: { op: 'chat', id: c.id } }); return send(res, 204);
  }
  if (p === '/stats' && req.method === 'GET') { if (!me) return send(res, 401, { error: 'auth' }); return send(res, 200, C); }
  if (p === '/save' && req.method === 'POST') {
    if (!me) return send(res, 401, { error: 'auth' });
    const b = await json(req), owner = me.role === 'owner';
    if (b.leads) mergeById(C.leads, b.leads);
    if (b.delLeads && owner) C.leads = C.leads.filter(x => !b.delLeads.includes(x.id));
    if (b.exp && owner) mergeById(C.exp, b.exp);
    if (b.delExp && owner) C.exp = C.exp.filter(x => !b.delExp.includes(x.id));
    if (b.inv && owner) C.inv = b.inv;
    if (b.delChats && owner) C.chats = C.chats.filter(x => !b.delChats.includes(x.id));
    if (b.delCalls && owner) C.calls = C.calls.filter(x => !b.delCalls.includes(x.id));
    if (b.settings && owner) { db.settings = { p: +b.settings.p || 1100, d: +b.settings.d || 0, m: (b.settings.m || []).map(Number).filter(n => n > 0 && n <= 120).slice(0, 10) }; broadcast({ t: 'change', kind: 'settings' }); }
    save(); return send(res, 204);
  }
  if (p === '/ai' && req.method === 'POST') return ai(req, res, me);
  if (['/sms', '/stt', '/voice'].includes(p)) return send(res, 501, { error: 'not configured' });
  return send(res, 404, { error: 'not found' });
}

/* ---------- AI maslahatchi: Claude (ANTHROPIC_API_KEY bo'lsa) ---------- */
const SYS_PUBLIC = `Siz — "Art House" quruvchi kompaniyasining (Toshkent) saytidagi shaxsiy sotuv maslahatchisiz. Tajribali, iliq va muloyim menejer kabi yozing — robot kabi emas.
FAKTLAR (faqat shulardan foydalaning): Art House Qurilish Kompaniyasi — ${new Date().getFullYear() - 2012} yillik tajriba, 30+ loyiha, biznes-klass turar-joy majmualari; Instagram @arthouse.tashkent (114K obunachi); tel +998712307447; Telegram t.me/arthouse_toshkent; savdo ofisi: Uchtepa tumani, Ko'kcha Darvoza ko'chasi 69.
Loyihalar: Musaffo (Yunusobod, biznes-klass, 1293 avtoturargoh, har podyezdda 2 lift, ta'mirlangan xonadonlar ham bor), Obod Maskan (Ko'kcha Oqtepa hududi, shahar markaziga yaqin), Ko'kcha Oqtepa (Uchtepa).
To'lov: quruvchidan to'g'ridan-to'g'ri, 0% foizsiz bo'lib to'lash; boshlang'ich to'lov kamida {d}%; muddatlar: {m} oy; Musaffo 1 m² ≈ {p}$. Oylik = (narx − boshlang'ich) / oylar. Rasmiy shartnoma, to'lovlar faqat kompaniya hisobiga.
USLUB: mijoz tilida javob bering (til kodi: {lang}). Qisqa (2–5 jumla), aniq raqamlar bilan. Bir gapni takrorlamang — mijozning so'zi o'zgarsa, javobingiz ham o'zgarsin. "Ishonchlimi?" desa — "Ha" deb faktlar bilan javob bering va obyektga tashrif taklif qiling. Jahli chiqsa — avval chin dildan uzr so'rang, tushunganingizni bildiring, keyin yechim taklif qiling. Ikkilansa — oddiy qadamlar bilan yo'naltiring. Emoji ishlatmang.
MAQSAD: suhbat tabiiy kechganda mijozning ismini, keyin telefon raqamini so'rang (ikkalasini bir xabarda emas, majburlamang) va nimaga qiziqayotganini (loyiha, xonalar, byudjet, muddat) aniqlang — bu menejerga topshiriladi.
CHEGARALAR: bilmagan narsani o'ylab topmang ("buni menejerimiz aniqlab beradi" deng), chegirma yoki kafolat va'da qilmang, mavzudan tashqari savollarni muloyimlik bilan xonadon mavzusiga qaytaring. AI ekanligingiz so'ralsa — rostini ayting.`;
let Anthropic = null;
async function ai(req, res, me) {
  const b = await json(req);
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) return send(res, 200, { text: '' }); // sayt o'z qoidalari bilan javob beradi
  try {
    if (!Anthropic) Anthropic = (await import('@anthropic-ai/sdk')).default;
  } catch (e) { return send(res, 200, { text: '' }); }
  const client = new Anthropic(), s = db.settings || {}, cfg = b.cfg || {};
  const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-14).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: str(m.content, 1200) || '…' }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length) return send(res, 400, { error: 'empty' });
  const system = b.mode === 'public'
    ? SYS_PUBLIC.replace('{d}', s.d || cfg.d || 30).replace('{m}', (s.m || cfg.m || [12, 18, 24, 36]).join(', ')).replace('{p}', s.p || cfg.p || 1100).replace('{lang}', str(b.lang, 4) || 'uz')
      + (b.ctx ? '\nKONTEKST: ' + JSON.stringify(b.ctx).slice(0, 3000) : '')
    : (me ? str(b.system, 8000) + (b.ctx ? '\nKONTEKST: ' + JSON.stringify(b.ctx).slice(0, 30000) : '') : null);
  if (!system) return send(res, 401, { error: 'auth' });
  try {
    const r = await client.beta.messages.create({
      model: process.env.AI_MODEL || 'claude-opus-5-5',
      max_tokens: 1500,
      output_config: { effort: 'low' },               // suhbat uchun tez va qisqa javob
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',                           // xavfsizlik rad etsa — server o'zi zaxira modelga o'tadi
      system,
      messages: msgs
    });
    if (r.stop_reason === 'refusal') return send(res, 200, { text: '' });
    const text = r.content.filter(x => x.type === 'text').map(x => x.text).join('\n').trim();
    return send(res, 200, { text });
  } catch (e) {
    console.error('AI xatosi:', e && (e.status || '') + ' ' + (e.message || e));
    return send(res, 200, { text: '' });
  }
}

/* ---------- AI tarjima: kabinetda yangi til qo'shilganda sayt matnlari, Reels subtitrlari va yulduzlar yozuvlari
   (POST /api/translate { to, name, items: { kalit: matn } } → { items: { kalit: tarjima } }; ANTHROPIC_API_KEY kerak) ---------- */
const TR_SCHEMA = { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { k: { type: 'string' }, v: { type: 'string' } }, required: ['k', 'v'], additionalProperties: false } } }, required: ['items'], additionalProperties: false };
const TR_SYS = `You localize the website and dashboard of Art House, a premium residential developer in Tashkent, Uzbekistan.
Translate every "v" into the target language and return each item with its "k" unchanged.
Keep exactly as written: brand and project names (Art House, Musaffo, Obod Maskan, Ko'kcha-Oqtepa, High Town, Siti Mall), social network names, @handles, URLs, placeholders in braces such as {years} {n} {months}, numbers, %, $ and any HTML tags.
Write natural, concise marketing language a native speaker would use; subtitles of spoken video stay conversational and short.`;
async function translate(req, res) {
  const b = await json(req), to = str(b.to, 16), name = str(b.name, 40) || to, src = b.items && typeof b.items === 'object' ? b.items : {};
  const keys = Object.keys(src).filter(k => typeof src[k] === 'string' && src[k].trim()).slice(0, 150);
  if (!/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/i.test(to) || !keys.length) return send(res, 400, { error: 'bad' });
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) return send(res, 503, { error: 'ai-off' });
  try { if (!Anthropic) Anthropic = (await import('@anthropic-ai/sdk')).default; } catch (e) { return send(res, 503, { error: 'ai-off' }); }
  try {
    const r = await new Anthropic().beta.messages.create({
      model: process.env.AI_MODEL || 'claude-opus-5-5',
      max_tokens: 16000,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: TR_SCHEMA } }, // oddiy tarjima — past effort, javob faqat JSON
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: TR_SYS,
      messages: [{ role: 'user', content: 'Target language: ' + name + ' (' + to + ')\n' + JSON.stringify(keys.map(k => ({ k, v: str(src[k], 3000) }))) }]
    });
    if (r.stop_reason === 'refusal') return send(res, 502, { error: 'refusal' });
    if (r.stop_reason === 'max_tokens') return send(res, 502, { error: 'too-long' });
    const out = {}, known = new Set(keys);
    (JSON.parse(r.content.filter(x => x.type === 'text').map(x => x.text).join('')).items || []).forEach(x => { if (x && known.has(x.k) && typeof x.v === 'string') out[x.k] = x.v.slice(0, 6000); });
    return send(res, 200, { items: out });
  } catch (e) {
    console.error('Tarjima xatosi:', e && (e.status || '') + ' ' + (e.message || e));
    return send(res, 502, { error: 'ai' });
  }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (ALLOW_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return send(res, 204);
  }
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (/^\/(login|stats|save|lead|chat|track|settings|patches|ai|sms|stt|voice)$/.test(url.pathname)) return await crm(req, res, url.pathname);
    if (url.pathname.startsWith('/media/')) return serveFile(req, res, path.join(MEDIA, path.basename(url.pathname)));
    let p = decodeURIComponent(url.pathname); if (p === '/') p = '/index.html';
    const file = path.resolve(ROOT, '.' + p);
    if (!file.startsWith(ROOT + path.sep) || /[\\/](server|data|\.git|node_modules)([\\/]|$)/.test(file.slice(ROOT.length))) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
    serveFile(req, res, file);
  } catch (e) {
    if (!res.headersSent) send(res, e.code === 413 ? 413 : e.code === 400 ? 400 : 500, { error: e.message });
  }
}).listen(PORT, () => console.log('ART HOUSE server: http://localhost:' + PORT));
