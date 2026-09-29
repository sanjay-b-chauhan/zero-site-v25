/* V20. One flow, top to bottom.
   1. a faded laptop holds the line; scroll and Zero World opens inside its screen, the laptop comes up to meet you,
      and the four real jobs are live on it
   2. the teams: words left, every team scrolling in a container right
   3. the roles lead: the list is the headline, the film shows the work
   4. one held stage: the week, done for real on the right; Friday your resume turns into your portfolio, which
      carries on to the middle, the teams rise and come closer, it folds into a circle, you ready, let's start,
      and the circle opens into the draw that starts the onboarding */
(function () {
  'use strict';
  var Z = window.ZERO, $ = Z.$, $$ = Z.$$;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tool(k) { var t = (Z.tools || {})[k]; return t ? '<span class="tchip"><img src="assets/' + t[0] + '" alt="" width="16" height="16">' + t[1] + '</span>' : ''; }
  function small() { return innerWidth < 861; }
  function award(id, el, label) { if (Z.XP) Z.XP.award(id, el, 250, label); }
  function play(v) { if (!v || Z.still) return; if (Z.film) Z.film.load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function inView(el, cb, th) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, { threshold: th || 0 }).observe(el);
  }
  /* a chat that answers: keyword replies first, then a steady rotation */
  function chatbox(box, who, opts) {
    var log = $('.chat__log', box) || $('[data-ask-log]', box), form = $('form', box), input = form && $('input', form), turn = 0;
    function add(text, me) {
      var p = document.createElement('p'); p.className = 'msg msg--' + (me ? 'me' : 'them');
      if (!me && opts.face) p.innerHTML = '<img src="' + opts.face + '" alt="">' + esc(text); else p.textContent = text;
      log.appendChild(p); log.scrollTop = log.scrollHeight;
      if (!Z.still) gsap.from(p, { opacity: 0, y: 8, duration: 0.35, ease: 'zeroOut' });
      return p;
    }
    function reply(q) {
      var l = q.toLowerCase(), hit = null;
      (opts.keys || []).forEach(function (k) { if (!hit && k.k.some(function (w) { return new RegExp('\\b' + w + '\\b').test(l); })) hit = k.a; });
      return hit || opts.replies[turn++ % opts.replies.length];
    }
    function ask(q, answer) {
      add(q, true);
      var dots = add('•••'); dots.classList.add('msg--typing');
      setTimeout(function () { dots.remove(); add(answer || reply(q)); award('talk-' + who, box, opts.label); }, 850);
    }
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; input.value = ''; ask(q); });
    return { ask: ask, add: add };
  }

  Z.mods.push({ name: 'v20', init: function () {
    hero(); best(); flow();
  } });

  /* ================= 1. the line, the mark, the world, then the faded laptop ================= */
  function hero() {
    var sec = $('[data-hero]'); if (!sec) return;
    var dev = $('[data-dev]', sec), scr = $('[data-screen]', sec), portal = $('[data-portal]', sec), map = $('[data-map]', sec), cam = $('[data-cam]', sec);
    var ring = [$('[data-ring]', sec), $('[data-ring2]', sec), $('[data-base]', sec)];
    var pinsEl = $('[data-pins]', sec), copy = $('[data-copy]', sec), wpill = $('[data-wpill]', sec), job = $('[data-job]', sec), jv = $('[data-job-v]', job), strip = $('[data-strip]', sec);
    var W = Z.world || [], live = false, openId = null, opened = false;
    var COS = [['google', 2.96], ['openai', 3.61], ['spotify', 3.24], ['airbnb', 3.12], ['netflix', 3.6], ['stripe', 2.35], ['shopify', 3.41], ['microsoft', 4.54], ['figma', 2.05], ['amazon', 3.23], ['slack', 3.84], ['hubspot', 3.35]];
    var cos = $('[data-cos]', sec);
    if (cos) cos.innerHTML = COS.map(function (m) { var h = Math.max(16, Math.min(28, Math.sqrt(1500 / m[1]))), w = Math.min(96, h * m[1]); return '<img src="assets/logos/' + m[0] + '.svg" alt="' + m[0] + '" style="width:' + w.toFixed(1) + 'px;height:' + (w / m[1]).toFixed(1) + 'px">'; }).join('');
    pinsEl.innerHTML = W.map(function (w) {
      return '<button class="pin" type="button" data-pin="' + w.id + '" data-cursor="Open" style="left:' + (w.u * 100) + '%;top:' + (w.v * 100) + '%" aria-label="' + esc(w.name + ', ' + w.role) + '"><span class="pin__dot" aria-hidden="true"></span><span class="pin__tag"><img src="assets/zw/' + w.logo + '.webp" alt="" width="300" height="100"></span></button>';
    }).join('');
    strip.innerHTML = W.map(function (w) { return '<button type="button" data-to="' + w.id + '" aria-label="' + esc(w.name) + '"><img src="assets/zw/' + w.logo + '.webp" alt="" width="300" height="100"></button>'; }).join('');
    var pins = $$('.pin', pinsEl), sbtn = $$('button', strip);
    function setK() { pinsEl.style.setProperty('--k', (1 / (gsap.getProperty(cam, 'scale') || 1)).toFixed(3)); }
    function fly(w) {
      var S = small() ? 1.9 : 1.6, sw = scr.offsetWidth, sh = scr.offsetHeight, mw = map.offsetWidth, mh = map.offsetHeight;
      var tx = small() ? sw * 0.5 : sw * 0.31, ty = small() ? sh * 0.3 : sh * 0.55;
      var l = (mw - sw) / 2, t = (mh - sh) / 2, cx = mw / 2, cy = mh / 2;
      var x = (l + tx) - cx - S * (w.u * mw - cx), y = (t + ty) - cy - S * (w.v * mh - cy);
      x = Z.clamp(x, l + sw - cx - S * cx, l - cx + S * cx); y = Z.clamp(y, t + sh - cy - S * cy, t - cy + S * cy);
      gsap.to(cam, { scale: S, x: x, y: y, duration: 1.1, ease: 'power3.inOut', overwrite: 'auto', onUpdate: setK });
    }
    function home() { gsap.to(cam, { scale: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.inOut', overwrite: 'auto', onUpdate: setK }); }
    function fill(w) {
      $('[data-job-logo]', job).src = 'assets/zw/' + w.logo + '.webp';
      $('[data-job-role]', job).textContent = w.role;
      $('[data-job-t]', job).textContent = w.scenario;
      $('[data-job-tools]', job).innerHTML = w.tools.map(function (t) { var tt = (Z.tools || {})[t]; return '<span class="zchip"><img src="assets/zw/tools/' + t + '.svg" alt="" width="16" height="16">' + ((Z.toolNames || {})[t] || (tt ? tt[1] : t)) + '</span>'; }).join('');
      jv.innerHTML = '<source src="assets/zw/' + w.video + '.mp4" type="video/mp4">'; jv.setAttribute('poster', 'assets/zw/' + w.video + '.webp'); jv.load(); play(jv);
    }
    function show(id, quiet) {
      var w = W.filter(function (x) { return x.id === id; })[0]; if (!w) return;
      openId = id; fill(w);
      pins.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-pin') === id); });
      sbtn.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-to') === id); });
      sec.classList.add('is-job'); job.setAttribute('aria-hidden', 'false');
      fly(w); if (!quiet) award('world-' + id, $('[data-pin="' + id + '"]', pinsEl), w.name.replace(/ \(.*\)/, ''));
    }
    function hide() {
      if (!openId) return; openId = null;
      pins.forEach(function (p) { p.classList.remove('is-on'); }); sbtn.forEach(function (b) { b.classList.remove('is-on'); });
      sec.classList.remove('is-job'); job.setAttribute('aria-hidden', 'true'); jv.pause(); home();
    }
    function toggle(id) { if (!live) return; if (id === openId) hide(); else show(id); }
    pins.forEach(function (p) { p.addEventListener('click', function (e) { e.stopPropagation(); toggle(p.getAttribute('data-pin')); }); });
    sbtn.forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); toggle(b.getAttribute('data-to')); }); });
    $('[data-job-x]', job).addEventListener('click', function (e) { e.stopPropagation(); hide(); });
    function step(d) { if (!live) return; var k = 0; W.forEach(function (w, j) { if (w.id === openId) k = j; }); show(W[(k + d + W.length) % W.length].id); }
    $('[data-job-next]', job).addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    addEventListener('keydown', function (e) { if (!live || e.target.closest('input, textarea')) return; if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
    map.addEventListener('click', function () { if (openId) hide(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });

    /* the laptop at rest, and the scale at which its screen IS the whole view, which is where we start */
    var G = {};
    function measure() {
      gsap.set(dev, { clearProps: 'transform' }); gsap.set(dev, { xPercent: -50, yPercent: -50 });
      var dr = dev.getBoundingClientRect(), sr = scr.getBoundingClientRect();
      dev.style.transformOrigin = (sr.left - dr.left + sr.width / 2).toFixed(1) + 'px ' + (sr.top - dr.top + sr.height / 2).toFixed(1) + 'px';
      G.s = Math.max(innerWidth / sr.width, innerHeight / sr.height) * 1.02;
      G.dy = innerHeight / 2 - (sr.top + sr.height / 2);
      G.ms0 = (small() ? 124 : 160) / G.s;
      G.big = Math.max(sr.width, sr.height) * 3.8;
      var w = dev.offsetWidth, h = dev.offsetHeight;
      G.fit = small() ? Math.min((innerWidth - 16) / w, (innerHeight - 120) / h) : Math.min((innerWidth - 96) / w, (innerHeight - 150) / h);
    }
    gsap.set(copy, { xPercent: -50, yPercent: -50 });
    measure();
    gsap.set(portal, { '--ms': G.ms0 + 'px', '--my': '72%' });
    if (Z.still) { gsap.set(dev, { scale: G.fit }); gsap.set(copy, { opacity: 0 }); portal.classList.add('is-open'); gsap.set(ring, { opacity: 1 }); gsap.set(wpill, { opacity: 1 }); live = true; sec.classList.add('is-live'); return; }
    gsap.set(dev, { scale: G.s, y: G.dy });
    gsap.set(copy.children, { opacity: 0, y: 18 }); gsap.set(portal, { opacity: 0 });
    Z.on('ready', function () {
      Z.safe(gsap.timeline().to(copy.children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'zeroOut' }, 0.05)
        .to(portal, { opacity: 1, duration: 1.1, ease: 'zeroOut' }, 0.35), 2800);
    });
    gsap.to(cam, { xPercent: 1.2, yPercent: -0.8, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true,
      onRefresh: function (s) { measure(); if (s.progress <= 0.34) gsap.set(dev, { scale: G.s, y: G.dy }); if (s.progress < 0.02) gsap.set(portal, { '--ms': G.ms0 + 'px' }); },
      onUpdate: function (s) {
        portal.classList.toggle('is-open', s.progress > 0.27);
        copy.style.visibility = s.progress > 0.12 ? 'hidden' : '';
        var on = s.progress > 0.63; if (on !== live) { live = on; sec.classList.toggle('is-live', on); if (!on) { hide(); opened = false; } else if (!opened && !openId) { opened = true; setTimeout(function () { if (live && !openId) show(W[0].id, true); }, 700); } }
        if (s.progress > 0.97 && openId) hide();
        setK();
      } } })
      .to(copy, { y: -60, opacity: 0, duration: 0.13, ease: 'power1.in' }, 0.01)
      .fromTo(portal, { '--ms': function () { return G.ms0 + 'px'; } }, { '--ms': function () { return G.big + 'px'; }, duration: 0.25, ease: 'power2.in' }, 0.02)
      .fromTo(portal, { '--my': '72%' }, { '--my': '50%', duration: 0.18, ease: 'power1.inOut' }, 0.02)
      .fromTo(map, { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'power1.inOut' }, 0.12)
      .fromTo(dev, { scale: function () { return G.s; }, y: function () { return G.dy; } }, { scale: function () { return G.fit; }, y: 0, duration: 0.28, ease: 'power2.inOut', immediateRender: true }, 0.34)
      .fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.42)
      .fromTo(wpill, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.05 }, 0.6)
      .to({}, { duration: 0.34 }, 0.65);
    addEventListener('resize', function () { ScrollTrigger.refresh(); });
  }

  /* ================= 2. the best roles: the dream, shown like the prize ================= */
  var ICON = {
    hot: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.6 3.2-1 5-2.6 6.8C7.8 11 6.5 12.6 6.5 15a5.5 5.5 0 0 0 11 0c0-2.2-1-3.9-2.3-5.3-.2 1.4-.9 2.5-2 3 .6-3.6-.2-7.3-1.2-10.2Z" fill="currentColor"/></svg>',
    trending: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 16.5 9.5 10.5l4 4 7-7M14.5 7.5h6v6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  function badge(r) { if (!r.tag) return ''; var k = r.tag.toLowerCase(); return '<span class="badge badge--' + k + '">' + (ICON[k] || '') + r.tag + '</span>'; }
  function roleSrc(r) { return r.v.indexOf('film/') === 0 ? '<source src="assets/' + r.v + '.webm" type="video/webm"><source src="assets/' + r.v + '.mp4" type="video/mp4">' : '<source src="assets/' + r.v + '.mp4" type="video/mp4">'; }
  var TOP = ['ai-engineer', 'gtm-engineer', 'product-engineer'];
  function best() {
    var sec = $('[data-best]'); if (!sec || !Z.roles) return;
    var byId = {}; Z.roles.forEach(function (r) { byId[r.id] = r; });
    var top = TOP.map(function (id) { return byId[id]; }), more = Z.roles.filter(function (r) { return TOP.indexOf(r.id) < 0; });
    function toolIcons(r) { return r.tools.map(function (k) { var t = (Z.tools || {})[k]; return t ? '<img src="assets/' + t[0] + '" alt="' + t[1] + '" title="' + t[1] + '" width="18" height="18">' : ''; }).join(''); }
    function card(r, big) {
      return '<a class="rc' + (big ? ' rc--big' : '') + '" href="#" data-role="' + r.id + '"><img class="rc__p" src="assets/' + r.v + '.webp" alt="" loading="lazy" decoding="async"><video muted playsinline loop preload="none"></video><span class="rc__shade" aria-hidden="true"></span>' +
        badge(r) + '<div class="rc__b"><h3 class="rc__t">' + esc(r.t) + '</h3><p class="rc__s">' + esc(r.ship) + '</p><div class="rc__tools">' + toolIcons(r) + '</div></div>' +
        '<span class="rc__go">Start as ' + esc(r.t) + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>';
    }
    $('[data-top]', sec).innerHTML = top.map(function (r, i) { return card(r, i === 0); }).join('');
    $('[data-more]', sec).innerHTML = more.map(function (r) {
      return '<a class="rm" href="#" data-role="' + r.id + '"><img src="assets/' + r.v + '.webp" alt="" loading="lazy" decoding="async"><span class="rm__t">' + esc(r.t) + '</span>' + badge(r) + '</a>';
    }).join('');
    $$('[data-role]', sec).forEach(function (a) {
      var r = byId[a.getAttribute('data-role')], v = $('video', a);
      a.addEventListener('click', function (e) { e.preventDefault(); award('role-' + r.id, a, r.t); Z.startWith(r.id, e); });
      if (v) {
        a.addEventListener('pointerenter', function () { if (!v._r) { v._r = 1; v.innerHTML = roleSrc(r); v.load(); } play(v); a.classList.add('is-play'); });
        a.addEventListener('pointerleave', function () { if (!a.classList.contains('rc--big')) { v.pause(); a.classList.remove('is-play'); } });
      }
    });
    /* the lead card plays by itself while you can see it */
    var lead = $('.rc--big', sec), lv = lead && $('video', lead);
    if (lv) inView(lead, function (y) { if (y) { if (!lv._r) { lv._r = 1; lv.innerHTML = roleSrc(top[0]); lv.load(); } play(lv); lead.classList.add('is-play'); } else lv.pause(); }, 0.3);
    if (!Z.still) {
      gsap.from($('.best__t', sec), { opacity: 0, y: 40, duration: 1, ease: 'zeroOut', scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
      gsap.from($$('.rc', sec), { opacity: 0, y: 60, scale: 0.97, duration: 1.1, stagger: 0.1, ease: 'zeroOut', scrollTrigger: { trigger: $('[data-top]', sec), start: 'top 80%', once: true } });
      gsap.from($$('.rm', sec), { opacity: 0, y: 30, duration: 0.8, stagger: 0.05, ease: 'zeroOut', scrollTrigger: { trigger: $('[data-more]', sec), start: 'top 90%', once: true } });
    }
  }

  /* ================= 4 → 6. the flow ================= */
  var STEPS = [
    { h: 'Get briefed.', p: 'Your kickoff meeting. Get the brief. Ask your questions.', when: 'Mon 09:00', app: 'Kickoff' },
    { h: 'Work with your team.', p: 'Your AI manager, here when you need a hand. Go on, say hi.', when: 'Mon 11:30', app: 'Workspace' },
    { h: 'Get coached throughout.', p: 'A little perspective. A clear next move. Talk to your coach.', when: 'Tue 15:10', app: 'Coach' },
    { h: 'Present to your team.', p: 'Make your case in the room. Then take the questions.', when: 'Thu 14:00', app: 'Presentation' },
    { h: 'Build your portfolio.', p: 'Nobody reads your resume. Recruiters want to see what you built.', when: 'Fri 17:30', app: 'Portfolio' }
  ];
  var BRIEF = [
    { q: 'What does good look like?', a: 'A clear recommendation, backed by the numbers. One page is plenty.' },
    { q: 'Who do I report to?', a: 'Me. I\'m Marcus, your manager. Ping me any time this week.' },
    { q: 'When do I present?', a: 'Thursday at two, to the team. Rough is fine by Tuesday.' }
  ];
  var ROOM = [
    { q: 'The lowest return channel, then retest.', a: 'Strong. You made the call and backed it with data.' },
    { q: 'I would ask for more time.', a: 'Fair, but the room wants a call. What would you cut?' }
  ];
  var COACH = {
    replies: ['Good. Say the decision first, then the reason, then the next step.', 'You\'re closer than you think. What would you cut to make it one page?', 'Try it out loud once. If it\'s hard to say, it\'s hard to read.'],
    keys: [{ k: ['stuck', 'help', 'lost', 'confused'], a: 'Tell me the last thing that worked. We\'ll build from there.' }, { k: ['hi', 'hello', 'hey'], a: 'Hey. What are you working on today?' }, { k: ['present', 'presentation', 'slides', 'nervous'], a: 'Lead with the answer. Three slides, one ask. You\'ve got this.' }]
  };
  var BUBBLES = ['notion', 'spotify', 'airbnb', 'google', 'shopify', 'duolingo', 'canva', 'stripe', 'hubspot', 'figma', 'slack', 'uber', 'netflix', 'openai', 'linear', 'amazon', 'nike', 'anthropic'];
  var TAGGED = { spotify: 'Data Analyst', stripe: 'Product Engineer', notion: 'Growth Analyst', openai: 'AI Engineer' };

  function flow() {
    var sec = $('[data-flow]'); if (!sec) return;
    var stick = $('.flow__stick', sec), how = $('[data-how]', sec), list = $('[data-steps]', sec), app = $('[data-app]', sec), view = $('[data-app-view]', sec), stepP = $('[data-step-p]', sec);
    var panes = $$('.pane', sec), pf = $('[data-pf]', sec), img = $('.pf__img', pf), tor = $('[data-torus]', pf), match = $('[data-match]', sec), head = $('.match__head', match), bubs = $('[data-bubbles]', match);
    var wl = $('[data-wl]', sec), wr = $('[data-wr]', sec), gate = $('[data-gate]', sec), gbg = $('[data-gate-bg]', sec), gui = $('[data-gate-ui]', sec);
    var title = $('[data-app-title]', sec), clock = $('[data-app-clock]', sec), cur = -1, on = false;

    var TABS = ['Get briefed', 'Work with your team', 'Get coached', 'Present', 'Build your portfolio'];
    list.innerHTML = STEPS.map(function (s, i) { return '<button class="tab" type="button" role="tab" aria-selected="false"><span>' + TABS[i] + '</span><i aria-hidden="true"><b></b></i></button>'; }).join('');
    var items = $$('.tab', list), fills = $$('i b', list);

    /* the week, for real: ask the brief, message Marcus, talk to Jenna, take a question in the room */
    var brief = chatbox($('[data-ask]', sec), 'brief', { face: 'assets/cast/jay-sq.webp', label: 'Asked about the brief', replies: [''] });
    $('[data-ask-chips]', $('[data-ask]', sec)).innerHTML = BRIEF.map(function (b, i) { return '<button class="qchip" type="button" data-i="' + i + '">' + esc(b.q) + '</button>'; }).join('');
    $$('.qchip', $('[data-ask]', sec)).forEach(function (b) { b.addEventListener('click', function () { var x = BRIEF[+b.getAttribute('data-i')]; brief.ask(x.q, x.a); b.remove(); }); });
    var room = chatbox($('[data-room]', sec), 'room', { face: 'assets/cast/esther-sq.webp', label: 'Took a question', replies: [''] });
    $('[data-ask-chips]', $('[data-room]', sec)).innerHTML = ROOM.map(function (b, i) { return '<button class="qchip" type="button" data-i="' + i + '">' + esc(b.q) + '</button>'; }).join('');
    $$('.qchip', $('[data-room]', sec)).forEach(function (b) { b.addEventListener('click', function () { var x = ROOM[+b.getAttribute('data-i')]; room.ask(x.q, x.a); $$('.qchip', $('[data-room]', sec)).forEach(function (c) { c.remove(); }); }); });
    chatbox($('[data-chatbox="manager"]', sec), 'manager', { label: 'Talked to your manager', replies: Z.manager.replies, keys: Z.manager.keys });
    chatbox($('[data-chatbox="coach"]', sec), 'coach', { label: 'Talked to your coach', replies: COACH.replies, keys: COACH.keys });

    function vid(i) { return panes[i] ? $('video', panes[i]) : null; }
    function step(i) {
      if (i === cur) return; var first = cur < 0; cur = i;
      items.forEach(function (b, k) { b.setAttribute('aria-selected', String(k === i)); });
      if (!stepP) {} else if (first || Z.still) stepP.textContent = STEPS[i].p; else gsap.to(stepP, { opacity: 0, y: -6, duration: 0.16, onComplete: function () { stepP.textContent = STEPS[i].p; gsap.fromTo(stepP, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: 'zeroOut' }); } });
      panes.forEach(function (p, k) { p.classList.toggle('is-on', k === i); var v = vid(k); if (!v) return; if (k === i || k === i + 1) Z.film.load(v); if (k === i && on) { v.currentTime = 0; play(v); } else v.pause(); });
    }
    step(0);
    items.forEach(function (b, i) { b.addEventListener('click', function () { award('how-' + i, b, STEPS[i].h.replace(/\.$/, '')); Z.scrollTo(at(0.088 * i + 0.02), { duration: 1 }); }); });
    function at(p) { return sec.getBoundingClientRect().top + scrollY + (sec.offsetHeight - innerHeight) * p; }
    inView(sec, function (v) { on = v; var x = vid(cur); if (!x) return; if (v && cur < 4) play(x); else x.pause(); });

    /* the teams that rise around the portfolio */
    bubs.innerHTML = BUBBLES.map(function (k) { return '<span class="bub" data-co="' + k + '"><img src="assets/brands/' + k + '.svg" alt="' + k + '" width="24" height="24">' + (TAGGED[k] ? '<span class="bub__tag"><i aria-hidden="true"></i>' + TAGGED[k] + ' intro</span>' : '') + '</span>'; }).join('');
    var bb = $$('.bub', bubs);
    fetch('assets/brands/colors.json').then(function (r) { return r.json(); }).then(function (c) { bb.forEach(function (b) { var k = b.getAttribute('data-co'), ink = (Z.brandInk || {})[k]; b.style.setProperty('--c', ink || (c[k] ? '#' + c[k].hex : '#111')); }); }).catch(function () {});
    bb.forEach(function (b, i) { b.style.setProperty('--s', (small() ? 44 + (i % 3) * 8 : 64 + (i % 4) * 9) + 'px'); });

    /* geometry, measured on every refresh: the app's screen, the card in the middle, the circle */
    var G = {};
    function measure() {
      var sr = stick.getBoundingClientRect(), vr = view.getBoundingClientRect(), W = stick.offsetWidth, H = stick.offsetHeight;
      G.app = { left: vr.left - sr.left, top: vr.top - sr.top, width: vr.width, height: vr.height };
      var cw = small() ? W * 0.86 : Math.min(660, W * 0.48), ch = cw * (vr.height / vr.width), cy = H * (small() ? 0.55 : 0.55);
      G.card = { left: (W - cw) / 2, top: cy - ch / 2, width: cw, height: ch };
      var d = small() ? 170 : 220; G.circ = { left: W / 2 - d / 2, top: H / 2 - d / 2, width: d, height: d };
      G.cy = cy; G.W = W; G.H = H;
      /* far ring, then close ring round the card; nothing straight above (the heading) or below (the dock) */
      G.far = []; G.near = [];
      var n = bb.length, rxF = small() ? W * 0.44 : Math.min(W * 0.43, 600), ryF = small() ? H * 0.3 : H * 0.31, rxN = cw / 2 + (small() ? 30 : 70), ryN = ch / 2 + (small() ? 40 : 58);
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2 + 0.17, s = Math.sin(a);
        if (Math.abs(Math.cos(a)) < 0.22) a += s > 0 ? 0.42 : -0.42;
        var j = 0.86 + ((i * 37) % 10) / 70;
        G.far.push({ x: Math.cos(a) * rxF * j, y: Math.sin(a) * ryF * j + (cy - H * 0.56) });
        G.near.push({ x: Math.cos(a) * rxN, y: Math.sin(a) * ryN + (cy - H * 0.56) });
      }
    }
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);
    function lay() { gsap.set(pf, { left: G.card.left, top: G.card.top, width: G.card.width, height: G.card.height, transformOrigin: '0 0' }); }
    lay(); ScrollTrigger.addEventListener('refreshInit', function () { measure(); lay(); });

    var TL = gsap.timeline({ defaults: { ease: 'none' }, paused: Z.still });
    /* the portfolio keeps one size (the card); it travels on transform only. the circle is a clip on that card */
    var appX = function () { return G.app.left - G.card.left; }, appY = function () { return G.app.top - G.card.top; }, appS = function () { return G.app.width / G.card.width; };
    var midY = function () { return G.H / 2 - (G.card.top + G.card.height / 2); };
    var ring = function (r) { var d = G.circ.width, t = (G.card.height - d) / 2, l = (G.card.width - d) / 2; return r ? 'inset(' + t + 'px ' + l + 'px ' + t + 'px ' + l + 'px round ' + (d / 2) + 'px)' : 'inset(0px 0px 0px 0px round 24px)'; };
    var TL = gsap.timeline({ defaults: { ease: 'none' }, paused: Z.still });
    TL.set(pf, { visibility: 'visible' }, 0.352)
      .fromTo(pf, { opacity: 0, x: appX, y: appY, scale: appS }, { opacity: 1, duration: 0.01 }, 0.352)
      .fromTo(pf, { '--wipe': '100%', '--seam': 0 }, { '--wipe': '0%', '--seam': 1, duration: 0.06, ease: 'power1.inOut' }, 0.37)
      .to(pf, { '--seam': 0, duration: 0.01 }, 0.43)
      .to(how, { opacity: 0, duration: 0.05 }, 0.445)
      .to(pf, { x: 0, y: 0, scale: 1, duration: 0.08, ease: 'power2.inOut' }, 0.445)
      .fromTo(head, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.04 }, 0.5);
    bb.forEach(function (b, i) {
      TL.fromTo(b, { x: function () { return G.far[i].x; }, y: function () { return G.far[i].y + 50; }, scale: 0, opacity: 0 }, { y: function () { return G.far[i].y; }, scale: 1, opacity: 1, duration: 0.035, ease: 'back.out(2.2)' }, 0.52 + (i % 9) * 0.009 + (i > 8 ? 0.004 : 0))
        .to(b, { x: function () { return G.near[i].x; }, y: function () { return G.near[i].y; }, duration: 0.08, ease: 'power2.inOut' }, 0.62 + (i % 5) * 0.004)
        .to(b, { x: 0, y: function () { return G.cy - G.H * 0.56; }, scale: 0.2, opacity: 0, duration: 0.04, ease: 'power2.in' }, 0.725 + (i % 6) * 0.003);
    });
    TL.to(head, { opacity: 0, y: -16, duration: 0.03 }, 0.73)
      .set(pf, { clipPath: function () { return ring(false); }, boxShadow: 'none' }, 0.744)
      .to(pf, { clipPath: function () { return ring(true); }, y: midY, backgroundColor: '#0b0b0c', duration: 0.06, ease: 'power2.inOut' }, 0.745)
      .to(img, { opacity: 0, duration: 0.03 }, 0.75)
      .to($('.pf__cv', pf), { opacity: 0, duration: 0.01 }, 0.75)
      .to(tor, { opacity: 1, duration: 0.03 }, 0.78)
      .fromTo(wl, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.03 }, 0.785)
      .fromTo(wr, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.03 }, 0.79)
      .to(wl, { opacity: 0, x: function () { return -innerWidth * 0.3; }, duration: 0.04, ease: 'power2.in' }, 0.83)
      .to(wr, { opacity: 0, x: function () { return innerWidth * 0.3; }, duration: 0.04, ease: 'power2.in' }, 0.83)
      .to(tor, { opacity: 0, duration: 0.015 }, 0.835)
      .fromTo(gbg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, 0.844)
      .fromTo(gbg, { scale: 1 }, { scale: function () { return (Math.hypot(G.W, G.H) / 2 + 8) / (G.circ.width / 2); }, duration: 0.06, ease: 'power2.in' }, 0.845)
      .set(pf, { visibility: 'hidden' }, 0.85)
      .fromTo(gui, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.9)
      .to({}, { duration: 0.06 }, 0.94);
    if (Z.still) TL.progress(0.3);

    ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', scrub: Z.still ? false : 0.6, animation: Z.still ? null : TL, invalidateOnRefresh: true,
      onUpdate: function (s) {
        var P = s.progress;
        if (P < 0.44) { var f = P / 0.088, i = Math.min(4, Math.floor(f)); step(i); fills.forEach(function (b, k) { b.style.transform = 'scaleX(' + (k < i ? 1 : k > i ? 0 : Math.min(1, f - i)).toFixed(3) + ')'; }); }
        if (P > 0.44 && cur > -1) { var v = vid(cur); if (v) v.pause(); }
        how.style.pointerEvents = P > 0.44 ? 'none' : '';
        bb.forEach(function (b) { b.classList.toggle('is-tag', P > 0.66 && P < 0.72); });
        var live = P > 0.9; gate.classList.toggle('is-live', live);
        if (P > 0.86) gate.setAttribute('data-dark', ''); else gate.removeAttribute('data-dark');
      } });

    Z.anchors = Z.anchors || {};
    Z.anchors.work = function () { return at(0.01); };
    Z.anchors.hired = function () { return at(0.64); };
    Z.anchors.gate = function () { return at(0.95); };
  }
})();
