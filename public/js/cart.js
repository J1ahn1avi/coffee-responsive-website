/**
 * Shopping Cart Management with Local Storage
 */
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    /**
     * Load cart from localStorage
     */
    loadFromStorage() {
        const savedCart = localStorage.getItem('coffee_cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    /**
     * Save cart to localStorage
     */
    saveToStorage() {
        localStorage.setItem('coffee_cart', JSON.stringify(this.items));
    }

    /**
     * Add item to cart
     */
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.updateCartDisplay();
        return true;
    }

    /**
     * Remove item from cart
     */
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
    }

    /**
     * Update item quantity
     */
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartDisplay();
            }
        }
    }

    /**
     * Get cart items
     */
    getItems() {
        return this.items;
    }

    /**
     * Get total items count
     */
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Get total price
     */
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Clear cart
     */
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
    }

    /**
     * Update cart display in UI
     */
    updateCartDisplay() {
        const cartCounter = document.querySelector('#cart-counter');
        const cartContainer = document.querySelector('.cart-items-container');
        
        if (cartCounter) {
            cartCounter.textContent = this.getTotalItems();
        }

        if (cartContainer) {
            this.renderCartItems(cartContainer);
            this.updateEmptyCartDisplay(cartContainer);
        }
    }

    /**
     * Render cart items in the cart container
     */
    renderCartItems(container) {
        // Clear existing items (except the checkout button)
        const existingItems = container.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());

        // Add current cart items
        this.items.forEach(item => {
            const cartItemElement = this.createCartItemElement(item);
            container.insertBefore(cartItemElement, container.querySelector('.btn') || container.firstChild);
        });

        // Update or create total display
        this.updateCartTotal(container);
    }

    /**
     * Create cart item HTML element
     */
    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.dataset.productId = item.id;
        
        cartItem.innerHTML = `
            <span class="fas fa-times remove-item" data-id="${item.id}"></span>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <div class="price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="item-total">Total: $${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;

        // Add event listeners
        this.addCartItemEventListeners(cartItem);
        
        return cartItem;
    }

    /**
     * Add event listeners to cart item
     */
    addCartItemEventListeners(cartItem) {
        // Remove item
        const removeBtn = cartItem.querySelector('.remove-item');
        removeBtn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            this.removeItem(productId);
        });

        // Quantity controls
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        
        minusBtn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const item = this.items.find(item => item.id === productId);
            if (item) {
                this.updateQuantity(productId, item.quantity - 1);
            }
        });

        plusBtn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const item = this.items.find(item => item.id === productId);
            if (item) {
                this.updateQuantity(productId, item.quantity + 1);
            }
        });
    }

    /**
     * Update cart total display
     */
    updateCartTotal(container) {
        let totalElement = container.querySelector('.cart-total');
        
        if (!totalElement) {
            totalElement = document.createElement('div');
            totalElement.classList.add('cart-total');
            container.appendChild(totalElement);
        }

        const total = this.getTotalPrice();
        const itemCount = this.getTotalItems();
        
        totalElement.innerHTML = `
            <div class="total-info">
                <p>Items: ${itemCount}</p>
                <p class="total-price">Total: $${total.toFixed(2)}</p>
            </div>
        `;
    }

    /**
     * Update empty cart display and checkout button visibility
     */
    updateEmptyCartDisplay(container) {
        const emptyCart = container.querySelector('.empty-cart');
        const checkoutBtn = container.querySelector('.checkout-btn');
        const hasItems = this.items.length > 0;

        if (emptyCart) {
            emptyCart.style.display = hasItems ? 'none' : 'block';
        }

        if (checkoutBtn) {
            checkoutBtn.style.display = hasItems ? 'block' : 'none';
        }
    }
}

// Create global cart instance
window.cart = new ShoppingCart();
