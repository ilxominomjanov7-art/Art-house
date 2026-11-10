(function () {
  'use strict';
  if (!window.I18N || !window.CFG) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var SV = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var L8 = ['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr'];
  var D = {
    'ab.lt': ["Obyektni o'z ko'zingiz bilan ko'ring", 'Увидьте объект своими глазами', 'See the residence with your own eyes', 'Découvrez la résidence de vos propres yeux', 'Visita la residenza di persona', 'Vea la residencia con sus propios ojos', 'Erleben Sie die Residenz vor Ort', 'Projeyi kendi gözlerinizle görün'],
    'ab.ld': ["Bepul sayohat: menejer sizni obyekt va namuna xonadonga olib boradi.", 'Бесплатная экскурсия: менеджер покажет объект и шоу-рум квартиру.', 'Free tour: a manager will show you the site and the show apartment.', "Visite gratuite : un conseiller vous montre le chantier et l'appartement témoin.", "Visita gratuita: un consulente ti mostra il cantiere e l'appartamento campione.", 'Visita gratuita: un asesor le muestra la obra y el piso piloto.', 'Kostenlose Besichtigung: Ein Berater zeigt Ihnen Baustelle und Musterwohnung.', 'Ücretsiz tur: danışmanımız size projeyi ve örnek daireyi gösterir.'],
    'ab.lb': ['Sayohatga yozilish', 'Записаться на экскурсию', 'Book a tour', 'Réserver une visite', 'Prenota una visita', 'Reservar una visita', 'Besichtigung buchen', 'Tura kaydol']
  };
  L8.forEach(function (l, i) { var o = {}; Object.keys(D).forEach(function (k) { o[k] = D[k][i]; }); I18N.extend(l, o); });
  var t = function (k, o) { return I18N.t(k, o); };
  var ref = function (u) { if (!u) return Promise.resolve(''); return String(u).indexOf('idb:') === 0 && window.Store && Store.mediaURL ? Store.mediaURL(u) : Promise.resolve(u); };

  /* ---------- 1) Instagram profil rasmi: Instagram'dagi rasm almashsa — saytda ham o'zi almashadi ----------
     Tartib: Instagram'dan olingan oxirgi rasm (6 soatda bir yangilanadi) → kabinetda yuklangan rasm → standart rasm (hozirgi IG logotipi) */
  var AVD = 'assets/img/ig-avatar.jpg';
  var lsg = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  window.AH_IG_AV = function () { return lsg('ah_ig_av') || CFG.IG_AVATAR || AVD; };
  function avSet(u) { $$('img.igs2-avi').forEach(function (i) { if (i.src !== u) i.src = u; }); }
  function avRefresh(force) {
    var h = String(CFG.INSTAGRAM_HANDLE || '@arthouse.tashkent').replace(/^@/, '').trim(); if (!h || navigator.onLine === false) return;
    var last = +lsg('ah_ig_av_t') || 0, same = lsg('ah_ig_av_h') === h;
    if (!force && same && lsg('ah_ig_av') && Date.now() - last < 6 * 3600e3) return;
    var U = 'https://unavatar.io/instagram/' + encodeURIComponent(h) + '?fallback=false';
    fetch(U).then(function (r) { if (!r.ok) throw r.status; return r.blob(); })
      .then(function (b) { if (!/^image\//.test(b.type) || b.size < 600) throw 0; return new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.readAsDataURL(b); }); })
      .then(function (d) { try { localStorage.setItem('ah_ig_av', d); localStorage.setItem('ah_ig_av_t', String(Date.now())); localStorage.setItem('ah_ig_av_h', h); } catch (e) {} avSet(d); })
      .catch(function () { /* CORS yoki tarmoq: rasmni to'g'ridan-to'g'ri qo'yib ko'ramiz, xato bo'lsa — eski rasm qoladi */
        var im = new Image(); im.onload = function () { if (im.naturalWidth > 20) avSet(U); }; im.src = U; });
  }
  window.AH_IG_AV_REFRESH = avRefresh;
  setTimeout(function () { avSet(AH_IG_AV()); avRefresh(); }, 1200);

  /* ---------- 3) «Biz haqimizda»: ariza tugmasi ---------- */
  var EYE = '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>';
  var ARR = '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>';
  function about() {
    $$('.ths-about .ths-about-copy').forEach(function (c) {
      var old = $('.ab-lead', c); if (old) old.remove();
      c.insertAdjacentHTML('beforeend', '<div class="ab-lead"><i>' + SV(EYE) + '</i><div><b>' + esc(t('ab.lt')) + '</b><small>' + esc(t('ab.ld')) + '</small></div><button type="button" class="ab-btn" data-ab-tour>' + esc(t('ab.lb')) + SV(ARR) + '</button></div>');
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-ab-tour]'); if (!b) return;
    if (window.AH_SITE && AH_SITE.book) AH_SITE.book({ topic: t('ab.lb') }); else if (window.AH_POP) AH_POP.open('offer');
  });

  /* ---------- 4) 1-2-3 o'rniga ikonkalar ---------- */
  var IC = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    visit: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M10 21v-5h4v5"/><path d="M9 11h.01M15 11h.01"/>',
    sign: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6"/><path d="M8 17c1.5-2 2.5-2 3.5 0s2 2 4.5-1"/>',
    pct: '<circle cx="12" cy="12" r="9.5"/><path d="m15 9-6 6"/><path d="M9.2 9.2h.01M14.8 14.8h.01"/>',
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/>', calc: '<rect x="4.5" y="2.5" width="15" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4"/>',
    build: '<path d="M4 21V5l7-3v19"/><path d="M11 21V9l9 3v9"/><path d="M2 21h20M7 8v.01M7 12v.01M7 16v.01M15 14v.01M15 17v.01"/>', pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5h.01"/>', social: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'
  };
  function steps() {
    var K = ['phone', 'visit', 'sign', 'pct'];
    $$('.steps .step').forEach(function (s, i) {
      if (s.classList.contains('icx')) return; var h = $('h4', s), p = $('p', s); if (!h) return;
      s.classList.add('icx'); var n = $('i', s); if (n) n.remove(); s.insertAdjacentHTML('afterbegin', SV(IC[K[i % K.length]]));
    });
    var MK = { home: 'home', calculator: 'calc', projects: 'build', location: 'pin', about: 'info', social: 'social', contact: 'phone' };
    $$('.menu a[data-route] > i').forEach(function (i) { var k = MK[i.parentNode.dataset.route]; if (!k || i.classList.contains('mi')) return; i.className = 'mi'; i.innerHTML = SV(IC[k]); });
  }

  /* ---------- 8) mavzu: header va logo, shriftlar, fonlar, bo'lim fonlari, Custom CSS ---------- */
  function hdr(s) {
    $$('.brand').forEach(function (b) {
      var mark = $('.brand-mark', b), txt = $('.brand-txt b', b), sub = $('.brand-txt small', b), img = $('.brand-img', b);
      if (txt && txt.dataset.o == null) txt.dataset.o = txt.textContent;
      if (sub && sub.dataset.oi == null) sub.dataset.oi = sub.getAttribute('data-i') || '';
      if (s.logoImg) ref(s.logoImg).then(function (u) { if (!u) return; if (!img) { img = document.createElement('img'); img.className = 'brand-img'; img.alt = 'ART HOUSE'; (mark || b.firstChild) ? b.insertBefore(img, mark || b.firstChild) : b.appendChild(img); } if (img.src !== u) img.src = u; if (mark && mark.style.display !== 'none') mark.style.display = 'none'; });
      else { if (img) img.remove(); if (mark && mark.style.display) mark.style.display = ''; }
      var want = s.logoText || txt && txt.dataset.o; if (txt && txt.textContent !== want) txt.textContent = want;
      if (sub) { if (s.logoSub) { sub.removeAttribute('data-i'); if (sub.textContent !== s.logoSub) sub.textContent = s.logoSub; } else if (sub.dataset.oi && !sub.getAttribute('data-i')) { sub.setAttribute('data-i', sub.dataset.oi); sub.textContent = t(sub.dataset.oi); } }
      var tw = $('.brand-txt', b), dsp = s.logoTextOff ? 'none' : ''; if (tw && tw.style.display !== dsp) tw.style.display = dsp;
    });
  }
  function selOf(id) { var n = window.AH_THEMES && AH_THEMES.native ? AH_THEMES.native(id) : null; return id === 'ann' ? '.top > .ann' : (n && n.find ? n.find + ', [data-ths="' + id + '"]' : '[data-ths="' + id + '"]'); }
  var hex = function (v) { return /^#[0-9a-f]{3,8}$/i.test(String(v || '')) ? v : ''; };
  /* ---------- sahifa foni: video yoki rasm (alohida qatlam, matn ustida qolmaydi) ---------- */
  function bgMedia(s) {
    var want = s.pageVid || s.pageImg, host = document.getElementById('ahBgMedia');
    document.documentElement.classList.toggle('ah-bgmedia', !!want);
    if (!want) { if (host && host.parentNode) host.parentNode.removeChild(host); return; }
    if (!host) { host = document.createElement('div'); host.id = 'ahBgMedia'; host.setAttribute('aria-hidden', 'true'); document.body.insertBefore(host, document.body.firstChild); }
    host.style.setProperty('--ah-bg-ov', +s.pageOv || 55);
    var key = (s.pageVid || '') + '|' + (s.pageImg || '');
    if (host.dataset.k === key) return;
    host.dataset.k = key; host.textContent = '';
    if (s.pageVid) ref(s.pageVid).then(function (u) {
      if (!u || host.dataset.k !== key) return;
      var v = document.createElement('video');
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto';
      if (s.pageImg) ref(s.pageImg).then(function (pi) { if (pi) v.poster = pi; });
      v.src = u; host.appendChild(v);
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    });
    else ref(s.pageImg).then(function (u) {
      if (!u || host.dataset.k !== key) return;
      var i = new Image(); i.decoding = 'async'; i.alt = ''; i.src = u; host.appendChild(i);
    });
  }
  /* ---------- bo'lim foni: video ---------- */
  function secVideo(sel, c) {
    $$(sel).forEach(function (el) {
      var old = $('.ths-bgv', el), want = c.bgT === 'vid' && c.bgVid;
      if (!want) { if (old && old.parentNode) old.parentNode.removeChild(old); return; }
      var key = c.bgVid + '|' + (c.bgPoster || '');
      if (old && old.dataset.k === key) { old.style.setProperty('--ov', +c.bgOv || 45); return; }
      if (old && old.parentNode) old.parentNode.removeChild(old);
      var box = document.createElement('div');
      box.className = 'ths-bgv'; box.dataset.k = key; box.setAttribute('aria-hidden', 'true');
      box.style.setProperty('--ov', +c.bgOv || 45);
      el.insertBefore(box, el.firstChild);
      ref(c.bgVid).then(function (u) {
        if (!u || !box.parentNode) return;
        var v = document.createElement('video');
        v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'metadata';
        if (c.bgPoster) ref(c.bgPoster).then(function (pi) { if (pi) v.poster = pi; });
        v.src = u; box.appendChild(v);
        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
      });
    });
  }
  window.AH_CSS = function (th) {
    th = th || {}; var s = th.s || {}, css = '', jobs = [], F = window.AH_FONTS || {};
    /* shriftlar */
    var fh = F[s.fontH], fb = F[s.fontB];
    if (window.AH_FONT_LOAD) AH_FONT_LOAD([s.fontH, s.fontB]);
    if (fh) css += ':root{--f-display:' + fh.css + ' !important}h1,h2,.h-page,.sec-head h2,.ths h2,.hero h1{font-family:' + fh.css + ' !important}';
    if (fb) css += ':root{--f-body:' + fb.css + ' !important}body,button,input,select,textarea{font-family:' + fb.css + '}';
    if (s.fontLogo && F[s.fontLogo]) css += ':root{--f-logo:' + F[s.fontLogo].css + ' !important}';
    /* header va e'lon qatori */
    if (hex(s.hdrBg)) css += ':root{--hdr-bg:' + s.hdrBg + '}.top{background:' + s.hdrBg + ' !important}';
    if (hex(s.hdrInk)) css += ':root{--hdr-ink:' + s.hdrInk + '}.top .top-row,.top .top-row a,.top .top-row button,.top .ic,.top .lang-btn b{color:' + s.hdrInk + ' !important}.top .brand-txt b{background:none !important;-webkit-text-fill-color:' + s.hdrInk + ';color:' + s.hdrInk + ' !important;animation:none !important}.top .brand-mark{stroke:' + s.hdrInk + ' !important}';
    if (hex(s.annBg)) css += '.top > .ann{background:' + s.annBg + ' !important}';
    if (hex(s.annInk)) css += '.top > .ann,.top > .ann *{color:' + s.annInk + ' !important}';
    if (+s.logoSize) css += '.top .brand-mark,.top .brand-img{width:' + (+s.logoSize) + 'px !important;height:' + (+s.logoSize) + 'px !important}';
    if (s.logoPos === 'left') css += '.top .brand{justify-self:start !important}';
    if (s.sticky === false) css += '.top{position:relative !important}';
    /* umumiy fonlar */
    if (hex(s.lightBg)) css += '.ths-light{--t-bg:' + s.lightBg + ' !important;background:' + s.lightBg + ' !important}';
    if (hex(s.footBg)) css += 'html body .foot{background:' + s.footBg + ' !important}';
    if (hex(s.cardBg)) css += '.card,.ths-card{background:' + s.cardBg + ' !important}';
    bgMedia(s);
    if (s.pageImg && !s.pageVid) jobs.push(ref(s.pageImg).then(function (u) { if (!u) return ''; var o = (+s.pageOv || 55) / 100; return 'html,body{background:linear-gradient(rgba(4,22,16,' + o + '),rgba(4,22,16,' + o + ')),url("' + u + '") center/cover fixed no-repeat !important}'; }));
    if (s.css) css += '\n/* mavzu: Custom CSS */\n' + s.css + '\n';
    /* bo'limlar */
    Object.keys(th.sec || {}).forEach(function (id) {
      var c0 = th.sec[id] || {}, c = Object.assign({}, c0, c0.s || {}), S = selOf(id), q = S.split(',').map(function (x) { return x.trim(); });
      var all = function (r) { return q.map(function (x) { return x + r; }).join(','); };
      if (c.bgT === 'color') css += all('') + '{background:' + (hex(c.bgC1) || '#0B392C') + ' !important}' + all('::before') + ',' + all('::after') + '{display:none !important}';
      if (c.bgT === 'grad') css += all('') + '{background:linear-gradient(' + (+c.bgA || 180) + 'deg,' + (hex(c.bgC1) || '#0B392C') + ',' + (hex(c.bgC2) || '#072A20') + ') !important}';
      if (c.bgT === 'img' && c.bgImg) jobs.push(ref(c.bgImg).then(function (u) { if (!u) return ''; var o = (+c.bgOv || 45) / 100; return all('') + '{background:linear-gradient(rgba(4,22,16,' + o + '),rgba(4,22,16,' + o + ')),url("' + u + '") center/cover no-repeat !important}'; }));
      secVideo(q[0], c);
      if (hex(c.bgInk)) css += all('') + '{color:' + c.bgInk + ' !important;--ink:' + c.bgInk + ';--t-ink:' + c.bgInk + '}' + all(' h2') + ',' + all(' h3') + ',' + all(' p') + '{color:' + c.bgInk + ' !important}';
      var sf = F[c.font], sb = F[c.fontB];
      if (sf || sb) { if (window.AH_FONT_LOAD) AH_FONT_LOAD([s.fontH, s.fontB, s.fontLogo, c.font, c.fontB]); }
      if (sf) css += all('') + '{--f-display:' + sf.css + '}' + all(' h1') + ',' + all(' h2') + ',' + all(' h3') + ',' + all(' h4') + '{font-family:' + sf.css + ' !important}';
      if (sb) css += all('') + '{--f-body:' + sb.css + ';font-family:' + sb.css + '}' + all(' p') + ',' + all(' li') + ',' + all(' span') + ',' + all(' a') + ',' + all(' button') + '{font-family:' + sb.css + '}';
      if (c.css && String(c.css).trim()) css += q[0] + ' {\n' + c.css + '\n}\n';
    });
    var el = document.getElementById('ahCustomCss'); if (!el) { el = document.createElement('style'); el.id = 'ahCustomCss'; }
    document.head.appendChild(el); if (el.textContent !== css) el.textContent = css;
    Promise.all(jobs).then(function (a) { var x = a.join(''); if (!x) return; var e2 = document.getElementById('ahCustomCss2'); if (!e2) { e2 = document.createElement('style'); e2.id = 'ahCustomCss2'; } document.head.appendChild(e2); e2.textContent = x; });
    if (!jobs.length) { var e3 = document.getElementById('ahCustomCss2'); if (e3) e3.textContent = ''; }
    hdr(s);
    window.AH_CUR_TH = th;
  };
  function all() { steps(); about(); try { AH_CSS(window.AH_CUR_TH || (window.AH_THEMES ? AH_THEMES.liveOf(window.AH_CMS) : {})); } catch (e) {} }
  all();
  I18N.on(function () { setTimeout(all, 60); });
  if ('MutationObserver' in window) { var mt = 0; new MutationObserver(function () { clearTimeout(mt); mt = setTimeout(function () { steps(); if (!$('.ths-about .ab-lead')) about(); if (window.AH_CUR_TH) hdr(AH_CUR_TH.s || {}); }, 150); }).observe(document.getElementById('app') || document.body, { childList: true, subtree: true }); }
})();
