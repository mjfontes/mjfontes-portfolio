document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Ajustar altura dos elementos para 100vh dinamicamente
  document.querySelectorAll(".hero--slide-up").forEach((el) => {
    el.style.minHeight = window.innerHeight + "px";
    el.style.display = "flex";
    el.style.alignItems = "center"; // opcional: para centralizar conteúdo verticalmente
  });

  // Animação GSAP ScrollTrigger
  gsap.utils.toArray(".hero--slide-up").forEach((element) => {
    gsap.to(element, {
      y: () => -window.innerHeight,
      ease: "power1.out",
      scrollTrigger: {
        trigger: element,
        start: "center center",
        end: "top top",
        pinSpacing: false,
        pin:true,
        scrub: 3,
        markers: true
      }
    });
  });
});

// split elements with the class "split" into words and characters
let split = SplitText.create(".split", { type: "words, chars" });

// now animate the characters in a staggered fashion
gsap.from(split.chars, {
  duration: 1, 
  y: 100,       // animate from 100px below
  autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
  stagger: 0.05 // 0.05 seconds between each
});


/*exp panel*/

gsap.utils.toArray(".panel").forEach((panel, i) => {
    ScrollTrigger.create({
        trigger:panel-wrapper,
        start: "top, top",
        pin:true,
        pinSpacing:false
        
    });
});