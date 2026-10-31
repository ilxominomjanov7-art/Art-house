/* =====================================================================
   ART HOUSE — SAYT MANTIQI
   ===================================================================== */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = I18N.t, pick = I18N.pick;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var icon = function (id, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '"><use href="#' + id + '"/></svg>'; };
  var P = window.PROJECTS, byId = function (id) { return P.filter(function (p) { return p.id === id; })[0] || P[0]; };
  var LS = function (k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('ah3_' + k)); localStorage.setItem('ah3_' + k, JSON.stringify(v)); } catch (e) { return null; } };
  var YEARS = CFG.EXPERIENCE_YEARS;
  var MB = 50;

  function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 3600); }
  var locks = 0;
  function lock(on) { locks = Math.max(0, locks + (on ? 1 : -1)); document.body.classList.toggle('lock', locks > 0); }
  function fmtPhone(p) { return String(p).replace(/^\+?998(\d{2})(\d{3})(\d{2})(\d{2})$/, '+998 $1 $2 $3 $4'); }

  /* ---------------- kirish animatsiyasi ----------------
     index.html dagi kichik skript animatsiyani darhol boshlaydi (rejim: full — to'liq, quick — shu oynada qayta
     yuklanganda qisqa, calm — «harakatni kamaytirish» yoqilgan bo'lsa sokin). Bu yerda — tugatish va eshiklarni ochish.
     Kabinetning yashirin yuklovchisi (?cmsnap=1), jonli tahrir (?edit=1), ?intro=0 va iframe ichida ko'rsatilmaydi. */
  (function splash() {
    var el = $('#splash'), go = false, t, mode = el && el.getAttribute('data-mode');
    /* splash tugagach — bosh sahifa matni bosqichma-bosqich ochiladi, raqamlar sanaladi */
    function hero() {
      if (go) return; go = true;
      document.body.classList.remove('intro-pre'); document.body.classList.add('intro-go');
      setTimeout(function () { countUp($$('.hero .stats b')); }, 900);
    }
    document.body.classList.add('intro-pre');
    if (!mode) { if (el) el.remove(); document.body.classList.remove('is-loading'); hero(); return; }
    function done() {
      if (el.classList.contains('out')) return;
      clearTimeout(t); el.classList.add('out'); document.body.classList.remove('is-loading');
      setTimeout(hero, mode === 'calm' ? 100 : 450);
      setTimeout(function () { el.remove(); }, mode === 'calm' ? 750 : 1100);
    }
    el.addEventListener('click', done);
    var T = { full: 1900, quick: 650, calm: 1000 }[mode], spent = Date.now() - (+el.getAttribute('data-t0') || Date.now());
    t = setTimeout(done, Math.max(250, T - spent));
  })();

  /* raqamlarni 0 dan sanab chiqarish: «30+», «36», «1 010», «114K» — qo'shimchalar saqlanadi */
  function countUp(list) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    list.forEach(function (b) {
      if (b.dataset.counted) return;
      var t = b.textContent.trim(), m = t.match(/^([^\d]*)([\d\s.,]*\d)(.*)$/); if (!m) return;
      var sep = /\d\s\d/.test(m[2]) ? ' ' : '', n = parseFloat(m[2].replace(/[\s,]/g, '')); if (!isFinite(n) || n === 0) return;
      b.dataset.counted = '1';
      var dec = (m[2].split('.')[1] || '').length, t0 = performance.now(), D = 1600;
      (function f(now) {
        var k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3), v = (n * e).toFixed(dec);
        if (sep) v = v.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        b.textContent = m[1] + v + m[3];
        if (k < 1) requestAnimationFrame(f); else b.textContent = t;
      })(t0);
    });
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { countUp($$('b', e.target)); cio.unobserve(e.target); } }); }, { threshold: .4 });
    $$('.about-nums, .ig-stats').forEach(function (x) { cio.observe(x); });
  }

  /* ---------------- aria-label tarjimalari ---------------- */
  $$('[aria-label="Yopish"]').forEach(function (b) { b.setAttribute('data-i-al', 'aria.close'); });
  $$('[aria-label="Oldingi"]').forEach(function (b) { b.setAttribute('data-i-al', 'aria.prev'); });
  $$('[aria-label="Keyingi"]').forEach(function (b) { b.setAttribute('data-i-al', 'aria.next'); });
  $$('[aria-label="Qo\'ng\'iroq"]').forEach(function (b) { b.setAttribute('data-i-al', 'aria.call'); });
  $('.menu').setAttribute('data-i-al', 'aria.menu');

  I18N.apply();
  I18N.mountSwitcher($('#langSite'));
  $('#year').textContent = new Date().getFullYear();
  $$('[data-count="years"]').forEach(function (el) { el.textContent = YEARS; });

  /* ---------------- aloqa havolalari ---------------- */
  var PHONE = CFG.PHONES[0];
  $$('[data-phone]').forEach(function (a) { a.href = 'tel:' + PHONE; });
  $$('[data-phone-text]').forEach(function (s) { s.textContent = fmtPhone(PHONE); });
  $('#tgManager').href = CFG.TELEGRAM_MANAGER || CFG.TELEGRAM_CHANNEL;
  $$('[data-ig]').forEach(function (a) { a.href = CFG.INSTAGRAM; });
  $('#projChips').innerHTML = (window.ALL_PROJECT_NAMES || []).map(function (n) { var p = P.filter(function (x) { return x.name === n; })[0]; return p ? '<a class="chip" href="#projects/' + p.id + '">' + esc(n) + '</a>' : '<span class="chip">' + esc(n) + '</span>'; }).join('');
  $('#phoneList').innerHTML = CFG.PHONES.map(function (p) { return '<li><a href="tel:' + p + '">' + icon('i-phone') + fmtPhone(p) + '</a></li>'; }).join('');

  /* ---------------- marshrutlash (sahifalar) ---------------- */
  var ROUTES = ['home', 'calculator', 'projects', 'location', 'about', 'social', 'contact', 'reviews'];
  var current = null;
  function route() {
    var h = (location.hash || '#home').slice(1).split('/'), page = h[0], sub = h[1];
    if (ROUTES.indexOf(page) < 0) page = 'home';
    if (page !== current) {
      $$('.page').forEach(function (s) { s.hidden = s.dataset.page !== page; });
      $$('.menu a').forEach(function (a) { var on = a.dataset.route === page; a.classList.toggle('active', on); if (on) { a.setAttribute('aria-current', 'page'); a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: current ? 'smooth' : 'auto' }); } else a.removeAttribute('aria-current'); });
      window.scrollTo({ top: 0, behavior: current ? 'smooth' : 'auto' });
      current = page;
      document.title = (page === 'home' ? '' : $('.menu a[data-route="' + page + '"] span').textContent + ' — ') + 'ART HOUSE — Luxury Residence';
      reveal();
      heroVideo(page === 'home');
    }
    if (page === 'projects') showProject(sub || projState.id);
    if (page === 'location') showLoc(sub || locState.id);
  }
  window.addEventListener('hashchange', route);

  /* ---------------- paydo bo'lish effekti ---------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .08 }) : null;
  function reveal() {
    $$('.page:not([hidden]) .card, .page:not([hidden]) .pcard, .page:not([hidden]) .sec-head').forEach(function (el) {
      if (el.classList.contains('in') || el.closest('.modal')) return;
      if (!io) return el.classList.add('in');
      el.classList.add('reveal'); io.observe(el);
    });
  }
  window.addEventListener('scroll', function () { $('#top').classList.toggle('scrolled', scrollY > 8); }, { passive: true });

  /* ---------------- hero video ---------------- */
  var hv = $('#heroVideo');
  function heroVideo(on) { if (!hv) return; if (on && !document.hidden) { var p = hv.play(); if (p && p.catch) p.catch(function () {}); } else hv.pause(); }
  document.addEventListener('visibilitychange', function () { heroVideo(current === 'home'); });
  /* bosh ekran: kabinetda video qo'yilmagan bo'lsa — toza renderlar navbatma-navbat (sekin yaqinlashish bilan) */
  (function heroSlides() {
    var box = $('#heroSlides'); if (!box) return;
    if (document.documentElement.classList.contains('hero-vid')) { box.remove(); return; }
    var im = $$('img', box), i = 0;
    function lazy() { im.forEach(function (x) { if (x.dataset.src) { x.src = x.dataset.src; x.removeAttribute('data-src'); } }); }
    if (document.readyState === 'complete') setTimeout(lazy, 1500); else addEventListener('load', function () { setTimeout(lazy, 1500); });
    if (im.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setInterval(function () {
      if (current !== 'home' || document.hidden) return;
      var a = im[i], n = (i + 1) % im.length, b = im[n];
      if (!b.complete || !b.naturalWidth) return;
      i = n; a.classList.remove('on'); b.classList.add('on');
    }, 6500);
  })();

  /* ---------------- yugurib turuvchi satr ---------------- */
  function marquee() { var items = t('marquee').split('|'), h = items.concat(items).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join(''); $('#marquee').innerHTML = h; }

  /* ---------------- rasm/obyekt yordamchilari ---------------- */
  function cover(p) {
    if (p.cover && p.poster) return '<div class="poster"><img class="poster-bg" src="' + p.cover + '" alt="" aria-hidden="true" loading="lazy"><img class="poster-fg" src="' + p.cover + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async"></div>';
    if (p.cover) return '<img src="' + p.cover + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">';
    return '<div class="art-cover"><svg viewBox="0 0 100 100"><use href="#logo"/></svg><b>' + esc(p.name.toUpperCase()) + '</b></div>';
  }
  function planName(pl) {
    return t('plan.label', { rooms: pl.rooms, duplex: pl.duplex ? t('plan.duplex') : '', area: String(pl.area).replace('.', ',') });
  }
  function planSub(pl) {
    var s = []; if (pl.duplex) s.push(t('rooms.floor', { n: pl.duplex })); if (pl.balcony) s.push(t('rooms.balcony')); return s.join(' · ');
  }

  /* ================= BOSH SAHIFA ================= */
  function renderHome() {
    $('#homeProjects').innerHTML = P.map(function (p) {
      return '<a class="pcard" href="#projects/' + p.id + '"><span class="tag">' + esc(pick(p.badge)) + '</span><div class="pcard-img">' + cover(p) + '</div>' +
        '<div class="pcard-body"><h3>' + esc(pick(p.name)) + '</h3><p>' + esc(pick(p.district)) + ' · ' + esc(pick(p.address)) + '</p><span class="go">' + esc(t('proj.open')) + icon('i-arrow') + '</span></div></a>';
    }).join('');
    $('#homeLoc').innerHTML = [{ n: t('loc.office'), d: t('loc.officeAddr') }].concat(P.map(function (p) { return { n: pick(p.name), d: pick(p.district) + ', ' + pick(p.address) }; }))
      .map(function (x) { return '<li>' + icon('i-pin') + '<div><b>' + esc(x.n) + '</b><span>' + esc(x.d) + '</span></div></li>'; }).join('');
    var p = byId('musaffo'), pl = p.plans[0], tot = pl ? pl.area * p.priceM2 : 60000, down = tot * .3, m = (tot - down) / 36;
    $('#miniCalc').innerHTML = '<div><span>' + esc(t('calc.total')) + '</span><b>' + I18N.usd(tot) + '</b></div><div><span>' + esc(t('calc.rDown')) + ' 30%</span><b>' + I18N.usd(down) + '</b></div><div><span>' + esc(t('calc.rMonthly')) + '</span><b>' + I18N.usd(m) + '</b></div>';
    renderHomeReviews();
  }

  /* ================= KALKULYATOR ================= */
  var calc = { project: 'musaffo', plan: 0, area: 53, price: 1100, total: 58300, pct: 30, months: 36 };
  var C = { proj: $('#cProject'), plan: $('#cPlan'), area: $('#cArea'), price: $('#cPrice'), total: $('#cTotal'), down: $('#cDown') };
  function fillRange(el) { el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min) * 100) + '%'); }
  function calcOptions() {
    C.proj.innerHTML = P.map(function (p) { return '<option value="' + p.id + '">' + esc(pick(p.name)) + ' — ' + esc(pick(p.district)) + '</option>'; }).join('');
    C.proj.value = calc.project;
    var p = byId(calc.project);
    $('#cPlanWrap').hidden = !p.plans.length;
    C.plan.innerHTML = p.plans.map(function (pl, i) { var s = planSub(pl); return '<option value="' + i + '">' + esc(planName(pl) + (s ? ' · ' + s : '')) + '</option>'; }).join('') + '<option value="-1">' + esc(t('plan.manual')) + '</option>';
    C.plan.value = String(p.plans.length ? calc.plan : -1);
    $('#cMonths').innerHTML = CFG.MONTHS.map(function (m) { return '<button type="button" data-m="' + m + '" aria-pressed="' + (m === calc.months) + '">' + m + ' ' + esc(t('unit.month')) + '</button>'; }).join('');
    $('#cPriceHint').hidden = !!p.priceM2;
  }
  function setProject(id, planIdx) {
    var p = byId(id);
    calc.project = p.id; calc.plan = p.plans.length ? (planIdx != null ? planIdx : 0) : -1;
    if (p.priceM2) calc.price = p.priceM2;
    if (calc.plan > -1) calc.area = p.plans[calc.plan].area;
    calcOptions(); fromParts();
  }
  function fromParts() {
    calc.total = Math.min(500000, Math.max(20000, Math.round(calc.area * calc.price / 100) * 100));
    C.area.value = calc.area; C.price.value = calc.price; C.total.value = calc.total; renderCalc();
  }
  function renderCalc() {
    var d = calc.total * calc.pct / 100, rest = calc.total - d, m = rest / calc.months, end = new Date(); end.setMonth(end.getMonth() + calc.months);
    C.down.min = CFG.DOWN_MIN; C.down.max = CFG.DOWN_MAX; if (calc.pct < CFG.DOWN_MIN) calc.pct = CFG.DOWN_MIN; C.down.value = calc.pct;
    $('#cTotalOut').textContent = I18N.usd(calc.total);
    $('#cDownOut').textContent = calc.pct + '%';
    $('#rDown').textContent = I18N.usd(d) + ' (' + calc.pct + '%)';
    $('#rRest').textContent = I18N.usd(rest);
    $('#rLast').textContent = I18N.date(end, { month: 'long', year: 'numeric' });
    $('#rMonthly').innerHTML = esc(I18N.usd(m)) + ' <small>' + esc(t('unit.perMonth')) + '</small>';
    $('#rMonthlyUzs').textContent = t('calc.uzs', { v: I18N.num(Math.round(m * CFG.USD_UZS / 1000) * 1000) });
    $('#cDonut').style.setProperty('--a', calc.pct + '%'); $('#cDonutTxt').textContent = calc.pct + '%';
    fillRange(C.total); fillRange(C.down);
    calc.down = d; calc.monthly = m;
    if (!$('#cSched').hidden) schedule();
  }
  function schedule() {
    var now = new Date(), h = '<div><span>' + esc(t('calc.rDown')) + '</span><b>' + I18N.usd(calc.down) + '</b></div>';
    for (var i = 1; i <= calc.months; i++) { var x = new Date(now.getFullYear(), now.getMonth() + i, 1); h += '<div><span>' + esc(t('calc.nth', { n: i })) + ' · ' + esc(I18N.date(x, { month: 'long', year: 'numeric' })) + '</span><b>' + I18N.usd(calc.monthly) + '</b></div>'; }
    $('#cSched').innerHTML = h;
  }
  C.proj.addEventListener('change', function () { setProject(C.proj.value); });
  C.plan.addEventListener('change', function () { calc.plan = +C.plan.value; if (calc.plan > -1) { calc.area = byId(calc.project).plans[calc.plan].area; fromParts(); } });
  C.area.addEventListener('input', function () { var v = parseFloat(C.area.value); if (v > 0) { calc.area = v; calc.plan = -1; C.plan.value = '-1'; fromParts(); } });
  C.price.addEventListener('input', function () { var v = parseFloat(C.price.value); if (v > 0) { calc.price = v; fromParts(); } });
  C.total.addEventListener('input', function () { calc.total = +C.total.value; renderCalc(); });
  C.down.addEventListener('input', function () { calc.pct = +C.down.value; renderCalc(); });
  $('#cMonths').addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (!b) return; calc.months = +b.dataset.m; $$('#cMonths button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); renderCalc(); });
  $('#cSchedBtn').addEventListener('click', function () { var s = $('#cSched'), o = s.hidden; s.hidden = !o; this.setAttribute('aria-expanded', String(o)); this.textContent = t(o ? 'calc.hideSched' : 'calc.showSched'); if (o) schedule(); });
  $('#cBook').addEventListener('click', function () { openBook({ fromCalc: true }); });
  (function () { var once = 0, f = function () { if (!once) { once = 1; CRM.track('c'); } }; $('.calc').addEventListener('input', f); $('.calc').addEventListener('click', f); })();

  /* ================= LOYIHALAR ================= */
  var projState = { id: 'musaffo', rooms: 'all' };
  function renderProjTabs() {
    $('#projTabs').innerHTML = P.map(function (p) { return '<button type="button" role="tab" data-p="' + p.id + '" aria-selected="' + (p.id === projState.id) + '">' + esc(pick(p.name)) + '</button>'; }).join('');
  }
  $('#projTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) location.hash = 'projects/' + b.dataset.p; });
  function showProject(id) {
    if (!P.some(function (p) { return p.id === id; })) id = 'musaffo';
    if (projState.id !== id) projState.rooms = 'all';
    projState.id = id; renderProjTabs();
    var p = byId(id), h = '';
    var media = p.video ? '<video src="' + p.video.src + '" poster="' + (p.video.poster || '') + '" muted loop playsinline autoplay preload="metadata"></video>' : cover(p);
    var acts = '<a class="btn btn-gold" href="#calculator" data-calc="' + p.id + '">' + esc(t('proj.calc')) + '</a>' +
      '<button class="btn btn-ghost" type="button" data-book-project="' + p.id + '">' + esc(t('proj.book')) + '</button>' +
      (p.presentation ? '<a class="btn btn-ghost" href="' + esc(p.presentation) + '" target="_blank" rel="noopener">' + icon('i-doc') + esc(t('proj.presentation')) + '</a>'
        : '<button class="btn btn-ghost" type="button" data-ask-pres="' + p.id + '">' + icon('i-doc') + esc(t('proj.askPresentation')) + '</button>') +
      '<a class="btn btn-ghost" href="' + CFG.INSTAGRAM + '" target="_blank" rel="noopener">' + icon('i-ig') + esc(t('proj.instagram')) + '</a>';
    h += '<div class="pd-hero"><div class="pd-cover">' + media + '</div><div class="card pd-info"><span class="eyebrow">' + esc(pick(p.badge)) + '</span><h3>' + esc(pick(p.name)) + '</h3>' +
      '<div class="pd-meta"><span>' + icon('i-pin') + esc(pick(p.district)) + '</span><span>' + esc(pick(p.address)) + '</span><a href="#location/' + p.id + '" class="chip">' + esc(t('proj.map')) + '</a></div>' +
      '<p class="muted">' + esc(pick(p.lead)) + '</p>' +
      (p.facts.length ? '<div class="facts">' + p.facts.map(function (f) { return '<div><b>' + esc(f.v) + '</b><span>' + esc(pick(f.k)) + '</span></div>'; }).join('') + '</div>' : '') +
      '<div class="pd-actions">' + acts + '</div></div></div>';

    if (p.amenities.length) h += '<div class="sec-head"><h2>' + esc(t('proj.amenities')) + '</h2></div><div class="amen">' + p.amenities.map(function (a, i) {
      return '<article><img src="' + a.img + '" alt="' + esc(pick(a.t)) + '" loading="lazy" decoding="async" data-lb="amen" data-idx="' + i + '"><div><h4>' + esc(pick(a.t)) + '</h4><p>' + esc(pick(a.d)) + '</p></div></article>';
    }).join('') + '</div>';

    if (p.gallery.length) h += '<div class="sec-head"><h2>' + esc(t('proj.gallery')) + '</h2></div><div class="gallery">' + p.gallery.map(function (g, i) {
      return '<button type="button" data-lb="gal" data-idx="' + i + '"' + (g.ov ? ' class="has-ov"' : '') + '><img src="' + g.src + '" alt="' + esc(pick(g.t)) + '" loading="lazy" decoding="async">' + ovHtml(g.ov) + '<span>' + esc(pick(g.t)) + '</span></button>';
    }).join('') + '</div>';

    if (p.plans.length) {
      var rooms = ['all'].concat(p.plans.map(function (x) { return x.duplex ? 'd' : String(x.rooms); }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      h += '<div class="sec-head"><h2>' + esc(t('proj.plans')) + '</h2></div><div class="seg plan-filter" id="planFilter">' + rooms.map(function (r) {
        var lbl = r === 'all' ? t('rooms.all') : r === 'd' ? t('rooms.duplex') : t('rooms.n', { n: r });
        return '<button type="button" data-r="' + r + '" aria-pressed="' + (r === projState.rooms) + '">' + esc(lbl) + '</button>';
      }).join('') + '</div><div class="plans">' + p.plans.map(function (pl, i) {
        var key = pl.duplex ? 'd' : String(pl.rooms), sub = planSub(pl);
        return '<figure class="plan" data-r="' + key + '"' + (projState.rooms !== 'all' && projState.rooms !== key ? ' hidden' : '') + '><img src="' + pl.img + '" alt="' + esc(planName(pl)) + '" loading="lazy" decoding="async" data-lb="plan" data-idx="' + i + '">' +
          '<figcaption class="plan-b"><div><b>' + esc(planName(pl)) + '</b><span>' + esc(sub || (p.priceM2 ? '≈ ' + I18N.usd(pl.area * p.priceM2) : '')) + '</span></div><button class="btn btn-gold sm" type="button" data-book-plan="' + i + '">' + esc(t('proj.book')) + '</button></figcaption></figure>';
      }).join('') + '</div>';
    }
    if (!p.gallery.length && !p.plans.length) h += '<div class="empty-note" style="margin-top:24px"><p>' + esc(t('proj.soon')) + '</p><a class="btn btn-gold sm" href="#contact">' + esc(t('proj.askManager')) + '</a></div>';
    $('#projDetail').innerHTML = h;
    reveal();
  }
  $('#projDetail').addEventListener('click', function (e) {
    var p = byId(projState.id), b;
    if ((b = e.target.closest('[data-r]')) && b.tagName === 'BUTTON') {
      projState.rooms = b.dataset.r;
      $$('#planFilter button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.plan').forEach(function (f) { f.hidden = projState.rooms !== 'all' && f.dataset.r !== projState.rooms; });
    } else if ((b = e.target.closest('[data-lb]'))) {
      var kind = b.dataset.lb, items = kind === 'gal' ? p.gallery.map(function (g) { return { src: g.src, cap: pick(g.t), ov: g.ov }; })
        : kind === 'amen' ? p.amenities.map(function (a) { return { src: a.img, cap: pick(a.t), ov: { h: a.t, s: a.d } }; })
          : p.plans.map(function (pl) { return { src: pl.img, cap: planName(pl) }; });
      openLightbox(items, +b.dataset.idx);
    } else if ((b = e.target.closest('[data-book-plan]'))) {
      setProject(p.id, +b.dataset.bookPlan); openBook({ fromCalc: true });
    } else if ((b = e.target.closest('[data-book-project]'))) {
      setProject(p.id); openBook({ fromCalc: !!p.plans.length, project: p.id });
    } else if ((b = e.target.closest('[data-calc]'))) {
      setProject(b.dataset.calc);
    } else if ((b = e.target.closest('[data-ask-pres]'))) {
      openBook({ project: p.id, topic: t('proj.askPresentation') });
    }
  });

  /* ================= JOYLASHUV ================= */
  var locState = { id: 'office', map: 'google' };
  function locPoints() { return [{ id: 'office', name: t('loc.office'), addr: t('loc.officeAddr'), geo: CFG.OFFICE }].concat(P.map(function (p) { return { id: p.id, name: pick(p.name), addr: pick(p.district) + ', ' + pick(p.address), geo: p.geo }; })); }
  var INFRA = [['school', 'school'], ['kinder', 'kindergarten'], ['hospital', 'hospital'], ['market', 'supermarket'], ['metro', 'metro station'], ['park', 'park'], ['pharmacy', 'pharmacy'], ['gym', 'gym']];
  function showLoc(id) {
    var pts = locPoints(), pt = pts.filter(function (x) { return x.id === id; })[0] || pts[0];
    locState.id = pt.id;
    $('#locTabs').innerHTML = pts.map(function (x) { return '<button type="button" role="tab" data-l="' + x.id + '" aria-selected="' + (x.id === pt.id) + '">' + esc(x.name) + '</button>'; }).join('');
    var g = pt.geo, ll = g.lat + ',' + g.lng, hl = I18N.lang === 'cy' ? 'uz' : I18N.lang, yl = { ru: 'ru_RU', en: 'en_US' }[I18N.lang] || 'uz_UZ';
    var src = locState.map === 'google' ? 'https://maps.google.com/maps?q=' + ll + '&z=15&hl=' + hl + '&output=embed'
      : 'https://yandex.uz/map-widget/v1/?ll=' + g.lng + '%2C' + g.lat + '&z=15&pt=' + g.lng + ',' + g.lat + ',pm2gnm&lang=' + yl;
    var fr = $('#mapFrame'); if (fr.getAttribute('src') !== src) fr.setAttribute('src', src);
    fr.title = pt.name;
    $('#locName').textContent = pt.name; $('#locAddr').textContent = pt.addr;
    $('#locGoogle').href = 'https://www.google.com/maps/search/?api=1&query=' + ll;
    $('#locYandex').href = 'https://yandex.uz/maps/?pt=' + g.lng + ',' + g.lat + '&z=16&l=map';
    $('#locTaxi').href = 'https://3.redirect.appmetrica.yandex.com/route?end-lat=' + g.lat + '&end-lon=' + g.lng + '&appmetrica_tracking_id=1178268795219780156';
    $('#locInfra').innerHTML = INFRA.map(function (x) {
      return '<a class="chip" target="_blank" rel="noopener" href="https://www.google.com/maps/search/' + encodeURIComponent(x[1]) + '/@' + ll + ',15z?hl=' + hl + '">' + esc(t('infra.' + x[0])) + '</a>';
    }).join('');
  }
  $('#locTabs').addEventListener('click', function (e) { var b = e.target.closest('[data-l]'); if (b) location.hash = 'location/' + b.dataset.l; });
  $('#mapSwitch').addEventListener('click', function (e) { var b = e.target.closest('[data-map]'); if (!b) return; locState.map = b.dataset.map; $$('#mapSwitch button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); showLoc(locState.id); });

  /* ================= IJTIMOIY SAHIFALAR ================= */
  function renderSocial() {
    var c = [];
    if (CFG.INSTAGRAM) c.push(['i-ig', 'Instagram', CFG.INSTAGRAM_HANDLE + ' — ' + t('social.ig'), CFG.INSTAGRAM, t('social.open')]);
    if (CFG.TELEGRAM_CHANNEL) c.push(['i-tg', 'Telegram', t('social.tg'), CFG.TELEGRAM_CHANNEL, t('social.open')]);
    if (CFG.TELEGRAM_MANAGER) c.push(['i-tg', 'Telegram — ' + t('call.manager'), t('social.tgm'), CFG.TELEGRAM_MANAGER, t('social.open')]);
    if (CFG.YOUTUBE) c.push(['i-yt', 'YouTube', t('social.yt'), CFG.YOUTUBE, t('social.open')]);
    if (CFG.FACEBOOK) c.push(['i-fb', 'Facebook', t('social.fb'), CFG.FACEBOOK, t('social.open')]);
    CFG.PHONES.forEach(function (p) { c.push(['i-phone', fmtPhone(p), t('social.phone'), 'tel:' + p, t('social.call')]); });
    $('#socialGrid').innerHTML = c.map(function (x) {
      var ext = x[3].indexOf('http') === 0;
      return '<a class="soc-card" href="' + esc(x[3]) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '><span class="ico">' + icon(x[0]) + '</span><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span><em>' + esc(x[4]) + icon('i-arrow') + '</em></a>';
    }).join('');
    var fl = ROUTES.map(function (r) { var a = $('.menu a[data-route="' + r + '"] span'); return '<li><a href="#' + r + '">' + esc(a.textContent) + '</a></li>'; });
    $('#footLinks').innerHTML = fl.join('');
    $('#footContact').innerHTML = CFG.PHONES.map(function (p) { return '<li><a href="tel:' + p + '">' + fmtPhone(p) + '</a></li>'; }).join('') +
      '<li><a href="' + CFG.TELEGRAM_CHANNEL + '" target="_blank" rel="noopener">Telegram</a></li><li><a href="' + CFG.INSTAGRAM + '" target="_blank" rel="noopener">Instagram ' + esc(CFG.INSTAGRAM_HANDLE) + '</a></li><li>' + esc(t('contact.officeAddr')) + '</li>';
  }

  /* ================= TELEFON MASKASI ================= */
  var OPS = ['20', '33', '50', '55', '61', '62', '65', '66', '67', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '88', '90', '91', '93', '94', '95', '97', '98', '99'];
  function phoneMask(el) {
    el.addEventListener('focus', function () { if (!el.value) el.value = '+998 '; });
    el.addEventListener('blur', function () { if (el.value.replace(/\D/g, '') === '998') el.value = ''; });
    el.addEventListener('input', function () {
      var d = el.value.replace(/\D/g, ''); if (d.indexOf('998') === 0) d = d.slice(3); d = d.slice(0, 9);
      var o = '+998'; if (d.length) o += ' ' + d.slice(0, 2); if (d.length > 2) o += ' ' + d.slice(2, 5); if (d.length > 5) o += ' ' + d.slice(5, 7); if (d.length > 7) o += ' ' + d.slice(7);
      el.value = d.length ? o : '+998 '; el.closest('.field') && el.closest('.field').classList.remove('bad');
    });
  }
  $$('.js-phone').forEach(phoneMask);
  function checkPhone(el, optional) {
    var d = el.value.replace(/\D/g, '').slice(3), f = el.closest('.field'), m = '';
    if (!d) m = optional ? '' : t('phone.empty'); else if (d.length < 9) m = t('phone.short'); else if (OPS.indexOf(d.slice(0, 2)) < 0) m = t('phone.op');
    if (f) { f.classList.toggle('bad', !!m); var er = $('.err', f); if (er) er.textContent = m; }
    return !m;
  }
  function checkName(el) { var ok = /^[\p{L}\s'ʻʼ’.\-]{2,60}$/u.test(el.value.trim()); el.closest('.field').classList.toggle('bad', !ok); return ok; }
  function remember(name, phone) { LS('me', { name: name, phone: phone }); }
  function prefill() { var me = LS('me') || {}; [['#ldName', '#cbName', '#rvName', '#callName'], ['#ldPhone', '#cbPhone', '#callPhone']].forEach(function (g, i) { g.forEach(function (s) { var el = $(s); if (el && !el.value) el.value = (i ? me.phone : me.name) || ''; }); }); }

  /* ================= BAND QILISH MODALI ================= */
  var bookCtx = {}, lastFocus = null;
  function openModal(m) { lastFocus = document.activeElement; m.hidden = false; lock(true); setTimeout(function () { var f = $('input:not(.hp), button', m); f && f.focus(); }, 60); }
  function closeModal(m) { if (m.hidden) return; m.hidden = true; lock(false); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function openBook(ctx) {
    bookCtx = ctx || {};
    var p = byId(bookCtx.project || calc.project), prev;
    if (bookCtx.fromCalc) {
      var plan = calc.plan > -1 ? byId(calc.project).plans[calc.plan] : null;
      prev = '<b>' + esc(I18N.usd(calc.monthly)) + ' ' + esc(t('unit.perMonth')) + '</b><small>' + esc(pick(byId(calc.project).name)) + (plan ? ' · ' + esc(planName(plan)) : ' · ' + calc.area + ' m²') + '<br>' +
        esc(t('calc.prev', { V: I18N.usd(calc.total), P: calc.pct, M: calc.months })) + '</small>';
    } else prev = '<b>' + esc(pick(p.name)) + '</b><small>' + esc(bookCtx.topic || t('book.general')) + '</small>';
    $('#bookPrev').innerHTML = prev;
    $('#bookForm').hidden = false; $('#bookOk').hidden = true;
    prefill(); openModal($('#bookModal'));
  }
  $$('[data-book]').forEach(function (b) { b.addEventListener('click', function () { openBook(current === 'calculator' ? { fromCalc: true } : { project: projState.id }); }); });
  var when = 'asap';
  $('#ldWhen').addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (!b) return; when = b.dataset.v; $$('#ldWhen button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
  /* Server ulanmagan (statik sayt): ariza menejerga avtomatik yetmaydi — mijozga «qabul qilindi» deyilmaydi,
     o'rniga qo'ng'iroq / Telegram / WhatsApp tugmalari beriladi (xabar matni tayyor holda). */
  I18N.extend('uz', { 'book.manualTitle': "Menejer bilan bog'laning", 'book.manualText': "{name}, so'rovingizni yakunlash uchun menejerga qo'ng'iroq qiling yoki yozing — ish vaqtida darhol javob beramiz.", 'book.msg': "Assalomu alaykum! Saytdan so'rov: {unit}. Ismim {name}, telefonim {phone}.", 'book.tg': "Telegram'da yozish", 'book.wa': "WhatsApp'da yozish", 'hi.newsManual': "Rahmat! Yangiliklarni o'tkazib yubormaslik uchun Telegram kanalimizga qo'shiling." });
  I18N.extend('ru', { 'book.manualTitle': "Свяжитесь с менеджером", 'book.manualText': "{name}, чтобы завершить заявку, позвоните или напишите менеджеру — в рабочее время ответим сразу.", 'book.msg': "Здравствуйте! Заявка с сайта: {unit}. Меня зовут {name}, мой телефон {phone}.", 'book.tg': "Написать в Telegram", 'book.wa': "Написать в WhatsApp", 'hi.newsManual': "Спасибо! Чтобы не пропустить новости, подпишитесь на наш Telegram-канал." });
  I18N.extend('en', { 'book.manualTitle': "Contact the manager", 'book.manualText': "{name}, to complete your request, call or message the manager — we reply right away during working hours.", 'book.msg': "Hello! Request from the website: {unit}. My name is {name}, phone {phone}.", 'book.tg': "Message on Telegram", 'book.wa': "Message on WhatsApp", 'hi.newsManual': "Thank you! To stay up to date, join our Telegram channel." });
  I18N.extend('fr', { 'book.manualTitle': "Contactez le conseiller", 'book.manualText': "{name}, pour finaliser votre demande, appelez ou écrivez au conseiller — nous répondons tout de suite pendant les heures d'ouverture.", 'book.msg': "Bonjour ! Demande depuis le site : {unit}. Je m'appelle {name}, téléphone {phone}.", 'book.tg': "Écrire sur Telegram", 'book.wa': "Écrire sur WhatsApp", 'hi.newsManual': "Merci ! Pour ne rien manquer, rejoignez notre chaîne Telegram." });
  I18N.extend('it', { 'book.manualTitle': "Contatta il consulente", 'book.manualText': "{name}, per completare la richiesta chiama o scrivi al consulente: in orario di lavoro rispondiamo subito.", 'book.msg': "Buongiorno! Richiesta dal sito: {unit}. Mi chiamo {name}, telefono {phone}.", 'book.tg': "Scrivi su Telegram", 'book.wa': "Scrivi su WhatsApp", 'hi.newsManual': "Grazie! Per restare aggiornato, unisciti al nostro canale Telegram." });
  I18N.extend('es', { 'book.manualTitle': "Contacte con el asesor", 'book.manualText': "{name}, para completar su solicitud, llame o escriba al asesor: en horario laboral respondemos enseguida.", 'book.msg': "¡Hola! Solicitud desde la web: {unit}. Me llamo {name}, teléfono {phone}.", 'book.tg': "Escribir por Telegram", 'book.wa': "Escribir por WhatsApp", 'hi.newsManual': "¡Gracias! Para no perderse las novedades, únase a nuestro canal de Telegram." });
  I18N.extend('de', { 'book.manualTitle': "Kontaktieren Sie den Berater", 'book.manualText': "{name}, um Ihre Anfrage abzuschließen, rufen Sie den Berater an oder schreiben Sie ihm – während der Geschäftszeiten antworten wir sofort.", 'book.msg': "Guten Tag! Anfrage von der Website: {unit}. Mein Name ist {name}, Telefon {phone}.", 'book.tg': "Auf Telegram schreiben", 'book.wa': "Auf WhatsApp schreiben", 'hi.newsManual': "Danke! Um nichts zu verpassen, abonnieren Sie unseren Telegram-Kanal." });
  I18N.extend('tr', { 'book.manualTitle': "Danışmanla iletişime geçin", 'book.manualText': "{name}, talebinizi tamamlamak için danışmanı arayın veya yazın — mesai saatlerinde hemen yanıt veriyoruz.", 'book.msg': "Merhaba! Siteden talep: {unit}. Adım {name}, telefonum {phone}.", 'book.tg': "Telegram'dan yaz", 'book.wa': "WhatsApp'tan yaz", 'hi.newsManual': "Teşekkürler! Haberleri kaçırmamak için Telegram kanalımıza katılın." });
  function manualActs(lead) {
    var msg = encodeURIComponent(t('book.msg', { unit: lead.unit || '—', name: lead.name, phone: lead.phone })), h = '';
    h += '<a class="btn btn-gold" href="tel:' + esc(CFG.PHONES[0]) + '"><svg class="ic"><use href="#i-phone"/></svg><span>' + esc(t('call.phone')) + '</span></a>';
    var tg = CFG.TELEGRAM_MANAGER || CFG.TG_MANAGER;
    if (tg && /^https:\/\/t\.me\/[A-Za-z0-9_]{4,}\/?$/.test(tg)) h += '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + esc(tg.replace(/\/$/, '')) + '?text=' + msg + '"><svg class="ic"><use href="#i-tg"/></svg><span>' + esc(t('book.tg')) + '</span></a>';
    var wa = String(CFG.WHATSAPP || '').replace(/\D/g, '');
    if (wa.length >= 9) h += '<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://wa.me/' + wa + '?text=' + msg + '"><span>' + esc(t('book.wa')) + '</span></a>';
    return h;
  }
  window.AH_manualActs = manualActs;
  /* mavzu bo'limlari (js/theme.js) uchun: band qilish, qo'ng'iroq va forma yordamchilari */
  /* bosh sahifadagi sotuv kartasi (js/funnel.js) tanlovini kalkulyatorga o'tkazish: band qilish oynasi va «Kalkulyator» sahifasi shu shartlarni ko'rsatadi */
  function calcSet(o) { calc.pct = o.pct; calc.months = o.months; setProject(o.project, o.plan); }
  window.AH_SITE = { book: openBook, call: openCall, toast: toast, phoneMask: phoneMask, checkPhone: checkPhone, checkName: checkName, remember: remember, calcSet: calcSet };

  $('#leadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#ldName'), ph = $('#ldPhone'), ok = checkName(n) & checkPhone(ph);
    if (!ok || $('#hp').value) return;
    var last = LS('lastLead') || 0; if (Date.now() - last < 15000) return;
    var plan = bookCtx.fromCalc && calc.plan > -1 ? byId(calc.project).plans[calc.plan] : null;
    var pid = bookCtx.fromCalc ? calc.project : (bookCtx.project || projState.id), pj = byId(pid);
    var lead = { src: 'site', name: n.value.trim(), phone: ph.value.trim(), slot: WHEN_UZ[when], lang: I18N.lang, project: pid,
      unit: plan ? unitLabel(plan) : pj.name + (bookCtx.fromCalc ? ' · ' + String(calc.area).replace('.', ',') + ' m²' : bookCtx.topic ? ' · ' + bookCtx.topic : ''), area: bookCtx.fromCalc ? calc.area : 0 };
    if (bookCtx.fromCalc) Object.assign(lead, { price: calc.total, pct: calc.pct, down: Math.round(calc.down), months: calc.months, monthly: Math.round(calc.monthly) });
    if (bookCtx.via) lead.via = bookCtx.via;
    remember(lead.name, lead.phone); LS('lastLead', Date.now());
    CRM.deliver(lead).then(function (ok) { if (ok === false) toast(t('toast.offline')); });
    var live = !!CRM.api, h3 = $('#bookOk h3'), act = $('#bookAct');
    h3.setAttribute('data-i', live ? 'book.okTitle' : 'book.manualTitle'); h3.textContent = t(live ? 'book.okTitle' : 'book.manualTitle');
    $('#bookOkText').textContent = t(live ? 'book.okText' : 'book.manualText', { name: lead.name, phone: lead.phone });
    $('#bookOk .tick').hidden = !live;
    act.innerHTML = live ? '' : manualActs(lead); act.hidden = live;
    $('#bookForm').hidden = true; $('#bookOk').hidden = false;
  });

  /* kabinetdagi bazaga o'zbekcha yoziladi (kabinet o'zi tarjima qiladi) */
  var WHEN_UZ = { asap: 'Imkon qadar tez', day: 'Kunduzi', eve: 'Kechqurun' };
  var TOPIC_UZ = { buy: 'Xonadon sotib olish', pay: "To'lov va shartnoma", visit: "Obyektni ko'rish", other: 'Boshqa savol' };

  /* ================= QAYTA QO'NG'IROQ ================= */
  $('#cbForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#cbName'), ph = $('#cbPhone'), ok = checkName(n) & checkPhone(ph); if (!ok) return;
    var lead = { src: 'callback', name: n.value.trim(), phone: ph.value.trim(), unit: TOPIC_UZ[$('#cbTopic').value], slot: "Qayta qo'ng'iroq", lang: I18N.lang, area: 0 };
    remember(lead.name, lead.phone);
    CRM.deliver(lead).then(function (ok) { if (ok === false) toast(t('toast.offline')); });
    var fo = $('.form-ok', this);
    if (CRM.api) { fo.setAttribute('data-i', 'form.ok'); fo.textContent = t('form.ok'); fo.hidden = false; setTimeout(function () { fo.hidden = true; }, 6000); }
    else { fo.removeAttribute('data-i'); fo.innerHTML = esc(t('book.manualText', { name: lead.name })) + '<span class="book-act">' + manualActs(lead) + '</span>'; fo.hidden = false; }
    this.reset(); prefill();
  });

  /* ================= IZOHLAR ================= */
  var revFilter = 'all', stars = 0, vidBlob = null, vidURL = '';
  function visibleReviews() { return Store.list('reviews').filter(function (r) { return !r.hidden; }); }
  function starsHTML(n) { var h = '<span class="stars" aria-label="' + n + '/5">'; for (var i = 1; i <= 5; i++) h += '<svg class="ic ' + (i <= Math.round(n) ? 'on' : 'off') + '"><use href="#i-star"/></svg>'; return h + '</span>'; }
  function ytId(u) { var m = String(u).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/); return m ? m[1] : ''; }
  function summary(list) {
    var n = list.length, avg = n ? list.reduce(function (s, r) { return s + (+r.rating || 0); }, 0) / n : 0;
    return { n: n, avg: avg, dist: [5, 4, 3, 2, 1].map(function (k) { return [k, list.filter(function (r) { return +r.rating === k; }).length]; }) };
  }
  function renderReviews(info) {
    var all = visibleReviews(), s = summary(all);
    $('#revSummary').innerHTML = '<div class="rev-avg"><b>' + (s.n ? s.avg.toFixed(1) : '—') + '</b>' + starsHTML(s.avg) + '<small>' + esc(t('rev.count', { n: s.n })) + '</small></div>' +
      '<div class="rev-bars">' + s.dist.map(function (d) { return '<div><span>' + d[0] + '★</span><i style="--w:' + (s.n ? d[1] / s.n * 100 : 0) + '%"></i><span>' + d[1] + '</span></div>'; }).join('') + '</div>';
    var list = all.filter(function (r) { return revFilter === 'all' || (revFilter === 'video' && (r.video || r.link)) || (revFilter === 'answered' && r.reply && r.reply.text); });
    if (!list.length) { $('#revList').innerHTML = '<div class="rev-empty">' + esc(t(all.length ? 'rev.emptyFilter' : 'rev.empty')) + '</div>'; renderHomeReviews(); return; }
    $('#revList').innerHTML = list.map(function (r) {
      var p = P.filter(function (x) { return x.id === r.project; })[0], vid = '';
      if (r.video) vid = '<div class="rev-video"><video controls playsinline preload="metadata" data-ref="' + esc(r.video) + '"></video></div>';
      else if (r.link) { var y = ytId(r.link); vid = y ? '<div class="rev-video"><iframe src="https://www.youtube-nocookie.com/embed/' + y + '" title="YouTube" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' : '<a class="rev-link" href="' + esc(r.link) + '" target="_blank" rel="noopener nofollow ugc">' + icon('i-play') + esc(t('rev.openVideo')) + '</a>'; }
      var fresh = info && info.id === r.id && info.op === 'update';
      return '<article class="rev" id="rev-' + esc(r.id) + '"><div class="rev-h"><span class="rev-av">' + esc((r.name || '?').trim().charAt(0).toUpperCase()) + '</span><div><b>' + esc(r.name) + '</b><small>' + esc(I18N.ago(r.at)) + (p ? ' · ' + esc(pick(p.name)) : '') + '</small></div>' + starsHTML(+r.rating) + '</div>' +
        '<p>' + esc(r.text) + '</p>' + vid +
        (r.reply && r.reply.text ? '<div class="rev-reply' + (fresh ? ' fresh' : '') + '"><b>' + icon('i-check') + esc(t('rev.reply')) + ' · ' + esc(I18N.ago(r.reply.at)) + '</b><p>' + esc(r.reply.text) + '</p></div>' : '') + '</article>';
    }).join('');
    $$('#revList video[data-ref]').forEach(function (v) { Store.mediaURL(v.dataset.ref).then(function (u) { if (u) v.src = u; else v.closest('.rev-video').remove(); }); });
    renderHomeReviews();
  }
  function renderHomeReviews() {
    var all = visibleReviews(), s = summary(all);
    $('#homeRating').innerHTML = '<b>' + (s.n ? s.avg.toFixed(1) : '—') + '</b><div>' + starsHTML(s.avg) + '<div class="muted" style="font-size:13px">' + esc(t('rev.count', { n: s.n })) + '</div></div>';
    $('#homeReviews').innerHTML = all.length ? all.slice(0, 2).map(function (r) { return '<div>' + starsHTML(+r.rating) + ' «' + esc(r.text.length > 140 ? r.text.slice(0, 140) + '…' : r.text) + '»<small>— ' + esc(r.name) + '</small></div>'; }).join('')
      : '<div class="muted">' + esc(t('rev.empty')) + '</div>';
    /* izoh hali yo'q bo'lsa bosh sahifada bo'sh «0 ta izoh» bloki ko'rsatilmaydi (Izohlar sahifasi ochiq qoladi) */
    var card = $('#homeReviews').closest('.teaser');
    if (card) { card.classList.toggle('home-rev-empty', !all.length); card.parentNode.classList.toggle('one', !all.length); }
  }
  $('#revFilter').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (!b) return; revFilter = b.dataset.f; $$('#revFilter button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); renderReviews(); });
  function paintStars(n) { $$('#rvStars button').forEach(function (b) { b.classList.toggle('on', +b.dataset.v <= n); b.setAttribute('aria-checked', String(+b.dataset.v === n)); }); }
  $('#rvStars').addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (!b) return; stars = +b.dataset.v; paintStars(stars); $('#rvStars').closest('.field').classList.remove('bad'); });
  $('#rvStars').addEventListener('mouseover', function (e) { var b = e.target.closest('[data-v]'); if (b) paintStars(+b.dataset.v); });
  $('#rvStars').addEventListener('mouseleave', function () { paintStars(stars); });
  function rvProjects() { $('#rvProject').innerHTML = P.map(function (p) { return '<option value="' + p.id + '">' + esc(pick(p.name)) + '</option>'; }).join(''); }
  function setVideo(blob) {
    vidBlob = blob; if (vidURL) URL.revokeObjectURL(vidURL); vidURL = blob ? URL.createObjectURL(blob) : '';
    $('#rvPrev').hidden = !blob; var v = $('#rvPrev video'); if (blob) { v.src = vidURL; } else v.removeAttribute('src');
    $('#rvVidErr').textContent = ''; $('#rvVidErr').closest('.field').classList.remove('bad');
  }
  function vidErr(m) { $('#rvVidErr').textContent = m; $('#rvVidErr').closest('.field').classList.add('bad'); }
  $('#rvFile').addEventListener('change', function () { var f = this.files[0]; this.value = ''; if (!f) return; if (f.size > MB * 1048576) return vidErr(t('rev.tooBig', { n: MB })); setVideo(f); });
  $('#rvClear').addEventListener('click', function () { setVideo(null); });
  var rec = null;
  $('#rvRec').addEventListener('click', function () {
    var btn = this, lbl = $('span', btn);
    if (rec) { rec.stop(); return; }
    if (!Media.support().recorder) return vidErr(t('rev.noRec'));
    Media.request({ video: true }).then(function (st) {
      var chunks = [], mime = Media.recorderMime(), started = Date.now();
      rec = new MediaRecorder(st, mime ? { mimeType: mime } : undefined);
      var v = $('#rvPrev video'); $('#rvPrev').hidden = false; v.srcObject = st; v.muted = true; v.play().catch(function () {});
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        Media.stop(st); v.srcObject = null; v.muted = false; rec = null; btn.classList.remove('rec'); lbl.textContent = t('rev.record');
        var b = new Blob(chunks, { type: (mime || 'video/webm').split(';')[0] });
        if (b.size > MB * 1048576) return vidErr(t('rev.tooBig', { n: MB }));
        if (b.size) setVideo(b);
      };
      rec.start(1000); btn.classList.add('rec'); lbl.textContent = t('rev.stop');
      setTimeout(function () { if (rec && Date.now() - started >= 119000) rec.stop(); }, 120000); // eng ko'pi 2 daqiqa
    }).catch(function (e) { vidErr(t(Media.errorKey(e))); });
  });
  $('#revForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this, n = $('#rvName'), txt = $('#rvText'), link = $('#rvLink').value.trim(), ok = checkName(n);
    var okS = stars > 0; $('#rvStars').closest('.field').classList.toggle('bad', !okS);
    var okT = txt.value.trim().length >= 10; txt.closest('.field').classList.toggle('bad', !okT);
    var okL = !link || /^https:\/\/\S+\.\S+/.test(link); if (!okL) vidErr(t('rev.badLink'));
    if (!ok || !okS || !okT || !okL || rec) return;
    var btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = t('rev.uploading');
    (vidBlob ? Store.putBlob(vidBlob) : Promise.resolve('')).then(function (ref) {
      return Store.add('reviews', { name: n.value.trim(), rating: stars, project: $('#rvProject').value, text: txt.value.trim(), video: ref, link: link, hidden: false, reply: null, lang: I18N.lang });
    }).then(function (r) {
      remember(n.value.trim(), (LS('me') || {}).phone || '');
      form.reset(); stars = 0; paintStars(0); setVideo(null); prefill(); rvProjects();
      $('.form-ok', form).hidden = false; setTimeout(function () { $('#revForm .form-ok').hidden = true; }, 5000);
      revFilter = 'all'; $$('#revFilter button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.f === 'all')); });
      renderReviews(); var el = $('#rev-' + r.id); el && el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function () { toast(t('rev.saveErr')); })
      .then(function () { btn.disabled = false; btn.textContent = t('rev.submit'); });
  });
  Store.on('reviews', function (rows, info) { renderReviews(info); });

  /* ================= LIGHTBOX ================= */
  var lb = { items: [], i: 0 };
  function lbShow(i) { lb.i = (i + lb.items.length) % lb.items.length; var it = lb.items[lb.i]; $('#lbImg').src = it.src; var im = $('#lbImg'), wr = im.parentNode; if (!wr.classList.contains('lb-wrap')) { wr = document.createElement('div'); wr.className = 'lb-wrap'; im.before(wr); wr.appendChild(im); } var ov = $('.img-ov', wr); if (ov) ov.remove(); if (it.ov) im.insertAdjacentHTML('afterend', ovHtml(it.ov)); var fit = function () { wr.classList.remove('sized'); wr.style.width = ''; var w = im.getBoundingClientRect().width; if (w) { wr.style.width = w + 'px'; wr.classList.add('sized'); } }; im.onload = fit; if (im.complete) fit(); $('#lbImg').alt = it.cap; $('#lbCap').textContent = it.cap + ' · ' + (lb.i + 1) + '/' + lb.items.length; }
  /* rasm ustidagi yozuv (har bir tilda): h — sarlavha, a — oltin urg'u, t — yorliq, s — kichik matn */
  function ovHtml(o) {
    if (!o) return '';
    var h = pick(o.h), a = pick(o.a), tg = pick(o.t), sm = pick(o.s);
    return '<div class="img-ov">' + (h ? '<b>' + esc(h) + '</b>' : '') + (a ? '<em>' + esc(a) + '</em>' : '') + (tg ? '<i>' + esc(tg) + '</i>' : '') + (sm ? '<small>' + esc(sm) + '</small>' : '') + '</div>';
  }
  function openLightbox(items, i) { lb.items = items; lbShow(i); openModal($('#lightbox')); }
  $('#lightbox').addEventListener('click', function (e) { var d = e.target.closest('[data-dir]'); if (d) return lbShow(lb.i + +d.dataset.dir); if (e.target.closest('[data-close]') || e.target === this) closeModal(this); });
  (function swipe() { var x0 = null; $('#lightbox').addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true }); $('#lightbox').addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) lbShow(lb.i + (dx < 0 ? 1 : -1)); x0 = null; }); })();

  /* Modal yopish (umumiy) */
  $$('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (m.id === 'callModal') return; if (e.target === m || e.target.closest('[data-close]')) closeModal(m); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { ['#lightbox', '#bookModal'].forEach(function (s) { closeModal($(s)); }); }
    if (!$('#lightbox').hidden) { if (e.key === 'ArrowRight') lbShow(lb.i + 1); if (e.key === 'ArrowLeft') lbShow(lb.i - 1); }
  });

  /* ================= VIDEO / OVOZLI QO'NG'IROQ ================= */
  var CM = $('#callModal'), call = null, mode = 'video', testStream = null, stopMeter = null, timerInt = null, room = null;
  function callStatus(key, ok) { var s = $('#callStatus'); s.textContent = t(key); s.classList.toggle('ok', !!ok); }
  function callErr(msg) { var e = $('#callErr'); e.hidden = !msg; e.textContent = msg || ''; }
  function permUI() {
    [['camera', '#permCam'], ['microphone', '#permMic']].forEach(function (x) {
      var el = $(x[1]); el.hidden = x[0] === 'camera' && mode === 'audio';
      Media.permission(x[0]).then(function (st) { el.className = 'perm ' + st; $('em', el).textContent = t('call.perm.' + st); });
    });
  }
  function stopTest() { if (stopMeter) stopMeter(); stopMeter = null; Media.stop(testStream); testStream = null; $('#micLevel').style.width = '0'; var v = $('#callPreview'); v.srcObject = null; $('#callPrePh').hidden = false; }
  function preview(st) {
    var v = $('#callPreview'), hasV = st.getVideoTracks().length;
    v.srcObject = hasV ? st : null; $('#callPrePh').hidden = !!hasV;
    if (stopMeter) stopMeter(); stopMeter = Media.meter(st, function (lv) { $('#micLevel').style.width = (lv * 100) + '%'; });
  }
  function openCall(m) {
    mode = m === 'audio' ? 'audio' : 'video';
    $('#callTitle').textContent = t('call.manager');
    callStatus(mode === 'video' ? 'call.titleVideo' : 'call.titleAudio');
    callErr(''); $('#callIntro').hidden = false; $('#callLive').hidden = true; $('#callTimer').textContent = '00:00';
    $('#callTest').hidden = false; $('#callStart').disabled = false;
    ['#manCode', '#manAnswer', '#manConnect', '#manCopy'].forEach(function (s) { $(s).hidden = true; });
    prefill(); permUI(); openModal(CM);
    var s = Media.support(); if (!s.secure) callErr(t('media.err.insecure')); else if (!s.gum || !s.rtc) callErr(t('media.err.unsupported'));
  }
  function closeCall() { if (call && call.state !== 'ended') endCall(); stopTest(); clearInterval(timerInt); closeModal(CM); }
  $$('[data-call]').forEach(function (b) { b.addEventListener('click', function () { openCall(b.dataset.call); }); });
  $('#callClose').addEventListener('click', closeCall);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !CM.hidden && (!call || call.state === 'ended')) closeCall(); });

  $('#callTest').addEventListener('click', function () {
    callErr(''); stopTest();
    Media.request({ video: mode === 'video' }).then(function (st) {
      testStream = st; preview(st); permUI(); toast(st._videoFallback ? t('call.audioOnly') : t('call.testOk'));
    }).catch(function (e) { callErr(t(Media.errorKey(e))); permUI(); });
  });

  function callerMeta() { return { name: $('#callName').value.trim(), phone: $('#callPhone').value.trim(), lang: I18N.lang, video: mode === 'video' }; }
  function validCaller() {
    var n = $('#callName'), ok = n.value.trim().length >= 2;
    n.closest('.field').classList.toggle('bad', !ok); if (!ok) { callErr(t('call.nameReq')); n.focus(); return false; }
    if ($('#callPhone').value.replace(/\D/g, '').length > 3 && !checkPhone($('#callPhone'), true)) return false;
    remember(n.value.trim(), $('#callPhone').value.trim()); return true;
  }
  function liveView() {
    $('#callIntro').hidden = true; $('#callLive').hidden = false;
    $('#callWait').hidden = false; $('#callWaitText').textContent = t('call.wait');
    $('#ctlCam').hidden = $('#ctlFlip').hidden = mode === 'audio';
    $('#ctlFlip').hidden = mode === 'audio' || !/Android|iPhone|iPad/i.test(navigator.userAgent);
    $('#ctlEnd').querySelector('span').textContent = t('call.end');
  }
  function onState(s) {
    var map = { permission: 'call.st.permission', calling: 'call.st.calling', connecting: 'call.st.connecting', connected: 'call.st.connected', reconnecting: 'call.st.reconnecting', failed: 'call.st.failed', declined: 'call.st.declined', noanswer: 'call.st.noanswer', ended: 'call.st.ended', error: 'call.st.error' };
    if (map[s]) callStatus(map[s], s === 'connected');
    if (s === 'connected') {
      $('#callWait').hidden = true; clearInterval(timerInt);
      var t0 = Date.now(); timerInt = setInterval(function () { var d = Math.floor((Date.now() - t0) / 1000); $('#callTimer').textContent = String(Math.floor(d / 60)).padStart(2, '0') + ':' + String(d % 60).padStart(2, '0'); }, 1000);
      if (room) Store.update('calls', room, { st: 'answered' }).catch(function () {});
    }
    var txt = { declined: 'call.declinedText', noanswer: 'call.noanswerText', failed: 'call.failedText', ended: 'call.endedText' }[s];
    if (txt) {
      clearInterval(timerInt); $('#callWait').hidden = false; $('#callWaitText').textContent = t(txt);
      $('#callRemote').srcObject = null; $('#callLocal').srcObject = null;
      $('#ctlEnd').querySelector('span').textContent = t('common.close');
      if (room && s === 'noanswer') Store.update('calls', room, { st: 'missed' }).catch(function () {});
      if (room && call && call.startedAt) Store.update('calls', room, { dur: Math.round((Date.now() - call.startedAt) / 1000) }).catch(function () {});
    }
  }
  function makeCall(manual) {
    return new Call({
      role: 'client', video: mode === 'video', manual: manual, meta: callerMeta(),
      onState: onState,
      onLocal: function (st) { $('#callLocal').srcObject = st; $('#callLocal').hidden = !st.getVideoTracks().length; if (st._videoFallback) toast(t('call.audioOnly')); },
      onRemote: function (st) { var v = $('#callRemote'); v.srcObject = st; v.play().catch(function () {}); },
      onError: function (key, err) { console.warn('ART HOUSE call:', err && (err.name + ': ' + err.message)); $('#callIntro').hidden = false; $('#callLive').hidden = true; callErr(t(key)); permUI(); }
    });
  }
  $('#callStart').addEventListener('click', function () {
    callErr(''); if (!validCaller()) return;
    stopTest(); call = makeCall(false); room = call.room;
    var meta = callerMeta();
    Store.add('calls', { id: room, name: meta.name, phone: meta.phone, video: mode === 'video', st: 'ringing', lang: I18N.lang }).catch(function () {});
    liveView();
    call.start().catch(function () {});
  });
  function endCall() { if (call && call.state !== 'ended') call.hangup(); }
  $('#ctlEnd').addEventListener('click', function () { if (call && call.state !== 'ended') endCall(); else closeCall(); });
  $('#ctlMic').addEventListener('click', function () { if (!call) return; var on = call.toggleMic(); this.setAttribute('aria-pressed', String(!on)); $('use', this).setAttribute('href', on ? '#i-mic' : '#i-mic-off'); });
  $('#ctlCam').addEventListener('click', function () { if (!call) return; var on = call.toggleCam(); this.setAttribute('aria-pressed', String(!on)); $('use', this).setAttribute('href', on ? '#i-video' : '#i-cam-off'); });
  $('#ctlFlip').addEventListener('click', function () { if (call) call.flip().catch(function (e) { toast(t(Media.errorKey(e))); }); });

  /* Qo'lda (kod orqali) ulanish */
  $('#manOffer').addEventListener('click', function () {
    callErr(''); if (!validCaller()) return; stopTest();
    call = makeCall(true); room = null;
    call.start().then(function (code) {
      $('#manCode').value = code; $('#manCode').hidden = false; $('#manCopy').hidden = false; $('#manAnswer').hidden = false; $('#manConnect').hidden = false;
      if ($('#callLocal').srcObject) { var st = $('#callLocal').srcObject; preview(st); }
    }).catch(function () {});
  });
  $('#manCopy').addEventListener('click', function () {
    var v = $('#manCode').value;
    (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(function () { toast(t('call.copied')); }, function () { $('#manCode').select(); document.execCommand('copy'); toast(t('call.copied')); });
  });
  $('#manConnect').addEventListener('click', function () {
    if (!call) return;
    try { call.finishManual($('#manAnswer').value).then(function () { if (stopMeter) stopMeter(); $('#callPreview').srcObject = null; liveView(); }).catch(function () { callErr(t('call.badCode')); }); }
    catch (e) { callErr(t('call.badCode')); }
  });

  /* ================= TIL ALMASHGANDA ================= */
  function renderAll() {
    marquee(); renderHome(); calcOptions(); renderCalc(); renderSocial(); rvProjects(); renderReviews();
    if (current === 'projects') showProject(projState.id);
    if (current === 'location') showLoc(locState.id);
    var sb = $('#cSchedBtn'); sb.textContent = t($('#cSched').hidden ? 'calc.showSched' : 'calc.hideSched');
    if (current) document.title = (current === 'home' ? '' : $('.menu a[data-route="' + current + '"] span').textContent + ' — ') + 'ART HOUSE — Luxury Residence';
    reveal();
  }
  I18N.on(renderAll);
  Store.on('settings', function () { var p = byId(calc.project); if (p.priceM2) calc.price = p.priceM2; calcOptions(); fromParts(); renderHome(); });

  /* ================= ISHGA TUSHIRISH ================= */
  Store.load('reviews').then(function () { renderReviews(); });
  setProject('musaffo', 0);
  renderAll();
  route();
  setInterval(function () { if (current === 'reviews') renderReviews(); }, 60000); // "5 daqiqa oldin" kabi vaqtlarni yangilash
})();
