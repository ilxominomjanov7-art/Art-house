/* =====================================================================
   ART HOUSE — SAYT BOSHQARUVI (CMS) · 1/3
   Kabinet → Sozlamalar'da saqlangan o'zgarishlar (localStorage 'ah_cms')
   sahifa chizilishidan OLDIN qo'llanadi: aloqa, raqamlar, ranglar,
   loyihalar, rasm va videolar. Kodga tegish shart emas.
   Rasm manbalari: 'base:<maydon>:<n>' — asl rasm, 'idb:…' — kabinetdan yuklangan,
   'data:…' / 'https://…' / 'media/…' — to'g'ridan-to'g'ri manzil.
   ===================================================================== */
(function () {
  'use strict';
  var C = null;
  try { C = JSON.parse(localStorage.getItem('ah_cms') || 'null'); } catch (e) {}
  /* kabinet → «Saytga chiqarish»: o'zgarishlar index.html ichiga joylangan (window.AH_BAKED).
     Sayt qaysi telefonda yoki qaysi manzildan ochilmasin — shu nusxa ishlatiladi (brauzer xotirasidagi
     nusxa undan yangiroq bo'lsagina — o'sha). */
  var BK = window.AH_BAKED;
  if (BK && typeof BK === 'object' && BK.v && !(C && C.v >= BK.v)) {
    C = BK;
    try { localStorage.setItem('ah_cms', JSON.stringify(BK)); } catch (e) {}
  }
  window.AH_CMS = C || {};
  window.AH_BUILD = '2026-10-26.1';
  var P = window.PROJECTS || [];

  /* Yangi materiallar (standart): Obod Maskan videosi */
  var VT = {
    uz: "Obod Maskan — joylashuv va afzalliklar", ru: 'Obod Maskan — расположение и преимущества', en: 'Obod Maskan — location and advantages',
    fr: 'Obod Maskan — emplacement et atouts', it: 'Obod Maskan — posizione e vantaggi', es: 'Obod Maskan — ubicación y ventajas',
    de: 'Obod Maskan — Lage und Vorteile', tr: 'Obod Maskan — konum ve avantajlar'
  };
  P.forEach(function (p) { if (!p.videos) p.videos = []; });
  var ob = P.filter(function (p) { return p.id === 'obod'; })[0];
  if (ob && !ob.videos.length) ob.videos.push({ src: 'media/obod-maskan.mp4', poster: 'media/obod-maskan.jpg', vert: true, t: VT });

  /* Asl (CMS'siz) qiymatlar — kabinet tahrirlagichi va 'base:' havolalari uchun */
  var BASE = {};
  P.forEach(function (p) {
    BASE[p.id] = { cover: p.cover, video: p.video, gallery: (p.gallery || []).slice(), plans: (p.plans || []).slice(), amenities: (p.amenities || []).slice(), videos: (p.videos || []).slice(),
      txt: JSON.parse(JSON.stringify({ name: p.name, badge: p.badge, district: p.district, address: p.address, lead: p.lead, presentation: p.presentation, geo: p.geo, facts: p.facts, priceM2: p.id === 'musaffo' ? null : p.priceM2 })) };
  });
  var hv = document.getElementById('heroVideo');
  BASE._hero = hv ? { src: (hv.querySelector('source') || {}).src || hv.src, poster: hv.poster } : {};
  window.AH_BASE = BASE;
  window.AH_RES = res; /* 'base:…' havolalari CMS o'zgarishlari bo'lmasa ham kerak (js/theme.js) */
  window.AH_CFG0 = { FOUNDED: CFG.FOUNDED, PROJECTS_DONE: CFG.PROJECTS_DONE }; /* js/theme.js uchun asl raqamlar */

  if (!C) return;

  /* ---------- 1) aloqa va raqamlar ---------- */
  var cfg = C.cfg || {};
  Object.keys(cfg).forEach(function (k) {
    var v = cfg[k];
    if (v === '' || v == null || (Array.isArray(v) && !v.length) || k === 'EXPERIENCE_YEARS') return; /* tajriba — faqat tashkil topgan yildan */
    CFG[k] = v;
  });
  CFG.EXPERIENCE_YEARS = new Date().getFullYear() - (+CFG.FOUNDED || 2012);
  if (!/^https?:\/\/\S+/.test(CFG.TELEGRAM_CHANNEL || '')) CFG.TELEGRAM_CHANNEL = 'https://t.me/arthouse_toshkent';
  if (cfg.TELEGRAM_CHANNEL) CFG.TG_CHANNEL = cfg.TELEGRAM_CHANNEL;
  if (cfg.TELEGRAM_MANAGER) CFG.TG_MANAGER = cfg.TELEGRAM_MANAGER;
  if (cfg.PHONES && cfg.PHONES.length) CFG.PHONE = cfg.PHONES[0];

  /* ---------- 2) loyihalar ---------- */
  function res(ref, id) { // 'base:gallery:3' → asl manba
    if (typeof ref !== 'string' || ref.indexOf('base:') !== 0) return ref;
    var a = ref.split(':');
    if (a[1] === 'hero') return (BASE._hero || {})[a[2]] || '';
    var b = BASE[a[3] || id] || {};
    if (a[1] === 'cover') return b.cover;
    if (a[1] === 'video') return (b.video || {})[a[2]] || '';
    var arr = b[a[1]] || [], it = arr[+a[2]];
    return it ? (it.src || it.img || '') : '';
  }
  var pj = C.projects || {}, data = pj.data || {};
  var FIELDS = ['name', 'badge', 'district', 'address', 'lead', 'cover', 'poster', 'video', 'videos', 'geo', 'presentation', 'gallery', 'plans', 'facts', 'amenities'];
  function norm(p) {
    return Object.assign({ name: 'Loyiha', badge: {}, district: {}, address: {}, lead: {}, geo: { lat: CFG.OFFICE.lat, lng: CFG.OFFICE.lng }, priceM2: null,
      cover: '', video: null, videos: [], presentation: '', facts: [], amenities: [], gallery: [], plans: [] }, p);
  }
  (pj.added || []).forEach(function (id) {
    if (!data[id] || P.some(function (p) { return p.id === id; })) return;
    P.push(norm({ id: id }));
    BASE[id] = { gallery: [], plans: [], amenities: [], videos: [] };
  });
  P.forEach(function (p) {
    var e = data[p.id]; if (!e) return;
    FIELDS.forEach(function (k) { if (e[k] !== undefined) p[k] = JSON.parse(JSON.stringify(e[k])); });
    if (e.priceM2 !== undefined && p.id !== 'musaffo') p.priceM2 = e.priceM2 === '' ? null : e.priceM2;
    p.cover = res(p.cover, p.id) || '';
    if (p.video && p.video.src) { p.video.src = res(p.video.src, p.id); p.video.poster = res(p.video.poster, p.id); }
    if (p.video && !p.video.src) p.video = null;
    (p.gallery || []).forEach(function (g) { g.src = res(g.src, p.id); });
    (p.plans || []).forEach(function (g) { g.img = res(g.img, p.id); });
    (p.amenities || []).forEach(function (g) { g.img = res(g.img, p.id); });
    (p.videos || []).forEach(function (g) { g.src = res(g.src, p.id); g.poster = res(g.poster, p.id); });
  });
  var hid = pj.hidden || [];
  for (var i = P.length - 1; i >= 0; i--) if (hid.indexOf(P[i].id) > -1 && P.length > 1) P.splice(i, 1);
  if (pj.order && pj.order.length) P.sort(function (a, b) { var x = pj.order.indexOf(a.id), y = pj.order.indexOf(b.id); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y); });
  if (window.ALL_PROJECT_NAMES) P.forEach(function (p) { var n = typeof p.name === 'string' ? p.name : (p.name.uz || ''); if (n && ALL_PROJECT_NAMES.indexOf(n) < 0) ALL_PROJECT_NAMES.push(n); });

  /* ---------- 3) ranglar ---------- */
  var col = C.colors || {}, css = '';
  var MAP = { bg: '--bg', bg2: '--bg-2', bg3: '--bg-3', emerald: '--emerald', gold: '--gold', gold2: '--gold-2', goldHi: '--gold-hi', ink: '--ink', mut: '--mut' };
  Object.keys(MAP).forEach(function (k) { if (/^#[0-9a-f]{6}$/i.test(col[k] || '')) css += MAP[k] + ':' + col[k] + ';'; });
  if (col.gold || col.gold2 || col.goldHi) {
    var g1 = col.gold2 || '#b8913f', g2 = col.goldHi || '#f6e7b8', g3 = col.gold || '#d8bc7e';
    css += '--gold-grad:linear-gradient(115deg,' + g1 + ' 0%,' + g2 + ' 28%,' + g3 + ' 50%,' + g1 + ' 72%,' + g2 + ' 100%);';
  }
  if (css) {
    var st = document.createElement('style'); st.id = 'cmsColors';
    st.textContent = ':root{' + css + '}' + (col.bg ? 'body{background-color:' + col.bg + '}' : '');
    document.head.appendChild(st);
  }

  /* ---------- 4) bosh sahifa videosi ---------- */
  var h = C.hero || {};
  if (hv && (h.video || h.poster)) {
    if (h.poster) hv.setAttribute('poster', res(h.poster));
    if (h.video) { var s = hv.querySelector('source'); if (s) s.remove(); hv.src = res(h.video); document.documentElement.classList.add('hero-vid'); }
  }
})();
