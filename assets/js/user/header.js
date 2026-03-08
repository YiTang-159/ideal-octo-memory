// --- KHAI BÁO BIẾN TOÀN CỤC ---
const cartCountBadge = document.getElementById("cartCountBadge");
const cartLink = document.getElementById("cartLink");

/**
 * Cập nhật số lượng hiển thị trên icon giỏ hàng
 */
function updateCartCount() {
    if (!cartLink) return;

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
    if (cartCountBadge) {
        if (totalCount > 0) {
            cartCountBadge.textContent = totalCount;
            cartCountBadge.classList.add("visible");
        } else {
            cartCountBadge.textContent = "0";
            cartCountBadge.classList.remove("visible");
        }
    }
}

/**
 * Cập nhật menu người dùng dựa trên trạng thái đăng nhập
 */
function updateUserMenu() {
    const userIcon = document.getElementById("userIcon");
    const dropdown = document.getElementById("userDropdown");
    const currentUserString = localStorage.getItem("currentUser");

    if (!userIcon || !dropdown) return;

    dropdown.innerHTML = "";

    // Determine path prefix based on location
    const isRoot = !window.location.pathname.includes('/pages/');
    const pathPrefix = isRoot ? 'pages/' : '';

    if (currentUserString) {
        // --- TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP ---
        userIcon.style.display = 'inline-block';

        let authContainer = document.querySelector('.user-menu .auth-buttons');
        if (authContainer) authContainer.style.display = 'none';

        dropdown.innerHTML = `
            <a href="${pathPrefix}profile.html">Tài khoản</a>
            <a href="${pathPrefix}history.html">Lịch sử mua hàng</a>
            <a href="#" id="logoutBtn">Đăng xuất</a>
        `;

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", e => {
                e.preventDefault();
                localStorage.removeItem("currentUser");
                updateUserMenu();
                updateCartCount();
                dropdown.classList.remove("active");

                // Redirect to login if on a protected page
                const protectedPages = ['cart.html', 'history.html', 'checkout.html', 'profile.html'];
                const currentPage = window.location.pathname.split('/').pop();
                if (protectedPages.includes(currentPage)) {
                    window.location.href = isRoot ? 'pages/login.html' : 'login.html';
                }
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
                        <a href="${pathPrefix}login.html" class="auth-btn sign-in-btn">Đăng nhập</a>
                        <a href="${pathPrefix}register.html" class="auth-btn sign-up-btn">Đăng ký</a>
                    </div>
                `);
            }
        } else {
            authContainer.style.display = 'flex';
        }
    }
}

// --- CHẠY KHI TÀI LIỆU SẴN SÀNG (DOMContentLoaded) ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cập nhật menu user ngay khi tải trang
    updateUserMenu();

    // 2. Cập nhật số lượng giỏ hàng
    updateCartCount();

    // 3. XỬ LÝ TÌM KIẾM
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const resultsBox = document.querySelector('.search-results');

    if (searchInput && searchButton && resultsBox) {
        const isRoot = !window.location.pathname.includes('/pages/');
        const imgPathPrefix = isRoot ? '' : '../';
        const pagePathPrefix = isRoot ? 'pages/' : '';

        const products = [
            { id: 1, name: "Bánh Trung Thu Golden Plum", price: "189.000đ", image: "assets/image/product/banh-trung-thu-golden-plum.png" },
            { id: 2, name: "Bánh Trung Thu Hotate XO Mixed Nuts", price: "139.000đ", image: "assets/image/product/banh-trung-thu-hotate-xo-mixed-nuts.png" },
            { id: 3, name: "Bánh Trung Thu Matcha", price: "99.000đ", image: "assets/image/product/banh-trung-thu-matcha.png" },
            { id: 4, name: "Bánh Trung Thu Murasaki Imo", price: "115.000đ", image: "assets/image/product/banh-trung-thu-murasaki-Imo.png" },
            { id: 5, name: "Bánh Trung Thu Mushroom Mixed Nuts", price: "129.000đ", image: "assets/image/product/banh-trung-thu-mushroom-mixed-nuts.png" },
            { id: 6, name: "Bánh Trung Thu Pink Nocturne", price: "105.000đ", image: "assets/image/product/banh-trung-thu-pink-nocturne.png" },
            { id: 7, name: "Bánh Trung Thu Takesumi Orange", price: "125.000đ", image: "assets/image/product/banh-trung-thu-takesumi-orange.png" },
            { id: 8, name: "Bánh Trung Thu Xôi Gấc", price: "95.000đ", image: "assets/image/product/banh-trung-thu-xoi-gac.png" }
        ];

        function searchProducts() {
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
                    <img src="${imgPathPrefix}${p.image}" alt="${p.name}">
                    <div>
                        <h4>${p.name}</h4>
                        <p>Giá: ${p.price}</p>
                    </div>
                `;
                item.addEventListener("click", () => {
                    window.location.href = `${pagePathPrefix}product-detail.html?id=${p.id}`;
                });
                resultsBox.appendChild(item);
            });
            resultsBox.classList.add("active");
        }

        searchButton.addEventListener("click", searchProducts);
        searchInput.addEventListener("keypress", e => {
            if (e.key === "Enter") searchProducts();
        });

        document.addEventListener("click", e => {
            if (!e.target.closest(".search-bar") && !e.target.closest(".search-results")) {
                resultsBox.classList.remove("active");
            }
        });
    }
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
});

// --- XỬ LÝ ẨN/HIỆN NAVBAR KHI CUỘN ---
(function () {
    const navBar = document.querySelector('.nav-bar');
    if (!navBar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 10) {
            // Đang cuộn xuống → ẩn nav
            navBar.classList.add('nav-hidden');
        } else {
            // Đang cuộn lên → hiện nav
            navBar.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
})();
