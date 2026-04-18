let emailState = {
    count: 0,
    history: []
};

function getToday() {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

function initEmail() {
    console.log("Email page initialized");

    const today = getToday();

    const savedCount = localStorage.getItem("email_count");
    const savedDate = localStorage.getItem("email_date");
    const savedHistory = localStorage.getItem("email_history");

    if (savedDate !== today) {
        emailState.count = 0;
        emailState.history = [];

        saveState();
    } else {
        emailState.count = savedCount ? parseInt(savedCount) : 0;
        emailState.history = savedHistory ? JSON.parse(savedHistory) : [];
    }

    renderEmail();
}

function saveState() {
    localStorage.setItem("email_count", emailState.count);
    localStorage.setItem("email_date", getToday());
    localStorage.setItem("email_history", JSON.stringify(emailState.history));
}

function renderEmail() {
    const textarea = document.getElementById("email_report");
    if (!textarea) return;

    const name = localStorage.getItem("user_name") || "User";

    textarea.value = `Hi, I already sent ${emailState.count} emails.\n\n- ${name}`;
}

function addEmails() {
    emailState.history.push(emailState.count);

    emailState.count += 50;

    saveState();
    renderEmail();
}

function undoEmail() {
    if (emailState.history.length === 0) return;

    emailState.count = emailState.history.pop();

    saveState();
    renderEmail();
}

function clearReport() {
    emailState.history.push(emailState.count);

    emailState.count = 0;

    saveState();
    renderEmail();
}

function copyToClipboard(id) {
    const el = document.getElementById(id);
    if (!el) return;

    navigator.clipboard.writeText(el.value)
        .then(() => {
            if (id === "email_report") {
                showAppAlert("Report copied!");
            } else {
                showAppAlert("Copied!");
            }
        })
        .catch(() => {
            showAppAlert("Failed to copy!");
        });
}