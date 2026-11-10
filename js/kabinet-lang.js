/* ART HOUSE — kabinet tili: kabinetdagi har bir matn uz → tanlangan tilga (kabinet-dict.js lug'ati orqali) */
var LANG = (function () { try { return localStorage.getItem('ah_lang') || ''; } catch (e) { return ''; } })() || (window.I18N ? I18N.lang : 'uz');
const LOC = { uz: 'uz-UZ', cy: 'uz-Cyrl-UZ', en: 'en-US', ru: 'ru-RU', fr: 'fr-FR', it: 'it-IT', es: 'es-ES', de: 'de-DE', tr: 'tr-TR' };
var TRD = {};
function setLang(l, save) {
  if (!LOC[l]) l = 'uz';
  LANG = l;
  if (save) try { localStorage.setItem('ah_lang', l); } catch (e) {}
  if (window.I18N && I18N.lang !== l) I18N.set(l);
  document.documentElement.lang = l === 'cy' ? 'uz-Cyrl' : l;
  window.dispatchEvent(new Event('langchange'));
}
function trStr(s) { return window.AHTR ? AHTR(s) : s; }
