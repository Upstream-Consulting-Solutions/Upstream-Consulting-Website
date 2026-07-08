/* Upstream — progressive scroll-reveal.
   Vanilla, no dependencies. Honours prefers-reduced-motion (does nothing if set).
   Fails safe: if IntersectionObserver is unavailable, content stays fully visible. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  document.addEventListener('DOMContentLoaded', function () {
    // Reveal each top-level <section> (skip the first — it's above the fold on load).
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section, body > section'));
    var targets = sections.slice(1);
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
  });
})();
