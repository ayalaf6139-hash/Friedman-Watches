// לוגיקה עסקית - משתמשים, שעונים, סל קניות והזמנות (ללא קוד תצוגה)

// ----- ולידציה -----
const PATTERNS = {
    name: /^[a-zA-Zא-ת][a-zA-Zא-ת '-]+$/,
    tz: /^\d{9}$/,
    phone: /^0\d{1,2}-?\d{7}$/,
    mobile: /^05\d-?\d{7}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    password: /^\S{4,}$/,
    brand: /^[a-zA-Z0-9א-ת][a-zA-Z0-9א-ת .&'-]+$/,
    model: /^[a-zA-Z0-9א-ת][a-zA-Z0-9א-ת .\/-]*$/,
    price: /^\d+(\.\d{1,2})?$/,
    quantity: /^\d+$/,
    category: new RegExp(`^(${Object.keys(CATEGORIES).join('|')})$`),
    cardNumber: /^\d{16}$/,
    expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
    cvv: /^\d{3,4}$/,
    checkNumber: /^\d{4,10}$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    bank: /^\d{2}$/,
    branch: /^\d{3}$/,
    account: /^\d{4,10}$/
};

// בודק אובייקט נתונים מול כללים { שדה: { pattern, message, optional } } ומחזיר את הודעת השגיאה הראשונה
const validateFields = (data, rules) => {
    for (const [field, rule] of Object.entries(rules)) {
        const value = String(data[field] ?? '').trim();
        if (rule.optional && value === '') continue;
        if (!rule.pattern.test(value)) return rule.message;
    }
    return '';
};

const SIGNIN_RULES = {
    firstName: { pattern: PATTERNS.name, message: 'שם פרטי חייב להכיל אותיות בלבד (לפחות 2)' },
    lastName: { pattern: PATTERNS.name, message: 'שם משפחה חייב להכיל אותיות בלבד (לפחות 2)' },
    phone: { pattern: PATTERNS.phone, message: 'מספר טלפון לא תקין (לדוגמה: 050-1234567)', optional: true },
    tz: { pattern: PATTERNS.tz, message: 'תעודת זהות חייבת להכיל 9 ספרות' },
    email: { pattern: PATTERNS.email, message: 'כתובת הדוא"ל אינה תקינה' },
    password: { pattern: PATTERNS.password, message: 'הסיסמה חייבת להכיל לפחות 4 תווים ללא רווחים' }
};

const WATCH_RULES = {
    brand: { pattern: PATTERNS.brand, message: 'יש להזין שם מותג תקין (לפחות 2 תווים)' },
    model: { pattern: PATTERNS.model, message: 'יש להזין דגם תקין (אותיות, ספרות ומקפים)' },
    price: { pattern: PATTERNS.price, message: 'המחיר חייב להיות מספר חיובי (עד 2 ספרות אחרי הנקודה)' },
    qtyStock: { pattern: PATTERNS.quantity, message: 'הכמות במלאי חייבת להיות מספר שלם 0 ומעלה' },
    category: { pattern: PATTERNS.category, message: 'יש לבחור קטגוריה' }
};

const PAYMENT_RULES = {
    credit: {
        cardNumber: { pattern: PATTERNS.cardNumber, message: 'מספר כרטיס חייב להכיל 16 ספרות' },
        expiry: { pattern: PATTERNS.expiry, message: 'תוקף הכרטיס חייב להיות בפורמט MM/YY' },
        cvv: { pattern: PATTERNS.cvv, message: 'CVV חייב להכיל 3 או 4 ספרות' },
        holder: { pattern: PATTERNS.name, message: 'יש להזין את שם בעל הכרטיס באותיות בלבד' },
        idNumber: { pattern: PATTERNS.tz, message: 'תעודת זהות של בעל הכרטיס חייבת להכיל 9 ספרות' }
    },
    bit: {
        bitPhone: { pattern: PATTERNS.mobile, message: 'מספר הטלפון ל-BIT חייב להיות נייד תקין (לדוגמה: 050-1234567)' }
    },
    cash: {},
    check: {
        checkNumber: { pattern: PATTERNS.checkNumber, message: "מספר הצ'ק חייב להכיל 4-10 ספרות" },
        dueDate: { pattern: PATTERNS.date, message: "יש לבחור תאריך פירעון לצ'ק" }
    },
    transfer: {
        bank: { pattern: PATTERNS.bank, message: 'מספר בנק חייב להכיל 2 ספרות' },
        branch: { pattern: PATTERNS.branch, message: 'מספר סניף חייב להכיל 3 ספרות' },
        account: { pattern: PATTERNS.account, message: 'מספר חשבון חייב להכיל 4-10 ספרות' }
    }
};

// ----- משתמשים והרשאות -----
const getFullName = (user) => `${user.firstName} ${user.lastName}`.trim();

const getCurrentUser = () => getUsers().find(u => u.tz === getLoggedUserId()) || null;

const isStaff = (role = getLoggedUserRole()) => STAFF_ROLES.includes(role);
const isCustomer = (role = getLoggedUserRole()) => role === ROLES.customer;

const findUserByName = (fullName) =>
    getUsers().find(u => getFullName(u).toLowerCase() === fullName.trim().toLowerCase());

const isNewUser = (user) =>
    Boolean(user.createdAt) && Date.now() - new Date(user.createdAt) < NEW_USER_DAYS * 24 * 60 * 60 * 1000;

// ----- שעונים: חיפוש, סינון ומיון -----
const WATCH_SORTERS = {
    default: (a, b) => a.id - b.id,
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    brand: (a, b) => a.brand.localeCompare(b.brand)
};

const filterWatches = (list, { category = 'all', search = '' } = {}) => {
    const term = search.trim().toLowerCase();
    return list.filter(watch => {
        const matchesCategory = category === 'all' || watch.category === category;
        const matchesSearch = [watch.brand, watch.model, watch.description]
            .some(field => String(field || '').toLowerCase().includes(term));
        return matchesCategory && matchesSearch;
    });
};

const sortWatches = (list, sortKey = 'default') =>
    [...list].sort(WATCH_SORTERS[sortKey] || WATCH_SORTERS.default);

const getNextWatchId = () => {
    const watches = getWatches();
    return watches.length ? Math.max(...watches.map(w => w.id)) + 1 : 1;
};

// בניית אובייקט שעון מנתוני טופס
const buildWatch = (data) => ({
    brand: data.brand.trim().toUpperCase(),
    model: data.model.trim(),
    category: data.category,
    price: Number(data.price),
    qtyStock: Number(data.qtyStock),
    description: (data.description || '').trim(),
    image: (data.image || '').trim() || DEFAULT_IMAGE
});

// ----- סל קניות -----
const getCartQuantity = (cart, watchId) => {
    const item = cart.find(i => i.id === watchId);
    return item ? item.quantity : 0;
};

// מחזיר את פריטי הסל יחד עם פרטי השעון העדכניים מהמלאי
const getCartDetails = (userId = getLoggedUserId()) => {
    const watches = getWatches();
    return getCart(userId)
        .map(item => {
            const watch = watches.find(w => w.id === item.id);
            return watch ? { ...watch, quantity: item.quantity } : null;
        })
        .filter(Boolean);
};

const getCartCount = (userId = getLoggedUserId()) =>
    getCart(userId).reduce((sum, item) => sum + item.quantity, 0);

const calculateTotal = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

// קביעת כמות של שעון בסל, כולל בדיקת מלאי. מחזיר { ok, message }
const setCartQuantity = (watchId, quantity, userId = getLoggedUserId()) => {
    const watch = getWatchById(watchId);
    if (!watch) return { ok: false, message: 'השעון לא נמצא במלאי' };
    if (quantity > watch.qtyStock) {
        return { ok: false, message: `ניתן להזמין עד ${watch.qtyStock} יחידות מדגם ${watch.model}` };
    }

    let cart = getCart(userId);
    if (quantity <= 0) {
        cart = cart.filter(i => i.id !== watch.id);
    } else if (getCartQuantity(cart, watch.id)) {
        cart.find(i => i.id === watch.id).quantity = quantity;
    } else {
        cart.push({ id: watch.id, quantity });
    }
    saveCart(userId, cart);
    return { ok: true, message: '' };
};

const addToCart = (watchId, quantity = 1, userId = getLoggedUserId()) => {
    const current = getCartQuantity(getCart(userId), Number(watchId));
    const result = setCartQuantity(Number(watchId), current + quantity, userId);
    if (result.ok) {
        const watch = getWatchById(watchId);
        result.message = `${watch.brand} ${watch.model} נוסף לסל (${current + quantity} יח')`;
    }
    return result;
};

// ----- תשלום -----
const isCardExpired = (expiry) => {
    const [month, year] = expiry.split('/').map(Number);
    const lastValidDay = new Date(2000 + year, month, 0, 23, 59, 59);
    return lastValidDay < new Date();
};

// מנרמל את נתוני טופס התשלום ומחזיר הודעת שגיאה ראשונה (או מחרוזת ריקה)
const validatePayment = (method, data) => {
    if (!PAYMENT_RULES[method]) return 'יש לבחור אמצעי תשלום';
    const cleanData = { ...data, cardNumber: String(data.cardNumber || '').replace(/[\s-]/g, '') };
    const error = validateFields(cleanData, PAYMENT_RULES[method]);
    if (error) return error;
    if (method === 'credit' && isCardExpired(data.expiry.trim())) return 'תוקף הכרטיס פג';
    return '';
};

// פרטי התשלום שנשמרים בהזמנה - ללא מספר כרטיס מלא ו-CVV
const buildPaymentDetails = (method, data) => {
    switch (method) {
        case 'credit':
            return { holder: data.holder.trim(), cardLast4: data.cardNumber.replace(/[\s-]/g, '').slice(-4) };
        case 'bit':
            return { phone: data.bitPhone.trim() };
        case 'check':
            return { checkNumber: data.checkNumber.trim(), dueDate: data.dueDate };
        case 'transfer':
            return { bank: data.bank.trim(), branch: data.branch.trim(), account: data.account.trim() };
        default:
            return {};
    }
};

// ----- הזמנות -----
const getNextOrderNumber = () => {
    const orders = getOrders();
    return orders.length ? Math.max(...orders.map(o => o.id)) + 1 : FIRST_ORDER_NUMBER;
};

const getVatBreakdown = (total) => {
    const beforeVat = total / (1 + VAT_RATE);
    return { beforeVat, vat: total - beforeVat, total };
};

// יצירת הזמנה מהסל: בדיקת מלאי, הורדת מלאי, שמירת ההזמנה וריקון הסל
const placeOrder = (paymentMethod, paymentDetails = {}) => {
    const user = getCurrentUser();
    if (!user) return { ok: false, message: 'המשתמש המחובר לא נמצא במערכת' };

    const items = getCartDetails(user.tz);
    if (items.length === 0) return { ok: false, message: 'סל הקניות ריק' };

    const missing = items.find(item => item.quantity > item.qtyStock);
    if (missing) {
        return { ok: false, message: `אין מספיק מלאי עבור ${missing.brand} ${missing.model} (נותרו ${missing.qtyStock})` };
    }

    const watches = getWatches();
    items.forEach(item => {
        watches.find(w => w.id === item.id).qtyStock -= item.quantity;
    });
    saveWatches(watches);

    const order = {
        id: getNextOrderNumber(),
        userTz: user.tz,
        customerName: getFullName(user),
        date: new Date().toISOString(),
        items: items.map(({ id, brand, model, price, quantity }) => ({ id, brand, model, price, quantity })),
        total: calculateTotal(items),
        paymentMethod,
        paymentDetails,
        paid: paymentMethod !== 'cash',
        ready: false
    };

    saveOrders([...getOrders(), order]);
    removeCart(user.tz);
    return { ok: true, order };
};

const getOrdersByUser = (tz) => getOrders().filter(o => o.userTz === tz);

const ORDER_STATUS_FILTERS = {
    all: () => true,
    pending: (order) => !order.ready,
    ready: (order) => order.ready,
    unpaid: (order) => !order.paid
};

const filterOrders = (list, { status = 'all', search = '' } = {}) => {
    const term = search.trim().toLowerCase();
    const matchesStatus = ORDER_STATUS_FILTERS[status] || ORDER_STATUS_FILTERS.all;
    return list.filter(order =>
        matchesStatus(order) &&
        (order.customerName.toLowerCase().includes(term) || String(order.id).includes(term)));
};

const toggleOrderField = (orderId, field) => {
    const order = getOrders().find(o => o.id === orderId);
    if (order) updateOrder(orderId, { [field]: !order[field] });
};

const sortByDateDesc = (list, field = 'date') =>
    [...list].sort((a, b) => new Date(b[field] || 0) - new Date(a[field] || 0));
