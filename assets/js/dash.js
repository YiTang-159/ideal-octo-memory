// Dữ liệu mẫu (Giữ nguyên)
const dashboardData = {
    totalOrders: 156,
    totalRevenue: '42.5M',
    totalProducts: 128,
    lowStockCount: 8,
    weeklyRevenue: [12, 19, 15, 22, 18, 25, 30],
    inventoryData: {
        labels: ['Bánh Nướng', 'Bánh Dẻo', 'Hộp Quà', 'Phụ Kiện'],
        data: [45, 30, 15, 10]
    },
    lowStockProducts: [
        { name: 'Bánh Trung Thu Nhân Hạt Sen', category: 'Bánh Nướng', stock: 12, status: 'low-stock' },
        { name: 'Bánh Trung Thu Nhân Đậu Đỏ', category: 'Bánh Dẻo', stock: 8, status: 'low-stock' },
        { name: 'Bánh Trung Thu Nhân Thập Cẩm', category: 'Bánh Nướng', stock: 5, status: 'low-stock' },
        { name: 'Bánh Trung Thu Nhân Khoai Môn', category: 'Bánh Dẻo', stock: 0, status: 'out-of-stock' }
    ],
    recentActivities: [
        { icon: 'fas fa-box', title: 'Đã thêm sản phẩm mới', desc: 'Bánh Trung Thu Nhân Đậu Xanh', time: '10 phút trước' },
        { icon: 'fas fa-edit', title: 'Cập nhật tồn kho', desc: 'Bánh Trung Thu Nhân Thập Cẩm', time: '2 giờ trước' },
        { icon: 'fas fa-shopping-cart', title: 'Đơn hàng mới', desc: '#ORD-2023-0015 - 1.250.000đ', time: '5 giờ trước' },
        { icon: 'fas fa-exclamation-triangle', title: 'Cảnh báo tồn kho thấp', desc: 'Bánh Trung Thu Nhân Hạt Sen', time: '1 ngày trước' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // 1. Kiểm tra đăng nhập
    const currentUser = localStorage.getItem('loggedInUser');
    if (!currentUser) {
        // Chuyển hướng nếu chưa đăng nhập
        // window.location.href = '../login/admin-login.html';
        // Chỉ để test, tôi sẽ dùng 'admin' làm mặc định nếu không tìm thấy
        updateUserDisplay('admin'); 
    } else {
        updateUserDisplay(currentUser);
    }
    
    // 2. Cập nhật thống kê
    document.getElementById('total-orders').textContent = dashboardData.totalOrders;
    document.getElementById('total-revenue').textContent = dashboardData.totalRevenue;
    document.getElementById('total-products').textContent = dashboardData.totalProducts;
    document.getElementById('low-stock-count').textContent = dashboardData.lowStockCount;

    // 3. Render bảng & hoạt động
    updateProductTable();
    updateRecentActivities();

    // 4. Khởi tạo biểu đồ
    initRevenueChart();
    initInventoryChart();

    // 5. Hiệu ứng + nút kỳ báo cáo
    animateCards();
    setupPeriodButtons();

    // 6. Xử lý đăng xuất
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = '../login/admin-login.html';
    });

    // 7. Bắt đầu mô phỏng cập nhật thời gian thực
    simulateRealTimeUpdates();
});

// Cập nhật tên người dùng và vai trò
function updateUserDisplay(username) {
    // Cập nhật ở sidebar (nếu có) và header
    const sidebarUsername = document.getElementById('sidebar-username');
    const sidebarRole = document.getElementById('sidebar-role');
    const headerUsername = document.getElementById('header-username');
    const headerRole = document.getElementById('header-role');

    if (sidebarUsername) sidebarUsername.textContent = username;
    if (headerUsername) headerUsername.textContent = username;
    
    let role = 'Nhân viên';
    if (username === 'admin') role = 'Quản trị viên';
    else if (username === 'staff') role = 'Nhân viên bán hàng';
    
    if (sidebarRole) sidebarRole.textContent = role;
    if (headerRole) headerRole.textContent = role;
}

// Khởi tạo biểu đồ doanh thu
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','CN'],
            datasets:[{
                label:'Doanh thu (triệu VNĐ)',
                data: dashboardData.weeklyRevenue,
                backgroundColor: 'rgba(230,190,138,0.12)',
                borderColor: 'rgba(230,190,138,1)',
                borderWidth:3,
                tension:0.35,
                pointBackgroundColor: 'rgba(139,0,0,0.95)',
                pointBorderColor:'#fff',
                pointRadius:5,
                fill:true
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            scales:{
                y:{beginAtZero:true,grid:{drawBorder:false},ticks:{callback:function(v){return v + 'M'}}},
                x:{grid:{display:false}}
            },
            plugins:{
                legend:{display:false},
                tooltip:{
                    callbacks:{
                        label:function(context){ return 'Doanh thu: ' + context.parsed.y + ' triệu VNĐ'; }
                    }
                }
            }
        }
    });
}

// Khởi tạo biểu đồ tồn kho
function initInventoryChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    new Chart(ctx, {
        type:'doughnut',
        data:{
            labels: dashboardData.inventoryData.labels,
            datasets:[{
                data: dashboardData.inventoryData.data,
                backgroundColor: [
                    'rgba(230,190,138,0.95)',
                    'rgba(255,193,7,0.85)',
                    'rgba(141,110,99,0.85)',
                    'rgba(121,85,72,0.85)'
                ],
                borderColor:[
                    'rgba(230,190,138,1)',
                    'rgba(255,193,7,1)',
                    'rgba(141,110,99,1)',
                    'rgba(121,85,72,1)'
                ],
                borderWidth:1
            }]
        },
        options:{
            responsive:true,maintainAspectRatio:false,
            plugins:{legend:{position:'bottom'}}
        }
    });
}

// Bảng sản phẩm sắp hết hàng
function updateProductTable(){
    const tableBody = document.getElementById('product-table');
    tableBody.innerHTML = '';
    dashboardData.lowStockProducts.forEach(product=>{
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color:var(--brand-crimson);font-weight:700">${product.name}</td>
            <td style="color:var(--muted-brown)">${product.category}</td>
            <td style="font-weight:700">${product.stock}</td>
            <td><span class="status ${product.status}">${product.status === 'low-stock' ? 'Sắp hết' : 'Hết hàng'}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Hoạt động gần đây
function updateRecentActivities(){
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    dashboardData.recentActivities.forEach(activity=>{
        const item = document.createElement('li');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon"><i class="${activity.icon}"></i></div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.desc}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        activityList.appendChild(item);
    });
}

// Hiệu ứng cho cards
function animateCards(){
    const cards = document.querySelectorAll('.card, .chart-box, .table-box, .activity-box, .summary-box');
    cards.forEach((card, idx)=>{
        card.style.opacity='0';card.style.transform='translateY(18px)';
        setTimeout(()=>{
            card.style.transition='opacity .45s ease, transform .45s ease';
            card.style.opacity='1';
            card.style.transform='translateY(0)';
        }, idx*90);
    });
}

// Nút chọn kỳ báo cáo
function setupPeriodButtons(){
    const buttons = document.querySelectorAll('.btn-period');
    buttons.forEach(btn=>{
        // Xử lý style đã được chuyển sang CSS, chỉ cần lắng nghe sự kiện
        btn.addEventListener('click', function(){
            buttons.forEach(b=>b.classList.remove('active'));
            this.classList.add('active');
            // Thêm logic cập nhật biểu đồ tại đây nếu cần (ví dụ: switch(this.textContent))
        });
    });
}

// Mô phỏng cập nhật thời gian thực
function simulateRealTimeUpdates(){
    setInterval(()=>{
        const activities=[
            { icon:'fas fa-shopping-cart', title:'Đơn hàng mới', desc:'#ORD-'+ new Date().getTime().toString().slice(-6) + ' - ' + (Math.floor(Math.random()*10)+1) + '.000.000đ', time:'Vừa xong' },
            { icon:'fas fa-box', title:'Sản phẩm mới được thêm', desc:'Bánh Trung Thu Nhân ' + ['Dừa','Trà Xanh','Khoai Mỡ','Mè Đen'][Math.floor(Math.random()*4)], time:'Vừa xong' }
        ];
        const randomActivity = activities[Math.floor(Math.random()*activities.length)];
        const activityList = document.getElementById('activity-list');
        
        // Tạo và chèn hoạt động mới
        const newItem = document.createElement('li');
        newItem.className='activity-item';
        newItem.innerHTML = `
            <div class="activity-icon"><i class="${randomActivity.icon}"></i></div>
            <div class="activity-content">
                <div class="activity-title">${randomActivity.title}</div>
                <div class="activity-desc">${randomActivity.desc}</div>
                <div class="activity-time">${randomActivity.time}</div>
            </div>
        `;
        
        // Chèn vào đầu danh sách
        activityList.insertBefore(newItem, activityList.firstChild);
        
        // Giới hạn số lượng hoạt động
        if(activityList.children.length > 4){ 
            activityList.removeChild(activityList.lastChild); 
        }
    }, 15000); // Cập nhật mỗi 15 giây
}