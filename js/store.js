/* =====================================================================
   ART HOUSE — MA'LUMOTLAR QATLAMI (sayt ↔ kabinet)
   • Server bo'lmasa: localStorage + BroadcastChannel — sayt va kabinet bitta
     brauzerda ochiq bo'lsa, o'zgarishlar darhol (sahifani yangilamasdan) ko'rinadi.
   • CFG.API_URL berilsa: server/server.js REST + SSE orqali barcha qurilmalar
     o'rtasida jonli sinxronlash.
   ===================================================================== */
(function () {
  'use strict';
  var API = (window.CFG && CFG.API_URL || '').replace(/\/$/, '');
  if (API === 'auto') API = location.protocol.indexOf('http') === 0 ? location.origin : ''; // sayt server/server.js orqali ochilganda
  var KINDS = ['reviews', 'leads', 'calls'];
  var PREFIX = 'ah3_';
  var bc = 'BroadcastChannel' in window ? new BroadcastChannel('arthouse') : null;
  var listeners = {};
  var cache = {};
  var token = null;
  try { var _ks = JSON.parse(sessionStorage.getItem('ah_s')); if (_ks && _ks.t) token = _ks.t; } catch (e) {} // kabinet sessiyasi

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function readLS(k, d) { try { var v = JSON.parse(localStorage.getItem(PREFIX + k)); return v == null ? d : v; } catch (e) { return d; } }
  function writeLS(k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) {} }

  function emit(kind, info) {
    (listeners[kind] || []).forEach(function (cb) { try { cb(cache[kind] || [], info || {}); } catch (e) { console.error(e); } });
    (listeners['*'] || []).forEach(function (cb) { try { cb(kind, info || {}); } catch (e) { console.error(e); } });
  }
  function broadcast(kind, info) { if (bc) bc.postMessage({ t: 'change', kind: kind, info: info || {} }); }

  function headers(json) {
    var h = {};
    if (json) h['Content-Type'] = 'application/json';
    if (token) h.Authorization = 'Bearer ' + token;
    return h;
  }
  function req(method, path, body) {
    return fetch(API + path, { method: method, headers: headers(body !== undefined), body: body !== undefined ? JSON.stringify(body) : undefined })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.status === 204 ? null : r.json(); });
  }

  /* ---------- asosiy CRUD ---------- */
  function load(kind) {
    if (!API) { cache[kind] = readLS(kind, []); return Promise.resolve(cache[kind]); }
    return req('GET', '/api/' + kind).then(function (rows) { cache[kind] = rows || []; return cache[kind]; })
      .catch(function () { cache[kind] = cache[kind] || []; return cache[kind]; });
  }
  function list(kind) { return cache[kind] || (cache[kind] = API ? [] : readLS(kind, [])); }

  function add(kind, obj) {
    obj = Object.assign({ id: uid(), at: Date.now() }, obj);
    if (!API) {
      var rows = readLS(kind, []); rows.unshift(obj); writeLS(kind, rows.slice(0, 500));
      cache[kind] = readLS(kind, []); emit(kind, { op: 'add', id: obj.id }); broadcast(kind, { op: 'add', id: obj.id });
      return Promise.resolve(obj);
    }
    return req('POST', '/api/' + kind, obj).then(function (saved) {
      var rows = list(kind).filter(function (x) { return x.id !== saved.id; }); rows.unshift(saved); cache[kind] = rows; emit(kind, { op: 'add', id: saved.id }); return saved;
    });
  }
  function update(kind, id, patch) {
    if (!API) {
      var rows = readLS(kind, []).map(function (x) { return x.id === id ? Object.assign({}, x, patch) : x; });
      writeLS(kind, rows); cache[kind] = rows; emit(kind, { op: 'update', id: id }); broadcast(kind, { op: 'update', id: id });
      return Promise.resolve();
    }
    return req('PATCH', '/api/' + kind + '/' + encodeURIComponent(id), patch).then(function () {
      cache[kind] = list(kind).map(function (x) { return x.id === id ? Object.assign({}, x, patch) : x; }); emit(kind, { op: 'update', id: id });
    });
  }
  function remove(kind, id) {
    if (!API) {
      writeLS(kind, readLS(kind, []).filter(function (x) { return x.id !== id; }));
      cache[kind] = readLS(kind, []); emit(kind, { op: 'remove', id: id }); broadcast(kind, { op: 'remove', id: id });
      return Promise.resolve();
    }
    return req('DELETE', '/api/' + kind + '/' + encodeURIComponent(id)).then(function () {
      cache[kind] = list(kind).filter(function (x) { return x.id !== id; }); emit(kind, { op: 'remove', id: id });
    });
  }
  function on(kind, cb) { (listeners[kind] = listeners[kind] || []).push(cb); }

  /* ---------- sozlamalar: kabinet → Sozlamalar ('ah_set': 1 m² narxi, minimal %, oylar, kurs) ---------- */
  function settings() { try { return JSON.parse(localStorage.getItem('ah_set')) || {}; } catch (e) { return {}; } }
  function applySettings(s) {
    s = s || settings();
    if (s.p) CFG.PRICE_M2 = +s.p;
    if (s.d != null) CFG.DOWN_MIN = +s.d;
    if (s.m && s.m.length) CFG.MONTHS = s.m.map(Number);
    if (s.usd) CFG.USD_UZS = +s.usd;
  }
  function setToken(t) { token = t || null; }

  /* ---------- video-sharhlar uchun fayllar (IndexedDB yoki server) ---------- */
  var dbp = null;
  function idb() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      if (!('indexedDB' in window)) return rej(new Error('no-idb'));
      var r = indexedDB.open('arthouse-media', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('blobs'); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return dbp;
  }
  function putBlob(blob) {
    if (API) {
      var h = { 'Content-Type': blob.type || 'application/octet-stream' }; if (token) h.Authorization = 'Bearer ' + token; // rasmlarni server faqat kabinetdan qabul qiladi
      return fetch(API + '/api/media', { method: 'POST', headers: h, body: blob })
        .then(function (r) { if (!r.ok) throw new Error('upload'); return r.json(); }).then(function (j) { return j.url; });
    }
    var key = 'idb:' + uid();
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction('blobs', 'readwrite'); tx.objectStore('blobs').put(blob, key);
        tx.oncomplete = function () { res(key); }; tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  /* "idb:..." kalitini yoki oddiy URLni <video> uchun manzilga aylantiradi */
  function mediaURL(ref) {
    if (!ref) return Promise.resolve('');
    if (ref.indexOf('idb:') !== 0) return Promise.resolve(ref.charAt(0) === '/' ? API + ref : ref);
    return idb().then(function (db) {
      return new Promise(function (res) {
        var g = db.transaction('blobs').objectStore('blobs').get(ref);
        g.onsuccess = function () { res(g.result ? URL.createObjectURL(g.result) : ''); };
        g.onerror = function () { res(''); };
      });
    }).catch(function () { return ''; });
  }
  function dropBlob(ref) {
    if (!ref || ref.indexOf('idb:') !== 0) return;
    idb().then(function (db) { db.transaction('blobs', 'readwrite').objectStore('blobs').delete(ref); }).catch(function () {});
  }

  /* ---------- signal kanali (WebRTC qo'ng'iroqlar uchun) ---------- */
  var sigHandlers = [];
  function signal(msg) {
    msg = JSON.parse(JSON.stringify(msg)); // faqat oddiy ma'lumot uzatiladi
    msg.from = msg.from || Store.peerId;
    if (bc) bc.postMessage({ t: 'signal', msg: msg });
    if (API) req('POST', '/api/signal', msg).catch(function () {});
  }
  function onSignal(cb) { sigHandlers.push(cb); }
  function gotSignal(msg) { if (msg.from === Store.peerId) return; sigHandlers.forEach(function (cb) { try { cb(msg); } catch (e) { console.error(e); } }); }

  /* ---------- tashqi o'zgarishlarni tinglash ---------- */
  if (bc) bc.onmessage = function (e) {
    var d = e.data || {};
    if (d.t === 'signal') return gotSignal(d.msg);
    if (d.t === 'change') {
      if (!API) cache[d.kind] = readLS(d.kind, []);
      emit(d.kind, d.info);
    }
  };
  /* BroadcastChannel bo'lmagan eski brauzerlar uchun zaxira */
  window.addEventListener('storage', function (e) {
    if (e.key === 'ah_set') { applySettings(); emit('settings'); return; }
    if (!e.key || e.key.indexOf(PREFIX) !== 0 || bc) return;
    var kind = e.key.slice(PREFIX.length);
    if (KINDS.indexOf(kind) > -1 && !API) { cache[kind] = readLS(kind, []); emit(kind, {}); }
  });
  if (API && 'EventSource' in window) {
    var es, retry = 1000;
    (function connect() {
      es = new EventSource(API + '/api/events');
      es.onopen = function () { retry = 1000; };
      es.onmessage = function (e) {
        var d; try { d = JSON.parse(e.data); } catch (x) { return; }
        if (d.t === 'signal') return gotSignal(d.msg);
        if (d.t === 'change') {
          if (d.kind === 'crm') return emit('crm', d.info || {}); // kabinet: arizalar / suhbatlar yangilandi
          if (d.kind === 'cms') return emit('cms', d.info || {}); // sayt sozlamalari / mavzu: js/theme.js /api/cms ni o'qiydi
          if (d.kind === 'settings') return req('GET', '/settings').then(function (s) { if (s && s.p) { try { localStorage.setItem('ah_set', JSON.stringify(s)); } catch (x) {} applySettings(s); emit('settings'); } }).catch(function () {});
          if ((d.kind === 'leads' || d.kind === 'calls') && !token) return; // bular faqat kabinet uchun
          load(d.kind).then(function () { emit(d.kind, d.info); });
        }
      };
      es.onerror = function () { es.close(); setTimeout(connect, retry = Math.min(retry * 2, 30000)); };
    })();
    req('GET', '/settings').then(function (s) { if (s && s.p) { try { localStorage.setItem('ah_set', JSON.stringify(s)); } catch (x) {} applySettings(s); emit('settings'); } }).catch(function () {});
  }

  applySettings();

  window.Store = {
    peerId: uid(), uid: uid, api: !!API,
    load: load, list: list, add: add, update: update, remove: remove, on: on,
    settings: settings, applySettings: applySettings, setToken: setToken,
    putBlob: putBlob, mediaURL: mediaURL, dropBlob: dropBlob,
    signal: signal, onSignal: onSignal
  };
})();
