/* =========================================================
   AUTO CENTAR BIMMER — cursor-car.js (v4 · PNG top-down)
   Koristi dostavljenu PNG sliku BMW-a gledanog odozgo.
   ========================================================= */
(function () {
  "use strict";

  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 880) return;

  var el = document.createElement("div");
  el.className = "cursor-car";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<img src="assets/img/cursor-car.png" alt="" width="29" height="72" draggable="false">';

  document.body.appendChild(el);
  document.body.classList.add("has-cursor-car");

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var cx = mx, cy = my, pcx = cx, pcy = cy;
  var heading = -Math.PI / 2, target = heading;
  var OX = 14.5, OY = 36; // centar slike
  var FOLLOW = 0.15;
  var trailPool = [];
  var TRAIL_MAX = 10;

  window.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  window.addEventListener("mouseleave", function () { el.style.opacity = "0"; });
  window.addEventListener("mouseenter", function () { el.style.opacity = "1"; });

  document.addEventListener("mouseover", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    el.classList.toggle("is-hot",
      !!t.closest("a, button, .vcard, .feature, .step, [role='button']"));
  });

  function tick() {
    cx += (mx - cx) * FOLLOW;
    cy += (my - cy) * FOLLOW;

    var vx = cx - pcx, vy = cy - pcy;
    var speed = Math.hypot(vx, vy);

    if (speed > 0.4) target = Math.atan2(vy, vx) + Math.PI / 2;

    var diff = target - heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    heading += diff * 0.15;

    var drift = 0;
    if (speed > 12) drift = Math.max(-0.25, Math.min(0.25, diff * 0.5));

    el.style.transform =
      "translate3d(" + (cx - OX) + "px," + (cy - OY) + "px,0) rotate(" +
      ((heading + drift) * 180 / Math.PI) + "deg)";

    if (speed > 8) emitSkid(cx, cy);

    pcx = cx; pcy = cy;
    requestAnimationFrame(tick);
  }

  function emitSkid(x, y) {
    if (trailPool.length >= TRAIL_MAX) trailPool.shift().remove();
    var d = document.createElement("span");
    d.className = "skid";
    var bx = x - Math.cos(heading - Math.PI / 2) * 28;
    var by = y - Math.sin(heading - Math.PI / 2) * 28;
    d.style.left = bx + "px";
    d.style.top = by + "px";
    document.body.appendChild(d);
    trailPool.push(d);
    setTimeout(function () {
      if (d.parentNode) d.remove();
      var i = trailPool.indexOf(d);
      if (i !== -1) trailPool.splice(i, 1);
    }, 450);
  }

  el.style.transform =
    "translate3d(" + (cx - OX) + "px," + (cy - OY) + "px,0) rotate(0deg)";
  requestAnimationFrame(tick);
})();
