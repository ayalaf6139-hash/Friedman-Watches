// עמוד קטלוג - הצגה, חיפוש, סינון ומיון של השעונים
// הסינון נשמר בכתובת העמוד, לדוגמה: katalog.html?category=נשים&search=casio&sort=priceAsc

const hasCatalogAccess = requireAccess(CUSTOMER_ROLES);

const catalogState = {
    category: getUrlParam('category', 'all'),
    search: getUrlParam('search'),
    sort: getUrlParam('sort', 'default')
};

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = getCartCount();
}

function handleAddToCart(watchId) {
    const result = addToCart(watchId);
    showMessage(result.message, result.ok ? 'success' : 'error');
    updateCartCount();
}

function createWatchCard(watch) {
    const card = createEl('div', 'watch-card');

    const link = createEl('a', 'watch-link');
    link.href = `item.html?id=${watch.id}`;
    link.title = 'לפרטי השעון';

    const image = createEl('img', 'watch-image');
    image.src = watch.image || DEFAULT_IMAGE;
    image.alt = watch.description || watch.model;

    link.append(image, createEl('div', 'watch-brand', watch.brand), createEl('div', 'watch-model', watch.model));

    const inStock = watch.qtyStock > 0;
    const button = createEl('button', 'add-to-cart-btn', inStock ? '🛒 הוסף לסל' : 'אזל מהמלאי');
    button.type = 'button';
    button.disabled = !inStock;
    button.addEventListener('click', () => handleAddToCart(watch.id));

    card.append(link, createEl('div', 'watch-price', formatPrice(watch.price)), button);
    return card;
}

function renderCatalog() {
    const container = document.getElementById('watchesContainer');
    const watches = sortWatches(filterWatches(getWatches(), catalogState), catalogState.sort);

    container.replaceChildren(...watches.map(createWatchCard));
    if (watches.length === 0) {
        container.appendChild(createEl('p', 'no-results', 'לא נמצאו שעונים התואמים לחיפוש'));
    }
    setUrlParams(catalogState);
}

function setActiveFilterButton() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.category === catalogState.category);
    });
}

function initCatalogControls() {
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');

    searchInput.value = catalogState.search;
    searchInput.addEventListener('input', () => {
        catalogState.search = searchInput.value;
        renderCatalog();
    });

    fillSelect(sortSelect, SORT_OPTIONS);
    sortSelect.value = catalogState.sort;
    sortSelect.addEventListener('change', () => {
        catalogState.sort = sortSelect.value;
        renderCatalog();
    });

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            catalogState.category = button.dataset.category;
            setActiveFilterButton();
            renderCatalog();
        });
    });
    setActiveFilterButton();
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasCatalogAccess) return;
    initCatalogControls();
    renderCatalog();
    updateCartCount();
});
