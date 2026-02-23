// user.js - Quản lý người dùng
// Hàm lấy danh sách người dùng từ localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Hàm lưu danh sách người dùng
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Hàm đăng ký tài khoản mới
function registerUser(username, email, password) {
  const users = getUsers();

  // Kiểm tra trùng username hoặc email
  if (users.some(u => u.username === username || u.email === email)) {
    alert("Tên đăng nhập hoặc email đã tồn tại!");
    return false;
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
  return true;
}

// Hàm đăng nhập
function loginUser(usernameOrEmail, password) {
  const users = getUsers();
  const user = users.find(u => 
    (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
    u.password === password
  );

  if (!user) {
    alert("Sai tên đăng nhập hoặc mật khẩu!");
    return false;
  }

  // Lưu người dùng hiện tại vào localStorage
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert(`Xin chào, ${user.username}!`);
  return true;
}

// Hàm đăng xuất
function logoutUser() {
  localStorage.removeItem("currentUser");
  alert("Bạn đã đăng xuất!");
}

// Hàm lấy người dùng hiện tại
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// sử dụng cho form

// Đăng ký
function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!username || !email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  registerUser(username, email, password);
}

// Đăng nhập
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Vui lòng nhập đủ thông tin!");
    return;
  }

  loginUser(username, password);
}
