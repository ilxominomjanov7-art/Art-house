/* =====================================================================
   ART HOUSE — «Telefonlar to'plami»: Instagram va Telegram bloklari uchun
   • Markazda faol telefon, chap va o'ngda — oldingi va keyingi video/post bilan yana ikkita telefon.
   • Mijoz surganda (yoki yondagi telefonni bosganda) telefonning o'zi almashadi: eski telefon chetga ketadi,
     yangisi video bilan markazga chiqadi. Postlar/videolar kabinetdan boshqariladi (Instagram, Telegram bo'limlari).
   ===================================================================== */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KINDS = [
    { sec: '#igStrip', stage: '.igs2-stage', phone: '.igs2-phone', slide: '.igs2-slide', screen: '.igs2-screen' },
    { sec: '#tgStrip', stage: '.tgs-stage', phone: '.tgs-phone', slide: '.tgs-slide', screen: '.tgs-screen' }
  ];
  function idx(slides) { for (var i = 0; i < slides.length; i++) if (slides[i].classList.contains('on')) return i; return 0; }
  /* yondagi telefon ichidagi ko'rinish: Instagram — videoning muqovasi, Telegram — postning nusxasi */
  function face(K, sl) {
    if (!sl) return '';
    if (K.sec === '#igStrip') {
      var v = sl.querySelector('video'), p = v && (v.getAttribute('poster') || ''), s = v && (v.currentSrc || v.getAttribute('src') || '');
      return p ? '<img src="' + p + '" alt="">' : (s ? '<video muted playsinline preload="metadata" src="' + s + '#t=0.5"></video>' : '');
    }
    var c = sl.cloneNode(true); c.className = 'tgs-slide on'; $$('video', c).forEach(function (v) { v.removeAttribute('autoplay'); v.preload = 'metadata'; });
    return '<div class="pd-tg"><i class="tgs-wall"></i>' + c.outerHTML + '</div>';
  }
  function deck(K) {
    var sec = $(K.sec); if (!sec || sec.dataset.deck) return;
    var stage = $(K.stage, sec), phone = $(K.phone, sec), slides = $$(K.slide, sec);
    if (!stage || !phone || slides.length < 2) return;
    sec.dataset.deck = '1'; stage.classList.add('pd-on');
    var L = document.createElement('button'), R = document.createElement('button');
    L.type = R.type = 'button'; L.className = 'pd-ghost l'; R.className = 'pd-ghost r';
    L.setAttribute('aria-label', '‹'); R.setAttribute('aria-label', '›');
    stage.appendChild(L); stage.appendChild(R);
    var cur = idx(slides);
    function paint() {
      var n = slides.length, i = idx(slides);
      L.innerHTML = '<span class="pd-scr">' + face(K, slides[(i - 1 + n) % n]) + '</span>';
      R.innerHTML = '<span class="pd-scr">' + face(K, slides[(i + 1) % n]) + '</span>';
    }
    function swap(dir) {
      phone.classList.remove('pd-in-l', 'pd-in-r'); void phone.offsetWidth;
      phone.classList.add(dir > 0 ? 'pd-in-r' : 'pd-in-l');
      [L, R].forEach(function (g) { g.classList.remove('pd-bump'); void g.offsetWidth; g.classList.add('pd-bump'); });
    }
    paint();
    new MutationObserver(function () {
      var i = idx(slides); if (i === cur) return;
      var n = slides.length, dir = (i === (cur + 1) % n) ? 1 : -1; cur = i; swap(dir); setTimeout(paint, 60);
    }).observe($(K.screen, sec) || sec, { subtree: true, attributes: true, attributeFilter: ['class'] });
    var key = function (k) { var s = $(K.screen, sec); if (s) s.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true })); };
    L.addEventListener('click', function () { key('ArrowLeft'); });
    R.addEventListener('click', function () { key('ArrowRight'); });
  }
  function all() { KINDS.forEach(deck); }
  /* bloklar til almashganda yoki kabinetdan yangilanganda qayta chiziladi — kuzatib boramiz */
  var home = document.getElementById('p-home');
  if (home) new MutationObserver(function () { setTimeout(all, 50); }).observe(home, { childList: true });
  all();
})();
