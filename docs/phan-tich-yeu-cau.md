# Báo Cáo Phân Tích Yêu Cầu Đồ Án Lập Trình Web

Tài liệu này phân tích và làm rõ các yêu cầu từ file tài liệu gốc (`ycda-web2.md`), cấu trúc lại các chức năng một cách logic, dễ hiểu hơn theo từng tác nhân (Actor) và chỉ ra các điểm cần lưu ý/làm rõ trong quá trình phát triển.

---

## 1. Yêu Cầu Chức Năng (Functional Requirements)

Hệ thống có 2 tác nhân chính: **Người dùng cuối (Khách hàng)** và **Người quản trị (Admin)**.

### 1.1 Khách hàng (End-User)
- **Xem sản phẩm**:
  - Xem danh sách sản phẩm theo danh mục (yêu cầu có phân trang).
  - Xem chi tiết sản phẩm.
- **Tìm kiếm sản phẩm**:
  - **Cơ bản**: Tìm theo tên.
  - **Nâng cao**: Gom cụm nhiều tiêu chí trong 1 lần tìm (Tên sản phẩm + Danh mục/Phân loại + Khoảng giá). *Cũng yêu cầu có phân trang*.
- **Quản lý tài khoản**:
  - Đăng ký tài khoản (Bắt buộc thu thập đủ thông tin giao hàng).
  - Đăng nhập / Đăng xuất (Hiển thị thông tin tài khoản đang login).
  - *Luật nghiệp vụ*: Bắt buộc phải đăng nhập mới được sử dụng chức năng Giỏ hàng.
- **Giỏ hàng & Đặt hàng (Checkout)**:
  - Thêm, bớt, cập nhật số lượng sản phẩm trong giỏ.
  - Chọn địa chỉ giao hàng: Lấy thông tin mặc định của tài khoản, hoặc nhập địa chỉ/người nhận mới.
  - Chọn phương thức thanh toán: Tiền mặt (COD), Chuyển khoản (Hiển thị thông tin STK của shop), hoặc Thanh toán trực tuyến.
  - Hiển thị tóm tắt, rà soát lại đơn hàng trước khi bấm Đặt Hàng.
- **Lịch sử đơn hàng**:
  - Xem danh sách đơn hàng đã đặt (Sắp xếp mới nhất lên đầu).

### 1.2 Người quản trị (Admin)
- **Đăng nhập riêng biệt**: Truy cập qua URL riêng, không dùng chung giao diện với người mua. Có menu chức năng dành riêng cho admin.
- **Quản lý Tài khoản**: 
  - Thêm tài khoản quản trị/nhân viên, khởi tạo mật khẩu, khóa (ngừng kích hoạt) tài khoản.
- **Quản lý Danh mục & Sản phẩm**:
  - Thêm danh mục sản phẩm (loại sản phẩm).
  - Thêm, Sửa sản phẩm (Mã, tên, loại, mô tả, ảnh, số lượng đầu, tỷ lệ lợi nhuận, hiện trạng bán...).
  - *Luật xóa sản phẩm*: 
    - Xóa cứng (Hard delete) khỏi database nếu sản phẩm chưa từng được nhập hàng (chưa phát sinh giao dịch).
    - Xóa mềm (Soft delete / Ẩn hiện trạng) nếu sản phẩm đã phát sinh nghiệp vụ.
- **Quản lý Nhập hàng (Kho)**:
  - Tạo / Sửa phiếu nhập hàng (Chỉ được sửa khi chưa ấn "Hoàn thành").
  - Một phiếu nhập có thể nhập nhiều sản phẩm. (*Lưu ý: bỏ qua thông tin Nhà cung cấp trong phiếu nhập*).
- **Quản lý Giá bán**:
  - Tự động duy trì công thức Cập nhật Giá nhập bình quân gia quyền mỗi khi có phiếu nhập mới:
    `Giá nhập mới = (SL tồn * Giá đang tính + SL nhập * Giá nhập lô này) / (Tổng SL)`
  - Giá bán = `Giá nhập bình quân x (1 + % Tỷ lệ lợi nhuận)`.
  - Admin quản lý, nhập/sửa % lợi nhuận theo từng sản phẩm.
  - Hiển thị và tra cứu giá vốn (giá nhập), % lợi nhuận, giá bán phân rã theo **Sản phẩm** và theo **Loại sản phẩm** (danh mục).
- **Quản lý Đơn hàng**:
  - Cập nhật trạng thái dòng chảy 1 chiều, KHÔNG quay lui: *Chưa xử lý -> Đã xác nhận -> Đã giao thành công / Đã huỷ*.
  - Bộ lọc: Lọc đơn theo mốc thời gian, lọc theo trạng thái tình trạng.
  - Sắp xếp: Cho phép sắp xếp danh sách đơn hàng theo địa chỉ (Phường/Xã).
- **Thống kê & Báo cáo**:
  - Báo cáo số lượng Nhập - Xuất của sản phẩm trong khoảng thời gian.
  - Tra cứu số lượng tồn kho tại **1 thời điểm cụ thể** trong quá khứ.
  - Cảnh báo tồn kho thấp (Admin được phép cấu hình ngưỡng số lượng thế nào là "sắp hết").

---

## 2. Thông Tin Phi Chức Năng Hiện Tại (Non-Functional Requirements)

1. **Giao diện & UI/UX**: Sử dụng mẫu sẵn (template), không cần tự thiết kế nhưng giao diện phải chuẩn (không móp méo, vỡ layout, responsive cơ bản). Không sử dụng đường dẫn tuyệt đối tĩnh trong source (phải dùng Relative Path).
2. **Công nghệ cốt lõi**: JS, PHP, MySQL.
3. **Framework**: KHÔNG dùng CMS (như WordPress, Joomla, v.v.), NHƯNG ĐƯỢC dùng Web Framework (Laravel) hoặc CSS Framework (Bootstrap...).
4. **Kiểm tra dữ liệu (Validation)**: Bắt buộc Validation ở phía Client (JS trên Form) để lấy điểm tối đa. Tránh đẩy rác về Server.
5. **Cơ sở dữ liệu**: Thiết kế CSDL chuẩn hóa hóa (các bảng liên kết quan hệ 1-N rõ ràng, đúng chuẩn không dư thừa dị thường).
6. **Môi trường & Triển khai**: Phải chạy tốt trên Chrome/Firefox, yêu cầu đồ án phải đẩy lên Host server thật và database thật để test.

---

## 3. Các Điểm Mơ Hồ / Cần Đặt Câu Hỏi Để Làm Rõ Thêm

Khi đọc tài liệu gốc, có một số điểm chưa đề cập hoặc mâu thuẫn nhẹ, ta cần thống nhất trước khi code:

1. **Quản lý đối tượng cơ bản (CRUD)**:
   - Trong mô tả Admin, phần Quản lý Người Dùng và Danh Mục chỉ mô tả "Thêm", không nhắc đến "Sửa", "Xóa". Trong thực tế bắt buộc cần có các chức năng này. *Đề xuất bổ sung đẩy đủ các hàm CRUD cho Quản lý Danh mục và Người dùng.*
2. **Thanh toán trực tuyến**:
   - Tài liệu ghi "chưa cần xử lý tiếp" -> Hiểu là phần Đặt hàng phía End-user cứ làm Option chọn qua Cổng thanh toán, nhưng chỉ lưu dữ liệu Database là "Đang chờ thanh toán trực tuyến", KHÔNG cần tích hợp API của VNPay, MoMo, tích hợp thẻ ngân hàng thật?
3. **Thông tin Nhà Cung Cấp**:
   - Ở phần Sản phẩm yêu cầu có trường "nhà cung cấp", nhưng ở phần Nhập hàng lại ghi "bỏ qua nhà cung cấp". -> Có thể hiểu là thuộc tính "Nhà cung cấp" ghim cố định ở Table Sản phẩm chứ không quản lý động tách biệt qua bảng Nhà Cung Cấp riêng, hoặc lúc làm phiếu nhập không cần chọn lại nhà cung cấp.
4. **Tính toán Tồn kho "tại thời điểm"**:
   - Câu: "Tra cứu số lượng tồn của một loại sản phẩm tại 1 thời điểm do người dùng định".
   - Đây là bài toán khó. Để làm được, database không chỉ lưu `stock_quantity` hiện tại mà phải lưu nhật ký (Log/Transaction) của mọi lần Nhập và Xuất. Khi admin chọn ngày `X`, hệ thống lấy `Tổng Nhập từ đầu đến ngày X` trừ `Tổng Xuất (bán) từ đầu đến ngày X`. Cần thiết kế CSDL cẩn thận (bảng `inventory_logs` hoặc `stock_movements`).

---

**Kết luận:**
Bên trên là bản cấu trúc lại rõ ràng dễ theo dõi yêu cầu. Team có thể dùng nó như tài liệu định hướng phát triển (Development Guideline) hoặc để lập checklist công việc (Task Breakdown).
