/**
 * admin.js
 * Admin Panel Application Controller.
 * Manages dashboard statistics, product and category tables, settings,
 * CRUD forms, and dynamic Excel export/import actions.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Enforce passcode lock for security
    checkAuthentication();

    // 2. Initialize Data Service
    if (window.dataService) {
        await window.dataService.init();
    }

    // 3. Route specific page logic
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        setupDashboardPage();
    } else if (path.includes('products.html')) {
        setupProductsPage();
    } else if (path.includes('categories.html')) {
        setupCategoriesPage();
    } else if (path.includes('settings.html')) {
        setupSettingsPage();
    }
});

// --- CLIENT PASSCODE AUTHENTICATION GATE ---
function checkAuthentication() {
    if (sessionStorage.getItem('gardin_admin_authenticated') === 'true') {
        return;
    }

    // Inject lock screen overlay
    const overlay = document.createElement('div');
    overlay.id = 'admin-login-overlay';
    overlay.style = `
        position: fixed;
        inset: 0;
        z-index: 10000;
        background-color: var(--color-primary);
        color: var(--color-on-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        font-family: 'Almarai', sans-serif;
    `;

    overlay.innerHTML = `
        <div style="background-color: var(--color-surface-container-lowest); color: var(--color-on-surface); padding: 32px; border-radius: var(--radius-xl); box-shadow: var(--shadow-md); width: 100%; max-width: 380px; text-align: center;">
            <span class="material-symbols-outlined" style="font-size: 64px; color: var(--color-primary); margin-bottom: 12px;">lock</span>
            <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">لوحة الإدارة المحمية</h3>
            <p style="font-size: 13px; color: var(--color-on-surface-variant); margin-bottom: 24px;">الرجاء إدخال رمز المرور لفتح لوحة التحكم (الافتراضي: 1234)</p>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <input type="password" id="admin-passcode-input" style="width: 100%; padding: 12px; font-size: 18px; text-align: center; border-radius: var(--radius-default); border: 1px solid var(--color-outline-variant); letter-spacing: 0.2em;" placeholder="••••" maxlength="4">
                <p id="admin-login-error" style="color: var(--color-error); font-size: 12px; display: none;">رمز المرور المدخل غير صحيح!</p>
                <button id="admin-login-btn" style="background-color: var(--color-primary); color: var(--color-on-primary); border: none; padding: 12px; border-radius: var(--radius-default); font-weight: 600; cursor: pointer; font-size: 14px;">دخول</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('#admin-passcode-input');
    const errorMsg = overlay.querySelector('#admin-login-error');
    const submitBtn = overlay.querySelector('#admin-login-btn');

    const doLogin = () => {
        if (input.value === '1234') {
            sessionStorage.setItem('gardin_admin_authenticated', 'true');
            overlay.remove();
            window.location.reload(); // reload to fetch logo & details
        } else {
            errorMsg.style.display = 'block';
            input.value = '';
            input.focus();
        }
    };

    submitBtn.addEventListener('click', doLogin);
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') doLogin();
    });
    
    // Halt further page loads until authenticated
    throw new Error('Authentication required');
}


// --- 1. DASHBOARD OVERVIEW HANDLER ---
function setupDashboardPage() {
    const products = window.dataService.getProducts();
    const categories = window.dataService.getCategories();

    const totalCategories = categories.length;
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.available).length;
    const hiddenProducts = products.filter(p => !p.available).length;

    // Populate counters
    document.getElementById('stat-total-categories').textContent = totalCategories;
    document.getElementById('stat-total-products').textContent = totalProducts;
    document.getElementById('stat-available-products').textContent = availableProducts;
    document.getElementById('stat-hidden-products').textContent = hiddenProducts;

    // Bind quick actions
    const quickExportBtn = document.getElementById('quick-export-xlsx');
    if (quickExportBtn) {
        quickExportBtn.addEventListener('click', () => {
            window.dataService.exportExcel('products');
            window.dataService.exportExcel('categories');
            window.dataService.exportExcel('settings');
        });
    }

    const showActivitiesBtn = document.getElementById('show-all-activities-btn');
    if (showActivitiesBtn) {
        showActivitiesBtn.addEventListener('click', () => {
            alert('تمت أرشفة النشاطات القديمة!');
        });
    }
}


// --- 2. PRODUCT MANAGEMENT HANDLER ---
function setupProductsPage() {
    const tableBody = document.getElementById('admin-products-table-body');
    const categoryFilter = document.getElementById('admin-product-category-filter');
    const formCategorySelect = document.getElementById('form-product-category');
    const searchInput = document.getElementById('admin-product-search');
    
    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 5;

    // Modal drawer elements
    const modal = document.getElementById('product-form-modal');
    const openAddBtn = document.getElementById('open-add-product-btn');
    const closeBtn = document.getElementById('close-product-modal-btn');
    const cancelBtn = document.getElementById('cancel-product-btn');
    const backdrop = document.getElementById('product-modal-backdrop');
    const crudForm = document.getElementById('product-crud-form');
    const modalTitle = document.getElementById('product-modal-title');

    // Image upload converters
    const formImageLocal = document.getElementById('form-product-image-local');
    const formImageInput = document.getElementById('form-product-image');

    // Populate category filters & options
    const categories = window.dataService.getCategories();
    if (categoryFilter) {
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.name;
            categoryFilter.appendChild(opt);
        });
    }
    if (formCategorySelect) {
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.name;
            formCategorySelect.appendChild(opt);
        });
    }

    // Render table listing
    const renderTable = () => {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        let list = window.dataService.getProducts();

        // Apply category filter
        const selectedCat = categoryFilter.value;
        if (selectedCat !== 'all') {
            list = list.filter(p => p.category_id === Number(selectedCat));
        }

        // Apply search query
        const query = searchInput.value.toLowerCase().trim();
        if (query !== '') {
            list = list.filter(p => p.name.toLowerCase().includes(query));
        }

        // Update Pagination Info
        const totalItems = list.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        const paginationInfo = document.getElementById('admin-products-pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `عرض ${totalItems > 0 ? startIndex + 1 : 0}-${endIndex} من أصل ${totalItems} منتج`;
        }

        // Slice for current page
        const pageItems = list.slice(startIndex, endIndex);

        if (pageItems.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 32px; color: var(--color-on-surface-variant);">
                        لا توجد منتجات مطابقة للبحث أو الفئة الحالية.
                    </td>
                </tr>
            `;
            return;
        }

        pageItems.forEach(prod => {
            const cat = window.dataService.getCategoryById(prod.category_id);
            const catName = cat ? cat.name : 'غير محدد';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <img src="${prod.image_url || ''}" alt="${prod.name}" class="table-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
                </td>
                <td>
                    <div class="table-title">${prod.name}</div>
                    <div class="table-subtitle">${prod.description || 'لا يوجد وصف'}</div>
                </td>
                <td>
                    <span class="tag-pill">${catName}</span>
                </td>
                <td style="text-align: center;">
                    ${prod.available 
                        ? `<span class="status-badge available"><span class="dot"></span>متوفر</span>`
                        : `<span class="status-badge unavailable"><span class="dot"></span>غير متوفر</span>`
                    }
                </td>
                <td class="card-price" style="font-weight: 600;">${prod.price} ل.س</td>
                <td>
                    <div class="action-buttons" style="padding-left: 8px;">
                        <button class="action-btn edit-prod-btn" data-id="${prod.id}" title="تعديل">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="action-btn delete delete-prod-btn" data-id="${prod.id}" title="حذف">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Render pagination buttons
        renderPagination(totalPages);
    };

    const renderPagination = (totalPages) => {
        const container = document.getElementById('admin-products-pagination-controls');
        if (!container) return;
        container.innerHTML = '';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.disabled = currentPage === 1;
        prevBtn.innerHTML = `<span class="material-symbols-outlined">chevron_right</span>`;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        container.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderTable();
            });
            container.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.innerHTML = `<span class="material-symbols-outlined">chevron_left</span>`;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
        container.appendChild(nextBtn);
    };

    // Filter events
    if (categoryFilter) categoryFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
    if (searchInput) searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });

    // Modal controllers
    const openModal = (isEdit = false, prodId = null) => {
        if (!modal) return;
        crudForm.reset();
        
        if (isEdit && prodId) {
            const prod = window.dataService.getProductById(prodId);
            if (prod) {
                modalTitle.textContent = 'تعديل بيانات المنتج';
                document.getElementById('form-product-id').value = prod.id;
                document.getElementById('form-product-name').value = prod.name;
                document.getElementById('form-product-category').value = prod.category_id;
                document.getElementById('form-product-price').value = prod.price;
                document.getElementById('form-product-image').value = prod.image_url;
                document.getElementById('form-product-sort').value = prod.sort_order;
                document.getElementById('form-product-desc').value = prod.description;
                document.getElementById('form-product-available').checked = prod.available;
            }
        } else {
            modalTitle.textContent = 'إضافة منتج جديد';
            document.getElementById('form-product-id').value = '';
            document.getElementById('form-product-sort').value = window.dataService.getProducts().length + 1;
            document.getElementById('form-product-available').checked = true;
        }
        
        modal.classList.add('open');
    };

    const closeModal = () => {
        if (modal) modal.classList.remove('open');
    };

    if (openAddBtn) openAddBtn.addEventListener('click', () => openModal(false));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Image converter (Local image upload to base64)
    if (formImageLocal && formImageInput) {
        formImageLocal.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                formImageInput.value = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Submit handler
    if (crudForm) {
        crudForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('form-product-id').value;
            const fields = {
                name: document.getElementById('form-product-name').value,
                category_id: Number(document.getElementById('form-product-category').value),
                price: Number(document.getElementById('form-product-price').value),
                image_url: document.getElementById('form-product-image').value,
                sort_order: Number(document.getElementById('form-product-sort').value) || 1,
                description: document.getElementById('form-product-desc').value,
                available: document.getElementById('form-product-available').checked
            };

            if (id) {
                window.dataService.updateProduct(id, fields);
            } else {
                window.dataService.addProduct(fields);
            }

            closeModal();
            renderTable();
        });
    }

    // Delete/Edit delegator
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-prod-btn');
            const deleteBtn = e.target.closest('.delete-prod-btn');

            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                openModal(true, id);
            }

            if (deleteBtn) {
                const id = deleteBtn.getAttribute('data-id');
                const prod = window.dataService.getProductById(id);
                if (confirm(`هل أنت متأكد من حذف المنتج "${prod.name}"؟`)) {
                    window.dataService.deleteProduct(id);
                    renderTable();
                }
            }
        });
    }

    // Export Excel Button
    const exportBtn = document.getElementById('admin-export-products-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.dataService.exportExcel('products');
        });
    }

    // Import Excel Button
    const importFile = document.getElementById('admin-import-products-file');
    if (importFile) {
        importFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                await window.dataService.importExcel('products', file);
                alert('تم استيراد قائمة المنتجات بنجاح وتحديث البيانات!');
                window.location.reload();
            } catch (err) {
                alert('خطأ في قراءة ملف الـ Excel: ' + err.message);
            }
        });
    }

    // Check query params to open modal (e.g. if navigated from dashboard quick links)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new') {
        openModal(false);
    }

    // Render initially
    renderTable();
}


// --- 3. CATEGORY MANAGEMENT HANDLER ---
function setupCategoriesPage() {
    const tableBody = document.getElementById('admin-categories-table-body');
    const modal = document.getElementById('category-form-modal');
    const openAddBtn = document.getElementById('open-add-category-btn');
    const closeBtn = document.getElementById('close-category-modal-btn');
    const cancelBtn = document.getElementById('cancel-category-btn');
    const backdrop = document.getElementById('category-modal-backdrop');
    const crudForm = document.getElementById('category-crud-form');
    const modalTitle = document.getElementById('category-modal-title');

    const renderTable = () => {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        const categories = window.dataService.getCategories();

        categories.forEach(cat => {
            // Count products associated
            const prods = window.dataService.getProductsByCategory(cat.id);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <span class="material-symbols-outlined drag-handle">drag_indicator</span>
                </td>
                <td>
                    <div class="category-row-icon">
                        <span class="material-symbols-outlined">${cat.icon || 'coffee'}</span>
                    </div>
                </td>
                <td>
                    <div class="table-title">${cat.name}</div>
                    <div class="table-subtitle">${prods.length} وجبات مدرجة</div>
                </td>
                <td style="text-align: center; font-weight: 600; color: var(--color-on-surface-variant);">
                    #${cat.sort_order}
                </td>
                <td>
                    <div class="action-buttons" style="justify-content: center;">
                        <button class="action-btn edit-cat-btn" data-id="${cat.id}" title="تعديل">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="action-btn delete delete-cat-btn" data-id="${cat.id}" title="حذف">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    // Modal controllers
    const openModal = (isEdit = false, catId = null) => {
        if (!modal) return;
        crudForm.reset();

        if (isEdit && catId) {
            const cat = window.dataService.getCategoryById(catId);
            if (cat) {
                modalTitle.textContent = 'تعديل بيانات القسم';
                document.getElementById('form-category-id').value = cat.id;
                document.getElementById('form-category-name').value = cat.name;
                document.getElementById('form-category-icon').value = cat.icon;
                document.getElementById('form-category-sort').value = cat.sort_order;
            }
        } else {
            modalTitle.textContent = 'إضافة تصنيف جديد';
            document.getElementById('form-category-id').value = '';
            document.getElementById('form-category-sort').value = window.dataService.getCategories().length + 1;
        }

        modal.classList.add('open');
    };

    const closeModal = () => {
        if (modal) modal.classList.remove('open');
    };

    if (openAddBtn) openAddBtn.addEventListener('click', () => openModal(false));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Form submit
    if (crudForm) {
        crudForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('form-category-id').value;
            const fields = {
                name: document.getElementById('form-category-name').value,
                icon: document.getElementById('form-category-icon').value,
                sort_order: Number(document.getElementById('form-category-sort').value) || 1
            };

            if (id) {
                window.dataService.updateCategory(id, fields);
            } else {
                window.dataService.addCategory(fields);
            }

            closeModal();
            renderTable();
        });
    }

    // Delete/Edit delegator
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-cat-btn');
            const deleteBtn = e.target.closest('.delete-cat-btn');

            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                openModal(true, id);
            }

            if (deleteBtn) {
                const id = deleteBtn.getAttribute('data-id');
                const cat = window.dataService.getCategoryById(id);
                if (confirm(`هل أنت متأكد من حذف القسم "${cat.name}"؟ تنبيه: سيتم حذف جميع المنتجات التابعة له تلقائياً!`)) {
                    window.dataService.deleteCategory(id);
                    renderTable();
                }
            }
        });
    }

    // Export Excel Button
    const exportBtn = document.getElementById('admin-export-categories-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.dataService.exportExcel('categories');
        });
    }

    // Import Excel Button
    const importFile = document.getElementById('admin-import-categories-file');
    if (importFile) {
        importFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                await window.dataService.importExcel('categories', file);
                alert('تم استيراد قائمة التصنيفات بنجاح وتحديث البيانات!');
                window.location.reload();
            } catch (err) {
                alert('خطأ في قراءة ملف الـ Excel: ' + err.message);
            }
        });
    }

    renderTable();
}


// --- 4. BRANDING SETTINGS HANDLER ---
function setupSettingsPage() {
    const settings = window.dataService.getSettings();
    const nameInput = document.getElementById('settings-restaurant-name');
    const logoInput = document.getElementById('settings-logo-url');
    const logoLocal = document.getElementById('settings-logo-local');
    const customColorPicker = document.getElementById('settings-theme-color-picker');
    const swatches = document.querySelectorAll('.color-swatch-item .color-circle');
    const iframe = document.getElementById('settings-preview-iframe');

    if (!settings) return;

    // Load initial values
    if (nameInput) nameInput.value = settings.restaurant_name || '';
    if (logoInput) logoInput.value = settings.logo_url || '';
    if (customColorPicker) customColorPicker.value = settings.theme_color || '#061b0e';

    // Highlight active swatch matching theme color
    const highlightActiveSwatch = () => {
        const themeColor = customColorPicker.value.toLowerCase();
        swatches.forEach(sw => {
            sw.style.transform = 'scale(1)';
            sw.style.borderColor = 'white';
            
            const colorVal = sw.getAttribute('data-color');
            if (colorVal && colorVal.toLowerCase() === themeColor) {
                sw.style.transform = 'scale(1.1)';
                sw.style.borderColor = 'var(--color-on-background)';
            }
        });
    };
    highlightActiveSwatch();

    // Swatches listeners
    swatches.forEach(sw => {
        sw.addEventListener('click', () => {
            const colorVal = sw.getAttribute('data-color');
            if (colorVal) {
                customColorPicker.value = colorVal;
                highlightActiveSwatch();
                updateLivePreview();
            }
        });
    });

    if (customColorPicker) {
        customColorPicker.addEventListener('input', () => {
            highlightActiveSwatch();
            updateLivePreview();
        });
    }

    // Logo image local converter (local logo to base64)
    if (logoLocal && logoInput) {
        logoLocal.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                logoInput.value = event.target.result;
                updateLivePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    // Refresh preview iframe dynamically on change
    const updateLivePreview = () => {
        // Build settings object, save to localStorage temporary so iframe can read it
        const currentFields = {
            restaurant_name: nameInput.value,
            logo_url: logoInput.value,
            theme_color: customColorPicker.value
        };
        
        // Write to local settings immediately so iframe loads them
        window.dataService.updateSettings(currentFields);

        // Reload iframe
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.location.reload();
        }
    };

    if (nameInput) nameInput.addEventListener('input', updateLivePreview);
    if (logoInput) logoInput.addEventListener('input', updateLivePreview);

    // Save Settings
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const currentFields = {
                restaurant_name: nameInput.value,
                logo_url: logoInput.value,
                theme_color: customColorPicker.value
            };
            window.dataService.updateSettings(currentFields);
            alert('تم حفظ إعدادات المتجر وتطبيق الهوية البصرية بنجاح!');
        });
    }

    // Export Excel Button
    const exportBtn = document.getElementById('admin-export-settings-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.dataService.exportExcel('settings');
        });
    }

    // Import Excel Button
    const importFile = document.getElementById('admin-import-settings-file');
    if (importFile) {
        importFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                await window.dataService.importExcel('settings', file);
                alert('تم استيراد إعدادات المتجر بنجاح وتحديث البيانات!');
                window.location.reload();
            } catch (err) {
                alert('خطأ في قراءة ملف الـ Excel: ' + err.message);
            }
        });
    }
}
