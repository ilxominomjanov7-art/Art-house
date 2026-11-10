/* ===================================================================
   ART HOUSE — KABINET: «TELEGRAM» (saytdagi «Telegram kanalimizga obuna bo'ling» bloki)
   Telefon ichidagi kanal postlari: video yoki rasm, matn (8 tilda), vaqt; qo'shish, tahrirlash,
   tartiblash, yashirish, o'chirish, «Asliga qaytarish». Saqlash: 'ah_cms'.tg.posts (standart — js/tg-posts.js).
   =================================================================== */
(function(){
const K=window.AHK;if(!K)return;
const {CMS,cmsSave,cmCan,own,refURL,cmUp,askDel,esc,I,ICN,TX,NG}=K;
const $=id=>document.getElementById(id);
const L8=['uz','ru','en','fr','it','es','de','tr'],LN={uz:"O'zbekcha",ru:'Русский',en:'English',fr:'Français',it:'Italiano',es:'Español',de:'Deutsch',tr:'Türkçe'};
const can=()=>own()||cmCan('cms');
const clone=o=>JSON.parse(JSON.stringify(o));
const DEF=()=>clone(window.AH_TG_POSTS||[]);
Object.assign(ICN,{tg:ICN.tg||'<path d="M21.5 4.5 2.8 11.8c-.9.4-.9 1.6 0 1.9l4.7 1.6 1.8 5.6c.2.7 1.1.9 1.6.4l2.7-2.5 4.8 3.5c.6.4 1.4.1 1.6-.6l3.2-15.2c.2-1-.8-1.8-1.7-1.5z"/><path d="m7.5 15.3 10-7.3-7.5 8.6"/>'});

function PS(){const t=(CMS().tg||{}).posts,D=DEF();return Array.isArray(t)?clone(t).map(p=>{const d=D.find(x=>x.id===p.id)||{};if(!p.img&&!p.video){p.img=d.img||'';p.video=d.video||''}if(p.video&&!p.poster&&p.video===d.video)p.poster=d.poster||'';return p}):D}
function put(L,act,det){L=L.map(p=>{const d=DEF().find(x=>x.id===p.id);if(d){['img','video','poster'].forEach(k=>{if(p[k]&&p[k]===d[k])p[k]=''})}return p}); /* standart media saqlanmaydi — sayt o'zining nusxasini ishlatadi */const c=CMS();c.tg=Object.assign({},c.tg||{},{posts:L});return cmsSave(c,act,det||'')}
const txt=(p,l)=>{const t=p.t||{};return t[l]||t.uz||''};
const media=p=>p.video?{v:p.video,poster:p.poster||p.img}:{img:p.img};

const G=NG.find(g=>g[0]==='Sayt');const ITEM=['TG','tg','Telegram',()=>cmCan('cms')];
if(G)G[1].push(ITEM);else NG.splice(Math.max(0,NG.length-1),0,['Sayt',[ITEM]]);
K.addView('TG',()=>vT());

function vT(){const mn=$('mn');if(!can()){mn.innerHTML='<h2>Telegram</h2><div class="card">'+TX("Bu bo'lim uchun ruxsat yo'q.")+'</div>';return}
 const L=PS(),lg=L8.includes(LANG)?LANG:'uz';
 const card=(p,i)=>{const m=media(p),off=p.on===false;return '<div class="st-card'+(off?' off':'')+'"><div class="st-ph">'+(m.v?'<video data-tref="'+esc(m.v)+'" muted playsinline'+(m.poster?' data-tpos="'+esc(m.poster)+'"':'')+'></video>':'<img data-tref="'+esc(m.img||'')+'" alt="">')+(m.v?'<span>VIDEO</span>':'')+'</div>'+
  '<div class="st-in"><small class="nt9 tgk-tx">'+esc(txt(p,lg)).slice(0,160)+'</small><em>'+I('clock')+esc(p.time||'—')+'</em>'+(off?'<span class="st-hid">'+I('eyeoff')+TX('Saytda yashirilgan')+'</span>':'')+'</div>'+
  '<div class="st-act"><button type="button" class="te-ib" data-tup="'+i+'"'+(i?'':' disabled')+' aria-label="'+TX('Yuqoriga')+'">'+I('up')+'</button><button type="button" class="te-ib" data-tdn="'+i+'"'+(i<L.length-1?'':' disabled')+' aria-label="'+TX('Pastga')+'">'+I('down')+'</button>'+
  '<button type="button" class="te-ib" data-teye="'+i+'" aria-label="'+TX(off?"Saytda ko'rsatish":'Saytda yashirish')+'">'+I(off?'eyeoff':'eye')+'</button>'+
  '<button type="button" class="btn ghost sm" data-ted="'+i+'">'+I('edit')+TX('Tahrirlash')+'</button><button type="button" class="te-ib dl" data-tdel="'+i+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div></div>'};
 mn.innerHTML='<div class="hh"><div><h2>'+I('tg')+'Telegram</h2><p class="lead">'+TX("Saytdagi «Telegram kanalimizga obuna bo'ling» bloki: telefon ichidagi kanal postlari. Mijoz ularni yonga surib ko'radi; video tugasa — keyingi post.")+'</p></div>'+
  '<div class="qa"><a class="btn ghost sm" href="'+esc(CFG.TELEGRAM_CHANNEL||'https://t.me/arthouse_toshkent')+'" target="_blank" rel="noopener">'+I('tg')+'@arthouse_toshkent</a><button type="button" class="btn ghost sm" data-treset>'+I('undo')+TX('Asliga qaytarish')+'</button></div></div>'+
  '<div class="card"><div class="tt-h"><div><h3>'+TX('Postlar')+'</h3><p class="note">'+TX("Saytda shu tartibda ko'rinadi. Kanal havolasi: Sozlamalar → Aloqa → Telegram kanal havolasi.")+'</p></div><button type="button" class="btn gold sm" data-tadd>'+I('plus')+TX("Post qo'shish")+'</button></div>'+
  (L.length?'<div class="st-grid">'+L.map(card).join('')+'</div>':'<p class="note tt-empty">'+TX("Hozircha bo'sh. «Qo'shish» tugmasini bosing.")+'</p>')+'</div>';
 mn.querySelectorAll('[data-tref]').forEach(el=>{const r=el.dataset.tref;if(!r){el.classList.add('cm-noimg');return}refURL(r).then(u=>{if(u)el.src=u;else el.classList.add('cm-noimg')});if(el.dataset.tpos)refURL(el.dataset.tpos).then(u=>{if(u)el.poster=u})});
 mn.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset,L2=PS();
  if(d.treset!=null){askDel(TX('Postlar asl holiga qaytarilsinmi?'),esc(TX("Kabinetdagi Telegram o'zgarishlari o'chadi.")),()=>{const c=CMS();if(c.tg)delete c.tg.posts;cmsSave(c,'Telegram postlari asliga qaytarildi','');vT()});return}
  if(d.tadd!=null){edit(-1);return}
  if(d.ted!=null){edit(+d.ted);return}
  if(d.tup!=null||d.tdn!=null){const i=+(d.tup!=null?d.tup:d.tdn),j=d.tup!=null?i-1:i+1;if(j<0||j>=L2.length)return;[L2[i],L2[j]]=[L2[j],L2[i]];put(L2,'Telegram postlari tartibi o\'zgartirildi','');vT();return}
  if(d.teye!=null){const p=L2[+d.teye];p.on=p.on===false;put(L2,p.on?"Telegram posti ko'rsatildi":'Telegram posti yashirildi','');vT();return}
  if(d.tdel!=null){askDel("Bu narsa o'chirilsinmi?",esc(txt(L2[+d.tdel],'uz').slice(0,80)),()=>{const L3=PS();L3.splice(+d.tdel,1);put(L3,"Telegram posti o'chirildi",'');vT()});return}}}

function edit(idx){const isNew=idx<0,L=PS();
 const p=isNew?{id:'tg'+Date.now().toString(36),on:true,img:'',video:'',poster:'',time:new Date().toTimeString().slice(0,5),t:{}}:clone(L[idx]);p.t=p.t||{};
 let l=L8.includes(LANG)?LANG:'uz';
 const dl=document.createElement('div');dl.className='dlg st-dlg';dl.setAttribute('role','dialog');dl.setAttribute('aria-modal','true');
 const draw=()=>{dl.innerHTML='<form class="st-box" novalidate><div class="tt-h"><h3>'+TX(isNew?"Post qo'shish":'Postni tahrirlash')+'</h3><button type="button" class="te-ib" data-x aria-label="'+TX('Yopish')+'">'+I('x')+'</button></div>'+
   '<div class="st-fph"><div class="st-ph">'+(p.video?'<video id="tgV" muted playsinline autoplay loop></video>':'<img id="tgI" alt="">')+'</div><div class="st-fbtn"><button type="button" class="btn gold sm" data-up="image">'+I('image')+TX('Rasm yuklash')+'</button><button type="button" class="btn ghost sm" data-up="video">'+I('video')+TX('Video yuklash')+'</button>'+
   (p.video?'<button type="button" class="btn ghost sm" data-novid>'+I('x')+TX('Videoni olib tashlash')+'</button>':'')+'<small class="note">'+TX("Tik (9:16) yoki kvadrat. Video qisqa bo'lsin (10–30 soniya, 25 MB gacha); rasm videoning muqovasi bo'ladi.")+'</small></div></div>'+
   '<label class="cm-f"><b>'+TX('Vaqt')+'</b><input name="time" value="'+esc(p.time||'')+'" maxlength="5" placeholder="09:10"></label>'+
   '<div class="st-tabs" role="tablist">'+L8.map(x=>'<button type="button" role="tab" data-tl="'+x+'" aria-selected="'+(x===l)+'" title="'+LN[x]+'">'+x.toUpperCase()+(p.t[x]?'<i></i>':'')+'</button>').join('')+'</div>'+
   '<label class="cm-f"><b><span>'+TX('Post matni')+'</span> <i class="st-lg">'+l.toUpperCase()+'</i></b><textarea class="nt9" data-tx rows="6" maxlength="900" placeholder="'+esc(l==='uz'?'':p.t.uz||'')+'">'+esc(p.t[l]||'')+'</textarea></label>'+
   '<p class="note">'+TX("To'ldirilmagan tillarda o'zbekcha matn ko'rinadi.")+'</p><p class="note st-err" hidden></p>'+
   '<div class="xa"><button type="submit" class="btn gold">'+I('check')+TX('Saqlash')+'</button><button type="button" class="btn ghost" data-x>'+TX('Bekor qilish')+'</button></div></form>';
  const v=dl.querySelector('#tgV'),im=dl.querySelector('#tgI');
  if(v){refURL(p.video).then(u=>{if(u)v.src=u});if(p.poster||p.img)refURL(p.poster||p.img).then(u=>{if(u)v.poster=u})}
  if(im){if(p.img)refURL(p.img).then(u=>{if(u)im.src=u;else im.classList.add('cm-noimg')});else im.classList.add('cm-noimg')}};
 const keep=()=>{const f=dl.querySelector('form');if(!f)return;const x=f.querySelector('[data-tx]').value.trim();if(x)p.t[l]=x;else delete p.t[l];p.time=f.time.value.trim()};
 const close=()=>{dl.remove();document.removeEventListener('keydown',k1)},k1=e=>{if(e.key==='Escape')close()};
 draw();document.body.appendChild(dl);document.addEventListener('keydown',k1);
 dl.addEventListener('click',async e=>{if(e.target===dl){close();return}const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.x!=null){close();return}
  if(d.tl){keep();l=d.tl;draw();return}
  if(d.up){keep();const r=await cmUp(d.up);if(r[0]){if(d.up==='video'){p.video=r[0];p.poster=''}else{p.img=r[0];if(p.video)p.poster=r[0]}draw()}return}
  if(d.novid!=null){keep();p.video='';p.poster='';draw();return}});
 dl.addEventListener('submit',e=>{e.preventDefault();keep();const er=dl.querySelector('.st-err');
  if(!p.img&&!p.video&&!p.t.uz){er.hidden=false;er.textContent=TX("Rasm, video yoki o'zbekcha matn kiriting.");return}
  const L2=PS();if(isNew)L2.push(p);else L2[idx]=p;
  if(put(L2,isNew?"Telegram posti qo'shildi":"Telegram posti o'zgartirildi",(p.t.uz||'').slice(0,40))){close();vT()}});
}
if(K.tok()&&K.VW()==='TG')K.nav();
})();
