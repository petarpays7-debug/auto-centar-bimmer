/* =========================================================
   AUTO CENTAR BIMMER — premium-fx.js
   Subtle premium micro-interactions.
   No external deps. prefers-reduced-motion respected.
   ========================================================= */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch   = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ── 1. CARD TILT — 3D hover on vehicle cards ─────────── */
  function initTilt() {
    if (touch || reduced) return;

    document.querySelectorAll(".vcard").forEach(function (card) {
      // Remove transform from CSS transition so JS drives it without conflict
      card.style.transition =
        "border-color .5s cubic-bezier(.22,.61,.36,1)," +
        " box-shadow .5s cubic-bezier(.22,.61,.36,1)";

      var rx = 0, ry = 0, lift = 0;   // current (lerped)
      var tx = 0, ty = 0, liftT = 0; // targets
      var hovered = false;
      var frame   = null;

      function tick() {
        rx   += (tx    - rx)   * 0.10;
        ry   += (ty    - ry)   * 0.10;
        lift += (liftT - lift) * 0.10;

        card.style.transform =
          "perspective(900px)" +
          " rotateY(" + rx.toFixed(3) + "deg)" +
          " rotateX(" + ry.toFixed(3) + "deg)" +
          " translateY(-" + lift.toFixed(2) + "px)";

        var moving =
          Math.abs(rx - tx)    > 0.008 ||
          Math.abs(ry - ty)    > 0.008 ||
          Math.abs(lift - liftT) > 0.05;

        if (hovered || moving) {
          frame = requestAnimationFrame(tick);
        } else {
          card.style.transform = "";
          frame = null;
        }
      }

      card.addEventListener("mouseenter", function () {
        hovered = true;
        card.classList.add("is-tilting");
        if (!frame) frame = requestAnimationFrame(tick);
      });

      card.addEventListener("mousemove", function (e) {
        var r  = card.getBoundingClientRect();
        var mx = (e.clientX - r.left) / r.width  - 0.5; // -0.5 … +0.5
        var my = (e.clientY - r.top)  / r.height - 0.5;
        tx    = mx *  3.5;  // ±1.75 deg
        ty    = my * -3.5;
        liftT = 5;
        card.style.setProperty("--mx", ((mx + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((my + 0.5) * 100).toFixed(1) + "%");
      });

      card.addEventListener("mouseleave", function () {
        hovered = false;
        card.classList.remove("is-tilting");
        tx = 0; ty = 0; liftT = 0;
        if (!frame) frame = requestAnimationFrame(tick);
      });
    });
  }

  // Delay so inventory.js can inject cards first
  setTimeout(initTilt, 450);

  /* ── 2. IMAGE REVEAL — clip-path left → right ─────────── */
  var revealEls = document.querySelectorAll(".gallery figure, .split__media");
  if (revealEls.length) {
    revealEls.forEach(function (el) { el.classList.add("img-reveal"); });

    if ("IntersectionObserver" in window) {
      var imgIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("img-reveal-in");
            imgIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
      revealEls.forEach(function (el) { imgIO.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("img-reveal-in"); });
    }
  }

  /* ── 3. COUNT-UP ──────────────────────────────────────── */
  var countEls = document.querySelectorAll("[data-countup]");
  if (countEls.length) {
    function animCount(el) {
      var raw    = el.dataset.countup;
      var target = parseFloat(raw.replace(",", "."));
      var hasDec = raw.indexOf(",") !== -1 || raw.indexOf(".") !== -1;

      if (reduced) {
        el.textContent = hasDec
          ? target.toFixed(1).replace(".", ",")
          : String(Math.round(target));
        return;
      }

      var dur = 1100;
      var t0  = null;
      requestAnimationFrame(function step(ts) {
        if (!t0) t0 = ts;
        var p    = Math.min((ts - t0) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
        var val  = target * ease;
        el.textContent = hasDec
          ? val.toFixed(1).replace(".", ",")
          : String(Math.round(val));
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = hasDec
            ? target.toFixed(1).replace(".", ",")
            : String(Math.round(target));
        }
      });
    }

    if ("IntersectionObserver" in window) {
      var cntIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          animCount(e.target);
          cntIO.unobserve(e.target);
        });
      }, { threshold: 0.6 });
      countEls.forEach(function (el) { cntIO.observe(el); });
    } else {
      countEls.forEach(animCount);
    }
  }

  /* ── 4. MAGNETIC CTA — subtle pull on primary lg buttons ─ */
  if (!touch && !reduced) {
    document.querySelectorAll(".btn--primary.btn--lg").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r  = btn.getBoundingClientRect();
        var mx = ((e.clientX - (r.left + r.width  / 2)) * 0.14).toFixed(2);
        var my = ((e.clientY - (r.top  + r.height / 2)) * 0.14).toFixed(2);
        btn.style.setProperty("--mag-x", mx + "px");
        btn.style.setProperty("--mag-y", my + "px");
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.setProperty("--mag-x", "0px");
        btn.style.setProperty("--mag-y", "0px");
      });
    });
  }

})();
