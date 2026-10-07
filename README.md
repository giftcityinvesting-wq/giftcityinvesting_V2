# Gift City Investing — Premium V2

A static, premium redesign for Gift City Investing, designed for GitHub + Cloudflare Pages.

## Stack
- Plain HTML/CSS/JavaScript — no build step required.
- Google Sheets acts as the lightweight CMS/data control panel.
- Google Sheets is read through its public `gviz` CSV endpoint.
- Canva presentations are embedded by URL in the presentation slots.
- Responsive, accessible, keyboard-friendly interactions.
- `prefers-reduced-motion` support.

## Pages
- `/index.html` — Home
- `/gift-city.html` — GIFT City
- `/funds.html` — Funds
- `/compare.html` — Compare
- `/how-it-works.html` — How it works
- `/about.html` — About / contact

## 1. Create the Google Sheet
Create one Google Spreadsheet with these tabs:

1. Site
2. Funds
3. FundCompare
4. Benefits
5. RouteCompare
6. Ticker
7. FAQ
8. Presentations

Use the template in `data/google-sheet-template.csv` as a starting reference. The website expects the first row of each tab to be column headers.

### Required Site columns
`key,value`

Examples:
- `brand_name` → Gift City Investing
- `hero_kicker` → GIFT CITY • GLOBAL INVESTING
- `hero_title` → Invest globally. From India.
- `hero_text` → Diversify across international markets...
- `hero_cta_primary` → Explore Funds
- `hero_cta_secondary` → Why GIFT City
- `contact_email` → your@email.com

### Funds columns
`slug,name,subtitle,category,aum,launch_date,min_investment,benchmark,expense_ratio,return_1y,return_3y,return_5y,status,description`

### FundCompare columns
`section,parameter,dsp,marcellus,direct,note`

### Benefits columns
`audience,title,description,benefit1,benefit2,benefit3,benefit4,benefit5,benefit6`

### RouteCompare columns
`parameter,traditional,gift_city,benefit`

### Ticker columns
`label,value,change,change_type`

### FAQ columns
`question,answer`

### Presentations columns
`title,subtitle,canva_url,button_text`

## 2. Publish the Google Sheet
In Google Sheets:
- File → Share → Publish to web
- Publish the spreadsheet.
- Keep the data non-sensitive. Do NOT put API keys, passwords, client information or private data in it.

Then edit `assets/config.js`:
```js
window.GCI_CONFIG = {
  SHEET_ID: "YOUR_GOOGLE_SHEET_ID"
};
```

The sheet ID is the long value between `/d/` and `/edit` in the spreadsheet URL.

## 3. GitHub
Upload the contents of this folder to a GitHub repository.

No npm install/build command is required.

## 4. Cloudflare Pages
Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.

Settings:
- Framework preset: None
- Build command: leave empty
- Build output directory: `/`

Every GitHub push will trigger a new deployment.

## 5. Canva presentations
You do NOT need to upload Canva files to GitHub.

For each presentation:
1. Open the Canva presentation.
2. Click Share → More / Embed.
3. Copy the presentation URL or embed URL.
4. Put the URL in the `canva_url` column of the `Presentations` sheet.
5. The website will show it in the presentation viewer.

If Canva blocks iframe embedding for a particular presentation, the site automatically provides an "Open presentation" link. In that case, use the share link rather than trying to bypass Canva's embedding restrictions.

## Important data/legal note
The supplied source material contains investment, tax, regulatory and performance claims. The redesign preserves the supplied structure/examples, but these should be independently verified and dated before publication. Add a `last_updated` value to the Site tab and keep source links/notes in your internal records.

## Handoff
A future AI/developer should start here:
1. Read `README.md`.
2. Read `assets/config.js`.
3. Read `assets/js/sheets.js`.
4. Inspect the Google Sheet tabs.
5. Do not hard-code changing fund figures into page HTML.
6. Keep the public site static and use Google Sheets only for editable content/data.
