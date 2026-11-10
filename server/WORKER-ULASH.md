# Worker v4 ni Cloudflare'ga ulash (10 daqiqa)

1. **Telegram tokenini yangilang** — eski token v3 kodida ochiq yozilgan edi.
   Telegram → @BotFather → `/revoke` → botni tanlang → yangi token oling.
2. **Kabinet parollarini yarating** (har bir xodim uchun, kamida 10 belgi):
   `node tools/admin-hash.js direktor 'KuchliParol#2026' owner`
   `node tools/admin-hash.js menejer1 'BoshqaParol!7' manager`
   Natijalarni bitta JSON qilib birlashtiring: `{"…":"owner","…":"manager"}`.
3. **Worker kodini almashtiring:** Cloudflare → Workers → arthouse-ai → Edit code → `server/worker.js` ni to'liq joylang → Deploy.
   (yoki kompyuterda: `npx wrangler deploy`)
4. **Settings → Variables and Secrets** (barchasi «Secret» turida):
   `BOT_TOKEN` (yangi), `CHAT_ID`, `ANTHROPIC_API_KEY`, `ADMINS` (2-qadamdagi JSON).
   Oddiy o'zgaruvchilar: `ALLOWED_ORIGIN` = sayt domeningiz (vergul bilan), `ALLOW_FILE` = `1`.
5. **Settings → Bindings:** KV `AH` → «art-house-data» (bor), Workers AI `AI` (ixtiyoriy).
6. **Tekshirish:** brauzerda `https://arthouse-ai.<sizning-subdomen>.workers.dev/health?test=1`
   — `telegram_test_sent: true`, `anthropic_works: true`, `allowed_origin: "set"` bo'lishi kerak.
7. **Saytni ulash:** `js/config.js` → `API_URL: 'https://arthouse-ai.<subdomen>.workers.dev'` → `python3 tools/build-single.py`.
8. **Kabinetni himoyalash (tavsiya):** Cloudflare Zero Trust → Access → Application → domeningiz `/kabinet.html` → faqat sizning e-pochtalaringiz.
