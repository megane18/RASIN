/* Haitian Influence Tracker - Demo MVP
   Redesigned with cleaner, more professional UI
*/

const ROUTES = ["home", "submit", "archive", "admin", "news", "trending"];
const STORAGE_KEYS = {
  entries: "hit_entries_v1",
  submissions: "hit_submissions_v1",
  views: "hit_views_v1",
  demoSeeded: "hit_demo_seeded_v1",
};

const ADMIN_PASSWORD = "haiti";

// ---------- Utilities ----------
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

function uid(prefix="id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function nowISO() {
  return new Date().toISOString();
}

function safeSplitLines(s) {
  return (s || "")
    .split("\n")
    .map(x => x.trim())
    .filter(Boolean);
}

function parseTags(s) {
  return (s || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 25);
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(str) {
  return (str ?? "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

function badgeClassForVerdict(v) {
  if (v === "Proven" || v === "Strong") return "good";
  if (v === "Plausible") return "warn";
  if (v === "Debunked") return "bad";
  return "blue";
}

function shorten(s, n=120) {
  const x = (s || "").trim();
  if (x.length <= n) return x;
  return x.slice(0, n-1) + "…";
}

// ---------- Data ----------
function getEntries() {
  return loadJSON(STORAGE_KEYS.entries, []);
}

function setEntries(entries) {
  saveJSON(STORAGE_KEYS.entries, entries);
}

function getSubmissions() {
  return loadJSON(STORAGE_KEYS.submissions, []);
}

function setSubmissions(subs) {
  saveJSON(STORAGE_KEYS.submissions, subs);
}

function getViews() {
  return loadJSON(STORAGE_KEYS.views, {});
}

function bumpView(entryId) {
  const views = getViews();
  views[entryId] = (views[entryId] || 0) + 1;
  saveJSON(STORAGE_KEYS.views, views);
}

function isDemoSeeded() {
  return localStorage.getItem(STORAGE_KEYS.demoSeeded) === "1";
}

function markDemoSeeded() {
  localStorage.setItem(STORAGE_KEYS.demoSeeded, "1");
}

// ---------- Routing ----------
function routeTo(route) {
  if (!ROUTES.includes(route)) route = "home";
  window.location.hash = `#${route}`;
}

function currentRoute() {
  const h = (window.location.hash || "").replace("#", "").trim();
  return ROUTES.includes(h) ? h : "home";
}

function renderRoute() {
  const route = currentRoute();

  ROUTES.forEach(r => {
    const view = $(`#view-${r}`);
    if (!view) return;
    view.classList.toggle("hidden", r !== route);
  });

  $all(".navbtn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.route === route);
  });

  if (route === "home") renderHome();
  if (route === "submit") renderSubmit();
  if (route === "archive") renderArchive();
  if (route === "admin") renderAdmin();
}

// ---------- Demo Seed ----------
function seedDemoContent() {
  if (isDemoSeeded()) return;

  const entries = [
    {
      id: uid("entry"),
      title: "The Haitian Roots of New Orleans Jazz",
      category: "Music",
      verdict: "Likely",
      confidence: "I'm Certain",
      tags: ["diaspora", "new orleans", "rhythm", "drumming", "vodou"],
      claim: "New Orleans jazz has Haitian roots through migration and shared rhythmic traditions.",
      evidence: [
        "Haitian migrants brought musical traditions to Louisiana. We found references from historical sources linking voodoo rhythms to early jazz.",
        "Historical sources document migration links between Saint-Domingue (Haiti) and Louisiana.",
      ],
      context: "Haitian drumming influenced early New Orleans music.",
      links: ["https://en.wikipedia.org/wiki/Haiti", "https://en.wikipedia.org/wiki/Jazz"],
      created_at: nowISO(),
      updated_at: nowISO(),
    },
    {
      id: uid("entry"),
      title: "Haitian Influence in Blues Music",
      category: "Music",
      verdict: "Likely",
      confidence: "I'm Certain",
      tags: ["blues", "music", "history", "diaspora"],
      claim: "Haitian musical elements influenced the development of blues music in the American South.",
      evidence: [
        "Migration patterns show Haitian influence in Southern states.",
        "Rhythmic patterns in blues trace back to Haitian traditions."
      ],
      context: "This connection requires more primary source documentation.",
      links: [],
      created_at: nowISO(),
      updated_at: nowISO(),
    },
    {
      id: uid("entry"),
      title: "Vodou Rituals in Jazz Culture",
      category: "Religion / Spirituality",
      verdict: "Likely",
      confidence: "Somewhat sure",
      tags: ["vodou", "spirituality", "jazz", "culture"],
      claim: "Vodou spiritual practices influenced jazz performance culture.",
      evidence: [
        "Documented connections between New Orleans spiritual practices and jazz.",
        "Rhythmic structures mirror vodou ceremonial patterns."
      ],
      context: "Stronger musicological analysis needed to confirm specific influences.",
      links: ["https://en.wikipedia.org/wiki/Haitian_Vodou"],
      created_at: nowISO(),
      updated_at: nowISO(),
    }
  ];

  setEntries(entries);
  setSubmissions([]);
  saveJSON(STORAGE_KEYS.views, {});
  markDemoSeeded();
}

// ---------- Home ----------
function renderHome() {
  const entries = getEntries();
  
  // Render news items
  const news = [
    { title: "Haitian Art Exhibit Opens in Paris", desc: "" },
    { title: "Haitian Cuisine Inspires New York Chef", desc: "" }
  ];

  const newsEl = $("#news-list");
  newsEl.innerHTML = news.map(item => `
    <li class="news-item">
      <h3>${escapeHTML(item.title)}</h3>
    </li>
  `).join("");

  // Render trending topics
  const topics = topTags(entries, 6);
  const pillsEl = $("#trending-pills");
  pillsEl.innerHTML = topics.map(t => 
    `<span class="topic-pill" data-tag="${escapeHTML(t)}">${escapeHTML(t)}</span>`
  ).join("");

  // Add click handlers for topic pills
  $all(".topic-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      routeTo("archive");
    });
  });

  // Render featured cards dynamically
  const featured = entries.slice(0, 3);
  const featuredGrid = $("#featured-grid");
  featuredGrid.innerHTML = featured.map(e => `
    <div class="featured-card" data-entry-id="${e.id}">
      <div class="featured-img">🎵</div>
      <h3>${escapeHTML(e.title)}</h3>
    </div>
  `).join("");

  // Add click handlers for featured cards
  $all(".featured-card").forEach(card => {
    card.addEventListener("click", () => {
      openEntryModal(card.dataset.entryId);
    });
  });
}

function topTags(entries, limit=10) {
  const freq = {};
  for (const e of entries) {
    for (const t of (e.tags || [])) freq[t] = (freq[t] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a,b) => b[1]-a[1])
    .slice(0, limit)
    .map(([t]) => t);
}

// ---------- Submit ----------
function renderSubmit() {
  // Submit page is mostly static form
}

// ---------- Archive ----------
function renderArchive() {
  const entries = getEntries();

  // Populate category dropdown once
  const catSel = $("#archiveCategory");
  if (catSel.options.length <= 1) {
    const cats = Array.from(new Set(entries.map(e => e.category))).sort();
    for (const c of cats) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      catSel.appendChild(opt);
    }
  }

  const cat = $("#archiveCategory").value || "All";
  const q = ($("#archiveSearch").value || "").trim().toLowerCase();

  const filtered = entries.filter(e => {
    if (cat !== "All" && e.category !== cat) return false;
    if (!q) return true;
    
    const hay = [
      e.title, e.category, e.verdict,
      e.claim, e.context,
      (e.tags || []).join(" "),
      (e.links || []).join(" "),
    ].join(" ").toLowerCase();
    return hay.includes(q);
  });

  const grid = $("#archiveGrid");
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="entry-card"><h3>No results found</h3><p class="muted">Try adjusting your filters or search terms.</p></div>`;
    return;
  }

  grid.innerHTML = filtered
    .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
    .map(e => `
      <article class="entry-card" data-entry-id="${e.id}">
        <div class="entry-flag">🇭🇹 ${escapeHTML(e.category)}</div>
        <h3>${escapeHTML(e.title)}</h3>
        
        <div class="entry-section">
          <div class="entry-section-title">Claim:</div>
          <p>${escapeHTML(shorten(e.claim, 150))}</p>
        </div>

        <div class="entry-section">
          <div class="entry-section-title">Evidence:</div>
          <p>${escapeHTML(shorten((e.evidence || [])[0] || "No evidence provided", 120))}</p>
        </div>

        <div class="entry-section">
          <div class="entry-section-title">Context:</div>
          <p>${escapeHTML(shorten(e.context || "Context pending", 100))}</p>
        </div>

        <div class="entry-section">
          <div class="entry-section-title">Verdict:</div>
          <span class="verdict-badge ${e.verdict === 'Likely' ? 'likely' : 'info'}">${escapeHTML(e.verdict)}</span>
        </div>

        ${(e.links && e.links.length > 0) ? `
          <div class="related-section">
            <h4>Related Entries</h4>
            <ul class="related-list">
              <li>▸ <a href="#" onclick="event.stopPropagation()">Haitian Influence in Blues Music</a></li>
              <li>▸ <a href="#" onclick="event.stopPropagation()">Vodou Rituals in Jazz Culture</a></li>
            </ul>
          </div>
        ` : ''}
      </article>
    `).join("");

  // Click handlers
  $all("[data-entry-id]").forEach(card => {
    card.addEventListener("click", () => openEntryModal(card.dataset.entryId));
  });
}

// ---------- Admin ----------
let adminUnlocked = false;

function renderAdmin() {
  $("#admin-lock-card").classList.toggle("hidden", adminUnlocked);
  $("#admin-panel").classList.toggle("hidden", !adminUnlocked);

  if (!adminUnlocked) return;

  const subs = getSubmissions();
  const queue = $("#adminQueue");

  if (subs.length === 0) {
    queue.innerHTML = `<div class="section"><p class="muted">No pending submissions</p></div>`;
    return;
  }

  queue.innerHTML = subs
    .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
    .map(s => adminReviewCard(s))
    .join("");

  $all("[data-approve-id]").forEach(btn => {
    btn.addEventListener("click", () => approveSubmission(btn.dataset.approveId));
  });
  $all("[data-reject-id]").forEach(btn => {
    btn.addEventListener("click", () => rejectSubmission(btn.dataset.rejectId));
  });
}

function adminReviewCard(s) {
  return `
    <div class="section">
      <h3>${escapeHTML(s.title)}</h3>
      <p class="muted">${escapeHTML(s.category)} • ${escapeHTML(s.confidence)}</p>
      <p>${escapeHTML(s.claim)}</p>
      
      <div class="row" style="margin-top:1rem">
        <button class="btn primary" data-approve-id="${s.id}">Approve</button>
        <button class="btn" data-reject-id="${s.id}">Reject</button>
      </div>
    </div>
  `;
}

function approveSubmission(subId) {
  const subs = getSubmissions();
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  const entries = getEntries();
  const entry = {
    id: uid("entry"),
    title: s.title,
    category: s.category,
    verdict: "Likely",
    confidence: s.confidence,
    tags: s.tags || [],
    claim: s.claim,
    evidence: ["Curator evidence pending"],
    context: "Context pending curator review",
    links: s.links || [],
    created_at: nowISO(),
    updated_at: nowISO(),
  };

  entries.push(entry);
  setEntries(entries);
  setSubmissions(subs.filter(x => x.id !== subId));

  renderAdmin();
  renderHome();
  renderArchive();
}

function rejectSubmission(subId) {
  const subs = getSubmissions();
  setSubmissions(subs.filter(x => x.id !== subId));
  renderAdmin();
}

// ---------- Modal ----------
function openEntryModal(entryId) {
  const entries = getEntries();
  const e = entries.find(x => x.id === entryId);
  if (!e) return;

  bumpView(e.id);

  $("#modalTitle").textContent = e.title;
  $("#modalSub").textContent = `${e.category} • ${e.verdict}`;

  $("#modalBody").innerHTML = `
    <div class="section">
      <div class="section-title">Claim</div>
      <p>${escapeHTML(e.claim)}</p>
    </div>

    <div class="section">
      <div class="section-title">Evidence</div>
      ${(e.evidence || []).map(x => `<p class="muted">• ${escapeHTML(x)}</p>`).join("")}
    </div>

    <div class="section">
      <div class="section-title">Context</div>
      <p>${escapeHTML(e.context)}</p>
    </div>

    ${e.links && e.links.length > 0 ? `
      <div class="section">
        <div class="section-title">Sources</div>
        ${e.links.map(l => `<p><a href="${escapeHTML(l)}" target="_blank">${escapeHTML(l)}</a></p>`).join("")}
      </div>
    ` : ''}
  `;

  $("#modalFoot").innerHTML = `
    <button class="btn" id="modalCloseBtn2">Close</button>
  `;

  $("#modal").classList.remove("hidden");
  $("#modalCloseBtn2").onclick = closeModal;

  renderHome();
}

function closeModal() {
  $("#modal").classList.add("hidden");
}

// ---------- Events ----------
function wireEvents() {
  $all("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => routeTo(btn.dataset.route));
  });

  window.addEventListener("hashchange", renderRoute);

  // Submit form
  const form = $("#submitForm");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const fd = new FormData(ev.target);
      const title = "User Submission: " + (fd.get("claim") || "").toString().substring(0, 50);
      const category = (fd.get("category") || "Other").toString().trim();
      const claim = (fd.get("claim") || "").toString().trim();
      const confidence = (fd.get("confidence") || "Not sure").toString();

      if (!claim) return;

      const subs = getSubmissions();
      subs.push({
        id: uid("sub"),
        title,
        category,
        claim,
        links: [],
        tags: [],
        confidence,
        created_at: nowISO(),
      });

      setSubmissions(subs);
      ev.target.reset();
      alert("Submission received! It will be reviewed by curators.");
    });
  }

  // Archive filters
  const catSel = $("#archiveCategory");
  const searchEl = $("#archiveSearch");
  if (catSel) catSel.addEventListener("change", renderArchive);
  if (searchEl) searchEl.addEventListener("input", renderArchive);

  // Admin unlock
  const unlockBtn = $("#adminUnlockBtn");
  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      const pass = ($("#adminPass").value || "").trim();
      if (pass === ADMIN_PASSWORD) {
        adminUnlocked = true;
        $("#adminPass").value = "";
        renderAdmin();
      } else {
        alert("Wrong password. Demo password: haiti");
      }
    });
  }

  // Modal close
  $("#modalCloseBtn").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", closeModal);
}

// ---------- Init ----------
(function init(){
  const entries = getEntries();
  if (entries.length === 0) seedDemoContent();

  wireEvents();
  renderRoute();
})();