// ==============================
// 🚀 INIT APP
// ==============================
document.addEventListener("DOMContentLoaded", function () {

    fetch('includes/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            initSidebar();
            applySavedUser(); // 🔥 APPLY SAVED NAME

            // restore last page OR default
            const lastPage = localStorage.getItem("lastPage") || "dashboard.html";
            loadPage(lastPage);
        });
});


// ==============================
// 📄 PAGE LOADER
// ==============================
function loadPage(page) {
    const container = document.getElementById('main-content');
    if (!container) return;

    // save last page
    localStorage.setItem("lastPage", page);

    fetch('pages/' + page)
        .then(res => {
            if (!res.ok) throw new Error("Page not found");
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;

            handlePageScripts(page);
            updateActiveSidebar(page);
        })
        .catch(err => {
            container.innerHTML = "<h2>Error loading page</h2>";
            console.error(err);
        });
}


// ==============================
// 📌 SIDEBAR INIT
// ==============================
function initSidebar() {
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const page = this.getAttribute('data-page');
            if (!page) return;

            loadPage(page);
        });
    });

    const lastPage = localStorage.getItem("lastPage") || "dashboard.html";
    updateActiveSidebar(lastPage);
}


// ==============================
// 🔥 ACTIVE STATE HANDLER
// ==============================
function updateActiveSidebar(page) {
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');

        if (btn.getAttribute("data-page") === page) {
            btn.classList.add("active");
        }
    });
}


// ==============================
// 📦 PAGE SCRIPTS LOADER
// ==============================
function handlePageScripts(page) {

    const oldScript = document.getElementById('page-script');
    if (oldScript) oldScript.remove();

    let scriptSrc = "";

    switch (page) {
        case 'dashboard.html':
            scriptSrc = 'assets/js/dashboard.js';
            break;

        case 'settings.html':
            scriptSrc = 'assets/js/settings.js';
            break;

        case 'email.html':
            scriptSrc = 'assets/js/email.js';
            break;

        case 'webmail.html':
            scriptSrc = 'assets/js/webmail.js';
            break;
    }

    if (!scriptSrc) return;

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.id = 'page-script';

    script.onload = () => {
        if (page === 'dashboard.html' && typeof initDashboard === "function") {
            initDashboard();
        } else if (page === 'settings.html' && typeof initSettings === "function") {
            initSettings();
        } else if (page === 'email.html' && typeof initEmail === "function") {
            initEmail();
        } else if (page === 'webmail.html' && typeof initWebmail === "function") {
            initWebmail();
        }
    };

    document.body.appendChild(script);
}


// ==============================
// 👤 APPLY SAVED USER (GLOBAL)
// ==============================
function applySavedUser() {
    const savedName = localStorage.getItem("user_name");

    const userNameEl = document.querySelector(".user-name");
    const avatar = document.querySelector(".user-ava");

    if (savedName) {
        if (userNameEl) userNameEl.textContent = savedName;
        if (avatar) avatar.textContent = savedName.charAt(0).toUpperCase();
    } else {
        if (userNameEl) userNameEl.textContent = "User";
        if (avatar) avatar.textContent = "U";
    }
}


// ==============================
// 🔄 UPDATE USER (REAL-TIME)
// ==============================
function updateUserName(name) {
    const userNameEl = document.querySelector(".user-name");
    const avatar = document.querySelector(".user-ava");

    if (userNameEl) userNameEl.textContent = name || "User";
    if (avatar) avatar.textContent = name ? name.charAt(0).toUpperCase() : "U";
}

function getUserName() {
    return localStorage.getItem("user_name") || "User";
}