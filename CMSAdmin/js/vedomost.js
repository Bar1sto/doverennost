'use strict';

// Инициализация зависимостей
const scriptIndividuals = document.createElement('script');
scriptIndividuals.src = 'individuals.js';
document.head.appendChild(scriptIndividuals);

const scriptOrganizations = document.createElement('script');
scriptOrganizations.src = 'organizations.js';
document.head.appendChild(scriptOrganizations);

const scriptItems = document.createElement('script');
scriptItems.src = 'items.js';
document.head.appendChild(scriptItems);

// Глобальные переменные
let ved_num_current;
let list_data_individuals = [];
let list_data_organizations = [];
let list_data_items = [];
let open_k = 1; // Флаг для проверки открытия формы

// Основные функции

async function loadAllData() {
    try {
        console.log('Загрузка данных...');
        const [individuals, organizations, items] = await Promise.all([
            eel.collection_individuals_load_records()(),
            eel.collection_organizations_load_records()(),
            eel.collection_items_load_records()()
        ]);

        list_data_individuals = JSON.parse(JSON.stringify(individuals));
        list_data_organizations = JSON.parse(JSON.stringify(organizations));
        list_data_items = JSON.parse(JSON.stringify(items));

        console.log('Данные успешно загружены');
        return true;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Ошибка загрузки данных. Проверьте консоль для подробностей.');
        return false;
    }
}

// Функция добавления данных в select
function addSelect(element, list_data, isIndividuals = false) {
    if (!element) {
        console.error("Элемент для добавления данных не найден!");
        return;
    }
    if (!list_data || list_data.length === 0) {
        console.error("Данные для списка отсутствуют!");
        return;
    }

    // Очищаем select перед заполнением
    element.innerHTML = '<option value="">Выберите значение</option>';

    for (let i = 0; i < list_data.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        
        // Для физических лиц используем ФИО
        if (isIndividuals && list_data[i].surname && list_data[i].name && list_data[i].patronymic) {
            opt.innerHTML = `${list_data[i].surname} ${list_data[i].name} ${list_data[i].patronymic}`;
        } else {
            opt.innerHTML = list_data[i].name || "Unnamed";
        }
        
        element.appendChild(opt);
    }
}

// Функция для поиска значения в select
function setSelectValue(selectId, valueToFind) {
    const select = document.getElementById(selectId);
    if (!select || !valueToFind) return;

    valueToFind = valueToFind.trim().toLowerCase();
    let found = false;

    for (let option of select.options) {
        let optionText = option.innerText.trim().toLowerCase();
        if (optionText === valueToFind) {
            select.value = option.value;
            found = true;
            break;
        }
    }

    if (!found) {
        console.warn(`Значение '${valueToFind}' не найдено в списке #${selectId}`);
    }
}

async function updateVedomostTable() {
    const table = document.querySelector('.section.vedomost .section_table');
    if (!table) {
        console.error('Таблица ведомостей не найдена');
        return;
    }

    // Очистка и создание заголовков таблицы
    table.innerHTML = `
        <div class="table_row th">
            <div>№</div>
            <div>Номер ведомости</div>
            <div>Дата</div>
            <div>Действия</div>
        </div>
    `;

    try {
        const records = JSON.parse(JSON.stringify(await eel.collection_vedomost_load_records()()));
        
        if (!records || records.length === 0) {
            console.log('Нет данных для отображения');
            return;
        }

        // Заполнение таблицы данными
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const date = record.date || 'Не указана';

            const rowHTML = `
                <div class="table_row" data-ved-id="${record.num_ved}">
                    <div>${i + 1}</div>
                    <div>${record.num_ved}</div>
                    <div>${date}</div>
                    <div class="actions">
                        <div class="table_row_print" title="Печать"></div>
                        <div class="table_row_change" title="Изменить"></div>
                        <div class="table_row_delete" title="Удалить"></div>
                    </div>
                </div>
            `;

            table.insertAdjacentHTML('beforeend', rowHTML);
        }
    } catch (error) {
        console.error('Ошибка обновления таблицы:', error);
        alert('Ошибка загрузки данных ведомостей. Проверьте консоль для подробностей.');
    }
}

// Функции для работы с формой

async function showAddForm() {
    const form = document.getElementById('frame_ved');
    if (!form) return;

    // Настройка формы
    document.querySelector(".frame_ved_cont .frame_title").textContent = "Форма добавления данных";
    document.querySelector(".frame_ved_cont .confirm_but").textContent = "Добавить";
    document.querySelector(".frame_ved_cont .confirm_but").dataset.mode = "add";

    // Очистка формы
    resetForm();

    // Загрузка данных в выпадающие списки
    if (open_k) {
        await loadAllData();
        open_k = 0;
    }

    // Заполнение select элементов
    addSelect(document.getElementById('ved_home_org'), list_data_organizations);
    addSelect(document.getElementById('ved_issuer'), list_data_individuals, true);
    addSelect(document.getElementById('ved_receiver'), list_data_individuals, true);

    // Инициализация таблицы материалов
    initMaterialsTable();

    // Показ формы
    form.style.display = 'flex';
}

async function showEditForm(vedomostId) {
    const form = document.getElementById('frame_ved');
    if (!form) return;

    try {
        // Загрузка данных ведомости
        const vedomost = JSON.parse(JSON.stringify(
            await eel.collection_vedomost_form_load_records(vedomostId)() || {}
        ));

        if (!vedomost.num_ved) {
            throw new Error('Ведомость не найдена');
        }

        // Настройка формы
        document.querySelector(".frame_ved_cont .frame_title").textContent = "Форма редактирования данных";
        document.querySelector(".frame_ved_cont .confirm_but").textContent = "Обновить";
        document.querySelector(".frame_ved_cont .confirm_but").dataset.mode = "edit";

        // Очистка формы
        resetForm();

        // Загрузка данных в выпадающие списки
        if (open_k) {
            await loadAllData();
            open_k = 0;
        }

        // Заполнение основных полей
        document.getElementById('ved_num_ved').value = vedomost.num_ved;
        document.getElementById('ved_num_ved').dataset.oldValue = vedomost.num_ved;
        document.getElementById('ved_date').value = vedomost.date || '';

        // Заполнение select элементов
        addSelect(document.getElementById('ved_home_org'), list_data_organizations);
        addSelect(document.getElementById('ved_issuer'), list_data_individuals, true);
        addSelect(document.getElementById('ved_receiver'), list_data_individuals, true);

        setTimeout(() => {
            setSelectValue('ved_home_org', vedomost.home_org);
            setSelectValue('ved_issuer', vedomost.issuer);
            setSelectValue('ved_receiver', vedomost.receiver);
        }, 100);

        // Заполнение таблицы материалов
        if (vedomost.materials && vedomost.materials.length > 0) {
            initMaterialsTable(vedomost.materials);
        } else {
            initMaterialsTable([{}]); // Пустая строка, если нет материалов
        }

        // Показ формы
        form.style.display = 'flex';
    } catch (error) {

    }
}

function resetForm() {
    // Очистка основных полей
    document.querySelectorAll('#frame_ved input').forEach(input => {
        input.value = '';
        input.removeAttribute('data-old-value');
    });

    // Сброс select элементов
    document.querySelectorAll('#frame_ved select').forEach(select => {
        select.selectedIndex = 0;
    });

    // Очистка таблицы материалов
    const table = document.querySelector('.ved_enter_data_field table');
    if (table) {
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }
}

// Работа с таблицей материалов

function initMaterialsTable(items = [{}]) {
    const table = document.querySelector('.ved_enter_data_field table');
    if (!table) return;

    // Очистка таблицы (оставляем заголовки)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Добавление строк
    items.forEach((item, index) => {
        addMaterialRow(item, index + 1);
    });
}

function addMaterialRow(item = {}, rowNumber = null) {
    const table = document.querySelector('.ved_enter_data_field table');
    if (!table) return;

    const actualRowNumber = rowNumber ?? table.rows.length;
    const row = table.insertRow();

    row.innerHTML = `
        <td><input type="text" class="row-number" value="${actualRowNumber}" readonly></td>
        <td>
            <select class="material-select">
                <option value="">Выберите материал</option>
            </select>
        </td>
        <td><input type="number" class="material-count" value="${item.count || ''}" min="0" step="1"></td>
        <td><input type="text" class="material-unit" value="${item.unit || ''}"></td>
        <td><input type="number" class="material-price" value="${item.price || ''}" min="0" step="0.01"></td>
    `;

    // Заполнение select материала
    const select = row.querySelector('.material-select');
    if (select && list_data_items) {
        addSelect(select, list_data_items);

        // Установка выбранного значения
        if (item.material_value) {
            setSelectValue(select, item.material_value);
        }
    }

    // Обновление номеров строк
    updateRowNumbers();
}

function removeMaterialRow() {
    const table = document.querySelector('.ved_enter_data_field table');
    if (!table || table.rows.length <= 2) {
        alert('Должна остаться хотя бы одна строка с материалом');
        return;
    }

    table.deleteRow(table.rows.length - 1);
    updateRowNumbers();
}

function updateRowNumbers() {
    const table = document.querySelector('.ved_enter_data_field table');
    if (!table) return;

    const rows = table.querySelectorAll('tr:not(:first-child)');
    rows.forEach((row, index) => {
        const input = row.querySelector('.row-number');
        if (input) input.value = index + 1;
    });
}

// Обработчики событий

function setupEventListeners() {
    // Кнопка добавления ведомости
    document.querySelector('.section.vedomost .section_table_add')?.addEventListener('click', showAddForm);

    // Кнопки в таблице ведомостей
    document.addEventListener('click', (e) => {
        const row = e.target.closest('.table_row');
        if (!row || row.classList.contains('th')) return;

        const vedomostId = row.querySelector('div:nth-child(2)').textContent;
        if (!vedomostId) return;

        if (e.target.classList.contains('table_row_print') || e.target.closest('.table_row_print')) {
            printVedomost(vedomostId);
        } else if (e.target.classList.contains('table_row_change') || e.target.closest('.table_row_change')) {
            showEditForm(vedomostId);
        } else if (e.target.classList.contains('table_row_delete') || e.target.closest('.table_row_delete')) {
            if (confirm(`Удалить ведомость ${vedomostId}?`)) {
                deleteVedomost(vedomostId, row);
            }
        }
    });

    // Управление таблицей материалов
    document.getElementById('ved_button_add')?.addEventListener('click', () => addMaterialRow());
    document.getElementById('ved_button_delete')?.addEventListener('click', removeMaterialRow);

    // Управление формой
    document.querySelector('.frame_ved_cont .confirm_but')?.addEventListener('click', submitForm);
    document.querySelector('.frame_ved_exit')?.addEventListener('click', hideForm);
}

// Функция печати ведомости
async function printVedomost(vedomostId) {
    try {
        // 1. Загружаем данные ведомости
        const vedomost = JSON.parse(JSON.stringify(
            await eel.collection_vedomost_form_load_records(vedomostId)()
        ));

        if (!vedomost) {
            throw new Error('Ведомость не найдена');
        }

        // 2. Загружаем дополнительные данные (организации, физ. лица)
        const [organizations, individuals] = await Promise.all([
            eel.collection_organizations_load_records()(),
            eel.collection_individuals_load_records()()
        ]);

        // 3. Находим нужные записи
        const homeOrg = organizations.find(org => org.name === vedomost.home_org) || {};
        const issuer = individuals.find(ind => 
            `${ind.surname} ${ind.name} ${ind.patronymic}` === vedomost.issuer
        ) || {};
        const receiver = individuals.find(ind => 
            `${ind.surname} ${ind.name} ${ind.patronymic}` === vedomost.receiver
        ) || {};

        // 4. Формируем HTML для печати
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ведомость выдачи №${vedomost.num_ved}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #000; padding: 5px; text-align: center; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .signature { margin-top: 30px; display: flex; justify-content: space-between; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>Унифицированная форма по ОКУД 0504210</div>
                    <div>Утвержденная постановлением Госкомстата России от 15.06.2020 №103н</div>
                    <h3>ВЕДОМОСТЬ ВЫДАЧИ МАТЕРИАЛЬНЫХ ЦЕННОСТЕЙ №${vedomost.num_ved}</h3>
                    <div>от ${vedomost.date || '_________'} г.</div>
                </div>

                <div>
                    <strong>Учреждение:</strong> ${homeOrg.name || ''}<br>
                    <strong>Материально ответственное лицо (отправитель):</strong> ${vedomost.issuer || ''}<br>
                    <strong>Материально ответственное лицо (получатель):</strong> ${vedomost.receiver || ''}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">№</th>
                            <th rowspan="2">Материальные запасы</th>
                            <th rowspan="2">Единица измерения</th>
                            <th rowspan="2">Количество</th>
                            <th rowspan="2">Цена, руб.</th>
                            <th rowspan="2">Сумма, руб.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vedomost.materials.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.material_value || ''}</td>
                                <td>${item.unit || 'шт.'}</td>
                                <td>${item.count || ''}</td>
                                <td>${item.price || ''}</td>
                                <td>${(item.count * item.price) || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="signature">
                    <div>
                        <strong>Выдал:</strong><br>
                        ${vedomost.issuer || ''}<br>
                        (подпись) _________________
                    </div>
                    <div>
                        <strong>Получил:</strong><br>
                        ${vedomost.receiver || ''}<br>
                        (подпись) _________________
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();

    } catch (error) {

    }
}

// Обновленный обработчик клика для печати
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('table_row_print')) {
        const row = e.target.closest('.table_row');
        if (row) {
            const vedomostId = row.querySelector('div:nth-child(2)').textContent;
            await printVedomost(vedomostId);
        }
    }
});

async function deleteVedomost(vedomostId, rowElement) {
    try {
        const result = await eel.collection_vedomost_delete(vedomostId)();
        if (result) {
            rowElement.remove();
            await updateVedomostTable(); // Обновление нумерации
        } else {
            throw new Error('Не удалось удалить ведомость');
        }
    } catch (error) {
 
    }
}

async function submitForm() {
    const submitButton = document.querySelector('.frame_ved_cont .confirm_but');
    if (!submitButton) return;

    console.log("Начало обработки формы...");

    try {
        // 1. Сбор данных
        const formData = {
            num_ved: document.getElementById('ved_num_ved').value.trim(),
            date: document.getElementById('ved_date').value.trim(),
            home_org: document.getElementById('ved_home_org').options[document.getElementById('ved_home_org').selectedIndex]?.text,
            issuer: document.getElementById('ved_issuer').options[document.getElementById('ved_issuer').selectedIndex]?.text,
            receiver: document.getElementById('ved_receiver').options[document.getElementById('ved_receiver').selectedIndex]?.text,
            materials: []
        };

        // 2. Сбор материалов
        document.querySelectorAll('.ved_enter_data_field table tr:not(:first-child)').forEach(row => {
            const select = row.querySelector('select');
            const count = row.querySelector('input[type="number"]').value;
            
            if (select && select.selectedIndex > 0 && count) {
                formData.materials.push({
                    material_value: select.options[select.selectedIndex].text,
                    count: count
                });
            }
        });

        console.log("Собранные данные:", formData);

        // 3. Валидация
        if (!formData.num_ved) {
            alert('Введите номер ведомости');
            return;
        }

        if (!formData.date) {
            alert('Укажите дату');
            return;
        }

        if (formData.materials.length === 0) {
            alert('Добавьте хотя бы один материал');
            return;
        }

        // 4. Отправка
        console.log("Отправка данных на сервер...");
        const response = await eel.collection_vedomost_add(
            formData.num_ved,
            formData.date,
            formData.home_org,
            formData.issuer,
            formData.receiver,
            formData.materials
        )();

        console.log("Ответ сервера:", response);

        // 5. Обработка ответа
        if (response?.status) {
            alert('Ведомость успешно добавлена!');
            await updateVedomostTable();
            hideForm();
        } else {
            const reason = response?.reason || 'неизвестная ошибка';
            alert(`Ошибка добавления: ${reason}`);
        }

    } catch (error) {

    }
}

function getSelectedText(selectId) {
    const select = document.getElementById(selectId);
    if (!select || select.selectedIndex < 0) return '';
    return select.options[select.selectedIndex].text;
}

function hideForm() {
    const form = document.getElementById('frame_ved');
    if (form) form.style.display = 'none';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadAllData();
        setupEventListeners();
        await updateVedomostTable();
    } catch (error) {
    }
});