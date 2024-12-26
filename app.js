document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('data-table');
    const tbody = table.querySelector('tbody');
    const addRowButton = document.getElementById('add-row-button');
    const confirmModal = document.querySelector('.confirm-modal');
    let rowToDelete;

    function createNewRow() {
        const newRow = document.createElement('tr');

        // Создаем ячейку с чекбоксом
        const checkBoxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkBoxCell.appendChild(checkbox);
        newRow.appendChild(checkBoxCell);

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
                .map((cell, index) => {
                    if (index === 0) return cell.firstChild.checked ? '1' : '0'; // Индекс 0 для чекбокса
                    if (index === row.cells.length - 1) return null; // Исключаем последнюю ячейку с кнопками
                    return cell.textContent.trim();
                })
                .filter(value => value !== null);
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
                    if (cellData === '1') {
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = true;
                        cell.appendChild(checkbox);
                    } else {
                        cell.textContent = cellData;
                    }
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
            confirmModal.style.display = 'flex'; // Показываем модальное окно
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
        if (e.target && e.target.matches('td[contenteditable="true"]')) {
            saveTableData(); // Сохраняем изменения при редактировании
        }
    });

    // Обработка завершения редактирования
    tbody.addEventListener('blur', e => {
        if (e.target && e.target.matches('td[contenteditable="true"]')) {
            e.target.removeAttribute('contenteditable');
            saveTableData(); // Сохраняем данные после завершения редактирования
        }
    }, true);

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
});