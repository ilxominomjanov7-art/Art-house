/* =====================================================================
   ART HOUSE — saytdagi ikonkalar: och oltin plitka (iOS ilova ikonkasi uslubi)
   Ingichka chiziqli ikonka (#i-…) o'rniga oltin plitka ichida to'liq belgi (#f-…).
   Yangi chizilgan bloklar ham avtomatik o'zgaradi (MutationObserver).
   ===================================================================== */
(function () {
  'use strict';
  var MAP = { 'i-phone': 'phone', 'i-video': 'video', 'i-tg': 'tg', 'i-ig': 'ig', 'i-pin': 'pin', 'i-doc': 'doc', 'i-car': 'car', 'i-mic': 'mic',
    'i-shield': 'shield', 'i-percent': 'percent', 'i-key': 'key', 'i-hand': 'hand', 'i-build': 'build', 'i-star': 'star' };
  /* qaysi joylarda plitka bo'ladi (oltin tugmalar ichida emas — u yerda belgi o'zi qoladi) */
  var SEL = ['.dock svg.ic', '.why article > svg.ic', '.soc-card .ico > svg.ic', '.loc-list li > svg.ic', '.ig-head > svg.ic', '.notice > svg.ic',
    'li > a > svg.ic', '.btn-ghost > svg.ic', '.pd-meta svg.ic', '.contact-list svg.ic'].join(',');
  function tile(svg) {
    if (svg.closest('.gt') || svg.closest('.btn-gold')) return;
    var u = svg.querySelector('use'), id = u && (u.getAttribute('href') || '').replace('#', '');
    var f = MAP[id]; if (!f) return;
    var g = document.createElement('span'); g.className = 'gt' + (svg.closest('.btn-ghost,.pd-meta,li > a') ? ' sm' : '') + (svg.closest('.why,.ig-head,.notice') ? ' lg' : '');
    g.setAttribute('aria-hidden', 'true');
    g.innerHTML = '<svg><use href="#f-' + f + '"/></svg>';
    svg.replaceWith(g);
  }
  function run(root) { (root || document).querySelectorAll(SEL).forEach(tile); }
  run();
  new MutationObserver(function (ms) { var go = false; ms.forEach(function (m) { if (m.addedNodes.length) go = true; }); if (go) run(); })
    .observe(document.body, { childList: true, subtree: true });
})();
