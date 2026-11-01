/* Worker v4 uchun kabinet login xeshi (Cloudflare → Secret «ADMINS» ga yoziladi).
   Ishlatish:  node tools/admin-hash.js direktor 'KuchliParol#2026' owner
               node tools/admin-hash.js menejer1 'BoshqaParol!7' manager
   Natijani yig'ib: {"<xesh1>":"owner","<xesh2>":"manager"} ko'rinishida ADMINS secretiga qo'ying.
   LOGIN_SALT o'rnatgan bo'lsangiz — 4-argument sifatida bering. */
const [, , user, pass, role = 'manager', salt = 'arthouse.srv.v4'] = process.argv;
if (!user || !pass) { console.log("node tools/admin-hash.js <login> '<parol>' [owner|manager]"); process.exit(1); }
if (pass.length < 10) { console.log('Parol kamida 10 belgi bo\'lsin.'); process.exit(1); }
const h = require('crypto').pbkdf2Sync(user.trim().toLowerCase() + ':' + pass, salt, 100000, 32, 'sha256').toString('hex');
console.log(JSON.stringify({ [h]: role }));
