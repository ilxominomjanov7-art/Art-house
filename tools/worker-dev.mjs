/* Worker v4 ni kompyuterda sinash (Cloudflare'siz): KV — xotirada.
   node tools/worker-dev.mjs  → http://localhost:8787 ; muhit: ADMINS, ALLOWED_ORIGIN, BOT_TOKEN, CHAT_ID, ANTHROPIC_API_KEY */
import http from 'node:http';
import W from '../server/worker.js';
const store = new Map();
const AH = {
  async get(k, t) { const v = store.get(k); if (!v || (v.exp && v.exp < Date.now())) return null; if (t === 'json') return JSON.parse(v.v); if (t === 'arrayBuffer') return v.v; return typeof v.v === 'string' ? v.v : null; },
  async put(k, v, o) { store.set(k, { v, meta: o && o.metadata, exp: o && o.expirationTtl ? Date.now() + o.expirationTtl * 1000 : 0 }); },
  async delete(k) { store.delete(k); },
  async getWithMetadata(k, t) { const v = store.get(k); return v ? { value: t === 'arrayBuffer' ? v.v : v.v, metadata: v.meta } : { value: null, metadata: null }; }
};
const env = Object.assign({ AH }, process.env);
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const b = Buffer.concat(chunks);
  const r = new Request('http://localhost:8787' + req.url, { method: req.method, headers: Object.assign({}, req.headers, { 'cf-connecting-ip': req.socket.remoteAddress }), body: ['GET', 'HEAD'].includes(req.method) ? undefined : b });
  const out = await W.fetch(r, env);
  res.writeHead(out.status, Object.fromEntries(out.headers));
  if (!out.body) return res.end();
  const rd = out.body.getReader(); for (;;) { const { done, value } = await rd.read(); if (done) break; res.write(value); } res.end();
}).listen(8787, () => console.log('worker-dev: http://localhost:8787'));
