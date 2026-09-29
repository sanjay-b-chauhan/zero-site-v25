/* The gate. Draw a zero with your own hand; the ink floods the screen in the onboarding's own dark
   and the product opens past its draw screen, so the gesture is only ever asked for once.
   The ink lives on a canvas the size of the whole gate, so a big loose circle is never cut off at a box edge.
   With a mouse you can draw anywhere on the gate; on a phone only inside the ring, so the page still scrolls.
   The circle is judged kindly: closed enough, round enough, most of the way round. */
(function () {
  'use strict';
  var Z = window.ZERO, $ = Z.$, $$ = Z.$$;

  Z.mods.push({ name: 'gate', init: function () {
    var gate = $('#gate'), box = $('[data-draw]'); if (!gate || !box) return;
    var stage = gate.closest('[data-play]');
    var cv = $('[data-ink]', gate), ctx = cv.getContext('2d'), flood = $('[data-pt]'), skip = $('[data-skip]');
    var pts = [], drawing = false, done = false, dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0;

    function size() {
      var r = gate.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); paint();
    }
    /* a smooth path through the points: midpoints joined by quadratic curves */
    function trace(from) {
      ctx.beginPath(); ctx.moveTo(pts[from].x, pts[from].y);
      for (var i = from + 1; i < pts.length - 1; i++) {
        var mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    }
    function paint() {
      ctx.clearRect(0, 0, W, H);
      if (pts.length < 2) return;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      /* the ink: a wide soft halo, then a thick solid core. its colours come from the close's layout */
      var ink = gate._ink || (gate._ink = inkOf());
      ctx.shadowBlur = 0; ctx.lineWidth = 64; ctx.strokeStyle = ink.halo; trace(0); ctx.stroke();
      ctx.shadowBlur = 26; ctx.shadowColor = ink.glow;
      ctx.lineWidth = 30; ctx.strokeStyle = ink.core; trace(0); ctx.stroke();
      ctx.shadowBlur = 0;
    }
    function inkOf() { var cs = getComputedStyle(gate); return { core: cs.getPropertyValue('--ink-core').trim() || '#fff', halo: cs.getPropertyValue('--ink-halo').trim() || 'rgba(255,255,255,.16)', glow: cs.getPropertyValue('--ink-glow').trim() || 'rgba(210,255,238,.9)' }; }
    function at(e) { var r = gate.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function centre() { var cx = 0, cy = 0; pts.forEach(function (p) { cx += p.x; cy += p.y; }); return { x: cx / pts.length, y: cy / pts.length }; }
    function judge() {
      if (pts.length < 14) return false;
      var c = centre(), i;
      var rs = pts.map(function (p) { return Math.hypot(p.x - c.x, p.y - c.y); });
      var mean = rs.reduce(function (a, b) { return a + b; }, 0) / rs.length;
      if (mean < 36) return false;
      var dev = rs.reduce(function (a, r) { return a + Math.abs(r - mean); }, 0) / rs.length / mean;
      var gap = Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y) / mean;
      var turn = 0;
      for (i = 1; i < pts.length; i++) {
        var d = Math.atan2(pts[i].y - c.y, pts[i].x - c.x) - Math.atan2(pts[i - 1].y - c.y, pts[i - 1].x - c.x);
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        turn += d;
      }
      return dev < 0.42 && gap < 0.95 && Math.abs(turn) > 4.2;
    }
    function leave(url, from) {
      if (done) return; done = true; gate.classList.add('is-done');
      if (Z.nav) Z.nav.away(true);
      var gr = gate.getBoundingClientRect(), br = box.getBoundingClientRect();
      var px = from ? gr.left + from.x : br.left + br.width / 2, py = from ? gr.top + from.y : br.top + br.height / 2;
      var x = (px / innerWidth * 100).toFixed(1), y = (py / innerHeight * 100).toFixed(1);
      var tl = gsap.timeline({ onComplete: function () { location.href = url; } });
      tl.to(cv, { scale: 1.06, transformOrigin: x + '% ' + y + '%', duration: 0.5, ease: 'zeroOut' }, 0)
        .fromTo(flood, { clipPath: 'circle(0% at ' + x + '% ' + y + '%)' }, { clipPath: 'circle(150% at ' + x + '% ' + y + '%)', duration: 1, ease: 'power3.in' }, 0.12);
      setTimeout(function () { location.href = url; }, 2400);   // never strand someone on a half-drawn flood
    }

    gate.addEventListener('pointerdown', function (e) {
      if (done || e.button > 0 || e.target.closest('a, button, .foot, [data-torus]') || (stage && !gate.classList.contains('is-live'))) return;
      if (e.pointerType !== 'mouse' && !e.target.closest('[data-draw]')) return;   // phones: only inside the ring
      e.preventDefault();
      drawing = true; pts = [at(e)]; gate._ink = inkOf(); gate.classList.add('is-drawing');
      gsap.killTweensOf(cv); gsap.set(cv, { opacity: 1 });
      try { gate.setPointerCapture(e.pointerId); } catch (err) {}
    });
    gate.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = at(e), l = pts[pts.length - 1];
      if (Math.hypot(p.x - l.x, p.y - l.y) > 3) { pts.push(p); paint(); }
    });
    function end() {
      if (!drawing) return; drawing = false; gate.classList.remove('is-drawing');
      if (judge()) { Z.sfx.win(); Z.XP.award('drew-zero', box); leave(Z.START_URL, centre()); }
      else { Z.safe(gsap.timeline({ onComplete: function () { pts = []; paint(); gsap.set(cv, { opacity: 1 }); } }).to(cv, { opacity: 0, duration: 0.45 }), 1200); }
    }
    gate.addEventListener('pointerup', end);
    gate.addEventListener('pointercancel', end);
    skip.addEventListener('click', function (e) { e.preventDefault(); leave(Z.START_DIRECT); });
    size(); addEventListener('resize', size);
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(gate);

    Z.anchors = Z.anchors || {};
    Z.anchors.gate = function () { return stage ? stage.getBoundingClientRect().top + scrollY + (stage.offsetHeight - innerHeight) * 0.7 : gate.getBoundingClientRect().top + scrollY; };
  } });
})();
