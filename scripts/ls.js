// גישה ל-LocalStorage - שמירה ושליפה בלבד

function getLS(key, defaultValue = []) {
    const data = window.localStorage.getItem(key);
    if (!data) return defaultValue;
    try {
        return JSON.parse(data);
    } catch {
        return defaultValue;
    }
}

function setLS(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
}

function getStringLS(key) {
    return window.localStorage.getItem(key);
}

function setStringLS(key, value) {
    window.localStorage.setItem(key, value);
}

function removeLS(key) {
    window.localStorage.removeItem(key);
}

const STORAGE_KEYS = {
    users: 'users',
    watches: 'watches',
    orders: 'orders',
    userId: 'userId',
    userRole: 'userRole',
    cartPrefix: 'cart_'
};

// ----- שעונים -----
const getWatches = () => getLS(STORAGE_KEYS.watches, []);
const saveWatches = (watchesList) => setLS(STORAGE_KEYS.watches, watchesList);
const getWatchById = (id) => getWatches().find(w => w.id === Number(id));

const addWatch = (newWatch) => {
    const watches = getWatches();
    watches.push(newWatch);
    saveWatches(watches);
};

const deleteWatch = (id) => {
    saveWatches(getWatches().filter(w => w.id !== id));
};

const updateWatch = (id, updatedData) => {
    const watches = getWatches();
    const index = watches.findIndex(w => w.id === id);
    if (index !== -1) {
        watches[index] = { ...watches[index], ...updatedData, id };
        saveWatches(watches);
    }
};

// ----- משתמשים -----
const getUsers = () => getLS(STORAGE_KEYS.users, []);
const saveUsers = (usersList) => setLS(STORAGE_KEYS.users, usersList);

const addUser = (newUser) => {
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
};

const deleteUser = (tz) => {
    saveUsers(getUsers().filter(u => u.tz !== tz));
};

// ----- משתמש מחובר -----
const getLoggedUserId = () => getStringLS(STORAGE_KEYS.userId);
const getLoggedUserRole = () => getStringLS(STORAGE_KEYS.userRole);

const loginUserToLS = (tz, role) => {
    setStringLS(STORAGE_KEYS.userId, tz);
    setStringLS(STORAGE_KEYS.userRole, role);
};

const logoutUserFromLS = () => {
    removeLS(STORAGE_KEYS.userId);
    removeLS(STORAGE_KEYS.userRole);
};

// ----- סל קניות (לכל משתמש סל נפרד: [{ id, quantity }]) -----
const getCart = (userId) => getLS(`${STORAGE_KEYS.cartPrefix}${userId}`, []);
const saveCart = (userId, cartList) => setLS(`${STORAGE_KEYS.cartPrefix}${userId}`, cartList);
const removeCart = (userId) => removeLS(`${STORAGE_KEYS.cartPrefix}${userId}`);

// ----- הזמנות -----
const getOrders = () => getLS(STORAGE_KEYS.orders, []);
const saveOrders = (ordersList) => setLS(STORAGE_KEYS.orders, ordersList);

const updateOrder = (orderId, updatedData) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        Object.assign(order, updatedData);
        saveOrders(orders);
    }
};
