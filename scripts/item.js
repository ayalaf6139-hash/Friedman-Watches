// עמוד פריט בודד - השעון נבחר לפי פרמטר בכתובת העמוד, לדוגמה: item.html?id=5

const hasItemAccess = requireAccess(CUSTOMER_ROLES);

function handleItemAddToCart(watchId) {
    const quantityInput = document.getElementById('quantity');
    if (!PATTERNS.quantity.test(quantityInput.value) || Number(quantityInput.value) < 1) {
        showMessage('יש להזין כמות שלמה של 1 ומעלה', 'error');
        return;
    }
    const result = addToCart(watchId, Number(quantityInput.value));
    showMessage(result.message, result.ok ? 'success' : 'error');
}

function renderItem(container, watch) {
    const titleText = `${watch.brand} ${watch.model}`.trim();
    const inStock = watch.qtyStock > 0;

    container.innerHTML = `
        <div class="product-details-card">
            <h1>${titleText}</h1>
            <img src="${watch.image || DEFAULT_IMAGE}" alt="${titleText}">

            <div class="product-info">
                <p class="category-tag">קטגוריה: ${CATEGORIES[watch.category] || watch.category}</p>
                <p class="description">${watch.description || 'אין תיאור זמין עבור מוצר זה.'}</p>
                <p class="price-tag">מחיר: ${formatPrice(watch.price)}</p>
                <p class="stock-status">במלאי: ${inStock ? watch.qtyStock + ' יחידות' : 'אזל מהמלאי'}</p>
            </div>

            <div class="product-actions">
                <div class="qty-control">
                    <label for="quantity">כמות:</label>
                    <input type="number" id="quantity" min="1" max="${watch.qtyStock}" value="1" ${inStock ? '' : 'disabled'}>
                </div>
                <button type="button" class="btn add-to-cart-btn" id="addToCartBtn" ${inStock ? '' : 'disabled'}>
                    🛒 הוסף לסל הקניות
                </button>
                <a class="btn back-btn" href="katalog.html?category=${encodeURIComponent(watch.category)}">⬅ חזרה לקטלוג</a>
            </div>
        </div>
    `;

    document.getElementById('addToCartBtn').addEventListener('click', () => handleItemAddToCart(watch.id));
}

function renderNotFound(container) {
    container.innerHTML = `
        <div style="text-align: center; margin-top: 50px;">
            <h2>השעון המבוקש לא נמצא במערכת</h2>
            <a class="btn back-btn" href="katalog.html">חזרה לקטלוג</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasItemAccess) return;

    const container = document.getElementById('product-container');
    const watch = getWatchById(getUrlParam('id'));

    if (watch) {
        renderItem(container, watch);
    } else {
        renderNotFound(container);
    }
});
