// Hàm định dạng tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

// Hàm lấy dữ liệu từ localStorage
function db_get(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    console.error(`Lỗi khi lấy dữ liệu từ localStorage với key: ${key}`, e);
    return [];
  }
}

// Hàm lưu dữ liệu vào localStorage
function db_set(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Lỗi khi lưu dữ liệu vào localStorage với key: ${key}`, e);
    return false;
  }
}

// Hàm khởi tạo dữ liệu mẫu
function initializeSampleData() {
  // Dữ liệu khách hàng mẫu
  if (!localStorage.getItem('bs_users')) {
    const sampleUsers = [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        username: "nguyenvana",
        email: "nguyenvana@example.com",
        phone: "0123456789",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        joinDate: "2023-01-15"
      },
      {
        id: 2,
        fullName: "Trần Thị B",
        username: "tranthib",
        email: "tranthib@example.com",
        phone: "0987654321",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        joinDate: "2023-02-20"
      }
    ];
    db_set('bs_users', sampleUsers);
  }

  // Dữ liệu loại sản phẩm mẫu
  if (!localStorage.getItem('admin_categories_data')) {
    const sampleCategories = [
      {
        name: "Bánh nướng",
        subcategories: ["Thập cẩm", "Đậu xanh", "Khoai môn", "Hạt sen"],
        status: "active"
      },
      {
        name: "Bánh dẻo",
        subcategories: ["Đậu xanh", "Hạt sen", "Thập cẩm"],
        status: "active"
      },
      {
        name: "Bánh chay",
        subcategories: ["Đậu xanh", "Khoai môn"],
        status: "active"
      }
    ];
    db_set('admin_categories_data', sampleCategories);
  }

  // Dữ liệu sản phẩm mẫu
  if (!localStorage.getItem('bs_data')) {
    const sampleProducts = {
      products: [
        {
          id: 1,
          sku: "BNTC001",
          name: "Bánh nướng thập cẩm",
          category: "Bánh nướng",
          subcategory: "Thập cẩm",
          costPrice: 45000,
          price: 65000,
          profitMargin: 44.4,
          qty: 15,
          unit: "Cái",
          status: "active",
          desc: "Bánh trung thu nướng nhân thập cẩm truyền thống",
          img: "images/banh-thap-cam.jpg"
        },
        {
          id: 2,
          sku: "BNDX001",
          name: "Bánh nướng đậu xanh",
          category: "Bánh nướng",
          subcategory: "Đậu xanh",
          costPrice: 40000,
          price: 55000,
          profitMargin: 37.5,
          qty: 25,
          unit: "Cái",
          status: "active",
          desc: "Bánh trung thu nướng nhân đậu xanh thơm ngon",
          img: "images/banh-dau-xanh.jpg"
        }
      ]
    };
    db_set('bs_data', sampleProducts);
  }

  // Dữ liệu đơn hàng mẫu
  if (!localStorage.getItem('bs_orders')) {
    const sampleOrders = [
      {
        id: 1,
        userId: 1,
        date: "2023-10-15T08:30:00.000Z",
        total: 350000,
        status: "Đã giao",
        shippingAddress: {
          name: "Nguyễn Văn A",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          phone: "0123456789"
        },
        items: [
          { productId: 1, name: "Bánh nướng thập cẩm", price: 65000, quantity: 3 },
          { productId: 3, name: "Bánh dẻo hạt sen", price: 60000, quantity: 2 }
        ]
      }
    ];
    db_set('bs_orders', sampleOrders);
  }
}

// Khởi tạo dữ liệu mẫu khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
  initializeSampleData();
});