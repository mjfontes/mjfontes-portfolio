/**
 * WebGL Water Effect - Three.js
 * Efeito de distorção líquida para imagens
 */

class WaterDistortion {
    constructor(imageElement) {
        this.imageElement = imageElement;
        this.container = imageElement.parentElement;
        
        // Configurações
        this.intensity = 0.1;
        this.mouseIntensity = 0.2;
        this.speed = 0.02;
        
        // Mouse
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        // Criar canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.objectFit = 'cover';
        
        // Esconder imagem original
        this.imageElement.style.display = 'none';
        this.container.appendChild(this.canvas);
        
        // Setup Three.js
        this.setupThree();
        this.loadTexture();
        this.setupEvents();
        this.animate();
    }
    
    setupThree() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Clock
        this.clock = new THREE.Clock();
    }
    
    loadTexture() {
        const loader = new THREE.TextureLoader();
        
        loader.load(
            this.imageElement.src,
            (texture) => {
                this.createMaterial(texture);
            },
            undefined,
            (error) => {
                console.error('Erro ao carregar textura:', error);
            }
        );
    }
    
    createMaterial(texture) {
        // Vertex Shader
        const vertexShader = `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        // Fragment Shader - Efeito de água
        const fragmentShader = `
            uniform sampler2D uTexture;
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uIntensity;
            uniform float uMouseIntensity;
            
            varying vec2 vUv;
            
            // Função de noise (Simplex)
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy));
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m;
                m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }
            
            void main() {
                vec2 uv = vUv;
                
                // Distorção base (movimento constante)
                float noise1 = snoise(uv * 3.0 + uTime * 0.2);
                float noise2 = snoise(uv * 2.0 - uTime * 0.15);
                
                vec2 distortion = vec2(noise1, noise2) * uIntensity;
                
                // Distorção do mouse
                vec2 toMouse = uv - uMouse;
                float mouseDist = length(toMouse);
                float mouseEffect = smoothstep(0.5, 0.0, mouseDist);
                
                vec2 mouseDistortion = normalize(toMouse) * mouseEffect * uMouseIntensity;
                mouseDistortion *= sin(uTime * 3.0) * 0.5 + 0.5;
                
                // Combinar distorções
                vec2 finalUv = uv + distortion + mouseDistortion;
                
                // Sample da textura com chromatic aberration
                float aberration = 0.002 * mouseEffect;
                vec4 colorR = texture2D(uTexture, finalUv + vec2(aberration, 0.0));
                vec4 colorG = texture2D(uTexture, finalUv);
                vec4 colorB = texture2D(uTexture, finalUv - vec2(aberration, 0.0));
                
                vec4 color = vec4(colorR.r, colorG.g, colorB.b, 1.0);
                
                // Adicionar brilho no mouse
                color.rgb += mouseEffect * 0.1;
                
                gl_FragColor = color;
            }
        `;
        
        // Material com shaders
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uIntensity: { value: this.intensity },
                uMouseIntensity: { value: this.mouseIntensity }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        
        // Criar plane
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }
    
    setupEvents() {
        // Mouse move
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.targetMouse.x = (e.clientX - rect.left) / rect.width;
            this.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
        });
        
        // Mouse leave
        this.container.addEventListener('mouseleave', () => {
            this.targetMouse.x = 0.5;
            this.targetMouse.y = 0.5;
        });
        
        // Resize
        window.addEventListener('resize', () => this.onResize());
    }
    
    onResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.material) return;
        
        // Update time
        const time = this.clock.getElapsedTime();
        this.material.uniforms.uTime.value = time;
        
        // Smooth mouse
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        this.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        if (this.mesh) this.scene.remove(this.mesh);
        if (this.material) this.material.dispose();
        if (this.renderer) this.renderer.dispose();
        this.canvas.remove();
        this.imageElement.style.display = '';
    }
}

// Classe para gerenciar todas as imagens do site
class WaterEffectManager {
    constructor() {
        this.instances = [];
        this.init();
    }
    
    init() {
        // Esperar Three.js carregar
        if (typeof THREE === 'undefined') {
            console.error('Three.js não está carregado!');
            return;
        }
        
        // Aplicar em todas as imagens dos projetos
        this.applyToProjects();
        
        // Observar novas imagens (filtros, ajax, etc)
        this.observeNewImages();
    }
    
    applyToProjects() {
        const images = document.querySelectorAll('.project .img img');
        
        images.forEach(img => {
            if (img.complete) {
                this.createEffect(img);
            } else {
                img.addEventListener('load', () => this.createEffect(img));
            }
        });
    }
    
    createEffect(img) {
        // Verificar se já tem efeito
        if (img.dataset.waterEffect === 'true') return;
        
        img.dataset.waterEffect = 'true';
        const effect = new WaterDistortion(img);
        this.instances.push(effect);
    }
    
    observeNewImages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const images = node.querySelectorAll('.project .img img');
                        images.forEach(img => {
                            if (img.complete) {
                                this.createEffect(img);
                            } else {
                                img.addEventListener('load', () => this.createEffect(img));
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    destroy() {
        this.instances.forEach(instance => instance.destroy());
        this.instances = [];
    }
}

// Inicializar quando o DOM estiver pronto
if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(function() {
        // Esperar um pouco para garantir que as imagens estão no DOM
        setTimeout(() => {
            window.waterEffectManager = new WaterEffectManager();
        }, 500);
    });
} else {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.waterEffectManager = new WaterEffectManager();
        }, 500);
    });
}