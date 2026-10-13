// עמוד מעקב משתמשים (צוות בלבד) - רשימת המשתמשים מהחדש לישן, מחיקה למנהל בלבד

const hasUsersAccess = requireAccess(STAFF_ROLES);

const usersState = {
    role: getUrlParam('role', 'all'),
    search: getUrlParam('search')
};

const filterUsers = (list, { role, search }) => {
    const term = search.trim().toLowerCase();
    return list.filter(user =>
        (role === 'all' || user.role === role) &&
        [getFullName(user), user.tz, user.email].some(field => String(field || '').toLowerCase().includes(term)));
};

function handleDeleteUser(user) {
    if (!confirm(`האם למחוק את המשתמש ${getFullName(user)}?`)) return;
    deleteUser(user.tz);
    removeCart(user.tz);
    renderUsers();
    showMessage('המשתמש נמחק מהמערכת');
}

function createUserActions(user) {
    const canDelete = getLoggedUserRole() === ROLES.admin && user.tz !== getLoggedUserId();
    if (!canDelete) return '-';

    const button = createEl('button', 'table-btn table-btn-danger', 'מחק');
    button.type = 'button';
    button.addEventListener('click', () => handleDeleteUser(user));
    return button;
}

function createNameCell(user) {
    const cell = createEl('div', '', getFullName(user));
    if (isNewUser(user)) {
        cell.append(' ', createStatusBadge(true, 'חדש', ''));
    }
    return cell;
}

function renderUsers() {
    const allUsers = getUsers();
    const users = sortByDateDesc(filterUsers(allUsers, usersState), 'createdAt');
    const container = document.getElementById('usersContainer');

    document.getElementById('usersSummary').textContent =
        `סה"כ ${allUsers.length} משתמשים, מתוכם ${allUsers.filter(isNewUser).length} חדשים (${NEW_USER_DAYS} הימים האחרונים)`;
    setUrlParams(usersState);

    if (users.length === 0) {
        container.replaceChildren(createEl('p', 'empty-message', 'לא נמצאו משתמשים'));
        return;
    }

    const table = createEl('table', 'data-table');
    table.appendChild(createTableRow(
        ['שם', 'ת.ז.', 'דוא"ל', 'טלפון', 'כתובת', 'סוג משתמש', 'תאריך הרשמה', 'פעולות'], 'th'));

    users.forEach(user => {
        table.appendChild(createTableRow([
            createNameCell(user),
            user.tz,
            user.email || '-',
            user.phone || '-',
            user.adress || '-',
            ROLE_NAMES[user.role] || user.role,
            user.createdAt ? formatDate(user.createdAt) : '-',
            createUserActions(user)
        ]));
    });

    container.replaceChildren(table);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasUsersAccess) return;

    const searchInput = document.getElementById('userSearch');
    const roleSelect = document.getElementById('roleFilter');

    fillSelect(roleSelect, ROLE_NAMES);
    searchInput.value = usersState.search;
    roleSelect.value = usersState.role;

    searchInput.addEventListener('input', () => {
        usersState.search = searchInput.value;
        renderUsers();
    });
    roleSelect.addEventListener('change', () => {
        usersState.role = roleSelect.value;
        renderUsers();
    });

    renderUsers();
});
