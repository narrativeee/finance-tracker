const nameInput = document.querySelector('#expenseName');
const categoryInput = document.querySelector('#expenseCategory');
const countInput = document.querySelector('#expenseCount');
const priceInput = document.querySelector('#expensePrice');
const addBtn = document.querySelector('#addBtn');
const listContainer = document.querySelector('#expenseList');
const totalDisplay = document.querySelector('#totalAmount');
const clearBtn = document.querySelector('#clearAll');

// Загрузка данных из LocalStorage
let expenses = JSON.parse(localStorage.getItem('minimal_finance_data')) || [];

function render() {
    listContainer.innerHTML = '';
    let totalAll = 0;

    // Группировка массива по категориям
    const grouped = expenses.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    // Отрисовка групп
    for (const category in grouped) {
        // Создаем визуальный разделитель категории
        const header = document.createElement('div');
        header.className = 'category-group-header';
        header.textContent = category;
        listContainer.appendChild(header);

        grouped[category].forEach((item) => {
            const itemTotal = item.price * item.count;
            totalAll += itemTotal;
            
            // Находим индекс в оригинальном массиве для корректного удаления
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

    // Обновляем общую сумму и сохраняем
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
        
        // Очистка полей ввода
        nameInput.value = '';
        priceInput.value = '';
        countInput.value = '1';
        
        render();
    } else {
        alert('Пожалуйста, заполните название и цену');
    }
}

// Глобальная функция удаления (доступна через onclick в HTML)
window.deleteExpense = function(index) {
    expenses.splice(index, 1);
    render();
};

addBtn.addEventListener('click', addExpense);

// Очистка всего хранилища
clearBtn.addEventListener('click', () => {
    if (confirm('Удалить все записи безвозвратно?')) {
        expenses = [];
        render();
    }
});

// Первичная отрисовка при загрузке
render();

// Цепочка фокуса при нажатии Enter
nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Чтобы форма не мерцала
        categoryInput.focus();
    }
});

categoryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        countInput.focus();
    }
});

countInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        priceInput.focus();
    }
});

priceInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addExpense(); // Вызываем функцию добавления
        nameInput.focus(); // Возвращаем фокус в начало для новой записи
    }
});