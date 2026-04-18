// ==============================
// ⚙️ INIT SETTINGS
// ==============================
function initSettings() {
    console.log("Settings page initialized");

    // NAME
    const savedName = localStorage.getItem("user_name");
    if (savedName) {
        const input = document.getElementById("set_name");
        if (input) input.value = savedName;
    }

    // SUBJECT
    const savedSubject = localStorage.getItem("email_subject");
    if (savedSubject) {
        const subjectInput = document.getElementById("set_subject");
        if (subjectInput) subjectInput.value = savedSubject;
    }

    // MESSAGE
    const savedMessage = localStorage.getItem("email_message");
    if (savedMessage) {
        const messageInput = document.getElementById("set_message");
        if (messageInput) messageInput.value = savedMessage;
    }
}

// ==============================
// 💾 SAVE SETTINGS
// ==============================
function saveSettings() {
    const nameInput = document.getElementById("set_name");
    const subjectInput = document.getElementById("set_subject");
    const messageInput = document.getElementById("set_message");

    const name = nameInput?.value.trim() || "";
    const subject = subjectInput?.value || "";
    const message = messageInput?.value || "";

    // SAVE EVERYTHING
    localStorage.setItem("user_name", name);
    localStorage.setItem("email_subject", subject);
    localStorage.setItem("email_message", message);

    updateUserName(name);

    showAppAlert("Settings saved!");
}


// ==============================
// 🔄 RESET SETTINGS
// ==============================
function resetSettings() {
    localStorage.removeItem("user_name");

    const input = document.getElementById("set_name");
    if (input) input.value = "";

    updateUserName("User");
}


// ==============================
// 🔁 UPDATE SIDEBAR NAME
// ==============================
function updateUserName(name) {
    const userNameEl = document.querySelector(".user-name");

    if (userNameEl) {
        userNameEl.textContent = name || "User";
    }

    // also update avatar letter
    const avatar = document.querySelector(".user-ava");
    if (avatar) {
        avatar.textContent = name ? name.charAt(0).toUpperCase() : "U";
    }
}