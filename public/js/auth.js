/**
 * User Authentication with Local Storage
 */
class UserAuth {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.loadFromStorage();
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAuth());
        } else {
            this.setupAuth();
        }
    }

    setupAuth() {
        this.setupAuthForms();
        this.updateAuthDisplay();
    }

    /**
     * Load users and current user from localStorage
     */
    loadFromStorage() {
        const savedUsers = localStorage.getItem('coffee_users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }

        const currentUser = localStorage.getItem('coffee_current_user');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
        }
    }

    /**
     * Save users to localStorage
     */
    saveUsersToStorage() {
        localStorage.setItem('coffee_users', JSON.stringify(this.users));
    }

    /**
     * Save current user to localStorage
     */
    saveCurrentUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('coffee_current_user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('coffee_current_user');
        }
    }

    /**
     * Setup authentication forms
     */
    setupAuthForms() {
        const signupForm = document.querySelector('.signup-form');
        const loginForm = document.querySelector('.login-form');
        const signupTab = document.querySelector('#signup-tab');
        const loginTab = document.querySelector('#login-tab');

        // Tab switching
        if (signupTab && loginTab) {
            signupTab.addEventListener('click', () => {
                this.switchToSignup();
            });

            loginTab.addEventListener('click', () => {
                this.switchToLogin();
            });
        }

        // Signup form
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(signupForm);
            });
        }

        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }

        // Logout functionality
        this.setupLogout();
    }

    /**
     * Switch to signup tab
     */
    switchToSignup() {
        const signupTab = document.querySelector('#signup-tab');
        const loginTab = document.querySelector('#login-tab');
        const signupForm = document.querySelector('.signup-form');
        const loginForm = document.querySelector('.login-form');

        if (signupTab && loginTab && signupForm && loginForm) {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
        }
    }

    /**
     * Switch to login tab
     */
    switchToLogin() {
        const signupTab = document.querySelector('#signup-tab');
        const loginTab = document.querySelector('#login-tab');
        const signupForm = document.querySelector('.signup-form');
        const loginForm = document.querySelector('.login-form');

        if (signupTab && loginTab && signupForm && loginForm) {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        }
    }

    /**
     * Handle user signup
     */
    handleSignup(form) {
        const formData = new FormData(form);
        const name = formData.get('name') || form.querySelector('input[type="text"]')?.value;
        const email = formData.get('email') || form.querySelector('input[type="email"]')?.value;
        const password = formData.get('password') || form.querySelector('input[type="password"]')?.value;

        // Validation
        if (!name || !email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            this.showMessage('User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: this.hashPassword(password), // In real app, use proper hashing
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsersToStorage();

        // Auto login after signup
        this.currentUser = { ...newUser };
        delete this.currentUser.password; // Don't store password in current user
        this.saveCurrentUserToStorage();

        this.showMessage('Account created successfully!', 'success');
        this.closeAuthPopup();
        this.updateAuthDisplay();
        form.reset();
    }

    /**
     * Handle user login
     */
    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]')?.value;
        const password = formData.get('password') || form.querySelector('input[type="password"]')?.value;

        // Validation
        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Find user
        const user = this.users.find(user => user.email === email);
        if (!user || user.password !== this.hashPassword(password)) {
            this.showMessage('Invalid email or password', 'error');
            return;
        }

        // Login successful
        this.currentUser = { ...user };
        delete this.currentUser.password; // Don't store password in current user
        this.saveCurrentUserToStorage();

        this.showMessage('Login successful!', 'success');
        this.closeAuthPopup();
        this.updateAuthDisplay();
        form.reset();

        // Load user's cart if exists
        this.loadUserCart();
    }

    /**
     * Handle user logout
     */
    logout() {
        // Save current cart to user's data before logout
        if (this.currentUser && window.cart) {
            this.saveUserCart();
        }

        this.currentUser = null;
        this.saveCurrentUserToStorage();
        this.updateAuthDisplay();
        this.showMessage('Logged out successfully', 'success');

        // Clear cart or load guest cart
        if (window.cart) {
            window.cart.clearCart();
        }
    }

    /**
     * Setup logout functionality
     */
    setupLogout() {
        // Create logout button if user is logged in
        this.updateAuthDisplay();
    }

    /**
     * Update authentication display
     */
    updateAuthDisplay() {
        const authBtn = document.querySelector('#auth-btn');
        
        if (this.currentUser) {
            // User is logged in
            if (authBtn) {
                authBtn.innerHTML = `<i class="fas fa-user-circle"></i>`;
                authBtn.title = `Logged in as ${this.currentUser.name}`;
                
                // Add logout option
                this.addUserMenu(authBtn);
            }
        } else {
            // User is not logged in
            if (authBtn) {
                authBtn.innerHTML = `<i class="fas fa-user"></i>`;
                authBtn.title = 'Sign Up or Log In';
            }
        }
    }

    /**
     * Add user menu for logged in users
     */
    addUserMenu(authBtn) {
        // Remove existing menu
        const existingMenu = document.querySelector('.user-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create user menu
        const userMenu = document.createElement('div');
        userMenu.classList.add('user-menu');
        userMenu.style.display = 'none';
        userMenu.innerHTML = `
            <div class="user-info">
                <p>Welcome, ${this.currentUser.name}!</p>
                <p class="user-email">${this.currentUser.email}</p>
            </div>
            <button class="logout-btn">Logout</button>
        `;

        // Insert menu after auth button
        authBtn.parentNode.insertBefore(userMenu, authBtn.nextSibling);

        // Toggle menu on auth button click
        authBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
            
            // Close other menus
            document.querySelector('.navbar')?.classList.remove('active');
            document.querySelector('.cart-items-container')?.classList.remove('active');
            document.querySelector('.search-form')?.classList.remove('active');
        });

        // Logout button
        const logoutBtn = userMenu.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', () => {
            this.logout();
            userMenu.style.display = 'none';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target) && e.target !== authBtn) {
                userMenu.style.display = 'none';
            }
        });
    }

    /**
     * Close authentication popup
     */
    closeAuthPopup() {
        const authPopup = document.querySelector('.auth-popup');
        if (authPopup) {
            authPopup.classList.remove('active');
        }
    }

    /**
     * Save user's cart data
     */
    saveUserCart() {
        if (this.currentUser && window.cart) {
            const userCartKey = `cart_${this.currentUser.id}`;
            localStorage.setItem(userCartKey, JSON.stringify(window.cart.getItems()));
        }
    }

    /**
     * Load user's cart data
     */
    loadUserCart() {
        if (this.currentUser && window.cart) {
            const userCartKey = `cart_${this.currentUser.id}`;
            const savedCart = localStorage.getItem(userCartKey);
            
            if (savedCart) {
                const cartItems = JSON.parse(savedCart);
                window.cart.items = cartItems;
                window.cart.saveToStorage();
                window.cart.updateCartDisplay();
            }
        }
    }

    /**
     * Simple email validation
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simple password hashing (use proper hashing in production)
     */
    hashPassword(password) {
        // This is a simple hash for demo purposes
        // In production, use proper hashing like bcrypt
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.querySelector('.auth-message');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.classList.add('auth-message');
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';

        // Auto hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize auth when DOM is ready
window.userAuth = new UserAuth();

