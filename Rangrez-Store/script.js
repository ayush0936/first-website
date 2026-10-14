// ========== 2. State (page ki current halat) ==========
let f = { cat: "All", max: 5000, rating: 0, sort: "pop", q: "" };
let cart = load("rg-cart", {}); // {productId: quantity}
let wish = load("rg-wish", []); // [productId, ...]

function save() {
  try {
    localStorage.setItem("rg-cart", JSON.stringify(cart));
    localStorage.setItem("rg-wish", JSON.stringify(wish));
  } catch (e) {}
}

// ========== 3. Products grid ==========
function visible() {
  let list = PRODUCTS.filter(
    (p) =>
      (f.cat === "All" || p.cat === f.cat) &&
      p.price <= f.max &&
      p.rating >= f.rating &&
      (p.name + " " + p.cat).toLowerCase().includes(f.q.toLowerCase())
  );

  if (f.sort === "low") list.sort((a, b) => a.price - b.price);
  if (f.sort === "high") list.sort((a, b) => b.price - a.price);
  if (f.sort === "disc") list.sort((a, b) => off(b) - off(a));
  if (f.sort === "pop") list.sort((a, b) => b.reviews - a.reviews);

  return list;
}

function renderGrid() {
  const list = visible();

  $("title").textContent = f.cat === "All" ? "All products" : f.cat;
  $("found").textContent = list.length + " items";

  $("grid").innerHTML = list.length
    ? list
        .map(
          (p) => `
    <article class="card">
      <div class="media" data-view="${p.id}">
        ${IMG(p)}
        <span class="badge">${off(p)}% OFF</span>
        <button class="heart ${wish.includes(p.id) ? "on" : ""}" data-heart="${p.id}" aria-label="Add to wishlist">
          ${wish.includes(p.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="body">
        <small>${p.cat}</small>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="stars">
          <b>${p.rating} ★</b>
          <span>(${p.reviews.toLocaleString("en-IN")})</span>
        </div>
        <div class="pr">
          <b>${inr(p.price)}</b>
          <s>${inr(p.old)}</s>
          <em>${off(p)}% off</em>
        </div>
        <button class="add" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`
        )
        .join("")
    : '<div class="empty">No products match your filters. Try clearing them.</div>';

  document
    .querySelectorAll(".cats button")
    .forEach((b) => b.classList.toggle("on", b.dataset.c === f.cat));
  $("catSelect").value = f.cat;
}

// ========== 4. Cart ==========
function renderCart() {
  const ids = Object.keys(cart);
  let total = 0;
  let count = 0;

  ids.forEach((id) => {
    total += byId(id).price * cart[id];
    count += cart[id];
  });

  $("cartCount").textContent = count;
  $("wishCount").textContent = wish.length;
  $("drawerTitle").textContent = "Your cart";
  $("foot").style.display = ids.length ? "" : "none";
  $("ship").style.display = "";

  const left = FREE_SHIP - total;
  $("ship").innerHTML =
    left > 0
      ? `Add <b>${inr(left)}</b> more for free delivery<div class="bar"><i style="width:${(total / FREE_SHIP) * 100}%"></i></div>`
      : `You have unlocked <b>free delivery</b><div class="bar"><i style="width:100%"></i></div>`;

  $("total").textContent = inr(total);

  $("items").innerHTML = ids.length
    ? ids
        .map((id) => {
          const p = byId(id);
          return `
    <div class="row">
      ${IMG(p)}
      <div>
        <h4>${p.name}</h4>
        <div class="qty">
          <button data-dec="${id}">−</button>
          <span>${cart[id]}</span>
          <button data-inc="${id}">+</button>
        </div>
        <button class="rm" data-rm="${id}">Remove</button>
      </div>
      <b>${inr(p.price * cart[id])}</b>
    </div>`;
        })
        .join("")
    : '<div class="d-empty">Your cart is empty.<br>Find something you like.</div>';

  if (!ids.length) $("ship").style.display = "none";
}

function renderWish() {
  $("drawerTitle").textContent = "Your wishlist";
  $("ship").style.display = "none";
  $("foot").style.display = "none";

  $("items").innerHTML = wish.length
    ? wish
        .map((id) => {
          const p = byId(id);
          return `
    <div class="row">
      ${IMG(p)}
      <div>
        <h4>${p.name}</h4>
        <b>${inr(p.price)}</b>
        <button class="rm" data-add="${id}">Move to cart</button>
      </div>
      <button class="rm" data-heart="${id}">Remove</button>
    </div>`;
        })
        .join("")
    : '<div class="d-empty">Nothing saved yet.<br>Tap the heart on any product.</div>';
}

function openDrawer(mode) {
  mode === "wish" ? renderWish() : renderCart();
  $("drawer").classList.add("open");
  $("shade").classList.add("on");
}

function closeAll() {
  $("drawer").classList.remove("open");
  $("shade").classList.remove("on");
  $("modal").classList.remove("on");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  save();
  renderCart();
  toast(byId(id).name + " added to cart");
}

function toggleWish(id) {
  id = +id;
  wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
  save();
  renderGrid();
  renderCart();
  if ($("drawerTitle").textContent.includes("wish")) renderWish();
}

// ========== 5. Quick view modal ==========
function quickView(id) {
  const p = byId(id);

  $("box").innerHTML = `
    <button class="x" id="mx" aria-label="Close">✕</button>
    ${IMG(p)}
    <div class="info">
      <small>${p.cat}</small>
      <h2>${p.name}</h2>
      <div class="stars">
        <b>${p.rating} ★</b>
        <span>${p.reviews.toLocaleString("en-IN")} ratings</span>
      </div>
      <div class="pr">
        <b style="font-size:1.6rem">${inr(p.price)}</b>
        <s>${inr(p.old)}</s>
        <em>${off(p)}% off</em>
      </div>
      <p>${p.desc}</p>
      <p>Free delivery above ${inr(FREE_SHIP)}. 7-day easy returns.</p>
      <button class="add" data-add="${p.id}" style="margin-top:8px;padding:14px">Add to cart</button>
      <a class="more" href="product.html?id=${p.id}">View full details →</a>
    </div>`;

  $("modal").classList.add("on");
  $("mx").onclick = closeAll;
}

// ========== 6. Events (click handling) ==========
document.addEventListener("click", (e) => {
  const t = e.target;
  const g = (a) => t.closest("[" + a + "]");

  if (g("data-heart")) {
    e.stopPropagation();
    toggleWish(g("data-heart").dataset.heart);
    return;
  }

  if (g("data-add")) {
    addToCart(g("data-add").dataset.add);
    return;
  }

  if (g("data-inc")) {
    cart[g("data-inc").dataset.inc]++;
    save();
    renderCart();
    return;
  }

  if (g("data-dec")) {
    const i = g("data-dec").dataset.dec;
    if (--cart[i] <= 0) delete cart[i];
    save();
    renderCart();
    return;
  }

  if (g("data-rm")) {
    delete cart[g("data-rm").dataset.rm];
    save();
    renderCart();
    return;
  }

  if (g("data-view")) {
    quickView(g("data-view").dataset.view);
    return;
  }

  if (g("data-c")) {
    f.cat = g("data-c").dataset.c;
    renderGrid();
    return;
  }

  if (t.classList.contains("cta")) {
    f.cat = t.dataset.cat;
    renderGrid();
    $("shop").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (t === $("modal")) closeAll();
});

$("cartBtn").onclick = () => openDrawer("cart");
$("wishBtn").onclick = () => openDrawer("wish");
$("close").onclick = $("shade").onclick = closeAll;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

// checkout page par bhejo
$("checkout").onclick = () => {
  location.href = "checkout.html";
};

$("sub").onclick = () => toast("Subscribed. Welcome to Rangrez!");

$("search").oninput = (e) => {
  f.q = e.target.value;
  renderGrid();
};

$("catSelect").onchange = (e) => {
  f.cat = e.target.value;
  renderGrid();
};

$("price").oninput = (e) => {
  f.max = +e.target.value;
  $("priceLabel").textContent = inr(f.max);
  renderGrid();
};

$("rating").onchange = (e) => {
  f.rating = +e.target.value;
  renderGrid();
};

$("sort").onchange = (e) => {
  f.sort = e.target.value;
  renderGrid();
};

$("reset").onclick = () => {
  f = { cat: "All", max: 5000, rating: 0, sort: "pop", q: "" };
  $("search").value = "";
  $("price").value = 5000;
  $("priceLabel").textContent = inr(5000);
  $("rating").value = 0;
  $("sort").value = "pop";
  renderGrid();
};

// ========== 7. Hero slider ==========
const slides = document.querySelectorAll(".slide");
let cur = 0;

$("dots").innerHTML = [...slides]
  .map((_, i) => `<button data-s="${i}" aria-label="Slide ${i + 1}"></button>`)
  .join("");

function show(i) {
  cur = i;
  slides.forEach((s, k) => s.classList.toggle("on", k === i));
  document
    .querySelectorAll("#dots button")
    .forEach((d, k) => d.classList.toggle("on", k === i));
}

$("dots").onclick = (e) => {
  if (e.target.dataset.s) show(+e.target.dataset.s);
};

setInterval(() => show((cur + 1) % slides.length), 5000);

// ========== 8. Start ==========
$("catNav").innerHTML = CATS.map(
  (c) => `<button data-c="${c}">${c}</button>`
).join("");
$("catSelect").innerHTML = CATS.map((c) => `<option>${c}</option>`).join("");

initHeader();
show(0);
renderGrid();
renderCart();
if (location.hash === "#cart") openDrawer("cart");