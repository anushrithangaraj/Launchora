// Enhanced smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Select all links with hashes
    const links = document.querySelectorAll('a[href*="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            // Skip if it's an external link or doesn't have a hash
            if (
                this.hostname !== window.location.hostname ||
                this.pathname !== window.location.pathname ||
                !this.hash
            ) {
                return;
            }
            
            event.preventDefault();
            
            const targetId = this.hash;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate position
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.getBoundingClientRect().top + startPosition - 80;
                const distance = targetPosition - startPosition;
                const duration = 800;
                let start = null;
                
                // Animation function
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function (easeInOutCubic)
                    const easing = percentage < 0.5 
                        ? 4 * percentage * percentage * percentage 
                        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
                    
                    window.scrollTo(0, startPosition + distance * easing);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        });
    });
});