/* =====================================================================
   ART HOUSE — SAYT BOSHQARUVI (CMS) · 3/3 — sahifadagi ish vaqti
   • Bo'limlarni yoqish/o'chirish, yangi bo'limlar (matn, rasm, video, Canva/Figma, Telegram tugmasi)
   • Keng menyu (kompyuter) va to'liq ekranli menyu (telefon)
   • Loyiha video-lavhalari, kabinetdan yuklangan rasm/videolarni ko'rsatish (idb:)
   • Saytda jonli tahrirlash rejimi (kabinet → Sozlamalar → Matnlar → «Saytda tahrirlash»)
   • Nashr qilingan kontent: site-content.json yoki server (CFG.API_URL/api/cms)
   ===================================================================== */
(function () {
  'use strict';
  var C = window.AH_CMS || {}, P = window.PROJECTS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pick = function (o) { return I18N.pick(o); };
  var t = function (k, v) { return I18N.t(k, v); };
  var API = (CFG.API_URL === 'auto' ? (location.protocol.indexOf('http') === 0 ? location.origin : '') : (CFG.API_URL || '')).replace(/\/$/, '');
  var ROUTES = ['home', 'calculator', 'projects', 'location', 'about', 'social', 'contact', 'reviews'];
  var SEC = C.sections || {}, OFF = (SEC.off || []).filter(function (r) { return r !== 'home'; });
  var CUSTOM = (SEC.custom || []).filter(function (s) { return s && s.id && s.on !== false; });

  /* ---------- media: idb:… havolalarini ko'rsatish ---------- */
  var MU = {};
  function mediaFix(root) {
    $$('[src^="idb:"],[poster^="idb:"],[data-src^="idb:"]', root).forEach(function (el) {
      ['src', 'poster', 'data-src'].forEach(function (a) {
        var v = el.getAttribute(a); if (!v || v.indexOf('idb:') !== 0) return;
        if (MU[v]) { el.setAttribute(a === 'data-src' ? 'src' : a, MU[v]); return; }
        el.setAttribute(a, ''); el.dataset.ref = v;
        Store.mediaURL(v).then(function (u) { if (u) { MU[v] = u; el.setAttribute(a === 'data-src' ? 'src' : a, u); } });
      });
    });
  }
  new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) mediaFix(n.parentNode || n); }); }); })
    .observe(document.body, { childList: true, subtree: true });
  mediaFix(document);

  /* ---------- raqamlar (CFG) ---------- */
  function nums() {
    var mx = Math.max.apply(null, CFG.MONTHS || [36]);
    var V = { projects: CFG.PROJECTS_DONE, years: CFG.EXPERIENCE_YEARS, 'ig-followers': CFG.IG_FOLLOWERS, 'ig-posts': CFG.IG_POSTS, 'months-max': mx, 'down-min': (CFG.DOWN_MIN != null ? CFG.DOWN_MIN : 30) + '%' };
    $$('[data-cms]').forEach(function (el) { var v = V[el.getAttribute('data-cms')]; if (v != null && v !== '') el.textContent = v; });
    var dl = $('#cDown'); if (dl && CFG.DOWN_MIN != null) dl.min = CFG.DOWN_MIN;
  }

  /* ---------- yangi bo'limlar ---------- */
  function ytId(u) { var m = String(u || '').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/); return m ? m[1] : ''; }
  function embedURL(u) {
    u = String(u || '').trim(); if (!/^https:\/\//.test(u)) return '';
    var y = ytId(u); if (y) return 'https://www.youtube-nocookie.com/embed/' + y;
    if (/canva\.com\/design\//.test(u)) return u.split('?')[0].replace(/\/(edit|view)$/, '') + '/view?embed';
    if (/figma\.com\/(file|design|proto|board)\//.test(u)) return 'https://www.figma.com/embed?embed_host=arthouse&url=' + encodeURIComponent(u);
    return u;
  }
  window.AH_EMBED = embedURL;
  function media(s) {
    var h = '';
    if (s.video) { var y = ytId(s.video); h += y ? '<div class="cms-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + y + '" title="Video" loading="lazy" allowfullscreen></iframe></div>' : '<video class="cms-vid" src="' + esc(s.video) + '" controls playsinline preload="metadata"' + (s.img ? ' poster="' + esc(s.img) + '"' : '') + '></video>'; }
    else if (s.img) h += '<img class="cms-img" src="' + esc(s.img) + '" alt="" loading="lazy" decoding="async">';
    if (s.embed && embedURL(s.embed)) h += '<div class="cms-frame"><iframe src="' + esc(embedURL(s.embed)) + '" title="Canva / Figma" loading="lazy" allowfullscreen allow="fullscreen"></iframe></div>';
    return h;
  }
  function renderCustom() {
    CUSTOM.forEach(function (s) {
      var id = 'cms-' + s.id, sec = document.getElementById('p-' + id);
      if (!sec) { sec = document.createElement('section'); sec.className = 'page cms-page'; sec.id = 'p-' + id; sec.dataset.page = id; sec.hidden = true; $('#app').appendChild(sec); }
      var body = String(pick(s.text) || '').split(/\n{2,}/).map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
      var btn = s.btn && s.btn.url ? '<a class="btn btn-gold" href="' + esc(s.btn.url) + '"' + (/^https?:/.test(s.btn.url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(pick(s.btn.t) || 'Telegram') + '<svg class="ic"><use href="#' + (/t\.me\//.test(s.btn.url) ? 'i-tg' : 'i-arrow') + '"/></svg></a>' : '';
      sec.innerHTML = '<div class="wrap page-head">' + (pick(s.eyebrow) ? '<p class="eyebrow">' + esc(pick(s.eyebrow)) + '</p>' : '') + '<h2 class="h-page">' + esc(pick(s.title)) + '</h2></div>' +
        '<div class="wrap"><div class="card cms-card">' + media(s) + '<div class="cms-text">' + body + (btn ? '<div class="cta-row">' + btn + '</div>' : '') + '</div></div></div>';
      var a = $('.menu a[data-route="' + id + '"]');
      if (!a) { a = document.createElement('a'); a.href = '#' + id; a.dataset.route = id; a.innerHTML = '<i></i><span></span>'; var rev = $('.menu .menu-rev'); rev ? rev.parentNode.insertBefore(a, rev) : $('.menu-track').appendChild(a); }
      a.querySelector('span').textContent = pick(s.title);
    });
  }
  function hideOff() {
    OFF.forEach(function (r) {
      var a = $('.menu a[data-route="' + r + '"]'); if (a) a.hidden = true;
      var p = $('#p-' + r); if (p) p.hidden = true;
      $$('a[href="#' + r + '"]').forEach(function (x) { if (x.closest('.menu,.foot,.mnav')) { var li = x.closest('li'); (li || x).hidden = true; } else if (x.closest('.teaser')) { var c = x.closest('.teaser'); if (c) c.hidden = true; } });
    });
    var n = 0;
    $$('.menu-track > a').forEach(function (a) { if (a.hidden || a.classList.contains('menu-rev')) return; var i = a.querySelector('i'); if (i) i.textContent = String(++n).padStart(2, '0'); });
  }
  function footer() {
    var ul = $('#footLinks'); if (!ul) return;
    CUSTOM.forEach(function (s) { if (!ul.querySelector('a[href="#cms-' + s.id + '"]')) ul.insertAdjacentHTML('beforeend', '<li><a href="#cms-' + esc(s.id) + '"></a></li>'); ul.querySelector('a[href="#cms-' + s.id + '"]').textContent = pick(s.title); });
  }

  /* ---------- marshrut: yangi bo'limlar va o'chirilgan bo'limlar ---------- */
  function route() {
    var page = (location.hash || '#home').slice(1).split('/')[0];
    if (OFF.indexOf(page) > -1) { location.replace('#home'); return; }
    var isC = page.indexOf('cms-') === 0 && document.getElementById('p-' + page);
    if (!isC && ROUTES.indexOf(page) < 0) page = 'home';
    $$('.page').forEach(function (s) { s.hidden = s.dataset.page !== page; });
    $$('.menu a').forEach(function (a) { var on = a.dataset.route === page; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $$('.mnav a[data-route]').forEach(function (a) { a.classList.toggle('active', a.dataset.route === page); });
    if (isC) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.title = $('.menu a[data-route="' + page + '"] span').textContent + ' — ART HOUSE — Luxury Residence';
      $$('#p-' + page + ' .card').forEach(function (c) { c.classList.add('in'); });
    }
    var hv = $('#heroVideo'); if (hv) { if (page === 'home' && !document.hidden) { var pr = hv.play(); if (pr && pr.catch) pr.catch(function () {}); } else hv.pause(); }
    closeMnav();
  }

  /* ---------- telefon uchun to'liq ekranli menyu ---------- */
  var mnav = null;
  function buildMnav() {
    if (!mnav) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mnav-btn'; b.setAttribute('aria-haspopup', 'dialog');
      b.innerHTML = '<span class="mnav-ico"><i></i><i></i><i></i></span><span data-i="nav.menu">Menyu</span>';
      var tr = $('.top-row'); tr.insertBefore(b, tr.firstChild);
      mnav = document.createElement('div'); mnav.className = 'mnav'; mnav.hidden = true; mnav.setAttribute('role', 'dialog'); mnav.setAttribute('aria-modal', 'true');
      document.body.appendChild(mnav);
      b.addEventListener('click', function () { openMnav(); });
      mnav.addEventListener('click', function (e) {
        var pj = e.target.closest('[data-proj]');
        if (pj) setTimeout(function () { var tb = $('#projTabs [data-p="' + pj.dataset.proj + '"]'); if (tb) tb.click(); }, 120);
        if (e.target.closest('[data-mclose]') || e.target.closest('a')) closeMnav();
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMnav(); });
      I18N.apply(b);
    }
    /* ICON uslubidagi menyu: tepada ikki rasmli karta, keyin ikonkasiz, toza guruhlangan ro'yxat */
    var CARDS = [{ id: 'musaffo', img: 'assets/img/musaffo/majmua-kechki.webp' }, { id: 'obod', img: 'assets/img/obod/obod-joylashuv.webp' }];
    var name = function (id) { var pr = P.filter(function (x) { return x.id === id; })[0]; return pr ? pick(pr.name) : ''; };
    var lbl = function (r) { var a = $('.menu-track > a[data-route="' + r + '"] span'); return a ? a.textContent : r; };
    var cards = CARDS.map(function (c) { return name(c.id) ? '<a class="mnav-card" href="#projects" data-proj="' + c.id + '"><img src="' + c.img + '" alt="" loading="lazy"><span>' + esc(name(c.id)) + '</span></a>' : ''; }).join('');
    var row = function (href, text, extra, d) { return '<a href="' + href + '"' + (extra || '') + ' style="--d:' + d + '"><span>' + esc(text) + '</span><svg class="ic"><use href="#i-right"/></svg></a>'; };
    var cur = (location.hash || '#home').slice(1).split('/')[0];
    var main = '<a class="mnav-hl" href="#calculator" style="--d:0">' + esc(t('mn.promo')) + '</a>' +
      ['home', 'projects', 'calculator'].map(function (r, i) { return '<a class="mnav-big' + (cur === r ? ' active' : '') + '" href="#' + r + '" data-route="' + r + '" style="--d:' + (i + 1) + '">' + esc(lbl(r)) + '</a>'; }).join('');
    var projs = P.map(function (pr, i) { return row('#projects', pick(pr.name), ' data-proj="' + pr.id + '"', i + 4); }).join('');
    var secs = ['location', 'about', 'social', 'reviews', 'contact'].map(function (r, i) { return row('#' + r, lbl(r), ' data-route="' + r + '"' + (cur === r ? ' class="active"' : ''), i + 7); }).join('');
    var serv = '<a href="tel:' + esc(CFG.PHONE) + '" data-phone>' + esc(t('call.phone')) + '</a>' + (CFG.TELEGRAM_CHANNEL ? '<a href="' + esc(CFG.TELEGRAM_CHANNEL) + '" target="_blank" rel="noopener">Telegram</a>' : '') +
      (CFG.INSTAGRAM ? '<a href="' + esc(CFG.INSTAGRAM) + '" target="_blank" rel="noopener">Instagram</a>' : '') + '<a href="kabinet.html">' + esc(t('nav.cabinet')) + '</a>';
    mnav.innerHTML = '<div class="mnav-scrim" data-mclose></div><aside class="mnav-in"><button type="button" class="mnav-x" data-mclose aria-label="' + esc(t('aria.close')) + '"><svg class="ic"><use href="#i-x"/></svg></button>' +
      (cards ? '<div class="mnav-cards">' + cards + '</div>' : '') +
      '<nav class="mnav-main">' + main + '</nav>' +
      '<p class="mnav-sub">' + esc(t('nav.projects')) + '</p><nav class="mnav-list">' + projs + '</nav>' +
      '<p class="mnav-sub">' + esc(t('nav.menuSub')) + '</p><nav class="mnav-list">' + secs + '</nav>' +
      '<p class="mnav-sub">' + esc(t('mn.service')) + '</p><nav class="mnav-serv">' + serv + '</nav></aside>';
  }
  function openMnav() { buildMnav(); mnav.hidden = false; requestAnimationFrame(function () { mnav.classList.add('open'); }); document.body.classList.add('lock'); }
  function closeMnav() { if (!mnav || mnav.hidden) return; mnav.classList.remove('open'); document.body.classList.remove('lock'); setTimeout(function () { mnav.hidden = true; }, 380); }

  /* ---------- loyiha video-lavhalari ---------- */
  function curProject() { var b = $('#projTabs [aria-selected="true"]'); return b ? b.dataset.p : (P[0] || {}).id; }
  function projVideos() {
    var box = $('#projDetail'); if (!box || !box.firstChild || box.querySelector('.pvids')) return;
    var p = P.filter(function (x) { return x.id === curProject(); })[0];
    if (!p || !p.videos || !p.videos.length) return;
    var h = '<div class="sec-head reveal in"><h2>' + esc(t('proj.video')) + '</h2></div><div class="pvids">' + p.videos.map(function (v) {
      var y = ytId(v.src);
      return '<figure class="pvid' + (v.vert ? ' vert' : '') + '">' + (y ? '<iframe src="https://www.youtube-nocookie.com/embed/' + y + '" title="' + esc(pick(v.t)) + '" loading="lazy" allowfullscreen></iframe>'
        : '<video src="' + esc(v.src) + '"' + (v.poster ? ' poster="' + esc(v.poster) + '"' : '') + ' controls playsinline preload="metadata"></video>') + (pick(v.t) ? '<figcaption>' + esc(pick(v.t)) + '</figcaption>' : '') + '</figure>';
    }).join('') + '</div>';
    var hero = box.querySelector('.pd-hero');
    if (hero) hero.insertAdjacentHTML('afterend', h); else box.insertAdjacentHTML('beforeend', h);
    $$('.pvid video', box).forEach(function (v) { v.addEventListener('error', function () { var f = v.closest('.pvid'); if (f) f.remove(); }); });
  }
  var pd = $('#projDetail'); if (pd) new MutationObserver(function () { projVideos(); }).observe(pd, { childList: true });
  var fv = $('#festVideo'); if (fv) { fv.setAttribute('preload', 'metadata'); fv.addEventListener('error', function () { var c = fv.closest('.fest'); if (c) c.hidden = true; }); try { fv.load(); } catch (e) {} }
  /* video fayli topilmasa — bo'sh qora oyna ko'rsatilmaydi (manba xatosi <source> da ham ushlanadi) */
  document.addEventListener('error', function (e) { var el = e.target; if (!el || (el.tagName !== 'VIDEO' && el.tagName !== 'SOURCE')) return; var v = el.tagName === 'SOURCE' ? el.parentNode : el; if (v.id === 'heroVideo') return; var box = v.closest('.pvid,.fest,.cms-gi'); if (box) box.hidden = true; }, true);

  /* ---------- kabinetdan qo'shilgan foto va video galereya ---------- */
  var MD = C.media || {}, GI = (MD.items || []).filter(function (x) { return x && x.src && x.on !== false; });
  function gallery() {
    var old = $('#cmsGal'); if (old) old.remove();
    if (!GI.length || MD.place === 'off') return;
    var host = MD.place === 'about' ? $('#p-about') : $('#p-home');
    if (!host) return;
    var box = document.createElement('div'); box.id = 'cmsGal'; box.className = 'wrap block cms-gal';
    box.innerHTML = '<div class="sec-head reveal in"><p class="eyebrow" data-i="gal.eyebrow">Galereya</p><h2 data-i="gal.title">Foto va video</h2></div><div class="cms-gal-grid">' + GI.map(function (x, i) {
      var cap = pick(x.t), y = x.type === 'video' && ytId(x.src);
      var m = x.type === 'video' ? (y ? '<iframe src="https://www.youtube-nocookie.com/embed/' + y + '" title="' + esc(cap || 'Video') + '" loading="lazy" allowfullscreen></iframe>'
        : '<video src="' + esc(x.src) + '"' + (x.poster ? ' poster="' + esc(x.poster) + '"' : '') + ' controls playsinline preload="metadata"></video>')
        : '<button type="button" data-gi="' + i + '"><img src="' + esc(x.src) + '" alt="' + esc(cap) + '" loading="lazy" decoding="async"></button>';
      return '<figure class="cms-gi' + (x.type === 'video' ? ' v' : '') + '">' + m + (cap ? '<figcaption>' + esc(cap) + '</figcaption>' : '') + '</figure>';
    }).join('') + '</div>';
    if (MD.place === 'about') host.appendChild(box);
    else { var cta = $('#p-home .cta-band'); cta ? cta.closest('.wrap').before(box) : host.appendChild(box); }
    I18N.apply(box); mediaFix(box);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#cmsGal [data-gi]'); if (!b) return;
    var lb = $('#cmsLb'); if (!lb) { lb = document.createElement('div'); lb.id = 'cmsLb'; lb.className = 'cms-lb'; document.body.appendChild(lb); lb.addEventListener('click', function (ev) { if (!ev.target.closest('img')) { lb.hidden = true; document.body.classList.remove('lock'); } }); }
    var img = b.querySelector('img'); lb.innerHTML = '<button type="button" class="modal-x" aria-label="' + esc(t('aria.close')) + '"><svg class="ic"><use href="#i-x"/></svg></button><img src="' + img.src + '" alt="">';
    lb.hidden = false; document.body.classList.add('lock');
  });
  var FS = MD.fest || {}, fvd = $('#festVideo');
  if (fvd && (FS.video || FS.poster)) { if (FS.poster) fvd.setAttribute('poster', FS.poster); if (FS.video) fvd.setAttribute('src', FS.video); mediaFix(fvd.parentNode); }

  function all() { renderCustom(); hideOff(); footer(); nums(); buildMnav(); projVideos(); gallery(); if (window.AH_POST) AH_POST(); }
  all();
  I18N.on(function () { setTimeout(all, 0); });
  Store.on('settings', nums);
  window.addEventListener('hashchange', route);
  route();
  window.addEventListener('resize', function () { if (innerWidth > 860) closeMnav(); }, { passive: true });

  /* ---------- kabinet uchun: matnlar katalogi va asl rasmlar (IndexedDB) ---------- */
  function kv() {
    return new Promise(function (res, rej) {
      if (!('indexedDB' in window)) return rej(new Error('no-idb'));
      var r = indexedDB.open('arthouse-cms', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
      r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); };
    });
  }
  function snapshot() {
    var sig = window.AH_BUILD + '|' + Object.keys(I18N.dict.en || {}).length;
    var force = /[?&]cmsnap=1/.test(location.search);
    try { if (!force && localStorage.getItem('ah_cms_snap') === sig) return; } catch (e) { return; }
    var keys = {}, L = ['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr'];
    $$('[data-i]').forEach(function (e) { keys[e.getAttribute('data-i')] = 1; });
    $$('[data-i-ph]').forEach(function (e) { keys[e.getAttribute('data-i-ph')] = 1; });
    Object.keys(I18N.dict.en || {}).forEach(function (k) { keys[k] = 1; });
    var cat = {};
    Object.keys(keys).sort().forEach(function (k) {
      var row = {}; L.forEach(function (l) { try { row[l] = window.AH_T0(k, null, l); } catch (e) { row[l] = ''; } });
      if (row.uz === k && row.en === k) return; cat[k] = row;
    });
    var base = window.AH_BASE || {};
    kv().then(function (db) {
      var tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put({ at: Date.now(), build: window.AH_BUILD, cat: cat }, 'catalog');
      tx.objectStore('kv').put({ at: Date.now(), base: base }, 'base');
      tx.oncomplete = function () { try { localStorage.setItem('ah_cms_snap', sig); localStorage.setItem('ah_cms_cat_at', String(Date.now())); } catch (e) {} };
    }).catch(function () {});
  }
  if (/[?&]cmsnap=1/.test(location.search)) setTimeout(snapshot, 300);
  else (window.requestIdleCallback || function (f) { setTimeout(f, 1500); })(snapshot);

  /* ---------- nashr qilingan kontent (barcha tashrif buyuruvchilar uchun) ---------- */
  function adopt(R) {
    if (!R || typeof R !== 'object' || !R.v) return;
    if (C.v && C.v >= R.v) return;
    var g = ''; try { g = sessionStorage.getItem('ah_cms_r'); } catch (e) {}
    if (g === String(R.v)) return;
    try { localStorage.setItem('ah_cms', JSON.stringify(R)); sessionStorage.setItem('ah_cms_r', String(R.v)); location.reload(); }
    catch (e) { console.warn('ART HOUSE CMS: kontent juda katta, brauzer xotirasiga sig\'madi', e); }
  }
  if (location.protocol.indexOf('http') === 0) {
    fetch('site-content.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(adopt).catch(function () {});
    if (API) fetch(API + '/api/cms', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(adopt).catch(function () {});
  }
  /* kabinetda saqlansa — shu brauzerdagi sayt avtomatik yangilanadi */
  window.addEventListener('storage', function (e) { if (e.key === 'ah_cms' && !EDIT) location.reload(); });

  /* ---------- saytda jonli tahrirlash ---------- */
  var ED = {
    uz: ['Tahrirlash rejimi', 'Istalgan yozuvni bosing va o\'zgartiring', 'Saqlash', 'Aslini qaytarish', 'Bekor', 'Chiqish', 'Saqlandi', 'Til'],
    ru: ['Режим редактирования', 'Нажмите на любой текст и измените его', 'Сохранить', 'Вернуть исходный', 'Отмена', 'Выйти', 'Сохранено', 'Язык'],
    en: ['Edit mode', 'Click any text to change it', 'Save', 'Restore original', 'Cancel', 'Exit', 'Saved', 'Language'],
    fr: ['Mode édition', 'Cliquez sur un texte pour le modifier', 'Enregistrer', 'Rétablir l’original', 'Annuler', 'Quitter', 'Enregistré', 'Langue'],
    it: ['Modalità modifica', 'Clicca su un testo per modificarlo', 'Salva', 'Ripristina originale', 'Annulla', 'Esci', 'Salvato', 'Lingua'],
    es: ['Modo edición', 'Haga clic en un texto para cambiarlo', 'Guardar', 'Restaurar original', 'Cancelar', 'Salir', 'Guardado', 'Idioma'],
    de: ['Bearbeitungsmodus', 'Klicken Sie auf einen Text, um ihn zu ändern', 'Speichern', 'Original wiederherstellen', 'Abbrechen', 'Beenden', 'Gespeichert', 'Sprache'],
    tr: ['Düzenleme modu', 'Değiştirmek için bir metne tıklayın', 'Kaydet', 'Orijinali geri yükle', 'İptal', 'Çık', 'Kaydedildi', 'Dil']
  };
  function E(i) { var l = I18N.lang === 'cy' ? 'uz' : I18N.lang; var r = (ED[l] || ED.en)[i]; return I18N.lang === 'cy' ? I18N.toCyr(r) : r; }
  var EDIT = false;
  try { var tk = JSON.parse(localStorage.getItem('ah_edit') || 'null'); EDIT = /[?&#]edit\b/.test(location.search + location.hash) && tk && tk.exp > Date.now(); } catch (e) {}
  if (EDIT) {
    document.documentElement.classList.add('cms-edit');
    var bar = document.createElement('div'); bar.className = 'cms-bar';
    document.body.appendChild(bar);
    var pop = document.createElement('div'); pop.className = 'cms-pop'; pop.hidden = true; document.body.appendChild(pop);
    var drawBar = function () { bar.innerHTML = '<b>' + esc(E(0)) + '</b><span>' + esc(E(1)) + ' · ' + esc(E(7)) + ': ' + esc(I18N.info().short) + '</span><button type="button" data-x>' + esc(E(5)) + '</button>'; };
    drawBar(); I18N.on(drawBar);
    bar.addEventListener('click', function (e) { if (e.target.closest('[data-x]')) { try { localStorage.removeItem('ah_edit'); } catch (x) {} location.href = location.pathname; } });
    var cur = null;
    document.addEventListener('click', function (e) {
      if (e.target.closest('.cms-pop,.cms-bar,.lang,.menu,.mnav,.mnav-btn')) return;
      var el = e.target.closest('[data-i],[data-i-ph]'); if (!el) return;
      e.preventDefault(); e.stopPropagation();
      cur = el; var key = el.getAttribute('data-i') || el.getAttribute('data-i-ph'), ph = !el.hasAttribute('data-i');
      var val = ph ? el.getAttribute('placeholder') : el.textContent;
      var r = el.getBoundingClientRect();
      pop.innerHTML = '<small>' + esc(key) + ' · ' + esc(I18N.info().label) + '</small><textarea rows="4"></textarea><div><button type="button" class="btn btn-gold sm" data-s>' + esc(E(2)) + '</button><button type="button" class="btn btn-ghost sm" data-r>' + esc(E(3)) + '</button><button type="button" class="btn btn-ghost sm" data-c>' + esc(E(4)) + '</button></div>';
      pop.querySelector('textarea').value = val;
      pop.hidden = false;
      pop.style.top = Math.min(innerHeight - pop.offsetHeight - 12, Math.max(64, r.bottom + 8)) + 'px';
      pop.style.left = Math.max(12, Math.min(innerWidth - pop.offsetWidth - 12, r.left)) + 'px';
      pop.querySelector('textarea').focus();
      pop.dataset.k = key;
    }, true);
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-c')) { pop.hidden = true; return; }
      var key = pop.dataset.k, lg = I18N.lang === 'cy' ? 'uz' : I18N.lang, c = {};
      try { c = JSON.parse(localStorage.getItem('ah_cms') || '{}') || {}; } catch (x) {}
      c.text = c.text || {}; c.text[lg] = c.text[lg] || {};
      if (b.hasAttribute('data-s')) c.text[lg][key] = pop.querySelector('textarea').value.trim();
      else delete c.text[lg][key];
      c.v = Date.now();
      var log = []; try { log = JSON.parse(localStorage.getItem('ah_audit') || '[]'); } catch (x) {}
      var tk2 = {}; try { tk2 = JSON.parse(localStorage.getItem('ah_edit') || '{}'); } catch (x) {}
      log.unshift({ at: Date.now(), who: tk2.by || 'Direktor', a: b.hasAttribute('data-s') ? 'Saytda matn tahrirlandi' : 'Matn asliga qaytarildi', d: key + ' · ' + lg.toUpperCase() });
      try { localStorage.setItem('ah_cms', JSON.stringify(c)); localStorage.setItem('ah_audit', JSON.stringify(log.slice(0, 1000))); } catch (x) {}
      window.AH_CMS = c; pop.hidden = true;
      location.reload();
    });
  }
})();
