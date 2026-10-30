/* ===================================================================
   ART HOUSE — KABINET: MAVZULAR VA BO'LIMLAR (Shopify uslubidagi tahrirlagich)
   • «Mavzular» sahifasi: jonli mavzu, mavzular kutubxonasi (nashr qilish, nusxa,
     nom, o'chirish), yangi mavzu qo'shish va bo'limlarni tezkor yoqish/o'chirish.
   • «Moslashtirish» — to'liq ekranli tahrirlagich: chapda bo'limlar ro'yxati
     (sudrab tartiblash, ko'z — yoqish/o'chirish, bo'lim qo'shish), bo'lim
     sozlamalari va bloklari, mavzu sozlamalari (ranglar, shrift, tugmalar,
     raqamlar); o'ngda saytning jonli ko'rinishi (kompyuter / telefon).
   • Saqlash — 'ah_cms'.themes ga yoziladi (+ server bo'lsa /api/cms); sayt
     sahifani qayta yuklamasdan darhol yangilanadi (js/theme.js).
   Sxema: js/theme-schema.js
   =================================================================== */
(function(){
const TH=window.AH_THEMES,K=window.AHK;if(!TH||!K)return;
const {CMS,cmsSave,cmCan,own,LANGS_ON,refURL,cmUp,askDel,kToast,esc,I,I2,ICN,TX,TT,IDF,API,AD,NG,ZV}=K;
const $=id=>document.getElementById(id);
const NUMK=['FOUNDED','PROJECTS_DONE'];
const L8=TH.LANGS;
Object.assign(ICN,{
grip:'<circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>',
monitor:'<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
mobile:'<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',back:'<path d="m15 18-6-6 6-6"/>',
pin:'<path d="M20 10c0 5-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
ig:'<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
text:'<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',grid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
quote:'<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',hash:'<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
sparkle:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'});
const SIC={megaphone:'megaphone',image:'image',text:'text',grid:'grid',list:'list',building:'bld',video:'video',calc:'calc',star:'star',phone:'phone',pin:'pin',ig:'ig',target:'target',quote:'quote',hash:'hash',check:'check'};
const ic=n=>I(SIC[n]||n||'layers');
const pk=(o,l)=>o==null?'':typeof o==='string'?o:(o[l||'uz']||o.uz||o.en||'');
const nameOf=(th,id)=>{const n=TH.native(id),sc=th.sec[id]||{},ty=TH.TYPES[sc.type];if(n)return n.name;const t=pk((sc.s||{}).title).replace(/\{\w+\}/g,'').trim();return ty?(sc.type==='stars'||sc.type==='about'||sc.type==='cta'?ty.name:(t||ty.name)):id};

/* ---------- ma'lumot ---------- */
function TS(){const c=CMS();c.themes=c.themes||{};const T=c.themes;T.list=Array.isArray(T.list)?T.list:[];
 if(!T.list.length){const th=TH.newTheme('Art House — Zumrad');th.id='main';T.list.push(th);T.live=th.id} /* hali saqlanmagan standart mavzu: id doim bir xil */
 if(!T.list.some(x=>x.id===T.live))T.live=T.list[0].id;T.list=T.list.map(TH.normalize);return c}
const canT=()=>own()||cmCan('cms');
const fdate=t=>t?IDF(t,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'—';

/* ---------- menyu: «Mavzular» ---------- */
/* direktor va «Sayt sozlamalari» ruxsati berilgan menejerlar uchun */
NG.splice(Math.max(0,NG.length-1),0,['Sayt',[['T','palette','Mavzular',()=>cmCan('cms')]]]);
K.addView('T',()=>vT());

/* ---------- mavzu kartasining kichik ko'rinishi ---------- */
function thumb(th){const s=th.s||{},p=TH.PALETTES[s.palette]||TH.PALETTES.emerald,c=Object.assign({bg:'#0B392C',gold:'#E8D5A4',ink:'#F4EEDF'},p.colors,s.colors||{}),lt=s.surface!=='dark';
 const rows=th.order.filter(id=>(th.sec[id]||{}).on).slice(0,7).map(id=>{const sc=th.sec[id];const nw=sc.type!=='native';return '<i class="'+(nw?(lt?'lt':'nw'):'')+'"></i>'}).join('');
 return '<div class="tt-thumb" style="--b:'+c.bg+';--g:'+c.gold+';--k:'+c.ink+'" aria-hidden="true"><span class="tt-top"><em></em><b></b><em></em></span><span class="tt-hero"><b></b><i></i><u></u></span><span class="tt-rows">'+rows+'</span></div>'}
const sw=p=>'<span class="tt-sw">'+(TH.PALETTES[p]||TH.PALETTES.emerald).sw.map(x=>'<i style="background:'+x+'"></i>').join('')+'</span>';

/* ---------- «Mavzular» sahifasi ---------- */
function vT(){const mn=$('mn');if(!canT()){mn.innerHTML='<h2>Mavzular</h2><div class="card">'+TX("Bu bo'lim uchun ruxsat yo'q.")+'</div>';return}const c=TS(),T=c.themes,live=T.list.find(x=>x.id===T.live),oth=T.list.filter(x=>x!==live),on=live.order.filter(id=>(live.sec[id]||{}).on).length;
 const card=(th,isLive)=>'<div class="card tt-card'+(isLive?' tt-live':'')+'">'+thumb(th)+'<div class="tt-info">'+(isLive?'<span class="tt-badge">'+I('eye')+'Saytda ko\'rinmoqda</span>':'')+'<h3><span class="nt9">'+esc(th.name)+'</span></h3><p class="note">'+sw(th.s.palette)+'<span>'+esc(TX(TH.PALETTES[th.s.palette]?TH.PALETTES[th.s.palette].name:''))+' · '+TX("Saqlangan")+': '+esc(fdate(th.at))+'</span></p>'+
  (isLive?'<p class="note">'+TT("{n} ta bo'lim yoqilgan",{n:on})+'</p>':'')+'<div class="tt-act"><button type="button" class="btn gold sm" data-tc="'+th.id+'">'+I('edit')+'Moslashtirish</button>'+(isLive?'':'<button type="button" class="btn ghost sm" data-tp="'+th.id+'">'+I('upload')+'Nashr qilish</button>')+
  '<button type="button" class="btn ghost sm" data-tdup="'+th.id+'">'+I('copy')+'Nusxa olish</button><button type="button" class="btn ghost sm" data-tren="'+th.id+'">'+I('text')+'Nomini o\'zgartirish</button>'+(isLive?'':'<button type="button" class="btn ghost sm dl" data-tdel="'+th.id+'">'+I('trash')+'O\'chirish</button>')+'</div></div></div>';
 const quick='<div class="card"><div class="tt-h"><div><h3>Bosh sahifa bo\'limlari</h3><p class="note">Bo\'limni yoqing yoki o\'chiring — sayt darhol yangilanadi. Tartib, matn va videolar — «Moslashtirish» ichida.</p></div><button type="button" class="btn ghost sm" data-tc="'+live.id+'">'+I('layers')+'Tartibni o\'zgartirish</button></div><div class="tt-q">'+
  ['ann'].concat(live.order).map(id=>{const sc=live.sec[id]||{},nw=sc.type!=='native';return '<label class="cm-sw1 tt-qi"><input type="checkbox" data-tq="'+id+'"'+(sc.on?' checked':'')+'><i></i><span><b>'+esc(TX(nameOf(live,id)))+'</b><small>'+(nw?TX('Yangi bo\'lim'):TX('Saytning asl qismi'))+'</small></span></label>'}).join('')+'</div></div>';
 const lib='<div class="card"><div class="tt-h"><div><h3>Mavzular kutubxonasi</h3><p class="note">Nusxada tajriba qiling: saytga faqat «Nashr qilish» bosilganda chiqadi.</p></div></div>'+(oth.length?'<div class="tt-lib">'+oth.map(th=>card(th,false)).join('')+'</div>':'<p class="note tt-empty">'+TX("Hozircha boshqa mavzu yo'q. Jonli mavzudan nusxa oling yoki quyida yangisini qo'shing.")+'</p>')+'</div>';
 const add='<div class="card"><div class="tt-h"><div><h3>Yangi mavzu qo\'shish</h3><p class="note">Tayyor rang uslubini tanlang — bo\'limlar standart holatda yaratiladi.</p></div></div><div class="tt-pre">'+Object.keys(TH.PALETTES).map(k=>{const p=TH.PALETTES[k];return '<button type="button" class="tt-pal" data-tadd="'+k+'">'+thumb({s:{palette:k,surface:'light'},order:TH.ORDER,sec:TH.newTheme().sec})+'<b>'+esc(TX(p.name))+'</b><small>'+esc(TX(p.note))+'</small></button>'}).join('')+'</div></div>';
 mn.innerHTML='<div class="hh"><div><h2>Mavzular</h2><p class="lead">Saytning ko\'rinishi va bo\'limlarini Shopify kabi boshqaring: mavzuni moslashtiring, bloklarni yoqing yoki o\'chiring, video va matn qo\'shing — o\'zgarish saytda darhol ko\'rinadi.</p></div><a class="btn ghost sm" href="index.html" target="_blank" rel="noopener">'+I('globe')+'Saytni ochish</a></div>'+card(live,true)+quick+lib+add;
 mn.onchange=e=>{const x=e.target.closest('[data-tq]');if(!x)return;const c=TS(),th=c.themes.list.find(y=>y.id===c.themes.live);th.sec[x.dataset.tq].on=x.checked;th.at=Date.now();cmsSave(c,x.checked?"Bo'lim yoqildi":"Bo'lim o'chirildi",nameOf(th,x.dataset.tq))};
 mn.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.tc){openEd(d.tc);return}
  if(d.tp){const c=TS();c.themes.live=d.tp;const th=c.themes.list.find(x=>x.id===d.tp);cmsSave(c,'Mavzu nashr qilindi',th.name);vT();return}
  if(d.tdup){const c=TS(),th=TH.clone(c.themes.list.find(x=>x.id===d.tdup));th.id=TH.uid('th');th.name=TX('Nusxa')+' — '+th.name;th.at=Date.now();c.themes.list.push(th);cmsSave(c,"Mavzudan nusxa olindi",th.name);vT();return}
  if(d.tren){const c=TS(),th=c.themes.list.find(x=>x.id===d.tren),n=prompt(TX('Mavzu nomi'),th.name);if(n==null||!n.trim())return;th.name=n.trim().slice(0,60);cmsSave(c,"Mavzu nomi o'zgartirildi",th.name);vT();return}
  if(d.tdel){const c=TS(),th=c.themes.list.find(x=>x.id===d.tdel);askDel("Bu narsa o'chirilsinmi?",'<b class="nt9">'+esc(th.name)+'</b>',()=>{const c=TS();c.themes.list=c.themes.list.filter(x=>x.id!==d.tdel);cmsSave(c,"Mavzu o'chirildi",th.name);vT()});return}
  if(d.tadd){const c=TS(),th=TH.newTheme(TX(TH.PALETTES[d.tadd].name),d.tadd);c.themes.list.push(th);cmsSave(c,"Yangi mavzu qo'shildi",th.name);vT();kToast(TX("Mavzu qo'shildi — «Moslashtirish» orqali sozlang."))}}}

/* ===================================================================
   TAHRIRLAGICH
   =================================================================== */
let E=null;
const sec=()=>E&&E.sel?E.th.sec[E.sel]:null;
const isLive=()=>TS().themes.live===E.id;
function snap(){return JSON.stringify({th:E.th,cfg:E.cfg})}
let hT=0;
function hist(){if(Date.now()-hT>700){E.hist.push(E.last);if(E.hist.length>60)E.hist.shift();E.fut=[]}hT=Date.now();E.last=snap()}
function dirty(){E.dirty=true;hist();bar();push()}
let pT=0;
function push(now){clearTimeout(pT);const go=()=>{const f=$('teIf');if(!E||!f||!f.contentWindow||!E.ready)return;const names={};['ann'].concat(E.th.order).forEach(id=>names[id]=TX(nameOf(E.th,id)));f.contentWindow.postMessage({ah:'te',op:'theme',theme:E.th,cfg:E.cfg,lang:E.lang,names},'*')};if(now)go();else pT=setTimeout(go,140)}
function post(m){const f=$('teIf');if(f&&f.contentWindow&&E.ready){m.ah='te';f.contentWindow.postMessage(m,'*')}}

function openEd(id){const c=TS(),th=c.themes.list.find(x=>x.id===id);if(!th)return;
 const cfg={};NUMK.forEach(k=>cfg[k]=c.cfg[k]!=null&&c.cfg[k]!==''?c.cfg[k]:'');
 const L=LANGS_ON().filter(l=>l!=='cy');
 E={id,th:TH.clone(th),cfg,sel:null,open:null,tab:'sec',dev:'desk',lang:L.includes(LANG)?LANG:'uz',L,dirty:false,hist:[],fut:[],keys:{},present:{},ready:false,mob:'pane'};E.last=snap();
 const el=document.createElement('div');el.id='te';el.className='te';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
 el.innerHTML='<header class="te-bar"><button type="button" class="te-ib" data-te="close" aria-label="Chiqish">'+I('back')+'</button><div class="te-title"><b class="nt9"></b><span class="te-st"></span></div>'+
  '<div class="te-tools"><label class="te-lang">'+I('globe')+'<select data-te-lang aria-label="Til">'+E.L.map(l=>'<option value="'+l+'"'+(l===E.lang?' selected':'')+'>'+l.toUpperCase()+'</option>').join('')+'</select></label>'+
  '<div class="te-seg" role="group"><button type="button" data-dev="desk" aria-label="Kompyuter">'+I('monitor')+'</button><button type="button" data-dev="mob" aria-label="Telefon">'+I('mobile')+'</button></div>'+
  '<button type="button" class="te-ib" data-te="undo" aria-label="Bekor qilish">'+I('undo')+'</button><button type="button" class="te-ib" data-te="redo" aria-label="Qaytarish">'+I('redo')+'</button>'+
  '<a class="te-ib" href="index.html" target="_blank" rel="noopener" aria-label="Saytda ko\'rish">'+I('eye')+'</a>'+
  '<span class="te-dirty">Saqlanmagan o\'zgarishlar</span><button type="button" class="btn ghost sm te-pub" data-te="publish">'+I('upload')+'Nashr qilish</button><button type="button" class="btn gold sm" data-te="save">'+I('check')+'Saqlash</button></div></header>'+
  '<div class="te-body" data-mob="pane"><aside class="te-side"><div class="te-tabs" role="tablist"><button type="button" role="tab" data-tab="sec">'+I('layers')+'Bo\'limlar</button><button type="button" role="tab" data-tab="set">'+I('palette')+'Mavzu sozlamalari</button></div><div class="te-pane" id="tePane"></div></aside>'+
  '<main class="te-view"><div class="te-frame" data-dev="desk"><iframe id="teIf" title="Sayt ko\'rinishi" src="index.html?preview=1#home"></iframe><div class="te-load"><span class="cm-spin" aria-hidden="true"></span><span>Sayt yuklanmoqda…</span></div></div></main></div>'+
  '<div class="te-mtab" role="group"><button type="button" data-mob="pane">'+I('layers')+'Sozlamalar</button><button type="button" data-mob="view">'+I('eye')+'Ko\'rinish</button></div>';
 AD.appendChild(el);document.body.classList.add('te-on');
 el.addEventListener('click',onClick);el.addEventListener('input',onInput);el.addEventListener('change',onInput);
 el.querySelector('[data-te-lang]').addEventListener('change',e=>{E.lang=e.target.value;E.keys={};pane();push(1);if(E.sel&&TH.native(E.sel))post({op:'keys',id:E.sel})});
 dnd(el);bar();pane()}

function closeEd(){const el=$('te');if(el)el.remove();document.body.classList.remove('te-on');E=null;if(K.VW()==='T')vT()}
addEventListener('message',e=>{if(!E)return;const f=$('teIf');if(!f||e.source!==f.contentWindow)return;const d=e.data||{};if(d.ah!=='te')return;
 if(d.op==='ready'){E.ready=true;E.present=d.present||{};const l=document.querySelector('#te .te-load');if(l)l.remove();push(1);if(E.sel){post({op:'focus',id:E.sel,instant:1});if(TH.native(E.sel))post({op:'keys',id:E.sel})}if(E.tab==='sec')pane()}
 if(d.op==='present'){const ch=JSON.stringify(E.present)!==JSON.stringify(d.present||{});E.present=d.present||{};if(ch&&E.tab==='sec'&&!E.sel)pane()}
 if(d.op==='keys'){E.keys[d.id]=d.keys||[];if(E.sel===d.id)pane()}
 if(d.op==='pick'&&d.id!==E.sel&&(E.th.sec[d.id])){select(d.id,true)}});
addEventListener('keydown',e=>{if(!E)return;const k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&k==='z'&&!e.target.closest('input,textarea')){e.preventDefault();e.shiftKey?redo():undo()}else if((e.ctrlKey||e.metaKey)&&k==='s'){e.preventDefault();save()}else if(k==='escape'&&!document.querySelector('.dlg')){E.sel?select(null):tryClose()}});
addEventListener('beforeunload',e=>{if(E&&E.dirty){e.preventDefault();e.returnValue=''}});

function bar(){const el=$('te');if(!el)return;const live=isLive();
 el.querySelector('.te-title b').textContent=E.th.name;const st=el.querySelector('.te-st');st.textContent=TX(live?'Jonli mavzu':'Qoralama — saytda ko\'rinmaydi');st.className='te-st'+(live?' on':'');
 el.querySelector('.te-dirty').hidden=!E.dirty;el.querySelector('.te-pub').hidden=live;
 el.querySelector('[data-te="undo"]').disabled=!E.hist.length;el.querySelector('[data-te="redo"]').disabled=!E.fut.length;
 el.querySelectorAll('[data-dev]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dev===E.dev)));
 el.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===E.tab)));
 el.querySelectorAll('.te-mtab [data-mob]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mob===E.mob)))}
function undo(){if(!E.hist.length)return;E.fut.push(snap());const s=JSON.parse(E.hist.pop());E.th=s.th;E.cfg=s.cfg;E.last=snap();hT=0;E.dirty=true;if(E.sel&&!E.th.sec[E.sel])E.sel=null;bar();pane();push(1)}
function redo(){if(!E.fut.length)return;E.hist.push(snap());const s=JSON.parse(E.fut.pop());E.th=s.th;E.cfg=s.cfg;E.last=snap();hT=0;E.dirty=true;bar();pane();push(1)}
function save(publish){const c=TS(),i=c.themes.list.findIndex(x=>x.id===E.id);if(i<0){kToast(TX('Mavzu topilmadi'));return}
 E.th.at=Date.now();c.themes.list[i]=TH.clone(E.th);
 NUMK.forEach(k=>{const v=E.cfg[k];if(v===''||v==null)delete c.cfg[k];else c.cfg[k]=k==='FOUNDED'&&/^\d{4}$/.test(String(v))?+v:String(v)});
 ['EXPERIENCE_YEARS','IG_FOLLOWERS','IG_POSTS'].forEach(k=>delete c.cfg[k]); /* eski qiymatlar: tajriba endi tashkil topgan yildan hisoblanadi */
 if(publish)c.themes.live=E.id;
 if(!cmsSave(c,publish?'Mavzu nashr qilindi':'Mavzu saqlandi',E.th.name))return;
 E.dirty=false;bar();if(!publish&&c.themes.live!==E.id)setTimeout(()=>kToast(TX("Saqlandi. Saytda ko'rinishi uchun «Nashr qilish» tugmasini bosing.")),900)}
function tryClose(){if(!E.dirty)return closeEd();askDel(TX("Saqlanmagan o'zgarishlar bekor qilinsinmi?"),esc(E.th.name),closeEd)}
function select(id,fromPreview){E.sel=id;E.open=null;E.tab='sec';if(id&&TH.native(id)&&!E.keys[id])post({op:'keys',id});bar();pane();if(id&&!fromPreview)post({op:'focus',id});const p=$('tePane');if(p)p.scrollTop=0}

/* ---------- chap panel ---------- */
function pane(){const P=$('tePane');if(!P)return;P.innerHTML=E.tab==='set'?paneSet():E.sel&&E.th.sec[E.sel]?paneSec():paneList();fillThumbs(P)}
function row(id,fixed){const sc=E.th.sec[id]||{},nw=sc.type!=='native',miss=!nw&&E.ready&&E.present[id]===false;
 return '<div class="te-row'+(sc.on?'':' off')+'" data-sel="'+id+'"'+(fixed?'':' draggable="true" data-drag="'+id+'"')+'>'+(fixed?'<span class="te-grip ph"></span>':'<span class="te-grip" aria-hidden="true">'+I('grip')+'</span>')+
  '<i class="te-ic">'+ic(nw?(TH.TYPES[sc.type]||{}).icon:(TH.native(id)||{}).icon)+'</i><span class="te-nm"><b>'+(nw&&TH.TYPES[sc.type]&&TH.TYPES[sc.type].multi?'<span class="nt9">'+esc(nameOf(E.th,id))+'</span>':esc(nameOf(E.th,id)))+'</b>'+
  (nw?'<small class="te-new">Yangi</small>':miss?'<small>Hozir saytda ko\'rinmaydi</small>':'')+'</span><button type="button" class="te-eye" data-eye="'+id+'" aria-label="'+(sc.on?'Yashirish':'Ko\'rsatish')+'">'+I(sc.on?'eye':'eyeoff')+'</button></div>'}
function paneList(){const T=TH.TYPES,can=Object.keys(T).filter(k=>T[k].multi||!E.th.order.some(id=>E.th.sec[id].type===k));
 return '<div class="te-grp"><p class="te-gh">Sayt sarlavhasi</p>'+row('ann',true)+'</div><div class="te-grp"><p class="te-gh">Bosh sahifa</p><div class="te-list" data-list="sec">'+E.th.order.map(id=>row(id)).join('')+'</div>'+
  '<details class="te-add"><summary>'+I('plus')+'Bo\'lim qo\'shish</summary><div class="te-addl">'+(can.length?can.map(k=>'<button type="button" data-addsec="'+k+'"><i class="te-ic">'+ic(T[k].icon)+'</i><span><b>'+T[k].name+'</b><small>'+T[k].note+'</small></span></button>').join(''):'<p class="note">Barcha bo\'limlar qo\'shilgan.</p>')+'</div></details></div>'+
  '<div class="te-grp"><p class="te-gh">Pastki qism</p><div class="te-row fixed"><span class="te-grip ph"></span><i class="te-ic">'+I('list')+'</i><span class="te-nm"><b>Sayt pastki qismi</b><small>Aloqa va havolalar — Sozlamalar → Aloqa</small></span></div></div>'+
  '<p class="te-tip">'+I('sparkle')+'<span>Bo\'limni sudrab tartibini o\'zgartiring, ko\'z belgisi bilan yashiring. Saytdagi istalgan bo\'limni bossangiz, uning sozlamalari ochiladi.</span></p>'}

/* --- maydonlar --- */
const val=(o,k)=>o?o[k]:undefined;
function fld(f,obj,path,opt){opt=opt||{};const v=val(obj,f.k),id='tf'+Math.random().toString(36).slice(2,8),lb='<label for="'+id+'">'+f.l+'</label>';
 if(f.t==='text'||f.t==='area'){const cur=v&&typeof v==='object'?(v[E.lang]||''):(typeof v==='string'&&E.lang==='uz'?v:''),ph=pk(v,'uz')||pk(v,'en');
  const inp=f.t==='area'?'<textarea id="'+id+'" rows="3" data-f="'+path+'" data-ml="1" placeholder="'+esc(E.lang==='uz'?'':ph)+'">'+esc(cur)+'</textarea>':'<input id="'+id+'" data-f="'+path+'" data-ml="1" value="'+esc(cur)+'" placeholder="'+esc(E.lang==='uz'?'':ph)+'">';
  return '<div class="te-f">'+lb+'<div class="te-ml nt9"><em>'+E.lang.toUpperCase()+'</em>'+inp+'</div></div>'}
 if(f.t==='plain'||f.t==='url')return '<div class="te-f">'+lb+'<input class="nt9" id="'+id+'" data-f="'+path+'"'+(f.t==='url'?' type="url" inputmode="url" placeholder="https://"':'')+' value="'+esc(v==null?'':v)+'"></div>';
 if(f.t==='date')return '<div class="te-f">'+lb+'<input id="'+id+'" type="date" data-f="'+path+'" value="'+esc(v||'')+'"></div>';
 if(f.t==='check')return '<label class="cm-sw1 te-sw"><input type="checkbox" data-f="'+path+'"'+(v?' checked':'')+'><i></i><span>'+f.l+'</span></label>';
 if(f.t==='select')return '<div class="te-f">'+lb+'<select id="'+id+'" data-f="'+path+'">'+f.o.map(o=>'<option value="'+o[0]+'"'+(String(v)===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';
 if(f.t==='image'||f.t==='video'){const vd=f.t==='video';return '<div class="te-f"><span class="te-lb">'+f.l+'</span><div class="te-media cm-media">'+(v?(vd?'<video data-ref="'+esc(v)+'" muted playsinline preload="metadata"></video>':'<img data-ref="'+esc(v)+'" alt="">'):'<div class="te-ph">'+I(vd?'video':'image')+'<span>'+(vd?'Videoni shu yerga tashlang':'Rasmni shu yerga tashlang')+'</span></div>')+
  '<div class="te-ma"><button type="button" class="btn ghost sm" data-up="'+path+'" data-kind="'+f.t+'">'+I('upload')+(vd?'Video yuklash':'Rasm yuklash')+'</button><button type="button" class="btn ghost sm" data-url="'+path+'">'+I('link')+'Havola</button>'+(v?'<button type="button" class="btn ghost sm dl" data-clr="'+path+'">'+I('trash')+'</button>':'')+'</div>'+
  (v?'<small class="te-src nt9">'+esc(/^idb:/.test(v)?TX('Shu brauzerda saqlangan fayl'):/^base:/.test(v)?TX('Loyihaning asl rasmi'):String(v).slice(0,80))+'</small>':'')+'</div></div>'}
 return ''}
function shown(f,obj){if(!f.when)return true;const m=f.when.split('=');return m.length>1?String(val(obj,m[0])||'')===m[1]:!!val(obj,m[0])}
function fields(list,obj,base){return list.filter(f=>shown(f,obj)).map(f=>fld(f,obj,base+f.k)).join('')}

function paneSec(){const id=E.sel,sc=E.th.sec[id],nat=TH.native(id),ty=TH.TYPES[sc.type],i=E.th.order.indexOf(id);
 let h='<div class="te-ph-h"><button type="button" class="te-ib" data-back aria-label="Orqaga">'+I('back')+'</button><b>'+(ty&&ty.multi?'<span class="nt9">'+esc(nameOf(E.th,id))+'</span>':esc(nameOf(E.th,id)))+'</b>'+
  (i>-1?'<button type="button" class="te-ib" data-mv="-1" aria-label="Yuqoriga"'+(i<1?' disabled':'')+'>'+I('up')+'</button><button type="button" class="te-ib" data-mv="1" aria-label="Pastga"'+(i>=E.th.order.length-1?' disabled':'')+'>'+I('down')+'</button>':'')+'</div>'+
  '<label class="cm-sw1 te-sw te-onoff"><input type="checkbox" data-on'+(sc.on?' checked':'')+'><i></i><span>'+(sc.on?'Bo\'lim saytda ko\'rinadi':'Bo\'lim yashirilgan')+'</span></label>';
 if(nat){const ks=E.keys[id];h+='<p class="note te-n">'+(ty?'':TX("Bu saytning asl bo'limi: uni yoqish/o'chirish, joyini o'zgartirish va matnlarini tahrirlash mumkin."))+'</p>'+(E.ready&&E.present[id]===false?'<p class="note te-warn">'+TX("Bu bo'lim hozir saytda yo'q (masalan, ma'lumot kiritilmagan). U paydo bo'lganda shu joyda ko'rinadi.")+'</p>':'');
  h+='<div class="te-gt">'+I('text')+'<b>Matnlar</b><em>'+E.lang.toUpperCase()+'</em></div>';
  if(!E.ready||!ks)h+='<p class="note">'+TX('Yuklanmoqda…')+'</p>';
  else if(!ks.length)h+='<p class="note">'+TX("Bu bo'limda tahrirlanadigan matn yo'q.")+'</p>';
  else{const ov=(E.th.text[E.lang]||{});h+=ks.map((k,j)=>{const cur=ov[k.k]!=null?ov[k.k]:k.v,long=k.v.length>60||k.k==='marquee';return '<div class="te-f"><label for="tx'+j+'"><code>'+esc(k.k)+'</code>'+(ov[k.k]!=null?'<button type="button" class="te-rs" data-rs="'+esc(k.k)+'">Asliga qaytarish</button>':'')+'</label>'+(long?'<textarea class="nt9" id="tx'+j+'" rows="3" data-f="tx:'+esc(k.k)+'" data-base="'+esc(k.v)+'">'+esc(cur)+'</textarea>':'<input class="nt9" id="tx'+j+'" data-f="tx:'+esc(k.k)+'" data-base="'+esc(k.v)+'" value="'+esc(cur)+'">')+(k.k==='marquee'?'<small class="te-hint">Iboralarni | belgisi bilan ajrating</small>':'')+'</div>'}).join('')}
  return h}
 h+='<div class="te-fs">'+fields(ty.settings,sc.s,'s.')+'</div>';
 if(ty.blocks){const BT=ty.blocks,B=sc.b||[];h+='<div class="te-gt">'+I('layers')+'<b>Bloklar</b><em>'+B.length+'/'+(ty.max||20)+'</em></div><div class="te-list" data-list="blk">'+B.map(b=>{const bt=BT[b.type]||{},op=E.open===b.id,tl=pk(b[bt.title],E.lang)||pk(b[bt.title])||bt.name;
   return '<div class="te-blk'+(op?' open':'')+'" data-drag="'+b.id+'" draggable="true"><div class="te-row" data-bo="'+b.id+'"><span class="te-grip" aria-hidden="true">'+I('grip')+'</span><i class="te-ic">'+ic(bt.icon)+'</i><span class="te-nm"><b class="nt9">'+esc(String(tl).replace(/\{(\w+)\}/g,'{$1}'))+'</b><small>'+bt.name+(b.sample?' · <span class="te-smp">Namuna</span>':'')+(b.kind?' · '+(TH.KIND.find(k=>k[0]===b.kind)||['',''])[1]:'')+'</small></span>'+
    '<button type="button" class="te-eye" data-bdup="'+b.id+'" aria-label="Nusxa">'+I('copy')+'</button><button type="button" class="te-eye dl" data-bdel="'+b.id+'" aria-label="O\'chirish">'+I('trash')+'</button></div>'+(op?'<div class="te-bf">'+(b.sample?'<p class="note te-n">'+TX("Namuna: saytda ko'rinmaydi. Video yoki matn kiritsangiz — haqiqiy blokka aylanadi.")+'</p>':'')+fields(bt.fields,b,'b.'+b.id+'.')+'</div>':'')+'</div>'}).join('')+'</div>';
  h+=B.length<(ty.max||20)?'<div class="te-addb">'+Object.keys(BT).map(k=>'<button type="button" class="btn ghost sm" data-addb="'+k+'">'+I('plus')+BT[k].name+'</button>').join('')+'</div>':''}
 if(sc.type==='stars'&&!API)h+='<p class="note te-n">'+I('alert')+TX("Server ulanmagan: yuklangan videolar faqat shu brauzerda ko'rinadi. Barcha qurilmalarda ko'rinishi uchun serverni ishga tushiring yoki YouTube / Instagram havolasini qo'ying.")+'</p>';
 h+='<div class="te-danger"><button type="button" class="btn ghost sm dl" data-delsec>'+I('trash')+'Bo\'limni o\'chirish</button></div>';
 return h}

function paneSet(){const s=E.th.s,C=s.colors||{},P=TH.PALETTES,cur=Object.assign({},(P[s.palette]||P.emerald).colors);
 const col=(k,l,d)=>'<label class="te-col"><input type="color" data-f="col.'+k+'" value="'+(C[k]||cur[k]||d)+'"><span>'+l+'</span>'+(C[k]?'<button type="button" class="te-rs" data-rcol="'+k+'">Asli</button>':'')+'</label>';
 return '<div class="te-gt">'+I('palette')+'<b>Rang uslubi</b></div><div class="te-pals">'+Object.keys(P).map(k=>'<button type="button" class="te-pal'+(s.palette===k?' on':'')+'" data-pal="'+k+'">'+sw(k)+'<b>'+P[k].name+'</b><small>'+P[k].note+'</small></button>').join('')+'</div>'+
  '<div class="te-gt">'+I('edit')+'<b>O\'z ranglaringiz</b></div><div class="te-cols">'+col('bg','Fon','#0B392C')+col('gold','Oltin urg\'u','#E8D5A4')+col('ink','Matn','#F4EEDF')+'</div>'+
  '<div class="te-gt">'+I('text')+'<b>Sarlavha shrifti</b></div><div class="te-seg2">'+Object.keys(TH.FONTS).map(k=>'<button type="button" data-font="'+k+'" aria-pressed="'+(s.font===k)+'"><b style="font-family:'+esc(TH.FONTS[k].css)+'">Aa</b><small>'+TH.FONTS[k].name+'</small></button>').join('')+'</div>'+
  '<div class="te-gt">'+I('diamond')+'<b>Tugmalar shakli</b></div><div class="te-seg2">'+[['square',"To'g'ri burchak"],['round','Yumaloq'],['pill','Kapsula']].map(x=>'<button type="button" data-btn="'+x[0]+'" aria-pressed="'+(s.btn===x[0])+'"><i class="te-bs '+x[0]+'"></i><small>'+x[1]+'</small></button>').join('')+'</div>'+
  '<div class="te-gt">'+I('layers')+'<b>Yangi bo\'limlar foni</b></div><div class="te-seg2">'+[['light','Och shampan','Ochroq, tillarang va yashil'],['dark','Zumrad','Sayt foni bilan bir xil']].map(x=>'<button type="button" data-surf="'+x[0]+'" aria-pressed="'+(s.surface===x[0])+'"><i class="te-bs sf '+x[0]+'"></i><small>'+x[1]+'</small></button>').join('')+'</div>'+
  '<div class="te-gt">'+I('hash')+'<b>Raqamlar</b></div><p class="note te-n">'+TX("Butun sayt uchun umumiy: bosh sahifa, «Biz haqimizda» va boshqa bloklarda {years}, {projects} o'rnida ko'rinadi.")+'</p>'+
  [['FOUNDED','Tashkil topgan yil'],['PROJECTS_DONE','Amalga oshirilgan loyihalar']].map(x=>'<div class="te-f"><label for="n'+x[0]+'">'+x[1]+'</label><input class="nt9" id="n'+x[0]+'" data-f="cfg.'+x[0]+'" value="'+esc(E.cfg[x[0]])+'" placeholder="'+esc(String(window.CFG&&CFG[x[0]]!=null?CFG[x[0]]:''))+'"></div>').join('')+
  '<p class="note te-n">'+TX("Tajriba har yili o'zi oshadi")+': '+new Date().getFullYear()+' − '+(E.cfg.FOUNDED||CFG.FOUNDED)+' = <b>'+(new Date().getFullYear()-(+E.cfg.FOUNDED||CFG.FOUNDED))+'</b></p>'+
  '<p class="note te-n">'+TX("Boshlang'ich to'lov foizi, oylar va 1 m² narxi — Sozlamalar → Narxlar va tizim.")+'</p>'}

function fillThumbs(R){R.querySelectorAll('[data-ref]').forEach(el=>{refURL(el.dataset.ref).then(u=>{if(!u){el.replaceWith(Object.assign(document.createElement('div'),{className:'te-ph',innerHTML:I('image')}));return}el.src=u})})}

/* ---------- qiymatlarni yozish ---------- */
function target(path){if(path.indexOf('s.')===0)return [sec().s,path.slice(2)];
 if(path.indexOf('b.')===0){const p=path.split('.'),b=(sec().b||[]).find(x=>x.id===p[1]);if(b)delete b.sample;return [b,p.slice(2).join('.')]}
 if(path.indexOf('col.')===0){E.th.s.colors=E.th.s.colors||{};return [E.th.s.colors,path.slice(4)]}
 if(path.indexOf('cfg.')===0)return [E.cfg,path.slice(4)];
 return [null,'']}
function setVal(path,v,ml){if(path.indexOf('tx:')===0){const k=path.slice(3),T=E.th.text[E.lang]=E.th.text[E.lang]||{},inp=document.querySelector('#tePane [data-f="'+CSS.escape(path)+'"]'),base=inp?inp.dataset.base:'';
  if(v.trim()===''||v===base)delete T[k];else T[k]=v;if(!Object.keys(T).length)delete E.th.text[E.lang];return}
 const t=target(path),o=t[0],k=t[1];if(!o)return;
 if(ml){let m=o[k];if(!m||typeof m!=='object')m=o[k]=typeof m==='string'&&m?{uz:m}:{};if(v==='')delete m[E.lang];else m[E.lang]=v}else o[k]=v}
function onInput(e){const el=e.target;if(!el.dataset||!el.dataset.f||!E)return;if(e.type==='change'&&el.type!=='checkbox'&&el.tagName!=='SELECT'&&el.type!=='color'&&el.type!=='date')return;
 const v=el.type==='checkbox'?el.checked:el.value;setVal(el.dataset.f,v,!!el.dataset.ml);dirty();
 if(el.type==='checkbox'||el.tagName==='SELECT'||(el.type==='color'&&e.type==='change'))pane()}

/* ---------- tugmalar ---------- */
async function onClick(e){const b=e.target.closest('button,[data-sel],[data-bo]');if(!b||!E)return;const d=b.dataset;
 if(d.te==='close')return tryClose();if(d.te==='save')return save();if(d.te==='publish')return save(true);if(d.te==='undo')return undo();if(d.te==='redo')return redo();
 if(d.dev){E.dev=d.dev;document.querySelector('#te .te-frame').dataset.dev=E.dev;bar();if(E.sel)setTimeout(()=>post({op:'focus',id:E.sel,instant:1}),450);return}
 if(d.mob){E.mob=d.mob;document.querySelector('#te .te-body').dataset.mob=E.mob;bar();if(E.mob==='view'&&E.sel)setTimeout(()=>post({op:'focus',id:E.sel,instant:1}),120);return}
 if(d.tab){E.tab=d.tab;E.sel=null;bar();pane();return}
 if(d.eye){e.stopPropagation();const sc=E.th.sec[d.eye];sc.on=!sc.on;dirty();pane();return}
 if(d.back!=null)return select(null);
 if(d.on!=null)return;
 if(d.mv){const o=E.th.order,i=o.indexOf(E.sel),j=i+(+d.mv);if(j<0||j>=o.length)return;[o[i],o[j]]=[o[j],o[i]];dirty();pane();post({op:'focus',id:E.sel});return}
 if(d.addsec){const T=TH.TYPES[d.addsec];let id=d.addsec;if(T.multi||E.th.sec[id])id=d.addsec+'-'+TH.uid('').slice(-5);E.th.sec[id]=TH.defaults[d.addsec]();const at=E.sel?E.th.order.indexOf(E.sel)+1:E.th.order.length;E.th.order.splice(at,0,id);dirty();select(id);setTimeout(()=>post({op:'focus',id}),300);return}
 if(d.delsec!=null){const id=E.sel;askDel("Bu narsa o'chirilsinmi?",'<b>'+esc(TX(nameOf(E.th,id)))+'</b>',()=>{delete E.th.sec[id];E.th.order=E.th.order.filter(x=>x!==id);dirty();select(null)});return}
 if(d.addb){const sc=sec(),ty=TH.TYPES[sc.type],nb={id:TH.uid('b'),type:d.addb};ty.blocks[d.addb].fields.forEach(f=>{if(f.t==='select')nb[f.k]=f.o[0][0]});sc.b=sc.b||[];sc.b.push(nb);E.open=nb.id;dirty();pane();return}
 if(d.bdel){e.stopPropagation();const sc=sec();sc.b=sc.b.filter(x=>x.id!==d.bdel);dirty();pane();return}
 if(d.bdup){e.stopPropagation();const sc=sec(),i=sc.b.findIndex(x=>x.id===d.bdup),nb=TH.clone(sc.b[i]);nb.id=TH.uid('b');sc.b.splice(i+1,0,nb);E.open=nb.id;dirty();pane();return}
 if(d.bo){E.open=E.open===d.bo?null:d.bo;pane();return}
 if(d.sel){if(e.target.closest('[data-eye]'))return;select(d.sel);return}
 if(d.rs){const T=E.th.text[E.lang]||{};delete T[d.rs];dirty();pane();return}
 if(d.rcol){delete E.th.s.colors[d.rcol];dirty();pane();return}
 if(d.pal){E.th.s.palette=d.pal;E.th.s.colors={};dirty();pane();return}
 if(d.font){E.th.s.font=d.font;dirty();pane();return}if(d.btn){E.th.s.btn=d.btn;dirty();pane();return}if(d.surf){E.th.s.surface=d.surf;dirty();pane();return}
 if(d.up){const refs=await cmUp(d.kind,false);if(!refs.length)return;setVal(d.up,refs[0]);dirty();pane();return}
 if(d.url){const t=target(d.url),u=prompt(TX("Havola (https://… yoki media/fayl.mp4)"),(t[0]&&t[0][t[1]])||'');if(u==null)return;setVal(d.url,u.trim());dirty();pane();return}
 if(d.clr){setVal(d.clr,'');dirty();pane();return}}
document.addEventListener('change',e=>{if(!E||!e.target.matches('#te [data-on]'))return;const sc=sec();sc.on=e.target.checked;dirty();pane()});

/* ---------- sudrab tartiblash (bo'limlar va bloklar) ---------- */
function dnd(root){let drag=null,list=null;
 root.addEventListener('dragstart',e=>{const it=e.target.closest('[data-drag]');if(!it)return;drag=it.dataset.drag;list=it.closest('[data-list]');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',drag)}catch(x){}setTimeout(()=>it.classList.add('dragging'),0)});
 root.addEventListener('dragover',e=>{if(!drag)return;const it=e.target.closest('[data-drag]');if(!it||it.closest('[data-list]')!==list)return;e.preventDefault();const r=it.getBoundingClientRect(),af=e.clientY>r.top+r.height/2;
  list.querySelectorAll('.drop-a,.drop-b').forEach(x=>x.classList.remove('drop-a','drop-b'));if(it.dataset.drag!==drag)it.classList.add(af?'drop-a':'drop-b')});
 root.addEventListener('drop',e=>{if(!drag)return;e.preventDefault();const it=list&&list.querySelector('.drop-a,.drop-b');if(it){const af=it.classList.contains('drop-a'),to=it.dataset.drag,arr=list.dataset.list==='sec'?E.th.order:sec().b,key=list.dataset.list==='sec'?(x=>x):(x=>x.id);
  const from=arr.findIndex(x=>key(x)===drag),el=arr.splice(from,1)[0];let at=arr.findIndex(x=>key(x)===to)+(af?1:0);arr.splice(at,0,el);dirty();if(list.dataset.list==='sec')post({op:'focus',id:drag})}end()});
 root.addEventListener('dragend',end);
 function end(){root.querySelectorAll('.dragging,.drop-a,.drop-b').forEach(x=>x.classList.remove('dragging','drop-a','drop-b'));if(drag){drag=null;pane()}}}

/* Sozlamalar → Bo'limlar: bosh sahifa bo'limlari endi «Mavzular»da */
if(typeof ZV==='object'&&ZV.sec){const S0=ZV.sec;ZV.sec=function(B){S0(B);B.insertAdjacentHTML('afterbegin','<div class="card tt-hint"><p>'+I('palette')+'<span>'+TX("Bosh sahifadagi bloklar (Yulduzlar va mijozlar, Biz haqimizda, Taklif va boshqalar) — «Mavzular» bo'limida: yoqish/o'chirish, tartib, matn va videolar.")+'</span></p><button type="button" class="btn gold sm" data-gov>'+I('layers')+'Mavzular</button></div>');const g=B.querySelector('[data-gov]');if(g)g.addEventListener('click',e=>{e.stopPropagation();K.view('T')})}}

window.AH_TE={open:openEd,vT};
if(K.tok())K.nav(); /* sessiya tiklangan bo'lsa — menyuda «Mavzular» darhol ko'rinadi */
})();
