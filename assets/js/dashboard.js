function initDashboard() {
    console.log("✅ Dashboard initialized");
    initClock();
    initCards();
    render();
}


// ==============================
// 🕒 CLOCK
// ==============================
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const timeEl = document.getElementById("cTime");
    const dateEl = document.getElementById("cDate");
    if (!timeEl || !dateEl) return;
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();
    dateEl.textContent = now.toLocaleDateString(undefined, {
        month: "long", day: "numeric", year: "numeric"
    });
}


// ==============================
// 📑 CARD INIT (DEFAULT STATE)
// ==============================

// Tracks clone counts per card type
const cloneCounters = { Collection: 0, Emails: 0, Webmails: 0 };

// Maps each card type to its input field base IDs
const cardFields = {
    Collection: ["col_country", "col_segment", "col_names", "col_emails"],
    Emails: ["em_country", "em_segment", "em_product", "em_sent"],
    Webmails: ["wm_country", "wm_segment", "wm_product", "wm_sent"],
};

function initCards() {
    const cards = document.querySelectorAll("[data-card]");
    const buttons = document.querySelectorAll("[data-tab-btn]");

    cards.forEach(card => card.style.display = "none");
    buttons.forEach(btn => btn.classList.remove("active"));

    // Default: show Collection
    const collectionCard = document.querySelector('[data-card="Collection"]');
    const collectionBtn = document.querySelector('[data-tab-btn="Collection"]');
    if (collectionCard) collectionCard.style.display = "block";
    if (collectionBtn) collectionBtn.classList.add("active");

    // Attach + buttons to all 3 original cards
    ["Collection", "Emails", "Webmails"].forEach(type => {
        const card = document.querySelector(`[data-card="${type}"]`);
        const btn = card?.querySelector(".add-btn");
        if (btn) btn.addEventListener("click", () => addCard(type));
    });
}


// ==============================
// 📑 TOGGLE TABS
// ==============================
function switchTab(btn, tabName) {
    // For cloned cards, we match by prefix
    const cards = document.querySelectorAll(`[data-card^="${tabName}"]`);
    if (!cards.length) return;

    const original = document.querySelector(`[data-card="${tabName}"]`);
    const isHidden = original.style.display === "none" || original.style.display === "";

    cards.forEach(card => {
        card.style.display = isHidden ? "block" : "none";
    });

    if (isHidden) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }

    render();
}


// ==============================
// ➕ GENERIC CARD CLONER
// ==============================
function addCard(type) {
    const original = document.querySelector(`[data-card="${type}"]`);
    if (!original) return;

    cloneCounters[type]++;
    const idx = cloneCounters[type];

    const clone = original.cloneNode(true);
    clone.setAttribute("data-card", `${type}-${idx}`);

    // Re-ID all inputs with a unique suffix and rewire oninput
    const fields = cardFields[type];
    fields.forEach(baseId => {
        const el = clone.querySelector(`#${baseId}`);
        if (!el) return;
        el.id = `${baseId}_${idx}`;
        el.removeAttribute("oninput");
        el.addEventListener("input", render);
    });

    // Update title
    const title = clone.querySelector(".card-title");
    if (title) title.textContent = `${original.querySelector(".card-title").textContent}`;

    // Swap + to − (remove button)
    const addBtn = clone.querySelector(".add-btn");
    if (addBtn) {
        addBtn.textContent = "−";
        addBtn.addEventListener("click", () => {
            clone.remove();
            render();
        });
    }

    // Insert after the last card of this type
    const allOfType = document.querySelectorAll(`[data-card^="${type}"]`);
    const last = allOfType[allOfType.length - 1];
    last.after(clone);

    render();
}


// ==============================
// 📊 REPORT RENDER (DYNAMIC)
// ==============================
function render() {
    const output = document.getElementById("reportOut");
    if (!output) return;

    const now = new Date();
    const hour = now.getHours();

    const baseDate = now.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const formattedDate =
        hour < 13
            ? `${baseDate} (Mid-Day Report)`
            : baseDate;

    // --- COLLECTION SECTION ---
    let collectionHTML = "";
    document.querySelectorAll('[data-card^="Collection"]').forEach((card, i) => {
        if (card.style.display === "none") return; // 👈 skip hidden

        const country = getFrom(card, `col_country`);
        const segment = getFrom(card, `col_segment`);
        const names = getFrom(card, `col_names`);
        const emails = getFrom(card, `col_emails`);

        collectionHTML += `
            <b>COMPANY COLLECTION</b><br>
            Country: ${country}<br>
            Market Segment: ${segment}<br>
            No. of Collected Company Names: ${names || 0}<br>
            No. of Collected Company Emails: ${emails || 0}<br><br>
        `;
    });

    // --- EMAILS SECTION ---
    let emailsHTML = "";
    document.querySelectorAll('[data-card^="Emails"]').forEach((card, i) => {
        if (card.style.display === "none") return; // 👈 skip hidden

        const s = i === 0 ? "" : `_${i}`;
        const country = getFrom(card, `em_country${s}`);
        const segment = getFrom(card, `em_segment${s}`);
        const product = getFrom(card, `em_product${s}`);
        const sent = getFrom(card, `em_sent${s}`);

        emailsHTML += `
            <b>SENDING EMAILS</b><br>
            Country: ${country}<br>
            Market Segment: ${segment}<br>
            Product Line: ${product}<br>
            No. of Sent Emails: ${sent || 0}<br><br>
        `;
    });

    // --- WEBMAILS SECTION ---
    let webmailsHTML = "";
    document.querySelectorAll('[data-card^="Webmails"]').forEach((card, i) => {
        if (card.style.display === "none") return; // 👈 skip hidden

        const s = i === 0 ? "" : `_${i}`;
        const country = getFrom(card, `wm_country${s}`);
        const segment = getFrom(card, `wm_segment${s}`);
        const product = getFrom(card, `wm_product${s}`);
        const sent = getFrom(card, `wm_sent${s}`);

        webmailsHTML += `
            <b>SENDING WEBMAILS</b><br>
            Country: ${country}<br>
            Market Segment: ${segment}<br>
            Product Line: ${product}<br>
            No. of Sent Webmails: ${sent || 0}<br><br>
        `;
    });

    // --- RESPONSE VALUES ---
    const recv = getVal("f_recv");
    const noint = getVal("f_noint");

    output.innerHTML = `
        ${formattedDate}
        <br><br>

        ${collectionHTML}
        ${emailsHTML}
        ${webmailsHTML}

        Emails Received: ${recv || 0}<br>
        Not Interested: ${noint || 0}<br><br>

        Thank you.<br><br>

        - User
    `;
}


// ==============================
// 🧰 HELPERS
// ==============================
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}

function getFrom(card, id) {
    const el = card.querySelector(`#${id}`);
    return el ? el.value : "";
}