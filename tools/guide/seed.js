/* Video uchun namunaviy kabinet ma'lumotlari (faqat yozuv brauzerida) */
module.exports = function seed() {
  try { if (localStorage.getItem('vg_seed')) return; localStorage.setItem('vg_seed', '1'); } catch (e) { return; }
  const now = Date.now(), D = 864e5, dk = t => new Date(t + 5 * 36e5).toISOString().slice(0, 10);
  const days = {};
  for (let i = 0; i < 30; i++) { const v = 40 + Math.round(25 * Math.sin(i / 3) + (i * 7) % 17); days[dk(now - i * D)] = { v, pv: v * 3 + 11, c: Math.round(v / 6), l: Math.round(v / 9) }; }
  const L = (o) => Object.assign({ project: 'musaffo', lang: 'uz', src: 'book' }, o);
  const leads = [
    L({ id: 's1', name: 'Aziz Karimov', phone: '+998 90 000 00 01', unit: '2 xonali · 66,6 m²', area: 66.6, price: 73260, down: 24176, pct: 33, months: 24, monthly: 2045, st: 'new', at: now - 2 * 36e5, src: 'callback' }),
    L({ id: 's2', name: 'Dilnoza Rahimova', phone: '+998 91 000 00 02', unit: '1 xonali · 53 m²', area: 53, price: 58300, down: 19239, pct: 33, months: 36, monthly: 1085, st: 'new', at: now - 5 * 36e5, src: 'ai' }),
    L({ id: 's3', name: 'Javohir Tursunov', phone: '+998 93 000 00 03', unit: '3 xonali · 71,51 m²', area: 71.51, price: 78661, st: 'called', at: now - 2 * D }),
    L({ id: 's4', name: 'Malika Usmonova', phone: '+998 94 000 00 04', unit: 'Dupleks · 66,3 m²', area: 66.3, price: 72930, st: 'booked', at: now - 4 * D }),
    L({ id: 's5', name: 'Sardor Aliyev', phone: '+998 95 000 00 05', unit: '4 xonali · 112,82 m²', area: 112.82, price: 124102, down: 40954, pct: 33, months: 36, monthly: 2310, st: 'inst', at: now - 70 * D, sat: now - 65 * D, by: 'dir' }),
    L({ id: 's6', name: 'Nodira Qodirova', phone: '+998 97 000 00 06', unit: '2 xonali · 66,6 m²', area: 66.6, price: 73260, down: 36630, pct: 50, months: 12, monthly: 3053, st: 'inst', at: now - 40 * D, sat: now - 38 * D, by: 'dir' }),
    L({ id: 's7', name: 'Bekzod Ergashev', phone: '+998 99 000 00 07', unit: '1 xonali · 45,6 m²', area: 45.6, price: 50160, st: 'cash', at: now - 20 * D, sat: now - 18 * D, by: 'dir' }),
    L({ id: 's8', name: 'Gulnora Saidova', phone: '+998 88 000 00 08', unit: '3 xonali · 68,11 m²', area: 68.11, price: 74921, st: 'lost', at: now - 9 * D })
  ];
  localStorage.setItem('ah_stats', JSON.stringify({ days, leads }));
  localStorage.setItem('ah3_reviews', JSON.stringify([
    { id: 'r1', at: now - 3 * 36e5, name: 'Aziz Karimov', rating: 5, project: 'musaffo', text: "Menejerlar juda e'tiborli, rejalarni batafsil tushuntirishdi. Foizsiz bo'lib to'lash — katta qulaylik.", video: '', link: '', hidden: false, reply: null, lang: 'uz' },
    { id: 'r2', at: now - 2 * D, name: 'Ольга Ким', rating: 5, project: 'musaffo', text: 'Отличный жилой комплекс, всё прозрачно по договору. Спасибо команде Art House!', video: '', link: '', hidden: false, reply: { text: 'Спасибо за отзыв! Рады, что вы с нами.', at: now - D, by: 'Direktor' }, lang: 'ru' },
    { id: 'r3', at: now - 6 * D, name: 'Sardor Aliyev', rating: 4, project: 'obod', text: "Joylashuvi qulay, maktab va bog'cha yaqin. Kalitni kutyapmiz!", video: '', link: '', hidden: false, reply: null, lang: 'uz' }
  ]));
  const m = (r, t, a) => ({ r, t, at: now - a });
  localStorage.setItem('ah_chats', JSON.stringify([
    { id: 'cdemo1_' + dk(now), at: now - 3 * 36e5, up: now - 2.5 * 36e5, name: 'Dilnoza', phone: '+998 91 000 00 02', unit: '1 xonali · 53 m²', area: 53, lang: 'uz', msgs: [m('u', "Assalomu alaykum, 1 xonali xonadon narxi qancha?", 3 * 36e5), m('a', "Va alaykum assalom! Musaffo'da 53 m² li 1 xonali xonadon taxminan $58 300. Bosh to'lovdan keyin qolgan summani 0% ustamasiz bo'lib to'laysiz.", 3 * 36e5 - 6e4), m('u', "36 oyga bo'lsa oyiga qancha bo'ladi?", 2.6 * 36e5), m('a', "33% bosh to'lov bilan oyiga taxminan $1 085. Ismingiz va raqamingizni qoldirsangiz, menejer qo'ng'iroq qiladi.", 2.5 * 36e5)] },
    { id: 'cdemo2_' + dk(now), at: now - D, up: now - D + 6e5, name: 'Rustam', lang: 'ru', msgs: [m('u', 'Есть ли паркинг в Musaffo?', D), m('a', 'Да, в Musaffo 1293 парковочных места, в каждом подъезде по 2 лифта.', D - 6e4)] }
  ]));
  localStorage.setItem('ah3_calls', JSON.stringify([
    { id: 'call1', at: now - 50 * 6e4, name: 'Javohir', phone: '+998 93 000 00 03', video: true, st: 'missed', lang: 'uz' },
    { id: 'call2', at: now - D, name: 'Malika', phone: '+998 94 000 00 04', video: false, st: 'answered', dur: 214, lang: 'uz' }
  ]));
};
