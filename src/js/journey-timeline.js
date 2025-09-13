/**
 * 3D JOURNEY TIMELINE
 * Evanolott Portfolio - Interactive 3D Timeline Experience
 * 
 * FEATURES:
 * - WebGL 3D background effects
 * - Interleaving timeline cards
 * - Smooth scroll animations
 * - Auto-loading timeline progression
 * - Interactive card interactions
 * - Mobile-responsive design
 */

class JourneyTimeline {
    constructor() {
        this.timeline = document.getElementById('timeline');
        this.timelineProgress = document.getElementById('timeline-progress');
        this.journeyIntro = document.getElementById('journey-intro');
        
        // Timeline data
        this.timelineData = [
            {
                year: '2014',
                title: 'Digital Art & Creative Beginnings',
                description: 'Started my journey in digital art and creative technology, exploring 3D modeling and interactive media. Founded my first creative agency focusing on visual storytelling.',
                tags: ['Digital Art', '3D Modeling', 'Creative Agency', 'Visual Design'],
                side: 'left',
                position: 0.1
            },
            {
                year: '2016',
                title: 'Educational Technology Innovation',
                description: 'Transitioned into educational technology, developing interactive learning platforms and mentoring students in computer science and mathematics.',
                tags: ['EdTech', 'Learning Platforms', 'Mentoring', 'Education'],
                side: 'right',
                position: 0.2
            },
            {
                year: '2018',
                title: 'Quantitative Research & Financial Modeling',
                description: 'Specialized in quantitative research and financial modeling, analyzing market trends and developing statistical models for emerging technologies.',
                tags: ['Quantitative Research', 'Financial Modeling', 'Data Analysis', 'Statistics'],
                side: 'left',
                position: 0.3
            },
            {
                year: '2020',
                title: 'Full-Stack Development & 3D Web Experiences',
                description: 'Led development of innovative web applications while conducting quantitative research. Created immersive 3D web experiences and interactive portfolios.',
                tags: ['Full-Stack', '3D Web', 'WebGL', 'Interactive Design'],
                side: 'right',
                position: '0.4'
            },
            {
                year: '2022',
                title: 'Wine Studies & Sensory Analysis',
                description: 'Pursued advanced studies in wine and sensory analysis, becoming a certified wine connoisseur and developing expertise in the wine industry.',
                tags: ['Wine Studies', 'Sensory Analysis', 'Certification', 'Industry Expertise'],
                side: 'left',
                position: 0.5
            },
            {
                year: '2024',
                title: 'Entrepreneurship & Innovation Leadership',
                description: 'Currently leading innovative projects that combine technology, research, and creative solutions. Building the future of interactive digital experiences.',
                tags: ['Entrepreneurship', 'Innovation', 'Leadership', 'Future Tech'],
                side: 'right',
                position: 0.6
            }
        ];
        
        // 3D Scene components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.clock = new THREE.Clock();
        
        // Animation state
        this.isAnimating = false;
        this.currentCardIndex = 0;
        this.scrollProgress = 0;
        this.lastScrollY = 0;
        
        this.init();
    }
    
    /**
     * Initialize the timeline
     */
    init() {
        this.setup3DScene();
        this.createTimelineCards();
        this.setupScrollListener();
        this.setupResizeListener();
        this.animate();
        
        console.log('3D Journey Timeline initialized');
    }
    
    /**
     * Setup 3D WebGL scene
     */
    setup3DScene() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // Add renderer to timeline
        this.timeline.appendChild(this.renderer.domElement);
        
        // Create particle system
        this.createParticleSystem();
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
    }
    
    /**
     * Create particle system for background effects
     */
    createParticleSystem() {
        const particleCount = 200;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Random colors (pink to blue gradient)
            const color = new THREE.Color();
            color.setHSL(0.8 + Math.random() * 0.2, 0.7, 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particles);
    }
    
    /**
     * Create timeline cards
     */
    createTimelineCards() {
        this.timelineData.forEach((data, index) => {
            const card = this.createTimelineCard(data, index);
            this.timeline.appendChild(card);
        });
    }
    
    /**
     * Create individual timeline card
     */
    createTimelineCard(data, index) {
        const card = document.createElement('div');
        card.className = `timeline-card ${data.side}`;
        card.style.top = `${data.position * 100}vh`;
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'timeline-dot';
        dot.style.top = `${data.position * 100}vh`;
        this.timeline.appendChild(dot);
        
        // Card content
        card.innerHTML = `
            <div class="card-year">${data.year}</div>
            <div class="card-title">${data.title}</div>
            <div class="card-description">${data.description}</div>
            <div class="card-tags">
                ${data.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
            </div>
        `;
        
        // Add click handler
        card.addEventListener('click', () => {
            this.handleCardClick(data, index);
        });
        
        return card;
    }
    
    /**
     * Handle card click
     */
    handleCardClick(data, index) {
        console.log('Card clicked:', data.title);
        
        // Add visual feedback
        const card = document.querySelectorAll('.timeline-card')[index];
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // You can add more interactive features here
        // For example, open a modal, navigate to a detailed page, etc.
    }
    
    /**
     * Setup scroll listener
     */
    setupScrollListener() {
        let ticking = false;
        
        const updateTimeline = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Calculate scroll progress
            this.scrollProgress = scrollY / (documentHeight - windowHeight);
            
            // Update timeline progress
            this.timelineProgress.style.height = `${this.scrollProgress * 100}%`;
            
            // Update cards visibility
            this.updateCardsVisibility();
            
            // Update 3D scene
            this.update3DScene();
            
            // Hide intro when scrolling starts
            if (scrollY > 100) {
                this.journeyIntro.style.opacity = '0';
                this.journeyIntro.style.transform = 'translate(-50%, -50%) scale(0.9)';
            } else {
                this.journeyIntro.style.opacity = '1';
                this.journeyIntro.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateTimeline);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    /**
     * Update cards visibility based on scroll
     */
    updateCardsVisibility() {
        const cards = document.querySelectorAll('.timeline-card');
        const dots = document.querySelectorAll('.timeline-dot');
        
        cards.forEach((card, index) => {
            const cardTop = parseFloat(card.style.top);
            const cardProgress = cardTop / 100;
            
            // Show card when it comes into view
            if (this.scrollProgress >= cardProgress - 0.1) {
                card.classList.add('visible');
                dots[index].classList.add('active');
            } else {
                card.classList.remove('visible');
                dots[index].classList.remove('active');
            }
        });
    }
    
    /**
     * Update 3D scene based on scroll
     */
    update3DScene() {
        if (this.particles) {
            // Rotate particles based on scroll
            this.particles.rotation.y = this.scrollProgress * Math.PI * 2;
            this.particles.rotation.x = this.scrollProgress * Math.PI;
            
            // Update particle positions
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(this.clock.getElapsedTime() + i) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    /**
     * Setup resize listener
     */
    setupResizeListener() {
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.particles) {
            // Animate particles
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += 0.0005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Add new timeline entry dynamically
     */
    addTimelineEntry(data) {
        data.position = this.timelineData.length * 0.1 + 0.1;
        data.side = this.timelineData.length % 2 === 0 ? 'left' : 'right';
        
        this.timelineData.push(data);
        
        const card = this.createTimelineCard(data, this.timelineData.length - 1);
        this.timeline.appendChild(card);
    }
    
    /**
     * Get timeline statistics
     */
    getTimelineStats() {
        return {
            totalEntries: this.timelineData.length,
            currentProgress: this.scrollProgress,
            visibleCards: document.querySelectorAll('.timeline-card.visible').length
        };
    }
}

/**
 * Initialize timeline when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.journeyTimeline = new JourneyTimeline();
});

/**
 * Timeline error handler
 */
window.addEventListener('error', (e) => {
    if (e.message !== 'Script error.') {
        console.error('Timeline error:', e.message, e.filename, e.lineno);
    }
});
