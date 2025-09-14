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
        this.camera = null;
        this.renderer = null;
        this.textMesh = null;
        
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
        this.fpsElement = document.getElementById('fps');
        this.overlayVisible = false;
        
        // Mobile controls
        this.mobileControls = document.getElementById('mobileControls');
        this.joystickContainer = document.getElementById('joystickContainer');
        this.joystickHandle = document.getElementById('joystickHandle');
        this.clickMeBtn = document.getElementById('clickMeBtn');
        this.joystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };
        this.joystickRadius = 40;
        
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
     * Setup simplified scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
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
        
        // Create outline effect for mobile
        const outlineGeometry = textGeometry.clone();
        outlineGeometry.scale(1.02, 1.02, 1.02);
        
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        });
        
        this.textMesh = new THREE.Mesh(textGeometry, material);
        this.scene.add(this.textMesh);
        
        // Create outline mesh for mobile
        this.wireframeTextMesh = new THREE.Mesh(outlineGeometry, wireframeMaterial);
        this.scene.add(this.wireframeTextMesh);
        
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
        
        // Create outline effect for mobile fallback
        const outlineGeometry = geometry.clone();
        outlineGeometry.scale(1.02, 1.02, 1.02);
        
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        });
        
        this.textMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.textMesh);
        
        // Create outline mesh for mobile fallback
        this.wireframeTextMesh = new THREE.Mesh(outlineGeometry, wireframeMaterial);
        this.scene.add(this.wireframeTextMesh);
        
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
     * Setup event listeners for mobile
     */
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Touch events for mobile zoom (pinch)
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
    
    /**
     * Update overlay visibility for mobile
     */
    updateOverlay() {
        const shouldShowOverlay = this.currentScale >= this.zoomThreshold;
        
        if (shouldShowOverlay && !this.overlayVisible) {
            this.overlay.classList.add('active');
            this.fpsElement.style.opacity = '0.3';
            this.overlayVisible = true;
            this.hasSeenIntro = true;
            
            setTimeout(() => {
                this.startRoleTyping();
            }, 800);
            
            console.log('Mobile introduction revealed');
        } else if (!shouldShowOverlay && this.overlayVisible) {
            this.overlay.classList.remove('active');
            this.fpsElement.style.opacity = '0.7';
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
        
        if (this.textMesh && (hasMovement || !this.renderRequested)) {
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.rotationDamping;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.rotationDamping;
            
            this.textMesh.rotation.x = this.currentRotation.x;
            this.textMesh.rotation.y = this.currentRotation.y;
            this.textMesh.rotation.z = 0;
            this.textMesh.scale.setScalar(this.currentScale * this.mobileBaseScale);
            
            // Update wireframe mesh to match
            this.wireframeTextMesh.rotation.copy(this.textMesh.rotation);
            this.wireframeTextMesh.scale.copy(this.textMesh.scale);
            
            this.renderer.render(this.scene, this.camera);
            this.renderRequested = true;
        }
        
        this.updateOverlay();
        this.updatePerformance();
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('Starting Mobile Eva Qi Professional 3D Portfolio');
    try {
        new MobilePortfolio3DRenderer();
    } catch (error) {
        console.error('Mobile initialization error:', error);
    }
});

/**
 * Mobile error handler
 */
window.addEventListener('error', (e) => {
    if (e.message !== 'Script error.') {
        console.error('Mobile error:', e.message, e.filename, e.lineno);
    }
});
