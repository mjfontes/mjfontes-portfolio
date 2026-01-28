/**
 * MJDev Portfolio - JavaScript v3.8 FIXED
 * Menu button ADAPTATIVO por secção
 * CORREÇÃO: Offset ajustado para secção About
 */

jQuery(document).ready(function($) {
    
    'use strict';
    
    console.log('🚀 Portfolio v3.8 iniciado - OFFSET CORRIGIDO');
    
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
    
    // ====== DETECÇÃO DE SECÇÃO (MENU ADAPTATIVO) ======
    function updateHeaderColor() {
        const scrollY = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        // Definir limites das secções
        const splashBottom = $('#splash').offset().top + $('#splash').outerHeight();
        const aboutTop = $('#about').offset().top;
        const aboutBottom = aboutTop + $('#about').outerHeight();
        const projectsTop = $('#home').offset().top;
        const projectsBottom = projectsTop + $('#home').outerHeight() + $('.filters').outerHeight() + $('.grid').outerHeight();
        const footerTop = $('footer').offset().top;
        
        // Remover classes
        $('body').removeClass('on-light-section on-dark-section');
        
        // Detectar secção atual
        if (scrollY < splashBottom) {
            // SPLASH - fundo preto → botão branco
            $('body').addClass('on-dark-section');
            console.log('📍 Secção: Splash (DARK)');
        } 
        else if (scrollY >= aboutTop && scrollY < aboutBottom) {
            // ABOUT - fundo cinzento → botão preto
            $('body').addClass('on-light-section');
            console.log('📍 Secção: About (LIGHT)');
        }
        else if (scrollY >= projectsTop && scrollY < footerTop) {
            // PROJECTS - fundo branco → botão preto
            $('body').addClass('on-light-section');
            console.log('📍 Secção: Projects (LIGHT)');
        }
        else if (scrollY >= footerTop) {
            // FOOTER - fundo preto → botão branco
            $('body').addClass('on-dark-section');
            console.log('📍 Secção: Footer (DARK)');
        }
    }
    
    // Executar ao scroll
    $(window).on('scroll', throttle(updateHeaderColor, 100));
    
    // Executar ao carregar
    updateHeaderColor();
    
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
        
        $('a, button, .project').on('mouseenter', function() {
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
    
    menuBtn.on('click', function(e) {
        e.preventDefault();
        
        $(this).toggleClass('active');
        menu.toggleClass('active');
        $('body').toggleClass('menu-open');
        
        if ($(this).hasClass('active')) {
            $('body').css('overflow', 'hidden');
            console.log('📂 Menu aberto');
        } else {
            $('body').css('overflow', 'auto');
            console.log('📁 Menu fechado');
        }
    });
    
    // ====== SMOOTH SCROLL - CORRIGIDO ======
    // CORREÇÃO: Offset dinâmico baseado na secção de destino
    function getOffsetForSection(targetId) {
        // Secções que devem preencher todo o ecrã (offset 0)
        const fullScreenSections = ['#about', '#splash'];
        
        if (fullScreenSections.includes(targetId)) {
            return 0;
        }
        
        // Outras secções mantêm offset padrão
        return 80;
    }
    
    function smoothScrollTo(target, offset) {
        if (!target || !target.length) {
            console.warn('⚠️ Target não encontrado:', target);
            return;
        }
        
        // Se offset não foi definido, calcular automaticamente
        if (offset === undefined || offset === null) {
            const targetId = '#' + target.attr('id');
            offset = getOffsetForSection(targetId);
        }
        
        console.log('📍 Scroll para:', target.attr('id') || target, 'Offset:', offset);
        
        $('html, body').animate({
            scrollTop: target.offset().top - offset
        }, 1200, 'swing', function() {
            console.log('✅ Scroll completo!');
            updateHeaderColor(); // Atualizar cor após scroll
        });
    }
    
    // Links do menu - CORRIGIDO
    $('#menu a').on('click', function(e) {
        const href = $(this).attr('href');
        
        console.log('🔗 Link clicado:', href);
        
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href;
            const target = $(targetId);
            
            // Fechar menu
            menuBtn.removeClass('active');
            menu.removeClass('active');
            $('body').removeClass('menu-open').css('overflow', 'auto');
            
            console.log('🎯 Target encontrado:', target.length ? 'SIM' : 'NÃO');
            
            // CORREÇÃO: Usar offset específico para cada secção
            const offset = getOffsetForSection(targetId);
            
            // Aguardar menu fechar depois fazer scroll
            setTimeout(function() {
                smoothScrollTo(target, offset);
            }, 300);
        }
    });
    
    // Todos os links âncora - CORRIGIDO
    $('a[href^="#"]').not('#menu a').on('click', function(e) {
        const href = $(this).attr('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = $(href);
        
        if (target.length) {
            const offset = getOffsetForSection(href);
            smoothScrollTo(target, offset);
        }
    });
    
    // Botão splash - scroll para #about (primeira secção do main)
    $('.scroll-indicator').on('click', function(e) {
        e.preventDefault();
        console.log('👇 Scroll indicator clicado');
        
        // CORREÇÃO: Ir direto para #about com offset 0
        const aboutSection = $('#about');
        if (aboutSection.length) {
            smoothScrollTo(aboutSection, 0);
        } else {
            // Fallback para #main
            const mainSection = $('#main');
            if (mainSection.length) {
                smoothScrollTo(mainSection, 0);
            }
        }
    });
    
    // Fechar menu com ESC
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && menu.hasClass('active')) {
            menuBtn.removeClass('active');
            menu.removeClass('active');
            $('body').removeClass('menu-open').css('overflow', 'auto');
        }
    });
    
    // ====== FILTROS ======
    $('.filter').on('click', function() {
        const filter = $(this).data('filter');
        
        // Atualizar botão ativo
        $('.filter').removeClass('active');
        $(this).addClass('active');
        
        // Filtrar projetos
        if (filter === 'all') {
            $('.project').removeClass('hidden');
        } else {
            $('.project').each(function() {
                if ($(this).data('cat') === filter) {
                    $(this).removeClass('hidden');
                } else {
                    $(this).addClass('hidden');
                }
            });
        }
        
        // Atualizar layout
        setTimeout(() => ScrollTrigger.refresh(), 300);
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
    
    // ====== LOADING PROGRESS ======
    const loadingProgress = $('<div class="loading-progress"></div>');
    $('body').append(loadingProgress);
    
    const images = $('.project img');
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
                            ScrollTrigger.refresh();
                            updateHeaderColor();
                            console.log('🔄 ScrollTrigger refreshed');
                        }
                    });
                }
            };
            img.src = $(this).attr('src');
        });
    } else {
        loadingProgress.remove();
        ScrollTrigger.refresh();
        updateHeaderColor();
    }
    
    // Refresh final
    setTimeout(() => {
        ScrollTrigger.refresh();
        updateHeaderColor();
        console.log('🔄 ScrollTrigger refresh final');
    }, 1000);
    
    console.log('✅ Portfolio carregado!');
    console.log('🎯 ScrollTriggers:', ScrollTrigger.getAll().length);
    
});