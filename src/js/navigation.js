/**
 * NAVIGATION SYSTEM
 * Eva Qi Portfolio - Interactive Navigation
 * 
 * FEATURES:
 * - Navbar scroll effects
 * - Mobile hamburger menu
 * - Sidebar navigation
 * - Smooth scrolling
 * - Active link management
 */

class NavigationSystem {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.mobileSidebar = document.getElementById('mobile-sidebar');
        this.closeSidebar = document.getElementById('close-sidebar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sidebarLinks = document.querySelectorAll('.sidebar-link');
        
        this.isSidebarOpen = false;
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    /**
     * Initialize navigation system
     */
    init() {
        // Only initialize if navbar exists (not on index page)
        if (!this.navbar) {
            console.log('No navbar found, skipping navigation initialization');
            return;
        }
        
        this.setupScrollEffects();
        this.setupHamburgerMenu();
        this.setupSidebar();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
        
        console.log('Navigation system initialized');
    }
    
    /**
     * Setup navbar scroll effects
     */
    setupScrollEffects() {
        let ticking = false;
        
        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            this.lastScrollY = currentScrollY;
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    /**
     * Setup hamburger menu functionality
     */
    setupHamburgerMenu() {
        if (!this.hamburger || !this.mobileSidebar) {
            return;
        }
        
        this.hamburger.addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isSidebarOpen && 
                !this.mobileSidebar.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.closeSidebarMenu();
            }
        });
    }
    
    /**
     * Setup mobile sidebar
     */
    setupSidebar() {
        if (!this.mobileSidebar || !this.closeSidebar) {
            return;
        }
        
        this.closeSidebar.addEventListener('click', () => {
            this.closeSidebarMenu();
        });
        
        // Handle sidebar link clicks
        this.sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLinkClick(link);
                this.closeSidebarMenu();
            });
        });
    }
    
    /**
     * Toggle sidebar menu
     */
    toggleSidebar() {
        if (this.isSidebarOpen) {
            this.closeSidebarMenu();
        } else {
            this.openSidebarMenu();
        }
    }
    
    /**
     * Open sidebar menu
     */
    openSidebarMenu() {
        if (!this.mobileSidebar || !this.hamburger) {
            return;
        }
        
        this.mobileSidebar.classList.add('active');
        this.hamburger.classList.add('active');
        this.isSidebarOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation to links
        this.sidebarLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
            link.classList.add('animate-in');
        });
    }
    
    /**
     * Close sidebar menu
     */
    closeSidebarMenu() {
        if (!this.mobileSidebar || !this.hamburger) {
            return;
        }
        
        this.mobileSidebar.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.isSidebarOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove animation classes
        this.sidebarLinks.forEach(link => {
            link.classList.remove('animate-in');
        });
    }
    
    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        // Handle nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    /**
     * Scroll to section smoothly
     */
    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for navbar height
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Setup active link management
     */
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveLink = () => {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.setActiveLink(sectionId);
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }
    
    /**
     * Set active link
     */
    setActiveLink(sectionId) {
        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Update sidebar links
        this.sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Handle link click
     */
    handleLinkClick(link) {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
            this.scrollToSection(href);
        } else if (href.startsWith('./') || href.startsWith('/')) {
            // Navigate to other pages
            window.location.href = href;
        }
    }
    
    /**
     * Get current page
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().split('.')[0];
        return page || 'home';
    }
    
    /**
     * Update navigation for current page
     */
    updateForCurrentPage() {
        const currentPage = this.getCurrentPage();
        
        // Update active states based on current page
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href').replace('./', '').replace('.html', '');
            if (linkPage === currentPage || (currentPage === 'index' && linkPage === 'home')) {
                link.classList.add('active');
            }
        });
        
        this.sidebarLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href').replace('./', '').replace('.html', '');
            if (linkPage === currentPage || (currentPage === 'index' && linkPage === 'home')) {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Initialize navigation when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.navigationSystem = new NavigationSystem();
    window.navigationSystem.updateForCurrentPage();
});

/**
 * Navigation error handler
 */
window.addEventListener('error', (e) => {
    if (e.message !== 'Script error.') {
        console.error('Navigation error:', e.message, e.filename, e.lineno);
    }
});
