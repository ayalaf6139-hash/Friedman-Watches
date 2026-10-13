// עמוד ההזמנות שלי (לקוח) - היסטוריית ההזמנות של הלקוח המחובר

const hasMyOrdersAccess = requireAccess(CUSTOMER_ROLES);

function createOrderCard(order) {
    const card = createEl('div', 'order-card');

    const badges = createEl('div', 'order-badges');
    badges.append(
        createStatusBadge(order.ready, 'ההזמנה מוכנה לאיסוף', 'ההזמנה בהכנה'),
        createStatusBadge(order.paid, 'שולמה', 'טרם שולמה')
    );

    const items = createEl('ul', 'items-list');
    order.items.forEach(item => {
        items.appendChild(createEl('li', '', `${item.brand} ${item.model} × ${item.quantity}`));
    });

    card.append(
        createEl('h3', '', `הזמנה מספר ${order.id}`),
        createEl('p', '', `תאריך הזמנה: ${formatDate(order.date)}`),
        createEl('p', '', `עלות: ${formatPrice(order.total)}`),
        createEl('p', '', `אמצעי תשלום: ${PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}`),
        items,
        badges
    );
    return card;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasMyOrdersAccess) return;

    const user = getCurrentUser();
    const orders = sortByDateDesc(getOrdersByUser(getLoggedUserId()));
    const container = document.getElementById('myOrdersContainer');

    if (user) {
        document.getElementById('myOrdersTitle').textContent = `היסטוריית ההזמנות של ${getFullName(user)}`;
    }

    if (orders.length === 0) {
        container.replaceChildren(createEl('p', 'empty-message', 'עדיין לא ביצעת הזמנות'));
        return;
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('myOrdersSummary').textContent =
        `${orders.length} הזמנות, בסך כולל של ${formatPrice(totalSpent)}`;
    container.replaceChildren(...orders.map(createOrderCard));
});
