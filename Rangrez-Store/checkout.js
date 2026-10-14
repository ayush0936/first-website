// ===== Checkout page: address + payment =====
// NOTE: Demo only. Card ki details kahin save nahi hoti aur koi real payment nahi hota.
initHeader();

let cart = load("rg-cart", {});
const ids = Object.keys(cart).filter((id) => byId(id));
let couponOn = false;
const v = (id) => $(id).value.trim();

// ---------- Cart khaali ho to message ----------
if (!ids.length) {
  $("empty").hidden = false;
} else {
  $("checkout").hidden = false;
  start();
}

function totals() {
  const sub = ids.reduce((s, id) => s + byId(id).price * cart[id], 0);
  const disc = couponOn ? Math.round(sub * 0.1) : 0; // RANG10 = 10% off
  const fee = sub >= FREE_SHIP ? 0 : 99; // free delivery above 1999
  return { sub, disc, fee, total: sub - disc + fee };
}

// ---------- Order summary dikhana ----------
function renderSummary() {
  const t = totals();

  $("sumItems").innerHTML = ids
    .map((id) => {
      const p = byId(id);
      return `
    <div class="sitem">
      ${IMG(p)}
      <div><b>${p.name}</b><br><span class="muted">Qty ${cart[id]}</span></div>
      <b>${inr(p.price * cart[id])}</b>
    </div>`;
    })
    .join("");

  $("sumRows").innerHTML =
    `<div class="srow"><span>Subtotal</span><span>${inr(t.sub)}</span></div>` +
    (t.disc
      ? `<div class="srow ok"><span>Coupon RANG10</span><span>− ${inr(t.disc)}</span></div>`
      : "") +
    `<div class="srow"><span>Delivery</span><span>${t.fee ? inr(t.fee) : "FREE"}</span></div>` +
    `<div class="srow t"><span>Total</span><span>${inr(t.total)}</span></div>`;

  const pay = document.querySelector("input[name=pay]:checked").value;
  $("payBtn").textContent =
    pay === "cod" ? "Place order · " + inr(t.total) : "Pay " + inr(t.total);
}

function start() {
  // Login hai to naam, email, phone pehle se bhar do
  const u = load("rg-user", null);
  if (u) {
    $("cName").value = u.name || "";
    $("cEmail").value = u.email || "";
    $("cPhone").value = u.phone || "";
  } else {
    $("loginNote").hidden = false;
  }

  // Coupon
  $("applyBtn").onclick = () => {
    const ok = $("coupon").value.trim().toUpperCase() === "RANG10";
    couponOn = ok;
    $("couponMsg").textContent = ok
      ? "Coupon applied. You get 10% off."
      : "Invalid coupon code.";
    $("couponMsg").className = ok ? "ok" : "no";
    renderSummary();
  };

  // Payment method badalne par sahi form dikhao
  document.querySelectorAll("input[name=pay]").forEach(
    (r) =>
    (r.onchange = () => {
      ["upi", "card", "cod"].forEach(
        (m) => ($("p-" + m).hidden = r.value !== m)
      );
      renderSummary();
    })
  );

  // Input formatting: sirf numbers, card mein spaces, expiry mein /
  $("cPhone").oninput =
    $("cPin").oninput =
    $("kCvv").oninput =
    (e) => (e.target.value = e.target.value.replace(/\D/g, ""));

  $("kNum").oninput = (e) =>
  (e.target.value = e.target.value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim());

  $("kExp").oninput = (e) => {
    let d = e.target.value.replace(/\D/g, "").slice(0, 4);
    e.target.value = d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  $("coForm").onsubmit = submit;
  renderSummary();
}

// ---------- Card validation ----------
// Card number sahi hai ya nahi (Luhn check)
function luhn(num) {
  let sum = 0;
  let alt = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let n = +num[i];
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }

  return sum % 10 === 0;
}

function expiryOk(s) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(s)) return false;

  const now = new Date();
  const y = 2000 + +s.slice(3);
  const m = +s.slice(0, 2);

  return (
    y > now.getFullYear() || (y === now.getFullYear() && m >= now.getMonth() + 1)
  );
}

// ---------- Order place karna ----------
function submit(e) {
  e.preventDefault();

  const pay = document.querySelector("input[name=pay]:checked").value;

  const checks = [
    setErr("cName", v("cName").length >= 2 ? "" : "Enter your full name"),
    setErr(
      "cPhone",
      /^[6-9]\d{9}$/.test(v("cPhone"))
        ? ""
        : "Enter a valid 10-digit mobile number"
    ),
    setErr("cEmail", emailOk(v("cEmail")) ? "" : "Enter a valid email address"),
    setErr(
      "cAddr",
      v("cAddr").length >= 10
        ? ""
        : "Enter your full address (house no, street, area)"
    ),
    setErr(
      "cPin",
      /^[1-9]\d{5}$/.test(v("cPin")) ? "" : "Enter a valid 6-digit pincode"
    ),
    setErr("cCity", v("cCity").length >= 2 ? "" : "Enter your city"),
    setErr("cState", v("cState") ? "" : "Select your state"),
  ];

  if (pay === "upi") {
    checks.push(
      setErr(
        "uUpi",
        /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v("uUpi"))
          ? ""
          : "Enter a valid UPI ID like name@bank"
      )
    );
  }

  if (pay === "card") {
    const num = v("kNum").replace(/\s/g, "");
    checks.push(
      setErr(
        "kNum",
        num.length === 16 && luhn(num)
          ? ""
          : "Enter a valid 16-digit card number"
      ),
      setErr("kName", v("kName").length >= 2 ? "" : "Enter the name on your card"),
      setErr("kExp", expiryOk(v("kExp")) ? "" : "Enter a valid expiry date"),
      setErr("kCvv", /^\d{3}$/.test(v("kCvv")) ? "" : "Enter the 3-digit CVV")
    );
  }

  if (checks.includes(false)) {
    const bad = document.querySelector(".field.bad");
    if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Sab sahi hai: order save karo, cart khaali karo (card details save NAHI hoti)
  const t = totals();
  const order = {
    id: "RG" + Date.now().toString().slice(-8),
    date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    total: t.total,
    city: v("cCity"),
    pay,
    items: ids.map((id) => ({ name: byId(id).name, qty: cart[id] })),
  };

  const orders = load("rg-orders", []);
  orders.unshift(order);
  store("rg-orders", orders);
  store("rg-cart", {});
  initHeader();

  const eta = new Date(Date.now() + 4 * 864e5).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const payText = { upi: "UPI", card: "Card", cod: "Cash on delivery" }[pay];

  $("okLine").textContent =
    "Thank you, " +
    v("cName").split(" ")[0] +
    ". A confirmation will be sent to " +
    v("cEmail") +
    ".";

  $("okBox").innerHTML =
    `<div class="srow"><span>Order ID</span><b>#${order.id}</b></div>` +
    `<div class="srow"><span>Amount</span><b>${inr(t.total)}</b></div>` +
    `<div class="srow"><span>Payment</span><b>${payText}</b></div>` +
    `<div class="srow"><span>Delivery to</span><b>${order.city}</b></div>` +
    `<div class="srow"><span>Expected by</span><b>${eta}</b></div>`;

  $("checkout").hidden = true;
  $("success").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}