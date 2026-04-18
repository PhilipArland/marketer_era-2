document.addEventListener("DOMContentLoaded", function () {

    // Load sidebar first
    fetch('includes/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            // Attach sidebar events AFTER load
            initSidebar();
        });

    // Load default page
    loadPage('dashboard.html');
});


// ✅ Page loader (GLOBAL)
function loadPage(page) {
    const container = document.getElementById('main-content');
    container.innerHTML = "Loading...";

    fetch('pages/' + page)
        .then(res => {
            if (!res.ok) throw new Error("Page not found");
            return res.text();
        })
        .then(data => {
            container.innerHTML = data;

            // 🔥 Load page-specific JS
            handlePageScripts(page);
        })
        .catch(err => {
            container.innerHTML = "<h2>Error loading page</h2>";
            console.error(err);
        });
}


// ✅ Handles per-page JS loading
function handlePageScripts(page) {

    // Remove old page scripts (prevents duplicates)
    const oldScript = document.getElementById('page-script');
    if (oldScript) oldScript.remove();

    let scriptSrc = "";

    switch (page) {
        case 'dashboard.html':
            scriptSrc = 'assets/js/dashboard.js';
            break;

        // future pages here
        // case 'reports.html':
        //     scriptSrc = 'assets/js/reports.js';
        //     break;
    }

    if (!scriptSrc) return;

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.id = 'page-script';

    script.onload = () => {
        // Call init function safely
        if (typeof initDashboard === "function" && page === 'dashboard.html') {
            initDashboard();
        }
    };

    document.body.appendChild(script);
}


// ✅ Sidebar logic
function initSidebar() {
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {

            // Remove active from all
            buttons.forEach(b => b.classList.remove('active'));

            // Add active to clicked
            this.classList.add('active');

            const page = this.getAttribute('data-page');

            if (page) {
                loadPage(page);
            }
        });
    });
}