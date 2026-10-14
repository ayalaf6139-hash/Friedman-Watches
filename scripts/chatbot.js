// עוזר וירטואלי - חלון צ'אט שעונה על שאלות נפוצות לפי מילות מפתח ומחפש שעונים במלאי
// הקובץ טוען את עיצוב הצ'אט בעצמו, כך שמספיק להוסיף אותו לעמוד אחרי data.js ו-ls.js

const CHAT_MAX_RESULTS = 3;
const CHAT_SHORT_WORD = 3; // מילת מפתח קצרה מזה נחשבת רק כמילה שלמה (כדי ש"הי" לא יימצא בתוך "להירשם")

// ----- מאגר תשובות -----
// כל נושא מכיל מילות מפתח, תשובה ולמי הוא מיועד (guest - לא מחובר, customer - לקוח, staff - עובד/מנהל)
const CHAT_TOPICS = [
    {
        keywords: ['שלום', 'היי', 'הי', 'בוקר טוב', 'ערב טוב', 'אהלן'],
        answer: 'שלום! 😊 במה אפשר לעזור?'
    },
    {
        keywords: ['תודה', 'תודה רבה', 'מעולה', 'סבבה'],
        answer: 'בשמחה! אם יש עוד שאלה - אני כאן ⌚'
    },
    {
        keywords: ['התחבר', 'מתחבר', 'התחברות', 'כניסה', 'להיכנס', 'לוגין', 'login', 'סיסמה', 'סיסמא', 'שם משתמש'],
        answer: 'כדי להיכנס למערכת יש לעבור ל<a href="login.html">עמוד הכניסה</a> ולהזין שם פרטי ושם משפחה עם רווח ביניהם (לדוגמה: דויד כהן) ואת הסיסמה שבחרת בהרשמה. שכחת סיסמה? אפשר לפנות לשירות הלקוחות.'
    },
    {
        keywords: ['הרשמה', 'להירשם', 'נרשם', 'נרשמ', 'חשבון חדש', 'משתמש חדש', 'רישום'],
        answer: 'ההרשמה נעשית ב<a href="signin.html">עמוד ההרשמה</a>: ממלאים שם, טלפון, תעודת זהות, דוא"ל, כתובת וסיסמה. לקוחות משאירים את שדה "קוד מנהל" ריק. עובדים מקבלים את הקוד מהמנהל.'
    },
    {
        keywords: ['התנתק', 'התנתקות', 'יציאה', 'לצאת'],
        answer: 'כדי להתנתק יש לחזור ל<a href="home.html">דף הבית</a> וללחוץ על "התנתקות".'
    },
    {
        roles: ['customer', 'guest'],
        keywords: ['קטלוג', 'שעונים', 'מוצרים', 'דגמים', 'לקנות', 'קנייה', 'מה יש'],
        answer: 'כל השעונים נמצאים ב<a href="katalog.html">קטלוג</a>. אפשר לסנן לפי ילדים / גברים / נשים, לחפש לפי מותג או דגם ולמיין לפי מחיר. אפשר גם לכתוב לי כאן שם של מותג (למשל CASIO) ואחפש בשבילך.'
    },
    {
        roles: ['customer'],
        keywords: ['סל', 'עגלה', 'להוסיף', 'הוספה לסל', 'להסיר', 'כמות'],
        answer: 'בקטלוג לוחצים על "הוסף לסל" ליד השעון. ב<a href="cart.html">סל הקניות</a> אפשר לשנות כמויות, להסיר פריטים או לאפס את הסל, ומשם לעבור לתשלום.'
    },
    {
        roles: ['customer'],
        keywords: ['תשלום', 'לשלם', 'משלמ', 'אשראי', 'ביט', 'bit', 'מזומן', 'צק', "צ'ק", 'העברה בנקאית', 'חשבונית'],
        answer: `ב<a href="payment.html">עמוד התשלום</a> בוחרים אמצעי תשלום: ${Object.values(PAYMENT_METHODS).join(', ')}. המחירים כוללים מע"מ של ${VAT_RATE * 100}%.`
    },
    {
        roles: ['customer'],
        keywords: ['הזמנה', 'הזמנות', 'ההזמנות שלי', 'סטטוס', 'מתי יגיע', 'משלוח', 'היסטוריה'],
        answer: 'את כל ההזמנות שביצעת ואת הסטטוס שלהן אפשר לראות בעמוד <a href="myOrders.html">ההזמנות שלי</a>.'
    },
    {
        roles: ['staff'],
        keywords: ['מלאי', 'להוסיף שעון', 'שעון חדש', 'עדכון מלאי', 'מחיקה', 'למחוק', 'עריכה', 'לערוך'],
        answer: 'ב<a href="stock.html">עמוד ניהול המלאי</a> אפשר להוסיף שעון חדש בטופס, ולכל שעון ברשימה לעדכן כמות, לערוך פרטים או למחוק. שעונים עם פחות מ-' + LOW_STOCK_LIMIT + ' יחידות נחשבים מלאי נמוך.'
    },
    {
        roles: ['staff'],
        keywords: ['הזמנה', 'הזמנות', 'ניהול הזמנות', 'סטטוס', 'הזמנות לקוחות'],
        answer: 'ב<a href="orders.html">עמוד ניהול ההזמנות</a> רואים את כל הזמנות הלקוחות, אפשר לסנן לפי סטטוס ולחפש. העמוד מתרענן אוטומטית.'
    },
    {
        roles: ['staff'],
        keywords: ['משתמשים', 'לקוחות', 'משתמשים חדשים', 'עובדים', 'נרשמו'],
        answer: `ב<a href="users.html">עמוד מעקב המשתמשים</a> מופיעים כל המשתמשים, עם סינון לפי סוג משתמש. משתמש שנרשם ב-${NEW_USER_DAYS} הימים האחרונים מסומן כחדש.`
    },
    {
        keywords: ['קשר', 'טלפון', 'שירות לקוחות', 'נציג', 'מייל', 'אימייל', 'דואל', 'דוא"ל', 'לדבר'],
        answer: 'שירות הלקוחות זמין בטלפון 📞 1-700-504-289 ובמייל 📧 Friedman-Watches@gmail.com'
    }
];

const CHAT_QUICK_REPLIES = {
    guest: ['איך מתחברים?', 'איך נרשמים?', 'יצירת קשר'],
    customer: ['קטלוג שעונים', 'איך משלמים?', 'ההזמנות שלי', 'יצירת קשר'],
    staff: ['ניהול מלאי', 'ניהול הזמנות', 'משתמשים חדשים', 'מלאי נמוך']
};

const CHAT_FALLBACK = 'לא בטוח שהבנתי 🤔 אפשר לנסח אחרת, לבחור אחת מהאפשרויות למטה, או לפנות לשירות הלקוחות: 📞 1-700-504-289';

// ----- לוגיקה -----

// עמודים שבהם המשתמש תמיד נחשב אורח, גם אם נשאר חיבור קודם ב-LocalStorage
const CHAT_GUEST_PAGES = ['login.html', 'signin.html'];

const getChatAudience = () => {
    const page = window.location.pathname.split('/').pop();
    if (CHAT_GUEST_PAGES.includes(page)) return 'guest';

    // התפקיד נלקח מרשימת המשתמשים ולא רק מהערך השמור, כדי שלא ניתן יהיה "להתחזות" לעובד
    const userId = getLoggedUserId();
    const user = getUsers().find(u => u.tz === userId);
    if (!user || user.role !== getLoggedUserRole()) return 'guest';
    return STAFF_ROLES.includes(user.role) ? 'staff' : 'customer';
};

const hasKeyword = (text, keyword) => {
    const word = keyword.toLowerCase();
    if (word.length > CHAT_SHORT_WORD) return text.includes(word);
    return text.split(/[^a-zא-ת0-9'"]+/).includes(word);
};

const findChatTopic = (text, audience) =>
    CHAT_TOPICS.find(topic =>
        (!topic.roles || topic.roles.includes(audience)) &&
        topic.keywords.some(word => hasKeyword(text, word))
    );

// חיפוש שעונים לפי מותג או דגם שמופיעים בהודעה
const findWatchesInText = (text) =>
    getWatches().filter(w =>
        text.includes(w.brand.toLowerCase()) || text.includes(String(w.model).toLowerCase())
    );

const formatWatchResults = (watches, audience) => {
    const lines = watches.slice(0, CHAT_MAX_RESULTS).map(w => {
        const stock = audience === 'staff'
            ? ` | במלאי: ${w.qtyStock}`
            : (w.qtyStock > 0 ? '' : ' | אזל מהמלאי');
        const name = audience === 'customer'
            ? `<a href="item.html?id=${w.id}">${w.brand} ${w.model}</a>`
            : `${w.brand} ${w.model}`;
        return `• ${name} - ₪${w.price}${stock}`;
    });
    const more = watches.length > CHAT_MAX_RESULTS
        ? `<br>ועוד ${watches.length - CHAT_MAX_RESULTS} דגמים - אפשר לראות הכל ב<a href="katalog.html">קטלוג</a>.`
        : '';
    return `מצאתי ${watches.length} שעונים:<br>${lines.join('<br>')}${more}`;
};

const getLowStockAnswer = () => {
    const lowStock = getWatches().filter(w => w.qtyStock < LOW_STOCK_LIMIT);
    if (!lowStock.length) return 'כל השעונים במלאי תקין 👍';
    const lines = lowStock.map(w => `• ${w.brand} ${w.model} - ${w.qtyStock} יחידות`);
    return `שעונים במלאי נמוך (פחות מ-${LOW_STOCK_LIMIT}):<br>${lines.join('<br>')}<br><a href="stock.html">לעדכון המלאי</a>`;
};

const getChatAnswer = (message) => {
    const text = message.trim().toLowerCase();
    const audience = getChatAudience();

    if (audience === 'staff' && text.includes('מלאי נמוך')) {
        return getLowStockAnswer();
    }

    if (audience !== 'guest') {
        const watches = findWatchesInText(text);
        if (watches.length) return formatWatchResults(watches, audience);
    }

    const topic = findChatTopic(text, audience);
    if (topic) return topic.answer;

    if (audience === 'guest') {
        return 'כדי לראות שעונים ולבצע הזמנות יש <a href="login.html">להתחבר</a> או <a href="signin.html">להירשם</a>. ' + CHAT_FALLBACK;
    }
    return CHAT_FALLBACK;
};

// ----- תצוגה -----

const loadChatStyles = () => {
    const scriptSrc = document.querySelector('script[src*="chatbot.js"]')?.getAttribute('src') || '';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = scriptSrc.replace('scripts/chatbot.js', 'styles/chatbot.css');
    document.head.appendChild(link);
};

const addChatMessage = (list, content, from) => {
    const bubble = document.createElement('div');
    bubble.className = `chat-msg chat-msg-${from}`;
    // הודעות המשתמש מוצגות כטקסט בלבד, תשובות הבוט יכולות לכלול קישורים
    if (from === 'user') {
        bubble.textContent = content;
    } else {
        bubble.innerHTML = content;
    }
    list.appendChild(bubble);
    list.scrollTop = list.scrollHeight;
};

const createChatbot = () => {
    loadChatStyles();

    const widget = document.createElement('div');
    widget.className = 'chatbot';
    widget.innerHTML = `
        <div class="chat-panel" hidden>
            <div class="chat-header">
                <span>⌚ העוזר של Friedman Watches</span>
                <button type="button" class="chat-close" aria-label="סגירה">✕</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-quick"></div>
            <form class="chat-form">
                <input type="text" class="chat-input" placeholder="כתבו שאלה..." autocomplete="off">
                <button type="submit" class="chat-send">שליחה</button>
            </form>
        </div>
        <button type="button" class="chat-toggle" aria-label="עזרה">💬</button>
    `;
    document.body.appendChild(widget);

    const panel = widget.querySelector('.chat-panel');
    const messages = widget.querySelector('.chat-messages');
    const quick = widget.querySelector('.chat-quick');
    const form = widget.querySelector('.chat-form');
    const input = widget.querySelector('.chat-input');

    const ask = (question) => {
        addChatMessage(messages, question, 'user');
        addChatMessage(messages, getChatAnswer(question), 'bot');
    };

    CHAT_QUICK_REPLIES[getChatAudience()].forEach(label => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chat-chip';
        chip.textContent = label;
        chip.addEventListener('click', () => ask(label));
        quick.appendChild(chip);
    });

    addChatMessage(messages, 'שלום! אני העוזר הווירטואלי של Friedman Watches. במה אפשר לעזור?', 'bot');

    const togglePanel = (open) => {
        panel.hidden = !open;
        if (open) input.focus();
    };

    widget.querySelector('.chat-toggle').addEventListener('click', () => togglePanel(panel.hidden));
    widget.querySelector('.chat-close').addEventListener('click', () => togglePanel(false));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        ask(question);
        input.value = '';
    });
};

document.addEventListener('DOMContentLoaded', createChatbot);
