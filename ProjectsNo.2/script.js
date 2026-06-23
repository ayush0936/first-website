// Cart  Counter
//let cartCount = 0;

//function addToCart(price) {
    //cartCount++;
    
    //document.getElementById('cartCount').textContent = cartCount;


//Product Search 

function searchProducts() {

    let input = 
    document.getElementById('search').value.toLowerCase();

    let cards =
     document.querySelectorAll('.product-card');

    cards.forEach(card => {
        let productName = card.querySelector('h3').textContent.toLowerCase();

        if (productName.includes(input)) {
            card.style.display = ' ';
        } else {
            card.style.display = 'none';
        }
    });
}
document.getElementById('search').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchProducts();
    }
});

// Dark Mode Toggle
//function toggleDarkMode() {
    //document.body.classList.toggle('dark-mode');

//let totalPrice = 0;
let cartCount = 0;
let totalPrice = 0;
function addToCart(Price){
    cartCount++;
    totalPrice += Price;
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('totalPrice').textContent = totalPrice;
}

// image Slider 
const sliderImage = [
    "phone2.jpg",
    "headphone2.jpg",
    "watch2.jpg",
    "laptop2.webp"
];
let currentSlide = 0;

function showSlide(){
    document.getElementById('sliderImage').src=sliderImage[currentSlide];
}
function nextSlide() {
    currentSlide++;
    if (currentSlide >= sliderImage.length) {
        currentSlide = 0;
    }
    showSlide();
}
showSlide();
setInterval(nextSlide, 3000);