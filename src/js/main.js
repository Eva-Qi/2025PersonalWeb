/**
 * EVANOLOTT - Professional Dynamic 3D Portfolio
 * Eva Qi Portfolio - Main Application Logic
 * 
 * Features:
 * - 3D metallic text rendering with lens effect
 * - Dynamic role cycling with professional colors
 * - Scroll-zoom interaction system
 * - Professional animations and transitions
 */

class DynamicPortfolio3DRenderer {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.wireframeScene = null;
        this.camera = null;
        this.renderer = null;
        this.textMesh = null;
        this.wireframeTextMesh = null;
        
        // Render targets for lens effect
        this.mainRenderTarget = null;
        this.wireframeRenderTarget = null;
        this.compositeQuad = null;
        this.lensUniforms = null;
        
        // Professional interaction system
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Euler();
        this.currentRotation = new THREE.Euler();
        this.rotationDamping = 0.12;
        this.maxRotationX = Math.PI / 3;
        this.maxRotationY = Math.PI / 2.5;
        
        // Scroll zoom system
        this.baseScale = 1.0;
        this.currentScale = 1.0;
        this.targetScale = 1.0;
        this.scaleDamping = 0.15;
        this.minScale = 0.8;
        this.maxScale = 2.5;
        this.zoomThreshold = 1.6; // When to show overlay
        
        // UI elements
        this.overlay = document.getElementById('overlay');
        this.timedHint = document.getElementById('timed-hint');
        this.info = document.getElementById('info');
        this.fpsElement = document.getElementById('fps');
        this.overlayVisible = false;
        
        // Professional role cycling system with 2025 color trends
        this.roles = [
            { text: 'Developer', class: 'role-developer' },
            { text: 'Quant Researcher', class: 'role-researcher' },
            { text: 'Artist', class: 'role-artist' },
            { text: 'Educator', class: 'role-educator' },
            { text: 'Entrepreneur', class: 'role-entrepreneur' },
            { text: 'Wine Connoisseur', class: 'role-connoisseur' }
        ];
        this.currentRoleIndex = 0;
        this.roleElement = null;
        this.isTyping = false;
        this.typingSpeed = 80; // milliseconds per character
        this.roleDisplayTime = 2500; // milliseconds to display each role
        this.hasSeenIntro = false;
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastTime = performance.now();
        
        // Touch handling for mobile
        this.initialPinchDistance = null;
        
        this.init();
    }
    
    /**
     * Initialize the entire portfolio system
     */
    init() {
        console.log('🚀 Starting Dynamic Eva Qi Portfolio Renderer');
        try {
            this.setupRenderer();
            this.setupScenes();
            this.setupCamera();
            this.setupProfessionalLighting();
            this.setupRenderTargets();
            this.loadFont();
            this.setupEventListeners();
            this.setupRoleAnimation();
            this.startSimpleTutorial();
            this.animate();
            console.log('✅ All systems initialized successfully');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showErrorMessage(error);
        }
    }
    
    /**
     * Setup high-performance WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencilBuffer: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x1a1a2e, 1.0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        document.body.appendChild(this.renderer.domElement);
        console.log('✅ High-performance renderer ready');
    }
    
    /**
     * Setup main and wireframe scenes
     */
    setupScenes() {
        this.scene = new THREE.Scene();
        this.wireframeScene = new THREE.Scene();
        this.wireframeScene.background = new THREE.Color(0x000000);
        console.log('✅ Scenes created');
    }
    
    /**
     * Setup professional camera positioning
     */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            65, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 6);
        console.log('✅ Camera positioned');
    }
    
    /**
     * Setup professional metallic lighting system
     */
    setupProfessionalLighting() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.25);
        this.scene.add(ambientLight);
        
        // Professional concentrated spot light from bottom-right
        const spotLight = new THREE.SpotLight(0xffffff, 3.0);
        spotLight.position.set(10, -8, 12);
        spotLight.target.position.set(0, 0, 0);
        spotLight.angle = Math.PI / 7;
        spotLight.penumbra = 0.4;
        spotLight.decay = 1.8;
        spotLight.distance = 40;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);
        
        // Colorful metallic rim lights
        const blueRimLight = new THREE.DirectionalLight(0x4488ff, 1.2);
        blueRimLight.position.set(-6, 3, 8);
        this.scene.add(blueRimLight);
        
        const goldRimLight = new THREE.DirectionalLight(0xffaa44, 0.8);
        goldRimLight.position.set(8, 6, -4);
        this.scene.add(goldRimLight);
        
        // Subtle fill light
        const fillLight = new THREE.DirectionalLight(0x6677aa, 0.3);
        fillLight.position.set(-4, 10, 6);
        this.scene.add(fillLight);
        
        console.log('✅ Professional metallic lighting complete');
    }
    
    /**
     * Setup render targets for lens effect
     */
    setupRenderTargets() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.mainRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
        
        this.wireframeRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
        
        this.createCompositeShader();
        console.log('✅ Render targets ready');
    }
    
    /**
     * Create professional lens effect shader
     */
    createCompositeShader() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        const uniforms = {
            uMainTexture: { value: this.mainRenderTarget.texture },
            uWireframeTexture: { value: this.wireframeRenderTarget.texture },
            uMouse: { value: new THREE.Vector2() },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uLensRadius: { value: 0.13 },
            uTime: { value: 0 }
        };
        
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            uniform sampler2D uMainTexture;
            uniform sampler2D uWireframeTexture;
            uniform vec2 uMouse;
            uniform vec2 uResolution;
            uniform float uLensRadius;
            uniform float uTime;
            varying vec2 vUv;
            
            void main() {
                vec2 uv = vUv;
                vec2 mouseUV = uMouse * 0.5 + 0.5;
                
                // Perfect circular lens
                float aspectRatio = uResolution.x / uResolution.y;
                vec2 correctedUV = (uv - mouseUV) * vec2(aspectRatio, 1.0);
                float distance = length(correctedUV);
                
                vec4 mainColor = texture2D(uMainTexture, uv);
                vec4 wireframeColor = texture2D(uWireframeTexture, uv);
                
                // Inside lens effect
                if (distance < uLensRadius) {
                    // Professional pink gradient
                    float normalizedDist = distance / uLensRadius;
                    vec3 edgePink = vec3(0.94, 0.48, 0.78);
                    vec3 centerPink = vec3(0.97, 0.85, 0.93);
                    vec3 pinkGradient = mix(centerPink, edgePink, normalizedDist * 0.65);
                    
                    // Detect wireframe lines
                    float wireframeBrightness = dot(wireframeColor.rgb, vec3(0.299, 0.587, 0.114));
                    
                    if (wireframeBrightness > 0.3) {
                        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                    } else {
                        gl_FragColor = vec4(pinkGradient, 1.0);
                    }
                } else {
                    gl_FragColor = mainColor;
                }
                
                // Professional lens edge glow
                float edgeGlow = smoothstep(uLensRadius + 0.015, uLensRadius - 0.004, distance);
                vec3 pinkGlow = vec3(0.9, 0.5, 0.8) * 0.35;
                gl_FragColor.rgb += pinkGlow * edgeGlow * (1.0 - step(distance, uLensRadius));
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader
        });
        
        this.compositeQuad = new THREE.Mesh(geometry, material);
        this.lensUniforms = uniforms;
    }
    
    /**
     * Load professional font and create 3D text
     */
    loadFont() {
        const fontLoader = new THREE.FontLoader();
        
        fontLoader.load(
            'https://threejs.org/examples/fonts/gentilis_bold.typeface.json',
            (font) => {
                console.log('✅ Font loaded');
                this.createTextGeometry(font);
            },
            (progress) => {
                console.log('🔥 Font loading:', Math.round(progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Font error:', error);
                this.createFallbackText();
            }
        );
    }
    
    /**
     * Create professional 3D "Evanolott" text geometry
     */
    createTextGeometry(font) {
        // Professional 3D text
        const textGeometry = new THREE.TextGeometry('Evanolott', {
            font: font,
            size: 1.0,
            height: 0.2,
            curveSegments: 14,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.015,
            bevelSegments: 10
        });
        
        // Center the text
        textGeometry.computeBoundingBox();
        const centerX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        const centerY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
        textGeometry.translate(centerX, centerY, 0);
        
        // Professional metallic material
        const metallicMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            metalness: 0.95,
            roughness: 0.05
        });
        
        // Wireframe material
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
        
        // Create both meshes
        this.textMesh = new THREE.Mesh(textGeometry, metallicMaterial);
        this.scene.add(this.textMesh);
        
        this.wireframeTextMesh = new THREE.Mesh(textGeometry.clone(), wireframeMaterial);
        this.wireframeScene.add(this.wireframeTextMesh);
        
        console.log('✅ Professional 3D text "Evanolott" created');
    }
    
    /**
     * Create fallback geometry if font fails to load
     */
    createFallbackText() {
        const geometry = new THREE.BoxGeometry(3.5, 0.8, 0.4);
        const material = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            metalness: 0.9,
            roughness: 0.1
        });
        
        this.textMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.textMesh);
        
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
        this.wireframeTextMesh = new THREE.Mesh(geometry.clone(), wireframeMaterial);
        this.wireframeScene.add(this.wireframeTextMesh);
        
        console.log('⚠️ Using fallback geometry');
    }
    
    /**
     * Setup dynamic role animation system
     */
    setupRoleAnimation() {
        this.roleElement = document.querySelector('.dynamic-role');
        console.log('✅ Role animation system ready');
    }
    
    /**
     * Professional typing animation for role cycling
     */
    async startRoleTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const currentRole = this.roles[this.currentRoleIndex];
        const targetText = currentRole.text;
        
        // Clear current text and set new color class
        const roleTextElement = this.roleElement.querySelector('.role-text');
        roleTextElement.className = `role-text ${currentRole.class} typing active`;
        roleTextElement.textContent = '';
        
        // Type out the text character by character
        for (let i = 0; i <= targetText.length; i++) {
            roleTextElement.textContent = targetText.substring(0, i);
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
        }
        
        // Remove typing cursor
        roleTextElement.classList.remove('typing');
        
        // Wait before cycling to next role
        setTimeout(() => {
            this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
            this.isTyping = false;
            
            // Continue cycling if overlay is still visible
            if (this.overlayVisible) {
                this.startRoleTyping();
            }
        }, this.roleDisplayTime);
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Scroll event for zooming
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        
        // Touch events for mobile
        window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    }
    
    /**
     * Start tutorial hint system
     */
    startSimpleTutorial() {
        // Show hint after 5 seconds only if they haven't seen the intro
        setTimeout(() => {
            if (!this.hasSeenIntro && this.timedHint) {
                this.timedHint.classList.add('show');
                console.log('💡 Tutorial hint shown');
            }
        }, 5000);
    }
    
    /**
     * Handle mouse wheel for zoom functionality
     */
    onWheel(event) {
        event.preventDefault();
        
        // Zoom logic
        const zoomSpeed = 0.002;
        const deltaY = event.deltaY;
        
        // Scroll up (negative delta) = zoom in
        this.targetScale += -deltaY * zoomSpeed;
        this.targetScale = Math.max(this.minScale, Math.min(this.maxScale, this.targetScale));
    }
    
    /**
     * Handle touch start for pinch-to-zoom
     */
    onTouchStart(event) {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            this.initialPinchDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
        }
    }
    
    /**
     * Handle touch move for pinch-to-zoom
     */
    onTouchMove(event) {
        if (event.touches.length === 2 && this.initialPinchDistance) {
            event.preventDefault();
            
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const scale = currentDistance / this.initialPinchDistance;
            this.targetScale = Math.max(this.minScale, Math.min(this.maxScale, this.targetScale * scale));
            this.initialPinchDistance = currentDistance;
        }
    }
    
    /**
     * Handle mouse movement for rotation and lens effect
     */
    onMouseMove(event) {
        // Update mouse for lens
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        if (this.lensUniforms) {
            this.lensUniforms.uMouse.value.copy(this.mouse);
        }
        
        // Professional rotation mapping
        this.targetRotation.y = this.mouse.x * this.maxRotationY;
        this.targetRotation.x = this.mouse.y * this.maxRotationX * 0.6;
    }
    
    /**
     * Update overlay visibility and start/stop role cycling
     */
    updateOverlay() {
        const shouldShowOverlay = this.currentScale >= this.zoomThreshold;
        
        if (shouldShowOverlay && !this.overlayVisible) {
            // Show overlay and start role animation
            this.overlay.classList.add('active');
            this.info.style.opacity = '0.3';
            this.fpsElement.style.opacity = '0.3';
            this.overlayVisible = true;
            this.hasSeenIntro = true;
            
            // Hide tutorial hint permanently once intro is seen
            if (this.timedHint) {
                this.timedHint.classList.remove('show');
            }
            
            // Start role cycling animation after intro animation completes
            setTimeout(() => {
                this.startRoleTyping();
            }, 800); // Faster start time
            
            console.log('✨ Dynamic introduction revealed - role cycling started');
        } else if (!shouldShowOverlay && this.overlayVisible) {
            // Hide overlay and stop role animation
            this.overlay.classList.remove('active');
            this.info.style.opacity = '0.8';
            this.fpsElement.style.opacity = '0.7';
            this.overlayVisible = false;
            this.isTyping = false; // Stop role cycling
            console.log('🔄 Overlay hidden - role cycling stopped');
        }
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // Resize render targets
        this.mainRenderTarget.setSize(width, height);
        this.wireframeRenderTarget.setSize(width, height);
        
        if (this.lensUniforms) {
            this.lensUniforms.uResolution.value.set(width, height);
        }
        
        console.log('✅ Resized to', width, 'x', height);
    }
    
    /**
     * Update performance monitoring
     */
    updatePerformance() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.fpsElement.textContent = `FPS: ${fps} | Calls: ${this.renderer.info.render.calls}`;
            
            this.frameCount = 0;
            this.lastTime = currentTime;
            this.renderer.info.reset();
        }
    }
    
    /**
     * Main animation loop
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const currentTime = performance.now() * 0.001;
        if (this.lensUniforms) {
            this.lensUniforms.uTime.value = currentTime;
        }
        
        // Update scale with smooth interpolation
        this.currentScale += (this.targetScale - this.currentScale) * this.scaleDamping;
        
        // Professional smooth rotation and scaling
        if (this.textMesh && this.wireframeTextMesh) {
            // Smooth interpolation
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.rotationDamping;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.rotationDamping;
            
            // Apply transformations to both meshes
            this.textMesh.rotation.x = this.currentRotation.x;
            this.textMesh.rotation.y = this.currentRotation.y;
            this.textMesh.rotation.z = 0;
            this.textMesh.scale.setScalar(this.currentScale);
            
            this.wireframeTextMesh.rotation.copy(this.textMesh.rotation);
            this.wireframeTextMesh.scale.copy(this.textMesh.scale);
        }
        
        // Update overlay visibility
        this.updateOverlay();
        
        this.render();
        this.updatePerformance();
    }
    
    /**
     * Multi-pass rendering with lens effect
     */
    render() {
        // Pass 1: Render main metallic scene
        this.renderer.setRenderTarget(this.mainRenderTarget);
        this.renderer.render(this.scene, this.camera);
        
        // Pass 2: Render wireframe scene
        this.renderer.setRenderTarget(this.wireframeRenderTarget);
        this.renderer.render(this.wireframeScene, this.camera);
        
        // Pass 3: Composite with lens effect
        this.renderer.setRenderTarget(null);
        
        const compositeScene = new THREE.Scene();
        const compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        compositeScene.add(this.compositeQuad);
        
        this.renderer.render(compositeScene, compositeCamera);
    }
    
    /**
     * Show error message if initialization fails
     */
    showErrorMessage(error) {
        document.body.innerHTML = `
            <div style="color: white; text-align: center; padding: 50px; font-family: Arial; background: #1a1a2e;">
                <h2>⚠️ WebGL Error</h2>
                <p>Failed to initialize the 3D renderer.</p>
                <p style="color: #ff6b6b;">Error: ${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; background: #4a9eff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 Reload Page
                </button>
            </div>
        `;
    }
}

/**
 * Initialize the portfolio when DOM is ready
 */
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Starting Dynamic Eva Qi Professional 3D Portfolio Renderer');
    try {
        new DynamicPortfolio3DRenderer();
    } catch (error) {
        console.error('❌ Critical initialization error:', error);
    }
});

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    if (e.message !== 'Script error.') {
        console.error('❌ Runtime error:', e.message, e.filename, e.lineno);
    }
});