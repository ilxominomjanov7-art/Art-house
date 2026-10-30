/* ===================================================================
   ART HOUSE — KABINET: «YULDUZLAR» (saytdagi «Ular Art House'ni tanladi» bo'limi)
   • Taniqli insonlar kartalari: rasm, ism, rasm ustidagi belgi, kasbi, Instagram, ko'k tasdiq belgisi.
     Qo'shish, tahrirlash, tartiblash (↑ ↓), saytda yashirish, o'chirish. Matnlar 8 tilda.
   • Bo'lim sarlavhasi va tavsifi (8 til), bo'limni saytda yoqish/o'chirish (jonli mavzuda).
   • «Instagram oynasi»: saytdagi telefon ichida navbat bilan aylanadigan Reels videolari.
   Saqlash: 'ah_cms'.stars = { title, sub, list }, 'ah_cms'.ig = { reels } — sayt sahifani
   qayta yuklamasdan darhol yangilanadi (js/theme.js → js/lux-sections.js).
   Standart ro'yxat: js/config.js → CFG.AMBASSADORS (photo bo'sh bo'lsa — o'sha yerdagi rasm).
   =================================================================== */
(function(){
const K=window.AHK,TH=window.AH_THEMES;if(!K||!TH)return;
const {CMS,cmsSave,cmCan,own,refURL,cmUp,askDel,kToast,esc,I,ICN,TX,NG}=K;
const $=id=>document.getElementById(id);
const L8=TH.LANGS,LN={uz:"O'zbekcha",ru:'Русский',en:'English',fr:'Français',it:'Italiano',es:'Español',de:'Deutsch',tr:'Türkçe'};
const can=()=>own()||cmCan('cms');
const DEF=()=>(window.CFG&&CFG.AMBASSADORS)||[];
const REEL0=[{src:'assets/video/ig-reel-1.mp4',poster:'assets/video/ig-reel-1.jpg'}];
const clone=o=>JSON.parse(JSON.stringify(o));
const pk=(o,l)=>o==null?'':typeof o==='string'?o:(o[l||'uz']||o.uz||'');
const igName=h=>{const m=String(h||'').match(/instagram\.com\/([\w.]+)/);return(m?m[1]:String(h||'').trim().replace(/^@/,'').replace(/\/+$/,''))};
const photoOf=a=>a.photo||(DEF().find(d=>d.id&&d.id===a.id)||{}).photo||'';
Object.assign(ICN,{
 plus:ICN.plus||'<path d="M5 12h14"/><path d="M12 5v14"/>',alert:ICN.alert||'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
 up:ICN.up||'<path d="m18 15-6-6-6 6"/>',down:ICN.down||'<path d="m6 9 6 6 6-6"/>',
 eyeoff:ICN.eyeoff||'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
 ig:ICN.ig||'<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
 badge:'<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>'});

/* ---------- ma'lumot ---------- */
function ST(){const s=CMS().stars||{};return{title:clone(s.title||{}),sub:clone(s.sub||{}),list:Array.isArray(s.list)?clone(s.list):DEF().map(a=>Object.assign(clone(a),{photo:''}))}}
function put(st,act,det){const c=CMS();c.stars={title:st.title,sub:st.sub,list:st.list};return cmsSave(c,act,det||'')}
function REELS(){const r=(CMS().ig||{}).reels;return Array.isArray(r)?clone(r):clone(REEL0)}
function putReels(r,act){const c=CMS();c.ig=Object.assign({},c.ig||{},{reels:r});return cmsSave(c,act,'Instagram')}
/* bo'lim jonli mavzuda yoqilganmi (js/theme-schema.js → 'amb') */
function liveTh(c){c.themes=c.themes||{};const T=c.themes;T.list=Array.isArray(T.list)?T.list:[];
 if(!T.list.length){const th=TH.newTheme('Art House — Zumrad');th.id='main';T.list.push(th);T.live='main'}
 return T.list.find(x=>x.id===T.live)||T.list[0]}
const ambOn=()=>{const th=liveTh(CMS());return !(th.sec&&th.sec.amb&&th.sec.amb.on===false)};

/* ---------- menyu: Sayt → Yulduzlar ---------- */
const G=NG.find(g=>g[0]==='Sayt');const ITEM=['S','star','Yulduzlar',()=>cmCan('cms')];
if(G)G[1].push(ITEM);else NG.splice(Math.max(0,NG.length-1),0,['Sayt',[ITEM]]);
K.addView('S',()=>vS());

let LG='uz'; /* sarlavha tahririda tanlangan til */
function vS(){const mn=$('mn');if(!can()){mn.innerHTML='<h2>Yulduzlar</h2><div class="card">'+TX("Bu bo'lim uchun ruxsat yo'q.")+'</div>';return}
 const st=ST(),R=REELS();
 const tabs=(cur,attr)=>'<div class="st-tabs" role="tablist">'+L8.map(l=>'<button type="button" role="tab" '+attr+'="'+l+'" aria-selected="'+(l===cur)+'" title="'+LN[l]+'">'+l.toUpperCase()+'</button>').join('')+'</div>';
 const ph0=(l,k)=>{const t=window.I18N?I18N.t(k,null,l):'';return t&&t!==k?t:''};
 const head='<div class="card st-sec"><div class="tt-h"><div><h3>Bo\'lim</h3><p class="note">Sarlavha va tavsif har bir tilda alohida. Bo\'sh qoldirilsa — standart matn chiqadi.</p></div>'+
  '<label class="cm-sw1 st-on"><input type="checkbox" data-son'+(ambOn()?' checked':'')+'><i></i><span><b>Bo\'lim saytda ko\'rinadi</b></span></label></div>'+
  tabs(LG,'data-slg')+'<div class="st-f2"><label class="cm-f"><b>Sarlavha</b><input class="nt9" data-sh="title" value="'+esc(st.title[LG]||'')+'" placeholder="'+esc(ph0(LG,'amb.title'))+'"></label>'+
  '<label class="cm-f"><b>Tavsif</b><textarea class="nt9" rows="2" data-sh="sub" placeholder="'+esc(ph0(LG,'amb.sub'))+'">'+esc(st.sub[LG]||'')+'</textarea></label></div>'+
  '<div class="xa"><button type="button" class="btn gold sm" data-shs>'+I('check')+'Saqlash</button></div></div>';
 const card=(a,i,n)=>'<div class="st-card'+(a.on===false?' off':'')+'"><div class="st-ph"><img data-sref="'+esc(photoOf(a))+'" alt="">'+(pk(a.badge)?'<span>'+esc(pk(a.badge,LANG==='cy'?'uz':LANG))+'</span>':'')+'</div>'+
  '<div class="st-in"><b class="nt9">'+esc(a.name||'—')+(a.verified?'<i class="st-v">'+I('badge')+'</i>':'')+'</b><small class="nt9">'+esc(pk(a.role,LANG==='cy'?'uz':LANG))+'</small>'+(a.ig?'<em class="nt9">'+I('ig')+'@'+esc(igName(a.ig))+'</em>':'')+
  (a.on===false?'<span class="st-hid">'+I('eyeoff')+TX('Saytda yashirilgan')+'</span>':'')+'</div>'+
  '<div class="st-act"><button type="button" class="te-ib" data-sup="'+i+'" aria-label="'+TX('Yuqoriga')+'"'+(i?'':' disabled')+'>'+I('up')+'</button><button type="button" class="te-ib" data-sdn="'+i+'" aria-label="'+TX('Pastga')+'"'+(i<n-1?'':' disabled')+'>'+I('down')+'</button>'+
  '<button type="button" class="te-ib" data-seye="'+i+'" aria-label="'+TX(a.on===false?"Saytda ko'rsatish":'Saytda yashirish')+'">'+I(a.on===false?'eyeoff':'eye')+'</button>'+
  '<button type="button" class="btn ghost sm" data-sed="'+i+'">'+I('edit')+'Tahrirlash</button><button type="button" class="te-ib dl" data-sdel="'+i+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div></div>';
 const list='<div class="card"><div class="tt-h"><div><h3>Insonlar</h3><p class="note">Saytda shu tartibda ko\'rinadi. Kartani tahrirlang, ↑ ↓ bilan tartiblang yoki ko\'z belgisi bilan vaqtincha yashiring.</p></div><button type="button" class="btn gold sm" data-sadd>'+I('plus')+'Yulduz qo\'shish</button></div>'+
  (st.list.length?'<div class="st-grid">'+st.list.map((a,i)=>card(a,i,st.list.length)).join('')+'</div>':'<p class="note tt-empty">'+TX("Hozircha hech kim yo'q. «Yulduz qo'shish» tugmasini bosing.")+'</p>')+
  '<p class="note st-law">'+I('alert')+'<span>'+TX("Rasm va ismdan faqat insonning roziligi bilan foydalaning. Obunachilar soni saytda ko'rsatilmaydi.")+'</span></p></div>';
 const ig='<div class="card"><div class="tt-h"><div><h3>Instagram oynasi</h3><p class="note">Saytdagi telefon ichida navbat bilan aylanadigan Reels videolari. Tavsiya: vertikal 9:16, 60 soniyagacha. Telefon bosilsa — Instagram sahifangiz ochiladi.</p></div><button type="button" class="btn gold sm" data-radd>'+I('upload')+'Video qo\'shish</button></div>'+
  '<div class="st-reels">'+R.map((r,i)=>'<div class="st-reel"><video muted playsinline preload="metadata" data-rref="'+esc(r.src)+'"></video><div class="st-act"><button type="button" class="te-ib" data-rup="'+i+'"'+(i?'':' disabled')+' aria-label="'+TX('Yuqoriga')+'">'+I('up')+'</button><button type="button" class="te-ib" data-rdn="'+i+'"'+(i<R.length-1?'':' disabled')+' aria-label="'+TX('Pastga')+'">'+I('down')+'</button><button type="button" class="te-ib dl" data-rdel="'+i+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div></div>').join('')+'</div>'+
  (R.length?'':'<p class="note tt-empty">'+TX("Video yo'q — saytda Instagram bo'limi faqat havola bilan chiqadi.")+'</p>')+'</div>';
 mn.innerHTML='<div class="hh"><div><h2>Yulduzlar</h2><p class="lead">Saytdagi «Ular Art House\'ni tanladi» bo\'limi — taniqli insonlar kartalari va Instagram oynasi. O\'zgarish saytda darhol ko\'rinadi.</p></div><a class="btn ghost sm" href="index.html" target="_blank" rel="noopener">'+I('globe')+'Saytni ochish</a></div>'+head+list+ig;
 mn.querySelectorAll('img[data-sref]').forEach(el=>refURL(el.dataset.sref).then(u=>{if(u)el.src=u;else el.classList.add('cm-noimg')}));
 mn.querySelectorAll('video[data-rref]').forEach(el=>refURL(el.dataset.rref).then(u=>{if(u)el.src=u+'#t=1'}));
 mn.querySelectorAll('img[data-sref]').forEach(el=>el.addEventListener('error',()=>el.classList.add('cm-noimg'),{once:true}));
 mn.onchange=e=>{const x=e.target.closest('[data-son]');if(!x)return;const c=CMS(),th=liveTh(c);th.sec=th.sec||{};th.sec.amb=Object.assign({type:'native'},th.sec.amb||{},{on:x.checked});th.at=Date.now();cmsSave(c,x.checked?"Bo'lim yoqildi":"Bo'lim o'chirildi",'Yulduzlar')};
 mn.onclick=async e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  const keepHead=()=>{const s2=ST();mn.querySelectorAll('[data-sh]').forEach(f=>{const v=f.value.trim();if(v)s2[f.dataset.sh][LG]=v;else delete s2[f.dataset.sh][LG]});return s2};
  if(d.slg){const s2=keepHead();const c=CMS();c.stars=Object.assign(c.stars||{},{title:s2.title,sub:s2.sub});try{localStorage.setItem('ah_cms',JSON.stringify(c))}catch(x){}LG=d.slg;vS();return} /* til almashganda yozilgan matn yo'qolmaydi */
  if(d.shs!=null){const s2=keepHead();if(put(s2,"Yulduzlar bo'limi matni o'zgartirildi",LG.toUpperCase()))vS();return}
  if(d.sadd!=null){edit(-1);return}
  if(d.sed!=null){edit(+d.sed);return}
  if(d.sup!=null||d.sdn!=null){const s2=ST(),i=+(d.sup!=null?d.sup:d.sdn),j=d.sup!=null?i-1:i+1;if(j<0||j>=s2.list.length)return;[s2.list[i],s2.list[j]]=[s2.list[j],s2.list[i]];put(s2,'Yulduzlar tartibi o\'zgartirildi',s2.list[j].name);vS();return}
  if(d.seye!=null){const s2=ST(),a=s2.list[+d.seye];a.on=a.on===false;put(s2,a.on?"Yulduz saytda ko'rsatildi":'Yulduz saytda yashirildi',a.name);vS();return}
  if(d.sdel!=null){const s2=ST(),a=s2.list[+d.sdel];askDel("Bu narsa o'chirilsinmi?",'<b class="nt9">'+esc(a.name)+'</b>',()=>{const s3=ST();s3.list.splice(+d.sdel,1);put(s3,"Yulduz o'chirildi",a.name);vS()});return}
  if(d.radd!=null){const refs=await cmUp('video',true);if(!refs.length)return;const r=REELS();refs.forEach(x=>r.push({src:x}));putReels(r,"Instagram oynasiga video qo'shildi");vS();return}
  if(d.rup!=null||d.rdn!=null){const r=REELS(),i=+(d.rup!=null?d.rup:d.rdn),j=d.rup!=null?i-1:i+1;if(j<0||j>=r.length)return;[r[i],r[j]]=[r[j],r[i]];putReels(r,"Instagram videolari tartibi o'zgartirildi");vS();return}
  if(d.rdel!=null){askDel("Bu narsa o'chirilsinmi?",'Instagram · video '+(+d.rdel+1),()=>{const r=REELS();r.splice(+d.rdel,1);putReels(r,"Instagram oynasidan video o'chirildi");vS()});return}}}

/* ---------- tahrirlash oynasi (8 til) ---------- */
function edit(idx){const st=ST(),isNew=idx<0;
 const a=isNew?{id:'s'+Date.now().toString(36),on:true,photo:'',name:'',ig:'',verified:true,badge:{},role:{}}:clone(st.list[idx]);
 a.badge=typeof a.badge==='object'&&a.badge?a.badge:{uz:a.badge||''};a.role=typeof a.role==='object'&&a.role?a.role:{uz:a.role||''};
 let l=L8.includes(LANG)?LANG:'uz';
 const m=document.createElement('div');m.className='dlg st-dlg';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 const draw=()=>{m.innerHTML='<form class="st-box" novalidate><div class="tt-h"><h3>'+TX(isNew?"Yulduz qo'shish":'Yulduzni tahrirlash')+'</h3><button type="button" class="te-ib" data-sx aria-label="'+TX('Yopish')+'">'+I('x')+'</button></div>'+
  '<div class="st-fph"><div class="st-ph"><img alt="" id="stImg"></div><div class="st-fbtn"><button type="button" class="btn gold sm" data-spu>'+I('upload')+'Rasm yuklash</button>'+(a.photo&&DEF().some(x=>x.id===a.id)?'<button type="button" class="btn ghost sm" data-spd>'+I('undo')+'Asl rasm</button>':'')+
  '<small class="note">'+TX("Tik (4:5) surat, yuz aniq ko'rinsin. Eng yaxshisi — asl yuqori sifatli rasm.")+'</small></div></div>'+
  '<label class="cm-f"><b>Ism</b><input class="nt9" name="name" value="'+esc(a.name)+'" maxlength="60" placeholder="Dilfuza Ismailova"></label>'+
  '<label class="cm-f"><b>Instagram (havola yoki @nom)</b><input class="nt9" name="ig" value="'+esc(a.ig?'@'+igName(a.ig):'')+'" maxlength="120" placeholder="@arthouse.tashkent"></label>'+
  '<label class="cm-sw1"><input type="checkbox" name="verified"'+(a.verified?' checked':'')+'><i></i><span><b>Ko\'k tasdiq belgisi</b><small>Instagram\'da tasdiqlangan (ko\'k belgili) sahifa bo\'lsa</small></span></label>'+
  '<div class="st-tabs" role="tablist">'+L8.map(x=>'<button type="button" role="tab" data-stl="'+x+'" aria-selected="'+(x===l)+'" title="'+LN[x]+'">'+x.toUpperCase()+((a.badge[x]||a.role[x])?'<i></i>':'')+'</button>').join('')+'</div>'+
  '<label class="cm-f"><b><span>Belgi — rasm ustidagi yozuv</span> <i class="st-lg">'+l.toUpperCase()+'</i></b><input class="nt9" data-ml="badge" value="'+esc(a.badge[l]||'')+'" maxlength="40" placeholder="'+esc(l==='uz'?"Xizmat ko'rsatgan artist":a.badge.uz||'')+'"></label>'+
  '<label class="cm-f"><b><span>Kasbi yoki sohasi</span> <i class="st-lg">'+l.toUpperCase()+'</i></b><input class="nt9" data-ml="role" value="'+esc(a.role[l]||'')+'" maxlength="60" placeholder="'+esc(l==='uz'?'Xonanda':a.role.uz||'')+'"></label>'+
  '<p class="note">'+TX("To'ldirilmagan tillarda o'zbekcha matn ko'rinadi.")+'</p><p class="note st-err" hidden></p>'+
  '<div class="xa"><button type="submit" class="btn gold">'+I('check')+'Saqlash</button><button type="button" class="btn ghost" data-sx>Bekor qilish</button></div></form>';
  const im=m.querySelector('#stImg'),p=photoOf(a);if(p)refURL(p).then(u=>{if(u)im.src=u;else im.classList.add('cm-noimg')});else im.classList.add('cm-noimg')};
 const keep=()=>{const f=m.querySelector('form');if(!f)return;a.name=f.name.value.trim();a.ig=igName(f.ig.value);a.verified=f.verified.checked;
  m.querySelectorAll('[data-ml]').forEach(x=>{const v=x.value.trim();if(v)a[x.dataset.ml][l]=v;else delete a[x.dataset.ml][l]})};
 const close=()=>{m.remove();document.removeEventListener('keydown',k1)},k1=e=>{if(e.key==='Escape')close()};
 draw();document.body.appendChild(m);document.addEventListener('keydown',k1);setTimeout(()=>{const n=m.querySelector('[name=name]');n&&n.focus()},50);
 m.addEventListener('click',async e=>{if(e.target===m){close();return}const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.sx!=null){close();return}
  if(d.stl){keep();l=d.stl;draw();return}
  if(d.spu!=null){keep();const r=await cmUp('image');if(r[0]){a.photo=r[0];draw()}return}
  if(d.spd!=null){keep();a.photo='';draw();return}});
 m.addEventListener('submit',e=>{e.preventDefault();keep();const er=m.querySelector('.st-err');
  if(!a.name||!photoOf(a)||!pk(a.role)){er.hidden=false;er.textContent=TX("Rasm, ism va o'zbekcha kasbi majburiy.");return}
  const s2=ST();if(isNew)s2.list.push(a);else s2.list[idx]=a;
  if(put(s2,isNew?"Yulduz qo'shildi":'Yulduz o\'zgartirildi',a.name)){close();vS()}});
}

if(K.tok()&&K.VW()==='S')K.nav();
})();
