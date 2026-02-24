// Admin accounts
const adminUsers = {
  'admin': { password: 'admin123', role: 'Admin', fullName: 'Quản trị viên' },
  'quanly1': { password: 'abcd1234', role: 'Manager', fullName: 'Quản lý 1' },
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginButton = document.getElementById('loginButton');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('errorMessage');

  // Ẩn nút đăng nhập và hiển thị loading
  loginButton.style.display = 'none';
  loading.style.display = 'block';
  errorMessage.style.display = 'none';

  // Giả lập độ trễ của việc gửi yêu cầu đến server (1.2 giây)
  setTimeout(() => {
    if (adminUsers[username] && adminUsers[username].password === password) {
      // ✅ Đăng nhập thành công: Lưu thông tin admin vào Local Storage
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUsername', username);
      localStorage.setItem('adminRole', adminUsers[username].role);
      localStorage.setItem('adminFullName', adminUsers[username].fullName);

      // Thay đổi giao diện loading thành thông báo thành công
      loading.innerHTML = `
        <div style="color: green; font-size: 2rem; margin-bottom: 1rem;">
          <i class="fas fa-check-circle"></i>
        </div>
        <p style="color: var(--primary); font-weight: 600;">Đăng nhập thành công!</p>
        <p>Đang chuyển hướng...</p>
      `;

      // Chuyển hướng sau 1.5 giây
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      // ❌ Đăng nhập thất bại: Hiển thị lại nút và thông báo lỗi
      loading.style.display = 'none';
      loginButton.style.display = 'block';
      errorMessage.style.display = 'block';
    }
  }, 1200);
});

