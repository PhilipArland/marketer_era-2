// ==============================
// ⚙️ INIT SETTINGS
// ==============================
function initSettings() {
    console.log("Settings page initialized");

    // load saved name
    const savedName = localStorage.getItem("user_name");

    if (savedName) {
        const input = document.getElementById("set_name");
        if (input) input.value = savedName;
    }
}


// ==============================
// 💾 SAVE SETTINGS
// ==============================
function saveSettings() {
    const input = document.getElementById("set_name");
    if (!input) return;

    const name = input.value.trim();

    // save to localStorage
    localStorage.setItem("user_name", name);

    // update sidebar instantly
    updateUserName(name);

    alert("Settings saved!");
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