/* ==========================================================
   Sentra Cendekia — Static Landing Page Script
   Konfigurasi: isi API_URL (contoh "https://domain-anda.com") agar konten
   diambil live dari backend & formulir tersimpan ke database.
   Kosongkan ("") untuk memakai data statis dari data.js.
   ========================================================== */
const API_URL = "";

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
const waLink = (number, msg = "") => `https://wa.me/${String(number || "").replace(/\D/g, "")}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;

const ICONS = {
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  school: '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
  graduation: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  calculator: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  pen: '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
};
const svg = (paths, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24">${paths}</svg>`;
const CHECK = '<path d="M20 6 9 17l-5-5"/>';
const CAP = ICONS.graduation;
const CHEVRON = '<path d="m6 9 6 6 6-6"/>';

let DATA = window.SC_DATA;
let currentLevel = "smp";

/* ---------- Render ---------- */
function renderSettings(s) {
  $$("#nav-logo, #footer-logo").forEach((el) => { el.src = s.logo_url; el.alt = s.brand_name; });
  $("#hero-badge span:last-child").textContent = s.hero_badge;
  $("#hero-title").innerHTML = (s.hero_title || "").split("\n").filter(Boolean)
    .map((l, i) => `<span class="mask-line"><span style="--d:${0.4 + i * 0.13}s">${esc(l)}</span></span>`).join("");
  $("#hero-subtitle").textContent = s.hero_subtitle;
  $("#hero-cta").textContent = s.hero_cta;
  $("#hero-image").src = s.hero_image;

  $("#about-eyebrow").textContent = s.about_eyebrow;
  $("#about-title").innerHTML = (s.about_title || "").split("\n").map((t) => `<span style="display:block">${esc(t)}</span>`).join("");
  $("#about-desc").textContent = s.about_description;
  $("#about-image").src = s.about_image;
  $("#about-points").innerHTML = (s.about_points || []).map((p, i) => `
    <li class="about__point reveal" style="--d:${i * 0.1}s">
      <span class="about__point-num">0${i + 1}</span>
      <div><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div>
    </li>`).join("");

  $$(".wa-link").forEach((a) => (a.href = waLink(s.whatsapp, s.whatsapp_message)));
  $("#footer-text").textContent = s.footer_text;
  $("#footer-tagline").textContent = `“${s.tagline}”`;
  $("#footer-wa").textContent = `+${s.whatsapp}`;
  $("#footer-email").href = `mailto:${s.email}`;
  $("#footer-email span").textContent = s.email;
  $("#footer-ig").textContent = s.instagram;
  $("#footer-address").textContent = s.address;
  $("#footer-brand").textContent = s.brand_name;
  $("#footer-copyright").textContent = s.footer_copyright;
  $("#year").textContent = new Date().getFullYear();
}

function renderPrograms(programs) {
  $("#programs-grid").innerHTML = programs.map((p, i) => {
    const big = i % 4 === 2;
    return `
    <div class="reveal" style="--d:${i * 0.1}s">
      <article class="program-card ${big ? "program-card--big" : ""}">
        <div class="program-card__blob"></div>
        <div class="program-card__body">
          <div class="program-card__top">
            <span class="program-card__icon">${svg(ICONS[p.icon] || ICONS.book)}</span>
            <span class="eyebrow program-card__num">0${i + 1}</span>
          </div>
          <h3>${esc(p.title)}</h3>
          <p class="program-card__desc">${esc(p.description)}</p>
          <div class="program-card__tags">${(p.subjects || []).map((s) => `<span>${esc(s)}</span>`).join("")}</div>
          <span class="program-card__level">${esc(p.level)}</span>
        </div>
      </article>
    </div>`;
  }).join("");
}

function renderTutors(tutors) {
  $("#tutors-grid").innerHTML = tutors.map((t, i) => `
    <div class="reveal" style="--d:${i * 0.12}s">
      <article class="tutor-card">
        <div class="tutor-card__photo">
          <img src="${esc(t.photo)}" alt="${esc(t.name)}" loading="lazy" />
          <span class="tutor-card__subject">${esc(t.subject)}</span>
        </div>
        <div class="tutor-card__body">
          <h3>${esc(t.name)}</h3>
          <p class="tutor-card__edu">${svg(CAP)} ${esc(t.education)}</p>
          <p class="tutor-card__bio">${esc(t.bio)}</p>
          <div class="tutor-card__line"></div>
          <p class="tutor-card__note">${svg(ICONS.book)} Tutor privat tersertifikasi</p>
        </div>
      </article>
    </div>`).join("");
}

const getPrice = (pkg, level) => pkg[`price_${level}`] || pkg.price || 0;

function renderPackages(packages, s) {
  $("#packages-grid").innerHTML = packages.map((p, i) => `
    <div class="reveal ${p.popular ? "is-popular" : ""}" style="--d:${i * 0.1}s">
      <article class="package-card ${p.popular ? "package-card--popular" : ""}" data-index="${i}">
        ${p.popular ? `<span class="package-card__badge">${svg(ICONS.star)} Terpopuler</span>` : ""}
        <p class="eyebrow package-card__name">${esc(p.name)}</p>
        <div class="package-card__sessions">
          <strong>${p.sessions}</strong>
          <small>x pertemuan<br>${esc(p.duration)}</small>
        </div>
        <p class="package-card__price"></p>
        <p class="package-card__per"></p>
        <p class="package-card__desc">${esc(p.description)}</p>
        <ul class="package-card__features">
          ${(p.features || []).map((f) => `<li><span class="package-card__check">${svg(CHECK)}</span><span>${esc(f)}</span></li>`).join("")}
        </ul>
        <a class="package-card__cta" target="_blank" rel="noreferrer"><span class="btn">Pilih Paket Ini</span></a>
      </article>
    </div>`).join("");
  updatePrices(packages, s, false);
}

function updatePrices(packages, s, animate = true) {
  $$(".package-card").forEach((card) => {
    const p = packages[+card.dataset.index];
    const price = getPrice(p, currentLevel);
    const apply = () => {
      $(".package-card__price", card).textContent = rupiah(price);
      $(".package-card__per", card).textContent = `${rupiah(Math.round(price / (p.sessions || 1)))} / pertemuan`;
      $(".package-card__cta", card).href = waLink(s.whatsapp, `Halo Sentra Cendekia, saya tertarik dengan ${p.name} (${p.sessions}x pertemuan) untuk jenjang ${currentLevel.toUpperCase()}.`);
      card.classList.remove("is-switching");
    };
    if (!animate) return apply();
    card.classList.add("is-switching");
    setTimeout(apply, 250);
  });
}

function renderFaqs(faqs) {
  $("#faq-list").innerHTML = faqs.map((f, i) => `
    <div class="faq__item">
      <button class="faq__q" type="button" aria-expanded="false">
        <span class="faq__q-inner"><span class="faq__num">0${i + 1}</span>${esc(f.question)}</span>
        ${svg(CHEVRON, "icon faq__chev")}
      </button>
      <div class="faq__a"><div>${esc(f.answer)}</div></div>
    </div>`).join("");
}

function renderFormOptions(programs, packages) {
  $("#form-program").insertAdjacentHTML("beforeend", programs.map((p) => `<option>${esc(p.title)}</option>`).join(""));
  $("#form-package").insertAdjacentHTML("beforeend", packages.map((p) => `<option value="${esc(p.name)} ${p.sessions}x">${esc(p.name)} — ${p.sessions}x pertemuan</option>`).join(""));
}

/* ---------- Interactions ---------- */
function initNavbar() {
  const nav = $("#navbar");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  $("#nav-toggle").addEventListener("click", () => nav.classList.toggle("is-open"));
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-scroll]");
    if (!link) return;
    e.preventDefault();
    nav.classList.remove("is-open");
    const target = document.getElementById(link.dataset.scroll);
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  });
}

function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { rootMargin: "-60px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
}

function initHeroTilt() {
  const hero = $("#home"), card = $("#hero-card");
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateX(${-y * 16}deg) rotateY(${x * 20}deg)`;
  });
  hero.addEventListener("mouseleave", () => (card.style.transform = "rotateX(0) rotateY(0)"));
}

function initParallax() {
  const img = $("#about-image"), sec = $("#tentang");
  const tick = () => {
    const r = sec.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
    img.style.transform = `scale(1.15) translateY(${60 - progress * 120}px)`;
  };
  window.addEventListener("scroll", tick, { passive: true });
  tick();
}

function initLevelTabs() {
  $("#level-selector").addEventListener("click", (e) => {
    const btn = e.target.closest(".level-tab");
    if (!btn || btn.dataset.level === currentLevel) return;
    currentLevel = btn.dataset.level;
    $$(".level-tab").forEach((b) => b.classList.toggle("is-active", b === btn));
    updatePrices(DATA.packages, DATA.settings);
  });
}

function initFaq() {
  $("#faq-list").addEventListener("click", (e) => {
    const q = e.target.closest(".faq__q");
    if (!q) return;
    const item = q.parentElement, open = item.classList.contains("is-open");
    $$(".faq__item.is-open").forEach((it) => { it.classList.remove("is-open"); $(".faq__a", it).style.maxHeight = 0; $(".faq__q", it).setAttribute("aria-expanded", "false"); });
    if (!open) {
      item.classList.add("is-open");
      const a = $(".faq__a", item);
      a.style.maxHeight = a.scrollHeight + 32 + "px";
      q.setAttribute("aria-expanded", "true");
    }
  });
}

let toastTimer;
function toast(msg, isError = false) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.toggle("is-error", isError);
  el.classList.remove("is-show");
  void el.offsetWidth;
  el.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-show"), 3500);
}

function initForm() {
  const form = $("#register-form"), btn = $("#register-submit");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const waMsg = `Halo Sentra Cendekia, saya ${data.name} ingin mendaftar les privat ${data.level ? `jenjang ${data.level}` : ""} ${data.program ? `program ${data.program}` : ""} ${data.package ? `paket ${data.package}` : ""}. ${data.message}`.replace(/\s+/g, " ").trim();

    if (API_URL) {
      btn.disabled = true;
      $("span", btn).textContent = "Mengirim...";
      try {
        const res = await fetch(`${API_URL}/api/registrations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error((await res.json()).detail || "Gagal mengirim");
        toast("Pendaftaran terkirim! Tim kami akan menghubungi Anda.");
      } catch (err) {
        toast(typeof err.message === "string" ? err.message : "Terjadi kesalahan. Coba lagi.", true);
        btn.disabled = false;
        $("span", btn).textContent = "Kirim Pendaftaran";
        return;
      }
    } else {
      toast("Mengarahkan ke WhatsApp...");
      window.open(waLink(DATA.settings.whatsapp, waMsg), "_blank");
    }

    $("#success-name").textContent = data.name;
    $("#success-wa").href = waLink(DATA.settings.whatsapp, waMsg);
    form.hidden = true;
    $("#register-success").hidden = false;
  });
}

/* ---------- Boot ---------- */
async function loadData() {
  if (!API_URL) return;
  try {
    const res = await fetch(`${API_URL}/api/content`);
    if (res.ok) DATA = await res.json();
  } catch (_) { /* fallback ke data.js */ }
}

(async function init() {
  await loadData();
  renderSettings(DATA.settings);
  renderPrograms(DATA.programs);
  renderTutors(DATA.tutors);
  renderPackages(DATA.packages, DATA.settings);
  renderFaqs(DATA.faqs);
  renderFormOptions(DATA.programs, DATA.packages);
  initNavbar();
  initReveal();
  initHeroTilt();
  initParallax();
  initLevelTabs();
  initFaq();
  initForm();
})();
