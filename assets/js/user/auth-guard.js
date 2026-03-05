/**
 * auth-guard.js - Protects routes that require authentication
 */

(function () {
    const currentUser = localStorage.getItem("currentUser");

    // List of protected pages (basenames)
    const protectedPages = [
        'cart.html',
        'history.html',
        'checkout.html',
        'profile.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();

    if (!currentUser && protectedPages.includes(currentPage)) {
        alert("Bạn cần đăng nhập để truy cập trang này.");

        // Determine redirect path to login.html based on where we are
        const isRoot = !window.location.pathname.includes('/pages/');
        const redirectPath = isRoot ? 'pages/login.html' : 'login.html';

        window.location.href = redirectPath;
    }
})();
