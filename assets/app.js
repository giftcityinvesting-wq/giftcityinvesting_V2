(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function applySite(site) {
    const map = Object.fromEntries(site.map(x => [x.key, x.value]));
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
    rail.innerHTML = items.map(x => `<span class="ticker-item"><b>${esc(x.label)}</b><strong>${esc(x.value)}</strong><em class="${x.change_type === "negative" ? "negative":""}">${esc(x.change)}</em></span>`).join("");
  }

  async function boot() {
    setupNav(); setupCursorGlow(); reveal();
    const page = document.body.dataset.page || "home";
    const needed = ["Site","Ticker","Funds","FundCompare","Benefits","RouteCompare","FAQ","Presentations"];
    try {
      const data = await GCI_SHEETS.loadAll(needed);
      const site = applySite(data.Site || []);
      ticker(data.Ticker || []);
      document.body.classList.add("data-ready");
      window.GCI_DATA = data;

      if (window.renderPage) window.renderPage({page, data, site, esc});
    } catch (err) {
      console.warn(err);
      document.body.classList.add("data-fallback");
      if (window.renderPage) window.renderPage({page, data:{}, site:{}, esc});
    }
    reveal();
  }
  boot();
})();
