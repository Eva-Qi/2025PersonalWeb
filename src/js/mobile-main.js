/**
 * MOBILE-OPTIMIZED EVANOLOTT - Professional Dynamic 3D Portfolio
 * Eva Qi Portfolio - Mobile-First Performance & Controls
 * 
 * MOBILE OPTIMIZATIONS:
 * - Reduced 3D complexity for mobile performance
 * - Virtual joystick controls only
 * - Simplified rendering pipeline
 * - Touch-optimized interactions
 * - Reduced memory footprint
 */

class MobilePortfolio3DRenderer {
    constructor() {
        // Core Three.js components (simplified for mobile)
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
        
        // Simplified interaction system
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Euler();
        this.currentRotation = new THREE.Euler();
        this.rotationDamping = 0.15;
        this.maxRotationX = Math.PI / 4; // Reduced for mobile
        this.maxRotationY = Math.PI / 3; // Reduced for mobile
        
        // Scale/zoom system (adjusted for mobile base scale)
        this.mobileBaseScale = 0.7; // Mobile base scale
        this.baseScale = 1.0;
        this.currentScale = 1.0;
        this.targetScale = 1.0;
        this.scaleDamping = 0.2;
        this.minScale = 0.8;
        this.maxScale = 2.0; // Reduced max scale for mobile
        this.zoomThreshold = 1.4; // Lower threshold for mobile
        this.isAutoZooming = false;
        
        // UI elements
        this.overlay = document.getElementById('overlay');
        this.timedHint = document.getElementById('timed-hint');
        this.overlayVisible = false;
        
        // Device detection (use global device detector if available)
        this.isMobile = window.deviceDetector ? window.deviceDetector.isMobile : true; // Always mobile for this file
        this.isTablet = window.deviceDetector ? window.deviceDetector.isTablet : false;
        this.deviceType = 'mobile'; // This file is mobile-specific
        
        // Mobile controls
        this.mobileControls = document.getElementById('mobileControls');
        this.joystickContainer = document.getElementById('joystickContainer');
        this.joystickHandle = document.getElementById('joystickHandle');
        this.clickMeBtn = document.getElementById('clickMeBtn');
        this.joystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };
        this.joystickRadius = 40;
        
        // Touch tracking for proper multi-touch handling
        this.activeJoystickTouches = new Set(); // Track which touches are controlling joystick
        this.activePinkLightTouches = new Set(); // Track which touches are controlling pink light
        
        // Mouse movement tracking for render optimization
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseHasMoved = false;
        
        // Role cycling system (simplified)
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
        this.typingSpeed = 100; // Slightly slower for mobile
        this.roleDisplayTime = 3000; // Longer display time for mobile
        this.hasSeenIntro = false;
        
        // Performance optimization
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.renderRequested = false;
        this.lastCameraUpdate = 0;
        this.cameraUpdateThreshold = 33; // ~30fps for mobile
        
        this.init();
    }
    
    /**
     * Initialize the mobile portfolio system
     */
    init() {
        console.log('Starting Mobile Eva Qi Portfolio Renderer');
        try {
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupLighting();
            this.setupRenderTargets();
            this.loadFont();
            this.setupEventListeners();
            this.setupMobileControls();
            this.setupRoleAnimation();
            this.animate();
            console.log('Mobile systems ready');
        } catch (error) {
            console.error('Mobile initialization failed:', error);
            this.showErrorMessage(error);
        }
    }
    
    /**
     * Setup mobile-optimized WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, // Disabled for mobile performance
            alpha: false,
            powerPreference: "low-power", // Better for mobile
            stencilBuffer: false,
            depth: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lower pixel ratio for mobile
        this.renderer.setClearColor(0x1a1a2e, 1.0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8; // Slightly dimmer for mobile
        
        // Mobile performance optimizations
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = false;
        this.renderer.physicallyCorrectLights = false;
        
        document.body.appendChild(this.renderer.domElement);
        console.log('Mobile renderer configured');
    }
    
    /**
     * Setup scenes with wireframe support
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.wireframeScene = new THREE.Scene();
        this.wireframeScene.background = new THREE.Color(0x000000);
    }
    
    /**
     * Setup camera
     */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            70, // Wider FOV for mobile
            window.innerWidth / window.innerHeight, 
            0.1, 
            50 // Reduced far plane for mobile
        );
        this.camera.position.set(0, 0, 5);
    }
    
    /**
     * Setup simplified lighting for mobile
     */
    setupLighting() {
        // Only essential lights for mobile
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, -5, 8);
        this.scene.add(mainLight);
        
        console.log('Mobile lighting setup complete');
    }
    
    /**
     * Setup render targets for mobile
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
     * Create lens effect shader for mobile
     */
    createCompositeShader() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        const uniforms = {
            uMainTexture: { value: this.mainRenderTarget.texture },
            uWireframeTexture: { value: this.wireframeRenderTarget.texture },
            uMouse: { value: new THREE.Vector2() },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uLensRadius: { value: 0.15 }, // Slightly larger for mobile
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
     * Load font and create text (simplified for mobile)
     */
    loadFont() {
        const fontLoader = new THREE.FontLoader();
        
        fontLoader.load(
            'https://threejs.org/examples/fonts/gentilis_bold.typeface.json',
            (font) => {
                console.log('Font loaded');
                this.createTextGeometry(font);
            },
            (progress) => {
                console.log('Font loading:', Math.round(progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Font error:', error);
                this.createFallbackText();
            }
        );
    }
    
    /**
     * Create simplified 3D text geometry for mobile
     */
    createTextGeometry(font) {
        const textGeometry = new THREE.TextGeometry('Evanolott', {
            font: font,
            size: 0.8, // Smaller for mobile
            height: 0.15, // Reduced height
            curveSegments: 8, // Reduced for mobile performance
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelSegments: 4 // Reduced for mobile performance
        });
        
        textGeometry.computeBoundingBox();
        const centerX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        const centerY = -0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
        textGeometry.translate(centerX, centerY, 0);
        
        // Simplified material for mobile
        const material = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            metalness: 0.9,
            roughness: 0.1
        });
        
        // Create edge outline effect using EdgeGeometry
        const edges = new THREE.EdgesGeometry(textGeometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 2
        });
        
        this.textMesh = new THREE.Mesh(textGeometry, material);
        this.scene.add(this.textMesh);
        
        // Create edge outline using LineSegments
        this.wireframeTextMesh = new THREE.LineSegments(edges, wireframeMaterial);
        this.wireframeScene.add(this.wireframeTextMesh);
        
        // Scale down for mobile to fit better on screen
        const mobileScale = 0.7; // Reduce size by 30% for mobile
        this.textMesh.scale.setScalar(mobileScale);
        this.wireframeTextMesh.scale.setScalar(mobileScale);
        
        console.log('Mobile 3D text created');
    }
    
    /**
     * Create fallback geometry for mobile
     */
    createFallbackText() {
        const geometry = new THREE.BoxGeometry(3, 0.6, 0.3);
        const material = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            metalness: 0.9,
            roughness: 0.1
        });
        
        // Create edge outline effect for mobile fallback
        const edges = new THREE.EdgesGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 2
        });
        
        this.textMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.textMesh);
        
        // Create edge outline for mobile fallback
        this.wireframeTextMesh = new THREE.LineSegments(edges, wireframeMaterial);
        this.wireframeScene.add(this.wireframeTextMesh);
        
        // Scale down for mobile to fit better on screen
        const mobileScale = 0.7; // Reduce size by 30% for mobile
        this.textMesh.scale.setScalar(mobileScale);
        this.wireframeTextMesh.scale.setScalar(mobileScale);
        
        console.log('Using mobile fallback geometry');
    }
    
    /**
     * Setup mobile virtual joystick controls
     */
    setupMobileControls() {
        this.mobileControls.classList.add('visible');
        
        // Calculate joystick center
        const rect = this.joystickContainer.getBoundingClientRect();
        this.joystickCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        
        // Joystick events - prevent event bubbling to avoid conflicts
        this.joystickContainer.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            this.handleJoystickStart(e);
        }, { passive: false });
        
        this.joystickContainer.addEventListener('touchmove', (e) => {
            e.stopPropagation();
            this.handleJoystickMove(e);
        }, { passive: false });
        
        this.joystickContainer.addEventListener('touchend', (e) => {
            e.stopPropagation();
            this.handleJoystickEnd(e);
        }, { passive: false });
        
        // Single "Click Me" button for auto-zoom - prevent event bubbling
        this.clickMeBtn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            this.handleAutoZoom(e);
        }, { passive: true });
        
        this.clickMeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleAutoZoom(e);
        }, { passive: true });
        
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
        
        console.log('Mobile auto-zoom initiated');
    }
    
    /**
     * Handle joystick touch start
     */
    handleJoystickStart(event) {
        event.preventDefault();
        this.joystickActive = true;
        this.joystickHandle.classList.add('active');
        
        const touch = event.touches[0];
        
        // Track this touch as controlling the joystick
        this.activeJoystickTouches.add(touch.identifier);
        
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
        
        // Remove all joystick touches from tracking
        this.activeJoystickTouches.clear();
        
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
        this.targetRotation.x = -normalizedY * this.maxRotationX;
    }
    
    /**
     * Setup role animation system
     */
    setupRoleAnimation() {
        this.roleElement = document.querySelector('.dynamic-role');
    }
    
    /**
     * Mobile role typing animation
     */
    async startRoleTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const currentRole = this.roles[this.currentRoleIndex];
        const targetText = currentRole.text;
        
        const roleTextElement = this.roleElement.querySelector('.role-text');
        roleTextElement.className = `role-text ${currentRole.class} typing active`;
        roleTextElement.textContent = '';
        
        // Mobile typing animation
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
     * Enhanced setup event listeners with better multi-touch support
     */
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Touch events for mobile zoom (pinch) - enhanced to not conflict with other touches
        let initialPinchDistance = null;
        
        // Combined touch event handler to avoid conflicts
        window.addEventListener('touchstart', (event) => {
            // Handle pink light control
            this.onTouchStart(event);
            
            // Handle pinch zoom if exactly 2 touches
            if (event.touches.length === 2) {
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                
                // Calculate initial distance
                initialPinchDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            } else {
                // Reset pinch distance if not exactly 2 touches
                initialPinchDistance = null;
            }
        }, { passive: true });
        
        window.addEventListener('touchmove', (event) => {
            // Handle pink light control
            this.onTouchMove(event);
            
            // Handle pinch zoom if exactly 2 touches and we have initial distance
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
        
        window.addEventListener('touchend', (event) => {
            // Handle pink light control cleanup
            this.onTouchEnd(event);
            
            // Reset pinch distance when touches end
            if (event.touches.length < 2) {
                initialPinchDistance = null;
            }
        }, { passive: true });
    }
    
    /**
     * Check if touch is within any control area (joystick OR Click Me button)
     */
    isTouchInControlsArea(clientX, clientY) {
        // Check joystick area
        if (this.joystickContainer) {
            const joystickRect = this.joystickContainer.getBoundingClientRect();
            const inJoystick = clientX >= joystickRect.left && 
                              clientX <= joystickRect.right && 
                              clientY >= joystickRect.top && 
                              clientY <= joystickRect.bottom;
            if (inJoystick) return true;
        }
        
        // Check Click Me button area
        if (this.clickMeBtn) {
            const buttonRect = this.clickMeBtn.getBoundingClientRect();
            const inButton = clientX >= buttonRect.left && 
                            clientX <= buttonRect.right && 
                            clientY >= buttonRect.top && 
                            clientY <= buttonRect.bottom;
            if (inButton) return true;
        }
        
        return false;
    }

    /**
     * Check if touch is specifically within joystick area only
     */
    isTouchInJoystickArea(clientX, clientY) {
        if (!this.joystickContainer) return false;
        
        const rect = this.joystickContainer.getBoundingClientRect();
        return clientX >= rect.left && 
               clientX <= rect.right && 
               clientY >= rect.top && 
               clientY <= rect.bottom;
    }
    
    /**
     * Handle touch start for pink light control - FIXED VERSION
     */
    onTouchStart(event) {
        // For pink light control, we need to:
        // 1. Ignore touches on ANY control area (joystick + Click Me button)
        // 2. Support multi-touch where joystick can be active while other finger controls pink light
        // 3. Ignore touches that are already controlling the joystick
        
        // Look for new touches that can control pink light
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            
            // Skip if this touch is already controlling the joystick
            if (this.activeJoystickTouches.has(touch.identifier)) {
                continue;
            }
            
            // Skip if this touch is already controlling pink light
            if (this.activePinkLightTouches.has(touch.identifier)) {
                continue;
            }
            
            // Skip if this touch is in any control area
            if (this.isTouchInControlsArea(touch.clientX, touch.clientY)) {
                continue;
            }
            
            // This is a new valid touch for pink light control
            this.activePinkLightTouches.add(touch.identifier);
            this.updatePinkLightPosition(touch.clientX, touch.clientY);
            break; // Use the first new valid touch
        }
    }
    
    /**
     * Handle touch move for pink light control - FIXED VERSION
     */
    onTouchMove(event) {
        // First, check if any of the currently active pink light touches are still active
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            
            // If this touch is already controlling pink light, continue following it
            if (this.activePinkLightTouches.has(touch.identifier)) {
                this.updatePinkLightPosition(touch.clientX, touch.clientY);
                return; // Found the active pink light touch, update and exit
            }
        }
        
        // If no active pink light touches found, look for new valid touches
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            
            // Skip if this touch is already controlling the joystick
            if (this.activeJoystickTouches.has(touch.identifier)) {
                continue;
            }
            
            // Skip if this touch is in any control area
            if (this.isTouchInControlsArea(touch.clientX, touch.clientY)) {
                continue;
            }
            
            // This is a new valid touch for pink light control
            this.activePinkLightTouches.add(touch.identifier);
            this.updatePinkLightPosition(touch.clientX, touch.clientY);
            break; // Use the first new valid touch
        }
    }
    
    /**
     * Handle touch end for pink light control
     */
    onTouchEnd(event) {
        // Clean up tracking for ended touches
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this.activePinkLightTouches.delete(touch.identifier);
        }
    }
    
    /**
     * Update pink light position based on touch
     */
    updatePinkLightPosition(clientX, clientY) {
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        // Check if mouse position has actually changed
        if (Math.abs(this.mouse.x - this.lastMouseX) > 0.001 || Math.abs(this.mouse.y - this.lastMouseY) > 0.001) {
            this.mouseHasMoved = true;
            this.lastMouseX = this.mouse.x;
            this.lastMouseY = this.mouse.y;
        }
        
        if (this.lensUniforms) {
            this.lensUniforms.uMouse.value.copy(this.mouse);
        }
    }
    
    /**
     * Update overlay visibility for mobile
     */
    updateOverlay() {
        const shouldShowOverlay = this.currentScale >= this.zoomThreshold;
        
        if (shouldShowOverlay && !this.overlayVisible) {
            this.overlay.classList.add('active');
            this.overlayVisible = true;
            this.hasSeenIntro = true;
            
            setTimeout(() => {
                this.startRoleTyping();
            }, 800);
            
            console.log('Mobile introduction revealed');
        } else if (!shouldShowOverlay && this.overlayVisible) {
            this.overlay.classList.remove('active');
            this.overlayVisible = false;
            this.isTyping = false;
        }
    }
    
    /**
     * Handle window resize for mobile
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // Update joystick center
        if (this.joystickContainer) {
            const rect = this.joystickContainer.getBoundingClientRect();
            this.joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }
        
        console.log('Mobile resized to', width, 'x', height);
    }
    
    /**
     * Mobile performance monitoring
     */
    updatePerformance() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            // FPS monitoring removed for cleaner UI
            
            this.frameCount = 0;
            this.lastTime = currentTime;
            this.renderer.info.reset();
        }
    }
    
    /**
     * Mobile-optimized animation loop
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Smooth interpolation
        this.currentScale += (this.targetScale - this.currentScale) * this.scaleDamping;
        
        // Only update if there's significant change
        const hasMovement = 
            Math.abs(this.targetRotation.x - this.currentRotation.x) > 0.001 ||
            Math.abs(this.targetRotation.y - this.currentRotation.y) > 0.001 ||
            Math.abs(this.targetScale - this.currentScale) > 0.001;
        
        // Check if mouse has moved (for pink light)
        const hasMouseMovement = this.mouseHasMoved;
        
        if (this.textMesh && (hasMovement || hasMouseMovement || !this.renderRequested)) {
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.rotationDamping;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.rotationDamping;
            
            this.textMesh.rotation.x = this.currentRotation.x;
            this.textMesh.rotation.y = this.currentRotation.y;
            this.textMesh.rotation.z = 0;
            this.textMesh.scale.setScalar(this.currentScale * this.mobileBaseScale);
            
            // Update wireframe mesh to match
            this.wireframeTextMesh.rotation.copy(this.textMesh.rotation);
            this.wireframeTextMesh.scale.copy(this.textMesh.scale);
            
            this.render();
            this.renderRequested = true;
            
            // Reset mouse movement flag after rendering
            this.mouseHasMoved = false;
        }
        
        this.updateOverlay();
        this.updatePerformance();
    }
    
    /**
     * Mobile-optimized multi-pass rendering
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
                <h2>Mobile WebGL Error</h2>
                <p>Failed to initialize the 3D renderer on mobile.</p>
                <p style="color: #ff6b6b;">Error: ${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; background: #4a9eff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

/**
 * Initialize mobile portfolio when DOM is ready
 */
function initializeMobilePortfolio() {
    console.log('Starting Mobile Eva Qi Professional 3D Portfolio');
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Waiting for it...');
        // Wait a bit and try again
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                console.log('Three.js loaded, initializing mobile portfolio...');
                try {
                    new MobilePortfolio3DRenderer();
                } catch (error) {
                    console.error('Mobile initialization error:', error);
                }
            } else {
                console.error('Three.js failed to load for mobile');
            }
        }, 1000);
        return;
    }
    
    try {
        new MobilePortfolio3DRenderer();
    } catch (error) {
        console.error('Mobile initialization error:', error);
    }
}

// Initialize immediately if DOM is already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobilePortfolio);
} else {
    // DOM is already loaded, initialize immediately
    initializeMobilePortfolio();
}

/**
 * Mobile error handler
 */
window.addEventListener('error', (e) => {
    if (e.message !== 'Script error.') {
        console.error('Mobile error:', e.message, e.filename, e.lineno);
    }
});
