/* Parol maydonlariga «ko'z» tugmasi: bosilsa parol ko'rinadi, yana bosilsa yashirinadi (kabinetdagi barcha parol maydonlari) */
(function () {
  var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m2 2 20 20"/></svg>';
  function add(inp) {
    if (inp.dataset.eye) return; inp.dataset.eye = '1';
    var w = document.createElement('span'); w.className = 'pw-wrap'; inp.parentNode.insertBefore(w, inp); w.appendChild(inp);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pw-eye'; b.setAttribute('aria-label', 'Parolni ko\'rsatish'); b.innerHTML = OFF; w.appendChild(b);
    b.addEventListener('click', function () { var show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; b.innerHTML = show ? EYE : OFF; b.setAttribute('aria-pressed', String(show)); inp.focus(); });
  }
  function scan() { document.querySelectorAll('input[type=password]').forEach(add); }
  var st = document.createElement('style');
  st.textContent = '.pw-wrap{position:relative;display:block;width:100%}.pw-wrap>input{width:100%;padding-right:52px!important}.pw-eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:42px;height:42px;display:grid;place-items:center;border:0;background:none;color:inherit;opacity:.7;cursor:pointer}.pw-eye:hover{opacity:1}.pw-eye svg{width:22px;height:22px}';
  document.head.appendChild(st);
  scan(); new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
