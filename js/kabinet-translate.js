/* ===================================================================
   ART HOUSE — KABINET: AI TARJIMA (yangi til qo'shilganda va «AI bilan tarjima» tugmasi)
   Yetishmayotgan matnlar yig'iladi va server orqali (POST /api/translate, Claude) tarjima qilinadi:
   • sayt matnlari (saytning matnlar katalogi → 'ah_cms'.text[til])
   • Instagram Reels subtitrlari ('ah_cms'.ig.reels[].cap[].t[til])
   • yulduzlar belgisi va kasbi, bo'lim sarlavhalari ('ah_cms'.stars)
   • jonli mavzuning yangi bo'limlari (sarlavha, matn, tugmalar, bloklar)
   Manba — inglizcha (bo'lmasa o'zbekcha). Server va ANTHROPIC_API_KEY bo'lmasa — tushunarli xabar.
   =================================================================== */
(function(){
const K=window.AHK,TH=window.AH_THEMES;if(!K)return;
const {CMS,cmsSave,kToast,TX,API}=K;
const clone=o=>JSON.parse(JSON.stringify(o));
const src=o=>o&&typeof o==='object'?(o.en||o.uz||''):'';
const nameOf=code=>{const x=(CMS().langs.added||[]).find(y=>y.code===code);return x?x.label:code};

/* Reels va yulduzlar: CMS'da bo'lmasa — standart ro'yxat (rasm/video yo'llari saqlanmaydi, sayt ularni id bo'yicha oladi) */
const reelsOf=c=>{const D=window.AH_IG_REELS||[],R=c.ig&&Array.isArray(c.ig.reels)?c.ig.reels:D;return clone(R).map(r=>{const d=D.find(x=>x.id&&x.id===r.id);if(d){if(r.src===d.src)r.src='';if(r.poster===d.poster)r.poster=''}return r})};
/* jonli mavzu; hali saqlanmagan bo'lsa — standart mavzu (kabinet → Mavzular bilan bir xil: id 'main') */
const thOf=c=>{const T=c.themes||{},L=Array.isArray(T.list)?T.list:[];return L.find(x=>x.id===T.live)||L[0]||null};
const starsOf=c=>{const D=(window.CFG&&CFG.AMBASSADORS)||[];return c.stars&&Array.isArray(c.stars.list)?clone(c.stars.list):D.map(a=>Object.assign(clone(a),{photo:''}))};

async function call(to,items,step){const keys=Object.keys(items),out={};
 for(let i=0;i<keys.length;i+=80){const part={};keys.slice(i,i+80).forEach(k=>part[k]=items[k]);
  const r=await fetch(API+'/api/translate',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},K.hd()),body:JSON.stringify({to,name:nameOf(to),items:part})});
  if(r.status===503)throw 'off';if(r.status===401)throw 'auth';if(!r.ok)throw 'ai';
  Object.assign(out,(await r.json()).items||{});step(Math.min(keys.length,i+80),keys.length)}
 return out}

/* langs — tarjima qilinadigan tillar; o.parts — ['site','ig','stars','theme'] (standart — hammasi) */
async function autoTr(langs,o){o=o||{};const parts=o.parts||['site','ig','stars','theme'];
 if(!API){kToast(TX("AI tarjima uchun sayt server bilan ishlashi va serverda ANTHROPIC_API_KEY bo'lishi kerak (README → «AI tarjima»)."));return false}
 const S=parts.includes('site')?await K.cmSnap():{};let done=0;
 for(const to of langs){if(to==='uz'||to==='cy')continue;
  const c0=CMS(),items={},reels=reelsOf(c0),stars=starsOf(c0),fresh=TH&&!thOf(c0)?Object.assign(TH.newTheme('Art House — Zumrad'),{id:'main'}):null,th=TH?thOf(c0)||fresh:null;
  if(parts.includes('site')&&S.cat){const have=(c0.text||{})[to]||{};Object.keys(S.cat).forEach(k=>{const v=S.cat[k]||{};if(have[k]==null&&(!v[to]||v[to]===v.en&&to!=='en'))items['t|'+k]=v.en||v.uz})}
  if(parts.includes('ig'))reels.forEach((r,i)=>(r.cap||[]).forEach((cu,j)=>{if(cu.t&&!cu.t[to]&&src(cu.t))items['r|'+i+'|'+j]=src(cu.t)}));
  if(parts.includes('stars')){stars.forEach((a,i)=>['badge','role'].forEach(f=>{const v=a[f];if(v&&typeof v==='object'&&!v[to]&&src(v))items['s|'+i+'|'+f]=src(v)}));
   const st=c0.stars||{};['title','sub'].forEach(f=>{if(st[f]&&!st[f][to]&&src(st[f]))items['S|'+f]=src(st[f])})}
  if(parts.includes('theme')&&th)Object.keys(th.sec||{}).forEach(id=>{const sc=th.sec[id];if(!sc||sc.type==='native')return;
   Object.keys(sc.s||{}).forEach(f=>{const v=sc.s[f];if(v&&typeof v==='object'&&'uz' in v&&!v[to]&&src(v))items['h|'+id+'|s|'+f]=src(v)});
   (sc.b||[]).forEach((bl,bi)=>Object.keys(bl).forEach(f=>{const v=bl[f];if(v&&typeof v==='object'&&'uz' in v&&!v[to]&&src(v))items['h|'+id+'|b|'+bi+'|'+f]=src(v)}))});
  const n=Object.keys(items).length;if(!n)continue;
  kToast(TT2("AI tarjima ({lang}): {n} ta matn…",{lang:to.toUpperCase(),n}));
  let res;try{res=await call(to,items,(a,b)=>{if(b>80)kToast(TT2("AI tarjima ({lang}): {a} / {b}",{lang:to.toUpperCase(),a,b}))})}
  catch(e){kToast(TX(e==='off'?"Serverda AI sozlanmagan (ANTHROPIC_API_KEY). Tarjimani qo'lda yoki JSON fayl bilan kiriting.":e==='auth'?"Sessiya tugagan — qaytadan kiring.":"AI tarjima bo'lmadi — keyinroq qayta urinib ko'ring."));return false}
  /* natijalar eng so'nggi CMS ustiga yoziladi (tarjima paytida boshqa o'zgarish bo'lgan bo'lishi mumkin) */
  const c=CMS(),R2=reelsOf(c),A2=starsOf(c);let ig=0,sa=0,th2=th&&thOf(c);
  if(th&&!th2&&fresh&&Object.keys(res).some(x=>x[0]==='h')){c.themes={live:fresh.id,list:[fresh]};th2=fresh}
  Object.keys(res).forEach(key=>{const v=res[key],p=key.split('|');
   if(p[0]==='t'){c.text[to]=c.text[to]||{};c.text[to][key.slice(2)]=v}
   else if(p[0]==='r'){const cu=((R2[+p[1]]||{}).cap||[])[+p[2]];if(cu&&cu.t){cu.t[to]=v;ig=1}}
   else if(p[0]==='s'){const a=A2[+p[1]];if(a&&a[p[2]]&&typeof a[p[2]]==='object'){a[p[2]][to]=v;sa=1}}
   else if(p[0]==='S'){c.stars=c.stars||{};c.stars[p[1]]=Object.assign({},c.stars[p[1]]||{},{[to]:v})}
   else if(p[0]==='h'&&th2){const sc=th2.sec[p[1]];if(!sc)return;const o2=p[2]==='s'?(sc.s||{})[p[3]]:((sc.b||[])[+p[3]]||{})[p[4]];if(o2&&typeof o2==='object')o2[to]=v}});
  if(ig)c.ig=Object.assign({},c.ig||{},{reels:R2});
  if(sa)c.stars=Object.assign({},c.stars||{},{list:A2});
  if(th2)th2.at=Date.now();
  cmsSave(c,"AI bilan tarjima qilindi",nameOf(to)+' · '+Object.keys(res).length);done+=Object.keys(res).length}
 if(done)kToast(TT2("Tarjima tayyor: {n} ta matn. Tekshirib, kerak bo'lsa tuzating.",{n:done}));
 else if(!o.auto)kToast(TX("Tarjima qilinadigan yangi matn yo'q — hammasi allaqachon tarjima qilingan."));
 return true}
const TT2=(s,o)=>K.TT?K.TT(s,o):String(s).replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m);
K.autoTr=autoTr;
})();
