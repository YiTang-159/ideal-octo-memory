// Biến toàn cục để lưu dữ liệu sản phẩm
let products = [];
let currentProduct = null;

// Lấy ID sản phẩm từ URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// Hiển thị thông báo tự động
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const currentUser = localStorage.getItem("currentUser");
    const cartLink = document.getElementById("cartLink");
    const cartCountBadge = document.getElementById("cartCountBadge");

    // CHỈ HIỆN GIỎ HÀNG KHI ĐÃ ĐĂNG NHẬP
    if (!currentUser) {
        cartLink.style.display = 'none';
        return;
    } else {
        cartLink.style.display = 'inline-block';
    }

    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tính tổng số lượng
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Cập nhật giao diện
    if (totalCount > 0) {
        cartCountBadge.textContent = totalCount;
        cartCountBadge.classList.add("visible");
    } else {
        cartCountBadge.textContent = "0";
        cartCountBadge.classList.remove("visible");
    }
}

// Cập nhật menu người dùng
function updateUserMenu() {
    const userIcon = document.getElementById("userIcon");
    const dropdown = document.getElementById("userDropdown");
    const currentUserString = localStorage.getItem("currentUser");

    if (!userIcon || !dropdown) return;

    dropdown.innerHTML = "";

    if (currentUserString) {
        // ĐÃ ĐĂNG NHẬP
        userIcon.style.display = 'inline-block';

        let authContainer = document.querySelector('.user-menu .auth-buttons');
        if (authContainer) authContainer.style.display = 'none';

        const currentUser = JSON.parse(currentUserString);
        dropdown.innerHTML = `
      <a href="profile.html">Tài khoản</a>
      <a href="#" id="logoutBtn">Đăng xuất</a>
    `;

        // Thêm sự kiện click cho link Tài Khoản
        const profileLink = dropdown.querySelector('a[href="profile.html"]');
        if (profileLink) {
            profileLink.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'profile.html';
            });
        }

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", e => {
                e.preventDefault();
                localStorage.removeItem("currentUser");
                updateUserMenu();
                updateCartCount();
                dropdown.classList.remove("active");
            });
        }

    } else {
        // CHƯA ĐĂNG NHẬP
        userIcon.style.display = 'none';
        dropdown.classList.remove("active");

        let authContainer = document.querySelector(".user-menu .auth-buttons");
        if (!authContainer) {
            const userMenu = document.querySelector(".user-menu");
            if (userMenu) {
                userMenu.insertAdjacentHTML('beforeend', `
          <div class="auth-buttons">
            <a href="login.html" class="auth-btn sign-in-btn">Đăng nhập</a>
            <a href="register.html" class="auth-btn sign-up-btn">Đăng ký</a>
          </div>
        `);
            }
        } else {
            authContainer.style.display = 'flex';
        }
    }
}

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
          <span class="original-price">${product.price.toLocaleString()}đ</span>
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
          <div class="price">${relatedProduct.price.toLocaleString()}đ</div>
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
        showNotification('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        return;
    }

    const productId = getProductIdFromURL();
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!product) {
        showNotification('Sản phẩm không tồn tại!');
        return;
    }

    // Kiểm tra số lượng tồn kho
    const stockCheck = checkStockAvailability(productId, quantity);
    if (!stockCheck.available) {
        showNotification(stockCheck.message);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Kiểm tra tổng số lượng sau khi thêm
        const newTotalQuantity = existingItem.quantity + quantity;
        const stockCheckAfterAdd = checkStockAvailability(productId, newTotalQuantity);

        if (!stockCheckAfterAdd.available) {
            showNotification(stockCheckAfterAdd.message);
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
    showNotification(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    updateCartCount();

    // Cập nhật lại trạng thái nút sau khi thêm vào giỏ
    updateButtonStates();
}

// Mua ngay
function buyNow() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để mua hàng!');
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

// Tìm kiếm sản phẩm
function searchProducts() {
    const searchInput = document.querySelector('.search-bar input');
    const resultsBox = document.querySelector('.search-results');

    const keyword = searchInput.value.trim().toLowerCase();
    resultsBox.innerHTML = "";
    if (keyword === "") {
        resultsBox.classList.remove("active");
        return;
    }

    const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
    if (filtered.length === 0) {
        resultsBox.innerHTML = `<p style="text-align:center; padding:10px; color:#8B0000;">Không tìm thấy sản phẩm</p>`;
        resultsBox.classList.add("active");
        return;
    }

    filtered.forEach(p => {
        const item = document.createElement("div");
        item.classList.add("product-item");
        item.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.name}">
      <div>
        <h4>${p.name}</h4>
        <p>Giá: ${p.price.toLocaleString()}đ</p>
      </div>
    `;
        item.addEventListener("click", () => {
            window.location.href = `product-detail.html?id=${p.id}`;
        });
        resultsBox.appendChild(item);
    });
    resultsBox.classList.add("active");
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function () {
    // Cập nhật menu user và giỏ hàng
    updateUserMenu();
    updateCartCount();

    // Tải dữ liệu sản phẩm
    loadProductData();

    // Thêm chức năng tìm kiếm
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const resultsBox = document.querySelector('.search-results');

    // Thêm sự kiện cho nút tìm kiếm
    searchButton.addEventListener("click", searchProducts);

    // Thêm sự kiện cho phím Enter
    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") searchProducts();
    });

    // Ẩn kết quả tìm kiếm khi click ra ngoài
    document.addEventListener("click", e => {
        if (!e.target.closest(".search-bar") && !e.target.closest(".search-results")) {
            resultsBox.classList.remove("active");
        }
    });

    // Xử lý dropdown user menu
    document.addEventListener("click", e => {
        const userIcon = document.getElementById("userIcon");
        const dropdown = document.getElementById("userDropdown");

        if (!userIcon || !dropdown) return;

        if (userIcon.contains(e.target)) {
            e.stopPropagation();
            dropdown.classList.toggle("active");
        } else if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
});

// Lắng nghe sự thay đổi của localStorage từ các tab khác
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateCartCount();
    }
    if (e.key === 'currentUser') {
        updateUserMenu();
        updateCartCount();
    }
    // Cập nhật sản phẩm khi có thay đổi từ admin
    if (e.key === 'morico_products') {
        products = JSON.parse(localStorage.getItem('morico_products')) || [];
        displayProductDetail();
    }
});