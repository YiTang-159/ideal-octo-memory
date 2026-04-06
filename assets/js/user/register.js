/**
 * register.js - Xử lý đăng ký người dùng
 * Đã chuẩn hóa: full_name, tích hợp validation email/address, merge logic từ inline script
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("registerForm");
    const errorMsg = document.getElementById("errorMsg");
    const phoneError = document.getElementById("phoneError");
    const emailError = document.getElementById("emailError");
    const addressError = document.getElementById("addressError");

    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const addressInput = document.getElementById('reg-address');
    const communeInput = document.getElementById('reg-commune');
    const cityInput = document.getElementById('reg-city');

    // --- LOGIC ẨN/HIỆN MẬT KHẨU ---
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });

        passwordInput.addEventListener('input', () => {
            togglePassword.style.display = passwordInput.value.trim() !== '' ? 'block' : 'none';
        });
    }

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            toggleConfirmPassword.classList.toggle('fa-eye');
            toggleConfirmPassword.classList.toggle('fa-eye-slash');
        });

        confirmPasswordInput.addEventListener('input', () => {
            toggleConfirmPassword.style.display = confirmPasswordInput.value.trim() !== '' ? 'block' : 'none';
        });
    }

    // --- VALIDATION FUNCTIONS ---

    function validatePhone() {
        const phoneValue = phoneInput.value.trim();
        const phoneRegex = /^[0-9]{10,11}$/;

        if (phoneValue === '') {
            phoneError.textContent = '';
            return false;
        } else if (!phoneRegex.test(phoneValue)) {
            phoneError.textContent = 'Số điện thoại phải có 10-11 chữ số';
            return false;
        } else {
            phoneError.textContent = '';
            return true;
        }
    }

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
            emailError.textContent = '';
            return false;
        } else if (!emailRegex.test(emailValue)) {
            emailError.textContent = 'Định dạng email không hợp lệ';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }

    function validateAddress() {
        if (!addressInput.value.trim() || !communeInput.value.trim() || !cityInput.value.trim()) {
            addressError.textContent = 'Vui lòng nhập đầy đủ địa chỉ giao hàng';
            return false;
        }
        addressError.textContent = '';
        return true;
    }

    // Real-time validation
    if (phoneInput) phoneInput.addEventListener('input', validatePhone);
    if (emailInput) emailInput.addEventListener('input', validateEmail);

    // --- XỬ LÝ SUBMIT ---
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullname').value.trim();
            const username = document.getElementById('username').value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            const address = addressInput.value.trim();
            const commune = communeInput.value.trim();
            const city = cityInput.value.trim();
            const password = passwordInput.value.trim();
            const confirm = confirmPasswordInput.value.trim();

            // Validate chung
            if (!fullName || !username || !phone || !email || !address || !commune || !city || !password || !confirm) {
                errorMsg.textContent = "Vui lòng nhập đầy đủ toàn bộ thông tin.";
                return;
            }

            if (!validatePhone() || !validateEmail() || !validateAddress()) {
                errorMsg.textContent = "Vui lòng kiểm tra lại các trường thông tin bị lỗi.";
                return;
            }

            if (password.length < 6) {
                errorMsg.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
                return;
            }

            if (password !== confirm) {
                errorMsg.textContent = "Mật khẩu xác nhận không khớp.";
                return;
            }

            // Lấy danh sách user để check unique
            let users = JSON.parse(localStorage.getItem("users")) || [];

            if (users.find(u => u.username === username)) {
                errorMsg.textContent = "Tên đăng nhập đã tồn tại.";
                return;
            }

            if (users.find(u => u.phone === phone)) {
                errorMsg.textContent = "Số điện thoại này đã được đăng ký.";
                return;
            }

            if (users.find(u => u.email === email)) {
                errorMsg.textContent = "Email này đã được đăng ký.";
                return;
            }

            // Tạo Object User mới - CHUẨN HÓA CHO LARAVEL
            const newUser = {
                id: Date.now(),
                full_name: fullName,      // Sửa key theo yêu cầu của bạn
                username: username,
                phone: phone,
                email: email,
                address: address,         // Map sang DB table 'address'
                commune: commune,            // Map sang DB table 'commune'
                city: city,               // Map sang DB table 'city'
                password: password,       // Lưu plain text (sẽ được hash khi viết Controller)
                role: 'customer',         // Trạng thái mặc định
                status: 'active',
                created_at: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            alert("Đăng ký thành công! Chào mừng " + fullName + " đến với Morico Bakery.");
            window.location.href = "login.html";
        });
    }
});
