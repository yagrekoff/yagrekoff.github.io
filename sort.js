document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('data-table');
    const headers = table.querySelectorAll('th');
    let sortDirections = Array(headers.length).fill(true); // true для возрастания, false для убывания

    headers.forEach((header, index) => {
        // Добавляем индексы только для сортируемых колонок (исключаем "Действия")
        if (index < headers.length - 1) {
            header.addEventListener('click', () => {
                sortTableByColumn(index, sortDirections[index]);
                sortDirections[index] = !sortDirections[index]; // Меняем направление сортировки
                updateHeaderIndicators();
            });
        }
    });

    function sortTableByColumn(columnIndex, ascending) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aText = a.children[columnIndex].textContent.trim();
            const bText = b.children[columnIndex].textContent.trim();

            // Попытка сравнить как числа
            const aNum = parseFloat(aText.replace(',', '.'));
            const bNum = parseFloat(bText.replace(',', '.'));

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return ascending ? aNum - bNum : bNum - aNum;
            }

            // Если не числа, сравниваем как строки
            return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        // Перемещаем отсортированные строки в tbody
        rows.forEach(row => tbody.appendChild(row));
    }

    function updateHeaderIndicators() {
        headers.forEach((header, index) => {
            if (index < headers.length - 1) { // Исключаем последний столбец "Действия"
                header.textContent = header.textContent.replace(/ ▲| ▼/, '');
                if (sortDirections[index]) {
                    header.textContent += ' ▲';
                } else {
                    header.textContent += ' ▼';
                }
            }
        });
    }

    // Инициализируем индикаторы сортировки
    updateHeaderIndicators();
});