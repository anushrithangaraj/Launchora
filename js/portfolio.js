// Portfolio Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all portfolio functionality
    initPortfolioFilter();
    initImageZoom();
    initPortfolioAnimations();
    initMobileMenu();
    makeFiltersScrollable();
});

// Portfolio Filter Functionality
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterButtons.length || !portfolioItems.length) return;
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category
            const filterCategory = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterCategory === 'all' || filterCategory === itemCategory) {
                    // Show item with animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.display = 'block';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    // Hide item with animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Smooth scroll to portfolio section on mobile
            if (window.innerWidth < 768) {
                const portfolioSection = document.querySelector('.portfolio-grid-section');
                if (portfolioSection) {
                    setTimeout(() => {
                        portfolioSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            }
        });
    });
    
    // Add keyboard navigation for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Image Zoom Functionality with Real Images
function initImageZoom() {
    const modal = document.querySelector('.image-zoom-modal');
    const zoomClose = document.querySelector('.zoom-close');
    const zoomOverlay = document.querySelector('.zoom-overlay');
    const zoomedImage = document.querySelector('.zoomed-image');
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    
    if (!modal || !zoomedImage) return;
    
    // Open zoom when portfolio image is clicked
    portfolioImages.forEach(image => {
        image.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get the image source from data-zoom-src or the src attribute
            const img = this.querySelector('.portfolio-img');
            if (!img) return;
            
            const zoomSrc = img.getAttribute('data-zoom-src') || img.src;
            const altText = img.alt || 'Portfolio Image';
            
            // Show loading state
            zoomedImage.style.opacity = '0';
            
            // Preload the image
            const preloadImage = new Image();
            preloadImage.onload = function() {
                // Set the zoomed image source
                zoomedImage.src = zoomSrc;
                zoomedImage.alt = `Zoomed view of ${altText}`;
                
                // Fade in the image
                setTimeout(() => {
                    zoomedImage.style.opacity = '1';
                    zoomedImage.style.transition = 'opacity 0.3s ease';
                }, 100);
                
                // Open modal
                openZoomModal();
            };
            
            preloadImage.onerror = function() {
                // If high-res image fails, use regular image
                zoomedImage.src = img.src;
                zoomedImage.alt = `Zoomed view of ${altText}`;
                zoomedImage.style.opacity = '1';
                openZoomModal();
            };
            
            preloadImage.src = zoomSrc;
        });
        
        // Make images keyboard accessible
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', 'Click to zoom image');
        
        image.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = this.querySelector('.portfolio-img');
                const zoomSrc = img.getAttribute('data-zoom-src') || img.src;
                const altText = img.alt || 'Portfolio Image';
                
                zoomedImage.src = zoomSrc;
                zoomedImage.alt = `Zoomed view of ${altText}`;
                openZoomModal();
            }
        });
    });

    // Close modal functionality
    function closeZoomModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
        
        // Reset zoom and pan
        if (zoomedImage) {
            zoomedImage.style.transform = 'scale(1) translate(0, 0)';
            zoomedImage.style.transition = '';
        }
        
        // Clear touch state
        touchState = {
            isTouching: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            scale: 1,
            isScaling: false
        };
        
        // Reset image after closing
        setTimeout(() => {
            if (zoomedImage) zoomedImage.src = '';
        }, 300);
    }

    if (zoomClose) zoomClose.addEventListener('click', closeZoomModal);
    if (zoomOverlay) zoomOverlay.addEventListener('click', closeZoomModal);

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeZoomModal();
        }
    });

    // Prevent modal from closing when clicking inside zoom container
    const zoomContainer = document.querySelector('.zoom-container');
    if (zoomContainer) {
        zoomContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Touch and mouse zoom functionality
    let touchState = {
        isTouching: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        scale: 1,
        isScaling: false,
        lastTouchDistance: 0
    };

    // Mouse wheel zoom for desktop
    if (zoomedImage) {
        zoomedImage.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const rect = this.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const delta = e.deltaY < 0 ? 1.1 : 0.9;
            const newScale = Math.min(Math.max(touchState.scale * delta, 1), 4);
            
            // Calculate the translation needed to keep the mouse point under cursor
            const scaleChange = newScale / touchState.scale;
            const translateX = touchState.currentX * scaleChange - touchState.currentX + (mouseX - rect.width / 2) * (scaleChange - 1);
            const translateY = touchState.currentY * scaleChange - touchState.currentY + (mouseY - rect.height / 2) * (scaleChange - 1);
            
            touchState.scale = newScale;
            touchState.currentX += translateX;
            touchState.currentY += translateY;
            
            this.style.transform = `scale(${touchState.scale}) translate(${touchState.currentX}px, ${touchState.currentY}px)`;
            this.style.transition = 'transform 0.1s ease';
        });

        // Mouse drag for panning
        let isDragging = false;
        let startDragX = 0;
        let startDragY = 0;

        zoomedImage.addEventListener('mousedown', function(e) {
            if (touchState.scale > 1) {
                isDragging = true;
                startDragX = e.clientX - touchState.currentX;
                startDragY = e.clientY - touchState.currentY;
                this.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging && zoomedImage) {
                touchState.currentX = e.clientX - startDragX;
                touchState.currentY = e.clientY - startDragY;
                
                // Apply boundaries to prevent dragging too far
                const maxDrag = 100 * touchState.scale;
                touchState.currentX = Math.min(Math.max(touchState.currentX, -maxDrag), maxDrag);
                touchState.currentY = Math.min(Math.max(touchState.currentY, -maxDrag), maxDrag);
                
                zoomedImage.style.transform = `scale(${touchState.scale}) translate(${touchState.currentX}px, ${touchState.currentY}px)`;
                zoomedImage.style.transition = 'none';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            if (zoomedImage) zoomedImage.style.cursor = touchState.scale > 1 ? 'grab' : 'default';
        });

        // Touch events for mobile
        zoomedImage.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                touchState.isTouching = true;
                touchState.startX = e.touches[0].clientX - touchState.currentX;
                touchState.startY = e.touches[0].clientY - touchState.currentY;
                touchState.isScaling = false;
            } else if (e.touches.length === 2) {
                touchState.isScaling = true;
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                touchState.lastTouchDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
            }
        });

        zoomedImage.addEventListener('touchmove', function(e) {
            e.preventDefault();
            
            if (touchState.isScaling && e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                const scaleChange = currentDistance / touchState.lastTouchDistance;
                const newScale = Math.min(Math.max(touchState.scale * scaleChange, 1), 4);
                
                // Calculate center point for scaling
                const centerX = (touch1.clientX + touch2.clientX) / 2;
                const centerY = (touch1.clientY + touch2.clientY) / 2;
                const rect = this.getBoundingClientRect();
                const localX = centerX - rect.left;
                const localY = centerY - rect.top;
                
                const scaleDelta = newScale / touchState.scale;
                const translateX = touchState.currentX * scaleDelta - touchState.currentX + (localX - rect.width / 2) * (scaleDelta - 1);
                const translateY = touchState.currentY * scaleDelta - touchState.currentY + (localY - rect.height / 2) * (scaleDelta - 1);
                
                touchState.scale = newScale;
                touchState.currentX += translateX;
                touchState.currentY += translateY;
                touchState.lastTouchDistance = currentDistance;
                
                this.style.transform = `scale(${touchState.scale}) translate(${touchState.currentX}px, ${touchState.currentY}px)`;
                this.style.transition = 'none';
            } else if (touchState.isTouching && e.touches.length === 1 && touchState.scale > 1) {
                touchState.currentX = e.touches[0].clientX - touchState.startX;
                touchState.currentY = e.touches[0].clientY - touchState.startY;
                
                // Apply boundaries
                const maxDrag = 100 * touchState.scale;
                touchState.currentX = Math.min(Math.max(touchState.currentX, -maxDrag), maxDrag);
                touchState.currentY = Math.min(Math.max(touchState.currentY, -maxDrag), maxDrag);
                
                this.style.transform = `scale(${touchState.scale}) translate(${touchState.currentX}px, ${touchState.currentY}px)`;
                this.style.transition = 'none';
            }
        });

        zoomedImage.addEventListener('touchend', function(e) {
            touchState.isTouching = false;
            touchState.isScaling = false;
            
            // Handle double tap to reset
            const now = Date.now();
            if (now - (touchState.lastTouchEnd || 0) < 300) {
                // Double tap detected - reset zoom and pan
                touchState.scale = 1;
                touchState.currentX = 0;
                touchState.currentY = 0;
                this.style.transform = 'scale(1) translate(0, 0)';
                this.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    this.style.transition = '';
                }, 300);
            }
            touchState.lastTouchEnd = now;
        });

        // Reset cursor based on zoom level
        zoomedImage.addEventListener('transitionend', function() {
            this.style.cursor = touchState.scale > 1 ? 'grab' : 'default';
        });
    }

    // Open zoom modal
    function openZoomModal() {
        if (!modal) return;
        
        // Prevent body scroll
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = scrollbarWidth + 'px';
        
        modal.classList.add('active');
        
        // Reset zoom state
        touchState = {
            isTouching: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            scale: 1,
            isScaling: false,
            lastTouchDistance: 0
        };
        
        // Focus close button for accessibility
        setTimeout(() => {
            if (zoomClose) zoomClose.focus();
        }, 100);
    }
}

// Portfolio animations
function initPortfolioAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!portfolioItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const delay = item.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, parseInt(delay));
                
                observer.unobserve(item);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-right') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking a link
    const navLinksItems = document.querySelectorAll('.nav-link');
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// Make filter buttons scrollable on mobile
function makeFiltersScrollable() {
    const filterNav = document.querySelector('.portfolio-filter-nav');
    if (filterNav && window.innerWidth < 768) {
        filterNav.style.overflowX = 'auto';
        filterNav.style.whiteSpace = 'nowrap';
        filterNav.style.paddingBottom = '10px';
        filterNav.style.webkitOverflowScrolling = 'touch';
        
        // Hide scrollbar but keep functionality
        filterNav.style.scrollbarWidth = 'none';
        
        // Add scroll indicator
        filterNav.addEventListener('scroll', function() {
            const maxScroll = this.scrollWidth - this.clientWidth;
            if (this.scrollLeft > 0 && this.scrollLeft < maxScroll) {
                this.style.boxShadow = 'inset 4px 0 8px -4px rgba(0,0,0,0.1), inset -4px 0 8px -4px rgba(0,0,0,0.1)';
            } else {
                this.style.boxShadow = 'none';
            }
        });
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    makeFiltersScrollable();
});

// Preload images for better performance
function preloadPortfolioImages() {
    const images = document.querySelectorAll('.portfolio-img[data-zoom-src]');
    images.forEach(img => {
        const preload = new Image();
        preload.src = img.getAttribute('data-zoom-src');
    });
}

// Initialize image preloading
setTimeout(preloadPortfolioImages, 1000);