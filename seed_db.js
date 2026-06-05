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
    { id: 4, name: 'الحلويات', icon: 'cake', sort_order: 4 }
];

// Products Data
const productsData = [
    {
        id: 1,
        name: 'فلات وايت كلاسيك',
        price: 22,
        category_id: 1,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnOhxqJRVEj532m2oZ9pDotI6jBDiuNAHL0QySz01pvWMGmKSI_Dok3kqDGKES5ZpzLn0GE9-8gYfstEryt0lDukd3WIApYBn1Lu1XlA0IjtDZYfPDG4l6AfbjE9M_JqIUmwV-kgbW-s2ac8rDuVHad6b_Wj8mCmlxlxtKnUDBNgvkhhI8SdQ5ioIVbrVIEp8Rt80g2fuI2L5st4usPpL5qLQ-AGV4TIlPyFL1-z6OF4xVdbUP3WIhWebk233I8IcuUZKwmu3fo6qE',
        description: 'حبوب مختصة محمصة بعناية مع حليب مبخر غني',
        sort_order: 1,
        available: 'TRUE'
    },
    {
        id: 2,
        name: 'آيس لاتيه',
        price: 18,
        category_id: 2,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHErX8pF6F_1gyx7fRGRU3UYjdzHEkw2c3nIX1OWfc9_6jbSrcXWjjK9sMLAHOr4lItTUnpNFdEjg03irmVEXbjjbMl4m5OEonfnPURmKlLQSLRJI7hvCePQEhVYoIUhBKSIjxuJNqV42IuXJF7NraH57iJRWdNbUz3vQsSjzQrr-s-ORBurhJ0uvRktR8DO5xlj_jfMNEFUKEYgOn6mOq1QbfpN2nt2bmT4JCnmfB-qN0TDjuWPY6v6p2J5gxglr2HYm-Y68X3U9G',
        description: 'حبوب بن مختارة بعناية مع حليب بارد وثلج',
        sort_order: 2,
        available: 'TRUE'
    },
    {
        id: 3,
        name: 'كيكة العسل',
        price: 25,
        category_id: 4,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDLQA4i0KeOF7p4TYvwWfFHRTpfxtmXq7q_NRYcnWkC5-KmDewdgOJyyLDn10ZQfxjESozCQsMh3DzuitvSvQjoCNTgSH9ARb0EWugi5-uYXXzgOdK6WnFLl3-yXiJIuIWIRcuUIh-vITyrqYPJMnM12HWmhI3LPRPLENtveJpoTUvxnV5UJbqHRIvx6DXAaKi9eEz2NJ4dMoxWehiY7THwmT-B4Z6_HuV5XxWhpXaUU_XdE-lcSAC5PyNRVUDlCf3iTaXphQ3CPVK',
        description: 'كيكة العسل الروسية الهشة بطبقات الكريمة الغنية',
        sort_order: 3,
        available: 'TRUE'
    },
    {
        id: 4,
        name: 'عصير برتقال طازج',
        price: 15,
        category_id: 3,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBXvFHdiYN7K5Dw4kEc3hOLUxmAfpjNyki0W33UZxR4V_JdO7z-OFcvyxVENMUB-JUZGCoQSIi7sdrOpzzLt4cLtqzsIKE58bJy94KJNKAklenASHOIsCMPz6-eAfK1zmZ9663DejVKxe3oy07bsJxzdAGLUka1ZOQjMLTrMqwzlaEL7uX1eoS725S7FU1CA6i4Nz0_vZXW7l6FBb6N5tGeCSU9mNyVXZ6jl247nF_xjEojjt4rfuZWjQHZVp-i7nRQGDeUHUHBdJ5',
        description: 'عصير برتقال طازج معصور بارداً يومياً',
        sort_order: 4,
        available: 'TRUE'
    },
    {
        id: 5,
        name: 'V60 كولومبي',
        price: 28,
        category_id: 1,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABFJWhFZBfLC30TJn9woAHS9gfGZF6FKpxmNIQrIib54XOQV4gIIxUDkGJiFujKC2djX61NR7-RDSHW9V6JwBCYLRBwT5Ir2Cj29t_9lrGZ1Q5_rb7o6uRf7i1I0OSY2mKZV99cBzLNGGMrKxBw1GRk5IX0ovwK_w2EQR0CNe5ZgwULEv2N-hi7ypOCCKCxDS1reXZSAsVQWGzNRsZw9crdvW_CIOrI3FPKFgHtro_Ulpk4tFK3edYK8dF5ltpWUoB38U_X-xV4fHw',
        description: 'قهوة مقطرة كولومبية فاخرة بنكهات حمضية متوازنة',
        sort_order: 5,
        available: 'TRUE'
    },
    {
        id: 6,
        name: 'كورتادو كلاسيك',
        price: 18,
        category_id: 1,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaQgQE9nTfEBYIhX8hOryVU3cZWU33OW0ddYo-QJKw6ZBGEWzKor3kbcT7Lk60S_jMDPi58IrwlEGedXIR9NIw85rs-HCYH1GWFi_hkKs76I26JVJaGz3DM6zGg5KWk7TxBLW8dcMR8Ond9U8tJB1MucQ4CUOlDZJdnWhywIrBD3La6A1pl2p-sM98Ocbnscqna1ophJeyN13pj9XeZJDmPjA5eg2X6cK4nyFkGjsygG7COkgMF6DcGZVJvaGrm5VA-jbk898J2w7T',
        description: 'قهوة مركزة مع حليب مبخر غني',
        sort_order: 6,
        available: 'TRUE'
    },
    {
        id: 7,
        name: 'كيكة الفستق والورد',
        price: 32,
        category_id: 4,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQlag-sP07kReGrdZiFF0pfawNWj7fCZkXO7L6vXzWsqOHq-jqys3J3-0so5ZukRbEPESgIzd-xa-a5jafWSeMepU5vp-KIv1TMBezUzvsU8eekE9TVQNykG55VZoTAHrdZ8kylYO8UjQYPnglJRcOwdgNle24kvcWDeIluQku0Tz-iJI1FtszROTHw4VXVhW5Mbu5jcnRO24sR-046G1blHByD6HePoI7YE7TNo_QzOixMPVrzLCRQclbF3CHjVRIsp8-CK0JHLAb',
        description: 'طبقات من كيكة الفستق مغطاة بكريمة الورد الطبيعي',
        sort_order: 7,
        available: 'TRUE'
    },
    {
        id: 8,
        name: 'ماتشا لاتيه عضوي',
        price: 24,
        category_id: 2,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaL36lCaYjMTR-nT5UmvU0FxvZ2yrTpDKsRdvGXr1asbAPQIndhJrmOvBoQA04_M1ltOyAPQGoS8jQ3e_huF2kqLhEOpeDAfTsF0g82mdA1YMEg6EjyugB3tFQf_MacZ7yP8xztK4tPvBQ8J_ehM5fsvfLIICYDkg4544_-YfyQXdOfyzD0meiqiRSVGjmvpniKzvoAxhvAY-IdaYY_5hP6MvXznQvz3en8v7oHWUvYmmR1BxQFiQiofJoCGBFHGwKP65OWYH9xGKo',
        description: 'شاي الماتشا الياباني العضوي الفاخر المخفوق مع الحليب',
        sort_order: 8,
        available: 'FALSE'
    },
    {
        id: 9,
        name: 'فرنش توست بالعسل',
        price: 45,
        category_id: 4,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClm-ZwHmH_cf1iZT0TmPg52_cnh06c1SLWnSeuNp6w-OqjIq1JSYyLNcUt97E2EMUNuZEEQ0tuNMQwFKU7CEpiXr3B8VS85F1bB3HcRi1wcGuq7g_FA4VNmKdKrsw_Ys7A2Lr_bpdmOLOENzw7D_b0IY-pmVPkHx1tcbNtYO4UEiwVNo4IEqG7heiwtSlY0G3pbKYpYnjpuRogrjlt1Je8Aomhk3wnt8NNn_8wxHUqudCcEOT40Z9RMnqKag4XWk6WgLwEadzDOHsc',
        description: 'خبز البريوش الطازج والمحمص يقدم بلمسة من العسل العضوي والتوت',
        sort_order: 9,
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
