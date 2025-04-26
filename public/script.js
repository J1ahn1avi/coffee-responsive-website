document.addEventListener("DOMContentLoaded", function () {
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

    // Initialize cart count
    let cartCount = cartItemContainer.querySelectorAll(".cart-item").length;
    cartCounter.textContent = cartCount;

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

    // Add to Cart functionality
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Add to cart clicked!");

            let box = button.closest(".box");
            let imgSrc = box.querySelector("img").src;
            let title = box.querySelector("h3").textContent;
            let price = box.querySelector(".price").textContent;

            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <span class="fas fa-times"></span>
                <img src="${imgSrc}" alt="${title}">
                <div class="content">
                    <h3>${title}</h3>
                    <div class="price">${price}</div>
                </div>
            `;

            cartItemContainer.insertBefore(cartItem, cartItemContainer.querySelector(".btn"));

            cartCount++;
            cartCounter.textContent = cartCount;

            cartItem.querySelector(".fa-times").addEventListener("click", () => {
                cartItem.remove();
                cartCount--;
                cartCounter.textContent = cartCount;
            });
        });
    });

    cartItemContainer.querySelectorAll(".cart-item .fa-times").forEach((removeBtn) => {
        removeBtn.addEventListener("click", () => {
            removeBtn.closest(".cart-item").remove();
            cartCount--;
            cartCounter.textContent = cartCount;
        });
    });

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