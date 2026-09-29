/* V16, Navid's story. The talent network wall, the dream-role picker, the level-up matches, your manager in
   the workspace, Ask Zero, and the one time we explain what credits are. */
(function () {
  'use strict';
  var Z = window.ZERO, $ = Z.$, $$ = Z.$$;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tool(k) { var t = (Z.tools || {})[k]; return t ? '<span class="tchip"><img src="assets/' + t[0] + '" alt="" width="16" height="16">' + t[1] + '</span>' : ''; }
  function brand(k) { return 'assets/brands/' + k + '.svg'; }

  /* start the product, carrying the role you picked so onboarding can meet you there */
  Z.startWith = function (role, e) {
    var base = Z.START_DIRECT || Z.START_URL; if (!base) return;
    var url = base + (role ? (base.indexOf('?') > -1 ? '&' : '?') + 'role=' + encodeURIComponent(role) : '');
    var x = e && e.clientX ? e.clientX : innerWidth / 2, y = e && e.clientY ? e.clientY : innerHeight / 2;
    if (Z.pt && !Z.still) Z.pt.cover(x, y, function () { location.href = url; }); else location.href = url;
  };

  Z.mods.push({ name: 'v16', init: function () {

    /* ---------- 3. the talent network: the teams float round the line and drift apart as you arrive ---------- */
    var net = $('[data-net]'), logos = $('[data-net-logos]');
    if (net && logos && Z.network) {
      var SPOTS = [[7, 14, 1], [22, 30, 0.6], [40, 9, 0.8], [60, 10, 0.5], [79, 18, 1], [93, 36, 0.7], [84, 54, 0.4], [92, 76, 0.8], [74, 90, 1], [55, 93, 0.6], [36, 90, 0.8], [18, 78, 0.5], [6, 58, 0.9], [15, 44, 0.4], [25, 64, 0.35], [77, 34, 0.35]];   // kept clear of the line in the middle
      /* phones: two bands, above and below the line, so nothing sits on the words */
      if (innerWidth < 760) SPOTS = [[10, 7, 1], [30, 13, 0.6], [50, 5, 0.8], [70, 13, 0.5], [90, 7, 1], [20, 23, 0.4], [80, 23, 0.7], [42, 21, 0.35], [10, 80, 0.9], [30, 88, 0.6], [50, 94, 0.8], [70, 88, 0.5], [90, 80, 1], [20, 72, 0.4], [80, 72, 0.7], [58, 78, 0.35]];
      logos.innerHTML = Z.network.map(function (k, i) {
        var s = SPOTS[i % SPOTS.length], ink = (Z.brandInk || {})[k];
        return '<span class="nb" style="left:' + s[0] + '%;top:' + s[1] + '%;--d:' + s[2] + ';--c:' + (ink || 'var(--c-' + k + ', #111)') + '"><img src="' + brand(k) + '" alt="" width="24" height="24"></span>';
      }).join('');
      /* brand colours from simple-icons, set once */
      fetch('assets/brands/colors.json').then(function (r) { return r.json(); }).then(function (c) {
        $$('.nb', logos).forEach(function (b, i) { var k = Z.network[i]; if (!(Z.brandInk || {})[k] && c[k]) b.style.setProperty('--c', '#' + c[k].hex); });
      }).catch(function () {});
      var bubbles = $$('.nb', logos);
      if (!Z.still) {
        bubbles.forEach(function (b) {
          var d = parseFloat(b.style.getPropertyValue('--d')) || 0.6;
          var dx = (50 - parseFloat(b.style.left)) * 0.55, dy = (50 - parseFloat(b.style.top)) * 0.55;
          gsap.fromTo(b, { xPercent: dx * 6, yPercent: dy * 6, scale: 0.5, opacity: 0 }, { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: net, start: 'top 90%', end: 'top 25%', scrub: 0.8 } });
          gsap.to(b, { y: -60 * d, ease: 'none', scrollTrigger: { trigger: net, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
        net.addEventListener('pointermove', function (e) {
          var r = net.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
          bubbles.forEach(function (b) { var d = parseFloat(b.style.getPropertyValue('--d')) || 0.6; gsap.to(b, { x: -nx * 40 * d, rotation: nx * 6 * d, duration: 0.9, ease: 'power3.out', overwrite: 'auto' }); });
        });
      }
      bubbles.forEach(function (b) { b.addEventListener('pointerenter', function () { Z.sfx.hover(); Z.XP.award('network', b, 250, 'Talent network'); }); });
    }

    /* ---------- 4. the roles: one full screen. the role plays full bleed, the row switches it, and it rotates on
       its own every few seconds until you pick one ---------- */
    var bill = $('[data-bill]'), row = $('[data-roles]');
    if (bill && row && Z.roles) {
      var bv = $('[data-bill-video]', bill), info = $('.roles__main', bill), bg = $('.roles__bg', bill), picked = 0, auto = true, timer = 0, DWELL = 7000;
      row.innerHTML = Z.roles.map(function (r, i) {
        return '<button class="rtile" type="button" role="listitem" aria-pressed="' + (i === 0) + '">' +
          '<span class="rtile__top">' + (r.tag ? '<span class="rtile__tag rtile__tag--' + r.tag.toLowerCase() + '">' + r.tag + '</span>' : '') + '</span>' +
          '<span class="rtile__t">' + esc(r.t) + '</span>' +
          '<span class="rtile__tools">' + r.tools.map(function (k) { var t = (Z.tools || {})[k]; return t ? '<img src="assets/' + t[0] + '" alt="' + t[1] + '" width="16" height="16">' : ''; }).join('') + '</span>' +
          '<i class="rtile__bar" aria-hidden="true"><b></b></i></button>';
      }).join('');
      var tiles = $$('.rtile', row);
      function src(r) { return r.v.indexOf('film/') === 0 ? '<source src="assets/' + r.v + '.webm" type="video/webm"><source src="assets/' + r.v + '.mp4" type="video/mp4">' : '<source src="assets/' + r.v + '.mp4" type="video/mp4">'; }
      function poster(r) { return r.v.indexOf('film/') === 0 ? 'assets/' + r.v + '.webp' : 'assets/zw/card-poster.svg'; }
      function bar(i) {
        tiles.forEach(function (t, k) { var b = $('.rtile__bar b', t); gsap.killTweensOf(b); gsap.set(b, { scaleX: 0 }); });
        if (!auto || Z.still || !bill._in) return;
        gsap.to($('.rtile__bar b', tiles[i]), { scaleX: 1, duration: DWELL / 1000, ease: 'none' });
      }
      function schedule() { clearTimeout(timer); if (!auto || Z.still || !bill._in) return; timer = setTimeout(function () { paint((picked + 1) % Z.roles.length, true); }, DWELL); bar(picked); }
      function paint(i, animate) {
        var r = Z.roles[i]; picked = i;
        tiles.forEach(function (c, k) { c.setAttribute('aria-pressed', String(k === i)); });
        var t = tiles[i]; if (t && t.parentNode) { var rr = row.getBoundingClientRect(), tr = t.getBoundingClientRect(); if (tr.left < rr.left || tr.right > rr.right) row.scrollTo({ left: row.scrollLeft + tr.left - rr.left - 24, behavior: 'smooth' }); }
        function fill() {
          var tag = $('[data-bill-tag]', bill); tag.textContent = r.tag || 'Open role'; tag.className = 'bill__tag bill__tag--' + (r.tag ? r.tag.toLowerCase() : 'open');
          $('[data-bill-t]', bill).textContent = r.t;
          $('[data-bill-d]', bill).textContent = r.ship;
          $('[data-bill-tools]', bill).innerHTML = r.tools.map(tool).join('');
          bv.setAttribute('poster', poster(r)); bv.innerHTML = src(r); bv.load();
          if (bill._in && !Z.still) { var p = bv.play(); if (p && p.catch) p.catch(function () {}); }
        }
        schedule();
        if (!animate || Z.still) return fill();
        gsap.to(info, { opacity: 0, y: 14, filter: 'blur(6px)', duration: 0.25, ease: 'power2.in', onComplete: function () {
          fill(); gsap.fromTo(info, { opacity: 0, y: 16, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'zeroOut', clearProps: 'filter' });
        } });
        gsap.fromTo(bg, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', clearProps: 'clipPath' });
      }
      paint(0, false);
      tiles.forEach(function (c, i) {
        c.addEventListener('click', function () { auto = false; clearTimeout(timer); bar(i); if (i !== picked) { Z.sfx.tick(); paint(i, true); } Z.XP.award('role-' + i, c, 250, Z.roles[i].t); });
        c.addEventListener('pointerenter', function () { Z.sfx.hover(); });
      });
      $('[data-role-go]', bill).addEventListener('click', function (e) { e.preventDefault(); Z.XP.award('role-go', e.currentTarget, 250, 'Go'); Z.startWith(Z.roles[picked].id, e); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
        bill._in = es[0].isIntersecting;
        if (bill._in && !Z.still) { var p = bv.play(); if (p && p.catch) p.catch(function () {}); schedule(); } else { bv.pause(); clearTimeout(timer); bar(-1); }
      }, { threshold: 0.4 }).observe(bill);
      if (!Z.still) {
        gsap.from(tiles, { opacity: 0, y: 30, duration: 0.9, stagger: 0.05, ease: 'zeroOut', scrollTrigger: { trigger: bill, start: 'top 55%', once: true } });
        gsap.from($('.roles__kicker', bill), { opacity: 0, y: 20, duration: 1, ease: 'zeroOut', scrollTrigger: { trigger: bill, start: 'top 60%', once: true } });
      }
    }

    /* ---------- 5b. your manager, live in the workspace step ---------- */
    var chat = $('[data-chat]');
    if (chat && Z.manager) {
      var log = $('[data-chat-log]', chat), form = $('[data-chat-form]', chat), input = $('[data-chat-input]', chat), turn = 0;
      function add(text, who) { var p = document.createElement('p'); p.className = 'msg msg--' + who; p.textContent = text; log.appendChild(p); log.scrollTop = log.scrollHeight; if (!Z.still) gsap.from(p, { opacity: 0, y: 8, duration: 0.35, ease: 'zeroOut' }); return p; }
      function reply(q) {
        var l = q.toLowerCase(), hit = null;
        Z.manager.keys.forEach(function (k) { if (!hit && k.k.some(function (w) { return new RegExp('\\b' + w + '\\b').test(l); })) hit = k.a; });
        return hit || Z.manager.replies[turn++ % Z.manager.replies.length];
      }
      form.addEventListener('submit', function (e) {
        e.preventDefault(); var q = input.value.trim(); if (!q) return; input.value = '';
        add(q, 'me'); Z.sfx.tick();
        var dots = add('•••', 'them'); dots.classList.add('msg--typing');
        setTimeout(function () { dots.remove(); add(reply(q), 'them'); Z.XP.award('manager-chat', form, 250, 'Talked to your manager'); }, 900);
      });
    }

    /* ---------- 5c. the portfolio step sweeps the seam from resume to portfolio when it arrives ---------- */
    Z.on('story', function (d) {
      if (d.i !== 4 || Z.still) return;
      var box = $('.rvp'), range = box && $('.compare__range', box); if (!box) return;
      var o = { v: 92 };
      gsap.to(o, { v: 14, duration: 1.8, delay: 0.3, ease: 'power2.inOut', onUpdate: function () { box.style.setProperty('--s', o.v.toFixed(1) + '%'); if (range) range.value = Math.round(o.v); } });
    });

    /* ---------- 6. the outcome: scroll to level up, and more roles unlock ---------- */
    var out = $('[data-out]'), mg = $('[data-matches]');
    if (out && mg && Z.matches) {
      var LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v10H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
      mg.innerHTML = Z.matches.map(function (m) {
        return '<div class="mcard" role="listitem" data-lvl="' + m.lvl + '"><span class="mcard__logo"><img src="' + brand(m.co) + '" alt="" width="22" height="22"></span>' +
          '<span class="mcard__txt"><b>' + esc(m.role) + '</b><span>' + esc(m.co.charAt(0).toUpperCase() + m.co.slice(1)) + '</span></span>' +
          '<span class="mcard__state"><span class="mcard__lock">' + LOCK + 'Level ' + m.lvl + '</span><span class="mcard__ok">Intro ready</span></span></div>';
      }).join('');
      var mcards = $$('.mcard', mg), lvlEl = $('[data-lvl]', out), unEl = $('[data-unlocked]', out), bar = $('[data-lvl-bar]', out), L0 = 0;
      function setLevel(L, quiet) {
        if (L === L0) return; L0 = L;
        var n = 0;
        mcards.forEach(function (c) { var on = +c.getAttribute('data-lvl') <= L; c.classList.toggle('is-on', on); if (on) n++; });
        lvlEl.textContent = L; if (Z.odomUpdate && !quiet) Z.odomUpdate(unEl, String(n), { duration: 0.6 }); else unEl.textContent = n;
        if (!quiet) { Z.sfx.step(L); if (L > 1) Z.XP.award('level-' + L, lvlEl, 250, 'Level ' + L); }
      }
      setLevel(1, true);
      if (Z.still) setLevel(5, true);
      else ScrollTrigger.create({ trigger: out, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: function (self) {
        var p = self.progress; bar.style.transform = 'scaleX(' + Math.max(0.06, p).toFixed(3) + ')';
        setLevel(Math.min(5, 1 + Math.floor(p * 5.2)));
      } });
    }

    /* ---------- Ask Zero: the question mark in the dock ---------- */
    var help = $('[data-help]'), hOpen = $('[data-help-open]');
    if (help && hOpen && Z.faq) {
      var hlog = $('[data-help-log]', help), hform = $('[data-help-form]', help), hin = $('[data-help-input]', help), chips = $('[data-help-chips]', help);
      chips.innerHTML = Z.faq.map(function (f, i) { return '<button type="button" class="hchip" data-q="' + i + '">' + esc(f.q) + '</button>'; }).join('');
      function hadd(text, who) { var p = document.createElement('p'); p.className = 'msg msg--' + who; p.textContent = text; hlog.appendChild(p); hlog.scrollTop = hlog.scrollHeight; if (!Z.still) gsap.from(p, { opacity: 0, y: 8, duration: 0.35, ease: 'zeroOut' }); return p; }
      function answer(q) {
        var l = q.toLowerCase(), best = null, score = 0;
        Z.faq.forEach(function (f) { var s = 0; f.k.forEach(function (w) { if (l.indexOf(w) > -1) s += w.length; }); if (s > score) { score = s; best = f; } });
        return best ? best.a : Z.faqMiss;
      }
      function ask(q) { hadd(q, 'me'); var d = hadd('•••', 'them'); d.classList.add('msg--typing'); setTimeout(function () { d.remove(); hadd(answer(q), 'them'); }, 700); Z.XP.award('asked-zero', hOpen, 250, 'Asked Zero'); }
      function setHelp(on) {
        help.classList.toggle('is-open', on); help.toggleAttribute('inert', !on); hOpen.setAttribute('aria-expanded', String(on));
        if (on) { Z.sfx.open(); setTimeout(function () { hin.focus({ preventScroll: true }); }, 250); } else Z.sfx.close();
      }
      hOpen.addEventListener('click', function () { setHelp(!help.classList.contains('is-open')); });
      $('[data-help-close]', help).addEventListener('click', function () { setHelp(false); });
      $$('.hchip', chips).forEach(function (b) { b.addEventListener('click', function () { ask(Z.faq[+b.getAttribute('data-q')].q); }); });
      hform.addEventListener('submit', function (e) { e.preventDefault(); var q = hin.value.trim(); if (!q) return; hin.value = ''; ask(q); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && help.classList.contains('is-open')) setHelp(false); });
      document.addEventListener('pointerdown', function (e) { if (help.classList.contains('is-open') && !help.contains(e.target) && !hOpen.contains(e.target)) setHelp(false); });
    }

    /* ---------- credits: the first time you earn, say what they are ---------- */
    var tip = $('[data-credtip]'), told = false;
    if (tip) {
      Z.on('xp', function () {
        if (told) return; told = true;
        tip.hidden = false;
        if (!Z.still) gsap.fromTo(tip, { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 1.2, ease: 'back.out(1.6)' });
        var t = setTimeout(close, 7000);
        function close() { clearTimeout(t); if (Z.still) { tip.hidden = true; return; } gsap.to(tip, { opacity: 0, y: 8, duration: 0.3, onComplete: function () { tip.hidden = true; } }); }
        $('[data-credtip-ok]', tip).onclick = close;
      });
    }
  } });
})();
