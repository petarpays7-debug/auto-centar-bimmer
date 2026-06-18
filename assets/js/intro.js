/* =========================================================
   AUTO CENTAR BIMMER — intro.js
   Uklanja intro overlay nakon završetka CSS animacije i
   otključava scroll. Pokreće se samo ako je inline head
   skripta postavila .intro-active na <html>.
   Bez vanjskih biblioteka.
   ========================================================= */
(function () {
  "use strict";

  var d = document.documentElement;
  var intro = document.getElementById("intro");
  if (!intro || !d.classList.contains("intro-active")) return;

  var finished = false;
  function done() {
    if (finished) return;
    finished = true;
    d.classList.remove("intro-active");
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
  }

  /* Ukloni čim fade-out animacija završi… */
  intro.addEventListener("animationend", function (e) {
    if (e.animationName === "introOut") done();
  });

  /* …uz sigurnosni fallback ako animationend izostane. */
  setTimeout(done, 2300);
})();
