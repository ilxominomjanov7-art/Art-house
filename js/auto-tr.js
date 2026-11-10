/* =====================================================================
   ART HOUSE — 100% TARJIMA (sayt va kabinet uchun umumiy)
   • Lug'atda yo'q, o'zbekcha qolib ketgan har bir gap (kabinetda yozilgan sarlavhalar,
     menyu, tugmalar, placeholder) tanlangan tilga avtomatik tarjima qilinadi.
   • Kirill — o'zbekchadan transliteratsiya. Kabinetda yangi til qo'shilsa — o'sha til kodi bilan
     avtomatik ishlaydi (alohida sozlash shart emas).
   • Tarjimalar shu brauzerda saqlanadi (localStorage 'ah_tr_<til>') — ikkinchi marta tarmoqsiz, darhol.
   • Internet bo'lmasa — matn o'zgarmaydi, hech narsa buzilmaydi.
   ===================================================================== */
(function () {
  'use strict';
  if (window.AH_AUTOTR) return; window.AH_AUTOTR = 1;
  var lang = function () { return (window.I18N && I18N.lang) || window.LANG || 'uz'; };
  var toCyr = function (s) { return window.I18N && I18N.toCyr ? I18N.toCyr(s) : s; };
  var UZW = /\b(va|uchun|bilan|bu|emas|biz|siz|sizning|bizning|bizga|sizga|uy|uyingiz|uylar|xonadon\w*|to'lov\w*|qilish|qiling|bo'lim\w*|ham|yoki|balki|shunchaki|san'at\w*|kabi|qo'ng'iroq|band|loyiha\w*|haqida|haqimizda|aloqa|bosh|sahifa|mijoz\w*|yangi|barcha|hozir|kerak|yo'q|bor|oy|oyga|oylik|narx\w*|maydon|xona\w*|kanal\w*|obuna|bo'ling|sharh\w*|manzil\w*|ochish|yopish|saqlash|tahrirlash|o'chirish|qo'shish|tanlang|yuklash|ko'rish|ko'rinadi|sozlamalar|bo'yicha|tez|javob|ariza|menejer|quruvchi\w*|ishonch\w*|quramiz|yillik|tajriba|foizsiz|bo'lib|to'lash|kunduzi|kechqurun|bugun|keyin|oldin|eng|yaxshi|qavat\w*|taklif\w*|ko'proq|batafsil|yozing|yuboring|rahmat)\b/i;
  var OQ = /[a-z](['‘’ʻ`])[a-z]/i;
  var LNAMES = /^(O['‘’ʻ]zbekcha|Ўзбекча|Русский|English|Français|Italiano|Español|Deutsch|Türkçe)$/;
  function isUz(s) {
    if (!/[a-z]/i.test(s) || /[а-яё]/i.test(s) || LNAMES.test(String(s).trim())) return false;
    var x = s.replace(/[‘’ʻ`]/g, "'");
    if (/\b(o|g)'[a-z]/i.test(x)) return true;
    return UZW.test(x) && (x.match(/[a-z]+/gi) || []).length >= 1;
  }
  var SKIP = 'SCRIPT,STYLE,NOSCRIPT,TEXTAREA,CODE,PRE,SVG,INPUT,SELECT,OPTION,CANVAS,VIDEO,AUDIO,IFRAME';
  var SKIPSEL = '[class*="lang"],[id*="lang"],[id*="Lang"],.nt9,[translate="no"],[contenteditable],#am,#ach,.igs2-cc,[class*="chat"],[id*="chat"],[class*="-msg"],.cm-msg,[data-no-tr]';
  function skip(el) { for (; el && el.nodeType === 1; el = el.parentElement) { if (SKIP.indexOf(el.tagName) > -1) return true; } return false; }
  var BRAND = { ru: { Instagram: 'Инстаграм', Telegram: 'Телеграм', YouTube: 'Ютуб', WhatsApp: 'Ватсап', Facebook: 'Фейсбук' } };
  BRAND.cy = { Instagram: 'Инстаграм', Telegram: 'Телеграм', YouTube: 'Ютуб', WhatsApp: 'Ватсап', Facebook: 'Фейсбук' };
  var ORIG = new WeakMap(), ATTR = new WeakMap();
  var cache = {}, pend = {}, Q = [], busy = 0;
  function C(l) { if (!cache[l]) { try { cache[l] = JSON.parse(localStorage.getItem('ah_tr_' + l)) || {}; } catch (e) { cache[l] = {}; } } return cache[l]; }
  var sv = {}; function save(l) { clearTimeout(sv[l]); sv[l] = setTimeout(function () { try { localStorage.setItem('ah_tr_' + l, JSON.stringify(C(l))); } catch (e) {} }, 800); }
  var GL = { cy: 'uz', zh: 'zh-CN', tw: 'zh-TW', he: 'iw', kk: 'kk', tg: 'tg', kz: 'kk', ua: 'uk', jp: 'ja', kr: 'ko' };
  function fetchTr(l, s) {
    var tl = GL[l] || l;
    return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=' + encodeURIComponent(tl) + '&dt=t&q=' + encodeURIComponent(s))
      .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .then(function (j) { return (j && j[0] || []).map(function (x) { return x[0]; }).join(''); })
      .catch(function () { /* zaxira tarjimon (Google bloklasa) */
        return fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(s) + '&langpair=uz|' + encodeURIComponent((tl || 'en').split('-')[0]))
          .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
          .then(function (j) { var o = j && j.responseData && j.responseData.translatedText; if (!o || /MYMEMORY WARNING|INVALID/i.test(o)) throw 0; return String(o).replace(/&#(\d+);/g, function (m, c) { return String.fromCharCode(+c); }).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'); });
      });
  }
  function caseLike(src, out) { return src === src.toUpperCase() && /[A-Z]/.test(src) ? out.toUpperCase() : out; }
  function pump() {
    while (busy < 4 && Q.length) {
      var it = Q.shift(); busy++;
      (function (l, s) {
        fetchTr(l, s).then(function (o) { if (o) { C(l)[s] = caseLike(s, o); save(l); } })
          .catch(function () { C(l)[s] = C(l)[s] || null; })
          .then(function () { busy--; delete pend[l + '|' + s]; sched(); pump(); });
      })(it[0], it[1]);
    }
  }
  /* kabinet saqlagan tarjimalar (AH_CMS.tr) — internetsiz ham ishlaydi */
  var dC = null, dT = 0;
  function dictOf(l) {
    if (window.AHK && AHK.CMS) { if (!dC || Date.now() - dT > 2000) { try { dC = AHK.CMS().tr || {}; } catch (e) { dC = {}; } dT = Date.now(); } return dC[l]; }
    return ((window.AH_CMS || {}).tr || {})[l];
  }
  function tr(l, s) {
    var core = s.trim(); if (!core) return null;
    if (l === 'cy') return core === core.toUpperCase() && /[A-Z]/.test(core) ? toCyr(core.toLowerCase()).toUpperCase() : toCyr(core);
    var DD = dictOf(l); if (DD && DD[core]) return DD[core];
    var c = C(l); if (c[core]) return c[core];
    if (c[core] === null) return null;
    var k = l + '|' + core; if (!pend[k] && navigator.onLine !== false && core.length < 1500) { pend[k] = 1; Q.push([l, core]); pump(); }
    return null;
  }
  function brand(l, s) { var B = BRAND[l]; if (!B) return null; var c = s.trim(); return B[c] || null; }
  function wrap(src, core) { var m = src.match(/^(\s*)[\s\S]*?(\s*)$/); return (m ? m[1] : '') + core + (m ? m[2] : ''); }
  function pass(root) {
    var l = lang(); root = root || document.body; if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (n) {
      var p = n.parentElement; if (!p || skip(p) || (p.closest && p.closest(SKIPSEL))) return;
      var rec = ORIG.get(n), cur = n.nodeValue;
      if (rec && cur !== rec.out) { ORIG.delete(n); rec = null; } /* sayt o'zi qayta yozdi — yangi matn */
      var src = rec ? rec.src : cur;
      if (l === 'uz') { if (rec) { n.nodeValue = src; ORIG.delete(n); } return; }
      var b = brand(l, src);
      if (!b) { if (!isUz(src)) return; b = tr(l, src); }
      if (b) { var out = wrap(src, b); if (n.nodeValue !== out) n.nodeValue = out; ORIG.set(n, { src: src, out: out }); }
    });
    var els = root.querySelectorAll ? root.querySelectorAll('[placeholder],[title],[aria-label]') : [];
    [].forEach.call(els, function (el) {
      if (el.closest(SKIPSEL)) return;
      ['placeholder', 'title', 'aria-label'].forEach(function (a) {
        var v = el.getAttribute(a); if (!v) return; var m = ATTR.get(el) || {}; var r = m[a];
        if (r && v !== r.out) r = null; var src = r ? r.src : v;
        if (l === 'uz') { if (r) { el.setAttribute(a, src); delete m[a]; } return; }
        if (!isUz(src)) return; var o = tr(l, src); if (o) { el.setAttribute(a, o); m[a] = { src: src, out: o }; ATTR.set(el, m); }
      });
    });
  }
  var st = 0, lastL = lang();
  function sched() { clearTimeout(st); st = setTimeout(function () { obs && obs.disconnect(); try { pass(); } finally { obs && obs.observe(document.body, { childList: true, subtree: true, characterData: true }); } }, 140); }
  var obs = 'MutationObserver' in window ? new MutationObserver(sched) : null;
  function start() { if (!document.body) return setTimeout(start, 50); sched(); if (obs) obs.observe(document.body, { childList: true, subtree: true, characterData: true }); }
  start();
  if (window.I18N && I18N.on) I18N.on(function () { setTimeout(sched, 60); });
  setInterval(function () { var l = lang(); if (l !== lastL) { lastL = l; sched(); } }, 600);
  window.AH_TR = { pass: sched, isUz: isUz, clear: function (l) { try { localStorage.removeItem('ah_tr_' + l); } catch (e) {} cache[l] = {}; } };
})();
