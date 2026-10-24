# ART HOUSE — Luxury Residence Tashkent

Premium ko'chmas mulk sayti va menejerlar uchun kabinet (dashboard).
Emerald va champagne-tilla ranglardagi qorong'i dizayn. Sayt 4 tilda ishlaydi: o'zbek (lotin va kirill), rus va ingliz.

## Tuzilma

```
index.html        — sayt: 7 bo'lim + «Mijozlar izohlari»
kabinet.html      — kabinet: arizalar, izohlar (javob berish), qo'ng'iroqlar, sozlamalar
css/base.css      — umumiy uslublar, lyuks logotip animatsiyasi, qo'ng'iroq oynasi
css/site.css      — sayt uslublari
css/kabinet.css   — kabinet uslublari
js/config.js      — BARCHA sozlamalar va kontent (telefonlar, havolalar, loyihalar, narxlar)
js/i18n.js        — tarjimalar (uz, uz-kirill, ru, en)
js/store.js       — ma'lumotlar: localStorage + BroadcastChannel yoki server (REST + SSE)
js/media.js       — getUserMedia (mikrofon/kamera ruxsati) va WebRTC qo'ng'iroq
js/site.js        — sayt mantiqi
js/kabinet.js     — kabinet mantiqi
server/server.js  — Node.js server (tashqi kutubxonalarsiz): API, jonli sinxronlash, video-signal
assets/           — rasmlar, rejalar, dron videosi
```

## Ishga tushirish

**Server bilan (tavsiya etiladi):** izohlar, arizalar va video-qo'ng'iroqlar barcha qurilmalar o'rtasida jonli sinxronlanadi.

```bash
# js/config.js ichida:  API_URL: 'auto',
npm start               # yoki: PORT=8080 node server/server.js
# sayt:    http://localhost:8080/
# kabinet: http://localhost:8080/kabinet.html
```

Ma'lumotlar `data/db.json` faylida, video-sharhlar `data/media/` papkasida saqlanadi. Bu papka git'ga kirmaydi.
Production'da serverni HTTPS ortida ishga tushiring (nginx yoki Caddy): kamera va mikrofon faqat `https://` orqali ishlaydi.

**Serversiz (statik hosting):** `API_URL: ''` bo'lsa, ma'lumotlar brauzer xotirasida saqlanadi. Bu rejimda sayt va kabinet bir xil brauzerda ochilgan bo'lsa, menejer javobi saytda darhol ko'rinadi va video-qo'ng'iroq ham ishlaydi. Boshqa qurilma bilan video-qo'ng'iroqni «kod orqali ulanish» yo'li bilan qilish mumkin. Haqiqiy foydalanish uchun server rejimi kerak.

## Kabinetga kirish

Boshlang'ich loginlar (**darhol almashtiring!**):

| Login     | Parol           | Huquq                                              |
|-----------|-----------------|----------------------------------------------------|
| `admin`   | `ArtHouse#2026` | direktor: narxlarni o'zgartirish, o'chirish        |
| `manager` | `Manager#2026`  | menejer: javob berish, holatlarni yangilash        |

Yangi parol xeshini olish:

```bash
node -e "const c=require('crypto');const u='admin',p='YANGI_PAROL';console.log(c.pbkdf2Sync(p,'arthouse.v3:'+u,150000,32,'sha256').toString('hex'))"
```

Olingan qiymatni `js/config.js` → `ADMINS.admin.hash` ga yozing. Server ham loginlarni shu fayldan o'qiydi.

## Kontentni tahrirlash

Hammasi `js/config.js` faylida: telefonlar, Telegram, Instagram, loyihalar, faktlar, qulayliklar, rejalar, taqdimot havolalari (`presentation`).
Ko'kcha va Obod Maskan uchun rasm va rejalarni `assets/img/...` papkasiga qo'yib, `cover`, `gallery` va `plans` maydonlariga yozing.

> ⚠️ `TEKSHIRING` deb belgilangan ma'lumotlar (manzillar, qavatlar soni, xonadonlar soni, tashkil topgan yil, koordinatalar) ochiq manbalar va @arthouse.tashkent postlaridan olingan. E'lon qilishdan oldin ularni rasmiy ma'lumot bilan solishtiring.

## Bitta faylli versiya

`dist/index.html` va `dist/kabinet.html` — hamma narsa (CSS, JS, rasmlar, video) ichiga joylangan nusxalar. Ikkala faylni bitta papkada saqlang va brauzerda oching.
Kodni o'zgartirgandan keyin qayta yig'ish: `python3 tools/build-single.py`
