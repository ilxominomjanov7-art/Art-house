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
  try { token = sessionStorage.getItem(PREFIX + 'token'); } catch (e) {}

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

  /* ---------- sozlamalar (narxlar, kurs) ---------- */
  function settings() { return readLS('settings', {}); }
  function saveSettings(s) {
    writeLS('settings', s); broadcast('settings');
    if (API && token) req('PUT', '/api/settings', s).catch(function () {});
    emit('settings');
  }
  function applySettings(s) {
    s = s || settings();
    if (s.usd) CFG.USD_UZS = +s.usd;
    if (s.prices) (window.PROJECTS || []).forEach(function (p) { if (s.prices[p.id] != null && s.prices[p.id] !== '') p.priceM2 = +s.prices[p.id]; });
  }

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
      return fetch(API + '/api/media', { method: 'POST', headers: { 'Content-Type': blob.type || 'application/octet-stream' }, body: blob })
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
      if (d.kind === 'settings') { applySettings(); emit('settings'); return; }
      if (!API) cache[d.kind] = readLS(d.kind, []);
      emit(d.kind, d.info);
    }
  };
  /* BroadcastChannel bo'lmagan eski brauzerlar uchun zaxira */
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf(PREFIX) !== 0 || bc) return;
    var kind = e.key.slice(PREFIX.length);
    if (kind === 'settings') { applySettings(); emit('settings'); return; }
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
          if (d.kind === 'settings') return req('GET', '/api/settings').then(function (s) { writeLS('settings', s || {}); applySettings(s); emit('settings'); }).catch(function () {});
          if ((d.kind === 'leads' || d.kind === 'calls') && !token) return; // bular faqat kabinet uchun
          load(d.kind).then(function () { emit(d.kind, d.info); });
        }
      };
      es.onerror = function () { es.close(); setTimeout(connect, retry = Math.min(retry * 2, 30000)); };
    })();
    req('GET', '/api/settings').then(function (s) { if (s) { writeLS('settings', s); applySettings(s); emit('settings'); } }).catch(function () {});
  }

  /* ---------- kabinet kirish (PBKDF2) ---------- */
  function hashPassword(login, password) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
      .then(function (k) { return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode('arthouse.v3:' + login.toLowerCase()), iterations: 150000 }, k, 256); })
      .then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, '0'); }).join(''); });
  }
  function login(user, password) {
    user = String(user || '').trim().toLowerCase();
    if (API) {
      return req('POST', '/api/login', { login: user, password: password }).then(function (j) {
        token = j.token; try { sessionStorage.setItem(PREFIX + 'token', token); sessionStorage.setItem(PREFIX + 'role', j.role); } catch (e) {}
        return j.role;
      });
    }
    if (!window.isSecureContext || !crypto.subtle) return Promise.reject(new Error('insecure'));
    var acc = CFG.ADMINS[user];
    return hashPassword(user, password).then(function (h) {
      if (!acc || acc.hash !== h) throw new Error('auth');
      token = 'local:' + user; try { sessionStorage.setItem(PREFIX + 'token', token); sessionStorage.setItem(PREFIX + 'role', acc.role); } catch (e) {}
      return acc.role;
    });
  }
  function logout() { token = null; try { sessionStorage.removeItem(PREFIX + 'token'); sessionStorage.removeItem(PREFIX + 'role'); } catch (e) {} }
  function session() { try { return token ? { token: token, role: sessionStorage.getItem(PREFIX + 'role') } : null; } catch (e) { return null; } }

  applySettings();

  window.Store = {
    peerId: uid(), uid: uid, api: !!API,
    load: load, list: list, add: add, update: update, remove: remove, on: on,
    settings: settings, saveSettings: saveSettings, applySettings: applySettings,
    putBlob: putBlob, mediaURL: mediaURL, dropBlob: dropBlob,
    signal: signal, onSignal: onSignal,
    login: login, logout: logout, session: session, hashPassword: hashPassword
  };
})();
