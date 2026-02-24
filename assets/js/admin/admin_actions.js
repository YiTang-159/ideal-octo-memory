admin - actions.js
/**
 * ============================
 * Admin Actions - JS chung cho Admin Panel
 * ============================
 * Bao gồm: Utility, Category, Product/Inventory, Logout
 */

// ===== 1️⃣ UTILITY FUNCTIONS =====
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
function formatNumber(num) {
  return num.toLocaleString('vi-VN');
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}
function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  alert(`[${type.toUpperCase()}] ${message}`);
}
function handleLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
  }
}
window.handleLogout = handleLogout;

// ===== 2️⃣ CATEGORY MANAGEMENT =====
const CATEGORIES_STORAGE_KEY = "admin_categories_data";
let categories = [];
let isEditing = false;
let editingIndex = -1;

function getCategories() {
  const storedData = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (storedData) {
    try { return JSON.parse(storedData); } catch { return []; }
  }
  const defaultCategories = [
    { name: "Bánh nướng", subcategories: ["Thập cẩm", "Đậu xanh"], status: "active" },
    { name: "Bánh dẻo", subcategories: ["Sen nhuyễn", "Khoai môn"], status: "active" },
    { name: "Bánh chay", subcategories: ["Hạt sen", "Dừa"], status: "hidden" }
  ];
  saveCategories(defaultCategories);
  return defaultCategories;
}
function saveCategories(cats) { localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats)); }

function renderCategories() {
  categories = getCategories();
  const tbody = document.getElementById("categoryTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  categories.forEach((cat, index) => {
    const active = cat.status === "active";
    const statusText = active ? "Đang hiển thị" : "Đã ẩn";
    const statusClass = active ? "in-stock" : "status-hidden";
    const toggleBtnClass = active ? "btn-hide" : "btn-success";
    const toggleBtnText = active ? '<i class="fas fa-eye-slash"></i> Ẩn' : '<i class="fas fa-eye"></i> Hiện';

    tbody.innerHTML += `
      <tr>
        <td>${cat.name}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn btn-sm btn-edit" onclick="editCategory(${index})"><i class="fas fa-edit"></i> Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory(${index})"><i class="fas fa-trash"></i> Xóa</button>
          <button class="btn btn-sm ${toggleBtnClass}" data-status="${cat.status}" onclick="toggleCategoryStatus(${index})">${toggleBtnText}</button>
        </td>
      </tr>
    `;
  });
}

function editCategory(index) {
  const cat = categories[index];
  const nameInput = document.getElementById("category-name");
  const title = document.getElementById("category-form-title");
  const submitBtn = document.querySelector('#categoryForm button[type="submit"]');
  const cancelBtn = document.querySelector('#categoryForm .btn-secondary');

  isEditing = true;
  editingIndex = index;
  // Mark the form with edit index so other scripts (if any) can detect edit mode
  const form = document.getElementById('categoryForm');
  if (form) form.dataset.editIndex = index;
  nameInput.value = cat.name;
  title.innerHTML = `<i class="fas fa-edit"></i> Sửa loại: ${cat.name}`;
  submitBtn.textContent = "Cập nhật";
  cancelBtn.textContent = "Hủy sửa";
  showNotification(`Đang chỉnh sửa loại: "${cat.name}"`, 'info');
}

function toggleCategoryStatus(index) {
  const current = categories[index];
  current.status = current.status === "active" ? "hidden" : "active";
  saveCategories(categories);
  renderCategories();
  showNotification(`Đã ${current.status === "active" ? "HIỆN" : "ẨN"} loại: ${current.name}.`, 'info');
}

function deleteCategory(index) {
  if (confirm(`Bạn có chắc chắn muốn xóa "${categories[index].name}"?`)) {
    const deleted = categories[index].name;
    categories.splice(index, 1);
    saveCategories(categories);
    renderCategories();
    showNotification(`Đã xóa loại: ${deleted}.`, 'error');
  }
}

function resetCategoryForm() {
  const nameInput = document.getElementById("category-name");
  const title = document.getElementById("category-form-title");
  const submitBtn = document.querySelector('#categoryForm button[type="submit"]');
  const cancelBtn = document.querySelector('#categoryForm .btn-secondary');

  nameInput.value = "";
  title.innerHTML = '<i class="fas fa-plus-circle"></i> Thêm loại mới';
  submitBtn.textContent = "Lưu";
  cancelBtn.textContent = "Hủy";
  isEditing = false;
  editingIndex = -1;
  const form = document.getElementById('categoryForm');
  if (form && form.dataset) delete form.dataset.editIndex;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("categoryForm");
  const input = document.getElementById("category-name");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) return;
      const formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      if (isEditing) {
        categories[editingIndex].name = formatted;
        showNotification(`Cập nhật thành công: ${formatted}`, 'success');
      } else {
        categories.push({ name: formatted, subcategories: [], status: "active" });
        showNotification(`Thêm mới loại: ${formatted}`, 'success');
      }
      saveCategories(categories);
      renderCategories();
      resetCategoryForm();
    });
  }
});

// Khởi tạo sample category
function initializeSampleCategories() { categories = getCategories(); renderCategories(); }
window.editCategory = editCategory;
window.toggleCategoryStatus = toggleCategoryStatus;
window.resetCategoryForm = resetCategoryForm;
window.renderCategories = renderCategories;
window.initializeSampleCategories = initializeSampleCategories;

// ===== 3️⃣ PRODUCT/INVENTORY MANAGEMENT =====
const PRODUCTS_STORAGE_KEY = 'morico_products';

function getProductData() {
  try {
    const productsJSON = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return productsJSON ? JSON.parse(productsJSON) : [];
  } catch (error) { console.error(error); return []; }
}
function saveProductData(productsToSave) {
  try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToSave)); return true; }
  catch (error) { console.error(error); return false; }
}
window.getProductData = getProductData;

function updateInventoryStatusDisplay(stockQtyCell, statusCell) {
  if (stockQtyCell.getAttribute('data-status') === 'inactive') return;
  const qty = parseInt(stockQtyCell.textContent.replace(/\./g, ''), 10);
  let text, cls;
  if (qty === 0) [text, cls] = ['HẾT HÀNG', 'out-of-stock'];
  else if (qty <= 10) [text, cls] = ['SẮP HẾT!', 'out-of-stock'];
  else[text, cls] = ['Bình thường', 'in-stock'];
  statusCell.innerHTML = `<span class="status ${cls}">${text}</span>`;
}
window.updateInventoryStatusDisplay = updateInventoryStatusDisplay;

function adjustInventory(buttonElement, action, productId) {
  const row = buttonElement.closest('tr');
  const qtyInput = row.querySelector('.input-qty');
  const stockQtyCell = row.querySelector('.stock-qty');
  const statusCell = row.querySelector('.status-cell');
  const lastUpdateCell = row.querySelector('.last-update-cell');
  const pid = parseInt(productId, 10);
  let products = getProductData();
  const productIndex = products.findIndex((p) => p.id === pid);
  if (productIndex === -1) return showNotification('Không tìm thấy sản phẩm.', 'error');
  const quantity = parseInt(qtyInput.value, 10);
  if (isNaN(quantity) || quantity <= 0) return showNotification('Số lượng phải > 0.', 'error');
  let newQty = action === 'add' ? products[productIndex].stock + quantity : products[productIndex].stock - quantity;
  if (newQty < 0) return showNotification('Không thể xuất vượt quá tồn.', 'error');
  products[productIndex].stock = newQty;
  products[productIndex].lastStockUpdate = new Date().toISOString();
  saveProductData(products);
  stockQtyCell.textContent = formatNumber(newQty);
  lastUpdateCell.textContent = `${formatDate(products[productIndex].lastStockUpdate)} ${new Date(products[productIndex].lastStockUpdate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  updateInventoryStatusDisplay(stockQtyCell, statusCell);
  qtyInput.value = 1;
  showNotification(`Cập nhật ${products[productIndex].name}: tồn kho ${formatNumber(newQty)}`, 'success');
}
window.adjustInventory = adjustInventory;

function toggleInventoryStatus(buttonElement, productId) {
  const row = buttonElement.closest('tr');
  const stockQtyCell = row.querySelector('.stock-qty');
  const statusCell = row.querySelector('.status-cell');
  const pid = parseInt(productId, 10);
  let products = getProductData();
  const productIndex = products.findIndex((p) => p.id === pid);
  if (productIndex === -1) return showNotification('Không tìm thấy sản phẩm.', 'error');
  const product = products[productIndex];
  const isActive = product.status === 'active';
  product.status = isActive ? 'inactive' : 'active';
  saveProductData(products);
  stockQtyCell.setAttribute('data-status', product.status);
  if (isActive) statusCell.innerHTML = `<span class="status action-stopped">DỪNG BÁN</span>`;
  else updateInventoryStatusDisplay(stockQtyCell, statusCell);
  buttonElement.innerHTML = `<i class="fas ${product.status === 'active' ? 'fa-ban' : 'fa-check'}"></i> ${isActive ? 'Bán Lại' : 'Dừng Bán'}`;
  buttonElement.classList.toggle('btn-success', !isActive);
  buttonElement.classList.toggle('btn-delete', isActive);
  showNotification(isActive ? `Đã DỪNG BÁN ${product.name}` : `Đã KÍCH HOẠT LẠI ${product.name}`, isActive ? 'warning' : 'success');
}
window.toggleInventoryStatus = toggleInventoryStatus;

function generateInventoryReport() {
  const products = getProductData();
  const categoriesMap = getCategories().reduce((map, c) => { map[c.name] = c.name; return map; }, {});
  products.sort((a, b) => {
    const prio = p => p.status === 'inactive' ? 3 : p.stock === 0 ? 0 : p.stock <= 10 ? 1 : 2;
    const prioA = prio(a), prioB = prio(b);
    return prioA !== prioB ? prioA - prioB : a.id - b.id;
  });
  return products.map(p => {
    let statusText, statusClass;
    if (p.status === 'inactive') { statusText = 'DỪNG BÁN'; statusClass = 'action-stopped'; }
    else if (p.stock === 0) { statusText = 'HẾT HÀNG'; statusClass = 'out-of-stock'; }
    else if (p.stock <= 10) { statusText = 'SẮP HẾT!'; statusClass = 'out-of-stock'; }
    else { statusText = 'Bình thường'; statusClass = 'in-stock'; }
    const categoryName = p.category && categoriesMap[p.category] ? p.category : 'Chưa phân loại';
    return {
      ...p, displayStock: formatNumber(p.stock), displayPrice: formatCurrency(p.price),
      displayStatusText: statusText, displayStatusClass: statusClass,
      displayLastUpdate: `${formatDate(p.lastStockUpdate)} ${new Date(p.lastStockUpdate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
      categoryName
    };
  });
}
window.generateInventoryReport = generateInventoryReport;
