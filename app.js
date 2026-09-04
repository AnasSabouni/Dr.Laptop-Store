// ===== تطبيق Dr.Laptop =====

class StorageManager {
    static getProducts() {
        const saved = localStorage.getItem('drlaptop-products');
        return saved ? JSON.parse(saved) : [];
    }

    static saveProducts(products) {
        localStorage.setItem('drlaptop-products', JSON.stringify(products));
    }

    static getCart() {
        const saved = localStorage.getItem('drlaptop-cart');
        return saved ? JSON.parse(saved) : [];
    }

    static saveCart(cart) {
        localStorage.setItem('drlaptop-cart', JSON.stringify(cart));
    }

    static getCustomers() {
        const saved = localStorage.getItem('drlaptop-customers');
        return saved ? JSON.parse(saved) : [];
    }

    static saveCustomer(customer) {
        const customers = this.getCustomers();
        customer.id = Date.now();
        customer.date = new Date().toLocaleString('ar-SA');
        customers.push(customer);
        localStorage.setItem('drlaptop-customers', JSON.stringify(customers));
        return customer;
    }
}

class CartManager {
    constructor() {
        this.items = StorageManager.getCart();
        this.updateCartCount();
    }

    add(productId) {
        const products = StorageManager.getProducts();
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.discount ? product.price * (1 - product.discount/100) : product.price,
                image: product.image,
                quantity: 1
            });
        }
        this.save();
        this.showNotification(`تمت إضافة ${product.name} إلى السلة`);
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                this.remove(productId);
            } else {
                this.save();
            }
        }
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    save() {
        StorageManager.saveCart(this.items);
        this.updateCartCount();
        this.render();
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = count;
    }

    render() {
        const container = document.getElementById('cart-body');
        const totalElement = document.getElementById('cart-total');
        if (!container) return;
        if (this.items.length === 0) {
            container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i><h4>سلة التسوق فارغة</h4><p>أضف بعض المنتجات من المتجر</p></div>`;
            if (totalElement) totalElement.textContent = '0 $';
            return;
        }
        container.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} $</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="cart.remove(${item.id})"><i class="fas fa-trash"></i> حذف</button>
                    </div>
                </div>
            </div>
        `).join('');
        if (totalElement) totalElement.textContent = this.formatPrice(this.getTotal()) + ' $';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div style="background: #10b981; color: white; padding: 15px 20px; border-radius: 8px; position: fixed; top: 100px; right: 20px; z-index: 1002; box-shadow: 0 5px 15px rgba(0,0,0,0.2); animation: slideIn 0.3s ease;">
                <i class="fas fa-check-circle" style="margin-left: 10px;"></i>
                ${message}
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    formatPrice(price) { return price.toLocaleString('ar-SA'); }
}

class ProductManager {
    constructor() {
        this.products = StorageManager.getProducts();
        this.currentFilter = 'laptops';
        this.currentLaptopSubfilter = 'all';
        this.currentAccessorySubfilter = 'all';
    }

    filterByCategory(category) {
        this.currentFilter = category;
        if (category === 'accessories') this.currentAccessorySubfilter = 'all';
        if (category === 'laptops') this.currentLaptopSubfilter = 'all';
        this.render();
    }

    search(query) {
        if (!query.trim()) { this.render(); return; }
        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.includes(query.toLowerCase())
        );
        this.render(filtered);
    }

    render(productsToShow = null) {
        const container = document.getElementById('products-grid');
        if (!container) return;
        let products = productsToShow;
        if (!products) {
            if (this.currentFilter === 'all' || !this.currentFilter) { products = this.products; }
            else if (this.currentFilter === 'laptops') { products = this.products.filter(p => p.category !== 'accessories'); }
            else if (this.currentFilter === 'accessories') { products = this.products.filter(p => p.category === 'accessories'); }
            else { products = this.products.filter(p => p.category === this.currentFilter); }
        }

        if (products.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-laptop" style="font-size: 4rem; color: #e2e8f0; margin-bottom: 20px;"></i>
                    <h3 style="color: #64748b; margin-bottom: 10px;">لا توجد منتجات</h3>
                </div>
            `;
            return;
        }

        const accessories = products.filter(p => p.category === 'accessories');
        const laptops = products.filter(p => p.category !== 'accessories');

        function laptopSubFor(product) {
            if (product.category === 'gaming') return 'gaming';
            if (product.category === 'premium') return 'engineering';
            if (product.category === 'business' || product.category === 'student') return 'office';
            return 'other';
        }

        function accessoryTypeFor(product) {
            const name = (product.name || '').toLowerCase();
            if (name.includes('ماوس')) return 'ماوس';
            if (name.includes('لوحة') || name.includes('لوحة مفاتيح')) return 'لوحة';
            if (name.includes('حقيبة')) return 'حقيبة';
            if (name.includes('شاحن')) return 'شاحن';
            if (name.includes('مروحة')) return 'مروحة';
            if (name.includes('حامل')) return 'حامل';
            return 'أخرى';
        }

        const accessoryTypes = Array.from(new Set(accessories.map(accessoryTypeFor)));
        const filteredLaptops = laptops.filter(p => this.currentLaptopSubfilter === 'all' || laptopSubFor(p) === this.currentLaptopSubfilter);
        const filteredAccessories = accessories.filter(p => this.currentAccessorySubfilter === 'all' || accessoryTypeFor(p) === this.currentAccessorySubfilter);

        let html = '';
        if (this.currentFilter !== 'accessories') {
            html += `
            <div style="grid-column: 1 / -1;">
                <div style="text-align: right; margin-bottom: 12px;">
                    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-start;">
                        <button class="filter-btn laptop-subfilter ${this.currentLaptopSubfilter === 'all' ? 'active' : ''}" data-sub="all">الكل</button>
                        <button class="filter-btn laptop-subfilter ${this.currentLaptopSubfilter === 'gaming' ? 'active' : ''}" data-sub="gaming">جيمينج</button>
                        <button class="filter-btn laptop-subfilter ${this.currentLaptopSubfilter === 'engineering' ? 'active' : ''}" data-sub="engineering">هندسي</button>
                        <button class="filter-btn laptop-subfilter ${this.currentLaptopSubfilter === 'office' ? 'active' : ''}" data-sub="office">مكتبي</button>
                    </div>
                </div>
                <div class="products-grid">${filteredLaptops.map(product => this._productCardHTML(product)).join('')}</div>
            </div>`;
        }

        if (this.currentFilter !== 'laptops') {
            html += `
            <div style="grid-column: 1 / -1; margin-top: 40px;">
                <div style="text-align: right; margin-bottom: 12px;">
                    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-start;">
                        <button class="filter-btn accessory-subfilter ${this.currentAccessorySubfilter === 'all' ? 'active' : ''}" data-sub="all">الكل</button>
                        ${accessoryTypes.map(t => `<button class="filter-btn accessory-subfilter ${this.currentAccessorySubfilter === t ? 'active' : ''}" data-sub="${t}">${t}</button>`).join('')}
                    </div>
                </div>
                <div class="products-grid">${filteredAccessories.map(product => this._productCardHTML(product)).join('')}</div>
            </div>`;
        }
        container.innerHTML = html;
    }

    _productCardHTML(product) {
        return `
            <div class="product-card">
                ${product.discount > 0 ? `<div class="product-badge">خصم ${product.discount}%</div>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-specs">
                        ${product.specs && product.specs.processor ? `<span class="product-spec">${product.specs.processor}</span>` : ''}
                        ${product.specs && product.specs.ram ? `<span class="product-spec">${product.specs.ram}</span>` : ''}
                        ${product.specs && product.specs.storage ? `<span class="product-spec">${product.specs.storage}</span>` : ''}
                    </div>
                    <div class="product-price">
                        ${product.discount > 0 ? `<span class="original-price">${product.price.toLocaleString('ar-SA')} $</span>` : ''}
                        <span class="current-price">${product.discount > 0 ? (product.price * (1 - product.discount/100)).toLocaleString('ar-SA') : product.price.toLocaleString('ar-SA')} $</span>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart" onclick="cart.add(${product.id})"><i class="fas fa-cart-plus"></i> أضف للسلة</button>
                        <button class="view-details" onclick="showProductDetails(${product.id})"><i class="fas fa-eye"></i> تفاصيل</button>
                        <button class="zoom-view" onclick="showProductZoom(${product.id})"><i class="fas fa-search-plus"></i> تكبير</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function showProductDetails(productId) {
    const products = StorageManager.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const modalHTML = `
        <div class="modal-overlay" id="product-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: white; border-radius: 15px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
                <button onclick="closeModal()" style="position: absolute; top: 15px; left: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #333;">&times;</button>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px;">
                    <div><img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;"></div>
                    <div>
                        <h2 style="margin-bottom: 15px; color: #1e293b;">${product.name}</h2>
                        <p style="color: #64748b; margin-bottom: 20px;">${product.description}</p>
                        <div style="margin-bottom: 20px;">
                            <h3 style="margin-bottom: 10px; color: #1e293b;"><i class="fas fa-list-alt"></i> المواصفات</h3>
                            <ul style="color: #475569; list-style: none; padding: 0;">
                                ${product.specs.processor ? `<li><strong>المعالج:</strong> ${product.specs.processor}</li>` : ''}
                                ${product.specs.ram ? `<li><strong>الذاكرة:</strong> ${product.specs.ram}</li>` : ''}
                                ${product.specs.storage ? `<li><strong>التخزين:</strong> ${product.specs.storage}</li>` : ''}
                                ${product.specs.display ? `<li><strong>الشاشة:</strong> ${product.specs.display}</li>` : ''}
                            </ul>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                            ${product.discount > 0 ? `
                                <span style="text-decoration: line-through; color: #94a3b8;">${product.price.toLocaleString('ar-SA')} $</span>
                                <span style="font-size: 1.8rem; font-weight: 800; color: #3b82f6;">${(product.price * (1 - product.discount/100)).toLocaleString('ar-SA')} $</span>
                                <span style="background: #ef4444; color: white; padding: 5px 10px; border-radius: 20px;">خصم ${product.discount}%</span>
                            ` : `<span style="font-size: 1.8rem; font-weight: 800; color: #3b82f6;">${product.price.toLocaleString('ar-SA')} $</span>`}
                        </div>
                        <button onclick="cart.add(${product.id}); closeModal();" style="background: #3b82f6; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1rem; cursor: pointer; width: 100%;"><i class="fas fa-cart-plus"></i> أضف إلى السلة</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.remove();
}

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) scrollBtn.classList.add('visible');
        else scrollBtn.classList.remove('visible');
    });
    scrollBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const opened = navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll', opened);
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => { navLinks.classList.remove('active'); document.body.classList.remove('no-scroll'); });
        });
    }
}

let cart, productManager;

// جلب المنتجات فورياً من GitHub عبر JSON
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('products.json?t=' + new Date().getTime());
        if (response.ok) {
            const data = await response.json();
            StorageManager.saveProducts(data);
        }
    } catch (e) {
        console.warn('استخدام النسخة المحلية نظراً لعدم توفر products.json');
    }

    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }, 1000);
   
    const loadingProducts = document.getElementById('loading-products');
    if (loadingProducts) loadingProducts.style.display = 'none';

    cart = new CartManager();
    productManager = new ProductManager();
   
    setupEventListeners();
    setupScrollToTop();
    setupMobileMenu();
    cart.render();
});

function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            productManager.filterByCategory(this.dataset.filter);
        });
    });
   
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    if (searchInput) {
        searchInput.addEventListener('input', function() { productManager.search(this.value); });
        searchInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') productManager.search(this.value); });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', function() { if(searchInput) productManager.search(searchInput.value); });
    }

    const showLaptopsBtn = document.getElementById('show-laptops-btn');
    const showAccessoriesBtn = document.getElementById('show-accessories-btn');
    const productsArea = document.getElementById('products-area');

    function revealProductsArea() { if (productsArea) productsArea.style.display = 'block'; }

    if (showLaptopsBtn) {
        showLaptopsBtn.addEventListener('click', () => {
            revealProductsArea();
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            const btn = document.querySelector('.filter-btn[data-filter="laptops"]');
            if (btn) btn.classList.add('active');
            productManager.filterByCategory('laptops');
        });
    }

    if (showAccessoriesBtn) {
        showAccessoriesBtn.addEventListener('click', () => {
            revealProductsArea();
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            const btn = document.querySelector('.filter-btn[data-filter="accessories"]');
            if (btn) btn.classList.add('active');
            productManager.filterByCategory('accessories');
        });
    }
   
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (cartIcon) cartIcon.addEventListener('click', () => { document.getElementById('cart-sidebar').classList.add('active'); cart.render(); });
    if (closeCart) closeCart.addEventListener('click', () => { document.getElementById('cart-sidebar').classList.remove('active'); });
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => { alert("شاشة الدفع"); });

    document.addEventListener('click', function(e) {
        const laptopBtn = e.target.closest && e.target.closest('.laptop-subfilter');
        if (laptopBtn) { productManager.currentLaptopSubfilter = laptopBtn.dataset.sub; productManager.render(); return; }
        const accBtn = e.target.closest && e.target.closest('.accessory-subfilter');
        if (accBtn) { productManager.currentAccessorySubfilter = accBtn.dataset.sub; productManager.render(); return; }
    });
}

window.cart = cart;
window.productManager = productManager;
window.showProductDetails = showProductDetails;
window.closeModal = closeModal;