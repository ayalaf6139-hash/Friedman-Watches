// עמוד סל הקניות - הצגת הפריטים, שינוי כמויות וסיכום כולל מע"מ

const hasCartAccess = requireAccess(CUSTOMER_ROLES);

function changeQuantity(watchId, newQuantity) {
    const result = setCartQuantity(watchId, newQuantity);
    if (!result.ok) showMessage(result.message, 'error');
    renderCart();
}

function createQuantityButton(text, watchId, newQuantity) {
    const button = createEl('button', 'cart-item-btn cart-qty-btn', text);
    button.type = 'button';
    button.addEventListener('click', () => changeQuantity(watchId, newQuantity));
    return button;
}

function createCartItemCard(item) {
    const card = createEl('div', 'cart-item-card');

    const image = createEl('img', 'cart-item-image');
    image.src = item.image || DEFAULT_IMAGE;
    image.alt = item.model;

    const quantityRow = createEl('div', 'cart-item-qty');
    const quantityButtons = createEl('div');
    quantityButtons.append(
        createQuantityButton('-', item.id, item.quantity - 1),
        createEl('span', 'cart-qty-value', item.quantity),
        createQuantityButton('+', item.id, item.quantity + 1)
    );
    quantityRow.append(createEl('span', 'cart-qty-label', 'כמות:'), quantityButtons);

    const removeButton = createEl('button', 'cart-item-btn', 'הסר');
    removeButton.type = 'button';
    removeButton.addEventListener('click', () => changeQuantity(item.id, 0));

    card.append(
        image,
        createEl('div', 'cart-item-brand', item.brand),
        createEl('div', 'cart-item-model', item.model),
        createEl('div', 'cart-item-price', formatPrice(item.price)),
        quantityRow,
        removeButton
    );
    return card;
}

function renderCart() {
    const items = getCartDetails();
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');

    summary.hidden = items.length === 0;
    if (items.length === 0) {
        container.replaceChildren(createEl('div', 'cart-empty', 'סל הקניות שלך ריק'));
        return;
    }

    container.replaceChildren(...items.map(createCartItemCard));

    const { beforeVat, vat, total } = getVatBreakdown(calculateTotal(items));
    document.getElementById('totalItems').textContent = getCartCount();
    document.getElementById('totalPrice').textContent = formatPrice(beforeVat);
    document.getElementById('vatRate').textContent = VAT_RATE * 100;
    document.getElementById('vatAmount').textContent = formatPrice(vat);
    document.getElementById('finalPrice').textContent = formatPrice(total);
}

function checkout() {
    const items = getCartDetails();
    if (items.length === 0) {
        showMessage('סל הקניות שלך ריק', 'error');
        return;
    }
    const total = calculateTotal(items);
    if (confirm(`סה"כ לתשלום: ${formatPrice(total)} \n\n לחץ אישור למעבר לתשלום`)) {
        window.location.href = 'payment.html';
    }
}

function clearCart() {
    if (confirm('האם אתה בטוח שברצונך להסיר את כל הפריטים?')) {
        removeCart(getLoggedUserId());
        renderCart();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasCartAccess) return;

    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('continueBtn').addEventListener('click', () => {
        window.location.href = 'katalog.html';
    });
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);

    renderCart();
});
