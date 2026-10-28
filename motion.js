/* Upstream: Work page motion. Vanilla, no dependencies.
   1. Case stories: the parts fade up one after another as they enter view.
   2. Estimator drawing: four beats. 900 px and wider: beats follow scroll while the drawing is sticky.
      Narrower: the beats play once, in order, when the drawing comes into view.
   Does nothing under prefers-reduced-motion: every part shows and the drawing stays on its finished frame. */
(function () {
  var mq = window.matchMedia;
  if (!mq || mq('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  function stagger() {
    var items = [];
    each(document.querySelectorAll('section.case'), function (sec) {
      sec.classList.add('st-ready');
      each(sec.querySelectorAll('.case-meta, .case-grid h2, .case-for, .case-block, .case-shot, .est-visual'), function (el) {
        el.classList.add('st-item'); items.push(el);
      });
    });
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = (n++ * 75) + 'ms';
        e.target.classList.add('st-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  function estimator() {
    var fig = document.getElementById('est-drawing');
    if (!fig) return;
    var track = fig.parentNode, svg = fig.querySelector('svg'), steps = fig.querySelectorAll('.est-step');
    var typed = fig.querySelector('.est-typed'), caret = fig.querySelector('.est-caret'), count = fig.querySelector('.est-count');
    var ADDR = typed.textContent, END = +count.textContent, X = +typed.parentNode.getAttribute('x');
    var wide = mq('(min-width: 900px)'), beat = 0, target = 0, gap = 650, stepT = 0, typeT = 0, raf = 0, ticking = false;

    function caretAt() { caret.setAttribute('transform', 'translate(' + (X + typed.getComputedTextLength() + 2) + ' 0)'); }
    function type(on) {
      clearInterval(typeT);
      if (!on) { typed.textContent = ''; caretAt(); return; }
      var i = typed.textContent.length;
      typeT = setInterval(function () {
        typed.textContent = ADDR.slice(0, ++i); caretAt();
        if (i >= ADDR.length) clearInterval(typeT);
      }, 42);
    }
    function countUp(on) {
      cancelAnimationFrame(raf);
      count.textContent = '0';
      if (!on) return;
      var t0 = 0;
      raf = requestAnimationFrame(function tick(t) {
        t0 = t0 || t;
        var p = Math.min(1, Math.max(0, (t - t0 - 250) / 900));
        count.textContent = Math.round(END * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      });
    }
    function set(n) {
      var up = n > beat, i;
      beat = n;
      for (i = 1; i <= 4; i++) fig.classList.toggle('b' + i, n >= i);
      for (i = 0; i < steps.length; i++) steps[i].classList.toggle('is-on', n > i);
      if (n === (up ? 1 : 0)) type(up);
      if (n === (up ? 2 : 1)) countUp(up);
    }
    /* Move one beat at a time toward the target, so a fast scroll still plays the story in order */
    function go(t) {
      target = t;
      if (stepT) return;
      (function step() {
        stepT = 0;
        if (beat === target) return;
        set(beat + (target > beat ? 1 : -1));
        if (beat !== target) stepT = setTimeout(step, target > beat ? gap : 120);
      })();
    }
    function fromScroll() {
      /* p runs from 0 (drawing top at mid screen) to 1 (end of the sticky stretch) */
      var r = track.getBoundingClientRect(), start = innerHeight * .5;
      var top = parseFloat(getComputedStyle(fig).top) || 0;
      var p = (start - r.top) / Math.max(1, r.height - fig.offsetHeight + start - top);
      go(p < 0 ? 0 : p < .35 ? 1 : p < .6 ? 2 : p < .83 ? 3 : 4);
    }

    fig.classList.add('est-anim');
    typed.textContent = ''; count.textContent = '0'; caretAt();
    addEventListener('scroll', function () {
      if (ticking || !wide.matches) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; fromScroll(); });
    }, { passive: true });
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !wide.matches) { gap = 1250; go(4); io.disconnect(); }
    }, { threshold: .45 });
    io.observe(svg);
    if (wide.addEventListener) wide.addEventListener('change', function () { if (wide.matches) { gap = 650; fromScroll(); } else { gap = 1250; go(4); } });
    if (wide.matches) fromScroll();
    addEventListener('beforeprint', function () { clearTimeout(stepT); stepT = 0; target = 4; while (beat < 4) set(beat + 1); clearInterval(typeT); cancelAnimationFrame(raf); typed.textContent = ADDR; count.textContent = END; });
  }

  stagger();
  estimator();
})();
