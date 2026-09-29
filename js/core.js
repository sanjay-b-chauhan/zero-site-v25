/* Core: boot, smooth scroll, motion switch, icon sprite, sound, XP, dock + menu, reveals. */
(function () {
  'use strict';
  var Z = (window.ZERO = window.ZERO || {});
  var $ = (Z.$ = function (s, r) { return (r || document).querySelector(s); });
  var $$ = (Z.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); });
  var root = document.documentElement;

  root.classList.add('js');
  Z.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Z.coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  Z.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  Z.map = function (v, a, b, c, d) { return c + (d - c) * Z.clamp((v - a) / (b - a), 0, 1); };
  Z.mods = [];                       // sections register an init here, core runs them in page order
  Z.on = function (n, f) { document.addEventListener('zero:' + n, function (e) { f(e.detail); }); };
  Z.emit = function (n, d) { document.dispatchEvent(new CustomEvent('zero:' + n, { detail: d })); };

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('zero', '0.625,0.05,0,1');
  CustomEase.create('zeroOut', '0.16,1,0.3,1');
  gsap.defaults({ ease: 'zero', duration: 0.6 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* every reveal that starts from opacity 0 gets a landing fallback, so a throttled tab never strands content */
  Z.safe = function (tl, ms) {
    var t = setTimeout(function () { try { tl.progress(1); } catch (e) {} }, ms || 2600);
    tl.eventCallback('onComplete', function () { clearTimeout(t); });
    return tl;
  };

  /* ---------- icons: phosphor sprite, fetched once ---------- */
  Z.icon = function (id, cls) { return '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  fetch('assets/icons.svg').then(function (r) { return r.text(); }).then(function (t) {
    var d = document.createElement('div'); d.innerHTML = t; document.body.insertBefore(d.firstChild, document.body.firstChild);
  }).catch(function () {});

  /* ---------- smooth scroll ---------- */
  function startLenis() {
    if (Z.lenis || Z.reduced || root.classList.contains('motion-off') || typeof Lenis === 'undefined') return;
    Z.lenis = new Lenis({ lerp: 0.105, wheelMultiplier: 1, smoothWheel: true });
    Z.lenis.on('scroll', ScrollTrigger.update);
    Z._raf = function (t) { Z.lenis && Z.lenis.raf(t * 1000); };
    gsap.ticker.add(Z._raf);
    gsap.ticker.lagSmoothing(0);
    // pins change the page height. tell lenis, or its scroll limit goes stale
    ScrollTrigger.addEventListener('refresh', function () { Z.lenis && Z.lenis.resize(); });
  }
  function stopLenis() {
    if (!Z.lenis) return;
    gsap.ticker.remove(Z._raf); Z.lenis.destroy(); Z.lenis = null;
  }
  Z.scrollTo = function (y, opts) {
    opts = opts || {};
    if (Z.lenis) Z.lenis.scrollTo(y, { duration: opts.duration || 1.6, easing: function (t) { return 1 - Math.pow(1 - t, 4); }, offset: opts.offset || 0, lock: !!opts.lock, force: true });
    else {
      var top = typeof y === 'number' ? y : (y.getBoundingClientRect().top + window.scrollY + (opts.offset || 0));
      window.scrollTo({ top: top, behavior: Z.reduced ? 'auto' : 'smooth' });
    }
  };

  /* ---------- sound: synthesized, OFF by default and only ever turned on by the sound button. short tones, no drone, no hiss ---------- */
  var sfx = (Z.sfx = { on: false, ctx: null, master: null, pad: null });
  function ac() {
    if (!sfx.ctx) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      sfx.ctx = new AC(); sfx.master = sfx.ctx.createGain(); sfx.master.gain.value = 0.0001;
      var comp = sfx.ctx.createDynamicsCompressor(); sfx.master.connect(comp); comp.connect(sfx.ctx.destination);
    }
    if (sfx.ctx.state === 'suspended') sfx.ctx.resume();
    return sfx.ctx;
  }
  function tone(f, t0, dur, vol, type, glide) {
    var c = sfx.ctx, o = c.createOscillator(), g = c.createGain(), t = c.currentTime + (t0 || 0);
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfx.master); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(t0, dur, vol, f1, f2) {
    var c = sfx.ctx, n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(); s.buffer = b;
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.8;
    var g = c.createGain(), t = c.currentTime + (t0 || 0);
    bp.frequency.setValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(bp); bp.connect(g); g.connect(sfx.master); s.start(t); s.stop(t + dur + 0.05);
  }
  function startPad() {
    if (sfx.pad || !sfx.ctx) return;
    var c = sfx.ctx, g = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; g.gain.value = 0.0001;
    var os = [130.81, 196.0, 261.63, 329.63].map(function (f, i) { var o = c.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = (i - 1.5) * 6; o.connect(lp); o.start(); return o; });
    var lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 180; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    lp.connect(g); g.connect(sfx.master); g.gain.exponentialRampToValueAtTime(0.022, c.currentTime + 3);
    sfx.pad = { g: g, os: os, lfo: lfo };
  }
  function stopPad() {
    if (!sfx.pad) return; var p = sfx.pad, c = sfx.ctx; sfx.pad = null;
    p.g.gain.cancelScheduledValues(c.currentTime); p.g.gain.setTargetAtTime(0.0001, c.currentTime, 0.4);
    setTimeout(function () { p.os.forEach(function (o) { try { o.stop(); } catch (e) {} }); try { p.lfo.stop(); } catch (e) {} }, 1600);
  }
  sfx.set = function (on) {
    sfx.on = !!on;
    if (on) { if (!ac()) return; sfx.master.gain.setTargetAtTime(0.9, sfx.ctx.currentTime, 0.08); sfx.open(); }   // no drone: only short clean tones
    else if (sfx.ctx) { sfx.master.gain.setTargetAtTime(0.0001, sfx.ctx.currentTime, 0.05); stopPad(); }
    $$('[data-sound]').forEach(function (b) { b.setAttribute('aria-pressed', String(sfx.on)); var l = b.querySelector('[data-sound-label]'); if (l) l.textContent = sfx.on ? 'Sound on' : 'Sound off'; });
  };
  function play(fn) { return function () { if (!sfx.on || !sfx.ctx) return; try { fn.apply(null, arguments); } catch (e) {} }; }
  sfx.tick = play(function () { tone(1180, 0, 0.07, 0.035, 'sine', 900); });
  sfx.hover = play(function () { tone(1560, 0, 0.05, 0.014, 'sine'); });
  sfx.open = play(function () { tone(523.25, 0, 0.22, 0.05, 'triangle'); tone(783.99, 0.07, 0.3, 0.05, 'triangle'); });
  sfx.close = play(function () { tone(659.25, 0, 0.18, 0.04, 'triangle'); tone(440, 0.06, 0.26, 0.04, 'triangle'); });
  sfx.whoosh = function () {};   // no hiss
  sfx.step = play(function (i) { var n = [523.25, 587.33, 659.25, 783.99][i % 4]; tone(n, 0, 0.25, 0.045, 'triangle'); });
  sfx.xp = play(function () { [1046.5, 1318.5, 1568, 2093].forEach(function (f, i) { tone(f, i * 0.055, 0.34, 0.04, 'sine'); }); });
  sfx.coin = play(function (i) { tone(1568 + (i || 0) * 90, 0, 0.12, 0.03, 'square', 2093 + (i || 0) * 90); });
  sfx.win = play(function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.08, 0.9, 0.04, 'sine'); }); });
  sfx.draw = function () {};   // drawing is silent

  /* ---------- XP. every new thing you do pays out; the meter top right says what for ----------
     levels every 1,000 up to 5,000. the count rolls like an odometer, a ring fills toward the next
     level, gold stars arc from whatever you touched into the meter, and the Start key fills with water */
  var XP = (Z.XP = { total: 0, max: 5000, per: 500, lvl: 1000, got: {} });
  var fx, meter, meterWhy, meterNum, meterLv, ring, startBtn, whyTimer = 0;
  var RING = 2 * Math.PI * 15.5;
  function center(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function level(t) { return Math.min(5, Math.floor(t / XP.lvl) + 1); }
  function frac(t) { return t >= XP.max ? 1 : (t % XP.lvl) / XP.lvl; }
  function setFill() { if (!startBtn) return; startBtn.style.setProperty('--p', (XP.total / XP.max).toFixed(4)); startBtn.classList.toggle('is-super', XP.total >= XP.max); }

  /* the count rolls on Osmo's odometer: new columns grow in, every digit rolls forward */
  function odo(value, animate) {
    if (!meterNum) return;
    var s = value.toLocaleString('en-US');
    if (animate && Z.odomUpdate) Z.odomUpdate(meterNum, s, { duration: 1.1 });
    else { meterNum.textContent = s; meterNum._odo = s; }
    meterNum.setAttribute('aria-label', s + ' credits');
  }
  function setRing(animate) {
    if (!ring) return;
    gsap.to(ring, { attr: { 'stroke-dashoffset': (RING * (1 - frac(XP.total))).toFixed(2) }, duration: animate && !Z.still ? 0.8 : 0, ease: 'zeroOut' });
  }
  /* the meter stretches to say what you earned, then folds back */
  function why(text) {
    if (!meterWhy) return;
    clearTimeout(whyTimer);
    meterWhy.textContent = text;
    var w = meterWhy.scrollWidth;
    if (Z.still) { meterWhy.style.width = w + 'px'; whyTimer = setTimeout(function () { meterWhy.style.width = '0px'; }, 2000); return; }
    gsap.to(meterWhy, { width: w, opacity: 1, duration: 0.45, ease: 'zeroOut', overwrite: true });
    whyTimer = setTimeout(function () { gsap.to(meterWhy, { width: 0, opacity: 0, duration: 0.4, ease: 'power2.in', overwrite: true }); }, 2200);
  }
  function sparks(x, y, n, spread) {
    if (Z.still) return;
    for (var i = 0; i < n; i++) (function () {
      var s = document.createElement('i'); s.className = 'fx__spark'; fx.appendChild(s);
      var a = Math.random() * Math.PI * 2, d = (spread || 50) * (0.5 + Math.random() * 0.7);
      gsap.fromTo(s, { x: x, y: y, scale: 1, opacity: 1 }, { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, scale: 0, opacity: 0, duration: 0.6 + Math.random() * 0.35, ease: 'power3.out', onComplete: function () { s.remove(); } });
    })();
  }
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 1.5c.4 4.8 2.1 7.8 5.1 9.1L23 12l-5.9 1.4c-3 1.3-4.7 4.3-5.1 9.1-.4-4.8-2.1-7.8-5.1-9.1L1 12l5.9-1.4C9.9 9.3 11.6 6.3 12 1.5Z"/></svg>';
  function stars(from, to, n, done) {
    if (Z.still) { done(); return; }
    var left = n, fin = false;
    function end() { if (fin) return; fin = true; done(); }
    for (var i = 0; i < n; i++) (function (i) {
      var o = document.createElement('i'); o.className = 'fx__star'; o.innerHTML = STAR; fx.appendChild(o);
      var bend = (i % 2 ? 1 : -1) * (80 + Math.random() * 120);
      var mx = (from.x + to.x) / 2 + bend, my = Math.min(from.y, to.y) - 40 - Math.random() * 120, st = { t: 0 };
      gsap.set(o, { x: from.x, y: from.y, scale: 0.4, rotation: Math.random() * 90 });
      gsap.to(o, { scale: 1, duration: 0.25, delay: i * 0.06, ease: 'back.out(3)' });
      gsap.to(st, { t: 1, duration: 0.75 + Math.random() * 0.25, delay: 0.1 + i * 0.06, ease: 'power2.in',
        onUpdate: function () { var t = st.t, u = 1 - t; gsap.set(o, { x: u * u * from.x + 2 * u * t * mx + t * t * to.x, y: u * u * from.y + 2 * u * t * my + t * t * to.y, rotation: '+=' + 9, scale: 1 - t * 0.55 }); },
        onComplete: function () {
          o.remove(); sfx.coin(i);
          if (meter) { meter.classList.remove('is-hit'); void meter.offsetWidth; meter.classList.add('is-hit'); }
          if (--left === 0) end();
        } });
    })(i);
    setTimeout(end, 2400);
  }
  XP.award = function (id, el, amount, label) {
    if (XP.got[id]) return false; XP.got[id] = true;
    var before = XP.total, gain = Math.min(amount || XP.per, XP.max - XP.total); if (gain <= 0) return false;
    XP.total += gain; var after = XP.total;
    var c = el && el.getBoundingClientRect().width ? center(el) : { x: innerWidth / 2, y: innerHeight / 2 };
    /* one gold orb leaves what you clicked, arcs into the star in the meter, the meter takes it in, the number rolls */
    var star = meter && meter.querySelector('.xpm__star'), t = star ? center(star) : center(meter || startBtn);
    function land() {
      odo(after, true); setFill();
      if (star && !Z.still) { gsap.fromTo(star, { scale: 1.55, rotation: -18 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(3)' }); }
      if (meter && !Z.still) { meter.classList.remove('is-hit'); void meter.offsetWidth; meter.classList.add('is-hit'); }
    }
    if (Z.still) land();
    else {
      var orb = document.createElement('img'); orb.className = 'fx__orbstar'; orb.src = 'assets/brand/xp-star.png'; orb.alt = ''; fx.appendChild(orb);
      var p = { k: 0 }, cx = (c.x + t.x) / 2, cy = Math.min(c.y, t.y) - Math.max(120, Math.abs(c.x - t.x) * 0.25);
      gsap.set(orb, { x: c.x, y: c.y, scale: 0 });
      gsap.timeline({ onComplete: function () { orb.remove(); land(); } })
        .to(orb, { scale: 1.3, duration: 0.25, ease: 'back.out(3)' }, 0)
        .to(p, { k: 1, duration: 0.85, ease: 'power2.inOut', onUpdate: function () {
          var k = p.k, u = 1 - k, x = u * u * c.x + 2 * u * k * cx + k * k * t.x, y = u * u * c.y + 2 * u * k * cy + k * k * t.y;
          gsap.set(orb, { x: x, y: y, rotation: k * 280 });
        } }, 0.12)
        .to(orb, { scale: 0.55, duration: 0.3, ease: 'power2.in' }, 0.67);
    }
    Z.emit('xp', { id: id, total: after }); return true;
  };

  /* ---------- the dock: the only navigation. logo, Start, menu ---------- */
  function initDock() {
    var dock = $('[data-dock]'), menu = $('.menu'), burger = $('.dock__menu');
    function setMenu(open) {
      menu.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open)); menu.toggleAttribute('inert', !open);
      dock.classList.toggle('is-menu', open);
      open ? sfx.open() : sfx.close();
    }
    buildVersions();
    burger.addEventListener('click', function () { var o = !menu.classList.contains('is-open'); setMenu(o); if (o) XP.award('menu', burger, 250, 'Found the menu'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
    document.addEventListener('pointerdown', function (e) { if (menu.classList.contains('is-open') && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false); });
    $$('[data-go]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); setMenu(false); sfx.tick();
        var key = a.getAttribute('data-go'), y = key === 'top' ? 0 : (Z.anchors && Z.anchors[key] ? Z.anchors[key]() : $('#' + key));
        if (y === null || y === undefined) return;
        var top = typeof y === 'number' ? y : y.getBoundingClientRect().top + scrollY;
        if (Z.pt && !Z.still) Z.pt.cover(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2, function () { window.scrollTo({ top: top, behavior: 'instant' }); ScrollTrigger.update(); Z.pt.uncover(); });
        else Z.scrollTo(y, { duration: 1.6 });
      });
    });
    /* Start opens the product. the onboarding greets you with its own draw-a-zero */
    function go(e) { sfx.tick(); if (!Z.START_DIRECT) return; var r = startBtn.getBoundingClientRect(); var x = e && e.clientX ? e.clientX : r.left + r.width / 2, y = e && e.clientY ? e.clientY : r.top + r.height / 2; if (Z.pt) Z.pt.cover(x, y, function () { location.href = Z.START_DIRECT; }); else location.href = Z.START_DIRECT; }
    startBtn.addEventListener('click', go);
    startBtn.addEventListener('pointerenter', function () { sfx.hover(); });
    $$('[data-start-go]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); XP.award('start-hero', b); var ev = { clientX: e.clientX, clientY: e.clientY }; setTimeout(function () { go(ev); }, 650); }); });
    $$('[data-sound]').forEach(function (b) { b.addEventListener('click', function () { sfx.set(!sfx.on); if (sfx.on) XP.award('sound', b, 250, 'Sound on'); }); });
    $$('[data-motion]').forEach(function (mo) {
      mo.addEventListener('click', function () {
        var off = !root.classList.contains('motion-off');
        try { sessionStorage.setItem('zero-motion-off', off ? '1' : ''); } catch (e) {}
        location.reload();
      });
    });
    Z.dock = Z.nav = { away: function (v) { dock.classList.toggle('is-away', v); if (v) setMenu(false); } };
  }

  /* every build of this site is still standing. the gear jumps between them */
  function buildVersions() {
    var box = $('[data-versions]'); if (!box || !Z.VERSIONS) return;
    box.innerHTML = Z.VERSIONS.map(function (v) {
      var here = v.id === Z.VERSION;
      return '<a class="ver ver--key" href="' + v.url + '"' + (here ? ' aria-current="true"' : '') + ' title="' + v.n + ': ' + v.t + '">' + v.n.replace('V', '') + '</a>';
    }).join('');
    $$('.ver', box).forEach(function (a) {
      a.addEventListener('click', function (e) { if (a.getAttribute('aria-current')) { e.preventDefault(); sfx.tick(); } });
      a.addEventListener('pointerenter', function () { sfx.hover(); });
    });
  }

  /* ---------- reveals ---------- */
  function initReveals() {
    var els = $$('[data-reveal]');
    if (Z.still) return;
    // scroll position, not IntersectionObserver: it also fires when you land mid page or jump with the menu
    els.forEach(function (e) {
      var kids = e.hasAttribute('data-reveal-kids') ? Array.prototype.slice.call(e.children) : [e];
      gsap.set(kids, { opacity: 0, y: 22 });
      ScrollTrigger.create({ trigger: e, start: 'top 88%', once: true, onEnter: function () {
        Z.safe(gsap.timeline().to(kids, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'zeroOut', clearProps: 'transform' }), 2400);
      } });
    });
  }

  /* ---------- loader ---------- */
  function runLoader(done) {
    /* zero to a hundred: a quiet count and a hairline, then the page lifts in underneath */
    var el = $('.loader'), num = $('[data-loader-n]'), bar = $('[data-loader-bar]');
    if (!el) return done();
    if (Z.still) { el.remove(); return done(); }
    var c = { v: 0 }, ready = false, finished = false;
    gsap.to(c, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: function () { num.textContent = Math.round(c.v); bar.style.transform = 'scaleX(' + (c.v / 100).toFixed(3) + ')'; }, onComplete: function () { ready = true; out(); } });
    function out() {
      if (finished || !ready || !Z._assets) return; finished = true;
      var tl = gsap.timeline({ onComplete: function () { el.remove(); } });
      tl.to([num, $('.loader__bar')], { opacity: 0, y: -14, duration: 0.35, ease: 'power2.in', stagger: 0.05 }, 0.1)
        .to(el, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.35)
        .add(done, 0.4);
    }
    Z._loaderOut = out;
    setTimeout(function () { Z._assets = true; ready = true; out(); }, 3200);   // never hold the door
    setTimeout(function () { if (el.parentNode) { el.remove(); if (!finished) { finished = true; done(); } } }, 4200);
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    try { if (sessionStorage.getItem('zero-motion-off')) root.classList.add('motion-off'); } catch (e) {}
    Z.still = Z.reduced || root.classList.contains('motion-off');
    if (Z.still) root.classList.add('is-still');
    fx = $('.fx'); meter = $('[data-xpm]'); meterWhy = $('[data-xp-why]'); meterNum = $('[data-xp]'); meterLv = $('[data-lv]'); ring = $('.xpm__arc'); startBtn = $('.dock .start');
    var mo = $('[data-motion]'); if (mo) { mo.setAttribute('aria-pressed', String(!root.classList.contains('motion-off'))); mo.querySelector('span').textContent = root.classList.contains('motion-off') ? 'Motion off' : 'Motion on'; }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    startLenis(); initDock(); setFill(); odo(0, false); if (ring) { ring.setAttribute('stroke-dasharray', RING.toFixed(2)); ring.setAttribute('stroke-dashoffset', RING.toFixed(2)); }

    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var img = Promise.resolve();
    Promise.all([fonts, img]).then(function () { Z._assets = true; if (Z._loaderOut) Z._loaderOut(); });

    Z.mods.forEach(function (m) { try { m.init(); } catch (e) { console.error('[zero] ' + m.name + ' failed', e); } });
    root.classList.add('is-past');
    ScrollTrigger.sort(); ScrollTrigger.refresh();
    runLoader(function () { root.classList.add('is-ready'); Z.emit('ready'); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  });
})();
