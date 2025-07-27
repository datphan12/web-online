// Sample product data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        brand: "iphone",
        price: 1199,
        originalPrice: 1299,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "A17 Pro Chip",
            "48MP Camera System",
            "Titanium Design",
            "USB-C Connectivity"
        ]
    },
    {
        id: 2,
        name: "iPhone 15",
        brand: "iphone",
        price: 799,
        originalPrice: 899,
        image: "../assets/anh1.jpg",
        features: [
            "A16 Bionic Chip",
            "48MP Main Camera",
            "Dynamic Island",
            "All-Day Battery Life"
        ]
    },
    {
        id: 3,
        name: "Galaxy S24 Ultra",
        brand: "samsung",
        price: 1199,
        originalPrice: 1299,
        image: "fas fa-mobile-alt",
        features: [
            "Snapdragon 8 Gen 3",
            "200MP Camera",
            "S Pen Included",
            "7 Years of Updates"
        ]
    },
    {
        id: 4,
        name: "Galaxy S24",
        brand: "samsung",
        price: 799,
        originalPrice: 899,
        image: "fas fa-mobile-alt",
        features: [
            "Snapdragon 8 Gen 3",
            "50MP Triple Camera",
            "AI Photo Editing",
            "120Hz Display"
        ]
    },
    {
        id: 5,
        name: "Xiaomi 14 Ultra",
        brand: "xiaomi",
        price: 899,
        originalPrice: 999,
        image: "fas fa-mobile-alt",
        features: [
            "Snapdragon 8 Gen 3",
            "Leica Camera System",
            "90W Fast Charging",
            "2K AMOLED Display"
        ]
    },
    {
        id: 6,
        name: "Xiaomi 14",
        brand: "xiaomi",
        price: 649,
        originalPrice: 749,
        image: "fas fa-mobile-alt",
        features: [
            "Snapdragon 8 Gen 3",
            "50MP Leica Camera",
            "67W Turbo Charging",
            "120Hz LTPO Display"
        ]
    },
    {
        id: 7,
        name: "iPhone 14 Pro",
        brand: "iphone",
        price: 999,
        originalPrice: 1099,
        image: "fas fa-mobile-alt",
        features: [
            "A16 Bionic Chip",
            "Pro Camera System",
            "Dynamic Island",
            "Always-On Display"
        ]
    },
    {
        id: 8,
        name: "Galaxy Z Fold5",
        brand: "samsung",
        price: 1599,
        originalPrice: 1799,
        image: "fas fa-mobile-alt",
        features: [
            "Foldable Design",
            "Snapdragon 8 Gen 2",
            "Multi-Tasking",
            "S Pen Compatible"
        ]
    },
    {
        id: 9,
        name: "Redmi Note 13 Pro",
        brand: "xiaomi",
        price: 299,
        originalPrice: 399,
        image: "fas fa-mobile-alt",
        features: [
            "Snapdragon 7s Gen 2",
            "200MP Camera",
            "67W Fast Charging",
            "120Hz AMOLED"
        ]
    }
];

// DOM elements
const productsContainer = document.getElementById('productsContainer');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchForm = document.querySelector('form[role="search"]');

// State
let currentFilter = 'all';
let currentSearchTerm = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    setupEventListeners();
});

// Render products
function renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-search me-2"></i>
                    No products found matching your criteria.
                </div>
            </div>
        `;
        return;
    }

    const productsHTML = productsToRender.map((product, index) => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4" data-brand="${product.brand}">
            <div class="card product-card h-100">
                <img class="product-image" src=${product.image} alt="logo">
                </img>
                <div class="card-body d-flex flex-column">
                    <div class="product-brand">${getBrandDisplayName(product.brand)}</div>
                    <h5 class="product-title">${product.name}</h5>
                    
                    <div class="product-price">
                        ${product.price}$
                        ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                    </div>
                    
                    <ul class="product-features flex-grow-1">
                        ${product.features.map(feature => `
                            <li><i class="fas fa-check"></i>${feature}</li>
                        `).join('')}
                    </ul>
                    
                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn btn-cart flex-fill" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = productsHTML;
    
    // Add entrance animation
    const cards = productsContainer.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Get brand display name
function getBrandDisplayName(brand) {
    const brandNames = {
        'iphone': 'Apple',
        'samsung': 'Samsung',
        'xiaomi': 'Xiaomi'
    };
    return brandNames[brand] || brand;
}

// Filter products
function filterProducts(filter) {
    currentFilter = filter;
    applyFiltersAndSearch();
}

// Search products
function searchProducts(searchTerm) {
    currentSearchTerm = searchTerm.toLowerCase();
    applyFiltersAndSearch();
}

// Apply both filters and search
function applyFiltersAndSearch() {
    let filteredProducts = products;
    
    // Apply brand filter
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.brand === currentFilter);
    }
    
    // Apply search filter
    if (currentSearchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(currentSearchTerm) ||
            product.brand.toLowerCase().includes(currentSearchTerm) ||
            product.features.some(feature => feature.toLowerCase().includes(currentSearchTerm))
        );
    }
    
    renderProducts(filteredProducts);
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter products
            filterProducts(this.dataset.filter);
        });
    });
    
    // Search functionality
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchProducts(searchInput.value);
    });
    
    // Real-time search
    searchInput.addEventListener('input', function() {
        searchProducts(this.value);
    }); 
}



// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Simulate adding to cart
        showNotification(`${product.name} added to cart!`, 'success');
        
        // You can implement actual cart functionality here
        // For example: saveToLocalStorage, update cart count, etc.
    }
}




// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // You can add responsive behavior here if needed
    if (window.innerWidth < 768) {
        // Mobile specific adjustments
    }
});
