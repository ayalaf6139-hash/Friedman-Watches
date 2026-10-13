// קובץ נתונים - נתוני פתיחה של המערכת וקבועים כלליים

const ROLES = {
    admin: 'admin',       // מנהל החברה
    staff: 'subAdmin',    // צוות עובדים
    customer: 'user'      // לקוח סיטונאי
};

const STAFF_ROLES = [ROLES.admin, ROLES.staff];
const CUSTOMER_ROLES = [ROLES.customer];

// קודי הרשמה לעובדים - הקוד שהוזן בטופס ההרשמה קובע את סוג המשתמש
const ROLE_CODES = {
    'ayala6139': ROLES.admin,
    'staff2026': ROLES.staff
};

const ROLE_NAMES = {
    [ROLES.admin]: 'מנהל',
    [ROLES.staff]: 'צוות עובדים',
    [ROLES.customer]: 'לקוח'
};

const VAT_RATE = 0.18;
const FIRST_ORDER_NUMBER = 1256;
const LOW_STOCK_LIMIT = 5;
const DEFAULT_IMAGE = '../images/לעיצוב/logo.png';
const MESSAGE_DURATION = 3000;      // משך הצגת הודעה זמנית (מילישניות)
const ORDERS_REFRESH_INTERVAL = 5000; // רענון אוטומטי של עמוד ההזמנות
const NEW_USER_DAYS = 7;            // משתמש שנרשם בימים האחרונים נחשב "חדש"

const CATEGORIES = {
    'ילדים': 'שעוני ילדים',
    'גברים': 'שעוני גברים',
    'נשים': 'שעוני נשים'
};

const SORT_OPTIONS = {
    default: 'מיון: ברירת מחדל',
    priceAsc: 'מחיר: מהנמוך לגבוה',
    priceDesc: 'מחיר: מהגבוה לנמוך',
    brand: 'מותג: א-ת'
};

const PAYMENT_METHODS = {
    credit: 'כרטיס אשראי',
    bit: 'BIT',
    cash: 'מזומן',
    check: "צ'ק",
    transfer: 'העברה בנקאית'
};

const initialWatches = [
    { id: 1, brand: "DUCASIT", model: "D791", category: "נשים", price: 200, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 74, image: "../images/שעונים/שעוני נשים/שעון דוכסית כסוף - DUCASIT.png" },
    { id: 2, brand: "GALLERY", model: "G117", category: "נשים", price: 150, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 5, image: "../images/שעונים/שעוני נשים/שעוני גלרי כסוף - GALLERY.png" },
    { id: 3, brand: "ADI", model: "A4562", category: "נשים", price: 399, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 21, image: "../images/שעונים/שעוני נשים/שעון אישה צמיד - ADI.png" },
    { id: 4, brand: "OBAKU", model: "543", category: "נשים", price: 550, description: "שעון אובקו כסוף - OBAKU", qtyStock: 74, image: "../images/שעונים/שעוני נשים/שעון אובקו כסוף - OBAKU.png" },
    { id: 5, brand: "CALVIN KLEIN", model: "CK17", category: "נשים", price: 150, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 5, image: "../images/שעונים/שעוני נשים/שעון כסוף רשת - CALVIN KLEIN.png" },
    { id: 6, brand: "CASIO", model: "LTP-1475", category: "נשים", price: 550, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 74, image: "../images/שעונים/שעוני נשים/שעון מרובע כסוף.png" },
    { id: 7, brand: "MICHAEL KORS", model: "MK6529", category: "נשים", price: 399, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 21, image: "../images/שעונים/שעוני נשים/שעון שילוב כסף ורוזגולד - MICHAEL KORS.png" },
    { id: 8, brand: "ROLEX", model: "R1278", category: "נשים", price: 450, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 8, image: "../images/שעונים/שעוני נשים/שעון נשים - ROLEX - שילוב כסף ורוזגולד.png" },
    { id: 9, brand: "RADO", model: "R1279", category: "נשים", price: 450, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 8, image: "../images/שעונים/שעוני נשים/שעון מרהיב בשילוב של שחור ורוזגולד.png" },
    { id: 10, brand: "PIERE FICHARDEN", model: "PF7845", category: "נשים", price: 200, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 74, image: "../images/שעונים/שעוני נשים/שעון דיגיטלי - PIERE FICHARDEN.png" },
    { id: 11, brand: "ICE", model: "I67540", category: "ילדים", price: 100, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 8, image: "../images/שעונים/שעוני ילדים/שעון ICE - צבע ורוד.png" },
    { id: 12, brand: "CLEVERWATCH", model: "I67584", category: "ילדים", price: 100, description: "שעון חכם עגול + מד בריאות", qtyStock: 63, image: "../images/שעונים/שעוני ילדים/שעון חכם - עגול + מד בריאות.png" },
    { id: 13, brand: "ANY", model: "ANY222", category: "ילדים", price: 170, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 3, image: "../images/שעונים/שעוני ילדים/שעון חכם - שחור.png" },
    { id: 14, brand: "ICE", model: "I67544", category: "ילדים", price: 100, description: "שעון חכם דגם אליפז - שחור", qtyStock: 63, image: "../images/שעונים/שעוני ילדים/שעון חכם - דגם אליפז - שחור.png" },
    { id: 15, brand: "ICE", model: "I67543", category: "ילדים", price: 100, description: "שעון חכם דגם אליפז - לבן", qtyStock: 8, image: "../images/שעונים/שעוני ילדים/שעון חכם - דגם אליפז  - לבן.png" },
    { id: 16, brand: "ANY", model: "ANY333", category: "ילדים", price: 170, description: "שעון חכם קיים בשלושה צבעים", qtyStock: 3, image: "../images/שעונים/שעוני ילדים/שעון חכם קיים בשלושה צבעים.png" },
    { id: 17, brand: "QQ", model: "7543", category: "ילדים", price: 299, description: "שעון עמיד למים למתאמן", qtyStock: 74, image: "../images/שעונים/שעוני ילדים/שעוני QQ נגד מים.png" },
    { id: 18, brand: "CLEVERWATCH", model: "clever741", category: "ילדים", price: 460, description: "שעון חמצוץ", qtyStock: 2, image: "../images/שעונים/שעוני ילדים/שעון חמצוץ.png" },
    { id: 19, brand: "CLEVERWATCH", model: "cleverPink", category: "ילדים", price: 460, description: "שעון חכם ורוד", qtyStock: 42, image: "../images/שעונים/שעוני ילדים/שעון חכם - מרובע ורוד.png" },
    { id: 20, brand: "CLEVERWATCH", model: "cleverLightBlue", category: "ילדים", price: 460, description: "שעון חכם תכלת", qtyStock: 8, image: "../images/שעונים/שעוני ילדים/שעון חכם - מרובע תכלת.png" },
    { id: 21, brand: "CLEVERWATCH", model: "cleverBlack", category: "ילדים", price: 720, description: "שעון חכם שחור", qtyStock: 5, image: "../images/שעונים/שעוני ילדים/שעון חכם מרובע שחור (1).png" },
    { id: 22, brand: "RADO", model: "R2275", category: "גברים", price: 640, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 80, image: "../images/שעונים/שעוני גברים/שעון עור - RADO.png" },
    { id: 23, brand: "CHENXI", model: "CNX2", category: "גברים", price: 399, description: "שילוב זהב וכסף", qtyStock: 94, image: "../images/שעונים/שעוני גברים/CHENXI- שילוב זהב וכסף.png" },
    { id: 24, brand: "GANT", model: "GNT67543", category: "גברים", price: 720, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 1, image: "../images/שעונים/שעוני גברים/שעון עור - GANT.png" },
    { id: 25, brand: "PLATINIUM", model: "PL270", category: "גברים", price: 700, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 14, image: "../images/שעונים/שעוני גברים/שעון עור - PLATINIUM.png" },
    { id: 26, brand: "HILFIGER", model: "TH1700", category: "גברים", price: 399, description: "שעון גבר כסוף לוח כחול", qtyStock: 74, image: "../images/שעונים/שעוני גברים/שעון גבר כסוף לוח כחול - HILFIGER.png" },
    { id: 27, brand: "CITIZEN", model: "67543", category: "גברים", price: 700, description: "שעון גברים, רצועת עור שחורה, 10ATM - שטיפת ידיים", qtyStock: 74, image: "../images/שעונים/שעוני גברים/שעון עור שחור - CITIZEN.png" },
    { id: 28, brand: "ROLEX", model: "RX2026", category: "גברים", price: 950, description: "שעון ROLEX דגם 2026", qtyStock: 6, image: "../images/שעונים/שעוני גברים/שעון ROLEX דגם 2026.png" },
    { id: 29, brand: "FOSSIL", model: "FS5011", category: "גברים", price: 499, description: "שעון כסף לוח אדום", qtyStock: 20, image: "../images/שעונים/שעוני גברים/שעון FOSIL - כסף לוח אדום.png" },
    { id: 30, brand: "GC", model: "GC7854", category: "גברים", price: 720, description: "שעון עור לוח לבן", qtyStock: 1, image: "../images/שעונים/שעוני גברים/שעון עור לוח לבן - GC.png" },
    { id: 31, brand: "CASIO", model: "MTP-F91", category: "גברים", price: 399, description: "10ATM - נגד מים בשטיפת ידיים", qtyStock: 74, image: "../images/שעונים/שעוני גברים/שעון CASIO - MTP-F91.png" }
];

const initialUsers = [
    { firstName: "דויד", lastName: "כהן", tz: "123", password: "1234", email: "dc@gmail.com", phone: "050-1234567", adress: "ירושלים", role: ROLES.customer, createdAt: "2026-05-01T10:00:00.000Z" },
    { firstName: "אסתר", lastName: "לוי", tz: "456", password: "5678", email: "el2929@gmail.com", phone: "052-7654321", adress: "בני ברק", role: ROLES.staff, createdAt: "2026-05-01T10:00:00.000Z" },
    { firstName: "אילה", lastName: "פרידמן", tz: "216338376", password: "ayala6139", email: "ayala.f.6139@gmail.com", phone: "", adress: "", role: ROLES.admin, createdAt: "2026-05-01T10:00:00.000Z" }
];

// טעינת נתוני הפתיחה ל-LocalStorage רק אם עדיין לא קיימים
const addAllDataToLs = () => {
    if (!localStorage.getItem('watches')) {
        localStorage.setItem('watches', JSON.stringify(initialWatches));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(initialUsers));
    } else if (!localStorage.getItem('initialUsersAdded_v2')) {
        // אם כבר נשמרו משתמשים לפני כן - עדכון משתמשי הפתיחה לנתונים הנכונים (פעם אחת בלבד)
        let savedUsers = [];
        try {
            savedUsers = JSON.parse(localStorage.getItem('users')) || [];
        } catch { }
        const otherUsers = savedUsers.filter(s => !initialUsers.some(u => u.tz === s.tz));
        localStorage.setItem('users', JSON.stringify([...otherUsers, ...initialUsers]));
    }
    localStorage.setItem('initialUsersAdded_v2', 'true');
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
};

addAllDataToLs();
