/* Telefon qismi uchun 1280x720 brend fon (Google shriftlari bilan) */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.setContent(`<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Inter:wght@500;600&display=swap" rel="stylesheet">
  <style>html,body{margin:0;width:1280px;height:720px;overflow:hidden}
  body{background:radial-gradient(900px 600px at 80% 10%,rgba(220,196,143,.14),transparent 60%),radial-gradient(700px 500px at 10% 100%,rgba(23,112,90,.35),transparent 65%),#052A20;font-family:Inter,sans-serif}
  .ph{position:absolute;left:142px;top:20px;width:323px;height:680px;border-radius:30px;background:#021a13;box-shadow:0 0 0 2px rgba(234,219,176,.35),0 40px 80px -30px rgba(0,0,0,.8)}
  .brand{position:absolute;left:520px;top:54px;display:flex;align-items:center;gap:16px;color:#EADBB0}
  .brand svg{width:46px;height:46px;fill:none;stroke:#DCC48F;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
  .brand b{display:block;font:600 26px/1 Cinzel,serif;letter-spacing:.24em}.brand small{display:block;margin-top:8px;font:600 12px/1 Inter;letter-spacing:.2em;text-transform:uppercase;color:#86A296}
  .line{position:absolute;left:520px;right:70px;top:128px;height:1px;background:linear-gradient(90deg,rgba(220,196,143,.6),transparent)}</style></head><body>
  <div class="ph"></div><div class="brand"><svg viewBox="0 0 100 100"><rect x="2.5" y="2.5" width="95" height="95" stroke-width="1.6"/><rect x="8" y="8" width="84" height="84"/><path d="M22 92V62q0-6 6-8M33 92V48q0-6 6-8M44 92V34q0-7 6-10 6 3 6 10v58M50 24V11M67 92V48q0-6-6-8M78 92V62q0-6-6-8"/></svg><span><b>ART HOUSE</b><small>CRM · Video</small></span></div><div class="line"></div></body></html>`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800); await p.screenshot({ path: require('path').join(__dirname, 'work', 'bg_phone.png') }); await b.close();
})();
