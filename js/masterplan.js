/* =====================================================================
   ART HOUSE — interaktiv bosh reja (Agalarov Residence uslubida)
   Loyiha sahifasida yuqoridan olingan rasm ustida har bir blok belgilangan;
   blok bosilganda pastdan karta chiqadi: qavatlar, rejalar, band qilish, yordam.
   Bloklar joylashuvi rasmga nisbatan foizda (x, y). TEKSHIRING: blok raqamlari
   rasmiy bosh reja bilan solishtirilsin.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N) return;
  var PLANS = {
    musaffo: {
      img: 'assets/img/musaffo/musaffo-aerial-ig.webp',
      floors: 16,
      blocks: [
        { n: 1, x: 30, y: 19 }, { n: 2, x: 52, y: 18 }, { n: 3, x: 22, y: 33 },
        { n: 4, x: 49, y: 29 }, { n: 5, x: 80, y: 31 }, { n: 6, x: 15, y: 42 },
        { n: 7, x: 60, y: 41 }, { n: 8, x: 81, y: 43 }, { n: 9, x: 55, y: 55 }
      ]
    }
  };
  I18N.extend('uz', { 'mp.title': 'Blokni tanlang', 'mp.hint': "Bino ustidagi raqamga bosing", 'mp.block': 'Blok', 'mp.floors': 'qavat', 'mp.plans': "Xonadon rejalari", 'mp.help': 'Tanlovda yordam', 'mp.video': 'Dron videosi', 'mp.book': 'Band qilish', 'mp.status': 'Sotuvda', 'mp.lifts': 'lift har podyezdda' });
  I18N.extend('ru', { 'mp.title': 'Выберите корпус', 'mp.hint': 'Нажмите на номер над зданием', 'mp.block': 'Корпус', 'mp.floors': 'этажей', 'mp.plans': 'Планировки квартир', 'mp.help': 'Помощь в выборе', 'mp.video': 'Видео с дрона', 'mp.book': 'Забронировать', 'mp.status': 'В продаже', 'mp.lifts': 'лифта в каждом подъезде' });
  I18N.extend('en', { 'mp.title': 'Choose a building', 'mp.hint': 'Tap the number above a building', 'mp.block': 'Building', 'mp.floors': 'floors', 'mp.plans': 'Floor plans', 'mp.help': 'Help me choose', 'mp.video': 'Drone video', 'mp.book': 'Book now', 'mp.status': 'On sale', 'mp.lifts': 'lifts per entrance' });
  I18N.extend('fr', { 'mp.title': 'Choisissez un bâtiment', 'mp.hint': 'Touchez le numéro au-dessus du bâtiment', 'mp.block': 'Bâtiment', 'mp.floors': 'étages', 'mp.plans': 'Plans des appartements', 'mp.help': 'Aide au choix', 'mp.video': 'Vidéo par drone', 'mp.book': 'Réserver', 'mp.status': 'En vente', 'mp.lifts': 'ascenseurs par entrée' });
  I18N.extend('it', { 'mp.title': 'Scegli un edificio', 'mp.hint': "Tocca il numero sopra l'edificio", 'mp.block': 'Edificio', 'mp.floors': 'piani', 'mp.plans': 'Planimetrie', 'mp.help': 'Aiuto nella scelta', 'mp.video': 'Video da drone', 'mp.book': 'Prenota', 'mp.status': 'In vendita', 'mp.lifts': 'ascensori per ingresso' });
  I18N.extend('es', { 'mp.title': 'Elija un edificio', 'mp.hint': 'Toque el número sobre el edificio', 'mp.block': 'Edificio', 'mp.floors': 'plantas', 'mp.plans': 'Planos de viviendas', 'mp.help': 'Ayuda para elegir', 'mp.video': 'Vídeo con dron', 'mp.book': 'Reservar', 'mp.status': 'En venta', 'mp.lifts': 'ascensores por portal' });
  I18N.extend('de', { 'mp.title': 'Gebäude wählen', 'mp.hint': 'Tippen Sie auf die Nummer über dem Gebäude', 'mp.block': 'Gebäude', 'mp.floors': 'Etagen', 'mp.plans': 'Grundrisse', 'mp.help': 'Hilfe bei der Auswahl', 'mp.video': 'Drohnenvideo', 'mp.book': 'Reservieren', 'mp.status': 'Im Verkauf', 'mp.lifts': 'Aufzüge je Eingang' });
  I18N.extend('tr', { 'mp.title': 'Blok seçin', 'mp.hint': 'Binanın üzerindeki numaraya dokunun', 'mp.block': 'Blok', 'mp.floors': 'kat', 'mp.plans': 'Daire planları', 'mp.help': 'Seçimde yardım', 'mp.video': 'Drone videosu', 'mp.book': 'Rezerve et', 'mp.status': 'Satışta', 'mp.lifts': 'asansör her girişte' });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var t = function (k, v) { return I18N.t(k, v); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function cur() { var b = $('#projTabs [aria-selected="true"]'); return b ? b.dataset.p : 'musaffo'; }

  function render() {
    var box = $('#projDetail'); if (!box || !box.firstChild || $('.mplan', box)) return;
    var id = cur(), M = PLANS[id]; if (!M) return;
    var h = '<section class="mplan reveal in"><div class="sec-head"><h2>' + esc(t('mp.title')) + '</h2></div>' +
      '<div class="mp-stage"><img src="' + M.img + '" alt="" loading="lazy" decoding="async">' +
      M.blocks.map(function (b) { return '<button type="button" class="mp-pin" data-mp="' + b.n + '" style="left:' + b.x + '%;top:' + b.y + '%" aria-label="' + esc(t('mp.block') + ' ' + b.n) + '"><span>' + b.n + '</span></button>'; }).join('') +
      '<p class="mp-hint">' + esc(t('mp.hint')) + '</p></div>' +
      '<div class="mp-actions"><button type="button" class="btn mp-dark" data-mp-video>' + esc(t('mp.video')) + '</button><button type="button" class="btn btn-gold" data-mp-help>' + esc(t('mp.help')) + '</button></div></section>';
    var after = $('.pvids', box) || $('.pd-hero', box);
    if (after) after.insertAdjacentHTML('afterend', h); else box.insertAdjacentHTML('afterbegin', h);
  }

  function sheet(n) {
    var M = PLANS[cur()], old = $('#mpSheet'); if (old) old.remove();
    var hasPlans = !!$('#projDetail .plans');
    var s = document.createElement('div'); s.id = 'mpSheet'; s.className = 'mp-sheet'; s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true');
    s.innerHTML = '<div class="mp-card"><span class="mp-grab"></span><div class="mp-head"><b>' + esc(t('mp.block')) + ' ' + n + '</b><span class="mp-tag">' + esc(t('mp.status')) + '</span></div>' +
      '<div class="mp-facts"><div><b>' + M.floors + '</b><span>' + esc(t('mp.floors')) + '</span></div><div><b>2</b><span>' + esc(t('mp.lifts')) + '</span></div></div>' +
      '<div class="mp-btns">' + (hasPlans ? '<button type="button" class="btn btn-ghost" data-mp-plans>' + esc(t('mp.plans')) + '</button>' : '') +
      '<button type="button" class="btn btn-gold" data-mp-book>' + esc(t('mp.book')) + '</button></div>' +
      '<button type="button" class="mp-help" data-mp-help>' + esc(t('mp.help')) + '</button></div>';
    document.body.appendChild(s);
    requestAnimationFrame(function () { s.classList.add('on'); });
    var close = function () { s.classList.remove('on'); setTimeout(function () { s.remove(); }, 320); };
    s.addEventListener('click', function (e) {
      if (e.target === s) return close();
      if (e.target.closest('[data-mp-plans]')) { close(); var pl = $('#projDetail .plans'); if (pl) pl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      if (e.target.closest('[data-mp-book]')) { close(); var bb = $('#projDetail [data-book-project]'); if (bb) bb.click(); }
      if (e.target.closest('[data-mp-help]')) { close(); help(); }
    });
    document.querySelectorAll('.mp-pin').forEach(function (p) { p.classList.toggle('on', +p.dataset.mp === n); });
  }
  function help() { if (window.ArtHouseAI && ArtHouseAI.open) ArtHouseAI.open(); }

  document.addEventListener('click', function (e) {
    var p = e.target.closest('.mp-pin'); if (p) return sheet(+p.dataset.mp);
    if (e.target.closest('.mplan [data-mp-help]')) return help();
    if (e.target.closest('[data-mp-video]')) { var v = $('#projDetail .pvids video, #projDetail .pd-cover video'); if (v) { v.scrollIntoView({ behavior: 'smooth', block: 'center' }); try { v.play(); } catch (x) {} } else { var hv = $('#heroVideo'); location.hash = '#home'; if (hv) setTimeout(function () { hv.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 400); } }
  });
  var pd = $('#projDetail'); if (pd) new MutationObserver(render).observe(pd, { childList: true });
  I18N.on(function () { var m = $('.mplan'); if (m) m.remove(); setTimeout(render, 0); });
  render();
})();
