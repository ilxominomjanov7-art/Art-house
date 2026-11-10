/* ART HOUSE — shriftlar kutubxonasi (sayt va kabinet uchun umumiy). Google Fonts; cyr — kirill harflari bor */
window.AH_FONTS = window.AH_FONTS || {
  playfair: { n: 'Playfair Display', g: 'Playfair+Display:wght@400;500;600;700', css: "'Playfair Display', Georgia, serif", cyr: 1, h: 1 },
  cormorant: { n: 'Cormorant Garamond', g: 'Cormorant+Garamond:wght@400;500;600;700', css: "'Cormorant Garamond', Georgia, serif", cyr: 1, h: 1 },
  prata: { n: 'Prata', g: 'Prata', css: "'Prata', Georgia, serif", cyr: 1, h: 1 },
  forum: { n: 'Forum', g: 'Forum', css: "'Forum', Georgia, serif", cyr: 1, h: 1 },
  ebgaramond: { n: 'EB Garamond', g: 'EB+Garamond:wght@400;500;600', css: "'EB Garamond', Georgia, serif", cyr: 1, h: 1, b: 1 },
  lora: { n: 'Lora', g: 'Lora:wght@400;500;600;700', css: "'Lora', Georgia, serif", cyr: 1, h: 1, b: 1 },
  cinzel: { n: 'Cinzel', g: 'Cinzel:wght@400;500;600;700', css: "'Cinzel', Georgia, serif", h: 1 },
  marcellus: { n: 'Marcellus', g: 'Marcellus', css: "'Marcellus', Georgia, serif", h: 1 },
  tenor: { n: 'Tenor Sans', g: 'Tenor+Sans', css: "'Tenor Sans', system-ui, sans-serif", cyr: 1, h: 1 },
  unbounded: { n: 'Unbounded', g: 'Unbounded:wght@300;400;500;600', css: "'Unbounded', system-ui, sans-serif", cyr: 1, h: 1 },
  oswald: { n: 'Oswald', g: 'Oswald:wght@300;400;500;600', css: "'Oswald', system-ui, sans-serif", cyr: 1, h: 1 },
  montserrat: { n: 'Montserrat', g: 'Montserrat:wght@300;400;500;600;700', css: "'Montserrat', system-ui, sans-serif", cyr: 1, h: 1, b: 1 },
  raleway: { n: 'Raleway', g: 'Raleway:wght@300;400;500;600;700', css: "'Raleway', system-ui, sans-serif", cyr: 1, h: 1, b: 1 },
  geologica: { n: 'Geologica', g: 'Geologica:wght@300;400;500;600;700', css: "'Geologica', system-ui, sans-serif", cyr: 1, h: 1, b: 1 },
  manrope: { n: 'Manrope', g: 'Manrope:wght@300;400;500;600;700', css: "'Manrope', system-ui, sans-serif", cyr: 1, h: 1, b: 1 },
  jost: { n: 'Jost', g: 'Jost:wght@300;400;500;600;700', css: "'Jost', system-ui, sans-serif", cyr: 1, h: 1, b: 1 },
  inter: { n: 'Inter', g: 'Inter:wght@300;400;500;600;700', css: "'Inter', system-ui, sans-serif", cyr: 1, b: 1 },
  roboto: { n: 'Roboto', g: 'Roboto:wght@300;400;500;700', css: "'Roboto', system-ui, sans-serif", cyr: 1, b: 1 },
  opensans: { n: 'Open Sans', g: 'Open+Sans:wght@300;400;500;600;700', css: "'Open Sans', system-ui, sans-serif", cyr: 1, b: 1 },
  nunito: { n: 'Nunito Sans', g: 'Nunito+Sans:wght@300;400;600;700', css: "'Nunito Sans', system-ui, sans-serif", cyr: 1, b: 1 },
  ptsans: { n: 'PT Sans', g: 'PT+Sans:wght@400;700', css: "'PT Sans', system-ui, sans-serif", cyr: 1, b: 1 },
  commissioner: { n: 'Commissioner', g: 'Commissioner:wght@300;400;500;600', css: "'Commissioner', system-ui, sans-serif", cyr: 1, b: 1 }
};
window.AH_FONT_LOAD = function (ids, id) {
  var F = window.AH_FONTS, q = (ids || []).filter(function (k, i, a) { return F[k] && a.indexOf(k) === i; }).map(function (k) { return 'family=' + F[k].g; });
  id = id || 'ahFontLink'; var l = document.getElementById(id);
  if (!q.length) { if (l) l.remove(); return; }
  var href = 'https://fonts.googleapis.com/css2?' + q.join('&') + '&display=swap';
  if (!l) { l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; document.head.appendChild(l); }
  if (l.href !== href) l.href = href;
};
