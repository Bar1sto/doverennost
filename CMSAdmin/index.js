
var table_section_vedomost = document.querySelector('.section.vedomost');
var main_menu_documents_vedomost = document.querySelector('.main_menu-documents.vedomost');
var table_section_order = document.querySelector('.section.order');
var main_menu_documents_order = document.querySelector('.main_menu-documents.order');


document.addEventListener('DOMContentLoaded',()=> {
    
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-Frontend-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    
    //Функция обновления времени в шапке страницы-----------
        let header_time = document.querySelector('.header_time'); //Переменная DOM-элемента header_time, через которую обновляется значение времени
        setInterval(() => {
            let date = new Date(); //Переменная создания времени с помощью встроенного функции-конструктора Date
            header_time.textContent = date.toLocaleTimeString(); //Обновление значения переменной, ссылающейся на DOM-элемент, значения времени с переодичностью 1000мс=1с. toLocaleTimeString() - приводит к формату 00:00:00
        }, 1000);

    //Меню бургер, меню контент блок----------------------------------
    //Перменные-_-_-_-_-_-_-_-_-_-_
        var main_burger = document.querySelector('.main_burger'); //Переменная DOM-элемента main_burger ("Кнопка раскрытия меню")
        var main_menu = document.querySelector('.main_menu'); //Переменная DOM-элемента main_menu
        var main_menu_block = document.querySelector('.main_menu_block'); //Переменная DOM-элемента main_menu_block, содержащая секции "Документы", "Справочники"
        var main_content_block = document.querySelector('.main_content_block'); //Переменная DOM-элемента main_content_block, содержащая таблицы с контентом
    //
        var k = 1; //Переменная определения состояния меню. 1 - меню свернуто, 0 - развернуто
        main_burger.addEventListener('click', () => { //Добавление в обработчик выполнения стрелочной функции по клику
            if (k == 1) {
                main_menu.style.left = "0"; //Изменение CSS-свойства меню, свдигающее его вправо
                main_menu_block.style.opacity = 1; //Изменение CSS-свойства меню, делающее секции "Документы", "Справочники" видимыми
                main_burger.classList.add("active"); //Добавление класса "Бургеру", превращаюшего его в крестик
                main_content_block.style.width = "80%"; //Изменение ширины DOM-элемента main_content_block, содержащего таблицы с контентом
                k = 0; 
            } else {
                main_menu.style.left = "-15%"; //Изменение CSS-свойства меню, свдигающее его  влево
                main_menu_block.style.opacity = 0; //Изменение CSS-свойства меню, делающее секции "Документы", "Справочники" невидимыми
                main_burger.classList.remove("active"); //Удаление класса "Бургеру", превращаюшего его в "3 палочки"
                main_content_block.style.width = "95%"; //Изменение ширины DOM-элемента main_content_block, содержащего таблицы с контентом
                k = 1;
            }
        });

    //Меню: Секция "Документы"----------------------------------
    //Перменные-_-_-_-_-_-_-_-_-_-_
        var main_menu_documents = document.querySelector('.main_menu-documents'); //Переменная DOM-элемента main_menu-documents, кнопка секции "Документы"
        var main_menu_guides = document.querySelector('.main_menu-guides'); //Переменная DOM-элемента main_menu-guides, кнопка секции "Справочники"
        var main_menu_guides_block_list = document.querySelectorAll('.main_menu-guides'); //Переменная DOM-элемента main_menu-guides, хранящая позиции справочников "Физические лица", "Организации", "Товары"
    //


        // Меню: Секция "Документы" (обновленная версия)
// Переменные
//var main_menu_documents = document.querySelector('.main_menu-documents');
var main_menu_documents_block = document.querySelector('.main_menu-documents_block');
var main_menu_documents_block_list = document.querySelectorAll('.main_menu-documents.doverennost');

var t_docs = 1; // Переменная состояния меню документов (1 - свернуто, 0 - развернуто)

// Обработчик клика по основному пункту "Документы"
main_menu_documents.addEventListener('click', () => {
    main_menu_guides.classList.remove("active");
    main_menu_guides_block.setAttribute("hidden", "");
    t = 1;
    
    main_menu_documents.classList.add("active");
    
    if (t_docs == 1) {
        main_menu_documents_block.removeAttribute("hidden");
        t_docs = 0;
    } else {
        main_menu_documents_block.setAttribute("hidden", "");
        t_docs = 1;
    }
});

// Обработчики для подпунктов документов
var main_menu_documents_doverennost = document.querySelector('.main_menu-documents.doverennost');
var main_menu_documents_vedomost = document.querySelector('.main_menu-documents.vedomost');
var main_menu_documents_items = document.querySelector('.main_menu-documents.items');

// Обработчик для пункта "Доверенность"
main_menu_documents_doverennost.addEventListener('click', () => {
    resetAllSections();
    
    main_menu_documents.classList.add("active");
    main_menu_documents_doverennost.classList.add("active");
    table_section_documents.classList.add("active"); // Показываем таблицу документов
    
    // Загружаем данные доверенностей
    loadDoverennostData();
});


main_menu_documents_order.addEventListener('click', async () => {
    resetAllSections();
    
    main_menu_documents.classList.add("active");
    main_menu_documents_order.classList.add("active");
    table_section_order.classList.add("active");
    
    try {
        let records = await eel.collection_order_load_records()();
        updateOrderTable(records);
    } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
    }
});


async function updateOrderTable(records) {
    let table = document.querySelector('.section.order .section_table');
    if (!table) return;

    table.innerHTML = `
        <div class="table_row th">
            <div>№</div>
            <div>Номер ордера</div>
            <div>Дата</div>
            <div>Организация</div>
            <div>Действия</div>
        </div>
    `;

    records.forEach((record, index) => {
        const date = record.issue_date ? 
            `${record.issue_date.day}.${record.issue_date.month}.${record.issue_date.year}` : 
            'Не указана';

        let newElement = `
            <div class="table_row">
                <div>${index + 1}</div>
                <div>${record.order_number}</div>
                <div>${date}</div>
                <div>${record.organization || ''}</div>
                <div>
                    <div class="table_row_print" title="Печать"></div>
                    <div class="table_row_change" title="Изменить"></div>
                    <div class="table_row_delete" title="Удалить"></div>
                </div>
            </div>
        `;
        table.insertAdjacentHTML('beforeend', newElement);
    });
}


document.addEventListener('click', async function(event) {
    if (event.target.classList.contains("table_row_print") && event.target.closest(".order")) {
        try {
            let row = event.target.closest(".table_row");
            if (!row) return;

            let orderId = row.querySelector("div:nth-child(2)").textContent.trim();
            let order = await eel.collection_order_form_load_records(orderId)();

            if (!order) {
                alert("Ошибка: заказ не найден");
                return;
            }

            const formatDate = (date) => {
                if (!date) return '__.__.____';
                return `${date.day || '__'}.${date.month || '__'}.${date.year || '____'}`;
            };

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Приходный ордер №${order.order_number}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
                        h1, h2, h3 { text-align: center; margin: 0; }
                        .section { margin-bottom: 15px; }
                        .label { font-weight: bold; }
                        .info { margin-left: 10px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #333; padding: 6px; text-align: center; }
                        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
                        .signature { text-align: right; margin-top: 40px; }
                    </style>
                </head>
                <body>
                    <h2>Приходный ордер на склад</h2>
                    <div class="section">
                        <span class="label">Номер ордера:</span> <span class="info">${order.order_number}</span><br>
                        <span class="label">Дата:</span> <span class="info">${formatDate(order.issue_date)}</span><br>
                        <span class="label">Организация:</span> <span class="info">${order.organization}</span><br>
                        <span class="label">Поставщик:</span> <span class="info">${order.supplier}</span><br>
                        <span class="label">Тип операции:</span> <span class="info">${order.operation_type}</span><br>
                        <span class="label">Корр. счёт:</span> <span class="info">${order.corresponding_account}</span>
                    </div>

                    <h3>Материальные ценности</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Наименование</th>
                                <th>Ед. изм.</th>
                                <th>Количество</th>
                                <th>Цена</th>
                                <th>Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(order.material_values || []).map((val, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${val.name || ''}</td>
                                    <td>${val.unit || ''}</td>
                                    <td>${val.quantity || ''}</td>
                                    <td>${val.price || ''}</td>
                                    <td>${val.sum || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="signature">
                        <p>Ответственное лицо:</p>
                        <p>______________________</p>
                    </div>

                    <script>
                        window.onload = () => {
                            window.print();
                            setTimeout(() => window.close(), 700);
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();

        } catch (error) {
            console.error("Ошибка при печати заказа:", error);
            alert("Не удалось напечатать заказ. См. консоль.");
        }
    }
});



async function updateVedomostTable(records) {
    let table = document.querySelector('.section.vedomost .section_table');
    if (!table) return;

    // Очистка таблицы
    table.innerHTML = `
        <div class="table_row th">
            <div>№</div>
            <div>Номер ведомости</div>
            <div>Дата</div>
            <div>Действия</div>
        </div>
    `;

    // Заполнение данными
    records.forEach((record, index) => {
        let newElement = `
            <div class="table_row">
                <div>${index + 1}</div>
                <div>${record.num_ved}</div>
                <div>${record.date}</div>
                <div>
                    <div class="table_row_print" title="Печать"></div>
                    <div class="table_row_change" title="Изменить"></div>
                    <div class="table_row_delete" title="Удалить"></div>
                </div>
            </div>
        `;
        table.insertAdjacentHTML('beforeend', newElement);
    });
}
// Обработчик для пункта "Ведомость на выдачу продукции"
main_menu_documents_vedomost.addEventListener('click', async () => {
    resetAllSections();
    
    main_menu_documents.classList.add("active");
    main_menu_documents_vedomost.classList.add("active");
    table_section_vedomost.classList.add("active");
    
    // Загружаем данные ведомостей
    try {
        let records = await eel.collection_vedomost_load_records()();
        updateVedomostTable(records);
    } catch (error) {
        console.error("Ошибка загрузки ведомостей:", error);
    }
});

// Функция загрузки данных доверенностей
async function loadDoverennostData() {
    try {
        let record = await eel.collection_documents_load_records()();
        console.log("Загруженные данные доверенностей: ", record);

        if (!record || record.length === 0) {
            console.error("Данные доверенностей отсутствуют или не получены!");
            return;
        }

        let table = document.querySelector('.section.documents .section_table');
        if (!table) {
            console.error("Таблица доверенностей не найдена!");
            return;
        }

        // Очистка старых данных
        table.innerHTML = `<div class="table_row th"><div>№</div><div>Номер доверенности</div><div><div>Действительна</div><div><div>c</div><div>по</div></div></div><div>Действия</div></div>`;

        // Вставка новых данных
        let index = 0;
        while (record[index]) {
            let newElement = `<div class="table_row">
                <div>${index + 1}</div>
                <div>${record[index].num_dover}</div>
                <div>
                    <div>${record[index].issue_with[0].day}.${record[index].issue_with[0].month}.${record[index].issue_with[0].year}</div>
                    <div>${record[index].issue_for[0].day}.${record[index].issue_for[0].month}.${record[index].issue_for[0].year}</div>
                </div>
                <div>
                    <div class="table_row_print" title="Печать"></div>
                    <div class="table_row_change" title="Изменить"></div>
                    <div class="table_row_delete" title="Удалить"></div>
                </div>
            </div>`;
            table.insertAdjacentHTML('beforeend', newElement);
            index++;
        }
    } catch (error) {
        console.error("Ошибка при загрузке данных доверенностей: ", error);
    }
}

// Функция сброса всех секций
function resetAllSections() {
    // Сбрасываем активные классы у всех пунктов меню
    main_menu_guides.classList.remove("active");
    main_menu_documents.classList.remove("active");
    
    // Сбрасываем активные классы у всех подпунктов
    main_menu_guides_block_list.forEach(entry => entry.classList.remove("active"));
    main_menu_documents_block_list.forEach(entry => entry.classList.remove("active"));
    
    // Скрываем все таблицы
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove("active");
    });
    
    // Скрываем выпадающие блоки
    main_menu_guides_block.setAttribute("hidden", "");
    main_menu_documents_block.setAttribute("hidden", "");
    t = 1;
    t_docs = 1;
}

// Обработчик печати доверенности (остается без изменений)
document.addEventListener('click', async function(event) {
    if (event.target.classList.contains("table_row_print")) {
        // ... существующий код печати ...
    }
});

    //Меню: секция "Справочники"----------------------------------
    //Перменные-_-_-_-_-_-_-_-_-_-_
    let addDocumentButton = document.querySelector('.section.documents .section_table_add');
addDocumentButton.addEventListener('click', async () => {
    let doc_num_dover = document.querySelector('#doc_num_dover').value;
    let doc_home_org = document.querySelector('#doc_home_org').value;
    let doc_issue_with_day = document.querySelector('#doc_issue_with_day').value;
    let doc_issue_with_month = document.querySelector('#doc_issue_with_month').value;
    let doc_issue_with_year = document.querySelector('#doc_issue_with_year').value;
    let doc_issue_for_day = document.querySelector('#doc_issue_for_day').value;
    let doc_issue_for_month = document.querySelector('#doc_issue_for_month').value;
    let doc_issue_for_year = document.querySelector('#doc_issue_for_year').value;
    let doc_consumer_org = document.querySelector('#doc_consumer_org').value;
    let doc_payer_org = document.querySelector('#doc_payer_org').value;
    let doc_issue_from_position = document.querySelector('#doc_issue_from_position').value;
    let doc_issue_from_FIO = document.querySelector('#doc_issue_from_FIO').value;
    let doc_issue_get_from_org = document.querySelector('#doc_issue_get_from_org').value;
    let doc_issue_get_num_doc = document.querySelector('#doc_issue_get_num_doc').value;
    let doc_table_rows = []; // Массив для хранения данных из таблицы

    // Собираем данные из таблицы
    document.querySelectorAll('#doc_table_row').forEach(row => {
        let rowData = {
            material_value: row.children[1].value,
            count: row.children[2].value
        };
        doc_table_rows.push(rowData);
    });

    // Вызов функции добавления документа на сервере
    let result = await eel.collection_documents_add(
        doc_num_dover,
        doc_home_org,
        doc_issue_with_day,
        doc_issue_with_month,
        doc_issue_with_year,
        doc_issue_for_day,
        doc_issue_for_month,
        doc_issue_for_year,
        doc_consumer_org,
        doc_payer_org,
        doc_issue_from_position,
        doc_issue_from_FIO,
        doc_issue_get_from_org,
        doc_issue_get_num_doc,
        doc_table_rows
    )();

    if (result === 1) {
        pass;
    } else {
        alert('Запись с таким номером уже существует');
    }
});


        var t = 1; //Переменная определения состояния меню. 1 - меню свернуто, 0 - развернуто, наподобие k
        var main_menu_guides_block = document.querySelector('.main_menu-guides_block'); //Блок выпадающего списка справочников "Физ.лица", "Организации", "Товары"

        main_menu_guides.addEventListener('click', () => { //Добавление в обработчик выполнения стрелочной функции по клику
            main_menu_documents.classList.remove("active"); //Удаление класса у кнопки секции "Документы", подсвечивающего ее белым цветом
            main_menu_guides.classList.add("active"); //Добавление класса у кнопки секции "Документы", подсвечивающего ее белым цветом
            if (t == 1) {
                main_menu_guides_block.removeAttribute("hidden", ""); //Выпадающий список со справочниками "Физлица" и т.д отображается
                t = 0;
            } else {
                main_menu_guides_block.setAttribute("hidden", ""); //Выпадающий список со справочниками "Физлица" и т.д скрывается
                t = 1;
            }
        });

    //Настройка разделов выпадающего списка Справочников
    //Перменные-_-_-_-_-_-_-_-_-_-_
        var main_menu_guides_block_individuals = document.querySelector('.main_menu-guides.individuals'); //Кнопка-опция Физические лица
        var main_menu_guides_block_organizations = document.querySelector('.main_menu-guides.organizations'); //Кнопка-опция Организации
        var main_menu_guides_block_items = document.querySelector('.main_menu-guides.items'); //Кнопка-опция Товары
        var table_section_documents = document.querySelector('.section.documents'); //Контент блок, с таблицей Документы
        var table_section_individuals = document.querySelector('.section.individuals'); //Контент блок, с таблицей Физ.лица
        var table_section_organizations = document.querySelector('.section.organizations'); //Контент блок, с таблицей Организации
        var table_section_items = document.querySelector('.section.items'); //Контент блок, с таблицей Товары
    //
        main_menu_guides_block_individuals.addEventListener('click', () => { //Добавление в обработчик выполнения стрелочной функции по клику на кнопку-опцию Физ.лица
            resetAllSections();
            main_menu_documents.classList.remove("active"); //Отключение подсветки кнопки-опции Документы
            main_menu_guides_block_organizations.classList.remove("active"); //Отключение подсветки кнопки-опции Организации
            main_menu_guides_block_items.classList.remove("active"); //Отключение подсветки кнопки-опции Документы

            table_section_documents.classList.remove("active"); //Отключение контент-таблицы секции Документы
            table_section_organizations.classList.remove("active"); //Отключение контент-таблицы секции Организации
            table_section_items.classList.remove("active"); //Отключение контент-таблицы секции Товары

            main_menu_guides.classList.add("active"); //включаем подсветку кнопки-опции Справочники
            main_menu_guides_block_individuals.classList.add("active"); //включаем подсветку кнопки-опции физ.лица
            table_section_individuals.classList.add("active"); //отоюражаем контент-таблицу физ.лица
        });

        main_menu_guides_block_organizations.addEventListener('click', () => { //Добавление в обработчик выполнения стрелочной функции по клику на кнопку-опцию Организации
            resetAllSections();
            main_menu_documents.classList.remove("active"); //Отключение подсветки кнопки-опции Документы
            main_menu_guides_block_items.classList.remove("active"); //Отключение подсветки кнопки-опции Товары
            main_menu_guides_block_individuals.classList.remove("active"); //Отключение подсветки кнопки-опции Физ.лица

            table_section_documents.classList.remove("active"); //Отключение контент-таблицы секции Документы
            table_section_individuals.classList.remove("active"); //Отключение контент-таблицы секции Физ.лица
            table_section_items.classList.remove("active"); //Отключение контент-таблицы секции Товары

            main_menu_guides.classList.add("active"); //включаем подсветку кнопки-опции Справочники
            main_menu_guides_block_organizations.classList.add("active"); //отоюражаем подсветку кнопки-опции Организации
            table_section_organizations.classList.add("active"); //отображаем контент-таблицу Организации
        });

        main_menu_guides_block_items.addEventListener('click', () => { //Добавление в обработчик выполнения стрелочной функции по клику на кнопку-опцию Товары
            resetAllSections();
            main_menu_documents.classList.remove("active"); //Отключение подсветки кнопки-опции Документы
            main_menu_guides_block_organizations.classList.remove("active"); //Отключение подсветки кнопки-опции Организации
            main_menu_guides_block_individuals.classList.remove("active"); //Отключение подсветки кнопки-опции Физ.лица

            table_section_documents.classList.remove("active"); //Отключение контент-таблицы секции Документы
            table_section_individuals.classList.remove("active"); //Отключение контент-таблицы секции Физ.лица
            table_section_organizations.classList.remove("active"); //Отключение контент-таблицы секции Организации

            main_menu_guides.classList.add("active"); //включаем подсветку кнопки-опции Справочники
            main_menu_guides_block_items.classList.add("active"); //отображаем подсветку кнопки-опции Товары
            table_section_items.classList.add("active"); //отображаем контент-таблицу Товары     
        });
       
    
    
        document.addEventListener('DOMContentLoaded', () => {
            let menu_position = document.querySelector('.main_menu-documents');
            let index_visited = 1;
        
            menu_position.addEventListener('click', async () => {
                if (index_visited) {
                    try {
                        let record = await eel.collection_documents_load_records()();
                        console.log("Загруженные данные: ", record); // Логирование данных
        
                        if (!record || record.length === 0) {
                            console.error("Данные отсутствуют или не получены!");
                            return;
                        }
        
                        let table = document.querySelector('.section.documents .section_table');
                        if (!table) {
                            console.error("Таблица документов не найдена!");
                            return;
                        }
        
                        // Очистка старых данных в таблице перед обновлением
                        table.innerHTML = `<div class="table_row th"><div>№</div><div>Номер документа</div><div><div>Действителен</div><div><div>c</div><div>по</div></div></div><div>⚙</div></div>`;
        
                        // Вставка данных в таблицу
                        let index = 0;
                        while (record[index]) {
                            let newElement = `<div class="table_row">
                                <div>${index + 1}</div>
                                <div>${record[index].num_dover}</div>
                                <div><div>${record[index].issue_with[0].day}.${record[index].issue_with[0].month}.${record[index].issue_with[0].year}</div>
                                <div>${record[index].issue_for[0].day}.${record[index].issue_for[0].month}.${record[index].issue_for[0].year}</div></div>
                                <div><div class="table_row_print"></div><div class="table_row_change"></div><div class="table_row_delete"></div></div>
                            </div>`;
                            table.insertAdjacentHTML('beforeend', newElement);
                            index++;
                        }
                    } catch (error) {
                        console.error("Ошибка при загрузке данных: ", error);
                    }
                    index_visited = 0;
                }
            });
        });
        
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-Backend-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
  
//documents.js - файл с backend-функциями для секции Документы
//individuals.js - файл с backend-функциями для секции Физические лица
//organizations.js - файл с backend-функциями для секции Организации
//items.js - файл с backend-функциями для секции Товары

//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Открытие окна печати-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    document.addEventListener('DOMContentLoaded', async () => {
    let documentTable = document.querySelector('.section.documents .section_table');

    let documentsList = await eel.collection_documents_load_records()();
    documentsList.forEach((doc, index) => {
        documentTable.insertAdjacentHTML('beforeend',
            `<div class="table_row">
                <div>${index + 1}</div>
                <div>${doc.num_dover}</div>
                <div>
                    <div>${doc.issue_with[0].day}/${doc.issue_with[0].month}/${doc.issue_with[0].year}</div>
                    <div>${doc.issue_for[0].day}/${doc.issue_for[0].month}/${doc.issue_for[0].year}</div>
                </div>
                <div class="table_row_print">⚙</div>
            </div>`
        );
    });
    });


    document.addEventListener('click', async function(){ // - асинхронная функция, выгружающая данные из БД MongoDB в типовую форму Доверенности и отображающая ее на экране
        if (event.target.classList.contains("table_row_print")) {

            var table_num_dover = event.target.parentElement.previousSibling.previousSibling.innerHTML; //Переменная DOM-элемента (имя = id в HTML), хранящая номер выбираемого документа, event.target - кликнутый элемент, parentElement - родительский элемент, previous - соседний элемент относительно кликнутого

            let obj_document = JSON.parse(JSON.stringify( await eel.collection_documents_print(table_num_dover)() )); //вызов функции из Пайтона для получения объект по номеру доверенности

            home_org.value = obj_document.home_org; //Присвоение полю из окна печати ключа из объекта MongoDB. Организация-составитель документа
            num_dover.value = obj_document.num_dover; //Присвоение полю из окна печати ключа из объекта MongoDB. Номер доверенности
            issue_with_day.value = obj_document.issue_with[0].day; //Присвоение полю из окна печати ключа из объекта MongoDB. Действительно с(день)
            issue_with_month.value = obj_document.issue_with[0].month; //Присвоение полю из окна печати ключа из объекта MongoDB. Действительно с(месяц)
            issue_with_year.value = obj_document.issue_with[0].year; //Присвоение полю из окна печати ключа из объекта MongoDB. Действительно с(год)
            issue_for_day.value = obj_document.issue_for[0].day; //Присвоение полю из окна печати ключа из объекта MongoDB. Действительно по(день)
            issue_for_month.value = obj_document.issue_for[0].month; //Присвоение полю из окна печати ключа из объекта MongoDB. Действительно по(месяц)
            issue_for_year.value = obj_document.issue_for[0].year; //Присвоение полю из окна печати ключа из объекта MongoDB. Действительно по(год)
            consumer_org.value = obj_document.consumer_org; //Присвоение полю из окна печати ключа из объекта MongoDB. Наименование потребителя
            payer_org.value = obj_document.payer_org; //Присвоение полю из окна печати ключа из объекта MongoDB. Наименование плательщика
            position.value = obj_document.issue_from[0].position; //Присвоение полю из окна печати ключа из объекта MongoDB. Получено от (Должность)
            fio.value = obj_document.issue_from[0].fio_id; //Присвоение полю из окна печати ключа из объекта MongoDB. Получено от (ФИО)
            get_from_org.value = obj_document.get_from_org; //Присвоение полю из окна печати ключа из объекта MongoDB. На получение от поставщика
            num_doc.value = obj_document.num_doc; //Присвоение полю из окна печати ключа из объекта MongoDB. материальных ценностей по

            async function selecter(){ //Асинхронная функция (потому что обращение к функции из backend.py), заполняющая данные по физ.лицу, отсутсвующие в записи коллекции "Документы"
                let index=0;
                let stopper = 1;
                let list_data_individuals = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()())); //Присвоение объекта, содержащего все записи с Физ.лицами
                while (list_data_individuals[index] && stopper){
                    if (fio.value == `${list_data_individuals[index].surname} ${list_data_individuals[index].name} ${list_data_individuals[index].patronymic}`){ //Если значение ФИО из поля коллекции "Физические лица" совпадает со значением поля в "Документы"
                        serial_passport.value = list_data_individuals[index].serial_passport; //Присвоение полю из формы ключа из объекта MongoDB.
                        num_passport.value = list_data_individuals[index].num_passport; //Присвоение полю из формы ключа из объекта MongoDB.
                        issued.value = list_data_individuals[index].issued; //Присвоение полю из формы ключа из объекта MongoDB.
                        stopper = 0;
                    }
                    index++;
                }
            }
            selecter(); //Вызов функции 

            while (frame_print_table.childNodes.length>2){ //Очистка строк таблицы из формы
                frame_print_table.lastChild.remove();
            }

            let index=0;
            let object = obj_document.table; //считывание данных из таблицы
            while (object[index+1]){ //добавление строк в таблицу доверенности
                frame_print_table.insertAdjacentHTML("beforeend",'<tr><td></td><td></td><td></td></tr>');
                index++;
            }

            let row = Array.from(document.querySelectorAll('#frame_print_table tr')); //присвоение массива строк таблицы из формы
            row.splice(0,1);
            index=0;
            row.forEach((r)=>{ //перебор всех строк из массива строк
                r.childNodes[0].innerText = index+1; //Индексация строк
                r.childNodes[1].innerText = object[index].material_value; //Присвоение материальной ценности из object (Массив из коллекции "Документы" table)
                r.childNodes[2].innerText = object[index].count; //Присвоение значения количества из object (Массив из коллекции "Документы" table)
                index++;
            })

            window.print(); //Вызов формы печати
        }
    });
});
