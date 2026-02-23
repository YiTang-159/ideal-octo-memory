/**
 * main.js - File chứa các hàm utility chung cho Literary Haven Admin
 * (Thay thế cho admin_actions.js cũ)
 * Lưu ý: Dữ liệu sản phẩm được lưu trữ trong key 'morico_products'
 */

// Định nghĩa key lưu trữ chính
const DATA_KEY = 'morico_products';

/**
 * Lấy dữ liệu sản phẩm từ LocalStorage.
 * Trả về đối tượng { products: [...] }
 */
function getData() {
    try {
        const productsJSON = localStorage.getItem(DATA_KEY);
        const productsArray = productsJSON ? JSON.parse(productsJSON) : [];
        // Trả về định dạng mà script trong inventory.html mong muốn
        return { products: productsArray };
    } catch (error) {
        console.error(`Error getting data from localStorage (${DATA_KEY}):`, error);
        return { products: [] };
    }
}

/**
 * Lưu dữ liệu sản phẩm vào LocalStorage.
 * Yêu cầu đầu vào là đối tượng { products: [...] }
 */
function saveData(dataObject) {
    if (dataObject && Array.isArray(dataObject.products)) {
        try {
            localStorage.setItem(DATA_KEY, JSON.stringify(dataObject.products));
            return true;
        } catch (error) {
            console.error(`Error saving data to localStorage (${DATA_KEY}):`, error);
            return false;
        }
    }
    return false;
}

// Hàm khởi tạo người dùng (ví dụ)
function initializeSampleUser() {
    if (!localStorage.getItem('loggedInUser')) {
        localStorage.setItem('loggedInUser', 'admin');
    }
}

// Khởi tạo user khi trang load
document.addEventListener('DOMContentLoaded', initializeSampleUser);

// [Optional: Thêm các hàm utility khác như formatCurrency, formatDate nếu cần]

// Ví dụ: format ngày tháng (dùng trong script cũ)
function formatDateTime(dateString) {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return "Lỗi định dạng ngày";
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        return date.toLocaleDateString("vi-VN", options).replace(',', '');
    } catch (e) {
        return "";
    }
}