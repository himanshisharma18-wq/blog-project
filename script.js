document.addEventListener('DOMContentLoaded', () => {
    // --- DYNAMIC URL CONFIG ---
    // This automatically switches between localhost and your live Render URL
    const BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : "https://blog-project-86ee.onrender.com";

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
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const catKey = card.getAttribute('data-category');
            window.location.href = `/explorearticle/explorearticleindex.html?category=${catKey}`;
        });
    });

    // 3. Newsletter box logic
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('newsletterMsg').innerHTML = "<strong>Success!</strong> Welcome to our list.";
            newsletterForm.reset();
        });
    }

    // 4. Search Redirect
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

    // 5. Admin Password Verification Link
    const adminBtn = document.getElementById('adminLink');

    if (adminBtn) {
        adminBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const enteredPassword = prompt("Enter Admin Password:");

            if (!enteredPassword) return;

            try {
                // FIXED: Used `${BASE_URL}` here
                const response = await fetch(`${BASE_URL}/api/verify-admin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: enteredPassword })
                });

                // Check if backend returned valid JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Server returned HTML/non-JSON response with status ${response.status}`);
                }

                const data = await response.json();

                if (response.ok && data.success) {
                    // Normalize URL formatting
                    const route = data.adminUrl.startsWith('/') ? data.adminUrl : `/${data.adminUrl}`;
                    // FIXED: Used `${BASE_URL}` here for the redirect
                    window.location.href = `${BASE_URL}${route}`;
                } else {
                    alert(data.message || "Invalid Password!");
                }
            } catch (err) {
                console.error("Error verifying admin password:", err);
                alert("Could not connect to backend server or endpoint not found.");
            }
        });
    }
});