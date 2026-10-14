// ===== Login / Signup page =====
// NOTE: Ye sirf demo hai. Users browser ke localStorage mein save hote hain.
// Asli website mein password backend + database mein hash karke rakhte hain.

// Login ke baad kis page par jaana hai (sirf apne pages allowed)
const nextPage = new URLSearchParams(location.search).get("next");
const goTo = ["index.html", "checkout.html", "product.html"].includes(nextPage)
  ? nextPage
  : "index.html";

// ---------- Tab badalna (Login <-> Sign up) ----------
function setTab(t) {
  document
    .querySelectorAll(".tab")
    .forEach((b) => b.classList.toggle("on", b.dataset.t === t));
  $("loginForm").hidden = t !== "login";
  $("signupForm").hidden = t !== "signup";
}

document
  .querySelectorAll(".tab")
  .forEach((b) => (b.onclick = () => setTab(b.dataset.t)));

document
  .querySelectorAll("[data-go]")
  .forEach((b) => (b.onclick = () => setTab(b.dataset.go)));

// ---------- Password Show / Hide ----------
document.querySelectorAll("[data-eye]").forEach(
  (b) =>
  (b.onclick = () => {
    const input = $(b.dataset.eye);
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    b.textContent = hidden ? "Hide" : "Show";
  })
);

function loggedIn(user, msg) {
  store("rg-user", user);
  toast(msg);
  setTimeout(() => (location.href = goTo), 900);
}

// ---------- Login ----------
$("loginForm").onsubmit = (e) => {
  e.preventDefault();

  const email = $("lEmail").value.trim().toLowerCase();
  const pass = $("lPass").value;

  const a = setErr("lEmail", emailOk(email) ? "" : "Enter a valid email address");
  const b = setErr("lPass", pass ? "" : "Enter your password");
  if (!(a && b)) return;

  const u = load("rg-users", []).find(
    (x) => x.email === email && x.password === pass
  );
  if (!u) {
    return setErr(
      "lPass",
      "Wrong email or password. New here? Create an account first."
    );
  }

  loggedIn(
    { name: u.name, email: u.email, phone: u.phone },
    "Welcome back, " + u.name.split(" ")[0]
  );
};

// ---------- Sign up ----------
$("signupForm").onsubmit = (e) => {
  e.preventDefault();

  const name = $("sName").value.trim();
  const email = $("sEmail").value.trim().toLowerCase();
  const phone = $("sPhone").value.trim();
  const pass = $("sPass").value;
  const users = load("rg-users", []);

  const ok = [
    setErr("sName", name.length >= 2 ? "" : "Enter your full name"),
    setErr(
      "sEmail",
      !emailOk(email)
        ? "Enter a valid email address"
        : users.some((x) => x.email === email)
          ? "This email is already registered. Please login."
          : ""
    ),
    setErr(
      "sPhone",
      /^[6-9]\d{9}$/.test(phone) ? "" : "Enter a valid 10-digit mobile number"
    ),
    setErr(
      "sPass",
      pass.length >= 6 ? "" : "Password must be at least 6 characters"
    ),
    setErr("sPass2", $("sPass2").value === pass ? "" : "Passwords do not match"),
    setErr(
      "sTerms",
      $("sTerms").checked ? "" : "Please accept the terms to continue"
    ),
  ];
  if (ok.includes(false)) return;

  users.push({ name, email, phone, password: pass });
  store("rg-users", users);

  loggedIn(
    { name, email, phone },
    "Account created. Welcome, " + name.split(" ")[0] + "!"
  );
};

// ---------- Agar pehle se login hai to welcome card dikhao ----------
function showWelcome() {
  const u = load("rg-user", null);

  $("authBox").hidden = !!u;
  $("welcome").hidden = !u;
  initHeader();
  if (!u) return;

  $("wName").textContent = u.name;
  $("wMail").textContent = u.email;

  const orders = load("rg-orders", []).slice(0, 3);
  $("orders").innerHTML = orders.length
    ? orders
      .map(
        (o) => `
    <div class="order">
      <span>#${o.id}<br><small class="muted">${o.date}</small></span>
      <b>${inr(o.total)}</b>
    </div>`
      )
      .join("")
    : '<p class="muted" style="padding:10px 0">No orders yet.</p>';
}

// ---------- Logout ----------
$("logout").onclick = () => {
  try {
    localStorage.removeItem("rg-user");
  } catch (e) { }
  showWelcome();
  toast("Logged out");
};

showWelcome();