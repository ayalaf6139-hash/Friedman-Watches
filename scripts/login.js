// תבנית ריג'קס המצפה למילה ראשונה, רווח אחד או יותר, ומילה שנייה (תומך בעברית ואנגלית)
const fullNameRegex = /^[a-zA-Zא-ת]+[\s]+[a-zA-Zא-ת]+/;

// פונקציה מרכזית לניהול הניתוב והבדיקה לאחר התחברות
const loginUser = (tz, role) => {
    loginUserToLS(tz, role); // שמירה ב-LocalStorage
    
    // בדיקה שהערכים אכן נשמרו בהצלחה ב-LocalStorage
    const loggedInTz = getLoggedUserId();
    
    if (loggedInTz) {
        window.location.href = "../indexes/home.html"; 
    } else {
        alert("שגיאה ברישום המשתמש במערכת.");
    }
};

document.getElementById('login')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUsers = getUsers() || [];
    const data = Object.fromEntries(new FormData(e.target));

    const typedName = data.fullName?.trim();

    // 1. בדיקה באמצעות ריג'קס שהמשתמש אכן הקליד גם שם פרטי וגם שם משפחה בשדה
    if (!fullNameRegex.test(typedName)) {
        alert("נא להזין שם פרטי ושם משפחה עם רווח ביניהם (לדוגמה: דויד כהן)");
        return;
    }

    // 2. חיפוש המשתמש במערך (נחבר את firstName ו-lastName לצורך ההשוואה)
    const foundUser = currentUsers.find(x => {
        const dbFullName = `${x.firstName?.trim()} ${x.lastName?.trim()}`.toLowerCase();
        return dbFullName === typedName.toLowerCase() && x.password?.toString() === data.password?.toString();
    });

    if (!foundUser) {
        alert("שם משתמש או סיסמה שגויים!");
        return;
    }

    // 3. הצגת הודעת הצלחה וקריאה לפונקציית הניתוב הדינמית
    alert(`ברוך הבא ${foundUser.firstName} ${foundUser.lastName}`);
    
    // תיקון: הפעלת פונקציית הניתוב שהגדרת כדי להעביר את המשתמש לדף הבית
    loginUser(foundUser.tz, foundUser.role);
});