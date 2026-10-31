/* =====================================================================
   ART HOUSE — MAVZU VA BO'LIMLAR (saytdagi ish vaqti)
   • Nashr qilingan mavzuni qo'llaydi: ranglar, shrift, tugmalar shakli.
   • Bosh sahifadagi bo'limlarni mavzu tartibida joylaydi, o'chirilganlarini yashiradi.
   • Yangi bo'limlarni chizadi: «Yulduzlar va mijozlar tanlovi», «Biz haqimizda»,
     «Taklif va harakatga chaqiruv», «Matn va tugma», «Video».
   • Jonli yangilanish — sahifa qayta yuklanmaydi:
       – shu brauzerdagi kabinet saqlasa: 'storage' hodisasi;
       – server rejimida: SSE (kind: 'cms') → /api/cms;
       – kabinetdagi tahrirlagich ichida (?preview=1): postMessage orqali qoralama.
   Sxema: js/theme-schema.js
   ===================================================================== */
(function () {
  'use strict';
  if (!window.AH_THEMES || !window.I18N || !window.CFG) return;
  var TH = window.AH_THEMES;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var t = function (k, v) { return I18N.t(k, v); };
  var API = (CFG.API_URL === 'auto' ? (location.protocol.indexOf('http') === 0 ? location.origin : '') : (CFG.API_URL || '')).replace(/\/$/, '');
  var PREVIEW = /[?&]preview=1/.test(location.search) && window.parent !== window;
  var NUMK = ['FOUNDED', 'PROJECTS_DONE'];
  var CUR = TH.liveOf(window.AH_CMS);
  var DRAFT = false;
  window.AH_TTEXT = CUR.text;
  if (PREVIEW) document.documentElement.classList.add('ths-preview');

  /* ---------- tarjimalar ---------- */
  var X = {
    uz: { 'ths.all': 'Barchasi', 'ths.f.star': 'Yulduzlar', 'ths.f.client': 'Mijozlar', 'ths.f.gift': "Sovg'alar", 'ths.k.star': 'Yulduz', 'ths.k.client': 'Mijoz', 'ths.k.gift': "Sovg'a", 'ths.watch': "Videoni ko'rish", 'ths.rating': "o'rtacha baho · {n} ta izoh", 'ths.followers': 'Instagram obunachilari', 'ths.igT': 'Quvonchli lahzalar — Instagram sahifamizda', 'ths.igB': "Instagram'da ko'rish", 'ths.sample': 'Namuna — kabinetda video yuklang', 'ths.ok': "Rahmat! Menejer tez orada qo'ng'iroq qiladi.", 'ths.note': "Ma'lumotlaringiz faqat menejerga yetkaziladi.", 'ths.d': 'kun', 'ths.h': 'soat', 'ths.m': 'daq', 'ths.s': 'son', 'ths.close': 'Yopish', 'ths.prev': "Ko'rish rejimi: ariza yuborilmadi" },
    ru: { 'ths.all': 'Все', 'ths.f.star': 'Звёзды', 'ths.f.client': 'Клиенты', 'ths.f.gift': 'Подарки', 'ths.k.star': 'Звезда', 'ths.k.client': 'Клиент', 'ths.k.gift': 'Подарок', 'ths.watch': 'Смотреть видео', 'ths.rating': 'средняя оценка · {n} отзывов', 'ths.followers': 'подписчиков в Instagram', 'ths.igT': 'Счастливые моменты — в нашем Instagram', 'ths.igB': 'Смотреть в Instagram', 'ths.sample': 'Образец — загрузите видео в кабинете', 'ths.ok': 'Спасибо! Менеджер скоро перезвонит.', 'ths.note': 'Ваши данные получит только менеджер.', 'ths.d': 'дн', 'ths.h': 'ч', 'ths.m': 'мин', 'ths.s': 'сек', 'ths.close': 'Закрыть', 'ths.prev': 'Режим просмотра: заявка не отправлена' },
    en: { 'ths.all': 'All', 'ths.f.star': 'Stars', 'ths.f.client': 'Clients', 'ths.f.gift': 'Gifts', 'ths.k.star': 'Star', 'ths.k.client': 'Client', 'ths.k.gift': 'Gift', 'ths.watch': 'Watch video', 'ths.rating': 'average rating · {n} reviews', 'ths.followers': 'Instagram followers', 'ths.igT': 'Happy moments on our Instagram', 'ths.igB': 'View on Instagram', 'ths.sample': 'Sample — upload a video in the dashboard', 'ths.ok': 'Thank you! A manager will call you shortly.', 'ths.note': 'Your details go only to our manager.', 'ths.d': 'days', 'ths.h': 'hrs', 'ths.m': 'min', 'ths.s': 'sec', 'ths.close': 'Close', 'ths.prev': 'Preview mode: request not sent' },
    fr: { 'ths.all': 'Tous', 'ths.f.star': 'Stars', 'ths.f.client': 'Clients', 'ths.f.gift': 'Cadeaux', 'ths.k.star': 'Star', 'ths.k.client': 'Client', 'ths.k.gift': 'Cadeau', 'ths.watch': 'Voir la vidéo', 'ths.rating': 'note moyenne · {n} avis', 'ths.followers': 'abonnés Instagram', 'ths.igT': 'Moments de bonheur sur notre Instagram', 'ths.igB': 'Voir sur Instagram', 'ths.sample': "Exemple — ajoutez une vidéo dans l'espace", 'ths.ok': 'Merci ! Un conseiller vous rappellera très vite.', 'ths.note': "Vos coordonnées ne sont transmises qu'à notre conseiller.", 'ths.d': 'j', 'ths.h': 'h', 'ths.m': 'min', 'ths.s': 's', 'ths.close': 'Fermer', 'ths.prev': 'Mode aperçu : demande non envoyée' },
    it: { 'ths.all': 'Tutti', 'ths.f.star': 'Star', 'ths.f.client': 'Clienti', 'ths.f.gift': 'Regali', 'ths.k.star': 'Star', 'ths.k.client': 'Cliente', 'ths.k.gift': 'Regalo', 'ths.watch': 'Guarda il video', 'ths.rating': 'voto medio · {n} recensioni', 'ths.followers': 'follower su Instagram', 'ths.igT': 'Momenti felici sul nostro Instagram', 'ths.igB': 'Guarda su Instagram', 'ths.sample': 'Esempio — carica un video nel pannello', 'ths.ok': 'Grazie! Un consulente ti richiamerà a breve.', 'ths.note': 'I tuoi dati arrivano solo al nostro consulente.', 'ths.d': 'g', 'ths.h': 'h', 'ths.m': 'min', 'ths.s': 's', 'ths.close': 'Chiudi', 'ths.prev': 'Anteprima: richiesta non inviata' },
    es: { 'ths.all': 'Todos', 'ths.f.star': 'Estrellas', 'ths.f.client': 'Clientes', 'ths.f.gift': 'Regalos', 'ths.k.star': 'Estrella', 'ths.k.client': 'Cliente', 'ths.k.gift': 'Regalo', 'ths.watch': 'Ver vídeo', 'ths.rating': 'valoración media · {n} opiniones', 'ths.followers': 'seguidores en Instagram', 'ths.igT': 'Momentos felices en nuestro Instagram', 'ths.igB': 'Ver en Instagram', 'ths.sample': 'Ejemplo — suba un vídeo en el panel', 'ths.ok': '¡Gracias! Un asesor le llamará en breve.', 'ths.note': 'Sus datos solo los recibe nuestro asesor.', 'ths.d': 'd', 'ths.h': 'h', 'ths.m': 'min', 'ths.s': 's', 'ths.close': 'Cerrar', 'ths.prev': 'Vista previa: solicitud no enviada' },
    de: { 'ths.all': 'Alle', 'ths.f.star': 'Stars', 'ths.f.client': 'Kunden', 'ths.f.gift': 'Geschenke', 'ths.k.star': 'Star', 'ths.k.client': 'Kunde', 'ths.k.gift': 'Geschenk', 'ths.watch': 'Video ansehen', 'ths.rating': 'Durchschnitt · {n} Bewertungen', 'ths.followers': 'Instagram-Follower', 'ths.igT': 'Glückliche Momente auf unserem Instagram', 'ths.igB': 'Auf Instagram ansehen', 'ths.sample': 'Beispiel — Video im Dashboard hochladen', 'ths.ok': 'Danke! Ein Berater ruft Sie in Kürze zurück.', 'ths.note': 'Ihre Daten erhält nur unser Berater.', 'ths.d': 'T', 'ths.h': 'Std', 'ths.m': 'Min', 'ths.s': 'Sek', 'ths.close': 'Schließen', 'ths.prev': 'Vorschau: Anfrage nicht gesendet' },
    tr: { 'ths.all': 'Tümü', 'ths.f.star': 'Yıldızlar', 'ths.f.client': 'Müşteriler', 'ths.f.gift': 'Hediyeler', 'ths.k.star': 'Yıldız', 'ths.k.client': 'Müşteri', 'ths.k.gift': 'Hediye', 'ths.watch': 'Videoyu izle', 'ths.rating': 'ortalama puan · {n} yorum', 'ths.followers': 'Instagram takipçisi', 'ths.igT': 'Mutlu anlar Instagram sayfamızda', 'ths.igB': "Instagram'da izle", 'ths.sample': 'Örnek — panelden video yükleyin', 'ths.ok': 'Teşekkürler! Danışmanımız kısa süre içinde sizi arayacak.', 'ths.note': 'Bilgileriniz yalnızca danışmanımıza iletilir.', 'ths.d': 'gün', 'ths.h': 'sa', 'ths.m': 'dk', 'ths.s': 'sn', 'ths.close': 'Kapat', 'ths.prev': 'Önizleme modu: talep gönderilmedi' }
  };
  Object.keys(X).forEach(function (l) { I18N.extend(l, X[l]); });

  /* ---------- yordamchilar ---------- */
  function maxM() { return Math.max.apply(null, CFG.MONTHS && CFG.MONTHS.length ? CFG.MONTHS : [36]); }
  function tok(s) {
    var V = { years: CFG.EXPERIENCE_YEARS, projects: CFG.PROJECTS_DONE, months: maxM(), down: (CFG.DOWN_MIN != null ? CFG.DOWN_MIN : 30) + '%' };
    return String(s == null ? '' : s).replace(/\{(years|projects|months|down)\}/g, function (m, k) { return V[k] != null ? V[k] : m; });
  }
  function P(o) { return tok(typeof o === 'string' ? o : I18N.pick(o || {})); }
  function src(ref) {
    ref = String(ref || '');
    if (ref.indexOf('base:') === 0) return window.AH_RES ? AH_RES(ref) || '' : '';
    if (ref.charAt(0) === '/' && ref.charAt(1) !== '/') return API + ref;
    return ref;
  }
  function ic(n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function ytId(u) { var m = String(u || '').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/); return m ? m[1] : ''; }
  function igId(u) { var m = String(u || '').match(/instagram\.com\/(?:[\w.]+\/)?(?:reels?|p|tv)\/([\w-]+)/); return m ? m[1] : ''; }
  function isFile(u) { return /^(idb:|blob:|data:video)/.test(u) || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u); }
  function lines(s) { return esc(s).split(/\n{2,}/).map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join(''); }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function head(s, center) {
    var e = P(s.eyebrow), h = P(s.title), d = P(s.sub);
    return '<header class="ths-head' + (center ? ' center' : '') + '">' + (e ? '<p class="eyebrow">' + esc(e) + '</p>' : '') + (h ? '<h2>' + nl(h) + '</h2>' : '') + (d ? '<p class="ths-lead">' + esc(d) + '</p>' : '') + '</header>';
  }
  /* tugma: vazifasiga qarab havola yoki tugma */
  function btn(label, act, url, cls) {
    label = P(label); if (!label) return '';
    var c = 'btn ' + (cls || 'btn-gold'), a = act || 'book';
    if (a === 'phone') return '<a class="' + c + '" href="tel:' + esc(CFG.PHONE) + '">' + ic('phone') + '<span>' + esc(label) + '</span></a>';
    if (a === 'telegram') return '<a class="' + c + '" href="' + esc(CFG.TG_MANAGER || CFG.TELEGRAM_MANAGER || CFG.TELEGRAM_CHANNEL || '#contact') + '" target="_blank" rel="noopener">' + ic('tg') + '<span>' + esc(label) + '</span></a>';
    if (a === 'projects' || a === 'calc') return '<a class="' + c + '" href="#' + (a === 'calc' ? 'calculator' : 'projects') + '"><span>' + esc(label) + '</span>' + ic('arrow') + '</a>';
    if (a === 'link' && url) return '<a class="' + c + '" href="' + esc(url) + '"' + (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '') + '><span>' + esc(label) + '</span>' + ic('arrow') + '</a>';
    return '<button type="button" class="' + c + '" data-ths-act="' + (a === 'video' ? 'video' : 'book') + '">' + ic(a === 'video' ? 'video' : 'key') + '<span>' + esc(label) + '</span></button>';
  }

  /* ---------- mavzu uslubi: ranglar, shrift, tugmalar ---------- */
  function hexA(h, a) { var m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return ''; var n = parseInt(m[1], 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function style(th) {
    var s = th.s || {}, pal = TH.PALETTES[s.palette] || TH.PALETTES.emerald, c = Object.assign({}, pal.colors, s.colors || {}), css = '', v = '';
    var MAP = { bg: '--bg', bg2: '--bg-2', bg3: '--bg-3', deep: '--deep', gold: '--gold', goldHi: '--gold-hi', gold2: '--gold-2', ink: '--ink' };
    Object.keys(MAP).forEach(function (k) { if (/^#[0-9a-f]{6}$/i.test(c[k] || '')) v += MAP[k] + ':' + c[k] + ';'; });
    if (c.ink) v += '--mut:' + hexA(c.ink, .68) + ';';
    if (c.gold) v += '--line:' + hexA(c.gold, .16) + ';--line-2:' + hexA(c.gold, .36) + ';--gold-grad:linear-gradient(' + c.gold + ',' + c.gold + ');';
    var F = TH.FONTS[s.font]; if (F && s.font !== 'cormorant' && !F.icon) v += '--f-display:' + F.css + ';';
    document.documentElement.classList.toggle('ty-icon', !!(F && F.icon)); /* css/site-icon.css */
    if (v) css += ':root{' + v + '}';
    if (c.bg) css += 'html,body{background-color:var(--bg)!important}.top,.foot{background-color:var(--bg)}';
    if (c.gold) css += '.btn-gold{background:var(--gold)!important;border-color:var(--gold)!important}.btn-gold:hover{background:var(--gold-hi)!important;border-color:var(--gold-hi)!important}.eyebrow{color:var(--gold)}';
    var R = { round: '12px', pill: '999px' }[s.btn];
    if (R) css += '.btn,.hi-btn,.ths .btn{border-radius:' + R + '!important}';
    var el = $('#ahTheme'); if (!el) { el = document.createElement('style'); el.id = 'ahTheme'; }
    document.head.appendChild(el); /* doim oxirida — boshqa ranglardan ustun turadi */
    if (el.textContent !== css) el.textContent = css;
    var m = $('meta[name="theme-color"]'); if (m && c.bg) m.content = c.bg;
  }
  style(CUR);

  /* ---------- 1) «Yulduzlar va mijozlar tanlovi» ---------- */
  var MEDIA = {}; /* data-play → { video, link, name, role } */
  function reviewItems(s) {
    if (!s.reviews || !window.Store) return [];
    var PR = window.PROJECTS || [];
    return Store.list('reviews').filter(function (r) { return !r.hidden && (r.video || r.link); }).slice(0, 8).map(function (r) {
      var p = PR.filter(function (x) { return x.id === r.project; })[0];
      return { kind: 'client', name: r.name, role: p ? I18N.pick(p.name) : '', quote: r.text, video: r.video, link: r.link, rating: r.rating };
    });
  }
  function stars(id, sec, el) {
    var s = sec.s || {}, B = (sec.b || []).filter(function (b) { return PREVIEW || !b.sample; });
    /* saytda — faqat videosi bor yozuvlar; tahrirlagichda — video hali yuklanmaganlari ham (namuna sifatida) */
    var V = B.filter(function (b) { return b.type === 'video' && (PREVIEW || b.video || b.link); }).map(function (b) {
      return { kind: b.kind || 'client', name: P(b.name), role: P(b.role), quote: P(b.quote), video: b.video, link: b.link, poster: b.poster, verified: b.verified, sample: b.sample || !(b.video || b.link) };
    }).concat(reviewItems(s));
    var Q = B.filter(function (b) { return b.type === 'quote' && P(b.text); });
    var html = head(s, true);
    if (s.proof) {
      var R = window.Store ? Store.list('reviews').filter(function (r) { return !r.hidden && r.rating; }) : [];
      var avg = R.length ? R.reduce(function (a, r) { return a + (+r.rating || 0); }, 0) / R.length : 0;
      var cells = [];
      if (R.length) cells.push('<div><b>' + avg.toFixed(1) + '<i>★</i></b><span>' + esc(t('ths.rating', { n: R.length })) + '</span></div>');
      if (cells.length) html += '<div class="ths-proof">' + cells.join('') + '</div>';
    }
    var kinds = ['star', 'client', 'gift'].filter(function (k) { return V.some(function (v) { return v.kind === k; }); });
    if (s.filters && kinds.length > 1) html += '<div class="ths-filter" role="group">' + ['all'].concat(kinds).map(function (k, i) {
      return '<button type="button" data-ths-f="' + k + '" aria-pressed="' + !i + '">' + esc(t(k === 'all' ? 'ths.all' : 'ths.f.' + k)) + '</button>';
    }).join('') + '</div>';
    var cards = V.map(function (v, i) {
      var key = id + ':' + i, y = ytId(v.link), poster = src(v.poster) || (y ? 'https://i.ytimg.com/vi/' + y + '/hqdefault.jpg' : ''), file = v.video ? src(v.video) : '';
      MEDIA[key] = v;
      var media = poster ? '<img src="' + esc(poster) + '" alt="" loading="lazy" decoding="async">'
        : file && isFile(file) ? '<video src="' + esc(file) + '" muted playsinline preload="metadata"></video>' : '<i class="ths-reel-ph">' + ic('play') + '</i>';
      return '<article class="ths-reel' + (v.sample ? ' ths-sample' : '') + '" data-k="' + v.kind + '">' +
        '<button type="button" class="ths-reel-btn" data-play="' + esc(key) + '" aria-label="' + esc(t('ths.watch') + ': ' + v.name) + '">' +
        '<span class="ths-reel-media">' + media + '</span>' +
        '<span class="ths-badge">' + (v.kind === 'star' ? '★ ' : '') + esc(t('ths.k.' + v.kind)) + '</span>' +
        (v.sample ? '<span class="ths-sample-tag">' + esc(t('ths.sample')) + '</span>' : '<span class="ths-play">' + ic('play') + '</span>') +
        '<span class="ths-reel-cap"><b>' + esc(v.name) + (v.verified ? '<svg class="ths-v" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3-1-3 2.6-1.9 1-3 3.2.1z"/><path d="m8 12 2.6 2.6L16 9.2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') + '</b>' + (v.role ? '<small>' + esc(v.role) + '</small>' : '') + '</span>' +
        '</button>' + (v.quote ? '<p class="ths-reel-q">' + esc(v.quote) + '</p>' : '') + '</article>';
    });
    /* saytda: video ham, fikr ham bo'lmasa — bo'lim ko'rinmaydi (Instagram bo'limi alohida bor); tahrirlagichda — namuna karta */
    el.hidden = !PREVIEW && !V.length && !Q.length; if (el.hidden) { el.innerHTML = ''; return; }
    if (!V.length && PREVIEW) cards.push(igCard());
    html += '<div class="ths-reels">' + cards.join('') + '</div>';
    if (Q.length) html += '<div class="ths-quotes">' + Q.map(function (q) {
      var ph = src(q.photo), nm = P(q.name), n = Math.max(1, Math.min(5, +q.rating || 5));
      return '<figure class="ths-quote' + (q.sample ? ' ths-sample' : '') + '"><div class="ths-rate" aria-label="' + n + '/5">' + '★★★★★'.slice(0, n) + '<i>' + '★★★★★'.slice(n) + '</i></div>' +
        '<blockquote>' + esc(P(q.text)) + '</blockquote><figcaption>' + (ph ? '<img src="' + esc(ph) + '" alt="" loading="lazy">' : '<span class="ths-av">' + esc((nm || '?').charAt(0)) + '</span>') +
        '<span><b>' + esc(nm) + '</b>' + (P(q.role) ? '<small>' + esc(P(q.role)) + '</small>' : '') + '</span>' + (q.kind === 'star' ? '<em>★ ' + esc(t('ths.k.star')) + '</em>' : '') + '</figcaption></figure>';
    }).join('') + '</div>';
    if (s.ctaOn && (P(s.cta) || P(s.btn))) html += '<div class="ths-band"><p>' + esc(P(s.cta)) + '</p>' + btn(s.btn, 'book') + '</div>';
    el.innerHTML = '<div class="wrap">' + html + '</div>';
  }

  /* video hali yo'q bo'lsa — Instagram sahifasiga taklif */
  function igCard() {
    return CFG.INSTAGRAM ? '<a class="ths-reel ths-ig" href="' + esc(CFG.INSTAGRAM) + '" target="_blank" rel="noopener">' + ic('ig') + '<b>' + esc(t('ths.igT')) + '</b><span>' + esc(CFG.INSTAGRAM_HANDLE || '@arthouse.tashkent') + '</span><em>' + esc(t('ths.igB')) + ic('arrow') + '</em></a>' : '';
  }
  /* karta olib tashlangach: bo'sh qolgan saralash tugmalari ham yashiriladi */
  function tidy(grid) {
    var sec = grid.closest('.ths'), left = $$('.ths-reel:not(.ths-ig)', grid);
    if (!left.length) { if (PREVIEW) grid.innerHTML = igCard(); else if ($('.ths-quotes', sec)) grid.remove(); else { sec.hidden = true; return; } }
    var fl = $('.ths-filter', sec); if (!fl) return;
    var ks = left.map(function (r) { return r.dataset.k; });
    $$('[data-ths-f]', fl).forEach(function (b) { if (b.dataset.thsF !== 'all' && ks.indexOf(b.dataset.thsF) < 0) b.remove(); });
    if ($$('[data-ths-f]', fl).length < 3) fl.remove();
  }

  /* ---------- 2) «Biz haqimizda» ---------- */
  function about(id, sec, el) {
    var s = sec.s || {}, B = sec.b || [], img = src(s.image);
    var st = B.filter(function (b) { return b.type === 'stat' && (b.value || P(b.label)); });
    var pt = B.filter(function (b) { return b.type === 'point' && (P(b.title) || P(b.text)); });
    var e = P(s.eyebrow), h = P(s.title), x = P(s.text), lt = P(s.locTitle), ad = P(s.address), ln = P(s.locNote);
    el.innerHTML = '<div class="wrap ths-about-grid">' +
      (img ? '<figure class="ths-about-media"><img src="' + esc(img) + '" alt="" loading="lazy" decoding="async"><figcaption class="ths-about-badge"><b>' + esc(CFG.EXPERIENCE_YEARS) + '</b><span>' + esc(P(s.badge)) + '</span></figcaption></figure>' : '') +
      '<div class="ths-about-copy">' + (e ? '<p class="eyebrow">' + esc(e) + '</p>' : '') + (h ? '<h2>' + nl(h) + '</h2>' : '') + (x ? '<div class="ths-text">' + lines(x) + '</div>' : '') +
      (st.length ? '<div class="ths-stats">' + st.map(function (b) { return '<div><b>' + esc(tok(b.value)) + '</b><span>' + esc(P(b.label)) + '</span></div>'; }).join('') + '</div>' : '') +
      (lt || ad ? '<div class="ths-loc"><span class="ths-loc-ic">' + ic('pin') + '</span><div><b>' + esc(lt) + '</b><span>' + esc(ad) + '</span>' + (ln ? '<p>' + esc(ln) + '</p>' : '') +
        (s.map ? '<a href="' + esc(s.map) + '" target="_blank" rel="noopener">' + esc(t('home.locBtn')) + ic('arrow') + '</a>' : '') + '</div></div>' : '') +
      (P(s.btn) ? '<div class="ths-btns">' + btn(s.btn, s.act, s.url) + '</div>' : '') + '</div></div>' +
      (pt.length ? '<div class="wrap ths-points">' + pt.map(function (b) { return '<div class="ths-point"><span>' + ic(b.icon || 'check') + '</span><b>' + esc(P(b.title)) + '</b><p>' + esc(P(b.text)) + '</p></div>'; }).join('') + '</div>' : '');
  }

  /* ---------- 3) «Taklif va harakatga chaqiruv» ---------- */
  function untilTs(d) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || ''); return m ? Date.parse(d + 'T23:59:59+05:00') : 0; }
  function cta(id, sec, el) {
    var s = sec.s || {}, img = src(s.image), chips = (sec.b || []).filter(function (b) { return b.type === 'chip' && P(b.text); });
    var e = P(s.eyebrow), h = P(s.title), x = P(s.text), end = s.timer ? untilTs(s.until) : 0;
    var timer = end > Date.now() ? '<div class="ths-timer" data-until="' + end + '"><small>' + esc(P(s.timerLabel)) + '</small><div>' +
      ['d', 'h', 'm', 's'].map(function (u) { return '<span><b data-u="' + u + '">00</b><i>' + esc(t('ths.' + u)) + '</i></span>'; }).join('') + '</div></div>' : '';
    var form = s.form ? '<form class="ths-form" novalidate data-ths-form="' + esc(id) + '">' +
      '<h3>' + esc(P(s.formTitle)) + '</h3>' + (P(s.formText) ? '<p>' + esc(P(s.formText)) + '</p>' : '') +
      '<div class="field"><label for="' + id + 'N">' + esc(t('form.name')) + '</label><input id="' + id + 'N" name="name" autocomplete="name" placeholder="' + esc(t('form.namePh')) + '"><small class="err">' + esc(t('form.nameErr')) + '</small></div>' +
      '<div class="field"><label for="' + id + 'P">' + esc(t('form.phone')) + '</label><input id="' + id + 'P" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" class="js-phone"><small class="err"></small></div>' +
      '<button type="submit" class="btn btn-gold wide">' + esc(P(s.formBtn) || t('form.send')) + ic('arrow') + '</button>' +
      '<p class="ths-note">' + ic('shield') + esc(t('ths.note')) + '</p><p class="ths-ok" hidden>' + ic('check') + '<span>' + esc(t('ths.ok')) + '</span></p></form>' : '';
    el.innerHTML = (img ? '<div class="ths-cta-bg" aria-hidden="true"><img src="' + esc(img) + '" alt="" loading="lazy" decoding="async"></div>' : '') +
      '<div class="wrap ths-cta-grid' + (form ? '' : ' solo') + '"><div class="ths-cta-copy">' + (e ? '<p class="eyebrow">' + esc(e) + '</p>' : '') +
      (s.big ? '<div class="ths-big"><b>' + esc(tok(s.big)) + '</b><span>' + esc(P(s.bigLabel)) + '</span></div>' : '') +
      (h ? '<h2>' + nl(h) + '</h2>' : '') + (x ? '<p class="ths-lead">' + esc(x) + '</p>' : '') +
      (chips.length ? '<ul class="ths-chips">' + chips.map(function (b) { return '<li>' + ic('check') + esc(P(b.text)) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="ths-btns">' + btn(s.btn1, s.act1, s.url1) + btn(s.btn2, s.act2, s.url2, 'btn-ghost') + '</div>' + timer + '</div>' + form + '</div>';
    var ph = $('.js-phone', el); if (ph && window.AH_SITE) AH_SITE.phoneMask(ph);
    if (form) try { var me = JSON.parse(localStorage.getItem('ah3_me') || 'null') || {}; if (me.name) $('[name=name]', el).value = me.name; if (me.phone) ph.value = me.phone; } catch (x2) {} /* site.js → remember() */
  }

  /* ---------- 4) «Matn va tugma», 5) «Video» ---------- */
  function richtext(id, sec, el) {
    var s = sec.s || {};
    el.innerHTML = '<div class="wrap ths-rt' + (s.align === 'left' ? ' left' : '') + '">' + head({ eyebrow: s.eyebrow, title: s.title }, s.align !== 'left') +
      (P(s.text) ? '<div class="ths-text">' + lines(P(s.text)) + '</div>' : '') + (P(s.btn) ? '<div class="ths-btns">' + btn(s.btn, s.act, s.url) + '</div>' : '') + '</div>';
  }
  function frame(link) {
    var y = ytId(link), g = igId(link);
    if (y) return '<iframe src="https://www.youtube-nocookie.com/embed/' + y + '?rel=0" title="Video" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    if (g) return '<iframe src="https://www.instagram.com/p/' + g + '/embed" title="Instagram" loading="lazy" allowfullscreen></iframe>';
    return '';
  }
  function video(id, sec, el) {
    var s = sec.s || {}, f = s.video ? src(s.video) : '', fr = !f && s.link ? frame(s.link) : '';
    var m = f ? '<video src="' + esc(f) + '"' + (s.poster ? ' poster="' + esc(src(s.poster)) + '"' : '') + ' controls playsinline preload="metadata"></video>' : fr || (PREVIEW ? '<div class="ths-vph">' + ic('video') + '<span>' + esc(t('ths.sample')) + '</span></div>' : '');
    if (!m) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = '<div class="wrap ths-vid">' + head({ eyebrow: s.eyebrow, title: s.title }, true) + '<div class="ths-vid-box' + (igId(s.link) && !f ? ' ig' : '') + '">' + m + '</div>' + (P(s.text) ? '<div class="ths-text center">' + lines(P(s.text)) + '</div>' : '') + '</div>';
  }
  var RENDER = { stars: stars, about: about, cta: cta, richtext: richtext, video: video };

  /* ---------- bo'limlarni joylash ---------- */
  function nativeEl(id) {
    var n = TH.native(id); if (!n) return null;
    if (n.find) return $(n.find);
    var x = $('#p-home ' + n.has); if (!x) return null;
    while (x && x.parentNode && x.parentNode.id !== 'p-home') x = x.parentNode;
    return x && x.parentNode ? x : null;
  }
  function elOf(id) { return TH.native(id) ? nativeEl(id) : document.getElementById('ths-' + id); }
  var mo = null, busy = false;
  function place() {
    var host = $('#p-home'); if (!host) return;
    busy = true; if (mo) mo.disconnect();
    /* yangi bo'limlar */
    Object.keys(CUR.sec).forEach(function (id) {
      var sc = CUR.sec[id]; if (sc.type === 'native' || !RENDER[sc.type]) return;
      var el = document.getElementById('ths-' + id);
      if (!sc.on) { if (el) el.remove(); return; }
      var fresh = !el;
      if (fresh) { el = document.createElement('section'); el.id = 'ths-' + id; host.appendChild(el); }
      /* ths-wait → ths-in: ekranga kirganda bir marta ochiladi; qayta chizilganda holat saqlanadi */
      var st = el.classList.contains('ths-in') ? ' ths-in' : (fresh ? io : el.classList.contains('ths-wait')) ? ' ths-wait' : '';
      el.className = 'ths ths-' + sc.type + ' ths-' + ((CUR.s || {}).surface === 'dark' ? 'dark' : 'light') + st;
      el.setAttribute('data-ths', id);
      RENDER[sc.type](id, sc, el);
      if (fresh && io) io.observe(el);
    });
    $$('#p-home > [data-ths]').forEach(function (el) { var id = el.getAttribute('data-ths'); if (!TH.native(id) && !(CUR.sec[id] && CUR.sec[id].on)) el.remove(); });
    order();
    busy = false; watch();
  }
  /* tartib va ko'rinish; boshqa skriptlar blokni qayta chizsa ham tartib saqlanadi */
  function order() {
    var host = $('#p-home'); if (!host) return;
    TH.NATIVE.forEach(function (n) { var el = nativeEl(n.id); if (!el) return; el.setAttribute('data-ths', n.id); el.classList.toggle('ths-off', !(CUR.sec[n.id] || {}).on); });
    /* «Biz haqimizda» bo'limi yoqilgan bo'lsa, eski qisqa «Biz haqimizda» kartasi takrorlanmaydi (izohlar kartasi qoladi) */
    var ab = $('[data-i="home.aboutText"]', host), card = ab && ab.closest('.teaser');
    if (card) { var dup = !!(CUR.sec.about && CUR.sec.about.on); card.hidden = dup; card.parentNode.classList.toggle('ths-one', dup); }
    var ref = host.firstElementChild;
    CUR.order.forEach(function (id) {
      var el = elOf(id); if (!el || el.parentNode !== host) return;
      if (el === ref) ref = ref.nextElementSibling; else host.insertBefore(el, ref);
    });
  }
  function watch() {
    var host = $('#p-home'), top = $('.top'); if (!host) return;
    if (!mo) mo = new MutationObserver(function () { if (busy) return; busy = true; mo.disconnect(); order(); busy = false; watch(); });
    mo.observe(host, { childList: true }); if (top) mo.observe(top, { childList: true });
  }

  /* ---------- kirish animatsiyasi ---------- */
  var io = 'IntersectionObserver' in window && !PREVIEW ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.replace('ths-wait', 'ths-in'); io.unobserve(e.target); } }); }, { threshold: .08 }) : null;

  /* ---------- raqamlar (Sozlamalar → Raqamlar) ---------- */
  var CFG0 = window.AH_CFG0 || {};
  function applyCfg(cfg) {
    var ch = false;
    NUMK.forEach(function (k) { var v = cfg && cfg[k] !== '' && cfg[k] != null ? cfg[k] : CFG0[k]; if (v != null && CFG[k] !== v) { CFG[k] = v; ch = true; } });
    var y = new Date().getFullYear() - (+CFG.FOUNDED || 2012); if (CFG.EXPERIENCE_YEARS !== y) { CFG.EXPERIENCE_YEARS = y; ch = true; }
    if (!ch) return false;
    $$('[data-count="years"]').forEach(function (el) { el.textContent = CFG.EXPERIENCE_YEARS; });
    if (window.AH_NUMS) AH_NUMS();
    return true;
  }

  /* ---------- mavzuni almashtirish (jonli) ---------- */
  function setTheme(th, cfg) {
    var txt = JSON.stringify(th.text || {}) !== JSON.stringify(CUR.text || {});
    CUR = th; window.AH_TTEXT = th.text || {};
    var nums = cfg ? applyCfg(cfg) : false;
    style(CUR);
    if (txt || nums) I18N.set(I18N.lang); /* barcha matnlar qayta chiziladi → place() */
    else place();
  }
  /* 'ah_cms' o'zgardi: faqat mavzu va raqamlar o'zgargan bo'lsa — sahifa qayta yuklanmaydi */
  function prune(o) {
    if (Array.isArray(o)) { var a = o.map(prune).filter(function (x) { return x !== undefined; }); return a.length ? a : undefined; }
    if (o && typeof o === 'object') { var r = {}, n = 0; Object.keys(o).sort().forEach(function (k) { var v = prune(o[k]); if (v !== undefined) { r[k] = v; n++; } }); return n ? r : undefined; }
    return o === '' || o == null ? undefined : o;
  }
  function rest(c) {
    c = TH.clone(c || {}); delete c.themes; delete c.v; delete c.stars; delete c.ig; delete c.funnel; /* yulduzlar, Instagram videolari va sotuv oynalari ham joyida yangilanadi (js/lux-sections.js, js/funnel.js) */
    if (c.cfg) NUMK.forEach(function (k) { delete c.cfg[k]; });
    if (c.media && c.media.place === 'home') delete c.media.place; /* kabinet qo'yadigan standart qiymat */
    return JSON.stringify(prune(c) || {});
  }
  function live(json) {
    var N; try { N = JSON.parse(json || 'null'); } catch (e) { return false; }
    if (!N || rest(N) !== rest(window.AH_CMS)) return false;
    var O = window.AH_CMS || {}, ch = function (k) { return JSON.stringify(N[k] || null) !== JSON.stringify(O[k] || null); }, st = ch('stars'), ig = ch('ig'), fn = ch('funnel');
    window.AH_CMS = N;
    if (st && window.AH_AMB) AH_AMB();
    if (ig && window.AH_IG) AH_IG();
    if ((fn || st) && window.AH_FUNNEL) AH_FUNNEL();
    if (!DRAFT) setTheme(TH.liveOf(N), N.cfg || {});
    return true;
  }

  /* ---------- video oynasi ---------- */
  var modal = null;
  function closeModal() { if (!modal || modal.hidden) return; modal.hidden = true; $('.ths-modal-media', modal).innerHTML = ''; document.body.classList.remove('lock'); }
  function play(v) {
    if (!modal) {
      modal = document.createElement('div'); modal.className = 'ths-modal'; modal.hidden = true; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = '<div class="ths-modal-box"><button type="button" class="ths-x" data-ths-x>' + ic('x') + '</button><div class="ths-modal-media"></div><div class="ths-modal-cap"></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-ths-x]')) closeModal(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    }
    var box = $('.ths-modal-media', modal), f = v.video ? src(v.video) : '', fr = !f && v.link ? frame(v.link) : '';
    $('[data-ths-x]', modal).setAttribute('aria-label', t('ths.close'));
    $('.ths-modal-cap', modal).innerHTML = '<b>' + esc(v.name) + '</b>' + (v.role ? '<span>' + esc(v.role) + '</span>' : '') + (v.quote ? '<p>' + esc(v.quote) + '</p>' : '');
    if (f) {
      box.className = 'ths-modal-media';
      box.innerHTML = '<video controls autoplay playsinline' + (v.poster ? ' poster="' + esc(src(v.poster)) + '"' : '') + '></video>';
      var ve = $('video', box);
      (f.indexOf('idb:') === 0 && window.Store ? Store.mediaURL(f) : Promise.resolve(f)).then(function (u) { if (u) { ve.src = u; var p = ve.play(); if (p && p.catch) p.catch(function () {}); } });
    } else if (fr) { box.className = 'ths-modal-media' + (igId(v.link) ? ' ig' : ''); box.innerHTML = fr.replace('?rel=0', '?rel=0&autoplay=1'); }
    else if (v.link) { window.open(v.link, '_blank', 'noopener'); return; }
    else return;
    modal.hidden = false; document.body.classList.add('lock');
  }

  /* ---------- hodisalar ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ths-act]');
    if (b && window.AH_SITE) { if (b.dataset.thsAct === 'video') AH_SITE.call('video'); else AH_SITE.book({ topic: (b.textContent || '').trim() }); return; }
    var p = e.target.closest('[data-play]');
    if (p) { var v = MEDIA[p.dataset.play]; if (v && !v.sample) play(v); return; }
    var f = e.target.closest('[data-ths-f]');
    if (f) {
      var sec = f.closest('.ths'), k = f.dataset.thsF;
      $$('[data-ths-f]', sec).forEach(function (x) { x.setAttribute('aria-pressed', String(x === f)); });
      $$('.ths-reel', sec).forEach(function (r) { r.hidden = k !== 'all' && r.dataset.k !== k; });
    }
  });
  /* kompyuterda: video kartasi ustiga kelganda ovozsiz oldindan ko'rish */
  if (matchMedia('(hover: hover)').matches) {
    document.addEventListener('mouseover', function (e) {
      var b = e.target.closest('.ths-reel-btn'); if (!b || b.dataset.hv) return;
      var v = MEDIA[b.dataset.play], f = v && v.video ? src(v.video) : ''; if (!f || !isFile(f) || !$('img', b)) return;
      b.dataset.hv = '1';
      var el = document.createElement('video'); el.muted = true; el.playsInline = true; el.loop = true; el.className = 'ths-hover';
      (f.indexOf('idb:') === 0 && window.Store ? Store.mediaURL(f) : Promise.resolve(f)).then(function (u) { if (!u || !b.dataset.hv) return; el.src = u; $('.ths-reel-media', b).appendChild(el); var p = el.play(); if (p && p.catch) p.catch(function () {}); });
      b.addEventListener('mouseleave', function out() { b.removeEventListener('mouseleave', out); delete b.dataset.hv; el.remove(); });
    });
  }
  document.addEventListener('submit', function (e) {
    var fm = e.target.closest('[data-ths-form]'); if (!fm) return;
    e.preventDefault();
    var S = window.AH_SITE, n = $('[name=name]', fm), ph = $('[name=phone]', fm);
    var ok = S ? S.checkName(n) & S.checkPhone(ph) : n.value.trim().length > 1;
    if (!ok) return;
    var sc = CUR.sec[fm.dataset.thsForm] || {}, topic = P((sc.s || {}).eyebrow) + ': ' + P((sc.s || {}).title);
    if (PREVIEW) { if (S) S.toast(t('ths.prev')); }
    else if (window.CRM) { CRM.deliver({ src: 'callback', name: n.value.trim(), phone: ph.value.trim(), unit: topic.slice(0, 120), lang: I18N.lang }); if (S) S.remember(n.value.trim(), ph.value.trim()); }
    $$('.field, [type=submit]', fm).forEach(function (x) { x.hidden = true; });
    $('.ths-ok', fm).hidden = false;
  });
  /* rasm yoki video topilmasa — bo'sh oyna ko'rsatilmaydi */
  document.addEventListener('error', function (e) {
    var el = e.target; if (!el || (el.tagName !== 'IMG' && el.tagName !== 'VIDEO') || !el.closest('.ths')) return;
    var card = el.closest('.ths-reel');
    if (card) {
      var bt = $('[data-play]', card), v = bt && MEDIA[bt.dataset.play], f = v && v.video ? src(v.video) : '';
      if (el.tagName === 'IMG' && f && isFile(f)) { var ve = document.createElement('video'); ve.muted = true; ve.playsInline = true; ve.preload = 'metadata'; ve.src = f; el.replaceWith(ve); return; }
      if (el.tagName === 'IMG' && v && (v.link || v.sample)) { el.remove(); return; }
      var grid = card.parentNode; card.remove();
      if (grid) tidy(grid);
      return;
    }
    var box = el.closest('.ths-about-media, .ths-cta-bg, .ths-quote img');
    if (box) { box.remove(); return; }
    if (el.closest('.ths-vid-box')) { var sec = el.closest('.ths'); if (sec && !PREVIEW) sec.hidden = true; }
  }, true);

  /* teskari sanoq */
  setInterval(function () {
    $$('.ths-timer[data-until]').forEach(function (el) {
      var d = Math.max(0, +el.dataset.until - Date.now()), v = { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
      if (!d) { el.remove(); return; }
      $$('[data-u]', el).forEach(function (b) { b.textContent = String(v[b.dataset.u]).padStart(2, '0'); });
    });
  }, 1000);

  /* ---------- kabinetdagi tahrirlagich bilan aloqa (?preview=1) ---------- */
  function present() { var o = {}; TH.NATIVE.forEach(function (n) { o[n.id] = !!nativeEl(n.id); }); return o; }
  function keysOf(id) {
    var n = TH.native(id), el = nativeEl(id), ks = (n && n.keys || []).slice(), out = [], saved = window.AH_TTEXT;
    if (el) $$('[data-i]', el).forEach(function (x) { ks.push(x.getAttribute('data-i')); });
    window.AH_TTEXT = {};
    ks.forEach(function (k) { if (out.some(function (o) { return o.k === k; })) return; var v = I18N.t(k); if (v && v !== k) out.push({ k: k, v: v }); });
    window.AH_TTEXT = saved;
    return out;
  }
  var hl = null;
  function mark(el, id, flash) {
    if (!hl) { hl = document.createElement('div'); hl.className = 'ths-hl'; hl.innerHTML = '<span></span>'; document.body.appendChild(hl); }
    var r = el && el.getBoundingClientRect();
    if (!el || el.classList.contains('ths-off') || !r.height) { hl.hidden = true; return; }
    var n = TH.native(id), sc = CUR.sec[id] || {}, ty = TH.TYPES[sc.type];
    hl.hidden = false; hl.style.cssText = 'top:' + (r.top + scrollY) + 'px;left:' + (r.left + scrollX) + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
    $('span', hl).textContent = (window.AH_TE_NAMES && AH_TE_NAMES[id]) || (n ? n.name : ty ? ty.name : id);
    hl.classList.toggle('flash', !!flash);
  }
  if (PREVIEW) {
    var send = function (m) { m.ah = 'te'; window.parent.postMessage(m, '*'); };
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent) return;
      var d = e.data || {}; if (d.ah !== 'te') return;
      if (d.op === 'theme') { DRAFT = true; window.AH_TE_NAMES = d.names || null; if (d.lang && d.lang !== I18N.lang) { var keep = localStorage.getItem('ah_lang'); I18N.set(d.lang); try { if (keep) localStorage.setItem('ah_lang', keep); } catch (x) {} } setTheme(TH.normalize(d.theme), d.cfg || {}); send({ op: 'present', present: present() }); }
      if (d.op === 'focus') {
        if ((location.hash || '#home') !== '#home') location.hash = '#home';
        var el = elOf(d.id), top = $('.top'), off = top && getComputedStyle(top).position !== 'static' ? top.offsetHeight : 0;
        if (el && !el.classList.contains('ths-off')) { window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + scrollY - (d.id === 'ann' ? 0 : off)), behavior: d.instant ? 'auto' : 'smooth' }); setTimeout(function () { mark(el, d.id, true); }, d.instant ? 0 : 450); }
      }
      if (d.op === 'keys') send({ op: 'keys', id: d.id, keys: keysOf(d.id) });
    });
    document.addEventListener('mousemove', function (e) { var el = e.target.closest && e.target.closest('#p-home > [data-ths], .top > .ann'); mark(el, el && (el.getAttribute('data-ths') || 'ann')); }, { passive: true });
    document.addEventListener('click', function (e) { var el = e.target.closest('#p-home > [data-ths], .top > .ann'); if (el) send({ op: 'pick', id: el.getAttribute('data-ths') || 'ann' }); }, true);
    window.addEventListener('scroll', function () { if (hl) hl.hidden = true; }, { passive: true });
  }

  /* ---------- ishga tushirish ---------- */
  function boot() {
    place();
    if (window.Store) { Store.on('reviews', function () { place(); }); Store.on('cms', function () { if (!API) return; fetch(API + '/api/cms', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (R) { if (R && window.AH_ADOPT) AH_ADOPT(R); }).catch(function () {}); }); }
    I18N.on(function () { setTimeout(place, 0); });
    if (PREVIEW) window.parent.postMessage({ ah: 'te', op: 'ready', present: present() }, '*');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.AH_THEME = { live: live, current: function () { return CUR; }, setTheme: setTheme };
})();
