/**
 * DEVICE DETECTION & LOADING OPTIMIZATION
 * Eva Qi Portfolio - Smart Loading System
 * 
 * FEATURES:
 * - Detects mobile vs desktop
 * - Loads appropriate JavaScript version
 * - Preloads critical resources
 * - Optimizes loading performance
 */

class DeviceDetector {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.deviceType = this.getDeviceType();
        this.loadingStartTime = performance.now();
        
        console.log(`Device detected: ${this.deviceType}`);
        this.init();
    }
    
    /**
     * Detect if device is mobile
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
               window.innerWidth <= 768;
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
     * Initialize device-specific loading
     */
    init() {
        this.preloadCriticalResources();
        this.loadAppropriateScript();
        this.setupPerformanceMonitoring();
    }
    
    /**
     * Preload critical resources based on device type
     */
    preloadCriticalResources() {
        // Preload fonts
        this.preloadFont('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');
        
        // Preload Three.js (critical for both versions)
        this.preloadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        
        // Note: Font file is loaded asynchronously by Three.js, so preloading causes warnings
        
        if (this.deviceType === 'desktop') {
            // Desktop-specific preloads
            this.preloadStylesheet('src/css/intro-style.css');
            this.preloadStylesheet('src/css/main-style.css');
        } else {
            // Mobile-specific optimizations
            this.preloadStylesheet('src/css/intro-style.css');
            this.preloadStylesheet('src/css/main-style.css');
        }
    }
    
    /**
     * Preload a stylesheet
     */
    preloadStylesheet(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
            link.rel = 'stylesheet';
            console.log(`Preloaded stylesheet: ${href}`);
        };
        if (document.head) {
            document.head.appendChild(link);
        }
    }
    
    /**
     * Preload a font
     */
    preloadFont(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
            link.rel = 'stylesheet';
            console.log(`Preloaded font: ${href}`);
        };
        if (document.head) {
            document.head.appendChild(link);
        }
    }
    
    /**
     * Preload a script
     */
    preloadScript(src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = src;
        if (document.head) {
            document.head.appendChild(link);
        }
        
        // Also load it normally
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => console.log(`Preloaded script: ${src}`);
        if (document.head) {
            document.head.appendChild(script);
        }
    }
    
    /**
     * Preload a resource
     */
    preloadResource(url, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = url;
        if (document.head) {
            document.head.appendChild(link);
        }
    }
    
    /**
     * Load appropriate JavaScript based on device type
     */
    loadAppropriateScript() {
        // Wait for Three.js to load first
        this.waitForThreeJS().then(() => {
            const script = document.createElement('script');
            
            if (this.deviceType === 'mobile') {
                script.src = 'src/js/mobile-main.js';
                console.log('Loading mobile-optimized version');
            } else {
                script.src = 'src/js/main.js';
                console.log('Loading desktop-optimized version');
            }
            
            script.onload = () => {
                const loadingTime = performance.now() - this.loadingStartTime;
                console.log(`App loaded in ${loadingTime.toFixed(2)}ms`);
            };
            
            script.onerror = () => {
                console.error('Failed to load appropriate script, falling back to desktop version');
                // Fallback to desktop version
                const fallbackScript = document.createElement('script');
                fallbackScript.src = 'src/js/main.js';
                if (document.head) {
                    document.head.appendChild(fallbackScript);
                }
            };
            
            if (document.head) {
                document.head.appendChild(script);
            }
        });
    }
    
    /**
     * Wait for Three.js to be available
     */
    waitForThreeJS() {
        return new Promise((resolve) => {
            if (typeof THREE !== 'undefined') {
                resolve();
                return;
            }
            
            const checkThreeJS = () => {
                if (typeof THREE !== 'undefined') {
                    console.log('Three.js is now available');
                    resolve();
                } else {
                    setTimeout(checkThreeJS, 100);
                }
            };
            
            checkThreeJS();
        });
    }
    
    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor loading performance
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.loadingStartTime;
            console.log(`Total page load time: ${loadTime.toFixed(2)}ms`);
            
            // Send performance data to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'device_type': this.deviceType,
                    'load_time': Math.round(loadTime)
                });
            }
        });
        
        // Monitor memory usage (if available) - only in development
        if ('memory' in performance && window.location.hostname === 'localhost') {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected:', {
                        used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
                    });
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    /**
     * Get device capabilities
     */
    getDeviceCapabilities() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            deviceType: this.deviceType,
            hasTouch: 'ontouchstart' in window,
            hasWebGL: this.checkWebGLSupport(),
            hasWebGL2: this.checkWebGL2Support(),
            pixelRatio: window.devicePixelRatio,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            connectionType: this.getConnectionType()
        };
    }
    
    /**
     * Check WebGL support
     */
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Check WebGL2 support
     */
    checkWebGL2Support() {
        try {
            const canvas = document.createElement('canvas');
            return !!canvas.getContext('webgl2');
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Get connection type
     */
    getConnectionType() {
        if ('connection' in navigator) {
            return navigator.connection.effectiveType || 'unknown';
        }
        return 'unknown';
    }
}

/**
 * Initialize device detection when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.deviceDetector = new DeviceDetector();
    window.deviceCapabilities = window.deviceDetector.getDeviceCapabilities();
});

/**
 * Global error handler for device detection
 */
window.addEventListener('error', (e) => {
    if (e.message !== 'Script error.') {
        console.error('Device detection error:', e.message, e.filename, e.lineno);
    }
});
