// Hàm lấy dữ liệu
function getData() {
  const storedData = localStorage.getItem("bs_data");
  return storedData ? JSON.parse(storedData) : { products: [] };
}

// Hàm lưu dữ liệu
function saveData(data) {
  localStorage.setItem("bs_data", JSON.stringify(data));
}

// Hàm tính giá bán
function calculateSalePrice(costPrice, profitMargin) {
  const salePrice = costPrice * (1 + profitMargin / 100);
  return Math.round(salePrice / 1000) * 1000;
}

// Hàm định dạng giá
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}