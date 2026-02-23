const form = document.getElementById("registerForm");
const errorMsg = document.getElementById("errorMsg");
const phoneError = document.getElementById("phoneError");
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const phoneInput = document.getElementById('phone');

// Ẩn/hiện mật khẩu khi click vào con mắt thứ 1 (mật khẩu)
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
});

// Ẩn/hiện mật khẩu khi click vào con mắt thứ 2 (xác nhận mật khẩu)
toggleConfirmPassword.addEventListener('click', () => {
  const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  confirmPasswordInput.setAttribute('type', type);
});

// Hiện con mắt khi có dữ liệu (mật khẩu)
passwordInput.addEventListener('input', () => {
  if (passwordInput.value.trim() !== '') {
    togglePassword.style.display = 'block';
  } else {
    togglePassword.style.display = 'none';
  }
});

// Hiện con mắt khi có dữ liệu (xác nhận mật khẩu)
confirmPasswordInput.addEventListener('input', () => {
  if (confirmPasswordInput.value.trim() !== '') {
    toggleConfirmPassword.style.display = 'block';
  } else {
    toggleConfirmPassword.style.display = 'none';
  }
});

// Khi click vào lại ô (nếu có chữ thì vẫn hiện icon) - mật khẩu
passwordInput.addEventListener('focus', () => {
  if (passwordInput.value.trim() !== '') {
    togglePassword.style.display = 'block';
  }
});

// Khi click vào lại ô (nếu có chữ thì vẫn hiện icon) - xác nhận mật khẩu
confirmPasswordInput.addEventListener('focus', () => {
  if (confirmPasswordInput.value.trim() !== '') {
    toggleConfirmPassword.style.display = 'block';
  }
});

// Khi rời ô (nếu trống thì ẩn icon) - mật khẩu
passwordInput.addEventListener('blur', () => {
  if (passwordInput.value.trim() === '') {
    togglePassword.style.display = 'none';
  }
});

// Khi rời ô (nếu trống thì ẩn icon) - xác nhận mật khẩu
confirmPasswordInput.addEventListener('blur', () => {
  if (confirmPasswordInput.value.trim() === '') {
    toggleConfirmPassword.style.display = 'none';
  }
});

// Kiểm tra số điện thoại khi nhập
phoneInput.addEventListener('input', () => {
  validatePhone();
});

// Kiểm tra số điện thoại khi rời khỏi ô nhập
phoneInput.addEventListener('blur', () => {
  validatePhone();
});

// Hàm kiểm tra số điện thoại
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

// Xử lý đăng ký
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = {
    id: Date.now(), // Tạo ID tự động
    fullname: document.getElementById('fullname').value.trim(),
    username: document.getElementById('username').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    password: document.getElementById('password').value.trim(),
    // SỬA: Thêm các trường cần thiết cho profile
    email: "",
    address: "",
    regDate: new Date().toISOString().split('T')[0], // Ngày đăng ký
    status: "active" // Trạng thái mặc định
  };
  const confirm = document.getElementById('confirmPassword').value.trim();

  if (!user.fullname || !user.username || !user.phone || !user.password || !confirm) {
    errorMsg.textContent = "Vui lòng nhập đầy đủ thông tin.";
  } else if (!validatePhone()) {
    errorMsg.textContent = "Vui lòng kiểm tra lại số điện thoại.";
  } else if (user.password.length < 6) {
    errorMsg.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
  } else if (user.password !== confirm) {
    errorMsg.textContent = "Mật khẩu xác nhận không khớp.";
  } else {
    // Lấy danh sách user từ Local Storage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Kiểm tra username đã tồn tại chưa
    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
      errorMsg.textContent = "Tên đăng nhập đã tồn tại.";
      return;
    }

    // Kiểm tra số điện thoại đã tồn tại chưa
    const existingPhone = users.find(u => u.phone === user.phone);
    if (existingPhone) {
      errorMsg.textContent = "Số điện thoại đã được đăng ký.";
      return;
    }
    
    // Thêm user mới vào mảng
    users.push(user);
    
    // Lưu lại vào Local Storage
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Đăng ký thành công!");
    window.location.href = "login.html";
  }
});
