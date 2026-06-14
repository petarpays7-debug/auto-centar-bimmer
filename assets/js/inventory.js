/* =========================================================
   AUTO CENTAR BIMMER — inventory.js
   19 prodajnih vozila s Njuškalo profila.
   Vozila za dijelove (forParts: true) automatski se
   filtriraju i ne prikazuju u UI-u.
   ========================================================= */
(function () {
  "use strict";

  var IMG = "autocentar-bimmer-assets/";
  var NJUSKALO = "https://www.njuskalo.hr/trgovina/autocentarbimmer";

  /* ---------------------------------------------------------
     VEHICLES array — sva prodajna vozila s Njuškala
     Polja:
       name    – naziv vozila
       sub     – podnaslov / napomene
       motor   – motor (prikazuje se kao mono chip)
       year    – godište
       km      – kilometraža
       price   – cijena u EUR
       featured– prikazuje se na homepageu
       img     – lokalna putanja slike (null = prikazuje se shimmer placeholder)
       alt     – alt tekst za sliku
       forParts– ako true, vozilo se NE prikazuje (rezervirano za buduće unose)
  --------------------------------------------------------- */
  var VEHICLES = [
    {
      name: "BMW 318d automatik",
      sub: "G20 · mogućnost leasinga · vozilo u PDV-u",
      motor: "2.0d · 150 KS · Automatik",
      year: 2021, km: 152000, price: 24999,
      featured: true,
      img: IMG + "bmw-318d-g20-2021.jpg",
      alt: "BMW 318d automatik G20 (2021)",
      forParts: false
    },
    {
      name: "BMW 318d automatik",
      sub: "G20 · mogućnost leasinga",
      motor: "2.0d · 150 KS · Automatik",
      year: 2020, km: 149000, price: 23399,
      featured: true,
      img: null,
      alt: "BMW 318d automatik G20 (2020)",
      forParts: false
    },
    {
      name: "BMW 330d automatik M paket",
      sub: "Original M paket",
      motor: "3.0d · 258 KS · Automatik",
      year: 2013, km: 264000, price: 20499,
      featured: true,
      img: IMG + "bmw-330d-m-paket-2013.jpg",
      alt: "BMW 330d automatik M paket (2013)",
      forParts: false
    },
    {
      name: "BMW 335d M Sport automatik",
      sub: "",
      motor: "3.0d · 313 KS · Automatik",
      year: 2015, km: 223000, price: 19999,
      featured: true,
      img: IMG + "bmw-335d-m-sport-2015.jpg",
      alt: "BMW 335d M Sport automatik (2015)",
      forParts: false
    },
    {
      name: "BMW X1 sDrive18d automatik",
      sub: "",
      motor: "2.0d · 150 KS · Automatik",
      year: 2018, km: 153000, price: 18699,
      featured: true,
      img: IMG + "bmw-x1-sdrive18d-2018.jpg",
      alt: "BMW X1 sDrive18d automatik (2018)",
      forParts: false
    },
    {
      name: "BMW 320d M paket",
      sub: "Original · Performance kočnice",
      motor: "2.0d · 184 KS · Ručni",
      year: 2013, km: 262000, price: 11999,
      featured: false,
      img: null,
      alt: "BMW 320d M paket (2013)",
      forParts: false
    },
    {
      name: "BMW 318d Touring",
      sub: "Mogućnost leasinga",
      motor: "2.0d · 143 KS · Ručni",
      year: 2018, km: 249000, price: 11999,
      featured: true,
      img: IMG + "bmw-318d-touring-2018.jpg",
      alt: "BMW 318d Touring (2018)",
      forParts: false
    },
    {
      name: "BMW 320d Cabrio M paket LCI",
      sub: "",
      motor: "2.0d · 184 KS · Automatik",
      year: 2013, km: 263000, price: 11999,
      featured: true,
      img: IMG + "bmw-320d-cabrio-2013.jpg",
      alt: "BMW 320d Cabrio M paket LCI (2013)",
      forParts: false
    },
    {
      name: "BMW 118d automatik M paket",
      sub: "Original · akcija · moguć leasing",
      motor: "2.0d · 143 KS · Automatik",
      year: 2015, km: 242000, price: 11599,
      featured: true,
      img: null,
      alt: "BMW 118d automatik M paket (2015)",
      forParts: false
    },
    {
      name: "BMW 525d automatik",
      sub: "6 cilindara",
      motor: "3.0d · 197 KS · Automatik",
      year: 2011, km: 274000, price: 10999,
      featured: false,
      img: null,
      alt: "BMW 525d automatik (2011)",
      forParts: false
    },
    {
      name: "BMW 320d M paket",
      sub: "Original",
      motor: "2.0d · 184 KS · Ručni",
      year: 2011, km: 226000, price: 10999,
      featured: false,
      img: null,
      alt: "BMW 320d M paket (2011)",
      forParts: false
    },
    {
      name: "BMW 120d",
      sub: "",
      motor: "2.0d · 177 KS · Ručni",
      year: 2013, km: 182000, price: 9999,
      featured: false,
      img: IMG + "bmw-120d-2013.jpg",
      alt: "BMW 120d (2013)",
      forParts: false
    },
    {
      name: "BMW 118d",
      sub: "",
      motor: "2.0d · 143 KS · Ručni",
      year: 2017, km: 197000, price: 9999,
      featured: false,
      img: null,
      alt: "BMW 118d (2017)",
      forParts: false
    },
    {
      name: "BMW 318d",
      sub: "",
      motor: "2.0d · 143 KS · Ručni",
      year: 2015, km: 312000, price: 9999,
      featured: false,
      img: null,
      alt: "BMW 318d (2015)",
      forParts: false
    },
    {
      name: "BMW 118d",
      sub: "",
      motor: "2.0d · 116 KS · Ručni",
      year: 2016, km: 227000, price: 9599,
      featured: false,
      img: null,
      alt: "BMW 118d (2016)",
      forParts: false
    },
    {
      name: "BMW 318d Touring",
      sub: "",
      motor: "2.0d · 143 KS · Ručni",
      year: 2015, km: 252000, price: 9499,
      featured: false,
      img: null,
      alt: "BMW 318d Touring (2015)",
      forParts: false
    },
    {
      name: "BMW 120d",
      sub: "",
      motor: "2.0d · 177 KS · Ručni",
      year: 2013, km: 276000, price: 6999,
      featured: false,
      img: null,
      alt: "BMW 120d (2013)",
      forParts: false
    },
    {
      name: "BMW 318d Edition",
      sub: "",
      motor: "2.0d · 143 KS · Ručni",
      year: 2012, km: 264000, price: 5999,
      featured: false,
      img: null,
      alt: "BMW 318d Edition (2012)",
      forParts: false
    },
    {
      name: "BMW 118d",
      sub: "Izuzetno očuvan",
      motor: "2.0d · 122 KS · Ručni",
      year: 2007, km: 227000, price: 3999,
      featured: false,
      img: null,
      alt: "BMW 118d (2007)",
      forParts: false
    }
  ];

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

  function cardHTML(v, lazy) {
    var ld = lazy ? ' loading="lazy"' : "";
    var media;
    if (v.img) {
      media = '<img src="' + v.img + '" alt="' + v.alt + '"' + ld + ' width="919" height="517">';
    } else {
      media =
        '<div class="vcard__placeholder">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 3h15l4 4 3 3v6h-2a3 3 0 0 1-6 0H7a3 3 0 0 1-6 0H1V3z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' +
          '<span>Foto na Njuškalo oglasu</span>' +
          '<a class="ph-link" href="' + NJUSKALO + '" target="_blank" rel="noopener">Pogledaj oglas</a>' +
        '</div>';
    }
    var sub = v.sub ? '<span class="vcard__sub">' + v.sub + '</span>' : '';
    var motor = v.motor ? '<span class="vcard__motor">' + v.motor + '</span>' : '';
    return (
      '<article class="vcard reveal">' +
        '<div class="vcard__media' + (v.img ? '' : ' vcard__media--ph') + '">' +
          media +
          '<span class="vcard__year">' + v.year + '</span>' +
        '</div>' +
        '<div class="vcard__body">' +
          '<h3>' + v.name + '</h3>' +
          sub +
          motor +
          '<div class="vcard__meta">' +
            '<span class="vcard__price">' + fmt(v.price) + ' €</span>' +
            '<span class="vcard__km">' + fmt(v.km) + ' km</span>' +
          '</div>' +
          '<div class="vcard__foot">' +
            '<a class="vcard__link" href="' + NJUSKALO + '" target="_blank" rel="noopener">Pogledaj na Njuškalu ' + ARROW + '</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function render(sel, onlyFeatured) {
    var t = document.querySelector(sel);
    if (!t || t.querySelector(".vcard")) return;
    var list = VEHICLES.filter(function(v) { return !v.forParts; });
    if (onlyFeatured) list = list.filter(function(v) { return v.featured; });
    t.innerHTML = list.map(function(v, i) { return cardHTML(v, i >= 3); }).join("");
  }

  render("[data-inventory-featured]", true);
  render("[data-inventory]", false);

  // Scroll reveal for injected cards
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    document.querySelectorAll(".vcard.reveal").forEach(function(el) { io.observe(el); });
  } else {
    document.querySelectorAll(".vcard.reveal").forEach(function(el) { el.classList.add("is-visible"); });
  }
})();
