// JavaScript cho trang sản phẩm
let currentProducts = [];
let currentSearchTerm = '';

// --- PAGINATION VARIABLES ---
let currentPage = 1;
const itemsPerPage = 6;

// --- KHAI BÁO BIẾN TOÀN CỤC ---
const cartCountBadge = document.getElementById("cartCountBadge");
const cartLink = document.getElementById("cartLink");

// Khởi tạo dữ liệu mẫu nếu localStorage trống
function initializeSampleData() {
    if (!localStorage.getItem('morico_products')) {
        console.log('🚀 Khởi tạo dữ liệu sản phẩm mẫu lần đầu...');

        const sampleProducts = [
            {
                id: 1,
                code: "SP001",
                name: "Bánh Trung Thu Golden Plum",
                price: 189000,
                cost: 120000,
                thumbnail: "../assets/image/product/banh-trung-thu-golden-plum.png",
                category: "ngot",
                stock: 25,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân ngọt",
                    "Trọng lượng": "150g",
                    "Thành phần": "Mận vàng cao cấp, bột mì, bơ, trứng gà, đường...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `<p>Tinh tế và mới mẻ, <strong>bánh Trung Thu Golden Plum</strong> là sự kết hợp hài hòa giữa vị ngọt của mận vàng và lớp vỏ bánh nướng thơm mềm.</p>`
            },
            {
                id: 2,
                code: "SP002",
                name: "Bánh Trung Thu Hotate XO Mixed Nuts",
                price: 139000,
                cost: 90000,
                thumbnail: "../assets/image/product/banh-trung-thu-hotate-xo-mixed-nuts.png",
                category: "man",
                stock: 12,
                stockStatus: "low-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân mặn",
                    "Trọng lượng": "150g",
                    "Thành phần": "Sò điệp XO, các loại hạt, lạp xưởng...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `<p><strong>Bánh Hotate XO Mixed Nuts</strong> kết hợp vị mặn đậm đà của sốt sò điệp XO cùng sự bùi béo của các loại hạt.</p>`
            },
            {
                id: 3,
                code: "SP003",
                name: "Bánh Trung Thu Matcha",
                price: 99000,
                cost: 65000,
                thumbnail: "../assets/image/product/banh-trung-thu-matcha.png",
                category: "ngot",
                stock: 40,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân trà xanh",
                    "Trọng lượng": "150g",
                    "Thành phần": "Bột matcha, đậu xanh...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `<p><strong>Bánh Matcha</strong> mang hương vị thanh mát của trà xanh Nhật Bản.</p>`
            },
            {
                id: 4,
                code: "SP004",
                name: "Bánh Trung Thu Murasaki Imo",
                price: 115000,
                cost: 75000,
                thumbnail: "../assets/image/product/banh-trung-thu-murasaki-imo.png",
                category: "ngot",
                stock: 30,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân ngọt",
                    "Trọng lượng": "150g",
                    "Thành phần": "Khoai lang tím Nhật...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `<p><strong>Murasaki Imo</strong> mang sắc tím dịu dàng của khoai lang Nhật.</p>`
            },
            {
                id: 5,
                code: "SP005",
                name: "Bánh Trung Thu Mushroom Mixed Nuts",
                price: 129000,
                cost: 85000,
                thumbnail: "../assets/image/product/banh-trung-thu-mushroom-mixed-nuts.png",
                category: "chay",
                stock: 18,
                stockStatus: "low-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh chay",
                    "Trọng lượng": "150g",
                    "Thành phần": "Nấm hương, hạt điều, hạt sen...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `<p><strong>Mushroom Mixed Nuts</strong> - lựa chọn thanh đạm cho người ăn chay.</p>`
            },
            {
                id: 6,
                code: "SP006",
                name: "Bánh Trung Thu Hạt Sen Dừa Non",
                price: 105000,
                cost: 70000,
                thumbnail: "../assets/image/product/banh-trung-thu-pink-nocturne.png",
                category: "ngot",
                stock: 50,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng",
                    "Trọng lượng": "150g",
                    "Thành phần": "Hạt sen, dừa non...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `<p><strong>Hạt Sen Dừa Non</strong> mang vị ngọt thanh, bùi béo.</p>`
            },
            {
                id: 7,
                code: "SP007",
                name: "Bánh Trung Thu Đậu Đỏ Trứng Muối",
                price: 125000,
                cost: 80000,
                thumbnail: "../assets/image/product/banh-trung-thu-takesumi-orange.png",
                category: "man",
                stock: 0,
                stockStatus: "out-of-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân mặn",
                    "Trọng lượng": "150g",
                    "Thành phần": "Đậu đỏ, trứng muối...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `<p><strong>Đậu Đỏ Trứng Muối</strong> - vị mặn ngọt hài hòa truyền thống.</p>`
            }
        ];

        localStorage.setItem('morico_products', JSON.stringify(sampleProducts));
        console.log('✅ Đã khởi tạo ' + sampleProducts.length + ' sản phẩm mẫu');
        return sampleProducts;
    }
    return JSON.parse(localStorage.getItem('morico_products'));
}

// Lấy dữ liệu sản phẩm từ localStorage (đồng bộ với admin)
let products = initializeSampleData();

// Hàm kiểm tra đăng nhập
function isUserLoggedIn() {
    return localStorage.getItem("currentUser") !== null;
}

/**
 * Cập nhật số lượng hiển thị trên icon giỏ hàng
 */
function updateCartCount() {
    const currentUser = localStorage.getItem("currentUser");

    // CHỈ HIỆN GIỎ HÀNG KHI ĐÃ ĐĂNG NHẬP
    if (!currentUser) {
        cartLink.style.display = 'none';
        return;
    } else {
        cartLink.style.display = 'inline-block';
    }

    // 1. Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2. Tính tổng số lượng (dùng reduce)
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // 3. Cập nhật giao diện
    if (totalCount > 0) {
        cartCountBadge.textContent = totalCount;
        cartCountBadge.classList.add("visible"); // Hiện badge
    } else {
        cartCountBadge.textContent = "0";
        cartCountBadge.classList.remove("visible"); // Ẩn badge
    }
}

/**
 * Cập nhật menu người dùng dựa trên trạng thái đăng nhập
 */
function updateUserMenu() {
    const userIcon = document.getElementById("userIcon");
    const dropdown = document.getElementById("userDropdown");
    const currentUserString = localStorage.getItem("currentUser");

    if (!userIcon || !dropdown) return; // Bảo vệ nếu DOM chưa sẵn sàng

    dropdown.innerHTML = "";

    if (currentUserString) {
        // --- TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP ---
        userIcon.style.display = 'inline-block';

        let authContainer = document.querySelector('.user-menu .auth-buttons');
        if (authContainer) authContainer.style.display = 'none';

        const currentUser = JSON.parse(currentUserString);
        dropdown.innerHTML = `
      <a href="profile.html">Tài Khoản</a>
      <a href="#" id="logoutBtn">Đăng Xuất</a>
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
                updateCartCount(); // Cập nhật lại giỏ hàng khi logout
                dropdown.classList.remove("active");
                showNotification("Đã đăng xuất thành công!");
            });
        }

    } else {
        // --- TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP ---
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

// Hàm hiển thị thông báo tự động
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification'; // Reset classes
    notification.classList.add(type);
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
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

// Hàm cập nhật thông tin kết quả tìm kiếm
function updateSearchResultsInfo() {
    const resultsInfo = document.getElementById('search-results-info');

    if (currentSearchTerm) {
        if (currentProducts.length === 0) {
            resultsInfo.innerHTML = `Không tìm thấy sản phẩm nào cho từ khóa "<strong>${currentSearchTerm}</strong>"`;
            resultsInfo.style.color = '#B22222';
        } else {
            resultsInfo.innerHTML = `Tìm thấy <strong>${currentProducts.length}</strong> sản phẩm cho từ khóa "<strong>${currentSearchTerm}</strong>"`;
            resultsInfo.style.color = '#5a2d0c';
        }
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
        <span class="price">${product.price.toLocaleString()}đ</span>
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

// Hàm áp dụng bộ lọc
function applyFilters() {
    // Only filter by category and price. Results are shown when user clicks "Áp dụng".
    // Reset to first page if pagination used later
    currentPage = 1;

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
        if (!matchesCategory(p, selectedCategories)) return false;
        if (priceFrom !== null && typeof p.price === 'number' && p.price < priceFrom) return false;
        if (priceTo !== null && typeof p.price === 'number' && p.price > priceTo) return false;
        return true;
    });

    currentProducts = filteredProducts;
    currentSearchTerm = '';
    updateFilterResultsInfo(filteredProducts.length);
    renderProducts(filteredProducts);
}

// Hàm đặt lại bộ lọc
function resetFilters() {
    currentPage = 1;
    const filterNameEl = document.getElementById('filter-name');
    if (filterNameEl) filterNameEl.value = '';
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

// Hàm cập nhật thông tin kết quả lọc
function updateFilterResultsInfo(count) {
    const resultsInfo = document.getElementById('search-results-info');

    if (!resultsInfo) return;

    if (count === 0) {
        resultsInfo.innerHTML = 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc.';
        resultsInfo.style.color = '#B22222';
    } else if (count === getVisibleProducts().length) {
        resultsInfo.innerHTML = '';
    } else {
        resultsInfo.innerHTML = `Tìm thấy <strong>${count}</strong> sản phẩm phù hợp.`;
        resultsInfo.style.color = '#5a2d0c';
    }
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
    if (priceFrom) parts.push(`Giá từ ${Number(priceFrom).toLocaleString('vi-VN')}₫`);
    if (priceTo) parts.push(`đến ${Number(priceTo).toLocaleString('vi-VN')}₫`);

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
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
    updateCartCount();
}

// Hàm xóa tìm kiếm và hiển thị tất cả sản phẩm
function clearSearch() {
    currentPage = 1;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    currentSearchTerm = '';
    currentProducts = getVisibleProducts();
    updateSearchResultsInfo();
    updateFilterResultsInfo(getVisibleProducts().length);
    renderProducts(getVisibleProducts());
}

// Khi trang tải xong...
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cập nhật menu user ngay khi tải trang
    updateUserMenu();

    // 2. Cập nhật số lượng giỏ hàng
    updateCartCount();

    // 3. Initial render: show default (unfiltered) products on load
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
});

// 4. XỬ LÝ BẬT/TẮT DROPDOWN
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

/**
 * Lắng nghe sự thay đổi của giỏ hàng từ các trang khác
 */
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
        currentProducts = getVisibleProducts();
        renderProducts(currentProducts);
    }
});

