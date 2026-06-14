/* =========================================================
   AUTO CENTAR BIMMER — main.js
   Header behaviour, mobile menu, scroll reveal, back-to-top.
   Vanilla JS only, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Sticky header: dark background on scroll ---------- */
  var header = document.querySelector(".header");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile menu toggle ---------- */
  var burger = document.querySelector(".burger");
  var body = document.body;
  function closeMenu() {
    body.classList.remove("menu-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  // Close menu when a link inside it is tapped
  document.querySelectorAll(".mobile-menu a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
  // Close if resized up to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeMenu();
  });

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Back to top button ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    function onScrollTop() {
      if (window.scrollY > 600) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    }
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
