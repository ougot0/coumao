/* ============================================================
   COUMAO — Défilement doux (Lenis) + entrée animée du héro (GSAP)
   Les deux bibliothèques sont dans assets/js/vendor/.
   Si elles manquent, le site reste complet, sans animation.
   ============================================================ */
(function () {
  "use strict";

  // Défilement doux, sauf dans le panier, la vue photo et les fenêtres
  if (typeof Lenis !== "undefined") {
    var lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      prevent: function (node) {
        return !!(node.closest && node.closest(".cart-drawer, .lightbox, .cz-overlay, .resa-modal"));
      },
    });
    requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    });
  }

  // Entrée du héro : la photo, puis les lettres COUMAO une à une, puis le reste
  if (typeof gsap !== "undefined") {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", function () {
      var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-hero-canvas]", { scale: 0.965, opacity: 0, duration: 1.1 })
        .from("[data-hero-letter]", { yPercent: 60, opacity: 0, filter: "blur(10px)", stagger: 0.06, duration: 1.2 }, "-=0.55")
        .from("[data-hero-tag]", { y: 24, opacity: 0, stagger: 0.12, duration: 0.9 }, "-=0.9")
        .from("[data-hero-cta]", { y: 24, opacity: 0, duration: 0.9 }, "-=0.7");
    });
  }
})();
