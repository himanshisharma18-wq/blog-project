document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    
    // 1. Navigation: Smooth scroll within main page for elements
    const smoothScrollLinks = [
        { triggerId: 'navHome', targetId: 'homeSection' },
        { triggerId: 'navCategories', targetId: 'categoriesBlock' },
        { triggerId: 'heroBrowse', targetId: 'categoriesBlock' },
        { triggerId: 'navAbout', targetId: 'aboutSection' },
        { triggerId: 'scrollToSubscribe', targetId: 'newsletterBlock' }
    ];

    smoothScrollLinks.forEach(link => {
        const trigger = document.getElementById(link.triggerId);
        const target = document.getElementById(link.targetId);
        
        if (trigger && target) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight active state link
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                if (link.triggerId !== 'scrollToSubscribe' && link.triggerId !== 'heroBrowse') {
                    trigger.classList.add('active');
                }
            });
        }
    });

    // 2. Click redirection logic: Sends selection details forward to explorearticle.html page
    // Look for this block in script.js and update the window.location.href:
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const catKey = card.getAttribute('data-category');
        
        // Updated path to step inside your folder first:
        window.location.href = `/explorearticle/explorearticleindex.html?category=${catKey}`;
    });
});

    // Newsletter box logic
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('newsletterMsg').innerHTML = "<strong>Success!</strong> Welcome to our list.";
            newsletterForm.reset();
        });
    }
});














// === APPEND THIS SEARCH REDIRECT AT THE BOTTOM ===
    const mainSearchInput = document.getElementById('mainSearchInput');
    const mainSearchBtn = document.getElementById('mainSearchBtn');

    function executeMainSearch() {
        const query = mainSearchInput.value.toLowerCase().trim();
        if (query.length > 0) {
            window.location.href = `/explorearticle/explorearticleindex.html?search=${encodeURIComponent(query)}`;
        }
    }

    if (mainSearchBtn && mainSearchInput) {
        mainSearchBtn.addEventListener('click', executeMainSearch);
        mainSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeMainSearch();
        });
    }
    
// THIS CLOSING BRACKET SHOULD BE THE VERY LAST LINE OF YOUR FILE
