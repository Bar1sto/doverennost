'use strict';

// Инициализация зависимостей
const scriptIndividuals = document.createElement('script');
scriptIndividuals.src = 'individuals.js';
document.head.appendChild(scriptIndividuals);

const scriptOrganizations = document.createElement('script');
scriptOrganizations.src = 'organizations.js';
document.head.appendChild(scriptOrganizations);

// Глобальные переменные
let prikaz_num_current;
let list_data_individuals = [];
let list_data_organizations = [];
let open_k = 1; // Флаг для проверки открытия формы

// Основные функции

async function loadAllData() {
    try {
        console.log('Загрузка данных...');
        const [individuals, organizations] = await Promise.all([
            eel.collection_individuals_load_records()(),
            eel.collection_organizations_load_records()()
        ]);

        list_data_individuals = JSON.parse(JSON.stringify(individuals));
        list_data_organizations = JSON.parse(JSON.stringify(organizations));

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
    element.innerHTML = '<option value="">Выберите значение</option>';
    for (let i = 0; i < list_data.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        if (isIndividuals && list_data[i].surname) {
            opt.innerHTML = `${list_data[i].surname} ${list_data[i].name} ${list_data[i].patronymic}`;
        } else {
            opt.innerHTML = list_data[i].name || "Unnamed";
        }
        element.appendChild(opt);
    }
}

// Функция для поиска значения в select
function setSelectValue(selectIdOrElement, valueToFind) {
    const select = typeof selectIdOrElement === 'string'
        ? document.getElementById(selectIdOrElement)
        : selectIdOrElement;
    if (!select || !valueToFind) return;

    valueToFind = valueToFind.trim().toLowerCase();
    for (let option of select.options) {
        if (option.innerText.trim().toLowerCase() === valueToFind) {
            select.value = option.value;
            return;
        }
    }
    console.warn(`Значение '${valueToFind}' не найдено в списке`);
}

async function updatePrikazTable() {
    const table = document.querySelector('.section.prikaz .section_table');
    if (!table) {
        console.error('Таблица приказов не найдена');
        return;
    }

    table.innerHTML = `
        <div class="table_row th">
            <div>№</div>
            <div>Номер приказа</div>
            <div>Дата</div>
            <div>Организация</div>
            <div>Действия</div>
        </div>
    `;

    try {
        const records = JSON.parse(JSON.stringify(await eel.collection_prikaz_load_records()()));
        if (!records || !records.length) return;

        records.forEach((rec, idx) => {
            const date = rec.issue_date
                ? `${rec.issue_date.day}.${rec.issue_date.month}.${rec.issue_date.year}`
                : '—';
            const row = `
                <div class="table_row" data-prikaz-id="${rec.order_number}">
                    <div>${idx + 1}</div>
                    <div>${rec.order_number}</div>
                    <div>${date}</div>
                    <div>${rec.organization || ''}</div>
                    <div class="actions">
                        <div class="table_row_print" title="Печать"></div>
                        <div class="table_row_change" title="Изменить"></div>
                        <div class="table_row_delete" title="Удалить"></div>
                    </div>
                </div>
            `;
            table.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Ошибка обновления таблицы:', error);
        alert('Ошибка загрузки данных приказов. Проверьте консоль для подробностей.');
    }
}

// Функции для работы с формой

async function showAddForm() {
    const form = document.getElementById('frame_prikaz');
    if (!form) return;

    document.querySelector(".frame_prikaz_cont .frame_title").textContent = "Добавление приказа";
    const btn = document.querySelector(".frame_prikaz_cont .confirm_but");
    btn.textContent = "Добавить";
    btn.dataset.mode = "add";

    resetForm();

    if (open_k) {
        await loadAllData();
        open_k = 0;
    }

    addSelect(document.getElementById('prikaz_organization'), list_data_organizations);
    addSelect(document.getElementById('prikaz_from_org'), list_data_organizations);
    addSelect(document.getElementById('prikaz_to_org'), list_data_organizations);

    initEmployeesTable();
    form.style.display = 'flex';
}

async function showEditForm(prikazId) {
    const form = document.getElementById('frame_prikaz');
    if (!form) return;

    try {
        const prikaz = JSON.parse(JSON.stringify(
            await eel.collection_prikaz_form_load_records(prikazId)() || {}
        ));
        if (!prikaz.order_number) throw new Error('Не найден');

        document.querySelector(".frame_prikaz_cont .frame_title").textContent = "Редактирование приказа";
        const btn = document.querySelector(".frame_prikaz_cont .confirm_but");
        btn.textContent = "Обновить";
        btn.dataset.mode = "edit";

        resetForm();
        if (open_k) {
            await loadAllData();
            open_k = 0;
        }

        // Основные поля
        document.getElementById('prikaz_order_number').value = prikaz.order_number;
        document.getElementById('prikaz_order_number').dataset.oldValue = prikaz.order_number;
        document.getElementById('prikaz_issue_day').value = prikaz.issue_date?.day || '';
        document.getElementById('prikaz_issue_month').value = prikaz.issue_date?.month || '';
        document.getElementById('prikaz_issue_year').value = prikaz.issue_date?.year || '';

        document.getElementById('prikaz_approval_day').value = prikaz.approval_date?.day || '';
        document.getElementById('prikaz_approval_month').value = prikaz.approval_date?.month || '';
        document.getElementById('prikaz_approval_year').value = prikaz.approval_date?.year || '';

        document.getElementById('prikaz_entry_day').value = prikaz.entry_date?.day || '';
        document.getElementById('prikaz_entry_month').value = prikaz.entry_date?.month || '';
        document.getElementById('prikaz_entry_year').value = prikaz.entry_date?.year || '';

        document.getElementById('prikaz_department').value = prikaz.department || '';
        document.getElementById('prikaz_responsible_person').value = prikaz.responsible_person || '';
        document.getElementById('prikaz_transfer_reason').value = prikaz.transfer_reason || '';
        document.getElementById('prikaz_comment').value = prikaz.comment || '';

        // Select-ы
        addSelect(document.getElementById('prikaz_organization'), list_data_organizations);
        addSelect(document.getElementById('prikaz_from_org'), list_data_organizations);
        addSelect(document.getElementById('prikaz_to_org'), list_data_organizations);
        setTimeout(() => {
            setSelectValue('prikaz_organization', prikaz.organization);
            setSelectValue('prikaz_from_org', prikaz.transfer_details?.from_org);
            setSelectValue('prikaz_to_org', prikaz.transfer_details?.to_org);
        }, 100);

        // Сотрудники
        initEmployeesTable(prikaz.employees || [{}]);

        form.style.display = 'flex';
    } catch (error) {
        console.error(`Ошибка загрузки приказа ${prikazId}:`, error);
        alert('Не удалось загрузить данные приказа для редактирования');
    }
}

function resetForm() {
    document.querySelectorAll('#frame_prikaz input').forEach(i => {
        i.value = '';
        i.removeAttribute('data-old-value');
    });
    document.querySelectorAll('#frame_prikaz select').forEach(s => {
        s.selectedIndex = 0;
    });
    const tbl = document.querySelector('.prikaz_enter_data_field table');
    if (tbl) {
        while (tbl.rows.length > 1) tbl.deleteRow(1);
    }
}

// Работа с таблицей сотрудников

function initEmployeesTable(employees = [{}]) {
    const table = document.querySelector('.prikaz_enter_data_field table');
    if (!table) return;
    while (table.rows.length > 1) table.deleteRow(1);
    employees.forEach((emp, idx) => addEmployeeRow(emp, idx + 1));
}

function addEmployeeRow(employee = {}, rowNumber = null) {
    const table = document.querySelector('.prikaz_enter_data_field table');
    if (!table) return;
    const num = rowNumber || table.rows.length;
    const row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" class="row-number" value="${num}" readonly></td>
        <td>
            <select class="employee-position">
                <option value="">Выберите должность</option>
                <option value="Директор">Директор</option>
                <option value="Менеджер">Менеджер</option>
                <option value="Бухгалтер">Бухгалтер</option>
                <option value="Инженер">Инженер</option>
                <option value="Техник">Техник</option>
                <option value="Начальник отдела">Начальник отдела</option>
            </select>
        </td>
        <td>
            <select class="employee-fio">
                <option value="">Выберите сотрудника</option>
            </select>
        </td>
        <td>
            <input type="text" class="employee-previous-position" placeholder="Предыдущая должность" value="${employee.previous_position || ''}">
        </td>
        <td>
            <select class="employee-transfer-type">
                <option value="">Тип перевода</option>
                <option value="Постоянный">Постоянный</option>
                <option value="Временный">Временный</option>
            </select>
        </td>
    `;

    // ФИО
    const fioSel = row.querySelector('.employee-fio');
    addSelect(fioSel, list_data_individuals, true);
    if (employee.fio_id) {
        const found = list_data_individuals.find(ind => ind._id === employee.fio_id);
        if (found) {
            setTimeout(() => setSelectValue(fioSel, `${found.surname} ${found.name} ${found.patronymic}`), 100);
        }
    }

    // Должность
    const posSel = row.querySelector('.employee-position');
    if (employee.position) posSel.value = employee.position;

    // Тип перевода
    const typeSel = row.querySelector('.employee-transfer-type');
    if (employee.transfer_type) typeSel.value = employee.transfer_type;

    updateEmployeeRowNumbers();
}

function removeEmployeeRow() {
    const tbl = document.querySelector('.prikaz_enter_data_field table');
    if (!tbl || tbl.rows.length <= 2) {
        alert('Должна остаться хотя бы одна строка с сотрудником');
        return;
    }
    tbl.deleteRow(tbl.rows.length - 1);
    updateEmployeeRowNumbers();
}

function updateEmployeeRowNumbers() {
    document.querySelectorAll('.prikaz_enter_data_field table tr:not(:first-child)').forEach((row, i) => {
        row.querySelector('.row-number').value = i + 1;
    });
}

// Обработчики событий

function setupEventListeners() {
    document.querySelector('.section.prikaz .section_table_add')?.addEventListener('click', showAddForm);

    document.addEventListener('click', (e) => {
        const row = e.target.closest('.table_row');
        if (!row || row.classList.contains('th')) return;
        const id = row.querySelector('div:nth-child(2)').textContent;
        if (e.target.closest('.table_row_print')) {
            printPrikaz(id);
        } else if (e.target.closest('.table_row_change')) {
            showEditForm(id);
        } else if (e.target.closest('.table_row_delete')) {
            if (confirm(`Удалить приказ ${id}?`)) deletePrikaz(id, row);
        }
    });

    document.getElementById('prikaz_button_add')?.addEventListener('click', () => addEmployeeRow());
    document.getElementById('prikaz_button_delete')?.addEventListener('click', removeEmployeeRow);

    document.querySelector('.frame_prikaz_cont .confirm_but')?.addEventListener('click', submitForm);
    document.querySelector('.frame_prikaz_exit')?.addEventListener('click', hideForm);
}

// Функция печати приказа



// Удаление приказа
async function deletePrikaz(prikazId, rowEl) {
    try {
        const ok = await eel.collection_prikaz_delete(prikazId)();
        if (ok) {
            rowEl.remove();
            await updatePrikazTable();
        } else {
            throw new Error();
        }
    } catch {
        alert('Ошибка при удалении приказа');
    }
}

// Отправка формы

async function submitForm() {
    const btn = document.querySelector('.frame_prikaz_cont .confirm_but');
    if (!btn) return;

    try {
        const formData = {
            order_number: document.getElementById('prikaz_order_number').value.trim(),
            organization: document.getElementById('prikaz_organization').options[document.getElementById('prikaz_organization').selectedIndex]?.text.trim(),
            issue_day: document.getElementById('prikaz_issue_day').value.trim(),
            issue_month: document.getElementById('prikaz_issue_month').value.trim(),
            issue_year: document.getElementById('prikaz_issue_year').value.trim(),

            approval_day: document.getElementById('prikaz_approval_day').value.trim(),
            approval_month: document.getElementById('prikaz_approval_month').value.trim(),
            approval_year: document.getElementById('prikaz_approval_year').value.trim(),

            entry_day: document.getElementById('prikaz_entry_day').value.trim(),
            entry_month: document.getElementById('prikaz_entry_month').value.trim(),
            entry_year: document.getElementById('prikaz_entry_year').value.trim(),

            department: document.getElementById('prikaz_department').value.trim(),
            responsible_person: document.getElementById('prikaz_responsible_person').value.trim(),
            transfer_reason: document.getElementById('prikaz_transfer_reason').value.trim(),
            comment: document.getElementById('prikaz_comment').value.trim(),

            employees: [],
            from_org: document.getElementById('prikaz_from_org').options[document.getElementById('prikaz_from_org').selectedIndex]?.text.trim(),
            to_org: document.getElementById('prikaz_to_org').options[document.getElementById('prikaz_to_org').selectedIndex]?.text.trim()
        };

        // Валидация полей
        if (!formData.order_number) { alert('Введите номер приказа'); return; }
        if (!formData.organization) { alert('Укажите организацию'); return; }
        if (!formData.issue_day || !formData.issue_month || !formData.issue_year) {
            alert('Укажите дату приказа'); return;
        }
        if (!formData.approval_day || !formData.approval_month || !formData.approval_year) {
            alert('Укажите дату утверждения'); return;
        }
        if (!formData.entry_day || !formData.entry_month || !formData.entry_year) {
            alert('Укажите дату внесения записи'); return;
        }
        if (!formData.department) { alert('Укажите подразделение'); return; }
        if (!formData.responsible_person) { alert('Укажите ответственного'); return; }
        if (!formData.transfer_reason) { alert('Укажите причину перевода'); return; }

        // Сбор сотрудников
        document.querySelectorAll('.prikaz_enter_data_field table tr:not(:first-child)').forEach(row => {
            const pos = row.querySelector('.employee-position');
            const fio = row.querySelector('.employee-fio');
            const prev = row.querySelector('.employee-previous-position');
            const type = row.querySelector('.employee-transfer-type');

            if (pos && pos.value && fio && fio.selectedIndex > 0) {
                const txt = fio.options[fio.selectedIndex].text.trim();
                const emp = list_data_individuals.find(ind =>
                    `${ind.surname} ${ind.name} ${ind.patronymic}` === txt
                );
                if (emp) {
                    formData.employees.push({
                        position: pos.value,
                        fio_id: emp._id,
                        previous_position: prev?.value.trim() || '',
                        transfer_type: type?.value || ''
                    });
                }
            }
        });

        if (!formData.employees.length) {
            alert('Добавьте хотя бы одного сотрудника');
            return;
        }
        if (!formData.from_org || !formData.to_org) {
            alert('Укажите организации для перевода');
            return;
        }

        // Отправка на сервер
        let res;
        if (btn.dataset.mode === 'add') {
            res = await eel.collection_prikaz_add(
                formData.organization,
                formData.order_number,
                formData.issue_day, formData.issue_month, formData.issue_year,
                formData.approval_day, formData.approval_month, formData.approval_year,
                formData.entry_day, formData.entry_month, formData.entry_year,
                formData.department,
                formData.responsible_person,
                formData.transfer_reason,
                formData.comment,
                formData.employees,
                formData.from_org,
                formData.to_org
            )();
            if (res === 1) {
                alert('Приказ успешно добавлен!');
                await updatePrikazTable();
                hideForm();
            } else {
                alert('Ошибка: приказ с таким номером уже существует');
            }
        } else {
            const oldNum = document.getElementById('prikaz_order_number').dataset.oldValue;
            res = await eel.collection_prikaz_update(
                oldNum,
                formData.organization,
                formData.order_number,
                formData.issue_day, formData.issue_month, formData.issue_year,
                formData.approval_day, formData.approval_month, formData.approval_year,
                formData.entry_day, formData.entry_month, formData.entry_year,
                formData.department,
                formData.responsible_person,
                formData.transfer_reason,
                formData.comment,
                formData.employees,
                formData.from_org,
                formData.to_org
            )();
            if (res) {
                alert('Приказ успешно обновлен!');
                await updatePrikazTable();
                hideForm();
            } else {
                alert('Ошибка обновления: приказ не найден');
            }
        }
    } catch (error) {
        console.error('Ошибка submitForm:', error);
        alert('Произошла ошибка. Проверьте консоль.');
    }
}

function hideForm() {
    const form = document.getElementById('frame_prikaz');
    if (form) form.style.display = 'none';
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadAllData();
        setupEventListeners();
        await updatePrikazTable();
    } catch (e) {
        console.error('Ошибка инициализации модуля приказов:', e);
    }
});
