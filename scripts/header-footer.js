function loadHeader(pageTitle = null) {
    const title = pageTitle || document.querySelector('title').textContent;
    const homePage = getLoggedUserId() ? 'home.html' : '../index.html';

    const headerHTML = `
        <a href="${homePage}" title="לדף הבית">
            <img src="../images/לעיצוב/logo.png" alt="Friedman Watches Logo" class="logo">
        </a>
        <h1>${title}</h1>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = headerHTML;
    }
}

function loadFooter() {
    const footerHTML = `
        <div>
            <p class="p_footer">📞 שירות לקוחות: 1-700-504-289 | 🕒 <span id="clock"></span></p>
            <p class="p_footer">📧 Friedman-Watches@gmail.com</p>
            <img src="../images/לעיצוב/contact.png" alt="סמלים">
        </div>
    `;

    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = footerHTML;
        startClock(footer.querySelector('#clock'));
    }
}

// שעון חי שמתעדכן כל שנייה
function startClock(clockElement) {
    const tick = () => {
        clockElement.textContent = new Date().toLocaleTimeString('he-IL');
    };
    tick();
    setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});
