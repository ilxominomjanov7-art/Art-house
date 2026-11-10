/* Diktor (odam ovozi) uchun matn: node tools/guide/voice-script.js uz  →  tools/guide/voice/SCRIPT-uz.md
   Har bir qatorni alohida faylga yozib oling (telefon diktofoni ham bo'ladi), fayl nomi — jadvaldagi kabi,
   va tools/guide/voice/<til>/ papkasiga qo'ying. So'ng tools/guide/run.sh — video shu ovoz bilan qayta yig'iladi
   (sun'iy ovoz o'rniga; qator uzunligiga qarab video tempi o'zi moslanadi). */
const fs = require('fs'), path = require('path');
const S = require('./script.js');
const L = process.argv[2] || 'uz';
const rows = [];
[['phone', S.PHONE, 'Telefondan kirish'], ['desktop', S.DESKTOP, 'Kompyuter: kabinetning barcha bo\'limlari']].forEach(([seg, B, title]) => {
  rows.push('', '## ' + title, '', '| Fayl | Matn |', '|---|---|');
  B.forEach((b, i) => rows.push('| `' + seg + '-' + String(i).padStart(2, '0') + '.mp3` | ' + String(b.s[L] || '').replace(/\|/g, '\\|') + ' |'));
});
const out = path.join(__dirname, 'voice', 'SCRIPT-' + L + '.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, '# Kabinet video-yo\'riqnomasi — diktor matni (' + L.toUpperCase() + ')\n\n' +
  'Har bir qatorni **alohida fayl** qilib, dadil va jonli ohangda o\'qing (boshida va oxirida 1 soniya jimlik bo\'lsa ham mayli — o\'zi qirqiladi).\n' +
  'Fayllarni `tools/guide/voice/' + L + '/` papkasiga jadvaldagi nomlar bilan qo\'ying va `tools/guide/run.sh` ni ishga tushiring.\n' +
  'Qaysi qator yozilmagan bo\'lsa — o\'sha joyda sun\'iy ovoz qoladi.\n' + rows.join('\n') + '\n');
console.log(out, rows.filter(r => r.startsWith('| `')).length, 'qator');
