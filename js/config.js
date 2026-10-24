/* =====================================================================
   ART HOUSE — SOZLAMALAR VA KONTENT
   Barcha haqiqiy ma'lumotlar (telefon, havolalar, loyihalar) shu faylda.
   "TEKSHIRING" belgisi qo'yilgan qatorlar ochiq manbalardan olingan —
   e'lon qilishdan oldin rasmiy ma'lumot bilan solishtiring.
   ===================================================================== */
window.CFG = {
  BRAND: 'ART HOUSE',
  COMPANY: 'Art House Qurilish Kompaniyasi',  // @arthouse.tashkent profilidagi rasmiy nom
  EXPERIENCE_YEARS: 14,                  // @arthouse.tashkent: "14 yillik tajriba"
  PROJECTS_DONE: '30+',                  // @arthouse.tashkent: "30+ loyihalar"
  IG_FOLLOWERS: '114K', IG_POSTS: '1 010',
  PHONES: ['+998712307447', '+998781136350'],
  PHONE: '+998712307447',                // asosiy raqam (Instagram profilidagi)
  TELEGRAM_CHANNEL: 'https://t.me/arthouse_toshkent',   // Instagram profilidagi havola
  TG_CHANNEL: 'https://t.me/arthouse_toshkent',
  TELEGRAM_MANAGER: '',                  // masalan: 'https://t.me/arthouse_manager'
  TG_MANAGER: '',
  INSTAGRAM: 'https://www.instagram.com/arthouse.tashkent',
  INSTAGRAM_HANDLE: '@arthouse.tashkent',
  YOUTUBE: '',                           // bo'sh qolsa — ko'rsatilmaydi
  FACEBOOK: '',
  WHATSAPP: '',
  OFFICE: { lat: 41.312851, lng: 69.187460 },
  USD_UZS: 12700,                        // so'mdagi taxminiy ko'rsatkich uchun kurs (kabinetdan o'zgartiriladi)
  PRICE_M2: 1100,                        // 1 m² baza narxi ($) — kabinet → Sozlamalar
  DOWN_MIN: 30, DOWN_MAX: 70,
  MONTHS: [12, 18, 24, 36],
  CHAT_ID: '-1004375647097',             // Telegram guruh (arizalar) — token faqat serverda
  BOT_TOKEN: '', BOT_TOKENS: [],
  // Server (server/server.js): '' — faqat shu brauzer; 'auto' — sayt shu server orqali ochilganda;
  // boshqa domen bo'lsa: 'https://api.arthouse.uz'
  API_URL: '',
  ICE_SERVERS: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
  // Kabinet kirish kodlari (eski tizim bilan bir xil): PBKDF2('login:parol', 'arthouse.v2', 120000) → huquq.
  // Avvalgi direktor va menejer kirishlari saqlangan + qo'shimcha: admin / ArtHouse#2026 (darhol almashtiring!)
  ADMINS: {
    '42907045d12c80865de3a6fca71cfc0a8eec20a717fcedfaa77b3352c45310d5': 'owner',
    '62a9a4049368545ccc6ee470246433025b715f0fc2eb217e4a4bfcb1c9ff1ae3': 'manager',
    'd034d8712ec91325d91b3f19522c25b01a10e0dcb5b56c36f9b387115901b90e': 'owner'
  }
};
try { const _s = JSON.parse(localStorage.getItem('ah_set')); if (_s) { CFG.PRICE_M2 = +_s.p || CFG.PRICE_M2; CFG.DOWN_MIN = _s.d != null ? +_s.d : CFG.DOWN_MIN; CFG.MONTHS = _s.m && _s.m.length ? _s.m : CFG.MONTHS; } } catch (e) {}

/* Xonadon nomi (kabinet bazasi bilan bir xil ko'rinishda): "2 xonali dupleks · 2-qavat · 54,3 m² · terassa" */
window.unitLabel = function (pl) {
  var a = pl.areaTxt || String(pl.area).replace('.', ',');
  if (pl.duplex) return pl.rooms + ' xonali dupleks · ' + pl.duplex + '-qavat · ' + a + ' m²' + (pl.terrace ? ' · terassa' : '');
  return pl.rooms + ' xonali xonadon · ' + a + ' m²' + (pl.balcony ? ' · balkon bilan' : '');
};

/* Ko'p tilli matn: { uz, ru, en, fr, it, es, de, tr } (o'zbek kirill — avtomatik) */
window.PROJECTS = [
  {
    id: 'musaffo',
    name: 'Musaffo',
    badge: { uz: 'Biznes-klass', ru: 'Бизнес-класс', en: 'Business class', fr: 'Classe affaires', it: 'Business class', es: 'Clase business', de: 'Business-Klasse', tr: 'Business sınıfı' },
    district: { uz: 'Yunusobod tumani', ru: 'Юнусабадский район', en: 'Yunusabad district', fr: 'District de Iounoussabad', it: 'Distretto di Yunusabad', es: 'Distrito de Yunusabad', de: 'Bezirk Yunusabad', tr: 'Yunusabad ilçesi' },
    address: { uz: "Chinobod ko'chasi, 120A", ru: 'ул. Чинабад, 120А', en: '120A Chinobod Street', fr: '120A, rue Chinobod', it: 'Via Chinobod 120A', es: 'Calle Chinobod, 120A', de: 'Chinobod-Straße 120A', tr: 'Chinobod Caddesi, 120A' }, // TEKSHIRING
    geo: { lat: 41.360158, lng: 69.315909 },
    get priceM2() { return window.CFG.PRICE_M2; }, set priceM2(v) { window.CFG.PRICE_M2 = +v || window.CFG.PRICE_M2; }, // kabinet → Sozlamalar → 1 m² baza narxi
    cover: 'assets/img/musaffo/musaffo-cover.webp',
    video: { src: 'assets/video/musaffo-drone.mp4', poster: 'assets/video/musaffo-drone-poster.jpg' },
    presentation: '',                    // masalan: 'docs/musaffo-taqdimot.pdf'
    lead: {
      uz: "Tabiiy muhitni zamonaviy yashash makoni bilan uyg'unlashtirgan manzil. Yunusobodning sokin, yashil hududidagi biznes-klass turar-joy majmuasi: yopiq hovli, yerosti avtoturargohi, bolalar va sport maydonlari. Ta'mirlangan xonadonlar ham mavjud.",
      ru: 'Адрес, где природа гармонично сочетается с современной жизнью. Жилой комплекс бизнес-класса в тихом зелёном районе Юнусабада: закрытый двор, подземный паркинг, детские и спортивные площадки. Есть квартиры с готовым ремонтом.',
      en: "An address where nature meets modern living. A business-class residential complex in a quiet, green part of Yunusabad: a private courtyard, underground parking, play and sports areas. Move-in-ready renovated apartments are also available.",
      fr: "Une adresse où la nature rencontre la vie moderne. Une résidence de classe affaires dans un quartier calme et verdoyant de Iounoussabad : cour privée, parking souterrain, aires de jeux et de sport. Des appartements rénovés, prêts à habiter, sont aussi disponibles.",
      it: "Un indirizzo dove la natura incontra la vita moderna. Un complesso residenziale business class in una zona tranquilla e verde di Yunusabad: cortile privato, parcheggio sotterraneo, aree gioco e sport. Disponibili anche appartamenti ristrutturati, pronti da abitare.",
      es: 'Una dirección donde la naturaleza se une a la vida moderna. Un complejo residencial de clase business en una zona tranquila y verde de Yunusabad: patio privado, aparcamiento subterráneo, zonas de juego y deporte. También hay apartamentos reformados, listos para entrar a vivir.',
      de: 'Eine Adresse, an der Natur und modernes Wohnen zusammenfinden. Eine Wohnanlage der Business-Klasse in einem ruhigen, grünen Teil von Yunusabad: privater Innenhof, Tiefgarage, Spiel- und Sportplätze. Auch bezugsfertig renovierte Wohnungen sind verfügbar.',
      tr: 'Doğayla modern yaşamı buluşturan bir adres. Yunusabad’ın sakin ve yeşil bölgesinde business sınıfı bir konut kompleksi: kapalı avlu, yeraltı otoparkı, çocuk ve spor alanları. Tadilatı yapılmış, taşınmaya hazır daireler de mevcut.'
    },
    facts: [ // TEKSHIRING: ochiq manbalar va @arthouse.tashkent postlari asosida
      { v: '9', k: { uz: 'turar-joy bloki', ru: 'жилых корпусов', en: 'residential blocks', fr: 'bâtiments résidentiels', it: 'edifici residenziali', es: 'bloques residenciales', de: 'Wohngebäude', tr: 'konut bloğu' } },
      { v: '16', k: { uz: 'qavatgacha', ru: 'этажей', en: 'floors', fr: 'étages', it: 'piani', es: 'plantas', de: 'Etagen', tr: 'kat' } },
      { v: '1293', k: { uz: 'avtoturargoh joyi', ru: 'машино-места', en: 'parking spaces', fr: 'places de parking', it: 'posti auto', es: 'plazas de aparcamiento', de: 'Stellplätze', tr: 'otopark yeri' } },
      { v: '2', k: { uz: 'lift har podyezdda', ru: 'лифта в каждом подъезде', en: 'lifts per entrance', fr: 'ascenseurs par entrée', it: 'ascensori per ingresso', es: 'ascensores por portal', de: 'Aufzüge je Eingang', tr: 'asansör her girişte' } }
    ],
    amenities: [
      { img: 'assets/img/musaffo/bolalar-oyingohi.webp',
        t: { uz: "Bolalar o'yingohi", ru: 'Детская площадка', en: "Children's playground", fr: 'Aire de jeux pour enfants', it: 'Parco giochi per bambini', es: 'Parque infantil', de: 'Kinderspielplatz', tr: 'Çocuk oyun alanı' },
        d: { uz: "Zamonaviy o'yin jihozlari, yumshoq qoplamali maydon va yashil hudud bolajonlarning quvnoq va xavfsiz vaqt o'tkazishini ta'minlaydi.",
             ru: 'Современное игровое оборудование, мягкое покрытие и зелёная зона — для весёлого и безопасного отдыха детей.',
             en: "Modern play equipment, soft safety surfacing and green space keep children's play joyful and safe.",
             fr: 'Des jeux modernes, un sol amortissant et un espace vert pour des moments joyeux et en toute sécurité.',
             it: 'Giochi moderni, pavimentazione antitrauma e spazio verde per un divertimento allegro e sicuro.',
             es: 'Juegos modernos, suelo de seguridad acolchado y zona verde para que los niños se diviertan con total seguridad.',
             de: 'Moderne Spielgeräte, weicher Fallschutzboden und Grünflächen für fröhliches und sicheres Spielen.',
             tr: 'Modern oyun ekipmanları, yumuşak zemin ve yeşil alan çocukların neşeli ve güvenli vakit geçirmesini sağlar.' } },
      { img: 'assets/img/musaffo/avtoturargoh.webp',
        t: { uz: 'Avtoturargohlar', ru: 'Паркинг', en: 'Parking', fr: 'Parking', it: 'Parcheggio', es: 'Aparcamiento', de: 'Parkplätze', tr: 'Otopark' },
        d: { uz: "Avtomobilingizni har qanday ob-havoda himoya qiladi va harakatlanishni qulay qiladi. Loyiha hududida jami 1293 ta avtoturargoh barpo etiladi.",
             ru: 'Защищает автомобиль в любую погоду и делает передвижение удобным. На территории проекта будет построено 1293 машино-места.',
             en: 'Protects your car in any weather and makes getting around effortless. A total of 1,293 parking spaces are being built on site.',
             fr: 'Protège votre voiture par tous les temps et facilite vos déplacements. Au total, 1 293 places de parking sont construites sur le site.',
             it: "Protegge l'auto con qualsiasi tempo e rende comodi gli spostamenti. Nel complesso saranno realizzati 1.293 posti auto.",
             es: 'Protege su coche con cualquier clima y facilita los desplazamientos. En total se construyen 1.293 plazas de aparcamiento.',
             de: 'Schützt Ihr Auto bei jedem Wetter und macht das Unterwegssein bequem. Insgesamt entstehen 1.293 Stellplätze auf dem Gelände.',
             tr: 'Aracınızı her havada korur ve ulaşımı kolaylaştırır. Proje alanında toplam 1.293 otopark yeri inşa ediliyor.' } },
      { img: 'assets/img/musaffo/fitness-zona.webp',
        t: { uz: 'Fitness zona', ru: 'Фитнес-зона', en: 'Fitness zone', fr: 'Espace fitness', it: 'Area fitness', es: 'Zona fitness', de: 'Fitnessbereich', tr: 'Fitness alanı' },
        d: { uz: "Kunning istalgan vaqtida sport bilan shug'ullanish imkoniyati. Zamonaviy sharoit va qulay muhit — sog'lom turmush tarzi uchun.",
             ru: 'Возможность заниматься спортом в любое время дня. Современные условия и комфортная среда для здорового образа жизни.',
             en: 'Work out at any time of day. Modern equipment and a comfortable setting for a healthy lifestyle.',
             fr: "Faites du sport à toute heure. Des équipements modernes et un cadre agréable pour un mode de vie sain.",
             it: 'Allenati a qualsiasi ora del giorno. Attrezzature moderne e un ambiente confortevole per uno stile di vita sano.',
             es: 'Haga deporte a cualquier hora del día. Equipamiento moderno y un entorno cómodo para una vida saludable.',
             de: 'Sport zu jeder Tageszeit. Moderne Ausstattung und angenehme Atmosphäre für einen gesunden Lebensstil.',
             tr: 'Günün her saatinde spor yapma imkânı. Sağlıklı bir yaşam için modern ekipman ve konforlu ortam.' } },
      { img: 'assets/img/musaffo/zamonaviy-lift.webp',
        t: { uz: 'Zamonaviy lift', ru: 'Современные лифты', en: 'Modern lifts', fr: 'Ascenseurs modernes', it: 'Ascensori moderni', es: 'Ascensores modernos', de: 'Moderne Aufzüge', tr: 'Modern asansörler' },
        d: { uz: "Har bir podyezdda 2 tadan lift. Sokin va ravon ishlash, ventilyatsiya tizimi hamda o'ziga xos dizayn.",
             ru: 'По 2 лифта в каждом подъезде. Тихая и плавная работа, система вентиляции и фирменный дизайн.',
             en: 'Two lifts in every entrance — quiet, smooth operation, built-in ventilation and a signature design.',
             fr: 'Deux ascenseurs par entrée : fonctionnement silencieux et fluide, ventilation intégrée et design signature.',
             it: 'Due ascensori per ingresso: funzionamento silenzioso e fluido, ventilazione integrata e design esclusivo.',
             es: 'Dos ascensores en cada portal: funcionamiento silencioso y suave, ventilación integrada y diseño exclusivo.',
             de: 'Zwei Aufzüge pro Eingang – leise und ruhig, mit Belüftungssystem und unverwechselbarem Design.',
             tr: 'Her girişte 2 asansör: sessiz ve akıcı çalışma, havalandırma sistemi ve kendine özgü tasarım.' } },
      { img: 'assets/img/musaffo/kolyaska-velosiped.webp',
        t: { uz: 'Kolyaska va velosiped zonasi', ru: 'Колясочная и велопарковка', en: 'Stroller & bicycle room', fr: 'Local poussettes et vélos', it: 'Deposito passeggini e bici', es: 'Cuarto para carritos y bicicletas', de: 'Kinderwagen- und Fahrradraum', tr: 'Bebek arabası ve bisiklet alanı' },
        d: { uz: "Podyezd ichida maxsus ajratilgan hudud tartibni saqlaydi va rezidentlarga qulay hamda xavfsiz foydalanish imkonini beradi.",
             ru: 'Отдельное помещение в подъезде поддерживает порядок и даёт жильцам удобное и безопасное хранение.',
             en: 'A dedicated room inside the entrance keeps hallways tidy and gives residents convenient, secure storage.',
             fr: "Un espace dédié dans l'entrée garde les parties communes en ordre et offre aux résidents un rangement pratique et sûr.",
             it: "Uno spazio dedicato all'interno dell'ingresso mantiene l'ordine e offre ai residenti un deposito comodo e sicuro.",
             es: 'Un espacio exclusivo dentro del portal mantiene el orden y ofrece a los vecinos un almacenamiento cómodo y seguro.',
             de: 'Ein eigener Raum im Eingangsbereich sorgt für Ordnung und bietet den Bewohnern bequemen, sicheren Stauraum.',
             tr: 'Giriş içinde ayrılmış özel alan düzeni korur ve sakinlere rahat ve güvenli kullanım sağlar.' } }
    ],
    gallery: [
      { src: 'assets/img/musaffo/fasad-kunduzi.webp', t: { uz: 'Tashqi fasad — kunduzi', ru: 'Фасад днём', en: 'Façade by day', fr: 'Façade de jour', it: 'Facciata di giorno', es: 'Fachada de día', de: 'Fassade bei Tag', tr: 'Gündüz cephe' } },
      { src: 'assets/img/musaffo/majmua-kechki.webp', t: { uz: 'Kechki yoritilgan majmua', ru: 'Комплекс в вечерней подсветке', en: 'The complex at dusk', fr: 'La résidence au crépuscule', it: 'Il complesso al tramonto', es: 'El complejo al anochecer', de: 'Die Anlage in der Abendbeleuchtung', tr: 'Akşam ışıklarında kompleks' } },
      { src: 'assets/img/musaffo/musaffo-aerial-ig.webp', t: { uz: "Musaffo — yuqoridan ko'rinish", ru: 'Musaffo — вид сверху', en: 'Musaffo — aerial view', fr: 'Musaffo — vue aérienne', it: "Musaffo — vista dall'alto", es: 'Musaffo — vista aérea', de: 'Musaffo — Luftansicht', tr: 'Musaffo — kuşbakışı' } },
      { src: 'assets/img/musaffo/dupleks-interyer.webp', t: { uz: 'Dupleks — ikki qavatli makon', ru: 'Дуплекс — два уровня', en: 'Duplex — two levels', fr: 'Duplex sur deux niveaux', it: 'Duplex su due livelli', es: 'Dúplex de dos plantas', de: 'Duplex auf zwei Ebenen', tr: 'Dubleks — iki katlı yaşam' } },
      { src: 'assets/img/musaffo/mehmonxona.webp', t: { uz: 'Mehmonxona', ru: 'Гостиная', en: 'Living room', fr: 'Salon', it: 'Soggiorno', es: 'Salón', de: 'Wohnzimmer', tr: 'Oturma odası' } },
      { src: 'assets/img/musaffo/oshxona.webp', t: { uz: 'Oshxona', ru: 'Кухня', en: 'Kitchen', fr: 'Cuisine', it: 'Cucina', es: 'Cocina', de: 'Küche', tr: 'Mutfak' } },
      { src: 'assets/img/musaffo/yotoqxona.webp', t: { uz: 'Yotoqxona', ru: 'Спальня', en: 'Bedroom', fr: 'Chambre', it: 'Camera da letto', es: 'Dormitorio', de: 'Schlafzimmer', tr: 'Yatak odası' } }
    ],
    plans: [
      { rooms: 1, area: 53, img: 'assets/img/plans/1x-53.webp' },
      { rooms: 1, area: 45.6, img: 'assets/img/plans/1x-45-6.webp' },
      { rooms: 2, area: 66.6, img: 'assets/img/plans/2x-66-6.webp' },
      { rooms: 3, area: 68.11, img: 'assets/img/plans/3x-68-11.webp' },
      { rooms: 3, area: 71.51, img: 'assets/img/plans/3x-71-51.webp', balcony: true },
      { rooms: 4, area: 112.82, img: 'assets/img/plans/4x-112-82.webp' },
      { rooms: 4, area: 116.03, areaTxt: '116,03', img: 'assets/img/plans/4x-116-03.webp' },
      { rooms: 4, area: 119.2, areaTxt: '119,20', img: 'assets/img/plans/4x-119-20.webp' },
      { rooms: 2, area: 53.1, img: 'assets/img/plans/dupleks-2x-53-1.webp', duplex: 1 },
      { rooms: 2, area: 54.3, img: 'assets/img/plans/dupleks-2x-54-3.webp', duplex: 2, terrace: true },
      { rooms: 3, area: 66.3, img: 'assets/img/plans/dupleks-3x-66-3.webp', duplex: 1 },
      { rooms: 3, area: 62.7, img: 'assets/img/plans/dupleks-3x-62-7.webp', duplex: 2, terrace: true }
    ]
  },
  {
    id: 'obod',
    name: 'Obod Maskan',
    badge: { uz: 'Yangi loyiha', ru: 'Новый проект', en: 'New project', fr: 'Nouveau projet', it: 'Nuovo progetto', es: 'Nuevo proyecto', de: 'Neues Projekt', tr: 'Yeni proje' },
    district: { uz: "Ko'kcha Oqtepa hududi", ru: 'район Кукча-Октепа', en: 'Kukcha Oqtepa area', fr: 'Quartier de Kukcha Oqtepa', it: 'Zona Kukcha Oqtepa', es: 'Zona de Kukcha Oqtepa', de: 'Gebiet Kukcha Oqtepa', tr: 'Kukcha Oqtepa bölgesi' },
    address: { uz: "Ko'kcha Darvoza ko'chasi, 487D", ru: 'ул. Кукча Дарвоза, 487D', en: '487D Kukcha Darvoza Street', fr: '487D, rue Kukcha Darvoza', it: 'Via Kukcha Darvoza 487D', es: 'Calle Kukcha Darvoza, 487D', de: 'Kukcha-Darvoza-Straße 487D', tr: 'Kukcha Darvoza Caddesi, 487D' }, // TEKSHIRING
    geo: { lat: 41.3109, lng: 69.1852 },   // TEKSHIRING: taxminiy nuqta
    priceM2: null,
    cover: 'assets/img/obod/obod-joylashuv.webp', poster: true, video: null, presentation: '',
    lead: {
      uz: "Shahar markazi yaqinida yorqin hayot! Obod Maskan — Ko'kcha Oqtepa hududidagi yangi turar-joy majmuasi: maktab, bog'cha, shifoxona va savdo markazlari yaqin atrofda. Boshlang'ich to'lov 30% dan, qolgani quruvchining o'zi bilan foizsiz bo'lib to'lanadi.",
      ru: 'Яркая жизнь рядом с центром города! Obod Maskan — новый жилой комплекс в районе Кукча-Октепа: школа, детский сад, больница и торговые центры рядом. Первоначальный взнос от 30%, остаток — беспроцентная рассрочка напрямую от застройщика.',
      en: 'A vibrant life close to the city centre! Obod Maskan is a new residential complex in the Kukcha Oqtepa area, with a school, kindergarten, hospital and shopping centres nearby. Down payment from 30%, the balance paid interest-free directly to the developer.',
      fr: "Une vie lumineuse près du centre-ville ! Obod Maskan est une nouvelle résidence du quartier de Kukcha Oqtepa, avec école, crèche, hôpital et centres commerciaux à proximité. Apport dès 30 %, le solde payé sans intérêts directement au promoteur.",
      it: 'Una vita luminosa vicino al centro città! Obod Maskan è un nuovo complesso residenziale nella zona di Kukcha Oqtepa, con scuola, asilo, ospedale e centri commerciali nelle vicinanze. Anticipo dal 30%, il resto senza interessi direttamente al costruttore.',
      es: '¡Una vida luminosa cerca del centro de la ciudad! Obod Maskan es un nuevo complejo residencial en la zona de Kukcha Oqtepa, con colegio, guardería, hospital y centros comerciales cerca. Entrada desde el 30 %, el resto sin intereses directamente con la constructora.',
      de: 'Ein lebendiges Leben nahe dem Stadtzentrum! Obod Maskan ist eine neue Wohnanlage im Gebiet Kukcha Oqtepa – Schule, Kindergarten, Krankenhaus und Einkaufszentren in der Nähe. Anzahlung ab 30 %, der Rest zinsfrei direkt beim Bauträger.',
      tr: "Şehir merkezine yakın parlak bir yaşam! Obod Maskan, Kukcha Oqtepa bölgesinde yeni bir konut kompleksi: okul, anaokulu, hastane ve alışveriş merkezleri yakında. Peşinat %30'dan başlar, kalanı doğrudan müteahhide faizsiz ödenir."
    },
    facts: [
      { v: '30%', k: { uz: "dan boshlang'ich to'lov", ru: 'первый взнос от', en: 'down payment from', fr: "d'apport minimum", it: 'di anticipo minimo', es: 'de entrada mínima', de: 'Mindestanzahlung', tr: 'peşinattan başlayarak' } },
      { v: '0%', k: { uz: 'ustama va foiz', ru: 'переплата и процент', en: 'markup and interest', fr: "de majoration et d'intérêts", it: 'di ricarico e interessi', es: 'de recargo e intereses', de: 'Aufschlag und Zinsen', tr: 'ek ücret ve faiz' } }
    ],
    amenities: [],
    gallery: [
      { src: 'assets/img/obod/obod-joylashuv.webp', t: { uz: "Ko'kcha Oqtepa hududidagi infratuzilma xaritasi", ru: 'Карта инфраструктуры района Кукча-Октепа', en: 'Infrastructure map of the Kukcha Oqtepa area', fr: 'Carte des équipements du quartier de Kukcha Oqtepa', it: 'Mappa dei servizi della zona di Kukcha Oqtepa', es: 'Mapa de servicios de la zona de Kukcha Oqtepa', de: 'Infrastrukturkarte des Gebiets Kukcha Oqtepa', tr: 'Kukcha Oqtepa bölgesi altyapı haritası' } },
      { src: 'assets/img/obod/obod-toshkent.webp', t: { uz: 'Obod Maskan — Toshkent shahridan xonadon', ru: 'Obod Maskan — квартира в Ташкенте', en: 'Obod Maskan — a home in Tashkent', fr: 'Obod Maskan — un logement à Tachkent', it: 'Obod Maskan — una casa a Tashkent', es: 'Obod Maskan — una vivienda en Taskent', de: 'Obod Maskan — ein Zuhause in Taschkent', tr: "Obod Maskan — Taşkent'te bir ev" } }
    ],
    plans: []
  },
  {
    id: 'kokcha',
    name: "Ko'kcha Oqtepa",
    badge: { uz: 'Komfort-klass', ru: 'Комфорт-класс', en: 'Comfort class', fr: 'Classe confort', it: 'Classe comfort', es: 'Clase confort', de: 'Komfortklasse', tr: 'Konfor sınıfı' },
    district: { uz: 'Uchtepa tumani', ru: 'Учтепинский район', en: 'Uchtepa district', fr: "District d'Outchtepa", it: 'Distretto di Uchtepa', es: 'Distrito de Uchtepa', de: 'Bezirk Uchtepa', tr: 'Uchtepa ilçesi' },
    address: { uz: "Ko'kcha-Oqtepa mahallasi", ru: 'махалля Кукча-Октепа', en: 'Kukcha-Oqtepa neighbourhood', fr: 'Quartier Kukcha-Oqtepa', it: 'Quartiere Kukcha-Oqtepa', es: 'Barrio Kukcha-Oqtepa', de: 'Viertel Kukcha-Oqtepa', tr: 'Kukcha-Oqtepa mahallesi' }, // TEKSHIRING
    geo: { lat: 41.3145, lng: 69.1905 },   // TEKSHIRING: taxminiy nuqta
    priceM2: null,
    cover: '', video: null, presentation: '',
    lead: {
      uz: "Ko'kcha dahasidagi g'ishtli turar-joy majmuasi: keng hovli, oilaviy rejalar va shaharning tarixiy qismiga yaqinlik. Rasmlar va rejalarni @arthouse.tashkent sahifasidagi «Ko'kcha Oqtepa» bo'limida ko'rishingiz mumkin.",
      ru: 'Кирпичный жилой комплекс в районе Кукча: просторный двор, семейные планировки и близость к исторической части города. Фото и планировки — в разделе «Ko\'kcha Oqtepa» на странице @arthouse.tashkent.',
      en: "A brick-built residential complex in the Kukcha area: a spacious courtyard, family-sized layouts and easy reach of the historic city. See photos and floor plans in the “Ko'kcha Oqtepa” highlight on @arthouse.tashkent.",
      fr: "Une résidence en brique dans le quartier de Kukcha : vaste cour, plans familiaux et proximité du centre historique. Photos et plans dans la story à la une « Ko'kcha Oqtepa » de @arthouse.tashkent.",
      it: "Un complesso residenziale in mattoni nella zona di Kukcha: ampio cortile, planimetrie per famiglie e vicinanza al centro storico. Foto e planimetrie nella storia in evidenza «Ko'kcha Oqtepa» su @arthouse.tashkent.",
      es: "Un complejo residencial de ladrillo en la zona de Kukcha: amplio patio, distribuciones familiares y cercanía al casco histórico. Fotos y planos en la historia destacada «Ko'kcha Oqtepa» de @arthouse.tashkent.",
      de: "Eine Wohnanlage in Ziegelbauweise im Gebiet Kukcha: großer Innenhof, familienfreundliche Grundrisse und Nähe zur historischen Altstadt. Fotos und Grundrisse im Highlight „Ko'kcha Oqtepa“ auf @arthouse.tashkent.",
      tr: "Kukcha bölgesinde tuğla bir konut kompleksi: geniş avlu, aile tipi planlar ve tarihi şehir merkezine yakınlık. Fotoğraflar ve planlar @arthouse.tashkent sayfasındaki «Ko'kcha Oqtepa» öne çıkanlarında."
    },
    facts: [ // TEKSHIRING
      { v: '12', k: { uz: "g'ishtli bino", ru: 'кирпичных домов', en: 'brick buildings', fr: 'bâtiments en brique', it: 'edifici in mattoni', es: 'edificios de ladrillo', de: 'Ziegelbauten', tr: 'tuğla bina' } },
      { v: '11', k: { uz: 'qavatli', ru: 'этажей', en: 'floors', fr: 'étages', it: 'piani', es: 'plantas', de: 'Etagen', tr: 'kat' } },
      { v: '1000+', k: { uz: 'xonadon', ru: 'квартир', en: 'apartments', fr: 'appartements', it: 'appartamenti', es: 'viviendas', de: 'Wohnungen', tr: 'daire' } }
    ],
    amenities: [], gallery: [], plans: []
  }
];

/* @arthouse.tashkent'da tilga olingan barcha loyihalar (ob-havo posti bo'yicha) */
window.ALL_PROJECT_NAMES = ['Musaffo', 'Obod Maskan', "Ko'kcha Oqtepa", 'Art Tower', 'Sputnik', 'Brilliant'];
