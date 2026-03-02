const nameInput = document.querySelector('#expenseName');
const categoryInput = document.querySelector('#expenseCategory');
const countInput = document.querySelector('#expenseCount');
const priceInput = document.querySelector('#expensePrice');
const addBtn = document.querySelector('#addBtn');
const list = document.querySelector('#expenseList');
const totalDisplay = document.querySelector('#totalAmount');
const clearBtn = document.querySelector('#clearAll');

let expenses = JSON.parse(localStorage.getItem('my_finance_data')) || [];

function render() {
    list.innerHTML = '';
    let totalAll = 0;

    expenses.forEach((item, index) => {
        const itemTotal = item.price * item.count;
        totalAll += itemTotal;
        
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div class="exp-info">
                <span class="exp-category">${item.category}</span>
                <div class="exp-name">${item.name}</div>
                <div class="exp-details">${item.count} шт. x ${item.price} ₽</div>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="exp-total-price">${itemTotal} ₽</span>
                <button class="delete-item" onclick="deleteExpense(${index})">×</button>
            </div>
        `;
        list.appendChild(li);
    });

    totalDisplay.textContent = `${totalAll} ₽`;
    localStorage.setItem('my_finance_data', JSON.stringify(expenses));
}

function addExpense() {
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const count = Number(countInput.value);
    const price = Number(priceInput.value);

    if (name && price > 0 && count > 0) {
        expenses.unshift({ name, category, count, price });
        
        // Очистка полей
        nameInput.value = '';
        priceInput.value = '';
        countInput.value = '1';
        render();
    }
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    render();
}

addBtn.addEventListener('click', addExpense);

clearBtn.addEventListener('click', () => {
    if (confirm('Очистить всё?')) {
        expenses = [];
        render();
    }
});

render();