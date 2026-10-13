// עמוד ניהול הזמנות (צוות בלבד) - מעקב, סימון הזמנה כמוכנה / כשולמה
// הסינון נשמר בכתובת העמוד, לדוגמה: orders.html?status=pending

const hasOrdersAccess = requireAccess(STAFF_ROLES);

const ordersState = {
    status: getUrlParam('status', 'all'),
    search: getUrlParam('search')
};

let lastOrdersSnapshot = '';

function createToggleCell(order, field, onText, offText, actionText) {
    const cell = createEl('div');
    const button = createEl('button', 'table-btn', actionText);
    button.type = 'button';
    button.addEventListener('click', () => {
        toggleOrderField(order.id, field);
        renderOrders();
        showMessage(`הזמנה ${order.id} עודכנה`);
    });
    cell.append(createStatusBadge(order[field], onText, offText), button);
    return cell;
}

function createItemsList(items) {
    const list = createEl('ul', 'items-list');
    items.forEach(item => list.appendChild(createEl('li', '', `${item.brand} ${item.model} × ${item.quantity}`)));
    return list;
}

function renderOrders() {
    const allOrders = getOrders();
    lastOrdersSnapshot = JSON.stringify(allOrders);

    const orders = sortByDateDesc(filterOrders(allOrders, ordersState));
    const container = document.getElementById('ordersContainer');
    const pendingCount = allOrders.filter(order => !order.ready).length;

    document.getElementById('ordersSummary').textContent =
        `סה"כ ${allOrders.length} הזמנות, מתוכן ${pendingCount} ממתינות להכנה`;
    setUrlParams(ordersState);

    if (orders.length === 0) {
        container.replaceChildren(createEl('p', 'empty-message', 'אין הזמנות להצגה'));
        return;
    }

    const table = createEl('table', 'data-table');
    table.appendChild(createTableRow(
        ['שם לקוח', 'מספר הזמנה', 'תאריך הזמנה', 'פריטים', 'סכום', 'אמצעי תשלום', 'מוכנה', 'שולמה'], 'th'));

    orders.forEach(order => {
        table.appendChild(createTableRow([
            order.customerName,
            order.id,
            formatDate(order.date),
            createItemsList(order.items),
            formatPrice(order.total),
            PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod,
            createToggleCell(order, 'ready', 'מוכנה', 'בהכנה', order.ready ? 'החזר להכנה' : 'סמן כמוכנה'),
            createToggleCell(order, 'paid', 'שולמה', 'לא שולמה', order.paid ? 'בטל תשלום' : 'סמן כשולמה')
        ]));
    });

    container.replaceChildren(table);
}

// רענון אוטומטי - מציג הזמנות חדשות שהתקבלו מבלי לטעון מחדש את העמוד
function refreshOrdersIfChanged() {
    if (JSON.stringify(getOrders()) !== lastOrdersSnapshot) {
        renderOrders();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasOrdersAccess) return;

    const searchInput = document.getElementById('orderSearch');
    const statusSelect = document.getElementById('statusFilter');

    searchInput.value = ordersState.search;
    statusSelect.value = ordersState.status;

    searchInput.addEventListener('input', () => {
        ordersState.search = searchInput.value;
        renderOrders();
    });
    statusSelect.addEventListener('change', () => {
        ordersState.status = statusSelect.value;
        renderOrders();
    });

    renderOrders();
    setInterval(refreshOrdersIfChanged, ORDERS_REFRESH_INTERVAL);
});
