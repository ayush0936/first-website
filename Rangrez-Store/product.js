// ===== Product detail page =====
// URL se product ki id milti hai: product.html?id=3
const p = byId(new URLSearchParams(location.search).get("id"));
const app = $("app");
initHeader();

if (!p) {
  app.innerHTML = `
    <div class="panel center">
      <h2 style="justify-content:center">Product not found</h2>
      <p class="muted" style="margin:10px 0 20px">This product does not exist.</p>
      <a class="btn" href="index.html">Back to shop</a>
    </div>`;
} else {
  document.title = p.name + " – Rangrez";

  // Size sirf sneakers aur hoodie ke liye
  const sizes = /Sneakers/.test(p.name)
    ? ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]
    : /Hoodie/.test(p.name)
      ? ["S", "M", "L", "XL"]
      : [];

  const HL = {
    Fashion: [
      "Premium everyday quality",
      "Easy 7-day returns",
      "Free delivery above ₹1,999",
    ],
    Electronics: [
      "Brand warranty included",
      "Easy 7-day returns",
      "Free delivery above ₹1,999",
    ],
    Accessories: [
      "Gift-ready packaging",
      "Quality checked before dispatch",
      "Easy 7-day returns",
    ],
    Home: [
      "Durable, long-lasting build",
      "Easy to clean and maintain",
      "Easy 7-day returns",
    ],
  };

  let size = "";
  let qty = 1;

  const related = PRODUCTS.filter(
    (x) => x.cat === p.cat && x.id !== p.id
  ).slice(0, 4);

  // ---------- Page ka HTML ----------
  app.innerHTML = `
    <div class="crumbs">
      <a href="index.html">Home</a> / <a href="index.html">${p.cat}</a> / ${p.name}
    </div>

    <div class="pd">
      <div class="zoom" id="zoom">${IMG(p)}</div>

      <div>
        <small class="muted">${p.cat} · by Rangrez</small>
        <h1>${p.name}</h1>

        <div class="stars">
          <b>${p.rating} ★</b>
          <span>${p.reviews.toLocaleString("en-IN")} ratings</span>
        </div>

        <div class="pr" style="margin-top:14px">
          <b>${inr(p.price)}</b>
          <s>${inr(p.old)}</s>
          <em>${off(p)}% off</em>
        </div>
        <div class="save">You save ${inr(p.old - p.price)} · inclusive of all taxes</div>

        ${
          sizes.length
            ? `<div class="opt">
                <b>Select size</b>
                <div class="sizes" id="sizes">
                  ${sizes
                    .map((s) => `<button type="button" data-s="${s}">${s}</button>`)
                    .join("")}
                </div>
              </div>`
            : ""
        }

        <div class="opt">
          <b>Quantity</b>
          <div class="qty">
            <button id="qm" aria-label="Decrease">−</button>
            <span id="qv">1</span>
            <button id="qp" aria-label="Increase">+</button>
          </div>
        </div>

        <div class="btns">
          <button class="btn" id="addBtn">Add to cart</button>
          <button class="btn ghost" id="buyBtn">Buy now</button>
        </div>
        <button class="btn ghost full" id="wishB"></button>

        <div class="opt">
          <b>Check delivery</b>
          <div class="pin">
            <input id="pin" maxlength="6" inputmode="numeric" placeholder="Enter 6-digit pincode">
            <button id="pinBtn">Check</button>
          </div>
          <div id="pinMsg"></div>
        </div>

        <ul class="hl">
          ${HL[p.cat].map((h) => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="tabs2">
      <button data-t="desc" class="on">Description</button>
      <button data-t="spec">Specifications</button>
      <button data-t="rev">Reviews</button>
    </div>
    <div id="tabBody"></div>

    ${
      related.length
        ? `<h2 class="sec">You may also like</h2>
           <div class="rel">
             ${related
               .map(
                 (r) => `
               <a class="card" href="product.html?id=${r.id}">
                 <div class="media">${IMG(r)}<span class="badge">${off(r)}% OFF</span></div>
                 <div class="body">
                   <small>${r.cat}</small>
                   <h3>${r.name}</h3>
                   <div class="pr"><b>${inr(r.price)}</b><s>${inr(r.old)}</s></div>
                 </div>
               </a>`
               )
               .join("")}
           </div>`
        : ""
    }`;

  // ---------- Image zoom (mouse ke saath) ----------
  const z = $("zoom");
  const img = z.querySelector("img");

  z.onmousemove = (e) => {
    const r = z.getBoundingClientRect();
    img.style.transformOrigin =
      ((e.clientX - r.left) / r.width) * 100 +
      "% " +
      ((e.clientY - r.top) / r.height) * 100 +
      "%";
    img.style.transform = "scale(1.8)";
  };

  z.onmouseleave = () => {
    img.style.transform = "";
  };

  // ---------- Size aur quantity ----------
  document.querySelectorAll("#sizes button").forEach(
    (b) =>
      (b.onclick = () => {
        size = b.dataset.s;
        document
          .querySelectorAll("#sizes button")
          .forEach((x) => x.classList.toggle("on", x === b));
      })
  );

  $("qm").onclick = () => {
    qty = Math.max(1, qty - 1);
    $("qv").textContent = qty;
  };

  $("qp").onclick = () => {
    qty = Math.min(10, qty + 1);
    $("qv").textContent = qty;
  };

  // ---------- Cart mein daalna ----------
  function add() {
    if (sizes.length && !size) {
      toast("Please select a size");
      return false;
    }

    const c = load("rg-cart", {});
    c[p.id] = (c[p.id] || 0) + qty;
    store("rg-cart", c);
    initHeader();
    return true;
  }

  $("addBtn").onclick = () => {
    if (add()) toast(p.name + " added to cart");
  };

  $("buyBtn").onclick = () => {
    if (add()) location.href = "checkout.html";
  };

  // ---------- Wishlist ----------
  function paintWish() {
    $("wishB").textContent = load("rg-wish", []).includes(p.id)
      ? "♥ Saved to wishlist"
      : "♡ Add to wishlist";
  }

  $("wishB").onclick = () => {
    let w = load("rg-wish", []);
    w = w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id];
    store("rg-wish", w);
    paintWish();
  };

  paintWish();

  // ---------- Pincode se delivery date ----------
  $("pinBtn").onclick = () => {
    const m = $("pinMsg");
    const pin = $("pin").value.trim();

    if (!/^[1-9]\d{5}$/.test(pin)) {
      m.className = "no";
      m.textContent = "Please enter a valid 6-digit pincode.";
      return;
    }

    const d = new Date(Date.now() + 4 * 864e5).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    m.className = "ok";
    m.textContent = "Delivery by " + d + " · Cash on delivery available";
  };

  // ---------- Tabs: Description / Specs / Reviews ----------
  const REVIEWS = [
    { n: "Rohit S.", r: 5, t: "Looks even better in person. Worth the price." },
    {
      n: "Priya M.",
      r: 4,
      t: "Good quality and quick delivery. Packaging was neat.",
    },
    { n: "Aman K.", r: 4, t: "Does what it says. Would recommend to friends." },
  ];

  const TABS = {
    desc: () => `
      <div class="panel">
        <p>${p.desc}</p>
        <p class="muted" style="margin-top:10px">
          Every Rangrez product is quality checked before dispatch and covered by our 7-day easy return policy.
        </p>
      </div>`,

    spec: () => `
      <table class="spec">
        ${[
          ["Brand", "Rangrez"],
          ["Category", p.cat],
          ["Model no.", "RG-" + (1000 + p.id)],
          ["Warranty", p.cat === "Electronics" ? "1 year" : "6 months"],
          ["Returns", "7 days"],
          ["Delivery", "3–5 working days"],
          ["Payment", "UPI, Cards, Cash on delivery"],
        ]
          .map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`)
          .join("")}
      </table>`,

    rev: () =>
      REVIEWS.map(
        (v) => `
      <div class="rev">
        <b>${v.n}</b>
        <span class="stars" style="display:inline"><b>${v.r} ★</b></span>
        <p>${v.t}</p>
      </div>`
      ).join(""),
  };

  function tab(t) {
    document
      .querySelectorAll(".tabs2 button")
      .forEach((b) => b.classList.toggle("on", b.dataset.t === t));
    $("tabBody").innerHTML = TABS[t]();
  }

  document
    .querySelectorAll(".tabs2 button")
    .forEach((b) => (b.onclick = () => tab(b.dataset.t)));

  tab("desc");
}