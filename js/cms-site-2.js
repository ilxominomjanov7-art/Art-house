/* =====================================================================
   ART HOUSE — SAYT BOSHQARUVI (CMS) · 2/3 — tillar va matnlar
   • Kabinetda qo'shilgan tillar ro'yxatga kiradi, o'chirilganlari yashiriladi.
   • Matn o'zgarishlari (ah_cms.text[til][kalit]) har bir tarjimadan ustun turadi.
   • Yangi til uchun tarjima yo'q kalitlar inglizcha ko'rsatiladi (o'zbekcha emas).
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N) return;
  var C = window.AH_CMS || {}, T = C.text || {}, LG = C.langs || {};
  var BUILTIN = I18N.langs.map(function (l) { return l.code; });
  var ADDED = [];
  (LG.added || []).forEach(function (L) {
    if (!L || !/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/i.test(L.code) || BUILTIN.indexOf(L.code) > -1) return;
    I18N.langs.push({ code: L.code, label: L.label || L.code, short: (L.short || L.code).toUpperCase().slice(0, 3), html: L.code, locale: L.locale || L.code, cms: true });
    ADDED.push(L.code);
  });
  var OFF = (LG.off || []).filter(function (c) { return c !== 'uz'; });
  for (var i = I18N.langs.length - 1; i >= 0; i--) if (OFF.indexOf(I18N.langs[i].code) > -1) I18N.langs.splice(i, 1);
  var st = ''; try { st = localStorage.getItem('ah_lang') || ''; } catch (e) {}
  if (st && ADDED.indexOf(st) > -1 && OFF.indexOf(st) < 0 && I18N.lang !== st) I18N.set(st);
  if (OFF.indexOf(I18N.lang) > -1) { try { localStorage.setItem('ah_lang', 'uz'); } catch (e) {} I18N.set('uz'); }

  function ov(key, lg) {
    var o = T[lg === 'cy' ? 'uz' : lg];
    if (!o || o[key] == null || o[key] === '') return null;
    return lg === 'cy' ? I18N.toCyr(o[key]) : o[key];
  }
  function fill(s, v) { return v ? String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : s; }
  var t0 = I18N.t, p0 = I18N.pick;
  window.AH_T0 = t0;
  I18N.t = function (key, vars, lng) {
    var lg = lng || I18N.lang, s = ov(key, lg);
    if (s != null) return fill(s, vars);
    return t0(key, vars, ADDED.indexOf(lg) > -1 && !(I18N.dict[lg] && I18N.dict[lg][key] != null) ? 'en' : lng);
  };
  I18N.pick = function (o) {
    var lg = I18N.lang;
    if (o && typeof o === 'object' && ADDED.indexOf(lg) > -1) return o[lg] || o.en || o.uz || '';
    return p0(o);
  };
  /* HTML'dagi [data-i] matnlariga o'zgarishlarni qo'llash */
  function post(root) {
    var lg = I18N.lang;
    (root || document).querySelectorAll('[data-i]').forEach(function (el) {
      var s = ov(el.getAttribute('data-i'), lg); if (s != null && el.textContent !== s) el.textContent = s;
    });
    (root || document).querySelectorAll('[data-i-ph]').forEach(function (el) {
      var s = ov(el.getAttribute('data-i-ph'), lg); if (s != null) el.setAttribute('placeholder', s);
    });
  }
  var a0 = I18N.apply;
  I18N.apply = function (r) { a0(r); post(r); };
  I18N.on(function () { post(); });
  window.AH_POST = post;
  window.AH_ADDED_LANGS = ADDED;

  /* Yangi bloklar uchun tarjimalar (festival, mobil menyu) */
  var X = {
    ru: { 'gal.eyebrow': 'Галерея', 'gal.title': 'Фото и видео', 'about.festE': 'Жизнь ART HOUSE', 'about.festT': 'Праздник для жителей и гостей', 'about.festD': 'Концерты, подарки и встречи с соседями — мы строим не только дома, но и дружное сообщество. Посмотрите, как прошёл праздник ART HOUSE.', 'nav.menu': 'Меню', 'nav.menuSub': 'Разделы сайта' },
    en: { 'gal.eyebrow': 'Gallery', 'gal.title': 'Photos and videos', 'about.festE': 'Life at ART HOUSE', 'about.festT': 'A celebration for residents and guests', 'about.festD': 'Concerts, gifts and time with neighbours: we build a friendly community, not just homes. See how the ART HOUSE festival went.', 'nav.menu': 'Menu', 'nav.menuSub': 'Website sections' },
    fr: { 'gal.eyebrow': 'Galerie', 'gal.title': 'Photos et vidéos', 'about.festE': 'La vie ART HOUSE', 'about.festT': 'Une fête pour les résidents et les invités', 'about.festD': 'Concerts, cadeaux et rencontres entre voisins : nous bâtissons une communauté chaleureuse, pas seulement des logements. Revivez la fête ART HOUSE.', 'nav.menu': 'Menu', 'nav.menuSub': 'Rubriques du site' },
    it: { 'gal.eyebrow': 'Galleria', 'gal.title': 'Foto e video', 'about.festE': 'La vita ART HOUSE', 'about.festT': 'Una festa per residenti e ospiti', 'about.festD': 'Concerti, regali e momenti con i vicini: costruiamo una comunità unita, non solo case. Guarda com’è andata la festa ART HOUSE.', 'nav.menu': 'Menu', 'nav.menuSub': 'Sezioni del sito' },
    es: { 'gal.eyebrow': 'Galería', 'gal.title': 'Fotos y vídeos', 'about.festE': 'La vida en ART HOUSE', 'about.festT': 'Una fiesta para vecinos e invitados', 'about.festD': 'Conciertos, regalos y encuentros entre vecinos: construimos una comunidad unida, no solo viviendas. Mire cómo fue la fiesta de ART HOUSE.', 'nav.menu': 'Menú', 'nav.menuSub': 'Secciones del sitio' },
    de: { 'gal.eyebrow': 'Galerie', 'gal.title': 'Fotos und Videos', 'about.festE': 'Leben bei ART HOUSE', 'about.festT': 'Ein Fest für Bewohner und Gäste', 'about.festD': 'Konzerte, Geschenke und Begegnungen mit den Nachbarn: Wir bauen nicht nur Wohnungen, sondern eine echte Gemeinschaft. Sehen Sie, wie das ART HOUSE Fest war.', 'nav.menu': 'Menü', 'nav.menuSub': 'Bereiche der Website' },
    tr: { 'gal.eyebrow': 'Galeri', 'gal.title': 'Fotoğraf ve video', 'about.festE': 'ART HOUSE yaşamı', 'about.festT': 'Sakinler ve misafirler için bir şenlik', 'about.festD': 'Konserler, hediyeler ve komşularla buluşmalar: Sadece ev değil, sıcak bir topluluk inşa ediyoruz. ART HOUSE şenliğinin nasıl geçtiğini izleyin.', 'nav.menu': 'Menü', 'nav.menuSub': 'Site bölümleri' }
  };
  Object.keys(X).forEach(function (l) { I18N.extend(l, X[l]); });
})();
