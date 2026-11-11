# ART HOUSE — Luxury Residence Tashkent

Premium ko'chmas mulk sayti va menejerlar uchun kabinet (dashboard).
Lyuks yashil (emerald) fon, och tilla ikonka, matn va menyular. Sayt va kabinet 9 tilda ishlaydi: o'zbek (lotin va kirill), rus, ingliz, fransuz, italyan, ispan, nemis va turk.
Art House — 14 yillik tajriba, 30+ amalga oshirilgan loyiha (Instagram: @arthouse.tashkent).

## Tuzilma

```
index.html        — sayt: 7 bo'lim + «Mijozlar izohlari»
kabinet.html      — kabinet: Bosh sahifa, Xabarlar (sayt xabarlari + telefon qo'ng'iroqlari), Art House chati,
                    Mijozlar izohlari, Video qo'ng'iroqlar, Mijozlar bazasi, Xonadonlar, To'lovlar, Chegirmalar,
                    Statistika, AI Agent, Mening profilim, Menejerlar va ballar, Sozlamalar
css/base.css      — umumiy uslublar, lyuks logotip animatsiyasi, qo'ng'iroq oynasi
css/site.css      — sayt uslublari
css/kabinet.css   — kabinet uslublari
js/config.js      — BARCHA sozlamalar va kontent (telefonlar, havolalar, loyihalar, narxlar)
js/i18n.js        — sayt tarjimalari (uz, uz-kirill, ru, en) + js/i18n-fr-it.js, js/i18n-es-de-tr.js
js/agent.js       — saytdagi «Art House» AI maslahatchi (o'ng tomonda) + js/agent-dict.js (8 til)
js/crm.js         — saytdan kabinetga: arizalar, AI suhbatlar (Xabarlar), tashriflar statistikasi
js/kabinet-*.js   — kabinet tillari va lug'ati (kabinet-dict.js, kabinet-dict-extra.js)
tools/check-i18n.js — barcha tillarda tarjima yetishmasligini tekshiradi: node tools/check-i18n.js
js/store.js       — ma'lumotlar: localStorage + BroadcastChannel yoki server (REST + SSE)
js/media.js       — getUserMedia (mikrofon/kamera ruxsati) va WebRTC qo'ng'iroq
js/site.js        — sayt mantiqi
js/kabinet.js     — kabinet mantiqi
server/server.js  — Node.js server: API, CRM, jonli sinxronlash, video-signal, AI (Claude) proksi
assets/           — rasmlar, rejalar, dron videosi
```

## Ishga tushirish

**Server bilan (tavsiya etiladi):** izohlar, arizalar va video-qo'ng'iroqlar barcha qurilmalar o'rtasida jonli sinxronlanadi.

```bash
# js/config.js ichida:  API_URL: 'auto',
npm install             # faqat AI uchun (@anthropic-ai/sdk)
npm start               # yoki: PORT=8080 node server/server.js
# sayt:    http://localhost:8080/
# kabinet: http://localhost:8080/kabinet.html
```

Ma'lumotlar `data/db.json` faylida, video-sharhlar `data/media/` papkasida saqlanadi. Bu papka git'ga kirmaydi.
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

> ⚠️ **Diqqat:** `dist/` ichidagi fayllar hozir ildizdagi `index.html` / `js/` / `css/` dan **yangiroq** (v6: mavzular tahrirlagichi, sayt menyusi sxemasi, «Menyu» sahifasidagi jonli ko'rinish, AI Agent suhbatlar arxivi). Shu sababli ularni `python3 tools/build-single.py` bilan **qayta yig'mang** — aks holda yangi imkoniyatlar yo'qoladi. O'zgarishlarni to'g'ridan-to'g'ri `dist/*.html` ichida qiling.

## «Menyu» sahifasi: yangi bo'lim va jonli ko'rinish

Kabinet → **Sayt → Menyu**:

* **«+ Yangi bo'lim qo'shish»** — saytga yangi sahifa (sarlavha va matn 8 tilda, rasm yoki video) qo'shadi va unga menyudan havola yaratadi. Ma'lumot `'ah_cms'.sections.custom` va `'ah_cms'.menu` da saqlanadi.
* **Jonli ko'rinish (Live preview)** — o'ng tarafdagi oynada sayt `index.html?preview=1&menu=1` ko'rinishida ochiladi va ☰ menyu doim ochiq turadi. Matn, rang yoki yangi bo'lim kiritilayotgan paytda o'zgarish darhol ko'rinadi (hali saqlanmagan qoralama `postMessage` orqali yuboriladi, saytda saqlanmaydi). Ko'rinishdagi bandni bosish — kabinetda shu bandning sozlamalarini ochadi. Kompyuter / telefon ko'rinishini almashtirish mumkin.
* **«Menyu ranglari»** — fon, yozuv va aksent rangi (`'ah_cms'.menu.style`). Saytda faqat `#rrggbb` ko'rinishidagi qiymat qabul qilinadi.

## AI Agent: suhbatlar arxivi

Kabinet → **AI Agent**: chap tomonda och rangli panel (Claude va Telegram uslubida) — yuqorida «Yangi chat» tugmasi va qidiruv, so'ng sana bo'yicha guruhlangan eski yozishmalar (nomini o'zgartirish va o'chirish bilan), «Mavzular» varag'i ham shu panelda. Har bir suhbat alohida saqlanadi (`localStorage`: `ah_agent_mem` → `{chats:[…], cur}`), eski bitta suhbatli xotira birinchi ochilishda avtomatik ko'chiriladi.
