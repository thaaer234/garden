/**
 * mobile-nav.js
 * Web Component for mobile bottom navigation in the Admin panel.
 */

class AdminMobileNav extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        const isDashboard = path.includes('dashboard.html');
        const isCategories = path.includes('categories.html');
        const isProducts = path.includes('products.html');
        const isSettings = path.includes('settings.html');

        this.innerHTML = `
            <nav class="admin-mobile-nav">
                <a class="nav-item-mobile ${isDashboard ? 'active' : ''}" href="dashboard.html">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isDashboard ? 1 : 0};">dashboard</span>
                    <span class="nav-label-mobile">الرئيسية</span>
                </a>
                <a class="nav-item-mobile ${isCategories ? 'active' : ''}" href="categories.html">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isCategories ? 1 : 0};">category</span>
                    <span class="nav-label-mobile">التصنيفات</span>
                </a>
                <a class="nav-item-mobile ${isProducts ? 'active' : ''}" href="products.html">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isProducts ? 1 : 0};">المنتجات</span>
                    <span class="nav-label-mobile">المنتجات</span>
                </a>
                <a class="nav-item-mobile ${isSettings ? 'active' : ''}" href="settings.html">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${isSettings ? 1 : 0};">settings</span>
                    <span class="nav-label-mobile">الإعدادات</span>
                </a>
            </nav>
        `;
    }
}

customElements.define('admin-mobile-nav', AdminMobileNav);
