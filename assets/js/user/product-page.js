// JavaScript cho trang sản phẩm
let currentProducts = [];
let currentSearchTerm = '';

// --- PAGINATION VARIABLES ---
let currentPage = 1;
const itemsPerPage = 6;

// Lấy dữ liệu sản phẩm từ localStorage (đã được khởi tạo bởi product.js)
let products = initializeSampleProducts();

// Hàm kiểm tra đăng nhập
function isUserLoggedIn() {
    return localStorage.getItem("currentUser") !== null;
}

// Redundant functions removed as they are now in header.js


// Redundant updateUserMenu removed


// Hàm hiển thị thông báo tự động (Bootstrap Toast)
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

// Hàm lấy sản phẩm hiển thị (loại bỏ sản phẩm ẩn)
function getVisibleProducts() {
    return products.filter(product => product.status === 'active');
}

// Hàm tìm kiếm sản phẩm
function searchProducts(searchTerm) {
    currentPage = 1; // Reset về trang 1

    if (!searchTerm.trim()) {
        currentProducts = getVisibleProducts();
        currentSearchTerm = '';
        updateSearchResultsInfo();
        renderProducts(currentProducts);
        return;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const allProducts = getVisibleProducts();
    const searchResults = allProducts.filter(product => {
        const productName = product.name.toLowerCase();
        const searchWords = normalizedSearchTerm.split(' ');

        return searchWords.every(word =>
            productName.includes(word) && word.length > 1
        );
    });

    currentProducts = searchResults;
    currentSearchTerm = searchTerm;
    updateSearchResultsInfo();
    renderProducts(currentProducts);
}

// Hàm cập nhật thông tin kết quả (tìm kiếm hoặc lọc)
function updateSearchResultsInfo(count) {
    const resultsInfo = document.getElementById('search-results-info');
    if (!resultsInfo) return;

    if (currentSearchTerm) {
        if (count === 0) {
            resultsInfo.innerHTML = `Không tìm thấy sản phẩm nào cho từ khóa "<strong>${currentSearchTerm}</strong>"`;
            resultsInfo.style.color = '#B22222';
        } else {
            resultsInfo.innerHTML = `Tìm thấy <strong>${count}</strong> sản phẩm cho từ khóa "<strong>${currentSearchTerm}</strong>"`;
            resultsInfo.style.color = '#5a2d0c';
        }
    } else if (count < getVisibleProducts().length && count > 0) {
        resultsInfo.innerHTML = `Tìm thấy <strong>${count}</strong> sản phẩm phù hợp với bộ lọc.`;
        resultsInfo.style.color = '#5a2d0c';
    } else if (count === 0 && !currentSearchTerm) {
        resultsInfo.innerHTML = 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc.';
        resultsInfo.style.color = '#B22222';
    } else {
        resultsInfo.innerHTML = '';
    }
}

// Hàm tạo badge trạng thái tồn kho - CHỈ HIỆN KHI HẾT HÀNG
function getStockBadge(product) {
    // Kiểm tra theo stockStatus từ admin
    if (product.stockStatus === 'out-of-stock') {
        return `<div class="stock-badge">Hết hàng</div>`;
    }
    return ''; // Không hiển thị gì khi còn hàng
}

// Hàm hiển thị danh sách sản phẩm (với phân trang)
function renderProducts(productList) {
    const container = document.getElementById("product-list");
    if (!container) return;

    if (productList.length === 0) {
        container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
        <p style="color: #5a2d0c; font-size: 18px; margin-bottom: 20px;">
          Không tìm thấy sản phẩm nào phù hợp.
        </p>
        <button onclick="clearSearch()" style="
          background-color: #8B0000;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-family: 'Century', serif;
          font-size: 16px;
        ">Hiển thị tất cả sản phẩm</button>
      </div>
    `;
        renderPagination(0);
        return;
    }

    // Tính toán phân trang
    const totalPages = Math.ceil(productList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageProducts = productList.slice(startIndex, endIndex);

    container.innerHTML = currentPageProducts.map(product => {
        const stockBadge = getStockBadge(product);
        const isOutOfStock = product.stockStatus === 'out-of-stock';
        const description = product.description ? product.description.replace(/<[^>]*>/g, '') : '';

        return `
    <div class="product-card">
      ${stockBadge}
      <img src="${product.thumbnail}" alt="${product.name}" class="product-img" onerror="this.src='../assets/image/products/default.jpg'">
      <h3>${product.name}</h3>
      <div class="description">${description}</div>
      <div class="price-container">
        <span class="price">${new Intl.NumberFormat('vi-VN').formatToParts(product.price || 0).map(p => (p.type === 'group' ? '\u00A0' : p.value)).join('')}\u00A0₫</span>
      </div>
      <div class="product-actions">
        <div class="action-icon" onclick="viewProductDetail(${product.id})">
          <i class="fa-solid fa-eye"></i>
        </div>
        <div class="action-icon" onclick="addToCart(${product.id})" ${isOutOfStock ? 'style="opacity:0.5; cursor:not-allowed;"' : ''}>
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
      </div>
    </div>
  `}).join("");

    // Render pagination controls
    renderPagination(totalPages);
}

// Hàm render pagination controls
function renderPagination(totalPages) {
    let paginationContainer = document.getElementById('pagination-container');

    // Tạo container nếu chưa có
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.className = 'pagination-container';
        const productsArea = document.querySelector('.products-area');
        productsArea.appendChild(paginationContainer);
    }

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">‹ Trước</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">Sau ›</button>`;
    }

    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

// Hàm chuyển trang
function goToPage(page) {
    currentPage = page;
    const productsToShow = currentProducts.length > 0 ? currentProducts : getVisibleProducts();
    renderProducts(productsToShow);

    // Scroll to top of products
    document.querySelector('.products-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hàm áp dụng bộ lọc (kết hợp cả tìm kiếm tên và bộ lọc sidebar)
function applyFilters() {
    currentPage = 1;

    // Lấy từ khóa tìm kiếm từ header
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const priceFromRaw = document.getElementById('price-from') && document.getElementById('price-from').value;
    const priceToRaw = document.getElementById('price-to') && document.getElementById('price-to').value;
    const priceFrom = priceFromRaw ? parseFloat(priceFromRaw) : null;
    const priceTo = priceToRaw ? parseFloat(priceToRaw) : null;

    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(c => c.value);

    // helper: normalize text (remove diacritics, lowercase)
    function normalizeText(s) {
        if (!s) return '';
        return s.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function matchesCategory(product, selectedCats) {
        if (!selectedCats || selectedCats.length === 0) return true;
        const prodCats = [];
        if (product.category) prodCats.push(product.category);
        if (Array.isArray(product.categories)) prodCats.push(...product.categories);
        const normProdCats = prodCats.map(c => normalizeText(c));
        return selectedCats.some(sc => {
            const normSc = normalizeText(sc);
            return normProdCats.some(pc => pc.includes(normSc));
        });
    }

    let filteredProducts = getVisibleProducts().filter(p => {
        // 1. Kiểm tra tìm kiếm tên (header)
        if (searchTerm) {
            const productName = normalizeText(p.name);
            const searchWords = normalizeText(searchTerm).split(' ');
            const matchesName = searchWords.every(word => productName.includes(word));
            if (!matchesName) return false;
        }

        // 2. Kiểm tra loại bánh
        if (!matchesCategory(p, selectedCategories)) return false;

        // 3. Kiểm tra khoảng giá
        if (priceFrom !== null && !isNaN(priceFrom) && p.price < priceFrom) return false;
        if (priceTo !== null && !isNaN(priceTo) && p.price > priceTo) return false;

        return true;
    });

    currentProducts = filteredProducts;
    currentSearchTerm = searchTerm;
    updateSearchResultsInfo(filteredProducts.length); // Cập nhật thông tin tìm kiếm
    renderProducts(filteredProducts);

    // Đóng dropdown tìm kiếm nhanh nếu có
    const resultsBox = document.querySelector('.search-results');
    if (resultsBox) resultsBox.classList.remove('active');
}

// Hàm đặt lại bộ lọc
function resetFilters() {
    currentPage = 1;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    document.getElementById('price-from').value = '';
    document.getElementById('price-to').value = '';

    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    currentProducts = getVisibleProducts();
    currentSearchTerm = '';
    updateFilterResultsInfo(getVisibleProducts().length);
    renderProducts(getVisibleProducts());
}


// Hiển thị tóm tắt bộ lọc hiện tại (khi người dùng thay đổi checkbox/giá)
function updateFilterSummaryIfIdle() {
    const resultsInfo = document.getElementById('search-results-info');
    const container = document.getElementById('product-list');
    if (!resultsInfo) return;

    // Nếu hiện tại đang hiển thị kết quả (container không rỗng) thì không ghi đè
    if (container && container.innerHTML.trim() !== '') return;

    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(c => c.nextElementSibling ? c.nextElementSibling.textContent.trim() : c.value);
    const priceFrom = document.getElementById('price-from') && document.getElementById('price-from').value;
    const priceTo = document.getElementById('price-to') && document.getElementById('price-to').value;

    const parts = [];
    if (selectedCategories.length) parts.push(`Loại: ${selectedCategories.join(', ')}`);
    if (priceFrom) parts.push(`Giá từ ${new Intl.NumberFormat('vi-VN').formatToParts(Number(priceFrom)).map(p => (p.type === 'group' ? '\u00A0' : p.value)).join('')}\u00A0₫`);
    if (priceTo) parts.push(`đến ${new Intl.NumberFormat('vi-VN').formatToParts(Number(priceTo)).map(p => (p.type === 'group' ? '\u00A0' : p.value)).join('')}\u00A0₫`);

    if (parts.length === 0) {
        resultsInfo.textContent = 'Nhấn "Áp dụng" để xem sản phẩm.';
    } else {
        resultsInfo.textContent = parts.join(' • ') + ' — Nhấn "Áp dụng" để xem kết quả.';
    }
}

// Hàm xem chi tiết sản phẩm
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    if (!isUserLoggedIn()) {
        showNotification("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", "warning");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Kiểm tra tồn kho - KIỂM TRA THEO STOCKSTATUS TỪ ADMIN
    if (product.stockStatus === 'out-of-stock') {
        showNotification("Sản phẩm này hiện đang hết hàng!", "error");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Kiểm tra xem có đủ hàng không
        if (existingItem.quantity >= product.stock) {
            showNotification("Số lượng sản phẩm trong giỏ hàng đã đạt mức tối đa!", "warning");
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`Đã thêm 1 "${product.name}" vào giỏ hàng!`, "success");
    updateCartCount();
}

// Hàm xóa tìm kiếm và hiển thị tất cả sản phẩm
function clearSearch() {
    currentPage = 1;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    currentSearchTerm = '';
    currentProducts = getVisibleProducts();
    updateSearchResultsInfo(getVisibleProducts().length);
    renderProducts(getVisibleProducts());
}

// Khi trang tải xong...
document.addEventListener("DOMContentLoaded", () => {
    // 3. Initial render
    const container = document.getElementById('product-list');
    const resultsInfo = document.getElementById('search-results-info');
    const defaultProducts = getVisibleProducts();
    if (defaultProducts && defaultProducts.length > 0) {
        currentProducts = defaultProducts;
        renderProducts(currentProducts);
    } else {
        if (container) container.innerHTML = '';
        if (resultsInfo) resultsInfo.textContent = 'Chưa có sản phẩm. Vui lòng thêm sản phẩm (admin).';
    }

    // Gắn sự kiện cho nút áp dụng bộ lọc và nút đặt lại
    const applyBtn = document.getElementById("apply-filter-btn");
    if (applyBtn) applyBtn.addEventListener("click", applyFilters);

    const resetBtn = document.getElementById("reset-filter-btn");
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);

    // Gắn sự kiện cho ô tìm kiếm ở header khi đang ở trang sản phẩm
    const searchBtn = document.getElementById("search-button");
    if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
            // Ngừng sự kiện mặc định nếu cần, nhưng quan trọng là gọi applyFilters
            applyFilters();
        });
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                applyFilters();
            }
        });
    }
});

// Dropdown handling moved to header.js

/**
 * Lắng nghe sự thay đổi của giỏ hàng từ các trang khác
 */
window.addEventListener('storage', (e) => {
    // Cập nhật sản phẩm khi có thay đổi từ admin
    if (e.key === 'morico_products') {
        products = JSON.parse(localStorage.getItem('morico_products')) || [];
        currentProducts = getVisibleProducts();
        renderProducts(currentProducts);
    }
});


