/* =====================================================================
   ART HOUSE — «Telegram kanalimizga obuna bo'ling» bloki (Instagram blokidan keyin)
   • Telefon ichida Telegram kanali: sarlavha paneli, harakatlanuvchi naqshli fon,
     kanal postlari (video yoki rasm + matn), «Kanalga qo'shilish» tugmasi.
   • Postlar yonga suriladi (yoki nuqtalar); video tugasa — keyingi post; rasm — 6 soniyadan so'ng.
   • Postlar: kabinet → Sayt → «Telegram» ('ah_cms'.tg.posts), bo'lmasa js/tg-posts.js.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var t = function (k) { return I18N.t(k); };
  var D = {
    uz: { 'tg.lead': "Qurilish jarayoni, yangi xonadonlar, aksiyalar va yopiq takliflar — eng avval Telegram kanalimizda.", 'tg.btn': "Telegram'da obuna bo'lish", 'tg.join': "Kanalga qo'shilish", 'tg.kind': 'kanal', 'tg.eyebrow': "Telegram kanalimizga obuna bo'ling" },
    ru: { 'tg.lead': 'Ход строительства, новые квартиры, акции и закрытые предложения — раньше всех в нашем Telegram-канале.', 'tg.btn': 'Подписаться в Telegram', 'tg.join': 'Вступить в канал', 'tg.kind': 'канал', 'tg.eyebrow': 'Подписывайтесь на наш Telegram-канал' },
    en: { 'tg.lead': 'Construction progress, new apartments, promotions and private offers — first on our Telegram channel.', 'tg.btn': 'Subscribe on Telegram', 'tg.join': 'Join channel', 'tg.kind': 'channel', 'tg.eyebrow': 'Subscribe to our Telegram channel' },
    fr: { 'tg.lead': 'Avancement du chantier, nouveaux appartements, promotions et offres privées — en avant-première sur notre chaîne Telegram.', 'tg.btn': "S'abonner sur Telegram", 'tg.join': 'Rejoindre la chaîne', 'tg.kind': 'chaîne', 'tg.eyebrow': 'Abonnez-vous à notre chaîne Telegram' },
    it: { 'tg.lead': 'Avanzamento dei lavori, nuovi appartamenti, promozioni e offerte riservate — prima di tutti sul nostro canale Telegram.', 'tg.btn': 'Iscriviti su Telegram', 'tg.join': 'Unisciti al canale', 'tg.kind': 'canale', 'tg.eyebrow': 'Iscriviti al nostro canale Telegram' },
    es: { 'tg.lead': 'Avance de obra, nuevos pisos, promociones y ofertas privadas — antes que nadie en nuestro canal de Telegram.', 'tg.btn': 'Suscribirse en Telegram', 'tg.join': 'Unirse al canal', 'tg.kind': 'canal', 'tg.eyebrow': 'Suscríbase a nuestro canal de Telegram' },
    de: { 'tg.lead': 'Baufortschritt, neue Wohnungen, Aktionen und exklusive Angebote — zuerst in unserem Telegram-Kanal.', 'tg.btn': 'Auf Telegram abonnieren', 'tg.join': 'Kanal beitreten', 'tg.kind': 'Kanal', 'tg.eyebrow': 'Abonnieren Sie unseren Telegram-Kanal' },
    tr: { 'tg.lead': 'İnşaat süreci, yeni daireler, kampanyalar ve özel teklifler — ilk olarak Telegram kanalımızda.', 'tg.btn': "Telegram'da abone ol", 'tg.join': 'Kanala katıl', 'tg.kind': 'kanal', 'tg.eyebrow': 'Telegram kanalımıza abone olun' }
  };
  Object.keys(D).forEach(function (l) { I18N.extend(l, D[l]); });

  var TGI = '<svg viewBox="0 0 240 240" aria-hidden="true"><defs><linearGradient id="tgG" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#2AABEE"/><stop offset="1" stop-color="#229ED9"/></linearGradient></defs><circle cx="120" cy="120" r="120" fill="url(#tgG)"/><path fill="#fff" d="M54.3 118.8c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.3-16.3 44.8-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3.1 1 .3 3.1.1 4.7-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.9 11.4-50.6 33.5-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.6-4.4-7.5-2.4-13.5-3.7-12.9-7.9.3-2.2 3.3-4.4 8.9-6.7z"/></svg>';
  var tgN = 0, TG = function () { return TGI.replace(/tgG/g, 'tgG' + (++tgN)); };
  var pick = function (o) { var l = I18N.lang; o = o || {}; return o[l] || (l === 'cy' && I18N.toCyr ? I18N.toCyr(o.uz || '') : '') || o.en && ['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr'].indexOf(l) < 0 && o.en || o.uz || ''; };
  var src = function (a, v) { v = String(v || ''); return v ? ' ' + (v.indexOf('idb:') === 0 ? 'data-src' : a) + '="' + esc(v) + '"' : ''; };
  function posts() {
    var D0 = window.AH_TG_POSTS || [], R = ((window.AH_CMS || {}).tg || {}).posts;
    return (Array.isArray(R) ? R : D0).map(function (p) { var d = D0.filter(function (x) { return x.id === p.id; })[0] || {}; return Object.assign({}, d, p, { img: p.img || (p.video ? '' : d.img) || '', video: p.video || (p.img ? '' : d.video) || '', poster: p.poster || d.poster || '' }); })
      .filter(function (p) { return p && p.on !== false && (p.img || p.video || pick(p.t)); });
  }
  /* matn: qatorlar, havolalar va qalin yozuvsiz — Telegram ko'rinishida */
  function body(s) { return esc(s).replace(/\n/g, '<br>'); }

  var timer = 0, io = null;
  function draw() {
    var old = $('#tgStrip'); clearTimeout(timer); if (io) io.disconnect();
    var host = $('#p-home'), L = posts(), U = CFG.TELEGRAM_CHANNEL || 'https://t.me/arthouse_toshkent';
    if (!host) return;
    var H = '@' + ((U.match(/t\.me\/([\w]+)/) || [0, 'arthouse_toshkent'])[1]), name = 'Art house | Toshkent';
    var s = document.createElement('section'); s.id = 'tgStrip'; s.className = 'igs2 tgs';
    s.innerHTML = '<div class="igs2-in"><div class="igs2-copy"><a class="tgs-logo" href="' + esc(U) + '" target="_blank" rel="noopener" aria-label="Telegram">' + TG() + '</a>' +
      '<p class="eyebrow">' + esc(t('tg.eyebrow')) + '</p><h2>' + esc(H) + '</h2><p class="igs2-lead">' + esc(t('tg.lead')) + '</p>' +
      '<a class="hi-btn tgs-btn" href="' + esc(U) + '" target="_blank" rel="noopener">' + TG() + '<span>' + esc(t('tg.btn')) + '</span></a></div>' +
      (L.length ? '<div class="igs2-stage tgs-stage"><i class="tgs-orb a"></i><i class="tgs-orb b"></i>' +
      '<div class="igs2-phone tgs-phone"><i class="igs2-island"></i><div class="tgs-screen" role="region" aria-roledescription="carousel" aria-label="Telegram" tabindex="0">' +
      '<i class="tgs-wall" aria-hidden="true"></i>' +
      '<div class="tgs-bar"><svg class="tgs-back" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg><span class="tgs-av"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#logo"/></svg></span><span class="tgs-ttl"><b>' + esc(name) + '</b><small>' + esc(t('tg.kind')) + ' · ' + esc(H) + '</small></span></div>' +
      '<div class="tgs-feed">' + L.map(function (p, i) {
        var media = p.video ? '<video class="tgs-v" muted playsinline preload="' + (i ? 'none' : 'metadata') + '"' + src('src', p.video) + src('poster', p.poster || p.img) + '></video>' : (p.img ? '<img' + src('src', p.img) + ' alt="" loading="lazy" decoding="async">' : '');
        return '<div class="tgs-slide" data-i="' + i + '"><div class="tgs-post"><span class="tgs-pav"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#logo"/></svg></span><div class="tgs-bub"><b class="tgs-nm">' + esc(name) + '</b>' +
          (media ? '<div class="tgs-media">' + media + '</div>' : '') + (pick(p.t) ? '<p>' + body(pick(p.t)) + '</p>' : '') + '<small class="tgs-tm">' + esc(p.time || '') + '</small></div></div></div>';
      }).join('') + '</div>' +
      (L.length > 1 ? '<div class="tgs-dots">' + L.map(function (_, i) { return '<button type="button" data-k="' + i + '" aria-label="' + (i + 1) + ' / ' + L.length + '"></button>'; }).join('') + '</div>' : '') +
      '<a class="tgs-join" href="' + esc(U) + '" target="_blank" rel="noopener">' + esc(t('tg.join')) + '</a></div></div></div>' : '') + '</div>';
    var ig = $('#igStrip');
    if (old) old.replaceWith(s); else if (ig) ig.after(s); else host.appendChild(s);
    if (!L.length) return;
    var scr = $('.tgs-screen', s), feed = $('.tgs-feed', s), slides = s.querySelectorAll('.tgs-slide'), dots = s.querySelectorAll('.tgs-dots button'), k = 0, vis = false;
    function cur() { return slides[k] && slides[k].querySelector('video'); }
    function sched() {
      clearTimeout(timer); if (!vis || L.length < 2) return;
      var v = cur(); if (v) return; /* video — tugaganda o'tadi */
      timer = setTimeout(function () { go(k + 1); }, 6500);
    }
    function go(i) {
      var pv = cur(); if (pv) pv.pause();
      k = (i + L.length) % L.length; feed.style.transform = 'translateX(' + (-k * 100) + '%)';
      Array.prototype.forEach.call(slides, function (sl, j) { sl.classList.toggle('on', j === k); sl.setAttribute('aria-hidden', String(j !== k)); });
      Array.prototype.forEach.call(dots, function (b, j) { b.setAttribute('aria-current', String(j === k)); });
      var v = cur(); if (v && vis) { v.currentTime = 0; v.muted = true; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      sched();
    }
    Array.prototype.forEach.call(s.querySelectorAll('video.tgs-v'), function (v) { v.addEventListener('ended', function () { if (L.length > 1) go(k + 1); else { v.currentTime = 0; v.play().catch(function () {}); } }); });
    s.addEventListener('click', function (e) { var b = e.target.closest('.tgs-dots button'); if (b) go(+b.getAttribute('data-k')); });
    var x0 = null, y0 = 0, dx = 0;
    scr.addEventListener('pointerdown', function (e) { if (e.target.closest('a,button')) return; x0 = e.clientX; y0 = e.clientY; dx = 0; feed.style.transition = 'none'; });
    scr.addEventListener('pointermove', function (e) { if (x0 == null) return; dx = e.clientX - x0; if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - y0)) feed.style.transform = 'translateX(calc(' + (-k * 100) + '% + ' + dx + 'px))'; });
    var end = function () { if (x0 == null) return; x0 = null; feed.style.transition = ''; if (Math.abs(dx) > 45) go(k + (dx < 0 ? 1 : -1)); else go(k); };
    scr.addEventListener('pointerup', end); scr.addEventListener('pointercancel', end); scr.addEventListener('pointerleave', end);
    scr.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(k + 1); else if (e.key === 'ArrowLeft') go(k - 1); });
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) { vis = es[0].isIntersecting; s.classList.toggle('tgs-in-view', vis); if (vis) go(k); else { clearTimeout(timer); var v = cur(); if (v) v.pause(); } }, { threshold: .35 });
      io.observe($('.tgs-phone', s));
    } else { vis = true; go(0); }
    go(0);
  }
  window.AH_TG = draw;
  draw();
  I18N.on(function () { setTimeout(draw, 30); });
})();
