document.addEventListener('DOMContentLoaded', () => {
    const userRole = getLoggedUserRole();
    const userId = getLoggedUserId();

    if (!userId || !userRole) {
        alert("אינך מחובר למערכת! מועבר לדף התחברות");
        window.location.href = "../indexes/login.html";
        return;
    }

    // הצגת הכפתורים המתאימים להרשאות המשתמש בלבד
    const isStaffUser = STAFF_ROLES.includes(userRole);
    document.querySelectorAll('.admin-only').forEach(btn => {
        btn.style.setProperty('display', isStaffUser ? 'inline-block' : 'none', 'important');
    });
    document.querySelectorAll('.customer-only').forEach(btn => {
        btn.style.setProperty('display', isStaffUser ? 'none' : 'inline-block', 'important');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        logoutUserFromLS();
        alert("התנתקת מהמערכת בהצלחה.");
        window.location.href = "../indexes/login.html";
    });
});
