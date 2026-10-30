/* ===================================================================
   ART HOUSE — KABINET: VIDEO YO'RIQNOMA (8 til, ovozli)
   • Menyuda «Yordam → Video yo'riqnoma»: kabinet qaysi tilda bo'lsa, video
     ham o'sha tilda ochiladi (o'zbek kirill → o'zbekcha). Boshqa tilni ham tanlash mumkin.
   • Boblar ro'yxati (js/guide-chapters.js) — bosilganda video o'sha joyga o'tadi.
   • Kirish oynasida «Video yo'riqnoma» tugmasi: telefonda — telefondan kirish,
     kompyuterda — kompyuterdan kirish bobidan boshlanadi.
   Videolar: guide/kabinet-<til>.mp4 (kabinet.html bilan bir papkada; topilmasa — bir pog'ona yuqoridagi guide/, ya'ni dist/ uchun).
   =================================================================== */
(function(){
const K=window.AHK;if(!K)return;
const {NG,I,I2,ICN,esc,TX,AD}=K;
const L8=['uz','ru','en','fr','it','es','de','tr'],LN={uz:"O'zbekcha",ru:'Русский',en:'English',fr:'Français',it:'Italiano',es:'Español',de:'Deutsch',tr:'Türkçe'};
const G=()=>window.AH_GUIDE||{};
const kl=()=>{const l=typeof LANG==='string'?LANG:'uz';return l==='cy'?'uz':L8.includes(l)?l:'en'};
const src=l=>'guide/kabinet-'+l+'.mp4';
const mmss=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
if(!ICN.play2)ICN.play2='<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>';
if(!ICN.x)ICN.x='<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
let VL=null; /* foydalanuvchi tanlagan video tili (bo'lmasa — kabinet tili) */

/* video + boblar: bo'lim sahifasida ham, kirish oynasidagi oynada ham ishlatiladi */
function player(box,l,startCh){const C=(G()[l]||{}).ch||[];
 box.innerHTML='<div class="gd"><div class="gd-v"><video controls playsinline preload="metadata" src="'+src(l)+'"></video><p class="gd-miss" hidden>'+I('alert')+'<span>Video fayli topilmadi. «guide» papkasini kabinet.html bilan bir joyga qo\'ying (README → «Video yo\'riqnoma»).</span></p></div>'+
  '<aside class="gd-side"><div class="gd-langs" role="group" aria-label="Video tili">'+L8.map(x=>'<button type="button" data-gl="'+x+'" aria-pressed="'+(x===l)+'"><b>'+x.toUpperCase()+'</b><span class="nt9">'+LN[x]+'</span></button>').join('')+'</div>'+
  (C.length?'<p class="gd-h">Boblar</p><ol class="gd-ch">'+C.map((c,i)=>'<li><button type="button" data-gt="'+c.t+'" data-gi="'+i+'"><em>'+mmss(c.t)+'</em><span class="nt9">'+esc(c.title)+'</span></button></li>').join('')+'</ol>':'')+'</aside></div>';
 const v=box.querySelector('video'),ol=box.querySelector('.gd-ch');
 v.addEventListener('error',()=>{if(!v.dataset.fb){v.dataset.fb=1;v.src='../'+src(l);return}box.querySelector('.gd-miss').hidden=false;v.hidden=true}); /* dist/kabinet.html → ../guide/ */
 v.addEventListener('timeupdate',()=>{if(!ol)return;let k=-1;C.forEach((c,i)=>{if(v.currentTime+.4>=c.t)k=i});ol.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===k))});
 if(startCh){const c=C.find(x=>x.id===startCh);if(c)v.addEventListener('loadedmetadata',()=>{v.currentTime=c.t},{once:true})}
 box.querySelector('.gd').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.gt!=null){v.currentTime=+b.dataset.gt;const p=v.play();if(p&&p.catch)p.catch(()=>{});return}
  if(b.dataset.gl){VL=b.dataset.gl;const t=v.currentTime,ch=C.filter(c=>t+.4>=c.t).pop();player(box,VL,ch&&ch.id)}});
 return v}

/* ---------- menyu: «Yordam → Video yo'riqnoma» (barcha xodimlar uchun) ---------- */
NG.push(['Yordam',[['Y','play2',"Video yo'riqnoma"]]]);
K.addView('Y',vY);
function vY(){const mn=document.getElementById('mn'),l=VL||kl(),d=(G()[l]||{}).dur;
 mn.innerHTML='<div class="hh"><div><h2>Video yo\'riqnoma</h2><p class="lead"><span>Telefon va kompyuterdan kirish, kabinetning barcha bo\'limlari va sozlamalari</span>'+(d?' — '+Math.round(d/60)+' '+TX('daqiqa'):'')+'. <span>Video kabinet tilida ochiladi; boshqa tilni o\'ngdan tanlang.</span></p></div></div><div class="card gd-card" id="gdBox"></div>';
 player(document.getElementById('gdBox'),l)}
addEventListener('langchange',()=>{VL=null;if(K.VW()==='Y'&&K.tok())vY()});

/* ---------- kirish oynasida: «Video yo'riqnoma» ---------- */
function modal(){const l=kl(),m=document.createElement('div');m.className='dlg gd-dlg';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="gd-box"><button type="button" class="gd-x" aria-label="Yopish">'+I('x')+'</button><div class="gd-mb"></div></div>';
 document.body.appendChild(m);const v=player(m.querySelector('.gd-mb'),l,matchMedia('(max-width:820px)').matches?'login-phone':'login-desktop');
 const close=()=>{m.remove();document.removeEventListener('keydown',esc1)},esc1=e=>{if(e.key==='Escape')close()};
 m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.gd-x'))close()});document.addEventListener('keydown',esc1);
 const p=v.play();if(p&&p.catch)p.catch(()=>{})}
const lgc=document.querySelector('#al .lgc');
if(lgc&&!document.getElementById('gdOpen')){const ax=document.getElementById('ax'),b=document.createElement('button');b.type='button';b.id='gdOpen';b.className='btn ghost sm gd-open';b.innerHTML=I('play2')+"<span>Video yo'riqnoma</span>";(ax||lgc.lastChild).after(b);b.addEventListener('click',modal)}

if(K.tok())K.nav();
})();
