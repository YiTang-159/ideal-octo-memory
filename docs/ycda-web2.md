# Yêu cầu đồ án học phần Lập trình web và ứng dụng nâng cao (Advanced Web Development and Applications Project Requirements)

Thực hiện website động sử dụng JS, PHP và CSDL mySQL giới thiệu sản phẩm theo đề tài đã đăng kí, cho phép sử dụng giao diện web có sẵn (không cần tự thiết kế).

## Yêu cầu chính

### 1. Các chức năng cho người dùng cuối (end-user) (4 điểm)

- Hiển thị sản phẩm theo phân loại (có phân trang)
- Hiển thị chi tiết sản phẩm (thông tin chi tiết phù hợp với sản phẩm bán).
- Tìm kiếm (kết quả tìm kiếm có phân trang)
	- Cơ bản theo tên sản phẩm
	- Nâng cao: theo tên sản phẩm, có chọn phân loại và khoảng giá (kết hợp nhiều tiêu chí trong 1 thao tác tìm kiếm)

> Lưu ý giá sản phẩm được tính như sau:
> - `Giá bán = giá nhập * (100% + tỷ lệ lợi nhuận)`
> - Giá nhập được tính theo quy tắc BÌNH QUÂN: giá nhập của 1 sản phẩm được update khi nhập hàng là giá trị bình quân `(số lượng tồn * giá nhập hiện tại + số lượng nhập mới * giá nhập mới) / (số lượng tồn + số lượng nhập)`.
> Vd:
> 1. Nhập lần đầu: Nhập 10, giá 20 → `giá nhập = (10*20)/10 = 20`
>    Sau đó bán 4 sp, số lượng tồn còn 6, giá nhập 20
> 2. Nhập lần hai: Nhập 10, giá 15 → `giá nhập = (6*20+10*15)/(6+10) = xx`
>    Vậy sau thời điểm nhập lần hai, giá nhập của sp đó là xx.

- Đăng kí: phải đăng kí trở thành khách hàng (phải có đầy đủ thông tin để giao hàng) và đăng nhập mới sử dụng được chức năng giỏ hàng.
- Đăng nhập / đăng xuất (hiển thị thông tin tài khoản đang đăng nhập)
- Khách hàng chọn mua sản phẩm bằng giỏ hàng:
	- Cho phép thêm bớt sản phẩm trong giỏ hàng.
	- Cho phép chọn giao hàng cho thông tin từ tài khoản hoặc giao hàng cho người khác với địa chỉ giao hàng mới (thiết kế các control nhập liệu đủ và đúng cho từng trường hợp)
	- Cho phép chọn thanh toán tiền mặt, chuyển khoản (hiển thị thông tin chuyển khoản) hoặc thanh toán trực tuyến (nhưng khi chọn thanh toán trực tuyến thì chưa cần xử lý tiếp).
	- Cho người mua xem tóm tắt đơn đặt hàng khi kết thúc quá trình mua.
- Khách hàng xem lại lịch sử mua hàng của tài khoản đang đăng nhập (đơn hàng mua gần nhất hiển thị ở trên)

### 2. Các chức năng cho người quản trị web (web-admin) (6 điểm)

- Giao diện cho người quản trị 
	- Đăng nhập bằng URL (không dùng chung giao diện với người mua)
	- Hiển thị thông tin đăng nhập của tài khoản quản trị và danh mục chức năng cho người quản trị
- Quản lý người dùng (thêm tài khoản, khởi tạo mật khẩu; khoá tài khoản)
- Quản lý danh mục sản phẩm 
	- Thêm loại sản phẩm (lưu ý các dữ liệu của loại sản phẩm)
	- Thêm sản phẩm gồm những thông tin cơ bản (mã, tên, loại, mô tả, đơn vị tính, số lượng ban đầu, hình ảnh, tỉ lệ lợi nhuận mong muốn, nhà cung cấp, hiện trạng (ẩn= không bán/hiển thị=đang bán),…v…v.)
	- Sửa sản phẩm: hiển thị đúng thông tin trước khi sửa (gồm sửa & bỏ hình). Đặc biệt chú ý: sửa hiện trạng sản phẩm
	- Xoá sản phẩm (khi chọn xoá sản phẩm: nếu sản phẩm chưa được nhập hàng thì tiến hành xoá hẳn trong csdl, ngược lại đánh dấu ẩn sản phẩm trên website.
- Quản lý nhập hàng, lập phiếu nhập hàng: (1 phiếu nhập có thể nhập cho nhiều sản phẩm, bỏ qua nhà cung cấp)
	- Tạo phiếu nhập và lưu trữ căn cứ theo ngày nhập, lần nhập, giá nhập và số lượng được nhập. (kết hợp chức năng tìm kiếm sản phẩm để thuận tiện cho người dùng tạo phiếu nhập)
	-  Sửa phiếu nhập kho (đi kèm với chức năng tìm kiếm phiếu nhập kho) và hoàn thành phiếu nhập kho. (lưu ý: chỉ có thể sửa phiếu nhập trước khi hoàn thành phiếu. 
- Quản lý giá bán:
	- Hiển thị & nhập / sửa thông tin tỉ lệ % lợi nhuận theo sản phẩm.
	- Hiển thị & tra cứu giá vốn, % lợi nhuận, giá bán của sản phẩm theo phiếu nhập.
- Quản lý đơn đặt hàng của khách: 
    - đánh dấu đơn đặt hàng: chưa xử lý (khách hàng mới đặt), đã xác nhận, đã giao thành công hoặc đã huỷ. (lưu ý trạng thái đơn hàng cập nhật 1 chiều không được quay lui trạng thái).
	- lọc các đơn đặt hàng trong 1 khoảng thời gian (dựa trên thời gian đơn), thiết kế đường link cho người quản trị xem chi tiết một đơn đặt hàng trong các đơn đặt hàng trên.
	- lọc các đơn đặt hàng theo tình trạng và cho người quản trị sắp xếp các đơn đặt hàng theo địa chỉ giao hàng (theo phường), thiết kế đường link cho người quản trị xem chi tiết một đơn đặt hàng trong các đơn đặt hàng trên
- Quản lý tồn kho và thống kê báo cáo: 
	- Tra cứu số lượng tồn của một loại sản phẩm tại 1 thời điểm do người dùng định. 
	- Báo cáo tổng số lượng nhập – xuất của sản phẩm trong một khoảng một khoảng thời gian.
	- Cảnh báo sản phẩm sắp hết hàng. (Cho phép người dùng chỉ định số lượng nào được gọi là sắp hết)

## Các yêu cầu khác

### 3. Điểm trừ nếu làm sai (-3 điểm)

- Thiết kế đúng DB: các bảng dữ liệu quan hệ một – nhiều (sai -1 điểm)
- Các thông tin nhập liệu phải được kiểm tra tính đúng ở form nhập liệu trước khi gửi request về máy chủ. (sai -1 điểm)
- Giao diện phải tương đối chuẩn (xấu hoặc sai đều bị trừ điểm). (sai -1 điểm)

### 4. **Điểm cộng:**

- Khác _mỗi chức năng hữu dụng được cộng điểm tuỳ giáo viên chấm_

## Lưu ý

1.	Tổng điểm tối đa là 10 điểm
2.	Không được sử dụng CMS (Được phép sử dụng framework như Laravel, Bootstrap, v.v.)
3.	Chấm bài trên web browser Firefox hay Google Chrome ở máy giáo viên chỉ định, mọi lý do trục trặc (mất font tiếng Việt, mất hình ảnh, hiệu ứng, lỗi dữ liệu…) đều bị tính là lỗi.
4.	Các đường dẫn trong source code phải sử dụng đường dẫn tương đối.
5.	Sử dụng host thật (server) để lưu trữ source và DB, truy cập chấm bằng máy người dùng cuối (client).
6.	Nộp kèm báo cáo (file mềm .DOCX và In cuốn) theo mẫu quy định.