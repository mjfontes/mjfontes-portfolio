/**
 * MJDev - Text Animations
 * Animações de texto com SplitType e GSAP
 * 
 * @version 1.1.0
 * @requires GSAP 3.12+
 * @requires ScrollTrigger
 * @requires SplitType
 */

(function() {
    'use strict';

    /**
     * Configurações das animações
     * Podes ajustar estes valores conforme necessário
     */
    const CONFIG = {
        // Seletor dos elementos a animar
        selector: '.animate-text',
        
        // Duração da animação (segundos)
        duration: 0.8,
        
        // Delay entre cada linha (segundos)
        stagger: 0.1,
        
        // Easing da animação
        ease: 'power3.out',
        
        // Ponto de início do ScrollTrigger (quando o elemento entra no viewport)
        triggerStart: 'top 85%',
        
        // Ponto de fim do ScrollTrigger (quando o elemento sai do viewport)
        triggerEnd: 'top 20%',
        
        // Deslocamento inicial Y (percentagem)
        yPercent: 100,
        
        // Opacidade inicial (0 a 1) - definir como 1 para efeito clip puro
        startOpacity: 1
    };

    /**
     * Inicializa as animações quando o DOM estiver pronto
     */
    function init() {
        // Verificar se as dependências estão carregadas
        if (typeof gsap === 'undefined') {
            console.warn('MJDev Animations: GSAP não está carregado.');
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            console.warn('MJDev Animations: ScrollTrigger não está carregado.');
            return;
        }

        if (typeof SplitType === 'undefined') {
            console.warn('MJDev Animations: SplitType não está carregado.');
            return;
        }

        // Registar o plugin ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Inicializar animações
        initTextAnimations();
    }

    /**
     * Inicializa as animações de texto com efeito reveal
     */
    function initTextAnimations() {
        const elements = document.querySelectorAll(CONFIG.selector);

        if (elements.length === 0) {
            return;
        }

        elements.forEach(function(element) {
            // Dividir o texto em linhas
            const split = new SplitType(element, { 
                types: 'lines',
                lineClass: 'mjdev-line'
            });

            // Verificar se o split foi bem sucedido
            if (!split.lines || split.lines.length === 0) {
                return;
            }

            // Criar wrapper com overflow hidden para cada linha
            split.lines.forEach(function(line) {
                const wrapper = document.createElement('div');
                wrapper.className = 'mjdev-line-wrapper';
                wrapper.style.overflow = 'hidden';
                wrapper.style.position = 'relative';
                
                // Inserir o wrapper antes da linha e mover a linha para dentro
                if (line.parentNode) {
                    line.parentNode.insertBefore(wrapper, line);
                    wrapper.appendChild(line);
                }
            });

            // Definir estado inicial (escondido)
            gsap.set(split.lines, {
                yPercent: CONFIG.yPercent,
                opacity: CONFIG.startOpacity
            });

            // Criar a animação com ScrollTrigger
            ScrollTrigger.create({
                trigger: element,
                start: CONFIG.triggerStart,
                end: CONFIG.triggerEnd,
                // toggleActions: onEnter, onLeave, onEnterBack, onLeaveBack
                // "play" = anima para o estado final
                // "none" = não faz nada
                // "reverse" = anima de volta ao estado inicial
                // "reset" = volta instantaneamente ao estado inicial
                toggleActions: 'play none none reset',
                onEnter: function() {
                    gsap.to(split.lines, {
                        yPercent: 0,
                        opacity: 1,
                        duration: CONFIG.duration,
                        stagger: CONFIG.stagger,
                        ease: CONFIG.ease
                    });
                },
                onLeaveBack: function() {
                    gsap.set(split.lines, {
                        yPercent: CONFIG.yPercent,
                        opacity: CONFIG.startOpacity
                    });
                }
            });
        });
    }

    /**
     * Reinicializar animações (útil para conteúdo carregado dinamicamente)
     * Uso: window.MJDevAnimations.refresh()
     */
    function refresh() {
        ScrollTrigger.refresh();
    }

    /**
     * Destruir e recriar todas as animações
     * Uso: window.MJDevAnimations.rebuild()
     */
    function rebuild() {
        // Matar todos os ScrollTriggers existentes
        ScrollTrigger.getAll().forEach(function(trigger) {
            trigger.kill();
        });
        
        // Reinicializar
        initTextAnimations();
    }

    // Expor API pública
    window.MJDevAnimations = {
        init: init,
        refresh: refresh,
        rebuild: rebuild,
        config: CONFIG
    };

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM já está pronto
        init();
    }

    // Reinicializar após resize (com debounce)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            ScrollTrigger.refresh();
        }, 250);
    });

})();