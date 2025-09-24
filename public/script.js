document.addEventListener("DOMContentLoaded", async function () {
    // Elements
    let searchBtn = document.querySelector("#search-btn");
    let searchForm = document.querySelector(".search-form");
    let navbar = document.querySelector(".navbar");
    let cartItemContainer = document.querySelector(".cart-items-container");
    let cartCounter = document.querySelector("#cart-counter");
    let addToCartButtons = document.querySelectorAll(".menu .btn");
    const authPopup = document.querySelector(".auth-popup");
    const authBtn = document.querySelector("#auth-btn");
    const authClose = document.querySelector(".auth-close");
    const signupTab = document.querySelector("#signup-tab");
    const loginTab = document.querySelector("#login-tab");
    const signupForm = document.querySelector(".signup-form");
    const loginForm = document.querySelector(".login-form");

    // Initialize database and cart
    await initializeApp();

    // Toggle functionality
    searchBtn.addEventListener("click", function () {
        searchForm.classList.toggle("active");
        navbar.classList.remove("active");
        cartItemContainer.classList.remove("active");
        authPopup.classList.remove("active");
    });

    document.querySelector("#menu-btn").addEventListener("click", () => {
        console.log("Menu button clicked!");
        navbar.classList.toggle("active");
        cartItemContainer.classList.remove("active");
        searchForm.classList.remove("active");
        authPopup.classList.remove("active");
    });

    document.querySelector("#cart-btn").addEventListener("click", () => {
        console.log("Cart button clicked!");
        cartItemContainer.classList.toggle("active");
        navbar.classList.remove("active");
        searchForm.classList.remove("active");
        authPopup.classList.remove("active");
    });

    authBtn.addEventListener("click", () => {
        authPopup.classList.toggle("active");
        navbar.classList.remove("active");
        cartItemContainer.classList.remove("active");
        searchForm.classList.remove("active");
    });

    authClose.addEventListener("click", () => {
        authPopup.classList.remove("active");
    });

    signupTab.addEventListener("click", () => {
        signupForm.classList.add("active");
        loginForm.classList.remove("active");
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
    });

    loginTab.addEventListener("click", () => {
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
    });

    // Initialize app function
    async function initializeApp() {
        // Load products from database
        await window.productDB.loadProducts();
        
        // Initialize cart display
        if (window.cart) {
            window.cart.updateCartDisplay();
        }
        
        // Setup add to cart functionality
        setupAddToCartButtons();
        
        // Load products into menu if needed
        loadMenuProducts();
    }

    // Setup add to cart buttons
    function setupAddToCartButtons() {
        addToCartButtons = document.querySelectorAll(".menu .btn");
        addToCartButtons.forEach((button, index) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                
                // Get product from database based on index
                const products = window.productDB.getAllProducts();
                const product = products[index % products.length]; // Use modulo in case there are more buttons than products
                
                if (product && window.cart) {
                    window.cart.addItem(product);
                    showAddToCartFeedback(button);
                }
            });
        });
    }

    // Show feedback when item is added to cart
    function showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 1500);
    }

    // Load products into menu section
    function loadMenuProducts() {
        const menuContainer = document.querySelector('.menu .box-container');
        if (!menuContainer) return;

        const products = window.productDB.getFeaturedProducts(6);
        
        // Clear existing boxes
        menuContainer.innerHTML = '';
        
        // Add products
        products.forEach(product => {
            const productBox = createProductBox(product);
            menuContainer.appendChild(productBox);
        });
        
        // Re-setup add to cart buttons
        setupAddToCartButtons();
    }

    // Create product box HTML
    function createProductBox(product) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">$${product.price.toFixed(2)}</div>
            <a href="#" class="btn">add to cart</a>
        `;
        return box;
    }

    // Sign-up 
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = signupForm.querySelector("input[type='text']").value;
            const email = signupForm.querySelector("input[type='email']").value;
            const password = signupForm.querySelector("input[type='password']").value;
            console.log("Manual Sign Up:", { name, email, password });
            signupForm.reset();
            authPopup.classList.remove("active");
        });
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;
            console.log("Manual Login:", { email, password });
            loginForm.reset();
            authPopup.classList.remove("active");
        });
    }

    // Google Sign-In 
    window.handleCredentialResponse = function (response) {
        const data = JSON.parse(atob(response.credential.split('.')[1]));
        console.log("Google Sign-In:", {
            name: data.name,
            email: data.email,
            picture: data.picture
        });
        authPopup.classList.remove("active");
    };

    // Show Password Toggle
    document.querySelectorAll(".toggle-password").forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const passwordInput = toggle.previousElementSibling;
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggle.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            passwordInput.type = "password";
            toggle.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
});
});
