/**
 * app.js
 * Customer Menu Application Controller.
 * Dynamically binds data from dataService into index.html templates.
 */

// Image mappings for categories to reflect a premium visual landing page
const CATEGORY_IMAGES = {
    'المشروبات الساخنة': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    'المشروبات الباردة': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    'العصائر الطبيعية': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=600',
    'الحلويات': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    'أراكيل': 'https://images.unsplash.com/photo-1606913084603-3e7702b02f44?auto=format&fit=crop&q=80&w=600',
    'الأراكيل': 'https://images.unsplash.com/photo-1606913084603-3e7702b02f44?auto=format&fit=crop&q=80&w=600',
    'default': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600'
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Splash Screen Intro video handler
    setupSplashScreen();

    // 2. Initialize data from Excel/Local Storage
    if (window.dataService) {
        await window.dataService.init();
    }

    // 3. Load settings
    setupSettings();

    // 4. Render categories landing grid
    renderCategoriesGrid();

    // 5. Render horizontal tabs inside products view
    setupHorizontalTabs();

    // 6. Setup interaction events
    setupEvents();
});

// Intro Video Splash Screen Controller
function setupSplashScreen() {
    const splash = document.getElementById('intro-splash');
    const videoMobile = document.getElementById('intro-video-mobile');
    const videoDesktop = document.getElementById('intro-video-desktop');

    if (!splash || !videoMobile || !videoDesktop) return;

    // Auto-skip splash screen if loaded inside an iframe (e.g., admin live preview mockup)
    if (window.self !== window.top) {
        splash.style.display = 'none';
        document.body.classList.remove('splash-active');
        return;
    }

    // Prevent body scrolling while splash screen is active
    document.body.classList.add('splash-active');

    const fadeOutSplash = () => {
        if (!splash.classList.contains('fade-out')) {
            splash.classList.add('fade-out');
            
            // Pause videos to stop background audio/CPU usage
            try {
                videoMobile.pause();
                videoDesktop.pause();
            } catch (e) {
                console.error(e);
            }

            // Restore body scrolling
            document.body.classList.remove('splash-active');

            // Remove from layout after animation
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }
    };

    // Slow playback rate for both videos when they play and toggle visual readiness
    [videoMobile, videoDesktop].forEach(vid => {
        const setReady = () => {
            vid.playbackRate = 0.75;
            vid.classList.add('video-ready');
        };

        vid.addEventListener('play', setReady);
        vid.addEventListener('playing', setReady);
        vid.addEventListener('canplaythrough', setReady);
        
        // Fallback: If a video fails to play/load, log it
        vid.addEventListener('error', (e) => {
            console.error('Video error on element:', vid.id, e);
        });
    });

    // Control playback states dynamically on resize or initialization
    const syncVideoPlayback = () => {
        // Only run sync if splash screen is still visible
        if (splash.classList.contains('fade-out') || splash.style.display === 'none') {
            return;
        }

        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        if (isLandscape) {
            videoMobile.pause();
            videoDesktop.play().catch(err => console.log('Autoplay desktop video paused or blocked:', err));
        } else {
            videoDesktop.pause();
            videoMobile.play().catch(err => console.log('Autoplay mobile video paused or blocked:', err));
        }
    };

    // Initialize playback
    syncVideoPlayback();

    // Listen for orientation changes or window resize to swap active video dynamic states
    window.addEventListener('resize', syncVideoPlayback);

    // Enter menu immediately on click
    splash.addEventListener('click', fadeOutSplash);

    // Fallback: automatically enter the menu after 15 seconds as a failsafe
    setTimeout(fadeOutSplash, 15000);
}

// Setup settings UI
function setupSettings() {
    const settings = window.dataService.getSettings();
    if (!settings) return;

    const nameTitle = document.getElementById('restaurant-name-title');
    const welcomeHeader = document.getElementById('welcome-header');
    if (settings.restaurant_name) {
        nameTitle.textContent = settings.restaurant_name;
        welcomeHeader.textContent = `أهلاً بك في ${settings.restaurant_name}`;
        document.title = `${settings.restaurant_name} | القائمة الرقمية`;
    }

    const logoImg = document.getElementById('restaurant-logo-img');
    if (settings.logo_url && logoImg) {
        logoImg.src = settings.logo_url;
        logoImg.style.display = 'block';
    } else if (logoImg) {
        logoImg.style.display = 'none';
    }
}

// Render Categories cards list on first page
function renderCategoriesGrid() {
    const categories = window.dataService.getCategories();
    const gridContainer = document.getElementById('categories-grid-container');

    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    categories.forEach(cat => {
        const prods = window.dataService.getProductsByCategory(cat.id);
        const bgUrl = CATEGORY_IMAGES[cat.name] || CATEGORY_IMAGES['default'];

        const card = document.createElement('div');
        card.className = 'category-card animate-fade-in-up';
        card.setAttribute('data-id', cat.id);
        card.setAttribute('data-name', cat.name);

        card.innerHTML = `
            <img src="${bgUrl}" alt="${cat.name}" class="category-card-bg">
            <div class="category-card-icon">
                <span class="material-symbols-outlined">${cat.icon || 'coffee'}</span>
            </div>
            <div class="category-card-overlay">
                <h3 class="category-card-title">${cat.name}</h3>
                <span class="category-card-count">${prods.length} وجبة متوفرة</span>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// Setup horizontal slide tabs inside product views
function setupHorizontalTabs() {
    const categories = window.dataService.getCategories();
    const tabsContainer = document.getElementById('categories-tabs-container');
    const mobileBottomBar = document.getElementById('mobile-bottom-bar');

    if (!tabsContainer) return;

    tabsContainer.innerHTML = `
        <button class="category-tab" data-id="all">
            <span class="material-symbols-outlined tab-icon">grid_view</span>
            <span class="tab-text">الكل</span>
        </button>
    `;

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-tab';
        btn.setAttribute('data-id', cat.id);
        btn.innerHTML = `
            <span class="material-symbols-outlined tab-icon">${cat.icon || 'coffee'}</span>
            <span class="tab-text">${cat.name}</span>
        `;
        tabsContainer.appendChild(btn);
    });

    if (mobileBottomBar) {
        mobileBottomBar.innerHTML = '';
        
        // Add active "الكل" item
        const allItem = document.createElement('div');
        allItem.className = 'nav-item active';
        allItem.setAttribute('data-id', 'all');
        allItem.innerHTML = `
            <span class="material-symbols-outlined nav-icon">grid_view</span>
            <span class="nav-text">الكل</span>
        `;
        mobileBottomBar.appendChild(allItem);

        categories.slice(0, 3).forEach(cat => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.setAttribute('data-id', cat.id);
            navItem.innerHTML = `
                <span class="material-symbols-outlined nav-icon">${cat.icon || 'coffee'}</span>
                <span class="nav-text">${cat.name.split(' ')[0]}</span>
            `;
            mobileBottomBar.appendChild(navItem);
        });

        const infoItem = document.createElement('div');
        infoItem.className = 'nav-item';
        infoItem.id = 'mobile-info-trigger';
        infoItem.innerHTML = `
            <span class="material-symbols-outlined nav-icon">info</span>
            <span class="nav-text">المزيد</span>
        `;
        mobileBottomBar.appendChild(infoItem);
    }
}

// Render Products Grid list
function renderProductsGrid(categoryId = 'all', searchQuery = '') {
    const gridContainer = document.getElementById('products-grid-container');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    let list = window.dataService.getProducts();

    // Filter by Category
    if (categoryId !== 'all') {
        list = list.filter(p => p.category_id === Number(categoryId));
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        list = list.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    if (list.length === 0) {
        gridContainer.innerHTML = `
            <div class="empty-state" style="grid-column: span 4; text-align: center; padding: 48px; color: var(--color-on-surface-variant);">
                <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 12px;">search_off</span>
                <p>عذراً، لم نجد أي أصناف تطابق بحثك حالياً.</p>
            </div>
        `;
        return;
    }

    list.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'bento-card';
        card.setAttribute('data-id', prod.id);

        let priceHtml = '';
        if (prod.available) {
            priceHtml = `<span class="card-price">${prod.price} ل.س</span>`;
        } else {
            priceHtml = `<span class="card-price unavailable">غير متوفر حاليا</span>`;
        }

        const imgUrl = prod.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';

        card.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${imgUrl}" alt="${prod.name}" class="card-image" loading="lazy">
            </div>
            <div class="card-details">
                <div class="card-header-info">
                    <h3 class="card-title">${prod.name}</h3>
                    <p class="card-desc">${prod.description || ''}</p>
                </div>
                <div class="card-bottom-info">
                    ${priceHtml}
                    ${prod.available ? `<span class="material-symbols-outlined add-btn">info</span>` : ''}
                </div>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

// Setup events
function setupEvents() {
    const searchInput = document.getElementById('menu-search');
    const categoriesGrid = document.getElementById('categories-grid-container');
    const tabsContainer = document.getElementById('categories-tabs-container');
    const mobileBottomBar = document.getElementById('mobile-bottom-bar');
    const backBtn = document.getElementById('back-to-categories-btn');
    const categoryTitleHeading = document.getElementById('current-category-title');
    
    // View sections
    const categoriesView = document.getElementById('categories-page-view');
    const productsView = document.getElementById('products-page-view');

    // Modals
    const infoDialog = document.getElementById('info-dialog');
    const openInfoBtn = document.getElementById('open-info-btn');
    const closeInfoBtn = document.getElementById('close-info-btn');
    const confirmModalBtn = document.getElementById('confirm-modal-btn');
    const translateBtn = document.getElementById('translate-btn');

    // Product Details Modal
    const productDetailsDialog = document.getElementById('product-details-dialog');
    const closeDetailsBtn = document.getElementById('close-product-details-btn');
    const closeDetailsBtnConfirm = document.getElementById('close-product-details-btn-confirm');

    let activeCategory = 'all';

    const showProductsView = (catId, catName) => {
        activeCategory = catId;
        categoryTitleHeading.textContent = catName;

        // Sync tab buttons active class
        tabsContainer.querySelectorAll('.category-tab').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-id') === String(catId)) {
                btn.classList.add('active');
            }
        });

        // Render products
        const query = searchInput ? searchInput.value : '';
        renderProductsGrid(activeCategory, query);

        // Switch views
        categoriesView.classList.remove('active');
        productsView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showCategoriesView = () => {
        categoriesView.classList.add('active');
        productsView.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Category Card click listener (Landing grid)
    if (categoriesGrid) {
        categoriesGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.category-card');
            if (!card) return;
            const catId = card.getAttribute('data-id');
            const catName = card.getAttribute('data-name');
            showProductsView(catId, catName);
        });
    }

    // Back to categories button click
    if (backBtn) {
        backBtn.addEventListener('click', showCategoriesView);
    }

    // Category Tabs click listeners (Slider menu inside category view)
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.category-tab');
            if (!tab) return;

            tabsContainer.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            activeCategory = tab.getAttribute('data-id');
            
            // Update Title Heading
            if (activeCategory === 'all') {
                categoryTitleHeading.textContent = 'كل الأصناف';
            } else {
                const cat = window.dataService.getCategoryById(activeCategory);
                categoryTitleHeading.textContent = cat ? cat.name : '-';
            }

            // Sync with bottom navigation bar if mobile
            if (mobileBottomBar) {
                mobileBottomBar.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-id') === activeCategory) {
                        item.classList.add('active');
                    }
                });
            }

            renderProductsGrid(activeCategory, searchInput.value);
        });
    }

    // Mobile Navigation Bar click listeners
    if (mobileBottomBar) {
        mobileBottomBar.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item');
            if (!item) return;

            if (item.id === 'mobile-info-trigger') {
                infoDialog.classList.add('open');
                return;
            }

            mobileBottomBar.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const catId = item.getAttribute('data-id');
            const catName = catId === 'all' ? 'كل الأصناف' : window.dataService.getCategoryById(catId).name;
            showProductsView(catId, catName);
        });
    }

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (productsView.classList.contains('active')) {
                renderProductsGrid(activeCategory, searchInput.value);
            } else {
                // If typed search on categories page, automatically switch to "All Products" list view
                showProductsView('all', 'كل الأصناف');
            }
        });
    }

    // Product Card click (open details popup)
    const productsGrid = document.getElementById('products-grid-container');
    if (productsGrid && productDetailsDialog) {
        productsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.bento-card');
            if (!card) return;

            const id = card.getAttribute('data-id');
            const prod = window.dataService.getProductById(id);
            if (!prod) return;

            // Fill modal details
            document.getElementById('modal-product-title').textContent = prod.name;
            document.getElementById('modal-product-name-heading').textContent = prod.name;
            
            const img = document.getElementById('modal-product-image');
            img.src = prod.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
            
            const priceHeading = document.getElementById('modal-product-price-heading');
            if (prod.available) {
                priceHeading.textContent = `${prod.price} ل.س`;
                priceHeading.style.color = 'var(--color-primary)';
                priceHeading.style.backgroundColor = 'transparent';
                priceHeading.style.padding = '0';
            } else {
                priceHeading.textContent = 'غير متوفر حاليا';
                priceHeading.style.color = 'var(--color-error)';
                priceHeading.style.backgroundColor = 'var(--color-error-container)';
                priceHeading.style.padding = '2px 8px';
                priceHeading.style.borderRadius = 'var(--radius-sm)';
            }

            document.getElementById('modal-product-description').textContent = prod.description || 'لا توجد تفاصيل إضافية عن مكونات هذا الطبق الخاص حالياً.';

            productDetailsDialog.classList.add('open');
        });
    }

    // Close product details triggers
    if (closeDetailsBtn && productDetailsDialog) {
        closeDetailsBtn.addEventListener('click', () => productDetailsDialog.classList.remove('open'));
    }
    if (closeDetailsBtnConfirm && productDetailsDialog) {
        closeDetailsBtnConfirm.addEventListener('click', () => productDetailsDialog.classList.remove('open'));
    }
    if (productDetailsDialog) {
        productDetailsDialog.addEventListener('click', (e) => {
            if (e.target === productDetailsDialog) productDetailsDialog.classList.remove('open');
        });
    }

    // Info Dialog visibility togglers
    if (openInfoBtn && infoDialog) {
        openInfoBtn.addEventListener('click', () => infoDialog.classList.add('open'));
    }
    if (closeInfoBtn && infoDialog) {
        closeInfoBtn.addEventListener('click', () => infoDialog.classList.remove('open'));
    }
    if (confirmModalBtn && infoDialog) {
        confirmModalBtn.addEventListener('click', () => infoDialog.classList.remove('open'));
    }
    if (infoDialog) {
        infoDialog.addEventListener('click', (e) => {
            if (e.target === infoDialog) infoDialog.classList.remove('open');
        });
    }

    // Translate Mock
    if (translateBtn) {
        translateBtn.addEventListener('click', () => alert('ترجمة القائمة قيد التطوير!'));
    }
}
