/* =====================================================================
   ART HOUSE — bosh sahifadagi sotuv kartasi (saytga kirgan zahoti ko'rinadi)
   · 3 ta tanlov: necha xonali (+ maydon), boshlang'ich to'lov, muddat → oylik to'lov darhol
   · «Shu shart bilan band qilish» → band qilish oynasi shu shartlar bilan ochiladi; arizada xonadon,
     narx, boshlang'ich to'lov, muddat va oylik to'lov menejerga boradi (Telegram: «Bosh sahifadagi kalkulyatordan»)
   · AI maslahatchi shu yerda: tayyor savollar; mijoz tanlagan shartlar suhbatga ham beriladi
   · bosh banner matni: aniq taklif ({down}, {months}, {years} — kabinet → Sozlamalar qiymatlari)
   Narx hisobi kalkulyator va AI maslahatchi bilan bir xil: maydon × 1 m² narxi, 100 $ gacha yaxlitlanadi.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG || !window.PROJECTS || !window.AH_SITE) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var t = I18N.t, pick = I18N.pick;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var D = {
    uz: { 'hf.p': 'Loyiha', 'home.eyebrow': "Quruvchidan to'g'ridan-to'g'ri · {years} yil tajriba", 'home.lead': "Musaffo, Obod Maskan va Ko'kcha Oqtepa majmualarida xonadonlar. {down} boshlang'ich to'lov, qolganini {months} oygacha teng bo'lib to'laysiz. Bank krediti yo'q, ustama 0%.",
      'hf.t': "Oylik to'lovni hisoblang", 'hf.r': 'Necha xonali?', 'hf.dup': 'Dupleks', 'hf.a': 'Maydon', 'hf.d': "Boshlang'ich to'lov", 'hf.m': 'Muddat', 'hf.res': 'Oyiga', 'hf.price': 'Narxi {v}',
      'hf.book': 'Shu shart bilan band qilish', 'hf.note': "Ariza bepul va hech narsaga majbur qilmaydi. Menejer qo'ng'iroq qilib, shartlarni tasdiqlaydi.",
      'hf.ai': 'AI maslahatchi', 'hf.aiT': "Savolingiz bo'lsa, hozir javob beradi", 'hf.q': "Kompaniya ishonchlimi?|Bank krediti kerakmi?|Obyekt qayerda joylashgan?", 'hf.on': 'onlayn' },
    ru: { 'hf.p': 'Проект', 'home.eyebrow': 'Напрямую от застройщика · {years} лет опыта', 'home.lead': 'Квартиры в комплексах Musaffo, Obod Maskan и Ko‘kcha Oqtepa. Первый взнос {down}, остаток равными частями до {months} месяцев. Без банковского кредита, наценка 0%.',
      'hf.t': 'Рассчитайте ежемесячный платёж', 'hf.r': 'Сколько комнат?', 'hf.dup': 'Дуплекс', 'hf.a': 'Площадь', 'hf.d': 'Первый взнос', 'hf.m': 'Срок', 'hf.res': 'В месяц', 'hf.price': 'Цена {v}',
      'hf.book': 'Забронировать на этих условиях', 'hf.note': 'Заявка бесплатная и ни к чему не обязывает. Менеджер перезвонит и подтвердит условия.',
      'hf.ai': 'AI-консультант', 'hf.aiT': 'Есть вопрос? Ответит прямо сейчас', 'hf.q': 'Компании можно доверять?|Нужен ли банковский кредит?|Где находится объект?', 'hf.on': 'онлайн' },
    en: { 'hf.p': 'Project', 'home.eyebrow': 'Direct from the developer · {years} years of experience', 'home.lead': "Apartments in the Musaffo, Obod Maskan and Ko'kcha Oqtepa complexes. Pay {down} up front and the rest in equal instalments over up to {months} months. No bank loan, 0% markup.",
      'hf.t': 'Work out your monthly payment', 'hf.r': 'How many rooms?', 'hf.dup': 'Duplex', 'hf.a': 'Area', 'hf.d': 'Down payment', 'hf.m': 'Term', 'hf.res': 'Per month', 'hf.price': 'Price {v}',
      'hf.book': 'Reserve on these terms', 'hf.note': 'The request is free and commits you to nothing. A manager will call and confirm the terms.',
      'hf.ai': 'AI adviser', 'hf.aiT': 'Have a question? It answers right now', 'hf.q': 'Can I trust the company?|Do I need a bank loan?|Where is the complex?', 'hf.on': 'online' },
    fr: { 'hf.p': 'Projet', 'home.eyebrow': "En direct du promoteur · {years} ans d'expérience", 'home.lead': "Appartements dans les résidences Musaffo, Obod Maskan et Ko'kcha Oqtepa. Apport de {down}, puis le reste en mensualités égales sur {months} mois maximum. Sans crédit bancaire, 0 % de majoration.",
      'hf.t': 'Calculez votre mensualité', 'hf.r': 'Combien de pièces ?', 'hf.dup': 'Duplex', 'hf.a': 'Surface', 'hf.d': 'Apport initial', 'hf.m': 'Durée', 'hf.res': 'Par mois', 'hf.price': 'Prix {v}',
      'hf.book': 'Réserver à ces conditions', 'hf.note': 'La demande est gratuite et sans engagement. Un conseiller vous rappelle pour confirmer les conditions.',
      'hf.ai': 'Conseiller IA', 'hf.aiT': 'Une question ? Réponse immédiate', 'hf.q': 'La société est-elle fiable ?|Faut-il un crédit bancaire ?|Où se trouve la résidence ?', 'hf.on': 'en ligne' },
    it: { 'hf.p': 'Progetto', 'home.eyebrow': 'Direttamente dal costruttore · {years} anni di esperienza', 'home.lead': "Appartamenti nei complessi Musaffo, Obod Maskan e Ko'kcha Oqtepa. Anticipo del {down}, il resto in rate uguali fino a {months} mesi. Nessun mutuo, 0% di maggiorazione.",
      'hf.t': 'Calcola la rata mensile', 'hf.r': 'Quante stanze?', 'hf.dup': 'Duplex', 'hf.a': 'Superficie', 'hf.d': 'Anticipo', 'hf.m': 'Durata', 'hf.res': 'Al mese', 'hf.price': 'Prezzo {v}',
      'hf.book': 'Prenota a queste condizioni', 'hf.note': 'La richiesta è gratuita e non ti impegna. Un consulente ti richiama e conferma le condizioni.',
      'hf.ai': 'Consulente IA', 'hf.aiT': 'Hai una domanda? Risponde subito', 'hf.q': "L'azienda è affidabile?|Serve un mutuo bancario?|Dove si trova il complesso?", 'hf.on': 'online' },
    es: { 'hf.p': 'Proyecto', 'home.eyebrow': 'Directo del promotor · {years} años de experiencia', 'home.lead': "Apartamentos en los complejos Musaffo, Obod Maskan y Ko'kcha Oqtepa. Entrada del {down} y el resto en cuotas iguales de hasta {months} meses. Sin préstamo bancario, 0 % de recargo.",
      'hf.t': 'Calcule su cuota mensual', 'hf.r': '¿Cuántas habitaciones?', 'hf.dup': 'Dúplex', 'hf.a': 'Superficie', 'hf.d': 'Entrada', 'hf.m': 'Plazo', 'hf.res': 'Al mes', 'hf.price': 'Precio {v}',
      'hf.book': 'Reservar con estas condiciones', 'hf.note': 'La solicitud es gratuita y no le compromete. Un asesor le llamará para confirmar las condiciones.',
      'hf.ai': 'Asesor IA', 'hf.aiT': '¿Tiene una pregunta? Responde ahora', 'hf.q': '¿Es una empresa de confianza?|¿Necesito un préstamo bancario?|¿Dónde está el complejo?', 'hf.on': 'en línea' },
    de: { 'hf.p': 'Projekt', 'home.eyebrow': 'Direkt vom Bauträger · {years} Jahre Erfahrung', 'home.lead': "Wohnungen in den Anlagen Musaffo, Obod Maskan und Ko'kcha Oqtepa. {down} Anzahlung, der Rest in gleichen Raten über bis zu {months} Monate. Ohne Bankkredit, 0 % Aufschlag.",
      'hf.t': 'Monatsrate berechnen', 'hf.r': 'Wie viele Zimmer?', 'hf.dup': 'Maisonette', 'hf.a': 'Fläche', 'hf.d': 'Anzahlung', 'hf.m': 'Laufzeit', 'hf.res': 'Pro Monat', 'hf.price': 'Preis {v}',
      'hf.book': 'Zu diesen Konditionen reservieren', 'hf.note': 'Die Anfrage ist kostenlos und unverbindlich. Ein Berater ruft Sie an und bestätigt die Konditionen.',
      'hf.ai': 'KI-Berater', 'hf.aiT': 'Eine Frage? Antwort sofort', 'hf.q': 'Ist die Firma vertrauenswürdig?|Brauche ich einen Bankkredit?|Wo liegt die Anlage?', 'hf.on': 'online' },
    tr: { 'hf.p': 'Proje', 'home.eyebrow': 'Doğrudan müteahhitten · {years} yıllık deneyim', 'home.lead': "Musaffo, Obod Maskan ve Ko'kcha Oqtepa projelerinde daireler. {down} peşinat, kalanı {months} aya kadar eşit taksitlerle. Banka kredisi yok, %0 ek ücret.",
      'hf.t': 'Aylık ödemenizi hesaplayın', 'hf.r': 'Kaç oda?', 'hf.dup': 'Dubleks', 'hf.a': 'Alan', 'hf.d': 'Peşinat', 'hf.m': 'Vade', 'hf.res': 'Aylık', 'hf.price': 'Fiyat {v}',
      'hf.book': 'Bu koşullarla rezerve et', 'hf.note': 'Talep ücretsizdir ve sizi hiçbir şeye bağlamaz. Danışman arayıp koşulları onaylar.',
      'hf.ai': 'AI danışman', 'hf.aiT': 'Sorunuz mu var? Hemen yanıtlar', 'hf.q': 'Şirket güvenilir mi?|Banka kredisi gerekir mi?|Proje nerede?', 'hf.on': 'çevrimiçi' }
  };
  Object.keys(D).forEach(function (l) { I18N.extend(l, D[l]); });

  /* xonadon rejalari kiritilgan loyihalar (kabinet → Loyihalar); bir nechta bo'lsa, kartada loyiha tanlovi chiqadi */
  function list() { return PROJECTS.filter(function (p) { return p.plans && p.plans.length; }); }
  function proj() { var L = list(); return L.filter(function (p) { return p.id === S.p; })[0] || L[0]; }
  var hin = $('#p-home .hero-in'), copy = hin && $('.hero-copy', hin);
  if (!list().length || !copy) return;

  /* holat: loyiha (p), xonalar (r), reja (i), boshlang'ich to'lov % (pct), muddat (m); sahifa yangilansa ham saqlanadi */
  var S = { p: '', r: '', i: -1, pct: CFG.DOWN_MIN, m: Math.max.apply(null, CFG.MONTHS), touched: 0 };
  try { var sv = JSON.parse(sessionStorage.getItem('ah_hf')); if (sv) Object.assign(S, sv); } catch (e) {}
  function save() { try { sessionStorage.setItem('ah_hf', JSON.stringify(S)); } catch (e) {} }
  function units() {
    var P = proj();
    return P.plans.map(function (pl, i) { return { i: i, pl: pl, r: pl.duplex ? 'd' : String(pl.rooms), price: Math.min(500000, Math.max(20000, Math.round(pl.area * (P.priceM2 || CFG.PRICE_M2) / 100) * 100)) }; });
  }
  function kinds() { var k = []; units().forEach(function (u) { if (k.indexOf(u.r) < 0) k.push(u.r); }); return k.sort(function (a, b) { return a === 'd' ? 1 : b === 'd' ? -1 : a - b; }); }
  function sane() {
    S.p = proj().id;
    var U = units(), K = kinds();
    if (K.indexOf(S.r) < 0) S.r = K[0];
    var mine = U.filter(function (u) { return u.r === S.r; });
    if (!mine.some(function (u) { return u.i === S.i; })) S.i = mine.slice().sort(function (a, b) { return a.price - b.price; })[0].i;
    S.pct = Math.min(CFG.DOWN_MAX, Math.max(CFG.DOWN_MIN, +S.pct || CFG.DOWN_MIN));
    if (CFG.MONTHS.indexOf(+S.m) < 0) S.m = Math.max.apply(null, CFG.MONTHS);
    return U;
  }
  function calc() {
    var u = sane()[S.i], dn = Math.round(u.price * S.pct / 100);
    return { u: u, down: dn, monthly: (u.price - dn) / S.m };
  }
  var area = function (pl) { return (pl.areaTxt || String(pl.area).replace('.', ',')) + ' m²'; };

  /* karta: sarlavha, 3 ta tanlov, natija, band qilish tugmasi; AI maslahatchi — alohida blok
     (kompyuterda banner matni ostida, telefonda kartaning davomi) */
  var card = document.createElement('aside'), ai = document.createElement('div');
  card.className = 'hf'; card.id = 'hfCard'; card.setAttribute('aria-labelledby', 'hfT');
  ai.className = 'hf-ai'; ai.id = 'hfAiBox';
  var stats = $('.stats', copy);
  hin.classList.add('hf-on'); hin.parentNode.classList.add('hf-hero');
  I18N.apply(copy); /* banner matni yangi taklif bilan (sahifa allaqachon tarjima qilingan bo'lishi mumkin) */
  hin.insertBefore(card, copy.nextSibling); hin.insertBefore(ai, card.nextSibling);
  if (stats) hin.insertBefore(stats, ai.nextSibling); /* telefonda raqamlar kartadan keyin, kompyuterda matn ostida */

  function chips(g, list, on) { return '<div class="hf-chips" role="group" data-g="' + g + '">' + list.map(function (x) { return '<button type="button" data-v="' + esc(x[0]) + '" aria-pressed="' + (String(x[0]) === String(on)) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; }
  function draw() {
    var U = sane(), P = proj(), L = list(), K = kinds(), mine = U.filter(function (u) { return u.r === S.r; }).sort(function (a, b) { return a.pl.area - b.pl.area; });
    var q = t('hf.q').split('|');
    card.innerHTML =
      '<div class="hf-head"><p class="hf-k">' + esc(pick(P.name)) + ' · ' + esc(pick(P.district)) + '</p><h2 id="hfT">' + esc(t('hf.t')) + '</h2></div>' +
      (L.length > 1 ? '<div class="hf-row"><span class="hf-l">' + esc(t('hf.p')) + '</span>' + chips('p', L.map(function (p) { return [p.id, pick(p.name)]; }), P.id) + '</div>' : '') +
      '<div class="hf-row"><span class="hf-l">' + esc(t('hf.r')) + '</span>' + chips('r', K.map(function (k) { return [k, k === 'd' ? t('hf.dup') : k]; }), S.r) + '</div>' +
      (mine.length > 1 ? '<div class="hf-row"><span class="hf-l">' + esc(t('hf.a')) + '</span>' + chips('i', mine.map(function (u) { return [u.i, area(u.pl)]; }), S.i) + '</div>' : '') +
      '<div class="hf-row"><label class="hf-l" for="hfDown">' + esc(t('hf.d')) + ' <b id="hfDownV"></b></label><input type="range" id="hfDown" min="' + CFG.DOWN_MIN + '" max="' + CFG.DOWN_MAX + '" step="5" value="' + S.pct + '"></div>' +
      '<div class="hf-row"><span class="hf-l">' + esc(t('hf.m')) + '</span>' + chips('m', CFG.MONTHS.map(function (m) { return [m, m + ' ' + t('unit.month')]; }), S.m) + '</div>' +
      '<div class="hf-res"><a class="hf-img" href="#projects/' + esc(P.id) + '"><img alt="" decoding="async" id="hfImg"></a><div class="hf-sum"><span>' + esc(t('hf.res')) + '</span><b id="hfM"></b><small id="hfUzs"></small><small class="hf-u" id="hfU"></small></div></div>' +
      '<button type="button" class="btn btn-gold hf-book" id="hfBook"><span>' + esc(t('hf.book')) + '</span><svg class="ic"><use href="#i-arrow"/></svg></button>' +
      '<p class="hf-note">' + esc(t('hf.note')) + '</p>';
    ai.innerHTML = '<button type="button" class="hf-ai-b" id="hfAi"><svg class="ic" viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg><b>' + esc(t('hf.ai')) + '</b><i></i><small>' + esc(t('hf.on')) + '</small></button>' +
      '<p class="hf-ai-t">' + esc(t('hf.aiT')) + '</p><div class="hf-q">' + q.map(function (x) { return '<button type="button">' + esc(x) + '</button>'; }).join('') + '</div>';
    out();
  }
  /* faqat raqamlar yangilanadi (slayder surilganda karta qayta chizilmaydi) */
  function out() {
    var r = calc(), u = r.u, inp = $('#hfDown', card);
    inp.style.setProperty('--p', ((S.pct - CFG.DOWN_MIN) / Math.max(1, CFG.DOWN_MAX - CFG.DOWN_MIN) * 100) + '%');
    $('#hfDownV', card).textContent = S.pct + '% · ' + I18N.usd(r.down);
    $('#hfM', card).textContent = I18N.usd(r.monthly);
    $('#hfUzs', card).textContent = t('calc.uzs', { v: I18N.num(Math.round(r.monthly * CFG.USD_UZS / 1000) * 1000) });
    $('#hfU', card).textContent = t('plan.label', { rooms: u.pl.rooms, duplex: u.pl.duplex ? t('plan.duplex') : '', area: String(u.pl.area).replace('.', ',') }) + ' · ' + t('hf.price', { v: I18N.usd(u.price) });
    var img = $('#hfImg', card); if (img.getAttribute('src') !== u.pl.img) img.src = u.pl.img;
  }
  function touch() { if (!S.touched) { S.touched = 1; if (window.CRM) CRM.track('c'); } save(); }
  function aiCtx() { var r = calc(); if (window.ArtHouseAI && ArtHouseAI.ctx) ArtHouseAI.ctx({ R: S.r, M: +S.m, B: r.down, P: proj().id }); }
  function book() {
    var r = calc(); touch();
    AH_SITE.calcSet({ project: proj().id, plan: r.u.i, pct: S.pct, months: +S.m });
    AH_SITE.book({ fromCalc: true, via: 'hero' });
  }

  card.addEventListener('click', function (e) {
    var b = e.target.closest('.hf-chips button');
    if (b) { var g = b.parentNode.dataset.g, v = b.dataset.v; if (g === 'r') { S.r = v; S.i = -1; } else if (g === 'p') { S.p = v; S.r = ''; S.i = -1; } else if (g === 'i') S.i = +v; else S.m = +v; touch(); draw(); var f = $('.hf-chips[data-g="' + g + '"] [aria-pressed="true"]', card); if (f) f.focus(); return; }
    if (e.target.closest('#hfBook')) book();
  });
  ai.addEventListener('click', function (e) {
    if (e.target.closest('#hfAi')) { aiCtx(); if (window.ArtHouseAI) ArtHouseAI.open(); return; }
    var q = e.target.closest('.hf-q button');
    if (q && window.ArtHouseAI && ArtHouseAI.ask) { aiCtx(); ArtHouseAI.ask(q.textContent); }
  });
  card.addEventListener('input', function (e) { if (e.target.id === 'hfDown') { S.pct = +e.target.value; touch(); out(); } });

  /* bosh sahifada «Band qilish» (yuqori menyu, pastki panel): mijoz kartada tanlagan bo'lsa — shu shartlar bilan */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-book]');
    if (!b || !S.touched || card.contains(b) || !$('#p-home').offsetParent) return;
    e.stopPropagation(); e.preventDefault(); book();
  }, true);
  /* bannerdagi «To'lovni hisoblash» — kartaga olib boradi */
  var cta = $('.cta-row a[href="#calculator"]', copy);
  if (cta) cta.addEventListener('click', function (e) {
    e.preventDefault(); card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    card.classList.remove('hf-glow'); void card.offsetWidth; card.classList.add('hf-glow');
  });

  /* kompyuterda: karta ko'rinib turganda suzuvchi AI tugmasi yashirinadi (AI maslahatchi kartaning o'zida) */
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { document.body.classList.toggle('hf-vis', es[0].isIntersecting); }, { threshold: .25 }).observe(card);

  draw();
  I18N.on(function () { setTimeout(draw, 0); });
  if (window.Store && Store.on) Store.on('settings', function () { setTimeout(draw, 0); });
  window.AH_HF = { draw: draw, state: function () { var r = calc(); return { rooms: S.r, plan: r.u.i, price: r.u.price, pct: S.pct, down: r.down, months: +S.m, monthly: Math.round(r.monthly) }; } };
})();
