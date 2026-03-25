# Các Giả Định Thiết Kế Cơ Sở Dữ Liệu (DB Assumptions)

Trước khi tiến hành vẽ sơ đồ ERD chi tiết, danh sách dưới đây liệt kê các giả định logic nghiệp vụ (Business Logic Assumptions) để xử lý các luồng dữ liệu phức tạp trong hệ thống. File này đóng vai trò xác nhận (Confirm) các luật chơi với Product Owner (Giáo viên / Người ra đề).

---

## 1. Dữ Liệu Giá Cả (Pricing Storage) & Lịch Sử

**Vấn đề:** Giá nhập khẩu bình quân thay đổi liên tục sau mỗi kiện hàng nhập. Giá bán cũng biến động theo % lợi nhuận tại từng thời điểm. Nếu sửa giá hiện tại của sản phẩm, các đơn hàng / phiếu nhập đã phát sinh trong quá khứ có bị tính toán sai tiền?

**Giả định & Giải pháp (Snapshot Pattern):**
- Trong bảng `Orders` (Đơn đặt hàng) / `Order_Details` (Chi tiết đơn hàng): Tại thời điểm khách hàng ấn "Đặt hàng", toàn bộ giá bán hiện hành lúc đó sẽ được **lưu cứng (snapshot)** vào dòng `Order_Details`. Giá này hoàn toàn độc lập với bảng `Products`. Dù Admin có lên giá sản phẩm sau đó thì hóa đơn cũ của khách vẫn không bị ảnh hưởng.
- Trong bảng `Goods_Receipts` (Phiếu nhập) / `Goods_Receipt_Details` (Chi tiết phiếu nhập): Giá nhập của lô hàng cũng được **lưu cứng** tương tự.
- Bảng `Products` sẽ lưu: `base_price` (giá nhập bình quân hiện tại), `profit_margin` (% lợi nhuận), và `sell_price` (giá bán tính từ giá bình quân). Các con số này chỉ mô tả **trạng thái hiện tại** của sản phẩm.

---

## 2. Quản Lý Tồn Kho (Inventory Flow) & Source of Truth

**Vấn đề:** Quản lý số lượng tồn để không bán lố, tính toán hoàn lại số lượng khi đơn bị hủy và đáp ứng yêu cầu tra cứu tồn kho "tại 1 thời điểm".

**Giả định & Giải pháp:**
- **Nguồn dữ liệu chính (Source of Truth):**
  - Cột `stock_quantity` trong bảng `Products` luôn là **nguồn chính và duy nhất** để kiểm tra tồn kho hiện tại (phục vụ việc cho phép khách đặt hàng hay không).
  - Bảng `Inventory_Logs` (Hoạt động như Sổ cái) **chỉ dùng cho**: Audit (Lưu vết) và Truy vấn/Tính toán tồn kho tại 1 thời điểm trong quá khứ.
  - **Nguyên tắc Đồng bộ:** Mọi thao tác làm thay đổi tồn kho (Tạo đơn, Hủy đơn, Nhập hàng) bắt buộc phải cập nhật **đồng thời cả 2 nơi** (vừa UPDATE `stock_quantity` vừa INSERT dòng mới vào `Inventory_Logs`). Việc này phải được bọc trong một **Database Transaction** ở Backend để tránh lệch dữ liệu nếu có lỗi xảy ra giữa chừng.

- **Luồng Tồn Kho (Inventory Flow):**
  - **Khi Khách tạo đơn (`Pending`):** Trừ trực tiếp vào `Products.stock_quantity` **ngay lập tức** và ghi `Inventory_Logs` (số âm) để giữ chỗ (reservation) hàng hóa, tránh bán lố.
  - **Khi Đơn bị hủy (`Cancelled`):** Hệ thống tự động truy xuất lại số lượng trong đơn đó, cộng trả lại vào `Products.stock_quantity` và sinh thêm một dòng `Inventory_Logs` mới (số dương) vào lịch sử để phản ánh việc hoàn kho.
  - **Lưu ý về Reservation Timeout:** Để đơn giản hóa mô hình cho đồ án, hệ thống **không xử lý timeout tự động hủy đơn** (không có cronjob tự động hủy đơn `Pending` sau 24h để nhả tồn kho). Đây là trade-off chấp nhận được.

---

## 3. Quản Lý Địa Chỉ Khách Hàng (Address Handling)

**Vấn đề:** Khách hàng có 1 địa chỉ theo Account đăng ký, nhưng khi Check-out có quyền nhập địa chỉ mới cho *người nhận khác*. Nếu lưu trực tiếp ở bảng Account thì rác data, hoặc không biết đơn này gửi đi đâu.

**Giả định & Giải pháp:**
- Bảng `Users` (Người dùng) lưu thông tin liên hệ và địa chỉ **mặc định**.
- Bảng `Orders` (Đơn đặt hàng) lưu **toàn bộ thông tin người nhận thực tế** dưới dạng Record cố định (Snapshot): `receiver_name`, `receiver_phone`, `shipping_address` (Đường, Phường/Xã).
- Nếu khách chọn "Nhận tại địa chỉ mặc định", lấy từ `Users` copy qua `Orders`.
- Nếu khách nhập "Nhận sinh mới", lưu thẳng vào `Orders` mà không cần ghi đè địa chỉ mặc định trong `Users`.

---

## 4. Mô Hành Cập Nhật Đơn Hàng (Order State Machine)

- **Flow 1 Chiều:** `Pending` (Chưa xử lý) $\to$ `Confirmed` (Đã xác nhận) $\to$ `Delivered` (Thành công).
- **Hủy (Cancelled):** Từ `Pending` hoặc `Confirmed` đều có thể nhảy ra nhánh `Cancelled` (gây ra logic Hoàn tồn kho như trình bày ở trên). Nhưng từ `Delivered` và `Cancelled` thì KHÔNG đổi đi đâu được nữa.

---

## 5. Xử Lý Tương Tranh (Concurrency) đối với Giá Nhập Bình Quân

**Vấn đề:** Nếu nhiều admin cùng thao tác tạo 2 phiếu nhập cùng lúc, công thức chia trung bình giá trị % và tồn kho có thể bị Race Condition (Ghi đè sai lệch dữ liệu).

**Giả định & Giải pháp (Design Simplification):**
- Hệ thống **không xử lý Concurrent Updates** cho logic tính giá trung bình.
- Giả định rằng hệ thống cho đồ án chỉ có **1 Admin thao tác nhập hàng tại một thời điểm**.
- Đây là một quyết định đơn giản hóa có chủ đích (design simplification for assignment) để không phải áp dụng các cơ chế lock phức tạp (Pessimistic / Optimistic Locking) mà vẫn đáp ứng hoàn hảo yêu cầu tính giá nhập bình quân.

---

## 6. Chiến Lược Xóa Dữ Liệu (Soft Delete Behavior)

**Vấn đề:** Yêu cầu phân định "chưa phát sinh giao dịch thì xóa hẳn, có giao dịch thì ẩn". 

**Giả định & Giải pháp (Soft-Delete Check):**
- Cả `Products` và `Categories` (Danh mục) đều có cột `is_deleted` (Boolean).
- **Hoạt động Độc lập (Không Cascade):** Trạng thái `is_deleted` của bảng Category và bảng Product hoạt động hoàn toàn độc lập, không tự động trigger xóa lan truyền từ Category xuống Product trong Database.
- **Ranh giới giao dịch:** Sản phẩm bị coi là "đã phát sinh nghiệp vụ" NẾU nó có ít nhất 1 Record (dòng) nằm trong `Inventory_Logs`.
- Khi Admin bấm Xóa Sản Phẩm hoặc Xóa Danh Mục:
  - Chưa từng có Log giao dịch: Chạy lệnh `DELETE FROM ... WHERE id = X` (Xóa Cứng).
  - Đã có Log giao dịch: Chạy lệnh `UPDATE ... SET is_deleted = 1 WHERE id = X` (Xóa Mềm).
- **Điều Kiện Hiển Thị Frontend (End-User):**
  - Để một Sản Phẩm hiển thị ra ngoài cửa hàng cho khách thấy, nó phải thỏa mãn cả 2 điều kiện: `Products.is_deleted = 0` **VÀ** `Categories.is_deleted = 0` (Dựa trên câu lệnh `JOIN`).
- **Liên Đới Ẩn/Hiện Categories:**
  - Nếu một Category bị đổi thành Soft Delete, các Product bên trong cấu trúc Dữ liệu **KHÔNG bị đổi** cột `is_deleted`. Tuy nhiên, do điều kiện hiển thị bị rớt (Categories.is_deleted = 1), các Product đó tự động bị **ẩn khỏi UI**.
  - Khi Category đó được Restore (Khôi phục), các Product bên trong sẽ tự động nhảy hiển thị lại với điều kiện bản thân status của `Products.is_deleted` lúc đó phải là 0.

---

## 7. Lọc Theo Phường Xã Của Đơn Hàng

**Giả định & Giải pháp:**
- Trong `Orders`, địa chỉ sẽ không phải 1 đoạn string gõ tay ngẫu nhiên hoàn toàn. `shipping_ward` (Phường / Xã) cần được lưu ở một cột text riêng biệt (hoặc ít nhất yêu cầu end-user nhập tách ô Input) thì Database mới `ORDER BY/GROUP BY` chính xác được khu vực giao hàng.
