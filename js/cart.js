let productInCart = JSON.parse(localStorage.getItem("cart")) || [];
const currentUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

document.addEventListener("DOMContentLoaded", function () {
    renderCartItems();
    updateCartSummary();
});

function saveCartToLocal() {
    localStorage.setItem("cart", JSON.stringify(productInCart));
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");

    if (productInCart.length === 0) {
        cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="index.html" class="btn btn-primary">
                        <i class="fas fa-shopping-bag me-2"></i>Continue Shopping
                    </a>
                </div>
            `;
        return;
    }

    const cartHTML = productInCart
        .map(
            (product, index) => `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${product.image}" alt="${
                product.name
            }" class="img-fluid">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${product.name}</h6>
                        <div class="product-features mt-2">
                            ${product.features
                                .slice(0, 2)
                                .map(
                                    (f) =>
                                        `<small class="badge bg-light text-dark me-1">${f}</small>`
                                )
                                .join("")}
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" 
                                value="${product.quantity || 1}" 
                                onchange="setQuantity(${index}, this.value)" min="1">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 text-center">
                        <div class="h5 mb-0">$${product.price}</div>
                        ${
                            product.originalPrice
                                ? `<small class="text-muted text-decoration-line-through">$${product.originalPrice}</small>`
                                : ""
                        }
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
        )
        .join("");

    cartItemsContainer.innerHTML = cartHTML;
}

function updateQuantity(index, change) {
    if (productInCart[index]) {
        const currentQuantity = productInCart[index].quantity || 1;
        const newQuantity = Math.max(1, currentQuantity + change);
        productInCart[index].quantity = newQuantity;

        saveCartToLocal();
        renderCartItems();
        updateCartSummary();
    }
}

function setQuantity(index, quantity) {
    const qty = Math.max(1, parseInt(quantity) || 1);
    if (productInCart[index]) {
        productInCart[index].quantity = qty;
        saveCartToLocal();
        renderCartItems();
        updateCartSummary();
    }
}

function removeFromCart(index) {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
        productInCart.splice(index, 1);
        saveCartToLocal();
        renderCartItems();
        updateCartSummary();
        showNotification("Item removed from cart!", "info");
    }
}

function updateCartSummary() {
    const subtotal = productInCart.reduce(
        (sum, p) => sum + p.price * (p.quantity || 1),
        0
    );
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent =
        shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
    document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

function showCheckoutBill() {
    if (productInCart.length === 0) {
        showNotification("Your cart is empty!", "warning");
        return;
    }

    const now = new Date();
    const invoiceNumber = "INV-" + now.getTime().toString().slice(-6);

    document.getElementById("billCustomerName").textContent = currentUser.name;
    document.getElementById("billCustomerEmail").textContent =
        currentUser.email;
    document.getElementById("billDate").textContent = now.toLocaleDateString();
    document.getElementById("billInvoiceNumber").textContent = invoiceNumber;

    const billItemsHTML = productInCart
        .map((p) => {
            const qty = p.quantity || 1;
            const total = p.price * qty;
            return `
                <div class="bill-item">
                    <div class="row">
                        <div class="col-md-6"><h6 class="mb-1">${
                            p.name
                        }</h6></div>
                        <div class="col-md-2 text-center">$${p.price.toFixed(
                            2
                        )}</div>
                        <div class="col-md-2 text-center">×${qty}</div>
                        <div class="col-md-2 text-end"><strong>$${total.toFixed(
                            2
                        )}</strong></div>
                    </div>
                </div>
            `;
        })
        .join("");

    document.getElementById("billItems").innerHTML = `
            <div class="row mb-3">
                <div class="col-md-6"><strong>Item</strong></div>
                <div class="col-md-2 text-center"><strong>Price</strong></div>
                <div class="col-md-2 text-center"><strong>Qty</strong></div>
                <div class="col-md-2 text-end"><strong>Total</strong></div>
            </div>
            ${billItemsHTML}
        `;

    const subtotal = productInCart.reduce(
        (sum, p) => sum + p.price * (p.quantity || 1),
        0
    );
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById("billSubtotal").textContent = `$${subtotal.toFixed(
        2
    )}`;
    document.getElementById("billShipping").textContent =
        shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
    document.getElementById("billTax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("billTotal").textContent = `$${total.toFixed(2)}`;

    new bootstrap.Modal(document.getElementById("billModal")).show();
}

function printBill() {
    window.print();
}

function confirmOrder() {
    const now = new Date();
    const invoiceNumber = "INV-" + now.getTime().toString().slice(-6);

    const order = {
        invoiceNumber,
        date: now.toISOString(),
        customer: {
            name: currentUser.name,
            email: currentUser.email,
        },
        items: productInCart.map((p) => ({
            name: p.name,
            price: p.price,
            quantity: p.quantity || 1,
            total: p.price * (p.quantity || 1),
        })),
        subtotal: productInCart.reduce(
            (sum, p) => sum + p.price * (p.quantity || 1),
            0
        ),
    };

    order.shipping = order.subtotal > 500 ? 0 : 25;
    order.tax = order.subtotal * 0.1;
    order.total = order.subtotal + order.shipping + order.tax;

    // ✅ Lưu vào localStorage (mảng lịch sử)
    const orderHistory = JSON.parse(
        localStorage.getItem("orderHistory") || "[]"
    );
    orderHistory.push(order);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

    // ✅ Xóa giỏ hàng
    productInCart = [];
    saveCartToLocal();

    renderCartItems();

    // Đóng modal và thông báo
    bootstrap.Modal.getInstance(document.getElementById("billModal")).hide();
    showNotification(
        "Order confirmed successfully! Thank you for your purchase.",
        "success"
    );

    // Chuyển về trang chủ
    // setTimeout(() => (window.location.href = "index.html"), 2000);
}

function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function toggleOrderHistory() {
    const section = document.getElementById("orderHistorySection");
    const isVisible = section.style.display === "block";
    section.style.display = isVisible ? "none" : "block";

    if (!isVisible) renderOrderHistory();
}

function renderOrderHistory() {
    const history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    const tbody = document.getElementById("orderHistoryTableBody");
    tbody.innerHTML = "";

    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No orders found.</td></tr>`;
        return;
    }

    history.forEach((order) => {
        const itemsHTML = order.items
            .map((i) => `${i.name} ×${i.quantity}`)
            .join("<br>");
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${order.invoiceNumber}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.customer.name}<br><small>${
            order.customer.email
        }</small></td>
            <td>${itemsHTML}</td>
            <td><strong>$${order.total.toFixed(2)}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}
