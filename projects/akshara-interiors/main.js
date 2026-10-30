// Akshara Interiors — vanilla JS, no dependencies. Animates transform/opacity only.
(() => {
  const d = document, root = d.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];

  // ---- preloader (short, never blocks) ----
  const finish = () => { root.classList.add("loaded"); setTimeout(() => root.classList.add("ready"), 150); };
  let done = false;
  const go = () => { if (done) return; done = true; finish(); };
  addEventListener("load", () => setTimeout(go, reduce ? 0 : 900));
  setTimeout(go, 1500);

  // ---- nav: solid on scroll, hide on scroll-down, show on scroll-up ----
  const nav = $("#nav"), toTop = $(".to-top");
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("solid", y > 40);
    nav.classList.toggle("hide", y > lastY && y > 400 && !drawer.classList.contains("open"));
    toTop.classList.toggle("show", y > 700);
    lastY = y; ticking = false;
    timeline(); parallax();
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // ---- mobile drawer ----
  const drawer = $("#drawer"), burger = $(".burger");
  const setDrawer = (o) => { drawer.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
  burger.addEventListener("click", () => setDrawer(true));
  $(".drawer-x").addEventListener("click", () => setDrawer(false));
  $$("a", drawer).forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") { setDrawer(false); closeLb(); } });
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  // ---- active link highlighting ----
  const links = $$(".nav-links a");
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) secIO.observe(s); });

  // ---- scroll reveals with stagger ----
  $$("[data-stagger]").forEach((g) => [...g.children].forEach((c, i) => (c.style.transitionDelay = i * 90 + "ms")));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$(".checks", e.target).forEach((c) => c.classList.add("in"));
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal],[data-stagger],.checks,.badge").forEach((el) => io.observe(el));
  // clipped elements can report "not intersecting" while fully clipped, so observe their parent
  const clipIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$("[data-clip]", e.target).forEach((c) => c.classList.add("in")); clipIO.unobserve(e.target);
  }), { threshold: 0.15 });
  $$("[data-clip]").forEach((c) => clipIO.observe(c.parentElement));
  $$(".script").forEach((s) => io.observe(s));

  // ---- timeline: dotted line draws + steps light up ----
  const tl = $("#timeline"), fg = $("#tl-fg"), steps = $$(".tl-step");
  function timeline() {
    if (!tl) return;
    const r = tl.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    fg.style.transform = `scaleY(${p})`;
    steps.forEach((s) => s.classList.toggle("lit", s.getBoundingClientRect().top < vh * 0.62));
  }

  // ---- light parallax on large images ----
  const par = $$(".about-media .big img, .sustain-img img");
  function parallax() {
    if (reduce) return;
    par.forEach((im) => {
      const r = im.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      im.style.transform = `translateY(${((r.top + r.height / 2 - innerHeight / 2) / innerHeight) * -24}px) scale(1.08)`;
    });
  }

  // ---- magnetic buttons + ripple ----
  $$(".btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const el = d.createElement("span"); el.className = "ripple";
      el.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      b.appendChild(el); setTimeout(() => el.remove(), 700);
    });
    if (reduce || !matchMedia("(hover:hover)").matches || !b.classList.contains("magnetic")) return;
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px,${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
    });
    b.addEventListener("mouseleave", () => (b.style.transform = ""));
  });

  // ---- portfolio filter ----
  const items = $$(".m-item");
  $$(".filters button").forEach((btn) => btn.addEventListener("click", () => {
    $$(".filters button").forEach((b) => { b.classList.toggle("on", b === btn); b.setAttribute("aria-selected", b === btn); });
    const f = btn.dataset.filter;
    items.forEach((it) => {
      const show = f === "All" || it.dataset.cat === f;
      if (show) { it.hidden = false; requestAnimationFrame(() => { it.style.opacity = 1; it.style.transform = "none"; }); }
      else { it.style.opacity = 0; it.style.transform = "scale(.92)"; setTimeout(() => { if (it.style.opacity === "0") it.hidden = true; }, 350); }
    });
  }));

  // ---- lightbox ----
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap");
  let cur = 0, vis = [];
  function openLb(i) {
    vis = items.filter((it) => !it.hidden);
    cur = vis.indexOf(items[i]); showLb();
    lb.hidden = false; requestAnimationFrame(() => lb.classList.add("open")); lb.querySelector(".lb-close").focus();
  }
  function showLb() {
    const it = vis[cur], src = $(".m-btn", it);
    const big = $("img", src);
    lbImg.innerHTML = big ? `<img src="${big.currentSrc || big.src}" alt="${big.alt}">` : $(".ph", src).outerHTML;
    lbCap.textContent = $(".cap", src).textContent;
  }
  function closeLb() { if (lb.hidden) return; lb.classList.remove("open"); setTimeout(() => (lb.hidden = true), 350); }
  $$(".m-btn").forEach((b) => b.addEventListener("click", () => openLb(+b.dataset.index)));
  $(".lb-close").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  const step = (n) => { cur = (cur + n + vis.length) % vis.length; showLb(); };
  $(".lb-next").addEventListener("click", () => step(1));
  $(".lb-prev").addEventListener("click", () => step(-1));
  addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });

  // ---- enquiry form: validation, honeypot, Formspree (or mailto fallback) ----
  const form = $("#enquiry"), msg = $(".form-msg");
  const rules = {
    name: (v) => v.trim().length >= 2 || "Please enter your name.",
    phone: (v) => /^[0-9+\-\s]{10,15}$/.test(v.trim()) || "Enter a valid phone number.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    projectType: (v) => !!v || "Choose a project type.",
    city: (v) => v.trim().length >= 2 || "Tell us your city or location.",
    message: (v) => v.trim().length >= 10 || "Please add a few details (10+ characters).",
  };
  const check = (el) => {
    const r = rules[el.name]; if (!r) return true;
    const ok = r(el.value), box = el.closest("label");
    el.classList.toggle("invalid", ok !== true);
    $(".err", box).textContent = ok === true ? "" : ok;
    return ok === true;
  };
  $$("input,select,textarea", form).forEach((el) => el.addEventListener("blur", () => check(el)));
  const started = Date.now();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg"; msg.textContent = "";
    const fields = $$("input:not([name=_gotcha]),select,textarea", form);
    const valid = fields.map(check).every(Boolean);
    if (!valid) { msg.classList.add("bad"); msg.textContent = "Please fix the highlighted fields."; return; }
    const data = new FormData(form);
    if (data.get("_gotcha") || Date.now() - started < 3000) { msg.classList.add("ok"); msg.textContent = "Thank you!"; form.reset(); return; } // bots
    const btn = $("button[type=submit]", form); btn.disabled = true;
    try {
      if (form.getAttribute("action")) {
        const res = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error();
      } else {
        const body = [...data.entries()].filter(([k]) => k !== "_gotcha").map(([k, v]) => `${k}: ${v}`).join("\n");
        location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent("Website enquiry: " + data.get("projectType"))}&body=${encodeURIComponent(body)}`;
      }
      msg.classList.add("ok"); msg.textContent = "Thank you! Your enquiry has been sent. We will get back to you shortly.";
      form.reset();
    } catch {
      msg.classList.add("bad");
      msg.textContent = "Sorry, that did not go through. Please call or WhatsApp us, or email info@aksharainteriors.com.";
    } finally { btn.disabled = false; }
  });

  onScroll();
})();
