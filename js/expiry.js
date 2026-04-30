// Expiry calendar — externalised to comply with MV3 CSP (no inline scripts).
const days = [
  {
    name: "Monday",
    color: ["#F1EFE8", "#5F5E5A"],
    expiries: [],
    monthlyExpiries: [],
    watch: ["Nifty 50", "Gift Nifty", "Global cues", "VIX"],
    bias: "Pre-expiry setup day — Nifty expires Tuesday",
    strategies: ["Build Nifty straddle/strangle for Tue expiry", "Identify support/resistance", "VWAP trend scalps", "Positional swing entries"],
    entry: "Global cue gap assessment · Overnight H/L break · VWAP cross setup for Tue trade",
    target: "Build positions at 30–50% of expected Tue move",
    stop: "Defined by Tue expiry risk budget · 20–25% premium",
    tl: [
      { l: "Gap assess", t: "9:15–9:45", bg: "#E6F1FB", tc: "#0C447C" },
      { l: "Scout entries", t: "9:45–12:00", bg: "#EEEDFE", tc: "#3C3489" },
      { l: "Build Tue position", t: "12:00–14:30", bg: "#E1F5EE", tc: "#085041" },
      { l: "Square intraday", t: "15:15", bg: "#F1EFE8", tc: "#5F5E5A" },
    ],
    note: "No weekly expiry today. Focus is entirely on positioning for Tuesday's Nifty 50 expiry. Watch Gift Nifty premium/discount for direction bias."
  },
  {
    name: "Tuesday",
    color: ["#EEEDFE", "#3C3489"],
    expiries: ["Nifty 50 (weekly)"],
    monthlyExpiries: ["BankNifty", "FinNifty", "MidcpNifty", "NiftyNxt50", "Stocks (last Tue of month)"],
    watch: ["Nifty 50", "BankNifty (monthly)", "FinNifty (monthly)", "MidcpNifty"],
    bias: "Nifty 50 weekly expiry · monthly expiry stack on last Tuesday",
    strategies: ["ATM/NTM straddle unwind", "Expiry scalps", "Max pain pin trades", "Theta decay plays", "Directional breakout (morning only)"],
    entry: "Break of Mon H/L · VIX spike · Max pain level magnet · VWAP deviation fade",
    target: "30–80% premium on short options · Directional: 1.5–2× risk",
    stop: "Short options: 30–40% loss on leg · Directional: 15–20% premium",
    tl: [
      { l: "Direction read", t: "9:15–9:45", bg: "#EEEDFE", tc: "#3C3489" },
      { l: "Primary entry", t: "9:45–11:30", bg: "#7F77DD", tc: "#fff" },
      { l: "Manage / exit", t: "11:30–14:00", bg: "#E1F5EE", tc: "#085041" },
      { l: "Square ALL", t: "14:00–15:15", bg: "#FCEBEB", tc: "#791F1F" },
    ],
    note: "Most volatile expiry day. On last Tuesday of month, BankNifty + FinNifty + MidcpNifty monthly contracts also expire — expect elevated volume and erratic moves. No new positions after 2 PM."
  },
  {
    name: "Wednesday",
    color: ["#F1EFE8", "#444441"],
    expiries: [],
    monthlyExpiries: [],
    watch: ["Nifty 50", "Sensex", "BankNifty", "Sector stocks"],
    bias: "Mid-week — no expiry, trend continuation or reversal",
    strategies: ["Iron condors (Nifty/Sensex)", "Positional swing", "Sector rotation trades", "Defined-risk spreads"],
    entry: "Momentum continuation from Tue · New range formation · Macro data reaction",
    target: "Condor: full credit · Swing: 2× risk · Spread: 50–70% of max profit",
    stop: "Condor wing breach · Swing: 20–25% premium · Hard SL below key pivot",
    tl: [
      { l: "Trend assess", t: "9:15–10:00", bg: "#E6F1FB", tc: "#0C447C" },
      { l: "Condor / spread", t: "10:00–12:00", bg: "#E1F5EE", tc: "#085041" },
      { l: "Swing ride", t: "12:00–14:30", bg: "#F1EFE8", tc: "#444441" },
      { l: "Pre-Thu prep", t: "Afternoon", bg: "#FAEEDA", tc: "#633806" },
    ],
    note: "No weekly expiry. Ideal day for defined-risk structures (iron condors, spreads) on Nifty or Sensex. Use afternoon to set up Thursday Sensex expiry positions."
  },
  {
    name: "Thursday",
    color: ["#FAECE7", "#712B13"],
    expiries: ["Sensex (weekly)"],
    monthlyExpiries: ["Bankex (last Thu of month)"],
    watch: ["Sensex", "Bankex (monthly week)", "BSE stocks", "BankNifty"],
    bias: "Sensex weekly expiry · BSE-centric day",
    strategies: ["Sensex straddle/scalp", "Expiry momentum play", "Bankex fade (monthly week)", "Trend follow with tight SL"],
    entry: "Wed H/L break · Sensex max pain level · VIX move · BSE OI shift",
    target: "Straddle: BE ± premium · Momentum: 50–100% premium · Scalp: 30–50%",
    stop: "Straddle max loss = premium paid · Scalp: 15–20%",
    tl: [
      { l: "Sensex level", t: "9:15–9:45", bg: "#FAECE7", tc: "#712B13" },
      { l: "Primary entry", t: "9:45–11:30", bg: "#D85A30", tc: "#fff" },
      { l: "Manage / ride", t: "11:30–14:00", bg: "#E1F5EE", tc: "#085041" },
      { l: "Square ALL", t: "14:00–15:15", bg: "#FCEBEB", tc: "#791F1F" },
    ],
    note: "Sensex (BSE) expires. Note: BSE liquidity is lower than NSE — bid-ask spreads can be wider especially on OTM strikes. Prefer ATM strikes and tighter position sizing. Last Thursday of month = Bankex monthly also expires."
  },
  {
    name: "Friday",
    color: ["#E1F5EE", "#085041"],
    expiries: [],
    monthlyExpiries: [],
    watch: ["Nifty 50", "Sensex", "Sector indices", "Stocks"],
    bias: "Post-expiry · weekend gap risk · muted volumes",
    strategies: ["Intraday fade", "Cheap next-week options", "Weekly recap trades", "Last-hour reversal scalps"],
    entry: "Last-hour reversal at weekly support/resistance · Low VIX entry for next-week options",
    target: "Small R multiples · Next-week options: 30–50% gain by Mon/Tue",
    stop: "Very tight · Respect weekly closing levels · No averaging",
    tl: [
      { l: "Week review", t: "9:15–10:00", bg: "#E1F5EE", tc: "#085041" },
      { l: "Scalp window", t: "10:00–13:00", bg: "#EEEDFE", tc: "#3C3489" },
      { l: "Fade / reversal", t: "13:00–14:30", bg: "#E6F1FB", tc: "#0C447C" },
      { l: "Exit ALL", t: "15:00", bg: "#FCEBEB", tc: "#791F1F" },
    ],
    note: "No expiry today. Weekend gap risk is real — avoid carrying naked short options over the weekend. You can buy cheap next-week Nifty options for a Tue expiry play. Exit everything by 3 PM."
  }
];

let active = (() => {
  // 0=Sun, 1=Mon ... 6=Sat. Map Mon-Fri to days[0..4]; weekends -> Monday.
  const d = new Date().getDay();
  if (d >= 1 && d <= 5) return d - 1;
  return 0;
})();

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function cards() {
  document.getElementById('wg').innerHTML = days.map((d, i) => `
    <div class="day-card${i === active ? ' active' : ''}" data-idx="${i}" style="border-color:${i === active ? 'var(--color-border-primary)' : 'var(--color-border-tertiary)'}">
      <div class="day-header" style="background:${d.color[0]}">
        <div class="day-name" style="color:${d.color[1]}">${d.name}</div>
        <div class="badge-row">
          ${d.expiries.map(e => `<span class="badge" style="background:#EEEDFE;color:#3C3489;">${escapeHtml(e.split(' ')[0])}</span>`).join('')}
          ${d.monthlyExpiries.length && !d.expiries.length ? `<span class="badge" style="background:#E1F5EE;color:#085041;">Monthly*</span>` : ''}
          ${!d.expiries.length && !d.monthlyExpiries.length ? `<span class="badge" style="background:#F1EFE8;color:#888780;">No expiry</span>` : ''}
        </div>
      </div>
      <div class="day-sub">${d.watch.slice(0, 2).map(escapeHtml).join(' · ')}</div>
    </div>`).join('');
}

function detail() {
  const d = days[active];
  document.getElementById('dp').innerHTML = `
    <div class="dh">
      <span class="dh-day">${escapeHtml(d.name)}</span>
      <span class="dh-bias">${escapeHtml(d.bias)}</span>
    </div>
    <div class="exp-row">
      <span class="exp-lbl">Weekly:</span>
      ${d.expiries.length ? d.expiries.map(e => `<span class="exp-b weekly-b">${escapeHtml(e)}</span>`).join('') : `<span class="exp-b none-b">None</span>`}
      <span class="exp-lbl" style="margin-left:8px;">Monthly (last week):</span>
      ${d.monthlyExpiries.length ? d.monthlyExpiries.map(e => `<span class="exp-b monthly-b">${escapeHtml(e)}</span>`).join('') : `<span class="exp-b none-b">None</span>`}
    </div>
    <div class="exp-row" style="margin-bottom:12px;">
      <span class="exp-lbl">Watch:</span>
      ${d.watch.map(w => `<span class="exp-b" style="background:var(--color-background-secondary);color:var(--color-text-secondary);">${escapeHtml(w)}</span>`).join('')}
    </div>
    <div class="detail-grid">
      <div class="ib full">
        <div class="ib-lbl">Strategies</div>
        <div class="strat-list">${d.strategies.map(s => `<span class="strat-tag">${escapeHtml(s)}</span>`).join('')}</div>
      </div>
      <div class="ib">
        <div class="ib-lbl">Entry triggers</div>
        <div class="ib-val">${escapeHtml(d.entry)}</div>
      </div>
      <div class="ib">
        <div class="ib-lbl">Target / stop</div>
        <div class="ib-val"><span style="color:var(--color-text-success)">T:</span> ${escapeHtml(d.target)}<br><span style="color:var(--color-text-danger)">SL:</span> ${escapeHtml(d.stop)}</div>
      </div>
    </div>
    <div class="tl">${d.tl.map(t => `<div class="tl-s" style="background:${t.bg};color:${t.tc};">${escapeHtml(t.l)}<br><span style="font-weight:400;opacity:0.8;">${escapeHtml(t.t)}</span></div>`).join('')}</div>
    <div class="note">${escapeHtml(d.note)}</div>
  `;
}

function sel(i) { active = i; cards(); detail(); }

document.addEventListener('DOMContentLoaded', () => {
  cards();
  detail();
  // Delegated click handler (no inline onclick — MV3 CSP safe)
  document.getElementById('wg').addEventListener('click', (e) => {
    const card = e.target.closest('.day-card');
    if (!card) return;
    const idx = parseInt(card.getAttribute('data-idx'), 10);
    if (!Number.isNaN(idx)) sel(idx);
  });

  // Theme sync with parent (notebook app) when embedded in iframe
  function applyTheme(theme) {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }
  const params = new URLSearchParams(location.search);
  if (params.get('theme')) applyTheme(params.get('theme'));
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'theme') applyTheme(e.data.theme);
  });
  if (window.parent !== window) {
    try { window.parent.postMessage({ type: 'expiry-ready' }, '*'); } catch (err) { /* noop */ }
  }
});
