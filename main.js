const nameInput = document.querySelector('#expenseName');
const sumInput = document.querySelector('#expenseSum');
const addBtn = document.querySelector('#addBtn');
const list = document.querySelector('#expenseList');
const totalDisplay = document.querySelector('#totalAmount');
const clearBtn = document.querySelector('#clearAll');

// Загружаем данные
let expenses = JSON.parse(localStorage.getItem('my_expenses')) || [];

function render() {
    list.innerHTML = '';
    let total = 0;

    expenses.forEach((item, index) => {
        total += Number(item.sum);
        
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div class="exp-info">
                <span class="exp-name">${item.name}</span>
                <span class="exp-price">${item.sum} ₽</span>
            </div>
            <button class="delete-item" onclick="deleteExpense(${index})">×</button>
        `;
        list.appendChild(li);
    });

    totalDisplay.textContent = `${total} ₽`;
    localStorage.setItem('my_expenses', JSON.stringify(expenses));
}

function addExpense() {
    const name = nameInput.value.trim();
    const sum = sumInput.value.trim();

    if (name && sum) {
        expenses.unshift({ name, sum: Number(sum) });
        nameInput.value = '';
        sumInput.value = '';
        render();
    }
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    render();
}

addBtn.addEventListener('click', addExpense);

// Добавление по Enter
sumInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addExpense();
});

clearBtn.addEventListener('click', () => {
    if (confirm('Очистить весь список?')) {
        expenses = [];
        render();
    }
});

render();