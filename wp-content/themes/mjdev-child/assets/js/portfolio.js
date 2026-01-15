/**
 * MJDev Portfolio - JavaScript v3.4 CORRIGIDO
 * Animações About Section GARANTIDAS
 */

jQuery(document).ready(function($) {
    
    'use strict';
    
    console.log('🚀 Portfolio v3.4 iniciado - ABOUT FIXED');
    
    // ====== CONFIGURAÇÕES ======
    const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                     window.matchMedia("(pointer: coarse)").matches;
    
    // Registar GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    console.log('✅ GSAP:', gsap.version);
    console.log('📱 Mobile:', isMobile);
    
    // ====== THROTTLE ======
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func.apply(this, args);
        };
    }
    
    // ====== CURSOR (APENAS DESKTOP) ======
    if (!isMobile) {
        const cursor = $('#cursor');
        $(document).on('mousemove', throttle(function(e) {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out'
            });
        }, 16));
        
        $('a, button, .project, .about-image').on('mouseenter', function() {
            gsap.to(cursor, { scale: 2, duration: 0.3 });
        }).on('mouseleave', function() {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    }
    
    // ====== ANIMAÇÃO INICIAL DO SPLASH ======
    gsap.from('.splash-letters', {
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'power3.out'
    });
    
    gsap.from('.splash-text', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
    });
    
    gsap.from('.splash-btns', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.7,
        ease: 'power3.out'
    });
    
    // ====== ANIMAÇÃO DO LOGO COM SCROLL ======
    const splashLetters = $('.splash-letters');
    const headerLogo = $('.logo');
    
    if (splashLetters.length) {
        
        const initialFontSize = parseInt(window.getComputedStyle(splashLetters[0]).fontSize);
        
        gsap.set(splashLetters, {
            opacity: 1,
            visibility: 'visible',
            display: 'block'
        });
        
        ScrollTrigger.create({
            trigger: '#splash',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            
            onUpdate: (self) => {
                const progress = self.progress;
                const targetSize = 14;
                const currentSize = initialFontSize - ((initialFontSize - targetSize) * progress);
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const targetX = -(viewportWidth / 2) + 200;
                const targetY = -(viewportHeight / 2) + 40;
                const currentX = targetX * progress;
                const currentY = targetY * progress;
                
                gsap.set(splashLetters, {
                    fontSize: currentSize + 'px',
                    x: currentX,
                    y: currentY,
                    opacity: 1,
                    visibility: 'visible'
                });
                
                if (progress > 0.85) {
                    gsap.to(headerLogo, { opacity: 1, duration: 0.3 });
                } else {
                    gsap.to(headerLogo, { opacity: 0, duration: 0.3 });
                }
            }
        });
    }
    
    // ====== MENU HAMBURGUER ======
    const menuBtn = $('.menu-btn');
    const menu = $('#menu');
    
    menuBtn.on('click', function() {
        $(this).toggleClass('active');
        menu.toggleClass('active');
        $('body').css('overflow', $(this).hasClass('active') ? 'hidden' : 'auto');
    });
    
    $('#menu a').on('click', function() {
        menuBtn.removeClass('active');
        menu.removeClass('active');
        $('body').css('overflow', 'auto');
    });
    
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && menu.hasClass('active')) {
            menuBtn.removeClass('active');
            menu.removeClass('active');
            $('body').css('overflow', 'auto');
        }
    });
    
    // ====== FILTROS ======
    $('.filter').on('click', function() {
        const filter = $(this).data('filter');
        $('.filter').removeClass('active');
        $(this).addClass('active');
        
        $('.project').each(function(index) {
            const cat = $(this).data('cat');
            const project = $(this);
            
            if (filter === 'all' || cat === filter) {
                gsap.to(project, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'back.out(1.2)',
                    onStart: function() {
                        project.show().removeClass('hidden');
                    }
                });
            } else {
                gsap.to(project, {
                    opacity: 0,
                    scale: 0.8,
                    y: 30,
                    duration: 0.3,
                    onComplete: function() {
                        project.hide().addClass('hidden');
                    }
                });
            }
        });
    });
    
    // ====== ANIMAÇÕES DE SCROLL ======
    
    // Parallax hero
    gsap.to('.hero h1', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        scale: 1.1,
        opacity: 0.3,
        ease: 'none'
    });
    
    gsap.to('.hero p, .hero a', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        opacity: 0,
        ease: 'none'
    });
    
    // Header show/hide
    let lastScroll = 0;
    const header = $('#header');
    const splashHeight = $('#splash').outerHeight();
    
    $(window).on('scroll', throttle(function() {
        const currentScroll = $(this).scrollTop();
        if (currentScroll > splashHeight + 100) {
            gsap.to(header, { 
                y: (currentScroll > lastScroll) ? -100 : 0, 
                duration: 0.3 
            });
        }
        lastScroll = currentScroll;
    }, 100));
    
    // Hero entrance
    gsap.from('.hero h1', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top 80%'
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });
    
    gsap.from('.hero p', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero a', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    // ====== ANIMAÇÕES SECÇÃO QUEM SOU - CORRIGIDO ======
    
    console.log('🎨 Iniciando animações About Section...');
    console.log('📍 About section encontrada:', $('.about-section').length);
    console.log('🖼️ Imagens encontradas:', $('.about-image').length);
    
    // Título
    gsap.from('.about-title', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            markers: false // Muda para true para debug
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        onStart: () => console.log('✅ Título About animado')
    });
    
    // Imagens - CORRIGIDO: Forçar estado inicial
    $('.about-image').each(function(index) {
        const image = $(this);
        const direction = image.attr('data-direction');
        
        console.log(`🖼️ Configurando imagem ${index + 1} (direção: ${direction})`);
        
        // CRITICAL: Definir estado inicial
        const startX = direction === 'left' ? -200 : 200;
        gsap.set(image, {
            x: startX,
            opacity: 0
        });
        
        // Criar animação
        gsap.to(image, {
            scrollTrigger: {
                trigger: image,
                start: 'top 85%',
                end: 'top 60%',
                toggleActions: 'play none none reverse',
                markers: false, // Muda para true para debug
                onEnter: () => console.log(`✅ Imagem ${index + 1} entrou no viewport`),
                onLeave: () => console.log(`⬆️ Imagem ${index + 1} saiu do viewport (topo)`),
                onEnterBack: () => console.log(`⬇️ Imagem ${index + 1} voltou ao viewport`),
                onLeaveBack: () => console.log(`⬇️ Imagem ${index + 1} saiu do viewport (baixo)`)
            },
            x: 0,
            opacity: 1,
            duration: 1.2,
            delay: index * 0.3,
            ease: 'power3.out'
        });
        
        // Parallax (apenas desktop)
        if (!isMobile) {
            gsap.to(image.find('img'), {
                scrollTrigger: {
                    trigger: image,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                ease: 'none'
            });
        }
    });
    
    console.log('✅ Animações About configuradas');
    
    // Filtros
    gsap.from('.filter', {
        scrollTrigger: {
            trigger: '.filters',
            start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    // Projetos
    $('.project').each(function(i) {
        const project = $(this);
        
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 80,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            delay: (i % 3) * 0.15,
            ease: 'power3.out'
        });
        
        if (!isMobile) {
            gsap.to(project.find('.img'), {
                scrollTrigger: {
                    trigger: project,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -30,
                ease: 'none'
            });
        }
    });
    
    // Footer
    gsap.from('footer h2', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('footer a', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('footer p', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 80%'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
    });
    
    // ====== HOVER 3D ======
    if (!isMobile) {
        $('.project').each(function() {
            const project = $(this);
            const img = project.find('.img');
            const imgElement = img.find('img');
            
            project.on('mousemove', throttle(function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                gsap.to(img, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: true
                });
                
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                img.css('background', `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.1) 0%, transparent 50%)`);
            }, 16));
            
            project.on('mouseleave', function() {
                gsap.to(img, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
                img.css('background', 'none');
            });
            
            project.on('mouseenter', function() {
                gsap.to(imgElement, {
                    scale: 1.08,
                    duration: 0.6,
                    ease: 'power2.out',
                    overwrite: true
                });
                gsap.to(project.find('h3'), {
                    x: 10,
                    duration: 0.3
                });
            });
            
            project.on('mouseleave', function() {
                gsap.to(imgElement, {
                    scale: 1,
                    duration: 0.6
                });
                gsap.to(project.find('h3'), {
                    x: 0,
                    duration: 0.3
                });
            });
        });
    }
    
    // ====== SMOOTH SCROLL ======
    $('a[href^="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = $(href);
        
        if (target.length) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power3.inOut'
            });
        }
    });
    
    $('.scroll-indicator').on('click', function() {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: '#main',
                offsetY: 0
            },
            ease: 'power3.inOut'
        });
    });
    
    // ====== LOADING PROGRESS ======
    const loadingProgress = $('<div class="loading-progress"></div>');
    $('body').append(loadingProgress);
    
    const images = $('.project img, .about-image img');
    let imagesLoaded = 0;
    const totalImages = images.length;
    
    if (totalImages > 0) {
        images.each(function() {
            const img = new Image();
            img.onload = img.onerror = function() {
                imagesLoaded++;
                const progress = (imagesLoaded / totalImages) * 100;
                
                gsap.to('.loading-progress', {
                    width: progress + '%',
                    duration: 0.3
                });
                
                if (imagesLoaded === totalImages) {
                    gsap.to('.loading-progress', {
                        opacity: 0,
                        duration: 0.5,
                        delay: 0.5,
                        onComplete: function() {
                            $('.loading-progress').remove();
                            // CRITICAL: Refresh após carregamento
                            ScrollTrigger.refresh();
                            console.log('🔄 ScrollTrigger refreshed após loading');
                        }
                    });
                }
            };
            img.src = $(this).attr('src');
        });
    } else {
        loadingProgress.remove();
        ScrollTrigger.refresh();
    }
    
    // CRITICAL: Refresh após 1 segundo (garantia)
    setTimeout(() => {
        ScrollTrigger.refresh();
        console.log('🔄 ScrollTrigger refresh final');
    }, 1000);
    
    console.log('✅ Portfolio carregado!');
    console.log('🎯 ScrollTriggers:', ScrollTrigger.getAll().length);
    
});