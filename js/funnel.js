/* =====================================================================
   ART HOUSE — saytdagi sotuv voronkasi (dizayn: Figma → «Art House · Sotuv oynalari va afzalliklar»)
   1) Taklif oynasi: mijoz kalit-kartani barmog'i bilan suradi → boshlang'ich to'lov ochiladi → ism va telefon →
      ariza kabinetga va Telegram guruhga boradi (via: 'popup').
   2) Bo'lib to'lash kalkulyatori oynasi: necha xonali, maydon, boshlang'ich to'lov, muddat → oylik to'lov →
      «Shu shart bilan band qilish» → ism va telefon (via: 'popup-calc', xonadon va hisob bilan).
   3) Afzalliklar lentasi (bosh banner ostida): telefonda bittadan aylanadi va suriladi, kompyuterda 5 ustun.
   Oynalar kirgan zahoti chiqmaydi: mijoz saytni ko'rib harakat qilgandan keyin (12 soniya + pastga surish) chiqadi.
   Qoidalar: bir tashrifda ko'pi bilan 2 ta oyna va ular ketma-ket emas (ikkinchisi 45 soniya va yana surishdan keyin);
   yopilgan oyna 3 kun qayta o'zi chiqmaydi; ariza qoldirgan mijozga umuman chiqmaydi.
   ?pp=offer / ?pp=calc — darhol ochish (sinov uchun), ?pp=0 — o'chirish. Bosh bannerdagi «To'lovni hisoblash» → kalkulyator.
   Narx hisobi kalkulyator va AI maslahatchi bilan bir xil: maydon × 1 m² narxi, 100 $ gacha yaxlitlanadi.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.I18N || !window.CFG || !window.PROJECTS || !window.AH_SITE) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = I18N.t, pick = I18N.pick;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var D = {
    uz: { 'home.eyebrow': "Quruvchidan to'g'ridan-to'g'ri · {years} yil tajriba", 'home.lead': "Musaffo, Obod Maskan va Ko'kcha Oqtepa majmualarida xonadonlar. {down} boshlang'ich to'lov, qolganini {months} oygacha teng bo'lib to'laysiz. Bank krediti yo'q, ustama 0%.",
      'pop.k1': 'Art House taklifi', 'pop.t1': 'Uyingiz qanchadan boshlanadi?', 'pop.s1': "Kartani barmog'ingiz bilan suring: boshlang'ich to'lov ochiladi.", 'pop.scratch': 'Shu yerni suring', 'pop.open': 'Yoki bosing: kartani ochish',
      'pop.tr1': "{years} yillik quruvchi, rasmiy shartnoma", 'pop.tr2': "Bank krediti yo'q, ustama 0%", 'pop.tr3': "Musaffo'da ta'mirli, tayyor uylar bor",
      'pop.k2': 'Sizning shartingiz', 'pop.down': "Boshlang'ich to'lov", 'pop.rest': "Qolgani {months} oyga teng bo'lib · ustama 0%", 'pop.t2': 'Shu shart bilan uy olishni xohlaysizmi?',
      'pop.s2': "Ismingiz va raqamingizni qoldiring. Menejer qo'ng'iroq qilib, sizga mos xonadonni va aniq hisobni aytadi.", 'pop.name': 'Ismingiz', 'pop.namePh': 'Masalan, Aziz', 'pop.phone': 'Telefon raqamingiz',
      'pop.cta': "Menga qo'ng'iroq qiling", 'pop.priv': 'Raqamingiz faqat Art House menejeriga boradi', 'pop.proof': "{a}, {b} va boshqalar Art House'ni tanladi",
      'pop.okT': 'Rahmat, {name}!', 'pop.okD': "Menejer {phone} raqamiga qo'ng'iroq qilib, sizga mos xonadonni aytadi.", 'pop.pill': '{v} dan', 'pop.close': 'Yopish',
      'pc.k': "Bo'lib to'lash · 0%", 'pc.t': "Oylik to'lovni hisoblab ko'ring", 'pc.s': "3 ta tanlov: oylik to'lov darhol chiqadi. Bank yo'q, ustama yo'q.", 'pc.formT': 'Shu shartni band qilamiz',
      'pc.formS': "Ismingiz va raqamingizni qoldiring: menejer qo'ng'iroq qilib, shartni tasdiqlaydi va xonadonni ko'rishga taklif qiladi.", 'pc.send': "So'rovni yuborish", 'pc.back': 'Orqaga', 'pc.ai': 'Savolingiz bormi? AI maslahatchi javob beradi',
      'hf.p': 'Loyiha', 'hf.r': 'Necha xonali?', 'hf.dup': 'Dupleks', 'hf.a': 'Maydon', 'hf.d': "Boshlang'ich to'lov", 'hf.m': 'Muddat', 'hf.res': 'Oyiga', 'hf.price': 'narxi {v}', 'hf.book': 'Shu shart bilan band qilish',
      'usp.aria': 'Art House afzalliklari', 'usp.1t': "Quruvchidan to'g'ridan-to'g'ri", 'usp.1d': "Vositachi va ustama yo'q. Shartnoma Art House bilan tuziladi.", 'usp.2t': "Tayyor ta'mirli uylar", 'usp.2d': "Musaffo'da ta'mirlangan xonadonlar bor: kalitni olasiz va ko'chib o'tasiz.",
      'usp.3t': "0% bo'lib to'lash", 'usp.3d': "{down} boshlang'ich, qolgani {months} oygacha teng to'lov. Bank ham, foiz ham yo'q.", 'usp.4t': '{years} yillik tajriba', 'usp.4d': "2012 yildan beri quramiz: 30+ loyiha amalga oshirilgan.", 'usp.5t': 'Tez javob', 'usp.5d': "Ariza qoldiring: menejer ish vaqtida bir necha daqiqada qo'ng'iroq qiladi." },
    ru: { 'home.eyebrow': 'Напрямую от застройщика · {years} лет опыта', 'home.lead': 'Квартиры в комплексах Musaffo, Obod Maskan и Ko‘kcha Oqtepa. Первый взнос {down}, остаток равными частями до {months} месяцев. Без банковского кредита, наценка 0%.',
      'pop.k1': 'Предложение Art House', 'pop.t1': 'С какой суммы начинается ваш дом?', 'pop.s1': 'Сотрите карту пальцем: откроется первый взнос.', 'pop.scratch': 'Сотрите здесь', 'pop.open': 'Или нажмите: открыть карту',
      'pop.tr1': 'Застройщик с опытом {years} лет, официальный договор', 'pop.tr2': 'Без банковского кредита, наценка 0%', 'pop.tr3': 'В Musaffo есть квартиры с готовым ремонтом',
      'pop.k2': 'Ваши условия', 'pop.down': 'Первый взнос', 'pop.rest': 'Остаток на {months} мес. равными частями · наценка 0%', 'pop.t2': 'Хотите купить квартиру на этих условиях?',
      'pop.s2': 'Оставьте имя и номер. Менеджер перезвонит, подберёт квартиру и назовёт точный расчёт.', 'pop.name': 'Ваше имя', 'pop.namePh': 'Например, Азиз', 'pop.phone': 'Ваш номер телефона',
      'pop.cta': 'Перезвоните мне', 'pop.priv': 'Ваш номер получит только менеджер Art House', 'pop.proof': '{a}, {b} и другие выбрали Art House',
      'pop.okT': 'Спасибо, {name}!', 'pop.okD': 'Менеджер позвонит на номер {phone} и подберёт вам квартиру.', 'pop.pill': 'от {v}', 'pop.close': 'Закрыть',
      'pc.k': 'Рассрочка · 0%', 'pc.t': 'Рассчитайте ежемесячный платёж', 'pc.s': '3 шага: платёж появится сразу. Без банка и без наценки.', 'pc.formT': 'Забронируем на этих условиях',
      'pc.formS': 'Оставьте имя и номер: менеджер перезвонит, подтвердит условия и пригласит посмотреть квартиру.', 'pc.send': 'Отправить заявку', 'pc.back': 'Назад', 'pc.ai': 'Есть вопрос? Ответит AI-консультант',
      'hf.p': 'Проект', 'hf.r': 'Сколько комнат?', 'hf.dup': 'Дуплекс', 'hf.a': 'Площадь', 'hf.d': 'Первый взнос', 'hf.m': 'Срок', 'hf.res': 'В месяц', 'hf.price': 'цена {v}', 'hf.book': 'Забронировать на этих условиях',
      'usp.aria': 'Преимущества Art House', 'usp.1t': 'Напрямую от застройщика', 'usp.1d': 'Без посредников и наценки. Договор заключается с Art House.', 'usp.2t': 'Квартиры с ремонтом', 'usp.2d': 'В Musaffo есть квартиры с готовым ремонтом: получаете ключи и переезжаете.',
      'usp.3t': 'Рассрочка 0%', 'usp.3d': 'Первый взнос {down}, остаток равными частями до {months} мес. Без банка и процентов.', 'usp.4t': '{years} лет опыта', 'usp.4d': 'Строим с 2012 года: реализовано 30+ проектов.', 'usp.5t': 'Быстрый ответ', 'usp.5d': 'Оставьте заявку: менеджер перезвонит за несколько минут в рабочее время.' },
    en: { 'home.eyebrow': 'Direct from the developer · {years} years of experience', 'home.lead': "Apartments in the Musaffo, Obod Maskan and Ko'kcha Oqtepa complexes. Pay {down} up front and the rest in equal instalments over up to {months} months. No bank loan, 0% markup.",
      'pop.k1': 'Art House offer', 'pop.t1': 'Where does your home start?', 'pop.s1': 'Scratch the card with your finger to reveal the down payment.', 'pop.scratch': 'Scratch here', 'pop.open': 'Or tap to open the card',
      'pop.tr1': 'Developer with {years} years of experience, official contract', 'pop.tr2': 'No bank loan, 0% markup', 'pop.tr3': 'Move-in-ready renovated homes in Musaffo',
      'pop.k2': 'Your terms', 'pop.down': 'Down payment', 'pop.rest': 'The rest in equal payments over {months} months · 0% markup', 'pop.t2': 'Would you like a home on these terms?',
      'pop.s2': 'Leave your name and number. A manager will call, suggest a suitable home and give you an exact calculation.', 'pop.name': 'Your name', 'pop.namePh': 'e.g. Aziz', 'pop.phone': 'Your phone number',
      'pop.cta': 'Call me back', 'pop.priv': 'Only an Art House manager will see your number', 'pop.proof': '{a}, {b} and others chose Art House',
      'pop.okT': 'Thank you, {name}!', 'pop.okD': 'A manager will call {phone} and suggest a home that suits you.', 'pop.pill': 'from {v}', 'pop.close': 'Close',
      'pc.k': 'Instalments · 0%', 'pc.t': 'Work out your monthly payment', 'pc.s': '3 choices and the monthly payment appears at once. No bank, no markup.', 'pc.formT': "Let's reserve it on these terms",
      'pc.formS': 'Leave your name and number: a manager will call, confirm the terms and invite you to view the home.', 'pc.send': 'Send request', 'pc.back': 'Back', 'pc.ai': 'Have a question? The AI adviser will answer',
      'hf.p': 'Project', 'hf.r': 'How many rooms?', 'hf.dup': 'Duplex', 'hf.a': 'Area', 'hf.d': 'Down payment', 'hf.m': 'Term', 'hf.res': 'Per month', 'hf.price': 'price {v}', 'hf.book': 'Reserve on these terms',
      'usp.aria': 'Why Art House', 'usp.1t': 'Direct from the developer', 'usp.1d': 'No middlemen, no markup. You sign the contract with Art House.', 'usp.2t': 'Renovated homes', 'usp.2d': 'Musaffo has renovated apartments: get the keys and move in.',
      'usp.3t': '0% instalments', 'usp.3d': '{down} down, the rest in equal payments over up to {months} months. No bank, no interest.', 'usp.4t': '{years} years of experience', 'usp.4d': 'Building since 2012: 30+ projects completed.', 'usp.5t': 'Fast response', 'usp.5d': 'Leave a request: a manager calls back within minutes during working hours.' },
    fr: { 'home.eyebrow': "En direct du promoteur · {years} ans d'expérience", 'home.lead': "Appartements dans les résidences Musaffo, Obod Maskan et Ko'kcha Oqtepa. Apport de {down}, puis le reste en mensualités égales sur {months} mois maximum. Sans crédit bancaire, 0 % de majoration.",
      'pop.k1': 'Offre Art House', 'pop.t1': 'À partir de combien votre logement ?', 'pop.s1': 'Grattez la carte du doigt pour découvrir l’apport initial.', 'pop.scratch': 'Grattez ici', 'pop.open': 'Ou touchez pour ouvrir la carte',
      'pop.tr1': 'Promoteur depuis {years} ans, contrat officiel', 'pop.tr2': 'Sans crédit bancaire, 0 % de majoration', 'pop.tr3': 'Appartements rénovés prêts à habiter à Musaffo',
      'pop.k2': 'Vos conditions', 'pop.down': 'Apport initial', 'pop.rest': 'Le reste en mensualités égales sur {months} mois · 0 % de majoration', 'pop.t2': 'Un logement à ces conditions vous intéresse ?',
      'pop.s2': 'Laissez votre nom et votre numéro. Un conseiller vous rappelle, vous propose un logement adapté et un calcul précis.', 'pop.name': 'Votre nom', 'pop.namePh': 'Par ex. Aziz', 'pop.phone': 'Votre numéro',
      'pop.cta': 'Rappelez-moi', 'pop.priv': 'Seul un conseiller Art House verra votre numéro', 'pop.proof': '{a}, {b} et d’autres ont choisi Art House',
      'pop.okT': 'Merci, {name} !', 'pop.okD': 'Un conseiller appellera le {phone} et vous proposera un logement adapté.', 'pop.pill': 'dès {v}', 'pop.close': 'Fermer',
      'pc.k': 'Paiement échelonné · 0 %', 'pc.t': 'Calculez votre mensualité', 'pc.s': '3 choix et la mensualité s’affiche aussitôt. Sans banque ni majoration.', 'pc.formT': 'Réservons à ces conditions',
      'pc.formS': 'Laissez votre nom et votre numéro : un conseiller vous rappelle, confirme les conditions et vous invite à visiter.', 'pc.send': 'Envoyer la demande', 'pc.back': 'Retour', 'pc.ai': 'Une question ? Le conseiller IA vous répond',
      'hf.p': 'Projet', 'hf.r': 'Combien de pièces ?', 'hf.dup': 'Duplex', 'hf.a': 'Surface', 'hf.d': 'Apport initial', 'hf.m': 'Durée', 'hf.res': 'Par mois', 'hf.price': 'prix {v}', 'hf.book': 'Réserver à ces conditions',
      'usp.aria': 'Les atouts Art House', 'usp.1t': 'En direct du promoteur', 'usp.1d': 'Sans intermédiaire ni majoration. Le contrat est signé avec Art House.', 'usp.2t': 'Logements rénovés', 'usp.2d': 'À Musaffo, des appartements rénovés : vous recevez les clés et emménagez.',
      'usp.3t': 'Paiement 0 %', 'usp.3d': 'Apport de {down}, le reste en mensualités égales jusqu’à {months} mois. Sans banque ni intérêts.', 'usp.4t': '{years} ans d’expérience', 'usp.4d': 'Nous construisons depuis 2012 : plus de 30 projets réalisés.', 'usp.5t': 'Réponse rapide', 'usp.5d': 'Laissez une demande : un conseiller rappelle en quelques minutes pendant les heures d’ouverture.' },
    it: { 'home.eyebrow': 'Direttamente dal costruttore · {years} anni di esperienza', 'home.lead': "Appartamenti nei complessi Musaffo, Obod Maskan e Ko'kcha Oqtepa. Anticipo del {down}, il resto in rate uguali fino a {months} mesi. Nessun mutuo, 0% di maggiorazione.",
      'pop.k1': 'Offerta Art House', 'pop.t1': 'Da quanto parte la tua casa?', 'pop.s1': 'Gratta la carta con il dito per scoprire l’anticipo.', 'pop.scratch': 'Gratta qui', 'pop.open': 'Oppure tocca per aprire la carta',
      'pop.tr1': 'Costruttore con {years} anni di esperienza, contratto ufficiale', 'pop.tr2': 'Nessun mutuo, 0% di maggiorazione', 'pop.tr3': 'A Musaffo appartamenti ristrutturati, pronti da abitare',
      'pop.k2': 'Le tue condizioni', 'pop.down': 'Anticipo', 'pop.rest': 'Il resto in rate uguali per {months} mesi · 0% di maggiorazione', 'pop.t2': 'Vuoi una casa a queste condizioni?',
      'pop.s2': 'Lascia nome e numero. Un consulente ti richiama, ti propone la casa giusta e un calcolo preciso.', 'pop.name': 'Il tuo nome', 'pop.namePh': 'Ad es. Aziz', 'pop.phone': 'Il tuo numero',
      'pop.cta': 'Richiamatemi', 'pop.priv': 'Il tuo numero lo vedrà solo un consulente Art House', 'pop.proof': '{a}, {b} e altri hanno scelto Art House',
      'pop.okT': 'Grazie, {name}!', 'pop.okD': 'Un consulente chiamerà il {phone} e ti proporrà la casa giusta.', 'pop.pill': 'da {v}', 'pop.close': 'Chiudi',
      'pc.k': 'Rate · 0%', 'pc.t': 'Calcola la rata mensile', 'pc.s': '3 scelte e la rata compare subito. Niente banca, niente maggiorazione.', 'pc.formT': 'Prenotiamo a queste condizioni',
      'pc.formS': 'Lascia nome e numero: un consulente ti richiama, conferma le condizioni e ti invita a vedere la casa.', 'pc.send': 'Invia richiesta', 'pc.back': 'Indietro', 'pc.ai': 'Hai una domanda? Risponde il consulente IA',
      'hf.p': 'Progetto', 'hf.r': 'Quante stanze?', 'hf.dup': 'Duplex', 'hf.a': 'Superficie', 'hf.d': 'Anticipo', 'hf.m': 'Durata', 'hf.res': 'Al mese', 'hf.price': 'prezzo {v}', 'hf.book': 'Prenota a queste condizioni',
      'usp.aria': 'I vantaggi di Art House', 'usp.1t': 'Direttamente dal costruttore', 'usp.1d': 'Niente intermediari né maggiorazioni. Il contratto si firma con Art House.', 'usp.2t': 'Case ristrutturate', 'usp.2d': 'A Musaffo ci sono appartamenti ristrutturati: ritiri le chiavi e ti trasferisci.',
      'usp.3t': 'Rate allo 0%', 'usp.3d': 'Anticipo del {down}, il resto in rate uguali fino a {months} mesi. Niente banca, niente interessi.', 'usp.4t': '{years} anni di esperienza', 'usp.4d': 'Costruiamo dal 2012: oltre 30 progetti realizzati.', 'usp.5t': 'Risposta rapida', 'usp.5d': 'Lascia una richiesta: un consulente ti richiama in pochi minuti in orario di lavoro.' },
    es: { 'home.eyebrow': 'Directo del promotor · {years} años de experiencia', 'home.lead': "Apartamentos en los complejos Musaffo, Obod Maskan y Ko'kcha Oqtepa. Entrada del {down} y el resto en cuotas iguales de hasta {months} meses. Sin préstamo bancario, 0 % de recargo.",
      'pop.k1': 'Oferta Art House', 'pop.t1': '¿Desde cuánto empieza su vivienda?', 'pop.s1': 'Rasque la tarjeta con el dedo para ver la entrada.', 'pop.scratch': 'Rasque aquí', 'pop.open': 'O toque para abrir la tarjeta',
      'pop.tr1': 'Promotor con {years} años de experiencia, contrato oficial', 'pop.tr2': 'Sin préstamo bancario, 0 % de recargo', 'pop.tr3': 'En Musaffo hay pisos reformados listos para entrar',
      'pop.k2': 'Sus condiciones', 'pop.down': 'Entrada', 'pop.rest': 'El resto en cuotas iguales durante {months} meses · 0 % de recargo', 'pop.t2': '¿Quiere una vivienda con estas condiciones?',
      'pop.s2': 'Deje su nombre y número. Un asesor le llamará, le propondrá una vivienda adecuada y un cálculo exacto.', 'pop.name': 'Su nombre', 'pop.namePh': 'Por ejemplo, Aziz', 'pop.phone': 'Su número de teléfono',
      'pop.cta': 'Llámenme', 'pop.priv': 'Su número solo lo verá un asesor de Art House', 'pop.proof': '{a}, {b} y otros eligieron Art House',
      'pop.okT': '¡Gracias, {name}!', 'pop.okD': 'Un asesor llamará al {phone} y le propondrá una vivienda adecuada.', 'pop.pill': 'desde {v}', 'pop.close': 'Cerrar',
      'pc.k': 'Plazos · 0 %', 'pc.t': 'Calcule su cuota mensual', 'pc.s': '3 elecciones y la cuota aparece al instante. Sin banco ni recargo.', 'pc.formT': 'Reservemos con estas condiciones',
      'pc.formS': 'Deje su nombre y número: un asesor le llamará, confirmará las condiciones y le invitará a ver la vivienda.', 'pc.send': 'Enviar solicitud', 'pc.back': 'Atrás', 'pc.ai': '¿Tiene una pregunta? Responde el asesor IA',
      'hf.p': 'Proyecto', 'hf.r': '¿Cuántas habitaciones?', 'hf.dup': 'Dúplex', 'hf.a': 'Superficie', 'hf.d': 'Entrada', 'hf.m': 'Plazo', 'hf.res': 'Al mes', 'hf.price': 'precio {v}', 'hf.book': 'Reservar con estas condiciones',
      'usp.aria': 'Ventajas de Art House', 'usp.1t': 'Directo del promotor', 'usp.1d': 'Sin intermediarios ni recargos. El contrato se firma con Art House.', 'usp.2t': 'Viviendas reformadas', 'usp.2d': 'En Musaffo hay pisos reformados: recoge las llaves y se muda.',
      'usp.3t': 'Plazos al 0 %', 'usp.3d': 'Entrada del {down}, el resto en cuotas iguales hasta {months} meses. Sin banco ni intereses.', 'usp.4t': '{years} años de experiencia', 'usp.4d': 'Construimos desde 2012: más de 30 proyectos realizados.', 'usp.5t': 'Respuesta rápida', 'usp.5d': 'Deje una solicitud: un asesor le llama en minutos en horario laboral.' },
    de: { 'home.eyebrow': 'Direkt vom Bauträger · {years} Jahre Erfahrung', 'home.lead': "Wohnungen in den Anlagen Musaffo, Obod Maskan und Ko'kcha Oqtepa. {down} Anzahlung, der Rest in gleichen Raten über bis zu {months} Monate. Ohne Bankkredit, 0 % Aufschlag.",
      'pop.k1': 'Art House Angebot', 'pop.t1': 'Ab welchem Betrag beginnt Ihr Zuhause?', 'pop.s1': 'Rubbeln Sie die Karte mit dem Finger frei: die Anzahlung erscheint.', 'pop.scratch': 'Hier rubbeln', 'pop.open': 'Oder tippen: Karte öffnen',
      'pop.tr1': 'Bauträger mit {years} Jahren Erfahrung, offizieller Vertrag', 'pop.tr2': 'Ohne Bankkredit, 0 % Aufschlag', 'pop.tr3': 'In Musaffo bezugsfertig renovierte Wohnungen',
      'pop.k2': 'Ihre Konditionen', 'pop.down': 'Anzahlung', 'pop.rest': 'Der Rest in gleichen Raten über {months} Monate · 0 % Aufschlag', 'pop.t2': 'Möchten Sie eine Wohnung zu diesen Konditionen?',
      'pop.s2': 'Hinterlassen Sie Name und Nummer. Ein Berater ruft an, schlägt eine passende Wohnung vor und nennt die genaue Rechnung.', 'pop.name': 'Ihr Name', 'pop.namePh': 'z. B. Aziz', 'pop.phone': 'Ihre Telefonnummer',
      'pop.cta': 'Rufen Sie mich an', 'pop.priv': 'Ihre Nummer sieht nur ein Art House Berater', 'pop.proof': '{a}, {b} und andere haben Art House gewählt',
      'pop.okT': 'Danke, {name}!', 'pop.okD': 'Ein Berater ruft unter {phone} an und schlägt Ihnen eine passende Wohnung vor.', 'pop.pill': 'ab {v}', 'pop.close': 'Schließen',
      'pc.k': 'Ratenzahlung · 0 %', 'pc.t': 'Monatsrate berechnen', 'pc.s': '3 Angaben, die Monatsrate erscheint sofort. Ohne Bank, ohne Aufschlag.', 'pc.formT': 'Wir reservieren zu diesen Konditionen',
      'pc.formS': 'Hinterlassen Sie Name und Nummer: ein Berater ruft an, bestätigt die Konditionen und lädt Sie zur Besichtigung ein.', 'pc.send': 'Anfrage senden', 'pc.back': 'Zurück', 'pc.ai': 'Eine Frage? Der KI-Berater antwortet',
      'hf.p': 'Projekt', 'hf.r': 'Wie viele Zimmer?', 'hf.dup': 'Maisonette', 'hf.a': 'Fläche', 'hf.d': 'Anzahlung', 'hf.m': 'Laufzeit', 'hf.res': 'Pro Monat', 'hf.price': 'Preis {v}', 'hf.book': 'Zu diesen Konditionen reservieren',
      'usp.aria': 'Vorteile von Art House', 'usp.1t': 'Direkt vom Bauträger', 'usp.1d': 'Ohne Vermittler und Aufschlag. Der Vertrag wird mit Art House geschlossen.', 'usp.2t': 'Renovierte Wohnungen', 'usp.2d': 'In Musaffo gibt es renovierte Wohnungen: Schlüssel holen und einziehen.',
      'usp.3t': '0 % Ratenzahlung', 'usp.3d': '{down} Anzahlung, der Rest in gleichen Raten bis {months} Monate. Ohne Bank und Zinsen.', 'usp.4t': '{years} Jahre Erfahrung', 'usp.4d': 'Wir bauen seit 2012: über 30 Projekte umgesetzt.', 'usp.5t': 'Schnelle Antwort', 'usp.5d': 'Anfrage senden: ein Berater ruft während der Geschäftszeiten in wenigen Minuten zurück.' },
    tr: { 'home.eyebrow': 'Doğrudan müteahhitten · {years} yıllık deneyim', 'home.lead': "Musaffo, Obod Maskan ve Ko'kcha Oqtepa projelerinde daireler. {down} peşinat, kalanı {months} aya kadar eşit taksitlerle. Banka kredisi yok, %0 ek ücret.",
      'pop.k1': 'Art House teklifi', 'pop.t1': 'Eviniz kaçtan başlıyor?', 'pop.s1': 'Kartı parmağınızla kazıyın: peşinat ortaya çıksın.', 'pop.scratch': 'Burayı kazıyın', 'pop.open': 'Ya da dokunun: kartı aç',
      'pop.tr1': '{years} yıllık müteahhit, resmi sözleşme', 'pop.tr2': 'Banka kredisi yok, %0 ek ücret', 'pop.tr3': "Musaffo'da tadilatı yapılmış, taşınmaya hazır daireler",
      'pop.k2': 'Koşullarınız', 'pop.down': 'Peşinat', 'pop.rest': 'Kalanı {months} ay eşit taksitle · %0 ek ücret', 'pop.t2': 'Bu koşullarla ev sahibi olmak ister misiniz?',
      'pop.s2': 'Adınızı ve numaranızı bırakın. Danışman arayıp size uygun daireyi ve net hesabı söylesin.', 'pop.name': 'Adınız', 'pop.namePh': 'Örneğin Aziz', 'pop.phone': 'Telefon numaranız',
      'pop.cta': 'Beni arayın', 'pop.priv': 'Numaranızı yalnızca Art House danışmanı görür', 'pop.proof': "{a}, {b} ve diğerleri Art House'u seçti",
      'pop.okT': 'Teşekkürler, {name}!', 'pop.okD': 'Danışman {phone} numarasını arayıp size uygun daireyi önerecek.', 'pop.pill': 'başlangıç {v}', 'pop.close': 'Kapat',
      'pc.k': 'Taksit · %0', 'pc.t': 'Aylık ödemenizi hesaplayın', 'pc.s': '3 seçim, aylık ödeme hemen çıkar. Banka yok, ek ücret yok.', 'pc.formT': 'Bu koşullarla rezerve edelim',
      'pc.formS': 'Adınızı ve numaranızı bırakın: danışman arayıp koşulları onaylar ve daireyi görmeye davet eder.', 'pc.send': 'Talebi gönder', 'pc.back': 'Geri', 'pc.ai': 'Sorunuz mu var? AI danışman yanıtlar',
      'hf.p': 'Proje', 'hf.r': 'Kaç oda?', 'hf.dup': 'Dubleks', 'hf.a': 'Alan', 'hf.d': 'Peşinat', 'hf.m': 'Vade', 'hf.res': 'Aylık', 'hf.price': 'fiyat {v}', 'hf.book': 'Bu koşullarla rezerve et',
      'usp.aria': "Art House'un avantajları", 'usp.1t': 'Doğrudan müteahhitten', 'usp.1d': 'Aracı ve ek ücret yok. Sözleşme Art House ile yapılır.', 'usp.2t': 'Tadilatlı daireler', 'usp.2d': "Musaffo'da tadilatı yapılmış daireler var: anahtarı alın, taşının.",
      'usp.3t': '%0 taksit', 'usp.3d': '{down} peşinat, kalanı {months} aya kadar eşit taksitle. Banka ve faiz yok.', 'usp.4t': '{years} yıllık deneyim', 'usp.4d': "2012'den beri inşa ediyoruz: 30'dan fazla proje tamamlandı.", 'usp.5t': 'Hızlı yanıt', 'usp.5d': 'Talep bırakın: danışman mesai saatlerinde dakikalar içinde arar.' }
  };
  Object.keys(D).forEach(function (l) { I18N.extend(l, D[l]); });
  var copy = $('#p-home .hero-copy'); if (copy) I18N.apply(copy); /* banner matni yangi taklif bilan */

  /* ikonkalar: ingichka chiziqli, oltin emas (matn rangida) */
  var SV = function (d, c) { return '<svg class="' + (c || 'pp-ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var IC = {
    building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>',
    key: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r="1"/>',
    percent: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m15 9-6 6M9 9h.01M15 15h.01"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    phone: '<path d="M13 2a9 9 0 0 1 9 9M13 6a5 5 0 0 1 5 5"/><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>'
  };
  var LOGO = '<svg class="pp-logo" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke-width="2.5" d="M50 97.5H2.5V2.5H50M50 97.5H97.5V2.5H50"/><path stroke-width="3" d="M50 92H8V8H50M50 92H92V8H50"/><path stroke-width="4" d="M44 92V34q0-7 6-10M56 92V34q0-7-6-10M33 92V48q0-6 6-8M67 92V48q0-6-6-8M22 92V62q0-6 6-8M78 92V62q0-6-6-8M50 24V11"/></svg>';

  /* ---------- xonadonlar va narx (kalkulyator bilan bir xil) ---------- */
  function list() { return PROJECTS.filter(function (p) { return p.plans && p.plans.length; }); }
  if (!list().length) return;
  var price = function (p, pl) { return Math.min(500000, Math.max(20000, Math.round(pl.area * (p.priceM2 || CFG.PRICE_M2) / 100) * 100)); };
  var maxM = function () { return Math.max.apply(null, CFG.MONTHS); };
  function minDown() { var m = Infinity; list().forEach(function (p) { p.plans.forEach(function (pl) { m = Math.min(m, price(p, pl)); }); }); return Math.round(m * CFG.DOWN_MIN / 100); }
  var area = function (pl) { return (pl.areaTxt || String(pl.area).replace('.', ',')) + ' m²'; };

  /* kalkulyator holati: loyiha (p), xonalar (r), reja (i), boshlang'ich to'lov % (pct), muddat (m) */
  var S = { p: '', r: '', i: -1, pct: CFG.DOWN_MIN, m: maxM(), touched: 0 };
  try { var sv = JSON.parse(sessionStorage.getItem('ah_hf')); if (sv) Object.assign(S, sv); } catch (e) {}
  function save() { try { sessionStorage.setItem('ah_hf', JSON.stringify(S)); } catch (e) {} }
  function proj() { var L = list(); return L.filter(function (p) { return p.id === S.p; })[0] || L[0]; }
  function units() { var P = proj(); return P.plans.map(function (pl, i) { return { i: i, pl: pl, r: pl.duplex ? 'd' : String(pl.rooms), price: price(P, pl) }; }); }
  function kinds() { var k = []; units().forEach(function (u) { if (k.indexOf(u.r) < 0) k.push(u.r); }); return k.sort(function (a, b) { return a === 'd' ? 1 : b === 'd' ? -1 : a - b; }); }
  function sane() {
    S.p = proj().id;
    var U = units(), K = kinds();
    if (K.indexOf(S.r) < 0) S.r = K[0];
    var mine = U.filter(function (u) { return u.r === S.r; });
    if (!mine.some(function (u) { return u.i === S.i; })) S.i = mine.slice().sort(function (a, b) { return a.price - b.price; })[0].i;
    S.pct = Math.min(CFG.DOWN_MAX, Math.max(CFG.DOWN_MIN, +S.pct || CFG.DOWN_MIN));
    if (CFG.MONTHS.indexOf(+S.m) < 0) S.m = maxM();
    return U;
  }
  function calc() { var u = sane()[S.i], dn = Math.round(u.price * S.pct / 100); return { u: u, down: dn, monthly: (u.price - dn) / S.m }; }

  /* ---------- oyna ---------- */
  var ov = document.createElement('div'); ov.className = 'pp'; ov.id = 'ahPop'; ov.hidden = true;
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'ppT');
  ov.innerHTML = '<div class="pp-bg" data-ppx></div><div class="pp-box" tabindex="-1"></div>';
  document.body.appendChild(ov);
  var box = $('.pp-box', ov), cur = '', lastFocus = null, revealed = false;
  try { revealed = sessionStorage.getItem('ah_pp_rev') === '1'; } catch (e) {}
  function st(v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('ah_pp')) || {}; localStorage.setItem('ah_pp', JSON.stringify(v)); } catch (e) { return {}; } }
  function ses(v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem('ah_pp_s')) || {}; sessionStorage.setItem('ah_pp_s', JSON.stringify(v)); } catch (e) { return {}; } }
  function leadDone() { var s = st(); if (s.done) return true; try { return !!localStorage.getItem('ah3_lastLead'); } catch (e) { return false; } }
  var X = function () { return '<button class="pp-x" type="button" data-ppx aria-label="' + esc(t('pop.close')) + '">' + SV(IC.close) + '</button>'; };
  function proof() {
    var A = (CFG.AMBASSADORS || []).filter(function (a) { return a.on !== false && a.photo; });
    if (A.length < 2) return '';
    return '<div class="pp-proof"><span class="pp-faces">' + A.slice(0, 4).map(function (a) { return '<img src="' + esc(a.photo) + '" alt="" loading="lazy" decoding="async">'; }).join('') + '</span><span>' + esc(t('pop.proof', { a: A[0].name, b: A[1].name })) + '</span></div>';
  }
  function fields(btn) {
    var me = {}; try { me = JSON.parse(localStorage.getItem('ah3_me')) || {}; } catch (e) {}
    return '<label class="field pp-f"><span>' + esc(t('pop.name')) + '</span><input class="pp-in" name="name" autocomplete="name" maxlength="60" placeholder="' + esc(t('pop.namePh')) + '" value="' + esc(me.name || '') + '"><small class="err"></small></label>' +
      '<label class="field pp-f"><span>' + esc(t('pop.phone')) + '</span><input class="pp-in js-pp-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+998 90 123 45 67" value="' + esc(me.phone || '') + '"><small class="err"></small></label>' +
      '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="pp-btn" type="submit"><span>' + esc(btn) + '</span>' + SV(IC.arrow) + '</button>' +
      '<p class="pp-priv">' + SV(IC.lock) + '<span>' + esc(t('pop.priv')) + '</span></p>';
  }
  function armForm(f) { $$('.js-pp-phone', f).forEach(AH_SITE.phoneMask); }

  /* 1) taklif: kalit-karta */
  function renderOffer() {
    var P0 = PROJECTS[0], fct = P0.facts || [], cap = fct.slice(0, 2).map(function (x) { return x.v + ' ' + pick(x.k); }).join(' · ');
    box.className = 'pp-box pp-offer' + (revealed ? ' is-rev is-b' : '');
    box.innerHTML = X() + '<div class="pp-grid"><figure class="pp-pic"><img src="' + esc(P0.cover) + '" alt="" decoding="async"><figcaption><b>' + esc(pick(P0.name) + ' · ' + pick(P0.district)) + '</b><span>' + esc(cap) + '</span></figcaption></figure>' +
      '<div class="pp-main"><i class="pp-handle"></i>' +
      '<p class="pp-k pp-a">' + esc(t('pop.k1')) + '</p><p class="pp-k pp-b">' + esc(t('pop.k2')) + '</p>' +
      '<h2 class="pp-h pp-a" id="ppT">' + esc(t('pop.t1')) + '</h2><p class="pp-s pp-a">' + esc(t('pop.s1')) + '</p>' +
      '<div class="pp-card"><span class="pp-shine"></span>' + LOGO + '<b class="pp-brand">ART HOUSE</b><small class="pp-no">No ' + esc(CFG.FOUNDED || 2012) + '</small>' +
        '<div class="pp-rev"><span>' + esc(t('pop.down')) + '</span><strong id="ppNum">' + esc(I18N.usd(minDown())) + '</strong><em>' + esc(t('pop.rest')) + '</em></div>' +
        '<canvas class="pp-foil" aria-hidden="true"></canvas><div class="pp-hint" aria-hidden="true">' + SV(IC.hand) + '<b>' + esc(t('pop.scratch')) + '</b></div></div>' +
      '<h2 class="pp-h pp-b pp-h2">' + esc(t('pop.t2')) + '</h2><p class="pp-s pp-b">' + esc(t('pop.s2')) + '</p>' +
      '<button class="pp-link pp-a" type="button" data-reveal>' + esc(t('pop.open')) + '</button>' +
      '<ul class="pp-trust pp-a"><li>' + SV(IC.shield) + esc(t('pop.tr1')) + '</li><li>' + SV(IC.percent) + esc(t('pop.tr2')) + '</li><li>' + SV(IC.key) + esc(t('pop.tr3')) + '</li></ul>' +
      '<form class="pp-form pp-b" novalidate data-form="offer">' + fields(t('pop.cta')) + '</form>' + proof() + '</div></div>';
    armForm(box);
    if (revealed) { var h = $('.pp-h2', box); h.id = 'ppT'; $('.pp-a#ppT', box) && $('.pp-a#ppT', box).removeAttribute('id'); }
  }
  /* folga: barmoq yoki sichqoncha bilan suriladi; 40% ochilsa — to'liq ochiladi */
  function foil() {
    var cv = $('.pp-foil', box); if (!cv || revealed) return;
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1), x = cv.getContext && cv.getContext('2d'); if (!x) return;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); x.scale(dpr, dpr);
    var g = x.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, '#C9AE73'); g.addColorStop(0.46, '#F6EBCF'); g.addColorStop(0.54, '#FAF3DF'); g.addColorStop(1, '#D3B77E');
    x.fillStyle = g; x.fillRect(0, 0, r.width, r.height);
    x.globalAlpha = 0.09; x.strokeStyle = '#6F5726'; x.lineWidth = 1;
    for (var i = -r.height; i < r.width; i += 6) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + r.height, r.height); x.stroke(); }
    x.globalAlpha = 1; x.globalCompositeOperation = 'destination-out'; x.lineCap = x.lineJoin = 'round'; x.lineWidth = 44;
    box.classList.add('is-foil');
    var down = false, last = null, n = 0;
    var pt = function (e) { var b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    var check = function () {
      var d = x.getImageData(0, 0, cv.width, cv.height).data, c = 0, all = 0;
      for (var k = 3; k < d.length; k += 80) { all++; if (d[k] < 40) c++; }
      if (all && c / all > 0.4) reveal();
    };
    cv.addEventListener('pointerdown', function (e) { down = true; last = pt(e); try { cv.setPointerCapture(e.pointerId); } catch (er) {} box.classList.add('is-scratching'); x.beginPath(); x.arc(last[0], last[1], 22, 0, 7); x.fill(); });
    cv.addEventListener('pointermove', function (e) { if (!down) return; var p = pt(e); x.beginPath(); x.moveTo(last[0], last[1]); x.lineTo(p[0], p[1]); x.stroke(); last = p; if (++n % 5 === 0) check(); });
    ['pointerup', 'pointercancel'].forEach(function (ev) { cv.addEventListener(ev, function () { if (down) { down = false; check(); } }); });
  }
  function reveal() {
    if (revealed) return; revealed = true;
    try { sessionStorage.setItem('ah_pp_rev', '1'); } catch (e) {}
    box.classList.add('is-rev');
    var el = $('#ppNum', box), to = minDown(), t0 = performance.now();
    if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) (function f(now) { var k = Math.min(1, (now - t0) / 700); el.textContent = I18N.usd(Math.round(to * (1 - Math.pow(1 - k, 3)) / 10) * 10); if (k < 1) requestAnimationFrame(f); else el.textContent = I18N.usd(to); })(t0);
    setTimeout(function () {
      box.classList.add('is-b');
      var a = $('.pp-a#ppT', box); if (a) a.removeAttribute('id'); $('.pp-h2', box).id = 'ppT';
      var nm = $('.pp-form [name=name]', box); if (nm && matchMedia('(min-width: 860px)').matches) nm.focus({ preventScroll: true });
    }, 650);
  }

  /* 2) bo'lib to'lash kalkulyatori */
  function chips(g, items, on) { return '<div class="pp-chips" role="group" data-g="' + g + '">' + items.map(function (x) { return '<button type="button" data-v="' + esc(x[0]) + '" aria-pressed="' + (String(x[0]) === String(on)) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; }
  function renderCalc() {
    var U = sane(), P = proj(), L = list(), K = kinds(), mine = U.filter(function (u) { return u.r === S.r; }).sort(function (a, b) { return a.pl.area - b.pl.area; });
    var row = function (lab, body, val) { return '<div class="pp-row"><div class="pp-l"><span>' + esc(lab) + '</span>' + (val || '') + '</div>' + body + '</div>'; };
    box.className = 'pp-box pp-calc';
    box.innerHTML = X() + '<div class="pp-main"><i class="pp-handle"></i><p class="pp-k">' + esc(t('pc.k')) + '</p><h2 class="pp-h" id="ppT">' + esc(t('pc.t')) + '</h2><p class="pp-s">' + esc(t('pc.s')) + '</p>' +
      '<div class="pp-cbody">' +
      (L.length > 1 ? row(t('hf.p'), chips('p', L.map(function (p) { return [p.id, pick(p.name)]; }), P.id)) : '') +
      row(t('hf.r'), chips('r', K.map(function (k) { return [k, k === 'd' ? t('hf.dup') : k]; }), S.r)) +
      (mine.length > 1 ? row(t('hf.a'), chips('i', mine.map(function (u) { return [u.i, area(u.pl)]; }), S.i)) : '') +
      row(t('hf.d'), '<input type="range" class="pp-range" id="ppDown" min="' + CFG.DOWN_MIN + '" max="' + CFG.DOWN_MAX + '" step="5" value="' + S.pct + '" aria-label="' + esc(t('hf.d')) + '">', '<b id="ppDownV"></b>') +
      row(t('hf.m'), chips('m', CFG.MONTHS.map(function (m) { return [m, m + ' ' + t('unit.month')]; }), S.m)) +
      '<div class="pp-res"><a class="pp-plan" href="#projects/' + esc(P.id) + '" data-ppx><img id="ppImg" alt="" decoding="async"></a><div><span>' + esc(t('hf.res')) + '</span><strong id="ppM"></strong><small id="ppUzs"></small><em id="ppU"></em></div></div>' +
      '<button class="pp-btn" type="button" data-cstep><span>' + esc(t('hf.book')) + '</span>' + SV(IC.arrow) + '</button></div>' +
      '<form class="pp-form pp-cform" novalidate data-form="calc" hidden><p class="pp-sum" id="ppSum"></p><p class="pp-s">' + esc(t('pc.formS')) + '</p>' + fields(t('pc.send')) +
      '<button class="pp-link" type="button" data-cback>' + esc(t('pc.back')) + '</button></form>' +
      '<button class="pp-ai" type="button" data-ai>' + SV(IC.sparkle) + '<span>' + esc(t('pc.ai')) + '</span></button></div>';
    armForm(box); out();
  }
  function out() {
    var inp = $('#ppDown', box); if (!inp) return;
    var r = calc(), u = r.u;
    inp.style.setProperty('--p', ((S.pct - CFG.DOWN_MIN) / Math.max(1, CFG.DOWN_MAX - CFG.DOWN_MIN) * 100) + '%');
    $('#ppDownV', box).textContent = S.pct + '% · ' + I18N.usd(r.down);
    $('#ppM', box).textContent = I18N.usd(r.monthly);
    $('#ppUzs', box).textContent = t('calc.uzs', { v: I18N.num(Math.round(r.monthly * CFG.USD_UZS / 1000) * 1000) });
    $('#ppU', box).textContent = t('plan.label', { rooms: u.pl.rooms, duplex: u.pl.duplex ? t('plan.duplex') : '', area: String(u.pl.area).replace('.', ',') }) + ' · ' + t('hf.price', { v: I18N.usd(u.price) });
    var img = $('#ppImg', box); if (img.getAttribute('src') !== u.pl.img) img.src = u.pl.img;
  }
  function touch() { if (!S.touched) { S.touched = 1; if (window.CRM) CRM.track('c'); } save(); }

  /* ---------- ariza ---------- */
  function send(form) {
    var n = $('[name=name]', form), ph = $('[name=phone]', form), ok = AH_SITE.checkName(n) & AH_SITE.checkPhone(ph);
    if (!ok || $('[name=website]', form).value) return;
    var lead = { src: 'site', name: n.value.trim(), phone: ph.value.trim(), slot: 'Imkon qadar tez', lang: I18N.lang, area: 0 };
    if (form.getAttribute('data-form') === 'calc') {
      var r = calc(), P = proj();
      Object.assign(lead, { via: 'popup-calc', project: P.id, unit: unitLabel(r.u.pl), area: r.u.pl.area, price: r.u.price, pct: S.pct, down: r.down, months: +S.m, monthly: Math.round(r.monthly) });
      AH_SITE.calcSet({ project: P.id, plan: r.u.i, pct: S.pct, months: +S.m });
    } else Object.assign(lead, { via: 'popup', unit: "Taklif oynasi: boshlang'ich to'lov " + Math.round(minDown()).toLocaleString('en-US') + ' $ dan', down: minDown(), pct: CFG.DOWN_MIN });
    AH_SITE.remember(lead.name, lead.phone);
    try { localStorage.setItem('ah3_lastLead', JSON.stringify(Date.now())); } catch (e) {}
    CRM.deliver(lead).then(function (r2) { if (r2 === false) AH_SITE.toast(t('toast.offline')); });
    var s = st(); s.done = Date.now(); st(s); pill(false);
    var live = !!CRM.api;
    box.className = 'pp-box pp-okbox';
    box.innerHTML = X() + '<div class="pp-main pp-ok"><span class="pp-tick">' + SV(IC.check) + '</span><h2 class="pp-h" id="ppT">' + esc(t('pop.okT', { name: lead.name })) + '</h2>' +
      '<p class="pp-s">' + esc(live ? t('pop.okD', { phone: lead.phone }) : t('book.manualText', { name: lead.name })) + '</p>' +
      (live ? '' : '<div class="pp-acts">' + (window.AH_manualActs ? AH_manualActs(lead) : '') + '</div>') +
      '<button class="pp-btn pp-ghost" type="button" data-ppx>' + esc(t('pop.close')) + '</button></div>';
  }

  /* ---------- ochish / yopish ---------- */
  var html = document.documentElement;
  function open(kind, auto) {
    if (!ov.hidden) return;
    cur = kind; lastFocus = document.activeElement;
    if (kind === 'calc') renderCalc(); else renderOffer();
    ov.hidden = false; html.classList.add('pp-lock'); pill(false);
    requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('on'); if (kind === 'offer') foil(); }); });
    setTimeout(function () { box.focus({ preventScroll: true }); }, 60);
    var s = ses(); s.shown = s.shown || {}; s.shown[kind] = Date.now(); if (auto) s.n = (s.n || 0) + 1; ses(s);
  }
  function close() {
    if (ov.hidden) return;
    var was = cur, ok = box.classList.contains('pp-okbox');
    ov.classList.remove('on'); html.classList.remove('pp-lock');
    setTimeout(function () { ov.hidden = true; box.innerHTML = ''; }, 380);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    cur = '';
    if (!ok && !leadDone()) { var s = st(); s.off = s.off || {}; s.off[was] = Date.now() + 3 * 864e5; st(s); if (was === 'offer') pill(true); next(); }
  }
  ov.addEventListener('click', function (e) {
    if (e.target.closest('[data-ppx]')) { close(); return; }
    if (e.target.closest('[data-reveal]')) { reveal(); return; }
    var b = e.target.closest('.pp-chips button');
    if (b) { var g = b.parentNode.getAttribute('data-g'), v = b.getAttribute('data-v'); if (g === 'p') { S.p = v; S.r = ''; S.i = -1; } else if (g === 'r') { S.r = v; S.i = -1; } else if (g === 'i') S.i = +v; else S.m = +v; touch(); renderCalc(); var f = $('.pp-chips[data-g="' + g + '"] [aria-pressed="true"]', box); if (f) f.focus({ preventScroll: true }); return; }
    if (e.target.closest('[data-cstep]')) {
      var r = calc(); touch();
      $('#ppSum', box).textContent = pick(proj().name) + ' · ' + t('plan.label', { rooms: r.u.pl.rooms, duplex: r.u.pl.duplex ? t('plan.duplex') : '', area: String(r.u.pl.area).replace('.', ',') }) + ' · ' + I18N.usd(r.monthly) + ' ' + t('unit.perMonth') + ' · ' + S.pct + '% · ' + S.m + ' ' + t('unit.month');
      $('.pp-cbody', box).hidden = true; $('.pp-cform', box).hidden = false; var h = $('#ppT', box); if (h) h.textContent = t('pc.formT');
      var nm = $('.pp-cform [name=name]', box); if (nm) nm.focus({ preventScroll: true }); return;
    }
    if (e.target.closest('[data-cback]')) { renderCalc(); return; }
    if (e.target.closest('[data-ai]')) { var c = calc(); close(); if (window.ArtHouseAI) { if (ArtHouseAI.ctx) ArtHouseAI.ctx({ R: S.r, M: +S.m, B: c.down, P: proj().id }); setTimeout(ArtHouseAI.open, 120); } }
  });
  ov.addEventListener('input', function (e) { if (e.target.id === 'ppDown') { S.pct = +e.target.value; touch(); out(); } });
  ov.addEventListener('submit', function (e) { e.preventDefault(); send(e.target); });
  document.addEventListener('keydown', function (e) {
    if (ov.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'Tab') { var f = $$('button, input:not(.hp), a[href], [tabindex="0"]', box).filter(function (x) { return x.offsetParent; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  /* yopilgan taklif — kichik yorliq bo'lib qoladi (bosilsa qayta ochiladi) */
  var pl = null;
  function pill(on) {
    var k = 'ah_pp_pill', v = ''; try { v = sessionStorage.getItem(k) || ''; } catch (e) {}
    if (!on || v === 'x') { if (pl) pl.hidden = true; return; }
    try { sessionStorage.setItem(k, '1'); } catch (e) {}
    if (!pl) {
      pl = document.createElement('div'); pl.className = 'pp-pill'; pl.id = 'ppPill';
      pl.innerHTML = '<button type="button" class="pp-pill-b">' + SV(IC.key) + '<span></span></button><button type="button" class="pp-pill-x" aria-label="' + esc(t('pop.close')) + '">' + SV(IC.close) + '</button>';
      document.body.appendChild(pl);
      $('.pp-pill-b', pl).addEventListener('click', function () { open('offer'); });
      $('.pp-pill-x', pl).addEventListener('click', function () { pl.hidden = true; try { sessionStorage.setItem(k, 'x'); } catch (e) {} });
    }
    $('.pp-pill-b span', pl).textContent = t('pop.pill', { v: I18N.usd(minDown()) });
    pl.hidden = false;
  }
  try { if (sessionStorage.getItem('ah_pp_pill') === '1' && !leadDone()) setTimeout(function () { if (ov.hidden) pill(true); }, 1500); } catch (e) {}

  /* ---------- qachon chiqadi ---------- */
  var q = location.search, AUTO = !/[?&]pp=0/.test(q) && !/[?&](cmsnap|edit|preview)=1/.test(q) && window.top === window.self;
  var T0 = Date.now(), lastY = window.scrollY, travel = 0;
  var phase = { t: T0, d: 0 }, need = { t: 12000, d: 0.9 };
  addEventListener('scroll', function () { travel += Math.abs(window.scrollY - lastY); lastY = window.scrollY; }, { passive: true });
  function busy() {
    var a = document.activeElement, bm = $('#bookModal'), ai = $('#aip');
    return !ov.hidden || !!$('#splash') || (bm && !bm.hidden) || (ai && !ai.hidden) || document.body.classList.contains('lock') || document.hidden || (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName));
  }
  function pickKind() {
    var s = ses(), off = st().off || {}, now = Date.now(), shown = s.shown || {};
    if ((s.n || 0) >= 2) return null;
    if (!shown.offer && !(off.offer > now)) return 'offer';
    if (!shown.calc && !(off.calc > now)) return 'calc';
    return null;
  }
  function next() { phase = { t: Date.now(), d: travel }; need = { t: 45000, d: 1.5 }; }
  function tick(force) {
    if (!AUTO || leadDone() || busy()) return;
    if (!force && (Date.now() - phase.t < need.t || travel - phase.d < need.d * innerHeight)) return;
    var k = pickKind(); if (k) open(k, true);
  }
  setInterval(tick, 1500);
  /* kompyuterda: sichqoncha sahifadan chiqib ketayotganda (tepaga) — birinchi oyna biroz erta */
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0 && Date.now() - T0 > 8000 && !(ses().n)) tick(true); });
  var m = q.match(/[?&]pp=(offer|calc)/); if (m) setTimeout(function () { open(m[1]); }, 900);

  /* bosh bannerdagi «To'lovni hisoblash» va boshqa [data-pp] tugmalar */
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-pp]'); if (!b) return; e.preventDefault(); open(b.getAttribute('data-pp')); });
  /* bosh sahifada «Band qilish» (yuqori menyu, pastki panel): mijoz kalkulyatorda tanlagan bo'lsa — shu shartlar bilan */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-book]');
    if (!b || !S.touched || ov.contains(b) || !$('#p-home') || !$('#p-home').offsetParent) return;
    e.stopPropagation(); e.preventDefault(); var r = calc();
    AH_SITE.calcSet({ project: proj().id, plan: r.u.i, pct: S.pct, months: +S.m }); AH_SITE.book({ fromCalc: true, via: 'popup-calc' });
  }, true);

  /* ---------- 3) afzalliklar lentasi ---------- */
  var USP = [['building', 1], ['key', 2], ['percent', 3], ['shield', 4], ['phone', 5]];
  function usp() {
    var hero = $('#p-home > .hero'); if (!hero || $('#ahUsp')) return;
    var s = document.createElement('section'); s.id = 'ahUsp'; s.className = 'usp'; s.setAttribute('aria-roledescription', 'carousel'); s.setAttribute('aria-label', t('usp.aria'));
    s.innerHTML = '<div class="usp-track">' + USP.map(function (u, i) { return '<div class="usp-it" role="group" aria-label="' + (i + 1) + ' / ' + USP.length + '">' + SV(IC[u[0]], 'usp-ic') + '<div><b data-i="usp.' + u[1] + 't">' + esc(t('usp.' + u[1] + 't')) + '</b><p data-i="usp.' + u[1] + 'd">' + esc(t('usp.' + u[1] + 'd')) + '</p></div></div>'; }).join('') +
      '</div><div class="usp-dots">' + USP.map(function (u, i) { return '<button type="button" aria-label="' + (i + 1) + ' / ' + USP.length + '" data-k="' + i + '"></button>'; }).join('') + '</div>';
    hero.parentNode.insertBefore(s, hero.nextSibling);
    var tr = $('.usp-track', s), k = 0, timer = 0, wide = matchMedia('(min-width: 1100px)'), RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go(i) { k = (i + USP.length) % USP.length; tr.style.transform = wide.matches ? '' : 'translateX(' + (-k * 100) + '%)'; $$('.usp-dots button', s).forEach(function (b, j) { b.setAttribute('aria-current', String(j === k)); }); }
    function play() { clearInterval(timer); if (!wide.matches && !RM) timer = setInterval(function () { if (!document.hidden && vis) go(k + 1); }, 4500); }
    var vis = true; if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(s);
    s.addEventListener('click', function (e) { var b = e.target.closest('.usp-dots button'); if (b) { go(+b.getAttribute('data-k')); play(); } });
    var x0 = null;
    s.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    s.addEventListener('pointerup', function (e) { if (x0 == null || wide.matches) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) { go(k + (dx < 0 ? 1 : -1)); play(); } });
    (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(function () { go(k); play(); });
    go(0); play();
  }
  usp();

  I18N.on(function () { setTimeout(function () { if (!ov.hidden) { if (cur === 'calc') renderCalc(); else { renderOffer(); if (!revealed) foil(); } } if (pl && !pl.hidden) pill(true); var s = $('#ahUsp'); if (s) s.setAttribute('aria-label', t('usp.aria')); }, 0); });
  window.AH_POP = { open: open, close: close, reveal: reveal, state: function () { var r = calc(); return { rooms: S.r, plan: r.u.i, price: r.u.price, pct: S.pct, down: r.down, months: +S.m, monthly: Math.round(r.monthly), minDown: minDown() }; } };
})();
