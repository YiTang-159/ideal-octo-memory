// Authentication management
class AuthManager {
  constructor() {
    this.userIcon = document.getElementById('userIcon');
    this.dropdown = document.getElementById('userDropdown');
    this.init();
  }

  init() {
    this.updateUserMenu();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.userIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target) && !this.userIcon.contains(e.target)) {
        this.dropdown.classList.remove('active');
      }
    });

    // Listen for auth changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'currentUser') {
        this.updateUserMenu();
      }
    });
  }

  updateUserMenu() {
    const currentUser = this.getCurrentUser();
    this.dropdown.innerHTML = '';

    if (currentUser) {
      this.renderLoggedInMenu(currentUser);
    } else {
      this.renderLoggedOutMenu();
    }
  }

  getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  renderLoggedInMenu(user) {
    this.dropdown.innerHTML = `
      <a href="pages/profile.html">Tài khoản</a>
      <a href="#" id="logoutBtn">Đăng xuất</a>
    `;

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.logout();
    });
  }

  renderLoggedOutMenu() {
    this.dropdown.innerHTML = `
      <a href="pages/login.html">Đăng nhập</a>
      <a href="pages/register.html">Đăng ký</a>
    `;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.updateUserMenu();
    this.dropdown.classList.remove('active');
    
    // Dispatch event for other modules
    window.dispatchEvent(new Event('userLoggedOut'));
  }
}

// Initialize auth manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AuthManager();
});