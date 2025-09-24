/**
 * Search functionality for products
 */
class ProductSearch {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSearch());
        } else {
            this.setupSearch();
        }
    }

    setupSearch() {
        this.searchInput = document.querySelector('#search-box');
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            // Handle search form submission
            const searchForm = document.querySelector('.search-form');
            if (searchForm) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSearch(this.searchInput.value);
                });
            }
        }

        // Create search results container
        this.createSearchResultsContainer();
    }

    createSearchResultsContainer() {
        // Create search results container if it doesn't exist
        if (!document.querySelector('.search-results')) {
            const searchResults = document.createElement('div');
            searchResults.classList.add('search-results');
            searchResults.style.display = 'none';
            
            // Insert after the search form
            const searchForm = document.querySelector('.search-form');
            if (searchForm) {
                searchForm.parentNode.insertBefore(searchResults, searchForm.nextSibling);
            }
            
            this.searchResults = searchResults;
        }
    }

    async handleSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        // Ensure products are loaded
        if (!window.productDB.loaded) {
            await window.productDB.loadProducts();
        }

        const results = window.productDB.searchProducts(query);
        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>No products found for "${query}"</p>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = `
                <div class="search-header">
                    <h3>Search Results for "${query}" (${results.length} found)</h3>
                    <button class="close-search">&times;</button>
                </div>
                <div class="search-products">
                    ${results.map(product => this.createSearchResultItem(product)).join('')}
                </div>
            `;

            // Add event listeners to search result items
            this.addSearchResultListeners();
        }

        this.showSearchResults();
    }

    createSearchResultItem(product) {
        return `
            <div class="search-result-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="description">${product.description}</p>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <div class="rating">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span>(${product.rating})</span>
                    </div>
                    <button class="btn add-to-cart-search" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    addSearchResultListeners() {
        // Close search results
        const closeBtn = this.searchResults.querySelector('.close-search');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideSearchResults();
                this.clearSearchInput();
            });
        }

        // Add to cart from search results
        const addToCartBtns = this.searchResults.querySelectorAll('.add-to-cart-search');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const product = window.productDB.getProductById(productId);
                
                if (product && window.cart) {
                    window.cart.addItem(product);
                    this.showAddToCartFeedback(e.target);
                }
            });
        });
    }

    showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 1500);
    }

    showSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
            
            // Hide other active elements
            document.querySelector('.navbar')?.classList.remove('active');
            document.querySelector('.cart-items-container')?.classList.remove('active');
            document.querySelector('.auth-popup')?.classList.remove('active');
        }
    }

    hideSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }

    clearSearchInput() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
}

// Initialize search when DOM is ready
window.productSearch = new ProductSearch();

