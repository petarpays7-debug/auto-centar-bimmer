/* =========================================================
   AUTO CENTAR BIMMER — cursor-car.js (v5 · dual tyre tracks)
   Top-down PNG cursor, ~12% smaller than v4.
   Dva odvojena traga stražnjih guma umjesto jednog središnjeg.
   ========================================================= */
(function () {
  "use strict";

  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 880) return;

  /* --- Cursor element --- */
  var el = document.createElement("div");
  el.className = "cursor-car";
  el.setAttribute("aria-hidden", "true");
  /* 12% smaller: 29→25, 72→63 */
  el.innerHTML = '<img src="assets/img/cursor-car.png" alt="" width="25" height="63" draggable="false">';

  document.body.appendChild(el);
  document.body.classList.add("has-cursor-car");

  /* --- State --- */
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var cx = mx, cy = my, pcx = cx, pcy = cy;
  var heading = -Math.PI / 2, target = heading;

  /* Pivot = visual centre of 25×63 image */
  var OX = 12.5, OY = 31.5;

  var FOLLOW     = 0.15;   /* lag factor — laggy premium feel  */
  var TRAIL_MAX  = 22;     /* pool size (2 dots/frame × ~11 frames visible) */

  /*
   * Geometry: car is 25px wide, 63px tall.
   * Rear axle ≈ 24px behind car centre.
   * Each wheel ≈ 8px left/right of centre.
   */
  var REAR_OFFSET  = 24;
  var WHEEL_OFFSET = 8;

  var trailPool = [];

  /* --- Event listeners --- */
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

  /* --- Render loop --- */
  function tick() {
    cx += (mx - cx) * FOLLOW;
    cy += (my - cy) * FOLLOW;

    var vx = cx - pcx, vy = cy - pcy;
    var speed = Math.hypot(vx, vy);

    if (speed > 0.4) target = Math.atan2(vy, vx) + Math.PI / 2;

    /* Smooth heading interpolation */
    var diff = target - heading;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    heading += diff * 0.15;

    /* Very slight drift at high speed */
    var drift = 0;
    if (speed > 12) drift = Math.max(-0.22, Math.min(0.22, diff * 0.45));

    el.style.transform =
      "translate3d(" + (cx - OX) + "px," + (cy - OY) + "px,0) rotate(" +
      ((heading + drift) * 180 / Math.PI) + "deg)";

    /* Emit tyre marks only when moving fast enough */
    if (speed > 9) emitTyreTracks(cx, cy);

    pcx = cx; pcy = cy;
    requestAnimationFrame(tick);
  }

  /*
   * Dual tyre track emitter.
   *
   * Car heading h, pointing UP when h=0.
   * Forward direction  = (sin h,  -cos h)
   * Backward direction = (-sin h,  cos h)  ← where rear is
   * Right direction    = (cos h,   sin h)
   *
   * Rear axle centre:
   *   rx = cx - sin(h) * REAR_OFFSET
   *   ry = cy + cos(h) * REAR_OFFSET
   *
   * Left/right wheel:
   *   left  = rear ± (-cos h, -sin h) * WHEEL_OFFSET
   *   right = rear ± ( cos h,  sin h) * WHEEL_OFFSET
   */
  function emitTyreTracks(x, y) {
    var sinH = Math.sin(heading);
    var cosH = Math.cos(heading);

    var rearX = x - sinH * REAR_OFFSET;
    var rearY = y + cosH * REAR_OFFSET;

    spawnDot(rearX - cosH * WHEEL_OFFSET, rearY - sinH * WHEEL_OFFSET);
    spawnDot(rearX + cosH * WHEEL_OFFSET, rearY + sinH * WHEEL_OFFSET);
  }

  function spawnDot(tx, ty) {
    /* Evict oldest if pool is full */
    if (trailPool.length >= TRAIL_MAX) {
      var old = trailPool.shift();
      if (old.parentNode) old.remove();
    }

    var d = document.createElement("span");
    d.className = "tyre-track";
    d.style.left = tx + "px";
    d.style.top  = ty + "px";
    document.body.appendChild(d);
    trailPool.push(d);

    setTimeout(function () {
      if (d.parentNode) d.remove();
      var i = trailPool.indexOf(d);
      if (i !== -1) trailPool.splice(i, 1);
    }, 520);
  }

  /* Initial transform */
  el.style.transform =
    "translate3d(" + (cx - OX) + "px," + (cy - OY) + "px,0) rotate(0deg)";
  requestAnimationFrame(tick);
})();
