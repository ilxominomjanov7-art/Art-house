/* =====================================================================
   ART HOUSE — qo'shimcha lyuks bloklar (icon-amsterdam.com uslubidan ilhomlangan)
   1) yuqoridagi aylanuvchi e'lon qatori
   2) «Ular Art House'ni tanladi» — taniqli insonlar kartalari (kabinet → Yulduzlar)
   3) Instagram — telefon ichida Reels videolari (animatsiya), sahifaga havola
   4) pastki qismda ijtimoiy tarmoq ikonkalari
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG) return;
  var X = {
    uz: { 'dock.ai': 'AI maslahat', 'mn.promo': "0% foizsiz bo'lib to'lash", 'mn.service': 'Mijozlarga xizmat', 'ann.1': "0% — foizsiz bo'lib to'lash, 36 oygacha", 'ann.2': "Quruvchidan to'g'ridan-to'g'ri — vositachilarsiz", 'ann.3': 'Bepul konsultatsiya va obyektga sayohat', 'ig.follow': '@arthouse.tashkent sahifasini kuzating', 'amb.title': "Ular Art House'ni tanladi", 'amb.sub': "Taniqli insonlar Art House'ga ishonadi va uni tavsiya qiladi — chunki ular uchun sifat, ishonch va qulaylik birinchi o'rinda.", 'ig.lead': "Yangi loyihalar, qurilish jarayoni va kalit topshirish lahzalari — birinchi bo'lib Instagram sahifamizda.", 'ig.btn': "Instagram'da kuzatish", 'ig.sound': "Ovozni yoqish", 'hi.bldFull': "To'liq ekranda ko'rish" },
    ru: { 'dock.ai': 'AI-совет', 'mn.promo': 'Рассрочка 0%', 'mn.service': 'Клиентский сервис', 'ann.1': '0% — рассрочка без процентов до 36 месяцев', 'ann.2': 'Напрямую от застройщика — без посредников', 'ann.3': 'Бесплатная консультация и экскурсия на объект', 'ig.follow': 'Подписывайтесь на @arthouse.tashkent', 'amb.title': "Они выбрали Art House", 'amb.sub': "Известные люди доверяют Art House и рекомендуют его — потому что для них на первом месте качество, доверие и комфорт.", 'ig.lead': "Новые проекты, ход строительства и вручение ключей — первыми в нашем Instagram.", 'ig.btn': "Смотреть в Instagram", 'ig.sound': "Включить звук", 'hi.bldFull': "Смотреть на весь экран" },
    en: { 'dock.ai': 'AI advisor', 'mn.promo': '0% instalments', 'mn.service': 'Client services', 'ann.1': '0% instalments — interest-free for up to 36 months', 'ann.2': 'Direct from the developer — no middlemen', 'ann.3': 'Free consultation and site tour', 'ig.follow': 'Follow @arthouse.tashkent', 'amb.title': "They chose Art House", 'amb.sub': "Well-known people trust Art House and recommend it — because quality, trust and comfort come first for them.", 'ig.lead': "New projects, construction progress and key handovers — first on our Instagram.", 'ig.btn': "Follow on Instagram", 'ig.sound': "Turn sound on", 'hi.bldFull': "Watch full screen" },
    fr: { 'dock.ai': 'Conseil IA', 'mn.promo': 'Paiement échelonné 0 %', 'mn.service': 'Service client', 'ann.1': "0 % — paiement échelonné sans intérêts jusqu'à 36 mois", 'ann.2': 'En direct du promoteur — sans intermédiaire', 'ann.3': 'Consultation gratuite et visite du chantier', 'ig.follow': 'Suivez @arthouse.tashkent', 'amb.title': "Ils ont choisi Art House", 'amb.sub': "Des personnalités font confiance à Art House et le recommandent, car la qualité, la confiance et le confort passent avant tout.", 'ig.lead': "Nouveaux projets, avancement des travaux et remises de clés — en avant-première sur notre Instagram.", 'ig.btn': "Suivre sur Instagram", 'ig.sound': "Activer le son", 'hi.bldFull': "Voir en plein écran" },
    it: { 'dock.ai': 'Consulente IA', 'mn.promo': 'Rate allo 0%', 'mn.service': 'Servizio clienti', 'ann.1': '0% — rateizzazione senza interessi fino a 36 mesi', 'ann.2': 'Direttamente dal costruttore — senza intermediari', 'ann.3': 'Consulenza gratuita e visita del cantiere', 'ig.follow': 'Segui @arthouse.tashkent', 'amb.title': "Hanno scelto Art House", 'amb.sub': "Personaggi noti si fidano di Art House e lo consigliano, perché per loro qualità, fiducia e comfort vengono prima di tutto.", 'ig.lead': "Nuovi progetti, avanzamento dei lavori e consegne delle chiavi: in anteprima sul nostro Instagram.", 'ig.btn': "Seguici su Instagram", 'ig.sound': "Attiva l'audio", 'hi.bldFull': "Guarda a schermo intero" },
    es: { 'dock.ai': 'Asesor IA', 'mn.promo': 'Plazos al 0 %', 'mn.service': 'Atención al cliente', 'ann.1': '0 % — pago a plazos sin intereses hasta 36 meses', 'ann.2': 'Directo del promotor — sin intermediarios', 'ann.3': 'Asesoría gratuita y visita a la obra', 'ig.follow': 'Sigue a @arthouse.tashkent', 'amb.title': "Eligieron Art House", 'amb.sub': "Personas conocidas confían en Art House y lo recomiendan, porque para ellas la calidad, la confianza y el confort son lo primero.", 'ig.lead': "Nuevos proyectos, avance de obra y entregas de llaves: primero en nuestro Instagram.", 'ig.btn': "Seguir en Instagram", 'ig.sound': "Activar sonido", 'hi.bldFull': "Ver en pantalla completa" },
    de: { 'dock.ai': 'KI-Berater', 'mn.promo': '0 % Ratenzahlung', 'mn.service': 'Kundenservice', 'ann.1': '0 % — zinsfreie Ratenzahlung bis zu 36 Monate', 'ann.2': 'Direkt vom Bauträger — ohne Vermittler', 'ann.3': 'Kostenlose Beratung und Objektbesichtigung', 'ig.follow': 'Folgen Sie @arthouse.tashkent', 'amb.title': "Sie haben Art House gewählt", 'amb.sub': "Bekannte Persönlichkeiten vertrauen Art House und empfehlen es – denn Qualität, Vertrauen und Komfort stehen für sie an erster Stelle.", 'ig.lead': "Neue Projekte, Baufortschritt und Schlüsselübergaben – zuerst auf unserem Instagram.", 'ig.btn': "Auf Instagram folgen", 'ig.sound': "Ton einschalten", 'hi.bldFull': "Im Vollbild ansehen" },
    tr: { 'dock.ai': 'AI danışman', 'mn.promo': '%0 taksit', 'mn.service': 'Müşteri hizmetleri', 'ann.1': '%0 — 36 aya kadar faizsiz taksit', 'ann.2': 'Doğrudan müteahhitten — aracısız', 'ann.3': 'Ücretsiz danışmanlık ve şantiye turu', 'ig.follow': "@arthouse.tashkent'i takip edin", 'amb.title': "Art House'u seçtiler", 'amb.sub': "Tanınmış isimler Art House'a güveniyor ve tavsiye ediyor — çünkü onlar için kalite, güven ve konfor her şeyden önce gelir.", 'ig.lead': "Yeni projeler, inşaat süreci ve anahtar teslimleri — ilk önce Instagram sayfamızda.", 'ig.btn': "Instagram'da takip et", 'ig.sound': "Sesi aç", 'hi.bldFull': "Tam ekran izle" }
  };
  Object.keys(X).forEach(function (l) { I18N.extend(l, X[l]); });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var t = function (k) { return I18N.t(k); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pick = function (o) { return I18N.pick(o); };
  var gt = function (f) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + f + '"/></svg>'; };

  /* 1) e'lon qatori */
  var ann = document.createElement('div'); ann.className = 'ann'; ann.setAttribute('role', 'region');
  var ai = 0, ANN = ['ann.1', 'ann.2', 'ann.3'];
  function annDraw() { ann.innerHTML = '<button type="button" data-ad="-1" aria-label="‹"><svg class="ic"><use href="#i-left"/></svg></button><p><span>' + esc(t(ANN[ai])) + '</span></p><button type="button" data-ad="1" aria-label="›"><svg class="ic"><use href="#i-right"/></svg></button>'; }
  function annGo(d) { ai = (ai + d + ANN.length) % ANN.length; var sp = $('p span', ann); if (!sp) return annDraw(); sp.classList.add('out'); setTimeout(annDraw, 260); }
  var top = $('.top'); if (top) { top.insertBefore(ann, top.firstChild); annDraw(); }
  ann.addEventListener('click', function (e) { var b = e.target.closest('[data-ad]'); if (b) { annGo(+b.dataset.ad); clearInterval(at); at = setInterval(function () { annGo(1); }, 5000); } });
  var at = setInterval(function () { annGo(1); }, 5000);

  /* 2) «Ular Art House'ni tanladi» — taniqli insonlar kartalari (icon-amsterdam.com «Worn by ICONS» uslubida).
     Ro'yxat: kabinet → Sayt → Yulduzlar (AH_CMS.stars), bo'lmasa CFG.AMBASSADORS. Rasm bo'sh — standart rasm. */
  var VER = '<svg class="amb2-v" viewBox="0 0 24 24" aria-label="✓"><path fill="#3897F0" d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3-1-3 2.6-1.9 1-3 3.2.1z"/><path d="m8 12.2 2.7 2.6L16.2 9.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function igURL(h) { h = String(h || '').trim(); if (!h) return ''; if (/^https?:\/\//.test(h)) return h; return 'https://www.instagram.com/' + h.replace(/^@/, '').replace(/\/+$/, '') + '/'; }
  function igName(h) { var m = String(h || '').match(/instagram\.com\/([\w.]+)/); return '@' + (m ? m[1] : String(h || '').replace(/^@/, '')); }
  function ambData() {
    var C = (window.AH_CMS || {}).stars || {}, D = CFG.AMBASSADORS || [];
    var L = (Array.isArray(C.list) ? C.list : D).filter(function (a) { return a && a.on !== false && a.name; }).map(function (a) {
      var d = D.filter(function (x) { return x.id && x.id === a.id; })[0] || {};
      return Object.assign({}, a, { photo: a.photo || d.photo || '' });
    }).filter(function (a) { return a.photo; });
    return { L: L, title: pick(C.title) || t('amb.title'), sub: pick(C.sub) || t('amb.sub') };
  }
  function amb() {
    var old = $('#ambSec'), host = $('#p-home'); if (!host) return;
    var A = ambData(), L = A.L;
    if (!L.length) { if (old) old.remove(); return; }
    var s = document.createElement('section'); s.id = 'ambSec'; s.className = 'amb2';
    s.innerHTML = '<div class="wrap"><div class="amb2-head"><h2>' + esc(A.title) + '</h2><p>' + esc(A.sub) + '</p></div></div>' +
      '<div class="amb2-rail"><button type="button" class="amb2-nav prev" data-amb="-1" aria-label="‹">' + gt('left') + '</button><div class="amb2-track">' + L.map(function (a, i) {
        var u = igURL(a.ig), ph = String(a.photo), img = '<img ' + (ph.indexOf('idb:') === 0 ? 'data-src' : 'src') + '="' + esc(ph) + '" alt="' + esc(a.name) + '" loading="' + (i < 3 ? 'eager' : 'lazy') + '" decoding="async">';
        return '<' + (u ? 'a href="' + esc(u) + '" target="_blank" rel="noopener"' : 'div') + ' class="amb2-card" style="--d:' + (i * 90) + 'ms">' +
          '<div class="amb2-ph">' + img + (pick(a.badge) ? '<span class="amb2-badge">' + esc(pick(a.badge)) + '</span>' : '') + (u ? '<span class="amb2-ig" aria-hidden="true">' + gt('ig') + '</span>' : '') + '</div>' +
          '<div class="amb2-cap"><b><span>' + esc(a.name) + '</span>' + (a.verified ? VER : '') + '</b>' + (pick(a.role) ? '<span>' + esc(pick(a.role)) + '</span>' : '') + (u ? '<em>' + gt('ig') + esc(igName(a.ig)) + '</em>' : '') + '</div></' + (u ? 'a' : 'div') + '>';
      }).join('') + '</div><button type="button" class="amb2-nav next" data-amb="1" aria-label="›">' + gt('right') + '</button></div>' +
      (L.length > 1 ? '<div class="amb2-dots" aria-hidden="true">' + L.map(function (_, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</div>' : '');
    if (old) old.replaceWith(s); else { var ap = $('#hiApts'); ap ? ap.after(s) : host.appendChild(s); }
    var tr = $('.amb2-track', s), dots = s.querySelectorAll('.amb2-dots i');
    var step = function () { var c = tr.firstElementChild; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(tr).columnGap || 16) : 300; };
    var sync = function () { var k = Math.round(tr.scrollLeft / step()); if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4) k = dots.length - 1; dots.forEach(function (d, i) { d.classList.toggle('on', i === k); });
      s.classList.toggle('at-start', tr.scrollLeft < 4); s.classList.toggle('at-end', tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4); };
    tr.addEventListener('scroll', sync, { passive: true }); sync();
    s.addEventListener('click', function (e) { var b = e.target.closest('[data-amb]'); if (b) tr.scrollBy({ left: +b.dataset.amb * step(), behavior: 'smooth' }); });
    if ('IntersectionObserver' in window) { s.classList.add('amb2-wait'); var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { s.classList.remove('amb2-wait'); io.disconnect(); } }, { threshold: .15 }); io.observe(s); }
  }
  window.AH_AMB = amb; /* kabinetdan o'zgarganda (js/theme.js → live) qayta chiziladi */

  /* 3) Instagram: telefon ichida haqiqiy Reels (animatsiya bilan) + sahifaga havola.
     Videolar: kabinet → Sayt → Yulduzlar → «Instagram oynasi» (AH_CMS.ig.reels), bo'lmasa CFG.IG_REELS.
     Obunachi va post soni ko'rsatilmaydi. */
  var IG_IMG = CFG.IG_STRIP || ['assets/img/musaffo/majmua-kechki.webp', 'assets/img/musaffo/mehmonxona.webp', 'assets/img/musaffo/fasad-kunduzi.webp', 'assets/img/musaffo/oshxona.webp', 'assets/img/musaffo/dupleks-interyer.webp', 'assets/img/musaffo/yotoqxona.webp'];
  var IGG = '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id="igGr" cx="30%" cy="107%" r="150%"><stop offset="0" stop-color="#fdf497"/><stop offset=".05" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><rect x="1" y="1" width="22" height="22" rx="6.5" fill="url(#igGr)"/><rect x="5.6" y="5.6" width="12.8" height="12.8" rx="3.9" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="16.4" cy="7.6" r="1" fill="#fff"/></svg>';
  var SV = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>'; };
  var UI = { heart: SV('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
    msg: SV('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'), send: SV('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'), save: SV('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>'),
    cam: SV('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'),
    off: SV('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>'), on: SV('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>') };
  function reels() {
    var R = ((window.AH_CMS || {}).ig || {}).reels;
    R = (Array.isArray(R) && R.length ? R : CFG.IG_REELS || [{ src: 'assets/video/ig-reel-1.mp4', poster: 'assets/video/ig-reel-1.jpg' }]).filter(function (r) { return r && r.src; });
    return R;
  }
  function vAttr(a, v) { v = String(v || ''); return v ? ' ' + (v.indexOf('idb:') === 0 ? 'data-src' : a) + '="' + esc(v) + '"' : ''; }
  var igT = 0, igIO = null;
  function igStrip() {
    var old = $('#igStrip'); clearInterval(igT); if (igIO) igIO.disconnect();
    var host = $('#p-home'); if (!host || !CFG.INSTAGRAM) { if (old) old.remove(); return; }
    var U = esc(CFG.INSTAGRAM), H = esc(CFG.INSTAGRAM_HANDLE || '@arthouse.tashkent'), R = reels(), nm = H.replace(/^@/, '');
    var s = document.createElement('section'); s.id = 'igStrip'; s.className = 'igs2';
    s.innerHTML = '<div class="igs2-in"><div class="igs2-copy"><a class="igs2-logo" href="' + U + '" target="_blank" rel="noopener" aria-label="Instagram">' + IGG + '</a>' +
      '<p class="eyebrow">Instagram</p><h2>' + H + '</h2><p class="igs2-lead">' + esc(t('ig.lead')) + '</p>' +
      '<a class="hi-btn igs2-btn" href="' + U + '" target="_blank" rel="noopener">' + IGG + '<span>' + esc(t('ig.btn')) + '</span></a></div>' +
      '<div class="igs2-stage"><i class="igs2-glow"></i>' +
      '<img class="igs2-peek l" src="' + IG_IMG[0] + '" alt="" loading="lazy" decoding="async"><img class="igs2-peek r" src="' + IG_IMG[1] + '" alt="" loading="lazy" decoding="async">' +
      '<div class="igs2-phone"><i class="igs2-island"></i><a class="igs2-screen" href="' + U + '" target="_blank" rel="noopener" aria-label="Instagram ' + H + '">' +
      R.map(function (r, i) { return '<video class="igs2-v' + (i ? '' : ' on') + '" muted playsinline preload="' + (i ? 'none' : 'metadata') + '"' + (R.length > 1 ? '' : ' loop') + vAttr('src', r.src) + vAttr('poster', r.poster) + '></video>'; }).join('') +
      '<span class="igs2-top"><b>Reels</b>' + UI.cam + '</span>' +
      '<span class="igs2-side"><i>' + UI.heart + '</i><i>' + UI.msg + '</i><i>' + UI.send + '</i><i>' + UI.save + '</i></span>' +
      '<span class="igs2-bot"><span class="igs2-who"><svg class="igs2-av" viewBox="0 0 100 100" aria-hidden="true"><use href="#logo"/></svg><b>' + nm + '</b><em>Follow</em></span><span class="igs2-cap">♫ ' + nm + ' · Original audio</span></span>' +
      '<span class="igs2-hearts" aria-hidden="true"></span><span class="igs2-prog"><i></i></span></a>' +
      '<button type="button" class="igs2-snd" aria-label="' + esc(t('ig.sound')) + '" aria-pressed="false">' + UI.off + '</button></div></div></div>';
    if (old) old.replaceWith(s); else { var cta = $('#p-home .cta-band'); cta ? cta.closest('.wrap').after(s) : host.appendChild(s); }
    var vids = s.querySelectorAll('.igs2-v'), k = 0, vis = false, snd = $('.igs2-snd', s), hearts = $('.igs2-hearts', s), bar = $('.igs2-prog i', s);
    var cur = function () { return vids[k]; };
    var play = function () { var v = cur(); if (!v) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    vids.forEach(function (v, i) {
      v.addEventListener('timeupdate', function () { if (i === k && v.duration) bar.style.transform = 'scaleX(' + (v.currentTime / v.duration) + ')'; });
      v.addEventListener('ended', function () { if (vids.length < 2) return; v.classList.remove('on'); v.classList.add('out'); setTimeout(function () { v.classList.remove('out'); v.currentTime = 0; }, 700);
        k = (k + 1) % vids.length; var n = cur(); n.muted = v.muted; n.preload = 'auto'; n.classList.add('on'); if (vis) play(); });
    });
    snd.addEventListener('click', function () { var m = !cur().muted; vids.forEach(function (v) { v.muted = m; }); snd.innerHTML = m ? UI.off : UI.on; snd.setAttribute('aria-pressed', String(!m)); if (!m) play(); });
    var heart = function () { if (!vis || document.hidden) return; var h = document.createElement('i'); h.innerHTML = UI.heart; h.style.setProperty('--x', (Math.random() * 28 - 14).toFixed(0) + 'px'); h.style.setProperty('--r', (Math.random() * 40 - 20).toFixed(0) + 'deg'); hearts.appendChild(h); setTimeout(function () { h.remove(); }, 2600); };
    igT = setInterval(heart, 1500);
    if ('IntersectionObserver' in window) { igIO = new IntersectionObserver(function (es) { vis = es[0].isIntersecting; s.classList.toggle('igs2-in-view', vis); if (vis) play(); else vids.forEach(function (v) { v.pause(); }); }, { threshold: .25 }); igIO.observe(s); }
    else { vis = true; play(); }
  }
  window.AH_IG = igStrip;

  /* 4) pastki qism: ijtimoiy tarmoqlar */
  function footSoc() {
    var col = $('.foot-in > div'); if (!col || $('.foot-soc', col)) return;
    var links = [[CFG.INSTAGRAM, 'ig', 'Instagram'], [CFG.TELEGRAM_CHANNEL, 'tg', 'Telegram'], [CFG.PHONE ? 'tel:' + CFG.PHONE : '', 'phone', 'Tel']].filter(function (x) { return x[0]; });
    col.insertAdjacentHTML('beforeend', '<div class="foot-soc">' + links.map(function (x) { return '<a href="' + esc(x[0]) + '"' + (x[0].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + ' aria-label="' + x[2] + '">' + gt(x[1]) + '</a>'; }).join('') + '</div>');
  }

  /* 5) pastki panelga AI maslahatchi tugmasi (telefonda suzuvchi tugma o'rniga) */
  function dockAi() {
    var d = $('#dock'); if (!d || $('[data-dock-ai]', d)) return;
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-dock-ai', '');
    b.innerHTML = '<svg class="ic" viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg><span data-i="dock.ai">' + esc(t('dock.ai')) + '</span>';
    var main = $('.dock-main', d); d.insertBefore(b, main);
    b.addEventListener('click', function () { var a = $('#aib'); if (a) a.click(); });
  }
  function all() { igStrip(); amb(); footSoc(); dockAi(); }
  all();
  I18N.on(function () { annDraw(); setTimeout(all, 0); });
})();
