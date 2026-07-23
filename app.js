/* ============================================================
   permbits — explained.  Scroll-driven narrative.
   No network, no libraries. Everything degrades to a static,
   legible page if JS is off or reduced-motion is set (the CSS
   renders every final state under prefers-reduced-motion, and
   all .reveal blocks are shown by the no-JS/no-IO fallback).
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Reveal-on-scroll -------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var lists = ["octRows", "umaskMath", "anatomyDemo", "fixGrid"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function showAll() {
    reveals.forEach(function (el) { el.classList.add("in"); });
    lists.forEach(function (el) { el.classList.add("in"); });
  }

  if (reduce || !("IntersectionObserver" in window)) {
    // reduced motion or old browser: reveal everything immediately
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    reveals.forEach(function (el) { io.observe(el); });

    // The animated lists/grids live inside reveals; trigger their own
    // stagger the moment they enter the viewport themselves.
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    lists.forEach(function (el) { io2.observe(el); });
  }

  /* ---- 2. Progress rail ---------------------------------------------- */
  var fill = document.getElementById("railFill");
  if (fill) {
    var ticking = false;
    var updateRail = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop || window.pageYOffset) / max * 100 : 0;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      fill.style.width = pct.toFixed(2) + "%";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(updateRail); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", updateRail, { passive: true });
    updateRail();
  }
})();
