# Các Giả Định Thiết Kế Cơ Sở Dữ Liệu (DB Assumptions)

Trước khi tiến hành vẽ sơ đồ ERD chi tiết, danh sách dưới đây liệt kê các giả định logic nghiệp vụ (Business Logic Assumptions) để xử lý các luồng dữ liệu phức tạp trong hệ thống. File này đóng vai trò xác nhận (Confirm) các luật chơi với Product Owner (Giáo viên / Người ra đề).

---

## 1. Dữ Liệu Giá Cả (Pricing Storage) & Lịch Sử

**Vấn đề:** Giá nhập khẩu bình quân thay đổi liên tục sau mỗi kiện hàng nhập. Giá bán cũng biến động theo % lợi nhuận tại từng thời điểm. Nếu sửa giá hiện tại của sản phẩm, các đơn hàng / phiếu nhập đã phát sinh trong quá khứ có bị tính toán sai tiền?

**Giả định & Giải pháp (Snapshot Pattern):**
- Trong bảng `orders` (Đơn đặt hàng) / `order_details` (Chi tiết đơn hàng): Tại thời điểm khách hàng ấn "Đặt hàng", toàn bộ giá bán hiện hành lúc đó sẽ được **lưu cứng (snapshot)** vào dòng `order_details`. Giá này hoàn toàn độc lập với bảng `products`. Dù Admin có lên giá sản phẩm sau đó thì hóa đơn cũ của khách vẫn không bị ảnh hưởng.
- Trong bảng `goods_receipts` (Phiếu nhập) / `goods_receipt_details` (Chi tiết phiếu nhập): Giá nhập của lô hàng cũng được **lưu cứng** tương tự.
- Bảng `products` sẽ lưu: `base_price` (giá nhập bình quân hiện tại), `profit_margin` (% lợi nhuận), và `sell_price` (giá bán tính từ giá bình quân). Các con số này chỉ mô tả **trạng thái hiện tại** của sản phẩm.

---

## 2. Cơ Chế Ledger & Quản Lý Tồn Kho (Inventory Ledger)

**Vấn đề:** Đảm bảo tính chính xác tuyệt đối của tồn kho hiện tại để không bán lố, đồng thời có khả năng truy xuất trạng thái tồn kho tại bất kỳ thời điểm nào trong quá khứ (Historical Inventory).

**Giả định & Giải pháp (Full Ledger Pattern):**

### 2.1. Phân định vai trò dữ liệu
Hệ thống sử dụng mô hình kết hợp giữa **Cache Hiệu Năng** và **Sổ Cái Ledger**:
- **Bảng `products.stock_quantity`** lưu tồn kho hiện tại để phục vụ kiểm tra realtime (operational stock).
- **Bảng `inventory_logs`** là sổ cái lịch sử, dùng để audit và tái cấu trúc tồn kho tại mọi thời điểm trong quá khứ (inventory ledger).

### 2.2. Quy ước "Init Log" (Bắt buộc)
Để bảng Ledger luôn đầy đủ và không cần phụ thuộc vào giá trị khởi tạo lưu ở nơi khác, hệ thống áp dụng quy ước:
- Khi một sản phẩm được tạo mới, Backend **bắt buộc** phải thực hiện theo trình tự sau trong cùng một **Database Transaction**:
  1. **Bước 1:** `INSERT` vào bảng `products` với `stock_quantity = {initial_stock}`. Việc này nhằm khai sinh sản phẩm và lấy được `id` (Primary Key).
  2. **Bước 2:** `INSERT` vào bảng `inventory_logs` một bản ghi gốc (initial state) sử dụng `id` vừa nhận được:
     - `product_id = {id}`
     - `change_amount = +{initial_stock}`
     - `reference_type = 'product_init'`
     - `reference_id = {id}` (Dùng chính ID sản phẩm làm tham chiếu cho dòng khởi tạo)
     - `created_at = {thời điểm tạo sản phẩm}`
- **Lưu ý:** Đây là điều kiện cần để công thức tính tồn kho quá khứ hoạt động chính xác. Trình tự này đảm bảo Ledger luôn có điểm bắt đầu gắn liền với một bản ghi `products` hợp lệ.

### 2.3. Nguyên tắc Đồng bộ & Transaction
- **Nguyên tắc cập nhật:** Mọi thao tác làm thay đổi tồn kho (Tạo đơn, Hủy đơn, Nhập hàng) bắt buộc phải cập nhật **đồng thời cả 2 nơi**: vừa `UPDATE stock_quantity` (Cache) vừa `INSERT` dòng mới vào `inventory_logs` (Ledger).
- **Tính nhất quán:** Việc cập nhật này phải được bọc trong một **Database Transaction**. Chúng ta không sử dụng `inventory_logs` để ghi đè ngược lại `stock_quantity` trong vận hành bình thường; ledger chỉ dùng để kiểm tra/đối soát hoặc audit khi cần.

### 2.4. Công thức tính Tồn kho tại thời điểm T
Để biết tồn kho sản phẩm X tại thời điểm T, hệ thống thực hiện truy vấn duy nhất trên Ledger:
```sql
SELECT SUM(change_amount)
FROM inventory_logs
WHERE product_id = X AND created_at <= T;
```
- **Lưu ý:** Nhờ có dòng `init`, kết quả `SUM` sẽ phản ánh đúng tổng lượng hàng tồn từ lúc khai sinh đến thời điểm T mà không cần cộng thêm bất kỳ tham số nào khác.

### 2.5. Luồng Tồn Kho (Inventory Flow)
- **Khi Khách tạo đơn (`Pending`):** Trừ trực tiếp vào `products.stock_quantity` **ngay lập tức** và ghi `inventory_logs` (số âm) để giữ chỗ (reservation) hàng hóa, tránh bán lố.
- **Khi Đơn bị hủy (`Cancelled`):** Hệ thống tự động truy xuất lại số lượng trong đơn đó, cộng trả lại vào `products.stock_quantity` và sinh thêm một dòng `inventory_logs` mới (số dương) vào lịch sử để phản ánh việc hoàn kho.
- **Lưu ý về Reservation Timeout:** Hệ thống **không xử lý timeout tự động hủy đơn**. Admin sẽ định kỳ kiểm tra và hủy các đơn `Pending` quá hạn thủ công thông qua Dashboard.

---

## 3. Quản Lý Địa Chỉ Khách Hàng (Address Handling)

**Vấn đề:** Khách hàng có 1 địa chỉ theo Account đăng ký, nhưng khi Check-out có quyền nhập địa chỉ mới cho *người nhận khác*. Nếu lưu trực tiếp ở bảng Account thì rác data, hoặc không biết đơn này gửi đi đâu.

**Giả định & Giải pháp:**
- Bảng `users` (Người dùng) lưu thông tin liên hệ và địa chỉ **mặc định**.
- Bảng `orders` (Đơn đặt hàng) lưu **toàn bộ thông tin người nhận thực tế** dưới dạng Record cố định (Snapshot): `receiver_name`, `receiver_phone`, `shipping_address` (Đường, Phường/Xã).
- Nếu khách chọn "Nhận tại địa chỉ mặc định", lấy từ `users` copy qua `orders`.
- Nếu khách nhập "Nhận sinh mới", lưu thẳng vào `orders` mà không cần ghi đè địa chỉ mặc định trong `users`.

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
- Cả `products` (Sản phẩm) và `categories` (Danh mục) đều có cột `is_deleted` (Boolean).
- **Hoạt động Độc lập (Không Cascade):** Trạng thái `is_deleted` của bảng Category và bảng Product hoạt động hoàn toàn độc lập, không tự động trigger xóa lan truyền từ Category xuống Product trong Database.
- **Ranh giới kiểm tra (Delete Check):**
  - **Sản phẩm (`products`):** Bị coi là "đã phát sinh nghiệp vụ" NẾU có bất kỳ record nào trong `inventory_logs` với `reference_type != 'product_init'`.
  - **Danh mục (`categories`):** Bị coi là "đang được sử dụng" NẾU có ít nhất 1 Sản phẩm (`products`) **chưa bị soft delete (`is_deleted = 0`)** đang tham chiếu tới nó.
- Khi Admin bấm Xóa:
  - **Đối với Sản phẩm (`products`):**
    - Chưa từng có Log giao dịch: Chạy lệnh `DELETE FROM ... WHERE id = X` (Xóa Cứng).
    - Đã có Log giao dịch: Chạy lệnh `UPDATE ... SET is_deleted = 1 WHERE id = X` (Xóa Mềm).
  - **Đối với Danh mục (`categories`):**
    - Không còn sản phẩm nào tham chiếu tới: Chạy lệnh `DELETE FROM ... WHERE id = X` (Xóa Cứng).
    - Vẫn còn sản phẩm tham chiếu tới: Chạy lệnh `UPDATE ... SET is_deleted = 1 WHERE id = X` (Xóa Mềm).
- **Điều Kiện Hiển Thị Frontend (End-User):**
  - Để một Sản Phẩm hiển thị ra ngoài cửa hàng cho khách thấy, nó phải thỏa mãn cả 2 điều kiện: `products.is_deleted = 0` **VÀ** `categories.is_deleted = 0` (Dựa trên câu lệnh `JOIN`).
- **Liên Đới Ẩn/Hiện Categories:**
  - Nếu một Category bị đổi thành Soft Delete, các Product bên trong cấu trúc Dữ liệu **KHÔNG bị đổi** cột `is_deleted`. Tuy nhiên, do điều kiện hiển thị bị rớt (`categories.is_deleted = 1`), các Product đó tự động bị **ẩn khỏi UI**.
  - Khi Category đó được Restore (Khôi phục), các Product bên trong sẽ tự động nhảy hiển thị lại với điều kiện bản thân status của `products.is_deleted` lúc đó phải là 0.

---

## 7. Lọc Theo Phường/Xã Của Đơn Hàng

**Giả định & Giải pháp:**
- Trong `orders`, địa chỉ sẽ không phải 1 đoạn string gõ tay ngẫu nhiên hoàn toàn. `shipping_ward` (Phường / Xã) cần được lưu ở một cột text riêng biệt (hoặc ít nhất yêu cầu end-user nhập tách ô Input) thì Database mới `ORDER BY/GROUP BY` chính xác được khu vực giao hàng.

---

## 8. Quản Lý Giỏ Hàng (Cart Handling)

**Giả định & Giải pháp:**
- Khách hàng bắt buộc đăng nhập để dùng giỏ hàng, do đó giỏ hàng sẽ được lưu trực tiếp vào CSDL thay vì LocalStorage để duy trì quyền truy cập xuyên suốt các thiết bị.
- **Ràng buộc Active Cart:** Mỗi User (`users`) chỉ được phép có **tối đa 1 giỏ hàng (`carts`) đang active** tại một thời điểm (Ràng buộc UNIQUE KEY trên `user_id`).
- **Không ảnh hưởng tồn kho:** Sản phẩm nằm trong giỏ hàng (`cart_items`) hoàn toàn không làm trừ hay khóa tồn kho (`products.stock_quantity`). Tồn kho chỉ thực sự bị trừ khi Request biến thành `orders` (trạng thái Pending).
- Khi đặt hàng, dữ liệu được chọn từ `cart_items` sẽ được dọn đi và chép vào `order_details`.
