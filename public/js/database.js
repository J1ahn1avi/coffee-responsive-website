/**
 * Database management for coffee products
 */
class ProductDatabase {
    constructor() {
        this.products = [];
        this.loaded = false;
    }

    /**
     * Load products from JSON file
     */
    async loadProducts() {
        try {
            const response = await fetch('./data/products.json');
            const data = await response.json();
            this.products = data.products;
            this.loaded = true;
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    /**
     * Get all products
     */
    getAllProducts() {
        return this.products;
    }

    /**
     * Get product by ID
     */
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    /**
     * Search products by name or description
     */
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.origin.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Filter products by category
     */
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    /**
     * Get products in stock
     */
    getInStockProducts() {
        return this.products.filter(product => product.inStock);
    }

    /**
     * Get featured products (highest rated)
     */
    getFeaturedProducts(limit = 6) {
        return this.products
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
}

// Create global instance
window.productDB = new ProductDatabase();

