/* ===================================================================
   ART HOUSE — KABINET: «Kabinet menyusi» — kabinetning chap menyusini sozlash
   • bo'limlarni sudrab (yoki ↑ ↓) tartiblash, guruhlar orasida ko'chirish
   • yashirish / ko'rsatish, nomini o'zgartirish, guruh nomini o'zgartirish
   • «Asliga qaytarish». Saqlash: localStorage 'ah_kmenu' (shu qurilma).
   =================================================================== */
(function(){
const K=window.AHK;if(!K)return;
const {own,kToast,esc,I,ICN,TX,NG}=K;
const $=id=>document.getElementById(id);
const KEY='ah_kmenu',SELF='KM';
const ORIG=NG.map(g=>[g[0],g[1].slice()]);              /* asl tuzilma (boshqa fayllar qo'shgan bo'limlar ham kiradi — pastda yangilanadi) */
const KC='ah_kcolors',PAL={emerald:['Zumrad (asl)','',''],night:['Tungi ko\'k','#0B1A2E','#C9B37E'],graphite:['Grafit','#16181B','#D4B57A'],wine:['Bordo','#2A0E16','#E0B98A'],forest:['O\'rmon','#0E2A14','#E7C873']};
function kcolor(){let c={};try{c=JSON.parse(localStorage.getItem(KC))||{}}catch(e){}let st=document.getElementById('kColors');if(!st){st=document.createElement('style');st.id='kColors';document.head.appendChild(st)}
 const bg=/^#[0-9a-f]{6}$/i.test(c.bg||'')?c.bg:'',gd=/^#[0-9a-f]{6}$/i.test(c.gold||'')?c.gold:'';
 const mix=(h,a)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=x=>Math.round(Math.min(255,Math.max(0,x+(a>0?(255-x)*a:x*a)))).toString(16).padStart(2,'0');return '#'+f(r)+f(g)+f(b)};
 st.textContent=(bg?':root{--em-950:'+mix(bg,-.35)+';--em-900:'+mix(bg,-.2)+';--em-850:'+bg+';--em-800:'+mix(bg,.06)+';--em-700:'+mix(bg,.14)+';--em-600:'+mix(bg,.24)+';--bg:'+mix(bg,-.2)+'}body,.adm{background:'+mix(bg,-.2)+'!important}':'')+
  (gd?':root{--ch-300:'+gd+';--ch-200:'+mix(gd,.25)+';--ch-400:'+mix(gd,-.12)+';--gold:'+gd+';--gold-fill:linear-gradient(180deg,'+mix(gd,.35)+' 0%,'+gd+' 100%)}':'')}
kcolor();
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||null}catch(e){return null}};
const save=c=>{try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}};
Object.assign(ICN,{grip:ICN.grip||'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
 layout:ICN.layout||'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>'});

/* barcha bo'limlar (key → asl yozuv) */
function all(){const m={};ORIG.forEach(g=>g[1].forEach(x=>{m[x[0]]=x}));NG.forEach(g=>g[1].forEach(x=>{if(!m[x[0]])m[x[0]]=x}));return m}
/* joriy sozlama: [{g:'Asosiy', items:[{k,on,label}]}] */
function cfg(){const c=load(),A=all();
 let G=c&&Array.isArray(c.groups)?c.groups:ORIG.map(g=>({g:g[0],items:g[1].map(x=>({k:x[0]}))}));
 const seen=new Set();G.forEach(g=>g.items=g.items.filter(i=>A[i.k]&&!seen.has(i.k)&&seen.add(i.k)));
 /* yangi qo'shilgan bo'limlar — o'z guruhiga */
 Object.keys(A).forEach(k=>{if(seen.has(k))return;const og=(ORIG.find(g=>g[1].some(x=>x[0]===k))||NG.find(g=>g[1].some(x=>x[0]===k))||['Boshqa'])[0];let t=G.find(g=>g.g===og);if(!t)G.push(t={g:og,items:[]});t.items.push({k})});
 return G}
/* sozlamani NG ga qo'llash (nav() shu massivdan chizadi) */
function apply(){const A=all(),G=cfg();NG.length=0;
 G.forEach(g=>{const it=g.items.filter(i=>i.on!==false||i.k===SELF).map(i=>{const x=A[i.k].slice();if(i.label)x[2]=i.label;return x});if(it.length)NG.push([g.label||g.g,it])})}

/* «Sozlamalar» guruhiga o'zini qo'shish */
const ITEM=[SELF,'layout','Kabinet menyusi',1];
{const G=ORIG.find(g=>g[1].some(x=>x[0]==='z'))||ORIG[ORIG.length-1];G[1].push(ITEM)}
K.addView(SELF,()=>vKM());

function colorsCard(){let c={};try{c=JSON.parse(localStorage.getItem(KC))||{}}catch(e){}
 return '<div class="card"><h3>'+TX('Kabinet ranglari')+'</h3><div class="km-pal">'+Object.keys(PAL).map(k=>'<button type="button" class="km-sw" data-pal="'+k+'" style="--a:'+(PAL[k][1]||'#073227')+';--b:'+(PAL[k][2]||'#DCC48F')+'"><i></i><span>'+TX(PAL[k][0])+'</span></button>').join('')+'</div>'+
 '<div class="km-cp"><label>'+TX('Fon rangi')+' <input type="color" data-kc="bg" value="'+(c.bg||'#073227')+'"></label><label>'+TX('Oltin (aksent) rang')+' <input type="color" data-kc="gold" value="'+(c.gold||'#DCC48F')+'"></label></div></div>'}
function vKM(){const mn=$('mn');if(!own()){mn.innerHTML='<h2>Kabinet menyusi</h2><div class="card">'+TX('Bu bo\'lim faqat direktor uchun.')+'</div>';return}
 const A=all(),G=cfg();
 mn.innerHTML='<div class="hh"><div><h2>'+I('layout')+TX('Kabinet menyusi')+'</h2><p class="lead">'+TX("Chap menyudagi bo'limlarni sudrab joyini o'zgartiring (yoki ↑ ↓), ko'z belgisi bilan yashiring, nomini o'zgartiring. Saqlash darhol qo'llanadi.")+'</p></div><div class="qa"><button type="button" class="btn ghost sm" data-kreset>'+I('undo')+TX('Asliga qaytarish')+'</button></div></div>'+
  G.map((g,gi)=>'<div class="card km-g" data-g="'+gi+'"><label class="cm-f"><b>'+TX('Guruh nomi')+'</b><input class="nt9" data-gl="'+gi+'" value="'+esc(g.label||g.g)+'" maxlength="30"></label><div class="km-list" data-gi="'+gi+'">'+
   g.items.map((i,ii)=>{const x=A[i.k],off=i.on===false,self=i.k===SELF;return '<div class="km-it'+(off?' off':'')+'" draggable="true" data-k="'+esc(i.k)+'"><span class="km-grip" aria-hidden="true">'+I('grip')+'</span>'+
    '<input class="nt9" data-lb="'+esc(i.k)+'" value="'+esc(i.label||TX(x[2]))+'" maxlength="40" aria-label="'+TX('Nomi')+'">'+
    '<button type="button" class="te-ib" data-up="'+esc(i.k)+'" aria-label="↑">'+I('up')+'</button><button type="button" class="te-ib" data-dn="'+esc(i.k)+'" aria-label="↓">'+I('down')+'</button>'+
    (self?'':'<button type="button" class="te-ib" data-eye="'+esc(i.k)+'" aria-label="'+TX(off?"Ko'rsatish":'Yashirish')+'">'+I(off?'eyeoff':'eye')+'</button>')+'</div>'}).join('')+
   '</div></div>').join('')+colorsCard()+'<div class="xa"><button type="button" class="btn gold" data-ksave>'+I('check')+TX('Saqlash')+'</button></div>';
 const read=()=>{const out=[...mn.querySelectorAll('.km-g')].map((gEl,gi)=>({g:G[gi].g,label:gEl.querySelector('[data-gl]').value.trim()||G[gi].g,items:[...gEl.querySelectorAll('.km-it')].map(it=>{const k=it.dataset.k,lb=it.querySelector('[data-lb]').value.trim(),orig=TX(A[k][2]);return{k,on:!it.classList.contains('off'),label:lb&&lb!==orig?lb:''}})}));return out};
 const commit=(msg)=>{save({groups:read()});apply();K.nav();kToast(TX(msg||'Saqlandi'))};
 mn.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.pal){const P=PAL[d.pal];localStorage.setItem(KC,JSON.stringify(P[1]?{bg:P[1],gold:P[2]}:{}));kcolor();vKM();return}
  if(d.kreset!=null){localStorage.removeItem(KEY);localStorage.removeItem(KC);kcolor();apply();K.nav();vKM();kToast(TX('Asliga qaytarildi'));return}
  if(d.ksave!=null){commit();return}
  const it=b.closest('.km-it');if(!it)return;
  if(d.eye!=null){it.classList.toggle('off');b.innerHTML=I(it.classList.contains('off')?'eyeoff':'eye');return}
  if(d.up!=null){const p=it.previousElementSibling;if(p)p.before(it);else{const pg=it.closest('.km-g').previousElementSibling;if(pg&&pg.classList.contains('km-g'))pg.querySelector('.km-list').appendChild(it)}return}
  if(d.dn!=null){const n=it.nextElementSibling;if(n)n.after(it);else{const ng=it.closest('.km-g').nextElementSibling;if(ng&&ng.classList.contains('km-g'))ng.querySelector('.km-list').prepend(it)}return}};
 /* sudrab tashlash: sichqoncha (HTML5) va barmoq (touch) */
 mn.oninput=e=>{const x=e.target.closest('[data-kc]');if(!x)return;let c={};try{c=JSON.parse(localStorage.getItem(KC))||{}}catch(er){}c[x.dataset.kc]=x.value;localStorage.setItem(KC,JSON.stringify(c));kcolor()};
 let drag=null;
 mn.querySelectorAll('.km-it').forEach(it=>{
  it.addEventListener('dragstart',e=>{drag=it;it.classList.add('drag');try{e.dataTransfer.setData('text/plain',it.dataset.k)}catch(x){}});
  it.addEventListener('dragend',()=>{it.classList.remove('drag');drag=null});
  const g=it.querySelector('.km-grip');
  g.addEventListener('touchstart',e=>{drag=it;it.classList.add('drag');e.preventDefault()},{passive:false});
  g.addEventListener('touchmove',e=>{if(!drag)return;e.preventDefault();const t=e.touches[0],el=document.elementFromPoint(t.clientX,t.clientY);place(el,t.clientY)},{passive:false});
  g.addEventListener('touchend',()=>{if(drag)drag.classList.remove('drag');drag=null});
 });
 function place(el,y){if(!drag||!el)return;const tgt=el.closest&&el.closest('.km-it'),list=el.closest&&el.closest('.km-list');
  if(tgt&&tgt!==drag){const r=tgt.getBoundingClientRect();if(y<r.top+r.height/2)tgt.before(drag);else tgt.after(drag)}else if(list&&!tgt)list.appendChild(drag)}
 mn.querySelectorAll('.km-list').forEach(l=>{l.addEventListener('dragover',e=>{e.preventDefault();place(e.target,e.clientY)});l.addEventListener('drop',e=>e.preventDefault())});
}

/* boshqa kengaytmalar o'z bo'limlarini qo'shib bo'lgach qo'llanadi */
const start=()=>{NG.forEach(g=>g[1].forEach(x=>{const og=ORIG.find(o=>o[0]===g[0]);if(og&&!og[1].some(y=>y[0]===x[0]))og[1].push(x);else if(!og&&!ORIG.some(o=>o[1].some(y=>y[0]===x[0])))ORIG.push([g[0],[x]])}));apply();if(K.tok())K.nav()};
if(document.readyState==='complete')setTimeout(start,0);else addEventListener('load',()=>setTimeout(start,0));
const css=document.createElement('style');css.textContent='.km-g{margin-bottom:14px}.km-list{display:grid;gap:6px;min-height:36px;margin-top:8px}.km-it{display:grid;grid-template-columns:28px 1fr auto auto auto;gap:6px;align-items:center;padding:6px 8px;border:1px solid var(--bd,rgba(234,219,176,.14));border-radius:12px;background:rgba(255,255,255,.03)}.km-it.off{opacity:.5}.km-it.drag{outline:2px dashed var(--ch-300,#DCC48F);opacity:.85}.km-grip{display:grid;place-items:center;cursor:grab;touch-action:none;height:40px}.km-grip .ic{width:18px;height:18px}.km-it input{min-width:0}.km-pal{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.km-sw{display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--bd-2);border-radius:999px;background:none;color:inherit;cursor:pointer}.km-sw i{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--a) 50%,var(--b) 50%);box-shadow:0 0 0 1px rgba(255,255,255,.2)}.km-cp{display:flex;flex-wrap:wrap;gap:16px}.km-cp label{display:flex;align-items:center;gap:8px}.km-cp input{width:48px;height:34px;padding:0;border:0;background:none}';
document.head.appendChild(css);
})();
