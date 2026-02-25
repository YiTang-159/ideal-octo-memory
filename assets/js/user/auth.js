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
    this.userIcon.style.display = 'inline-block';
    let authContainer = document.querySelector('.user-menu .auth-buttons');
    if (authContainer) authContainer.style.display = 'none';

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
    this.userIcon.style.display = 'none';
    this.dropdown.classList.remove('active');

    let authContainer = document.querySelector('.user-menu .auth-buttons');
    if (!authContainer) {
      const userMenu = document.querySelector('.user-menu');
      if (userMenu) {
        userMenu.insertAdjacentHTML('beforeend', `
          <div class="auth-buttons">
            <a href="pages/login.html" class="auth-btn sign-in-btn">Đăng nhập</a>
            <a href="pages/register.html" class="auth-btn sign-up-btn">Đăng ký</a>
          </div>
        `);
      }
    } else {
      authContainer.style.display = 'flex';
    }
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