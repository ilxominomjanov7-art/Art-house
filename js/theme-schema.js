/* =====================================================================
   ART HOUSE — MAVZULAR VA BO'LIMLAR SXEMASI (sayt + kabinet uchun umumiy)
   Shopify'dagi «section schema» mantig'i: har bir bo'lim turi o'z sozlamalari
   (settings) va bloklari (blocks) bilan tavsiflanadi. Kabinetdagi mavzu
   tahrirlagichi formalarni shu sxemadan quradi, sayt (js/theme.js) esa
   bo'limlarni shu ma'lumot asosida chizadi.

   Ma'lumot joyi: localStorage 'ah_cms' → themes = {
     live: 'main',                       // saytda ko'rinadigan (nashr qilingan) mavzu
     list: [{ id, name, at,              // mavzular kutubxonasi
       s:     { palette, colors, font, btn, surface },   // mavzu sozlamalari
       order: ['hero', 'stars', …],      // bosh sahifadagi bo'limlar tartibi
       sec:   { id: { type, on, s: {…}, b: [{ id, type, … }] } },
       text:  { uz: { 'kalit': 'matn' } } // asl bo'limlar matnlari (ustun turadi)
     }]
   }
   Matnlarda {years}, {projects}, {months}, {down} — Sozlamalar → Raqamlar qiymatlari.
   Rasm manbalari js/cms-apply.js dagidek: 'base:gallery:3:musaffo' — loyihaning asl rasmi,
   'idb:…' — kabinetdan yuklangan fayl, 'https://…' / 'media/…' — to'g'ridan-to'g'ri manzil.
   ===================================================================== */
(function () {
  'use strict';
  var LANGS = ['uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr'];
  /* ml('uz', 'ru', 'en', 'fr', 'it', 'es', 'de', 'tr') → { uz: …, ru: … } */
  function ml() { var o = {}, a = arguments; LANGS.forEach(function (l, i) { if (a[i] != null) o[l] = a[i]; }); return o; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function uid(p) { return (p || 'x') + Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 6); }

  /* ---------------- mavzu palitralari ---------------- */
  var PALETTES = {
    emerald: { name: 'Zumrad Prime', note: "Joriy uslub: boy zumrad va shampan oltin", colors: {}, sw: ['#0B392C', '#E8D5A4', '#F4EEDF'] },
    spring: { name: "Bahor zumradi", note: "Ochroq, yorug' yashil va yumshoq oltin",
      colors: { bg: '#135643', bg2: '#104C3B', bg3: '#186450', deep: '#0C3E30', gold: '#EBD9A9', goldHi: '#F8EFD6', gold2: '#CFB57E', ink: '#F7F2E6' }, sw: ['#135643', '#EBD9A9', '#F7F2E6'] },
    golden: { name: 'Oltin kech', note: "To'q yashil va boy, issiq oltin",
      colors: { bg: '#0D3A2D', bg2: '#0B3328', bg3: '#104536', deep: '#082B21', gold: '#E4C47E', goldHi: '#F4E2B0', gold2: '#C49D52', ink: '#F6EEDC' }, sw: ['#0D3A2D', '#E4C47E', '#F6EEDC'] },
    malachite: { name: 'Malaxit', note: "Chuqur, sokin tungi zumrad",
      colors: { bg: '#082C22', bg2: '#06251C', bg3: '#0B372A', deep: '#041D16', gold: '#DCC48F', goldHi: '#F1E3BD', gold2: '#B99C62', ink: '#F1EBDD' }, sw: ['#082C22', '#DCC48F', '#F1EBDD'] }
  };
  var FONTS = {
    cormorant: { name: 'Cormorant Garamond', css: "'Cormorant Garamond', 'Times New Roman', serif" },
    cinzel: { name: 'Cinzel', css: "'Cinzel', 'Cormorant Garamond', serif" },
    manrope: { name: 'Manrope', css: "'Manrope', system-ui, sans-serif" }
  };

  /* ---------------- maydon turlari ----------------
     text/area — ko'p tilli matn; plain — bitta qiymat; num; check; select (o: [[qiymat, nom]]);
     image/video — fayl yuklash yoki havola; url; date */
  var KIND = [['star', 'Yulduz'], ['client', 'Mijoz'], ['gift', "Sovg'a"]];
  var ACT = [['book', 'Band qilish oynasi'], ['phone', "Qo'ng'iroq"], ['video', "Video-qo'ng'iroq"], ['telegram', 'Telegram'], ['projects', 'Loyihalar sahifasi'], ['calc', 'Kalkulyator'], ['link', 'Havola']];
  var ICONS = [['build', 'Bino'], ['percent', 'Foiz'], ['doc', 'Hujjat'], ['shield', 'Qalqon'], ['key', 'Kalit'], ['hand', "Qo'l"], ['star', 'Yulduz'], ['pin', 'Manzil'], ['clock', 'Soat']];

  /* ---------------- asl (saytda mavjud) bo'limlar ----------------
     find — bo'lim elementi; has — #p-home ichidagi shu elementni o'z ichiga olgan blok;
     keys — JS orqali chiziladigan matnlar kalitlari (HTML'dagi [data-i] avtomatik topiladi) */
  var NATIVE = [
    { id: 'ann', name: "E'lon qatori", icon: 'megaphone', group: 'header', find: '.top > .ann', keys: ['ann.1', 'ann.2', 'ann.3'] },
    { id: 'hero', name: 'Bosh banner', icon: 'image', find: '#p-home > .hero' },
    { id: 'marquee', name: 'Yuguruvchi qator', icon: 'text', find: '#p-home > .marquee', keys: ['marquee'] },
    { id: 'apts', name: 'Xonadonlar karuseli', icon: 'grid', find: '#hiApts', keys: ['hi.apts', 'hi.from', 'hi.view'] },
    { id: 'art', name: "Yashash san'ati", icon: 'list', find: '#hiArt', keys: ['hi.artT', 'hi.artS', 'hi.u1t', 'hi.u1d', 'hi.u2t', 'hi.u2d', 'hi.u3t', 'hi.u3d', 'hi.u4t', 'hi.u4d'] },
    { id: 'tiles', name: 'Xonalar plitkalari', icon: 'grid', find: '#hiTiles' },
    { id: 'projects', name: 'Loyihalar', icon: 'building', has: '#homeProjects' },
    { id: 'build', name: 'Qurilish jarayoni', icon: 'video', find: '#hiBuild', keys: ['hi.bldE', 'hi.bldT', 'hi.bldD', 'hi.bldB'] },
    { id: 'calc', name: 'Kalkulyator va joylashuv', icon: 'calc', has: '#miniCalc' },
    { id: 'teaser', name: 'Biz haqimizda va izohlar (qisqa)', icon: 'text', has: '#homeRating' },
    { id: 'amb', name: 'Bizni tanlaganlar (kartalar)', icon: 'star', find: '#ambSec', keys: ['amb.title', 'amb.sub'] },
    { id: 'contact', name: "Menejer bilan bog'lanish", icon: 'phone', has: '.cta-band' },
    { id: 'office', name: 'Savdo ofisi', icon: 'pin', find: '#hiOffice', keys: ['hi.offT', 'hi.offD', 'hi.map', 'hi.call'] },
    { id: 'ig', name: 'Instagram lentasi', icon: 'ig', find: '#igStrip', keys: ['ig.follow'] },
    { id: 'bar', name: 'Afzalliklar qatori', icon: 'list', find: '#hiBar', keys: ['hi.b1t', 'hi.b1d', 'hi.b2t', 'hi.b2d', 'hi.b3t', 'hi.b3d'] },
    { id: 'gallery', name: 'Foto va video galereya', icon: 'image', find: '#cmsGal' }
  ];

  /* ---------------- yangi bo'lim turlari ---------------- */
  var TYPES = {
    stars: {
      name: 'Yulduzlar va mijozlar tanlovi', icon: 'star', note: "Taniqli insonlar va xaridorlarning videolari, sovg'a topshirish lahzalari va fikrlari",
      settings: [
        { k: 'eyebrow', t: 'text', l: 'Kichik sarlavha' },
        { k: 'title', t: 'text', l: 'Sarlavha' },
        { k: 'sub', t: 'area', l: 'Tavsif' },
        { k: 'filters', t: 'check', l: "Saralash tugmalari (Yulduzlar / Mijozlar / Sovg'alar)" },
        { k: 'proof', t: 'check', l: "Ishonch raqamlari (baho, obunachilar, loyihalar)" },
        { k: 'reviews', t: 'check', l: "Saytdagi video-izohlarni ham ko'rsatish" },
        { k: 'ctaOn', t: 'check', l: 'Pastda harakatga chaqiruv' },
        { k: 'cta', t: 'text', l: 'Chaqiruv matni', when: 'ctaOn' },
        { k: 'btn', t: 'text', l: 'Tugma matni', when: 'ctaOn' }
      ],
      blocks: {
        video: { name: 'Video', icon: 'video', title: 'name', fields: [
          { k: 'kind', t: 'select', l: 'Turi', o: KIND },
          { k: 'name', t: 'text', l: 'Ism yoki nom' },
          { k: 'role', t: 'text', l: 'Kim (kasbi, loyiha)' },
          { k: 'quote', t: 'area', l: 'Qisqa fikr (ixtiyoriy)' },
          { k: 'video', t: 'video', l: 'Video fayl' },
          { k: 'link', t: 'url', l: 'yoki YouTube / Instagram havolasi' },
          { k: 'poster', t: 'image', l: 'Muqova rasmi' },
          { k: 'verified', t: 'check', l: 'Tasdiqlangan belgisi' }
        ] },
        quote: { name: 'Fikr (matn)', icon: 'quote', title: 'name', fields: [
          { k: 'kind', t: 'select', l: 'Turi', o: KIND.slice(0, 2) },
          { k: 'name', t: 'text', l: 'Ism' },
          { k: 'role', t: 'text', l: 'Kim (kasbi, loyiha)' },
          { k: 'photo', t: 'image', l: 'Surat' },
          { k: 'text', t: 'area', l: 'Fikr matni' },
          { k: 'rating', t: 'select', l: 'Baho', o: [['5', '★★★★★'], ['4', '★★★★'], ['3', '★★★']] }
        ] }
      },
      max: 24
    },
    about: {
      name: 'Biz haqimizda', icon: 'building', note: '15 yillik tajriba, 30+ loyiha, manzil va afzalliklar',
      settings: [
        { k: 'eyebrow', t: 'text', l: 'Kichik sarlavha' },
        { k: 'title', t: 'text', l: 'Sarlavha' },
        { k: 'text', t: 'area', l: 'Asosiy matn' },
        { k: 'image', t: 'image', l: 'Rasm' },
        { k: 'badge', t: 'text', l: "Rasm ustidagi yozuv ({years} raqami bilan)" },
        { k: 'locTitle', t: 'text', l: 'Manzil sarlavhasi' },
        { k: 'address', t: 'text', l: 'Manzil' },
        { k: 'locNote', t: 'area', l: 'Manzil haqida' },
        { k: 'map', t: 'url', l: 'Xarita havolasi' },
        { k: 'btn', t: 'text', l: 'Tugma matni' },
        { k: 'act', t: 'select', l: 'Tugma vazifasi', o: ACT },
        { k: 'url', t: 'url', l: 'Havola', when: 'act=link' }
      ],
      blocks: {
        stat: { name: 'Raqam', icon: 'hash', title: 'value', fields: [
          { k: 'value', t: 'plain', l: "Qiymat ({years}, {projects}, {months} yoki o'zingiz yozing)" },
          { k: 'label', t: 'text', l: 'Izoh' }
        ] },
        point: { name: 'Afzallik', icon: 'check', title: 'title', fields: [
          { k: 'icon', t: 'select', l: 'Ikonka', o: ICONS },
          { k: 'title', t: 'text', l: 'Sarlavha' },
          { k: 'text', t: 'area', l: 'Matn' }
        ] }
      },
      max: 12
    },
    cta: {
      name: 'Taklif va harakatga chaqiruv', icon: 'target', note: "Kuchli sarlavha, ariza formasi, tugmalar va taklif muddati",
      settings: [
        { k: 'eyebrow', t: 'text', l: 'Kichik sarlavha' },
        { k: 'title', t: 'area', l: 'Kuchli sarlavha' },
        { k: 'text', t: 'area', l: 'Matn' },
        { k: 'big', t: 'plain', l: 'Katta raqam (masalan, 33%)' },
        { k: 'bigLabel', t: 'text', l: 'Raqam ostidagi yozuv' },
        { k: 'image', t: 'image', l: 'Fon rasmi' },
        { k: 'btn1', t: 'text', l: '1-tugma' },
        { k: 'act1', t: 'select', l: '1-tugma vazifasi', o: ACT },
        { k: 'url1', t: 'url', l: '1-tugma havolasi', when: 'act1=link' },
        { k: 'btn2', t: 'text', l: '2-tugma' },
        { k: 'act2', t: 'select', l: '2-tugma vazifasi', o: ACT },
        { k: 'url2', t: 'url', l: '2-tugma havolasi', when: 'act2=link' },
        { k: 'form', t: 'check', l: 'Ariza formasi (ism + telefon)' },
        { k: 'formTitle', t: 'text', l: 'Forma sarlavhasi', when: 'form' },
        { k: 'formText', t: 'area', l: 'Forma matni', when: 'form' },
        { k: 'formBtn', t: 'text', l: 'Forma tugmasi', when: 'form' },
        { k: 'timer', t: 'check', l: 'Taklif muddati (teskari sanoq)' },
        { k: 'until', t: 'date', l: 'Taklif tugash sanasi', when: 'timer' },
        { k: 'timerLabel', t: 'text', l: 'Sanoq yozuvi', when: 'timer' }
      ],
      blocks: {
        chip: { name: 'Afzallik belgisi', icon: 'check', title: 'text', fields: [{ k: 'text', t: 'text', l: 'Matn' }] }
      },
      max: 6
    },
    richtext: {
      name: 'Matn va tugma', icon: 'text', note: "Sarlavha, matn va bitta tugma — har qanday e'lon uchun", multi: true,
      settings: [
        { k: 'eyebrow', t: 'text', l: 'Kichik sarlavha' },
        { k: 'title', t: 'text', l: 'Sarlavha' },
        { k: 'text', t: 'area', l: 'Matn' },
        { k: 'btn', t: 'text', l: 'Tugma matni' },
        { k: 'act', t: 'select', l: 'Tugma vazifasi', o: ACT },
        { k: 'url', t: 'url', l: 'Havola', when: 'act=link' },
        { k: 'align', t: 'select', l: 'Joylashuv', o: [['center', "O'rtada"], ['left', 'Chapda']] }
      ]
    },
    video: {
      name: 'Video', icon: 'video', note: 'Bitta katta video: marosim, intervyu yoki obyekt sharhi', multi: true,
      settings: [
        { k: 'eyebrow', t: 'text', l: 'Kichik sarlavha' },
        { k: 'title', t: 'text', l: 'Sarlavha' },
        { k: 'text', t: 'area', l: 'Matn' },
        { k: 'video', t: 'video', l: 'Video fayl' },
        { k: 'link', t: 'url', l: 'yoki YouTube / Instagram havolasi' },
        { k: 'poster', t: 'image', l: 'Muqova rasmi' }
      ]
    }
  };

  /* ---------------- standart kontent ---------------- */
  var ROLE_BLOGGER = ml('Bloger, Nyu-York', 'Блогер, Нью-Йорк', 'Blogger, New York', 'Blogueuse, New York', 'Blogger, New York', 'Bloguera, Nueva York', 'Bloggerin, New York', 'Blogger, New York');
  var BOOK = ml('Xonadonni band qilish', 'Забронировать квартиру', 'Reserve an apartment', 'Réserver un appartement', 'Prenota un appartamento', 'Reservar un apartamento', 'Wohnung reservieren', 'Daire ayırtın');
  var DEF = {
    stars: function () {
      return { type: 'stars', on: true, s: {
        eyebrow: ml('Haqiqiy insonlar · Haqiqiy quvonch', 'Реальные люди · Настоящая радость', 'Real people · Real joy', 'Des personnes réelles · Une vraie joie', 'Persone vere · Gioia vera', 'Personas reales · Alegría real', 'Echte Menschen · Echte Freude', 'Gerçek insanlar · Gerçek mutluluk'),
        title: ml('Yulduzlar va mijozlar tanlovi', 'Выбор звёзд и клиентов', 'The choice of stars and clients', 'Le choix des stars et des clients', 'La scelta di star e clienti', 'La elección de estrellas y clientes', 'Die Wahl von Stars und Kunden', 'Yıldızların ve müşterilerin tercihi'),
        sub: ml("Taniqli insonlar va oddiy oilalar Art House'ni tanladi. Kalit topshirish, sovg'alar va yangi uydagi ilk kunlar — ularning quvonchini o'z ko'zingiz bilan ko'ring.",
          'Известные люди и обычные семьи выбрали Art House. Вручение ключей, подарки и первые дни в новом доме — увидьте их радость своими глазами.',
          'Well-known personalities and ordinary families chose Art House. Key handovers, gifts and first days in a new home — see their joy with your own eyes.',
          'Des personnalités connues et des familles ordinaires ont choisi Art House. Remise des clés, cadeaux et premiers jours dans un nouveau foyer : voyez leur joie de vos propres yeux.',
          'Personaggi noti e famiglie comuni hanno scelto Art House. Consegna delle chiavi, regali e i primi giorni nella nuova casa: guardate la loro gioia con i vostri occhi.',
          'Personas conocidas y familias corrientes eligieron Art House. Entrega de llaves, regalos y los primeros días en su nuevo hogar: vea su alegría con sus propios ojos.',
          'Bekannte Persönlichkeiten und ganz normale Familien haben sich für Art House entschieden. Schlüsselübergaben, Geschenke und die ersten Tage im neuen Zuhause – sehen Sie ihre Freude mit eigenen Augen.',
          "Tanınmış isimler ve sıradan aileler Art House'u seçti. Anahtar teslimi, hediyeler ve yeni evdeki ilk günler — mutluluklarını kendi gözlerinizle görün."),
        filters: true, proof: true, reviews: true, ctaOn: true,
        cta: ml("Siz ham baxtli oilalarimiz safiga qo'shiling", 'Присоединяйтесь к нашим счастливым семьям', 'Join our happy families', 'Rejoignez nos familles heureuses', 'Unitevi alle nostre famiglie felici', 'Únase a nuestras familias felices', 'Werden Sie Teil unserer glücklichen Familien', 'Mutlu ailelerimize siz de katılın'),
        btn: BOOK
      }, b: [
        { id: uid('b'), type: 'video', kind: 'gift', video: 'media/art-house-festival.mp4', poster: 'media/art-house-festival.jpg',
          name: ml('ART HOUSE bayrami', 'Праздник ART HOUSE', 'ART HOUSE festival', 'Fête ART HOUSE', 'Festa ART HOUSE', 'Fiesta ART HOUSE', 'ART HOUSE Fest', 'ART HOUSE şenliği'),
          role: ml("Rezidentlar uchun konsert va sovg'alar", 'Концерт и подарки для жителей', 'Concert and gifts for residents', 'Concert et cadeaux pour les résidents', 'Concerto e regali per i residenti', 'Concierto y regalos para los vecinos', 'Konzert und Geschenke für die Bewohner', 'Sakinlere konser ve hediyeler') },
        { id: uid('b'), type: 'video', kind: 'star', sample: true, verified: true, name: { uz: 'Madina' }, role: ROLE_BLOGGER, poster: 'base:gallery:3:musaffo' },
        { id: uid('b'), type: 'video', kind: 'client', sample: true, poster: 'base:gallery:4:musaffo',
          name: ml('Mijoz oilasi', 'Семья клиента', 'Client family', 'Famille cliente', 'Famiglia cliente', 'Familia cliente', 'Kundenfamilie', 'Müşteri ailesi'),
          role: ml('Musaffo · kalit topshirish', 'Musaffo · вручение ключей', 'Musaffo · key handover', 'Musaffo · remise des clés', 'Musaffo · consegna delle chiavi', 'Musaffo · entrega de llaves', 'Musaffo · Schlüsselübergabe', 'Musaffo · anahtar teslimi') },
        { id: uid('b'), type: 'video', kind: 'gift', sample: true, poster: 'base:gallery:1:musaffo',
          name: ml("Sovg'a topshirish marosimi", 'Церемония вручения подарков', 'Gift ceremony', 'Remise des cadeaux', 'Consegna dei regali', 'Entrega de regalos', 'Geschenkübergabe', 'Hediye töreni'),
          role: ml('Yangi uy egalariga', 'Новым владельцам квартир', 'For new homeowners', 'Pour les nouveaux propriétaires', 'Per i nuovi proprietari', 'Para los nuevos propietarios', 'Für neue Eigentümer', 'Yeni ev sahiplerine') },
        { id: uid('b'), type: 'quote', kind: 'client', sample: true, rating: '5',
          name: ml('Mijoz ismi', 'Имя клиента', 'Client name', 'Nom du client', 'Nome del cliente', 'Nombre del cliente', 'Name des Kunden', 'Müşteri adı'),
          text: ml("Bu yerga mijoz yoki taniqli insonning haqiqiy fikri yoziladi.", 'Здесь будет настоящий отзыв клиента или известного человека.', 'A real quote from a client or a well-known person goes here.', 'Ici figurera le véritable avis d’un client ou d’une personnalité.', 'Qui va la vera opinione di un cliente o di un personaggio noto.', 'Aquí va la opinión real de un cliente o de una persona conocida.', 'Hier steht die echte Meinung eines Kunden oder einer bekannten Person.', 'Buraya bir müşterinin veya tanınmış birinin gerçek görüşü yazılır.') }
      ] };
    },
    about: function () {
      return { type: 'about', on: true, s: {
        eyebrow: ml('Biz haqimizda', 'О компании', 'About us', 'À propos', 'Chi siamo', 'Quiénes somos', 'Über uns', 'Hakkımızda'),
        title: ml('Biz uy emas — ishonch quramiz', 'Мы строим не просто дома — мы строим доверие', "We don't just build homes — we build trust", 'Nous ne bâtissons pas que des logements — nous bâtissons la confiance', 'Non costruiamo solo case: costruiamo fiducia', 'No solo construimos viviendas: construimos confianza', 'Wir bauen nicht nur Wohnungen – wir bauen Vertrauen', 'Sadece ev değil, güven inşa ediyoruz'),
        text: ml("Art House — {years} yillik tajribaga ega quruvchi kompaniya. Shu yillar davomida Toshkentda {projects} ko'p qavatli turar-joy loyihasini amalga oshirdik. Har bir uyimiz mustahkam konstruksiya, o'ylangan rejalar va halol shartlar ustiga quriladi: bank kreditisiz, 0% ustama bilan, quruvchining o'zidan.",
          'Art House — застройщик с опытом {years} лет. За эти годы мы реализовали в Ташкенте {projects} проектов многоэтажных жилых домов. Каждый наш дом стоит на надёжной конструкции, продуманных планировках и честных условиях: без банковского кредита, без наценки, напрямую от застройщика.',
          'Art House is a developer with {years} years of experience. Over these years we have delivered {projects} multi-storey residential projects in Tashkent. Every home stands on a solid structure, well-thought-out layouts and honest terms: no bank loan, 0% markup, direct from the developer.',
          "Art House est un promoteur fort de {years} ans d'expérience. Au fil de ces années, nous avons réalisé à Tachkent {projects} projets d'immeubles résidentiels. Chaque logement repose sur une structure solide, des plans réfléchis et des conditions honnêtes : sans crédit bancaire, 0 % de majoration, en direct du promoteur.",
          'Art House è un costruttore con {years} anni di esperienza. In questi anni abbiamo realizzato a Tashkent {projects} progetti residenziali multipiano. Ogni casa poggia su una struttura solida, planimetrie studiate e condizioni oneste: senza mutuo bancario, 0% di maggiorazione, direttamente dal costruttore.',
          'Art House es una promotora con {years} años de experiencia. En este tiempo hemos realizado en Taskent {projects} proyectos residenciales de varias plantas. Cada vivienda se apoya en una estructura sólida, planos bien pensados y condiciones honestas: sin crédito bancario, 0 % de recargo, directamente de la promotora.',
          'Art House ist ein Bauträger mit {years} Jahren Erfahrung. In dieser Zeit haben wir in Taschkent {projects} mehrgeschossige Wohnprojekte realisiert. Jedes Zuhause steht auf einer soliden Konstruktion, durchdachten Grundrissen und fairen Bedingungen: ohne Bankkredit, 0 % Aufschlag, direkt vom Bauträger.',
          "Art House, {years} yıllık deneyime sahip bir müteahhit firmadır. Bu yıllar boyunca Taşkent'te {projects} çok katlı konut projesini hayata geçirdik. Her evimiz sağlam bir yapı, iyi düşünülmüş planlar ve dürüst koşullar üzerine kurulur: banka kredisi yok, %0 ek ücret, doğrudan müteahhitten."),
        image: 'base:gallery:0:musaffo',
        badge: ml('yillik ishonch', 'лет доверия', 'years of trust', 'ans de confiance', 'anni di fiducia', 'años de confianza', 'Jahre Vertrauen', 'yıllık güven'),
        locTitle: ml('Bosh ofisimiz — Yunusobodda', 'Наш главный офис — в Юнусабаде', 'Our head office is in Yunusabad', 'Notre siège est à Iounoussabad', 'La nostra sede è a Yunusabad', 'Nuestra oficina central está en Yunusabad', 'Unser Hauptbüro liegt in Yunusabad', "Merkez ofisimiz Yunusabad'da"),
        address: ml("Yunusobod tumani, «High Town» — «Siti Mall» savdo markazi ortida", 'Юнусабадский район, «High Town» — за ТЦ «Siti Mall»', 'Yunusabad district, High Town — right behind Siti Mall', 'District de Iounoussabad, High Town — juste derrière le centre commercial Siti Mall', 'Distretto di Yunusabad, High Town — proprio dietro il centro commerciale Siti Mall', 'Distrito de Yunusabad, High Town — justo detrás del centro comercial Siti Mall', 'Bezirk Yunusabad, High Town — direkt hinter dem Einkaufszentrum Siti Mall', "Yunusabad ilçesi, High Town — Siti Mall AVM'nin hemen arkasında"),
        locNote: ml("Ofisimizga keling: loyihalar maketini ko'rasiz, o'zingizga mos rejani tanlaysiz va barcha savollaringizni menejer bilan yuzma-yuz hal qilasiz.",
          'Приходите в офис: посмотрите макеты проектов, выберите подходящую планировку и обсудите все вопросы с менеджером лично.',
          'Visit our office: see the project models, choose the layout that suits you and settle every question with a manager in person.',
          'Venez à notre bureau : découvrez les maquettes, choisissez le plan qui vous convient et réglez toutes vos questions en personne avec un conseiller.',
          'Venite in ufficio: vedrete i plastici dei progetti, sceglierete la planimetria adatta e chiarirete ogni dubbio di persona con un consulente.',
          'Visite nuestra oficina: verá las maquetas, elegirá la distribución que le conviene y resolverá todas sus dudas en persona con un asesor.',
          'Besuchen Sie unser Büro: Sehen Sie die Projektmodelle, wählen Sie den passenden Grundriss und klären Sie alle Fragen persönlich mit einem Berater.',
          'Ofisimize gelin: proje maketlerini görün, size uygun planı seçin ve tüm sorularınızı danışmanla yüz yüze konuşun.'),
        map: 'https://yandex.uz/maps/?text=' + encodeURIComponent('High Town, Yunusobod, Toshkent'),
        btn: ml('Loyihalar bilan tanishish', 'Смотреть проекты', 'Explore the projects', 'Découvrir les projets', 'Scopri i progetti', 'Ver los proyectos', 'Projekte entdecken', 'Projeleri keşfedin'),
        act: 'projects'
      }, b: [
        { id: uid('b'), type: 'stat', value: '{years}', label: ml('yillik tajriba', 'лет опыта', 'years of experience', "ans d'expérience", 'anni di esperienza', 'años de experiencia', 'Jahre Erfahrung', 'yıllık deneyim') },
        { id: uid('b'), type: 'stat', value: '{projects}', label: ml("ko'p qavatli uy loyihasi", 'многоэтажных проектов', 'multi-storey projects', "projets d'immeubles", 'progetti multipiano', 'proyectos de varias plantas', 'Mehrgeschossbauten', 'çok katlı proje') },
        { id: uid('b'), type: 'stat', value: '0%', label: ml('ustama va foiz', 'наценки и процентов', 'markup and interest', "de majoration et d'intérêts", 'di maggiorazione e interessi', 'de recargo e intereses', 'Aufschlag und Zinsen', 'ek ücret ve faiz') },
        { id: uid('b'), type: 'stat', value: '{months}', label: ml("oygacha bo'lib to'lash", 'месяцев рассрочки', 'months of instalments', "mois d'échelonnement", 'mesi di rateizzazione', 'meses a plazos', 'Monate Ratenzahlung', 'aya kadar taksit') },
        { id: uid('b'), type: 'point', icon: 'shield',
          title: ml('Rasmiy shartnoma', 'Официальный договор', 'Official contract', 'Contrat officiel', 'Contratto ufficiale', 'Contrato oficial', 'Offizieller Vertrag', 'Resmi sözleşme'),
          text: ml("Narx va to'lov grafigi shartnomada aniq yoziladi.", 'Цена и график платежей прописаны в договоре.', 'The price and payment schedule are written into the contract.', "Le prix et l'échéancier figurent noir sur blanc dans le contrat.", 'Prezzo e piano dei pagamenti sono scritti nel contratto.', 'El precio y el calendario de pagos figuran en el contrato.', 'Preis und Zahlungsplan stehen im Vertrag.', 'Fiyat ve ödeme planı sözleşmede açıkça yazılır.') },
        { id: uid('b'), type: 'point', icon: 'key',
          title: ml('Kalitgacha hamrohlik', 'С вами до ключей', 'With you up to the keys', "À vos côtés jusqu'aux clés", 'Con voi fino alle chiavi', 'Con usted hasta las llaves', 'Begleitung bis zur Schlüsselübergabe', 'Anahtara kadar yanınızda'),
          text: ml('Tanlovdan kalit topshirilgunga qadar shaxsiy menejer.', 'Личный менеджер — от выбора до вручения ключей.', 'A personal manager from choosing to the key handover.', "Un conseiller personnel, du choix jusqu'à la remise des clés.", 'Un consulente personale dalla scelta alla consegna delle chiavi.', 'Un asesor personal desde la elección hasta la entrega de llaves.', 'Ein persönlicher Berater von der Auswahl bis zur Schlüsselübergabe.', 'Seçimden anahtar teslimine kadar kişisel danışman.') },
        { id: uid('b'), type: 'point', icon: 'percent',
          title: ml("0% bo'lib to'lash", 'Рассрочка 0%', '0% instalments', 'Paiement échelonné à 0 %', 'Rate allo 0%', 'Plazos al 0 %', '0 % Ratenzahlung', '%0 taksit'),
          text: ml('Bank kreditisiz, {months} oygacha teng ulushlarda.', 'Без банковского кредита, равными частями до {months} месяцев.', 'No bank loan, equal instalments for up to {months} months.', "Sans crédit bancaire, en mensualités égales jusqu'à {months} mois.", 'Senza mutuo, in rate uguali fino a {months} mesi.', 'Sin crédito bancario, en cuotas iguales hasta {months} meses.', 'Ohne Bankkredit, in gleichen Raten bis zu {months} Monate.', 'Banka kredisi olmadan, {months} aya kadar eşit taksitlerle.') }
      ] };
    },
    cta: function () {
      return { type: 'cta', on: true, s: {
        eyebrow: ml('Maxsus taklif', 'Специальное предложение', 'Special offer', 'Offre spéciale', 'Offerta speciale', 'Oferta especial', 'Sonderangebot', 'Özel teklif'),
        title: ml("Orzuingizdagi uyni kutmang — bor-yo'g'i 33% bosh to'lov bilan bugunoq kalitni qo'lga oling",
          'Не откладывайте мечту — всего 33% первоначального взноса, и ключи уже сегодня ваши',
          "Don't wait for your dream home — just 33% down and the keys are yours today",
          "N'attendez plus la maison de vos rêves — seulement 33 % d'apport et les clés sont à vous dès aujourd'hui",
          'Non aspettare la casa dei tuoi sogni: solo il 33% di anticipo e le chiavi sono tue già oggi',
          'No espere más por la casa de sus sueños: solo un 33 % de entrada y hoy mismo tiene las llaves',
          'Warten Sie nicht auf Ihr Traumzuhause — nur 33 % Anzahlung und die Schlüssel gehören heute Ihnen',
          'Hayalinizdeki evi beklemeyin — sadece %33 peşinatla anahtarları bugün alın'),
        text: ml("Qolgan summani 0% ustamasiz, {months} oygacha teng ulushlarda to'laysiz. Narx va to'lov grafigi shartnomada aniq yoziladi — kutilmagan to'lovlar bo'lmaydi.",
          'Остаток выплачиваете равными частями до {months} месяцев без наценки. Цена и график платежей фиксируются в договоре — никаких неожиданных платежей.',
          'Pay the rest in equal instalments over up to {months} months with 0% markup. The price and payment schedule are fixed in the contract — no surprise charges.',
          "Réglez le solde en mensualités égales jusqu'à {months} mois, sans majoration. Le prix et l'échéancier sont fixés dans le contrat : aucun frais surprise.",
          'Il resto lo paghi in rate uguali fino a {months} mesi, senza maggiorazioni. Prezzo e piano dei pagamenti sono fissati nel contratto: nessuna spesa a sorpresa.',
          'El resto lo paga en cuotas iguales de hasta {months} meses sin recargo. El precio y el calendario de pagos quedan fijados en el contrato: sin pagos inesperados.',
          'Den Rest zahlen Sie in gleichen Raten über bis zu {months} Monate ohne Aufschlag. Preis und Zahlungsplan stehen im Vertrag — keine überraschenden Kosten.',
          'Kalan tutarı %0 ek ücretle, {months} aya kadar eşit taksitlerle ödersiniz. Fiyat ve ödeme planı sözleşmede sabitlenir — sürpriz ödeme yok.'),
        big: '33%',
        bigLabel: ml("bosh to'lov", 'первый взнос', 'down payment', "d'apport", 'di anticipo', 'de entrada', 'Anzahlung', 'peşinat'),
        image: 'base:gallery:3:musaffo',
        btn1: BOOK, act1: 'book',
        btn2: ml("Qo'ng'iroq qilish", 'Позвонить', 'Call us', 'Nous appeler', 'Chiamaci', 'Llamar', 'Anrufen', 'Bizi arayın'), act2: 'phone',
        form: true,
        formTitle: ml('Bepul konsultatsiya oling', 'Получите бесплатную консультацию', 'Get a free consultation', 'Obtenez une consultation gratuite', 'Ricevi una consulenza gratuita', 'Reciba una asesoría gratuita', 'Kostenlose Beratung erhalten', 'Ücretsiz danışmanlık alın'),
        formText: ml("Raqamingizni qoldiring — menejer ish vaqtida bir necha daqiqada qo'ng'iroq qilib, sizga mos xonadon va to'lov grafigini taklif qiladi.",
          'Оставьте номер — менеджер перезвонит в течение нескольких минут в рабочее время и подберёт квартиру и график оплаты.',
          'Leave your number — a manager will call you back within minutes during working hours and suggest the right apartment and payment plan.',
          "Laissez votre numéro : un conseiller vous rappelle en quelques minutes aux heures ouvrables et vous propose l'appartement et l'échéancier adaptés.",
          'Lascia il tuo numero: un consulente ti richiamerà entro pochi minuti in orario lavorativo e ti proporrà appartamento e piano di pagamento giusti.',
          'Deje su número: un asesor le llamará en pocos minutos en horario laboral y le propondrá el apartamento y el plan de pagos adecuados.',
          'Hinterlassen Sie Ihre Nummer — ein Berater ruft Sie während der Geschäftszeiten innerhalb weniger Minuten zurück und schlägt Ihnen Wohnung und Zahlungsplan vor.',
          'Numaranızı bırakın — danışmanımız mesai saatlerinde birkaç dakika içinde sizi arayıp uygun daireyi ve ödeme planını önersin.'),
        formBtn: ml("Menga qo'ng'iroq qiling", 'Перезвоните мне', 'Call me back', 'Rappelez-moi', 'Richiamatemi', 'Llámenme', 'Rufen Sie mich zurück', 'Beni arayın'),
        timer: false, until: '',
        timerLabel: ml('Taklif tugashiga', 'До конца предложения', 'Offer ends in', "L'offre se termine dans", "L'offerta termina tra", 'La oferta termina en', 'Angebot endet in', 'Teklifin bitmesine')
      }, b: [
        { id: uid('b'), type: 'chip', text: ml('0% ustama', '0% наценки', '0% markup', '0 % de majoration', '0% di maggiorazione', '0 % de recargo', '0 % Aufschlag', '%0 ek ücret') },
        { id: uid('b'), type: 'chip', text: ml('{months} oygacha muddat', 'Срок до {months} месяцев', 'Up to {months} months', "Jusqu'à {months} mois", 'Fino a {months} mesi', 'Hasta {months} meses', 'Bis zu {months} Monate', '{months} aya kadar vade') },
        { id: uid('b'), type: 'chip', text: ml('Rasmiy shartnoma', 'Официальный договор', 'Official contract', 'Contrat officiel', 'Contratto ufficiale', 'Contrato oficial', 'Offizieller Vertrag', 'Resmi sözleşme') }
      ] };
    },
    richtext: function () {
      return { type: 'richtext', on: true, s: { eyebrow: {}, title: ml("Yangi bo'lim", 'Новый раздел', 'New section'), text: ml('Matningizni shu yerga yozing.', 'Напишите здесь ваш текст.', 'Write your text here.'), btn: {}, act: 'book', align: 'center' }, b: [] };
    },
    video: function () {
      return { type: 'video', on: true, s: { eyebrow: {}, title: ml('Video', 'Видео', 'Video'), text: {}, video: '', link: '', poster: '' }, b: [] };
    }
  };

  /* bosh sahifadagi standart tartib: yangi bo'limlar mos joylarda */
  var ORDER = ['hero', 'marquee', 'apts', 'stars', 'art', 'tiles', 'projects', 'about', 'build', 'cta', 'calc', 'teaser', 'amb', 'contact', 'office', 'ig', 'bar', 'gallery'];

  function newTheme(name, palette) {
    var sec = {};
    NATIVE.forEach(function (n) { sec[n.id] = { type: 'native', on: true }; });
    ['stars', 'about', 'cta'].forEach(function (t) { sec[t] = DEF[t](); });
    return { id: uid('th'), name: name || 'Art House', at: Date.now(),
      s: { palette: palette || 'emerald', colors: {}, font: 'cormorant', btn: 'square', surface: 'light' },
      order: ORDER.slice(), sec: sec, text: {} };
  }
  /* yangi versiyada qo'shilgan asl bo'limlar eski mavzuga ham tushadi */
  function normalize(th) {
    th = th || newTheme();
    th.s = Object.assign({ palette: 'emerald', colors: {}, font: 'cormorant', btn: 'square', surface: 'light' }, th.s || {});
    th.sec = th.sec || {}; th.order = (th.order || []).filter(function (id) { return th.sec[id] || NATIVE.some(function (n) { return n.id === id; }); });
    th.text = th.text || {};
    NATIVE.forEach(function (n) {
      if (!th.sec[n.id]) th.sec[n.id] = { type: 'native', on: true };
      if (n.group !== 'header' && th.order.indexOf(n.id) < 0) { var i = ORDER.indexOf(n.id), after = ORDER.slice(0, i).reverse().filter(function (x) { return th.order.indexOf(x) > -1; })[0]; th.order.splice(after ? th.order.indexOf(after) + 1 : th.order.length, 0, n.id); }
    });
    th.order = th.order.filter(function (id) { return id !== 'ann'; });
    return th;
  }
  /* saytda ko'rinadigan mavzu */
  function liveOf(cms) {
    var T = (cms && cms.themes) || {}, L = T.list || [];
    return normalize(clone(L.filter(function (x) { return x.id === T.live; })[0] || L[0] || newTheme('Art House — Zumrad')));
  }

  window.AH_THEMES = {
    LANGS: LANGS, PALETTES: PALETTES, FONTS: FONTS, NATIVE: NATIVE, TYPES: TYPES, ORDER: ORDER, ACT: ACT, ICONS: ICONS, KIND: KIND,
    defaults: DEF, newTheme: newTheme, normalize: normalize, liveOf: liveOf, uid: uid, clone: clone, ml: ml,
    native: function (id) { return NATIVE.filter(function (n) { return n.id === id; })[0] || null; }
  };
})();
