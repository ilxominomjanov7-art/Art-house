/* =====================================================================
   ART HOUSE — saytdan kabinetga: arizalar, tashrif statistikasi, AI suhbatlar
   Ma'lumotlar kabinet bilan bir xil formatda saqlanadi:
   ah_stats {days:{sana:{v,pv,c,l}}, leads:[...]}, ah_chats [...]
   Server (CFG.API_URL) bo'lsa: /lead, /track, /chat orqali barcha qurilmalarga.
   ===================================================================== */
(function () {
  'use strict';
  var API = (CFG.API_URL || '').replace(/\/$/, '');
  if (API === 'auto') API = location.protocol.indexOf('http') === 0 ? location.origin : '';
  function LS(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  var dk = function (t) { return new Date(t + 5 * 36e5).toISOString().slice(0, 10); }, D0 = function () { return dk(Date.now()); };
  var vid = LS('ah_vid') || (LS('ah_vid', Math.random().toString(36).slice(2)), LS('ah_vid'));
  var nfm = function (x) { return Math.round(x).toLocaleString('en-US') + ' $'; };

  function local(e) {
    var s = LS('ah_stats') || { days: {}, leads: [] }; s.days = s.days || {}; s.leads = s.leads || [];
    var d = s.days[D0()] || (s.days[D0()] = { v: 0, pv: 0, c: 0, l: 0 }); d[e] = (d[e] || 0) + 1; LS('ah_stats', s);
  }
  function track(e) {
    local(e);
    if (API) try { navigator.sendBeacon(API + '/track', new Blob([JSON.stringify({ e: e, vid: vid })], { type: 'text/plain' })); } catch (x) {}
  }
  function msgOf(l) {
    return ['🏢 Yangi ariza: Art House', l.src === 'ai' ? '🤖 Art House.ai orqali' : l.src === 'callback' ? "📞 Qayta qo'ng'iroq so'rovi" : '', '',
      '👤 Mijoz: ' + l.name, '📞 Tel: ' + l.phone, '', '🏠 Xonadon: ' + (l.unit || '—'), l.area ? '📐 Maydon: ' + l.area + ' m²' : '',
      l.price ? '💰 Umumiy narxi: ' + nfm(l.price) : '', l.down ? "💵 Boshlang'ich to'lov: " + nfm(l.down) + ' (' + l.pct + '%)' : '',
      l.months && l.monthly ? '📅 Muddati: ' + l.months + " oy (0%)\n💳 Oylik to'lov: " + nfm(l.monthly) : '', l.slot ? "⏰ Qo'ng'iroq: " + l.slot : '']
      .filter(function (x, i, a) { return x !== '' || a[i - 1] !== ''; }).join('\n');
  }
  function send(l) {
    if (!API) return Promise.resolve(true);
    return fetch(API + '/lead', { method: 'POST', keepalive: true, body: JSON.stringify({ lead: l, text: msgOf(l) }) }).then(function (r) { if (!r.ok) throw 0; return true; });
  }
  /* Ariza: kabinet → Mijozlar bazasi (+ server bo'lsa Telegram guruhga) */
  function deliver(l) {
    l = Object.assign({ id: (l.src === 'ai' ? 'a' : 's') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), st: 'new', at: Date.now() }, l);
    var s = LS('ah_stats') || { days: {}, leads: [] }; s.leads = s.leads || []; s.leads.unshift(l); s.leads = s.leads.slice(0, 500); LS('ah_stats', s);
    local('l');
    return send(l).catch(function () { var q = (LS('ah_q') || []).slice(-19); q.push(l); LS('ah_q', q); return false; });
  }
  function flush() {
    var q = LS('ah_q') || []; if (!q.length || !API) return; LS('ah_q', []);
    q.forEach(function (l) { send(l).catch(function () { var r = LS('ah_q') || []; r.push(l); LS('ah_q', r); }); });
  }
  addEventListener('online', flush); flush();

  /* AI suhbat jurnali: kabinet → Xabarlar → Sayt xabarlari */
  function csid() { return 'c' + vid + '_' + D0(); }
  function chatLog(r, t, extra, ctx) {
    var sid = csid(), a = LS('ah_chats') || [], c = a.filter(function (x) { return x.id === sid; })[0];
    if (!c) { c = { id: sid, msgs: [], at: Date.now() }; a.unshift(c); }
    c.msgs.push(Object.assign({ r: r, t: String(t).slice(0, 700), at: Date.now() }, extra || {}));
    c.msgs = c.msgs.slice(-60); c.up = Date.now();
    ctx = ctx || {};
    if (ctx.name) c.name = ctx.name; if (ctx.phone) c.phone = ctx.phone;
    if (ctx.u) { c.unit = ctx.u.u; c.area = ctx.u.a; }
    if (ctx.B) c.B = ctx.B; if (ctx.M) c.M = ctx.M; if (ctx.R) c.R = ctx.R; if (ctx.lang) c.lang = ctx.lang;
    LS('ah_chats', a.slice(0, 200));
    if (API) fetch(API + '/chat', { method: 'POST', keepalive: true, body: JSON.stringify(c) }).catch(function () {});
  }
  /* ovozli xabar (kabinetda tinglash uchun, kichik hajmda) */
  function saveVoice(key, blob) {
    try { if (blob.size > 350000) return; var r = new FileReader(); r.onload = function () { try { var m = LS('ah_voice') || {}; m[key] = r.result; var ks = Object.keys(m); while (ks.length > 10) delete m[ks.shift()]; LS('ah_voice', m); } catch (e) {} }; r.readAsDataURL(blob); } catch (e) {}
  }

  if (LS('ah_day') !== D0()) { LS('ah_day', D0()); track('v'); }
  track('pv');

  window.CRM = { api: API, track: track, deliver: deliver, chatLog: chatLog, saveVoice: saveVoice, csid: csid, vid: vid };
})();
