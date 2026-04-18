// ==============================
// 🌍 STATE
// ==============================
let cities = [];
let completed = {}; // { 0: true, 1: false ... }


// ==============================
// 🚀 INIT
// ==============================
function initCollection() {
    console.log("Collection page initialized");

    const country = document.getElementById("col-country");
    const segment = document.getElementById("col-segment");

    if (country) country.addEventListener("input", renderMessage);
    if (segment) segment.addEventListener("input", renderMessage);

    // load saved state
    loadCollectionState();

    renderMessage();
}


// ==============================
// 📍 GENERATE CITY LIST
// ==============================
function generateCities() {
    const input = document.getElementById("city-input");
    const container = document.getElementById("citylist");

    if (!input || !container) return;

    cities = input.value
        .split("\n")
        .map(c => c.trim())
        .filter(Boolean);

    completed = {};
    saveCollectionState();

    container.innerHTML = "";

    cities.forEach((city, index) => {
        const div = document.createElement("div");
        div.className = "form-check";

        div.innerHTML = `
            <label class="form-check-label">
                <input class="form-check-input me-2"
                    type="checkbox"
                    onchange="toggleCity(${index}, this.checked)">
                ${city}
            </label>
        `;

        container.appendChild(div);
    });

    updateProgress();
    renderMessage();
}


// ==============================
// ☑️ TOGGLE CITY
// ==============================
function toggleCity(index, checked) {
    completed[index] = checked;

    saveCollectionState();
    updateProgress();
    renderMessage();
}


// ==============================
// 📊 PROGRESS BAR
// ==============================
function updateProgress() {
    const total = cities.length;
    const done = Object.values(completed).filter(v => v).length;

    const percent = total ? Math.round((done / total) * 100) : 0;

    const bar = document.querySelector(".progress-bar");
    if (bar) {
        bar.style.width = percent + "%";
        bar.textContent = percent + "%";
    }
}


// ==============================
// 🧠 MESSAGE GENERATOR
// ==============================
function renderMessage() {
    const country = document.getElementById("col-country")?.value.trim() || "{{Country}}";
    const segment = document.getElementById("col-segment")?.value.trim() || "{{Market Segment}}";
    const name = localStorage.getItem("user_name") || "User";

    const checkedIndexes = Object.keys(completed)
        .filter(i => completed[i])
        .map(Number)
        .sort((a, b) => a - b);

    let message = "";

    if (checkedIndexes.length === 0) {
        message = `Hi, I am starting the collection process in ${cities[0] || "City 1"}, ${country} for ${segment}.

- ${name}`;
    } else {
        const current = cities[checkedIndexes[checkedIndexes.length - 1]];
        const next = cities[checkedIndexes[checkedIndexes.length - 1] + 1];

        if (next) {
            message = `Hi, I have finished collecting company names and emails in ${current}, ${country} for ${segment}. I will start collecting in ${next}, ${country} now.

- ${name}`;
        } else {
            message = `Hi, I have finished collecting company names and emails in ${current}, ${country} for ${segment}. All cities are completed.

- ${name}`;
        }
    }

    const output = document.getElementById("generated-message");
    if (output) output.value = message;
}


// ==============================
// 💾 LOCALSTORAGE
// ==============================
function saveCollectionState() {
    localStorage.setItem("col_country", document.getElementById("col-country")?.value || "");
    localStorage.setItem("col_segment", document.getElementById("col-segment")?.value || "");
    localStorage.setItem("cities", JSON.stringify(cities));
    localStorage.setItem("completedCities", JSON.stringify(completed));
}

function loadCollectionState() {
    const savedCities = localStorage.getItem("cities");
    const savedCompleted = localStorage.getItem("completedCities");
    const savedCountry = localStorage.getItem("col_country");
    const savedSegment = localStorage.getItem("col_segment");

    if (savedCountry) {
        const countryInput = document.getElementById("col-country");
        if (countryInput) countryInput.value = savedCountry;
    }

    if (savedSegment) {
        const segmentInput = document.getElementById("col-segment");
        if (segmentInput) segmentInput.value = savedSegment;
    }

    if (savedCities) cities = JSON.parse(savedCities);
    if (savedCompleted) completed = JSON.parse(savedCompleted);

    const container = document.getElementById("citylist");
    if (!container) return;

    container.innerHTML = "";

    cities.forEach((city, index) => {
        const div = document.createElement("div");
        div.className = "form-check";

        const isChecked = completed[index] ? "checked" : "";

        div.innerHTML = `
            <label class="form-check-label">
                <input class="form-check-input me-2"
                    type="checkbox"
                    ${isChecked}
                    onchange="toggleCity(${index}, this.checked)">
                ${city}
            </label>
        `;

        container.appendChild(div);
    });

    updateProgress();
}


// ==============================
// 📋 COPY
// ==============================
function copyMessage() {
    const el = document.getElementById("generated-message");
    if (!el) return;

    navigator.clipboard.writeText(el.value)
        .then(() => showAppAlert("Report Copied!"))
        .catch(() => showAppAlert("Copy failed!", "error"));
}