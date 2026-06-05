/**
 * admin-sidebar.js
 * Reusable Web Component for the Admin panel sidebar.
 * Automatically highlights the active link based on the current page URL.
 */

class AdminSidebar extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        const isDashboard = path.includes('dashboard.html');
        const isCategories = path.includes('categories.html');
        const isProducts = path.includes('products.html');
        const isSettings = path.includes('settings.html');

        this.innerHTML = `
            <aside class="admin-sidebar">
                <div class="sidebar-header">
                    <h1 id="sidebar-restaurant-name">غاردن Admin</h1>
                    <p class="sidebar-subtitle">لوحة التحكم بالنظام</p>
                </div>
                <nav class="sidebar-nav">
                    <a class="sidebar-link ${isDashboard ? 'active' : ''}" href="dashboard.html">
                        <span class="material-symbols-outlined">dashboard</span>
                        <span class="link-text">لوحة التحكم</span>
                    </a>
                    <a class="sidebar-link ${isCategories ? 'active' : ''}" href="categories.html">
                        <span class="material-symbols-outlined">category</span>
                        <span class="link-text">إدارة التصنيفات</span>
                    </a>
                    <a class="sidebar-link ${isProducts ? 'active' : ''}" href="products.html">
                        <span class="material-symbols-outlined">inventory_2</span>
                        <span class="link-text">إدارة المنتجات</span>
                    </a>
                    <a class="sidebar-link ${isSettings ? 'active' : ''}" href="settings.html">
                        <span class="material-symbols-outlined">settings</span>
                        <span class="link-text">إعدادات المتجر</span>
                    </a>
                </nav>
                <div class="sidebar-footer">
                    <div class="admin-profile">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeswvfe25fxXwZCzJFpSjqMgwfaFS8e4r_pbBtireCPHXeC7DQMZEY6hV_1WOZpHOnWw3tgD2lbcYGOgrUbQiPftwkj77L_OlA-64SlwRBTbXb2F5ETmPAFc28GUGly3sYXpOmcuFS9bb4zrkqo4EYrbvnnbpdZGf4haMzrPpT8bgHo870wVPM8TlFcDQi3QcM1wZlqX73ePECqqm8TQB1q8r_NHDbtC7Xvi6_RKVpIs57IJ_XsH_q2cYSIBUZXoY7g72e80HEqqT0" alt="Admin" class="profile-img">
                        <div class="profile-info">
                            <span class="profile-name">أدمن غاردن</span>
                            <span class="profile-role">مدير النظام</span>
                        </div>
                    </div>
                    <a class="sidebar-logout" href="../index.html">
                        <span class="material-symbols-outlined">logout</span>
                        <span class="link-text">الخروج للقائمة</span>
                    </a>
                </div>
            </aside>
        `;

        // Load settings logo or restaurant name if available
        this.updateLogo();
    }

    async updateLogo() {
        if (window.dataService) {
            await window.dataService.init();
            const settings = window.dataService.getSettings();
            if (settings && settings.restaurant_name) {
                const titleNode = this.querySelector('#sidebar-restaurant-name');
                if (titleNode) {
                    titleNode.textContent = settings.restaurant_name + ' Admin';
                }
            }
        }
    }
}

customElements.define('admin-sidebar', AdminSidebar);
