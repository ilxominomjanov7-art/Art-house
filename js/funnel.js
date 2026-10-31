/* =====================================================================
   ART HOUSE — saytdagi sotuv voronkasi (dizayn: Figma → «Art House · Sotuv oynalari va afzalliklar»)
   1) Taklif oynasi: mijoz kalit-kartaning oltin folgasini barmog'i bilan suradi → boshlang'ich to'lov ochiladi →
      ism va telefon → ariza kabinetga va Telegram guruhga boradi (via: 'popup').
   2) Bo'lib to'lash kalkulyatori oynasi: 4 qadam (xonalar, maydon, boshlang'ich to'lov, muddat) → hisob: narx,
      boshlang'ich, qolgan summa, oylik to'lov → «Shu shart bilan band qilish» → ism va telefon (via: 'popup-calc').
   3) Afzalliklar lentasi (bosh banner ostida): telefonda bittadan aylanadi va suriladi, kompyuterda bir qatorda.
   Hammasi kabinet → Sayt → «Sotuv oynalari» dan boshqariladi ('ah_cms'.funnel; standartlar — js/funnel-dict.js):
   qachon chiqishi, matnlar (8 til), summa, karta yozuvlari, rasm, ishonch qatorlari, lenta bandlari va ikonkalari.
   Kabinetda o'zgarsa, sayt qayta yuklanmasdan yangilanadi (js/theme.js → window.AH_FUNNEL).
   Statistika: oyna ko'rsatildi (po, pq), karta ochildi (pr) — kabinet → Statistika → «Mijozlar qayerdan keldi».
   ?pp=offer / ?pp=calc — darhol ochish (sinov uchun), ?pp=0 — o'chirish.
   Narx hisobi kalkulyator va AI maslahatchi bilan bir xil: maydon × 1 m² narxi, 100 $ gacha yaxlitlanadi.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG || !window.PROJECTS || !window.AH_SITE || !window.AH_FD) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = I18N.t, pick = I18N.pick, FD = AH_FD, IC = FD.icons;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var copy = $('#p-home .hero-copy'); if (copy) I18N.apply(copy); /* banner matni yangi taklif bilan */

  /* ---------- kabinet sozlamalari ('ah_cms'.funnel) ---------- */
  var FN = function () { return (window.AH_CMS || {}).funnel || {}; };
  var RU = function () { return Object.assign({}, FD.rules, FN().rules || {}); };
  var lng = function () { return I18N.lang; };
  function fill(s, o) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      if (o && o[k] != null) return o[k];
      if (k === 'years') return CFG.EXPERIENCE_YEARS; if (k === 'down') return CFG.DOWN_MIN + '%'; if (k === 'months') return maxM();
      return m;
    });
  }
  /* kabinetda yozilgan matn (shu tilda) bo'lsa — o'sha, bo'lmasa standart tarjima */
  function T(k, o) {
    var c = (FN().text || {})[k], l = lng();
    if (c) { if (c[l]) return fill(c[l], o); if (l === 'cy' && c.uz) return I18N.toCyr(fill(c.uz, o)); }
    return t(k, o);
  }
  /* ro'yxat bandining matni: { uz, ru, … } yoki standart kalit */
  function ML(o, k, vars) {
    if (o && typeof o === 'object') { var l = lng(); if (o[l]) return fill(o[l], vars); if (l === 'cy' && o.uz) return I18N.toCyr(fill(o.uz, vars)); if (o.uz) return fill(o.uz, vars); }
    return k ? t(k, vars) : '';
  }
  var SV = function (d, c) { return '<svg class="' + (c || 'pp-ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var IMG = function (ref, cls, alt) { ref = String(ref || ''); return '<img class="' + (cls || '') + '" ' + (ref.indexOf('idb:') === 0 ? 'data-src' : 'src') + '="' + esc(ref) + '" alt="' + esc(alt || '') + '" decoding="async">'; };
  /* ikonka yoki kabinetdan yuklangan rasm */
  var ICO = function (it, cls) { return it.img ? IMG(it.img, cls + ' is-img') : SV(IC[it.icon] || IC.check, cls); };
  var LOGO = '<svg class="pp-logo" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke-width="2.5" d="M50 97.5H2.5V2.5H50M50 97.5H97.5V2.5H50"/><path stroke-width="3" d="M50 92H8V8H50M50 92H92V8H50"/><path stroke-width="4" d="M44 92V34q0-7 6-10M56 92V34q0-7-6-10M33 92V48q0-6 6-8M67 92V48q0-6-6-8M22 92V62q0-6 6-8M78 92V62q0-6-6-8M50 24V11"/></svg>';
  var track = function (e) { if (window.CRM && CRM.track) CRM.track(e); };

  /* ---------- xonadonlar va narx (kalkulyator bilan bir xil) ---------- */
  function list() { return PROJECTS.filter(function (p) { return p.plans && p.plans.length; }); }
  if (!list().length) return;
  var price = function (p, pl) { return Math.min(500000, Math.max(20000, Math.round(pl.area * (p.priceM2 || CFG.PRICE_M2) / 100) * 100)); };
  var maxM = function () { return Math.max.apply(null, CFG.MONTHS); };
  function autoDown() { var m = Infinity; list().forEach(function (p) { p.plans.forEach(function (pl) { m = Math.min(m, price(p, pl)); }); }); return Math.round(m * CFG.DOWN_MIN / 100); }
  /* taklifdagi summa: kabinetda qo'lda yozilgan bo'lsa — o'sha, bo'lmasa eng arzon xonadon × eng kam boshlang'ich foiz */
  function minDown() { var a = +((FN().offer || {}).amount) || 0; return a > 0 ? Math.round(a) : autoDown(); }
  var area = function (pl) { return (pl.areaTxt || String(pl.area).replace('.', ',')) + ' m²'; };
  var planName = function (pl) { return t('plan.label', { rooms: pl.rooms, duplex: pl.duplex ? t('plan.duplex') : '', area: String(pl.area).replace('.', ',') }); };

  /* kalkulyator holati: loyiha (p), xonalar (r), reja (i), boshlang'ich to'lov % (pct), muddat (m) */
  var S = { p: '', r: '', i: -1, pct: CFG.DOWN_MIN, m: maxM(), touched: 0 };
  try { var sv = JSON.parse(sessionStorage.getItem('ah_hf')); if (sv) Object.assign(S, sv); } catch (e) {}
  function save() { try { sessionStorage.setItem('ah_hf', JSON.stringify(S)); } catch (e) {} }
  function proj() { var L = list(); return L.filter(function (p) { return p.id === S.p; })[0] || L[0]; }
  function units() { var P = proj(); return P.plans.map(function (pl, i) { return { i: i, pl: pl, r: pl.duplex ? 'd' : String(pl.rooms), price: price(P, pl) }; }); }
  function kinds() { var k = []; units().forEach(function (u) { if (k.indexOf(u.r) < 0) k.push(u.r); }); return k.sort(function (a, b) { return a === 'd' ? 1 : b === 'd' ? -1 : a - b; }); }
  function sane() {
    S.p = proj().id;
    var U = units(), K = kinds();
    if (K.indexOf(S.r) < 0) S.r = K[0];
    var mine = U.filter(function (u) { return u.r === S.r; });
    if (!mine.some(function (u) { return u.i === S.i; })) S.i = mine.slice().sort(function (a, b) { return a.price - b.price; })[0].i;
    S.pct = Math.min(CFG.DOWN_MAX, Math.max(CFG.DOWN_MIN, +S.pct || CFG.DOWN_MIN));
    if (CFG.MONTHS.indexOf(+S.m) < 0) S.m = maxM();
    return U;
  }
  function calc() { var u = sane()[S.i], dn = Math.round(u.price * S.pct / 100); return { u: u, down: dn, monthly: (u.price - dn) / S.m }; }

  /* ---------- oyna ---------- */
  var ov = document.createElement('div'); ov.className = 'pp'; ov.id = 'ahPop'; ov.hidden = true;
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'ppT');
  ov.innerHTML = '<div class="pp-bg" data-ppx></div><div class="pp-box" tabindex="-1"></div>';
  document.body.appendChild(ov);
  var box = $('.pp-box', ov), cur = '', lastFocus = null, revealed = false;
  try { revealed = sessionStorage.getItem('ah_pp_rev') === '1'; } catch (e) {}
  function st(v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('ah_pp')) || {}; localStorage.setItem('ah_pp', JSON.stringify(v)); } catch (e) { return {}; } }
  function ses(v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem('ah_pp_s')) || {}; sessionStorage.setItem('ah_pp_s', JSON.stringify(v)); } catch (e) { return {}; } }
  function leadDone() { var s = st(); if (s.done) return true; try { return !!localStorage.getItem('ah3_lastLead'); } catch (e) { return false; } }
  var X = function () { return '<button class="pp-x" type="button" data-ppx aria-label="' + esc(T('pop.close')) + '">' + SV(IC.close) + '</button>'; };
  function proof() {
    if ((FN().offer || {}).proof === false) return '';
    var C = window.AH_CMS || {}, A = (C.stars && Array.isArray(C.stars.list) ? C.stars.list : (CFG.AMBASSADORS || [])).map(function (a) { var d = (CFG.AMBASSADORS || []).filter(function (x) { return x.id && x.id === a.id; })[0] || {}; return { name: a.name, photo: a.photo || d.photo, on: a.on }; })
      .filter(function (a) { return a.on !== false && a.photo && a.name; });
    if (A.length < 2) return '';
    return '<div class="pp-proof"><span class="pp-faces">' + A.slice(0, 4).map(function (a) { return IMG(a.photo); }).join('') + '</span><span>' + esc(T('pop.proof', { a: A[0].name, b: A[1].name })) + '</span></div>';
  }
  function fields(btn) {
    var me = {}; try { me = JSON.parse(localStorage.getItem('ah3_me')) || {}; } catch (e) {}
    return '<label class="field pp-f"><span>' + esc(T('pop.name')) + '</span><input class="pp-in" name="name" autocomplete="name" maxlength="60" placeholder="' + esc(T('pop.namePh')) + '" value="' + esc(me.name || '') + '"><small class="err"></small></label>' +
      '<label class="field pp-f"><span>' + esc(T('pop.phone')) + '</span><input class="pp-in js-pp-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" value="' + esc(me.phone || '') + '"><small class="err"></small></label>' +
      '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="pp-btn" type="submit"><span>' + esc(btn) + '</span>' + SV(IC.arrow) + '</button>' +
      '<p class="pp-priv">' + SV(IC.lock) + '<span>' + esc(T('pop.priv')) + '</span></p>';
  }
  function armForm(f) { $$('.js-pp-phone', f).forEach(AH_SITE.phoneMask); }
  function trust() { var L = (FN().offer || {}).trust; L = Array.isArray(L) ? L : FD.trust; return L.filter(function (x) { return x.on !== false; }); }

  /* 1) taklif: kalit-karta (oltin folga barmoq bilan suriladi) */
  function renderOffer() {
    var O = FN().offer || {}, P0 = PROJECTS[0], fct = P0.facts || [], cap = fct.slice(0, 2).map(function (x) { return x.v + ' ' + pick(x.k); }).join(' · ');
    box.className = 'pp-box pp-offer' + (revealed ? ' is-rev is-b' : '');
    box.innerHTML = X() + '<div class="pp-grid"><figure class="pp-pic">' + IMG(O.img || P0.cover) + '<figcaption><b>' + esc(pick(P0.name) + ' · ' + pick(P0.district)) + '</b><span>' + esc(cap) + '</span></figcaption></figure>' +
      '<div class="pp-main"><i class="pp-handle"></i>' +
      '<p class="pp-k pp-a">' + esc(T('pop.k1')) + '</p><p class="pp-k pp-b">' + esc(T('pop.k2')) + '</p>' +
      '<h2 class="pp-h pp-a" id="ppT">' + esc(T('pop.t1')) + '</h2><p class="pp-s pp-a">' + esc(T('pop.s1')) + '</p>' +
      '<div class="pp-card"><span class="pp-guil" aria-hidden="true"></span><span class="pp-shine"></span>' + LOGO + '<b class="pp-brand">' + esc(O.brand || 'ART HOUSE') + '</b><small class="pp-no">' + esc(O.no || ('No ' + (CFG.FOUNDED || 2012))) + '</small>' +
        '<div class="pp-rev"><span>' + esc(T('pop.down')) + '</span><strong id="ppNum">' + esc(I18N.usd(minDown())) + '</strong><em>' + esc(T('pop.rest')) + '</em></div>' +
        '<canvas class="pp-foil" aria-hidden="true"></canvas><span class="pp-gleam" aria-hidden="true"></span></div>' +
      '<h2 class="pp-h pp-b pp-h2">' + esc(T('pop.t2')) + '</h2><p class="pp-s pp-b">' + esc(T('pop.s2')) + '</p>' +
      '<button class="pp-link pp-a" type="button" data-reveal>' + esc(T('pop.open')) + '</button>' +
      '<ul class="pp-trust pp-a">' + trust().map(function (x) { return '<li>' + ICO(x, 'pp-ic') + '<span>' + esc(ML(x.t, x.k)) + '</span></li>'; }).join('') + '</ul>' +
      '<form class="pp-form pp-b" novalidate data-form="offer">' + fields(T('pop.cta')) + '</form>' + proof() + '</div></div>';
    armForm(box);
    if (revealed) { var a = $('.pp-a#ppT', box); if (a) a.removeAttribute('id'); $('.pp-h2', box).id = 'ppT'; }
  }
  /* folga: oltin metall, nozik gilosh chiziqlari, «AH» monogrammasi va o'yib yozilgan yozuv — hammasi suriladi; 40% ochilsa — to'liq ochiladi */
  function foil() {
    var cv = $('.pp-foil', box); if (!cv || revealed) return;
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1), x = cv.getContext && cv.getContext('2d'); if (!x) return;
    var W = r.width, H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); x.scale(dpr, dpr);
    var g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#B8995A'); g.addColorStop(0.22, '#E3CC94'); g.addColorStop(0.46, '#F8EED2'); g.addColorStop(0.54, '#FCF5E2'); g.addColorStop(0.78, '#E0C68C'); g.addColorStop(1, '#B4945A');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    /* gilosh: markazdan tarqaluvchi nozik to'lqinli chiziqlar */
    x.save(); x.globalAlpha = 0.16; x.strokeStyle = '#7A5F2A'; x.lineWidth = 0.6;
    for (var k = 0; k < 26; k++) { x.beginPath(); for (var px = 0; px <= W; px += 4) { var y = H / 2 + Math.sin(px / 18 + k * 0.5) * (H * 0.36) * Math.cos(k * 0.12) + (k - 13) * 1.6; if (px) x.lineTo(px, y); else x.moveTo(px, y); } x.stroke(); }
    x.restore();
    /* monogramma */
    x.save(); x.globalAlpha = 0.07; x.fillStyle = '#5E4719'; x.font = '600 11px Geologica, sans-serif'; x.textAlign = 'center';
    for (var yy = 14; yy < H + 10; yy += 22) for (var xx = ((yy / 22) % 2 ? 22 : 0); xx < W + 20; xx += 44) x.fillText('AH', xx, yy);
    x.restore();
    /* ichki ramka */
    x.save(); x.strokeStyle = 'rgba(94, 71, 25, .35)'; x.lineWidth = 1; x.strokeRect(7.5, 7.5, W - 15, H - 15); x.strokeStyle = 'rgba(255, 250, 235, .55)'; x.strokeRect(8.5, 8.5, W - 15, H - 15); x.restore();
    /* o'yib yozilgan yozuv: soyasi va yorug'ligi bilan */
    var txt = String(T('pop.scratch')).toUpperCase(), fs = Math.max(11, Math.min(14, W / 22));
    x.save(); x.font = '600 ' + fs + 'px Geologica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if ('letterSpacing' in x) x.letterSpacing = (fs * 0.28).toFixed(1) + 'px';
    x.fillStyle = 'rgba(255, 252, 240, .85)'; x.fillText(txt, W / 2 + 0.6, H / 2 + 1.1);
    x.fillStyle = '#5A4316'; x.fillText(txt, W / 2, H / 2);
    x.fillStyle = 'rgba(90, 67, 22, .55)'; var lw = Math.min(W * 0.32, 90);
    x.fillRect(W / 2 - lw / 2, H / 2 - fs * 1.35, lw, 0.8); x.fillRect(W / 2 - lw / 2, H / 2 + fs * 1.35, lw, 0.8);
    x.translate(W / 2, H / 2 - fs * 1.35); x.rotate(Math.PI / 4); x.fillRect(-2.2, -2.2, 4.4, 4.4);
    x.restore();
    x.globalCompositeOperation = 'destination-out'; x.lineCap = x.lineJoin = 'round'; x.lineWidth = 44;
    box.classList.add('is-foil');
    var down = false, last = null, n = 0;
    var pt = function (e) { var b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    var check = function () {
      var d = x.getImageData(0, 0, cv.width, cv.height).data, c = 0, all = 0;
      for (var q = 3; q < d.length; q += 80) { all++; if (d[q] < 40) c++; }
      if (all && c / all > 0.4) reveal();
    };
    cv.addEventListener('pointerdown', function (e) { down = true; last = pt(e); try { cv.setPointerCapture(e.pointerId); } catch (er) {} box.classList.add('is-scratching'); x.beginPath(); x.arc(last[0], last[1], 22, 0, 7); x.fill(); });
    cv.addEventListener('pointermove', function (e) { if (!down) return; var p = pt(e); x.beginPath(); x.moveTo(last[0], last[1]); x.lineTo(p[0], p[1]); x.stroke(); last = p; if (++n % 5 === 0) check(); });
    ['pointerup', 'pointercancel'].forEach(function (ev) { cv.addEventListener(ev, function () { if (down) { down = false; check(); } }); });
  }
  function reveal() {
    if (revealed) return; revealed = true; track('pr');
    try { sessionStorage.setItem('ah_pp_rev', '1'); } catch (e) {}
    box.classList.add('is-rev');
    var el = $('#ppNum', box), to = minDown(), t0 = performance.now();
    if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) (function f(now) { var k = Math.min(1, (now - t0) / 700); el.textContent = I18N.usd(Math.round(to * (1 - Math.pow(1 - k, 3)) / 10) * 10); if (k < 1) requestAnimationFrame(f); else el.textContent = I18N.usd(to); })(t0);
    setTimeout(function () {
      box.classList.add('is-b');
      var a = $('.pp-a#ppT', box); if (a) a.removeAttribute('id'); var h = $('.pp-h2', box); if (h) h.id = 'ppT';
      var nm = $('.pp-form [name=name]', box); if (nm && matchMedia('(min-width: 860px)').matches) nm.focus({ preventScroll: true });
    }, 650);
  }

  /* 2) bo'lib to'lash kalkulyatori: 4 qadam va tushunarli hisob */
  function chips(g, items, on) { return '<div class="pp-chips" role="group" data-g="' + g + '">' + items.map(function (x) { return '<button type="button" data-v="' + esc(x[0]) + '" aria-pressed="' + (String(x[0]) === String(on)) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; }
  function renderCalc() {
    var U = sane(), P = proj(), L = list(), K = kinds(), mine = U.filter(function (u) { return u.r === S.r; }).sort(function (a, b) { return a.pl.area - b.pl.area; }), n = 0;
    var row = function (lab, body, val) { n++; return '<div class="pp-row"><div class="pp-l"><span><i class="pp-n">' + n + '</i>' + esc(lab) + '</span>' + (val || '') + '</div>' + body + '</div>'; };
    box.className = 'pp-box pp-calc';
    box.innerHTML = X() + '<div class="pp-main"><i class="pp-handle"></i><p class="pp-k">' + esc(T('pc.k')) + '</p><h2 class="pp-h" id="ppT">' + esc(T('pc.t')) + '</h2><p class="pp-s">' + esc(T('pc.s')) + '</p>' +
      '<div class="pp-cbody">' +
      (L.length > 1 ? row(T('hf.p'), chips('p', L.map(function (p) { return [p.id, pick(p.name)]; }), P.id)) : '') +
      row(T('hf.r'), chips('r', K.map(function (k) { return [k, k === 'd' ? T('hf.dup') : k]; }), S.r)) +
      (mine.length > 1 ? row(T('hf.a'), chips('i', mine.map(function (u) { return [u.i, area(u.pl)]; }), S.i)) : '') +
      row(T('hf.d'), '<input type="range" class="pp-range" id="ppDown" min="' + CFG.DOWN_MIN + '" max="' + CFG.DOWN_MAX + '" step="5" value="' + S.pct + '" aria-label="' + esc(T('hf.d')) + '"><div class="pp-scale"><span>' + CFG.DOWN_MIN + '%</span><span>' + CFG.DOWN_MAX + '%</span></div>', '<b id="ppDownV"></b>') +
      row(T('hf.m'), chips('m', CFG.MONTHS.map(function (m) { return [m, m + ' ' + t('unit.month')]; }), S.m)) +
      '<div class="pp-res" aria-live="polite"><div class="pp-res-top"><a class="pp-plan" href="#projects/' + esc(P.id) + '" data-ppx><img id="ppImg" alt="" decoding="async"></a><div><span>' + esc(T('pc.res')) + ' · ' + esc(T('hf.res')) + '</span><strong id="ppM"></strong><small id="ppUzs"></small></div></div>' +
        '<dl class="pp-break"><div><dt>' + esc(T('pc.price')) + '</dt><dd id="ppPr"></dd></div><div><dt id="ppDnL"></dt><dd id="ppDn"></dd></div><div><dt>' + esc(T('pc.rest')) + '</dt><dd id="ppRs"></dd></div><div class="pp-mo"><dt>' + esc(T('pc.mon')) + '</dt><dd id="ppMo"></dd></div></dl>' +
        '<p class="pp-today" id="ppToday"></p><em class="pp-unit" id="ppU"></em></div>' +
      '<button class="pp-btn" type="button" data-cstep><span>' + esc(T('hf.book')) + '</span>' + SV(IC.arrow) + '</button></div>' +
      '<form class="pp-form pp-cform" novalidate data-form="calc" hidden><p class="pp-sum" id="ppSum"></p><p class="pp-s">' + esc(T('pc.formS')) + '</p>' + fields(T('pc.send')) +
      '<button class="pp-link" type="button" data-cback>' + esc(T('pc.back')) + '</button></form>' +
      '<button class="pp-ai" type="button" data-ai>' + SV(IC.sparkle) + '<span>' + esc(T('pc.ai')) + '</span></button></div>';
    armForm(box); out();
  }
  function out() {
    var inp = $('#ppDown', box); if (!inp) return;
    var r = calc(), u = r.u, U = I18N.usd;
    inp.style.setProperty('--p', ((S.pct - CFG.DOWN_MIN) / Math.max(1, CFG.DOWN_MAX - CFG.DOWN_MIN) * 100) + '%');
    $('#ppDownV', box).textContent = S.pct + '% · ' + U(r.down);
    $('#ppM', box).textContent = U(r.monthly);
    $('#ppUzs', box).textContent = t('calc.uzs', { v: I18N.num(Math.round(r.monthly * CFG.USD_UZS / 1000) * 1000) });
    $('#ppPr', box).textContent = U(u.price);
    $('#ppDnL', box).textContent = T('pc.downL', { p: S.pct }); $('#ppDn', box).textContent = U(r.down);
    $('#ppRs', box).textContent = U(u.price - r.down);
    $('#ppMo', box).textContent = U(r.monthly) + ' × ' + S.m;
    $('#ppToday', box).textContent = T('pc.today', { d: U(r.down), m: U(r.monthly), n: S.m });
    $('#ppU', box).textContent = pick(proj().name) + ' · ' + planName(u.pl);
    var img = $('#ppImg', box); if (img && img.getAttribute('src') !== u.pl.img) img.src = u.pl.img;
  }
  function touch() { if (!S.touched) { S.touched = 1; track('c'); } save(); }

  /* ---------- ariza ---------- */
  function send(form) {
    var n = $('[name=name]', form), ph = $('[name=phone]', form), ok = AH_SITE.checkName(n) & AH_SITE.checkPhone(ph);
    if (!ok || $('[name=website]', form).value) return;
    var lead = { src: 'site', name: n.value.trim(), phone: ph.value.trim(), slot: 'Imkon qadar tez', lang: I18N.lang, area: 0 };
    if (form.getAttribute('data-form') === 'calc') {
      var r = calc(), P = proj();
      Object.assign(lead, { via: 'popup-calc', project: P.id, unit: unitLabel(r.u.pl), area: r.u.pl.area, price: r.u.price, pct: S.pct, down: r.down, months: +S.m, monthly: Math.round(r.monthly) });
      AH_SITE.calcSet({ project: P.id, plan: r.u.i, pct: S.pct, months: +S.m });
    } else Object.assign(lead, { via: 'popup', unit: "Taklif oynasi: boshlang'ich to'lov " + Math.round(minDown()).toLocaleString('en-US') + ' $ dan', down: minDown(), pct: CFG.DOWN_MIN });
    AH_SITE.remember(lead.name, lead.phone);
    try { localStorage.setItem('ah3_lastLead', JSON.stringify(Date.now())); } catch (e) {}
    CRM.deliver(lead).then(function (r2) { if (r2 === false) AH_SITE.toast(t('toast.offline')); });
    var s = st(); s.done = Date.now(); st(s); pill(false);
    var live = !!CRM.api;
    box.className = 'pp-box pp-okbox';
    box.innerHTML = X() + '<div class="pp-main pp-ok"><span class="pp-tick">' + SV(IC.check) + '</span><h2 class="pp-h" id="ppT">' + esc(T('pop.okT', { name: lead.name })) + '</h2>' +
      '<p class="pp-s">' + esc(live ? T('pop.okD', { phone: lead.phone }) : t('book.manualText', { name: lead.name })) + '</p>' +
      (live ? '' : '<div class="pp-acts">' + (window.AH_manualActs ? AH_manualActs(lead) : '') + '</div>') +
      '<button class="pp-btn pp-ghost" type="button" data-ppx>' + esc(T('pop.close')) + '</button></div>';
  }

  /* ---------- ochish / yopish ---------- */
  var html = document.documentElement;
  function open(kind, auto) {
    if (!ov.hidden) return;
    cur = kind; lastFocus = document.activeElement;
    if (kind === 'calc') renderCalc(); else renderOffer();
    ov.hidden = false; html.classList.add('pp-lock'); pill(false); track(kind === 'calc' ? 'pq' : 'po');
    requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('on'); if (kind === 'offer') foil(); }); });
    setTimeout(function () { box.focus({ preventScroll: true }); }, 60);
    var s = ses(); s.shown = s.shown || {}; s.shown[kind] = Date.now(); if (auto) s.n = (s.n || 0) + 1; ses(s);
  }
  function close() {
    if (ov.hidden) return;
    var was = cur, ok = box.classList.contains('pp-okbox');
    ov.classList.remove('on'); html.classList.remove('pp-lock');
    setTimeout(function () { ov.hidden = true; box.innerHTML = ''; }, 380);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    cur = '';
    if (!ok && !leadDone()) { var s = st(); s.off = s.off || {}; s.off[was] = Date.now() + Math.max(0, +RU().days || 0) * 864e5; st(s); if (was === 'offer' && RU().offer !== false) pill(true); next(); }
  }
  ov.addEventListener('click', function (e) {
    if (e.target.closest('[data-ppx]')) { close(); return; }
    if (e.target.closest('[data-reveal]')) { reveal(); return; }
    var b = e.target.closest('.pp-chips button');
    if (b) { var g = b.parentNode.getAttribute('data-g'), v = b.getAttribute('data-v'); if (g === 'p') { S.p = v; S.r = ''; S.i = -1; } else if (g === 'r') { S.r = v; S.i = -1; } else if (g === 'i') S.i = +v; else S.m = +v; touch(); renderCalc(); var f = $('.pp-chips[data-g="' + g + '"] [aria-pressed="true"]', box); if (f) f.focus({ preventScroll: true }); return; }
    if (e.target.closest('[data-cstep]')) {
      var r = calc(); touch();
      $('#ppSum', box).textContent = pick(proj().name) + ' · ' + planName(r.u.pl) + ' · ' + I18N.usd(r.monthly) + ' ' + t('unit.perMonth') + ' · ' + S.pct + '% · ' + S.m + ' ' + t('unit.month');
      $('.pp-cbody', box).hidden = true; $('.pp-cform', box).hidden = false; var h = $('#ppT', box); if (h) h.textContent = T('pc.formT');
      var nm = $('.pp-cform [name=name]', box); if (nm) nm.focus({ preventScroll: true }); return;
    }
    if (e.target.closest('[data-cback]')) { renderCalc(); return; }
    if (e.target.closest('[data-ai]')) { var c = calc(); close(); if (window.ArtHouseAI) { if (ArtHouseAI.ctx) ArtHouseAI.ctx({ R: S.r, M: +S.m, B: c.down, P: proj().id }); setTimeout(ArtHouseAI.open, 120); } }
  });
  ov.addEventListener('input', function (e) { if (e.target.id === 'ppDown') { S.pct = +e.target.value; touch(); out(); } });
  ov.addEventListener('submit', function (e) { e.preventDefault(); send(e.target); });
  document.addEventListener('keydown', function (e) {
    if (ov.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'Tab') { var f = $$('button, input:not(.hp), a[href], [tabindex="0"]', box).filter(function (x) { return x.offsetParent; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  /* yopilgan taklif — kichik yorliq bo'lib qoladi (bosilsa qayta ochiladi) */
  var pl = null;
  function pill(on) {
    var k = 'ah_pp_pill', v = ''; try { v = sessionStorage.getItem(k) || ''; } catch (e) {}
    if (!on || v === 'x' || RU().offer === false) { if (pl) pl.hidden = true; return; }
    try { sessionStorage.setItem(k, '1'); } catch (e) {}
    if (!pl) {
      pl = document.createElement('div'); pl.className = 'pp-pill'; pl.id = 'ppPill';
      pl.innerHTML = '<button type="button" class="pp-pill-b">' + SV(IC.key) + '<span></span></button><button type="button" class="pp-pill-x">' + SV(IC.close) + '</button>';
      document.body.appendChild(pl);
      $('.pp-pill-b', pl).addEventListener('click', function () { open('offer'); });
      $('.pp-pill-x', pl).addEventListener('click', function () { pl.hidden = true; try { sessionStorage.setItem(k, 'x'); } catch (e) {} });
    }
    $('.pp-pill-x', pl).setAttribute('aria-label', T('pop.close'));
    $('.pp-pill-b span', pl).textContent = T('pop.pill', { v: I18N.usd(minDown()) });
    pl.hidden = false;
  }
  try { if (sessionStorage.getItem('ah_pp_pill') === '1' && !leadDone()) setTimeout(function () { if (ov.hidden) pill(true); }, 1500); } catch (e) {}

  /* ---------- qachon chiqadi (kabinet → Sotuv oynalari → «Qachon chiqadi») ---------- */
  var q = location.search, AUTO = !/[?&]pp=0/.test(q) && !/[?&](cmsnap|edit|preview)=1/.test(q) && window.top === window.self;
  var T0 = Date.now(), lastY = window.scrollY, travel = 0, phase = { t: T0, d: 0, second: false };
  addEventListener('scroll', function () { travel += Math.abs(window.scrollY - lastY); lastY = window.scrollY; }, { passive: true });
  function busy() {
    var a = document.activeElement, bm = $('#bookModal'), ai = $('#aip');
    return !ov.hidden || !!$('#splash') || (bm && !bm.hidden) || (ai && !ai.hidden) || document.body.classList.contains('lock') || document.hidden || (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName));
  }
  function pickKind() {
    var R = RU(), s = ses(), off = st().off || {}, now = Date.now(), shown = s.shown || {};
    if ((s.n || 0) >= Math.max(0, +R.max || 0)) return null;
    if (R.offer !== false && !shown.offer && !(off.offer > now)) return 'offer';
    if (R.calc !== false && !shown.calc && !(off.calc > now)) return 'calc';
    return null;
  }
  function next() { phase = { t: Date.now(), d: travel, second: true }; }
  function tick(force) {
    if (!AUTO || leadDone() || busy()) return;
    var R = RU(), wait = (phase.second ? +R.gap : +R.delay) * 1000, need = (phase.second ? 1.5 : +R.screens) * innerHeight;
    if (!force && (Date.now() - phase.t < wait || travel - phase.d < need)) return;
    var k = pickKind(); if (k) open(k, true);
  }
  setInterval(tick, 1500);
  /* kompyuterda: sichqoncha sahifadan chiqib ketayotganda (tepaga) — birinchi oyna biroz erta */
  document.addEventListener('mouseout', function (e) { if (RU().exit !== false && !e.relatedTarget && e.clientY <= 0 && Date.now() - T0 > 8000 && !(ses().n)) tick(true); });
  var m = q.match(/[?&]pp=(offer|calc)/); if (m) setTimeout(function () { open(m[1]); }, 900);

  /* bosh bannerdagi «To'lovni hisoblash» va boshqa [data-pp] tugmalar */
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-pp]'); if (!b) return; e.preventDefault(); open(b.getAttribute('data-pp')); });
  /* bosh sahifada «Band qilish» (yuqori menyu, pastki panel): mijoz kalkulyatorda tanlagan bo'lsa — shu shartlar bilan */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-book]');
    if (!b || !S.touched || ov.contains(b) || !$('#p-home') || !$('#p-home').offsetParent) return;
    e.stopPropagation(); e.preventDefault(); var r = calc();
    AH_SITE.calcSet({ project: proj().id, plan: r.u.i, pct: S.pct, months: +S.m }); AH_SITE.book({ fromCalc: true, via: 'popup-calc' });
  }, true);

  /* ---------- 3) afzalliklar lentasi ---------- */
  var uspTimers = {};
  function uspItems() { var L = (FN().usp || {}).items; return (Array.isArray(L) ? L : FD.usp).filter(function (x) { return x.on !== false; }); }
  /* pastki lenta (bosh sahifa oxirida) — tepadagisi bilan bir xil ko'rinish: och fon, ikonka, surish */
  var BOTTOM = [{ icon: 'clock', k: 'hi.b1' }, { icon: 'percent', k: 'hi.b2' }, { icon: 'doc', k: 'hi.b3' }, { icon: 'car', k: 'hi.b4' }];
  function slider(id, L, place) {
    var old = $('#' + id); clearInterval(uspTimers[id]);
    if (!L.length) { if (old) old.remove(); return; }
    var s = document.createElement('section'); s.id = id; s.className = 'usp' + (old && old.classList.contains('ths-off') ? ' ths-off' : ''); s.setAttribute('aria-roledescription', 'carousel'); s.setAttribute('aria-label', t('usp.aria'));
    if (old && old.getAttribute('data-ths')) s.setAttribute('data-ths', old.getAttribute('data-ths'));
    s.style.setProperty('--usp-n', Math.min(L.length, 6));
    s.innerHTML = '<div class="usp-track">' + L.map(function (u, i) { return '<div class="usp-it" role="group" aria-label="' + (i + 1) + ' / ' + L.length + '">' + ICO(u, 'usp-ic') + '<div><b>' + esc(ML(u.t, u.k && u.k + 't')) + '</b><p>' + esc(ML(u.d, u.k && u.k + 'd')) + '</p></div></div>'; }).join('') +
      '</div>' + (L.length > 1 ? '<div class="usp-dots">' + L.map(function (u, i) { return '<button type="button" aria-label="' + (i + 1) + ' / ' + L.length + '" data-k="' + i + '"></button>'; }).join('') + '</div>' : '');
    if (old) old.replaceWith(s); else place(s);
    var tr = $('.usp-track', s), k = 0, wide = matchMedia('(min-width: 1100px)'), RM = matchMedia('(prefers-reduced-motion: reduce)').matches, vis = true;
    function go(i) { k = (i + L.length) % L.length; tr.style.transform = wide.matches ? '' : 'translateX(' + (-k * 100) + '%)'; $$('.usp-dots button', s).forEach(function (b, j) { b.setAttribute('aria-current', String(j === k)); }); }
    function play() { clearInterval(uspTimers[id]); var sp = Math.max(2, +RU().speed || 4.5) * 1000; if (!wide.matches && !RM && L.length > 1) uspTimers[id] = setInterval(function () { if (!document.hidden && vis && document.body.contains(s)) go(k + 1); }, sp); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(s);
    s.addEventListener('click', function (e) { var b = e.target.closest('.usp-dots button'); if (b) { go(+b.getAttribute('data-k')); play(); } });
    var x0 = null;
    s.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    s.addEventListener('pointerup', function (e) { if (x0 == null || wide.matches) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) { go(k + (dx < 0 ? 1 : -1)); play(); } });
    (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(function () { go(k); play(); });
    go(0); play();
  }
  function usp() {
    var hero = $('#p-home > .hero'); if (!hero) return;
    slider('ahUsp', uspItems(), function (s) { hero.parentNode.insertBefore(s, hero.nextSibling); });
    var host = $('#p-home');
    slider('hiBar', BOTTOM, function (s) { var ig = $('#igStrip'); if (ig) ig.after(s); else host.appendChild(s); });
  }
  usp();

  /* kabinetda o'zgarganda (js/theme.js → live) va til almashganda — qayta chiziladi */
  function redraw() { usp(); if (!ov.hidden) { if (cur === 'calc') renderCalc(); else { renderOffer(); if (!revealed) foil(); } } if (pl && !pl.hidden) pill(true); }
  window.AH_FUNNEL = redraw;
  I18N.on(function () { setTimeout(redraw, 0); });
  /* kabinet → Sozlamalar: 1 m² narxi, boshlang'ich foiz, muddatlar o'zgarsa — summa, kalkulyator va banner matni yangilanadi */
  if (window.Store && Store.on) Store.on('settings', function () { setTimeout(function () { if (copy) I18N.apply(copy); redraw(); }, 0); });
  window.AH_POP = { open: open, close: close, reveal: reveal, state: function () { var r = calc(); return { rooms: S.r, plan: r.u.i, price: r.u.price, pct: S.pct, down: r.down, months: +S.m, monthly: Math.round(r.monthly), minDown: minDown() }; } };
})();
