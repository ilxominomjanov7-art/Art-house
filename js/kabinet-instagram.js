/* ===================================================================
   ART HOUSE — KABINET: «INSTAGRAM» (saytdagi Instagram bo'limi)
   • Videolar: telefon ichida shu tartibda, yon tomonga surib almashtiriladi; har biriga Instagram havolasi (video bosilsa
     o'sha reel ochiladi), muallif yozuvi va gapirilgan matn — subtitrlar, saytdagi har bir tilda.
   • Subtitrlar tahrirlagichi: vaqt (soniya), matn — tillar bo'yicha; videoni ko'rib vaqtni qo'yish.
   • Yetishmayotgan tillar — «AI bilan tarjima» (js/kabinet-translate.js, server kerak).
   • Telefon yonidagi ikki rasm.
   Saqlash: 'ah_cms'.ig = { reels: [{ id, src, poster, url, by, cap: [{ s, e, t: { uz, ru, … } }] }], imgs: [a, b] }
   Standart videolar (js/ig-reels.js) faqat id va matn bilan saqlanadi — sayt video faylini id bo'yicha oladi.
   =================================================================== */
(function(){
const K=window.AHK,TH=window.AH_THEMES;if(!K)return;
const {CMS,cmsSave,cmCan,own,refURL,cmUp,askDel,kToast,esc,I,ICN,TX,NG,LANGS_ON}=K;
const $=id=>document.getElementById(id);
const can=()=>own()||cmCan('cms');
const clone=o=>JSON.parse(JSON.stringify(o));
const DEF=()=>window.AH_IG_REELS||[];
const PEEK0=['assets/img/musaffo/majmua-kechki.webp','assets/img/musaffo/mehmonxona.webp'];
const LN={uz:"O'zbekcha",ru:'Русский',en:'English',fr:'Français',it:'Italiano',es:'Español',de:'Deutsch',tr:'Türkçe'};
const langs=()=>LANGS_ON().filter(l=>l!=='cy');
const lname=l=>LN[l]||((CMS().langs.added||[]).find(x=>x.code===l)||{}).label||l.toUpperCase();
const fmt=s=>{s=Math.max(0,+s||0);return Math.floor(s/60)+':'+(s%60).toFixed(1).padStart(4,'0')};
Object.assign(ICN,{play2:ICN.play2||'<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',cc:'<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 15h4"/><path d="M15 15h2"/><path d="M7 11h2"/><path d="M13 11h4"/>',
 clock:ICN.clock||'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'});

/* ---------- ma'lumot ---------- */
const full=r=>{const d=DEF().find(x=>x.id&&x.id===r.id)||{};return Object.assign({},d,r,{src:r.src||d.src||'',poster:r.poster||d.poster||''})};
function IG(){const c=CMS(),g=c.ig||{};return{reels:Array.isArray(g.reels)?clone(g.reels):DEF().map(r=>Object.assign(clone(r),{src:'',poster:''})),imgs:Array.isArray(g.imgs)?g.imgs.slice(0,2):[]}}
function put(g,act,det){const c=CMS();c.ig=Object.assign({},c.ig||{},{reels:g.reels.map(r=>{const d=DEF().find(x=>x.id&&x.id===r.id);r=clone(r);if(d){if(r.src===d.src)r.src='';if(r.poster===d.poster)r.poster=''}return r}),imgs:g.imgs});return cmsSave(c,act,det||'Instagram')}
const missing=r=>{const L=langs();return L.filter(l=>(r.cap||[]).some(cu=>!(cu.t||{})[l]))};

/* ---------- menyu: Sayt → Instagram ---------- */
const G=NG.find(g=>g[0]==='Sayt');const ITEM=['G2','ig','Instagram',()=>cmCan('cms')];
if(G)G[1].push(ITEM);else NG.splice(Math.max(0,NG.length-1),0,['Sayt',[ITEM]]);
K.addView('G2',()=>vI());

function vI(){const mn=$('mn');if(!can()){mn.innerHTML='<h2>Instagram</h2><div class="card">'+TX("Bu bo'lim uchun ruxsat yo'q.")+'</div>';return}
 const g=IG(),L=langs();
 const row=(r0,i,n)=>{const r=full(r0),miss=missing(r),cnt=(r.cap||[]).length;
  return '<div class="ig-row"><div class="ig-thumb"><video muted playsinline preload="metadata" data-rref="'+esc(r.src)+'"'+(r.poster?' data-pref="'+esc(r.poster)+'"':'')+'></video><span>'+(i+1)+'</span></div>'+
   '<div class="ig-f"><label class="cm-f"><b>Instagram havolasi (video bosilganda ochiladi)</b><input class="nt9" data-iurl="'+i+'" value="'+esc(r.url||'')+'" placeholder="https://www.instagram.com/reel/…"></label>'+
   '<label class="cm-f"><b>Muallif yozuvi (telefon ostida)</b><input class="nt9" data-iby="'+i+'" value="'+esc(r.by||'')+'" placeholder="@arthouse.tashkent" maxlength="60"></label>'+
   '<p class="note ig-st">'+I('cc')+'<span>'+(cnt?cnt+' '+TX('ta gap')+' · ':'')+'</span>'+(cnt?(miss.length?'<em class="ig-miss">'+TX('Tarjima yo\'q')+': '+miss.map(l=>l.toUpperCase()).join(', ')+'</em>':'<em class="ig-ok">'+TX('Barcha tillarda')+'</em>'):'<em class="ig-miss">'+TX("Gaplar (subtitr) hali yozilmagan")+'</em>')+'</p></div>'+
   '<div class="st-act"><button type="button" class="te-ib" data-iup="'+i+'"'+(i?'':' disabled')+' aria-label="'+TX('Yuqoriga')+'">'+I('up')+'</button><button type="button" class="te-ib" data-idn="'+i+'"'+(i<n-1?'':' disabled')+' aria-label="'+TX('Pastga')+'">'+I('down')+'</button>'+
   '<button type="button" class="btn gold sm" data-icap="'+i+'">'+I('cc')+'Gaplar va tarjima</button><button type="button" class="te-ib dl" data-idel="'+i+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div></div>'};
 const anyMiss=g.reels.some(r=>missing(full(r)).length);
 mn.innerHTML='<div class="hh"><div><h2>Instagram</h2><p class="lead">Saytdagi Instagram bo\'limi: telefon ichidagi Reels videolari, ularning havolalari va gapirilgan matnlari — saytdagi barcha tillarda. Telefon yonidagi rasmlar ham shu yerda.</p></div><a class="btn ghost sm" href="index.html" target="_blank" rel="noopener">'+I('globe')+'Saytni ochish</a></div>'+
  '<div class="card"><div class="tt-h"><div><h3>Videolar</h3><p class="note">Telefonda shu tartibda almashadi: mijoz videoni barmog\'i bilan yon tomonga suradi (ekranda tugma yoki belgi yo\'q). Ovoz saytda birinchi bosishdan keyin yoqiladi (brauzer qoidasi). Tavsiya: vertikal 9:16, 90 soniyagacha.</p></div><button type="button" class="btn gold sm" data-iadd>'+I('upload')+'Video qo\'shish</button></div>'+
  (g.reels.length?'<div class="ig-list">'+g.reels.map((r,i)=>row(r,i,g.reels.length)).join('')+'</div>':'<p class="note tt-empty">'+TX("Video yo'q — saytda telefon ko'rinmaydi, faqat Instagram havolasi qoladi.")+'</p>')+
  '<div class="xa"><button type="button" class="btn ghost sm" data-isave>'+I('check')+'Havola va yozuvlarni saqlash</button>'+(anyMiss?'<button type="button" class="btn ghost sm" data-iai>'+I('sparkle')+'Yetishmayotgan tarjimalarni AI bilan to\'ldirish</button>':'')+'</div></div>'+
  '<div class="card"><div class="tt-h"><div><h3>Telefon yonidagi rasmlar</h3><p class="note">Telefon ortida qiyshaygan holda suzib turadigan ikki rasm (loyiha, interyer).</p></div></div><div class="ig-peeks">'+[0,1].map(i=>'<div class="ig-peek"><img data-sref="'+esc(g.imgs[i]||PEEK0[i])+'" alt=""><div class="xa"><button type="button" class="btn ghost sm" data-ipk="'+i+'">'+I('upload')+'Almashtirish</button>'+(g.imgs[i]?'<button type="button" class="te-ib" data-ipr="'+i+'" aria-label="'+TX('Asl rasm')+'">'+I('undo')+'</button>':'')+'</div></div>').join('')+'</div></div>';
 mn.querySelectorAll('video[data-rref]').forEach(el=>{refURL(el.dataset.rref).then(u=>{if(u)el.src=u+'#t=1'});if(el.dataset.pref)refURL(el.dataset.pref).then(u=>{if(u)el.poster=u})});
 mn.querySelectorAll('img[data-sref]').forEach(el=>{refURL(el.dataset.sref).then(u=>{if(u)el.src=u});el.addEventListener('error',()=>el.classList.add('cm-noimg'),{once:true})});
 const keepRows=()=>{const g2=IG();mn.querySelectorAll('[data-iurl]').forEach(x=>{const r=g2.reels[+x.dataset.iurl];if(r)r.url=x.value.trim()});mn.querySelectorAll('[data-iby]').forEach(x=>{const r=g2.reels[+x.dataset.iby];if(r)r.by=x.value.trim()});return g2};
 mn.onchange=null;
 mn.onclick=async e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.isave!=null){const g2=keepRows();if(g2.reels.some(r=>r.url&&!/^https:\/\/(www\.)?instagram\.com\//.test(r.url))){kToast(TX("Havola https://www.instagram.com/… bilan boshlansin."));return}put(g2,'Instagram havolalari saqlandi');vI();return}
  if(d.iadd!=null){const refs=await cmUp('video',true);if(!refs.length)return;const g2=keepRows();refs.forEach(x=>g2.reels.push({id:'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),src:x,poster:'',url:'',by:'',cap:[]}));put(g2,"Instagram'ga video qo'shildi");vI();kToast(TX("Video qo'shildi. «Gaplar va tarjima» orqali gapirilgan matnni yozing."));return}
  if(d.iup!=null||d.idn!=null){const g2=keepRows(),i=+(d.iup!=null?d.iup:d.idn),j=d.iup!=null?i-1:i+1;if(j<0||j>=g2.reels.length)return;[g2.reels[i],g2.reels[j]]=[g2.reels[j],g2.reels[i]];put(g2,"Instagram videolari tartibi o'zgartirildi");vI();return}
  if(d.idel!=null){askDel("Bu narsa o'chirilsinmi?",'Instagram · video '+(+d.idel+1),()=>{const g2=keepRows();g2.reels.splice(+d.idel,1);put(g2,"Instagram'dan video o'chirildi");vI()});return}
  if(d.icap!=null){put(keepRows(),'Instagram havolalari saqlandi');capEd(+d.icap);return}
  if(d.iai!=null){if(K.autoTr&&await K.autoTr(langs(),{parts:['ig']}))vI();return}
  if(d.ipk!=null){const r=await cmUp('image');if(!r[0])return;const g2=keepRows();g2.imgs[+d.ipk]=r[0];put(g2,'Instagram rasmi almashtirildi');vI();return}
  if(d.ipr!=null){const g2=keepRows();g2.imgs[+d.ipr]='';put(g2,'Instagram rasmi asliga qaytarildi');vI();return}}}

/* ---------- gaplar (subtitr) tahrirlagichi ---------- */
function capEd(idx){const g=IG(),r=full(g.reels[idx]);if(!r)return;let L=langs(),l=L.includes(LANG)&&LANG!=='cy'?LANG:'uz',cap=clone(r.cap||[]);
 const m=document.createElement('div');m.className='dlg st-dlg ig-dlg';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="st-box ig-box"><div class="tt-h"><h3>'+TX('Gaplar va tarjima')+' · '+(idx+1)+'</h3><button type="button" class="te-ib" data-cx aria-label="'+TX('Yopish')+'">'+I('x')+'</button></div>'+
  '<div class="ig-ed"><div class="ig-vid"><video controls playsinline preload="metadata"></video><p class="note">'+TX("Videoni to'xtatib, «⏱» bilan gap boshlanish vaqtini qo'ying.")+'</p></div><div class="ig-capw"><div class="st-tabs" role="tablist"></div><div class="ig-caps"></div>'+
  '<div class="xa"><button type="button" class="btn ghost sm" data-cadd>'+I('plus')+'Gap qo\'shish</button>'+(K.autoTr?'<button type="button" class="btn ghost sm" data-cai>'+I('sparkle')+'Boshqa tillarga AI bilan tarjima</button>':'')+'</div>'+
  '<p class="note">'+TX("Asosiy til — o'zbekcha. To'ldirilmagan tilda sayt inglizcha, u ham bo'lmasa o'zbekcha matnni ko'rsatadi.")+'</p></div></div>'+
  '<div class="xa"><button type="button" class="btn gold" data-csave>'+I('check')+'Saqlash</button><button type="button" class="btn ghost" data-cx>Bekor qilish</button></div></div>';
 document.body.appendChild(m);const v=m.querySelector('video');refURL(r.src).then(u=>{if(u)v.src=u});if(r.poster)refURL(r.poster).then(u=>{if(u)v.poster=u});
 const keep=()=>m.querySelectorAll('.ig-cap').forEach(row=>{const c=cap[+row.dataset.i];if(!c)return;c.s=Math.max(0,+row.querySelector('[data-cs]').value||0);c.e=Math.max(c.s+.3,+row.querySelector('[data-ce]').value||c.s+3);c.t=c.t||{};const x=row.querySelector('[data-ct]').value.trim();if(x)c.t[l]=x;else delete c.t[l]});
 const draw=()=>{cap.sort((a,b)=>a.s-b.s);
  m.querySelector('.st-tabs').innerHTML=L.map(x=>'<button type="button" role="tab" data-cl="'+x+'" aria-selected="'+(x===l)+'" title="'+esc(lname(x))+'">'+x.toUpperCase()+(cap.length&&cap.every(c=>(c.t||{})[x])?'<i></i>':'')+'</button>').join('');
  m.querySelector('.ig-caps').innerHTML=cap.length?cap.map((c,i)=>'<div class="ig-cap" data-i="'+i+'"><div class="ig-tm"><button type="button" class="te-ib" data-cgo="'+i+'" aria-label="▶">'+I('play2')+'</button><input class="nt9" type="number" step="0.1" min="0" data-cs value="'+(+c.s).toFixed(1)+'" aria-label="'+TX('Boshlanishi (soniya)')+'"><span>–</span><input class="nt9" type="number" step="0.1" min="0" data-ce value="'+(+c.e).toFixed(1)+'" aria-label="'+TX('Tugashi (soniya)')+'"><button type="button" class="te-ib" data-cnow="'+i+'" aria-label="⏱">'+I('clock')+'</button><button type="button" class="te-ib dl" data-cdel="'+i+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div>'+
   '<textarea class="nt9" rows="2" data-ct placeholder="'+esc(l==='uz'?TX('Gapirilgan matn…'):((c.t||{}).uz||''))+'">'+esc((c.t||{})[l]||'')+'</textarea></div>').join(''):'<p class="note tt-empty">'+TX("Hali gap yo'q. Videoni qo'yib, «Gap qo'shish» bilan matnni yozing.")+'</p>'};
 draw();
 const close=()=>{m.remove();document.removeEventListener('keydown',k1)},k1=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',k1);
 const save=()=>{keep();const g2=IG(),r2=g2.reels[idx];if(!r2)return false;r2.cap=cap.filter(c=>Object.keys(c.t||{}).length).map(c=>({s:+(+c.s).toFixed(2),e:+(+c.e).toFixed(2),t:c.t}));return put(g2,"Instagram videosi gaplari saqlandi",'video '+(idx+1))};
 m.addEventListener('click',async e=>{if(e.target===m){close();return}const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.cx!=null){close();return}
  if(d.cl){keep();l=d.cl;draw();return}
  if(d.cadd!=null){keep();const last=cap.length?Math.max.apply(null,cap.map(c=>+c.e)):0,s=v.currentTime&&!v.paused?v.currentTime:Math.max(v.currentTime||0,last);cap.push({s:+s.toFixed(1),e:+(s+3).toFixed(1),t:{}});draw();const ta=m.querySelectorAll('.ig-cap textarea');ta.length&&ta[ta.length-1].focus();return}
  if(d.cgo!=null){keep();v.currentTime=+cap[+d.cgo].s;v.play().catch(()=>{});return}
  if(d.cnow!=null){keep();cap[+d.cnow].s=+v.currentTime.toFixed(1);if(cap[+d.cnow].e<=cap[+d.cnow].s)cap[+d.cnow].e=+(v.currentTime+3).toFixed(1);draw();return}
  if(d.cdel!=null){keep();cap.splice(+d.cdel,1);draw();return}
  if(d.cai!=null){if(!save())return;if(await K.autoTr(langs(),{parts:['ig']})){cap=clone(full(IG().reels[idx]).cap||[]);draw()}return}
  if(d.csave!=null){if(save()){close();vI()}return}});
}

if(K.tok()&&K.VW()==='G2')K.nav();
})();
