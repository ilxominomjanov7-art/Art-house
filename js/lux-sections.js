/* =====================================================================
   ART HOUSE — qo'shimcha lyuks bloklar (icon-amsterdam.com uslubidan ilhomlangan)
   1) yuqoridagi aylanuvchi e'lon qatori
   2) «Bizni tanlaganlar» — taniqli insonlar kartalari (CFG.AMBASSADORS)
   3) «@arthouse.tashkent'ni kuzating» — Instagram rasm lentasi
   4) pastki qismda ijtimoiy tarmoq ikonkalari
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG) return;
  var X = {
    uz: { 'mn.promo': "0% foizsiz bo'lib to'lash", 'mn.service': 'Mijozlarga xizmat', 'ann.1': "0% — foizsiz bo'lib to'lash, 36 oygacha", 'ann.2': "Quruvchidan to'g'ridan-to'g'ri — vositachilarsiz", 'ann.3': 'Bepul konsultatsiya va obyektga sayohat', 'ig.follow': '@arthouse.tashkent sahifasini kuzating', 'amb.title': 'Bizni tanlaganlar', 'amb.sub': 'Art House bilan birga' },
    ru: { 'mn.promo': 'Рассрочка 0%', 'mn.service': 'Клиентский сервис', 'ann.1': '0% — рассрочка без процентов до 36 месяцев', 'ann.2': 'Напрямую от застройщика — без посредников', 'ann.3': 'Бесплатная консультация и экскурсия на объект', 'ig.follow': 'Подписывайтесь на @arthouse.tashkent', 'amb.title': 'Нас выбирают', 'amb.sub': 'Вместе с Art House' },
    en: { 'mn.promo': '0% instalments', 'mn.service': 'Client services', 'ann.1': '0% instalments — interest-free for up to 36 months', 'ann.2': 'Direct from the developer — no middlemen', 'ann.3': 'Free consultation and site tour', 'ig.follow': 'Follow @arthouse.tashkent', 'amb.title': 'Chosen by', 'amb.sub': 'Together with Art House' },
    fr: { 'mn.promo': 'Paiement échelonné 0 %', 'mn.service': 'Service client', 'ann.1': "0 % — paiement échelonné sans intérêts jusqu'à 36 mois", 'ann.2': 'En direct du promoteur — sans intermédiaire', 'ann.3': 'Consultation gratuite et visite du chantier', 'ig.follow': 'Suivez @arthouse.tashkent', 'amb.title': 'Ils nous ont choisis', 'amb.sub': 'Avec Art House' },
    it: { 'mn.promo': 'Rate allo 0%', 'mn.service': 'Servizio clienti', 'ann.1': '0% — rateizzazione senza interessi fino a 36 mesi', 'ann.2': 'Direttamente dal costruttore — senza intermediari', 'ann.3': 'Consulenza gratuita e visita del cantiere', 'ig.follow': 'Segui @arthouse.tashkent', 'amb.title': 'Ci hanno scelto', 'amb.sub': 'Insieme ad Art House' },
    es: { 'mn.promo': 'Plazos al 0 %', 'mn.service': 'Atención al cliente', 'ann.1': '0 % — pago a plazos sin intereses hasta 36 meses', 'ann.2': 'Directo del promotor — sin intermediarios', 'ann.3': 'Asesoría gratuita y visita a la obra', 'ig.follow': 'Sigue a @arthouse.tashkent', 'amb.title': 'Nos eligen', 'amb.sub': 'Junto a Art House' },
    de: { 'mn.promo': '0 % Ratenzahlung', 'mn.service': 'Kundenservice', 'ann.1': '0 % — zinsfreie Ratenzahlung bis zu 36 Monate', 'ann.2': 'Direkt vom Bauträger — ohne Vermittler', 'ann.3': 'Kostenlose Beratung und Objektbesichtigung', 'ig.follow': 'Folgen Sie @arthouse.tashkent', 'amb.title': 'Sie vertrauen uns', 'amb.sub': 'Gemeinsam mit Art House' },
    tr: { 'mn.promo': '%0 taksit', 'mn.service': 'Müşteri hizmetleri', 'ann.1': '%0 — 36 aya kadar faizsiz taksit', 'ann.2': 'Doğrudan müteahhitten — aracısız', 'ann.3': 'Ücretsiz danışmanlık ve şantiye turu', 'ig.follow': "@arthouse.tashkent'i takip edin", 'amb.title': 'Bizi seçenler', 'amb.sub': 'Art House ile birlikte' }
  };
  Object.keys(X).forEach(function (l) { I18N.extend(l, X[l]); });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var t = function (k) { return I18N.t(k); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pick = function (o) { return I18N.pick(o); };
  var gt = function (f, cls) { return '<span class="gt' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><svg><use href="#f-' + f + '"/></svg></span>'; };

  /* 1) e'lon qatori */
  var ann = document.createElement('div'); ann.className = 'ann'; ann.setAttribute('role', 'region');
  var ai = 0, ANN = ['ann.1', 'ann.2', 'ann.3'];
  function annDraw() { ann.innerHTML = '<button type="button" data-ad="-1" aria-label="‹"><svg class="ic"><use href="#i-left"/></svg></button><p><span>' + esc(t(ANN[ai])) + '</span></p><button type="button" data-ad="1" aria-label="›"><svg class="ic"><use href="#i-right"/></svg></button>'; }
  function annGo(d) { ai = (ai + d + ANN.length) % ANN.length; var sp = $('p span', ann); if (!sp) return annDraw(); sp.classList.add('out'); setTimeout(annDraw, 260); }
  var top = $('.top'); if (top) { top.insertBefore(ann, top.firstChild); annDraw(); }
  ann.addEventListener('click', function (e) { var b = e.target.closest('[data-ad]'); if (b) { annGo(+b.dataset.ad); clearInterval(at); at = setInterval(function () { annGo(1); }, 5000); } });
  var at = setInterval(function () { annGo(1); }, 5000);

  /* 2) taniqli insonlar — faqat rasmi va ruxsati bor yozuvlar (CFG.AMBASSADORS, on !== false) */
  function amb() {
    var old = $('#ambSec'); if (old) old.remove();
    var L = (CFG.AMBASSADORS || []).filter(function (a) { return a && a.photo && a.on !== false; });
    var host = $('#p-home'); if (!L.length || !host) return;
    var s = document.createElement('section'); s.id = 'ambSec'; s.className = 'wrap block amb';
    s.innerHTML = '<div class="sec-head center"><h2>' + esc(t('amb.title')) + '</h2><p class="lead">' + esc(t('amb.sub')) + '</p></div><div class="amb-track">' + L.map(function (a) {
      return '<figure class="amb-card"><div class="amb-ph"><img src="' + esc(a.photo) + '" alt="' + esc(a.name) + '" loading="lazy">' + (a.badge ? '<span class="amb-badge">' + esc(pick(a.badge)) + '</span>' : '') + '</div>' +
        '<figcaption><b>' + esc(a.name) + (a.verified ? '<svg class="amb-v" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3-1-3 2.6-1.9 1-3 3.2.1z"/><path d="m8 12 2.6 2.6L16 9.2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') + '</b><span>' + esc(pick(a.role)) + '</span>' +
        (a.ig ? '<a href="https://www.instagram.com/' + esc(a.ig.replace(/^@/, '')) + '" target="_blank" rel="noopener">@' + esc(a.ig.replace(/^@/, '')) + '</a>' : '') + '</figcaption></figure>';
    }).join('') + '</div>' + (L.length > 1 ? '<div class="amb-dots">' + L.map(function (_, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</div>' : '');
    var ig = $('#igStrip'); ig ? ig.before(s) : host.appendChild(s);
    var tr = $('.amb-track', s), dots = s.querySelectorAll('.amb-dots i');
    if (dots.length) tr.addEventListener('scroll', function () { var w = tr.firstChild.getBoundingClientRect().width + 16, k = Math.round(tr.scrollLeft / w); dots.forEach(function (d, i) { d.classList.toggle('on', i === k); }); }, { passive: true });
  }

  /* 3) Instagram lentasi */
  var IG_IMG = CFG.IG_STRIP || ['assets/img/musaffo/majmua-kechki.webp', 'assets/img/musaffo/mehmonxona.webp', 'assets/img/musaffo/fasad-kunduzi.webp', 'assets/img/musaffo/oshxona.webp', 'assets/img/musaffo/dupleks-interyer.webp', 'assets/img/musaffo/yotoqxona.webp'];
  function igStrip() {
    var old = $('#igStrip'); if (old) old.remove();
    var host = $('#p-home'); if (!host || !CFG.INSTAGRAM) return;
    var s = document.createElement('section'); s.id = 'igStrip'; s.className = 'igs';
    s.innerHTML = '<a class="igs-head" href="' + esc(CFG.INSTAGRAM) + '" target="_blank" rel="noopener">' + gt('ig') + '<h2>' + esc(t('ig.follow')) + '</h2></a>' +
      '<div class="igs-row">' + IG_IMG.map(function (src) { return '<a href="' + esc(CFG.INSTAGRAM) + '" target="_blank" rel="noopener" aria-label="Instagram"><img src="' + src + '" alt="" loading="lazy" decoding="async"></a>'; }).join('') + '</div>';
    var cta = $('#p-home .cta-band'); cta ? cta.closest('.wrap').after(s) : host.appendChild(s);
  }

  /* 4) pastki qism: ijtimoiy tarmoqlar */
  function footSoc() {
    var col = $('.foot-in > div'); if (!col || $('.foot-soc', col)) return;
    var links = [[CFG.INSTAGRAM, 'ig', 'Instagram'], [CFG.TELEGRAM_CHANNEL, 'tg', 'Telegram'], [CFG.PHONE ? 'tel:' + CFG.PHONE : '', 'phone', 'Tel']].filter(function (x) { return x[0]; });
    col.insertAdjacentHTML('beforeend', '<div class="foot-soc">' + links.map(function (x) { return '<a href="' + esc(x[0]) + '"' + (x[0].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + ' aria-label="' + x[2] + '">' + gt(x[1]) + '</a>'; }).join('') + '</div>');
  }

  function all() { igStrip(); amb(); footSoc(); }
  all();
  I18N.on(function () { annDraw(); setTimeout(all, 0); });
})();
