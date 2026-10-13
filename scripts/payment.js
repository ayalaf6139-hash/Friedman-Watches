// עמוד תשלום - חשבונית מס על ההזמנה ובחירת אמצעי תשלום

const hasPaymentAccess = requireAccess(CUSTOMER_ROLES);
const REDIRECT_DELAY = 2500;

function createInvoiceLine(label, value, className = '') {
    const line = createEl('div', `invoice-line ${className}`.trim());
    line.append(createEl('span', '', label), createEl('span', '', value));
    return line;
}

function renderInvoice(items) {
    const invoice = document.getElementById('invoice');
    const user = getCurrentUser();

    const customer = createEl('div', 'invoice-customer');
    customer.append(
        createInvoiceLine('לקוח:', getFullName(user)),
        createInvoiceLine('ת.ז.:', user.tz),
        createInvoiceLine('טלפון:', user.phone || '-'),
        createInvoiceLine('דוא"ל:', user.email || '-'),
        createInvoiceLine('כתובת:', user.adress || '-'),
        createInvoiceLine('מספר הזמנה:', getNextOrderNumber()),
        createInvoiceLine('תאריך:', formatDate(new Date().toISOString()))
    );

    const table = createEl('table', 'invoice-table');
    table.appendChild(createTableRow(['פריט', 'כמות', 'מחיר יחידה', 'סה"כ'], 'th'));
    items.forEach(item => {
        table.appendChild(createTableRow([
            `${item.brand} ${item.model}`,
            item.quantity,
            formatPrice(item.price),
            formatPrice(item.price * item.quantity)
        ]));
    });

    const { beforeVat, vat, total } = getVatBreakdown(calculateTotal(items));
    const totals = createEl('div', 'invoice-totals');
    totals.append(
        createInvoiceLine('סה"כ לפני מע"מ:', formatPrice(beforeVat)),
        createInvoiceLine(`מע"מ (${VAT_RATE * 100}%):`, formatPrice(vat)),
        createInvoiceLine('סה"כ לתשלום:', formatPrice(total), 'invoice-total')
    );

    invoice.replaceChildren(createEl('h2', '', 'חשבונית מס'), customer, table, totals);
}

// הצגת השדות של אמצעי התשלום שנבחר בלבד (שדות מוסתרים מנוטרלים ולא נשלחים בטופס)
function showMethodFields(method) {
    document.querySelectorAll('.method-fields').forEach(fieldset => {
        const isActive = fieldset.dataset.method === method;
        fieldset.hidden = !isActive;
        fieldset.disabled = !isActive;
    });
}

function setPaymentMessage(text, type) {
    const message = document.getElementById('payment-message');
    message.textContent = text;
    message.className = `message message-${type}`;
}

function handlePaymentSubmit(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    const method = data.paymentMethod;

    const error = validatePayment(method, data);
    if (error) {
        setPaymentMessage(error, 'error');
        showMessage(error, 'error');
        return;
    }

    const result = placeOrder(method, buildPaymentDetails(method, data));
    if (!result.ok) {
        setPaymentMessage(result.message, 'error');
        showMessage(result.message, 'error');
        return;
    }

    e.target.querySelector('.submit-btn').disabled = true;
    setPaymentMessage(`תודה שקניתם אצלנו! הזמנה מספר ${result.order.id} התקבלה בהצלחה.`, 'success');
    showMessage('ההזמנה נשלחה בהצלחה, מועבר להזמנות שלי...');
    setTimeout(() => {
        window.location.href = 'myOrders.html';
    }, REDIRECT_DELAY);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasPaymentAccess) return;

    const form = document.getElementById('form');
    const items = getCartDetails();

    if (items.length === 0) {
        form.hidden = true;
        document.getElementById('invoice').replaceChildren(
            createEl('p', 'method-note', 'סל הקניות ריק - אין הזמנה לתשלום.')
        );
        return;
    }

    renderInvoice(items);

    const methodSelect = document.getElementById('paymentMethod');
    fillSelect(methodSelect, PAYMENT_METHODS);
    methodSelect.addEventListener('change', () => {
        showMethodFields(methodSelect.value);
        setPaymentMessage('', '');
    });
    showMethodFields(methodSelect.value);

    form.addEventListener('submit', handlePaymentSubmit);
});
