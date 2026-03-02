const nameInput = document.querySelector('#expenseName');
const categoryInput = document.querySelector('#expenseCategory');
const countInput = document.querySelector('#expenseCount');
const priceInput = document.querySelector('#expensePrice');
const addBtn = document.querySelector('#addBtn');
const listContainer = document.querySelector('#expenseList');
const totalDisplay = document.querySelector('#totalAmount');
const clearBtn = document.querySelector('#clearAll');

const modal = document.querySelector('#modalOverlay');
const confirmDeleteBtn = document.querySelector('#confirmDelete');
const confirmCancelBtn = document.querySelector('#confirmCancel');

let expenses = JSON.parse(localStorage.getItem('minimal_finance_data')) || [];

function render() {
    listContainer.innerHTML = '';
    let totalAll = 0;

    const grouped = expenses.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    for (const category in grouped) {
        const header = document.createElement('div');
        header.className = 'category-group-header';
        header.textContent = category;
        listContainer.appendChild(header);

        grouped[category].forEach((item) => {
            const itemTotal = item.price * item.count;
            totalAll += itemTotal;
            const realIndex = expenses.indexOf(item);

            const div = document.createElement('div');
            div.className = 'expense-item';
            div.innerHTML = `
                <div class="exp-info">
                    <div class="exp-name">${item.name}</div>
                    <div class="exp-details">${item.count} шт. по ${item.price} ₽</div>
                </div>
                <div style="display: flex; align-items: center;">
                    <span class="exp-total-price">${itemTotal} ₽</span>
                    <button class="delete-item" onclick="deleteExpense(${realIndex})">×</button>
                </div>
            `;
            listContainer.appendChild(div);
        });
    }

    totalDisplay.textContent = `${totalAll} ₽`;
    localStorage.setItem('minimal_finance_data', JSON.stringify(expenses));
}

function addExpense() {
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const count = Number(countInput.value);
    const price = Number(priceInput.value);

    if (name && price > 0 && count > 0) {
        expenses.push({ name, category, count, price });
        nameInput.value = '';
        priceInput.value = '';
        countInput.value = '1';
        render();
        nameInput.focus();
    }
}

window.deleteExpense = function(index) {
    expenses.splice(index, 1);
    render();
};

addBtn.addEventListener('click', addExpense);

// Логика модального окна
clearBtn.addEventListener('click', () => modal.style.display = 'flex');
confirmCancelBtn.addEventListener('click', () => modal.style.display = 'none');
confirmDeleteBtn.addEventListener('click', () => {
    expenses = [];
    render();
    modal.style.display = 'none';
});

// Навигация через Enter
nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') categoryInput.focus(); });
categoryInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') countInput.focus(); });
countInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') priceInput.focus(); });
priceInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addExpense(); });

render();