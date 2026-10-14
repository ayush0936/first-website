# Rangrez – E-Commerce Website

**BCA Minor Project (BCA-507)**

| | |
|---|---|
| **Student** | Ayush Kumar Mishra |
| **Roll No.** | 240845106042 |
| **Course** | Bachelor of Computer Application (BCA), Batch 2024-27 |
| **College** | Integrated Academy of Management and Technology (INMANTEC), Ghaziabad |
| **University** | Chaudhary Charan Singh University, Meerut |
| **Guide** | Ms. Shweta Choudhary (Assistant Professor) |

## About the project
Rangrez ek frontend e-commerce website hai jo HTML, CSS aur JavaScript se bani hai. Isme fashion, electronics, accessories aur home products ki shopping ka poora flow hai: product dekhna, cart, login aur checkout.

## Features
- Home page: hero slider, category menu, search, filters (category, price, rating) aur sorting
- Product cards: discount badge, rating, wishlist aur quick view
- Product detail page: image zoom, size aur quantity, pincode se delivery date, specifications aur reviews
- Cart: quantity badhana/ghatana, free delivery progress bar
- Wishlist: product save karna aur cart mein move karna
- Login / Sign up: form validation aur password show/hide
- Checkout: address form, payment (UPI, Card, Cash on Delivery) aur coupon code
- Order success page aur order history
- Responsive design (mobile aur laptop dono par)

## Technologies used
- HTML5
- CSS3 (Flexbox, Grid, CSS Variables)
- JavaScript (ES6)
- localStorage (data browser mein save hota hai)

## VS Code mein kaise chalayein
1. Zip ko extract karo
2. VS Code mein **File > Open Folder** se `rangrez-store` kholo
3. **Live Server** extension install karo
4. `index.html` par right-click karke **Open with Live Server** chuno
5. Internet chalu rakho (images aur font online se aate hain)

## Folder structure
```
rangrez-store/
├── index.html        Home / shop page
├── login.html        Login + Sign up
├── product.html      Product detail page
├── checkout.html     Address + Payment
├── css/
│   ├── style.css     Main styling
│   └── pages.css     Login, product, checkout ki styling
├── js/
│   ├── data.js       Products data + shared functions
│   ├── script.js     Home page logic
│   ├── login.js      Login / Sign up logic
│   ├── product.js    Product detail logic
│   └── checkout.js   Checkout logic
└── .vscode/          VS Code settings
```

## Demo details
- Coupon code: `RANG10` (10% off)
- Test card: `4111 1111 1111 1111` (koi bhi aage ki expiry date, 3-digit CVV)
- Free delivery ₹1,999 se upar ke orders par

## Limitations
- Ye sirf frontend demo hai. Users, cart aur orders browser ke localStorage mein save hote hain.
- Payment asli nahi hai aur card ki details kahin save nahi hoti.

## Future scope
- Backend (PHP / Node.js) aur MySQL database
- Secure login (password hashing)
- Real payment gateway
- Admin panel (products aur orders manage karne ke liye)