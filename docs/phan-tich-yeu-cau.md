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
  - Thêm tài khoản quản trị/nhân viên, khởi tạo mật khẩu, khóa (ngừng kích hoạt) tài khoản. (*Lưu ý: KHÔNG cho phép Sửa hay Xóa tài khoản*).
- **Quản lý Danh mục & Sản phẩm**:
  - Thêm, Sửa, Xóa danh mục sản phẩm (loại sản phẩm). (*Luật xóa áp dụng tương tự như sản phẩm*).
  - Thêm, Sửa sản phẩm (Mã, tên, loại, mô tả, ảnh, số lượng đầu, tỷ lệ lợi nhuận, nhà cung cấp, hiện trạng bán...). (*Lưu ý: Trường "Nhà cung cấp" chỉ mang tính hình thức, không dùng khi nhập hàng*).
  - *Luật xóa sản phẩm và danh mục*: 
    - Xóa cứng (Hard delete) khỏi database nếu chưa từng phát sinh giao dịch (chưa nhập/bán).
    - Xóa mềm (Soft delete / Ẩn hiện trạng) nếu đã phát sinh nghiệp vụ.
- **Quản lý Nhập hàng (Kho)**:
  - Tạo / Sửa phiếu nhập hàng (Chỉ được sửa khi chưa ấn "Hoàn thành").
  - Một phiếu nhập có thể nhập nhiều sản phẩm. (*Chỉ cần tăng số lượng sản phẩm và cập nhật giá vốn, hoàn toàn bỏ qua Nhà cung cấp*).
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

## 3. Các Quy Ước / Thống Nhất Nghiệp Vụ (Đã chốt)

Dựa trên các phân tích và thống nhất với yêu cầu đồ án, hệ thống sẽ tuân theo các quy ước sau để đảm bảo đi đúng hướng:

1. **Quản lý đối tượng cơ bản (CRUD)**:
   - **Loại sản phẩm (Danh mục)**: Cho phép đầy đủ Thêm, Sửa, Xóa (áp dụng luật xóa tương tự như sản phẩm).
   - **Người dùng (Tài khoản)**: Chỉ cho phép Thêm, Khởi tạo mật khẩu và Khóa tài khoản. KHÔNG có chức năng Sửa thông tin cá nhân hay Xóa tài khoản người dùng từ phía Admin.
2. **Thanh toán trực tuyến**:
   - Chỉ làm ở mức thiết kế lựa chọn trên Giao diện (Option Cổng thanh toán) và lưu trạng thái đơn hàng là "Đang chờ thanh toán trực tuyến" xuống CSDL. **KHÔNG CẦN** tích hợp API thanh toán thật (VNPay, MoMo) hay cổng thanh toán thẻ ngân hàng.
3. **Quản lý Nhập hàng và Nhà cung cấp**:
   - Chức năng Nhập hàng chỉ quan tâm đến việc **tăng số lượng sản phẩm** và cập nhật giá vốn (giá nhập bình quân).
   - Hoàn toàn **bỏ qua** thông tin Nhà cung cấp khi tạo phiếu nhập. Trường "Nhà cung cấp" lưu ở bảng Sản Phẩm chỉ mang tính hình thức/trưng bày.
4. **Tính toán Tồn kho "tại thời điểm"**:
   - Sẽ **thiết kế CSDL cẩn thận**, có bảng lưu vết (Log/Transaction - ví dụ: `inventory_logs` hoặc `stock_movements`) ghi nhận chi tiết mọi biến động Nhập/Xuất để có thể tính toán ngược quá khứ và xuất báo cáo tồn kho tại bất kỳ 1 khoảng thời gian hay 1 thời điểm nào do người dùng chỉ định.

---

**Kết luận:**
Bên trên là bản cấu trúc lại rõ ràng dễ theo dõi yêu cầu. Team có thể dùng nó như tài liệu định hướng phát triển (Development Guideline) hoặc để lập checklist công việc (Task Breakdown).
