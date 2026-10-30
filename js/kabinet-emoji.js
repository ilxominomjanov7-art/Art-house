/* =====================================================================
   ART HOUSE — kabinet menyusi va Sozlamalar uchun 3D emoji-ikonkalar.
   Barcha qurilmalarda (Samsung, Android, Windows, iPhone) bir xil
   Apple (iPhone) emojilari rasm sifatida ko'rsatiladi.
   Manba: emoji-datasource-apple 16.0.0, 64px. DIQQAT: Apple rasmlari
   © Apple Inc., tijorat maqsadida foydalanishga litsenziyalanmagan.
   Manba rasmlar: assets/emoji/*.webp
   ===================================================================== */
(function(){
var E={"h": ["🏠", "assets/emoji/house.webp"], "m": ["📨", "assets/emoji/inbox.webp"], "r": ["💬", "assets/emoji/chat.webp"], "R": ["⭐", "assets/emoji/star.webp"], "V": ["📹", "assets/emoji/video.webp"], "c": ["🗂️", "assets/emoji/folder.webp"], "u": ["🏢", "assets/emoji/office.webp"], "p": ["💳", "assets/emoji/card.webp"], "d": ["🏷️", "assets/emoji/tag.webp"], "s": ["📊", "assets/emoji/chart.webp"], "g": ["🤖", "assets/emoji/robot.webp"], "P": ["💼", "assets/emoji/briefcase.webp"], "M": ["🏆", "assets/emoji/trophy.webp"], "z": ["⚙️", "assets/emoji/gear.webp"], "T": ["🎨", "assets/emoji/palette.webp"], "base": ["💰", "assets/emoji/money.webp"], "txt": ["📝", "assets/emoji/memo.webp"], "inf": ["📞", "assets/emoji/phone.webp"], "med": ["🖼️", "assets/emoji/frame.webp"], "col": ["🎨", "assets/emoji/palette.webp"], "sec": ["🧩", "assets/emoji/puzzle.webp"], "prj": ["🏗️", "assets/emoji/crane.webp"], "lng": ["🌐", "assets/emoji/globe.webp"], "rol": ["🔐", "assets/emoji/lock.webp"], "log": ["📋", "assets/emoji/clipboard.webp"], "pub": ["💾", "assets/emoji/floppy.webp"]};
function emo(k){var e=E[k];if(!e)return '';return '<img class="emo" src="'+e[1]+'" alt="" aria-hidden="true" draggable="false">'}
function deco(){
 document.querySelectorAll('#nv button[data-v]>.nt').forEach(function(t){var k=t.parentNode.getAttribute('data-v');if(t.getAttribute('data-emo')!==k&&E[k]){t.innerHTML=emo(k);t.setAttribute('data-emo',k);t.classList.add('has-emo')}});
 document.querySelectorAll('.zic').forEach(function(t){var m=/zc-(\w+)/.exec(t.className),k=m&&m[1];if(k&&t.getAttribute('data-emo')!==k&&E[k]){t.innerHTML=emo(k);t.setAttribute('data-emo',k);t.classList.add('has-emo')}});
}
deco();
new MutationObserver(deco).observe(document.body,{childList:true,subtree:true});
})();
