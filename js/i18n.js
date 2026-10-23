/* =====================================================================
   ART HOUSE — TARJIMA TIZIMI
   Tillar: O'zbekcha (lotin), Ўзбекча (kirill — avtomatik transliteratsiya),
           Русский, English.
   • HTML'dagi [data-i="kalit"] matni, [data-i-ph] placeholder, [data-i-al] aria-label
   • JS ichida: I18N.t('kalit', {o'zgaruvchi}) ; I18N.pick({uz, ru, en})
   ===================================================================== */
(function () {
  'use strict';

  var LANGS = [
    { code: 'uz', label: "O'zbekcha", short: 'UZ', html: 'uz', locale: 'uz-Latn-UZ' },
    { code: 'cy', label: 'Ўзбекча', short: 'ЎЗ', html: 'uz-Cyrl', locale: 'uz-Cyrl-UZ' },
    { code: 'ru', label: 'Русский', short: 'RU', html: 'ru', locale: 'ru-RU' },
    { code: 'en', label: 'English', short: 'EN', html: 'en', locale: 'en-GB' }
  ];

  /* ---------------- O'ZBEKCHA (faqat JS ichidagi matnlar; HTML matnlari sahifadan olinadi) ---------------- */
  var uz = {
    'lang.title': 'Tilni tanlang',
    'unit.month': 'oy', 'unit.perMonth': '/ oy', 'unit.sum': "so'm",
    'rooms.n': '{n} xonali', 'rooms.duplex': 'Dupleks', 'rooms.floor': '{n}-qavat', 'rooms.balcony': 'balkon bilan', 'rooms.all': 'Hammasi',
    'plan.label': '{rooms} xonali{duplex} · {area} m²', 'plan.duplex': ' dupleks', 'plan.manual': "O'zim kiritaman",
    'calc.hideSched': 'Jadvalni yopish', 'calc.nth': '{n}-oy', 'calc.uzs': "≈ {v} so'm / oy",
    'calc.prev': '{V} · {P}% boshlang\'ich · {M} oy',
    'proj.gallery': 'Galereya', 'proj.amenities': 'Qulayliklar', 'proj.plans': 'Xonadon rejalari', 'proj.video': 'Video',
    'proj.presentation': "Taqdimotni ko'rish", 'proj.askPresentation': "Taqdimotni so'rash", 'proj.instagram': "Instagram'da ko'rish",
    'proj.calc': 'Kalkulyatorda hisoblash', 'proj.book': 'Band qilish', 'proj.open': 'Batafsil', 'proj.map': 'Xaritada',
    'proj.soon': "Bu loyihaning rasmlari, rejalari va taqdimoti tez orada qo'shiladi. Hozir esa to'liq ma'lumotni menejerdan oling.",
    'proj.askManager': "Menejerdan ma'lumot olish",
    'loc.office': 'Savdo ofisi', 'loc.officeAddr': "Uchtepa tumani, Ko'kcha Darvoza ko'chasi, 69",
    'infra.school': 'Maktablar', 'infra.kinder': "Bog'chalar", 'infra.hospital': 'Shifoxonalar', 'infra.market': 'Supermarketlar',
    'infra.metro': 'Metro', 'infra.park': "Bog' va parklar", 'infra.pharmacy': 'Dorixonalar', 'infra.gym': 'Sport zallar',
    'rev.count': '{n} ta izoh', 'rev.empty': "Hozircha izohlar yo'q. Birinchi bo'lib fikr bildiring!", 'rev.emptyFilter': "Bu bo'limda hozircha izoh yo'q.",
    'rev.reply': 'ART HOUSE javobi', 'rev.openVideo': 'Video-sharhni ochish', 'rev.stop': "Yozishni to'xtatish",
    'rev.tooBig': "Fayl hajmi {n} MB dan oshmasligi kerak.", 'rev.noRec': "Bu brauzerda video yozish qo'llab-quvvatlanmaydi — fayl yuklang.",
    'rev.badLink': "Havola noto'g'ri. https:// bilan boshlanadigan to'liq manzilni kiriting.", 'rev.uploading': 'Yuklanmoqda…',
    'rev.saveErr': "Izohni saqlab bo'lmadi. Qayta urinib ko'ring.", 'rev.of5': '5 dan',
    'social.ig': "Rasmlar, videolar va qurilish jarayoni", 'social.tg': "Rasmiy kanal: yangiliklar va maxsus takliflar",
    'social.tgm': "Menejerga to'g'ridan-to'g'ri yozing", 'social.yt': 'Video-obzorlar va reportajlar', 'social.fb': 'Rasmiy sahifa',
    'social.phone': "Savdo bo'limi", 'social.open': 'Sahifani ochish', 'social.call': "Qo'ng'iroq qilish",
    'phone.empty': 'Telefon raqamni kiriting.', 'phone.short': "Raqam to'liq emas: +998 XX XXX XX XX ko'rinishida kiriting.", 'phone.op': "Operator kodi noto'g'ri.",
    'book.okText': "Rahmat, {name}! Menejer {phone} raqamiga tez orada qo'ng'iroq qiladi.", 'book.general': 'Umumiy maslahat',
    'book.topic': 'Mavzu', 'book.when.asap': 'Imkon qadar tez', 'book.when.day': 'Kunduzi', 'book.when.eve': 'Kechqurun',
    'call.titleVideo': "Video-qo'ng'iroq", 'call.titleAudio': "Ovozli qo'ng'iroq",
    'call.st.idle': 'Tayyor', 'call.st.permission': "Kamera va mikrofonga ruxsat so'ralmoqda…", 'call.st.calling': 'Menejerga ulanmoqda…',
    'call.st.connecting': 'Ulanmoqda…', 'call.st.connected': 'Ulandi', 'call.st.reconnecting': 'Aloqa tiklanmoqda…', 'call.st.failed': "Ulanib bo'lmadi",
    'call.st.declined': "Menejer hozir band", 'call.st.noanswer': 'Javob berilmadi', 'call.st.ended': "Qo'ng'iroq yakunlandi", 'call.st.error': 'Xatolik',
    'call.wait': "Menejer javobini kuting… Odatda bu bir daqiqadan kam vaqt oladi.",
    'call.declinedText': "Menejer hozir boshqa mijoz bilan gaplashmoqda. So'rovingiz saqlandi — tez orada o'zimiz qo'ng'iroq qilamiz.",
    'call.noanswerText': "Menejer hozir javob bera olmadi. So'rovingiz saqlandi — ish vaqtida sizga qayta qo'ng'iroq qilamiz.",
    'call.failedText': "Internet aloqasi orqali ulanib bo'lmadi. Telefon orqali qo'ng'iroq qiling yoki keyinroq urinib ko'ring.",
    'call.endedText': "Suhbat uchun rahmat! Savollaringiz bo'lsa, istalgan vaqtda qayta bog'laning.",
    'call.perm.granted': 'ruxsat berilgan', 'call.perm.denied': 'rad etilgan', 'call.perm.prompt': "so'raladi", 'call.perm.unknown': "so'raladi",
    'call.testOk': 'Kamera va mikrofon ishlayapti', 'call.audioOnly': "Kamera topilmadi — ovozli rejimda davom etamiz.",
    'call.nameReq': 'Menejer sizga murojaat qilishi uchun ismingizni kiriting.', 'call.copied': 'Kod nusxalandi', 'call.badCode': "Kod noto'g'ri yoki to'liq emas.",
    'media.err.insecure': "Kamera va mikrofon faqat xavfsiz (https://) ulanishda ishlaydi. Saytni https:// orqali oching.",
    'media.err.unsupported': "Brauzeringiz video-qo'ng'iroqni qo'llab-quvvatlamaydi. Chrome, Safari yoki Edge'ning so'nggi versiyasidan foydalaning.",
    'media.err.denied': "Kamera yoki mikrofonga ruxsat berilmadi. Manzil satridagi qulf belgisini bosing, «Kamera» va «Mikrofon» uchun «Ruxsat berish»ni tanlang, so'ng qayta urinib ko'ring.",
    'media.err.notfound': "Kamera yoki mikrofon topilmadi. Qurilma ulanganini tekshiring.",
    'media.err.busy': "Kamera yoki mikrofon boshqa ilova tomonidan band. Uni yoping va qayta urinib ko'ring.",
    'media.err.constraint': "Kamera so'ralgan sifatni qo'llab-quvvatlamaydi.",
    'media.err.generic': "Qurilmaga ulanishda xatolik yuz berdi. Qayta urinib ko'ring.",
    'toast.err': "Xatolik yuz berdi. Qayta urinib ko'ring.", 'toast.offline': "Internet aloqasi yo'q — ma'lumot saqlandi va keyinroq yuboriladi.",
    'aria.close': 'Yopish', 'aria.prev': 'Oldingi', 'aria.next': 'Keyingi', 'aria.call': "Qo'ng'iroq", 'aria.menu': 'Asosiy menyu',
    'marquee': "0% foizsiz|Halol bo'lib to'lash|30% dan boshlang'ich to'lov|36 oygacha muddat|Quruvchidan to'g'ridan-to'g'ri",
    'home.locLine': '{district}',

    /* ---- KABINET ---- */
    'k.title': 'Boshqaruv paneli', 'k.login': 'Kabinetga kirish', 'k.user': 'Login', 'k.pass': 'Parol', 'k.enter': 'Kirish', 'k.back': 'Saytga qaytish',
    'k.secure': 'Himoyalangan ulanish', 'k.badAuth': "Login yoki parol noto'g'ri.", 'k.insecure': "Kabinet faqat https:// yoki localhost orqali ishlaydi.", 'k.netErr': "Serverga ulanib bo'lmadi.",
    'k.nav.overview': "Umumiy ko'rinish", 'k.nav.leads': 'Arizalar', 'k.nav.reviews': 'Mijozlar izohlari', 'k.nav.calls': "Qo'ng'iroqlar", 'k.nav.settings': 'Sozlamalar',
    'k.group.main': 'Asosiy', 'k.group.clients': 'Mijozlar', 'k.group.system': 'Tizim',
    'k.logout': 'Chiqish', 'k.owner': 'Direktor', 'k.manager': 'Menejer', 'k.modeLocal': "Lokal rejim — ma'lumotlar shu brauzerda", 'k.modeServer': 'Server bilan sinxron',
    'k.hello': 'Xush kelibsiz', 'k.today': 'Bugun',
    'k.st.leads': 'Jami arizalar', 'k.st.newLeads': 'Yangi arizalar', 'k.st.reviews': 'Izohlar', 'k.st.avg': "O'rtacha baho", 'k.st.pending': 'Javob kutayotgan izohlar', 'k.st.calls': "Qo'ng'iroqlar",
    'k.recentLeads': "So'nggi arizalar", 'k.recentReviews': 'Javob kutayotgan izohlar', 'k.viewAll': "Barchasini ko'rish",
    'k.empty.leads': "Hozircha arizalar yo'q.", 'k.empty.reviews': "Hozircha izohlar yo'q.", 'k.empty.calls': "Hozircha qo'ng'iroqlar yo'q.", 'k.empty.pending': "Barcha izohlarga javob berilgan.",
    'k.search': 'Qidirish…', 'k.all': 'Barchasi', 'k.export': 'CSV yuklab olish',
    'k.col.date': 'Sana', 'k.col.client': 'Mijoz', 'k.col.phone': 'Telefon', 'k.col.object': 'Obyekt', 'k.col.payment': "To'lov", 'k.col.status': 'Holat', 'k.col.actions': 'Amallar',
    'k.lead.new': 'Yangi', 'k.lead.called': "Bog'lanildi", 'k.lead.booked': 'Bron qilindi', 'k.lead.sold': 'Sotildi', 'k.lead.lost': 'Rad etildi',
    'k.lead.src.book': 'Band qilish', 'k.lead.src.callback': "Qayta qo'ng'iroq", 'k.lead.src.call': "Video-qo'ng'iroq",
    'k.lead.monthly': '{m} / oy · {M} oy', 'k.delete': "O'chirish", 'k.confirmDelete': "Haqiqatan ham o'chirilsinmi?",
    'k.rev.filter.pending': 'Javobsiz', 'k.rev.filter.answered': 'Javob berilgan', 'k.rev.filter.hidden': 'Yashirilgan', 'k.rev.filter.video': 'Video',
    'k.rev.reply': 'Javob yozish', 'k.rev.editReply': 'Javobni tahrirlash', 'k.rev.replyPh': "Mijozga javobingiz — saytda darhol ko'rinadi", 'k.rev.send': 'Javobni yuborish',
    'k.rev.sent': "Javob saytda e'lon qilindi", 'k.rev.hide': 'Saytdan yashirish', 'k.rev.show': "Saytda ko'rsatish", 'k.rev.hiddenBadge': 'Yashirilgan',
    'k.rev.removeReply': "Javobni o'chirish", 'k.rev.templates': 'Tayyor javoblar',
    'k.tpl.1': "Iliq fikringiz uchun katta rahmat! Sizni ART HOUSE oilasida ko'rganimizdan xursandmiz.",
    'k.tpl.2': "Fikringiz uchun rahmat. Murojaatingizni ko'rib chiqdik — menejerimiz siz bilan bog'lanadi.",
    'k.tpl.3': "Kechirasiz, noqulaylik uchun uzr so'raymiz. Iltimos, savdo bo'limiga qo'ng'iroq qiling — masalani tezda hal qilamiz.",
    'k.calls.incoming': "Kiruvchi qo'ng'iroq", 'k.calls.accept': 'Qabul qilish', 'k.calls.decline': 'Rad etish', 'k.calls.video': "Video-qo'ng'iroq", 'k.calls.audio': "Ovozli qo'ng'iroq",
    'k.calls.st.ringing': "Jiringlamoqda", 'k.calls.st.answered': 'Javob berildi', 'k.calls.st.missed': "O'tkazib yuborildi", 'k.calls.st.declined': 'Rad etildi',
    'k.calls.callback': "Qayta qo'ng'iroq qilish", 'k.calls.duration': 'Davomiyligi', 'k.calls.manual': "Kod orqali ulanish",
    'k.calls.manualHint': "Mijoz yuborgan kodni qo'ying — javob kodi hosil bo'ladi. Uni mijozga qaytaring.", 'k.calls.offerPh': 'Mijoz kodi', 'k.calls.makeAnswer': 'Javob kodini yaratish',
    'k.calls.ready': "Qo'ng'iroqlarni qabul qilishga tayyor", 'k.calls.enableSound': 'Ovozli signalni yoqish', 'k.calls.permTest': 'Kamera va mikrofonni tekshirish',
    'k.set.prices': 'Narxlar ($ / m²)', 'k.set.pricesHint': "Bo'sh qoldirilsa — kalkulyatorda narx qo'lda kiritiladi.", 'k.set.rate': "Dollar kursi (so'm)", 'k.set.save': 'Saqlash', 'k.set.saved': 'Sozlamalar saqlandi',
    'k.set.lang': 'Interfeys tili', 'k.set.data': "Ma'lumotlar", 'k.set.dataHint': "Server ulanmagan bo'lsa, barcha ma'lumotlar shu brauzer xotirasida saqlanadi. Muntazam CSV ko'rinishida yuklab oling.",
    'k.set.about': 'Tizim haqida', 'k.set.server': 'Server (API_URL)', 'k.set.notSet': "ulanmagan", 'k.set.ownerOnly': "Bu bo'lim faqat direktor uchun.",
    'k.newLead': 'Yangi ariza: {name}', 'k.newReview': 'Yangi izoh: {name} ({r}★)', 'k.idle': 'Faollik bo\'lmagani uchun tizimdan chiqildi.'
  };

  /* ---------------- РУССКИЙ ---------------- */
  var ru = {
    'brand.sub': 'Luxury Residence · Ташкент',
    'nav.cabinet': 'Кабинет', 'nav.home': 'Главная', 'nav.calc': 'Калькулятор', 'nav.projects': 'Проекты', 'nav.location': 'Расположение',
    'nav.about': 'О компании', 'nav.social': 'Мы в соцсетях', 'nav.contact': 'Контакты', 'nav.reviews': 'Отзывы клиентов',
    'home.eyebrow': 'Напрямую от застройщика · 0% без процентов', 'home.h1em': 'Luxury Residence',
    'home.lead': 'Премиальное жильё, где искусство встречается с комфортом. Без банковского кредита и переплат — честная и прозрачная рассрочка.',
    'home.cta1': 'Смотреть проекты', 'home.cta2': 'Рассчитать платёж',
    'home.stat1': 'лет на рынке', 'home.stat2': 'жилых комплекса', 'home.stat3': 'переплата и процент', 'home.stat4': 'месяцев рассрочки',
    'home.videoCap': 'Musaffo — ход строительства, съёмка с дрона', 'home.projTitle': 'Три адреса — одно качество', 'common.all': 'Все проекты',
    'home.calcTitle': 'Узнайте ежемесячный платёж за секунду', 'home.calcText': 'Выберите стоимость, первый взнос и срок — результат рассчитается мгновенно. Без переплаты.',
    'home.calcBtn': 'Подробный расчёт', 'home.locTitle': 'В самых удобных точках города', 'home.locBtn': 'Показать на карте',
    'home.aboutTitle': 'Доверие — в каждом кирпиче',
    'home.aboutText': 'С 2021 года ART HOUSE строит современные жилые комплексы в Ташкенте. Мы продаём квартиры напрямую от застройщика — без банков и посредников, в беспроцентную рассрочку.',
    'common.more': 'Подробнее', 'home.revBtn': 'Все отзывы', 'home.ctaTitle': 'Свяжитесь с менеджером прямо сейчас',
    'home.ctaText': 'Звонок, видеозвонок или Telegram — выберите удобный для вас способ.',
    'call.video': 'Видеозвонок', 'call.phone': 'Позвонить',
    'calc.eyebrow': '0% · Без процентов · Халяль', 'calc.title': 'Калькулятор рассрочки',
    'calc.lead': 'Это не банковский кредит — договор заключается напрямую с застройщиком. Никаких наценок и процентов: вы платите ровно стоимость квартиры.',
    'calc.project': 'Проект', 'calc.plan': 'Планировка', 'calc.area': 'Площадь, м²', 'calc.priceM2': 'Цена за 1 м², $',
    'calc.priceHint': 'Цена по этому проекту уточняется у менеджера — укажите ориентировочную стоимость.',
    'calc.total': 'Стоимость квартиры', 'calc.down': 'Первоначальный взнос', 'calc.minDown': '30% (минимум)', 'calc.term': 'Срок рассрочки',
    'calc.rDown': 'Первоначальный взнос', 'calc.rRest': 'Остаток', 'calc.rRate': 'Наценка / процент', 'calc.zero': '0% — без процентов, халяль',
    'calc.rLast': 'Последний платёж', 'calc.rMonthly': 'Ежемесячный платёж', 'calc.showSched': 'Показать график платежей',
    'calc.book': 'Забронировать по этому графику', 'calc.note': 'Расчёт носит информационный характер. Точную цену и условия договора подтверждает менеджер.',
    'proj.eyebrow': 'Жилые комплексы', 'proj.title': 'Наши проекты', 'proj.lead': 'Каждый комплекс — продуманные планировки, безопасный двор и современная инженерия. Выберите проект.',
    'loc.eyebrow': 'Карта и инфраструктура', 'loc.title': 'Расположение',
    'loc.lead': 'Найдите офис продаж и наши объекты на карте и постройте маршрут в Google Maps, Яндекс Картах или Яндекс Go.',
    'loc.google': 'Открыть в Google Maps', 'loc.yandex': 'Открыть в Яндекс Картах', 'loc.taxi': 'Яндекс Go — вызвать такси',
    'loc.infra': 'Инфраструктура рядом', 'loc.infraHint': 'Выберите категорию — на карте откроются ближайшие места.',
    'about.eyebrow': 'Компания', 'about.title': 'О компании',
    'about.lead': 'ART HOUSE — строительная компания, возводящая современные жилые комплексы в Ташкенте. Наша цель — создавать для семей безопасные, удобные и красивые дома и предлагать их каждому на честных условиях.',
    'about.n1': 'лет работы (с 2021 года)', 'about.n2': 'жилых комплекса в Ташкенте', 'about.n3': 'наценка в рассрочке', 'about.n4': 'первоначальный взнос от',
    'about.whyTitle': 'Почему ART HOUSE?',
    'about.w1t': 'Напрямую от застройщика', 'about.w1': 'Без посредников и дополнительных комиссий — договор заключается непосредственно с застройщиком.',
    'about.w2t': 'Рассрочка 0%', 'about.w2': 'Без банковского кредита и наценки. Остаток вы выплачиваете равными частями до 36 месяцев.',
    'about.w3t': 'Прозрачные документы', 'about.w3': 'Цена, график платежей и условия сдачи чётко прописаны в договоре — никаких неожиданных платежей.',
    'about.w4t': 'Безопасная продуманная среда', 'about.w4': 'Закрытый двор, паркинг, детские и спортивные площадки — всё для семейной жизни.',
    'about.w5t': 'Планировка для каждой семьи', 'about.w5': 'От однокомнатных до четырёхкомнатных квартир и дуплексов — вы выбираете подходящую.',
    'about.w6t': 'Персональный менеджер', 'about.w6': 'Один ответственный менеджер сопровождает вас от выбора квартиры до передачи ключей.',
    'about.rulesTitle': 'Наши принципы',
    'about.r1t': 'Честность', 'about.r1': 'Мы предлагаем только беспроцентную рассрочку — без наценок, скрытых платежей и штрафных процентов.',
    'about.r2t': 'Официальный договор', 'about.r2': 'Каждая квартира оформляется официальным договором; платежи принимаются только на счёт компании.',
    'about.r3t': 'Чёткий график', 'about.r3': 'Даты и суммы платежей согласовываются заранее и прилагаются к договору.',
    'about.r4t': 'Открытость', 'about.r4': 'Мы регулярно публикуем новости о ходе строительства в Instagram и Telegram.',
    'social.eyebrow': 'Официальные страницы', 'social.title': 'Мы в соцсетях',
    'social.lead': 'Ход строительства, новые планировки и специальные предложения — подписывайтесь. Официальными считаются только страницы, указанные здесь.',
    'contact.eyebrow': 'Поддержка', 'contact.title': 'Контакты',
    'contact.lead': 'Свяжитесь с менеджером напрямую: по телефону, видеозвонком или в Telegram. В рабочее время мы отвечаем в течение нескольких минут.',
    'contact.phones': 'Телефоны', 'contact.office': 'Офис продаж', 'contact.officeAddr': 'г. Ташкент, Учтепинский район, ул. Кукча Дарвоза, 69',
    'contact.liveTitle': 'Живая связь с менеджером', 'contact.liveText': 'Обсудите квартиру, планировку и условия оплаты с менеджером лицом к лицу — не выходя из дома.',
    'call.audio': 'Аудиозвонок (через интернет)', 'contact.tg': 'Написать в Telegram',
    'contact.permHint': 'Для видеозвонка браузер запросит доступ к камере и микрофону. Нажмите «Разрешить».',
    'contact.cbTitle': 'Заказать обратный звонок',
    'form.name': 'Ваше имя', 'form.namePh': 'Например, Азиз Каримов', 'form.nameErr': 'Введите ваше имя.', 'form.phone': 'Номер телефона', 'form.topic': 'Тема обращения',
    'form.t1': 'Покупка квартиры', 'form.t2': 'Оплата и договор', 'form.t3': 'Осмотр объекта', 'form.t4': 'Другой вопрос', 'form.send': 'Отправить',
    'form.ok': 'Спасибо! Заявка принята — менеджер скоро вам перезвонит.',
    'contact.rulesTitle': 'Памятка для клиентов',
    'contact.s1t': 'Заявка или звонок', 'contact.s1': 'Оставьте заявку на сайте или позвоните — менеджер подберёт подходящий проект и планировку.',
    'contact.s2t': 'Визит в офис и на объект', 'contact.s2': 'Заранее согласуйте время визита. Возьмите с собой документ, удостоверяющий личность (паспорт или ID-карту).',
    'contact.s3t': 'Бронь и договор', 'contact.s3': 'Выбранная квартира бронируется первоначальным взносом, после чего подписывается официальный договор.',
    'contact.s4t': 'Платежи без процентов', 'contact.s4': 'Остаток вносится равными частями по графику. Берите официальную квитанцию за каждый платёж.',
    'contact.safety': 'Правило безопасности: вносите платежи только на счёт компании, указанный в договоре. Наши сотрудники никогда не просят переводить деньги на личную карту.',
    'rev.eyebrow': 'Обратная связь', 'rev.title': 'Отзывы клиентов', 'rev.lead': 'Каждый отзыв читают наши менеджеры и отвечают на него. Ваше мнение важно для нас.',
    'rev.fAll': 'Все', 'rev.fVideo': 'Видеоотзывы', 'rev.fAnswered': 'С ответом', 'rev.formTitle': 'Оставить отзыв',
    'rev.rating': 'Оценка', 'rev.ratingErr': 'Поставьте оценку.', 'rev.text': 'Ваш отзыв', 'rev.textPh': 'Поделитесь впечатлениями…', 'rev.textErr': 'Напишите не менее 10 символов.',
    'rev.video': 'Видеоотзыв (необязательно)', 'rev.record': 'Записать на камеру', 'rev.upload': 'Загрузить файл', 'rev.linkPh': 'или ссылка на YouTube / Instagram',
    'rev.remove': 'Удалить', 'rev.submit': 'Отправить отзыв', 'rev.ok': 'Спасибо! Ваш отзыв опубликован.',
    'foot.text': 'Премиальные квартиры напрямую от застройщика — в честную беспроцентную рассрочку.', 'foot.menu': 'Разделы', 'foot.contact': 'Контакты', 'foot.slogan': 'Без процентов · Честно · Прозрачно',
    'dock.call': 'Звонок', 'dock.video': 'Видео', 'dock.book': 'Забронировать',
    'book.title': 'Бронирование квартиры', 'book.text': 'Оставьте свои данные — менеджер свяжется с вами и подтвердит выбор.',
    'book.when': 'Когда вам позвонить?', 'book.asap': 'Как можно скорее', 'book.day': 'Днём', 'book.eve': 'Вечером', 'book.send': 'Отправить заявку',
    'book.okTitle': 'Заявка принята', 'common.close': 'Закрыть',
    'call.manager': 'Менеджер отдела продаж', 'call.previewPh': 'Здесь появится изображение с камеры', 'call.cam': 'Камера', 'call.mic': 'Микрофон',
    'call.test': 'Проверить камеру и микрофон', 'call.start': 'Начать звонок', 'call.manualTitle': 'Подключение с другого устройства (по коду)',
    'call.manualHint': 'Если сервер не подключён: создайте код, отправьте его менеджеру и вставьте сюда ответный код.',
    'call.makeCode': 'Создать код', 'call.copy': 'Копировать', 'call.answerPh': 'Вставьте ответный код менеджера', 'call.connect': 'Подключиться',
    'call.ctlMic': 'Микрофон', 'call.ctlCam': 'Камера', 'call.ctlFlip': 'Сменить', 'call.end': 'Завершить',

    'lang.title': 'Выберите язык',
    'unit.month': 'мес.', 'unit.perMonth': '/ мес.', 'unit.sum': 'сум',
    'rooms.n': '{n}-комнатная', 'rooms.duplex': 'Дуплекс', 'rooms.floor': '{n}-й уровень', 'rooms.balcony': 'с балконом', 'rooms.all': 'Все',
    'plan.label': '{rooms}-комн.{duplex} · {area} м²', 'plan.duplex': ' дуплекс', 'plan.manual': 'Ввести вручную',
    'calc.hideSched': 'Скрыть график', 'calc.nth': '{n}-й мес.', 'calc.uzs': '≈ {v} сум / мес.',
    'calc.prev': '{V} · взнос {P}% · {M} мес.',
    'proj.gallery': 'Галерея', 'proj.amenities': 'Удобства', 'proj.plans': 'Планировки', 'proj.video': 'Видео',
    'proj.presentation': 'Смотреть презентацию', 'proj.askPresentation': 'Запросить презентацию', 'proj.instagram': 'Смотреть в Instagram',
    'proj.calc': 'Рассчитать в калькуляторе', 'proj.book': 'Забронировать', 'proj.open': 'Подробнее', 'proj.map': 'На карте',
    'proj.soon': 'Фотографии, планировки и презентация этого проекта скоро появятся. А пока подробную информацию можно получить у менеджера.',
    'proj.askManager': 'Узнать у менеджера',
    'loc.office': 'Офис продаж', 'loc.officeAddr': 'Учтепинский район, ул. Кукча Дарвоза, 69',
    'infra.school': 'Школы', 'infra.kinder': 'Детские сады', 'infra.hospital': 'Больницы', 'infra.market': 'Супермаркеты',
    'infra.metro': 'Метро', 'infra.park': 'Парки и скверы', 'infra.pharmacy': 'Аптеки', 'infra.gym': 'Спортзалы',
    'rev.count': '{n} отзывов', 'rev.empty': 'Пока отзывов нет. Будьте первым!', 'rev.emptyFilter': 'В этом разделе пока нет отзывов.',
    'rev.reply': 'Ответ ART HOUSE', 'rev.openVideo': 'Открыть видеоотзыв', 'rev.stop': 'Остановить запись',
    'rev.tooBig': 'Размер файла не должен превышать {n} МБ.', 'rev.noRec': 'Этот браузер не поддерживает запись видео — загрузите файл.',
    'rev.badLink': 'Неверная ссылка. Укажите полный адрес, начинающийся с https://.', 'rev.uploading': 'Загрузка…',
    'rev.saveErr': 'Не удалось сохранить отзыв. Попробуйте ещё раз.', 'rev.of5': 'из 5',
    'social.ig': 'Фото, видео и ход строительства', 'social.tg': 'Официальный канал: новости и спецпредложения',
    'social.tgm': 'Напишите менеджеру напрямую', 'social.yt': 'Видеообзоры и репортажи', 'social.fb': 'Официальная страница',
    'social.phone': 'Отдел продаж', 'social.open': 'Открыть страницу', 'social.call': 'Позвонить',
    'phone.empty': 'Введите номер телефона.', 'phone.short': 'Номер неполный: укажите в формате +998 XX XXX XX XX.', 'phone.op': 'Неверный код оператора.',
    'book.okText': 'Спасибо, {name}! Менеджер скоро позвонит вам на номер {phone}.', 'book.general': 'Общая консультация',
    'book.topic': 'Тема', 'book.when.asap': 'Как можно скорее', 'book.when.day': 'Днём', 'book.when.eve': 'Вечером',
    'call.titleVideo': 'Видеозвонок', 'call.titleAudio': 'Аудиозвонок',
    'call.st.idle': 'Готово', 'call.st.permission': 'Запрашиваем доступ к камере и микрофону…', 'call.st.calling': 'Соединяем с менеджером…',
    'call.st.connecting': 'Подключение…', 'call.st.connected': 'На связи', 'call.st.reconnecting': 'Восстанавливаем связь…', 'call.st.failed': 'Не удалось подключиться',
    'call.st.declined': 'Менеджер сейчас занят', 'call.st.noanswer': 'Нет ответа', 'call.st.ended': 'Звонок завершён', 'call.st.error': 'Ошибка',
    'call.wait': 'Ожидайте ответа менеджера… Обычно это занимает меньше минуты.',
    'call.declinedText': 'Менеджер сейчас разговаривает с другим клиентом. Ваш запрос сохранён — мы скоро перезвоним сами.',
    'call.noanswerText': 'Менеджер не смог ответить. Ваш запрос сохранён — мы перезвоним вам в рабочее время.',
    'call.failedText': 'Не удалось установить соединение через интернет. Позвоните по телефону или попробуйте позже.',
    'call.endedText': 'Спасибо за разговор! Если появятся вопросы — свяжитесь с нами в любое время.',
    'call.perm.granted': 'разрешено', 'call.perm.denied': 'запрещено', 'call.perm.prompt': 'будет запрошено', 'call.perm.unknown': 'будет запрошено',
    'call.testOk': 'Камера и микрофон работают', 'call.audioOnly': 'Камера не найдена — продолжаем в режиме аудио.',
    'call.nameReq': 'Укажите имя, чтобы менеджер знал, как к вам обращаться.', 'call.copied': 'Код скопирован', 'call.badCode': 'Код неверный или неполный.',
    'media.err.insecure': 'Камера и микрофон работают только при защищённом соединении (https://). Откройте сайт по https://.',
    'media.err.unsupported': 'Ваш браузер не поддерживает видеозвонки. Используйте последнюю версию Chrome, Safari или Edge.',
    'media.err.denied': 'Доступ к камере или микрофону запрещён. Нажмите на значок замка в адресной строке, разрешите «Камеру» и «Микрофон» и попробуйте снова.',
    'media.err.notfound': 'Камера или микрофон не найдены. Проверьте подключение устройства.',
    'media.err.busy': 'Камера или микрофон заняты другим приложением. Закройте его и попробуйте снова.',
    'media.err.constraint': 'Камера не поддерживает запрошенное качество.',
    'media.err.generic': 'Ошибка при подключении к устройству. Попробуйте ещё раз.',
    'toast.err': 'Произошла ошибка. Попробуйте ещё раз.', 'toast.offline': 'Нет подключения к интернету — данные сохранены и будут отправлены позже.',
    'aria.close': 'Закрыть', 'aria.prev': 'Назад', 'aria.next': 'Вперёд', 'aria.call': 'Позвонить', 'aria.menu': 'Главное меню',
    'marquee': '0% без процентов|Честная рассрочка|Первый взнос от 30%|Срок до 36 месяцев|Напрямую от застройщика',

    'k.title': 'Панель управления', 'k.login': 'Вход в кабинет', 'k.user': 'Логин', 'k.pass': 'Пароль', 'k.enter': 'Войти', 'k.back': 'Вернуться на сайт',
    'k.secure': 'Защищённое соединение', 'k.badAuth': 'Неверный логин или пароль.', 'k.insecure': 'Кабинет работает только по https:// или на localhost.', 'k.netErr': 'Не удалось подключиться к серверу.',
    'k.nav.overview': 'Обзор', 'k.nav.leads': 'Заявки', 'k.nav.reviews': 'Отзывы клиентов', 'k.nav.calls': 'Звонки', 'k.nav.settings': 'Настройки',
    'k.group.main': 'Основное', 'k.group.clients': 'Клиенты', 'k.group.system': 'Система',
    'k.logout': 'Выйти', 'k.owner': 'Директор', 'k.manager': 'Менеджер', 'k.modeLocal': 'Локальный режим — данные в этом браузере', 'k.modeServer': 'Синхронизация с сервером',
    'k.hello': 'Добро пожаловать', 'k.today': 'Сегодня',
    'k.st.leads': 'Всего заявок', 'k.st.newLeads': 'Новые заявки', 'k.st.reviews': 'Отзывы', 'k.st.avg': 'Средняя оценка', 'k.st.pending': 'Отзывы без ответа', 'k.st.calls': 'Звонки',
    'k.recentLeads': 'Последние заявки', 'k.recentReviews': 'Отзывы, ожидающие ответа', 'k.viewAll': 'Смотреть все',
    'k.empty.leads': 'Заявок пока нет.', 'k.empty.reviews': 'Отзывов пока нет.', 'k.empty.calls': 'Звонков пока нет.', 'k.empty.pending': 'На все отзывы даны ответы.',
    'k.search': 'Поиск…', 'k.all': 'Все', 'k.export': 'Скачать CSV',
    'k.col.date': 'Дата', 'k.col.client': 'Клиент', 'k.col.phone': 'Телефон', 'k.col.object': 'Объект', 'k.col.payment': 'Оплата', 'k.col.status': 'Статус', 'k.col.actions': 'Действия',
    'k.lead.new': 'Новая', 'k.lead.called': 'Связались', 'k.lead.booked': 'Бронь', 'k.lead.sold': 'Продано', 'k.lead.lost': 'Отказ',
    'k.lead.src.book': 'Бронирование', 'k.lead.src.callback': 'Обратный звонок', 'k.lead.src.call': 'Видеозвонок',
    'k.lead.monthly': '{m} / мес. · {M} мес.', 'k.delete': 'Удалить', 'k.confirmDelete': 'Действительно удалить?',
    'k.rev.filter.pending': 'Без ответа', 'k.rev.filter.answered': 'С ответом', 'k.rev.filter.hidden': 'Скрытые', 'k.rev.filter.video': 'Видео',
    'k.rev.reply': 'Ответить', 'k.rev.editReply': 'Изменить ответ', 'k.rev.replyPh': 'Ваш ответ клиенту — сразу появится на сайте', 'k.rev.send': 'Отправить ответ',
    'k.rev.sent': 'Ответ опубликован на сайте', 'k.rev.hide': 'Скрыть с сайта', 'k.rev.show': 'Показать на сайте', 'k.rev.hiddenBadge': 'Скрыт',
    'k.rev.removeReply': 'Удалить ответ', 'k.rev.templates': 'Шаблоны ответов',
    'k.tpl.1': 'Большое спасибо за тёплый отзыв! Мы рады видеть вас в семье ART HOUSE.',
    'k.tpl.2': 'Спасибо за отзыв. Мы рассмотрели ваше обращение — менеджер свяжется с вами.',
    'k.tpl.3': 'Приносим извинения за неудобства. Пожалуйста, позвоните в отдел продаж — мы быстро решим вопрос.',
    'k.calls.incoming': 'Входящий звонок', 'k.calls.accept': 'Принять', 'k.calls.decline': 'Отклонить', 'k.calls.video': 'Видеозвонок', 'k.calls.audio': 'Аудиозвонок',
    'k.calls.st.ringing': 'Звонит', 'k.calls.st.answered': 'Отвечен', 'k.calls.st.missed': 'Пропущен', 'k.calls.st.declined': 'Отклонён',
    'k.calls.callback': 'Перезвонить', 'k.calls.duration': 'Длительность', 'k.calls.manual': 'Подключение по коду',
    'k.calls.manualHint': 'Вставьте код клиента — будет создан ответный код. Отправьте его клиенту.', 'k.calls.offerPh': 'Код клиента', 'k.calls.makeAnswer': 'Создать ответный код',
    'k.calls.ready': 'Готов принимать звонки', 'k.calls.enableSound': 'Включить звуковой сигнал', 'k.calls.permTest': 'Проверить камеру и микрофон',
    'k.set.prices': 'Цены ($ / м²)', 'k.set.pricesHint': 'Если оставить пустым — цена вводится в калькуляторе вручную.', 'k.set.rate': 'Курс доллара (сум)', 'k.set.save': 'Сохранить', 'k.set.saved': 'Настройки сохранены',
    'k.set.lang': 'Язык интерфейса', 'k.set.data': 'Данные', 'k.set.dataHint': 'Без сервера все данные хранятся в памяти этого браузера. Регулярно скачивайте их в формате CSV.',
    'k.set.about': 'О системе', 'k.set.server': 'Сервер (API_URL)', 'k.set.notSet': 'не подключён', 'k.set.ownerOnly': 'Этот раздел доступен только директору.',
    'k.newLead': 'Новая заявка: {name}', 'k.newReview': 'Новый отзыв: {name} ({r}★)', 'k.idle': 'Выход из системы из-за бездействия.'
  };

  /* ---------------- ENGLISH ---------------- */
  var en = {
    'brand.sub': 'Luxury Residence · Tashkent',
    'nav.cabinet': 'Dashboard', 'nav.home': 'Home', 'nav.calc': 'Calculator', 'nav.projects': 'Projects', 'nav.location': 'Location',
    'nav.about': 'About us', 'nav.social': 'Social media', 'nav.contact': 'Contact', 'nav.reviews': 'Client reviews',
    'home.eyebrow': 'Direct from the developer · 0% interest', 'home.h1em': 'Luxury Residence',
    'home.lead': 'Premium homes where art meets comfort. No bank loan, no markup — honest and transparent instalments.',
    'home.cta1': 'Explore the projects', 'home.cta2': 'Calculate payments',
    'home.stat1': 'years on the market', 'home.stat2': 'residential complexes', 'home.stat3': 'markup and interest', 'home.stat4': 'months to pay',
    'home.videoCap': 'Musaffo — construction progress, drone footage', 'home.projTitle': 'Three addresses — one standard', 'common.all': 'All projects',
    'home.calcTitle': 'See your monthly payment in seconds', 'home.calcText': 'Choose the price, down payment and term — the result updates instantly. No markup.',
    'home.calcBtn': 'Detailed calculation', 'home.locTitle': "In the city's most convenient spots", 'home.locBtn': 'View on the map',
    'home.aboutTitle': 'Trust, built into every brick',
    'home.aboutText': 'Since 2021, ART HOUSE has been building modern residential complexes in Tashkent. We sell homes directly from the developer — no banks, no intermediaries, with interest-free instalments.',
    'common.more': 'Learn more', 'home.revBtn': 'All reviews', 'home.ctaTitle': 'Talk to a sales manager now',
    'home.ctaText': 'Phone, video call or Telegram — choose whatever suits you best.',
    'call.video': 'Video call', 'call.phone': 'Call us',
    'calc.eyebrow': '0% · Interest-free · Halal', 'calc.title': 'Instalment calculator',
    'calc.lead': 'This is not a bank loan — the contract is signed directly with the developer. No markup, no interest: you pay exactly the price of the home.',
    'calc.project': 'Project', 'calc.plan': 'Floor plan', 'calc.area': 'Area, m²', 'calc.priceM2': 'Price per m², $',
    'calc.priceHint': 'Pricing for this project is confirmed by a manager — enter an estimated price.',
    'calc.total': 'Property price', 'calc.down': 'Down payment', 'calc.minDown': '30% (minimum)', 'calc.term': 'Instalment term',
    'calc.rDown': 'Down payment', 'calc.rRest': 'Remaining balance', 'calc.rRate': 'Markup / interest', 'calc.zero': '0% — interest-free, halal',
    'calc.rLast': 'Final payment', 'calc.rMonthly': 'Monthly payment', 'calc.showSched': 'Show payment schedule',
    'calc.book': 'Reserve on this schedule', 'calc.note': 'This calculation is for reference only. The exact price and contract terms are confirmed by a manager.',
    'proj.eyebrow': 'Residential complexes', 'proj.title': 'Our projects', 'proj.lead': 'Every complex offers thoughtful layouts, a safe courtyard and modern engineering. Choose a project.',
    'loc.eyebrow': 'Map & neighbourhood', 'loc.title': 'Location',
    'loc.lead': 'Find our sales office and sites on the map and get directions in Google Maps, Yandex Maps or Yandex Go.',
    'loc.google': 'Open in Google Maps', 'loc.yandex': 'Open in Yandex Maps', 'loc.taxi': 'Yandex Go — book a taxi',
    'loc.infra': 'Nearby amenities', 'loc.infraHint': 'Pick a category to see the closest places on the map.',
    'about.eyebrow': 'The company', 'about.title': 'About us',
    'about.lead': 'ART HOUSE is a developer building modern residential complexes in Tashkent. Our goal is to create safe, comfortable and beautiful homes for families — and to offer them to everyone on honest terms.',
    'about.n1': 'years in business (since 2021)', 'about.n2': 'residential complexes in Tashkent', 'about.n3': 'markup on instalments', 'about.n4': 'minimum down payment',
    'about.whyTitle': 'Why ART HOUSE?',
    'about.w1t': 'Direct from the developer', 'about.w1': 'No intermediaries or extra commissions — your contract is signed directly with the developer.',
    'about.w2t': '0% instalments', 'about.w2': 'No bank loan and no markup. Pay the balance in equal parts over up to 36 months.',
    'about.w3t': 'Transparent paperwork', 'about.w3': 'Price, payment schedule and handover terms are clearly set out in the contract — no surprise charges later.',
    'about.w4t': 'A safe, well-designed setting', 'about.w4': 'A private courtyard, parking, play and sports areas — everything family life needs.',
    'about.w5t': 'A layout for every family', 'about.w5': 'From one- to four-bedroom apartments and duplexes — choose the one that fits.',
    'about.w6t': 'A personal manager', 'about.w6': 'One dedicated manager guides you from choosing a home to receiving the keys.',
    'about.rulesTitle': 'Our principles',
    'about.r1t': 'Honesty', 'about.r1': 'We only offer interest-free instalments — no markup, hidden fees or penalty interest.',
    'about.r2t': 'An official contract', 'about.r2': 'Every home is formalised with an official contract; payments are accepted only into the company account.',
    'about.r3t': 'A clear schedule', 'about.r3': 'Payment dates and amounts are agreed in advance and attached to the contract.',
    'about.r4t': 'Open communication', 'about.r4': 'We regularly post construction updates on our Instagram and Telegram pages.',
    'social.eyebrow': 'Official pages', 'social.title': 'Social media',
    'social.lead': 'Construction progress, new layouts and special offers — follow us. Only the pages listed here are official.',
    'contact.eyebrow': 'Support', 'contact.title': 'Contact',
    'contact.lead': 'Reach a manager directly by phone, video call or Telegram. During working hours we reply within minutes.',
    'contact.phones': 'Phone numbers', 'contact.office': 'Sales office', 'contact.officeAddr': '69 Kukcha Darvoza Street, Uchtepa district, Tashkent',
    'contact.liveTitle': 'Talk to a manager live', 'contact.liveText': 'Discuss the apartment, floor plan and payment terms face to face with a manager — without leaving home.',
    'call.audio': 'Voice call (over the internet)', 'contact.tg': 'Message us on Telegram',
    'contact.permHint': 'For a video call, your browser will ask for camera and microphone access. Tap “Allow”.',
    'contact.cbTitle': 'Request a call back',
    'form.name': 'Your name', 'form.namePh': 'e.g. Aziz Karimov', 'form.nameErr': 'Please enter your name.', 'form.phone': 'Phone number', 'form.topic': 'Topic',
    'form.t1': 'Buying an apartment', 'form.t2': 'Payment and contract', 'form.t3': 'Visiting the site', 'form.t4': 'Something else', 'form.send': 'Send',
    'form.ok': 'Thank you! Your request has been received — a manager will call you shortly.',
    'contact.rulesTitle': 'Guidelines for clients',
    'contact.s1t': 'Request or call', 'contact.s1': 'Leave a request on the website or call us — a manager will suggest the right project and layout.',
    'contact.s2t': 'Visit the office and site', 'contact.s2': 'Agree on a visit time in advance. Bring an identity document (passport or ID card).',
    'contact.s3t': 'Reservation and contract', 'contact.s3': 'Your chosen home is reserved with the down payment, then an official contract is signed.',
    'contact.s4t': 'Interest-free payments', 'contact.s4': 'The balance is paid in equal instalments on schedule. Get an official receipt for every payment.',
    'contact.safety': 'Safety rule: make payments only to the company account stated in your contract. Our staff will never ask you to transfer money to a personal card.',
    'rev.eyebrow': 'Feedback', 'rev.title': 'Client reviews', 'rev.lead': 'Our managers read and reply to every review. Your opinion matters to us.',
    'rev.fAll': 'All', 'rev.fVideo': 'Video reviews', 'rev.fAnswered': 'Answered', 'rev.formTitle': 'Leave a review',
    'rev.rating': 'Rating', 'rev.ratingErr': 'Please choose a rating.', 'rev.text': 'Your review', 'rev.textPh': 'Share your impressions…', 'rev.textErr': 'Please write at least 10 characters.',
    'rev.video': 'Video review (optional)', 'rev.record': 'Record with camera', 'rev.upload': 'Upload a file', 'rev.linkPh': 'or a YouTube / Instagram link',
    'rev.remove': 'Remove', 'rev.submit': 'Submit review', 'rev.ok': 'Thank you! Your review has been published.',
    'foot.text': 'Premium homes direct from the developer, with honest interest-free instalments.', 'foot.menu': 'Sections', 'foot.contact': 'Contact', 'foot.slogan': 'Interest-free · Honest · Transparent',
    'dock.call': 'Call', 'dock.video': 'Video', 'dock.book': 'Reserve',
    'book.title': 'Reserve an apartment', 'book.text': 'Leave your details — a manager will contact you to confirm your choice.',
    'book.when': 'When should we call you?', 'book.asap': 'As soon as possible', 'book.day': 'Daytime', 'book.eve': 'Evening', 'book.send': 'Send request',
    'book.okTitle': 'Request received', 'common.close': 'Close',
    'call.manager': 'Sales manager', 'call.previewPh': 'Your camera preview will appear here', 'call.cam': 'Camera', 'call.mic': 'Microphone',
    'call.test': 'Test camera and microphone', 'call.start': 'Start call', 'call.manualTitle': 'Connect from another device (with a code)',
    'call.manualHint': 'If no server is connected: create a code, send it to the manager and paste the reply code here.',
    'call.makeCode': 'Create code', 'call.copy': 'Copy', 'call.answerPh': "Paste the manager's reply code here", 'call.connect': 'Connect',
    'call.ctlMic': 'Microphone', 'call.ctlCam': 'Camera', 'call.ctlFlip': 'Switch', 'call.end': 'End call',

    'lang.title': 'Choose a language',
    'unit.month': 'mo', 'unit.perMonth': '/ month', 'unit.sum': 'UZS',
    'rooms.n': '{n}-room', 'rooms.duplex': 'Duplex', 'rooms.floor': 'level {n}', 'rooms.balcony': 'with balcony', 'rooms.all': 'All',
    'plan.label': '{rooms}-room{duplex} · {area} m²', 'plan.duplex': ' duplex', 'plan.manual': 'Enter manually',
    'calc.hideSched': 'Hide schedule', 'calc.nth': 'Month {n}', 'calc.uzs': '≈ {v} UZS / month',
    'calc.prev': '{V} · {P}% down · {M} months',
    'proj.gallery': 'Gallery', 'proj.amenities': 'Amenities', 'proj.plans': 'Floor plans', 'proj.video': 'Video',
    'proj.presentation': 'View presentation', 'proj.askPresentation': 'Request the presentation', 'proj.instagram': 'View on Instagram',
    'proj.calc': 'Calculate payments', 'proj.book': 'Reserve', 'proj.open': 'Learn more', 'proj.map': 'On the map',
    'proj.soon': 'Photos, floor plans and the presentation for this project are coming soon. In the meantime, a manager can give you full details.',
    'proj.askManager': 'Ask a manager',
    'loc.office': 'Sales office', 'loc.officeAddr': '69 Kukcha Darvoza Street, Uchtepa district',
    'infra.school': 'Schools', 'infra.kinder': 'Kindergartens', 'infra.hospital': 'Hospitals', 'infra.market': 'Supermarkets',
    'infra.metro': 'Metro', 'infra.park': 'Parks', 'infra.pharmacy': 'Pharmacies', 'infra.gym': 'Gyms',
    'rev.count': '{n} reviews', 'rev.empty': 'No reviews yet. Be the first to share your thoughts!', 'rev.emptyFilter': 'Nothing in this section yet.',
    'rev.reply': 'Reply from ART HOUSE', 'rev.openVideo': 'Open video review', 'rev.stop': 'Stop recording',
    'rev.tooBig': 'The file must not exceed {n} MB.', 'rev.noRec': "This browser can't record video — please upload a file.",
    'rev.badLink': 'Invalid link. Enter a full address starting with https://.', 'rev.uploading': 'Uploading…',
    'rev.saveErr': "Couldn't save your review. Please try again.", 'rev.of5': 'out of 5',
    'social.ig': 'Photos, videos and construction progress', 'social.tg': 'Official channel: news and special offers',
    'social.tgm': 'Message a manager directly', 'social.yt': 'Video tours and reports', 'social.fb': 'Official page',
    'social.phone': 'Sales department', 'social.open': 'Open page', 'social.call': 'Call',
    'phone.empty': 'Please enter your phone number.', 'phone.short': 'Incomplete number: use the format +998 XX XXX XX XX.', 'phone.op': 'Invalid operator code.',
    'book.okText': 'Thank you, {name}! A manager will call you at {phone} shortly.', 'book.general': 'General consultation',
    'book.topic': 'Topic', 'book.when.asap': 'As soon as possible', 'book.when.day': 'Daytime', 'book.when.eve': 'Evening',
    'call.titleVideo': 'Video call', 'call.titleAudio': 'Voice call',
    'call.st.idle': 'Ready', 'call.st.permission': 'Requesting camera and microphone access…', 'call.st.calling': 'Connecting you to a manager…',
    'call.st.connecting': 'Connecting…', 'call.st.connected': 'Connected', 'call.st.reconnecting': 'Reconnecting…', 'call.st.failed': 'Could not connect',
    'call.st.declined': 'The manager is busy', 'call.st.noanswer': 'No answer', 'call.st.ended': 'Call ended', 'call.st.error': 'Error',
    'call.wait': 'Please wait for the manager to answer… This usually takes less than a minute.',
    'call.declinedText': "The manager is speaking with another client right now. Your request has been saved — we'll call you back shortly.",
    'call.noanswerText': "The manager couldn't answer right now. Your request has been saved — we'll call you back during working hours.",
    'call.failedText': "We couldn't connect over the internet. Please call us by phone or try again later.",
    'call.endedText': 'Thank you for the conversation! If you have any questions, get in touch any time.',
    'call.perm.granted': 'allowed', 'call.perm.denied': 'blocked', 'call.perm.prompt': 'will be requested', 'call.perm.unknown': 'will be requested',
    'call.testOk': 'Camera and microphone are working', 'call.audioOnly': 'No camera found — continuing with audio only.',
    'call.nameReq': 'Please enter your name so the manager knows how to address you.', 'call.copied': 'Code copied', 'call.badCode': 'The code is invalid or incomplete.',
    'media.err.insecure': 'Camera and microphone only work over a secure (https://) connection. Please open the site via https://.',
    'media.err.unsupported': "Your browser doesn't support video calls. Please use the latest Chrome, Safari or Edge.",
    'media.err.denied': 'Camera or microphone access was blocked. Click the lock icon in the address bar, allow “Camera” and “Microphone”, then try again.',
    'media.err.notfound': 'No camera or microphone was found. Check that the device is connected.',
    'media.err.busy': 'The camera or microphone is being used by another app. Close it and try again.',
    'media.err.constraint': "The camera doesn't support the requested quality.",
    'media.err.generic': 'Something went wrong while accessing the device. Please try again.',
    'toast.err': 'Something went wrong. Please try again.', 'toast.offline': "You're offline — your data has been saved and will be sent later.",
    'aria.close': 'Close', 'aria.prev': 'Previous', 'aria.next': 'Next', 'aria.call': 'Call', 'aria.menu': 'Main menu',
    'marquee': '0% interest|Honest instalments|From 30% down|Up to 36 months|Direct from the developer',

    'k.title': 'Control panel', 'k.login': 'Sign in to the dashboard', 'k.user': 'Login', 'k.pass': 'Password', 'k.enter': 'Sign in', 'k.back': 'Back to the website',
    'k.secure': 'Secure connection', 'k.badAuth': 'Incorrect login or password.', 'k.insecure': 'The dashboard only works over https:// or on localhost.', 'k.netErr': "Couldn't reach the server.",
    'k.nav.overview': 'Overview', 'k.nav.leads': 'Leads', 'k.nav.reviews': 'Client reviews', 'k.nav.calls': 'Calls', 'k.nav.settings': 'Settings',
    'k.group.main': 'Main', 'k.group.clients': 'Clients', 'k.group.system': 'System',
    'k.logout': 'Sign out', 'k.owner': 'Director', 'k.manager': 'Manager', 'k.modeLocal': 'Local mode — data stays in this browser', 'k.modeServer': 'Synced with server',
    'k.hello': 'Welcome', 'k.today': 'Today',
    'k.st.leads': 'Total leads', 'k.st.newLeads': 'New leads', 'k.st.reviews': 'Reviews', 'k.st.avg': 'Average rating', 'k.st.pending': 'Reviews awaiting reply', 'k.st.calls': 'Calls',
    'k.recentLeads': 'Latest leads', 'k.recentReviews': 'Reviews awaiting reply', 'k.viewAll': 'View all',
    'k.empty.leads': 'No leads yet.', 'k.empty.reviews': 'No reviews yet.', 'k.empty.calls': 'No calls yet.', 'k.empty.pending': 'Every review has been answered.',
    'k.search': 'Search…', 'k.all': 'All', 'k.export': 'Download CSV',
    'k.col.date': 'Date', 'k.col.client': 'Client', 'k.col.phone': 'Phone', 'k.col.object': 'Property', 'k.col.payment': 'Payment', 'k.col.status': 'Status', 'k.col.actions': 'Actions',
    'k.lead.new': 'New', 'k.lead.called': 'Contacted', 'k.lead.booked': 'Reserved', 'k.lead.sold': 'Sold', 'k.lead.lost': 'Lost',
    'k.lead.src.book': 'Reservation', 'k.lead.src.callback': 'Call-back', 'k.lead.src.call': 'Video call',
    'k.lead.monthly': '{m} / mo · {M} mo', 'k.delete': 'Delete', 'k.confirmDelete': 'Delete this item?',
    'k.rev.filter.pending': 'Unanswered', 'k.rev.filter.answered': 'Answered', 'k.rev.filter.hidden': 'Hidden', 'k.rev.filter.video': 'Video',
    'k.rev.reply': 'Reply', 'k.rev.editReply': 'Edit reply', 'k.rev.replyPh': 'Your reply to the client — it appears on the website instantly', 'k.rev.send': 'Send reply',
    'k.rev.sent': 'Reply published on the website', 'k.rev.hide': 'Hide from website', 'k.rev.show': 'Show on website', 'k.rev.hiddenBadge': 'Hidden',
    'k.rev.removeReply': 'Delete reply', 'k.rev.templates': 'Reply templates',
    'k.tpl.1': "Thank you so much for your kind words! We're delighted to welcome you to the ART HOUSE family.",
    'k.tpl.2': 'Thank you for your feedback. We have reviewed your request — a manager will contact you.',
    'k.tpl.3': 'We apologise for the inconvenience. Please call our sales department — we will resolve this quickly.',
    'k.calls.incoming': 'Incoming call', 'k.calls.accept': 'Accept', 'k.calls.decline': 'Decline', 'k.calls.video': 'Video call', 'k.calls.audio': 'Voice call',
    'k.calls.st.ringing': 'Ringing', 'k.calls.st.answered': 'Answered', 'k.calls.st.missed': 'Missed', 'k.calls.st.declined': 'Declined',
    'k.calls.callback': 'Call back', 'k.calls.duration': 'Duration', 'k.calls.manual': 'Connect with a code',
    'k.calls.manualHint': "Paste the client's code to generate a reply code, then send it back to the client.", 'k.calls.offerPh': "Client's code", 'k.calls.makeAnswer': 'Create reply code',
    'k.calls.ready': 'Ready to receive calls', 'k.calls.enableSound': 'Turn on ringtone', 'k.calls.permTest': 'Test camera and microphone',
    'k.set.prices': 'Prices ($ / m²)', 'k.set.pricesHint': 'Leave empty to let clients enter the price manually in the calculator.', 'k.set.rate': 'USD rate (UZS)', 'k.set.save': 'Save', 'k.set.saved': 'Settings saved',
    'k.set.lang': 'Interface language', 'k.set.data': 'Data', 'k.set.dataHint': 'Without a server, all data is stored in this browser. Download a CSV backup regularly.',
    'k.set.about': 'System', 'k.set.server': 'Server (API_URL)', 'k.set.notSet': 'not connected', 'k.set.ownerOnly': 'This section is available to the director only.',
    'k.newLead': 'New lead: {name}', 'k.newReview': 'New review: {name} ({r}★)', 'k.idle': 'You were signed out due to inactivity.'
  };

  var DICT = { uz: uz, ru: ru, en: en };
  var CAPT = {}; // HTML'dan olingan o'zbekcha matnlar

  /* ---------------- O'zbek lotin → kirill ---------------- */
  var KEEP = /(ART HOUSE|Art House|Luxury Residence|Google Maps|Google|Yandex Maps|Yandex Go|Yandex|Telegram|Instagram|YouTube|Facebook|Chrome|Safari|Edge|WebRTC|CSV|API_URL|https?:\/\/\S+|localhost|@[\w.]+|\{\w+\}|[A-Z]{2,}\b)/g;
  var MAP = [
    ["O'", 'Ў'], ["o'", 'ў'], ["G'", 'Ғ'], ["g'", 'ғ'], ["Oʻ", 'Ў'], ["oʻ", 'ў'], ["Gʻ", 'Ғ'], ["gʻ", 'ғ'],
    ['Sh', 'Ш'], ['SH', 'Ш'], ['sh', 'ш'], ['Ch', 'Ч'], ['CH', 'Ч'], ['ch', 'ч'],
    ['Yo', 'Ё'], ['yo', 'ё'], ['Yu', 'Ю'], ['yu', 'ю'], ['Ya', 'Я'], ['ya', 'я'], ['Ye', 'Е'], ['ye', 'е']
  ];
  var ONE = { a: 'а', b: 'б', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', x: 'х', y: 'й', z: 'з', c: 'с', w: 'в' };
  function cyrWord(w) {
    var out = '', i = 0;
    while (i < w.length) {
      var two = w.substr(i, 2), hit = null;
      for (var k = 0; k < MAP.length; k++) if (MAP[k][0] === two) { hit = MAP[k][1]; break; }
      if (hit) { out += hit; i += 2; continue; }
      var ch = w[i], lo = ch.toLowerCase();
      if (lo === 'e' && (i === 0 || /[aeiouаеиоу'ʼ]/i.test(w[i - 1]))) { out += ch === lo ? 'э' : 'Э'; i++; continue; }
      if ((ch === "'" || ch === 'ʼ' || ch === '’') && i > 0 && /[a-z]/i.test(w[i - 1])) { out += 'ъ'; i++; continue; }
      if (ONE[lo]) out += ch === lo ? ONE[lo] : ONE[lo].toUpperCase(); else out += ch;
      i++;
    }
    return out;
  }
  function toCyr(s) {
    if (!s) return s;
    return String(s).split(KEEP).map(function (part, idx) { return idx % 2 ? part : part.replace(/[A-Za-z'ʻʼ’]+/g, cyrWord); }).join('');
  }

  /* ---------------- API ---------------- */
  var lang = 'uz';
  try { lang = localStorage.getItem('ah3_lang') || ''; } catch (e) {}
  if (!lang || !LANGS.some(function (l) { return l.code === lang; })) {
    var nav = (navigator.language || 'uz').toLowerCase();
    lang = nav.indexOf('ru') === 0 ? 'ru' : nav.indexOf('en') === 0 ? 'en' : 'uz';
  }
  var subs = [];

  function fill(s, vars) { return vars ? String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }) : s; }
  function base(key) { return uz[key] != null ? uz[key] : CAPT[key] != null ? CAPT[key] : key; }
  function t(key, vars) {
    var s;
    if (lang === 'cy') s = toCyr(base(key));
    else if (lang === 'uz') s = base(key);
    else s = DICT[lang][key] != null ? DICT[lang][key] : base(key);
    return fill(s, vars);
  }
  /* {uz, ru, en} ko'rinishidagi kontent */
  function pick(o) {
    if (o == null) return '';
    if (typeof o === 'string') return lang === 'cy' ? toCyr(o) : o;
    if (lang === 'cy') return toCyr(o.uz || '');
    return o[lang] || o.uz || o.en || '';
  }

  function capture(root) {
    (root || document).querySelectorAll('[data-i]').forEach(function (el) { var k = el.getAttribute('data-i'); if (CAPT[k] == null) CAPT[k] = el.textContent.trim(); });
    (root || document).querySelectorAll('[data-i-ph]').forEach(function (el) { var k = el.getAttribute('data-i-ph'); if (CAPT[k] == null) CAPT[k] = el.getAttribute('placeholder') || ''; });
  }
  function apply(root) {
    root = root || document;
    capture(root);
    root.querySelectorAll('[data-i]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i')); });
    root.querySelectorAll('[data-i-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i-ph'))); });
    root.querySelectorAll('[data-i-al]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i-al'))); });
    var L = info();
    document.documentElement.lang = L.html;
  }
  function info(code) { code = code || lang; return LANGS.filter(function (l) { return l.code === code; })[0] || LANGS[0]; }
  function set(code) {
    if (!LANGS.some(function (l) { return l.code === code; })) return;
    lang = code; try { localStorage.setItem('ah3_lang', code); } catch (e) {}
    apply(); subs.forEach(function (cb) { try { cb(code); } catch (e) { console.error(e); } });
  }

  /* Formatlash */
  function num(n) { return Math.round(n).toLocaleString('en-US').replace(/,/g, ' '); }
  function usd(n) { return '$' + num(n); }
  function date(ts, opts) {
    var L = info(), loc = lang === 'uz' || lang === 'cy' ? 'uz-Latn-UZ' : L.locale;
    var s;
    try { s = new Intl.DateTimeFormat(loc, Object.assign({ timeZone: 'Asia/Tashkent' }, opts || { day: 'numeric', month: 'long', year: 'numeric' })).format(ts); }
    catch (e) { s = new Date(ts).toLocaleDateString(); }
    return lang === 'cy' ? toCyr(s) : s;
  }
  function ago(ts) {
    var d = (ts - Date.now()) / 1000, a = Math.abs(d), loc = lang === 'uz' || lang === 'cy' ? 'uz' : info().locale;
    var u = a < 60 ? ['second', d] : a < 3600 ? ['minute', d / 60] : a < 86400 ? ['hour', d / 3600] : a < 2592000 ? ['day', d / 86400] : null;
    if (!u) return date(ts);
    try { var s = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' }).format(Math.round(u[1]), u[0]); return lang === 'cy' ? toCyr(s) : s; }
    catch (e) { return date(ts); }
  }

  /* Til tanlash menyusi (globus) */
  function mountSwitcher(box) {
    if (!box) return;
    var btn = box.querySelector('.lang-btn'), list = box.querySelector('.lang-list');
    function render() {
      btn.querySelector('b').textContent = info().short;
      btn.setAttribute('aria-label', t('lang.title'));
      list.innerHTML = LANGS.map(function (l) { return '<li><button type="button" role="option" data-l="' + l.code + '" aria-selected="' + (l.code === lang) + '"><span>' + l.label + '</span><small>' + l.short + '</small></button></li>'; }).join('');
    }
    function close() { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); var o = list.hidden; list.hidden = !o; btn.setAttribute('aria-expanded', String(o)); });
    list.addEventListener('click', function (e) { var b = e.target.closest('[data-l]'); if (!b) return; set(b.dataset.l); close(); });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    subs.push(render); render();
  }

  window.I18N = {
    t: t, pick: pick, apply: apply, set: set, info: info, langs: LANGS, toCyr: toCyr,
    get lang() { return lang; },
    on: function (cb) { subs.push(cb); },
    num: num, usd: usd, date: date, ago: ago, mountSwitcher: mountSwitcher
  };
})();
