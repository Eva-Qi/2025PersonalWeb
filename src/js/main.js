/**
 * OPTIMIZED EVANOLOTT - Professional Dynamic 3D Portfolio
 * Eva Qi Portfolio - Enhanced Performance & Mobile Controls
 * 
 * KEY OPTIMIZATIONS:
 * - Efficient rendering with conditional updates
 * - Mobile virtual joystick controls
 * - Single "Click Me" button for smooth zoom
 * - Improved performance monitoring
 * - Clean code architecture
 * - Better UX positioning
 */

class OptimizedPortfolio3DRenderer {
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
        
        // Interaction system
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Euler();
        this.currentRotation = new THREE.Euler();
        this.rotationDamping = 0.12;
        this.maxRotationX = Math.PI / 3;
        this.maxRotationY = Math.PI / 2.5;
        
        // Scale/zoom system
        this.baseScale = 1.0;
        this.currentScale = 1.0;
        this.targetScale = 1.0;
        this.scaleDamping = 0.15;
        this.minScale = 0.8;
        this.maxScale = 2.5;
        this.zoomThreshold = 1.6;
        this.isAutoZooming = false; // Flag for smooth auto-zoom
        
        // UI elements
        this.overlay = document.getElementById('overlay');
        this.timedHint = document.getElementById('timed-hint');
        this.info = document.getElementById('info');
        this.fpsElement = document.getElementById('fps');
        this.overlayVisible = false;
        
        // Device detection
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.deviceType = this.getDeviceType();
        
        // Mobile controls
        this.mobileControls = document.getElementById('mobileControls');
        this.joystickContainer = document.getElementById('joystickContainer');
        this.joystickHandle = document.getElementById('joystickHandle');
        this.clickMeBtn = document.getElementById('clickMeBtn');
        this.joystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };
        this.joystickRadius = 40; // Max distance from center
        
        // Role cycling system
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
        this.typingSpeed = 80;
        this.roleDisplayTime = 2500;
        this.hasSeenIntro = false;
        
        // Performance optimization
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.renderRequested = false;
        this.lastCameraUpdate = 0;
        this.cameraUpdateThreshold = 16; // ~60fps
        
        this.init();
    }
    
    /**
     * Detect if device is mobile for conditional features
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }
    
    /**
     * Detect if device is tablet
     */
    detectTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && 
               window.innerWidth > 768 && 
               window.innerWidth <= 1024;
    }
    
    /**
     * Get device type
     */
    getDeviceType() {
        if (this.isMobile) return 'mobile';
        if (this.isTablet) return 'tablet';
        return 'desktop';
    }
    
    /**
     * Initialize the portfolio system
     */
    init() {
        console.log('Starting Optimized Eva Qi Portfolio Renderer');
        try {
            this.setupRenderer();
            this.setupScenes();
            this.setupCamera();
            this.setupLighting();
            this.setupRenderTargets();
            this.loadFont();
            this.setupEventListeners();
            this.setupMobileControls();
            this.setupRoleAnimation();
            this.startTutorial();
            this.animate();
            console.log('All systems optimized and ready');
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showErrorMessage(error);
        }
    }
    
    /**
     * Setup optimized WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencilBuffer: false,
            depth: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x1a1a2e, 1.0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Performance optimizations
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = false; // Disable shadows for better performance
        
        document.body.appendChild(this.renderer.domElement);
        console.log('Optimized renderer configured');
    }
    
    /**
     * Setup scenes
     */
    setupScenes() {
        this.scene = new THREE.Scene();
        this.wireframeScene = new THREE.Scene();
        this.wireframeScene.background = new THREE.Color(0x000000);
    }
    
    /**
     * Setup camera
     */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            65, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100 // Reduced far plane for better performance
        );
        
        // Responsive camera position based on device type
        const getCameraDistance = () => {
            switch (this.deviceType) {
                case 'mobile': return 4;
                case 'tablet': return 5; // Original tablet distance
                case 'desktop': return 3; // Closer for larger text
                default: return 5;
            }
        };
        
        this.camera.position.set(0, 0, getCameraDistance());
    }
    
    /**
     * Setup optimized lighting
     */
    setupLighting() {
        // Reduced number of lights for better performance
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
        mainLight.position.set(10, -8, 12);
        this.scene.add(mainLight);
        
        const rimLight = new THREE.DirectionalLight(0x4488ff, 1.0);
        rimLight.position.set(-6, 3, 8);
        this.scene.add(rimLight);
        
        console.log('Optimized lighting setup complete');
    }
    
    /**
     * Setup render targets
     */
    setupRenderTargets() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const renderTargetParams = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        };
        
        this.mainRenderTarget = new THREE.WebGLRenderTarget(width, height, renderTargetParams);
        this.wireframeRenderTarget = new THREE.WebGLRenderTarget(width, height, renderTargetParams);
        
        this.createCompositeShader();
    }
    
    /**
     * Create lens effect shader
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
                
                float aspectRatio = uResolution.x / uResolution.y;
                vec2 correctedUV = (uv - mouseUV) * vec2(aspectRatio, 1.0);
                float distance = length(correctedUV);
                
                vec4 mainColor = texture2D(uMainTexture, uv);
                vec4 wireframeColor = texture2D(uWireframeTexture, uv);
                
                if (distance < uLensRadius) {
                    float normalizedDist = distance / uLensRadius;
                    vec3 edgePink = vec3(0.94, 0.48, 0.78);
                    vec3 centerPink = vec3(0.97, 0.85, 0.93);
                    vec3 pinkGradient = mix(centerPink, edgePink, normalizedDist * 0.65);
                    
                    float wireframeBrightness = dot(wireframeColor.rgb, vec3(0.299, 0.587, 0.114));
                    
                    if (wireframeBrightness > 0.3) {
                        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                    } else {
                        gl_FragColor = vec4(pinkGradient, 1.0);
                    }
                } else {
                    gl_FragColor = mainColor;
                }
                
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
     * Load font and create text
     */
    loadFont() {
        const fontLoader = new THREE.FontLoader();
        
        fontLoader.load(
            'https://threejs.org/examples/fonts/gentilis_bold.typeface.json',
            (font) => {
                console.log('Font loaded successfully');
                this.createTextGeometry(font);
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log('Font loading progress:', Math.round(progress.loaded / progress.total * 100) + '%');
                }
            },
            (error) => {
                console.error('Font loading error:', error);
                console.log('Creating fallback text geometry');
                this.createFallbackText();
            }
        );
    }
    
    /**
     * Create optimized 3D text geometry
     */
    createTextGeometry(font) {
        // Responsive text size based on device type
        const getTextSize = () => {
            switch (this.deviceType) {
                case 'mobile': return 1.2;
                case 'tablet': return 1.5; // Original tablet size
                case 'desktop': return 2.0; // Larger for desktop
                default: return 1.5;
            }
        };
        
        const textSize = getTextSize();
        
        const textGeometry = new THREE.TextGeometry('Evanolott', {
            font: font,
            size: textSize,
            height: textSize * 0.15,
            curveSegments: 12, // Reduced for better performance
            bevelEnabled: true,
            bevelThickness: textSize * 0.025,
            bevelSize: textSize * 0.01,
            bevelSegments: 8 // Reduced for better performance
        });
        
        textGeometry.computeBoundingBox();
        const centerX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        const centerY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
        textGeometry.translate(centerX, centerY, 0);
        
        // Optimized materials
        const metallicMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            metalness: 0.95,
            roughness: 0.05
        });
        
        // Create outline effect instead of wireframe
        const outlineGeometry = textGeometry.clone();
        outlineGeometry.scale(1.02, 1.02, 1.02); // Slightly larger for outline
        
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide // Only show back faces for outline effect
        });
        
        this.textMesh = new THREE.Mesh(textGeometry, metallicMaterial);
        this.scene.add(this.textMesh);
        
        // Create outline mesh instead of wireframe
        this.wireframeTextMesh = new THREE.Mesh(outlineGeometry, wireframeMaterial);
        this.wireframeScene.add(this.wireframeTextMesh);
        
        console.log('Optimized 3D text created');
    }
    
    /**
     * Create fallback geometry
     */
    createFallbackText() {
        // Responsive fallback geometry size based on device type
        const getFallbackSize = () => {
            switch (this.deviceType) {
                case 'mobile': return { width: 3.5, height: 0.8, depth: 0.4 };
                case 'tablet': return { width: 4.5, height: 1.0, depth: 0.5 };
                case 'desktop': return { width: 6.0, height: 1.2, depth: 0.6 };
                default: return { width: 4.5, height: 1.0, depth: 0.5 };
            }
        };
        
        const size = getFallbackSize();
        const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const material = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            metalness: 0.9,
            roughness: 0.1
        });
        
        this.textMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.textMesh);
        
        // Create outline effect for fallback geometry
        const outlineGeometry = geometry.clone();
        outlineGeometry.scale(1.02, 1.02, 1.02);
        
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        });
        this.wireframeTextMesh = new THREE.Mesh(outlineGeometry, wireframeMaterial);
        this.wireframeScene.add(this.wireframeTextMesh);
        
        console.log('Using fallback geometry');
    }
    
    /**
     * Setup mobile virtual joystick controls
     */
    setupMobileControls() {
        if (!this.isMobile) return;
        
        this.mobileControls.classList.add('visible');
        
        // Calculate joystick center
        const rect = this.joystickContainer.getBoundingClientRect();
        this.joystickCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        
        // Joystick events
        this.joystickContainer.addEventListener('touchstart', this.handleJoystickStart.bind(this), { passive: false });
        this.joystickContainer.addEventListener('touchmove', this.handleJoystickMove.bind(this), { passive: false });
        this.joystickContainer.addEventListener('touchend', this.handleJoystickEnd.bind(this), { passive: false });
        
        // Single "Click Me" button for auto-zoom
        this.clickMeBtn.addEventListener('touchstart', this.handleAutoZoom.bind(this), { passive: true });
        this.clickMeBtn.addEventListener('click', this.handleAutoZoom.bind(this), { passive: true });
        
        console.log('Mobile virtual joystick controls enabled');
    }
    
    /**
     * Handle auto-zoom to reveal overlay
     */
    handleAutoZoom() {
        if (this.isAutoZooming) return;
        
        this.isAutoZooming = true;
        this.clickMeBtn.style.opacity = '0.5';
        this.clickMeBtn.style.transform = 'scale(0.95)';
        
        // Smooth zoom to threshold
        const targetZoom = this.zoomThreshold + 0.1;
        this.targetScale = targetZoom;
        
        // Reset button after animation
        setTimeout(() => {
            this.isAutoZooming = false;
            this.clickMeBtn.style.opacity = '1';
            this.clickMeBtn.style.transform = 'scale(1)';
        }, 1000);
        
        console.log('Auto-zoom initiated');
    }
    
    /**
     * Handle joystick touch start
     */
    handleJoystickStart(event) {
        event.preventDefault();
        this.joystickActive = true;
        this.joystickHandle.classList.add('active');
        
        const touch = event.touches[0];
        this.updateJoystickPosition(touch.clientX, touch.clientY);
    }
    
    /**
     * Handle joystick touch move
     */
    handleJoystickMove(event) {
        if (!this.joystickActive) return;
        event.preventDefault();
        
        const touch = event.touches[0];
        this.updateJoystickPosition(touch.clientX, touch.clientY);
    }
    
    /**
     * Handle joystick touch end
     */
    handleJoystickEnd(event) {
        event.preventDefault();
        this.joystickActive = false;
        this.joystickHandle.classList.remove('active');
        
        // Reset joystick to center
        this.joystickHandle.style.transform = 'translate(-50%, -50%)';
        
        // Reset rotation targets
        this.targetRotation.x = 0;
        this.targetRotation.y = 0;
    }
    
    /**
     * Update joystick position and calculate rotation
     */
    updateJoystickPosition(clientX, clientY) {
        const rect = this.joystickContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;
        
        // Limit to joystick radius
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > this.joystickRadius) {
            deltaX = (deltaX / distance) * this.joystickRadius;
            deltaY = (deltaY / distance) * this.joystickRadius;
        }
        
        // Update handle position
        this.joystickHandle.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;
        
        // Convert to rotation values
        const normalizedX = deltaX / this.joystickRadius;
        const normalizedY = deltaY / this.joystickRadius;
        
        this.targetRotation.y = normalizedX * this.maxRotationY;
        this.targetRotation.x = -normalizedY * this.maxRotationX * 0.6; // Inverted Y
    }
    
    /**
     * Setup role animation system
     */
    setupRoleAnimation() {
        this.roleElement = document.querySelector('.dynamic-role');
    }
    
    /**
     * Optimized role typing animation
     */
    async startRoleTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const currentRole = this.roles[this.currentRoleIndex];
        const targetText = currentRole.text;
        
        const roleTextElement = this.roleElement.querySelector('.role-text');
        roleTextElement.className = `role-text ${currentRole.class} typing active`;
        roleTextElement.textContent = '';
        
        // Optimized typing with setTimeout
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex <= targetText.length) {
                roleTextElement.textContent = targetText.substring(0, charIndex);
                charIndex++;
                setTimeout(typeChar, this.typingSpeed);
            } else {
                roleTextElement.classList.remove('typing');
                
                setTimeout(() => {
                    this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
                    this.isTyping = false;
                    
                    if (this.overlayVisible) {
                        this.startRoleTyping();
                    }
                }, this.roleDisplayTime);
            }
        };
        
        typeChar();
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        if (!this.isMobile) {
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        }
        
        // Touch events for mobile zoom (pinch)
        if (this.isMobile) {
            let initialPinchDistance = null;
            
            window.addEventListener('touchstart', (event) => {
                if (event.touches.length === 2) {
                    const touch1 = event.touches[0];
                    const touch2 = event.touches[1];
                    initialPinchDistance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );
                }
            }, { passive: true });
            
            window.addEventListener('touchmove', (event) => {
                if (event.touches.length === 2 && initialPinchDistance) {
                    const touch1 = event.touches[0];
                    const touch2 = event.touches[1];
                    const currentDistance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );
                    
                    const scale = currentDistance / initialPinchDistance;
                    this.targetScale = Math.max(this.minScale, Math.min(this.maxScale, this.targetScale * scale));
                    initialPinchDistance = currentDistance;
                }
            }, { passive: true });
        }
    }
    
    /**
     * Start tutorial system
     */
    startTutorial() {
        if (this.isMobile) return; // Skip tutorial on mobile
        
        setTimeout(() => {
            if (!this.hasSeenIntro && this.timedHint) {
                this.timedHint.classList.add('show');
            }
        }, 5000);
    }
    
    /**
     * Handle mouse wheel for zoom
     */
    onWheel(event) {
        event.preventDefault();
        const zoomSpeed = 0.002;
        this.targetScale += -event.deltaY * zoomSpeed;
        this.targetScale = Math.max(this.minScale, Math.min(this.maxScale, this.targetScale));
    }
    
    /**
     * Handle mouse movement for rotation and lens
     */
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        if (this.lensUniforms) {
            this.lensUniforms.uMouse.value.copy(this.mouse);
        }
        
        this.targetRotation.y = this.mouse.x * this.maxRotationY;
        this.targetRotation.x = this.mouse.y * this.maxRotationX * 0.6;
    }
    
    /**
     * Update overlay visibility with optimization
     */
    updateOverlay() {
        const shouldShowOverlay = this.currentScale >= this.zoomThreshold;
        
        if (shouldShowOverlay && !this.overlayVisible) {
            this.overlay.classList.add('active');
            this.info.style.opacity = '0.3';
            this.fpsElement.style.opacity = '0.3';
            this.overlayVisible = true;
            this.hasSeenIntro = true;
            
            if (this.timedHint) {
                this.timedHint.classList.remove('show');
            }
            
            setTimeout(() => {
                this.startRoleTyping();
            }, 800);
            
            console.log('Introduction revealed');
        } else if (!shouldShowOverlay && this.overlayVisible) {
            this.overlay.classList.remove('active');
            this.info.style.opacity = '0.8';
            this.fpsElement.style.opacity = '0.7';
            this.overlayVisible = false;
            this.isTyping = false;
        }
    }
    
    /**
     * Handle window resize with optimization
     */
    onWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            
            this.mainRenderTarget.setSize(width, height);
            this.wireframeRenderTarget.setSize(width, height);
            
            if (this.lensUniforms) {
                this.lensUniforms.uResolution.value.set(width, height);
            }
            
            // Update joystick center on mobile
            if (this.isMobile && this.joystickContainer) {
                const rect = this.joystickContainer.getBoundingClientRect();
                this.joystickCenter = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
            }
            
            // console.log('Resized to', width, 'x', height); // Commented out to reduce log spam
        }, 100); // Throttle resize events
    }
    
    /**
     * Optimized performance monitoring
     */
    updatePerformance() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            const calls = this.renderer.info.render.calls;
            const triangles = this.renderer.info.render.triangles;
            
            this.fpsElement.textContent = `FPS: ${fps} | Calls: ${calls} | Tri: ${triangles}`;
            
            this.frameCount = 0;
            this.lastTime = currentTime;
            this.renderer.info.reset();
        }
    }
    
    /**
     * Optimized animation loop with conditional rendering
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const currentTime = performance.now();
        
        // Update time uniform
        if (this.lensUniforms) {
            this.lensUniforms.uTime.value = currentTime * 0.001;
        }
        
        // Smooth interpolation
        this.currentScale += (this.targetScale - this.currentScale) * this.scaleDamping;
        
        // Only update if there's significant change or movement
        const hasMovement = 
            Math.abs(this.targetRotation.x - this.currentRotation.x) > 0.001 ||
            Math.abs(this.targetRotation.y - this.currentRotation.y) > 0.001 ||
            Math.abs(this.targetScale - this.currentScale) > 0.001;
        
        if (this.textMesh && this.wireframeTextMesh && (hasMovement || !this.renderRequested)) {
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.rotationDamping;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.rotationDamping;
            
            this.textMesh.rotation.x = this.currentRotation.x;
            this.textMesh.rotation.y = this.currentRotation.y;
            this.textMesh.rotation.z = 0;
            this.textMesh.scale.setScalar(this.currentScale);
            
            this.wireframeTextMesh.rotation.copy(this.textMesh.rotation);
            this.wireframeTextMesh.scale.copy(this.textMesh.scale);
            
            this.render();
            this.renderRequested = true;
        }
        
        this.updateOverlay();
        this.updatePerformance();
    }
    
    /**
     * Optimized multi-pass rendering
     */
    render() {
        if (!this.textMesh || !this.wireframeTextMesh) {
            return;
        }
        
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
                <h2>WebGL Error</h2>
                <p>Failed to initialize the 3D renderer.</p>
                <p style="color: #ff6b6b;">Error: ${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; background: #4a9eff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

/**
 * Initialize immediately when script loads (since it's loaded after DOM is ready)
 */
function initializePortfolio() {
    console.log('Starting Optimized Eva Qi Professional 3D Portfolio');
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Waiting for it...');
        // Wait a bit and try again
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                console.log('Three.js loaded, initializing portfolio...');
                try {
                    new OptimizedPortfolio3DRenderer();
                } catch (error) {
                    console.error('Critical initialization error:', error);
                }
            } else {
                console.error('Three.js failed to load');
            }
        }, 1000);
        return;
    }
    
    try {
        new OptimizedPortfolio3DRenderer();
    } catch (error) {
        console.error('Critical initialization error:', error);
    }
}

// Initialize immediately if DOM is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    // DOM is already loaded, initialize immediately
    initializePortfolio();
}

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    if (e.message !== 'Script error.') {
        console.error('Runtime error:', e.message, e.filename, e.lineno);
    }
});