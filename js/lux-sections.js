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
  /* Instagram belgisi — Figma'da chizilgan (rasmiy 2022 gradienti, iOS uslubidagi silliq burchaklar); assets/img/instagram.svg.
     Har bir nusxada gradient id alohida (bir sahifada ikki marta ishlatiladi) */
  var IGN = 0, IGS = '<svg class="igs2-ico" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M0 36C0 23.3988 0 17.0982 2.45235 12.2852C4.6095 8.05157 8.05157 4.6095 12.2852 2.45235C17.0982 0 23.3988 0 36 0H64C76.6012 0 82.9018 0 87.7148 2.45235C91.9484 4.6095 95.3905 8.05157 97.5476 12.2852C100 17.0982 100 23.3988 100 36V64C100 76.6012 100 82.9018 97.5476 87.7148C95.3905 91.9484 91.9484 95.3905 87.7148 97.5476C82.9018 100 76.6012 100 64 100H36C23.3988 100 17.0982 100 12.2852 97.5476C8.05157 95.3905 4.6095 91.9484 2.45235 87.7148C0 82.9018 0 76.6012 0 64V36Z" fill="url(#igGrad)"/><path d="M58.125 20C62.1907 20 64.2236 19.9997 65.9141 20.3359C72.8561 21.7168 78.2832 27.1439 79.6641 34.0859C80.0003 35.7764 80 37.8093 80 41.875V58.125C80 62.1907 80.0003 64.2236 79.6641 65.9141L79.5225 66.5605C77.9421 73.1915 72.6392 78.3264 65.9141 79.6641L65.5928 79.7227C64.3965 79.9259 62.9886 79.9807 60.8193 79.9951L58.125 80H41.875L39.1807 79.9951C37.0114 79.9807 35.6035 79.9259 34.4072 79.7227L34.0859 79.6641C27.1439 78.2832 21.7168 72.8561 20.3359 65.9141C20.0837 64.6462 20.0206 63.1856 20.0049 60.8193L20 58.125V41.875C20 38.0633 20.0003 36.0384 20.2773 34.4072L20.3359 34.0859C21.6736 27.3608 26.8085 22.0579 33.4395 20.4775L34.0859 20.3359C35.7764 19.9997 37.8093 20 41.875 20H58.125ZM41.875 25.4004C37.5507 25.4004 36.177 25.4265 35.1396 25.6328C30.3397 26.5876 26.5876 30.3397 25.6328 35.1396C25.4265 36.177 25.4004 37.5507 25.4004 41.875V58.125C25.4004 62.4493 25.4265 63.823 25.6328 64.8604C26.5876 69.6603 30.3397 73.4124 35.1396 74.3672C36.177 74.5735 37.5507 74.5996 41.875 74.5996H58.125C62.4493 74.5996 63.823 74.5735 64.8604 74.3672C69.6603 73.4124 73.4124 69.6603 74.3672 64.8604C74.5735 63.823 74.5996 62.4493 74.5996 58.125V41.875C74.5996 37.5507 74.5735 36.177 74.3672 35.1396C73.4124 30.3397 69.6603 26.5876 64.8604 25.6328C63.823 25.4265 62.4493 25.4004 58.125 25.4004H41.875ZM50.3984 34.6045C58.7196 34.8158 65.4004 41.6289 65.4004 50.001L65.3955 50.3984C65.1842 58.7193 58.3726 65.3999 50.001 65.4004L49.6035 65.3955C41.4142 65.1882 34.8124 58.5876 34.6045 50.3984L34.5996 50.001C34.5996 41.4957 41.4957 34.5996 50.001 34.5996L50.3984 34.6045ZM50.001 40C44.4781 40 40 44.4781 40 50.001C40.0005 55.5235 44.4784 60.001 50.001 60.001C55.5232 60.0005 60.0005 55.5232 60.001 50.001C60.001 44.4784 55.5235 40.0005 50.001 40ZM66.0146 30.3848C68.0029 30.3848 69.6152 31.9971 69.6152 33.9854C69.615 35.9734 68.0028 37.585 66.0146 37.585C64.0267 37.5848 62.4152 35.9733 62.415 33.9854C62.415 31.9972 64.0266 30.385 66.0146 30.3848Z" fill="white"/><defs><radialGradient id="igGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 104) scale(132)"><stop stop-color="#FFD600"/><stop offset="0.22" stop-color="#FF7A00"/><stop offset="0.46" stop-color="#FF0069"/><stop offset="0.72" stop-color="#D300C5"/><stop offset="1" stop-color="#7638FA"/></radialGradient></defs></svg>';
  function IGG() { var id = 'igGrad' + (++IGN); return IGS.replace(/igGrad/g, id); }
  var SV = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>'; };
  var UI = { heart: SV('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
    msg: SV('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'), send: SV('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'), save: SV('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>'),
    cam: SV('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'),
    prev: SV('<path d="m15 18-6-6 6-6"/>'), next: SV('<path d="m9 18 6-6-6-6"/>'),
    off: SV('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>'), on: SV('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>') };
  /* Reels ro'yxati: kabinet → Sayt → Instagram (AH_CMS.ig.reels), bo'lmasa js/ig-reels.js (standart 3 ta video) */
  function reels() {
    var D = window.AH_IG_REELS || CFG.IG_REELS || [], R = ((window.AH_CMS || {}).ig || {}).reels;
    /* kabinetdagi standart videolar faqat id va matn bilan saqlanadi — video va muqova standartdan olinadi */
    return (Array.isArray(R) ? R : D).map(function (r) { var d = D.filter(function (x) { return x.id && x.id === r.id; })[0] || {}; return Object.assign({}, d, r, { src: r.src || d.src, poster: r.poster || d.poster }); })
      .filter(function (r) { return r && r.src; });
  }
  function peeks() { var P = ((window.AH_CMS || {}).ig || {}).imgs; return [0, 1].map(function (i) { return (P && P[i]) || IG_IMG[i]; }); }
  /* subtitr shu tilda; yo'q bo'lsa: kirill — o'zbekchadan, qo'shilgan til — inglizcha */
  function capText(t) { var l = I18N.lang; t = t || {}; return t[l] || (l === 'cy' ? I18N.toCyr(t.uz || '') : '') || (['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr'].indexOf(l) < 0 ? t.en : '') || t.uz || ''; }
  function vAttr(a, v) { v = String(v || ''); return v ? ' ' + (v.indexOf('idb:') === 0 ? 'data-src' : a) + '="' + esc(v) + '"' : ''; }
  var igT = 0, igIO = null, SOUND = null; /* SOUND: null — hali tanlanmagan, true/false — foydalanuvchi tanlovi */
  function igStrip() {
    var old = $('#igStrip'); clearInterval(igT); if (igIO) igIO.disconnect();
    var host = $('#p-home'), R = reels(); if (!host || !CFG.INSTAGRAM) { if (old) old.remove(); return; }
    var U = esc(CFG.INSTAGRAM), H = esc(CFG.INSTAGRAM_HANDLE || '@arthouse.tashkent'), nm = H.replace(/^@/, ''), P = peeks();
    var s = document.createElement('section'); s.id = 'igStrip'; s.className = 'igs2';
    s.innerHTML = '<div class="igs2-in"><div class="igs2-copy"><a class="igs2-logo" href="' + U + '" target="_blank" rel="noopener" aria-label="Instagram">' + IGG() + '</a>' +
      '<p class="eyebrow">Instagram</p><h2>' + H + '</h2><p class="igs2-lead">' + esc(t('ig.lead')) + '</p>' +
      '<a class="hi-btn igs2-btn" href="' + U + '" target="_blank" rel="noopener">' + IGG() + '<span>' + esc(t('ig.btn')) + '</span></a></div>' +
      (R.length ? '<div class="igs2-stage"><i class="igs2-glow"></i>' +
      '<img class="igs2-peek l"' + vAttr('src', P[0]) + ' alt="" loading="lazy" decoding="async"><img class="igs2-peek r"' + vAttr('src', P[1]) + ' alt="" loading="lazy" decoding="async">' +
      '<div class="igs2-phone"><i class="igs2-island"></i><div class="igs2-screen" role="region" aria-roledescription="carousel" aria-label="Instagram Reels" tabindex="0">' +
      '<div class="igs2-feed">' + R.map(function (r, i) {
        return '<div class="igs2-slide' + (i ? ' next' : ' on') + '" data-i="' + i + '"><video class="igs2-v" muted playsinline loop preload="' + (i ? 'none' : 'metadata') + '"' + vAttr('src', r.src) + vAttr('poster', r.poster) + '></video></div>';
      }).join('') + '</div>' +
      '<span class="igs2-side"><i>' + UI.heart + '</i><i>' + UI.msg + '</i><i>' + UI.send + '</i><i>' + UI.save + '</i></span>' +
      '<span class="igs2-cc" aria-live="polite"></span>' +
      '<span class="igs2-bot"><span class="igs2-who"><svg class="igs2-av" viewBox="0 0 100 100" aria-hidden="true"><use href="#logo"/></svg><b>' + nm + '</b><em>Follow</em></span><span class="igs2-cap"></span></span>' +
      '<span class="igs2-hearts" aria-hidden="true"></span><span class="igs2-prog"><i></i></span></div>' +
      '<button type="button" class="igs2-snd" aria-label="' + esc(t('ig.sound')) + '" aria-pressed="false">' + UI.off + '<span>' + esc(t('ig.sound')) + '</span></button></div>' +
      (R.length > 1 ? '<div class="igs2-nav"><button type="button" data-ig="-1" aria-label="‹">' + UI.prev + '</button><span class="igs2-dots">' + R.map(function (_, i) { return '<i data-igi="' + i + '"' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</span><button type="button" data-ig="1" aria-label="›">' + UI.next + '</button></div>' : '') +
      '</div>' : '') + '</div>';
    if (old) old.replaceWith(s); else { var cta = $('#p-home .cta-band'); cta ? cta.closest('.wrap').after(s) : host.appendChild(s); }
    var scr = $('.igs2-screen', s), slides = s.querySelectorAll('.igs2-slide'), vids = s.querySelectorAll('.igs2-v'), cc = $('.igs2-cc', s), capEl = $('.igs2-cap', s);
    var snd = $('.igs2-snd', s), hearts = $('.igs2-hearts', s), bar = $('.igs2-prog i', s), dots = s.querySelectorAll('.igs2-dots i'), k = 0, vis = false;
    if (!R.length) return;
    var cur = function () { return vids[k]; };
    var wantSound = function () { return SOUND === true; };
    var play = function () { var v = cur(); if (!v || !vis) return; v.muted = !wantSound(); var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () {}); sync(); }); sync(); };
    var sync = function () { var on = !cur().muted; snd.innerHTML = (on ? UI.on : UI.off) + (on ? '' : '<span>' + esc(t('ig.sound')) + '</span>'); snd.classList.toggle('on', on); snd.setAttribute('aria-pressed', String(on)); };
    var meta = function () { var r = R[k]; capEl.textContent = '♫ ' + (r.by || nm) + ' · Original audio'; dots.forEach(function (d, i) { d.classList.toggle('on', i === k); }); };
    var caption = function () { var v = cur(), c = R[k].cap || [], tm = v.currentTime, x = ''; for (var i = 0; i < c.length; i++) if (tm >= c[i].s && tm < c[i].e) { x = capText(c[i].t); break; } if (cc.textContent !== x) { cc.textContent = x; cc.classList.toggle('on', !!x); } };
    /* yon tomonga almashish: d = 1 — o'ngdagi (keyingi), -1 — chapdagi; oxirgisidan keyin birinchisi keladi */
    var go = function (d, to) {
      var N = vids.length, n = to != null ? to : (k + d + N) % N; if (n === k || N < 2) return;
      if (to != null) d = n > k ? 1 : -1;
      var nx = slides[n]; nx.style.transition = 'none'; nx.className = 'igs2-slide ' + (d > 0 ? 'next' : 'prev'); void nx.offsetWidth; nx.style.transition = '';
      cur().pause(); slides[k].className = 'igs2-slide ' + (d > 0 ? 'prev' : 'next');
      k = n; nx.className = 'igs2-slide on';
      var v = cur(); v.preload = 'auto'; v.currentTime = 0; var nn = vids[(k + 1) % N]; if (nn.preload === 'none') nn.preload = 'metadata';
      cc.textContent = ''; cc.classList.remove('on'); meta(); play();
    };
    vids.forEach(function (v, i) {
      v.loop = vids.length < 2;
      v.addEventListener('timeupdate', function () { if (i !== k) return; if (v.duration) bar.style.transform = 'scaleX(' + (v.currentTime / v.duration) + ')'; caption(); });
      v.addEventListener('ended', function () { if (i === k) go(1); }); /* oxirgisidan keyin — birinchisiga */
    });
    /* yon tomonga surish (telefonda barmoq, kompyuterda sichqoncha bilan tortish), ← → tugmalar, nuqtalar va klaviatura;
       tepaga-pastga harakat sahifani aylantiradi; oddiy bosish — shu videoning Instagram sahifasi */
    var x0 = null, y0 = 0, t0 = 0, dx = 0, feed = $('.igs2-feed', s);
    scr.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; t0 = Date.now(); dx = 0; });
    scr.addEventListener('pointermove', function (e) { if (x0 == null) return; dx = e.clientX - x0; if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - y0)) feed.style.transform = 'translateX(' + Math.max(-70, Math.min(70, dx * .4)) + 'px)'; });
    var end = function (e) {
      if (x0 == null) return; var adx = Math.abs(dx), ady = Math.abs(e.clientY - y0); feed.style.transform = ''; x0 = null;
      if (adx > 40 && adx > ady) { go(dx < 0 ? 1 : -1); return; }
      if (adx < 10 && ady < 10 && Date.now() - t0 < 600) window.open(R[k].url || CFG.INSTAGRAM, '_blank', 'noopener');
    };
    scr.addEventListener('pointerup', end); scr.addEventListener('pointercancel', function () { x0 = null; feed.style.transform = ''; });
    var wt = 0; scr.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) < 25 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; e.preventDefault(); if (Date.now() - wt < 750) return; wt = Date.now(); go(e.deltaX > 0 ? 1 : -1); }, { passive: false }); /* sensorli panelda yon tomonga */
    scr.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } else if (e.key === 'Enter') window.open(R[k].url || CFG.INSTAGRAM, '_blank', 'noopener'); });
    s.addEventListener('click', function (e) { var b = e.target.closest('[data-ig]'), d = e.target.closest('[data-igi]'); if (b) go(+b.dataset.ig); else if (d) go(0, +d.dataset.igi); });
    snd.addEventListener('click', function () { SOUND = cur().muted; play(); });
    /* sahifada birinchi bosishdan keyin ovoz o'zi yoqiladi (brauzer ovozli avtomatik ijroni faqat shundan keyin ruxsat beradi) */
    var arm = function (e) { document.removeEventListener('pointerdown', arm, true); document.removeEventListener('keydown', arm, true); if (snd.contains(e.target)) return; /* ovoz tugmasining o'zi hal qiladi */ if (SOUND === null) SOUND = true; if (vis) play(); };
    document.addEventListener('pointerdown', arm, true); document.addEventListener('keydown', arm, true);
    var heart = function () { if (!vis || document.hidden) return; var h = document.createElement('i'); h.innerHTML = UI.heart; h.style.setProperty('--x', (Math.random() * 28 - 14).toFixed(0) + 'px'); h.style.setProperty('--r', (Math.random() * 40 - 20).toFixed(0) + 'deg'); hearts.appendChild(h); setTimeout(function () { h.remove(); }, 2600); };
    igT = setInterval(heart, 1500); meta(); sync();
    if ('IntersectionObserver' in window) { igIO = new IntersectionObserver(function (es) { vis = es[0].isIntersecting; s.classList.toggle('igs2-in-view', vis); if (vis) play(); else vids.forEach(function (v) { v.pause(); }); }, { threshold: .35 }); igIO.observe($('.igs2-phone', s)); }
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
