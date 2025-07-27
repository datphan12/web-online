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
            "USB-C Connectivity",
        ],
    },
    {
        id: 2,
        name: "iPhone 15",
        brand: "iphone",
        price: 799,
        originalPrice: 899,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "A16 Bionic Chip",
            "48MP Main Camera",
            "Dynamic Island",
            "All-Day Battery Life",
        ],
    },
    {
        id: 3,
        name: "Galaxy S24 Ultra",
        brand: "samsung",
        price: 1199,
        originalPrice: 1299,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "Snapdragon 8 Gen 3",
            "200MP Camera",
            "S Pen Included",
            "7 Years of Updates",
        ],
    },
    {
        id: 4,
        name: "Galaxy S24",
        brand: "samsung",
        price: 799,
        originalPrice: 899,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "Snapdragon 8 Gen 3",
            "50MP Triple Camera",
            "AI Photo Editing",
            "120Hz Display",
        ],
    },
    {
        id: 5,
        name: "Xiaomi 14 Ultra",
        brand: "xiaomi",
        price: 899,
        originalPrice: 999,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "Snapdragon 8 Gen 3",
            "Leica Camera System",
            "90W Fast Charging",
            "2K AMOLED Display",
        ],
    },
    {
        id: 6,
        name: "Xiaomi 14",
        brand: "xiaomi",
        price: 649,
        originalPrice: 749,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "Snapdragon 8 Gen 3",
            "50MP Leica Camera",
            "67W Turbo Charging",
            "120Hz LTPO Display",
        ],
    },
    {
        id: 7,
        name: "iPhone 14 Pro",
        brand: "iphone",
        price: 999,
        originalPrice: 1099,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "A16 Bionic Chip",
            "Pro Camera System",
            "Dynamic Island",
            "Always-On Display",
        ],
    },
    {
        id: 8,
        name: "Galaxy Z Fold5",
        brand: "samsung",
        price: 1599,
        originalPrice: 1799,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "Foldable Design",
            "Snapdragon 8 Gen 2",
            "Multi-Tasking",
            "S Pen Compatible",
        ],
    },
    {
        id: 9,
        name: "Redmi Note 13 Pro",
        brand: "xiaomi",
        price: 299,
        originalPrice: 399,
        image: "https://res.cloudinary.com/eureka-uni/image/upload/v1753093776/eureka-uni/qfzkni8fzzfefrvxstuf.png",
        features: [
            "Snapdragon 7s Gen 2",
            "200MP Camera",
            "67W Fast Charging",
            "120Hz AMOLED",
        ],
    },
];

const productInCart = [];

let users = [
    {
        name: "admin",
        email: "admin@example.com",
        password: "123456",
    },
];

const productsContainer = document.getElementById("productsContainer");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const searchForm = document.querySelector('form[role="search"]');

let currentFilter = "all";
let currentSearchTerm = "";
let currentUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;

document.addEventListener("DOMContentLoaded", function () {
    renderProducts(products);
    setupEventListeners();

    const authButtons = document.getElementById("authButtons");
    const userSection = document.getElementById("userSection");

    if (currentUser) {
        authButtons.classList.add("hidden");
        userSection.classList.add("show");
    } else {
        authButtons.classList.remove("hidden");
        userSection.classList.remove("show");
    }

    checkUserSession();
});

function showLoginModal() {
    const loginModal = new bootstrap.Modal(
        document.getElementById("loginModal")
    );
    loginModal.show();
}

function showSignupModal() {
    const signupModal = new bootstrap.Modal(
        document.getElementById("signupModal")
    );
    signupModal.show();
}

function switchToSignup() {
    const loginModal = bootstrap.Modal.getInstance(
        document.getElementById("loginModal")
    );
    loginModal.hide();
    setTimeout(() => {
        showSignupModal();
    }, 300);
}

function switchToLogin() {
    const signupModal = bootstrap.Modal.getInstance(
        document.getElementById("signupModal")
    );
    signupModal.hide();
    setTimeout(() => {
        showLoginModal();
    }, 300);
}

function toggleUserDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown.classList.toggle("show");
}

function logout() {
    currentUser = null;

    const authButtons = document.getElementById("authButtons");
    const userSection = document.getElementById("userSection");
    const userDropdown = document.getElementById("userDropdown");

    authButtons.classList.remove("hidden");
    userSection.classList.remove("show");
    userDropdown.classList.remove("show");

    showNotification("Logged out successfully!", "info");

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("cart");
    localStorage.removeItem("orderHistory");
}

function loginUser(userData) {
    currentUser = {
        name: userData.name,
        email: userData.email,
    };
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));

    const authButtons = document.getElementById("authButtons");
    const userSection = document.getElementById("userSection");

    authButtons.classList.add("hidden");
    userSection.classList.add("show");

    document.getElementById(
        "userName"
    ).textContent = `Hello, ${userData.name}!`;

    const loginModal = bootstrap.Modal.getInstance(
        document.getElementById("loginModal")
    );
    const signupModal = bootstrap.Modal.getInstance(
        document.getElementById("signupModal")
    );

    if (loginModal) loginModal.hide();
    if (signupModal) signupModal.hide();

    showNotification(`Welcome back, ${userData.name}!`, "success");
}

function checkUserSession() {
    if (currentUser) {
        const authButtons = document.getElementById("authButtons");
        const userSection = document.getElementById("userSection");

        authButtons.classList.add("hidden");
        userSection.classList.add("show");
        document.getElementById(
            "userName"
        ).textContent = `Hello, ${currentUser.name}!`;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateName(name) {
    return name.trim().length >= 2;
}

function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    field.classList.add("error");
    error.textContent = message;
    error.classList.add("show");
}

function hideFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    field.classList.remove("error");
    error.classList.remove("show");
}

function clearAllErrors(formId) {
    const form = document.getElementById(formId);
    const errorMessages = form.querySelectorAll(".error-message");
    const errorFields = form.querySelectorAll(".form-control.error");

    errorMessages.forEach((error) => error.classList.remove("show"));
    errorFields.forEach((field) => field.classList.remove("error"));
}

// Login Form Validation
function validateLoginForm() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    let isValid = true;

    clearAllErrors("loginForm");

    if (!email) {
        showFieldError("loginEmail", "loginEmailError", "Email is required");
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError(
            "loginEmail",
            "loginEmailError",
            "Please enter a valid email address"
        );
        isValid = false;
    }

    if (!password) {
        showFieldError(
            "loginPassword",
            "loginPasswordError",
            "Password is required"
        );
        isValid = false;
    }

    return isValid;
}

// Signup Form Validation
function validateSignupForm() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();
    let isValid = true;

    clearAllErrors("signupForm");

    if (!name) {
        showFieldError(
            "signupName",
            "signupNameError",
            "Full name is required"
        );
        isValid = false;
    } else if (!validateName(name)) {
        showFieldError(
            "signupName",
            "signupNameError",
            "Full name must be at least 2 characters long"
        );
        isValid = false;
    }

    if (!email) {
        showFieldError("signupEmail", "signupEmailError", "Email is required");
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError(
            "signupEmail",
            "signupEmailError",
            "Please enter a valid email address"
        );
        isValid = false;
    }

    if (!password) {
        showFieldError(
            "signupPassword",
            "signupPasswordError",
            "Password is required"
        );
        isValid = false;
    } else if (!validatePassword(password)) {
        showFieldError(
            "signupPassword",
            "signupPasswordError",
            "Password must be at least 6 characters long"
        );
        isValid = false;
    }

    if (!confirmPassword) {
        showFieldError(
            "confirmPassword",
            "confirmPasswordError",
            "Please confirm your password"
        );
        isValid = false;
    } else if (password !== confirmPassword) {
        showFieldError(
            "confirmPassword",
            "confirmPasswordError",
            "Passwords do not match"
        );
        isValid = false;
    }

    return isValid;
}

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

    const productsHTML = productsToRender
        .map(
            (product, index) => `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4" data-brand="${
                        product.brand
                    }">
                        <div class="card product-card h-100">
                         
                            <img src="${product.image}" alt="image">
                                      
                            <div class="card-body d-flex flex-column">
                                <div class="product-brand">${getBrandDisplayName(
                                    product.brand
                                )}</div>
                                <h5 class="product-title">${product.name}</h5>
                                
                                <div class="product-price">
                                    ${product.price}
                                    ${
                                        product.originalPrice
                                            ? `<span class="original-price">${product.originalPrice}</span>`
                                            : ""
                                    }
                                </div>
                                
                                <ul class="product-features flex-grow-1">
                                    ${product.features
                                        .map(
                                            (feature) => `
                                        <li><i class="fas fa-check"></i>${feature}</li>
                                    `
                                        )
                                        .join("")}
                                </ul>
                                
                                <div class="d-flex gap-2 mt-auto">
                                    <button class="btn btn-cart flex-fill" onclick="addToCart(${
                                        product.id
                                    })">
                                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
        )
        .join("");

    productsContainer.innerHTML = productsHTML;
}

function getBrandDisplayName(brand) {
    const brandNames = {
        iphone: "Apple",
        samsung: "Samsung",
        xiaomi: "Xiaomi",
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
    if (currentFilter !== "all") {
        filteredProducts = filteredProducts.filter(
            (product) => product.brand === currentFilter
        );
    }

    // Apply search filter
    if (currentSearchTerm) {
        filteredProducts = filteredProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(currentSearchTerm) ||
                product.brand.toLowerCase().includes(currentSearchTerm) ||
                product.features.some((feature) =>
                    feature.toLowerCase().includes(currentSearchTerm)
                )
        );
    }

    renderProducts(filteredProducts);
}

// Setup event listeners
function setupEventListeners() {
    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
            filterProducts(this.dataset.filter);
        });
    });

    // Search functionality
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        searchProducts(searchInput.value);
    });

    // Real-time search
    searchInput.addEventListener("input", function () {
        searchProducts(this.value);
    });

    // Login form submission
    document
        .getElementById("loginForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();

            if (validateLoginForm()) {
                const email = document
                    .getElementById("loginEmail")
                    .value.trim();
                const password = document
                    .getElementById("loginPassword")
                    .value.trim();

                const matchedUser = users.find(
                    (user) => user.email === email && user.password === password
                );

                if (matchedUser) {
                    loginUser(matchedUser);
                    this.reset();
                } else {
                    showNotification("Invalid email or password", "danger");
                }
            }
        });

    // Signup form submission
    document
        .getElementById("signupForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();

            if (validateSignupForm()) {
                const name = document.getElementById("signupName").value.trim();
                const email = document
                    .getElementById("signupEmail")
                    .value.trim();
                const password = document
                    .getElementById("signupPassword")
                    .value.trim();

                const emailExists = users.some((user) => user.email === email);

                if (emailExists) {
                    showNotification("Email already registered", "warning");
                    return;
                }

                const newUser = { name, email, password };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                loginUser(newUser);
                this.reset();
            }
        });

    document.addEventListener("click", function (e) {
        const userDropdown = document.getElementById("userDropdown");
        const userInfo = document.querySelector(".user-info");

        if (!userInfo.contains(e.target)) {
            userDropdown.classList.remove("show");
        }
    });

    // Real-time validation for login form
    document.getElementById("loginEmail").addEventListener("blur", function () {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showFieldError(
                "loginEmail",
                "loginEmailError",
                "Please enter a valid email address"
            );
        } else if (email) {
            hideFieldError("loginEmail", "loginEmailError");
        }
    });

    document
        .getElementById("loginPassword")
        .addEventListener("blur", function () {
            const password = this.value.trim();
            if (password && !validatePassword(password)) {
                showFieldError(
                    "loginPassword",
                    "loginPasswordError",
                    "Password must be at least 6 characters long"
                );
            } else if (password) {
                hideFieldError("loginPassword", "loginPasswordError");
            }
        });

    // Real-time validation for signup form
    document.getElementById("signupName").addEventListener("blur", function () {
        const name = this.value.trim();
        if (name && !validateName(name)) {
            showFieldError(
                "signupName",
                "signupNameError",
                "Full name must be at least 2 characters long"
            );
        } else if (name) {
            hideFieldError("signupName", "signupNameError");
        }
    });

    document
        .getElementById("signupEmail")
        .addEventListener("blur", function () {
            const email = this.value.trim();
            if (email && !validateEmail(email)) {
                showFieldError(
                    "signupEmail",
                    "signupEmailError",
                    "Please enter a valid email address"
                );
            } else if (email) {
                hideFieldError("signupEmail", "signupEmailError");
            }
        });

    document
        .getElementById("signupPassword")
        .addEventListener("blur", function () {
            const password = this.value.trim();
            if (password && !validatePassword(password)) {
                showFieldError(
                    "signupPassword",
                    "signupPasswordError",
                    "Password must be at least 6 characters long"
                );
            } else if (password) {
                hideFieldError("signupPassword", "signupPasswordError");
            }
        });

    document
        .getElementById("confirmPassword")
        .addEventListener("blur", function () {
            const password = document
                .getElementById("signupPassword")
                .value.trim();
            const confirmPassword = this.value.trim();
            if (confirmPassword && password !== confirmPassword) {
                showFieldError(
                    "confirmPassword",
                    "confirmPasswordError",
                    "Passwords do not match"
                );
            } else if (confirmPassword) {
                hideFieldError("confirmPassword", "confirmPasswordError");
            }
        });
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (product) {
        showNotification(`${product.name} added to cart!`, "success");

        // Lấy danh sách hiện tại trong localStorage (nếu có)
        const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Thêm sản phẩm vào danh sách
        currentCart.push(product);

        // Lưu lại vào localStorage
        localStorage.setItem("cart", JSON.stringify(currentCart));
    }
}

// Notification system
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    min-width: 300px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                `;

    notification.innerHTML = `
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}
