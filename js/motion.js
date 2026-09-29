/* Motion. The page-wide layer: a circle cursor, magnetic keys, circle-wipe page transitions, and the glass
   chrome turning light over dark ground. Every piece is off for touch, reduced motion and Motion off. */
(function () {
  'use strict';
  var Z = window.ZERO, $ = Z.$, $$ = Z.$$;

  /* ---- page transitions: one circle of ink grows from where you clicked, covers, then lets go ---- */
  Z.pt = {
    cover: function (x, y, done) {
      var el = $('[data-pt]');
      if (!el || Z.still) { done && done(); return; }
      var at = (x / innerWidth * 100).toFixed(1) + '% ' + (y / innerHeight * 100).toFixed(1) + '%';
      el.style.pointerEvents = 'auto';
      var tl = gsap.timeline({ onComplete: function () { done && done(); } });
      tl.fromTo(el, { clipPath: 'circle(0% at ' + at + ')' }, { clipPath: 'circle(150% at ' + at + ')', duration: 0.7, ease: 'power3.inOut' });
      setTimeout(function () { if (tl.progress() < 1) tl.progress(1); }, 1500);
    },
    uncover: function () {
      var el = $('[data-pt]'); if (!el) return;
      gsap.to(el, { clipPath: 'circle(0% at 50% 50%)', duration: 0.75, ease: 'power3.inOut', delay: 0.05, onComplete: function () { el.style.pointerEvents = 'none'; } });
    }
  };

  Z.mods.push({ name: 'motion', init: function () {
    var dock = $('[data-dock]'), huds = $$('.hud');

    /* glass chrome: light over dark ground */
    function tone() {
      var darkAt = function (y) { var hit = false; $$('[data-dark]').forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top < y && r.bottom > y) hit = true; }); return hit; };
      if (dock) dock.classList.toggle('is-dark', darkAt(innerHeight - 40));
      var top = darkAt(36); huds.forEach(function (h) { h.classList.toggle('is-dark', top); });
    }
    addEventListener('scroll', tone, { passive: true }); tone();

    if (Z.still || Z.coarse) return;

    /* the cursor: a small circle that swells over anything you can press. over footage it turns into a named
       pill ("Watch", "Drag", "Pick") that leans into the way you are moving */
    var cur = document.createElement('div'); cur.className = 'cur'; cur.setAttribute('aria-hidden', 'true');
    var bub = document.createElement('span'); bub.className = 'cur__b'; cur.appendChild(bub); document.body.appendChild(cur);
    var qx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3.out' }), qy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3.out' });
    var qr = gsap.quickTo(bub, 'rotation', { duration: 0.45, ease: 'power3.out' });
    var HOT = 'a, button, .job, .compare, [data-draw], .fcard, .ctile', lastX = 0, rest = 0, label = '';
    addEventListener('pointermove', function (e) {
      qx(e.clientX); qy(e.clientY);
      var tg = e.target.closest ? e.target : document.body;
      var named = tg.closest('[data-cursor]'), txt = named ? named.getAttribute('data-cursor') : '';
      if (txt !== label) {
        label = txt; cur.classList.toggle('is-label', !!txt);
        if (txt) { bub.textContent = txt; gsap.fromTo(bub, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' }); } else bub.textContent = '';
      }
      cur.classList.toggle('is-hot', !txt && !!tg.closest(HOT));
      cur.classList.toggle('is-hide', !!(tg.closest('[data-ascii]') || (tg.closest('#gate.is-live') && !tg.closest('a, button'))));
      cur.classList.add('is-on');
      if (txt) { qr(Z.clamp((e.clientX - lastX) * 0.9, -14, 14)); clearTimeout(rest); rest = setTimeout(function () { qr(0); }, 90); }
      lastX = e.clientX;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); });
    /* scrolling moves the page under a still pointer, so the label is re-read from what is now beneath it */
    var lastY = 0;
    addEventListener('pointermove', function (e) { lastY = e.clientY; }, { passive: true });
    addEventListener('scroll', function () {
      if (!label) return;
      var el = document.elementFromPoint(lastX, lastY), named = el && el.closest ? el.closest('[data-cursor]') : null, txt = named ? named.getAttribute('data-cursor') : '';
      if (txt !== label) { label = txt; cur.classList.toggle('is-label', !!txt); bub.textContent = txt; }
    }, { passive: true });
    addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    addEventListener('pointerup', function () { cur.classList.remove('is-down'); });

    /* magnetic keys: they lean toward the pointer, then settle back */
    $$('.start, .start-cta, .btn--light, .dock__menu, .dock__mark, .sound, .xpm').forEach(function (b) {
      var mx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3.out' }), my = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3.out' });
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        mx(dx * 0.22); my(dy * 0.3);
      });
      b.addEventListener('pointerleave', function () { mx(0); my(0); });
    });
  } });
})();
