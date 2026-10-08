(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function applySite(site) {
    const map = Object.fromEntries((site || []).map(x => [x.key, x.value]));
    $$("[data-site]").forEach(el => {
      const key = el.dataset.site;
      if (map[key] !== undefined) {
        if (el.matches("input,textarea")) el.value = map[key];
        else el.innerHTML = map[key];
      }
    });
    document.title = map.site_title || document.title;
    return map;
  }

  function reveal() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(x => x.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    }), {threshold:.12});
    $$(".reveal").forEach(x => io.observe(x));
  }

  function setupNav() {
    const toggle = $(".nav-toggle"), menu = $(".nav-links");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", menu.classList.contains("open"));
    });
  }

  function setupCursorGlow() {
    const glow = $(".cursor-glow");
    if (!glow || matchMedia("(pointer:coarse)").matches) return;
    window.addEventListener("pointermove", e => {
      glow.style.transform = `translate3d(${e.clientX-160}px,${e.clientY-160}px,0)`;
    });
  }

  function ticker(items) {
    const rail = $("#market-ticker");
    if (!rail) return;
    rail.innerHTML = (items || []).map(x =>
      `<span class="ticker-item"><b>${esc(x.label)}</b><strong>${esc(x.value)}</strong><em class="${x.change_type === "negative" ? "negative":""}">${esc(x.change)}</em></span>`
    ).join("");
  }

  function requiredSheets(page) {
    const common = ["Site", "Ticker"];
    const byPage = {
      home: [],
      funds: ["Funds"],
      compare: ["FundCompare", "RouteCompare"],
      "gift-city": ["Benefits"],
      how: ["Presentations"],
      about: ["FAQ"]
    };
    return [...new Set([...common, ...(byPage[page] || [])])];
  }

  function showSheetWarnings(errors) {
    const names = Object.keys(errors || {});
    if (!names.length) return;

    const existing = $("#gci-data-status");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "gci-data-status";
    box.setAttribute("role", "status");
    box.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;padding:14px 18px;background:#111827;color:#fff;border:1px solid rgba(255,255,255,.2);font:500 13px/1.5 Inter,Arial,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.2);";
    box.innerHTML = `Some website data could not be loaded. Affected Google Sheet tab(s): <strong>${esc(names.join(", "))}</strong>. Other available data is still being shown. <button type="button" style="float:right;background:transparent;border:0;color:inherit;font-size:18px;cursor:pointer" aria-label="Dismiss">×</button>`;
    box.querySelector("button").addEventListener("click", () => box.remove());
    document.body.appendChild(box);
  }

  async function boot() {
    setupNav();
    setupCursorGlow();
    reveal();

    const page = document.body.dataset.page || "home";
    const needed = requiredSheets(page);

    try {
      const data = await GCI_SHEETS.loadAll(needed);
      const site = applySite(data.Site || []);
      ticker(data.Ticker || []);
      document.body.classList.add("data-ready");
      if (Object.keys(window.GCI_SHEET_ERRORS || {}).length) {
        document.body.classList.add("data-partial");
        showSheetWarnings(window.GCI_SHEET_ERRORS);
      }
      window.GCI_DATA = data;
      if (window.renderPage) window.renderPage({page, data, site, esc});
    } catch (err) {
      console.error("[GCI] Data boot failed", err);
      document.body.classList.add("data-fallback");
      if (window.renderPage) window.renderPage({page, data:{}, site:{}, esc});
    }

    reveal();
  }

  boot();
})();