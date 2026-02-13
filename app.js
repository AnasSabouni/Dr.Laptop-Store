// ===== تطبيق Dr.Laptop =====

// البيانات الافتراضية
const defaultProducts = [
    {
        id: 1,
        name: "لابتوب ديل XPS 15",
        price: 1200,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        mainImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: [
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400"
        ],
        description: "لابتوب قوي للأعمال والألعاب مع شاشة رائعة",
        category: "business",
        discount: 10,
        rating: 4.8,
        inStock: true,
        specs: {
            processor: "Intel Core i7-11800H",
            ram: "16GB DDR4",
            storage: "512GB NVMe SSD",
            display: "15.6 بوصة 4K",
            graphics: "NVIDIA RTX 3050"
        }
    },
    {
        id: 2,
        name: "لابتوب ألعاب أسوس ROG",
        price: 1650,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400",
        mainImage: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400",
        images: [
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"
        ],
        description: "مصمم خصيصاً للألعاب الثقيلة",
        category: "gaming",
        discount: 15,
        rating: 4.9,
        inStock: true,
        specs: {
            processor: "AMD Ryzen 9 5900HX",
            ram: "32GB DDR4",
            storage: "1TB NVMe SSD",
            display: "17.3 بوصة 144Hz",
            graphics: "NVIDIA RTX 3070"
        }
    },
    {
        id: 3,
        name: "ماك بوك برو M2",
        price: 1950,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        mainImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400"
        ],
        description: "أداء استثنائي مع بطارية تدوم طويلاً",
        category: "premium",
        discount: 5,
        rating: 4.7,
        inStock: true,
        specs: {
            processor: "Apple M2 Pro",
            ram: "16GB Unified",
            storage: "512GB SSD",
            display: "14.2 بوصة Liquid Retina",
            graphics: "16-core GPU"
        }
    },
    {
        id: 4,
        name: "لابتوب لينوفو IdeaPad",
        price: 750,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
        mainImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
        images: [
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400"
        ],
        description: "مثالي للطلاب والمهام اليومية",
        category: "student",
        discount: 0,
        rating: 4.2,
        inStock: true,
        specs: {
            processor: "Intel Core i5-1135G7",
            ram: "8GB DDR4",
            storage: "256GB SSD",
            display: "15.6 بوصة FHD",
            graphics: "Intel Iris Xe"
        }
    },
    // الاكسسوارات
    {
        id: 5,
        name: "ماوس لاسلكي بصري",
        price: 25,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1587829191301-44b3d4f2c600?w=400",
        mainImage: "https://images.unsplash.com/photo-1587829191301-44b3d4f2c600?w=400",
        images: [
            "https://images.unsplash.com/photo-1587829191301-44b3d4f2c600?w=400"
        ],
        description: "ماوس لاسلكي بدقة عالية وبطارية تدوم طويلاً",
        category: "accessories",
        discount: 20,
        rating: 4.6,
        inStock: true,
        specs: {
            type: "بصري لاسلكي",
            dpi: "2400 DPI",
            batteryLife: "18 شهر"
        }
    },
    {
        id: 6,
        name: "لوحة مفاتيح ميكانيكية RGB",
        price: 85,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1587829191301-44b3d4f2c600?w=400",
        mainImage: "https://images.unsplash.com/photo-1587829191301-44b3d4f2c600?w=400",
        images: [
            "https://images.unsplash.com/photo-1587829191301-44b3d4f2c600?w=400"
        ],
        description: "لوحة مفاتيح ميكانيكية بإضاءة RGB برّاقة",
        category: "accessories",
        discount: 10,
        rating: 4.8,
        inStock: true,
        specs: {
            switchType: "Red Cherry MX",
            lighting: "RGB 16.8M اللون",
            connectivity: "USB-C سلكي"
        }
    },
    {
        id: 7,
        name: "حقيبة لابتوب احترافية",
        price: 45,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
        ],
        description: "حقيبة حماية للابتوب مع جيوب متعددة وتصميم فريد",
        category: "accessories",
        discount: 5,
        rating: 4.7,
        inStock: true,
        specs: {
            size: "حتى 17 بوصة",
            material: "نايلون مقاوم للماء",
            pockets: "10 جيوب منفصلة"
        }
    },
    {
        id: 8,
        name: "شاحن سريع USB-C 100W",
        price: 35,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1606933248051-5ce88adc94e8?w=400",
        mainImage: "https://images.unsplash.com/photo-1606933248051-5ce88adc94e8?w=400",
        images: [
            "https://images.unsplash.com/photo-1606933248051-5ce88adc94e8?w=400"
        ],
        description: "شاحن سريع 100W مع دعم الشحن السريع لجميع الأجهزة",
        category: "accessories",
        discount: 15,
        rating: 4.9,
        inStock: true,
        specs: {
            power: "100W",
            ports: "منفذ USB-C واحد",
            fastCharging: "مدعوم"
        }
    },
    {
        id: 9,
        name: "مروحة تبريد اللابتوب",
        price: 30,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
        mainImage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
        images: [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400"
        ],
        description: "مروحة تبريد ذكية للابتوب مع ضوضاء منخفضة",
        category: "accessories",
        discount: 0,
        rating: 4.5,
        inStock: true,
        specs: {
            rpm: "2000-3000 دورة/دقيقة",
            noise: "أقل من 35 ديسيبل",
            compatibility: "معظم أحجام اللابتوب"
        }
    },
    {
        id: 10,
        name: "حامل لابتوب قابل للتعديل",
        price: 40,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1590080875512-48a5490d3c00?w=400",
        mainImage: "https://images.unsplash.com/photo-1590080875512-48a5490d3c00?w=400",
        images: [
            "https://images.unsplash.com/photo-1590080875512-48a5490d3c00?w=400"
        ],
        description: "حامل لابتوب متعدد الارتفاعات من الألومنيوم",
        category: "accessories",
        discount: 12,
        rating: 4.8,
        inStock: true,
        specs: {
            material: "ألومنيوم",
            adjustable: "نعم - 12 مستوى",
            maxLoad: "حتى 17 كيلوجرام"
        }
    }
];

// إدارة التخزين
class StorageManager {
    static getProducts() {
        const saved = localStorage.getItem('drlaptop-products');
        return saved ? JSON.parse(saved) : defaultProducts;
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

    // إدارة بيانات العملاء
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

// إدارة السلة
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
                price: product.discount ?
                    product.price * (1 - product.discount/100) :
                    product.price,
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
        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    render() {
        const container = document.getElementById('cart-body');
        const totalElement = document.getElementById('cart-total');
       
        if (!container) return;
       
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h4>سلة التسوق فارغة</h4>
                    <p>أضف بعض المنتجات من المتجر</p>
                </div>
            `;
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
                        <button class="remove-item" onclick="cart.remove(${item.id})">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
       
        if (totalElement) {
            totalElement.textContent = this.formatPrice(this.getTotal()) + ' $';
        }
    }

    showNotification(message) {
        // إنشاء الإشعار
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div style="background: #10b981; color: white; padding: 15px 20px; border-radius: 8px;
                 position: fixed; top: 100px; right: 20px; z-index: 1002;
                 box-shadow: 0 5px 15px rgba(0,0,0,0.2); animation: slideIn 0.3s ease;">
                <i class="fas fa-check-circle" style="margin-left: 10px;"></i>
                ${message}
            </div>
        `;
       
        document.body.appendChild(notification);
       
        // إزالة الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    formatPrice(price) {
        return price.toLocaleString('ar-SA');
    }
}

// إدارة المنتجات
class ProductManager {
    constructor() {
        this.products = StorageManager.getProducts();
        this.currentFilter = 'all';
    }

    filterByCategory(category) {
        this.currentFilter = category;
        this.render();
    }

    search(query) {
        if (!query.trim()) {
            this.render();
            return;
        }
       
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
       
        const products = productsToShow ||
            (this.currentFilter === 'all' ?
                this.products :
                this.products.filter(p => p.category === this.currentFilter));
       
        if (products.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-laptop" style="font-size: 4rem; color: #e2e8f0; margin-bottom: 20px;"></i>
                    <h3 style="color: #64748b; margin-bottom: 10px;">لا توجد منتجات</h3>
                    <p style="color: #94a3b8;">جرب استخدام فئات أو كلمات بحث مختلفة</p>
                </div>
            `;
            return;
        }
       
        container.innerHTML = products.map(product => `
            <div class="product-card">
                ${product.discount > 0 ? `
                    <div class="product-badge">خصم ${product.discount}%</div>
                ` : ''}
               
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.src='https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'">
                </div>
               
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                   
                    <div class="product-specs">
                        ${product.specs.processor ?
                            `<span class="product-spec">${product.specs.processor}</span>` : ''}
                        ${product.specs.ram ?
                            `<span class="product-spec">${product.specs.ram}</span>` : ''}
                        ${product.specs.storage ?
                            `<span class="product-spec">${product.specs.storage}</span>` : ''}
                    </div>
                   
                    <div class="product-price">
                        ${product.discount > 0 ? `
                            <span class="original-price">${product.price.toLocaleString('ar-SA')} $</span>
                        ` : ''}
                        <span class="current-price">
                            ${product.discount > 0 ?
                                (product.price * (1 - product.discount/100)).toLocaleString('ar-SA') :
                                product.price.toLocaleString('ar-SA')} $
                        </span>
                    </div>
                   
                    <div class="product-rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span class="rating-count">(${product.rating})</span>
                    </div>
                   
                    <div class="product-actions">
                        <button class="add-to-cart" onclick="cart.add(${product.id})">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                        <button class="view-details" onclick="showProductDetails(${product.id})">
                            <i class="fas fa-eye"></i> تفاصيل
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// الدوال العامة
function showProductDetails(productId) {
    const products = StorageManager.getProducts();
    const product = products.find(p => p.id === productId);
   
    if (!product) return;
   
    const modalHTML = `
        <div class="modal-overlay" id="product-modal" style="
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7); z-index: 2000;
            display: flex; align-items: center; justify-content: center;
            padding: 20px;">
            <div style="background: white; border-radius: 15px; max-width: 900px;
                 width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
                <button onclick="closeModal()" style="
                    position: absolute; top: 15px; left: 15px;
                    background: none; border: none; font-size: 1.5rem;
                    cursor: pointer; color: #333;">&times;</button>
               
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px;">
                    <div>
                        <img src="${product.image}" alt="${product.name}"
                             style="width: 100%; border-radius: 10px;">
                    </div>
                    <div>
                        <h2 style="margin-bottom: 15px; color: #1e293b;">${product.name}</h2>
                        <p style="color: #64748b; margin-bottom: 20px;">${product.description}</p>
                       
                        <div style="margin-bottom: 20px;">
                            <h3 style="margin-bottom: 10px; color: #1e293b;">
                                <i class="fas fa-list-alt"></i> المواصفات
                            </h3>
                            <ul style="color: #475569; list-style: none; padding: 0;">
                                ${product.specs.processor ? `<li><strong>المعالج:</strong> ${product.specs.processor}</li>` : ''}
                                ${product.specs.ram ? `<li><strong>الذاكرة:</strong> ${product.specs.ram}</li>` : ''}
                                ${product.specs.storage ? `<li><strong>التخزين:</strong> ${product.specs.storage}</li>` : ''}
                                ${product.specs.display ? `<li><strong>الشاشة:</strong> ${product.specs.display}</li>` : ''}
                            </ul>
                        </div>
                       
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                            ${product.discount > 0 ? `
                                <span style="text-decoration: line-through; color: #94a3b8;">
                                    ${product.price.toLocaleString('ar-SA')} $
                                </span>
                                <span style="font-size: 1.8rem; font-weight: 800; color: #3b82f6;">
                                    ${(product.price * (1 - product.discount/100)).toLocaleString('ar-SA')} $
                                </span>
                                <span style="background: #ef4444; color: white; padding: 5px 10px; border-radius: 20px;">
                                    خصم ${product.discount}%
                                </span>
                            ` : `
                                <span style="font-size: 1.8rem; font-weight: 800; color: #3b82f6;">
                                    ${product.price.toLocaleString('ar-SA')} $
                                </span>
                            `}
                        </div>
                       
                        <button onclick="cart.add(${product.id}); closeModal();"
                                style="background: #3b82f6; color: white; border: none;
                                       padding: 15px 30px; border-radius: 8px; font-size: 1.1rem;
                                       cursor: pointer; width: 100%;">
                            <i class="fas fa-cart-plus"></i> أضف إلى السلة
                        </button>
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

// دالة لعرض نموذج معلومات العميل
function showCustomerFormModal(totalAmount) {
    const modalHTML = `
        <div class="modal-overlay" id="customer-modal" style="
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7); z-index: 2000;
            display: flex; align-items: center; justify-content: center;
            padding: 20px;">
            <div style="background: white; border-radius: 15px; max-width: 500px;
                 width: 100%; max-height: 90vh; overflow-y: auto; position: relative;
                 box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <button onclick="closeCustomerModal()" style="
                    position: absolute; top: 15px; left: 15px;
                    background: none; border: none; font-size: 1.5rem;
                    cursor: pointer; color: #333; z-index: 10;">&times;</button>
               
                <div style="padding: 40px 30px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <i class="fas fa-user-circle" style="font-size: 3rem; color: #3b82f6; margin-bottom: 15px; display: block;"></i>
                        <h2 style="color: #1e293b; margin-bottom: 10px;">بيانات التسليم</h2>
                        <p style="color: #64748b;">من فضلك أدخل معلومات الاتصال</p>
                    </div>
                    
                    <form id="customer-form" style="display: flex; flex-direction: column; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: #1e293b; font-weight: 600;">
                                <i class="fas fa-user"></i> الاسم الكامل
                            </label>
                            <input type="text" id="customer-name" placeholder="أدخل اسمك الكامل"
                                 required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0;
                                 border-radius: 8px; font-size: 1rem; font-family: inherit;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: #1e293b; font-weight: 600;">
                                <i class="fas fa-phone"></i> رقم الهاتف
                            </label>
                            <input type="tel" id="customer-phone" placeholder="09XXXXXXXXX"
                                 required pattern="[0-9+\\-\\s()]{9,}"
                                 style="width: 100%; padding: 12px; border: 1px solid #e2e8f0;
                                 border-radius: 8px; font-size: 1rem; font-family: inherit;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: #1e293b; font-weight: 600;">
                                <i class="fas fa-map-marker-alt"></i> المحافظة
                            </label>
                            <select id="customer-province" required
                                    style="width: 100%; padding: 12px; border: 1px solid #e2e8f0;
                                    border-radius: 8px; font-size: 1rem; font-family: inherit;">
                                <option value="">اختر المحافظة</option>
                                <option value="دمشق">دمشق</option>
                                <option value="ريف دمشق">ريف دمشق</option>
                                <option value="حلب">حلب</option>
                                <option value="حمص">حمص</option>
                                <option value="حماة">حماة</option>
                                <option value="إدلب">إدلب</option>
                                <option value="اللاذقية">اللاذقية</option>
                                <option value="طرطوس">طرطوس</option>
                                <option value="دير الزور">دير الزور</option>
                                <option value="الرقة">الرقة</option>
                                <option value="درعا">درعا</option>
                                <option value="السويداء">السويداء</option>
                                <option value="القنيطرة">القنيطرة</option>
                                <option value="الحسكة">الحسكة</option>
                            </select>
                        </div>

                        <div>
                            <label style="display: block; margin-bottom: 8px; color: #1e293b; font-weight: 600;">
                                <i class="fas fa-sticky-note"></i> ملاحظات إضافية (اختياري)
                            </label>
                            <textarea id="customer-notes" placeholder="أضف أي ملاحظات..."
                                    style="width: 100%; padding: 12px; border: 1px solid #e2e8f0;
                                    border-radius: 8px; font-size: 1rem; font-family: inherit;
                                    resize: vertical; min-height: 80px;"></textarea>
                        </div>

                        <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin-top: 10px;">
                            <div style="color: #64748b; margin-bottom: 8px;">
                                <i class="fas fa-shopping-cart"></i> المجموع:
                            </div>
                            <div style="font-size: 1.8rem; color: #3b82f6; font-weight: 800;">
                                ${totalAmount.toLocaleString('ar-SA')} $
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button type="button" onclick="closeCustomerModal()" 
                                    style="flex: 1; padding: 12px; background: #e2e8f0; color: #1e293b;
                                    border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
                                    font-size: 1rem; transition: all 0.3s;">
                                إلغاء
                            </button>
                            <button type="submit"
                                    style="flex: 1; padding: 12px; background: #10b981; color: white;
                                    border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
                                    font-size: 1rem; transition: all 0.3s;">
                                <i class="fas fa-check"></i> تأكيد الطلب
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
   
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // ربط حدث الإرسال
    document.getElementById('customer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customerData = {
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            province: document.getElementById('customer-province').value,
            notes: document.getElementById('customer-notes').value,
            orderItems: cart.items,
            totalAmount: totalAmount,
            orderDate: new Date().toLocaleString('ar-SA')
        };
        
        // حفظ بيانات العميل
        const saved = StorageManager.saveCustomer(customerData);
        
        // إغلاق النموذج
        closeCustomerModal();
        
        // عرض رسالة النجاح
        showSuccessMessage(totalAmount, customerData);
        
        // تفريغ السلة
        cart.clear();
        document.getElementById('cart-sidebar').classList.remove('active');
    });
}

function closeCustomerModal() {
    const modal = document.getElementById('customer-modal');
    if (modal) modal.remove();
}

function showSuccessMessage(totalAmount, customerData) {
    const successHTML = `
        <div class="modal-overlay" id="success-modal" style="
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7); z-index: 2000;
            display: flex; align-items: center; justify-content: center;
            padding: 20px;">
            <div style="background: white; border-radius: 15px; max-width: 500px;
                 width: 100%; text-align: center; padding: 40px;
                 box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;">
                <div style="color: #10b981; font-size: 4rem; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #1e293b; margin-bottom: 15px; font-size: 1.8rem;">تم استقبال طلبك!</h2>
                <p style="color: #64748b; margin-bottom: 25px; line-height: 1.6;">
                    شكراً لشرائك من Dr.Laptop<br>
                    سيتم التواصل معك قريباً على الرقم: <strong>${customerData.phone}</strong>
                </p>
                
                <div style="background: #f0f9ff; border-radius: 10px; padding: 20px; margin-bottom: 25px; text-align: right;">
                    <div style="color: #64748b; margin-bottom: 15px;">
                        <i class="fas fa-list"></i> <strong>تفاصيل الطلب:</strong>
                    </div>
                    <div style="color: #475569; text-align: right; margin-bottom: 10px;">
                        <div><strong>الاسم:</strong> ${customerData.name}</div>
                        <div><strong>المحافظة:</strong> ${customerData.province}</div>
                        <div><strong>عدد المنتجات:</strong> ${customerData.orderItems.length}</div>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #cbd5e1;">
                            <strong style="font-size: 1.3rem; color: #3b82f6;">المجموع: ${totalAmount.toLocaleString('ar-SA')} $</strong>
                        </div>
                    </div>
                </div>
                
                <button onclick="document.getElementById('success-modal').remove()"
                        style="width: 100%; padding: 12px; background: #3b82f6; color: white;
                        border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
                        font-size: 1rem;">
                    <i class="fas fa-home"></i> العودة للمتجر
                </button>
            </div>
        </div>
        <style>
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
   
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
   
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
   
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
       
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// تهيئة التطبيق
let cart, productManager;

document.addEventListener('DOMContentLoaded', function() {
    // إخفاء شاشة التحميل بعد 2 ثانية
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 2000);
   
    // إخفاء تحميل المنتجات
    const loadingProducts = document.getElementById('loading-products');
    if (loadingProducts) {
        setTimeout(() => {
            loadingProducts.style.display = 'none';
        }, 1000);
    }
   
    // تهيئة المدراء
    cart = new CartManager();
    productManager = new ProductManager();
   
    // عدم عرض المنتجات مباشرة - انتظر اختيار الفئة
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-folder-open" style="font-size: 4rem; color: #cbd5e1; margin-bottom: 20px;"></i>
                <h3 style="color: #64748b; margin-bottom: 10px; font-size: 1.3rem;">اختر من الفئات أعلاه</h3>
                <p style="color: #94a3b8;">اضغط على أي فئة لعرض المنتجات</p>
            </div>
        `;
    }
   
    // إعداد الأحداث
    setupEventListeners();
    setupScrollToTop();
    setupMobileMenu();
   
    // تحديث السلة
    cart.render();
});

function setupEventListeners() {
    // مرشحات المنتجات
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // إزالة النشاط من جميع الأزرار
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
           
            // إضافة النشاط للزر المختار
            this.classList.add('active');
           
            // تصفية المنتجات
            const filter = this.dataset.filter;
            productManager.filterByCategory(filter);
        });
    });
   
    // البحث
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
   
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            productManager.search(this.value);
        });
       
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                productManager.search(this.value);
            }
        });
    }
   
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                productManager.search(searchInput.value);
            }
        });
    }
   
    // سلة التسوق
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
   
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            document.getElementById('cart-sidebar').classList.add('active');
            cart.render();
        });
    }
   
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            document.getElementById('cart-sidebar').classList.remove('active');
        });
    }
   
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                alert('سلة التسوق فارغة! أضف بعض المنتجات أولاً.');
                return;
            }
           
            const total = cart.getTotal();
            // عرض نموذج معلومات العميل بدلاً من تأكيد بسيط
            showCustomerFormModal(total);
        });
    }
   
    // الفئات
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
           
            if (filterBtn) {
                // تنشيط زر الفلتر المناسب
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                filterBtn.classList.add('active');
               
                // تصفية المنتجات
                productManager.filterByCategory(category);
               
                // التمرير لقسم المنتجات
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// جعل الكائنات متاحة عالمياً
window.cart = cart;
window.productManager = productManager;
window.showProductDetails = showProductDetails;
window.closeModal = closeModal;
window.showCustomerFormModal = showCustomerFormModal;
window.closeCustomerModal = closeCustomerModal;
window.showSuccessMessage = showSuccessMessage;

// إضافة دعم للإعلانات في لوحة التحكم
window.getProductsFromStorage = function() {
    return StorageManager.getProducts();
};

window.saveProductsToStorage = function(products) {
    StorageManager.saveProducts(products);
};

window.addProductToStorage = function(product) {
    const products = StorageManager.getProducts();
    products.push(product);
    StorageManager.saveProducts(products);
    productManager.products = products;
    productManager.render();
};

// الحصول على بيانات العملاء (للمسؤول)
window.getCustomersData = function() {
    return StorageManager.getCustomers();
};