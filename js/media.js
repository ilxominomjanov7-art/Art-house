/* =====================================================================
   ART HOUSE — MIKROFON, KAMERA VA WebRTC VIDEO-QO'NG'IROQ
   • Media.request()  — navigator.mediaDevices.getUserMedia orqali ruxsat so'raydi,
     xatolarni tushunarli kalitlarga aylantiradi (i18n orqali tarjima qilinadi).
   • Call             — RTCPeerConnection: mijoz (sayt) ↔ menejer (kabinet).
     Signal: Store.signal (BroadcastChannel / server SSE) yoki qo'lda "kod" almashish.
   ===================================================================== */
(function () {
  'use strict';

  var Media = {
    support: function () {
      return {
        secure: !!window.isSecureContext,
        gum: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        rtc: 'RTCPeerConnection' in window,
        recorder: 'MediaRecorder' in window
      };
    },

    /* 'granted' | 'denied' | 'prompt' | 'unknown' */
    permission: function (name) {
      if (!navigator.permissions || !navigator.permissions.query) return Promise.resolve('unknown');
      return navigator.permissions.query({ name: name }).then(function (s) { return s.state; }).catch(function () { return 'unknown'; });
    },

    /* Xatoni i18n kalitiga aylantirish */
    errorKey: function (e) {
      var n = e && (e.name || e.message) || '';
      if (n === 'insecure') return 'media.err.insecure';
      if (n === 'unsupported') return 'media.err.unsupported';
      if (n === 'NotAllowedError' || n === 'PermissionDeniedError' || n === 'SecurityError') return 'media.err.denied';
      if (n === 'NotFoundError' || n === 'DevicesNotFoundError') return 'media.err.notfound';
      if (n === 'NotReadableError' || n === 'TrackStartError' || n === 'AbortError') return 'media.err.busy';
      if (n === 'OverconstrainedError') return 'media.err.constraint';
      return 'media.err.generic';
    },

    /* Ruxsat so'rash. Kamera topilmasa — avtomatik faqat ovozga o'tadi. */
    request: function (opts) {
      opts = opts || {};
      var s = Media.support();
      if (!s.secure) return Promise.reject({ name: 'insecure' });
      if (!s.gum) return Promise.reject({ name: 'unsupported' });
      var audio = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };
      var video = opts.video ? { facingMode: opts.facing || 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false;
      return navigator.mediaDevices.getUserMedia({ audio: opts.audio === false ? false : audio, video: video })
        .catch(function (e) {
          if (opts.video && (e.name === 'NotFoundError' || e.name === 'OverconstrainedError' || e.name === 'NotReadableError')) {
            return navigator.mediaDevices.getUserMedia({ audio: audio, video: false }).then(function (st) { st._videoFallback = true; return st; });
          }
          throw e;
        });
    },

    stop: function (stream) { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); },

    /* Mikrofon darajasi (0..1) — vizual indikator uchun. stop funksiyasini qaytaradi. */
    meter: function (stream, cb) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC || !stream.getAudioTracks().length) return function () {};
      var ctx = new AC(), src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser(), buf = new Uint8Array(256), raf;
      an.fftSize = 512; src.connect(an);
      (function loop() { an.getByteTimeDomainData(buf); var m = 0; for (var i = 0; i < buf.length; i++) m = Math.max(m, Math.abs(buf[i] - 128)); cb(Math.min(1, m / 64)); raf = requestAnimationFrame(loop); })();
      return function () { cancelAnimationFrame(raf); try { ctx.close(); } catch (e) {} };
    },

    /* Video-sharh yozish uchun eng mos format */
    recorderMime: function () {
      if (!window.MediaRecorder) return '';
      var list = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
      for (var i = 0; i < list.length; i++) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(list[i])) return list[i];
      return '';
    }
  };

  /* ------------------------------------------------------------------
     Call — bitta qo'ng'iroq sessiyasi
     role: 'client' (saytdagi mijoz) yoki 'manager' (kabinet)
     ------------------------------------------------------------------ */
  function Call(o) {
    this.role = o.role;
    this.room = o.room || Store.uid();
    this.video = !!o.video;
    this.meta = o.meta || {};
    this.cb = o; // onState, onLocal, onRemote, onError
    this.pc = null; this.local = null; this.state = 'idle';
    this.pending = []; this.manual = !!o.manual;
    var self = this;
    this._sig = function (m) { self._onSignal(m); };
    if (!this.manual) Store.onSignal(this._sig);
  }

  Call.prototype._set = function (s, extra) { this.state = s; if (this.cb.onState) this.cb.onState(s, extra); };
  Call.prototype._send = function (type, data) { if (!this.manual && this.state !== 'ended') Store.signal({ room: this.room, type: type, data: data, role: this.role }); };

  Call.prototype._media = function () {
    var self = this;
    return Media.request({ video: this.video }).then(function (st) {
      self.local = st; if (st._videoFallback) self.video = false;
      if (self.cb.onLocal) self.cb.onLocal(st);
      return st;
    });
  };

  Call.prototype._peer = function () {
    var self = this;
    var pc = this.pc = new RTCPeerConnection({ iceServers: CFG.ICE_SERVERS || [] });
    this.local.getTracks().forEach(function (t) { pc.addTrack(t, self.local); });
    if (this.role === 'client' && !this.video) pc.addTransceiver('video', { direction: 'recvonly' }); // ovozli qo'ng'iroqda ham menejer kamerasini ko'rish imkoniyati
    pc.onicecandidate = function (e) { if (e.candidate && !self.manual) self._send('ice', e.candidate.toJSON ? e.candidate.toJSON() : e.candidate); };
    pc.ontrack = function (e) { if (self.cb.onRemote) self.cb.onRemote(e.streams[0] || new MediaStream([e.track])); };
    pc.onconnectionstatechange = function () {
      var s = pc.connectionState;
      if (s === 'connected') { self.startedAt = self.startedAt || Date.now(); self._set('connected'); }
      else if (s === 'failed') self._set('failed');
      else if (s === 'disconnected') self._set('reconnecting');
    };
    return pc;
  };

  /* Mijoz: qo'ng'iroqni boshlaydi */
  Call.prototype.start = function () {
    var self = this;
    this._set('permission');
    return this._media().then(function () {
      self._peer();
      self._set('calling');
      return self.pc.createOffer();
    }).then(function (offer) { return self.pc.setLocalDescription(offer); })
      .then(function () {
        if (self.manual) return self._gathered().then(function () { return Call.encode(self.pc.localDescription); });
        self._send('offer', { sdp: plain(self.pc.localDescription), meta: self.meta, video: self.video });
        self._ringTimer = setTimeout(function () { if (self.state === 'calling') { self._send('cancel'); self._set('noanswer'); self._cleanup(); } }, 60000);
      })
      .catch(function (e) { self._fail(e); throw e; });
  };

  /* Menejer: kelgan qo'ng'iroqni qabul qiladi */
  Call.prototype.accept = function (offerSdp) {
    var self = this;
    this._set('permission');
    return this._media().then(function () {
      self._peer();
      return self.pc.setRemoteDescription(offerSdp);
    }).then(function () { return self._flush(); })
      .then(function () { return self.pc.createAnswer(); })
      .then(function (ans) { return self.pc.setLocalDescription(ans); })
      .then(function () {
        self._set('connecting');
        if (self.manual) return self._gathered().then(function () { return Call.encode(self.pc.localDescription); });
        self._send('answer', { sdp: plain(self.pc.localDescription) });
      })
      .catch(function (e) { self._fail(e); throw e; });
  };

  /* Qo'lda (kod orqali) ulanishda mijoz javob kodini kiritadi */
  Call.prototype.finishManual = function (code) {
    var self = this;
    return this.pc.setRemoteDescription(Call.decode(code)).then(function () { self._set('connecting'); });
  };

  Call.prototype._gathered = function () {
    var pc = this.pc;
    return new Promise(function (res) {
      if (pc.iceGatheringState === 'complete') return res();
      var t = setTimeout(res, 4000);
      pc.addEventListener('icegatheringstatechange', function () { if (pc.iceGatheringState === 'complete') { clearTimeout(t); res(); } });
    });
  };

  Call.prototype._flush = function () {
    var pc = this.pc, q = this.pending; this.pending = [];
    return Promise.all(q.map(function (c) { return pc.addIceCandidate(c).catch(function () {}); }));
  };

  Call.prototype._onSignal = function (m) {
    if (!m || m.room !== this.room || m.role === this.role) return;
    var self = this;
    if (m.type === 'answer' && this.pc && this.role === 'client') {
      clearTimeout(this._ringTimer);
      this._set('connecting');
      this.pc.setRemoteDescription(m.data.sdp).then(function () { return self._flush(); }).catch(function (e) { self._fail(e); });
    } else if (m.type === 'ice') {
      if (this.pc && this.pc.remoteDescription) this.pc.addIceCandidate(m.data).catch(function () {});
      else this.pending.push(m.data);
    } else if (m.type === 'decline') { clearTimeout(this._ringTimer); this._set('declined'); this._cleanup(); }
    else if (m.type === 'bye' || m.type === 'cancel') { this._set('ended', { remote: true }); this._cleanup(); }
  };

  Call.prototype.toggleMic = function () { var t = this.local && this.local.getAudioTracks()[0]; if (t) t.enabled = !t.enabled; return t ? t.enabled : false; };
  Call.prototype.toggleCam = function () { var t = this.local && this.local.getVideoTracks()[0]; if (t) t.enabled = !t.enabled; return t ? t.enabled : false; };
  Call.prototype.flip = function () {
    var self = this, cur = this.local && this.local.getVideoTracks()[0]; if (!cur) return Promise.resolve();
    var facing = (cur.getSettings().facingMode === 'environment') ? 'user' : 'environment';
    return navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } }).then(function (st) {
      var nt = st.getVideoTracks()[0], sender = self.pc && self.pc.getSenders().filter(function (s) { return s.track && s.track.kind === 'video'; })[0];
      if (sender) sender.replaceTrack(nt);
      self.local.removeTrack(cur); cur.stop(); self.local.addTrack(nt);
      if (self.cb.onLocal) self.cb.onLocal(self.local);
    });
  };

  Call.prototype.hangup = function () {
    clearTimeout(this._ringTimer);
    this._send(this.state === 'calling' ? 'cancel' : 'bye');
    this._set('ended'); this._cleanup();
  };
  Call.prototype._fail = function (e) { if (this.cb.onError) this.cb.onError(Media.errorKey(e), e); this._set('error'); this._cleanup(); };
  Call.prototype._cleanup = function () {
    clearTimeout(this._ringTimer);
    Media.stop(this.local); this.local = null;
    if (this.pc) { try { this.pc.close(); } catch (e) {} this.pc = null; }
    this.state = 'ended';
  };

  /* RTCSessionDescription → oddiy obyekt (BroadcastChannel/JSON orqali uzatish uchun) */
  function plain(d) { return { type: d.type, sdp: d.sdp }; }

  /* SDP ↔ nusxalash mumkin bo'lgan kod */
  Call.encode = function (desc) { return btoa(unescape(encodeURIComponent(JSON.stringify({ type: desc.type, sdp: desc.sdp })))); };
  Call.decode = function (code) { return JSON.parse(decodeURIComponent(escape(atob(String(code).trim())))); };

  window.Media = Media;
  window.Call = Call;
})();
