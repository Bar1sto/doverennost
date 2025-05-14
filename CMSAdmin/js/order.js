'use strict';

const scriptOrganizations = document.createElement('script');
scriptOrganizations.src = 'organizations.js';
document.head.appendChild(scriptOrganizations);

const scriptItems = document.createElement('script');
scriptItems.src = 'items.js';
document.head.appendChild(scriptItems);

let list_data_organizations = [];
let list_data_items = [];
let open_order_k = 1;

async function loadOrderData() {
    try {
        const [orgs, items] = await Promise.all([
            eel.collection_organizations_load_records()(),
            eel.collection_items_load_records()()
        ]);
        list_data_organizations = JSON.parse(JSON.stringify(orgs));
        list_data_items = JSON.parse(JSON.stringify(items));
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
    }
}

function fillSelect(select, data, placeholder) {
    if (!select) return;
    select.innerHTML = `<option value="">${placeholder}</option>`;
    data.forEach(d => {
        const text = d.name || '';
        const opt = document.createElement('option');
        opt.value = text;
        opt.textContent = text;
        select.appendChild(opt);
    });
}

function resetOrderForm() {
    const form = document.getElementById('frame_order');
    form.querySelectorAll('input').forEach(i => i.value = '');
    ['order_organization','order_supplier'].forEach(id => {
        const sel = document.getElementById(id);
        if (sel) sel.selectedIndex = 0;
    });
    const table = document.querySelector('.order_enter_data_field table');
    while (table.rows.length > 1) table.deleteRow(1);
    addMaterialRow();
}

function addMaterialRow(data = {}) {
    const table = document.querySelector('.order_enter_data_field table');
    if (!table) return;
    const row = table.insertRow();
    row.className = 'order_table_row';
    row.innerHTML = `
        <td></td>
        <td><select class="material-value-select"></select></td>
        <td>
            <select class="unit-select">
                <option value="">Ед. изм.</option>
                <option value="шт">шт</option>
                <option value="кг">кг</option>
                <option value="л">л</option>
                <option value="м">м</option>
                <option value="компл">компл</option>
            </select>
        </td>
        <td><input type="number" class="quantity" value="${data.quantity || ''}" /></td>
        <td><input type="number" class="price" value="${data.price || ''}" /></td>
        <td><input type="number" class="sum" value="${data.sum || ''}" readonly /></td>
    `;
    fillSelect(row.querySelector('.material-value-select'), list_data_items, 'Материал');
    if (data.name) row.querySelector('.material-value-select').value = data.name;
    if (data.unit) row.querySelector('.unit-select').value = data.unit;

    // Calculate sum automatically
    const qtyInput = row.querySelector('.quantity');
    const priceInput = row.querySelector('.price');
    const sumInput = row.querySelector('.sum');
    const calculateSum = () => {
        const q = parseFloat(qtyInput.value) || 0;
        const p = parseFloat(priceInput.value) || 0;
        sumInput.value = (q * p).toFixed(2);
    };
    qtyInput.addEventListener('input', calculateSum);
    priceInput.addEventListener('input', calculateSum);

    updateMaterialRowNumbers();
}

function removeMaterialRow() {
    const table = document.querySelector('.order_enter_data_field table');
    if (table.rows.length > 2) {
        table.deleteRow(table.rows.length - 1);
        updateMaterialRowNumbers();
    } else {
        alert('Должна остаться хотя бы одна строка');
    }
}

function updateMaterialRowNumbers() {
    document.querySelectorAll('.order_table_row').forEach((row, i) => {
        row.querySelector('td').textContent = i + 1;
    });
}

async function updateOrderTable() {
    const table = document.querySelector('.section.order .section_table');
    if (!table) return;
    table.innerHTML = `
        <div class="table_row th">
            <div>№</div>
            <div>Номер заказа</div>
            <div>Дата</div>
            <div>Организация</div>
            <div>Действия</div>
        </div>
    `;
    try {
        const records = await eel.collection_order_load_records()();
        records.forEach((r, i) => {
            const date = r.issue_date ? `${r.issue_date.day}.${r.issue_date.month}.${r.issue_date.year}` : '—';
            const row = `
                <div class="table_row" data-order-id="${r.order_number}">
                    <div>${i + 1}</div>
                    <div>${r.order_number}</div>
                    <div>${date}</div>
                    <div>${r.organization || ''}</div>
                    <div class="actions">
                        <div class="table_row_print" title="Печать"></div>
                        <div class="table_row_change" title="Изменить"></div>
                        <div class="table_row_delete" title="Удалить"></div>
                    </div>
                </div>`;
            table.insertAdjacentHTML('beforeend', row);
        });
    } catch (e) {
        console.error('Ошибка загрузки заказов:', e);
    }
}

async function showOrderForm(mode = 'add', orderData = null) {
    const form = document.getElementById('frame_order');
    const title = form.querySelector('.frame_title');
    const button = form.querySelector('.confirm_but');
    form.style.display = 'flex';
    if (mode === 'add') {
        title.textContent = 'Добавление приходного ордера';
        button.textContent = 'Добавить';
        button.dataset.mode = 'add';
    } else {
        title.textContent = 'Редактирование заказа';
        button.textContent = 'Обновить';
        button.dataset.mode = 'edit';
    }
    resetOrderForm();
    if (open_order_k) {
        await loadOrderData();
        open_order_k = 0;
    }
    const orgSelect = document.getElementById('order_organization');
    const suppSelect = document.getElementById('order_supplier');
    fillSelect(orgSelect, list_data_organizations, 'Организация');
    fillSelect(suppSelect, list_data_organizations, 'Поставщик');
    if (mode === 'edit' && orderData) {
        document.getElementById('order_order_number').value = orderData.order_number;
        document.getElementById('order_order_number').dataset.oldValue = orderData.order_number;
        document.getElementById('order_issue_day').value = orderData.issue_date?.day || '';
        document.getElementById('order_issue_month').value = orderData.issue_date?.month || '';
        document.getElementById('order_issue_year').value = orderData.issue_date?.year || '';
        document.getElementById('order_corresponding_account').value = orderData.corresponding_account || '';
        document.getElementById('order_document_number').value = orderData.document_number || '';
        document.getElementById('order_operation_type').value = orderData.operation_type || '';
        orgSelect.value = orderData.organization || '';
        suppSelect.value = orderData.supplier || '';
        const table = document.querySelector('.order_enter_data_field table');
        while (table.rows.length > 1) table.deleteRow(1);
        (orderData.material_values || []).forEach(mv => addMaterialRow(mv));
    }
}

function hideOrderForm() {
    document.getElementById('frame_order').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadOrderData();
    await updateOrderTable();

    document.querySelector('.section.order .section_table_add')?.addEventListener('click', () => showOrderForm('add'));
    document.getElementById('order_button_add')?.addEventListener('click', () => addMaterialRow());
    document.getElementById('order_button_delete')?.addEventListener('click', () => removeMaterialRow());

    document.addEventListener('click', async (e) => {
        // Scope order actions only to order section
        if (!e.target.closest('.section.order')) return;
        const row = e.target.closest('.table_row');
        if (!row || row.classList.contains('th')) return;
        const id = row.querySelector('div:nth-child(2)').textContent;

        if (e.target.closest('.table_row_delete')) {
            if (confirm(`Удалить заказ ${id}?`)) {
                await eel.collection_order_delete(id)();
                await updateOrderTable();
            }
        } else if (e.target.closest('.table_row_change')) {
            const data = await eel.collection_order_form_load_records(id)();
            showOrderForm('edit', data);
        }
    });

    document.querySelector('#frame_order_exit')?.addEventListener('click', hideOrderForm);
    document.querySelector('.frame_order_cont .confirm_but')?.addEventListener('click', async (event) => {
        const mode = event.target.dataset.mode;
        const data = {
            organization: document.getElementById('order_organization').value,
            order_number: document.getElementById('order_order_number').value,
            supplier: document.getElementById('order_supplier').value,
            corresponding_account: document.getElementById('order_corresponding_account').value,
            document_number: document.getElementById('order_document_number').value,
            issue_day: document.getElementById('order_issue_day').value,
            issue_month: document.getElementById('order_issue_month').value,
            issue_year: document.getElementById('order_issue_year').value,
            operation_type: document.getElementById('order_operation_type').value,
            material_values: []
        };
        document.querySelectorAll('.order_table_row').forEach(row => {
            data.material_values.push({
                name: row.querySelector('.material-value-select').value,
                unit: row.querySelector('.unit-select').value,
                quantity: row.querySelector('.quantity').value,
                price: row.querySelector('.price').value,
                sum: row.querySelector('.sum').value
            });
        });
        if (mode === 'add') {
            const result = await eel.collection_order_add(
                data.organization,
                data.order_number,
                data.supplier,
                data.corresponding_account,
                data.document_number,
                data.issue_day, data.issue_month, data.issue_year,
                data.operation_type,
                data.material_values
            )();
            if (result === 1) {
                alert('Заказ добавлен!');
                hideOrderForm();
                await updateOrderTable();
            } else {
                alert('Ошибка: заказ с таким номером уже существует');
            }
        } else {
            const oldId = document.getElementById('order_order_number').dataset.oldValue;
            const updated = await eel.collection_order_update(
                oldId,
                data.organization,
                data.order_number,
                data.supplier,
                data.corresponding_account,
                data.document_number,
                data.issue_day, data.issue_month, data.issue_year,
                data.operation_type,
                data.material_values
            )();
            if (updated) {
                alert('Заказ обновлен!');
                hideOrderForm();
                await updateOrderTable();
            } else {
                alert('Изменения не внесены');
            }
        }
    });
});
