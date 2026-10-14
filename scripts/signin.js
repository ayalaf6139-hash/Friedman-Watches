// כניסה לעמוד מנתקת חיבור קודם שנשאר שמור, כדי שהרשאות של משתמש קודם לא יישארו פעילות
logoutUserFromLS();

// פונקציה שמטפלת ברישום החיבור ב-LocalStorage וניתוב המשתמש החדש
const loginUser = (tz, role) => {
    loginUserToLS(tz, role);
    alert(`ההרשמה בוצעה בהצלחה! נרשמת כ${ROLE_NAMES[role]}.`);

    // בדיקה שהערכים אכן נשמרו בהצלחה ב-LocalStorage
    if (getLoggedUserId()) {
        window.location.href = "../indexes/home.html";
    } else {
        alert("שגיאה ברישום המשתמש במערכת.");
    }
};

// האזנה לאירוע שליחת טופס ההרשמה
document.getElementById('signin')?.addEventListener('submit', (e) => {
    e.preventDefault();

    // המרת נתוני הטופס לאובייקט וניקוי רווחים
    const data = Object.fromEntries(
        [...new FormData(e.target)].map(([key, value]) => [key, value.trim()])
    );

    // 1. בדיקות תקינות (Regex) לשדות הטופס
    const error = validateFields(data, SIGNIN_RULES);
    if (error) {
        return alert(error);
    }

    // 2. בדיקה שתעודת הזהות ושם המשתמש אינם קיימים כבר במערכת (הכניסה מתבצעת לפי שם)
    if (getUsers().some(x => x.tz === data.tz)) {
        return alert('משתמש עם תעודת זהות זו כבר קיים במערכת!');
    }
    if (findUserByName(`${data.firstName} ${data.lastName}`)) {
        return alert('משתמש עם שם זה כבר קיים במערכת! נא להתחבר או להירשם בשם אחר.');
    }

    // 3. בדיקה והשוואה בין שדות הסיסמה
    if (data.password !== data.confirmPassword) {
        return alert('הסיסמאות שהוקלדו אינן תואמות!');
    }

    // 4. קביעת התפקיד לפי קוד העובדים (ללא קוד - לקוח רגיל)
    if (data.adminPassword && !ROLE_CODES[data.adminPassword]) {
        return alert("קוד מנהל שגוי! לא ניתן להירשם כצוות עובדים ללא קוד תקין.");
    }
    const role = ROLE_CODES[data.adminPassword] || ROLES.customer;

    // 5. שמירת המשתמש החדש לתוך מאגר המשתמשים ב-LocalStorage
    const { confirmPassword, adminPassword, ...userData } = data;
    addUser({ ...userData, role, createdAt: new Date().toISOString() });

    // 6. ביצוע כניסה אוטומטית למערכת וניתוב לדף הבית
    loginUser(data.tz, role);
});
