// Services Page Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize services filter
    initServicesFilter();
    initFAQAccordion();
});

// Services Filter Functionality
function initServicesFilter() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const serviceItems = document.querySelectorAll('.service-item');
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category
            const filterCategory = this.getAttribute('data-category');
            
            // Filter service items
            serviceItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterCategory === 'all' || filterCategory === itemCategory) {
                    // Show item
                    item.classList.remove('hidden');
                    
                    // Add animation delay based on index
                    const index = Array.from(serviceItems).indexOf(item);
                    item.style.transitionDelay = `${index * 0.1}s`;
                    
                    // Trigger animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    // Hide item
                    item.classList.add('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transitionDelay = '0s';
                }
            });
            
            // Smooth scroll to services section on mobile
            if (window.innerWidth < 768) {
                const servicesSection = document.querySelector('.services-grid-section');
                if (servicesSection) {
                    window.scrollTo({
                        top: servicesSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
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

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
        
        // Add keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Open first FAQ by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

// Add loading animation for service items
function animateServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const index = Array.from(serviceItems).indexOf(item);
                
                // Staggered animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(item);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    serviceItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    animateServiceItems();
    initServicesFilter();
    initFAQAccordion();
});