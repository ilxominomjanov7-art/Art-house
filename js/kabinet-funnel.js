/* ===================================================================
   ART HOUSE — KABINET: «SOTUV OYNALARI» (saytdagi qalqib chiquvchi oynalar va afzalliklar lentasi)
   • Qachon chiqadi: oynalarni yoqish/o'chirish, kutish (soniya), surish (ekran), ikkinchi oyna oralig'i,
     yopilgandan keyin necha kun chiqmasligi, bir tashrifdagi eng ko'p soni, lenta tezligi.
   • Taklif oynasi: summa (avtomatik yoki qo'lda), karta yozuvlari, kompyuterdagi rasm, yulduzlar qatori,
     ishonch qatorlari (ikonka yoki rasm + matn 8 tilda), barcha matnlar 8 tilda.
   • Kalkulyator oynasi: barcha matnlar 8 tilda.
   • Afzalliklar lentasi: bandlar (ikonka yoki rasm, sarlavha va matn 8 tilda), tartib, yashirish, qo'shish, o'chirish.
   Har qismda «Asliga qaytarish» — standart holat (js/funnel-dict.js). Saqlash: 'ah_cms'.funnel — sayt sahifani
   qayta yuklamasdan darhol yangilanadi (js/theme.js → js/funnel.js).
   =================================================================== */
(function(){
const K=window.AHK,TH=window.AH_THEMES,FD=window.AH_FD;if(!K||!TH||!FD)return;
const {CMS,cmsSave,cmCan,own,refURL,cmUp,askDel,kToast,esc,I,ICN,TX,NG}=K;
const $=id=>document.getElementById(id);
const L8=TH.LANGS,LN={uz:"O'zbekcha",ru:'Русский',en:'English',fr:'Français',it:'Italiano',es:'Español',de:'Deutsch',tr:'Türkçe'};
const can=()=>own()||cmCan('cms');
const clone=o=>JSON.parse(JSON.stringify(o));
Object.assign(ICN,{gift:ICN.gift||'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
 undo:ICN.undo||'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',eye:ICN.eye||'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
 list:ICN.list||'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',clock:ICN.clock||'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 sparkle:ICN.sparkle||'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',dot:ICN.dot||'<circle cx="12" cy="12" r="4"/>',calc:ICN.calc||'<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M16 14v4M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/>'});
const SV=n=>'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(FD.icons[n]||FD.icons.check)+'</svg>';
/* standart matn (shu tilda, {o'rinbosarlar} bilan) */
const raw=(k,l)=>{const d=(window.I18N&&I18N.dict)||{};return (d[l]&&d[l][k])||(d.uz&&d.uz[k])||''};
const mlOf=k=>{const o={};L8.forEach(l=>{const v=raw(k,l);if(v)o[l]=v});return o};
const pk=(o,l)=>o&&typeof o==='object'?(o[l]||o.uz||''):'';
/* ro'yxatda ko'rinishi: {years}, {down}, {months} o'rniga hozirgi qiymatlar */
const fillK=s=>String(s||'').replace(/\{(years|down|months)\}/g,(m,k)=>k==='years'?CFG.EXPERIENCE_YEARS:k==='down'?CFG.DOWN_MIN+'%':Math.max.apply(null,CFG.MONTHS));

/* ---------- ma'lumot ---------- */
const FN=()=>clone(CMS().funnel||{});
function put(f,act,det){const c=CMS();const clean=o=>{Object.keys(o).forEach(k=>{if(o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k])){clean(o[k]);if(!Object.keys(o[k]).length)delete o[k]}});return o};
 c.funnel=clean(f);if(!Object.keys(c.funnel).length)delete c.funnel;return cmsSave(c,act,det||'')}
/* ro'yxat (ishonch qatorlari / lenta): kabinetda birinchi tahrirda standart bandlar 8 tildagi matni bilan nusxalanadi */
const items=(f,kind)=>{const cur=kind==='trust'?(f.offer||{}).trust:(f.usp||{}).items;if(Array.isArray(cur))return clone(cur);
 return (kind==='trust'?FD.trust:FD.usp).map(x=>kind==='trust'?{id:x.id,on:true,icon:x.icon,img:'',t:mlOf(x.k)}:{id:x.id,on:true,icon:x.icon,img:'',t:mlOf(x.k+'t'),d:mlOf(x.k+'d')})};
const setItems=(f,kind,L)=>{if(kind==='trust'){f.offer=f.offer||{};f.offer.trust=L}else{f.usp=f.usp||{};f.usp.items=L}};
function liveTh(c){c.themes=c.themes||{};const T=c.themes;T.list=Array.isArray(T.list)?T.list:[];
 if(!T.list.length){const th=TH.newTheme('Art House — Zumrad');th.id='main';T.list.push(th);T.live='main'}
 return T.list.find(x=>x.id===T.live)||T.list[0]}
const uspOn=()=>{const th=liveTh(CMS());return !(th.sec&&th.sec.usp&&th.sec.usp.on===false)};
/* taklifdagi avtomatik summa: eng arzon xonadon × eng kam boshlang'ich foiz */
const autoDown=()=>{let m=Infinity;(window.PROJECTS||[]).forEach(p=>(p.plans||[]).forEach(pl=>{m=Math.min(m,Math.min(500000,Math.max(20000,Math.round(pl.area*(p.priceM2||CFG.PRICE_M2)/100)*100)))}));return isFinite(m)?Math.round(m*CFG.DOWN_MIN/100):0};
const usd=n=>'$'+Math.round(n).toLocaleString('en-US').replace(/,/g,' ');

/* ---------- menyu: Sayt → Sotuv oynalari ---------- */
const G=NG.find(g=>g[0]==='Sayt');const ITEM=['PP','gift','Sotuv oynalari',()=>cmCan('cms')];
if(G)G[1].push(ITEM);else NG.splice(Math.max(0,NG.length-1),0,['Sayt',[ITEM]]);
K.addView('PP',()=>vPP());

let LG='uz',TAB='rules'; /* tanlangan til va bo'lim */
const tabs=(cur,attr,f)=>'<div class="st-tabs" role="tablist">'+L8.map(l=>'<button type="button" role="tab" '+attr+'="'+l+'" aria-selected="'+(l===cur)+'" title="'+LN[l]+'">'+l.toUpperCase()+(f&&f(l)?'<i></i>':'')+'</button>').join('')+'</div>';
const num=(k,lab,v,min,max,step,hint)=>'<label class="cm-f"><b>'+lab+'</b><input class="nt9" type="number" data-rule="'+k+'" value="'+esc(v)+'" min="'+min+'" max="'+max+'" step="'+step+'"><small class="note">'+hint+'</small></label>';
const sw=(k,lab,on,hint,attr)=>'<label class="cm-sw1"><input type="checkbox" '+(attr||'data-rule')+'="'+k+'"'+(on?' checked':'')+'><i></i><span><b>'+lab+'</b>'+(hint?'<small>'+hint+'</small>':'')+'</span></label>';

function vPP(){const mn=$('mn');if(!can()){mn.innerHTML='<h2>Sotuv oynalari</h2><div class="card">'+TX("Bu bo'lim uchun ruxsat yo'q.")+'</div>';return}
 const f=FN(),R=Object.assign({},FD.rules,f.rules||{}),O=f.offer||{},T=f.text||{};
 const seg='<div class="fn-seg" role="tablist">'+[['rules','clock','Qachon chiqadi'],['offer','gift','Taklif oynasi'],['calc','calc','Kalkulyator oynasi'],['usp','list','Afzalliklar lentasi']].map(x=>'<button type="button" role="tab" data-tab="'+x[0]+'" aria-selected="'+(TAB===x[0])+'">'+I(x[1])+'<span>'+x[2]+'</span></button>').join('')+'</div>';
 const reset=(k,lab)=>'<button type="button" class="btn ghost sm" data-reset="'+k+'">'+I('undo')+(lab||'Asliga qaytarish')+'</button>';
 const texts=(group)=>{const keys=FD.keys[group];return '<div class="card"><div class="tt-h"><div><h3>Matnlar</h3><p class="note">Har bir til alohida. Bo\'sh qoldirilsa — standart matn chiqadi (kulrang yozuv). {qavs ichidagilar} o\'zi qo\'yiladi.</p></div>'+reset('text-'+group,"Matnlarni asliga qaytarish")+'</div>'+
  tabs(LG,'data-lg',l=>keys.some(k=>T[k[0]]&&T[k[0]][l]))+'<div class="fn-texts">'+keys.map(k=>{const v=(T[k[0]]||{})[LG]||'',ph=raw(k[0],LG),long=ph.length>60;
   return '<label class="cm-f"><b>'+esc(TX(k[1]))+(v?'<i class="fn-chg">'+TX("o'zgartirilgan")+'</i>':'')+'</b>'+(long?'<textarea class="nt9" rows="2" data-tk="'+k[0]+'" placeholder="'+esc(ph)+'">'+esc(v)+'</textarea>':'<input class="nt9" data-tk="'+k[0]+'" value="'+esc(v)+'" placeholder="'+esc(ph)+'">')+'</label>'}).join('')+'</div>'+
  '<div class="xa"><button type="button" class="btn gold sm" data-savetext="'+group+'">'+I('check')+'Saqlash</button></div></div>'};
 const listCard=(kind)=>{const L=items(f,kind),cust=kind==='trust'?Array.isArray(O.trust):Array.isArray((f.usp||{}).items);
  return '<div class="card"><div class="tt-h"><div><h3>'+(kind==='trust'?'Ishonch qatorlari':'Lenta bandlari')+'</h3><p class="note">'+(kind==='trust'?"Kartaning ostidagi 3 ta qisqa qator. Ikonka tanlang yoki o'z rasmingizni yuklang.":"Saytda shu tartibda ko'rinadi. Har bandga ikonka yoki rasm, sarlavha va matn (8 tilda).")+'</p></div>'+
   '<div class="xa"><button type="button" class="btn gold sm" data-iadd="'+kind+'">'+I('plus')+'Qo\'shish</button>'+(cust?reset(kind):'')+'</div></div>'+
   '<div class="fn-items">'+L.map((x,i)=>'<div class="fn-it'+(x.on===false?' off':'')+'"><span class="fn-ico">'+(x.img?'<img data-fref="'+esc(x.img)+'" alt="">':SV(x.icon))+'</span><div class="fn-tx"><b class="nt9">'+esc(fillK(pk(x.t,LANG==='cy'?'uz':LANG))||'—')+'</b>'+(kind==='usp'?'<small class="nt9">'+esc(fillK(pk(x.d,LANG==='cy'?'uz':LANG)))+'</small>':'')+(x.on===false?'<em>'+I('eyeoff')+TX('Saytda yashirilgan')+'</em>':'')+'</div>'+
    '<div class="st-act"><button type="button" class="te-ib" data-iup="'+kind+':'+i+'" aria-label="'+TX('Yuqoriga')+'"'+(i?'':' disabled')+'>'+I('up')+'</button><button type="button" class="te-ib" data-idn="'+kind+':'+i+'" aria-label="'+TX('Pastga')+'"'+(i<L.length-1?'':' disabled')+'>'+I('down')+'</button>'+
    '<button type="button" class="te-ib" data-ieye="'+kind+':'+i+'" aria-label="'+TX(x.on===false?"Saytda ko'rsatish":'Saytda yashirish')+'">'+I(x.on===false?'eyeoff':'eye')+'</button><button type="button" class="btn ghost sm" data-ied="'+kind+':'+i+'">'+I('edit')+'Tahrirlash</button>'+
    '<button type="button" class="te-ib dl" data-idel="'+kind+':'+i+'" aria-label="'+TX("O'chirish")+'">'+I('trash')+'</button></div></div>').join('')+'</div></div>'};
 let body='';
 if(TAB==='rules')body='<div class="card"><div class="tt-h"><div><h3>Qachon chiqadi</h3><p class="note">Oynalar kirgan zahoti chiqmaydi: mijoz saytni ko\'rib, harakat qilgandan keyin. Ariza qoldirgan mijozga umuman chiqmaydi.</p></div>'+reset('rules')+'</div>'+
  '<div class="fn-sw">'+sw('offer','Taklif oynasi (kalit-karta)',R.offer!==false,"Mijoz kartani suradi, boshlang'ich to'lov ochiladi, ism va telefon qoldiradi")+sw('calc',"Bo'lib to'lash kalkulyatori oynasi",R.calc!==false,'Taklif yopilgandan keyin chiqadi')+sw('exit','Kompyuterda: sichqoncha sahifadan chiqayotganda',R.exit!==false,'Birinchi oyna biroz erta chiqadi')+'</div>'+
  '<div class="fn-g3">'+num('delay','Kutish (soniya)',R.delay,0,600,1,'Saytga kirgandan keyin')+num('screens','Surish (ekran)',R.screens,0,20,0.1,'Mijoz qancha pastga surgandan keyin')+num('gap',"Ikkinchi oyna (soniya)",R.gap,0,3600,5,'Birinchisi yopilgandan keyin')+
  num('days','Qayta chiqmaydi (kun)',R.days,0,365,1,'Mijoz oynani yopsa')+num('max','Bir tashrifda ko\'pi bilan',R.max,0,2,1,'0 — oynalar o\'zi chiqmaydi')+num('speed','Lenta tezligi (soniya)',R.speed,2,30,0.5,'Telefonda bandlar almashishi')+'</div>'+
  '<div class="xa"><button type="button" class="btn gold sm" data-saverules>'+I('check')+'Saqlash</button></div></div>';
 else if(TAB==='offer')body='<div class="card"><div class="tt-h"><div><h3>Summa va karta</h3><p class="note">Kartani surganda ochiladigan summa va kartadagi yozuvlar.</p></div>'+reset('offer')+'</div>'+
  '<div class="fn-g2"><label class="cm-f"><b>Boshlang\'ich to\'lov (summa, $)</b><input class="nt9" type="number" min="0" step="10" data-of="amount" value="'+esc(O.amount||'')+'" placeholder="'+esc(autoDown())+'"><small class="note">'+TX("Bo'sh qoldirilsa — avtomatik")+': '+usd(autoDown())+' ('+TX("eng arzon xonadon × eng kam foiz")+')</small></label>'+
  '<label class="cm-f"><b>Kartadagi nom</b><input class="nt9" data-of="brand" maxlength="24" value="'+esc(O.brand||'')+'" placeholder="ART HOUSE"></label>'+
  '<label class="cm-f"><b>Kartadagi raqam</b><input class="nt9" data-of="no" maxlength="16" value="'+esc(O.no||'')+'" placeholder="No '+esc(CFG.FOUNDED||2012)+'"></label>'+
  sw('proof',"Yulduzlar qatori («… Art House'ni tanladi»)",O.proof!==false,"Yulduzlar bo'limidagi rasmlar va ismlar",'data-ofb')+'</div>'+
  '<div class="fn-pic"><div class="fn-ph"><img id="fnPic" alt=""></div><div><b>Kompyuterdagi rasm</b><p class="note">Oynaning chap tomonidagi katta rasm (telefonda ko\'rinmaydi). Tik rasm yaxshi chiqadi.</p><div class="xa"><button type="button" class="btn ghost sm" data-ofimg>'+I('upload')+'Rasm yuklash</button>'+(O.img?'<button type="button" class="btn ghost sm" data-ofimg0>'+I('undo')+'Asl rasm</button>':'')+'</div></div></div>'+
  '<div class="xa"><button type="button" class="btn gold sm" data-saveoffer>'+I('check')+'Saqlash</button></div></div>'+listCard('trust')+texts('offer');
 else if(TAB==='calc')body='<div class="card"><p class="note" style="margin:0">'+TX("Kalkulyatordagi xonadonlar, narx, boshlang'ich foiz va muddatlar — Sozlamalar va Xonadonlar bo'limidan olinadi. Bu yerda — oynaning matnlari.")+'</p></div>'+texts('calc');
 else body='<div class="card"><div class="tt-h"><div><h3>Afzalliklar lentasi</h3><p class="note">Bosh banner ostidagi aylanadigan qator. Telefonda bittadan almashadi, kompyuterda bir qatorda.</p></div></div>'+sw('usp',"Lenta saytda ko'rinadi",uspOn(),"Mavzular bo'limidagi «Afzalliklar lentasi» bilan bir xil",'data-uspon')+'</div>'+listCard('usp');
 mn.innerHTML='<div class="hh"><div><h2>Sotuv oynalari</h2><p class="lead">Saytdagi qalqib chiquvchi oynalar va afzalliklar lentasi: qachon chiqishi, matnlar, rasmlar va ikonkalar. O\'zgarish saytda darhol ko\'rinadi.</p></div><div class="xa"><a class="btn ghost sm" href="index.html?pp=offer" target="_blank" rel="noopener">'+I('eye')+'Taklif oynasini ko\'rish</a><a class="btn ghost sm" href="index.html?pp=calc" target="_blank" rel="noopener">'+I('eye')+'Kalkulyatorni ko\'rish</a></div></div>'+seg+body+
  '<p class="note fn-ai">'+I('sparkle')+'<span>'+TX("Yangi til qo'shilganda bu yerdagi matnlar ham AI bilan tarjima qilinadi (Sozlamalar → Tillar).")+'</span></p>';
 mn.querySelectorAll('img[data-fref]').forEach(el=>refURL(el.dataset.fref).then(u=>{if(u)el.src=u}));
 const pic=$('fnPic');if(pic){const r=O.img||(window.PROJECTS&&PROJECTS[0]&&PROJECTS[0].cover)||'';refURL(r).then(u=>{if(u)pic.src=u})}
 mn.onchange=e=>{const x=e.target.closest('[data-uspon]');if(!x)return;const c=CMS(),th=liveTh(c);th.sec=th.sec||{};th.sec.usp=Object.assign({type:'native'},th.sec.usp||{},{on:x.checked});th.at=Date.now();cmsSave(c,x.checked?"Bo'lim yoqildi":"Bo'lim o'chirildi",'Afzalliklar lentasi')};
 mn.onclick=async e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  const keepText=()=>{const f2=FN();f2.text=f2.text||{};mn.querySelectorAll('[data-tk]').forEach(x=>{const k=x.dataset.tk,v=x.value.trim();f2.text[k]=f2.text[k]||{};if(v)f2.text[k][LG]=v;else delete f2.text[k][LG]});return f2};
  if(d.tab){TAB=d.tab;vPP();return}
  if(d.lg){const f2=keepText();const c=CMS();c.funnel=f2;try{localStorage.setItem('ah_cms',JSON.stringify(c))}catch(x){}LG=d.lg;vPP();return} /* til almashganda yozilgan matn yo'qolmaydi */
  if(d.savetext){if(put(keepText(),"Sotuv oynasi matnlari o'zgartirildi",(d.savetext==='offer'?'Taklif':'Kalkulyator')+' · '+LG.toUpperCase()))vPP();return}
  if(d.saverules!=null){const f2=FN();f2.rules=f2.rules||{};mn.querySelectorAll('[data-rule]').forEach(x=>{const k=x.dataset.rule;if(x.type==='checkbox'){if(x.checked===(FD.rules[k]!==false))delete f2.rules[k];else f2.rules[k]=x.checked}else{const v=parseFloat(x.value);if(!isFinite(v)||v===FD.rules[k])delete f2.rules[k];else f2.rules[k]=Math.max(+x.min,Math.min(+x.max,v))}});
   if(put(f2,"Sotuv oynalari qoidalari o'zgartirildi"))vPP();return}
  if(d.saveoffer!=null){const f2=FN();f2.offer=f2.offer||{};mn.querySelectorAll('[data-of]').forEach(x=>{const k=x.dataset.of,v=x.value.trim();if(k==='amount'){const n=Math.round(+v);if(n>0)f2.offer.amount=n;else delete f2.offer.amount}else if(v)f2.offer[k]=v;else delete f2.offer[k]});
   const pb=mn.querySelector('[data-ofb="proof"]');if(pb){if(pb.checked)delete f2.offer.proof;else f2.offer.proof=false}
   if(put(f2,"Taklif oynasi o'zgartirildi"))vPP();return}
  if(d.ofimg!=null){const r=await cmUp('image');if(r[0]){const f2=FN();f2.offer=f2.offer||{};f2.offer.img=r[0];if(put(f2,"Taklif oynasi rasmi o'zgartirildi"))vPP()}return}
  if(d.ofimg0!=null){const f2=FN();if(f2.offer)delete f2.offer.img;if(put(f2,'Taklif oynasi rasmi asliga qaytarildi'))vPP();return}
  if(d.reset){const k=d.reset,lab={rules:'Qachon chiqadi',offer:'Summa va karta',trust:'Ishonch qatorlari',usp:'Lenta bandlari','text-offer':'Taklif oynasi matnlari','text-calc':'Kalkulyator oynasi matnlari'}[k]||k;
   askDel(TX('Asliga qaytarilsinmi?'),'<b class="nt9">'+esc(TX(lab))+'</b><br><small>'+TX("Kabinetda kiritilgan o'zgarishlar o'chadi, standart holat tiklanadi.")+'</small>',()=>{const f2=FN();
    if(k==='rules')delete f2.rules;else if(k==='offer'){const tr=f2.offer&&f2.offer.trust;f2.offer=tr?{trust:tr}:{}}else if(k==='trust'){if(f2.offer)delete f2.offer.trust}else if(k==='usp'){if(f2.usp)delete f2.usp.items}
    else if(k.indexOf('text-')===0&&f2.text){FD.keys[k.slice(5)].forEach(x=>delete f2.text[x[0]])}
    if(put(f2,'Asliga qaytarildi',TX(lab)))vPP()});return}
  const ix=v=>{const p=String(v).split(':');return[p[0],+p[1]]};
  if(d.iadd){edit(d.iadd,-1);return}
  if(d.ied){const[k,i]=ix(d.ied);edit(k,i);return}
  if(d.iup!=null||d.idn!=null){const[k,i]=ix(d.iup||d.idn),f2=FN(),L=items(f2,k),j=d.iup?i-1:i+1;if(j<0||j>=L.length)return;[L[i],L[j]]=[L[j],L[i]];setItems(f2,k,L);put(f2,"Tartib o'zgartirildi",TX(k==='trust'?'Ishonch qatorlari':'Lenta bandlari'));vPP();return}
  if(d.ieye){const[k,i]=ix(d.ieye),f2=FN(),L=items(f2,k);L[i].on=L[i].on===false;setItems(f2,k,L);put(f2,L[i].on?"Saytda ko'rsatildi":'Saytda yashirildi',pk(L[i].t,'uz'));vPP();return}
  if(d.idel){const[k,i]=ix(d.idel),L0=items(FN(),k);askDel("Bu narsa o'chirilsinmi?",'<b class="nt9">'+esc(pk(L0[i].t,'uz'))+'</b>',()=>{const f2=FN(),L=items(f2,k);L.splice(i,1);setItems(f2,k,L);put(f2,"O'chirildi",pk(L0[i].t,'uz'));vPP()});return}}}

/* ---------- band tahriri: ikonka yoki rasm, matnlar 8 tilda ---------- */
function edit(kind,idx){const f=FN(),L=items(f,kind),isNew=idx<0;
 const it=isNew?{id:(kind==='trust'?'t':'u')+Date.now().toString(36),on:true,icon:'star',img:'',t:{},d:{}}:clone(L[idx]);it.t=it.t||{};if(kind==='usp')it.d=it.d||{};
 let l=L8.includes(LANG)?LANG:'uz';
 const m=document.createElement('div');m.className='dlg st-dlg';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 const draw=()=>{m.innerHTML='<form class="st-box fn-box" novalidate><div class="tt-h"><h3>'+TX(isNew?"Qo'shish":'Tahrirlash')+' · '+TX(kind==='trust'?'Ishonch qatori':'Lenta bandi')+'</h3><button type="button" class="te-ib" data-x aria-label="'+TX('Yopish')+'">'+I('x')+'</button></div>'+
  '<b class="cm-sb">'+TX('Ikonka')+'</b><div class="fn-icons" role="radiogroup">'+Object.keys(FD.iconNames).map(n=>'<button type="button" role="radio" data-ic="'+n+'" aria-checked="'+(!it.img&&it.icon===n)+'" title="'+esc(TX(FD.iconNames[n]))+'">'+SV(n)+'</button>').join('')+'</div>'+
  '<div class="fn-pic sm"><div class="fn-ph"><img id="fnItImg" alt=""></div><div><p class="note">'+TX("Yoki o'z rasmingiz (PNG/SVG, shaffof fon, kvadrat)")+'</p><div class="xa"><button type="button" class="btn ghost sm" data-up>'+I('upload')+'Rasm yuklash</button>'+(it.img?'<button type="button" class="btn ghost sm" data-up0>'+I('undo')+'Ikonkaga qaytish</button>':'')+'</div></div></div>'+
  '<div class="st-tabs" role="tablist">'+L8.map(x=>'<button type="button" role="tab" data-tl="'+x+'" aria-selected="'+(x===l)+'" title="'+LN[x]+'">'+x.toUpperCase()+((it.t[x]||(it.d||{})[x])?'<i></i>':'')+'</button>').join('')+'</div>'+
  '<label class="cm-f"><b><span>'+TX(kind==='trust'?'Matn':'Sarlavha')+'</span> <i class="st-lg">'+l.toUpperCase()+'</i></b><input class="nt9" data-ml="t" maxlength="80" value="'+esc(it.t[l]||'')+'" placeholder="'+esc(l==='uz'?'':it.t.uz||'')+'"></label>'+
  (kind==='usp'?'<label class="cm-f"><b><span>'+TX('Matn')+'</span> <i class="st-lg">'+l.toUpperCase()+'</i></b><textarea class="nt9" rows="2" data-ml="d" maxlength="200" placeholder="'+esc(l==='uz'?'':it.d.uz||'')+'">'+esc(it.d[l]||'')+'</textarea></label>':'')+
  '<p class="note">'+TX("To'ldirilmagan tillarda o'zbekcha matn ko'rinadi. {years}, {down}, {months} — o'zi qo'yiladi.")+'</p><p class="note st-err" hidden></p>'+
  '<div class="xa"><button type="submit" class="btn gold">'+I('check')+'Saqlash</button><button type="button" class="btn ghost" data-x>Bekor qilish</button></div></form>';
  const im=m.querySelector('#fnItImg');if(it.img)refURL(it.img).then(u=>{if(u)im.src=u});else im.classList.add('cm-noimg')};
 const keep=()=>m.querySelectorAll('[data-ml]').forEach(x=>{const v=x.value.trim(),o=it[x.dataset.ml];if(v)o[l]=v;else delete o[l]});
 const close=()=>{m.remove();document.removeEventListener('keydown',k1)},k1=e=>{if(e.key==='Escape')close()};
 draw();document.body.appendChild(m);document.addEventListener('keydown',k1);setTimeout(()=>{const n=m.querySelector('[data-ml="t"]');n&&n.focus()},50);
 m.addEventListener('click',async e=>{if(e.target===m){close();return}const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.x!=null){close();return}
  if(d.ic){keep();it.icon=d.ic;it.img='';draw();return}
  if(d.tl){keep();l=d.tl;draw();return}
  if(d.up!=null){keep();const r=await cmUp('image');if(r[0]){it.img=r[0];draw()}return}
  if(d.up0!=null){keep();it.img='';draw();return}});
 m.addEventListener('submit',e=>{e.preventDefault();keep();const er=m.querySelector('.st-err');
  if(!it.t.uz){er.hidden=false;er.textContent=TX("O'zbekcha matn majburiy.");return}
  const f2=FN(),L2=items(f2,kind);if(isNew)L2.push(it);else L2[idx]=it;setItems(f2,kind,L2);
  if(put(f2,isNew?"Qo'shildi":"O'zgartirildi",(kind==='trust'?'Ishonch qatori':'Lenta bandi')+' · '+it.t.uz)){close();vPP()}});
}

if(K.tok()&&K.VW()==='PP')K.nav();
})();
