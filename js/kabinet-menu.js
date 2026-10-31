/* ===================================================================
   ART HOUSE — KABINET: «MENYU» (saytdagi ☰ menyu)
   • Rasmli kartalar (tepada): rasm yoki video, yozuv (8 tilda), havola — qo'shish, tahrirlash, tartiblash, yashirish, o'chirish.
   • Asosiy havolalar (katta yozuvlar): yozuv 8 tilda, havola, «ajratilgan» (oltin rang).
   • Guruhlar (Loyihalar, Sayt bo'limlari, Mijozlarga xizmat …): sarlavha 8 tilda, bandlar, yangi guruh.
   • «Asliga qaytarish» — standart menyu.
   Saqlash: 'ah_cms'.menu (sxema: js/menu-schema.js). Sayt menyuni shu ma'lumotdan chizadi (js/cms-site.js).
   =================================================================== */
(function(){
const K=window.AHK,M=window.AH_MENU;if(!K||!M)return;
const {CMS,cmsSave,cmCan,own,refURL,cmUp,askDel,kToast,esc,I,ICN,TX,NG}=K;
const $=id=>document.getElementById(id);
const L8=M.L8,LN={uz:"O'zbekcha",ru:'Русский',en:'English',fr:'Français',it:'Italiano',es:'Español',de:'Deutsch',tr:'Türkçe'};
const can=()=>own()||cmCan('cms');
const clone=o=>JSON.parse(JSON.stringify(o));
Object.assign(ICN,{
 menu:ICN.menu||'<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/>',
 plus:ICN.plus||'<path d="M5 12h14"/><path d="M12 5v14"/>',up:ICN.up||'<path d="m18 15-6-6-6 6"/>',down:ICN.down||'<path d="m6 9 6 6 6-6"/>',
 eye:ICN.eye||'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
 eyeoff:ICN.eyeoff||'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
 edit:ICN.edit||'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
 undo:ICN.undo||'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
 link:ICN.link||'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
 video:ICN.video||'<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.76-.43L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
 image:ICN.image||'<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
 upload:ICN.upload||'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
 x:ICN.x||'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',check:ICN.check||'<path d="M20 6 9 17l-5-5"/>',
 globe:ICN.globe||'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20"/>'});

/* ---------- ma'lumot ---------- */
function MN(){const c=CMS();if(c.menu&&Array.isArray(c.menu.main))return clone(c.menu);const d=M.def();d.cards.forEach(x=>x.img='');return d} /* rasm bo'sh — standart rasm */
function put(m,act,det){const c=CMS();c.menu=m;return cmsSave(c,act,det||'')}
const lab=(it,l)=>M.label(it,l||(LANG==='cy'?'uz':LANG))||'—';
/* havolalar ro'yxati */
function LINKS(){const P=window.PROJECTS||[],o=[];
 M.ROUTES.forEach(r=>o.push(['route:'+r[0],TX("Bo'lim")+': '+M.label({k:r[1]},'uz')]));
 P.forEach(p=>o.push(['proj:'+p.id,TX('Loyiha')+': '+(typeof p.name==='string'?p.name:p.name.uz)]));
 o.push(['phone',TX("Qo'ng'iroq (asosiy raqam)")],['telegram','Telegram'],['instagram','Instagram'],['url',TX('Boshqa havola (URL)')]);return o}
const linkName=lk=>{const f=LINKS().find(x=>x[0]===lk);return f?f[1]:String(lk||'').replace(/^url:/,'')};

/* ---------- menyu: Sayt → Menyu ---------- */
const G=NG.find(g=>g[0]==='Sayt');const ITEM=['N','menu','Menyu',()=>cmCan('cms')];
if(G)G[1].unshift(ITEM);else NG.splice(Math.max(0,NG.length-1),0,['Sayt',[ITEM]]);
K.addView('N',()=>vN());

function row(it,path,i,n,o){o=o||{};const off=it.on===false;
 const th=o.card?'<div class="st-ph mn-ph">'+(it.video?'<video data-mref="'+esc(it.video)+'" muted playsinline></video>':'<img data-mref="'+esc(M.img(it))+'" alt="">')+'</div>':'';
 return '<div class="st-card mn-row'+(off?' off':'')+(o.card?'':' mn-flat')+'">'+th+'<div class="st-in"><b class="nt9">'+esc(lab(it))+(it.hl?' <i class="mn-hl">★</i>':'')+'</b><small class="nt9">'+I('link')+esc(linkName(it.link))+'</small>'+
  (off?'<span class="st-hid">'+I('eyeoff')+TX('Saytda yashirilgan')+'</span>':'')+'</div>'+
  '<div class="st-act"><button type="button" class="te-ib" data-mup="'+path+'" data-i="'+i+'"'+(i?'':' disabled')+' aria-label="'+TX('Yuqoriga')+'">'+I('up')+'</button><button type="button" class="te-ib" data-mdn="'+path+'" data-i="'+i+'"'+(i<n-1?'':' disabled')+' aria-label="'+TX('Pastga')+'">'+I('down')+'</button>'+
  '<button type="button" class="te-ib" data-meye="'+path+'" data-i="'+i+'" aria-label="'+TX(off?"Saytda ko'rsatish":'Saytda yashirish')+'">'+I(off?'eyeoff':'eye')+'</button>'+
  '<button type="button" class="btn ghost sm" data-med="'+path+'" data-i="'+i+'">'+I('edit')+TX('Tahrirlash')+'</button><button type="button" class="te-ib dl" data-mdel="'+path+'" data-i="'+i+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div></div>'}

/* path: 'cards' | 'main' | 'g:<n>' (guruh bandlari) */
const arr=(m,path)=>path==='cards'?m.cards:path==='main'?m.main:m.groups[+path.slice(2)].items;

function vN(){const mn=$('mn');if(!can()){mn.innerHTML='<h2>Menyu</h2><div class="card">'+TX("Bu bo'lim uchun ruxsat yo'q.")+'</div>';return}
 const m=MN();
 const sec=(title,note,path,list,o)=>'<div class="card"><div class="tt-h"><div><h3>'+title+'</h3><p class="note">'+note+'</p></div><button type="button" class="btn gold sm" data-madd="'+path+'">'+I('plus')+TX("Qo'shish")+'</button></div>'+
  (list.length?'<div class="st-grid mn-grid'+(o&&o.card?'':' mn-one')+'">'+list.map((it,i)=>row(it,path,i,list.length,o)).join('')+'</div>':'<p class="note tt-empty">'+TX("Hozircha bo'sh. «Qo'shish» tugmasini bosing.")+'</p>')+'</div>';
 const groups=m.groups.map((g,gi)=>{const off=g.on===false,auto=g.auto==='projects';
  return '<div class="card mn-g'+(off?' off':'')+'"><div class="tt-h"><div><h3>'+esc(lab(g)||TX('Sarlavhasiz guruh'))+(off?' <small class="st-hid">'+I('eyeoff')+TX('Saytda yashirilgan')+'</small>':'')+'</h3><p class="note">'+(auto?TX("Bandlar loyihalar ro'yxatidan avtomatik olinadi (Sozlamalar → Loyihalar)."):g.style==='serv'?TX('Kichik yozuvli ro\'yxat (aloqa havolalari).'):TX("Guruh bandlari — ↑ ↓ bilan tartiblang."))+'</p></div>'+
   '<div class="st-act"><button type="button" class="te-ib" data-gup="'+gi+'"'+(gi?'':' disabled')+' aria-label="'+TX('Yuqoriga')+'">'+I('up')+'</button><button type="button" class="te-ib" data-gdn="'+gi+'"'+(gi<m.groups.length-1?'':' disabled')+' aria-label="'+TX('Pastga')+'">'+I('down')+'</button>'+
   '<button type="button" class="te-ib" data-geye="'+gi+'" aria-label="'+TX(off?"Saytda ko'rsatish":'Saytda yashirish')+'">'+I(off?'eyeoff':'eye')+'</button><button type="button" class="btn ghost sm" data-ged="'+gi+'">'+I('edit')+TX('Sarlavha')+'</button>'+
   (auto?'':'<button type="button" class="btn gold sm" data-madd="g:'+gi+'">'+I('plus')+TX("Band qo'shish")+'</button>')+'<button type="button" class="te-ib dl" data-gdel="'+gi+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div></div>'+
   (auto?'':(g.items.length?'<div class="st-grid mn-grid mn-one">'+g.items.map((it,i)=>row(it,'g:'+gi,i,g.items.length)).join('')+'</div>':'<p class="note tt-empty">'+TX("Hozircha bo'sh.")+'</p>'))+'</div>'});
 mn.innerHTML='<div class="hh"><div><h2>'+I('menu')+'Menyu</h2><p class="lead">'+TX("Saytdagi ☰ menyu: rasm va video kartalar, havolalar va guruhlar. Har bir yozuv 8 tilda. O'zgarish saytda darhol ko'rinadi.")+'</p></div>'+
  '<div class="qa"><a class="btn ghost sm" href="index.html" target="_blank" rel="noopener">'+I('globe')+TX('Saytni ochish')+'</a><button type="button" class="btn ghost sm" data-mreset>'+I('undo')+TX('Asliga qaytarish')+'</button></div></div>'+
  sec(TX('Rasmli kartalar'),TX("Menyuning eng tepasida. Rasm yoki qisqa video (ovozsiz, aylanib turadi). 1 ta karta — keng, 2 ta — yonma-yon."),'cards',m.cards,{card:1})+
  sec(TX('Asosiy havolalar'),TX('Katta yozuvlar. «Ajratilgan» band oltin rangda chiqadi.'),'main',m.main)+
  '<h3 class="mn-gh">'+TX('Guruhlar')+'</h3>'+groups.join('')+
  '<div class="xa"><button type="button" class="btn gold" data-gadd>'+I('plus')+TX("Guruh qo'shish")+'</button></div>';
 mn.querySelectorAll('[data-mref]').forEach(el=>{const r=el.dataset.mref;if(!r){el.classList.add('cm-noimg');return}refURL(r).then(u=>{if(u)el.src=u;else el.classList.add('cm-noimg')})});
 mn.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset,m2=MN(),i=+d.i;
  if(d.mreset!=null){askDel(TX('Menyu asl holiga qaytarilsinmi?'),esc(TX("Kabinetdagi menyu o'zgarishlari o'chadi.")),()=>{const c=CMS();delete c.menu;cmsSave(c,'Menyu asliga qaytarildi','');vN()});return}
  if(d.madd){edit(d.madd,-1);return}
  if(d.med){edit(d.med,i);return}
  if(d.mup||d.mdn){const p=d.mup||d.mdn,a=arr(m2,p),j=d.mup?i-1:i+1;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];put(m2,'Menyu tartibi o\'zgartirildi',lab(a[j]));vN();return}
  if(d.meye){const a=arr(m2,d.meye),it=a[i];it.on=it.on===false;put(m2,it.on?"Menyu bandi ko'rsatildi":'Menyu bandi yashirildi',lab(it));vN();return}
  if(d.mdel){const a=arr(m2,d.mdel),it=a[i];askDel("Bu narsa o'chirilsinmi?",'<b class="nt9">'+esc(lab(it))+'</b>',()=>{const m3=MN();arr(m3,d.mdel).splice(i,1);put(m3,"Menyu bandi o'chirildi",lab(it));vN()});return}
  if(d.gup!=null||d.gdn!=null){const gi=+(d.gup!=null?d.gup:d.gdn),j=d.gup!=null?gi-1:gi+1;if(j<0||j>=m2.groups.length)return;[m2.groups[gi],m2.groups[j]]=[m2.groups[j],m2.groups[gi]];put(m2,'Menyu guruhlari tartibi o\'zgartirildi','');vN();return}
  if(d.geye!=null){const g=m2.groups[+d.geye];g.on=g.on===false;put(m2,g.on?"Menyu guruhi ko'rsatildi":'Menyu guruhi yashirildi',lab(g));vN();return}
  if(d.gdel!=null){const g=m2.groups[+d.gdel];askDel("Bu narsa o'chirilsinmi?",'<b class="nt9">'+esc(lab(g))+'</b>',()=>{const m3=MN();m3.groups.splice(+d.gdel,1);put(m3,"Menyu guruhi o'chirildi",lab(g));vN()});return}
  if(d.ged!=null){edit('group',+d.ged);return}
  if(d.gadd!=null){edit('group',-1);return}}}

/* ---------- tahrirlash oynasi ---------- */
function edit(path,idx){const m=MN(),isG=path==='group',isCard=path==='cards',isMain=path==='main',isNew=idx<0;
 const list=isG?m.groups:arr(m,path);
 const it=isNew?(isG?{id:M.uid('g'),on:true,t:{},style:'list',items:[]}:{id:M.uid(isCard?'c':'i'),on:true,t:{},link:'route:home',img:'',video:''}):clone(list[idx]);
 it.t=it.t&&typeof it.t==='object'?it.t:{};
 let l=L8.includes(LANG)?LANG:'uz';
 const ph=x=>M.label({k:it.k,link:it.link},x)||'';
 const dl=document.createElement('div');dl.className='dlg st-dlg';dl.setAttribute('role','dialog');dl.setAttribute('aria-modal','true');
 const draw=()=>{const lk=String(it.link||''),isUrl=lk.indexOf('url:')===0,sel=isUrl?'url':lk;
  dl.innerHTML='<form class="st-box" novalidate><div class="tt-h"><h3>'+TX(isG?(isNew?"Guruh qo'shish":'Guruh sarlavhasi'):isNew?"Band qo'shish":'Bandni tahrirlash')+'</h3><button type="button" class="te-ib" data-x aria-label="'+TX('Yopish')+'">'+I('x')+'</button></div>'+
   (isCard?'<div class="st-fph"><div class="st-ph mn-ph">'+(it.video?'<video id="mnV" muted playsinline autoplay loop></video>':'<img id="mnI" alt="">')+'</div><div class="st-fbtn"><button type="button" class="btn gold sm" data-up="image">'+I('image')+TX('Rasm yuklash')+'</button><button type="button" class="btn ghost sm" data-up="video">'+I('video')+TX('Video yuklash')+'</button>'+
    (it.video?'<button type="button" class="btn ghost sm" data-novid>'+I('x')+TX("Videoni olib tashlash")+'</button>':'')+(it.img&&M.def().cards.some(x=>x.id===it.id)?'<button type="button" class="btn ghost sm" data-noimg>'+I('undo')+TX('Asl rasm')+'</button>':'')+
    '<small class="note">'+TX("Gorizontal (4:3) rasm. Video — qisqa (5–15 soniya), ovozsiz aylanib turadi; rasm muqova bo'ladi.")+'</small></div></div>':'')+
   '<div class="st-tabs" role="tablist">'+L8.map(x=>'<button type="button" role="tab" data-tl="'+x+'" aria-selected="'+(x===l)+'" title="'+LN[x]+'">'+x.toUpperCase()+(it.t[x]?'<i></i>':'')+'</button>').join('')+'</div>'+
   '<label class="cm-f"><b><span>'+TX(isG?'Sarlavha':'Yozuv')+'</span> <i class="st-lg">'+l.toUpperCase()+'</i></b><input class="nt9" data-tx value="'+esc(it.t[l]||'')+'" maxlength="60" placeholder="'+esc(ph(l))+'"></label>'+
   '<p class="note">'+TX("Bo'sh qoldirilsa — standart tarjima chiqadi (bo'lmasa o'zbekcha).")+'</p>'+
   (isG?'<label class="cm-f"><b>'+TX('Ko\'rinishi')+'</b><select name="style"><option value="list"'+(it.style!=='serv'?' selected':'')+'>'+TX('Katta bandlar (→ belgisi bilan)')+'</option><option value="serv"'+(it.style==='serv'?' selected':'')+'>'+TX('Kichik yozuvlar')+'</option></select></label>':
    '<label class="cm-f"><b>'+TX('Havola — bosilganda qayerga o\'tadi')+'</b><select name="link">'+LINKS().map(o=>'<option value="'+esc(o[0])+'"'+(o[0]===sel?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select></label>'+
    (isUrl?'<label class="cm-f"><b>URL</b><input name="url" value="'+esc(lk.slice(4))+'" placeholder="https://…" inputmode="url"></label>':'')+
    (isMain?'<label class="cm-sw1"><input type="checkbox" name="hl"'+(it.hl?' checked':'')+'><i></i><span><b>'+TX('Ajratilgan')+'</b><small>'+TX('Oltin rangda — aksiya yoki muhim taklif uchun')+'</small></span></label>':''))+
   '<p class="note st-err" hidden></p><div class="xa"><button type="submit" class="btn gold">'+I('check')+TX('Saqlash')+'</button><button type="button" class="btn ghost" data-x>'+TX('Bekor qilish')+'</button></div></form>';
  if(isCard){const v=dl.querySelector('#mnV'),im=dl.querySelector('#mnI');if(v)refURL(it.video).then(u=>{if(u)v.src=u});if(im){const r=M.img(it);if(r)refURL(r).then(u=>{if(u)im.src=u;else im.classList.add('cm-noimg')});else im.classList.add('cm-noimg')}}};
 const keep=()=>{const f=dl.querySelector('form');if(!f)return;const x=f.querySelector('[data-tx]').value.trim();if(x)it.t[l]=x;else delete it.t[l];
  if(f.style)it.style=f.style.value;
  if(f.link){const v=f.link.value;it.link=v==='url'?'url:'+(f.url?f.url.value.trim():''):v}
  if(f.hl)it.hl=f.hl.checked};
 const close=()=>{dl.remove();document.removeEventListener('keydown',k1)},k1=e=>{if(e.key==='Escape')close()};
 draw();document.body.appendChild(dl);document.addEventListener('keydown',k1);
 dl.addEventListener('change',e=>{if(e.target.name==='link'){keep();draw()}});
 dl.addEventListener('click',async e=>{if(e.target===dl){close();return}const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.x!=null){close();return}
  if(d.tl){keep();l=d.tl;draw();return}
  if(d.up){keep();const r=await cmUp(d.up);if(r[0]){if(d.up==='video')it.video=r[0];else it.img=r[0];draw()}return}
  if(d.novid!=null){keep();it.video='';draw();return}
  if(d.noimg!=null){keep();it.img='';draw();return}});
 dl.addEventListener('submit',e=>{e.preventDefault();keep();const er=dl.querySelector('.st-err');
  if(!isG&&/^url:/.test(it.link)&&!/^(https?:\/\/|tel:|mailto:|#|[\w.-]+\.html)/.test(it.link.slice(4))){er.hidden=false;er.textContent=TX("Havolani to'liq yozing: https://…");return}
  if(!lab(it,'uz')||lab(it,'uz')==='—'){er.hidden=false;er.textContent=TX("O'zbekcha yozuvni kiriting.");return}
  if(isCard&&!M.img(it)&&!it.video){er.hidden=false;er.textContent=TX('Rasm yoki video yuklang.');return}
  const m2=MN(),L2=isG?m2.groups:arr(m2,path);if(isNew)L2.push(it);else L2[idx]=it;
  if(put(m2,isNew?"Menyuga qo'shildi":"Menyu o'zgartirildi",lab(it))){close();vN()}});
}

if(K.tok()&&K.VW()==='N')K.nav();
})();
