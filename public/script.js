document.addEventListener("DOMContentLoaded", function () {
    let searchBtn = document.querySelector("#search-btn");
    let searchForm = document.querySelector(".search-form");
    let navbar = document.querySelector('.navbar');
    let cartItem = document.querySelector('.cart-items-container');

    searchBtn.addEventListener("click", function () {
        searchForm.classList.toggle("active");
        navbar.classList.remove('active');
        cartItem.classList.remove('active');
    });

    document.querySelector('#menu-btn').addEventListener('click', () => {
        console.log("Menu button clicked!");
        navbar.classList.toggle('active');
        cartItem.classList.remove('active');
        searchForm.classList.remove("active");
    });

    document.querySelector('#cart-btn').addEventListener('click', () => {
        console.log("Cart button clicked!");
        cartItem.classList.toggle('active');
        navbar.classList.remove('active');
        searchForm.classList.remove("active");
    });
});


