/* Tarjima to'liqligini tekshirish: node tools/check-i18n.js */
const fs = require('fs'), path = require('path'), R = p => path.join(__dirname, '..', p);
global.window = {}; global.navigator = { language: 'uz' }; global.localStorage = { getItem: () => null, setItem: () => {} };
global.document = { documentElement: {}, querySelectorAll: () => [] };
require(R('js/i18n.js')); global.I18N = window.I18N;
require(R('js/i18n-fr-it.js')); require(R('js/i18n-es-de-tr.js'));
const html = fs.readFileSync(R('index.html'), 'utf8');
const keys = new Set([...html.matchAll(/data-i(?:-ph|-al)?="([^"]+)"/g)].map(m => m[1]));
const src = fs.readFileSync(R('js/i18n.js'), 'utf8'), uz = src.slice(src.indexOf('var uz = {'), src.indexOf('var ru = {'));
for (const m of uz.matchAll(/'([\w.]+)':/g)) keys.add(m[1]);
for (const f of ['js/site.js']) for (const m of fs.readFileSync(R(f), 'utf8').matchAll(/\bt\('([\w.]+)'/g)) keys.add(m[1]);
for (const k of [...keys]) if (k.endsWith('.')) keys.delete(k); // dinamik prefikslar (t('infra.' + x))
let bad = 0;
for (const l of ['ru', 'en', 'fr', 'it', 'es', 'de', 'tr']) {
  const d = I18N.dict[l] || {}, miss = [...keys].filter(k => d[k] == null);
  if (miss.length) { bad += miss.length; console.log(l, 'yetishmaydi:', miss.join(', ')); }
}
const P = (()=>{ global.window.CFG = {}; require(R('js/config.js')); return window.PROJECTS; })();
const walk = (o, at) => { if (o && typeof o === 'object') { if ('uz' in o && 'ru' in o) { for (const l of ['en', 'fr', 'it', 'es', 'de', 'tr']) if (!o[l]) { bad++; console.log('PROJECTS', at, 'yetishmaydi:', l); } } else for (const k in o) { if (k === 'priceM2') continue; walk(o[k], at + '.' + k); } } };
walk(P, 'P');
const A = require(R('js/agent-dict.js')) || window.AGENT_DICT, AD = window.AGENT_DICT;
for (const l of Object.keys(AD)) { const miss = Object.keys(AD.uz).filter(k => AD[l][k] == null); if (miss.length) { bad += miss.length; console.log('agent', l, miss.join(',')); } }
console.log(bad ? 'XATO: ' + bad + ' ta tarjima yetishmaydi' : 'OK: ' + keys.size + ' kalit × 7 til + loyihalar + AI — hammasi tarjima qilingan');
process.exit(bad ? 1 : 0);
