/* =====================================================================
   ART HOUSE — server (Node.js 18+, tashqi kutubxonalarsiz)
   • Saytni tarqatadi (index.html, kabinet.html, css, js, assets)
   • REST API: izohlar, arizalar, qo'ng'iroqlar, sozlamalar, video fayllar
   • SSE (/api/events): kabinetdagi javob saytda DARHOL ko'rinadi
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
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || ''; // sayt boshqa domenda bo'lsa: 'https://arthouse.uz'

fs.mkdirSync(MEDIA, { recursive: true });

/* ---------- kirish ma'lumotlari: js/config.js dagi CFG.ADMINS ---------- */
function loadAdmins() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8'), sandbox, { timeout: 1000 });
  return sandbox.window.CFG.ADMINS || {};
}
const ADMINS = loadAdmins();
const sessions = new Map(); // token → { role, user, exp }

/* ---------- ma'lumotlar bazasi (JSON fayl) ---------- */
let db = { reviews: [], leads: [], calls: [], settings: {} };
try { db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))); } catch (e) { /* birinchi ishga tushirish */ }
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
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };
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
const ADMIN_PATCH = { reviews: ['hidden', 'reply'], leads: ['st'], calls: ['st', 'dur'] };
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
  if (kind === 'login' && req.method === 'POST') {
    const b = await json(req), user = str(b.login, 40).toLowerCase(), acc = ADMINS[user];
    const hash = crypto.pbkdf2Sync(String(b.password || ''), 'arthouse.v3:' + user, 150000, 32, 'sha256').toString('hex');
    if (!acc || !crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(String(acc.hash).padEnd(64, '0').slice(0, 64)))) { await new Promise(r => setTimeout(r, 600)); return send(res, 401, { error: 'auth' }); }
    const token = crypto.randomBytes(24).toString('hex'); sessions.set(token, { role: acc.role, user, exp: Date.now() + 12 * 3600e3 });
    return send(res, 200, { token, role: acc.role });
  }
  if (kind === 'signal' && req.method === 'POST') {
    const b = await json(req);
    if (!b || typeof b.room !== 'string' || !['offer', 'answer', 'ice', 'bye', 'cancel', 'decline'].includes(b.type)) return send(res, 400, { error: 'bad' });
    if (b.role === 'manager' && !me) return send(res, 401, { error: 'auth' });
    broadcast({ t: 'signal', msg: { room: str(b.room, 40), type: b.type, data: b.data, role: b.role === 'manager' ? 'manager' : 'client', from: str(b.from, 40) } });
    return send(res, 204);
  }
  if (kind === 'settings') {
    if (req.method === 'GET') return send(res, 200, db.settings || {});
    if (req.method === 'PUT') { if (!me || me.role !== 'owner') return send(res, 403, { error: 'owner' }); db.settings = await json(req); save(); broadcast({ t: 'change', kind: 'settings' }); return send(res, 204); }
  }
  if (kind === 'media' && req.method === 'POST') {
    const type = String(req.headers['content-type'] || '').split(';')[0];
    const ext = { 'video/webm': '.webm', 'video/mp4': '.mp4', 'video/quicktime': '.mov' }[type];
    if (!ext) return send(res, 415, { error: 'type' });
    const buf = await readBody(req, MAX_MEDIA), name = uid() + ext;
    fs.writeFileSync(path.join(MEDIA, name), buf);
    return send(res, 200, { url: '/media/' + name });
  }
  if (!['reviews', 'leads', 'calls'].includes(kind)) return send(res, 404, { error: 'not found' });

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
    if (url.pathname.startsWith('/media/')) return serveFile(req, res, path.join(MEDIA, path.basename(url.pathname)));
    let p = decodeURIComponent(url.pathname); if (p === '/') p = '/index.html';
    const file = path.resolve(ROOT, '.' + p);
    if (!file.startsWith(ROOT + path.sep) || /[\\/](server|data|\.git|node_modules)([\\/]|$)/.test(file.slice(ROOT.length))) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
    serveFile(req, res, file);
  } catch (e) {
    if (!res.headersSent) send(res, e.code === 413 ? 413 : e.code === 400 ? 400 : 500, { error: e.message });
  }
}).listen(PORT, () => console.log('ART HOUSE server: http://localhost:' + PORT));
