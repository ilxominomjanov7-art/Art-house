/* =====================================================================
   ART HOUSE — SAYT MENYUSI (☰) SXEMASI — sayt (js/cms-site.js) va kabinet (js/kabinet-menu.js) uchun umumiy
   Ma'lumot: 'ah_cms'.menu = {
     cards:  [{ id, on, img, video, t:{uz,ru,…}, link }]          — tepadagi rasm/video kartalar
     main:   [{ id, on, hl, k|t, link }]                            — katta havolalar
     groups: [{ id, on, k|t, style:'list'|'serv', auto:'projects'|'', items:[{ id, on, k|t, link }] }]
   }
   k — standart matn kaliti (sayt tarjimalaridan, 8 tilda), t — kabinetda yozilgan matn (8 tilda).
   link: 'route:home' · 'proj:musaffo' · 'phone' · 'telegram' · 'instagram' · 'url:https://…'
   ===================================================================== */
(function () {
  'use strict';
  var L8 = ['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr'];
  /* kabinetda sayt tarjimalari to'liq yuklanmagan — standart yozuvlar shu yerda ham bor */
  var FB = {
    'mn.promo': { uz: "0% foizsiz bo'lib to'lash", ru: 'Рассрочка 0%', en: '0% instalments', fr: 'Paiement échelonné 0 %', it: 'Rate allo 0%', es: 'Plazos al 0 %', de: '0 % Ratenzahlung', tr: '%0 taksit' },
    'mn.service': { uz: 'Mijozlarga xizmat', ru: 'Клиентский сервис', en: 'Client services', fr: 'Service client', it: 'Servizio clienti', es: 'Atención al cliente', de: 'Kundenservice', tr: 'Müşteri hizmetleri' },
    'nav.menuSub': { uz: "Sayt bo'limlari", ru: 'Разделы сайта', en: 'Site sections', fr: 'Rubriques', it: 'Sezioni', es: 'Secciones', de: 'Bereiche', tr: 'Site bölümleri' },
    'nav.home': { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home', fr: 'Accueil', it: 'Home', es: 'Inicio', de: 'Startseite', tr: 'Ana sayfa' },
    'nav.calc': { uz: 'Kalkulyator', ru: 'Калькулятор', en: 'Calculator', fr: 'Calculateur', it: 'Calcolatore', es: 'Calculadora', de: 'Rechner', tr: 'Hesaplayıcı' },
    'nav.projects': { uz: 'Loyihalar', ru: 'Проекты', en: 'Projects', fr: 'Projets', it: 'Progetti', es: 'Proyectos', de: 'Projekte', tr: 'Projeler' },
    'nav.location': { uz: 'Joylashuv', ru: 'Расположение', en: 'Location', fr: 'Emplacement', it: 'Posizione', es: 'Ubicación', de: 'Lage', tr: 'Konum' },
    'nav.about': { uz: 'Biz haqimizda', ru: 'О нас', en: 'About us', fr: 'À propos', it: 'Chi siamo', es: 'Sobre nosotros', de: 'Über uns', tr: 'Hakkımızda' },
    'nav.social': { uz: 'Ijtimoiy sahifalarimiz', ru: 'Соцсети', en: 'Social media', fr: 'Réseaux sociaux', it: 'Social', es: 'Redes sociales', de: 'Soziale Medien', tr: 'Sosyal medya' },
    'nav.contact': { uz: "Bog'lanish", ru: 'Контакты', en: 'Contact', fr: 'Contact', it: 'Contatti', es: 'Contacto', de: 'Kontakt', tr: 'İletişim' },
    'nav.reviews': { uz: 'Mijozlar izohlari', ru: 'Отзывы клиентов', en: 'Client reviews', fr: 'Avis clients', it: 'Recensioni', es: 'Opiniones', de: 'Kundenbewertungen', tr: 'Müşteri yorumları' },
    'nav.cabinet': { uz: 'Kabinet', ru: 'Кабинет', en: 'Dashboard', fr: 'Espace pro', it: 'Area riservata', es: 'Panel', de: 'Dashboard', tr: 'Panel' },
    'call.phone': { uz: "Qo'ng'iroq qilish", ru: 'Позвонить', en: 'Call us', fr: 'Appeler', it: 'Chiama', es: 'Llamar', de: 'Anrufen', tr: 'Ara' }
  };
  var ROUTES = [['home', 'nav.home'], ['calculator', 'nav.calc'], ['projects', 'nav.projects'], ['location', 'nav.location'], ['about', 'nav.about'], ['social', 'nav.social'], ['reviews', 'nav.reviews'], ['contact', 'nav.contact']];
  var n = 0, id = function (p) { return p + (++n).toString(36) + Date.now().toString(36).slice(-4); };

  function def() {
    var r = function (k, key, x) { return Object.assign({ id: 'r_' + k, on: true, k: key, link: 'route:' + k }, x || {}); };
    return {
      cards: [
        { id: 'c_musaffo', on: true, img: 'assets/img/musaffo/majmua-kechki.webp', video: '', link: 'proj:musaffo' },
        { id: 'c_obod', on: true, img: 'assets/img/obod/obodmaskan-card.webp', video: '', link: 'proj:obod' }
      ],
      main: [
        { id: 'm_promo', on: true, hl: true, k: 'mn.promo', link: 'route:calculator' },
        r('home', 'nav.home'), r('projects', 'nav.projects'), r('calculator', 'nav.calc')
      ],
      groups: [
        { id: 'g_proj', on: true, k: 'nav.projects', style: 'list', auto: 'projects', items: [] },
        { id: 'g_sec', on: true, k: 'nav.menuSub', style: 'list', items: [r('location', 'nav.location'), r('about', 'nav.about'), r('social', 'nav.social'), r('reviews', 'nav.reviews'), r('contact', 'nav.contact')] },
        { id: 'g_serv', on: true, k: 'mn.service', style: 'serv', items: [
          { id: 's_phone', on: true, k: 'call.phone', link: 'phone' },
          { id: 's_tg', on: true, t: { uz: 'Telegram' }, link: 'telegram' },
          { id: 's_ig', on: true, t: { uz: 'Instagram' }, link: 'instagram' },
          { id: 's_cab', on: true, k: 'nav.cabinet', link: 'url:kabinet.html' }
        ] }
      ]
    };
  }
  /* karta rasmi bo'sh bo'lsa — standart rasm (kabinetda tahrirlanmagan) */
  function img(c) { if (c.img) return c.img; var d = def().cards.filter(function (x) { return x.id === c.id; })[0]; return d ? d.img : ''; }
  function get(C) { var m = C && C.menu; return m && Array.isArray(m.main) && Array.isArray(m.groups) ? m : def(); }

  /* matn: kabinetda yozilgan (t) → sayt tarjimasi (k) → standart (FB) */
  function label(it, lang, P) {
    lang = lang || 'uz';
    var base = lang === 'cy' ? 'uz' : lang;
    var tt = it && it.t, s = '';
    if (tt && typeof tt === 'object') s = tt[base] || '';
    if (!s && it && it.k) {
      if (window.I18N && I18N.t) { var v = I18N.t(it.k); if (v && v !== it.k) s = v; }
      if (!s && FB[it.k]) s = FB[it.k][base] || FB[it.k].uz;
    }
    if (!s && tt && typeof tt === 'object') s = tt.uz || tt.en || '';
    if (!s && it && /^proj:/.test(it.link || '')) { var p = (P || window.PROJECTS || []).filter(function (x) { return x.id === it.link.slice(5); })[0]; if (p) s = typeof p.name === 'string' ? p.name : (p.name[base] || p.name.uz || ''); }
    if (lang === 'cy' && window.I18N && I18N.toCyr && tt && !tt.cy) s = I18N.toCyr(s);
    return s;
  }
  /* havola → { href, attrs, ext } */
  function href(link, CFG) {
    CFG = CFG || window.CFG || {};
    link = String(link || '');
    if (link.indexOf('route:') === 0) { var r = link.slice(6); return { href: '#' + r, attrs: ' data-route="' + r + '"' }; }
    if (link.indexOf('proj:') === 0) return { href: '#projects', attrs: ' data-proj="' + link.slice(5) + '"' };
    if (link === 'phone') return { href: 'tel:' + (CFG.PHONE || (CFG.PHONES || [])[0] || ''), attrs: ' data-phone' };
    if (link === 'telegram') return { href: CFG.TELEGRAM_CHANNEL || 'https://t.me/arthouse_toshkent', ext: 1, attrs: '' };
    if (link === 'instagram') return { href: CFG.INSTAGRAM || 'https://www.instagram.com/arthouse.tashkent', ext: 1, attrs: '' };
    if (link.indexOf('url:') === 0) { var u = link.slice(4); return { href: u, ext: /^https?:/.test(u), attrs: '' }; }
    return { href: '#home', attrs: '' };
  }
  window.AH_MENU = { L8: L8, FB: FB, ROUTES: ROUTES, def: def, get: get, label: label, href: href, img: img, uid: id };
})();
