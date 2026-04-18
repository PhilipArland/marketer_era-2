// dashboard.js

function initDashboard() {
    console.log("✅ Dashboard initialized");

    initClock();
    initCards();

    // safe initial render
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
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}


// ==============================
// 📑 CARD INIT (DEFAULT STATE)
// ==============================
function initCards() {
    const cards = document.querySelectorAll("[data-card]");
    const buttons = document.querySelectorAll("[data-tab-btn]");

    // hide all toggle cards first
    cards.forEach(card => {
        card.style.display = "none";
    });

    // remove active states
    buttons.forEach(btn => btn.classList.remove("active"));

    // default: Collection ON
    const collectionCard = document.querySelector('[data-card="Collection"]');
    const collectionBtn = document.querySelector('[data-tab-btn="Collection"]');

    if (collectionCard) collectionCard.style.display = "block";
    if (collectionBtn) collectionBtn.classList.add("active");
}


// ==============================
// 📑 TOGGLE TABS
// ==============================
function switchTab(btn, tabName) {
    const card = document.querySelector(`[data-card="${tabName}"]`);
    if (!card) return;

    const isHidden = card.style.display === "none" || card.style.display === "";

    if (isHidden) {
        card.style.display = "block";
        btn.classList.add("active");
    } else {
        card.style.display = "none";
        btn.classList.remove("active");
    }
}


// ==============================
// 📊 REPORT RENDER (BASE ONLY)
// ==============================
function render() {
    const output = document.getElementById("reportOut");
    if (!output) return;

    const now = new Date();

    const formattedDate = now.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    // COLLECTION VALUES
    const country = getVal("col_country");
    const segment = getVal("col_segment");
    const names = getVal("col_names");
    const emails = getVal("col_emails");

    // RESPONSE VALUES
    const recv = getVal("f_recv");
    const noint = getVal("f_noint");

    output.innerHTML = `
        ${formattedDate} (Mid-Day Report)
        <br><br>

        <b>COMPANY NAME COLLECTION</b>
        <br>
        Country: ${country}
        <br>
        Market Segment: ${segment}
        <br>
        No. of Collected Company Names: ${names || 0}
        <br>
        No. of Collected Company Emails: ${emails || 0}
        <br><br>

        Emails Received: ${recv || 0}
        <br>
        Not Interested: ${noint || 0}
        <br><br>

        Thank you.
        <br><br>

        - User
    `;
}

// ==============================
// 🧰 HELPER (IMPORTANT SAFETY)
// ==============================
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}