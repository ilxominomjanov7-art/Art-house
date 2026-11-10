/* ===================================================================
   ART HOUSE — KABINET: «SAYTGA CHIQARISH»
   Muammo: kabinet o'zgarishlari brauzer xotirasiga (localStorage 'ah_cms') yoziladi. Sayt boshqa
   telefonda, boshqa brauzerda yoki boshqa manzildan ochilsa (masalan, telefon «Yuklanmalar»idan:
   content://…), u bu xotirani KO'RMAYDI — shuning uchun kabinetda almashgan rasm saytda eskicha qolardi.
   Yechim (serversiz ham ishlaydi):
     1) «index.html ni tanlash» — hozirgi sayt fayli tanlanadi;
     2) kabinet barcha o'zgarishlarni (yuklangan rasm va videolar bilan) shu fayl ichiga joylaydi
        (script#ahBaked: window.AH_BAKED=…) va yangi index.html ni yuklab beradi;
     3) shu faylni hostingga qo'yasiz yoki mijozlarga yuborasiz — hamma yangi ko'rinishni ko'radi.
   Server ulangan bo'lsa (API_URL) — «Serverga nashr qilish» hammaga darhol tarqatadi.
   Saqlanmagan (saytga chiqarilmagan) o'zgarishlar bo'lsa — pastda oltin tugma eslatib turadi.
   =================================================================== */
(function(){
const K=window.AHK;if(!K)return;
const {CMS,own,cmCan,askDel,kToast,esc,I,ICN,TX,API,hd}=K;
const can=()=>own()||cmCan('cms');
const LSG=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},LSS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
Object.assign(ICN,{rocket:ICN.rocket||'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
 upload:ICN.upload||'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
 x:ICN.x||'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'});

/* kabinetda yuklangan fayllar ('idb:…') — saytga data: ko'rinishida joylanadi */
async function packed(){const c=CMS(),s=JSON.stringify(c),refs=[...new Set(s.match(/idb:[a-z0-9]+/g)||[])];let o=s,skip=0;
 for(const r of refs){try{const u=await Store.mediaURL(r);if(!u)continue;const b=await(await fetch(u)).blob();if(b.size>25e6){skip++;continue}
  const d=await new Promise(res=>{const f=new FileReader();f.onload=()=>res(f.result);f.readAsDataURL(b)});o=o.split(r).join(d)}catch(e){}}
 if(skip)kToast(TX("Juda katta video havola bilan qo'yilishi kerak."));return{json:o,v:c.v||0}}
/* index.html ichiga joylash: eski #ahBaked almashtiriladi, bo'lmasa <head> boshiga qo'shiladi */
/* DIQQAT: bu faylda "<"+"script" va "<"+"!--" yozuvlari bo'linib yozilgan — bitta faylli kabinetda (dist) HTML tahlilchisi chalkashmasligi uchun */
const LT='<',SO=LT+'script id="ahBaked">',SC=LT+'/script>';
/* eski sayt fayllari (AH_BAKED ni o'qimaydigan) uchun: ma'lumot sayt kodidan oldin brauzer xotirasiga yoziladi */
const SHIM="try{var B=window.AH_BAKED,C=JSON.parse(localStorage.getItem('ah_cms')||'null');if(B&&B.v&&!(C&&C.v>=B.v))localStorage.setItem('ah_cms',JSON.stringify(B))}catch(e){}";
function bake(html,json){const tag=SO+'window.AH_BAKED='+json.replace(new RegExp(LT+'/(script)','gi'),LT+'\\/$1').replace(new RegExp(LT+'!--','g'),LT+'\\!--')+';'+SHIM+SC;
 const re=new RegExp(SO+'[\\s\\S]*?'+LT+'\\/script>');
 if(re.test(html))return html.replace(re,()=>tag);
 const h=html.match(/<head[^>]*>/i);if(!h)throw new Error('head');return html.replace(h[0],()=>h[0]+'\n'+tag)}
function dl(name,text,type){const b=new Blob([text],{type:type||'text/html'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
const pick=accept=>new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept=accept;i.onchange=()=>res(i.files[0]||null);i.click()});
const dirty=()=>{const c=LSG('ah_cms')||{};return !!c.v&&(+LSG('ah_pub_v')||0)<c.v};
const done=v=>{LSS('ah_pub_v',v);pill()};

function dlg(){if(!can()){kToast(TX("Bu bo'lim uchun ruxsat yo'q."));return}
 const m=document.createElement('div');m.className='dlg pub-dlg';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="pub-box"><div class="tt-h"><h3>'+I('rocket')+TX('Saytga chiqarish')+'</h3><button type="button" class="te-ib" data-px aria-label="'+TX('Yopish')+'">'+I('x')+'</button></div>'+
  '<p class="note">'+esc(TX("Kabinetdagi o'zgarishlar faqat shu brauzerda saqlanadi. Mijozlar ko'rishi uchun ularni sayt fayliga joylash kerak."))+'</p>'+
  '<ol class="pub-ol"><li>'+esc(TX("«index.html ni tanlash» tugmasini bosing va hozirgi sayt faylini (index.html) tanlang."))+'</li><li>'+esc(TX("Kabinet barcha o'zgarishlarni (rasm va videolar bilan) shu faylga joylaydi va yangi index.html ni yuklab beradi."))+'</li><li>'+esc(TX("Yangi faylni hostingga eskisining o'rniga qo'ying yoki mijozlarga yuboring — hamma yangi ko'rinishni ko'radi."))+'</li></ol>'+
  '<div class="xa"><button type="button" class="btn gold" data-pf>'+I('upload')+TX('index.html ni tanlash')+'</button>'+(API?'<button type="button" class="btn gold" data-ps>'+I('send')+TX('Serverga nashr qilish')+'</button>':'')+'<button type="button" class="btn ghost" data-pj>'+I('download')+'site-content.json</button></div>'+
  '<p class="note pub-o" aria-live="polite"></p></div>';
 document.body.appendChild(m);const out=m.querySelector('.pub-o'),close=()=>m.remove();
 m.addEventListener('click',async e=>{if(e.target===m){close();return}const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.px!=null){close();return}
  if(d.pf!=null){const f=await pick('.html,.htm,text/html');if(!f)return;out.textContent=TX('Tayyorlanmoqda…');
   try{const html=await f.text();if(!/AH_|ART HOUSE/.test(html)||/id="ab"/.test(html)){out.textContent=TX("Bu sayt fayli emas. Saytning index.html faylini tanlang.");return}
    const p=await packed(),res=bake(html,p.json);dl('index.html',res);done(p.v);
    out.innerHTML='<b>'+esc(TX('Tayyor!'))+'</b> '+esc(TX("Yangi index.html yuklab olindi")+' ('+(res.length/1048576).toFixed(1)+' MB). '+TX("Endi uni hostingga eskisining o'rniga qo'ying yoki mijozlarga yuboring."));
    K.cmAud&&K.cmAud('Saytga chiqarildi (index.html)','')}catch(x){out.textContent=TX("Faylni o'qib bo'lmadi.")}return}
  if(d.pj!=null){out.textContent=TX('Tayyorlanmoqda…');const p=await packed();dl('site-content.json',p.json,'application/json');done(p.v);out.textContent=TX("Tayyor. Faylni hostingga index.html yoniga joylang.");return}
  if(d.ps!=null){out.textContent=TX('Yuborilmoqda…');try{const p=await packed(),r=await fetch(API+'/api/cms',{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},hd()),body:p.json});if(!r.ok)throw r.status;done(p.v);out.textContent=TX('Serverga nashr qilindi')}catch(x){out.textContent=TX("Server qabul qilmadi.")+' ('+x+')'}}});
}

/* pastki oltin tugma: saytga chiqarilmagan o'zgarishlar bor */
let P=null;
function pill(){const on=K.tok()&&can()&&dirty()&&!API;if(!P){P=document.createElement('button');P.type='button';P.className='pub-pill';P.addEventListener('click',dlg);document.body.appendChild(P)}
 P.innerHTML=I('rocket')+'<span><b>'+esc(TX('Saytga chiqarish'))+'</b><small>'+esc(TX("O'zgarishlar hali saytda yo'q"))+'</small></span>';P.hidden=!on}
setInterval(pill,2500);addEventListener('ah-cms-saved',()=>setTimeout(pill,0));addEventListener('storage',e=>{if(e.key==='ah_cms'||e.key==='ah_pub_v')pill()});
K.publish=dlg;window.AH_PUBLISH=dlg;
})();
