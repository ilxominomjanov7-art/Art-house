/* =====================================================================
   ART HOUSE — KABINET (DASHBOARD) MANTIQI
   ===================================================================== */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = I18N.t, pick = I18N.pick;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var icon = function (id) { return '<svg class="ic"><use href="#' + id + '"/></svg>'; };
  var P = window.PROJECTS, pName = function (id) { var p = P.filter(function (x) { return x.id === id; })[0]; return p ? pick(p.name) : (id || '—'); };
  var ROLE = null, USER = '', VIEW = 'overview', state = { q: '', lst: 'all', rf: 'pending', openReply: null };

  function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 3600); }
  function starsHTML(n) { var h = '<span class="stars">'; for (var i = 1; i <= 5; i++) h += '<svg class="ic ' + (i <= Math.round(n) ? 'on' : 'off') + '"><use href="#i-star"/></svg>'; return h + '</span>'; }
  function fdt(ts) { return I18N.date(ts, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  var owner = function () { return ROLE === 'owner'; };

  I18N.apply();
  I18N.mountSwitcher($('#langAuth'));
  I18N.mountSwitcher($('#langCab'));

  /* ---------------- lyuks splash ---------------- */
  (function () {
    var logo = $('.lux-logo');
    for (var i = 0; i < 18; i++) { var s = document.createElement('i'); s.className = 'spark'; s.style.cssText = 'left:' + (8 + Math.random() * 84) + '%;top:' + (15 + Math.random() * 70) + '%;animation-delay:' + (0.8 + Math.random() * 2.2) + 's'; logo.appendChild(s); }
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, sp = $('#splash');
    function done() { if (sp.classList.contains('done')) return; sp.classList.add('done'); setTimeout(function () { sp.remove(); }, 900); boot(); }
    sp.addEventListener('click', done);
    setTimeout(done, reduce ? 0 : 3200);
  })();

  function boot() {
    var s = Store.session();
    if (s && (Store.api || (s.token.indexOf('local:') === 0 && CFG.ADMINS[s.token.slice(6)]))) { ROLE = s.role; USER = Store.api ? '' : s.token.slice(6); enter(); }
    else showAuth();
  }
  function showAuth() { $('#shell').hidden = true; $('#auth').hidden = false; document.body.classList.add('lock'); setTimeout(function () { $('#lgUser').focus(); }, 100); }

  /* ---------------- kirish ---------------- */
  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var u = $('#lgUser').value, p = $('#lgPass').value, err = $('#lgErr'), card = $('.auth-card'), btn = $('button[type=submit]', this);
    err.hidden = true; btn.disabled = true;
    Store.login(u, p).then(function (role) { ROLE = role; USER = u.trim().toLowerCase(); $('#lgPass').value = ''; enter(); })
      .catch(function (x) {
        err.textContent = t(x && x.message === 'insecure' ? 'k.insecure' : x && /HTTP|fetch|Failed/i.test(x.message) && !/401|403/.test(x.message) ? 'k.netErr' : 'k.badAuth');
        err.hidden = false; card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      }).then(function () { btn.disabled = false; });
  });

  function enter() {
    $('#auth').hidden = true; $('#shell').hidden = false; document.body.classList.remove('lock');
    Promise.all(['leads', 'reviews', 'calls'].map(Store.load)).then(function () { renderShell(); go(location.hash.slice(1) || 'overview'); });
    idle(); ringArm();
  }
  function logout(msg) { Store.logout(); ROLE = null; location.hash = ''; showAuth(); if (msg) toast(msg); }
  $('#logoutBtn').addEventListener('click', function () { logout(); });
  var it; function idle() { clearTimeout(it); it = setTimeout(function () { if (ROLE) logout(t('k.idle')); }, 30 * 60000); }
  ['click', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, function () { if (ROLE) idle(); }, { passive: true }); });

  /* ---------------- menyu ---------------- */
  var NAV = [
    ['k.group.main', [['overview', 'i-grid', 'k.nav.overview']]],
    ['k.group.clients', [['leads', 'i-inbox', 'k.nav.leads'], ['reviews', 'i-star', 'k.nav.reviews'], ['calls', 'i-phone', 'k.nav.calls']]],
    ['k.group.system', [['settings', 'i-cog', 'k.nav.settings']]]
  ];
  function badge(v) {
    if (v === 'leads') return Store.list('leads').filter(function (l) { return l.st === 'new'; }).length;
    if (v === 'reviews') return Store.list('reviews').filter(function (r) { return !r.hidden && !(r.reply && r.reply.text); }).length;
    if (v === 'calls') return Store.list('calls').filter(function (c) { return c.st === 'missed' || c.st === 'ringing'; }).length;
    return 0;
  }
  function renderShell() {
    $('#sideNav').innerHTML = NAV.map(function (g) {
      return '<div class="grp">' + esc(t(g[0])) + '</div>' + g[1].map(function (x) { var n = badge(x[0]); return '<button type="button" data-v="' + x[0] + '" class="' + (VIEW === x[0] ? 'on' : '') + '">' + icon(x[1]) + '<span>' + esc(t(x[2])) + '</span>' + (n ? '<em>' + (n > 99 ? '99+' : n) + '</em>' : '') + '</button>'; }).join('');
    }).join('');
    var nm = owner() ? t('k.owner') : (USER || t('k.manager'));
    $('#me').innerHTML = '<i>' + esc(nm.charAt(0).toUpperCase()) + '</i><div style="min-width:0"><b>' + esc(nm) + '</b><small>' + esc(owner() ? t('k.owner') : t('k.manager')) + (USER ? ' · ' + esc(USER) : '') + '</small></div>';
    var m = $('#mode'); m.textContent = t(Store.api ? 'k.modeServer' : 'k.modeLocal'); m.classList.toggle('srv', Store.api);
    $('#liveDot').title = m.textContent;
  }
  $('#sideNav').addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) { location.hash = b.dataset.v; closeSide(); } });
  window.addEventListener('hashchange', function () { if (ROLE) go(location.hash.slice(1)); });
  $('#menuBtn').addEventListener('click', function () { $('#side').classList.add('open'); });
  function closeSide() { $('#side').classList.remove('open'); }
  $('#sideOv').addEventListener('click', closeSide);

  function go(v) {
    if (['overview', 'leads', 'reviews', 'calls', 'settings'].indexOf(v) < 0) v = 'overview';
    VIEW = v; renderShell();
    $('#viewTitle').textContent = t('k.nav.' + v);
    document.title = t('k.nav.' + v) + ' — ART HOUSE';
    ({ overview: vOverview, leads: vLeads, reviews: vReviews, calls: vCalls, settings: vSettings })[v]();
  }
  function rerender() { if (ROLE) go(VIEW); }

  /* ================= UMUMIY KO'RINISH ================= */
  function vOverview() {
    var L = Store.list('leads'), R = Store.list('reviews'), C = Store.list('calls');
    var vis = R.filter(function (r) { return !r.hidden; }), avg = vis.length ? vis.reduce(function (s, r) { return s + +r.rating; }, 0) / vis.length : 0;
    var pend = R.filter(function (r) { return !r.hidden && !(r.reply && r.reply.text); });
    var days = [], now = new Date(); now.setHours(0, 0, 0, 0);
    for (var i = 13; i >= 0; i--) { var d0 = now.getTime() - i * 864e5; days.push([d0, L.filter(function (l) { return l.at >= d0 && l.at < d0 + 864e5; }).length]); }
    var mx = Math.max.apply(null, days.map(function (d) { return d[1]; }).concat([1]));
    var h = '<div class="kpis">' +
      kpi('i-inbox', 'k.st.leads', L.length, t('k.today') + ': ' + days[13][1]) +
      kpi('i-bell', 'k.st.newLeads', L.filter(function (l) { return l.st === 'new'; }).length) +
      kpi('i-star', 'k.st.avg', vis.length ? avg.toFixed(1) : '—', t('rev.count', { n: vis.length })) +
      kpi('i-reply', 'k.st.pending', pend.length) +
      kpi('i-phone', 'k.st.calls', C.length) + '</div>';
    h += '<div class="card"><div class="card-h"><h3>' + esc(t('k.st.leads')) + ' · 14</h3></div><div class="chart">' + days.map(function (d) { return '<div title="' + d[1] + '"><i style="height:' + (d[1] / mx * 100) + '%"></i><small>' + esc(I18N.date(d[0], { day: 'numeric', month: 'numeric' })) + '</small></div>'; }).join('') + '</div></div>';
    h += '<div class="cols"><div class="card"><div class="card-h"><h3>' + esc(t('k.recentLeads')) + '</h3><a class="link" href="#leads">' + esc(t('k.viewAll')) + '</a></div>' +
      (L.length ? '<div class="tbl-wrap"><table style="min-width:0"><tbody>' + L.slice(0, 6).map(function (l) { return '<tr' + (l.st === 'new' ? ' class="new"' : '') + '><td><b>' + esc(l.name) + '</b><small>' + esc(fdt(l.at)) + '</small></td><td><a href="tel:' + esc(l.phone.replace(/\s/g, '')) + '">' + esc(l.phone) + '</a><small>' + esc(pName(l.project)) + '</small></td><td><span class="pill ' + (l.st === 'new' ? 'gold' : '') + '">' + esc(t('k.lead.' + l.st)) + '</span></td></tr>'; }).join('') + '</tbody></table></div>' : '<div class="empty">' + esc(t('k.empty.leads')) + '</div>') +
      '</div><div class="card"><div class="card-h"><h3>' + esc(t('k.recentReviews')) + '</h3><a class="link" href="#reviews">' + esc(t('k.viewAll')) + '</a></div>' +
      (pend.length ? '<div class="k-revs">' + pend.slice(0, 4).map(function (r) { return '<div><div class="k-rev-h"><b>' + esc(r.name) + '</b>' + starsHTML(+r.rating) + '</div><p class="muted" style="margin:4px 0 0;font-size:14px">' + esc(r.text.slice(0, 160)) + '</p></div>'; }).join('') + '</div>' : '<div class="empty">' + esc(t(R.length ? 'k.empty.pending' : 'k.empty.reviews')) + '</div>') + '</div></div>';
    $('#view').innerHTML = h;
  }
  function kpi(ic, key, v, sub) { return '<div class="card kpi"><span>' + icon(ic) + esc(t(key)) + '</span><b>' + esc(v) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>'; }

  /* ================= ARIZALAR ================= */
  var STS = ['new', 'called', 'booked', 'sold', 'lost'];
  function vLeads() {
    var L = Store.list('leads'), q = state.q.toLowerCase();
    var rows = L.filter(function (l) { return (state.lst === 'all' || l.st === state.lst) && (!q || (l.name + ' ' + l.phone + ' ' + pName(l.project) + ' ' + (l.plan || '')).toLowerCase().indexOf(q) > -1); });
    var h = '<div class="toolbar"><input type="search" id="lq" placeholder="' + esc(t('k.search')) + '" value="' + esc(state.q) + '"><div class="seg" id="lst">' +
      ['all'].concat(STS).map(function (s) { var n = s === 'all' ? L.length : L.filter(function (l) { return l.st === s; }).length; return '<button type="button" data-s="' + s + '" aria-pressed="' + (state.lst === s) + '">' + esc(s === 'all' ? t('k.all') : t('k.lead.' + s)) + '<em>' + n + '</em></button>'; }).join('') +
      '</div><button class="btn btn-ghost sm" type="button" id="csv">' + icon('i-down') + esc(t('k.export')) + '</button></div>';
    if (!rows.length) h += '<div class="empty">' + esc(t('k.empty.leads')) + '</div>';
    else h += '<div class="tbl-wrap"><table><thead><tr><th>' + [t('k.col.date'), t('k.col.client'), t('k.col.object'), t('k.col.payment'), t('k.col.status'), ''].map(esc).join('</th><th>') + '</th></tr></thead><tbody>' + rows.map(function (l) {
      var pay = l.monthly ? '<b>' + esc(I18N.usd(l.price)) + '</b><small>' + esc(t('k.lead.monthly', { m: I18N.usd(l.monthly), M: l.months })) + ' · ' + l.pct + '%</small>' : '<small>' + esc(l.topic || '—') + '</small>';
      return '<tr' + (l.st === 'new' ? ' class="new"' : '') + '><td><b>' + esc(fdt(l.at)) + '</b><small>' + esc(t('k.lead.src.' + (l.src || 'book'))) + (l.when ? ' · ' + esc(t('book.when.' + l.when)) : '') + '</small></td>' +
        '<td><b>' + esc(l.name) + '</b><a href="tel:' + esc(String(l.phone).replace(/\s/g, '')) + '">' + esc(l.phone) + '</a></td>' +
        '<td><b>' + esc(pName(l.project)) + '</b><small>' + esc(l.plan || (l.area ? l.area + ' m²' : '')) + '</small></td><td>' + pay + '</td>' +
        '<td><select data-st="' + esc(l.id) + '">' + STS.map(function (s) { return '<option value="' + s + '"' + (s === l.st ? ' selected' : '') + '>' + esc(t('k.lead.' + s)) + '</option>'; }).join('') + '</select></td>' +
        '<td>' + (owner() ? '<button class="mini-btn" type="button" data-del="' + esc(l.id) + '" aria-label="' + esc(t('k.delete')) + '">' + icon('i-trash') + '</button>' : '') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    $('#view').innerHTML = h;
    var lq = $('#lq'); lq.addEventListener('input', function () { state.q = lq.value; var pos = lq.selectionStart; vLeads(); var n = $('#lq'); n.focus(); n.setSelectionRange(pos, pos); });
  }
  $('#view').addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('#lst [data-s]'))) { state.lst = b.dataset.s; vLeads(); }
    else if ((b = e.target.closest('[data-del]')) && confirm(t('k.confirmDelete'))) { Store.remove('leads', b.dataset.del).then(rerender); }
    else if (e.target.closest('#csv')) csv();
  });
  $('#view').addEventListener('change', function (e) { var s = e.target.closest('[data-st]'); if (s) Store.update('leads', s.dataset.st, { st: s.value }).then(function () { renderShell(); }); });
  function csv() {
    var cols = ['at', 'src', 'name', 'phone', 'project', 'plan', 'area', 'price', 'pct', 'down', 'months', 'monthly', 'topic', 'when', 'st'];
    var lines = [cols.join(';')].concat(Store.list('leads').map(function (l) { return cols.map(function (c) { var v = c === 'at' ? new Date(l.at).toISOString() : c === 'project' ? pName(l.project) : (l[c] == null ? '' : l[c]); return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';'); }));
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
    a.download = 'arthouse-arizalar-' + new Date().toISOString().slice(0, 10) + '.csv'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ================= MIJOZLAR IZOHLARI ================= */
  function ytId(u) { var m = String(u).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/); return m ? m[1] : ''; }
  function vReviews() {
    var R = Store.list('reviews'), F = {
      pending: function (r) { return !r.hidden && !(r.reply && r.reply.text); }, answered: function (r) { return r.reply && r.reply.text; },
      video: function (r) { return r.video || r.link; }, hidden: function (r) { return r.hidden; }, all: function () { return true; }
    };
    var rows = R.filter(F[state.rf]);
    var h = '<div class="toolbar"><div class="seg" id="rf">' + ['pending', 'answered', 'video', 'hidden', 'all'].map(function (k) {
      return '<button type="button" data-f="' + k + '" aria-pressed="' + (state.rf === k) + '">' + esc(k === 'all' ? t('k.all') : t('k.rev.filter.' + k)) + '<em>' + R.filter(F[k]).length + '</em></button>';
    }).join('') + '</div></div>';
    if (!rows.length) h += '<div class="empty">' + esc(t(state.rf === 'pending' && R.length ? 'k.empty.pending' : 'k.empty.reviews')) + '</div>';
    else h += '<div class="k-revs">' + rows.map(function (r) {
      var y = r.link && ytId(r.link), vid = r.video ? '<video controls playsinline preload="metadata" data-ref="' + esc(r.video) + '"></video>' : y ? '<iframe src="https://www.youtube-nocookie.com/embed/' + y + '" title="YouTube" loading="lazy" allowfullscreen></iframe>' : r.link ? '<p><a class="link" style="color:var(--gold)" href="' + esc(r.link) + '" target="_blank" rel="noopener nofollow">' + icon('i-play') + ' ' + esc(r.link) + '</a></p>' : '';
      var has = r.reply && r.reply.text, open = state.openReply === r.id;
      return '<article class="card k-rev' + (r.hidden ? ' hidden-rev' : '') + '"><div class="k-rev-h"><span class="av">' + esc(r.name.charAt(0).toUpperCase()) + '</span><div><b>' + esc(r.name) + (r.hidden ? ' <span class="pill bad">' + esc(t('k.rev.hiddenBadge')) + '</span>' : '') + '</b><small>' + esc(fdt(r.at)) + ' · ' + esc(pName(r.project)) + (r.lang ? ' · ' + esc(String(r.lang).toUpperCase()) : '') + '</small></div>' + starsHTML(+r.rating) + '</div>' +
        '<p>' + esc(r.text) + '</p>' + vid +
        (has && !open ? '<div class="k-reply"><b>' + esc(t('rev.reply')) + ' · ' + esc(fdt(r.reply.at)) + (r.reply.by ? ' · ' + esc(r.reply.by) : '') + '</b><p>' + esc(r.reply.text) + '</p></div>' : '') +
        (open ? '<div class="reply-box"><div class="tpls"><small class="muted" style="width:100%">' + esc(t('k.rev.templates')) + ':</small>' + [1, 2, 3].map(function (i) { return '<button class="chip" type="button" data-tpl="' + i + '">' + esc(t('k.tpl.' + i)) + '</button>'; }).join('') + '</div>' +
          '<textarea id="rp-' + esc(r.id) + '" rows="3" maxlength="1200" placeholder="' + esc(t('k.rev.replyPh')) + '">' + esc(has ? r.reply.text : '') + '</textarea>' +
          '<div class="k-rev-act"><button class="btn btn-gold sm" type="button" data-send="' + esc(r.id) + '">' + icon('i-check') + esc(t('k.rev.send')) + '</button><button class="btn btn-ghost sm" type="button" data-cancel>' + esc(t('common.close')) + '</button></div></div>'
          : '<div class="k-rev-act"><button class="btn btn-gold sm" type="button" data-reply="' + esc(r.id) + '">' + icon('i-reply') + esc(t(has ? 'k.rev.editReply' : 'k.rev.reply')) + '</button>' +
          '<button class="btn btn-ghost sm" type="button" data-vis="' + esc(r.id) + '">' + icon(r.hidden ? 'i-eye' : 'i-eye-off') + esc(t(r.hidden ? 'k.rev.show' : 'k.rev.hide')) + '</button>' +
          (has ? '<button class="btn btn-ghost sm" type="button" data-unreply="' + esc(r.id) + '">' + esc(t('k.rev.removeReply')) + '</button>' : '') +
          (owner() ? '<button class="btn btn-ghost sm" type="button" data-rdel="' + esc(r.id) + '">' + icon('i-trash') + esc(t('k.delete')) + '</button>' : '') + '</div>') +
        '</article>';
    }).join('') + '</div>';
    $('#view').innerHTML = h;
    $$('#view video[data-ref]').forEach(function (v) { Store.mediaURL(v.dataset.ref).then(function (u) { if (u) v.src = u; else v.remove(); }); });
    if (state.openReply) { var ta = $('#rp-' + CSS.escape(state.openReply)); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }
  }
  $('#view').addEventListener('click', function (e) {
    if (VIEW !== 'reviews') return;
    var b;
    if ((b = e.target.closest('#rf [data-f]'))) { state.rf = b.dataset.f; state.openReply = null; vReviews(); }
    else if ((b = e.target.closest('[data-reply]'))) { state.openReply = b.dataset.reply; vReviews(); }
    else if (e.target.closest('[data-cancel]')) { state.openReply = null; vReviews(); }
    else if ((b = e.target.closest('[data-tpl]'))) { var ta = $('#rp-' + CSS.escape(state.openReply)); if (ta) { ta.value = t('k.tpl.' + b.dataset.tpl); ta.focus(); } }
    else if ((b = e.target.closest('[data-send]'))) {
      var id = b.dataset.send, txt = $('#rp-' + CSS.escape(id)).value.trim(); if (!txt) return;
      b.disabled = true;
      Store.update('reviews', id, { reply: { text: txt, at: Date.now(), by: owner() ? t('k.owner') : (USER || t('k.manager')) } })
        .then(function () { state.openReply = null; toast(t('k.rev.sent')); rerender(); }).catch(function () { b.disabled = false; toast(t('toast.err')); });
    }
    else if ((b = e.target.closest('[data-vis]'))) { var r = Store.list('reviews').filter(function (x) { return x.id === b.dataset.vis; })[0]; if (r) Store.update('reviews', r.id, { hidden: !r.hidden }).then(rerender); }
    else if ((b = e.target.closest('[data-unreply]'))) { Store.update('reviews', b.dataset.unreply, { reply: null }).then(rerender); }
    else if ((b = e.target.closest('[data-rdel]')) && confirm(t('k.confirmDelete'))) {
      var rv = Store.list('reviews').filter(function (x) { return x.id === b.dataset.rdel; })[0];
      Store.remove('reviews', b.dataset.rdel).then(function () { if (rv) Store.dropBlob(rv.video); rerender(); });
    }
  });

  /* ================= QO'NG'IROQLAR ================= */
  var incoming = {}, ringRoom = null, active = null, timerInt = null, ringCtx = null, ringOsc = null;
  function vCalls() {
    var C = Store.list('calls'), sup = Media.support();
    var h = '<div class="cols"><div class="card"><div class="card-h"><h3>' + esc(t('k.calls.ready')) + '</h3><span class="pill ' + (sup.secure && sup.rtc ? 'ok' : 'bad') + '">' + (sup.secure && sup.rtc ? 'WebRTC ✓' : esc(t('media.err.unsupported'))) + '</span></div>' +
      '<p class="muted" style="margin:0 0 14px">' + esc(Store.api ? t('k.modeServer') : t('k.modeLocal')) + '</p>' +
      '<div class="k-rev-act"><button class="btn btn-ghost sm" type="button" id="permTest">' + icon('i-video') + esc(t('k.calls.permTest')) + '</button><button class="btn btn-ghost sm" type="button" id="sndOn">' + icon('i-bell') + esc(t('k.calls.enableSound')) + '</button></div>' +
      '<video id="permPrev" playsinline muted autoplay style="display:none;margin-top:14px;width:100%;max-width:320px;border-radius:12px;transform:scaleX(-1)"></video><p class="hint" id="permMsg"></p></div>' +
      '<div class="card"><div class="card-h"><h3>' + esc(t('k.calls.manual')) + '</h3></div><p class="hint" style="margin:0 0 10px">' + esc(t('k.calls.manualHint')) + '</p>' +
      '<textarea id="offerCode" rows="3" placeholder="' + esc(t('k.calls.offerPh')) + '" style="font:12px/1.4 ui-monospace,Menlo,monospace"></textarea><div class="k-rev-act"><button class="btn btn-gold sm" type="button" id="mkAnswer">' + esc(t('k.calls.makeAnswer')) + '</button></div></div></div>';
    if (!C.length) h += '<div class="empty">' + esc(t('k.empty.calls')) + '</div>';
    else h += '<div class="tbl-wrap"><table><thead><tr><th>' + [t('k.col.date'), t('k.col.client'), t('k.col.object'), t('k.col.status'), t('k.calls.duration'), ''].map(esc).join('</th><th>') + '</th></tr></thead><tbody>' + C.map(function (c) {
      var cls = c.st === 'answered' ? 'ok' : c.st === 'missed' || c.st === 'declined' ? 'bad' : 'gold';
      var dur = c.dur ? Math.floor(c.dur / 60) + ':' + String(c.dur % 60).padStart(2, '0') : '—';
      return '<tr><td><b>' + esc(fdt(c.at)) + '</b></td><td><b>' + esc(c.name || '—') + '</b>' + (c.phone ? '<a href="tel:' + esc(c.phone.replace(/\s/g, '')) + '">' + esc(c.phone) + '</a>' : '') + '</td>' +
        '<td>' + esc(t(c.video ? 'k.calls.video' : 'k.calls.audio')) + '</td><td><span class="pill ' + cls + '">' + esc(t('k.calls.st.' + (c.st || 'missed'))) + '</span></td><td>' + dur + '</td>' +
        '<td>' + (c.phone && c.st !== 'answered' ? '<a class="btn btn-ghost sm" href="tel:' + esc(c.phone.replace(/\s/g, '')) + '">' + icon('i-phone') + esc(t('k.calls.callback')) + '</a> ' : '') + (owner() ? '<button class="mini-btn" type="button" data-cdel="' + esc(c.id) + '">' + icon('i-trash') + '</button>' : '') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    $('#view').innerHTML = h;
  }
  $('#view').addEventListener('click', function (e) {
    if (VIEW !== 'calls') return;
    var b;
    if (e.target.closest('#permTest')) {
      Media.request({ video: true }).then(function (st) { var v = $('#permPrev'); v.style.display = 'block'; v.srcObject = st; $('#permMsg').textContent = t('call.testOk'); setTimeout(function () { Media.stop(st); v.style.display = 'none'; }, 6000); })
        .catch(function (x) { $('#permMsg').textContent = t(Media.errorKey(x)); });
    } else if (e.target.closest('#sndOn')) { ringArm(true); beep(); }
    else if (e.target.closest('#mkAnswer')) {
      var code = $('#offerCode').value.trim(); if (!code) return;
      var offer; try { offer = Call.decode(code); } catch (x) { return toast(t('call.badCode')); }
      startManager({ room: Store.uid(), manual: true, video: true, name: '—' }, offer);
    } else if ((b = e.target.closest('[data-cdel]'))) { Store.remove('calls', b.dataset.cdel).then(rerender); }
  });

  /* Jiringlash ovozi (WebAudio — fayl shart emas) */
  function ringArm(force) { if (ringCtx && !force) return; var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; try { ringCtx = ringCtx || new AC(); if (ringCtx.state === 'suspended') ringCtx.resume(); } catch (e) {} }
  function beep() {
    if (!ringCtx) return; var o = ringCtx.createOscillator(), g = ringCtx.createGain(); o.type = 'sine'; o.frequency.value = 880; o.connect(g); g.connect(ringCtx.destination);
    var n = ringCtx.currentTime; g.gain.setValueAtTime(0, n); g.gain.linearRampToValueAtTime(.18, n + .03); g.gain.setValueAtTime(.18, n + .35); g.gain.linearRampToValueAtTime(0, n + .4);
    g.gain.linearRampToValueAtTime(.18, n + .55); g.gain.setValueAtTime(.18, n + .9); g.gain.linearRampToValueAtTime(0, n + .95); o.start(n); o.stop(n + 1);
  }
  function ringStart() { ringStop(); beep(); ringOsc = setInterval(beep, 2400); if (navigator.vibrate) navigator.vibrate([300, 200, 300]); }
  function ringStop() { clearInterval(ringOsc); ringOsc = null; }

  Store.onSignal(function (m) {
    if (!ROLE || !m || !m.room) return;
    if (m.role === 'client' && m.type === 'offer') {
      incoming[m.room] = { offer: m.data, ice: [] };
      if (!active) showRing(m.room);
    } else if (m.role === 'client' && m.type === 'ice') {
      if (incoming[m.room]) incoming[m.room].ice.push(m.data);
    } else if (m.role === 'client' && m.type === 'cancel') {
      delete incoming[m.room]; if (ringRoom === m.room) hideRing();
      Store.update('calls', m.room, { st: 'missed' }).catch(function () {});
    } else if (m.role === 'manager' && (m.type === 'answer' || m.type === 'decline')) {
      delete incoming[m.room]; if (ringRoom === m.room) hideRing(); // boshqa oynada qabul qilindi
    }
  });
  function showRing(room) {
    var inc = incoming[room]; if (!inc) return; ringRoom = room;
    var meta = inc.offer.meta || {};
    $('#ringName').textContent = meta.name || '—';
    $('#ringMeta').textContent = t(inc.offer.video ? 'k.calls.video' : 'k.calls.audio') + (meta.phone ? ' · ' + meta.phone : '');
    $('#ring').hidden = false; ringStart();
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') { try { new Notification(t('k.calls.incoming'), { body: meta.name || '' }); } catch (e) {} }
  }
  function hideRing() { $('#ring').hidden = true; ringStop(); ringRoom = null; var next = Object.keys(incoming)[0]; if (next && !active) showRing(next); }
  $('#ringNo').addEventListener('click', function () {
    var room = ringRoom; if (!room) return;
    Store.signal({ room: room, type: 'decline', role: 'manager' });
    Store.update('calls', room, { st: 'declined' }).catch(function () {});
    delete incoming[room]; hideRing();
  });
  $('#ringYes').addEventListener('click', function () {
    var room = ringRoom, inc = incoming[room]; if (!inc) return;
    delete incoming[room]; hideRing();
    var meta = inc.offer.meta || {};
    startManager({ room: room, video: !!inc.offer.video, name: meta.name, phone: meta.phone, ice: inc.ice }, inc.offer.sdp);
  });

  function startManager(o, offerSdp) {
    var K = $('#kCall'), init = (o.name || '?').trim().charAt(0).toUpperCase();
    $('#kCallName').textContent = o.name || '—'; $('#kCallAv').textContent = init; $('#kWaitAv').textContent = init;
    $('#kWait').hidden = false; $('#kWaitText').textContent = t('call.st.connecting'); $('#kCallTimer').textContent = '00:00';
    $('#kManualOut').hidden = true; $('#kEnd span').textContent = t('call.end');
    $('#kCam').hidden = !o.video;
    K.hidden = false; document.body.classList.add('lock');
    active = new Call({
      role: 'manager', room: o.room, video: o.video, manual: !!o.manual,
      onState: function (s) {
        var key = 'call.st.' + s; $('#kCallStatus').textContent = t(key); $('#kCallStatus').classList.toggle('ok', s === 'connected');
        if (s === 'connected') {
          $('#kWait').hidden = true; $('#kManualOut').hidden = true; var t0 = Date.now(); clearInterval(timerInt);
          timerInt = setInterval(function () { var d = Math.floor((Date.now() - t0) / 1000); $('#kCallTimer').textContent = String(Math.floor(d / 60)).padStart(2, '0') + ':' + String(d % 60).padStart(2, '0'); }, 1000);
          if (!o.manual) Store.update('calls', o.room, { st: 'answered' }).catch(function () {});
        }
        if (s === 'ended' || s === 'failed' || s === 'error') {
          clearInterval(timerInt); $('#kWait').hidden = false; $('#kWaitText').textContent = t(s === 'ended' ? 'call.st.ended' : 'call.failedText');
          $('#kEnd span').textContent = t('common.close');
          if (!o.manual && active && active.startedAt) Store.update('calls', o.room, { dur: Math.round((Date.now() - active.startedAt) / 1000) }).catch(function () {});
        }
      },
      onLocal: function (st) { $('#kLocal').srcObject = st; $('#kLocal').hidden = !st.getVideoTracks().length; },
      onRemote: function (st) { var v = $('#kRemote'); v.srcObject = st; v.play().catch(function () {}); },
      onError: function (key) { toast(t(key)); }
    });
    active.pending = (o.ice || []).slice();
    active.accept(offerSdp).then(function (code) {
      if (o.manual && code) { $('#kAnswerCode').value = code; $('#kManualOut').hidden = false; }
    }).catch(function () {});
  }
  function closeCallUI() { clearInterval(timerInt); $('#kCall').hidden = true; document.body.classList.remove('lock'); $('#kRemote').srcObject = null; $('#kLocal').srcObject = null; active = null; var next = Object.keys(incoming)[0]; if (next) showRing(next); if (VIEW === 'calls') vCalls(); }
  $('#kEnd').addEventListener('click', function () { if (active && active.state !== 'ended') active.hangup(); else closeCallUI(); });
  $('#kMic').addEventListener('click', function () { if (!active) return; var on = active.toggleMic(); this.setAttribute('aria-pressed', String(!on)); $('use', this).setAttribute('href', on ? '#i-mic' : '#i-mic-off'); });
  $('#kCam').addEventListener('click', function () { if (!active) return; var on = active.toggleCam(); this.setAttribute('aria-pressed', String(!on)); $('use', this).setAttribute('href', on ? '#i-video' : '#i-cam-off'); });
  $('#kCopy').addEventListener('click', function () { var v = $('#kAnswerCode').value; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(function () { toast(t('call.copied')); }, function () { $('#kAnswerCode').select(); document.execCommand('copy'); toast(t('call.copied')); }); });

  /* ================= SOZLAMALAR ================= */
  function vSettings() {
    var s = Store.settings(), dis = owner() ? '' : ' disabled';
    var h = '<div class="set-grid"><div class="card"><h3>' + esc(t('k.set.prices')) + '</h3><p class="hint">' + esc(t('k.set.pricesHint')) + '</p>' + (owner() ? '' : '<p class="hint" style="color:var(--danger)">' + esc(t('k.set.ownerOnly')) + '</p>') +
      '<form class="form" id="setForm">' + P.map(function (p) { var v = s.prices && s.prices[p.id] != null ? s.prices[p.id] : (p.priceM2 || ''); return '<div class="field"><label for="pr-' + p.id + '">' + esc(pick(p.name)) + '</label><input id="pr-' + p.id + '" type="number" min="0" step="10" inputmode="numeric" value="' + esc(v) + '"' + dis + '></div>'; }).join('') +
      '<div class="field"><label for="usd">' + esc(t('k.set.rate')) + '</label><input id="usd" type="number" min="1000" step="10" inputmode="numeric" value="' + esc(s.usd || CFG.USD_UZS) + '"' + dis + '></div>' +
      (owner() ? '<button class="btn btn-gold" type="submit">' + esc(t('k.set.save')) + '</button>' : '') + '</form></div>' +
      '<div class="card"><h3>' + esc(t('k.set.lang')) + '</h3><div class="seg" id="setLang" style="margin-top:12px">' + I18N.langs.map(function (l) { return '<button type="button" data-l="' + l.code + '" aria-pressed="' + (I18N.lang === l.code) + '">' + esc(l.label) + '</button>'; }).join('') + '</div>' +
      '<h3 style="margin-top:28px">' + esc(t('k.set.data')) + '</h3><p class="hint">' + esc(t('k.set.dataHint')) + '</p><div class="k-rev-act"><button class="btn btn-ghost sm" type="button" id="csv">' + icon('i-down') + esc(t('k.export')) + '</button></div>' +
      '<h3 style="margin-top:28px">' + esc(t('k.set.about')) + '</h3><dl class="kv"><dt>' + esc(t('k.set.server')) + '</dt><dd>' + esc(CFG.API_URL || t('k.set.notSet')) + '</dd><dt>WebRTC</dt><dd>' + (Media.support().rtc ? '✓' : '✗') + '</dd><dt>HTTPS</dt><dd>' + (window.isSecureContext ? '✓' : '✗') + '</dd></dl></div></div>';
    $('#view').innerHTML = h;
    var f = $('#setForm');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (!owner()) return;
      var prices = {}; P.forEach(function (p) { var v = $('#pr-' + p.id).value; prices[p.id] = v === '' ? null : +v; });
      var ns = { prices: prices, usd: +$('#usd').value || CFG.USD_UZS }; Store.saveSettings(ns); Store.applySettings(ns); toast(t('k.set.saved'));
    });
    $('#setLang').addEventListener('click', function (e) { var b = e.target.closest('[data-l]'); if (b) I18N.set(b.dataset.l); });
  }

  /* ================= JONLI YANGILANISHLAR ================= */
  Store.on('leads', function (rows, info) {
    if (!ROLE) return; renderShell();
    if (info.op === 'add') { var l = rows.filter(function (x) { return x.id === info.id; })[0]; if (l) { toast(t('k.newLead', { name: l.name })); beep(); } }
    if (VIEW === 'leads' || VIEW === 'overview') rerender();
  });
  Store.on('reviews', function (rows, info) {
    if (!ROLE) return; renderShell();
    if (info.op === 'add') { var r = rows.filter(function (x) { return x.id === info.id; })[0]; if (r) toast(t('k.newReview', { name: r.name, r: r.rating })); }
    if ((VIEW === 'reviews' && !state.openReply) || VIEW === 'overview') rerender();
  });
  Store.on('calls', function () { if (!ROLE) return; renderShell(); if (VIEW === 'calls') vCalls(); });
  I18N.on(function () { if (ROLE) { renderShell(); go(VIEW); } });
  if ('Notification' in window && Notification.permission === 'default') document.addEventListener('click', function ask() { document.removeEventListener('click', ask); try { Notification.requestPermission(); } catch (e) {} });
})();
