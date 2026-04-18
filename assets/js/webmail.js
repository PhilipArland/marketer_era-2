function initWebmail() {
    console.log("Webmail page initialized");

    const subjectInput = document.getElementById("set_subject");
    const messageInput = document.getElementById("set_message");
    const companyInput = document.getElementById("set_company");

    const subjectTemplate = localStorage.getItem("email_subject") || "";
    const messageTemplate = localStorage.getItem("email_message") || "";

    function applyTemplate() {
        const company = companyInput.value || "";

        // replace ALL {{company}}
        const subject = subjectTemplate.replace(/{{company}}/gi, company);
        const message = messageTemplate.replace(/{{company}}/gi, company);

        subjectInput.value = subject;
        messageInput.value = message;
    }

    // initial load
    applyTemplate();

    // update when typing company
    if (companyInput) {
        companyInput.addEventListener("input", applyTemplate);
    }
}