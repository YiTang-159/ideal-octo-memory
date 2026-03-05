// --- KHAI BÁO BIẾN TOÀN CỤC ---
const orders = JSON.parse(localStorage.getItem('orders')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const ordersList = document.getElementById('orders-list');

function initHistory() {
    if (!currentUser) return; // auth-guard.js will handle redirect
    renderOrders();
}

function renderOrders() {
    const userOrders = orders.filter(o => o.user === currentUser.email);

    if (userOrders.length === 0) {
        ordersList.innerHTML = '<div class="empty">Bạn chưa có đơn hàng nào</div>';
        return;
    }

    ordersList.innerHTML = '';
    userOrders.reverse().forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';

        const info = document.createElement('div');
        info.className = 'order-info';
        info.innerHTML = `
            <div><strong>Mã đơn: ${order.id}</strong></div>
            <div class="order-meta">${new Date(order.createdAt).toLocaleString()} • ${order.items.length} sản phẩm</div>
        `;

        const actions = document.createElement('div');
        actions.className = 'order-actions';
        actions.innerHTML = `<a href="../pages/order-detail.html?id=${order.id}">Chi tiết</a>`;

        card.appendChild(info);
        card.appendChild(actions);
        ordersList.appendChild(card);
    });
}

initHistory();
