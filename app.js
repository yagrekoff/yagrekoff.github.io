// app.js

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('data-table');
    const tbody = table.querySelector('tbody');
    const addRowButton = document.getElementById('add-row-button');
    const confirmModal = document.createElement('div');
    let rowToDelete;


    function createNewRow() {
        const newRow = document.createElement('tr');

        for (let i = 0; i < 24; i++) {
            const newCell = document.createElement('td');
            newCell.textContent = '';
            newRow.appendChild(newCell);
        }

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
        actionsCell.innerHTML = `
            <button class="edit-btn">Редактировать</button>
            <button class="delete-btn">Удалить</button>
        `;
        newRow.appendChild(actionsCell);

        tbody.appendChild(newRow);
        saveTableData(); // Сохраняем новые данные

    }
    
    addRowButton.addEventListener('click', () => {
        createNewRow();
    });
    // Функция для сохранения данных таблицы в Local Storage

    function saveTableData() {
        const rows = Array.from(tbody.children);
        const data = rows.map(row => {
            return Array.from(row.cells)
                .map(cell => cell.textContent.trim())
                .filter((value, index) => index !== rows[0].cells.length - 1); // Исключаем последнюю ячейку с кнопками
        });
        
        localStorage.setItem('table-data', JSON.stringify(data));
    }

    // Функция для загрузки данных таблицы из Local Storage
    function loadTableData() {
        const storedData = localStorage.getItem('table-data');
        if (storedData) {
            const data = JSON.parse(storedData);
            data.forEach(rowData => {
                const row = document.createElement('tr');
                
                rowData.forEach(cellData => {
                    const cell = document.createElement('td');
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });

                const actionsCell = document.createElement('td');
                actionsCell.className = 'actions';
                actionsCell.innerHTML = `
                    <button class="edit-btn">Редактировать</button>
                    <button class="delete-btn">Удалить</button>
                `;
                row.appendChild(actionsCell);

                tbody.appendChild(row);
            });
        }
    }

    // Создаем модальное окно подтверждения
    confirmModal.className = 'confirm-modal';
    confirmModal.innerHTML = `
        <p class="confirm-message">Вы уверены, что хотите удалить эту строку?</p>
        <button class="btn btn-confirm-yes">Да</button>
        <button class="btn btn-confirm-no">Нет</button>
    `;
    document.body.appendChild(confirmModal);

    // Загружаем данные таблицы при загрузке страницы
    loadTableData();

    // Обработчик нажатия кнопки Редактировать
    tbody.addEventListener('click', e => {
        if (e.target && e.target.matches('.edit-btn')) {
            const row = e.target.closest('tr');
            const cells = row.querySelectorAll('td');
            
            for (let i = 0; i < cells.length - 1; i++) { // Пропускаем последнюю ячейку с кнопками
                cells[i].setAttribute('contenteditable', true); // Включаем редактирование
            }

            setTimeout(() => {
                cells[0].focus(); // Фокусируем первую редактируемую ячейку
            }, 0);
        }
    });

    // Обработчик нажатия кнопки Удалить
    tbody.addEventListener('click', e => {
        if (e.target && e.target.matches('.delete-btn')) {
            rowToDelete = e.target.closest('tr'); // Сохраняем строку для удаления
            confirmModal.style.display = 'block'; // Показываем модальное окно
        }
    });

    // Обработка ответа на подтверждение удаления
    confirmModal.addEventListener('click', e => {
        if (e.target && e.target.matches('.btn-confirm-yes')) {
            rowToDelete.remove();
            saveTableData(); // Сохраняем изменения после удаления
            confirmModal.style.display = 'none';
        } else if (e.target && e.target.matches('.btn-confirm-no')) {
            confirmModal.style.display = 'none';
        }
    });

    // Сохранение данных при изменении содержимого ячеек
    tbody.addEventListener('input', e => {
        if (e.target && e.target.matches('td[contenteditable]')) {
            saveTableData(); // Сохраняем изменения при редактировании
        }
    });
});