/* =====================================================================
   ART HOUSE — bosh sahifa bloklari (icon-amsterdam.com tuzilishidan ilhomlangan)
   · xonadonlar karuseli (xonalar soni bo'yicha yorliqlar)
   · 2×2 rasmli plitkalar (1/2/3 xonali, dupleks)
   · «Art House'da yashash san'ati» — afzalliklar ro'yxati
   · savdo ofisi bloki · pastki afzalliklar qatori
   · yangiliklarga obuna (telefon) · qidiruv · telefonda ochiladigan footer
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG || !window.PROJECTS) return;
  var D = {
    uz: { 'hi.apts': 'Xonadonlar', 'hi.all': 'Barchasi', 'hi.r': '{n} xonali', 'hi.dup': 'Dupleks', 'hi.from': 'dan', 'hi.view': "Ko'rish", 'hi.m2': 'm²',
      'hi.artT': "Art House'da yashash san'ati", 'hi.artS': "Uzoq yillarga qurilgan uy — zamonaviy qulaylik va sokin hashamat.",
      'hi.u1t': 'Quruvchidan to\'g\'ridan-to\'g\'ri', 'hi.u1d': 'Vositachilarsiz, rasmiy shartnoma asosida.', 'hi.u2t': "0% bo'lib to'lash", 'hi.u2d': "36 oygacha, ustama va foizsiz.", 'hi.u3t': 'Yopiq hovli va avtoturargoh', 'hi.u3d': "Bolalar va sport maydonlari, xavfsiz muhit.", 'hi.u4t': 'Sifat kafolati', 'hi.u4d': "14 yillik tajriba, 30+ loyiha.",
      'hi.offT': 'Savdo ofisimizga tashrif buyuring', 'hi.offD': "Xonadon rejalarini jonli ko'ring, maketni tomosha qiling va menejerdan shaxsiy maslahat oling.", 'hi.map': "Xaritada ko'rish", 'hi.call': "Qo'ng'iroq qilish",
      'hi.b1t': 'Tez javob', 'hi.b1d': 'Menejer ish vaqtida bir necha daqiqada bog\'lanadi.', 'hi.b2t': "0% bo'lib to'lash", 'hi.b2d': "Bank kreditisiz, 36 oygacha.", 'hi.b3t': 'Rasmiy shartnoma', 'hi.b3d': 'Shaffof shartlar, yashirin to\'lovlarsiz.',
      'hi.newsT': 'Birinchilardan bo\'ling', 'hi.newsD': "Yangi loyihalar, cheklangan takliflar va chegirmalar haqida birinchi bo'lib bilib oling.", 'hi.newsPh': 'Telefon raqamingiz', 'hi.newsOk': "Rahmat! Siz ro'yxatdasiz.", 'hi.newsBad': "Telefon raqamini to'liq kiriting.",
      'hi.search': 'Qidiruv', 'hi.searchPh': 'Xonadon, loyiha yoki bo\'lim…', 'hi.none': 'Hech narsa topilmadi', 'hi.about': 'Biz haqimizda', 'hi.aboutD': "Art House — 14 yillik tajribaga ega quruvchi: halol, shaffof va foizsiz bo'lib to'lash asosida premium xonadonlar.", 'hi.more': "Batafsil" },
    ru: { 'hi.apts': 'Квартиры', 'hi.all': 'Все', 'hi.r': '{n}-комнатные', 'hi.dup': 'Дуплекс', 'hi.from': 'от', 'hi.view': 'Смотреть', 'hi.m2': 'м²',
      'hi.artT': 'Искусство жить в Art House', 'hi.artS': 'Дом, построенный на годы вперёд, — современный комфорт и спокойная роскошь.',
      'hi.u1t': 'Напрямую от застройщика', 'hi.u1d': 'Без посредников, по официальному договору.', 'hi.u2t': 'Рассрочка 0%', 'hi.u2d': 'До 36 месяцев, без наценки и процентов.', 'hi.u3t': 'Закрытый двор и паркинг', 'hi.u3d': 'Детские и спортивные площадки, безопасная среда.', 'hi.u4t': 'Гарантия качества', 'hi.u4d': '14 лет опыта, 30+ проектов.',
      'hi.offT': 'Посетите наш офис продаж', 'hi.offD': 'Посмотрите планировки вживую, изучите макет и получите личную консультацию менеджера.', 'hi.map': 'На карте', 'hi.call': 'Позвонить',
      'hi.b1t': 'Быстрый ответ', 'hi.b1d': 'Менеджер свяжется за несколько минут в рабочее время.', 'hi.b2t': 'Рассрочка 0%', 'hi.b2d': 'Без банковского кредита, до 36 месяцев.', 'hi.b3t': 'Официальный договор', 'hi.b3d': 'Прозрачные условия, без скрытых платежей.',
      'hi.newsT': 'Узнавайте первыми', 'hi.newsD': 'Новые проекты, ограниченные предложения и скидки — первыми.', 'hi.newsPh': 'Ваш номер телефона', 'hi.newsOk': 'Спасибо! Вы в списке.', 'hi.newsBad': 'Введите номер полностью.',
      'hi.search': 'Поиск', 'hi.searchPh': 'Квартира, проект или раздел…', 'hi.none': 'Ничего не найдено', 'hi.about': 'О нас', 'hi.aboutD': 'Art House — застройщик с 14-летним опытом: честная, прозрачная рассрочка без процентов и премиальные квартиры.', 'hi.more': 'Подробнее' },
    en: { 'hi.apts': 'Apartments', 'hi.all': 'All', 'hi.r': '{n}-bedroom', 'hi.dup': 'Duplex', 'hi.from': 'from', 'hi.view': 'View', 'hi.m2': 'm²',
      'hi.artT': 'The art of living at Art House', 'hi.artS': 'A home built to last — modern comfort and quiet luxury.',
      'hi.u1t': 'Direct from the developer', 'hi.u1d': 'No middlemen, an official contract.', 'hi.u2t': '0% instalments', 'hi.u2d': 'Up to 36 months, no markup or interest.', 'hi.u3t': 'Private courtyard & parking', 'hi.u3d': 'Play and sports areas in a safe setting.', 'hi.u4t': 'Quality guaranteed', 'hi.u4d': '14 years of experience, 30+ projects.',
      'hi.offT': 'Visit our sales office', 'hi.offD': 'See the floor plans in person, explore the model and get personal advice from a manager.', 'hi.map': 'View on map', 'hi.call': 'Call us',
      'hi.b1t': 'Fast response', 'hi.b1d': 'A manager replies within minutes during working hours.', 'hi.b2t': '0% instalments', 'hi.b2d': 'No bank loan, up to 36 months.', 'hi.b3t': 'Official contract', 'hi.b3d': 'Transparent terms, no hidden fees.',
      'hi.newsT': 'Be the first to know', 'hi.newsD': 'New projects, limited offers and discounts — first.', 'hi.newsPh': 'Your phone number', 'hi.newsOk': "Thank you! You're on the list.", 'hi.newsBad': 'Please enter the full number.',
      'hi.search': 'Search', 'hi.searchPh': 'Apartment, project or section…', 'hi.none': 'Nothing found', 'hi.about': 'About us', 'hi.aboutD': 'Art House is a developer with 14 years of experience: honest, transparent, interest-free instalments and premium homes.', 'hi.more': 'Learn more' },
    fr: { 'hi.apts': 'Appartements', 'hi.all': 'Tous', 'hi.r': '{n} pièces', 'hi.dup': 'Duplex', 'hi.from': 'dès', 'hi.view': 'Voir', 'hi.m2': 'm²',
      'hi.artT': "L'art de vivre chez Art House", 'hi.artS': 'Une maison bâtie pour durer — confort moderne et luxe discret.',
      'hi.u1t': 'En direct du promoteur', 'hi.u1d': 'Sans intermédiaire, contrat officiel.', 'hi.u2t': 'Paiement 0 %', 'hi.u2d': "Jusqu'à 36 mois, sans frais ni intérêts.", 'hi.u3t': 'Cour privée et parking', 'hi.u3d': 'Aires de jeux et de sport, cadre sûr.', 'hi.u4t': 'Qualité garantie', 'hi.u4d': "14 ans d'expérience, 30+ projets.",
      'hi.offT': 'Visitez notre bureau de vente', 'hi.offD': 'Découvrez les plans, la maquette et un conseil personnalisé.', 'hi.map': 'Voir sur la carte', 'hi.call': 'Appeler',
      'hi.b1t': 'Réponse rapide', 'hi.b1d': 'Un conseiller répond en quelques minutes.', 'hi.b2t': 'Paiement 0 %', 'hi.b2d': "Sans prêt bancaire, jusqu'à 36 mois.", 'hi.b3t': 'Contrat officiel', 'hi.b3d': 'Conditions transparentes, sans frais cachés.',
      'hi.newsT': 'Soyez les premiers informés', 'hi.newsD': 'Nouveaux projets, offres limitées et remises — en avant-première.', 'hi.newsPh': 'Votre numéro', 'hi.newsOk': 'Merci ! Vous êtes inscrit.', 'hi.newsBad': 'Saisissez le numéro complet.',
      'hi.search': 'Recherche', 'hi.searchPh': 'Appartement, projet ou rubrique…', 'hi.none': 'Aucun résultat', 'hi.about': 'À propos', 'hi.aboutD': "Art House, promoteur depuis 14 ans : paiement échelonné honnête, transparent et sans intérêts, logements premium.", 'hi.more': 'En savoir plus' },
    it: { 'hi.apts': 'Appartamenti', 'hi.all': 'Tutti', 'hi.r': '{n} locali', 'hi.dup': 'Duplex', 'hi.from': 'da', 'hi.view': 'Vedi', 'hi.m2': 'm²',
      'hi.artT': "L'arte di vivere ad Art House", 'hi.artS': 'Una casa costruita per durare — comfort moderno e lusso discreto.',
      'hi.u1t': 'Direttamente dal costruttore', 'hi.u1d': 'Senza intermediari, contratto ufficiale.', 'hi.u2t': 'Rate allo 0%', 'hi.u2d': 'Fino a 36 mesi, senza interessi.', 'hi.u3t': 'Cortile privato e parcheggio', 'hi.u3d': 'Aree gioco e sport, ambiente sicuro.', 'hi.u4t': 'Qualità garantita', 'hi.u4d': '14 anni di esperienza, 30+ progetti.',
      'hi.offT': 'Visita il nostro ufficio vendite', 'hi.offD': 'Guarda le planimetrie dal vivo e ricevi una consulenza personale.', 'hi.map': 'Vedi sulla mappa', 'hi.call': 'Chiama',
      'hi.b1t': 'Risposta rapida', 'hi.b1d': 'Un consulente risponde in pochi minuti.', 'hi.b2t': 'Rate allo 0%', 'hi.b2d': 'Senza mutuo, fino a 36 mesi.', 'hi.b3t': 'Contratto ufficiale', 'hi.b3d': 'Condizioni trasparenti, nessun costo nascosto.',
      'hi.newsT': 'Scoprilo per primo', 'hi.newsD': 'Nuovi progetti, offerte limitate e sconti — in anteprima.', 'hi.newsPh': 'Il tuo numero', 'hi.newsOk': 'Grazie! Sei in lista.', 'hi.newsBad': 'Inserisci il numero completo.',
      'hi.search': 'Cerca', 'hi.searchPh': 'Appartamento, progetto o sezione…', 'hi.none': 'Nessun risultato', 'hi.about': 'Chi siamo', 'hi.aboutD': 'Art House, costruttore con 14 anni di esperienza: rate oneste e trasparenti senza interessi, case premium.', 'hi.more': 'Scopri di più' },
    es: { 'hi.apts': 'Apartamentos', 'hi.all': 'Todos', 'hi.r': '{n} habitaciones', 'hi.dup': 'Dúplex', 'hi.from': 'desde', 'hi.view': 'Ver', 'hi.m2': 'm²',
      'hi.artT': 'El arte de vivir en Art House', 'hi.artS': 'Un hogar construido para durar: confort moderno y lujo sereno.',
      'hi.u1t': 'Directo del promotor', 'hi.u1d': 'Sin intermediarios, contrato oficial.', 'hi.u2t': 'Plazos al 0 %', 'hi.u2d': 'Hasta 36 meses, sin recargo ni intereses.', 'hi.u3t': 'Patio privado y aparcamiento', 'hi.u3d': 'Zonas de juego y deporte, entorno seguro.', 'hi.u4t': 'Calidad garantizada', 'hi.u4d': '14 años de experiencia, 30+ proyectos.',
      'hi.offT': 'Visite nuestra oficina de ventas', 'hi.offD': 'Vea los planos en persona, la maqueta y reciba asesoría personal.', 'hi.map': 'Ver en el mapa', 'hi.call': 'Llamar',
      'hi.b1t': 'Respuesta rápida', 'hi.b1d': 'Un asesor responde en minutos.', 'hi.b2t': 'Plazos al 0 %', 'hi.b2d': 'Sin préstamo bancario, hasta 36 meses.', 'hi.b3t': 'Contrato oficial', 'hi.b3d': 'Condiciones claras, sin cargos ocultos.',
      'hi.newsT': 'Entérese primero', 'hi.newsD': 'Nuevos proyectos, ofertas limitadas y descuentos, antes que nadie.', 'hi.newsPh': 'Su número', 'hi.newsOk': '¡Gracias! Está en la lista.', 'hi.newsBad': 'Introduzca el número completo.',
      'hi.search': 'Buscar', 'hi.searchPh': 'Apartamento, proyecto o sección…', 'hi.none': 'Sin resultados', 'hi.about': 'Sobre nosotros', 'hi.aboutD': 'Art House, promotor con 14 años de experiencia: pagos a plazos honestos, transparentes y sin intereses, viviendas premium.', 'hi.more': 'Más información' },
    de: { 'hi.apts': 'Wohnungen', 'hi.all': 'Alle', 'hi.r': '{n}-Zimmer', 'hi.dup': 'Maisonette', 'hi.from': 'ab', 'hi.view': 'Ansehen', 'hi.m2': 'm²',
      'hi.artT': 'Die Kunst, bei Art House zu wohnen', 'hi.artS': 'Ein Zuhause für Jahrzehnte — moderner Komfort und stiller Luxus.',
      'hi.u1t': 'Direkt vom Bauträger', 'hi.u1d': 'Ohne Vermittler, mit offiziellem Vertrag.', 'hi.u2t': '0 % Ratenzahlung', 'hi.u2d': 'Bis 36 Monate, ohne Aufschlag und Zinsen.', 'hi.u3t': 'Privater Hof & Tiefgarage', 'hi.u3d': 'Spiel- und Sportplätze, sichere Umgebung.', 'hi.u4t': 'Qualitätsgarantie', 'hi.u4d': '14 Jahre Erfahrung, 30+ Projekte.',
      'hi.offT': 'Besuchen Sie unser Verkaufsbüro', 'hi.offD': 'Grundrisse live ansehen, Modell entdecken und persönlich beraten lassen.', 'hi.map': 'Auf der Karte', 'hi.call': 'Anrufen',
      'hi.b1t': 'Schnelle Antwort', 'hi.b1d': 'Ein Berater meldet sich in wenigen Minuten.', 'hi.b2t': '0 % Ratenzahlung', 'hi.b2d': 'Ohne Bankkredit, bis 36 Monate.', 'hi.b3t': 'Offizieller Vertrag', 'hi.b3d': 'Transparente Konditionen, keine versteckten Kosten.',
      'hi.newsT': 'Als Erste erfahren', 'hi.newsD': 'Neue Projekte, limitierte Angebote und Rabatte — zuerst.', 'hi.newsPh': 'Ihre Telefonnummer', 'hi.newsOk': 'Danke! Sie sind auf der Liste.', 'hi.newsBad': 'Bitte vollständige Nummer eingeben.',
      'hi.search': 'Suche', 'hi.searchPh': 'Wohnung, Projekt oder Bereich…', 'hi.none': 'Nichts gefunden', 'hi.about': 'Über uns', 'hi.aboutD': 'Art House – Bauträger mit 14 Jahren Erfahrung: ehrliche, transparente, zinsfreie Ratenzahlung und Premium-Wohnungen.', 'hi.more': 'Mehr erfahren' },
    tr: { 'hi.apts': 'Daireler', 'hi.all': 'Tümü', 'hi.r': '{n}+1', 'hi.dup': 'Dubleks', 'hi.from': "'den başlayan", 'hi.view': 'Görüntüle', 'hi.m2': 'm²',
      'hi.artT': "Art House'da yaşam sanatı", 'hi.artS': 'Uzun yıllar için inşa edilmiş bir ev — modern konfor ve sessiz lüks.',
      'hi.u1t': 'Doğrudan müteahhitten', 'hi.u1d': 'Aracısız, resmi sözleşme ile.', 'hi.u2t': '%0 taksit', 'hi.u2d': '36 aya kadar, faizsiz.', 'hi.u3t': 'Kapalı avlu ve otopark', 'hi.u3d': 'Oyun ve spor alanları, güvenli ortam.', 'hi.u4t': 'Kalite garantisi', 'hi.u4d': '14 yıllık deneyim, 30+ proje.',
      'hi.offT': 'Satış ofisimizi ziyaret edin', 'hi.offD': 'Planları yerinde görün, maketi inceleyin ve kişisel danışmanlık alın.', 'hi.map': 'Haritada gör', 'hi.call': 'Arayın',
      'hi.b1t': 'Hızlı yanıt', 'hi.b1d': 'Danışman mesai saatlerinde dakikalar içinde döner.', 'hi.b2t': '%0 taksit', 'hi.b2d': 'Banka kredisi olmadan, 36 aya kadar.', 'hi.b3t': 'Resmi sözleşme', 'hi.b3d': 'Şeffaf koşullar, gizli ücret yok.',
      'hi.newsT': 'İlk siz öğrenin', 'hi.newsD': 'Yeni projeler, sınırlı teklifler ve indirimler — ilk size.', 'hi.newsPh': 'Telefon numaranız', 'hi.newsOk': 'Teşekkürler! Listedesiniz.', 'hi.newsBad': 'Lütfen numaranın tamamını girin.',
      'hi.search': 'Ara', 'hi.searchPh': 'Daire, proje veya bölüm…', 'hi.none': 'Sonuç bulunamadı', 'hi.about': 'Hakkımızda', 'hi.aboutD': "Art House, 14 yıllık deneyime sahip bir müteahhit: dürüst, şeffaf ve faizsiz taksit, premium konutlar.", 'hi.more': 'Daha fazla' }
  };
  Object.keys(D).forEach(function (l) { I18N.extend(l, D[l]); });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var t = function (k, v) { return I18N.t(k, v); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var usd = function (n) { return I18N.usd ? I18N.usd(n) : '$' + Math.round(n).toLocaleString('en-US'); };
  var ln = function (s) { return '<svg class="hi-ic" viewBox="0 0 24 24" aria-hidden="true">' + s + '</svg>'; };
  var IC = {
    key: ln('<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.7-8.7M17 6l2.5 2.5M14.5 8.5 16.5 10.5"/>'),
    pct: ln('<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'),
    tree: ln('<path d="M12 22v-6M7 16h10l-3-4h2l-4-6-4 6h2z"/>'),
    shield: ln('<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    clock: ln('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    doc: ln('<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>'),
    search: ln('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
    x: ln('<path d="M6 6l12 12M18 6 6 18"/>'),
    arrow: ln('<path d="M5 12h14M13 6l6 6-6 6"/>')
  };
  var MUS = window.PROJECTS.filter(function (p) { return p.id === 'musaffo'; })[0] || {};
  var PL = (MUS.plans || []).map(function (p, i) { return Object.assign({ i: i }, p); });
  var price = function (p) { return (+CFG.PRICE_M2 || +MUS.priceM2 || 0) * p.area; };
  var pname = function (p) { return (p.duplex ? t('hi.dup') + ' · ' : '') + t('hi.r', { n: p.rooms }); };
  var tab = 'all';

  /* --- 1) xonadonlar karuseli --- */
  function apts() {
    var host = $('#p-home'); if (!host || !PL.length) return;
    var s = $('#hiApts');
    if (!s) { s = document.createElement('section'); s.id = 'hiApts'; s.className = 'hi-apts'; var m = $('#p-home .marquee'); m ? m.after(s) : host.appendChild(s); }
    var tabs = [['all', t('hi.all')], ['1', t('hi.r', { n: 1 })], ['2', t('hi.r', { n: 2 })], ['3', t('hi.r', { n: 3 })], ['4', t('hi.r', { n: 4 })], ['dup', t('hi.dup')]];
    var L = PL.filter(function (p) { return tab === 'all' || (tab === 'dup' ? p.duplex : (!p.duplex && String(p.rooms) === tab)); });
    s.innerHTML = '<div class="hi-head"><h2>' + esc(t('hi.apts')) + '</h2><a class="hi-btn" href="#projects" data-hi-proj>' + esc(t('hi.view')) + '</a></div>' +
      '<div class="hi-tabs" role="tablist">' + tabs.map(function (x) { return '<button type="button" role="tab" data-hi-tab="' + x[0] + '" aria-selected="' + (tab === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="hi-row">' + L.map(function (p) {
        return '<a class="hi-card" href="#projects" data-hi-proj><div class="hi-ph"><img src="' + p.img + '" alt="" loading="lazy"><span class="hi-plus" data-hi-book aria-label="+">+</span></div>' +
          '<b>' + esc(pname(p)) + ' · ' + esc(p.areaTxt || String(p.area).replace('.', ',')) + ' ' + esc(t('hi.m2')) + '</b><span>' + esc(t('hi.from')) + ' ' + esc(usd(price(p))) + '</span></a>';
      }).join('') + '</div>';
  }
  /* --- 2) 2×2 plitkalar --- */
  function tiles() {
    var host = $('#p-home'); if (!host) return;
    var old = $('#hiTiles'); if (old) old.remove();
    var T = [['1', 'assets/img/musaffo/mehmonxona.webp', t('hi.r', { n: 1 })], ['2', 'assets/img/musaffo/yotoqxona.webp', t('hi.r', { n: 2 })], ['3', 'assets/img/musaffo/oshxona.webp', t('hi.r', { n: 3 })], ['dup', 'assets/img/musaffo/dupleks-interyer.webp', t('hi.dup')]];
    var s = document.createElement('section'); s.id = 'hiTiles'; s.className = 'hi-tiles';
    s.innerHTML = T.map(function (x) { return '<button type="button" data-hi-tile="' + x[0] + '"><img src="' + x[1] + '" alt="" loading="lazy"><span>' + esc(x[2]) + '</span></button>'; }).join('');
    var a = $('#hiArt') || $('#hiApts'); a ? a.after(s) : host.appendChild(s);
  }
  /* --- 3) afzalliklar ro'yxati --- */
  function art() {
    var host = $('#p-home'); if (!host) return;
    var old = $('#hiArt'); if (old) old.remove();
    var s = document.createElement('section'); s.id = 'hiArt'; s.className = 'hi-art';
    s.innerHTML = '<h2>' + esc(t('hi.artT')) + '</h2><p class="hi-sub">' + esc(t('hi.artS')) + '</p><div class="hi-list">' +
      [['key', 'u1'], ['pct', 'u2'], ['tree', 'u3'], ['shield', 'u4']].map(function (x) { return '<div>' + IC[x[0]] + '<p><b>' + esc(t('hi.' + x[1] + 't')) + '</b><span>' + esc(t('hi.' + x[1] + 'd')) + '</span></p></div>'; }).join('') + '</div>';
    var a = $('#hiApts'); a ? a.after(s) : host.appendChild(s);
  }
  /* --- 4) savdo ofisi --- */
  function office() {
    var host = $('#p-home'); if (!host) return;
    var old = $('#hiOffice'); if (old) old.remove();
    var s = document.createElement('section'); s.id = 'hiOffice'; s.className = 'hi-office';
    s.innerHTML = '<img src="assets/img/musaffo/fasad-kunduzi.webp" alt="" loading="lazy"><div><h2>' + esc(t('hi.offT')) + '</h2><p>' + esc(t('hi.offD')) + '</p>' +
      '<div class="hi-actions"><a class="hi-btn" href="#location">' + esc(t('hi.map')) + '</a><a class="hi-btn ghost" href="tel:' + esc(CFG.PHONE) + '">' + esc(t('hi.call')) + '</a></div></div>';
    var ig = $('#igStrip'); ig ? ig.before(s) : host.appendChild(s);
  }
  /* --- 5) pastki afzalliklar qatori --- */
  function bar() {
    var host = $('#p-home'); if (!host) return;
    var old = $('#hiBar'); if (old) old.remove();
    var s = document.createElement('section'); s.id = 'hiBar'; s.className = 'hi-bar';
    s.innerHTML = [['clock', 'b1'], ['pct', 'b2'], ['doc', 'b3']].map(function (x) { return '<div>' + IC[x[0]] + '<p><b>' + esc(t('hi.' + x[1] + 't')) + '</b><span>' + esc(t('hi.' + x[1] + 'd')) + '</span></p></div>'; }).join('');
    var ig = $('#igStrip'); ig ? ig.after(s) : host.appendChild(s);
  }
  /* --- 6) footer: «Biz haqimizda», obuna, telefonda ochiladigan ro'yxatlar --- */
  function foot() {
    var fi = $('.foot-in'); if (!fi) return;
    var old = $('#hiNews'); if (old) old.remove();
    var n = document.createElement('div'); n.id = 'hiNews'; n.className = 'hi-news';
    n.innerHTML = '<h4>' + esc(t('hi.newsT')) + '</h4><p>' + esc(t('hi.newsD')) + '</p><form><input type="tel" inputmode="tel" autocomplete="tel" placeholder="' + esc(t('hi.newsPh')) + '" aria-label="' + esc(t('hi.newsPh')) + '"><button type="submit" aria-label="OK">' + IC.arrow + '</button></form><small hidden></small>';
    fi.appendChild(n);
    $('form', n).addEventListener('submit', function (e) {
      e.preventDefault(); var v = $('input', n).value.replace(/[^\d+]/g, ''), m = $('small', n);
      if (v.replace(/\D/g, '').length < 9) { m.textContent = t('hi.newsBad'); m.hidden = false; return; }
      if (window.CRM && CRM.deliver) CRM.deliver({ name: 'Obuna (sayt)', phone: v, src: 'subscribe', unit: '—' });
      m.textContent = t('hi.newsOk'); m.hidden = false; $('input', n).value = '';
    });
    $$('.foot-in > div').forEach(function (c) { var h = $('h4', c); if (!h || c.id === 'hiNews') return; c.classList.add('hi-acc'); if (!h.dataset.acc) { h.dataset.acc = 1; h.setAttribute('role', 'button'); h.tabIndex = 0; h.addEventListener('click', function () { c.classList.toggle('open'); }); } });
  }
  /* --- 7) qidiruv --- */
  var sd = null;
  function searchBtn() {
    var tr = $('.top-row'); if (!tr || $('.hi-sbtn')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hi-sbtn'; b.setAttribute('aria-label', t('hi.search')); b.innerHTML = IC.search;
    var lang = $('#langSite'); lang ? lang.after(b) : tr.appendChild(b);
    b.addEventListener('click', openSearch);
  }
  function items() {
    var R = [];
    $$('.menu-track > a').forEach(function (a) { R.push({ t: a.querySelector('span').textContent, h: a.getAttribute('href') }); });
    window.PROJECTS.forEach(function (p) { R.push({ t: I18N.pick(p.name), h: '#projects', p: p.id }); });
    PL.forEach(function (p) { R.push({ t: 'Musaffo · ' + pname(p) + ' · ' + (p.areaTxt || p.area) + ' ' + t('hi.m2'), s: t('hi.from') + ' ' + usd(price(p)), h: '#projects', p: 'musaffo', img: p.img }); });
    return R;
  }
  function openSearch() {
    if (!sd) {
      sd = document.createElement('div'); sd.className = 'hi-search'; sd.setAttribute('role', 'dialog'); sd.setAttribute('aria-modal', 'true');
      document.body.appendChild(sd);
      sd.addEventListener('click', function (e) {
        if (e.target === sd || e.target.closest('[data-hi-x]')) return close();
        var a = e.target.closest('a[data-p]'); if (a) { close(); setTimeout(function () { var tb = $('#projTabs [data-p="' + a.dataset.p + '"]'); if (tb) tb.click(); }, 150); }
        else if (e.target.closest('a')) close();
      });
      sd.addEventListener('input', draw);
    }
    sd.innerHTML = '<div class="hi-sbox"><div class="hi-sin">' + IC.search + '<input type="search" placeholder="' + esc(t('hi.searchPh')) + '" aria-label="' + esc(t('hi.search')) + '"><button type="button" data-hi-x aria-label="×">' + IC.x + '</button></div><div class="hi-res"></div></div>';
    sd.hidden = false; requestAnimationFrame(function () { sd.classList.add('on'); }); document.body.classList.add('lock');
    draw(); setTimeout(function () { $('input', sd).focus(); }, 60);
    function close() { sd.classList.remove('on'); document.body.classList.remove('lock'); setTimeout(function () { sd.hidden = true; }, 250); }
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  }
  function draw() {
    var q = ($('input', sd).value || '').trim().toLowerCase(), L = items().filter(function (x) { return !q || x.t.toLowerCase().indexOf(q) > -1; }).slice(0, 12);
    $('.hi-res', sd).innerHTML = L.length ? L.map(function (x) { return '<a href="' + x.h + '"' + (x.p ? ' data-p="' + x.p + '"' : '') + '>' + (x.img ? '<img src="' + x.img + '" alt="">' : '') + '<span><b>' + esc(x.t) + '</b>' + (x.s ? '<small>' + esc(x.s) + '</small>' : '') + '</span></a>'; }).join('') : '<p>' + esc(t('hi.none')) + '</p>';
  }

  /* --- hodisalar --- */
  document.addEventListener('click', function (e) {
    var tb = e.target.closest('[data-hi-tab]'); if (tb) { tab = tb.dataset.hiTab; apts(); return; }
    var bk = e.target.closest('[data-hi-book]'); if (bk) { e.preventDefault(); var d = $('[data-book]'); if (d) d.click(); return; }
    var ti = e.target.closest('[data-hi-tile]'); if (ti) { tab = ti.dataset.hiTile; apts(); var a = $('#hiApts'); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (e.target.closest('[data-hi-proj]')) setTimeout(function () { var b = $('#projTabs [data-p="musaffo"]'); if (b) b.click(); }, 120);
  });
  function all() { apts(); art(); tiles(); office(); bar(); foot(); searchBtn(); }
  all();
  I18N.on(function () { setTimeout(function () { all(); var b = $('.hi-sbtn'); if (b) b.setAttribute('aria-label', t('hi.search')); }, 0); });
})();
