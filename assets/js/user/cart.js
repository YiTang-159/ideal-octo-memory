// Lấy giỏ hàng từ localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsList = document.getElementById("cart-items-list");
const finalTotalSpan = document.getElementById("final-total");
const emptyCartMessage = document.getElementById("empty-cart-message");
const summaryBox = document.getElementById("summary-box");

// Định dạng tiền tệ
function formatCurrency(amount) {
    const parts = new Intl.NumberFormat('vi-VN').formatToParts(amount || 0);

    return parts.map(p => {
        if (p.type === 'group') return '\u00A0';
        return p.value;
    }).join('') + '\u00A0₫';
}

// Cập nhật trạng thái giỏ hàng
function updateCartState() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateSummary();
    updateCartCount();
}

// Cập nhật tổng tiền
function updateSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);      
    finalTotalSpan.textContent = formatCurrency(total);
    
    // Hiển thị/ẩn phần tổng kết
    if (cart.length === 0) {
        summaryBox.style.display = 'none';
        if (document.querySelector('.cart-header')) {
            document.querySelector('.cart-header').style.display = 'none';
        }
    } else {
        summaryBox.style.display = 'flex';
        if (document.querySelector('.cart-header')) {
            document.querySelector('.cart-header').style.display = 'grid';
        }
    }
}

// Hiển thị giỏ hàng
function renderCart() {            
    if (cart.length === 0) {
        cartItemsList.innerHTML = "";
        emptyCartMessage.style.display = "block";
        updateSummary();
        return;
    } else {
        emptyCartMessage.style.display = "none";
    }
    
    let html = "";
    cart.forEach((item, i) => {
        if (!item.name || !item.price || item.quantity === undefined || item.quantity === null || item.quantity < 1) {
            console.error("Lỗi dữ liệu sản phẩm:", item);
            alert(`Phát hiện lỗi dữ liệu cho sản phẩm tại vị trí ${i+1}. Vui lòng kiểm tra lại giỏ hàng.`);
            return; 
        }
        
        const totalPrice = item.price * item.quantity;
        let imagePath = item.thumbnail;
        
        if (!imagePath.startsWith('/') && !imagePath.startsWith('../') && !imagePath.startsWith('http')) {
            imagePath = `../assets/image/product/${item.thumbnail}`; 
        }
        
        html += `
            <div class="cart-item">
                <div class="item-details">
                    <img src="${imagePath}" alt="${item.name}">
                    <span>${item.name}</span>
                </div>
                <span class="item-unit-price">${formatCurrency(item.price)}</span>
                <div class="quantity-control">
                    <button onclick="changeQuantity(${i}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${i}, 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
                <span class="item-total-price">${formatCurrency(totalPrice)}</span>
                <div class="remove-btn-container">
                    <button class="remove-btn" onclick="removeItem(${i})">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsList.innerHTML = html;
    updateSummary();
}

// Thay đổi số lượng sản phẩm
function changeQuantity(index, delta) {
    const currentQuantity = cart[index].quantity;
    const newQuantity = currentQuantity + delta;
    
    if (newQuantity >= 1) {
        cart[index].quantity = newQuantity;
        
        const itemTotalPriceElement = cartItemsList.querySelector(`.cart-item:nth-child(${index + 1}) .item-total-price`);
        if (itemTotalPriceElement) {
            itemTotalPriceElement.textContent = formatCurrency(cart[index].price * newQuantity);
        }
        
        updateCartState();
    } else if (newQuantity === 0) {
        removeItem(index);
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(index) {
    if (confirm(`Bạn có chắc chắn muốn bỏ sản phẩm ${cart[index].name} khỏi giỏ hàng không?`)) {
        cart.splice(index, 1);
        updateCartState();
    }
}

// Kiểm tra xem người dùng đã đăng nhập chưa
function isAuthenticated() {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser !== null; 
}

// Xử lý thanh toán
function handleCheckout() {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống.");
        return;
    }
    
    // Vì không còn checkbox, mặc định là chọn tất cả sản phẩm trong giỏ
    const selectedItems = cart;
    
    if (!isAuthenticated()) {
        alert("Vui lòng đăng nhập để tiến hành đặt hàng.");
        // Lưu trạng thái giỏ hàng để quay lại sau khi đăng nhập
        localStorage.setItem("checkout_items", JSON.stringify(selectedItems));
        localStorage.setItem("redirect_after_login", "checkout.html");
        window.location.href = "login.html"; 
        return;
    }
    
    localStorage.setItem("checkout_items", JSON.stringify(selectedItems));
    window.location.href = "checkout.html";
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    localStorage.removeItem("cart");
    location.reload();
}

// Tải trang khi được mở
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo giỏ hàng
    renderCart();
});