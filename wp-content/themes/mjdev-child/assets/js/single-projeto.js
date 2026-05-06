(function () {
    'use strict';

    const overlay = document.getElementById('page-transition');
    const isMobile = window.matchMedia('(max-width: 768px)').matches ||
                     window.matchMedia('(pointer: coarse)').matches;

    gsap.registerPlugin(ScrollTrigger);

    // ── 1. Revelar página (cortina sobe) ──────────────────────────────
    gsap.to(overlay, {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.1,
    });

    // ── 2. Categoria ──────────────────────────────────────────────────
    gsap.from('.sp-category', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.6,
    });

    // ── 3. Título (SplitType por linhas) ──────────────────────────────
    const titleEl = document.querySelector('.sp-title');
    if (titleEl) {
        if (window.SplitType) {
            const split = new SplitType(titleEl, { types: 'lines' });
            // Wrap each line para clip funcionar
            split.lines.forEach(line => {
                const wrapper = document.createElement('div');
                wrapper.style.overflow = 'hidden';
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });
            gsap.from(split.lines, {
                y: '110%',
                duration: 0.9,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.7,
            });
        } else {
            gsap.from(titleEl, {
                y: 60,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                delay: 0.7,
            });
        }
    }

    // ── 4. Meta items ─────────────────────────────────────────────────
    gsap.from('.sp-meta-item', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.9,
    });

    // ── 5. Imagem hero (clip-path reveal) ─────────────────────────────
    const heroImgWrap = document.querySelector('.sp-hero-img-wrap');
    if (heroImgWrap) {
        gsap.to(heroImgWrap, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.4,
            ease: 'power4.inOut',
            delay: 0.5,
        });

        gsap.to('.sp-hero-img-wrap img', {
            scale: 1,
            duration: 1.4,
            ease: 'power4.inOut',
            delay: 0.5,
        });
    }

    // ── 6. Parallax na imagem ao scroll ───────────────────────────────
    if (!isMobile && heroImgWrap) {
        gsap.to('.sp-hero-img-wrap img', {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.sp-hero-right',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }

    // ── 7. Conteúdo (scroll reveal) ───────────────────────────────────
    gsap.from('.sp-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.sp-content',
            start: 'top 75%',
        },
    });

    // ── 8. Nav prev/next ──────────────────────────────────────────────
    gsap.from('.sp-nav-link, .sp-nav-center', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.sp-nav',
            start: 'top 88%',
        },
    });

    // ── 9. Cursor ─────────────────────────────────────────────────────
    if (!isMobile) {
        const cursor = document.getElementById('cursor');
        document.addEventListener('mousemove', function (e) {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out',
            });
        });

        document.querySelectorAll('a, button').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                gsap.to(cursor, { scale: 2, duration: 0.3 });
            });
            el.addEventListener('mouseleave', function () {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });
    }

    // ── 10. Transição ao clicar em links ──────────────────────────────
    function transitionTo(href) {
        gsap.set(overlay, { transformOrigin: 'bottom center', scaleY: 0 });
        gsap.to(overlay, {
            scaleY: 1,
            duration: 0.75,
            ease: 'power4.inOut',
            onComplete: function () {
                window.location.href = href;
            },
        });
    }

    document.querySelectorAll('a[href]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || link.getAttribute('target') === '_blank') return;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            transitionTo(link.href);
        });
    });
})();
