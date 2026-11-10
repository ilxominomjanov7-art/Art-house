/* =====================================================================
   ART HOUSE v2 — sayt mantig'i (Reels, wow, pastki qism, 100% tarjima)
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var L8 = ['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr'];
  /* 8 tilda matnlar; kirill — avtomatik; yangi qo'shilgan til — avtomatik tarjimon (pastda) */
  var D = {
    'f.buy': ["Xaridorlarga", "Покупателям", "For buyers", "Acheteurs", "Acquirenti", "Compradores", "Für Käufer", "Alıcılar için"],
    'f.calc': ["To'lov kalkulyatori", "Калькулятор платежей", "Payment calculator", "Calculateur de paiement", "Calcolatore rate", "Calculadora de pagos", "Ratenrechner", "Ödeme hesaplayıcı"],
    'f.terms': ["0% bo'lib to'lash shartlari", "Условия рассрочки 0%", "0% instalment terms", "Conditions du paiement 0 %", "Condizioni rate 0%", "Condiciones de plazos 0 %", "0 %-Ratenbedingungen", "%0 taksit koşulları"],
    'f.rev': ["Mijozlar sharhlari", "Отзывы клиентов", "Client reviews", "Avis clients", "Recensioni clienti", "Opiniones de clientes", "Kundenbewertungen", "Müşteri yorumları"],
    'f.ai': ["AI maslahatchi", "AI-консультант", "AI advisor", "Conseiller IA", "Consulente IA", "Asesor IA", "KI-Berater", "AI danışman"],
    'f.video': ["Video qo'ng'iroq", "Видеозвонок", "Video call", "Appel vidéo", "Videochiamata", "Videollamada", "Videoanruf", "Görüntülü arama"],
    'f.trust': ["Rasmiy shartnoma · 0% · Quruvchidan", "Официальный договор · 0% · От застройщика", "Official contract · 0% · Direct from developer", "Contrat officiel · 0 % · Direct promoteur", "Contratto ufficiale · 0% · Dal costruttore", "Contrato oficial · 0 % · Directo del promotor", "Offizieller Vertrag · 0 % · Direkt vom Bauträger", "Resmi sözleşme · %0 · Doğrudan müteahhitten"],
    'f.slog': ["Luxury Residence · Toshkent", "Luxury Residence · Ташкент", "Luxury Residence · Tashkent", "Luxury Residence · Tachkent", "Luxury Residence · Tashkent", "Luxury Residence · Taskent", "Luxury Residence · Taschkent", "Luxury Residence · Taşkent"],
    'hi.newsT': ["ART HOUSE DAVRASI", "КРУГ ART HOUSE", "THE ART HOUSE CIRCLE", "LE CERCLE ART HOUSE", "IL CIRCOLO ART HOUSE", "EL CÍRCULO ART HOUSE", "DER ART HOUSE KREIS", "ART HOUSE ÇEVRESİ"],
    'hi.newsD': ["Eng yaxshi qavatlar va narxlar — avval sizga. Yangi bloklar sotuvga chiqishidan oldin bilib oling.", "Лучшие этажи и цены — сначала вам. Узнавайте о новых блоках до старта продаж.", "The best floors and prices — first to you. Hear about new blocks before sales open.", "Les meilleurs étages et prix — d'abord pour vous. Découvrez les nouveaux blocs avant l'ouverture des ventes.", "I piani e i prezzi migliori — prima a te. Scopri i nuovi blocchi prima dell'apertura delle vendite.", "Las mejores plantas y precios — primero para usted. Conozca los nuevos bloques antes de la apertura de ventas.", "Die besten Etagen und Preise — zuerst für Sie. Erfahren Sie von neuen Blöcken vor Verkaufsstart.", "En iyi katlar ve fiyatlar — önce size. Yeni blokları satış başlamadan öğrenin."],
    'ab.cap': ["Har bir uy — qo'lda yaratilgan asar", "Каждый дом — произведение, созданное вручную", "Every home — a handcrafted work", "Chaque maison — une œuvre façonnée à la main", "Ogni casa — un'opera fatta a mano", "Cada casa — una obra hecha a mano", "Jedes Haus — ein handgefertigtes Werk", "Her ev — el emeğiyle yaratılmış bir eser"],
    'ab.k': ["Art House · Toshkent", "Art House · Ташкент", "Art House · Tashkent", "Art House · Tachkent", "Art House · Tashkent", "Art House · Taskent", "Art House · Taschkent", "Art House · Taşkent"],
    'fby': ["Siz bilan birga {n} oila", "С нами уже {n} семей", "{n} families with us", "{n} familles avec nous", "{n} famiglie con noi", "{n} familias con nosotros", "{n} Familien mit uns", "{n} aile bizimle"]
  };
  var ext = {}; L8.forEach(function (l, i) { ext[l] = {}; Object.keys(D).forEach(function (k) { ext[l][k] = D[k][i]; }); I18N.extend(l, ext[l]); });
  var t = function (k, o) { return I18N.t(k, o); };

  /* ---------- 1) Instagram Reels: raqamlar, like, «followed by» ---------- */
  function fmt(n) { n = +n || 0; if (!n) return ''; if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'; if (n >= 1e4) return Math.round(n / 1e3) + 'K'; if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'; return String(n); }
  function stats(i) {
    var R = ((window.AH_CMS || {}).ig || {}).reels, D0 = window.AH_IG_REELS || CFG.IG_REELS || [], r = (Array.isArray(R) ? R : D0)[i] || {};
    return r.st || {};
  }
  window.AH_IG_STATS = function (s, k) { /* igStrip() har safar video almashganda chaqiradi */
    if (!s) return; var st = stats(k), side = $('.igs2-side', s); if (!side) return;
    ['l', 'c', 'r', 's', 'v'].forEach(function (c) { var b = $('[data-c="' + c + '"]', side); if (b) b.textContent = fmt(st[c]); });
    var lk = $('.igx-like', side); if (lk) lk.classList.remove('liked');
    var fb = $('.igs2-fby', s); if (fb) fb.textContent = CFG.IG_FAMILIES ? t('fby', { n: CFG.IG_FAMILIES }) : '';
  };
  document.addEventListener('click', function (e) {
    var i = e.target.closest && e.target.closest('#igStrip .igs2-side i'); if (!i) return;
    e.stopPropagation();
    if (i.classList.contains('igx-like')) { var b = $('b', i), on = i.classList.toggle('liked'), n = +(b.dataset.n || 0); b.dataset.n = on ? n + 1 : n; var base = b.dataset.base != null ? b.dataset.base : (b.dataset.base = b.textContent); b.textContent = on ? (base && /^\d+$/.test(base) ? String(+base + 1) : base) : base; return; }
    var U = (CFG.INSTAGRAM || 'https://www.instagram.com/arthouse.tashkent/');
    if (i.dataset.k === 'send' && navigator.share) { navigator.share({ title: 'ART HOUSE', url: U }).catch(function () {}); return; }
    window.open(U, '_blank', 'noopener');
  }, true);
  ['pointerdown', 'pointerup'].forEach(function (ev) { document.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest('#igStrip .igs2-side i')) e.stopPropagation(); }, true); });

  /* ---------- 4) «Biz haqimizda» rasmi — wow ---------- */
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function wow() {
    $$('.ths-about-media:not(.ahw)').forEach(function (f) {
      var img = $('img', f); if (!img) return;
      f.classList.add('ahw');
      var w = document.createElement('span'); w.className = 'ahw-in'; img.parentNode.insertBefore(w, img); w.appendChild(img);
      var dust = '<span class="ahw-dust" aria-hidden="true">'; for (var i = 0; i < 14; i++) dust += '<i style="left:' + (5 + Math.random() * 90).toFixed(1) + '%;--d:' + (6 + Math.random() * 6).toFixed(1) + 's;--w:' + (Math.random() * 6).toFixed(1) + 's;--x:' + (Math.random() * 60 - 30).toFixed(0) + 'px"></i>'; dust += '</span>';
      w.insertAdjacentHTML('beforeend', dust + '<span class="ahw-cap"><small>' + esc(t('ab.k')) + '</small><b>' + esc(t('ab.cap')) + '</b></span>');
      var badge = $('.ths-about-badge b', f), to = +(badge && badge.textContent) || 0;
      var go = function () {
        f.classList.add('in'); setTimeout(function () { f.classList.add('live'); }, 2700);
        if (badge && to && !RM) { var t0 = performance.now() + 1100; badge.textContent = '0'; (function s(now) { var k = Math.max(0, Math.min(1, (now - t0) / 1400)); badge.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(s); })(performance.now()); }
      };
      if ('IntersectionObserver' in window && !RM) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); go(); } }, { threshold: .3 }); io.observe(f); } else go();
      /* 3D qiyalik: kompyuterda sichqoncha, telefonda — aylantirish (parallaks) */
      if (RM) return;
      f.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; w.style.transform = 'rotateY(' + (x * 9).toFixed(2) + 'deg) rotateX(' + (-y * 9).toFixed(2) + 'deg)'; });
      f.addEventListener('pointerleave', function () { w.style.transform = ''; });
      var tick = false; addEventListener('scroll', function () { if (tick || matchMedia('(hover: hover)').matches) return; tick = true; requestAnimationFrame(function () { tick = false; var r = f.getBoundingClientRect(), p = (r.top + r.height / 2) / innerHeight - .5; if (Math.abs(p) < 1) w.style.transform = 'rotateX(' + (p * 7).toFixed(2) + 'deg) translateY(' + (p * -14).toFixed(1) + 'px)'; }); }, { passive: true });
    });
  }

  /* ---------- 9) pastki qism ---------- */
  function foot() {
    var f = $('.foot'); if (!f) return;
    var art = $('.ft-art', f); if (art) art.remove();
    var fi = $('.foot-in', f); if (!fi) return;
    var mk = $('.ft-mark', f); if (mk) mk.remove();
    /* header'dagi logotipning aynan nusxasi — kabinetda logo almashsa, bu yerda ham almashadi */
    var hb = $('.top .brand'), band = document.createElement('div'); band.className = 'ft-mark';
    band.innerHTML = '<div class="wrap"></div>'; var cl = hb ? hb.cloneNode(true) : document.createElement('span'); cl.removeAttribute('aria-label'); cl.classList.add('ft-brand'); band.firstChild.appendChild(cl);
    f.insertBefore(band, f.firstChild);
    var tr = $('.ft-trust', f); if (tr) tr.remove();
    fi.insertAdjacentHTML('afterend', '<div class="wrap ft-trust">' + t('f.trust').split('·').map(function (x) { return '<span>' + esc(x.trim()) + '</span>'; }).join('<span aria-hidden="true">·</span>') + '</div>');
    var old = $('#ftBuy', f); if (old) old.remove();
    var col = document.createElement('div'); col.id = 'ftBuy';
    col.innerHTML = '<h4>' + esc(t('f.buy')) + '</h4><ul class="foot-links">' +
      '<li><a href="#calculator">' + esc(t('f.calc')) + '</a></li><li><a href="#" data-pp="calc">' + esc(t('f.terms')) + '</a></li>' +
      '<li><a href="#reviews">' + esc(t('f.rev')) + '</a></li><li><a href="#" data-ft-ai>' + esc(t('f.ai')) + '</a></li><li><a href="#" data-ft-video>' + esc(t('f.video')) + '</a></li></ul>';
    var news = $('#hiNews', fi); fi.insertBefore(col, news || null);
    if (news) { var nh = $('h4', news), np = $('p', news); if (nh) nh.textContent = t('hi.newsT'); if (np) np.textContent = t('hi.newsD'); }
    /* telefonda — ochiladigan ro'yxat (boshqalari bilan bir xil) */
    var h = $('h4', col), ul = $('ul', col); col.classList.add('hi-acc'); h.setAttribute('role', 'button'); h.tabIndex = 0;
    var sync = function () { var mob = matchMedia('(max-width: 760px)').matches; ul.style.display = mob && !col.classList.contains('open') ? 'none' : ''; };
    h.addEventListener('click', function () { col.classList.toggle('open'); sync(); }); sync();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-ft-ai]')) { e.preventDefault(); var a = $('#aib'); if (a) a.click(); }
    else if (e.target.closest('[data-ft-video]')) { e.preventDefault(); var v = $('[data-call="video"]'); if (v) v.click(); }
  });

  function all() { wow(); foot(); }
  all();
  I18N.on(function () { setTimeout(all, 30); });
  /* bo'limlar kabinetdan qayta chizilsa — wow yana ulanadi */
  if ('MutationObserver' in window) { var mt = 0; new MutationObserver(function () { clearTimeout(mt); mt = setTimeout(wow, 120); }).observe(document.getElementById('app') || document.body, { childList: true, subtree: true }); }

  /* ---------- 8) mavzu: Custom CSS (umumiy va har bir bo'lim uchun) ---------- */
  window.AH_CSS = function (th) {
    th = th || {}; var css = '', s = th.s || {};
    if (s.css) css += '/* mavzu */\n' + s.css + '\n';
    Object.keys(th.sec || {}).forEach(function (id) { var c = (th.sec[id] || {}).css; if (c && String(c).trim()) css += (id === 'ann' ? '.top > .ann' : '#p-home > [data-ths="' + id + '"]') + ' {\n' + c + '\n}\n'; });
    var el = document.getElementById('ahCustomCss'); if (!el) { el = document.createElement('style'); el.id = 'ahCustomCss'; document.head.appendChild(el); }
    if (el.textContent !== css) el.textContent = css;
  };
  try { if (window.AH_THEMES) AH_CSS(AH_THEMES.liveOf(window.AH_CMS)); } catch (e) {}
})();
