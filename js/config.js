/* =====================================================================
   ART HOUSE — SOZLAMALAR VA KONTENT
   Barcha haqiqiy ma'lumotlar (telefon, havolalar, loyihalar) shu faylda.
   "TEKSHIRING" belgisi qo'yilgan qatorlar ochiq manbalardan olingan —
   e'lon qilishdan oldin rasmiy ma'lumot bilan solishtiring.
   ===================================================================== */
window.CFG = {
  BRAND: 'ART HOUSE',
  FOUNDED: 2021,                         // TEKSHIRING: ochiq manbalarda 2021-yil ko'rsatilgan
  PHONES: ['+998712307447', '+998781136350'],
  TELEGRAM_CHANNEL: 'https://t.me/art_house_city',
  TELEGRAM_MANAGER: '',                  // masalan: 'https://t.me/arthouse_manager'
  INSTAGRAM: 'https://www.instagram.com/arthouse.tashkent',
  INSTAGRAM_HANDLE: '@arthouse.tashkent',
  YOUTUBE: '',                           // bo'sh qolsa — ko'rsatilmaydi
  FACEBOOK: '',
  OFFICE: { lat: 41.312851, lng: 69.187460 },
  USD_UZS: 12700,                        // so'mdagi taxminiy ko'rsatkich uchun kurs (kabinetdan o'zgartiriladi)
  DOWN_MIN: 30, DOWN_MAX: 70,
  MONTHS: [12, 18, 24, 36],
  // Server (server/server.js) ishga tushirilsa — izohlar, arizalar va qo'ng'iroqlar
  // barcha qurilmalar o'rtasida sinxronlanadi. Bo'sh bo'lsa — shu brauzer ichida ishlaydi.
  // 'auto' — sayt server/server.js orqali ochilsa o'sha serverdan foydalanadi; boshqa domen bo'lsa: 'https://api.arthouse.uz'
  API_URL: '',
  ICE_SERVERS: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
  // Kabinet kirish ma'lumotlari: login → PBKDF2-SHA256 xeshi (README'da yangi parol xeshini olish tartibi bor)
  ADMINS: {
    // DIQQAT: bu boshlang'ich parollar (admin / ArtHouse#2026, manager / Manager#2026) — darhol almashtiring!
    admin: { role: 'owner', hash: 'e64f2d2f73f554481637665d9bd09877a5ac6b31653757e74004aaadb3ad3730' },
    manager: { role: 'manager', hash: 'ff91819a0e3a22f6389458116fc08fbab9f6ec38d3f4b7d54843f88c5cbb75b3' }
  }
};

/* Ko'p tilli matn: { uz, ru, en } */
window.PROJECTS = [
  {
    id: 'musaffo',
    name: 'Musaffo',
    badge: { uz: 'Biznes-klass', ru: 'Бизнес-класс', en: 'Business class' },
    district: { uz: 'Yunusobod tumani', ru: 'Юнусабадский район', en: 'Yunusabad district' },
    address: { uz: 'Chinobod ko\'chasi, 120A', ru: 'ул. Чинабад, 120А', en: '120A Chinobod Street' }, // TEKSHIRING
    geo: { lat: 41.360158, lng: 69.315909 },
    priceM2: 1100,                       // $ / m² — kabinetdan o'zgartiriladi
    cover: 'assets/img/musaffo/musaffo-cover.webp',
    video: { src: 'assets/video/musaffo-drone.mp4', poster: 'assets/video/musaffo-drone-poster.jpg' },
    presentation: '',                    // masalan: 'docs/musaffo-taqdimot.pdf'
    lead: {
      uz: 'Yunusobodning sokin, yashil hududida joylashgan biznes-klass turar-joy majmuasi. Yopiq hovli, yerosti avtoturargohi, bolalar va sport maydonlari — oila uchun to\'liq o\'ylangan muhit.',
      ru: 'Жилой комплекс бизнес-класса в тихом зелёном районе Юнусабада. Закрытый двор, подземный паркинг, детские и спортивные площадки — среда, продуманная для всей семьи.',
      en: 'A business-class residential complex in a quiet, green part of Yunusabad. A private courtyard, underground parking, play and sports areas — an environment designed around family life.'
    },
    facts: [ // TEKSHIRING: ochiq manbalar va @arthouse.tashkent postlari asosida
      { v: '9', k: { uz: 'turar-joy bloki', ru: 'жилых корпусов', en: 'residential blocks' } },
      { v: '16', k: { uz: 'qavatgacha', ru: 'этажей', en: 'floors' } },
      { v: '1293', k: { uz: 'avtoturargoh joyi', ru: 'машино-места', en: 'parking spaces' } },
      { v: '2', k: { uz: 'lift har podyezdda', ru: 'лифта в каждом подъезде', en: 'lifts per entrance' } }
    ],
    amenities: [
      { img: 'assets/img/musaffo/bolalar-oyingohi.webp',
        t: { uz: 'Bolalar o\'yingohi', ru: 'Детская площадка', en: 'Children\'s playground' },
        d: { uz: 'Zamonaviy o\'yin jihozlari, yumshoq qoplamali maydon va yashil hudud bolajonlarning quvnoq va xavfsiz vaqt o\'tkazishini ta\'minlaydi.',
             ru: 'Современное игровое оборудование, мягкое покрытие и зелёная зона — для весёлого и безопасного отдыха детей.',
             en: 'Modern play equipment, soft safety surfacing and green space keep children\'s play joyful and safe.' } },
      { img: 'assets/img/musaffo/avtoturargoh.webp',
        t: { uz: 'Avtoturargohlar', ru: 'Паркинг', en: 'Parking' },
        d: { uz: 'Avtomobilingizni har qanday ob-havoda himoya qiladi va harakatlanishni qulay qiladi. Loyiha hududida jami 1293 ta avtoturargoh barpo etiladi.',
             ru: 'Защищает автомобиль в любую погоду и делает передвижение удобным. На территории проекта будет построено 1293 машино-места.',
             en: 'Protects your car in any weather and makes getting around effortless. A total of 1,293 parking spaces are being built on site.' } },
      { img: 'assets/img/musaffo/fitness-zona.webp',
        t: { uz: 'Fitness zona', ru: 'Фитнес-зона', en: 'Fitness zone' },
        d: { uz: 'Kunning istalgan vaqtida sport bilan shug\'ullanish imkoniyati. Zamonaviy sharoit va qulay muhit — sog\'lom turmush tarzi uchun.',
             ru: 'Возможность заниматься спортом в любое время дня. Современные условия и комфортная среда для здорового образа жизни.',
             en: 'Work out at any time of day. Modern equipment and a comfortable setting for a healthy lifestyle.' } },
      { img: 'assets/img/musaffo/zamonaviy-lift.webp',
        t: { uz: 'Zamonaviy lift', ru: 'Современные лифты', en: 'Modern lifts' },
        d: { uz: 'Har bir podyezdda 2 tadan lift. Sokin va ravon ishlash, ventilyatsiya tizimi hamda o\'ziga xos dizayn.',
             ru: 'По 2 лифта в каждом подъезде. Тихая и плавная работа, система вентиляции и фирменный дизайн.',
             en: 'Two lifts in every entrance — quiet, smooth operation, built-in ventilation and a signature design.' } },
      { img: 'assets/img/musaffo/kolyaska-velosiped.webp',
        t: { uz: 'Kolyaska va velosiped zonasi', ru: 'Колясочная и велопарковка', en: 'Stroller & bicycle room' },
        d: { uz: 'Podyezd ichida maxsus ajratilgan hudud tartibni saqlaydi va rezidentlarga qulay hamda xavfsiz foydalanish imkonini beradi.',
             ru: 'Отдельное помещение в подъезде поддерживает порядок и даёт жильцам удобное и безопасное хранение.',
             en: 'A dedicated room inside the entrance keeps hallways tidy and gives residents convenient, secure storage.' } }
    ],
    gallery: [
      { src: 'assets/img/musaffo/fasad-kunduzi.webp', t: { uz: 'Tashqi fasad — kunduzi', ru: 'Фасад днём', en: 'Façade by day' } },
      { src: 'assets/img/musaffo/majmua-kechki.webp', t: { uz: 'Kechki yoritilgan majmua', ru: 'Комплекс в вечерней подсветке', en: 'The complex at dusk' } },
      { src: 'assets/img/musaffo/dupleks-interyer.webp', t: { uz: 'Dupleks — ikki qavatli makon', ru: 'Дуплекс — два уровня', en: 'Duplex — two levels' } },
      { src: 'assets/img/musaffo/mehmonxona.webp', t: { uz: 'Mehmonxona', ru: 'Гостиная', en: 'Living room' } },
      { src: 'assets/img/musaffo/oshxona.webp', t: { uz: 'Oshxona', ru: 'Кухня', en: 'Kitchen' } },
      { src: 'assets/img/musaffo/yotoqxona.webp', t: { uz: 'Yotoqxona', ru: 'Спальня', en: 'Bedroom' } }
    ],
    plans: [
      { rooms: 1, area: 53, img: 'assets/img/plans/1x-53.webp' },
      { rooms: 1, area: 45.6, img: 'assets/img/plans/1x-45-6.webp' },
      { rooms: 2, area: 66.6, img: 'assets/img/plans/2x-66-6.webp' },
      { rooms: 3, area: 68.11, img: 'assets/img/plans/3x-68-11.webp' },
      { rooms: 3, area: 71.51, img: 'assets/img/plans/3x-71-51.webp', balcony: true },
      { rooms: 4, area: 112.82, img: 'assets/img/plans/4x-112-82.webp' },
      { rooms: 4, area: 116.03, img: 'assets/img/plans/4x-116-03.webp' },
      { rooms: 4, area: 119.2, img: 'assets/img/plans/4x-119-20.webp' },
      { rooms: 2, area: 53.1, img: 'assets/img/plans/dupleks-2x-53-1.webp', duplex: 1 },
      { rooms: 2, area: 54.3, img: 'assets/img/plans/dupleks-2x-54-3.webp', duplex: 2 },
      { rooms: 3, area: 66.3, img: 'assets/img/plans/dupleks-3x-66-3.webp', duplex: 1 },
      { rooms: 3, area: 62.7, img: 'assets/img/plans/dupleks-3x-62-7.webp', duplex: 2 }
    ]
  },
  {
    id: 'kokcha',
    name: 'Ko\'kcha',
    badge: { uz: 'Komfort-klass', ru: 'Комфорт-класс', en: 'Comfort class' },
    district: { uz: 'Uchtepa tumani', ru: 'Учтепинский район', en: 'Uchtepa district' },
    address: { uz: 'Ko\'kcha-Oqtepa mahallasi', ru: 'махалля Кукча-Актепа', en: 'Kukcha-Oqtepa neighbourhood' }, // TEKSHIRING
    geo: { lat: 41.3145, lng: 69.1905 },   // TEKSHIRING: taxminiy nuqta
    priceM2: null,                         // narx menejer orqali — kalkulyatorda qo'lda kiritiladi
    cover: '', video: null, presentation: '',
    lead: {
      uz: 'Ko\'kcha dahasidagi g\'ishtli turar-joy majmuasi: keng hovli, oilaviy rejalar va shaharning tarixiy qismiga yaqinlik. Xonadonlar qora suvoq holatida topshiriladi.',
      ru: 'Кирпичный жилой комплекс в районе Кукча: просторный двор, семейные планировки и близость к исторической части города. Квартиры сдаются в черновой отделке.',
      en: 'A brick-built residential complex in the Kukcha area: a spacious courtyard, family-sized layouts and easy reach of the historic city. Apartments are handed over in shell condition.'
    },
    facts: [ // TEKSHIRING
      { v: '12', k: { uz: 'g\'ishtli bino', ru: 'кирпичных домов', en: 'brick buildings' } },
      { v: '11', k: { uz: 'qavatli', ru: 'этажей', en: 'floors' } },
      { v: '1000+', k: { uz: 'xonadon', ru: 'квартир', en: 'apartments' } }
    ],
    amenities: [], gallery: [], plans: []
  },
  {
    id: 'obod',
    name: 'Obod Maskan',
    badge: { uz: 'Yangi loyiha', ru: 'Новый проект', en: 'New project' },
    district: { uz: 'Uchtepa tumani', ru: 'Учтепинский район', en: 'Uchtepa district' },
    address: { uz: 'Ko\'kcha Darvoza ko\'chasi, 487D', ru: 'ул. Кукча Дарвоза, 487D', en: '487D Kukcha Darvoza Street' }, // TEKSHIRING
    geo: { lat: 41.3109, lng: 69.1852 },   // TEKSHIRING: taxminiy nuqta
    priceM2: null,
    cover: '', video: null, presentation: '',
    lead: {
      uz: 'Ko\'kcha Darvoza ko\'chasidagi yangi turar-joy majmuasi. Boshlang\'ich to\'lov 30% dan, qolgan summa quruvchining o\'zi bilan foizsiz bo\'lib to\'lanadi.',
      ru: 'Новый жилой комплекс на улице Кукча Дарвоза. Первоначальный взнос от 30%, остаток — беспроцентная рассрочка напрямую от застройщика.',
      en: 'A new residential complex on Kukcha Darvoza Street. Down payment from 30%, with the balance paid in interest-free instalments directly to the developer.'
    },
    facts: [
      { v: '30%', k: { uz: 'dan boshlang\'ich to\'lov', ru: 'первый взнос от', en: 'down payment from' } },
      { v: '0%', k: { uz: 'ustama va foiz', ru: 'переплата и процент', en: 'markup and interest' } }
    ],
    amenities: [], gallery: [], plans: []
  }
];
