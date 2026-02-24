# Action items

## Các files/folders quan trọng cần analyze tiếp

* `index.html`: Entry point quan trọng, phân tích sẽ giúp ta nắm được cấu trúc class Bootstrap chủ đạo, Header, Footer (được tái sử dụng ở các file khác).
* `assets/js/auth-firebase.js` & `auth.js`: Tuy là bài tập Web1 (không backend riêng), sự tồn tại của Firebase cho thấy dự án có tích hợp Backend-as-a-Service (BaaS) để xử lý logic Authentication.
* `assets/js/product_page.js` & JS Admin (dash.js, admin_actions.js): Những khu vực chứa logic DOM thuần túy cốt yếu: render giao diện danh sách đồ, giỏ hàng, bảng biểu.
* `assets/css/style.css`: Nơi tuỳ chỉnh lại giao diện gốc đè lên hệ thống của Bootstrap.

## Issues Found

Qua kiểm tra cấu trúc thư mục, có một số điểm chưa tối ưu:

* Tàn dư của "Save Webpage As...":
    * Thư mục `assets/external/` chứa hàng tá folder mang tên domain lộn xộn (như cdn-icons-png.flaticon.com, cdnjs.cloudflare.com, fonts.googleapis.com, github.com). Đây là rác sinh ra do việc tải lưu trang web ngoại tuyến nguyên xi, gây nặng và rối project.
    * Tương tự, folder `pages/product-detail_files/` cũng là thư mục rác do trình duyệt tự tạo khi tải file html chi tiết sản phẩm.
* Project chuẩn chỉnh thường nhóm toàn bộ vendor như Bootstrap, jQuery vào thư mục độc lập `assets/vendor/` hoặc `libs/`. Cần di chuyển `bootstrap-5.3.8-dist/` vào `assets/vendor/bootstrap/` để root project được sạch.
* Trộn lẫn CSS/JS của Admin và User: Trong `assets/css/` (15 files) và `assets/js/` (19 files), tác giả đổ dồn tất bật cả script admin lẫn script client-side vào chung một tầng. Việc không gom nhóm tạo ra sự lộn xộn khi cần maintain (ví dụ: `admin_style.css` nằm ngay kế `cart.css`). Thay vì bung bét, thư mục js/css cần sub-directories: `assets/css/admin`, `assets/css/user`, `assets/css/components` (chứa module chung như navbar, footer).
* Duplicate files: Trong thư mục `js` xuất hiện cặp file `cart.js` và `cart1.js`. `cart1.js` khả năng cao là bản nháp thử nghiệm bị bỏ quên.
* Root Folder bị chiếm dụng: Thư mục bản phân phối `bootstrap-5.3.8-dist/` đặt trực tiếp ở thư mục gốc không phải là quy chuẩn thông thường.

## Files/Folders nào có thể ignore hoặc delete

* Thư mục `assets/external/`: Nên delete triệt để. Mọi library nên được import qua thẻ `<script src="...">` với CDN, hoặc gói gọn nhặt các file `.min.css/.min.js` vào một chỗ riêng hợp lý.
* Thư mục `pages/product-detail_files/`: Chỉnh lại đường link ảnh trong `product-detail.html` về `assets/image/`, sau đó xoá folder rác này đi.
* Rác/nháp: Khuyên dùng thao tác xoá ngay file nháp như `assets/js/cart1.js`.