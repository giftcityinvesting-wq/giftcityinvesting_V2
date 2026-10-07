window.renderPage = ({page,data,site,esc}) => {
  const root = document.querySelector("#page-content");
  if (!root) return;

  if (page === "funds") {
    const funds = data.Funds || [];
    root.innerHTML = `
      <div class="page-hero reveal"><div class="container">
        <div class="eyebrow">GIFT CITY • FUNDS</div>
        <h1>Global strategies,<br><i>inside your reach.</i></h1>
        <p>Explore selected GIFT City investment routes and global strategies. Figures below are editable from Google Sheets.</p>
      </div></div>
      <section class="section"><div class="container"><div class="fund-grid">
        ${funds.map((f,i)=>`<article class="fund-card reveal">
          <div class="card-number">0${i+1}</div><h3>${esc(f.name)}</h3><p>${esc(f.description)}</p>
          <div class="fund-meta"><span class="pill">${esc(f.category)}</span><span class="pill">${esc(f.status)}</span></div>
          <div class="fund-stats">
            <div class="stat"><small>AUM</small><b>${esc(f.aum)}</b></div>
            <div class="stat"><small>Minimum</small><b>${esc(f.min_investment)}</b></div>
            <div class="stat"><small>1Y</small><b>${esc(f.return_1y)}</b></div>
            <div class="stat"><small>3Y</small><b>${esc(f.return_3y)}</b></div>
          </div>
          <p class="small">Benchmark: ${esc(f.benchmark)} · Expense: ${esc(f.expense_ratio)} · Launch: ${esc(f.launch_date)}</p>
        </article>`).join("")}
      </div></div></section>
      <section class="section dark"><div class="container">
        <div class="section-head"><div><div class="eyebrow">DISCLOSURE</div><h2>Data that stays<br>easy to update.</h2></div><p>Fund figures are intentionally separated from the design. Change the Google Sheet and the public cards update automatically after the cache window.</p></div>
        <div class="notice">Investment data, tax treatment and regulatory statements should be verified against current official sources before publication.</div>
      </div></section>`;
  }

  if (page === "compare") {
    const rows = data.FundCompare || [];
    const routes = data.RouteCompare || [];
    root.innerHTML = `
      <div class="page-hero"><div class="container"><div class="eyebrow">COMPARE</div><h1>See the difference<br><i>at a glance.</i></h1><p>Interactive comparison tables built from Google Sheets. You can add, remove or reorder rows without editing HTML.</p></div></div>
      <section class="section dark"><div class="container"><div class="section-head"><div><div class="eyebrow">FUNDS</div><h2>Fund comparison</h2></div><p>Source data is maintained in the FundCompare tab.</p></div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Parameter</th><th>DSP Global Equity</th><th>Marcellus Global Compounder</th><th>Direct Equity</th><th>Notes</th></tr></thead><tbody>
      ${rows.map(r=>`<tr><th>${esc(r.parameter)}</th><td>${esc(r.dsp)}</td><td>${esc(r.marcellus)}</td><td>${esc(r.direct)}</td><td>${esc(r.note)}</td></tr>`).join("")}
      </tbody></table></div></div></section>
      <section class="section"><div class="container"><div class="section-head"><div><div class="eyebrow">ROUTES</div><h2>GIFT City vs alternatives</h2></div><p>Keep the explanatory comparison current without touching code.</p></div>
      <div class="table-wrap light-table"><table class="data-table light-table"><thead><tr><th>Parameter</th><th>Traditional</th><th>GIFT City</th><th>Benefit</th></tr></thead><tbody>
      ${routes.map(r=>`<tr><th>${esc(r.parameter)}</th><td>${esc(r.traditional)}</td><td>${esc(r.gift_city)}</td><td>${esc(r.benefit)}</td></tr>`).join("")}
      </tbody></table></div></div></section>`;
  }

  if (page === "gift-city") {
    const benefits = data.Benefits || [];
    root.innerHTML = `
      <div class="page-hero"><div class="container"><div class="eyebrow">THE ECOSYSTEM</div><h1>Why GIFT City<br><i>matters.</i></h1><p>GIFT City brings international financial activity into a purpose-built IFSC environment. Explore the benefits by audience.</p></div></div>
      <section class="section dark"><div class="container"><div class="cards">
      ${benefits.map((b,i)=>`<article class="card reveal"><div class="card-number">0${i+1}</div><h3>${esc(b.title)}</h3><p>${esc(b.description)}</p><ul>${[1,2,3,4,5,6].map(n=>b["benefit"+n]?`<li>${esc(b["benefit"+n])}</li>`:"").join("")}</ul></article>`).join("")}
      </div></div></section>`;
  }

  if (page === "how") {
    const pres = data.Presentations || [];
    root.innerHTML = `
      <div class="page-hero"><div class="container"><div class="eyebrow">HOW IT WORKS</div><h1>From curiosity<br><i>to clarity.</i></h1><p>Use this page for your explainer journey, FAQs and Canva presentations. Presentation links are controlled from Google Sheets.</p></div></div>
      <section class="section"><div class="container"><div class="split"><div><div class="eyebrow">PROCESS</div><h2>A simple path to global diversification.</h2></div>
      <div class="list">${["Understand your objective and eligibility","Explore GIFT City routes and available strategies","Review costs, tax treatment and documentation","Speak with the appropriate regulated professional/provider","Invest only after understanding the risks and terms"].map((x,i)=>`<div class="list-item"><span class="num">0${i+1}</span><div><b>${esc(x)}</b><span>Designed as educational guidance, not a recommendation.</span></div></div>`).join("")}</div></div></div></section>
      <section class="section dark"><div class="container"><div class="section-head"><div><div class="eyebrow">PRESENTATIONS</div><h2>Your Canva library.</h2></div><p>Add your Canva URLs to the Presentations sheet; no GitHub edit is required.</p></div>
      <div class="cards">${pres.map(p=>`<article class="card"><div class="card-number">CANVA</div><h3>${esc(p.title)}</h3><p>${esc(p.subtitle)}</p><a class="button gold" href="${esc(p.canva_url)}" target="_blank" rel="noopener">${esc(p.button_text || "Open presentation")} ↗</a></article>`).join("")}</div></div></section>`;
  }

  if (page === "about") {
    const faq = data.FAQ || [];
    root.innerHTML = `
      <div class="page-hero"><div class="container"><div class="eyebrow">ABOUT</div><h1>Gift City Investing<br><i>in one place.</i></h1><p data-site="about_intro">A research-led educational platform focused on GIFT City, global investing and cross-border diversification.</p></div></div>
      <section class="section"><div class="container"><div class="split"><div><div class="eyebrow">CONTACT</div><h2>Start a conversation.</h2><p class="small">Use the contact details maintained in the Site tab of the Google Sheet.</p></div><div class="contact-box"><div class="contact-panel"><div class="eyebrow">EMAIL</div><h3 data-site="contact_email">—</h3></div><div class="contact-panel"><div class="eyebrow">LOCATION</div><h3 data-site="contact_location">—</h3></div></div></div></div></section>
      <section class="section dark"><div class="container faq"><div class="eyebrow">FAQ</div><h2>Questions, answered.</h2><div style="margin-top:28px">${faq.map(f=>`<details><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join("")}</div></div></section>`;
  }
};
