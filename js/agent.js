/* =====================================================================
   ART HOUSE — saytdagi AI maslahatchi «Art House» (o'ng pastki burchak)
   • Menejer kabi suhbatlashadi: kontekstni eslab qoladi, bir xil gapni takrorlamaydi,
     ishonch savoliga aniq javob beradi, jahli chiqqan mijozni tinchlantiradi.
   • Mijozning ismi, telefoni, qiziqqan xonadoni va byudjetini aniqlab, kabinetga yozadi:
     Xabarlar → Sayt xabarlari (suhbat) va Mijozlar bazasi (ariza).
   • Server + ANTHROPIC_API_KEY bo'lsa — javoblarni Claude modeli yozadi (yanada jonli),
     aks holda quyidagi qoidalar bo'yicha o'zi javob beradi.
   ===================================================================== */
(function () {
  'use strict';
  var D = window.AGENT_DICT, $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var SPL = { uz: 'uz-UZ', cy: 'uz-UZ', ru: 'ru-RU', en: 'en-US', fr: 'fr-FR', it: 'it-IT', es: 'es-ES', de: 'de-DE', tr: 'tr-TR' };
  var EMO = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
  var PHONE = CFG.PHONE || CFG.PHONES[0], PH = PHONE.replace(/^\+?998(\d{2})(\d{3})(\d{2})(\d{2})$/, '+998 $1 $2 $3 $4');

  /* mijoz qaysi tilda yozsa, o'sha tilda javob beradi */
  var LRX = [
    ['uz', /[og]['ʻ’`]|\b(salom|assalomu|qancha|qanday|qaysi|kerak|nechta|xonali|ishonch\w*|bormi|rahmat|menga|bilan|uy|yaxshi|narxi|bo'?ladimi|qilsa|ekan|emas|yoq|ha)\b/i],
    ['tr', /[ğış]|\b(merhaba|nasıl|fiyat\w*|evet|teşekkür\w*|güvenilir|daire|istiyorum|kaç)\b/i],
    ['de', /[äß]|\b(hallo|ich|und|wie|nicht|wohnung|danke|guten|viel|kostet|möchte)\b/i],
    ['es', /[ñ¿¡]|\b(hola|quiero|cu[aá]nto|gracias|precio|buenos|necesito|puedo|piso)\b/i],
    ['fr', /[èêœ]|\b(bonjour|je|merci|prix|combien|vous|est-ce|appartement|salut)\b/i],
    ['it', /\b(ciao|buongiorno|grazie|prezzo|vorrei|sono|appartamento|quanto)\b/i],
    ['en', /\b(hello|hi|the|is|how|much|price|want|apartment|thanks|you|can|trust|what|need)\b/i]
  ];
  function detect(t) {
    t = String(t || '');
    if (/[\u0400-\u04FF]/.test(t)) return /[ўқғҳЎҚҒҲ]/.test(t) ? 'cy' : (I18N.lang === 'cy' ? 'cy' : 'ru');
    for (var i = 0; i < LRX.length; i++) if (LRX[i][1].test(t)) return LRX[i][0];
    return null;
  }
  function L() { return CX && CX.ml && D[CX.ml === 'cy' ? 'uz' : CX.ml] ? CX.ml : I18N.lang; }
  function T(k, o) {
    var l = L(), d = D[l === 'cy' ? 'uz' : l] || D.uz, s = d[k] != null ? d[k] : D.uz[k];
    s = String(s).replace(/\{(\w+)\}/g, function (m, x) { return o && o[x] != null ? o[x] : x === 'years' ? CFG.EXPERIENCE_YEARS : m; });
    return l === 'cy' ? I18N.toCyr(s) : s;
  }
  var usd = function (n) { return I18N.usd(n); };

  /* xonadonlar katalogi (Musaffo rejalari) */
  function CAT() {
    var p = PROJECTS[0];
    return p.plans.map(function (pl, i) {
      var price = Math.round(pl.area * CFG.PRICE_M2 / 100) * 100;
      return { i: i, pl: pl, a: pl.area, r: pl.duplex ? 'd' : String(pl.rooms), price: price, u: unitLabel(pl), img: pl.img,
        name: I18N.t('plan.label', { rooms: pl.rooms, duplex: pl.duplex ? I18N.t('plan.duplex', null, L()) : '', area: String(pl.area).replace('.', ',') }, L()) };
    });
  }

  /* ---------- holat (suhbat konteksti) ---------- */
  var CX = { hist: [], used: {}, turns: 0 }, PAI = [];
  try { var sv = JSON.parse(sessionStorage.getItem('ah_ai')); if (sv) { CX = Object.assign(CX, sv.cx || {}); PAI = sv.pai || []; } } catch (e) {}
  function persist(html) {
    try { var h = JSON.parse(sessionStorage.getItem('ah_ai_html') || '[]'); if (html) h.push(html); sessionStorage.setItem('ah_ai_html', JSON.stringify(h.slice(-40)));
      sessionStorage.setItem('ah_ai', JSON.stringify({ cx: { name: CX.name, phone: CX.phone, B: CX.B, R: CX.R, M: CX.M, P: CX.P, sent: CX.sent, ask: CX.ask, hist: CX.hist.slice(-6), used: CX.used, turns: CX.turns, angry: CX.angry, uI: CX.u ? CX.u.i : null }, pai: PAI.slice(-14) })); } catch (e) {}
  }

  /* ---------- matndan ma'lumot ajratish (9 tilda) ---------- */
  var nz = function (t) { return String(t).toLowerCase().replace(/[’ʻʼ`´‘]/g, "'"); };
  function money(T) {
    var s = T.replace(/(\d)[ .,](?=\d{3}(?!\d))/g, '$1'), re = /(\d+(?:[.,]\d+)?)\s*(k|к|ming|тыс|mln|млн|million|\$|dollar|долл|usd|у\.е)?/g, r;
    while ((r = re.exec(s))) {
      var rest = s.slice(re.lastIndex);
      if (/^\s*(oy|%|xona|yil|m2|m²|kv|-xona|мес|ком|month|room|mois|pièce|mes|habit|monat|zimmer|ay|oda|mese|stanz|camer)/.test(rest)) continue;
      var n = parseFloat(r[1].replace(',', '.')), u = r[2];
      if (u === 'k' || u === 'к' || u === 'ming' || u === 'тыс') n *= 1e3; else if (u === 'mln' || u === 'млн' || u === 'million') n *= 1e6;
      if (n >= 3000 && n < 5e6) return n;
    }
    return 0;
  }
  function months(T) {
    var m = (T.match(/(\d+)\s*(?:oy|months?|мес|ay\b|aylık|monat|mois|mes[ei]?|mesi)/) || [])[1];
    if (!m) { var y = T.match(/(\d)\s*(?:yil|years?|год|лет|yıl|jahr|ans?\b|años?|anni|anno)/); if (y) m = y[1] * 12; }
    if (!m) return 0;
    return CFG.MONTHS.reduce(function (p, c) { return Math.abs(c - m) < Math.abs(p - m) ? c : p; });
  }
  function rooms(T) {
    if (/dupleks|duplex|дуплекс|dúplex|dubleks/.test(T)) return 'd';
    var m = T.match(/([1-4]|bir|ikki|uch|to'rt|one|two|three|four|un|deux|trois|quatre|uno|due|tre|quattro|dos|tres|cuatro|ein|zwei|drei|vier|iki|üç|dört)\s*[- ]?(?:x|xona|room|bed|комн|oda|zimmer|pi[eè]ce|local|habitaci|stanz|camer|-?k\b)/) || T.match(/(одно|двух|трех|трёх|четырех|четырёх)/) || T.match(/(bilocale|trilocale|monolocale|quadrilocale)/);
    if (!m) return 0;
    var M = { bir: '1', ikki: '2', uch: '3', "to'rt": '4', one: '1', two: '2', three: '3', four: '4', un: '1', deux: '2', trois: '3', quatre: '4', uno: '1', due: '2', tre: '3', quattro: '4', dos: '2', tres: '3', cuatro: '4', ein: '1', zwei: '2', drei: '3', vier: '4', iki: '2', 'üç': '3', 'dört': '4', 'одно': '1', 'двух': '2', 'трех': '3', 'трёх': '3', 'четырех': '4', 'четырёх': '4', monolocale: '1', bilocale: '2', trilocale: '3', quadrilocale: '4' };
    return M[m[1]] || m[1];
  }
  function project(T) {
    if (/musaff|мусаф/.test(T)) return 'musaffo';
    if (/obod|обод/.test(T)) return 'obod';
    if (/ko'kcha|kokcha|кукч|кўкч|oqtepa|октеп/.test(T)) return 'kokcha';
    return '';
  }
  /* "Qimmat ekan" kabi gaplarni ism deb olmaslik uchun */
  function looksLikeName(t) {
    t = t.trim(); var w = t.split(/\s+/);
    if (!/^[\p{L}' ]{2,25}$/u.test(t) || w.length > 2 || /\d/.test(t)) return false;
    for (var k in RX) if (RX[k].test(t)) return false;
    return !/^(ha|yo'q|xo'p|mayli|ok|okay|yes|no|da|net|нет|да|ладно|хорошо|evet|hayır|oui|non|sì|si|ja|nein|ekan|bor|yo'q|kerak|emas|balki|albatta|qimmat|arzon|yaxshi|yomon)$/i.test(w[0]) && !/(ekan|emas|kerak|mi|chi|man|siz|miz)$/i.test(w[w.length - 1]);
  }
  var cap = function (x) { return x.charAt(0).toUpperCase() + x.slice(1); };
  var NAME_RE = /(?:ismim|ismi|mening ismim|men|my name is|i am|i'm|меня зовут|я|adım|benim adım|ich heiße|ich bin|mein name ist|je m'appelle|je suis|mi chiamo|sono|me llamo|soy)\s+([\p{L}']{2,20})/u;
  var NOT_NAME = /^(1|2|3|4|bir|ikki|uch|xonali|qiziq|interested|looking|ищу|хочу|не|yes|ha|yo'q|no|bu|shu|juda|hozir|sizga|bilan|uchun)/;

  /* ---------- niyatni aniqlash ---------- */
  var RX = {
    angry: /yomon|aldov|aldad|firibgar|jahl|g'azab|xafa|nega javob|javob bermay|bekorchi|bema'ni|uyat|shikoyat|kutyapman|qachongacha|плохо|обман|мошенн|развод|ужас|отвратит|злой|бесит|жалоб|сколько можно|почему не отвеч|terrible|awful|scam|fraud|cheat|angry|furious|complain|ridiculous|disgusting|why no one|arnaque|escroc|honteux|furieux|plainte|truffa|imbroglio|vergogna|arrabbiat|reclamo|estafa|timo|vergüenza|enfadad|queja|betrug|abzocke|schrecklich|wütend|beschwerde|dolandır|rezalet|kızgın|şikayet|berbat/,
    trust: /ishon|ishonchli|kafolat|aldamaysiz|haqiqiy kompaniya|litsenziya|hujjat|rasmiy|qonuniy|xavfsizmi|можно доверять|довер|надёжн|надежн|гарант|лиценз|официальн|законн|не обманете|trust|reliable|legit|guarantee|licen|safe to|scam\?|fiable|confiance|garantie|sérieux|affidabil|fidar|garanzia|serio|confiar|fiable|garantía|seria|vertrau|seriös|zuverlässig|garantie|güven|güvenilir|garanti|resmî/,
    unsure: /bilmayman|nima qilish|qayerdan boshla|tushunmayapman|chalkash|ikkilan|maslahat bering|qaror qila olmay|не знаю|что делать|с чего начать|запутал|сомнева|посоветуйте|i don't know|dont know|not sure|confused|where to start|what should i|advise me|je ne sais pas|hésit|conseill|non so|indeciso|consigli|no sé|no se que|dudo|aconséj|weiß nicht|unsicher|beraten|bilmiyorum|kararsız|tavsiye/,
    human: /siz robotmisiz|botmisiz|sun'iy|odam bilan|jonli|inson bilan|operator|ты бот|вы бот|робот|живой|человек|оператор|are you a bot|are you human|real person|human|robot|opérateur|humain|umano|operatore|humano|operador|mensch|bot\b|insan|temsilci/,
    greet: /salom|assalom|hayrli|qalay|yaxshimisiz|hello|\bhi\b|\bhey\b|good (morning|evening|afternoon)|привет|здравств|добр(ый|ое|ого)|merhaba|selam|günaydın|hallo|guten (tag|morgen|abend)|bonjour|salut|bonsoir|ciao|buongiorno|buonasera|hola|buenos|buenas/,
    thanks: /rahmat|tashakkur|thank|спасибо|благодар|teşekkür|sağ ?ol|danke|merci|grazie|gracias/,
    contact: /telefon|raqam|bog'lan|menejer|qo'ng'iroq|phone|contact|manager|call|телефон|номер|менеджер|связ|звон|numara|yetkili|\bara\b|kontakt|anruf|téléphone|contacter|numéro|telefono|contatto|chiama|teléfono|contacto|llamar/,
    location: /manzil|qayerda|lokatsiya|joylash|xarita|ofis|qanday borsa|address|where|location|map|office|адрес|где|располож|карта|офис|adres|nerede|konum|adresse|\bwo\b|lage|karte|où|adresse|indirizzo|dove|posizione|dirección|dónde|ubicación/,
    credit: /kredit|ipoteka|bank|foiz|credit|mortgage|loan|interest|кредит|ипотек|банк|процент|kredi|ipotek|faiz|hypothek|zins|darlehen|crédit|prêt|banque|intérêt|credito|mutuo|banca|interess|préstamo|hipoteca|interés/,
    expensive: /qimmat|o'ylab|keyin|shoshm|arzon|chegirma|expensive|too much|think about|later|cheaper|discount|дорог|подума|позже|дешевле|скидк|pahalı|düşün|sonra|ucuz|indirim|teuer|überleg|später|günstig|rabatt|cher|réfléch|plus tard|moins cher|remise|caro|pensarci|più tardi|economic|sconto|pensar|más tarde|barato|descuento/,
    savings: /jamg'ar|yig'gan|saqlab|xavotir|qo'rq|oilam|oila |to'g'ri keladimi|saving|family|worried|afraid|сбереж|накоп|семь|боюсь|переживаю|birikim|aile|endişe|kork|erspar|familie|sorge|angst|économ|famille|inquiet|peur|risparm|famiglia|preoccup|paura|ahorr|familia|preocup|miedo/,
    projects: /loyiha|majmua|qaysi joy|qanaqa uylar|qanday uylar|project|complex|which (one|area)|проект|комплекс|какие дома|proje|kompleks|projekt|anlage|projet|résidence|progett|complesso|proyecto|complejo/,
    renov: /ta'mir|remont|ремонт|renovat|ready to move|rénov|ristruttur|reformad|renoviert|tadilat|tayyor uy|готов/,
    parking: /parkovka|avtoturargoh|mashina|garaj|lift|parking|паркинг|машино|гараж|лифт|otopark|garage|aufzug|stellplatz|ascenseur|ascensore|aparcamiento|ascensor|asansör/,
    want: /oyiga|oylik|har oy|boshlang|narx|qancha|necha|turadi|tavsiya|qaysi|ko'rsat|rasm|variant|kerak|xohlayman|olmoqchi|uy|xonadon|kvartira|price|cost|how much|monthly|per month|recommend|which|apartment|flat|show|цен|стоим|сколько|месяц|квартир|какую|покаж|fiyat|kaç|ne kadar|aylık|daire|öner|preis|kost|wie viel|monat|wohnung|empfehl|prix|combien|mois|appartement|conseil|prezzo|quanto|mese|appartamento|precio|cuánto|cuanto|mensual|apartamento|piso|recomiend/
  };

  /* takrorlanmaslik: bir xil niyatga ketma-ket ikkinchi variant */
  function pickKey(base) {
    var n = (CX.used[base] || 0); CX.used[base] = n + 1;
    var alt = base + '2';
    return n % 2 === 1 && D.uz[alt] ? alt : base;
  }

  function plan(c, B, M) { var dn = B ? Math.min(B, c.price) : Math.round(c.price * CFG.DOWN_MIN / 100); return { dn: dn, m: Math.round((c.price - dn) / M) }; }
  function tel() { return '<a href="tel:' + PHONE + '">' + PH + '</a>'; }

  function sendLead() {
    var c = CX.u, M = CX.M || Math.max.apply(null, CFG.MONTHS), z = c ? plan(c, CX.B, M) : { dn: 0, m: 0 };
    CRM.deliver({ src: 'ai', name: CX.name, phone: CX.phone, unit: c ? c.u : (CX.P ? (PROJECTS.filter(function (p) { return p.id === CX.P; })[0] || {}).name + ' · Hali tanlamadi' : 'Hali tanlamadi'),
      area: c ? c.a : 0, slot: 'Art House.ai', price: c ? c.price : 0, down: z.dn, pct: c && c.price ? Math.round(z.dn / c.price * 100) : 0, months: M, monthly: z.m, lang: L(), project: CX.P || (c ? 'musaffo' : '') });
    CX.sent = 1;
  }

  /* ---------- asosiy javob mantiqi ---------- */
  function reply(t) {
    var Tn = nz(t), dg = Tn.replace(/\D/g, ''), cards = [], pre = '', hit = 0, key, o = {};
    CX.turns++;
    var dl = detect(t); if (dl) CX.ml = dl === 'uz' && I18N.lang === 'cy' ? 'cy' : dl;
    if (dg.length >= 9 && dg.length <= 12 && !/\$|dollar|usd|долл/.test(Tn)) { CX.phone = '+' + (dg.length === 9 ? '998' + dg : dg); hit = 1; }
    var nm = Tn.match(NAME_RE);
    if (nm && !NOT_NAME.test(nm[1])) { if (!CX.name) pre = T('niceName', { n: esc(cap(nm[1])) }) + ' '; CX.name = cap(nm[1]); }
    else if (CX.ask === 'name' && looksLikeName(Tn)) { CX.name = cap(Tn.trim().split(' ')[0]); pre = T('niceName', { n: esc(CX.name) }) + ' '; }
    var B = hit ? 0 : money(Tn), R = rooms(Tn), Mo = months(Tn), P = project(Tn);
    if (B) CX.B = B; if (R) CX.R = R; if (Mo) CX.M = Mo; if (P) CX.P = P;
    var M = CX.M || Math.max.apply(null, CFG.MONTHS);

    if (CX.phone && !CX.name) { CX.ask = 'name'; return { h: T('gotPhone'), cards: cards }; }
    if (CX.phone && CX.name && !CX.sent) { sendLead(); CX.ask = 0; return { h: pre + T(window.CRM && CRM.api ? 'leadSent' : 'leadManual', { n: esc(CX.name), p: esc(CX.phone), tel: tel() }), cards: cards }; }
    CX.ask = 0;

    var intent = RX.angry.test(Tn) ? 'angry' : RX.human.test(Tn) ? 'human' : RX.trust.test(Tn) ? 'trust' : RX.unsure.test(Tn) ? 'unsure' :
      RX.renov.test(Tn) ? 'renov' : RX.parking.test(Tn) && !B && !R ? 'parking' : RX.savings.test(Tn) ? 'savings' : RX.expensive.test(Tn) && !B ? 'expensive' :
      RX.credit.test(Tn) && !B ? 'credit' : (RX.location.test(Tn) && !B && !R) ? 'location' : (RX.contact.test(Tn) && !B && !R) ? 'contact' :
      (B || R || (RX.want.test(Tn) && (CX.B || CX.R || CX.P === 'musaffo'))) ? 'want' : RX.projects.test(Tn) || (P && P !== 'musaffo') ? 'projects' :
      RX.thanks.test(Tn) ? 'thanks' : RX.greet.test(Tn) ? 'greet' : RX.want.test(Tn) ? 'want' : 'fallback';
    if (intent === 'angry') CX.angry = (CX.angry || 0) + 1;
    var repeat = CX.hist[CX.hist.length - 1] === intent; CX.hist.push(intent);
    var cat = CAT(), pc = CFG.DOWN_MIN;

    switch (intent) {
      case 'angry': key = pickKey('angry'); o = { tel: tel() }; break;
      case 'human': key = 'human'; o = { tel: tel() }; break;
      case 'trust': key = pickKey('trust'); break;
      case 'unsure': key = pickKey('unsure'); break;
      case 'renov': key = 'renov'; break;
      case 'parking': key = 'parking'; break;
      case 'projects': key = 'projects'; break;
      case 'credit': key = 'credit'; o = { pc: pc, a: Math.min.apply(null, CFG.MONTHS), b: Math.max.apply(null, CFG.MONTHS) }; break;
      case 'expensive': key = pickKey('expensive'); o = { pc: pc, M: Math.max.apply(null, CFG.MONTHS) }; break;
      case 'contact': key = 'contact'; o = { tel: tel(), tg: '<a href="' + CFG.TELEGRAM_CHANNEL + '" target="_blank" rel="noopener">Telegram</a>' }; break;
      case 'location': key = 'location'; break;
      case 'thanks': key = CX.phone ? 'thanks' : 'thanksAsk'; break;
      case 'greet': key = CX.turns > 1 ? 'greet2' : 'greet'; break;
      case 'savings': {
        var b = CX.B, A = cat.filter(function (c) { return (c.r === '2' || c.r === '3') && (!b || b >= c.price * pc / 100); }).sort(function (x, y) { return x.price - y.price; }).slice(0, 2);
        if (!A.length) A = cat.slice().sort(function (x, y) { return x.price - y.price; }).slice(0, 2);
        CX.u = A[0]; cards = A; var z = plan(A[0], b, M);
        key = 'savings'; o = { pc: pc, u: '<b>' + esc(A[0].name) + '</b>', d: usd(z.dn), m: usd(z.m) }; break;
      }
      case 'want': {
        var Lst = cat.filter(function (c) { return !CX.R || c.r === CX.R; }); if (!Lst.length) Lst = cat;
        var bb = CX.B, Av = (bb ? Lst.filter(function (c) { return bb >= c.price * pc / 100; }) : Lst).slice().sort(function (x, y) { return x.price - y.price; });
        if (bb && !Av.length) { var cheap = Lst.slice().sort(function (x, y) { return x.price - y.price; })[0]; key = 'wantShort'; o = { b: usd(bb), min: usd(cheap.price * pc / 100), pc: pc, M: M }; break; }
        Av = bb ? Av.slice(-2).reverse() : Av.slice(0, 2); CX.u = Av[0]; cards = Av;
        var zz = plan(Av[0], bb, M);
        key = bb ? 'wantB' : 'want'; o = { b: usd(bb), u: '<b>' + esc(Av[0].name) + '</b>', p: usd(Av[0].price), d: usd(zz.dn), M: M, m: usd(zz.m) }; break;
      }
      default:
        if (pre) { return { h: pre + (CX.phone ? T('thanks') : T('askPhone')), cards: cards }; } // faqat ismini aytdi
        key = repeat || CX.used.fallback ? 'fallback2' : 'fallback'; CX.used.fallback = 1;
    }
    var h = pre + T(key, o);
    /* menejerga tayyor mijoz: qiziqish aniq bo'lgach, yumshoq qilib ism / telefon so'raymiz (har javobda emas) */
    if (!CX.sent && ['want', 'savings', 'trust', 'renov', 'parking', 'credit', 'expensive'].indexOf(intent) > -1 && CX.turns >= 2 && (CX.lastAsk || 0) < CX.turns - 1) {
      if (!CX.name) { h += '<br><br>' + T('askName'); CX.ask = 'name'; CX.lastAsk = CX.turns; }
      else if (!CX.phone) { h += '<br><br>' + T('askPhone'); CX.lastAsk = CX.turns; }
    }
    return { h: h, cards: cards };
  }

  /* ---------- UI ---------- */
  var box = document.createElement('div');
  box.innerHTML = '<button id="aib" type="button" aria-haspopup="dialog"><span class="aib-dot"></span><svg class="ic" viewBox="0 0 24 24"><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/></svg><b id="aibT"></b></button>' +
    '<section id="aip" role="dialog" aria-modal="false" hidden>' +
    '<header><span class="aip-av"><svg viewBox="0 0 100 100"><use href="#logo"/></svg></span><div class="aip-t"><b id="aipT"></b><small><i></i><span id="aipO"></span></small></div>' +
    '<button type="button" id="aspk" aria-pressed="false"><svg class="ic" viewBox="0 0 24 24"><path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.4 18.4a9 9 0 0 0 0-12.8"/></svg></button>' +
    '<button type="button" id="aix"><svg class="ic" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></header>' +
    '<div class="aip-chat" id="am" aria-live="polite"></div><div class="aip-st" id="amst" hidden></div><div class="aip-chips" id="ach"></div>' +
    '<form class="aip-f" id="af"><input id="ai" autocomplete="off" maxlength="600"><button type="button" id="amic"><svg class="ic" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg></button>' +
    '<button type="submit" id="asend"><svg class="ic" viewBox="0 0 24 24"><path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/></svg></button></form></section>';
  while (box.firstChild) document.body.appendChild(box.firstChild);
  var aib = $('#aib'), aip = $('#aip'), am = $('#am'), inp = $('#ai'), SPK = false;

  function labels() {
    $('#aibT').textContent = T('open'); $('#aipT').textContent = T('title'); $('#aipO').textContent = T('online');
    inp.placeholder = T('placeholder'); $('#amic').setAttribute('aria-label', T('mic')); $('#asend').setAttribute('aria-label', T('send'));
    $('#aix').setAttribute('aria-label', T('close')); $('#aspk').setAttribute('aria-label', T('voiceOn')); aib.setAttribute('aria-label', T('title'));
    $('#ach').innerHTML = T('chips').split('|').map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join('');
  }
  labels(); I18N.on(function () { CX.ml = null; labels(); if (aip.hidden === false && !am.children.length) add(T('greet'), 'a'); });

  function add(h, who) { var d = document.createElement('div'); d.className = 'am ' + who; d.innerHTML = who === 'a' ? h.replace(EMO, '') : h; am.appendChild(d); am.scrollTop = am.scrollHeight; return d; }
  function card(c) {
    var M = CX.M || Math.max.apply(null, CFG.MONTHS), z = plan(c, CX.B, M);
    return '<div class="auc"><img src="' + c.img + '" alt="' + esc(c.name) + '" data-z="' + c.i + '"><div><b>' + esc(c.name) + '</b><span>' + T('cPrice', { p: usd(c.price) }) + '</span><span>' + T('cDown', { d: usd(z.dn) }) + '</span><span>' + T('cMonthly', { m: usd(z.m), M: M }) + '</span><button type="button" data-b="' + c.i + '">' + esc(T('book')) + '</button></div></div>';
  }
  /* oldingi suhbatni tiklash (sahifa yangilansa ham) */
  try { JSON.parse(sessionStorage.getItem('ah_ai_html') || '[]').forEach(function (x) { add(x.h, x.w); }); } catch (e) {}
  if (CX.uI != null) CX.u = CAT()[CX.uI];

  function speak(text) {
    if (!window.speechSynthesis) return;
    var s = String(text).replace(/<[^>]+>/g, ' ').replace(EMO, '').replace(/\s+/g, ' ').trim().slice(0, 600); if (!s) return;
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(s), l = SPL[L()]; u.lang = l; var v = speechSynthesis.getVoices().filter(function (x) { return x.lang && x.lang.toLowerCase().indexOf(l.slice(0, 2)) === 0; })[0]; if (v) u.voice = v; speechSynthesis.speak(u); } catch (e) {}
  }
  function status(k, ms) { var s = $('#amst'); s.textContent = T(k); s.hidden = false; clearTimeout(status.t); if (ms) status.t = setTimeout(function () { s.hidden = true; }, ms); }

  function ask(t, vo) {
    t = (t || '').trim(); if (!t && !vo) return;
    var uh = vo ? '<span class="avb"><svg class="ic" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>' + Math.floor(vo.dur / 60) + ':' + String(vo.dur % 60).padStart(2, '0') + '</span>' + (t ? '<em>' + esc(t) + '</em>' : '') : esc(t);
    add(uh, 'u'); persist({ h: uh, w: 'u' });
    PAI.push({ role: 'user', content: (t || '(voice message)').slice(0, 600) });
    var d = add('<span class="atyping"><i></i><i></i><i></i></span><span class="sr">' + esc(T('typing')) + '</span>', 'a');
    var r = reply(t), h = r.h, wait = 450 + Math.min(1400, h.length * 6);
    var go = function () {
      d.innerHTML = h.replace(EMO, '') + r.cards.map(card).join('');
      am.scrollTop = am.scrollHeight;
      var plain = d.textContent; PAI.push({ role: 'assistant', content: plain.slice(0, 600) });
      persist({ h: d.innerHTML, w: 'a' });
      var ctx = { name: CX.name, phone: CX.phone, u: CX.u, B: CX.B, M: CX.M, R: CX.R, lang: L() };
      CRM.chatLog('u', t || '(ovozli xabar)', vo ? { v: 1, vk: vo.key, dur: vo.dur } : null, ctx);
      CRM.chatLog('a', plain, null, ctx);
      if (vo || SPK) speak(plain);
    };
    if (CRM.api) {
      fetch(CRM.api + '/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'public', id: CRM.csid(), lang: L(), messages: PAI.slice(-14),
        ctx: { lead: { name: CX.name, phone: CX.phone, budget: CX.B, rooms: CX.R, months: CX.M, project: CX.P, sent: !!CX.sent }, catalog: CAT().map(function (c) { return c.u + ': ~$' + c.price; }), cfg: { p: CFG.PRICE_M2, d: CFG.DOWN_MIN, m: CFG.MONTHS } } }) })
        .then(function (x) { return x.ok ? x.json() : null; }).then(function (j) { if (j && j.text) h = esc(j.text).replace(/\n/g, '<br>'); go(); }).catch(go);
    } else setTimeout(go, wait);
  }

  function open() {
    aip.hidden = false; aib.hidden = true; document.body.classList.add('ai-open');
    if (!am.children.length) { var g = T('greet'); add(g, 'a'); persist({ h: g, w: 'a' }); }
    setTimeout(function () { inp.focus(); }, 60);
    var n = document.getElementById('ain'); if (n) n.remove();
  }
  function close() { aip.hidden = true; aib.hidden = false; document.body.classList.remove('ai-open'); if (window.speechSynthesis) speechSynthesis.cancel(); if (REC && REC.state === 'recording') REC.stop(); }
  aib.addEventListener('click', open);
  $('#aix').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !aip.hidden) close(); });
  $('#af').addEventListener('submit', function (e) { e.preventDefault(); var v = inp.value; inp.value = ''; ask(v); });
  $('#ach').addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
  $('#aspk').addEventListener('click', function () { SPK = !SPK; this.setAttribute('aria-pressed', String(SPK)); if (!SPK && window.speechSynthesis) speechSynthesis.cancel(); });
  am.addEventListener('click', function (e) {
    var z = e.target.dataset.z, b = e.target.dataset.b;
    if (z != null || b != null) { var c = CAT()[+(z != null ? z : b)]; close(); location.hash = 'projects/musaffo'; if (b != null) setTimeout(function () { var btn = document.querySelector('[data-book-plan="' + c.i + '"]'); if (btn) btn.click(); }, 350); }
  });

  /* ovozli xabar: yozib olish + nutqni matnga aylantirish (brauzer qo'llasa) */
  var REC = null;
  $('#amic').addEventListener('click', function () {
    var btn = this;
    if (REC && REC.state === 'recording') { REC.stop(); return; }
    Media.request({ video: false }).then(function (st) {
      var chunks = [], t0 = Date.now(), txt = '', SR = window.SpeechRecognition || window.webkitSpeechRecognition, sr = null, mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].filter(function (m) { return window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m); })[0];
      REC = new MediaRecorder(st, mime ? { mimeType: mime } : undefined);
      REC.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      REC.onstop = function () {
        Media.stop(st); btn.classList.remove('rec'); try { sr && sr.stop(); } catch (e) {}
        setTimeout(function () {
          var blob = new Blob(chunks, { type: (mime || 'audio/webm').split(';')[0] }), dur = Math.max(1, Math.round((Date.now() - t0) / 1000)), key = 'L' + Date.now().toString(36);
          CRM.saveVoice(key, blob); $('#amst').hidden = true;
          if (!txt.trim()) status('notHeard', 2800);
          ask(txt.trim(), { dur: dur, key: key });
        }, 350);
      };
      if (SR) { try { sr = new SR(); sr.lang = SPL[L()]; sr.continuous = true; sr.interimResults = false; sr.onresult = function (e) { for (var i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) txt += ' ' + e.results[i][0].transcript; }; sr.start(); } catch (e) { sr = null; } }
      REC.start(); btn.classList.add('rec'); status('recording');
      setTimeout(function () { if (REC && REC.state === 'recording') REC.stop(); }, 60000);
    }).catch(function () { status('micDenied', 3000); });
  });

  /* 20 soniyadan so'ng muloyim taklif (bir sessiyada bir marta) */
  setTimeout(function () {
    try { if (sessionStorage.getItem('ah_ain') || !aip.hidden) return; sessionStorage.setItem('ah_ain', '1'); } catch (e) { return; }
    var n = document.createElement('button'); n.id = 'ain'; n.type = 'button'; n.innerHTML = '<b>Art House</b>' + esc(T('nudge'));
    n.addEventListener('click', function () { n.remove(); open(); }); document.body.appendChild(n);
    setTimeout(function () { n.remove(); }, 14000);
  }, 20000);

  window.ArtHouseAI = { open: open, reply: reply };
})();
