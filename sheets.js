(() => {
  const cfg = window.GCI_CONFIG || {};
  const cache = new Map();

  function sheetUrl(name) {
    if (!cfg.SHEET_ID || cfg.SHEET_ID.includes("PASTE_")) {
      throw new Error("Google Sheet ID has not been configured in assets/config.js");
    }
    return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(cfg.SHEET_ID)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
  }

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i + 1];
      if (c === '"' && quoted && n === '"') { cell += '"'; i++; continue; }
      if (c === '"') { quoted = !quoted; continue; }
      if (c === ',' && !quoted) { row.push(cell); cell = ""; continue; }
      if ((c === '\n' || c === '\r') && !quoted) {
        if (c === '\r' && n === '\n') i++;
        row.push(cell); cell = "";
        if (row.some(v => v.trim() !== "")) rows.push(row);
        row = [];
        continue;
      }
      cell += c;
    }
    if (cell.length || row.length) {
      row.push(cell);
      if (row.some(v => v.trim() !== "")) rows.push(row);
    }
    if (!rows.length) return [];
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).map(r => Object.fromEntries(headers.map((h,i) => [h, (r[i] ?? "").trim()])));
  }

  async function getSheet(name) {
    const key = name;
    const now = Date.now();
    const hit = cache.get(key);
    if (hit && now - hit.time < (cfg.CACHE_MINUTES || 15) * 60000) return hit.data;
    const response = await fetch(sheetUrl(name), { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load Google Sheet tab: ${name}`);
    const data = parseCSV(await response.text());
    cache.set(key, {time: now, data});
    return data;
  }

  async function loadAll(names) {
    const results = {};
    await Promise.all(names.map(async n => results[n] = await getSheet(n)));
    return results;
  }

  window.GCI_SHEETS = { getSheet, loadAll };
})();
