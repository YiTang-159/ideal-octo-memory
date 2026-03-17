// Biến toàn cục để lưu dữ liệu sản phẩm
let products = [];
let currentProduct = null;

// Lấy ID sản phẩm từ URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// Hiển thị thông báo tự động (Bootstrap Toast)
function showNotification(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toastEl || !toastMsg) return;
    // Map 'error' → 'danger' to align with Bootstrap text-bg-* classes
    const bsType = type === 'error' ? 'danger' : type;
    toastMsg.textContent = message;
    toastEl.className = 'toast align-items-center border-0 text-bg-' + bsType;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
    toast.show();
}

// Redundant updateCartCount removed


// Redundant updateUserMenu removed


// Tải dữ liệu từ localStorage (đồng bộ với admin)
function loadProductData() {
    try {
        // Đọc dữ liệu từ localStorage
        const storedProducts = localStorage.getItem('morico_products');

        if (!storedProducts) {
            throw new Error('Chưa có dữ liệu sản phẩm. Vui lòng vào trang admin để khởi tạo.');
        }

        products = JSON.parse(storedProducts);

        // Hiển thị chi tiết sản phẩm
        displayProductDetail();

    } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        document.getElementById('product-content').innerHTML = `
      <div class="loading" style="color: #B22222;">
        ${error.message}
      </div>
    `;
    }
}

// Kiểm tra số lượng tồn kho
function checkStockAvailability(productId, requestedQuantity) {
    const product = products.find(p => p.id === productId);
    if (!product) return { available: false, message: "Sản phẩm không tồn tại" };

    if (requestedQuantity > product.stock) {
        return {
            available: false,
            message: `Chỉ còn ${product.stock} sản phẩm trong kho`
        };
    }

    return { available: true, message: "" };
}

// Cập nhật trạng thái nút thêm vào giỏ hàng và mua ngay
function updateButtonStates() {
    if (!currentProduct) return;

    const quantityInput = document.getElementById('quantity');
    const addToCartBtn = document.querySelector('.btn-add-cart');
    const buyNowBtn = document.querySelector('.btn-buy-now');
    const stockWarning = document.querySelector('.stock-warning');

    if (!quantityInput || !addToCartBtn || !buyNowBtn) return;

    const requestedQuantity = parseInt(quantityInput.value);
    const stockCheck = checkStockAvailability(currentProduct.id, requestedQuantity);

    if (stockCheck.available) {
        addToCartBtn.disabled = false;
        buyNowBtn.disabled = false;
        stockWarning.style.display = 'none';
    } else {
        addToCartBtn.disabled = true;
        buyNowBtn.disabled = true;
        stockWarning.textContent = stockCheck.message;
        stockWarning.style.display = 'block';
    }
}

// Hiển thị chi tiết sản phẩm
function displayProductDetail() {
    const productId = getProductIdFromURL();

    if (!productId) {
        document.getElementById('product-content').innerHTML = `
      <div class="loading" style="color: #B22222;">
        Không tìm thấy ID sản phẩm
      </div>
    `;
        return;
    }

    // Tìm sản phẩm
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById('product-content').innerHTML = `
      <div class="loading" style="color: #B22222;">
        Sản phẩm không tồn tại
      </div>
    `;
        return;
    }

    currentProduct = product;

    // Tạo HTML cho trang chi tiết
    const productHTML = `
    <div class="product-detail">
      <div class="product-image">
        <img src="${product.thumbnail}" alt="${product.name}">
      </div>

      <div class="product-info">
        <h1>${product.name}</h1>
        <div class="product-tag">Size Lớn 180g</div>
                      
        <div class="price-section">
          <span class="original-price">${new Intl.NumberFormat('vi-VN').formatToParts(product.price || 0).map(p => (p.type === 'group' ? '\u00A0' : p.value)).join('')}\u00A0₫</span>
        </div>

        <div class="quantity-section">
          <span class="quantity-label">Số Lượng</span>
          <div class="quantity-controls">
            <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="${product.stock}">
            <span class="stock-info"> ${product.stock} sản phẩm có sẵn</span>
          </div>
          <div class="stock-warning"></div>
        </div>

        <div class="action-buttons">
          <button class="btn-add-cart" onclick="addToCartFromDetail()">Thêm Vào Giỏ Hàng</button>
          <button class="btn-buy-now" onclick="buyNow()">Mua Ngay</button>
        </div>
      </div>
    </div>

    <div class="product-details-section">
      <h2 class="section-title">Mô Tả</h2>
      <div class="description-label">${product.description}</div>

      <h2 class="section-title">Thông Tin Sản Phẩm</h2>
      <div class="details-grid" id="product-details">
        ${Object.entries(product.details).map(([key, value]) => `
          <div class="detail-label">${key}:</div>
          <div class="detail-value">${value}</div>
        `).join('')}
      </div>

      <h2 class="section-title">Hướng dẫn sử dụng</h2>
        <p>Thưởng thức trực tiếp hoặc kèm trà nhài để tăng hương vị.</p>
      
      <h2 class="section-title">Hướng dẫn bảo quản</h2>
        <p>Giữ bánh trong hộp kín, tránh ánh nắng trực tiếp.</p>

    </div>

    <div class="related-products">
      <h2>CÓ THỂ BẠN QUAN TÂM</h2>
      <div class="related-grid" id="related-products">
        ${displayRelatedProductsHTML(product.related_product_ids)}
      </div>
    </div>
  `;

    document.getElementById('product-content').innerHTML = productHTML;

    // Thêm sự kiện cho input số lượng
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateButtonStates);
        quantityInput.addEventListener('change', updateButtonStates);
    }

    // Cập nhật trạng thái nút ban đầu
    updateButtonStates();
}

// Hiển thị sản phẩm liên quan (HTML)
function displayRelatedProductsHTML(relatedIds) {
    if (!relatedIds || relatedIds.length === 0) return '';

    const displayIds = relatedIds.slice(0, 4);
    let html = '';

    displayIds.forEach(productId => {
        const relatedProduct = products.find(p => p.id === productId);
        if (relatedProduct) {
            html += `
        <div class="related-product-card">
          <img src="${relatedProduct.thumbnail}" alt="${relatedProduct.name}">
          <h4>${relatedProduct.name}</h4>
          <div class="price">${new Intl.NumberFormat('vi-VN').formatToParts(relatedProduct.price || 0).map(p => (p.type === 'group' ? '\u00A0' : p.value)).join('')}\u00A0₫</div>
          <button onclick="viewProductDetail(${relatedProduct.id})">Xem Chi Tiết</button>
        </div>
      `;
        }
    });

    return html;
}

// Thêm vào giỏ hàng
function addToCartFromDetail() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showNotification("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", "warning");
        return;
    }

    const productId = getProductIdFromURL();
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!product) {
        showNotification("Sản phẩm không tồn tại!", "error");
        return;
    }

    // Kiểm tra số lượng tồn kho
    const stockCheck = checkStockAvailability(productId, quantity);
    if (!stockCheck.available) {
        showNotification(stockCheck.message, "error");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Kiểm tra tổng số lượng sau khi thêm
        const newTotalQuantity = existingItem.quantity + quantity;
        const stockCheckAfterAdd = checkStockAvailability(productId, newTotalQuantity);

        if (!stockCheckAfterAdd.available) {
            showNotification(stockCheckAfterAdd.message, "error");
            return;
        }

        existingItem.quantity = newTotalQuantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`, "success");
    updateCartCount();

    // Cập nhật lại trạng thái nút sau khi thêm vào giỏ
    updateButtonStates();
}

// Mua ngay
function buyNow() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showNotification("Vui lòng đăng nhập để mua hàng!", "warning");
        return;
    }

    // Thêm vào giỏ hàng trước
    const added = addToCartFromDetail();

    // Nếu thêm thành công thì chuyển hướng
    if (added !== false) {
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    }
}

// Xem chi tiết sản phẩm khác
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Redundant listeners moved to header.js

// Khởi tạo trang khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    loadProductData();
});

// Lắng nghe sự thay đổi của localStorage từ các tab khác
window.addEventListener('storage', (e) => {
    // Cập nhật sản phẩm khi có thay đổi từ admin
    if (e.key === 'morico_products') {
        products = JSON.parse(localStorage.getItem('morico_products')) || [];
        displayProductDetail();
    }
});
