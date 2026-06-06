const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Categories Data
const categoriesData = [
    { id: 1, name: 'المشروبات الساخنة', icon: 'coffee', sort_order: 1 },
    { id: 2, name: 'المشروبات الباردة', icon: 'icecream', sort_order: 2 },
    { id: 3, name: 'العصائر الطبيعية', icon: 'local_bar', sort_order: 3 },
    { id: 4, name: 'الحلويات', icon: 'cake', sort_order: 4 },
    { id: 5, name: 'المأكولات الرئيسية', icon: 'flatware', sort_order: 5 },
    { id: 6, name: 'المقبلات اللذيذة', icon: 'cookie', sort_order: 6 },
    { id: 7, name: 'الأراجيل المميزة', icon: 'local_fire_department', sort_order: 7 }
];

// Products Data
const productsData = [
    {
        id: 1,
        name: 'فلات وايت كلاسيك',
        price: 22,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=500&q=80',
        description: 'حبوب مختصة محمصة بعناية مع حليب مبخر غني',
        sort_order: 1,
        available: 'TRUE'
    },
    {
        id: 2,
        name: 'آيس لاتيه',
        price: 18,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80',
        description: 'حبوب بن مختارة بعناية مع حليب بارد وثلج',
        sort_order: 2,
        available: 'TRUE'
    },
    {
        id: 3,
        name: 'كيكة العسل الروسية',
        price: 25,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=500&q=80',
        description: 'كيكة العسل الروسية الهشة بطبقات الكريمة الغنية',
        sort_order: 3,
        available: 'TRUE'
    },
    {
        id: 4,
        name: 'عصير برتقال طازج',
        price: 15,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80',
        description: 'عصير برتقال طازج طبيعي 100% معصور يومياً',
        sort_order: 4,
        available: 'TRUE'
    },
    {
        id: 5,
        name: 'V60 كولومبي',
        price: 28,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?auto=format&fit=crop&w=500&q=80',
        description: 'قهوة مقطرة كولومبية فاخرة بنكهات حمضية متوازنة',
        sort_order: 5,
        available: 'TRUE'
    },
    {
        id: 6,
        name: 'كورتادو كلاسيك',
        price: 18,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
        description: 'قهوة مركزة مع حليب مبخر غني',
        sort_order: 6,
        available: 'TRUE'
    },
    {
        id: 7,
        name: 'كيكة الفستق والورد',
        price: 32,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80',
        description: 'طبقات من كيكة الفستق مغطاة بكريمة الورد الطبيعي',
        sort_order: 7,
        available: 'TRUE'
    },
    {
        id: 8,
        name: 'ماتشا لاتيه عضوي',
        price: 24,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80',
        description: 'شاي الماتشا الياباني العضوي الفاخر المخفوق مع الحليب البارد',
        sort_order: 8,
        available: 'TRUE'
    },
    {
        id: 9,
        name: 'فرنش توست بالعسل والتوت',
        price: 45,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&q=80',
        description: 'خبز البريوش الطازج والمحمص يقدم بلمسة من العسل العضوي والتوت',
        sort_order: 9,
        available: 'TRUE'
    },
    {
        id: 10,
        name: 'متة أرجنتينية فاخرة',
        price: 15,
        category_id: 1,
        image_url: 'https://images.pexels.com/photos/5945848/pexels-photo-5945848.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'متة أرجنتينية تقليدية تقدم بالقرعة والمصاصة الخاصة مع اختيارك من الأعشاب الطازجة والسكر',
        sort_order: 10,
        available: 'TRUE'
    },
    {
        id: 11,
        name: 'قهوة تركية بالهيل',
        price: 12,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1567878673142-468af383b99b?auto=format&fit=crop&w=500&q=80',
        description: 'قهوة تركية تقليدية محضرة برغوة غنية مع الهيل المطحون',
        sort_order: 11,
        available: 'TRUE'
    },
    {
        id: 12,
        name: 'شاي إنجليزي فاخر بالنعناع',
        price: 10,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
        description: 'شاي أسود منتقى بعناية يقدم مع النعناع الطازج أو الليمون',
        sort_order: 12,
        available: 'TRUE'
    },
    {
        id: 13,
        name: 'موهيتو فواكه استوائية منعش',
        price: 22,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
        description: 'مشروب موهيتو منعش مع قطع الليمون، النعناع الطازج، الثلج ونكهة الفواكه الاستوائية',
        sort_order: 13,
        available: 'TRUE'
    },
    {
        id: 14,
        name: 'ميلك شيك شوكولاتة بلجيكية',
        price: 25,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80',
        description: 'ميلك شيك كريمي غني بنكهة الشوكولاتة البلجيكية الفاخرة والآيس كريم',
        sort_order: 14,
        available: 'TRUE'
    },
    {
        id: 15,
        name: 'عصير رمان طازج طبيعي',
        price: 18,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=500&q=80',
        description: 'عصير رمان طبيعي طازج ومليء بمضادات الأكسدة',
        sort_order: 15,
        available: 'TRUE'
    },
    {
        id: 16,
        name: 'عصير ليمون بالنعناع مثلج',
        price: 15,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
        description: 'عصير ليمون طازج ومخفوق مع أوراق النعناع الخضراء والثلج المجروش',
        sort_order: 16,
        available: 'TRUE'
    },
    {
        id: 17,
        name: 'مشاوي غاردن المشكلة',
        price: 65,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
        description: 'تشكيلة فاخرة من شيش طاووق، كباب لحم، وأوصال لحم مشوية على الفحم مع مقبلات وسرفيس',
        sort_order: 17,
        available: 'TRUE'
    },
    {
        id: 18,
        name: 'برغر لحم غاردن فاخر',
        price: 38,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
        description: 'شريحة لحم مشوي على اللهب مع جبن شيدر ذائب، خس، طماطم، وصلصتنا الخاصة في خبز البريوش',
        sort_order: 18,
        available: 'TRUE'
    },
    {
        id: 19,
        name: 'فيتوتشيني ألفريدو بالدجاج',
        price: 42,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=500&q=80',
        description: 'باستا فيتوتشيني بصلصة الكريمة الغنية والفطر، مغطاة بشرائح الدجاج المشوي وجبن البارميزان',
        sort_order: 19,
        available: 'TRUE'
    },
    {
        id: 20,
        name: 'وجبة كريسبي دجاج مقرمش',
        price: 45,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80',
        description: 'قطع دجاج كريسبي مقرمشة تقدم مع بطاطا مقلية، سلطة كولسلو، وثومية غاردن الخاصة',
        sort_order: 20,
        available: 'TRUE'
    },
    {
        id: 21,
        name: 'نرجيلة تفاحتين فاخر كلاسيك',
        price: 30,
        category_id: 7,
        image_url: 'https://images.pexels.com/photos/11091565/pexels-photo-11091565.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'أرجيلة بنكهة التفاحتين الكلاسيكية الممتازة والمعتقة بخلطة غاردن الخاصة',
        sort_order: 21,
        available: 'TRUE'
    },
    {
        id: 22,
        name: 'نرجيلة ليمون ونعناع منعش',
        price: 30,
        category_id: 7,
        image_url: 'https://images.pexels.com/photos/4038868/pexels-photo-4038868.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'أرجيلة بنكهة الليمون والنعناع المنعشة، مثالية للأجواء الصيفية',
        sort_order: 22,
        available: 'TRUE'
    },
    {
        id: 23,
        name: 'نرجيلة علكة ونعناع بارد',
        price: 30,
        category_id: 7,
        image_url: 'https://images.pexels.com/photos/11091565/pexels-photo-11091565.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'أرجيلة بنكهة العلكة الحلوة مع لمسة باردة من النعناع',
        sort_order: 23,
        available: 'TRUE'
    },
    {
        id: 24,
        name: 'فوندان شوكولاتة دافئ',
        price: 28,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
        description: 'كيكة شوكولاتة دافئة محشوة بالشوكولاتة السائلة الذائبة تقدم مع آيس كريم فانيليا',
        sort_order: 24,
        available: 'TRUE'
    },
    {
        id: 25,
        name: 'بطاطا مقلية مقرمشة متبلة',
        price: 15,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80',
        description: 'أصابع بطاطا مقلية ذهبية ومقرمشة ومتبلة ببهارات غاردن اللذيذة',
        sort_order: 25,
        available: 'TRUE'
    },
    {
        id: 26,
        name: 'أصابع الموزاريلا الذائبة مقرمشة',
        price: 22,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1531749668029-2db88e4b76c7?auto=format&fit=crop&w=500&q=80',
        description: 'أصابع جبنة الموزاريلا المغطاة بالبقسماط المقلي والمقرمش تقدم مع صلصة المارينارا',
        sort_order: 26,
        available: 'TRUE'
    },
    {
        id: 27,
        name: 'حمص بيروتي باللحمة والصنوبر',
        price: 25,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1577906096429-f73ee2f3362e?auto=format&fit=crop&w=500&q=80',
        description: 'حمص كريمي تقليدي مغطى بقطع اللحم المشوي والصنوبر المحمص مع زيت الزيتون',
        sort_order: 27,
        available: 'TRUE'
    },
    {
        id: 28,
        name: 'كبة مشوية فاخرة باللحم والدهن',
        price: 28,
        category_id: 6,
        image_url: 'https://images.pexels.com/photos/12419159/pexels-photo-12419159.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'أقراص كبة مشوية على الفحم محشوة باللحم المفروم والمكسرات والدهن البلدي',
        sort_order: 28,
        available: 'TRUE'
    }
];

// Settings Data
const settingsData = [
    { restaurant_name: 'غاردن | GARDEN', logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOKD5IIKKED5hyF4vSUER3j2oZiW79qNlsTmM1dQF4Ua_JXd8oWTduH43Bn14VcdoVZyl1X9C0Os6U4VAHoz__FMpYndI5FojrQdpr5JAy9rOiyA1nkFUNxeWYv-Iknoq_Q194q0wTo_jAwgQZ5rQtHXjAYboYg-3vbl3LD5yhdLAyBImrpXWDnmUm-y0G14VNIoXR08-vhGDS2n-3P_6XVh7NEPi8Kx-n7PakLj3P1o-1OT4IVl5gs7jDCcr1jQjzUplIuA4P0B4e', theme_color: '#061b0e' }
];

function createExcel(data, fileName, sheetName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const filePath = path.join(dataDir, fileName);
    XLSX.writeFile(wb, filePath);
    console.log(`Created ${filePath}`);
}

createExcel(categoriesData, 'categories.xlsx', 'Categories');
createExcel(productsData, 'products.xlsx', 'Products');
createExcel(settingsData, 'settings.xlsx', 'Settings');
console.log('Database files seeded successfully.');
