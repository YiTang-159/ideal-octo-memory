// Search functionality
class SearchManager {
  constructor() {
    this.searchInput = document.querySelector('.search-bar input');
    this.searchButton = document.querySelector('.search-bar button');
    this.resultsBox = document.querySelector('.search-results');
    this.products = this.getProducts();
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.searchButton.addEventListener('click', () => this.search());
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.search();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar') && !e.target.closest('.search-results')) {
        this.hideResults();
      }
    });
  }

  search() {
    const keyword = this.searchInput.value.trim().toLowerCase();

    if (keyword === '') {
      this.hideResults();
      return;
    }

    const filtered = this.products.filter(product =>
      product.name.toLowerCase().includes(keyword)
    );

    this.displayResults(filtered);
  }

  displayResults(products) {
    this.resultsBox.innerHTML = '';

    if (products.length === 0) {
      this.showNoResults();
      return;
    }

    products.forEach(product => {
      const item = this.createResultItem(product);
      this.resultsBox.appendChild(item);
    });

    this.showResults();
  }

  createResultItem(product) {
    const item = document.createElement('div');
    item.classList.add('product-item');
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/image/product/placeholder.png'">
      <div>
        <h4>${product.name}</h4>
        <p>Giá: ${product.price}</p>
      </div>
    `;

    item.addEventListener('click', () => {
      window.location.href = `pages/product-detail.html?id=${product.id}`;
    });

    return item;
  }

  showNoResults() {
    this.resultsBox.innerHTML = `
      <p style="text-align:center; padding:10px; color:#8B0000;">
        Không tìm thấy sản phẩm
      </p>
    `;
    this.showResults();
  }

  showResults() {
    this.resultsBox.classList.add('active');
  }

  hideResults() {
    this.resultsBox.classList.remove('active');
  }

  getProducts() {
    return [
      { id: 1, name: "Bánh Trung Thu Golden Plum", price: "189.000đ", image: "assets/image/product/banh-trung-thu-golden-plum.png" },
      { id: 2, name: "Bánh Trung Thu Hotate XO Mixed Nuts", price: "139.000đ", image: "assets/image/product/banh-trung-thu-hotate-xo-mixed-nuts.png" },
      { id: 3, name: "Bánh Trung Thu Matcha", price: "99.000đ", image: "assets/image/product/banh-trung-thu-matcha.png" },
      { id: 4, name: "Bánh Trung Thu Murasaki Imo", price: "115.000đ", image: "assets/image/product/banh-trung-thu-murasaki-imo.png" },
      { id: 5, name: "Bánh Trung Thu Mushroom Mixed Nuts", price: "129.000đ", image: "assets/image/product/banh-trung-thu-mushroom-mixed-nuts.png" },
      { id: 6, name: "Bánh Trung Thu Pink Nocturne", price: "105.000đ", image: "assets/image/product/banh-trung-thu-pink-nocturne.png" },
      { id: 7, name: "Bánh Trung Thu Takesumi Orange", price: "125.000đ", image: "assets/image/product/banh-trung-thu-takesumi-orange.png" },
      { id: 8, name: "Bánh Trung Thu Xôi Gấc", price: "95.000đ", image: "assets/image/product/banh-trung-thu-xoi-gac.png" }
    ];
  }
}

// Initialize search manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SearchManager();
});