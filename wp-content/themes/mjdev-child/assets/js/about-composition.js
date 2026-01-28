// ========================================
// ABOUT COMPOSITION v2.2 - TRIGGER ANTECIPADO
// Animação começa quando ainda estás no Splash
// ========================================

console.log('🎨 About Composition v2.2 - Carregando...');

(function() {
    'use strict';
    
    // Verificar se GSAP está disponível
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP não encontrado!');
        return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.error('❌ ScrollTrigger não encontrado!');
        return;
    }
    
    console.log('✅ GSAP e ScrollTrigger disponíveis');
    
    // ========================================
    // CONFIGURAÇÃO - ANTECIPADA
    // ========================================
    const ANIMATION_CONFIG = {
        scrub: 1,
        
        // CORRIGIDO: Começa ANTES da secção aparecer
        // Quando secção ainda está 50% abaixo da janela
        start: 'bottom 200%',  // Começa cedo (quando ainda no splash)
        
        // Termina quando sai
        end: 'top top',
        
        markers: false  // Muda para true para debug
    };
    
    console.log('⚙️ Trigger antecipado:', ANIMATION_CONFIG);
    
    // ========================================
    // FUNÇÃO PRINCIPAL
    // ========================================
    function initCompositionAnimation() {
        const section = document.querySelector('.about-section');
        const wrapper = document.querySelector('.composition-wrapper');
        
        if (!section || !wrapper) {
            console.warn('⚠️ Secção About não encontrada');
            return;
        }
        
        console.log('✅ Secção encontrada');
        
        // Verificar imagens
        const images = {
            boarding: document.querySelector('.composition-boarding'),
            flor: document.querySelector('.composition-flor'),
            perfume: document.querySelector('.composition-perfume'),
            chave: document.querySelector('.composition-chave'),
            polaroid: document.querySelector('.composition-polaroid'),
            chavena: document.querySelector('.composition-chavena')
        };
        
        const foundImages = Object.values(images).filter(img => img !== null);
        console.log(`📸 Imagens: ${foundImages.length}/6`);
        
        if (foundImages.length === 0) {
            console.error('❌ Nenhuma imagem encontrada!');
            return;
        }
        
        // Remover classe 'initial'
        Object.values(images).forEach(img => {
            if (img) img.classList.remove('initial');
        });
        
        wrapper.classList.add('loaded');
        
        console.log('🎬 Criando animações antecipadas...');
        
        // ========================================
        // ANIMAÇÕES COM TRIGGER ANTECIPADO
        // ========================================
        
        // 1. BOARDING
        if (images.boarding) {
            gsap.fromTo(images.boarding,
                { top: '-100%', opacity: 0 },
                {
                    top: '50%',
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: ANIMATION_CONFIG.start,
                        end: ANIMATION_CONFIG.end,
                        scrub: ANIMATION_CONFIG.scrub,
                        markers: ANIMATION_CONFIG.markers,
                        id: 'boarding',
                        onEnter: () => console.log('🎫 Boarding visível!')
                    }
                }
            );
        }
        
        // 2. FLOR
        if (images.flor) {
            gsap.fromTo(images.flor,
                { left: '-100%', opacity: 0 },
                {
                    left: '25%',
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: ANIMATION_CONFIG.start,
                        end: ANIMATION_CONFIG.end,
                        scrub: ANIMATION_CONFIG.scrub,
                        markers: ANIMATION_CONFIG.markers,
                        id: 'flor'
                    }
                }
            );
        }
        
        // 3. PERFUME
        if (images.perfume) {
            gsap.fromTo(images.perfume,
                { top: '150%', opacity: 0 },
                {
                    top: '8%',
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: ANIMATION_CONFIG.start,
                        end: ANIMATION_CONFIG.end,
                        scrub: ANIMATION_CONFIG.scrub,
                        markers: ANIMATION_CONFIG.markers,
                        id: 'perfume'
                    }
                }
            );
        }
        
        // 4. CHAVE
        if (images.chave) {
            gsap.fromTo(images.chave,
                { bottom: '-100%', opacity: 0 },
                {
                    bottom: '12%',
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: ANIMATION_CONFIG.start,
                        end: ANIMATION_CONFIG.end,
                        scrub: ANIMATION_CONFIG.scrub,
                        markers: ANIMATION_CONFIG.markers,
                        id: 'chave'
                    }
                }
            );
        }
        
        // 5. POLAROID
        if (images.polaroid) {
            gsap.fromTo(images.polaroid,
                { left: '-100%', opacity: 0 },
                {
                    left: '8%',
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: ANIMATION_CONFIG.start,
                        end: ANIMATION_CONFIG.end,
                        scrub: ANIMATION_CONFIG.scrub,
                        markers: ANIMATION_CONFIG.markers,
                        id: 'polaroid'
                    }
                }
            );
        }
        
        // 6. CHÁVENA
        if (images.chavena) {
            gsap.fromTo(images.chavena,
                { right: '-100%', opacity: 0 },
                {
                    right: '12%',
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: ANIMATION_CONFIG.start,
                        end: ANIMATION_CONFIG.end,
                        scrub: ANIMATION_CONFIG.scrub,
                        markers: ANIMATION_CONFIG.markers,
                        id: 'chavena'
                    }
                }
            );
        }
        
        console.log('✅ Configurado! Trigger: top 150%');
        console.log('📜 Animação começa ANTES da secção aparecer');
    }
    
    // ========================================
    // INICIALIZAR
    // ========================================
    function init() {
        console.log('🚀 Init v2.2...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCompositionAnimation);
        } else {
            initCompositionAnimation();
        }
    }
    
    init();
    
})();

console.log('✅ About Composition v2.2 carregado!');