// Cart management
class CartManager {
  constructor() {
    this.cartCountBadge = document.getElementById('cartCountBadge');
    this.cartLink = document.getElementById('cartLink');
    this.init();
  }

  init() {
    this.updateCartDisplay();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for cart updates from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        this.updateCartDisplay();
      }
    });

    // Listen for auth changes
    window.addEventListener('userLoggedOut', () => {
      this.updateCartDisplay();
    });
  }

  updateCartDisplay() {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      this.hideCart();
      return;
    }

    this.showCart();
    this.updateCartCount();
  }

  getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  hideCart() {
    this.cartLink.style.display = 'none';
  }

  showCart() {
    this.cartLink.style.display = 'inline-block';
  }

  updateCartCount() {
    const cart = this.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalCount > 0) {
      this.cartCountBadge.textContent = totalCount;
      this.cartCountBadge.classList.add('visible');
    } else {
      this.cartCountBadge.textContent = '0';
      this.cartCountBadge.classList.remove('visible');
    }
  }

  getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
}

// Initialize cart manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CartManager();
});