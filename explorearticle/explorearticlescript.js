let ALL_ARTICLES = []; // Starts empty, will be filled by the backend

// Strictly limit view state to 3 items per page
const ITEMS_PER_PAGE = 3;
let currentPage = 1;
let selectedCategory = "all";
let searchString = "";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Read URL Query Parameters at initialization for deep-linking search searches
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam) {
        searchString = decodeURIComponent(searchParam).toLowerCase().trim();
        const searchInput = document.getElementById("articleSearch");
        if (searchInput) searchInput.value = searchString;
        currentPage = 1;
    }

    // 2. Fetch live data from your running backend server API
    try {
        const response = await fetch('http://localhost:5000/api/articles');
        ALL_ARTICLES = await response.json();
    } catch (error) {
        console.error("Failed to load articles from backend:", error);
        const grid = document.getElementById("mainArticlesGrid");
        if (grid) {
            grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: #ef4444; padding: 40px 0;">Error connecting to live server.</div>`;
        }
        return; // Stops execution if backend is offline
    }

    const grid = document.getElementById("mainArticlesGrid");
    const pagination = document.getElementById("paginationEngine");
    const searchInput = document.getElementById("articleSearch");
    const categoryDropdown = document.getElementById("catDropdown");
    const sidebarItems = document.querySelectorAll(".category-list li");

    // Master Display Logic
    function displayPage() {
        let matched = ALL_ARTICLES.filter(item => {
            const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchString) || item.desc.toLowerCase().includes(searchString);
            return matchesCategory && matchesSearch;
        });

        const totalItems = matched.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
        
        if (currentPage > totalPages) currentPage = totalPages;
        
        const startOffset = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageSlice = matched.slice(startOffset, startOffset + ITEMS_PER_PAGE);

        if (pageSlice.length === 0) {
            grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--text-light-muted); padding: 40px 0;">No matching results found.</div>`;
        } else {
            grid.innerHTML = pageSlice.map(art => `
                <article class="article-card">
                    <!-- Professional Single-View Wrapper Link -->
                    <a href="article.html?id=${art._id}" class="article-detail-link" style="text-decoration: none; color: inherit; display: block; height: 100%;">
                        <div class="article-img-wrap">
                            <span class="featured-badge">FEATURED</span>
                            <img src="${art.image || art.img || 'https://picsum.photos/400/250'}" alt="${art.title}">
                        </div>
                        <div class="article-body">
                            <span class="article-cat">${art.category || art.catLabel || 'General'}</span>
                            <h3>${art.title}</h3>
                            <!-- Truncating text smoothly on list cards for a unified interface grid -->
                            <p>${art.desc.length > 120 ? art.desc.substring(0, 120) + '...' : art.desc}</p>
                            
                            <div class="article-footer" onclick="event.preventDefault();">
                                <div class="author-info">
                                    <img src="https://i.pravatar.cc/100?img=32" alt="Himanshi" class="author-avatar">
                                    <div>
                                        <span class="author-name">Himanshi</span>
                                        <span class="article-date">${art.date || 'Recent'}</span>
                                    </div>
                                </div>
                                <button class="bookmark-btn"><i class="fa-regular fa-bookmark"></i></button>
                            </div>
                        </div>
                    </a>
                </article>
            `).join('');
        }

        buildPaginationControls(totalPages);
    }

    // Interactive Pagination Links Engine
    function buildPaginationControls(totalPages) {
        let controlsHtml = `<div class="page-nav" id="prevPage"><i class="fa-solid fa-chevron-left"></i></div>`;
        
        for (let i = 1; i <= totalPages; i++) {
            controlsHtml += `<div class="page-num ${i === currentPage ? 'active-page' : ''}" data-target="${i}">${i}</div>`;
        }
        
        controlsHtml += `<div class="page-nav" id="nextPage"><i class="fa-solid fa-chevron-right"></i></div>`;
        pagination.innerHTML = controlsHtml;

        document.querySelectorAll(".page-num").forEach(numBtn => {
            numBtn.addEventListener("click", () => {
                currentPage = parseInt(numBtn.getAttribute("data-target"));
                displayPage();
                window.scrollTo({ top: 250, behavior: 'smooth' });
            });
        });

        document.getElementById("prevPage").addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage();
            }
        });

        document.getElementById("nextPage").addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayPage();
            }
        });
    }

    // Real-time Search Handler
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchString = e.target.value.toLowerCase().trim();
            currentPage = 1;
            displayPage();
        });
    }

    // Unified Sidebar & Dropdown Filter Links
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebarItems.forEach(i => i.classList.remove("active-cat"));
            item.classList.add("active-cat");
            selectedCategory = item.getAttribute("data-cat");
            if (categoryDropdown) categoryDropdown.value = selectedCategory;
            currentPage = 1;
            displayPage();
        });
    });

    if (categoryDropdown) {
        categoryDropdown.addEventListener("change", (e) => {
            selectedCategory = e.target.value;
            sidebarItems.forEach(i => {
                if(i.getAttribute("data-cat") === selectedCategory) i.classList.add("active-cat");
                else i.classList.remove("active-cat");
            });
            currentPage = 1;
            displayPage();
        });
    }

    // Bookmark Toggle Click Action
    grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".bookmark-btn");
        if(btn) {
            const icon = btn.querySelector("i");
            icon.classList.toggle("fa-regular");
            icon.classList.toggle("fa-solid");
            icon.style.color = icon.classList.contains("fa-solid") ? "#6366f1" : "";
        }
    });

    // Fire default view logic
    displayPage();
});


grid.innerHTML = pageSlice.map(art => `
    <article class="article-card">
        <a href="article.html?id=${art._id}" style="text-decoration: none; color: inherit; display: block;">
            <div class="article-img-wrap">
                <span class="featured-badge">FEATURED</span>
                <img src="${art.image || art.img || 'https://picsum.photos/400/250'}" alt="${art.title}">
            </div>
            <div class="article-body">
                <span class="article-cat">${art.category || art.catLabel || 'General'}</span>
                <h3>${art.title}</h3>
                <p>${art.desc.length > 120 ? art.desc.substring(0, 120) + '...' : art.desc}</p>
                
                <div class="article-footer" onclick="event.preventDefault();">
                    <div class="author-info">
                        <img src="https://i.pravatar.cc/100?img=32" alt="Himanshi" class="author-avatar">
                        <div>
                            <span class="author-name">Himanshi</span>
                            <span class="article-date">${art.date || 'Recent'}</span>
                        </div>
                    </div>
                    <button class="bookmark-btn"><i class="fa-regular fa-bookmark"></i></button>
                </div>
            </div>
        </a>
    </article>
`).join('');



























































// const ALL_ARTICLES = [
//     { id: "a1", category: "laptops", catLabel: "Laptops & PC", title: "Best Laptops for CSE Students Under ₹60,000 (2026)", desc: "Top 7 laptops with great performance, battery life and value for coding students.", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80", date: "May 18, 2026" },
//     { id: "a2", category: "gear", catLabel: "Coding Gear", title: "Top 10 Mechanical Keyboards for Programmers", desc: "Improve your coding experience with these keyboards loved by developers.", img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80", date: "May 15, 2026" },
//     { id: "a3", category: "ai", catLabel: "AI Tools", title: "15 Best AI Tools Every Student Should Try in 2026", desc: "Boost productivity, study smart and save time with these amazing AI tools.", img: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=500&q=80", date: "May 10, 2026" },
//     { id: "a4", category: "programming", catLabel: "Programming", title: "Roadmap to Become a Full Stack Developer in 2026", desc: "Step-by-step roadmap with resources to become a job-ready developer.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80", date: "May 8, 2026" },
//     { id: "a5", category: "resources", catLabel: "Study Resources", title: "Top 10 Free Websites Every Student Should Bookmark", desc: "Best websites that help you learn, practice and grow every single day.", img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=500&q=80", date: "May 5, 2026" },
//     { id: "a6", category: "career", catLabel: "Career Guide", title: "How to Get an Internship in 2026 (Complete Guide)", desc: "From resume to interview, everything you need to know to land an internship.", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=500&q=80", date: "May 3, 2026" }
// ];

// const ITEMS_PER_PAGE = 3;
// let currentPage = 1;
// let selectedCategory = "all";
// let searchString = "";

// document.addEventListener("DOMContentLoaded", () => {
//     const grid = document.getElementById("mainArticlesGrid");
//     const pagination = document.getElementById("paginationEngine");
//     const searchInput = document.getElementById("articleSearch");
//     const categoryDropdown = document.getElementById("catDropdown");
//     const sidebarItems = document.querySelectorAll(".category-list li");

//     // NEW: Check if redirected from Main Page category clicks via URL params
//     const urlParams = new URLSearchParams(window.location.search);
//     const categoryParam = urlParams.get('category');
//     if (categoryParam) {
//         selectedCategory = categoryParam;
//         if(categoryDropdown) categoryDropdown.value = categoryParam;
        
//         // Sync Active UI elements
//         sidebarItems.forEach(i => {
//             if(i.getAttribute("data-cat") === categoryParam) i.classList.add("active-cat");
//             else i.classList.remove("active-cat");
//         });
//     }

//     function displayPage() {
//         let matched = ALL_ARTICLES.filter(item => {
//             const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
//             const matchesSearch = item.title.toLowerCase().includes(searchString) || item.desc.toLowerCase().includes(searchString);
//             return matchesCategory && matchesSearch;
//         });

//         const totalItems = matched.length;
//         const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
//         if (currentPage > totalPages) currentPage = totalPages;
        
//         const startOffset = (currentPage - 1) * ITEMS_PER_PAGE;
//         const pageSlice = matched.slice(startOffset, startOffset + ITEMS_PER_PAGE);

//         if (pageSlice.length === 0) {
//             grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--text-light-muted); padding: 40px 0;">No matching results found.</div>`;
//         } else {
//             grid.innerHTML = pageSlice.map(art => `
//                 <article class="article-card">
//                     <div class="article-img-wrap">
//                         <span class="featured-badge">FEATURED</span>
//                         <img src="${art.img}" alt="${art.title}">
//                     </div>
//                     <div class="article-body">
//                         <span class="article-cat">${art.catLabel}</span>
//                         <h3>${art.title}</h3>
//                         <p>${art.desc}</p>
//                         <div class="article-footer">
//                             <div class="author-info">
//                                 <img src="https://i.pravatar.cc/100?img=32" alt="Himanshi" class="author-avatar">
//                                 <div>
//                                     <span class="author-name">Himanshi</span>
//                                     <span class="article-date">${art.date}</span>
//                                 </div>
//                             </div>
//                             <button class="bookmark-btn"><i class="fa-regular fa-bookmark"></i></button>
//                         </div>
//                     </div>
//                 </article>
//             `).join('');
//         }
//         buildPaginationControls(totalPages);
//     }

//     function buildPaginationControls(totalPages) {
//         let controlsHtml = `<div class="page-nav" id="prevPage"><i class="fa-solid fa-chevron-left"></i></div>`;
//         for (let i = 1; i <= totalPages; i++) {
//             controlsHtml += `<div class="page-num ${i === currentPage ? 'active-page' : ''}" data-target="${i}">${i}</div>`;
//         }
//         controlsHtml += `<div class="page-nav" id="nextPage"><i class="fa-solid fa-chevron-right"></i></div>`;
//         pagination.innerHTML = controlsHtml;

//         document.querySelectorAll(".page-num").forEach(numBtn => {
//             numBtn.addEventListener("click", () => {
//                 currentPage = parseInt(numBtn.getAttribute("data-target"));
//                 displayPage();
//                 window.scrollTo({ top: 250, behavior: 'smooth' });
//             });
//         });

//         document.getElementById("prevPage").addEventListener("click", () => { if (currentPage > 1) { currentPage--; displayPage(); } });
//         document.getElementById("nextPage").addEventListener("click", () => { if (currentPage < totalPages) { currentPage++; displayPage(); } });
//     }

//     searchInput.addEventListener("input", (e) => { searchString = e.target.value.toLowerCase().trim(); currentPage = 1; displayPage(); });

//     sidebarItems.forEach(item => {
//         item.addEventListener("click", () => {
//             sidebarItems.forEach(i => i.classList.remove("active-cat"));
//             item.classList.add("active-cat");
//             selectedCategory = item.getAttribute("data-cat");
//             if(categoryDropdown) categoryDropdown.value = selectedCategory;
//             currentPage = 1;
//             displayPage();
//         });
//     });

//     if(categoryDropdown) {
//         categoryDropdown.addEventListener("change", (e) => {
//             selectedCategory = e.target.value;
//             sidebarItems.forEach(i => {
//                 if(i.getAttribute("data-cat") === selectedCategory) i.classList.add("active-cat");
//                 else i.classList.remove("active-cat");
//             });
//             currentPage = 1;
//             displayPage();
//         });
//     }

//     displayPage();
// });