/* Film. Every real recording on the page: fetched when it is close, played only while you can see it.
   Plus the three places you steer the footage: the tool tabs, the truth list, the coach list. */
(function () {
  'use strict';
  var Z = window.ZERO, $ = Z.$, $$ = Z.$$;

  function load(v) {
    if (v._l || !v.dataset.src) return; v._l = true;
    v.innerHTML = '<source src="' + v.dataset.src + '.webm" type="video/webm"><source src="' + v.dataset.src + '.mp4" type="video/mp4">';
    v.load();
  }
  function play(v) { load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  Z.film = { load: load, play: play };

  Z.mods.push({ name: 'film', init: function () {
    var vids = $$('[data-film] video');
    if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { load(v); }); return; }

    /* fetch ahead of arrival */
    var near = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { load(e.target); near.unobserve(e.target); } }); }, { rootMargin: '600px 0px' });
    /* play only on screen */
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target; v._in = e.isIntersecting;
        if (e.isIntersecting && !Z.still) play(v); else v.pause();
      });
    }, { threshold: 0.3 });
    vids.forEach(function (v) { near.observe(v); seen.observe(v); });
    if (Z.still) vids.forEach(function (v) { load(v); });

    /* ---- tools: each tab jumps the real montage to that tool ---- */
    var tools = $('[data-tools]');
    if (tools) {
      var tv = $('video', tools), tabs = $$('.tool', tools), marks = tabs.map(function (t) { return parseFloat(t.getAttribute('data-t')); });
      function mark(i) { tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); }); }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { load(tv); try { tv.currentTime = marks[i]; } catch (e) {} play(tv); mark(i); Z.sfx.tick(); Z.XP.award('tools', t); });
      });
      tv.addEventListener('timeupdate', function () {
        var c = tv.currentTime, i = 0;
        marks.forEach(function (m, k) { if (c >= m) i = k; });
        mark(i);
      });
    }

    /* ---- truth: three moments share one frame, they take turns ---- */
    var truth = $('[data-truth]');
    if (truth) {
      var tvs = $$('video', truth), items = $$('.truth__item', truth), cur = 0, t0 = 0, raf = 0, hold = false, DUR = 7000;
      tvs.forEach(function (v) { near.observe(v); });
      function show(i, user) {
        cur = i; t0 = performance.now();
        items.forEach(function (it, k) { it.setAttribute('aria-selected', String(k === i)); it.querySelector('.truth__bar').style.setProperty('--p', 0); });
        tvs.forEach(function (v, k) { v.classList.toggle('is-on', k === i); if (k === i && truth._in) { v.currentTime = 0; play(v); } else v.pause(); });
        if (user) { hold = true; Z.sfx.tick(); Z.XP.award('truth', items[i]); }
      }
      function tick(now) {
        raf = requestAnimationFrame(tick);
        if (!truth._in || hold || Z.still) return;
        var p = Math.min(1, (now - t0) / DUR);
        items[cur].querySelector('.truth__bar').style.setProperty('--p', p.toFixed(3));
        if (p >= 1) show((cur + 1) % items.length);
      }
      items.forEach(function (it, i) { it.addEventListener('click', function () { show(i, true); }); });
      new IntersectionObserver(function (es) {
        truth._in = es[0].isIntersecting;
        if (truth._in) { tvs.forEach(load); show(cur); if (!raf) raf = requestAnimationFrame(tick); }
        else tvs.forEach(function (v) { v.pause(); });
      }, { threshold: 0.35 }).observe(truth);
    }

    /* ---- coaches: you in the middle, the four real coaches round you as halftone circles, joined by lines.
       pick one and its line goes solid, a pulse runs out to them, their photo comes through the dots ---- */
    var nodes = $('[data-coaches]'), line = $('[data-coach-line]'), who = $('[data-coach-who]'), svg = $('[data-cnet-lines]');
    if (nodes && Z.coaches) {
      var SPOT = [[20, 22], [80, 17], [18, 79], [82, 80]], NS = 'http://www.w3.org/2000/svg';
      var cs = Z.coaches.slice(0, 4), pick = 2;
      nodes.innerHTML = cs.map(function (c, i) {
        return '<button class="cnode" type="button" data-cursor="Pick" aria-pressed="' + (i === pick) + '" style="left:' + SPOT[i][0] + '%;top:' + SPOT[i][1] + '%;--delay:' + (-i * 1.4) + 's">' +
          '<span class="cnode__face"><img src="assets/cast/' + c.key + '-sq.webp" alt="" width="400" height="400" loading="lazy" decoding="async"><canvas class="cnode__dots" aria-hidden="true"></canvas></span>' +
          '<span class="cnode__name">' + c.name + ' <span>' + c.style.toLowerCase() + '</span></span></button>';
      }).join('');
      /* a gentle curve from you to each coach */
      var paths = SPOT.map(function (p, i) {
        var mx = (50 + p[0]) / 2, my = (50 + p[1]) / 2, dx = p[0] - 50, dy = p[1] - 50, k = (i % 2 ? 0.22 : -0.22);
        return 'M50 50 Q' + (mx - dy * k).toFixed(1) + ' ' + (my + dx * k).toFixed(1) + ' ' + p[0] + ' ' + p[1];
      });
      svg.innerHTML = paths.map(function (d, i) { return '<path class="cnet__path" d="' + d + '" data-i="' + i + '"/>'; }).join('') +
        '<circle class="cnet__pulse" r="1.3"><animateMotion dur="1.8s" repeatCount="indefinite" path="' + paths[pick] + '"/></circle>';
      var btns = $$('.cnode', nodes), lines = $$('.cnet__path', svg), pulse = $('.cnet__pulse', svg);
      function mark(i) {
        lines.forEach(function (l, k) { l.classList.toggle('is-on', k === i); });
        var am = pulse.querySelector('animateMotion'); am.setAttribute('path', paths[i]);
        if (am.beginElement) try { am.beginElement(); } catch (e) {}
      }
      mark(pick);
      /* each coach is a dotted halftone until you pick them or point at them */
      if (Z.ascii) btns.forEach(function (b, i) { Z.ascii($('.cnode__dots', b), 'assets/cast/' + cs[i].key + '-sq.webp', { cell: innerWidth < 700 ? 4 : 6, ink: '15,15,15', halftone: true, lens: 1, zoom: 1.05 }); });
      btns.forEach(function (b, i) {
        b.addEventListener('click', function () {
          if (b.getAttribute('aria-pressed') === 'true') return;
          btns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          mark(i); Z.sfx.tick(); Z.XP.award('coach', b);
          var txt = '\u201c' + cs[i].line + '\u201d', w = cs[i].name + ', ' + cs[i].style.toLowerCase();
          if (Z.still) { line.textContent = txt; who.textContent = w; return; }
          gsap.to([line, who], { opacity: 0, filter: 'blur(8px)', y: -8, duration: 0.25, ease: 'power2.in', onComplete: function () {
            line.textContent = txt; who.textContent = w;
            gsap.fromTo([line, who], { opacity: 0, filter: 'blur(8px)', y: 10 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.7, stagger: 0.06, ease: 'zeroOut', clearProps: 'filter' });
          } });
        });
        b.addEventListener('pointerenter', function () { Z.sfx.hover(); });
      });
      /* arrival: the lines draw out from you, then the coaches land at their ends */
      if (!Z.still) {
        lines.forEach(function (l) { var L = l.getTotalLength(); l.style.strokeDasharray = L + ' ' + L; l.style.strokeDashoffset = L; });
        gsap.set(btns, { opacity: 0, scale: 0.7 });
        gsap.set('.cnet__you', { scale: 0.6, opacity: 0 });
        ScrollTrigger.create({ trigger: '[data-cnet]', start: 'top 72%', once: true, onEnter: function () {
          var tl = gsap.timeline();
          tl.to('.cnet__you', { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)' }, 0)
            .to(lines, { strokeDashoffset: 0, duration: 1, stagger: 0.08, ease: 'power2.inOut', onComplete: function () { lines.forEach(function (l) { l.style.strokeDasharray = ''; l.style.strokeDashoffset = ''; }); } }, 0.2)
            .to(btns, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'back.out(1.6)', clearProps: 'transform,scale' }, 0.7);
          Z.safe(tl, 3500);
        } });
      }
    }
  } });
})();
