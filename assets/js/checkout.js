// Biến toàn cục
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

// DOM elements
const customerName = document.getElementById('customer-name');
const customerPhone = document.getElementById('customer-phone');
const customerAddress = document.getElementById('customer-address');
const addAddressBtn = document.getElementById('add-address-btn');
const newAddressForm = document.getElementById('new-address-form');
const saveAddressBtn = document.getElementById('save-address-btn');
const cancelAddressBtn = document.getElementById('cancel-address-btn');
const itemsList = document.getElementById('items-list');
const totalAmountEl = document.getElementById('total-amount');
const confirmBtn = document.getElementById('confirm-btn');
const transferOptions = document.getElementById('transfer-options');

// Khởi tạo giao diện
function initCheckout() {
    if (!currentUser) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang login
        window.location.href = '../pages/login.html';
        return;
    }

    // Hiển thị thông tin người dùng nếu có
    customerName.value = currentUser.name || '';
    customerPhone.value = currentUser.phone || '';

    renderCartItems();
    renderAddresses();
}

function renderCartItems() {
    itemsList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'order-item';

        const info = document.createElement('div');
        info.className = 'item-info';
        info.innerHTML = `<div class="item-name">${item.name}</div>
                          <div class="item-quantity">x ${item.quantity}</div>`;

        const price = document.createElement('div');
        price.className = 'item-price';
        const itemTotal = item.price * item.quantity;
        price.textContent = itemTotal.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});

        li.appendChild(info);
        li.appendChild(price);
        itemsList.appendChild(li);

        total += itemTotal;
    });

    totalAmountEl.textContent = total.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
}

function renderAddresses() {
    const addressContainer = document.getElementById('address-list');
    addressContainer.innerHTML = '';

    addresses.forEach((addr, idx) => {
        const div = document.createElement('div');
        div.className = 'address-option';
        div.dataset.index = idx;

        div.innerHTML = `
            <input type="radio" name="selected-address" ${idx === 0 ? 'checked' : ''}>
            <div class="address-label">${addr.label}</div>
            <div class="address-details">${addr.full}</div>
            <div class="address-contact">${addr.phone}</div>
            <button class="delete-address-btn">X</button>
        `;

        // Xử lý chọn địa chỉ
        div.querySelector('input').addEventListener('change', () => {
            document.querySelectorAll('.address-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
        });

        // Xử lý xóa
        div.querySelector('.delete-address-btn').addEventListener('click', () => {
            addresses.splice(idx, 1);
            localStorage.setItem('addresses', JSON.stringify(addresses));
            renderAddresses();
        });

        addressContainer.appendChild(div);
    });
}

addAddressBtn.addEventListener('click', () => {
    newAddressForm.style.display = 'block';
});

cancelAddressBtn.addEventListener('click', () => {
    newAddressForm.style.display = 'none';
});

saveAddressBtn.addEventListener('click', () => {
    const label = document.getElementById('addr-label').value.trim();
    const full = document.getElementById('addr-full').value.trim();
    const phone = document.getElementById('addr-phone').value.trim();

    if (!label || !full || !phone) {
        alert('Vui lòng điền đầy đủ thông tin địa chỉ');
        return;
    }

    addresses.push({label, full, phone});
    localStorage.setItem('addresses', JSON.stringify(addresses));
    newAddressForm.style.display = 'none';
    renderAddresses();
});

// Chọn phương thức thanh toán
document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'bank') {
            transferOptions.style.display = 'block';
        } else {
            transferOptions.style.display = 'none';
        }
    });
});

confirmBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Giỏ hàng trống');
        return;
    }

    // Lấy địa chỉ đã chọn
    const selected = document.querySelector('input[name="selected-address"]:checked');
    if (!selected) {
        alert('Vui lòng chọn địa chỉ giao hàng');
        return;
    }

    const addressIndex = Array.from(document.querySelectorAll('input[name="selected-address"]')).indexOf(selected);
    const chosenAddress = addresses[addressIndex];

    // Tạo đơn hàng
    const order = {
        id: 'DH' + Date.now(),
        user: currentUser.email,
        items: cart,
        total: parseFloat(totalAmountEl.textContent.replace(/[^0-9-.,]+/g, '')),
        address: chosenAddress,
        payment: document.querySelector('input[name="payment-method"]:checked').value,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };

    // Lưu đơn vào localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Xóa giỏ hàng
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));

    // Chuyển hướng sang trang xác nhận / lịch sử
    alert('Đặt hàng thành công!');
    window.location.href = '../pages/history.html';
});

// Khởi tạo
initCheckout();
