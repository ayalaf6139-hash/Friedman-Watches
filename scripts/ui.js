// פונקציות תצוגה משותפות לכל העמודים

const createEl = (tag, className = '', text = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== '') element.textContent = text;
    return element;
};

const formatPrice = (amount) =>
    `₪${Number(amount).toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString('he-IL');

const yesNo = (value) => (value ? 'כן' : 'לא');

// הודעה זמנית שנעלמת אוטומטית לאחר מספר שניות
const showMessage = (text, type = 'success') => {
    const toast = createEl('div', `toast toast-${type}`, text);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), MESSAGE_DURATION);
};

// הגנה על עמוד: רק משתמש מחובר עם תפקיד מורשה יכול לצפות בו
const requireAccess = (allowedRoles) => {
    const role = getLoggedUserRole();
    if (!getLoggedUserId() || !role) {
        alert('אינך מחובר למערכת! מועבר לדף התחברות');
        window.location.replace('login.html');
        return false;
    }
    if (!allowedRoles.includes(role)) {
        alert('אין לך הרשאה לצפות בעמוד זה');
        window.location.replace('home.html');
        return false;
    }
    return true;
};

// קריאה ועדכון של פרמטרים בכתובת העמוד (URL)
const getUrlParam = (name, defaultValue = '') =>
    new URLSearchParams(window.location.search).get(name) || defaultValue;

const setUrlParams = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== 'default') searchParams.set(key, value);
    });
    const query = searchParams.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
};

const fillSelect = (select, options) => {
    Object.entries(options).forEach(([value, label]) => {
        const option = createEl('option', '', label);
        option.value = value;
        select.appendChild(option);
    });
};

const createTableRow = (cells, cellTag = 'td') => {
    const row = document.createElement('tr');
    cells.forEach(content => {
        const cell = document.createElement(cellTag);
        cell.append(content instanceof Node ? content : String(content));
        row.appendChild(cell);
    });
    return row;
};

const createStatusBadge = (isOn, onText, offText) =>
    createEl('span', `status-badge ${isOn ? 'status-ready' : 'status-wait'}`, isOn ? onText : offText);
