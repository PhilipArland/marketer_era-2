function initWebmail() {
    console.log("Webmail page initialized");

    const subjectInput = document.getElementById("set_subject");
    const messageInput = document.getElementById("set_message");
    const companyInput = document.getElementById("set_company");

    const subjectTemplate = localStorage.getItem("email_subject") || "";
    const messageTemplate = localStorage.getItem("email_message") || "";

    // restore saved company name
    const savedCompany = localStorage.getItem("webmail_company") || "";
    if (companyInput) {
        companyInput.value = savedCompany;
    }

    function cleanCompany(value) {
        return value.trim().replace(/\s+/g, " ") || "Company";
    }

    function applyTemplate() {
        const company = cleanCompany(companyInput.value);

        const subject = subjectTemplate.replace(/{{company}}/gi, company);
        const message = messageTemplate.replace(/{{company}}/gi, company);

        subjectInput.value = subject;
        messageInput.value = message;
    }

    // initial render
    applyTemplate();

    // update live + save
    if (companyInput) {
        companyInput.addEventListener("input", () => {
            const cleaned = cleanCompany(companyInput.value);

            // save to localStorage
            localStorage.setItem("webmail_company", cleaned);

            // update UI
            applyTemplate();
        });
    }
}

function copyToClipboard(id) {
    const el = document.getElementById(id);
    if (!el) return;

    navigator.clipboard.writeText(el.value)
        .then(() => {
            if (id === "set_message") {
                showAppAlert("Message copied!");
            } else if (id === "set_subject") {
                showAppAlert("Subject copied!");
            } else {
                showAppAlert("Failed to copy!");
            }
        });
}