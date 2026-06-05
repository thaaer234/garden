/**
 * dataService.js
 * Handles data loading, parsing, local storage synchronization, CRUD operations,
 * and client-side Excel import/export using SheetJS.
 */

const STORAGE_KEYS = {
    PRODUCTS: 'gardin_products',
    CATEGORIES: 'gardin_categories',
    SETTINGS: 'gardin_settings'
};

// Hardcoded fallback data in case fetching categories.xlsx or products.xlsx fails (e.g., CORS locally on file://)
const FALLBACK_DATA = {
    categories: [
        { id: 1, name: 'المشروبات الساخنة', icon: 'coffee', sort_order: 1 },
        { id: 2, name: 'المشروبات الباردة', icon: 'icecream', sort_order: 2 },
        { id: 3, name: 'العصائر الطبيعية', icon: 'local_bar', sort_order: 3 },
        { id: 4, name: 'الحلويات', icon: 'cake', sort_order: 4 }
    ],
    products: [
        {
            id: 1,
            name: 'فلات وايت كلاسيك',
            price: 22,
            category_id: 1,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnOhxqJRVEj532m2oZ9pDotI6jBDiuNAHL0QySz01pvWMGmKSI_Dok3kqDGKES5ZpzLn0GE9-8gYfstEryt0lDukd3WIApYBn1Lu1XlA0IjtDZYfPDG4l6AfbjE9M_JqIUmwV-kgbW-s2ac8rDuVHad6b_Wj8mCmlxlxtKnUDBNgvkhhI8SdQ5ioIVbrVIEp8Rt80g2fuI2L5st4usPpL5qLQ-AGV4TIlPyFL1-z6OF4xVdbUP3WIhWebk233I8IcuUZKwmu3fo6qE',
            description: 'حبوب مختصة محمصة بعناية مع حليب مبخر غني',
            sort_order: 1,
            available: true
        },
        {
            id: 2,
            name: 'آيس لاتيه',
            price: 18,
            category_id: 2,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHErX8pF6F_1gyx7fRGRU3UYjdzHEkw2c3nIX1OWfc9_6jbSrcXWjjK9sMLAHOr4lItTUnpNFdEjg03irmVEXbjjbMl4m5OEonfnPURmKlLQSLRJI7hvCePQEhVYoIUhBKSIjxuJNqV42IuXJF7NraH57iJRWdNbUz3vQsSjzQrr-s-ORBurhJ0uvRktR8DO5xlj_jfMNEFUKEYgOn6mOq1QbfpN2nt2bmT4JCnmfB-qN0TDjuWPY6v6p2J5gxglr2HYm-Y68X3U9G',
            description: 'حبوب بن مختارة بعناية مع حليب بارد وثلج',
            sort_order: 2,
            available: true
        },
        {
            id: 3,
            name: 'كيكة العسل',
            price: 25,
            category_id: 4,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDLQA4i0KeOF7p4TYvwWfFHRTpfxtmXq7q_NRYcnWkC5-KmDewdgOJyyLDn10ZQfxjESozCQsMh3DzuitvSvQjoCNTgSH9ARb0EWugi5-uYXXzgOdK6WnFLl3-yXiJIuIWIRcuUIh-vITyrqYPJMnM12HWmhI3LPRPLENtveJpoTUvxnV5UJbqHRIvx6DXAaKi9eEz2NJ4dMoxWehiY7THwmT-B4Z6_HuV5XxWhpXaUU_XdE-lcSAC5PyNRVUDlCf3iTaXphQ3CPVK',
            description: 'كيكة العسل الروسية الهشة بطبقات الكريمة الغنية',
            sort_order: 3,
            available: true
        },
        {
            id: 4,
            name: 'عصير برتقال طازج',
            price: 15,
            category_id: 3,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBXvFHdiYN7K5Dw4kEc3hOLUxmAfpjNyki0W33UZxR4V_JdO7z-OFcvyxVENMUB-JUZGCoQSIi7sdrOpzzLt4cLtqzsIKE58bJy94KJNKAklenASHOIsCMPz6-eAfK1zmZ9663DejVKxe3oy07bsJxzdAGLUka1ZOQjMLTrMqwzlaEL7uX1eoS725S7FU1CA6i4Nz0_vZXW7l6FBb6N5tGeCSU9mNyVXZ6jl247nF_xjEojjt4rfuZWjQHZVp-i7nRQGDeUHUHBdJ5',
            description: 'عصير برتقال طازج معصور بارداً يومياً',
            sort_order: 4,
            available: true
        },
        {
            id: 5,
            name: 'V60 كولومبي',
            price: 28,
            category_id: 1,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABFJWhFZBfLC30TJn9woAHS9gfGZF6FKpxmNIQrIib54XOQV4gIIxUDkGJiFujKC2djX61NR7-RDSHW9V6JwBCYLRBwT5Ir2Cj29t_9lrGZ1Q5_rb7o6uRf7i1I0OSY2mKZV99cBzLNGGMrKxBw1GRk5IX0ovwK_w2EQR0CNe5ZgwULEv2N-hi7ypOCCKCxDS1reXZSAsVQWGzNRsZw9crdvW_CIOrI3FPKFgHtro_Ulpk4tFK3edYK8dF5ltpWUoB38U_X-xV4fHw',
            description: 'قهوة مقطرة كولومبية فاخرة بنكهات حمضية متوازنة',
            sort_order: 5,
            available: true
        },
        {
            id: 6,
            name: 'كورتادو كلاسيك',
            price: 18,
            category_id: 1,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaQgQE9nTfEBYIhX8hOryVU3cZWU33OW0ddYo-QJKw6ZBGEWzKor3kbcT7Lk60S_jMDPi58IrwlEGedXIR9NIw85rs-HCYH1GWFi_hkKs76I26JVJaGz3DM6zGg5KWk7TxBLW8dcMR8Ond9U8tJB1MucQ4CUOlDZJdnWhywIrBD3La6A1pl2p-sM98Ocbnscqna1ophJeyN13pj9XeZJDmPjA5eg2X6cK4nyFkGjsygG7COkgMF6DcGZVJvaGrm5VA-jbk898J2w7T',
            description: 'قهوة مركزة مع حليب مبخر غني',
            sort_order: 6,
            available: true
        },
        {
            id: 7,
            name: 'كيكة الفستق والورد',
            price: 32,
            category_id: 4,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQlag-sP07kReGrdZiFF0pfawNWj7fCZkXO7L6vXzWsqOHq-jqys3J3-0so5ZukRbEPESgIzd-xa-a5jafWSeMepU5vp-KIv1TMBezUzvsU8eekE9TVQNykG55VZoTAHrdZ8kylYO8UjQYPnglJRcOwdgNle24kvcWDeIluQku0Tz-iJI1FtszROTHw4VXVhW5Mbu5jcnRO24sR-046G1blHByD6HePoI7YE7TNo_QzOixMPVrzLCRQclbF3CHjVRIsp8-CK0JHLAb',
            description: 'طبقات من كيكة الفستق مغطاة بكريمة الورد الطبيعي',
            sort_order: 7,
            available: true
        },
        {
            id: 8,
            name: 'ماتشا لاتيه عضوي',
            price: 24,
            category_id: 2,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaL36lCaYjMTR-nT5UmvU0FxvZ2yrTpDKsRdvGXr1asbAPQIndhJrmOvBoQA04_M1ltOyAPQGoS8jQ3e_huF2kqLhEOpeDAfTsF0g82mdA1YMEg6EjyugB3tFQf_MacZ7yP8xztK4tPvBQ8J_ehM5fsvfLIICYDkg4544_-YfyQXdOfyzD0meiqiRSVGjmvpniKzvoAxhvAY-IdaYY_5hP6MvXznQvz3en8v7oHWUvYmmR1BxQFiQiofJoCGBFHGwKP65OWYH9xGKo',
            description: 'شاي الماتشا الياباني العضوي الفاخر المخفوق مع الحليب',
            sort_order: 8,
            available: false
        },
        {
            id: 9,
            name: 'فرنش توست بالعسل',
            price: 45,
            category_id: 4,
            image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClm-ZwHmH_cf1iZT0TmPg52_cnh06c1SLWnSeuNp6w-OqjIq1JSYyLNcUt97E2EMUNuZEEQ0tuNMQwFKU7CEpiXr3B8VS85F1bB3HcRi1wcGuq7g_FA4VNmKdKrsw_Ys7A2Lr_bpdmOLOENzw7D_b0IY-pmVPkHx1tcbNtYO4UEiwVNo4IEqG7heiwtSlY0G3pbKYpYnjpuRogrjlt1Je8Aomhk3wnt8NNn_8wxHUqudCcEOT40Z9RMnqKag4XWk6WgLwEadzDOHsc',
            description: 'خبز البريوش الطازج والمحمص يقدم بلمسة من العسل العضوي والتوت',
            sort_order: 9,
            available: true
        }
    ],
    settings: {
        restaurant_name: 'غاردن | GARDEN',
        logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOKD5IIKKED5hyF4vSUER3j2oZiW79qNlsTmM1dQF4Ua_JXd8oWTduH43Bn14VcdoVZyl1X9C0Os6U4VAHoz__FMpYndI5FojrQdpr5JAy9rOiyA1nkFUNxeWYv-Iknoq_Q194q0wTo_jAwgQZ5rQtHXjAYboYg-3vbl3LD5yhdLAyBImrpXWDnmUm-y0G14VNIoXR08-vhGDS2n-3P_6XVh7NEPi8Kx-n7PakLj3P1o-1OT4IVl5gs7jDCcr1jQjzUplIuA4P0B4e',
        theme_color: '#061b0e'
    }
};

class DataService {
    constructor() {
        this.categories = [];
        this.products = [];
        this.settings = {};
        this.initialized = false;
    }

    // Initialize data from localStorage or fetch Excel files
    async init() {
        if (this.initialized) return;

        const hasLocalData = localStorage.getItem(STORAGE_KEYS.PRODUCTS) &&
                             localStorage.getItem(STORAGE_KEYS.CATEGORIES) &&
                             localStorage.getItem(STORAGE_KEYS.SETTINGS);

        if (hasLocalData) {
            this.loadFromLocalStorage();
            this.initialized = true;
            this.applyThemeColor();
            return;
        }

        // Determine base path depending on page nesting depth (e.g. inside admin/ or at root)
        const basePath = window.location.pathname.includes('/admin/') ? '../' : './';

        try {
            // Load Categories
            const categoriesRes = await fetch(`${basePath}data/categories.xlsx`);
            if (!categoriesRes.ok) throw new Error('Categories sheet not found');
            const categoriesBuffer = await categoriesRes.arrayBuffer();
            const categoriesWb = XLSX.read(new Uint8Array(categoriesBuffer), { type: 'array' });
            const categoriesSheet = categoriesWb.Sheets[categoriesWb.SheetNames[0]];
            const categoriesRaw = XLSX.utils.sheet_to_json(categoriesSheet);
            this.categories = categoriesRaw.map(row => ({
                id: Number(row.id),
                name: String(row.name),
                icon: String(row.icon || 'coffee'),
                sort_order: Number(row.sort_order || 99)
            }));

            // Load Products
            const productsRes = await fetch(`${basePath}data/products.xlsx`);
            if (!productsRes.ok) throw new Error('Products sheet not found');
            const productsBuffer = await productsRes.arrayBuffer();
            const productsWb = XLSX.read(new Uint8Array(productsBuffer), { type: 'array' });
            const productsSheet = productsWb.Sheets[productsWb.SheetNames[0]];
            const productsRaw = XLSX.utils.sheet_to_json(productsSheet);
            this.products = productsRaw.map(row => ({
                id: Number(row.id),
                name: String(row.name),
                price: Number(row.price),
                category_id: Number(row.category_id),
                image_url: String(row.image_url),
                description: String(row.description || ''),
                sort_order: Number(row.sort_order || 99),
                available: String(row.available).trim().toUpperCase() === 'TRUE' || row.available === true || row.available === 1
            }));

            // Load Settings
            const settingsRes = await fetch(`${basePath}data/settings.xlsx`);
            if (!settingsRes.ok) throw new Error('Settings sheet not found');
            const settingsBuffer = await settingsRes.arrayBuffer();
            const settingsWb = XLSX.read(new Uint8Array(settingsBuffer), { type: 'array' });
            const settingsSheet = settingsWb.Sheets[settingsWb.SheetNames[0]];
            const settingsRaw = XLSX.utils.sheet_to_json(settingsSheet)[0] || {};
            this.settings = {
                restaurant_name: String(settingsRaw.restaurant_name || 'GARDEN'),
                logo_url: String(settingsRaw.logo_url || ''),
                theme_color: String(settingsRaw.theme_color || '#061b0e')
            };

            this.saveToLocalStorage();
        } catch (e) {
            console.warn('Failed to load remote Excel files, falling back to local seed data. Details:', e.message);
            this.categories = [...FALLBACK_DATA.categories];
            this.products = [...FALLBACK_DATA.products];
            this.settings = { ...FALLBACK_DATA.settings };
            this.saveToLocalStorage();
        }

        this.initialized = true;
        this.applyThemeColor();
    }

    loadFromLocalStorage() {
        this.categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
        this.products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        this.settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {};
    }

    saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    }

    applyThemeColor() {
        if (this.settings && this.settings.theme_color) {
            document.documentElement.style.setProperty('--color-primary', this.settings.theme_color);
        }
    }

    // --- CATEGORIES CRUD ---
    getCategories() {
        return this.categories.sort((a, b) => a.sort_order - b.sort_order);
    }

    getCategoryById(id) {
        return this.categories.find(c => c.id === id);
    }

    addCategory(category) {
        const nextId = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1;
        const newCat = {
            id: nextId,
            name: category.name,
            icon: category.icon || 'coffee',
            sort_order: Number(category.sort_order) || (this.categories.length + 1)
        };
        this.categories.push(newCat);
        this.saveToLocalStorage();
        return newCat;
    }

    updateCategory(id, updatedFields) {
        const catIndex = this.categories.findIndex(c => c.id === Number(id));
        if (catIndex > -1) {
            this.categories[catIndex] = {
                ...this.categories[catIndex],
                ...updatedFields,
                id: Number(id) // ensure ID is preserved
            };
            this.saveToLocalStorage();
            return this.categories[catIndex];
        }
        return null;
    }

    deleteCategory(id) {
        this.categories = this.categories.filter(c => c.id !== Number(id));
        // Optional: Also delete or orphan products belonging to this category
        this.products = this.products.filter(p => p.category_id !== Number(id));
        this.saveToLocalStorage();
    }

    // --- PRODUCTS CRUD ---
    getProducts() {
        return this.products.sort((a, b) => a.sort_order - b.sort_order);
    }

    getProductsByCategory(categoryId) {
        return this.products
            .filter(p => p.category_id === Number(categoryId))
            .sort((a, b) => a.sort_order - b.sort_order);
    }

    getProductById(id) {
        return this.products.find(p => p.id === Number(id));
    }

    addProduct(product) {
        const nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        const newProd = {
            id: nextId,
            name: product.name,
            price: Number(product.price),
            category_id: Number(product.category_id),
            image_url: product.image_url || '',
            description: product.description || '',
            sort_order: Number(product.sort_order) || (this.products.length + 1),
            available: product.available !== undefined ? product.available : true
        };
        this.products.push(newProd);
        this.saveToLocalStorage();
        return newProd;
    }

    updateProduct(id, updatedFields) {
        const prodIndex = this.products.findIndex(p => p.id === Number(id));
        if (prodIndex > -1) {
            this.products[prodIndex] = {
                ...this.products[prodIndex],
                ...updatedFields,
                id: Number(id),
                price: Number(updatedFields.price !== undefined ? updatedFields.price : this.products[prodIndex].price),
                category_id: Number(updatedFields.category_id !== undefined ? updatedFields.category_id : this.products[prodIndex].category_id),
                sort_order: Number(updatedFields.sort_order !== undefined ? updatedFields.sort_order : this.products[prodIndex].sort_order)
            };
            this.saveToLocalStorage();
            return this.products[prodIndex];
        }
        return null;
    }

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== Number(id));
        this.saveToLocalStorage();
    }

    // --- SETTINGS CRUD ---
    getSettings() {
        return this.settings;
    }

    updateSettings(updatedSettings) {
        this.settings = {
            ...this.settings,
            ...updatedSettings
        };
        this.saveToLocalStorage();
        this.applyThemeColor();
        return this.settings;
    }

    // --- IMPORT/EXPORT EXCEL WORKFLOW ---

    // Export current local storage state into downloadable Excel file
    exportExcel(type) {
        let data = [];
        let sheetName = '';
        let fileName = '';

        if (type === 'products') {
            // Map true/false values to TRUE/FALSE strings for compatibility
            data = this.products.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                category_id: p.category_id,
                image_url: p.image_url,
                description: p.description,
                sort_order: p.sort_order,
                available: p.available ? 'TRUE' : 'FALSE'
            }));
            sheetName = 'Products';
            fileName = 'products.xlsx';
        } else if (type === 'categories') {
            data = this.categories;
            sheetName = 'Categories';
            fileName = 'categories.xlsx';
        } else if (type === 'settings') {
            data = [this.settings];
            sheetName = 'Settings';
            fileName = 'settings.xlsx';
        } else {
            console.error('Invalid export type requested');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, fileName);
    }

    // Import a local Excel file and update local storage state
    importExcel(type, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rawData = XLSX.utils.sheet_to_json(sheet);

                    if (type === 'products') {
                        this.products = rawData.map(row => ({
                            id: Number(row.id),
                            name: String(row.name),
                            price: Number(row.price),
                            category_id: Number(row.category_id),
                            image_url: String(row.image_url || ''),
                            description: String(row.description || ''),
                            sort_order: Number(row.sort_order || 99),
                            available: String(row.available).trim().toUpperCase() === 'TRUE' || row.available === true || row.available === 1
                        }));
                        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
                    } else if (type === 'categories') {
                        this.categories = rawData.map(row => ({
                            id: Number(row.id),
                            name: String(row.name),
                            icon: String(row.icon || 'coffee'),
                            sort_order: Number(row.sort_order || 99)
                        }));
                        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
                    } else if (type === 'settings') {
                        const row = rawData[0] || {};
                        this.settings = {
                            restaurant_name: String(row.restaurant_name || 'GARDEN'),
                            logo_url: String(row.logo_url || ''),
                            theme_color: String(row.theme_color || '#061b0e')
                        };
                        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
                        this.applyThemeColor();
                    }
                    resolve();
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        });
    }

    // Reset everything back to original Excel files (clearing local modifications)
    async resetToDefault() {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        this.initialized = false;
        await this.init();
    }
}

// Export singleton instance globally
window.dataService = new DataService();
