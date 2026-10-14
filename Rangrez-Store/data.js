// ========== Shared data & helpers (saare pages isi file ko use karte hain) ==========
const U = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=70`;

const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    cat: "Electronics",
    price: 2499,
    old: 3999,
    rating: 4.5,
    reviews: 1284,
    img: U("1505740420928-5e560c06d30e"),
    desc: "Over-ear wireless headphones with deep bass, 30-hour battery and soft ear cushions.",
  },
  {
    id: 2,
    name: "Classic Analog Watch",
    cat: "Accessories",
    price: 1899,
    old: 3299,
    rating: 4.3,
    reviews: 612,
    img: U("1523275335684-37898b6baf30"),
    desc: "Minimal dial, stainless steel case and a comfortable strap for everyday wear.",
  },
  {
    id: 3,
    name: "Red Street Sneakers",
    cat: "Fashion",
    price: 2199,
    old: 3499,
    rating: 4.4,
    reviews: 903,
    img: U("1542291026-7eec264c27ff"),
    desc: "Lightweight sneakers with a cushioned sole. Made for long walks and long days.",
  },
  {
    id: 4,
    name: "Aviator Sunglasses",
    cat: "Accessories",
    price: 799,
    old: 1499,
    rating: 4.1,
    reviews: 355,
    img: U("1572635196237-14b3f281503f"),
    desc: "UV400 protected lenses in a lightweight frame that suits every face shape.",
  },
  {
    id: 5,
    name: "Everyday Backpack",
    cat: "Fashion",
    price: 1299,
    old: 2199,
    rating: 4.6,
    reviews: 2011,
    img: U("1553062407-98eeb64c6a62"),
    desc: "Water-resistant 25L backpack with a padded laptop sleeve and hidden pocket.",
  },
  {
    id: 6,
    name: "Mirrorless Camera",
    cat: "Electronics",
    price: 4999,
    old: 6999,
    rating: 4.7,
    reviews: 178,
    img: U("1526170375885-4d8ecf77b99f"),
    desc: "Compact camera with fast autofocus and 4K video. Great for travel and vlogs.",
  },
  {
    id: 7,
    name: "White Leather Sneakers",
    cat: "Fashion",
    price: 2799,
    old: 3999,
    rating: 4.5,
    reviews: 742,
    img: U("1549298916-b41d501d3772"),
    desc: "Clean white sneakers in soft faux leather that go with everything.",
  },
  {
    id: 8,
    name: "Eau de Parfum 50ml",
    cat: "Accessories",
    price: 1599,
    old: 2499,
    rating: 4.2,
    reviews: 489,
    img: U("1541643600914-78b084683601"),
    desc: "Fresh woody fragrance with a long-lasting finish. Comes in a gift box.",
  },
  {
    id: 9,
    name: "Desk Study Lamp",
    cat: "Home",
    price: 899,
    old: 1499,
    rating: 4.4,
    reviews: 530,
    img: U("1507473885765-e6ed057f782c"),
    desc: "Adjustable arm, warm light and a sturdy base. Easy on the eyes during late study.",
  },
  {
    id: 10,
    name: "Indoor Plant Pot",
    cat: "Home",
    price: 549,
    old: 899,
    rating: 4.6,
    reviews: 866,
    img: U("1485955900006-10f4d324d411"),
    desc: "Low-maintenance indoor plant in a ceramic pot. Brings life to any corner.",
  },
  {
    id: 11,
    name: "Cotton Hoodie",
    cat: "Fashion",
    price: 1499,
    old: 2499,
    rating: 4.3,
    reviews: 1520,
    img: U("1556821840-3a63f95609a7"),
    desc: "Soft brushed-fleece hoodie with a relaxed fit. Warm without being heavy.",
  },
  {
    id: 12,
    name: "Ceramic Coffee Mug",
    cat: "Home",
    price: 349,
    old: 599,
    rating: 4.0,
    reviews: 241,
    img: U("1514228742587-6b1558fcca3d"),
    desc: "Hand-finished 350ml ceramic mug that keeps your chai hot for longer.",
  },
];

const CATS = ["All", "Fashion", "Electronics", "Accessories", "Home"];
const FREE_SHIP = 1999;

// ========== Storage helpers ==========
function load(k, d) {
  try {
    return JSON.parse(localStorage.getItem(k)) || d;
  } catch (e) {
    return d;
  }
}

function store(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
}

// ========== Small utilities ==========
const $ = (id) => document.getElementById(id);
const inr = (n) => "₹" + n.toLocaleString("en-IN");
const off = (p) => Math.round(((p.old - p.price) / p.old) * 100);
const byId = (id) => PRODUCTS.find((p) => p.id == id);

// Agar image load na ho to broken icon ki jagah halka background dikhe
const IMG = (p, cls = "") =>
  `<img class="${cls}" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.visibility='hidden'">`;

function toast(m) {
  const t = $("toast");
  t.textContent = m;
  t.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("on"), 1800);
}

// ========== Form validation helpers ==========
// Error message dikhana ya hatana (true = sahi, false = galat)
function setErr(id, msg) {
  const f = $(id).closest(".field");
  f.querySelector(".err").textContent = msg || "";
  f.classList.toggle("bad", !!msg);
  return !msg;
}

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// ========== Header ==========
// Header ka cart count aur login naam update karna
function initHeader() {
  const c = load("rg-cart", {});
  const u = load("rg-user", null);

  if ($("cartCount")) {
    $("cartCount").textContent = Object.values(c).reduce((a, b) => a + b, 0);
  }

  if ($("acctName")) {
    $("acctName").textContent = u ? u.name.split(" ")[0] : "Login";
  }
}