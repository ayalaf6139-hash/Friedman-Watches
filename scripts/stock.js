// עמוד ניהול מלאי (צוות בלבד) - הוספה, עריכה, עדכון כמות ומחיקה של שעונים

const hasStockAccess = requireAccess(STAFF_ROLES);

let editingWatchId = null; // מזהה השעון שבעריכה, או null במצב הוספה

function createStockCard(watch) {
    const card = createEl('div', 'watch-card');

    const image = createEl('img', 'watch-image');
    image.src = watch.image || DEFAULT_IMAGE;
    image.alt = watch.brand;

    const info = createEl('div', 'watch-info');
    info.innerHTML = `
        <div class="watch-brand"><strong>מותג:</strong> ${watch.brand}</div>
        <div class="watch-model"><strong>דגם:</strong> ${watch.model || '-'}</div>
        <div class="watch-category"><strong>קטגוריה:</strong> ${CATEGORIES[watch.category] || watch.category}</div>
        <div class="watch-price"><strong>מחיר:</strong> ${formatPrice(watch.price)}</div>
        <div class="watch-stock-control">
            <label for="stock-${watch.id}"><strong>מלאי:</strong></label>
            <input type="number" id="stock-${watch.id}" value="${watch.qtyStock}" min="0" class="stock-input">
        </div>
    `;
    if (watch.qtyStock <= LOW_STOCK_LIMIT) {
        info.appendChild(createStatusBadge(false, '', watch.qtyStock === 0 ? 'אזל מהמלאי' : 'מלאי נמוך'));
    }

    const actions = createEl('div', 'watch-actions');
    [
        { text: 'עדכן מלאי', className: 'btn-update', handler: () => handleStockUpdate(watch.id) },
        { text: 'ערוך', className: 'btn-edit', handler: () => startEditWatch(watch.id) },
        { text: 'מחק', className: 'btn-delete', handler: () => handleDeleteWatch(watch.id) }
    ].forEach(({ text, className, handler }) => {
        const button = createEl('button', className, text);
        button.type = 'button';
        button.addEventListener('click', handler);
        actions.appendChild(button);
    });

    card.append(image, info, actions);
    return card;
}

function renderStock() {
    const container = document.getElementById('watchesContainer');
    const watches = getWatches();

    container.replaceChildren(...watches.map(createStockCard));
    if (watches.length === 0) {
        container.appendChild(createEl('p', 'no-products', 'אין שעונים במלאי.'));
    }
}

function handleStockUpdate(id) {
    const value = document.getElementById(`stock-${id}`).value;
    if (!PATTERNS.quantity.test(value)) {
        showMessage('נא להזין כמות תקינה במלאי (מספר שלם 0 ומעלה)', 'error');
        return;
    }
    updateWatch(id, { qtyStock: Number(value) });
    renderStock();
    showMessage(`המלאי עבור ${getWatchById(id).brand} עודכן ל-${value}`);
}

function handleDeleteWatch(id) {
    if (!confirm('האם אתה בטוח שברצונך למחוק שעון זה מהמלאי?')) return;
    deleteWatch(id);
    if (editingWatchId === id) resetForm();
    renderStock();
    showMessage('השעון נמחק מהמלאי');
}

// טעינת נתוני שעון לטופס לצורך עריכה
function startEditWatch(id) {
    const watch = getWatchById(id);
    if (!watch) return;

    editingWatchId = id;
    const form = document.getElementById('form');
    ['brand', 'model', 'price', 'qtyStock', 'category', 'description', 'image'].forEach(field => {
        form.elements[field].value = watch[field] ?? '';
    });

    document.getElementById('formTitle').textContent = 'עריכת שעון';
    document.getElementById('saveBtn').textContent = 'עדכן שעון';
    document.getElementById('cancelBtn').hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    editingWatchId = null;
    document.getElementById('form').reset();
    document.getElementById('formTitle').textContent = 'הוספת שעון חדש';
    document.getElementById('saveBtn').textContent = 'שמור שעון';
    document.getElementById('cancelBtn').hidden = true;
}

function handleWatchSubmit(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    const error = validateFields(data, WATCH_RULES);
    if (error) {
        showMessage(error, 'error');
        return;
    }

    const watch = buildWatch(data);
    if (editingWatchId !== null) {
        updateWatch(editingWatchId, watch);
        showMessage('השעון עודכן בהצלחה!');
    } else {
        addWatch({ id: getNextWatchId(), ...watch });
        showMessage('השעון נוסף בהצלחה!');
    }

    resetForm();
    renderStock();
}

document.addEventListener('DOMContentLoaded', () => {
    if (!hasStockAccess) return;

    fillSelect(document.getElementById('category'), CATEGORIES);
    document.getElementById('form').addEventListener('submit', handleWatchSubmit);
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    renderStock();
});
