/**
 * admin-header.js
 * Reusable Web Component for the Admin panel top bar.
 * Reads title and subtitle attributes dynamically.
 */

class AdminHeader extends HTMLElement {
    async connectedCallback() {
        const title = this.getAttribute('title') || 'لوحة التحكم';
        const subtitle = this.getAttribute('subtitle') || 'نظرة عامة';

        // Load settings to fetch restaurant logo and details dynamically
        let logoUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOKD5IIKKED5hyF4vSUER3j2oZiW79qNlsTmM1dQF4Ua_JXd8oWTduH43Bn14VcdoVZyl1X9C0Os6U4VAHoz__FMpYndI5FojrQdpr5JAy9rOiyA1nkFUNxeWYv-Iknoq_Q194q0wTo_jAwgQZ5rQtHXjAYboYg-3vbl3LD5yhdLAyBImrpXWDnmUm-y0G14VNIoXR08-vhGDS2n-3P_6XVh7NEPi8Kx-n7PakLj3P1o-1OT4IVl5gs7jDCcr1jQjzUplIuA4P0B4e';
        let restaurantName = 'غاردن';

        if (window.dataService) {
            await window.dataService.init();
            const settings = window.dataService.getSettings();
            if (settings) {
                if (settings.logo_url) logoUrl = settings.logo_url;
                if (settings.restaurant_name) restaurantName = settings.restaurant_name;
            }
        }

        this.innerHTML = `
            <header class="admin-header-bar">
                <div class="header-right">
                    <button class="material-symbols-outlined icon-btn" id="lang-toggle" title="تغيير اللغة">translate</button>
                    <div class="admin-user-badge">
                        <div class="user-info">
                            <span class="user-name">أدمن ${restaurantName}</span>
                            <span class="user-role">مدير النظام</span>
                        </div>
                        <img src="${logoUrl}" alt="Restaurant Logo" class="admin-avatar">
                    </div>
                </div>
                <div class="header-left">
                    <h2 class="header-title">${title}</h2>
                    <nav class="admin-breadcrumbs">
                        <a href="dashboard.html">الرئيسية</a>
                        <span class="breadcrumb-separator">/</span>
                        <span class="breadcrumb-current">${subtitle}</span>
                    </nav>
                </div>
            </header>
        `;

        // Bind basic interaction events
        const langToggle = this.querySelector('#lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                alert('تغيير اللغة قيد التطوير!');
            });
        }
    }
}

customElements.define('admin-header', AdminHeader);
