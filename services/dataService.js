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
        { id: 4, name: 'الحلويات', icon: 'cake', sort_order: 4 },
        { id: 5, name: 'المأكولات الرئيسية', icon: 'flatware', sort_order: 5 },
        { id: 6, name: 'المقبلات اللذيذة', icon: 'cookie', sort_order: 6 },
        { id: 7, name: 'الأراجيل المميزة', icon: 'local_fire_department', sort_order: 7 }
    ],
    products: [
        {
            id: 1,
            name: 'فلات وايت كلاسيك',
            price: 22,
            category_id: 1,
            image_url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=500&q=80',
            description: 'حبوب مختصة محمصة بعناية مع حليب مبخر غني',
            sort_order: 1,
            available: true
        },
        {
            id: 2,
            name: 'آيس لاتيه',
            price: 18,
            category_id: 2,
            image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80',
            description: 'حبوب بن مختارة بعناية مع حليب بارد وثلج',
            sort_order: 2,
            available: true
        },
        {
            id: 3,
            name: 'كيكة العسل الروسية',
            price: 25,
            category_id: 4,
            image_url: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=500&q=80',
            description: 'كيكة العسل الروسية الهشة بطبقات الكريمة الغنية',
            sort_order: 3,
            available: true
        },
        {
            id: 4,
            name: 'عصير برتقال طازج',
            price: 15,
            category_id: 3,
            image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80',
            description: 'عصير برتقال طازج طبيعي 100% معصور يومياً',
            sort_order: 4,
            available: true
        },
        {
            id: 5,
            name: 'V60 كولومبي',
            price: 28,
            category_id: 1,
            image_url: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?auto=format&fit=crop&w=500&q=80',
            description: 'قهوة مقطرة كولومبية فاخرة بنكهات حمضية متوازنة',
            sort_order: 5,
            available: true
        },
        {
            id: 6,
            name: 'كورتادو كلاسيك',
            price: 18,
            category_id: 1,
            image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
            description: 'قهوة مركزة مع حليب مبخر غني',
            sort_order: 6,
            available: true
        },
        {
            id: 7,
            name: 'كيكة الفستق والورد',
            price: 32,
            category_id: 4,
            image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80',
            description: 'طبقات من كيكة الفستق مغطاة بكريمة الورد الطبيعي',
            sort_order: 7,
            available: true
        },
        {
            id: 8,
            name: 'ماتشا لاتيه عضوي',
            price: 24,
            category_id: 2,
            image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80',
            description: 'شاي الماتشا الياباني العضوي الفاخر المخفوق مع الحليب البارد',
            sort_order: 8,
            available: true
        },
        {
            id: 9,
            name: 'فرنش توست بالعسل والتوت',
            price: 45,
            category_id: 4,
            image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&q=80',
            description: 'خبز البريوش الطازج والمحمص يقدم بلمسة من العسل العضوي والتوت',
            sort_order: 9,
            available: true
        },
        {
            id: 10,
            name: 'متة أرجنتينية فاخرة',
            price: 15,
            category_id: 1,
            image_url: 'https://images.pexels.com/photos/5945848/pexels-photo-5945848.jpeg?auto=compress&cs=tinysrgb&w=500',
            description: 'متة أرجنتينية تقليدية تقدم بالقرعة والمصاصة الخاصة مع اختيارك من الأعشاب الطازجة والسكر',
            sort_order: 10,
            available: true
        },
        {
            id: 11,
            name: 'قهوة تركية بالهيل',
            price: 12,
            category_id: 1,
            image_url: 'https://images.unsplash.com/photo-1567878673142-468af383b99b?auto=format&fit=crop&w=500&q=80',
            description: 'قهوة تركية تقليدية محضرة برغوة غنية مع الهيل المطحون',
            sort_order: 11,
            available: true
        },
        {
            id: 12,
            name: 'شاي إنجليزي فاخر بالنعناع',
            price: 10,
            category_id: 1,
            image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
            description: 'شاي أسود منتقى بعناية يقدم مع النعناع الطازج أو الليمون',
            sort_order: 12,
            available: true
        },
        {
            id: 13,
            name: 'موهيتو فواكه استوائية منعش',
            price: 22,
            category_id: 2,
            image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
            description: 'مشروب موهيتو منعش مع قطع الليمون، النعناع الطازج، الثلج ونكهة الفواكه الاستوائية',
            sort_order: 13,
            available: true
        },
        {
            id: 14,
            name: 'ميلك شيك شوكولاتة بلجيكية',
            price: 25,
            category_id: 2,
            image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80',
            description: 'ميلك شيك كريمي غني بنكهة الشوكولاتة البلجيكية الفاخرة والآيس كريم',
            sort_order: 14,
            available: true
        },
        {
            id: 15,
            name: 'عصير رمان طازج طبيعي',
            price: 18,
            category_id: 3,
            image_url: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=500&q=80',
            description: 'عصير رمان طبيعي طازج ومليء بمضادات الأكسدة',
            sort_order: 15,
            available: true
        },
        {
            id: 16,
            name: 'عصير ليمون بالنعناع مثلج',
            price: 15,
            category_id: 3,
            image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
            description: 'عصير ليمون طازج ومخفوق مع أوراق النعناع الخضراء والثلج المجروش',
            sort_order: 16,
            available: true
        },
        {
            id: 17,
            name: 'مشاوي غاردن المشكلة',
            price: 65,
            category_id: 5,
            image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
            description: 'تشكيلة فاخرة من شيش طاووق، كباب لحم، وأوصال لحم مشوية على الفحم مع مقبلات وسرفيس',
            sort_order: 17,
            available: true
        },
        {
            id: 18,
            name: 'برغر لحم غاردن فاخر',
            price: 38,
            category_id: 5,
            image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
            description: 'شريحة لحم مشوي على اللهب مع جبن شيدر ذائب، خس، طماطم، وصلصتنا الخاصة في خبز البريوش',
            sort_order: 18,
            available: true
        },
        {
            id: 19,
            name: 'فيتوتشيني ألفريدو بالدجاج',
            price: 42,
            category_id: 5,
            image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=500&q=80',
            description: 'باستا فيتوتشيني بصلصة الكريمة الغنية والفطر، مغطاة بشرائح الدجاج المشوي وجبن البارميزان',
            sort_order: 19,
            available: true
        },
        {
            id: 20,
            name: 'وجبة كريسبي دجاج مقرمش',
            price: 45,
            category_id: 5,
            image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80',
            description: 'قطع دجاج كريسبي مقرمشة تقدم مع بطاطا مقلية، سلطة كولسلو، وثومية غاردن الخاصة',
            sort_order: 20,
            available: true
        },
        {
            id: 21,
            name: 'نرجيلة تفاحتين فاخر كلاسيك',
            price: 30,
            category_id: 7,
            image_url: 'https://images.pexels.com/photos/11091565/pexels-photo-11091565.jpeg?auto=compress&cs=tinysrgb&w=500',
            description: 'أرجيلة بنكهة التفاحتين الكلاسيكية الممتازة والمعتقة بخلطة غاردن الخاصة',
            sort_order: 21,
            available: true
        },
        {
            id: 22,
            name: 'نرجيلة ليمون ونعناع منعش',
            price: 30,
            category_id: 7,
            image_url: 'https://images.pexels.com/photos/4038868/pexels-photo-4038868.jpeg?auto=compress&cs=tinysrgb&w=500',
            description: 'أرجيلة بنكهة الليمون والنعناع المنعشة، مثالية للأجواء الصيفية',
            sort_order: 22,
            available: true
        },
        {
            id: 23,
            name: 'نرجيلة علكة ونعناع بارد',
            price: 30,
            category_id: 7,
            image_url: 'https://images.pexels.com/photos/11091565/pexels-photo-11091565.jpeg?auto=compress&cs=tinysrgb&w=500',
            description: 'أرجيلة بنكهة العلكة الحلوة مع لمسة باردة من النعناع',
            sort_order: 23,
            available: true
        },
        {
            id: 24,
            name: 'فوندان شوكولاتة دافئ',
            price: 28,
            category_id: 4,
            image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
            description: 'كيكة شوكولاتة دافئة محشوة بالشوكولاتة السائلة الذائبة تقدم مع آيس كريم فانيليا',
            sort_order: 24,
            available: true
        },
        {
            id: 25,
            name: 'بطاطا مقلية مقرمشة متبلة',
            price: 15,
            category_id: 6,
            image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80',
            description: 'أصابع بطاطا مقلية ذهبية ومقرمشة ومتبلة ببهارات غاردن اللذيذة',
            sort_order: 25,
            available: true
        },
        {
            id: 26,
            name: 'أصابع الموزاريلا الذائبة مقرمشة',
            price: 22,
            category_id: 6,
            image_url: 'https://images.unsplash.com/photo-1531749668029-2db88e4b76c7?auto=format&fit=crop&w=500&q=80',
            description: 'أصابع جبنة الموزاريلا المغطاة بالبقسماط المقلي والمقرمش تقدم مع صلصة المارينارا',
            sort_order: 26,
            available: true
        },
        {
            id: 27,
            name: 'حمص بيروتي باللحمة والصنوبر',
            price: 25,
            category_id: 6,
            image_url: 'https://images.unsplash.com/photo-1577906096429-f73ee2f3362e?auto=format&fit=crop&w=500&q=80',
            description: 'حمص كريمي تقليدي مغطى بقطع اللحم المشوي والصنوبر المحمص مع زيت الزيتون',
            sort_order: 27,
            available: true
        },
        {
            id: 28,
            name: 'كبة مشوية فاخرة باللحم والدهن',
            price: 28,
            category_id: 6,
            image_url: 'https://images.pexels.com/photos/12419159/pexels-photo-12419159.jpeg?auto=compress&cs=tinysrgb&w=500',
            description: 'أقراص كبة مشوية على الفحم محشوة باللحم المفروم والمكسرات والدهن البلدي',
            sort_order: 28,
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
        this.useFirebase = false;
        this.db = null;
    }

    isFirebaseEnabled() {
        return typeof firebase !== 'undefined' && 
               typeof firebaseConfig !== 'undefined' && 
               firebaseConfig.apiKey && 
               firebaseConfig.apiKey !== 'YOUR_API_KEY';
    }

    // Initialize data from Firebase Firestore, localStorage or fetch Excel files
    async init() {
        if (this.initialized) return;

        if (this.isFirebaseEnabled()) {
            try {
                // Initialize Firebase if not already initialized
                if (firebase.apps.length === 0) {
                    firebase.initializeApp(firebaseConfig);
                }
                this.db = firebase.firestore();
                this.useFirebase = true;
                console.log('Firebase Firestore initialized successfully.');

                // Fetch Categories
                const categoriesSnapshot = await this.db.collection('categories').get();
                if (categoriesSnapshot.empty) {
                    console.log('Firestore categories empty. Seeding defaults...');
                    for (const cat of FALLBACK_DATA.categories) {
                        await this.db.collection('categories').doc(String(cat.id)).set(cat);
                    }
                    this.categories = [...FALLBACK_DATA.categories];
                } else {
                    this.categories = [];
                    categoriesSnapshot.forEach(doc => {
                        const data = doc.data();
                        this.categories.push({
                            id: Number(data.id),
                            name: String(data.name),
                            icon: String(data.icon || 'coffee'),
                            sort_order: Number(data.sort_order || 99)
                        });
                    });
                }

                // Fetch Products
                const productsSnapshot = await this.db.collection('products').get();
                if (productsSnapshot.empty) {
                    console.log('Firestore products empty. Seeding defaults...');
                    for (const prod of FALLBACK_DATA.products) {
                        await this.db.collection('products').doc(String(prod.id)).set(prod);
                    }
                    this.products = [...FALLBACK_DATA.products];
                } else {
                    this.products = [];
                    productsSnapshot.forEach(doc => {
                        const data = doc.data();
                        this.products.push({
                            id: Number(data.id),
                            name: String(data.name),
                            price: Number(data.price),
                            category_id: Number(data.category_id),
                            image_url: String(data.image_url || ''),
                            description: String(data.description || ''),
                            sort_order: Number(data.sort_order || 99),
                            available: data.available === true || String(data.available).trim().toUpperCase() === 'TRUE' || data.available === 1
                        });
                    });
                }

                // Fetch Settings
                const settingsDoc = await this.db.collection('settings').doc('general').get();
                if (!settingsDoc.exists) {
                    console.log('Firestore settings general empty. Seeding defaults...');
                    await this.db.collection('settings').doc('general').set(FALLBACK_DATA.settings);
                    this.settings = { ...FALLBACK_DATA.settings };
                } else {
                    this.settings = settingsDoc.data();
                }

                this.saveToLocalStorage();
                this.initialized = true;
                this.applyThemeColor();
                return;
            } catch (e) {
                console.warn('Firebase connection failed, falling back to local files:', e.message);
                this.useFirebase = false;
            }
        }

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
        return this.categories.find(c => c.id === Number(id));
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

        if (this.useFirebase && this.db) {
            this.db.collection('categories').doc(String(nextId)).set(newCat)
                .catch(err => console.error('Firestore write error:', err));
        }

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

            if (this.useFirebase && this.db) {
                this.db.collection('categories').doc(String(id)).update(updatedFields)
                    .catch(err => console.error('Firestore update error:', err));
            }

            return this.categories[catIndex];
        }
        return null;
    }

    deleteCategory(id) {
        this.categories = this.categories.filter(c => c.id !== Number(id));
        this.products = this.products.filter(p => p.category_id !== Number(id));
        this.saveToLocalStorage();

        if (this.useFirebase && this.db) {
            this.db.collection('categories').doc(String(id)).delete()
                .catch(err => console.error('Firestore delete error:', err));
            // Orphaned products in firebase should be handled
            this.db.collection('products').where('category_id', '==', Number(id)).get().then(snapshot => {
                snapshot.forEach(doc => {
                    doc.ref.delete().catch(err => console.error(err));
                });
            });
        }
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

        if (this.useFirebase && this.db) {
            this.db.collection('products').doc(String(nextId)).set(newProd)
                .catch(err => console.error('Firestore write error:', err));
        }

        return newProd;
    }

    updateProduct(id, updatedFields) {
        const prodIndex = this.products.findIndex(p => p.id === Number(id));
        if (prodIndex > -1) {
            const parsedFields = {
                ...updatedFields,
                id: Number(id)
            };
            if (updatedFields.price !== undefined) parsedFields.price = Number(updatedFields.price);
            if (updatedFields.category_id !== undefined) parsedFields.category_id = Number(updatedFields.category_id);
            if (updatedFields.sort_order !== undefined) parsedFields.sort_order = Number(updatedFields.sort_order);

            this.products[prodIndex] = {
                ...this.products[prodIndex],
                ...parsedFields
            };
            this.saveToLocalStorage();

            if (this.useFirebase && this.db) {
                this.db.collection('products').doc(String(id)).update(parsedFields)
                    .catch(err => console.error('Firestore update error:', err));
            }

            return this.products[prodIndex];
        }
        return null;
    }

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== Number(id));
        this.saveToLocalStorage();

        if (this.useFirebase && this.db) {
            this.db.collection('products').doc(String(id)).delete()
                .catch(err => console.error('Firestore delete error:', err));
        }
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

        if (this.useFirebase && this.db) {
            this.db.collection('settings').doc('general').set(this.settings)
                .catch(err => console.error('Firestore settings write error:', err));
        }

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

    // Reset everything back to default seed data (clearing local modifications and Firestore)
    async resetToDefault() {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        
        if (this.useFirebase && this.db) {
            try {
                console.log('Resetting Firebase Firestore database to default...');
                
                // Delete all categories in Firebase
                const catSnapshot = await this.db.collection('categories').get();
                const catPromises = catSnapshot.docs.map(doc => doc.ref.delete());
                await Promise.all(catPromises);
                
                // Delete all products in Firebase
                const prodSnapshot = await this.db.collection('products').get();
                const prodPromises = prodSnapshot.docs.map(doc => doc.ref.delete());
                await Promise.all(prodPromises);
                
                // Delete settings
                await this.db.collection('settings').doc('general').delete();
                console.log('Firebase database wiped successfully. Will re-seed during initialization.');
            } catch (err) {
                console.error('Error clearing Firestore on reset:', err);
            }
        }
        
        this.initialized = false;
        await this.init();
    }
}

// Export singleton instance globally
window.dataService = new DataService();
