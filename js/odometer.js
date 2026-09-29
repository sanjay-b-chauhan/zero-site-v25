/* Odometer (Osmo's Number Odometer, wired into Zero). Every digit is a roller strip of 0 to 9, twice over,
   so it always rolls forward. Scroll groups roll once when they arrive; Z.odomUpdate rolls any number to a new
   value from code, which is what the XP meter and the jobs counter use. Columns that are new grow in from
   zero width. After a roll the strips are removed and the plain digits are put back. */
(function () {
  'use strict';
  var Z = window.ZERO;
  var initFlag = 'data-odometer-initialized';
  var activeTweens = new WeakMap();
  var defaults = { duration: 1, ease: 'power3.out', elementStagger: 0.1, digitStagger: 0.04, revealDuration: 0.5, revealEase: 'power2.out', triggerStart: 'top 80%', staggerOrder: 'left', digitCycles: 2 };
  function reduced() { return Z.still || window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function getLineHeightRatio(el) { var cs = getComputedStyle(el), lh = cs.lineHeight; return lh === 'normal' ? 1.2 : parseFloat(lh) / parseFloat(cs.fontSize); }
  function parseSegments(text) { return Array.from(text).map(function (char) { return { type: /\d/.test(char) ? 'digit' : 'static', char: char }; }); }
  function mapStartDigits(segments, startValue) {
    var slots = segments.filter(function (s) { return s.type === 'digit'; });
    var padded = String(Math.floor(Math.abs(startValue))).padStart(slots.length, '0').slice(-slots.length), di = 0;
    return segments.map(function (s) { return s.type === 'digit' ? Object.assign({}, s, { startDigit: parseInt(padded[di++], 10) }) : s; });
  }
  function markHiddenSegments(segments, startValue) {
    var total = segments.filter(function (s) { return s.type === 'digit'; }).length;
    var abs = Math.floor(Math.abs(startValue)), startCount = abs === 0 ? 1 : String(abs).length;
    var lead = Math.max(0, total - startCount); if (lead === 0) return segments;
    var seen = 0, first = false, prevHidden = false;
    return segments.map(function (seg) {
      if (seg.type === 'digit') { first = true; var hidden = seen < lead; prevHidden = hidden; seen++; return Object.assign({}, seg, { hidden: hidden }); }
      return Object.assign({}, seg, { hidden: first && prevHidden });
    });
  }
  function shouldGrow(el, hasStart, startValue, segments) {
    if (el.hasAttribute('data-odometer-grow')) return el.getAttribute('data-odometer-grow') !== 'false';
    if (!hasStart) return false;
    var abs = Math.floor(Math.abs(startValue)), startCount = abs === 0 ? 1 : String(abs).length;
    return startCount < segments.filter(function (s) { return s.type === 'digit'; }).length;
  }
  function buildRollerDOM(el, segments, step, grow) {
    el.innerHTML = ''; el.style.height = '';
    var rollers = [], revealEls = [], cells = 10 * defaults.digitCycles;
    segments.forEach(function (seg) {
      if (seg.type === 'static') {
        var span = document.createElement('span');
        span.setAttribute('data-odometer-part', 'static'); span.style.height = step + 'em'; span.style.lineHeight = step; span.textContent = seg.char;
        el.appendChild(span);
        if (grow && seg.hidden) { gsap.set(span, { opacity: 0 }); revealEls.push(span); }
        return;
      }
      var mask = document.createElement('span'); mask.setAttribute('data-odometer-part', 'mask'); mask.style.height = step + 'em'; mask.style.lineHeight = step;
      var roller = document.createElement('span'); roller.setAttribute('data-odometer-part', 'roller'); roller.style.lineHeight = step;
      var digits = []; for (var d = 0; d < cells; d++) digits.push(d % 10);
      roller.textContent = digits.join('\n'); mask.appendChild(roller); el.appendChild(mask);
      var startDigit = seg.startDigit || 0, isReveal = grow && seg.hidden;
      gsap.set(roller, { y: isReveal ? step + 'em' : -startDigit * step + 'em' });
      var endDigit = parseInt(seg.char, 10);
      rollers.push({ roller: roller, targetPos: endDigit > startDigit ? endDigit : 10 + endDigit });
      if (isReveal) revealEls.push(mask);
    });
    return { rollers: rollers, revealEls: revealEls };
  }
  function cleanupElement(el, text) {
    el.style.overflow = ''; el.style.height = '';
    var digits = Array.from(text).filter(function (c) { return /\d/.test(c); }), di = 0;
    el.querySelectorAll('[data-odometer-part="mask"]').forEach(function (mask) {
      var r = mask.querySelector('[data-odometer-part="roller"]'); if (r) r.remove();
      mask.textContent = digits[di++] || ''; mask.style.opacity = ''; mask.style.overflow = '';
    });
    el.querySelectorAll('[data-odometer-part="static"]').forEach(function (s) { s.style.opacity = ''; });
  }

  /* programmatic: roll whatever is shown to newText. the last value is remembered, so a call that lands
     mid-roll starts from the right number instead of reading the roller strips */
  Z.odomUpdate = function (el, newText, options) {
    options = options || {};
    var currentText = el._odo !== undefined ? el._odo : el.textContent.trim();
    if (currentText === newText) return;
    el._odo = newText;
    if (reduced()) { el.textContent = newText; return; }
    var duration = options.duration || defaults.duration, ease = options.ease || defaults.ease, step = getLineHeightRatio(el);
    var existing = activeTweens.get(el);
    if (existing) { existing.kill(); gsap.set(el, { clearProps: 'width,overflow' }); }
    var fontSize = parseFloat(getComputedStyle(el).fontSize), oldW = el.getBoundingClientRect().width / fontSize;
    var startValue = parseInt(parseSegments(currentText).filter(function (s) { return s.type === 'digit'; }).map(function (s) { return s.char; }).join(''), 10) || 0;
    var segments = markHiddenSegments(mapStartDigits(parseSegments(newText), startValue), startValue);
    var built = buildRollerDOM(el, segments, step, true);
    var newW = el.getBoundingClientRect().width / fontSize, changed = Math.abs(oldW - newW) > 0.01;
    if (changed) gsap.set(el, { width: oldW + 'em', overflow: 'hidden' });
    var tl = gsap.timeline({ onComplete: function () { cleanupElement(el, newText); activeTweens.delete(el); } });
    activeTweens.set(el, tl);
    if (changed) tl.to(el, { width: newW + 'em', duration: defaults.revealDuration, ease: defaults.revealEase }, 0);
    built.revealEls.forEach(function (r) { if (r.getAttribute('data-odometer-part') === 'static') tl.to(r, { opacity: 1, duration: 0.2 }, 0); });
    built.rollers.forEach(function (o, i) { tl.to(o.roller, { y: -o.targetPos * step + 'em', duration: duration, ease: ease, force3D: true }, (built.rollers.length - 1 - i) * defaults.digitStagger); });
    Z.safe && Z.safe(tl, (duration + 1) * 1000);
  };

  /* scroll groups: roll once when the group comes into view */
  Z.mods.push({ name: 'odometer', init: function () {
    document.querySelectorAll('[data-odometer-group]').forEach(function (group) {
      if (group.hasAttribute(initFlag)) return; group.setAttribute(initFlag, '');
      var elements = Array.from(group.querySelectorAll('[data-odometer-element]'));
      if (!elements.length || reduced()) return;
      var order = group.getAttribute('data-odometer-stagger-order') || defaults.staggerOrder;
      var start = group.getAttribute('data-odometer-trigger-start') || defaults.triggerStart;
      var stagger = parseFloat(group.getAttribute('data-odometer-stagger')) || defaults.elementStagger;
      var data = elements.map(function (el) {
        var text = el.textContent.trim(), hasStart = el.hasAttribute('data-odometer-start');
        var startValue = parseFloat(el.getAttribute('data-odometer-start')) || 0;
        var duration = parseFloat(el.getAttribute('data-odometer-duration')) || defaults.duration, step = getLineHeightRatio(el);
        var segments = markHiddenSegments(mapStartDigits(parseSegments(text), startValue), startValue);
        var built = buildRollerDOM(el, segments, step, shouldGrow(el, hasStart, startValue, segments));
        var fs = parseFloat(getComputedStyle(el).fontSize);
        var reveal = built.revealEls.map(function (r) { var w = r.offsetWidth / fs; gsap.set(r, { width: 0, overflow: 'hidden' }); return { el: r, w: w }; });
        return { el: el, rollers: built.rollers, duration: duration, reveal: reveal, text: text };
      });
      var ordered = order === 'right' ? data.slice().reverse() : data;
      var tl = gsap.timeline({ paused: true, onComplete: function () { data.forEach(function (d) { cleanupElement(d.el, d.text); }); } });
      ordered.forEach(function (d, oi) {
        var off = oi * stagger;
        d.reveal.forEach(function (r) { tl.to(r.el, { width: r.w + 'em', opacity: 1, duration: defaults.revealDuration, ease: defaults.revealEase }, off); });
        d.rollers.forEach(function (o, i) { tl.to(o.roller, { y: -o.targetPos * getLineHeightRatio(d.el) + 'em', duration: d.duration, ease: defaults.ease, force3D: true }, off + (d.rollers.length - 1 - i) * defaults.digitStagger); });
      });
      ScrollTrigger.create({ trigger: group, start: start, once: true, onEnter: function () { tl.play(); Z.safe && Z.safe(tl, 4000); } });
    });
  } });
})();
