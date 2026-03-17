// Lấy giỏ hàng từ localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsList = document.getElementById("cart-items-list");
const finalTotalSpan = document.getElementById("final-total");
const emptyCartMessage = document.getElementById("empty-cart-message");
const summaryBox = document.getElementById("summary-box");
const selectAllContainer = document.getElementById("select-all-container");
const selectAllCheckbox = document.getElementById("select-all");

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
    const selectedItems = cart.filter(item => item.selected);
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);      
    finalTotalSpan.textContent = formatCurrency(total);
    
    // Kiểm tra trạng thái chọn tất cả
    const allSelected = cart.length > 0 && cart.every(item => item.selected);
    selectAllCheckbox.checked = allSelected;
    
    // Hiển thị/ẩn phần tổng kết
    if (cart.length === 0) {
        summaryBox.style.display = 'none';
        selectAllContainer.style.display = 'none';
    } else {
        summaryBox.style.display = 'grid';
        selectAllContainer.style.display = 'flex';
    }
}

// Hiển thị giỏ hàng
function renderCart() {            
    if (cart.length === 0) {
        cartItemsList.innerHTML = "";
        emptyCartMessage.style.display = "block";
        document.querySelector('.cart-header').style.display = 'none';
        updateSummary();
        return;
    } else {
        emptyCartMessage.style.display = "none";
        document.querySelector('.cart-header').style.display = 'grid';
    }
    
    let html = "";
    cart.forEach((item, i) => {
        if (!item.price || !item.quantity === undefined || item.quantity === null || item.quantity < 1) {
            console.error("Lỗi dữ liệu sản phẩm:", item.name, "bị thiếu giá hoặc số lượng.");
            return; 
        }
        
        const totalPrice = item.price * item.quantity;
        let imagePath = item.thumbnail;
        
        // Kiểm tra và sửa đường dẫn ảnh nếu cần
        if (!imagePath.startsWith('/') && !imagePath.startsWith('../') && !imagePath.startsWith('http')) {
            imagePath = `../assets/image/product/${item.thumbnail}`; 
        }
        
        html += `
            <div class="cart-item">
                <div class="item-details">
                    <input type="checkbox" id="item-${i}" ${item.selected ? 'checked' : ''} onchange="toggleItemSelection(${i})">
                    <img src="${imagePath}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <span>${item.name}</span>
                </div>
                <span class="item-unit-price">${formatCurrency(item.price)}</span>
                <div class="quantity-control">
                    <button onclick="changeQuantity(${i}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${i}, 1)">+</button>
                </div>
                <span class="item-total-price">${formatCurrency(totalPrice)}</span>
                <div>
                    <button class="remove-btn" onclick="removeItem(${i})">Xóa</button>
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
        if (!cart[index].selected) {
            cart[index].selected = true;
        }
        
        const itemTotalPriceElement = cartItemsList.querySelector(`.cart-item:nth-child(${index + 1}) .item-total-price`);
        if (itemTotalPriceElement) {
            itemTotalPriceElement.textContent = formatCurrency(cart[index].price * newQuantity);
        }
        
        updateCartState();
    } else if (newQuantity === 0) {
        if (confirm(`Bạn có muốn xóa sản phẩm ${cart[index].name} khỏi giỏ hàng không?`)) {
            removeItem(index);
        }
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(index) {
    cart.splice(index, 1);
    updateCartState();
}

// Chọn/bỏ chọn sản phẩm
function toggleItemSelection(index) {
    cart[index].selected = !cart[index].selected;
    updateCartState();
}

// Chọn/bỏ chọn tất cả sản phẩm
function toggleSelectAll() {
    const isChecked = selectAllCheckbox.checked;
    cart.forEach(item => {
        item.selected = isChecked;
    });
    updateCartState();
}

// Kiểm tra xem người dùng đã đăng nhập chưa
function isAuthenticated() {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser !== null; 
}

// Xử lý thanh toán
function handleCheckout() {
    const selectedItems = cart.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
        return;
    }
    
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