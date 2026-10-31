# ART HOUSE — Luxury Residence Tashkent

Premium ko'chmas mulk sayti va menejerlar uchun kabinet (dashboard).
Lyuks yashil (emerald) fon, och tilla ikonka, matn va menyular. Sayt va kabinet 9 tilda ishlaydi: o'zbek (lotin va kirill), rus, ingliz, fransuz, italyan, ispan, nemis va turk.
Art House — 15 yillik tajriba, 30 dan ortiq ko'p qavatli uy loyihasi, bosh ofis Yunusobodda («High Town», «Siti Mall» ortida). Instagram: @arthouse.tashkent.

## Tuzilma

```
index.html        — sayt: 7 bo'lim + «Mijozlar izohlari»; bosh sahifa bo'limlari mavzu orqali boshqariladi
kabinet.html      — kabinet: Bosh sahifa, Xabarlar, Art House chati, Mijozlar izohlari, Video qo'ng'iroqlar,
                    Mijozlar bazasi, Xonadonlar, To'lovlar, Chegirmalar, Statistika, AI Agent,
                    Mavzular (Shopify uslubidagi tahrirlagich), Mening profilim, Menejerlar va ballar, Sozlamalar,
                    Video yo'riqnoma (8 til)
guide/            — kabinet video-yo'riqnomasi: kabinet-uz.mp4, kabinet-ru.mp4 … (tools/guide/run.sh yaratadi)
css/base.css, site*.css, home-icon.css — sayt uslublari (oxirgi qatlam: site-prime.css)
css/theme.css     — mavzu bo'limlari: «Yulduzlar va mijozlar tanlovi», «Biz haqimizda», «Taklif va CTA» …
css/kabinet*.css  — kabinet uslublari; kabinet-themes.css — «Mavzular» sahifasi va tahrirlagich
js/config.js      — BARCHA sozlamalar va kontent (telefonlar, havolalar, loyihalar, narxlar)
js/theme-schema.js — bo'lim turlari, sozlamalar va bloklar sxemasi, rang uslublari, standart matnlar (8 til)
js/theme.js       — saytda mavzuni qo'llaydi: bo'limlarni chizadi, tartiblaydi, yoqadi/o'chiradi, jonli yangilanadi
js/kabinet-themes.js — kabinetdagi «Mavzular» sahifasi va tahrirlagich (+ js/kabinet-dict-themes.js lug'ati)
js/cms-apply.js, cms-text.js, cms-site.js — Sozlamalar (CMS) o'zgarishlarini saytga qo'llash
js/i18n.js        — sayt tarjimalari (uz, uz-kirill, ru, en) + js/i18n-fr-it.js, js/i18n-es-de-tr.js
js/agent.js       — saytdagi «AI maslahatchi» (o'ng tomonda va bosh sahifa kartasida) + js/agent-dict.js (8 til)
js/funnel.js      — sotuv oynalari (taklif kalit-kartasi, bo'lib to'lash kalkulyatori) va afzalliklar lentasi (+ css/funnel.css, js/funnel-dict.js)
js/kabinet-funnel.js — kabinetdagi «Sotuv oynalari» sahifasi: qoidalar, matnlar, rasmlar, ikonkalar, «Asliga qaytarish»
js/crm.js         — saytdan kabinetga: arizalar, AI suhbatlar (Xabarlar), tashriflar statistikasi
js/kabinet*.js    — kabinet mantiqi, tillari va lug'ati; js/kabinet-emoji.js — menyu ikonkalari
js/kabinet-publish.js — «Saytga chiqarish»: o'zgarishlarni index.html ichiga joylaydi
js/menu-schema.js, kabinet-menu.js — saytdagi ☰ menyu sxemasi va kabinetdagi «Menyu» bo'limi
css/site-final.css — oxirgi qatlam: ixcham menyu, pastki ikonkali lenta, footer va raqam bilan obuna
js/kabinet-guide.js — «Video yo'riqnoma» bo'limi va kirish oynasidagi tugma (+ js/guide-chapters.js boblari)
js/kabinet-stars.js — «Yulduzlar» sahifasi: taniqli insonlar kartalari (+ css/kabinet-stars.css)
js/kabinet-instagram.js — «Instagram» sahifasi: Reels videolari, havolalar, gapirilgan matn 8 tilda
js/kabinet-translate.js — yangi til uchun AI tarjima (server → /api/translate)
js/ig-reels.js     — saytdagi standart Reels: video, Instagram havolasi, subtitrlar (8 til)
js/masterplan.js, lux-sections.js, home-icon.js — bosh reja, e'lon qatori, bosh sahifa bloklari (yulduzlar, Instagram telefoni, dron videosi)
css/site-icon.css — ICON uslubidagi qatlam: yulduzlar kartalari, dron videosi bloki, Instagram telefoni, Geologica shrifti
js/store.js       — ma'lumotlar: localStorage + BroadcastChannel yoki server (REST + SSE)
js/media.js       — getUserMedia (mikrofon/kamera ruxsati) va WebRTC qo'ng'iroq
js/site.js        — sayt mantiqi
server/server.js  — Node.js server: API, CRM, /api/cms (sozlamalar va mavzular), jonli sinxronlash, video-signal, AI proksi
tools/build-single.py — bitta faylli dist/ versiyasini yig'adi; tools/check-i18n.js — tarjimalarni tekshiradi
assets/           — rasmlar, rejalar, dron videosi, kabinet emoji-ikonkalari
```

## Kabinet o'zgarishlari saytga qanday yetadi («Saytga chiqarish»)

Kabinet o'zgarishlarni **shu brauzer xotirasiga** yozadi. Sayt boshqa telefonda, boshqa brauzerda yoki
fayl sifatida (telefon «Yuklanmalar», Telegram — `content://…`) ochilsa, bu xotirani ko'rmaydi — shuning uchun
kabinetda almashgan rasm saytda eskicha qolardi. Endi:

1. Kabinetda biror narsani saqlasangiz, pastda oltin **«Saytga chiqarish»** tugmasi chiqadi.
2. Tugma → **«index.html ni tanlash»** → hozirgi sayt faylini tanlang.
3. Kabinet barcha o'zgarishlarni (yuklangan rasm va videolar bilan) shu fayl ichiga joylaydi
   (`<script id="ahBaked">window.AH_BAKED=…`) va yangi `index.html` ni yuklab beradi.
4. Yangi faylni hostingga eskisining o'rniga qo'ying yoki mijozlarga yuboring — hamma yangi ko'rinishni ko'radi.

Eski `index.html` tanlansa ham ishlaydi. Server ulangan bo'lsa (`API_URL`) — «Serverga nashr qilish» hammaga darhol tarqatadi.

## Menyu (☰) — kabinet → Sayt → Menyu

Saytdagi to'liq ekranli menyu to'liq kabinetdan boshqariladi (`js/menu-schema.js`, `js/kabinet-menu.js`, `'ah_cms'.menu`):
rasm yoki video kartalar, katta havolalar («ajratilgan» — oltin rangda), guruhlar (sarlavha + bandlar),
har bir yozuv 8 tilda, tartiblash, yashirish, qo'shish, o'chirish va «Asliga qaytarish».

## Mavzular va bo'limlar (Shopify uslubida)

Kabinet → **Sayt → Mavzular**:

- **Jonli mavzu** — saytda ko'rinib turgan mavzu. «Moslashtirish» tugmasi to'liq ekranli tahrirlagichni ochadi.
- **Bosh sahifa bo'limlari** — har bir blokni bitta tugma bilan yoqish/o'chirish; sayt shu zahoti yangilanadi.
- **Mavzular kutubxonasi** — nusxa olish, nomini o'zgartirish, o'chirish va «Nashr qilish». Nusxadagi o'zgarishlar
  nashr qilinmaguncha saytda ko'rinmaydi (Shopify'dagi kabi xavfsiz tajriba).
- **Yangi mavzu qo'shish** — tayyor rang uslublari: Zumrad Prime, Bahor zumradi, Oltin kech, Malaxit.

Tahrirlagich (chapda sozlamalar, o'ngda saytning jonli ko'rinishi — kompyuter yoki telefon):

- **Bo'limlar**: sudrab tartiblash, ko'z belgisi bilan yashirish, «Bo'lim qo'shish» (Yulduzlar va mijozlar tanlovi,
  Biz haqimizda, Taklif va harakatga chaqiruv, Matn va tugma, Video). Saytdagi istalgan bo'limni bossangiz —
  uning sozlamalari ochiladi.
- **Bloklar**: video (fayl yuklash, YouTube yoki Instagram havolasi, muqova, «Yulduz / Mijoz / Sovg'a» turi),
  fikrlar (surat, matn, baho), raqamlar, afzalliklar — qo'shish, nusxalash, o'chirish, sudrab tartiblash.
  «Namuna» bloklar saytda ko'rinmaydi; video yoki matn kiritilganda haqiqiy blokka aylanadi.
- **Asl bo'limlar** (bosh banner, xonadonlar, ofis va h.k.) — matnlarini shu yerning o'zida tahrirlash mumkin.
- **Mavzu sozlamalari**: rang uslubi, o'z ranglaringiz, sarlavha shrifti, tugmalar shakli, yangi bo'limlar foni
  (och shampan yoki zumrad) va saytdagi umumiy **raqamlar** (tajriba yili, loyihalar soni, Instagram).
- Til tanlagichi — har bir matnni 8 tilda kiritish; bo'sh qolgan tillarda o'zbekcha matn ko'rsatiladi.
- Bekor qilish/qaytarish (Ctrl+Z / Ctrl+Shift+Z), saqlash (Ctrl+S).

Matnlarda `{years}`, `{projects}`, `{months}` yozilsa, ular «Raqamlar» qiymatlari bilan almashtiriladi.

**Jonli yangilanish.** Saqlangan o'zgarish saytni qayta yuklamasdan ko'rinadi: shu brauzerda — `storage` hodisasi
orqali, server rejimida — barcha qurilmalarda SSE (`/api/events`) va `/api/cms` orqali. Serversiz rejimda yuklangan
video va rasmlar faqat shu brauzerda saqlanadi — boshqa qurilmalar uchun server yoki YouTube/Instagram havolasidan
foydalaning.

## Video yo'riqnoma (8 til, ovozli)

Kabinet → **Yordam → Video yo'riqnoma** (barcha xodimlar uchun) va kirish oynasidagi **«Video yo'riqnoma»** tugmasi.
Taxminan 7–8 daqiqalik video: telefondan va kompyuterdan kirish, kabinetning barcha bo'limlari va
Sozlamalarning har bir yorlig'i. Ovozli izoh va subtitrlar 8 tilda: o'zbek, rus, ingliz, fransuz, italyan,
ispan, nemis, turk.

- Video **kabinet tilida** ochiladi: menejer globus orqali ruschani tanlasa — ruscha video chiqadi
  (o'zbek kirill → o'zbekcha). Boshqa tilni video yonidan ham tanlash mumkin.
- Boblar ro'yxati (Bosh sahifa, Xabarlar, … Sozlamalar) — bosilganda video o'sha joyga o'tadi.
- Kirish oynasidan ochilsa: telefonda — «Telefondan kirish», kompyuterda — «Kompyuterdan kirish» bobidan boshlanadi.

Fayllar: `guide/kabinet-<til>.mp4` (kabinet.html bilan bir papkada) va `js/guide-chapters.js`.
Video quyidagi tartibda qidiriladi: `guide/` → bir pog'ona yuqoridagi `guide/` (dist/ uchun) → internetdagi nusxa
(`CFG.GUIDE_CDN`, GitHub omborining aniq versiyasi jsDelivr orqali). Shuning uchun bitta `kabinet.html` faylini
telefonda ochganda ham video internet orqali ishlaydi. Videolar yangilangach `GUIDE_CDN` dagi versiyani almashtiring.
Yangi til qo'shilsa, o'z videosi tayyor bo'lgunicha inglizcha video ochiladi.
Boblarga o'tish uchun veb-server Range so'rovlarini qo'llashi kerak (`node server/server.js`, nginx, Apache,
hosting xizmatlari — qo'llaydi; `python -m http.server` — qo'llamaydi, video faqat boshidan o'ynaydi).

Kabinet o'zgargach videoni qayta yaratish: `tools/guide/run.sh` (ssenariy va matnlar — `tools/guide/script.js`,
namunaviy ma'lumotlar — `tools/guide/seed.js`). Talablar: Node + Playwright, Python + `edge-tts`, ffmpeg (libass).
Ovozlar Microsoft Edge neyron ovozlari (edge-tts) bilan yaratilgan; tijorat maqsadida keng tarqatishdan oldin
ularning foydalanish shartlarini tekshiring yoki diktor ovozi bilan almashtiring.

**Odam ovozi (diktor):** `node tools/guide/voice-script.js uz` → `tools/guide/voice/SCRIPT-uz.md` — 56 ta qator va fayl nomlari.
Har bir qatorni alohida yozib (`phone-00.mp3`, `desktop-07.mp3` …) `tools/guide/voice/uz/` ga qo'ying va `run.sh` ni
ishga tushiring — o'sha qatorlar sun'iy ovoz o'rniga diktor ovozi bilan chiqadi, video tempi o'zi moslanadi.
O'zbekcha sun'iy ovoz sozlamasi (`tools/guide/tts.py` → `OPTS`): tezroq va balandroq — reklama roligidagi boshlovchi tempiga moslangan.

## Yulduzlar

Kabinet → **Sayt → Yulduzlar** (direktor va «Sayt sozlamalari» ruxsati bor menejerlar):

- Saytdagi **«Ular Art House'ni tanladi»** bo'limi (icon-amsterdam.com «Worn by ICONS» uslubida): rasm, rasm ustidagi
  belgi, ism + ko'k tasdiq belgisi, kasbi, Instagram havolasi. Obunachilar soni ko'rsatilmaydi.
- Qo'shish, tahrirlash, ↑ ↓ tartiblash, yashirish, o'chirish; belgi va kasbi — 8 tilda (bo'sh tilda o'zbekcha chiqadi).
- Bo'lim sarlavhasi va tavsifi har bir tilda, bo'limni yoqish/o'chirish.

Saqlangan zahoti sayt sahifani qayta yuklamasdan yangilanadi. Standart ro'yxat — `js/config.js` → `AMBASSADORS`,
rasmlar `assets/img/amb/` (Instagram skrinshotlaridan kesilgan — sifatli asl rasmlar bilan almashtirish tavsiya etiladi).
Rasm va ismdan faqat insonning roziligi bilan foydalaning.

## Instagram: Reels, gapirilgan matn va tarjima

Saytdagi Instagram bo'limida telefon ichida videolar yon tomonga almashadi (Instagram belgisi Figma'da chizilgan — `assets/img/instagram.svg`):

- **Yon tomonga almashtirish:** mijoz videoni barmog'i bilan chapga/o'ngga suradi (kompyuterda — sichqoncha bilan tortadi);
  ekranda tugma, o'q yoki nuqta yo'q. Video tugasa — keyingisi, oxirgisidan keyin — birinchisi. Tepaga-pastga harakat sahifani aylantiradi.
- **Bosish:** videoning o'zi bosilsa — aynan shu reel Instagram'da ochiladi (har bir videoning o'z havolasi).
- **Ovoz:** brauzerlar ovozli avtomatik ijroga faqat foydalanuvchi sahifani bir marta bosgandan keyin ruxsat beradi —
  shuning uchun ovoz saytdagi birinchi bosishdan keyin o'zi yoqiladi; «Ovozni yoqish» tugmasi ham bor.
- **Gapirilgan matn (subtitr)** sayt tilida, so'zma-so'z vaqt bilan chiqadi. Standart 3 ta video (`js/ig-reels.js`):
  1) Ko'kcha Oqtepa — @dilyanora, 2) Musaffo — Art House taqdimotchisi, 3) Medina Akmal. Gaplar nutqni tanib olish
  modeli (rubaistt v2, o'zbek tili) bilan yozildi, qo'lda tahrirlandi va 8 tilga tarjima qilindi.
  Medina videosi bizga 6 MB da kesilib kelgan — dastlabki 65 soniyasi qo'yildi; to'liq faylni kabinetdan almashtirish mumkin.

Kabinet → **Sayt → Instagram**: video qo'shish/tartiblash/o'chirish, har bir videoning Instagram havolasi va muallif yozuvi,
**«Gaplar va tarjima»** — vaqt (soniya) va matn har bir tilda, videoni ko'rib vaqtni qo'yish; telefon yonidagi ikki rasm.

### AI tarjima (yangi til qo'shilganda)

Kabinet → Sozlamalar → Tillar orqali yangi til qo'shilsa, **avtomatik** AI tarjima ishga tushadi: saytning barcha matnlari,
Reels subtitrlari, yulduzlar belgisi/kasbi va mavzu bo'limlari (sarlavha, matn, tugmalar). Keyin ham «AI bilan tarjima»
tugmasi bilan yetishmayotganlarini to'ldirish mumkin (Tillar ro'yxatida va Instagram bo'limida). Natijani tekshirib,
kerak bo'lsa «Tarjima qilish» orqali qo'lda tuzating.

Talab: sayt `node server/server.js` bilan ishlashi va serverda `ANTHROPIC_API_KEY` bo'lishi kerak (`POST /api/translate`,
faqat kabinetga kirgan xodimlar uchun; model — `AI_MODEL`, standart `claude-opus-5-5`). Serversiz rejimda kabinet
tushunarli xabar ko'rsatadi — tarjimani qo'lda yoki JSON fayl bilan kiritiladi.

**Tajriba yili** avtomatik: `js/config.js` → `FOUNDED: 2012` (kabinet → Sozlamalar / Mavzular → Raqamlar → «Tashkil topgan yil»).
Saytdagi barcha matnlarda (8 til), AI maslahatchi javoblarida va serverdagi AI faktlarida `{years}` = joriy yil − 2012.

**Shrift:** standart — Geologica (ICON uslubidagi geometrik shrift, katta harfli sarlavhalar; kirill va o'zbek harflari bor).
Kabinet → Mavzular → Moslashtirish → Mavzu sozlamalari → Sarlavha shrifti orqali eski Cormorant'ga qaytarish mumkin.

## Sotuv oynalari va afzalliklar lentasi

Dizayn Figma faylida: «Art House · Sotuv oynalari va afzalliklar» (telefon va kompyuter, komponentlar va ranglar bilan).
Kod: `js/funnel.js` + `css/funnel.css` (sayt), `js/funnel-dict.js` (matnlar 8 tilda, ikonkalar, standart sozlamalar),
`js/kabinet-funnel.js` + `css/kabinet-funnel.css` (kabinet).

**Kabinet → Sayt → «Sotuv oynalari»** — hammasi shu yerda o'zgartiriladi va saytda sahifa yangilanmasdan ko'rinadi:
- *Qachon chiqadi:* har oynani yoqish/o'chirish, kutish (soniya), surish (ekran), ikkinchi oyna oralig'i, yopilgandan keyin
  necha kun chiqmasligi, bir tashrifdagi eng ko'p soni, lenta tezligi.
- *Taklif oynasi:* summa (bo'sh — avtomatik), kartadagi nom va raqam, kompyuterdagi rasm, yulduzlar qatori, ishonch qatorlari
  (ikonka yoki o'z rasmingiz + matn 8 tilda) va oynaning barcha matnlari 8 tilda.
- *Kalkulyator oynasi:* barcha matnlar 8 tilda (xonadonlar, narx, foiz va muddatlar — Sozlamalar va Xonadonlar'dan).
- *Afzalliklar lentasi:* bandlar (21 ta ikonkadan biri yoki o'z rasmingiz, sarlavha va matn 8 tilda), tartib, yashirish,
  qo'shish, o'chirish; lentani yoqish/o'chirish.
- Har qismda **«Asliga qaytarish»** — kabinetdagi o'zgarishlar o'chadi, standart holat tiklanadi.
- Saqlash: `'ah_cms'.funnel`. Yangi til qo'shilganda bu matnlar ham AI bilan tarjima qilinadi.

**Statistika va mijozlar bazasi.** Har arizada manba saqlanadi va ko'rinadi: Taklif oynasi, Kalkulyator oynasi, AI maslahatchi,
Sayt: band qilish, Qayta qo'ng'iroq, Kabinet (qo'lda). Mijozlar bazasida har mijoz yonida manba belgisi va manba bo'yicha filtr.
Statistika → «Mijozlar qayerdan keldi»: har manbadan nechta so'rov, nechtasi sotib oldi, konversiya; oynalar voronkasi:
taklif ko'rsatildi → kartani ochdi → ism va telefon qoldirdi, kalkulyator ko'rsatildi → ariza (`/track`: `po`, `pr`, `pq`).

- **Taklif oynasi.** Mijoz kalit-kartaning oltin folgasini (gilosh naqshi, o'yma yozuv) barmog'i bilan suradi (yoki «kartani ochish»ni bosadi): eng arzon xonadonning
  boshlang'ich to'lovi ochiladi (hozir $15 060 = 45,6 m² × 1 100 $ × 30%; narx yoki foiz Sozlamalar'da o'zgarsa, raqam ham o'zgaradi).
  Keyin ism va telefon: ariza `via: 'popup'` bilan kabinet → Mijozlar bazasiga («Taklif oynasi» belgisi) va Telegram guruhga
  («🎁 Saytdagi taklif oynasidan») boradi.
- **Bo'lib to'lash kalkulyatori oynasi.** 4 ta raqamli qadam: necha xonali, maydon, boshlang'ich to'lov, muddat → hisob (narx, boshlang'ich, qolgan summa, oylik × oy) → «Shu shart bilan
  band qilish» → ism va telefon. Ariza `via: 'popup-calc'`, xonadon, narx, muddat va oylik to'lov bilan. Bosh bannerdagi
  «To'lovni hisoblash» tugmasi shu oynani ochadi.
- **Qachon chiqadi.** Kirgan zahoti emas: mijoz kamida 12 soniya saytda bo'lib, bir ekrandan ko'proq pastga surgandan keyin
  (kompyuterda sichqoncha sahifadan chiqayotganda biroz erta). Ikkinchi oyna birinchisi yopilgandan 45 soniya va yana
  1,5 ekran surishdan keyin. Bir tashrifda ko'pi bilan 2 ta; yopilgan oyna 3 kun o'zi chiqmaydi; ariza qoldirgan mijozga
  umuman chiqmaydi. Yopilgan taklif chap pastda kichik yorliq bo'lib qoladi. Sinov uchun: `?pp=offer`, `?pp=calc`; o'chirish: `?pp=0`.
- **Afzalliklar lentasi** bosh banner ostida: quruvchidan to'g'ridan-to'g'ri, ta'mirli uylar, 0%, tajriba, tez javob.
  Telefonda bittadan aylanadi (barmoq bilan ham suriladi), kompyuterda 5 ustun. Kabinet → Mavzular'da yoqiladi/o'chiriladi.
- Reklama manbasi: saytga `?utm_source=instagram` kabi havola bilan kirilsa, arizalarga `utm` yoziladi («📣 Manba»).
- Kirish animatsiyasi ~2,5 soniya (shu oynada qayta yuklanganda ~1,3 s): faqat transform/opacity, sahifa yuklanayotganda qotmaydi.

## Ishga tushirish

**Server bilan (tavsiya etiladi):** izohlar, arizalar va video-qo'ng'iroqlar barcha qurilmalar o'rtasida jonli sinxronlanadi.

```bash
# js/config.js ichida:  API_URL: 'auto',
npm install             # faqat AI uchun (@anthropic-ai/sdk)
npm start               # yoki: PORT=8080 node server/server.js
# sayt:    http://localhost:8080/
# kabinet: http://localhost:8080/kabinet.html
```

Ma'lumotlar (shu jumladan Sozlamalar va Mavzular — `cms`) `data/db.json` faylida, video va rasmlar `data/media/` papkasida saqlanadi. Bu papka git'ga kirmaydi.
Production'da serverni HTTPS ortida ishga tushiring (nginx yoki Caddy): kamera va mikrofon faqat `https://` orqali ishlaydi.

Muhit o'zgaruvchilari (ixtiyoriy):

| O'zgaruvchi         | Vazifasi                                                                 |
|---------------------|--------------------------------------------------------------------------|
| `ANTHROPIC_API_KEY` | AI maslahatchi Claude orqali javob beradi (bo'lmasa — o'rnatilgan qoidalar) |
| `AI_MODEL`          | model nomi (standart: `claude-opus-5-5`)                                  |
| `TG_BOT_TOKEN`, `TG_CHAT_ID` | yangi arizalar Telegram guruhga yuboriladi                       |

**Serversiz (statik hosting):** `API_URL: ''` bo'lsa, ma'lumotlar brauzer xotirasida saqlanadi. Bu rejimda sayt va kabinet bir xil brauzerda ochilgan bo'lsa, menejer javobi saytda darhol ko'rinadi va video-qo'ng'iroq ham ishlaydi. Boshqa qurilma bilan video-qo'ng'iroqni «kod orqali ulanish» yo'li bilan qilish mumkin. Haqiqiy foydalanish uchun server rejimi kerak.

## Kabinetga kirish

Eski kabinet loginlari o'zgarishsiz ishlaydi. Qo'shimcha boshlang'ich login (**darhol almashtiring!**):

| Login   | Parol           | Huquq    |
|---------|-----------------|----------|
| `admin` | `ArtHouse#2026` | direktor |

Yangi login/parol xeshini olish:

```bash
node -e "const c=require('crypto');const u='login',p='YANGI_PAROL';console.log(c.pbkdf2Sync(u+':'+p,'arthouse.v2',120000,32,'sha256').toString('hex'))"
```

Olingan qiymatni `js/config.js` → `ADMINS` ga `'xesh': 'owner'` yoki `'manager'` ko'rinishida yozing. Server ham loginlarni shu fayldan o'qiydi.

## Kontentni tahrirlash

Hammasi `js/config.js` faylida: telefonlar, Telegram, Instagram, loyihalar, faktlar, qulayliklar, rejalar, taqdimot havolalari (`presentation`).
Ko'kcha va Obod Maskan uchun rasm va rejalarni `assets/img/...` papkasiga qo'yib, `cover`, `gallery` va `plans` maydonlariga yozing.

> ⚠️ `TEKSHIRING` deb belgilangan ma'lumotlar (manzillar, qavatlar soni, xonadonlar soni, tashkil topgan yil, koordinatalar) ochiq manbalar va @arthouse.tashkent postlaridan olingan. E'lon qilishdan oldin ularni rasmiy ma'lumot bilan solishtiring.

## Bitta faylli versiya

`dist/index.html` va `dist/kabinet.html` — hamma narsa (CSS, JS, rasmlar, video) ichiga joylangan nusxalar. Ikkala faylni bitta papkada saqlang va brauzerda oching.
Kodni o'zgartirgandan keyin qayta yig'ish: `python3 tools/build-single.py`

1,5 MB dan katta videolar (Reels, dron videosi) bitta faylga joylanmaydi: GitHub'ga yuklangan bo'lsa,
ularning aniq versiyasi jsDelivr orqali olinadi (fayl kichik qoladi; internet kerak). Yuklanmagan bo'lsa — fayl ichiga joylanadi.
