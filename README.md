# ART HOUSE — Luxury Residence Tashkent

Premium ko'chmas mulk sayti va menejerlar uchun kabinet (dashboard).
Lyuks yashil (emerald) fon, och tilla ikonka, matn va menyular. Sayt va kabinet 9 tilda ishlaydi: o'zbek (lotin va kirill), rus, ingliz, fransuz, italyan, ispan, nemis va turk.
Art House — 15 yillik tajriba, 30 dan ortiq ko'p qavatli uy loyihasi, bosh ofis Yunusobodda («High Town», «Siti Mall» ortida). Instagram: @arthouse.tashkent.

## Tuzilma

```
index.html        — sayt: 7 bo'lim + «Mijozlar izohlari»; bosh sahifa bo'limlari mavzu orqali boshqariladi
kabinet.html      — kabinet: Bosh sahifa, Xabarlar, Art House chati, Mijozlar izohlari, Video qo'ng'iroqlar,
                    Mijozlar bazasi, Xonadonlar, To'lovlar, Chegirmalar, Statistika, AI Agent,
                    Mavzular (Shopify uslubidagi tahrirlagich), Mening profilim, Menejerlar va ballar, Sozlamalar
css/base.css, site*.css, home-icon.css — sayt uslublari (oxirgi qatlam: site-prime.css)
css/theme.css     — mavzu bo'limlari: «Yulduzlar va mijozlar tanlovi», «Biz haqimizda», «Taklif va CTA» …
css/kabinet*.css  — kabinet uslublari; kabinet-themes.css — «Mavzular» sahifasi va tahrirlagich
js/config.js      — BARCHA sozlamalar va kontent (telefonlar, havolalar, loyihalar, narxlar)
js/theme-schema.js — bo'lim turlari, sozlamalar va bloklar sxemasi, rang uslublari, standart matnlar (8 til)
js/theme.js       — saytda mavzuni qo'llaydi: bo'limlarni chizadi, tartiblaydi, yoqadi/o'chiradi, jonli yangilanadi
js/kabinet-themes.js — kabinetdagi «Mavzular» sahifasi va tahrirlagich (+ js/kabinet-dict-themes.js lug'ati)
js/cms-apply.js, cms-text.js, cms-site.js — Sozlamalar (CMS) o'zgarishlarini saytga qo'llash
js/i18n.js        — sayt tarjimalari (uz, uz-kirill, ru, en) + js/i18n-fr-it.js, js/i18n-es-de-tr.js
js/agent.js       — saytdagi «Art House» AI maslahatchi (o'ng tomonda) + js/agent-dict.js (8 til)
js/crm.js         — saytdan kabinetga: arizalar, AI suhbatlar (Xabarlar), tashriflar statistikasi
js/kabinet*.js    — kabinet mantiqi, tillari va lug'ati; js/kabinet-emoji.js — menyu ikonkalari
js/masterplan.js, lux-sections.js, home-icon.js — bosh reja, e'lon qatori, bosh sahifa bloklari
js/store.js       — ma'lumotlar: localStorage + BroadcastChannel yoki server (REST + SSE)
js/media.js       — getUserMedia (mikrofon/kamera ruxsati) va WebRTC qo'ng'iroq
js/site.js        — sayt mantiqi
server/server.js  — Node.js server: API, CRM, /api/cms (sozlamalar va mavzular), jonli sinxronlash, video-signal, AI proksi
tools/build-single.py — bitta faylli dist/ versiyasini yig'adi; tools/check-i18n.js — tarjimalarni tekshiradi
assets/           — rasmlar, rejalar, dron videosi, kabinet emoji-ikonkalari
```

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
