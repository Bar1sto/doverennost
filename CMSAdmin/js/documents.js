const scriptIndividuals = document.createElement("script");
scriptIndividuals.src = "individuals.js";
document.head.appendChild(scriptIndividuals);

const scriptOrganizations = document.createElement("script");
scriptOrganizations.src = "organizations.js";
document.head.appendChild(scriptOrganizations);

const scriptItems = document.createElement("script");
scriptItems.src = "items.js";
document.head.appendChild(scriptItems);



var doc_num_current;
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Глобальные функции-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

/*ФУНКЦИЯ 1*/
let list_data_individuals;
let list_data_organizations;
let list_data_items;
let index=0;
/*------------------------------------------------------------------------------*/
function add_select(element, list_data) {
    if (!element) {
        console.error("Элемент для добавления данных не найден!");
        return;
    }
    if (!list_data || list_data.length === 0) {
        console.error("Данные для списка отсутствуют!");
        return;
    }

    let index = 0;
    while (list_data[index]) {
        let opt = document.createElement('option');
        opt.value = index;
        opt.innerHTML = list_data[index].name || "Unnamed";
        element.appendChild(opt);
        index++;
    }
    element.selectedIndex = -1;
}

function add_select2(list_data){ //добавление в выпадающие списки организаций данных из коллекции Физические лица
    index=0;
    while (list_data[index]){
        let opt = document.createElement('option'); //Создание HTML-элемента option
        opt.value=index; //Присвоение индекса опции
        opt.innerHTML=`${list_data[index].surname} ${list_data[index].name} ${list_data[index].patronymic}`; //Присвоение значения опции
        document.getElementById("doc_issue_from_FIO").appendChild(opt);
        index++;
    }
    document.getElementById("doc_issue_from_FIO").selectedIndex=-1; //Обнуление выбора HTML-элемента select
}
/*------------------------------------------------------------------------------*/

async function select_loader() {
    list_data_individuals = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()()));
    list_data_organizations = JSON.parse(JSON.stringify(await eel.collection_organizations_load_records()()));
    list_data_items = JSON.parse(JSON.stringify(await eel.collection_items_load_records()()));

    function safe_add_select(id, list) {
        let element = document.getElementById(id);
        if (!element) {
            console.warn(`Элемент #${id} не найден, пропускаем.`);
            return;
        }
        add_select(element, list);
    }

    safe_add_select("doc_table_itemsSelect", list_data_items);
    safe_add_select("doc_home_org", list_data_organizations);
    safe_add_select("doc_consumer_org", list_data_organizations);
    safe_add_select("doc_payer_org", list_data_organizations);
    safe_add_select("doc_issue_get_from_org", list_data_organizations);
    add_select2(list_data_individuals);
    safe_add_select("doc_table_itemsSelect", list_data_items);
}




/*ФУНКЦИЯ 2 - функция добавления данных в поля при выборе ФИО сотрудника в форме*/
async function selector_individuals(){
    let index=0;
    let stopper = 1;
    let list_data_individuals = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()()));
    while (list_data_individuals[index] && stopper){
        if (document.getElementById("doc_issue_from_FIO").options[document.getElementById("doc_issue_from_FIO").selectedIndex].innerText == `${list_data_individuals[index].surname} ${list_data_individuals[index].name} ${list_data_individuals[index].patronymic}`){
            document.getElementById("doc_issue_from_serial").value = list_data_individuals[index].serial_passport;
            document.getElementById("doc_issue_from_number").value = list_data_individuals[index].num_passport;
            document.getElementById("doc_issue_from_getter").value = list_data_individuals[index].issued;
            stopper = 0;
        }
        index++;
    }
}
doc_issue_from_FIO.addEventListener('change',async function(){ //Добавление в обработчик для выполнения при измнении поля ФИО
    selector_individuals();
})

/*ФУНКЦИЯ 3 - проверка на открытие формы в целяъ избежания дублирования данных в выпадающих списках*/ 
let open_k = 1;
function open_check(){
    select_loader();
    open_k=0;
}

/*ФУНКЦИЯ 4 - определяет по переданному объекту из БД с заданными параметрами одной записи(запись в БД, которая загружается в obj), 
какому селектору выпадающего списка выставить значения, соответсвующие в БД*/ 
function select_definer(selectElement, valueToFind) {
    if (!selectElement) {
        console.error("Ошибка: select элемент не найден.");
        return;
    }

    let found = false;
    for (let option of selectElement.options) {
        let optionText = option.innerText.trim().toLowerCase();
        let optionValue = option.value.trim().toLowerCase();
        let targetValue = valueToFind.trim().toLowerCase();

        if (optionText === targetValue || optionValue === targetValue) {
            selectElement.value = option.value;
            found = true;
            break;
        }
    }

    if (!found) {
        console.warn(`Значение '${valueToFind}' не найдено в списке #${selectElement.id}`);
    }
}












//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Загрузка данных в таблицах-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Таблица Документы
let menu_position = document.querySelector('.main_menu-documents');
let index_visited = 1;
menu_position.addEventListener('click', async function() {
    if (index_visited) {
        try {
            // Получение данных
            let record = await eel.collection_documents_load_records()();
            record = JSON.parse(JSON.stringify(record));
            console.log("Загруженные данные: ", record); // Логирование данных для проверки

            // Поиск таблицы
            let table = document.querySelector('.section.documents .section_table');
            if (!table) {
                console.error("Таблица документов не найдена!");
                return;
            }

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
        index_visited = 0; // Сбрасываем флаг, чтобы предотвратить повторную загрузку
    }
});
let record = await eel.collection_documents_load_records()(); // Загружаем данные из backend
record = JSON.parse(JSON.stringify(record)); // Убедитесь, что данные корректно преобразуются



// collection_documents_load_records(); //вызов функции загрузки данных раздела Документы




//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//ДОБАВЛЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

async function collection_documents_add() {
    var doc_num_dover = document.getElementById("doc_num_dover").value; //Переменная, содержащая значение поля номер доверенность из формы
    var doc_home_org = document.getElementById("doc_home_org").options[document.getElementById("doc_home_org").selectedIndex].innerText; //Переменная, содержащая значение поля организация из формы
    var doc_issue_with_day = document.getElementById("doc_issue_with_day").value; //Переменная, содержащая значение поля Действует с (день) из формы
    var doc_issue_with_month = document.getElementById("doc_issue_with_month").value; //Переменная, содержащая значение поля Действует с (месяц) из формы
    var doc_issue_with_year = document.getElementById("doc_issue_with_year").value; //Переменная, содержащая значение поля Действует с (год) из формы
    var doc_issue_for_day = document.getElementById("doc_issue_for_day").value; //Переменная, содержащая значение поля Действует по (день) из формы
    var doc_issue_for_month = document.getElementById("doc_issue_for_month").value; //Переменная, содержащая значение поля Действует с (месяц) из формы
    var doc_issue_for_year = document.getElementById("doc_issue_for_year").value; //Переменная, содержащая значение поля Действует с (год) из формы
    var doc_payer_org = document.getElementById("doc_payer_org").options[document.getElementById("doc_payer_org").selectedIndex].innerText; //Переменная, содержащая значение поля наименование плательщика из формы
    var doc_issue_from_position = document.getElementById("doc_issue_from_position").value; //Переменная, содержащая значение поля должность из формы
    var doc_issue_from_FIO = document.getElementById("doc_issue_from_FIO").options[document.getElementById("doc_issue_from_FIO").selectedIndex].innerText; //Переменная, содержащая значение поля ФИО из формы
    var doc_consumer_org = document.getElementById("doc_consumer_org").options[document.getElementById("doc_consumer_org").selectedIndex].innerText; //Переменная, содержащая значение поля наименование потребителя из формы
    var doc_issue_get_from_org = document.getElementById("doc_issue_get_from_org").options[document.getElementById("doc_issue_get_from_org").selectedIndex].innerText; //Переменная, содержащая значение поля наименование получателя из формы
    var doc_issue_get_num_doc = document.getElementById("doc_issue_get_num_doc").value; //Переменная, содержащая значение поля на получение по из формы

    let doc_table_rows = []; //считывание данных из таблицы
    let array = {};
    for (let record of document.querySelectorAll('#doc_table_row')){ //перебор каждой строки таблицы формы
        array = {};
        array.material_value=record.childNodes[1].lastChild.options[record.childNodes[1].lastChild.selectedIndex].innerText; //обращение к ячейке "материальная ценность"
        array.count=record.childNodes[2].lastChild.value; //обращзение к ячейке "количество"
        doc_table_rows.push(array);
    }

    let selec_documents_row=document.querySelectorAll(".section.documents .table_row").length; //номер селектора (строки) последнего из таблицы для определния номера следующей строки
    //Добавление записи с условием проверки на наличие уже существущей записи
    if (await eel.collection_documents_add(
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
        )()) {
        let table = document.querySelector('.section.documents .section_table');
        let newElement = `<div class="table_row">
            <div>${selec_documents_row}</div> 
            <div>${doc_num_dover}</div>
            <div>
                <div>${doc_issue_with_day+'.'+doc_issue_with_month+'.'+doc_issue_with_year}</div>
                <div>${doc_issue_for_day+'.'+doc_issue_for_month+'.'+doc_issue_for_year}</div>
            </div>
            <div>
                <div class="table_row_print"></div>
                <div class="table_row_change"></div>
                <div class="table_row_delete"></div>
            </div>
        </div>`;
        table.insertAdjacentHTML( 'beforeend', newElement );
    }
    else{
        alert('Запись уже существует');
    }   
};


async function updateDocumentsTable() {
    let table = document.querySelector('.section.documents .section_table');
    if (!table) {
        console.error("Таблица документов не найдена!");
        return;
    }

    // Очистка таблицы перед загрузкой новых данных
    table.innerHTML = '';

    // Загрузка данных из базы
    let record = await eel.collection_documents_load_records()();
    record = JSON.parse(JSON.stringify(record));

    // Вставка данных в таблицу
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
                <div class="table_row_print"></div>
                <div class="table_row_change"></div>
                <div class="table_row_delete"></div>
            </div>
        </div>`;
        table.insertAdjacentHTML('beforeend', newElement);
        index++;
    }
}


//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//УДАЛЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

document.addEventListener('click', async function() { 
    if (event.target.classList.contains("table_row_change") && event.target.closest(".documents")) {
        let num_doc = event.target.closest(".table_row").querySelector("div:nth-child(2)").innerText;
        let obj = await eel.collection_documents_form_load_records(num_doc)();
        
        if (!obj) {
            console.error(`Документ с номером ${num_doc} не найден`);
            return;
        }

        document.querySelectorAll('#frame_doc select').forEach(e => e.selectedIndex = -1);
        document.querySelectorAll('#frame_doc input').forEach(e => e.value = "");

        if (open_k) { 
            open_check();
            open_k = 0;
        }

        document.getElementById('doc_num_dover').value = obj.num_dover || "";
        document.getElementById('doc_num_dover').setAttribute("data-old-value", obj.num_dover); 

        document.getElementById('doc_issue_with_day').value = obj.issue_with?.[0]?.day || "";
        document.getElementById('doc_issue_with_month').value = obj.issue_with?.[0]?.month || "";
        document.getElementById('doc_issue_with_year').value = obj.issue_with?.[0]?.year || "";
        document.getElementById('doc_issue_for_day').value = obj.issue_for?.[0]?.day || "";
        document.getElementById('doc_issue_for_month').value = obj.issue_for?.[0]?.month || "";
        document.getElementById('doc_issue_for_year').value = obj.issue_for?.[0]?.year || "";
        document.getElementById('doc_issue_from_position').value = obj.issue_from?.[0]?.position || "";
        document.getElementById('doc_issue_get_num_doc').value = obj.num_doc || "";

        setTimeout(() => {
            select_definer(document.getElementById('doc_home_org'), obj.home_org);
            select_definer(document.getElementById('doc_consumer_org'), obj.consumer_org);
            select_definer(document.getElementById('doc_payer_org'), obj.payer_org);
            select_definer(document.getElementById('doc_issue_get_from_org'), obj.get_from_org);

            let docIssueFromFio = document.getElementById('doc_issue_from_FIO');
            if (docIssueFromFio) {
                select_definer(docIssueFromFio, obj.issue_from?.[0]?.fio_id);
                selector_individuals();
            } else {
                console.error("Элемент doc_issue_from_FIO не найден");
            }
        }, 300); 

        while (table.childNodes.length > 2) {
            if (table.lastChild) {
                table.lastChild.remove();
            }
        }

        let object = obj.table;
        if (object && object.length > 0) {
            object.forEach((row, index) => {
                table.insertAdjacentHTML("beforeend", `
                    <tr id="doc_table_row">
                        <td><input type="text" value="${index + 1}" readonly></td>
                        <td><select class="doc_table_itemsSelect"></select></td>
                        <td><input type="text" value="${row.count}"></td>
                    </tr>
                `);
            });

            setTimeout(() => {
                let selectElements = document.querySelectorAll(".doc_table_itemsSelect");
                selectElements.forEach((selectElement, index) => {
                    add_select(selectElement, list_data_items); // Заполняем select
                    select_definer(selectElement, object[index].material_value); // Выбираем сохраненное значение
                });
            }, 300);
        }

        frame_doc_update_show();
        doc_num_current = document.getElementById('doc_num_dover').value;
    }
});


//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//ИЗМЕНЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
document.querySelector('.frame_doc_cont .confirm_but').addEventListener('click', async function () {
    try {
        if (frame_doc_k === 1) { // Проверяем, что форма открыта для редактирования
            let doc_num_old = document.getElementById("doc_num_dover").getAttribute("data-old-value").trim(); // Старый номер документа
            let doc_num_dover = document.getElementById("doc_num_dover").value.trim();

            // Берем названия организаций из select
            let doc_home_org = document.getElementById("doc_home_org").options[document.getElementById("doc_home_org").selectedIndex]?.innerText.trim();
            let doc_consumer_org = document.getElementById("doc_consumer_org").options[document.getElementById("doc_consumer_org").selectedIndex]?.innerText.trim();
            let doc_payer_org = document.getElementById("doc_payer_org").options[document.getElementById("doc_payer_org").selectedIndex]?.innerText.trim();
            let doc_issue_get_from_org = document.getElementById("doc_issue_get_from_org").options[document.getElementById("doc_issue_get_from_org").selectedIndex]?.innerText.trim();

            // Даты
            let doc_issue_with_day = document.getElementById("doc_issue_with_day").value;
            let doc_issue_with_month = document.getElementById("doc_issue_with_month").value;
            let doc_issue_with_year = document.getElementById("doc_issue_with_year").value;
            let doc_issue_for_day = document.getElementById("doc_issue_for_day").value;
            let doc_issue_for_month = document.getElementById("doc_issue_for_month").value;
            let doc_issue_for_year = document.getElementById("doc_issue_for_year").value;

            // Должность
            let doc_issue_from_position = document.getElementById("doc_issue_from_position").value;

            // Получаем ФИО и его ObjectId
            let doc_issue_from_FIO_select = document.getElementById("doc_issue_from_FIO");
            let doc_issue_from_FIO_text = doc_issue_from_FIO_select.options[doc_issue_from_FIO_select.selectedIndex]?.innerText.trim();

            // Ищем ObjectId для выбранного ФИО
            let doc_issue_from_FIO = await getIndividualObjectId(doc_issue_from_FIO_text);
            if (!doc_issue_from_FIO) {
                alert(`❌ Физическое лицо "${doc_issue_from_FIO_text}" не найдено в базе!`);
                return;
            }

            // Получение данных из таблицы "Материальные ценности"
            let doc_table_rows = [];
            document.querySelectorAll('#doc_table_row').forEach(row => {
                let material_value = row.querySelector('select').options[row.querySelector('select').selectedIndex]?.innerText.trim();
                let count = row.querySelector('input').value;

                // Проверяем, что строка не пустая
                if (material_value && count) {
                    doc_table_rows.push({ material_value, count });
                }
            });

            // Проверка обязательных полей
            if (!doc_num_dover || !doc_home_org || !doc_issue_with_day || !doc_issue_with_month || !doc_issue_with_year || !doc_consumer_org) {
                alert("❌ Заполните все обязательные поля!");
                return;
            }

            // Отправка данных на сервер через Eel
            console.log("Передаваемые данные для обновления:", {
                doc_num_old,
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
                doc_issue_from_FIO, // ObjectId
                doc_issue_get_from_org,
                doc_table_rows
            });

            let updated = await eel.collection_documents_update(
                doc_num_old,
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
                doc_issue_from_FIO, // ObjectId
                doc_issue_get_from_org,
                doc_table_rows
            )();

            if (updated) {
                console.log("✅ Документ успешно обновлен на сервере.");
                alert("✅ Документ успешно обновлен!");
                location.reload(); // Перезагружаем страницу для обновления таблицы
            } else {
                console.error("❌ Документ не найден для обновления на сервере.");
                alert("❌ Документ не найден для обновления.");
            }
        }
    } catch (error) {
        console.error("❌ Ошибка обработки формы редактирования:", error);
        alert("❌ Произошла ошибка. Проверьте данные и попробуйте снова.");
    } finally {
        frame_doc.style.display = "none"; // Скрываем форму после завершения
    }
});

function loadTableData(existingData) {
    let table = document.querySelector('.enter_data_field table');
    while (table.childNodes.length > 2) {
        table.removeChild(table.lastChild);
    }

    if (existingData && existingData.length > 0) {
        existingData.forEach((row, index) => {
            table.insertAdjacentHTML("beforeend", `
                <tr id="doc_table_row">
                    <td><input type="text" value="${index + 1}" readonly></td>
                    <td><select class="doc_table_itemsSelect"></select></td>
                    <td><input type="text" value="${row.count}"></td>
                </tr>
            `);
        });

        setTimeout(() => {
            document.querySelectorAll(".doc_table_itemsSelect").forEach((select, index) => {
                add_select(select, list_data_items); // Заполняем select
                select_definer(select, existingData[index].material_value); // Устанавливаем значения
            });
        }, 300);
    }
}





document.addEventListener('click', async function(event) { 
    if (event.target.classList.contains("table_row_change") && event.target.closest(".documents")) {
        let num_doc = event.target.closest(".table_row").querySelector("div:nth-child(2)").innerText;
        let obj = await eel.collection_documents_form_load_records(num_doc)();
        
        if (!obj) {
            console.error(`Документ с номером ${num_doc} не найден`);
            return;
        }

        // Очистка формы перед загрузкой новых данных
        document.querySelectorAll('#frame_doc select').forEach(e => e.selectedIndex = -1);
        document.querySelectorAll('#frame_doc input').forEach(e => e.value = "");

        // Инициализация данных для редактирования
        document.getElementById('doc_num_dover').value = obj.num_dover || "";
        document.getElementById('doc_num_dover').setAttribute("data-old-value", obj.num_dover); // Сохраняем старое значение

        document.getElementById('doc_issue_with_day').value = obj.issue_with?.[0]?.day || "";
        document.getElementById('doc_issue_with_month').value = obj.issue_with?.[0]?.month || "";
        document.getElementById('doc_issue_with_year').value = obj.issue_with?.[0]?.year || "";
        document.getElementById('doc_issue_for_day').value = obj.issue_for?.[0]?.day || "";
        document.getElementById('doc_issue_for_month').value = obj.issue_for?.[0]?.month || "";
        document.getElementById('doc_issue_for_year').value = obj.issue_for?.[0]?.year || "";
        document.getElementById('doc_issue_from_position').value = obj.issue_from?.[0]?.position || "";

        // Установка значений в выпадающие списки
        setTimeout(() => {
            select_definer(document.getElementById('doc_home_org'), obj.home_org);
            select_definer(document.getElementById('doc_consumer_org'), obj.consumer_org);
            select_definer(document.getElementById('doc_payer_org'), obj.payer_org);
            select_definer(document.getElementById('doc_issue_get_from_org'), obj.get_from_org);
            select_definer(document.getElementById('doc_issue_from_FIO'), obj.issue_from?.[0]?.fio_id);
        }, 300);

        // Обработка табличной части
        let table = document.querySelector('.enter_data_field table');
        while (table.childNodes.length > 2) {
            table.removeChild(table.lastChild);
        }

        if (obj.table) {
            obj.table.forEach((row, index) => {
                table.insertAdjacentHTML("beforeend", `
                    <tr id="doc_table_row">
                        <td><input type="text" value="${index + 1}" readonly></td>
                        <td><select class="doc_table_itemsSelect"></select></td>
                        <td><input type="text" value="${row.count}"></td>
                    </tr>
                `);
            });

            setTimeout(() => {
                document.querySelectorAll(".doc_table_itemsSelect").forEach((select, index) => {
                    add_select(select, list_data_items);
                    select_definer(select, obj.table[index].material_value);
                });
            }, 300);
        }

        // Показ формы для редактирования
        frame_doc_update_show();
    }
});


function findByName(collection, name) {
    if (!name) return {}; // Если название не передано, возвращаем пустой объект
    let searchName = String(name).trim().toLowerCase(); // Приводим к нижнему регистру

    // Ищем объект в коллекции по полю name
    let found = collection.find(item => String(item.name).trim().toLowerCase() === searchName);

    if (!found) {
        console.warn(`⚠️ Организация с названием "${name}" не найдена!`);
    }

    return found || {}; // Возвращаем найденный объект или пустой
}

function findById(collection, id) {
    if (!id) return {}; // Если ID не передан, возвращаем пустой объект
    let found = collection.find(item => String(item._id).trim() === String(id).trim());

    if (!found) {
        console.warn(`⚠️ Физ. лицо с ID "${id}" не найдено!`);
    }

    return found || {}; // Возвращаем найденный объект или пустой
}

async function loadData() {
    try {
        let individuals = await eel.collection_individuals_load_records()();
        let organizations = await eel.collection_organizations_load_records()();
        let items = await eel.collection_items_load_records()();

        console.log("📌 Данные загружены:");
        console.log("🏢 Организации:", organizations);
        console.log("👤 Физ. лица:", individuals);
        console.log("📦 Товары:", items);

        return { individuals, organizations, items };
    } catch (error) {
        console.error("❌ Ошибка загрузки данных:", error);
        return { individuals: [], organizations: [], items: [] };
    }
}

document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("table_row_print")) {
        try {
            let row = event.target.closest(".table_row");
            if (!row) {
                console.error("❌ Ошибка: строка таблицы не найдена!");
                return;
            }

            let table_num_dover = row.querySelector("div:nth-child(2)").innerText.trim();
            console.log("🔹 Ищем документ с номером:", table_num_dover);

            // Загружаем документ по номеру
            let obj_document = await eel.collection_documents_print(table_num_dover)();
            if (!obj_document) {

            }

            console.log("✅ Документ найден:", obj_document);

            // Загружаем вспомогательные данные
            let { individuals, organizations } = await loadData();

            let homeOrg = findByName(organizations, obj_document?.home_org?.trim());
            let consumerOrg = findByName(organizations, obj_document?.consumer_org?.trim());
            let payerOrg = findByName(organizations, obj_document?.payer_org?.trim());

            let issuerId = obj_document?.issue_from?.[0]?.fio_id || null;
            let issuer = findById(individuals, issuerId);
            let issuerName = issuer?.surname ? `${issuer.surname} ${issuer.name} ${issuer.patronymic}` : "";
            let issuerIssuedBy = issuer?.issued || "";
            let position = obj_document.issue_from?.[0]?.position || "";
            let get_from_org = obj_document.get_from_org?.trim() || "";

            // Заполняем существующую форму печати
            document.getElementById("home_org").value = homeOrg.name || "";
            document.getElementById("title_num_input").value = obj_document.num_dover || "";

            document.getElementById("issue_with_day").value = obj_document.issue_with[0]?.day || "";
            document.getElementById("issue_with_month").value = obj_document.issue_with[0]?.month || "";
            document.getElementById("issue_with_year").value = obj_document.issue_with[0]?.year || "";

            document.getElementById("issue_for_day").value = obj_document.issue_for[0]?.day || "";
            document.getElementById("issue_for_month").value = obj_document.issue_for[0]?.month || "";
            document.getElementById("issue_for_year").value = obj_document.issue_for[0]?.year || "";

            document.getElementById("consumer_org_input").value = consumerOrg.name || "";
            document.getElementById("payer_org_input").value = payerOrg.name || "";

            document.getElementById("position_input").value = position || "";
            document.getElementById("fio_input").value = issuerName;
            document.getElementById("passport_series").value = issuer?.serial_passport || "";
            document.getElementById("passport_number").value = issuer?.num_passport || "";
            document.getElementById("issue_organ_input").value = issuerIssuedBy || "";
            document.getElementById("get_from_input").value = get_from_org || "";

            // Заполняем таблицу товаров
            let table = document.getElementById("frame_print_table");
            table.innerHTML = "<tr><th>№</th><th>Материальные ценности</th><th>Количество</th></tr>";

            if (obj_document.table && obj_document.table.length > 0) {
                obj_document.table.forEach((item, index) => {
                    let row = `<tr>
                        <td>${index + 1}</td>
                        <td>${item.material_value}</td>
                        <td>${item.count}</td>
                    </tr>`;
                    table.insertAdjacentHTML("beforeend", row);
                });
            }

            // Показываем форму печати

            // Запускаем печать
            window.print();

        } catch (error) {
            console.error("❌ Ошибка при печати документа:", error);
        }
    }
});

// Функция скрытия формы печати
window.onafterprint = () => {
    document.getElementById("frame_print").style.display = "none";
};

function hidePrintForm() {
    let printWindow = document.getElementById("frame_print");
    if (printWindow) {
        printWindow.style.display = "none";
        printWindow.innerHTML = ""; // Очищаем содержимое формы
    }
    console.log("Форма печати скрыта.");
}











//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Фреймы-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Фрейм Документы-----------------------------------------------------
    //Перменные-_-_-_-_-_-_-_-_-_-_
    var frame_doc_k=0;
    var frame_doc=document.getElementById("frame_doc");//Окно ввода Документы
    var frame_doc_exit=document.querySelector('.frame_doc_exit');//Кнопка крестик(выйти) в окне добавления
    var frame_doc_confirm_but=document.querySelector('.frame_doc_cont .confirm_but');//Кнопка добавить в форме Документы
    var section_doc_addBut = document.querySelector('.section.documents .section_table_add');//ннопка добавить в секцию Документы
    var table = document.querySelector('.enter_data_field table');
    var table_add_row = document.getElementById('doc_button_add');
    var table_delete_row = document.getElementById('doc_button_delete');
//
//Выход из формы
frame_doc_exit.addEventListener('click', () =>{
    frame_doc.style.display="none";
}); 

//Настройки формы
async function form_settings() {
    if (open_k) {
        select_loader(); // Загружаем данные
        open_k = 0;
    } else {
        document.querySelectorAll('#frame_doc select').forEach(element => {
            element.selectedIndex = -1;
        });
        document.querySelectorAll('#frame_doc input').forEach(element => {
            element.value = null;
        });
    }
}


section_doc_addBut.addEventListener('click', async function() {
    console.log("Кнопка добавления записи нажата"); // Проверяем, вызывается ли обработчик
    document.querySelector(".frame_doc_cont .frame_title").innerHTML = "Форма добавления данных";
    document.querySelector(".frame_doc_cont .confirm_but").innerHTML = "Добавить";
    
    form_settings();
    console.log("Форма настраивается...");
    
    frame_doc.style.display = "flex";
    console.log("Форма отображена");
    frame_doc_k = 0;
});

/*------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    let addDocumentButton = document.querySelector(".section_table_add");
    let form = document.querySelector("#frame_doc");

    if (addDocumentButton) {
        console.log('Кнопка "Добавить запись" найдена');

        addDocumentButton.addEventListener("click", async () => {
            console.log('Кнопка "Добавить запись" нажата');

            if (form) {
                console.log("Форма найдена, показываем форму");
                form.style.display = "block"; // Показываем форму
                await select_loader(); // Загружаем данные в выпадающие списки
            } else {
                console.error("Форма для добавления записи не найдена");
            }
        });
    } else {
        console.error('Кнопка "Добавить запись" не найдена');
    }
});

section_doc_addBut.addEventListener('click', async function() {
    document.querySelector(".frame_doc_cont .frame_title").innerHTML = "Форма добавления данных";
    document.querySelector(".frame_doc_cont .confirm_but").innerHTML = "Добавить";
    
    form_settings(); // Настройка формы перед отображением

    frame_doc.style.display = "flex"; // Показываем форму
    frame_doc_k = 0; // Флаг, что добавляем новый документ
});
console.log(document.querySelector('.section.documents .section_table_add'));


function frame_doc_update_show(){
    document.querySelector(".frame_doc_cont .frame_title").innerHTML="Форма обновления данных";
    document.querySelector(".frame_doc_cont .confirm_but").innerHTML="Обновить";

    frame_doc.style.display="flex";
    frame_doc_k=1;
}

/*------------------------------------------------------------------------------*/
table_add_row.addEventListener('click', ()=>{
    let index = document.querySelectorAll("#doc_table_row").length;
    table.insertAdjacentHTML("beforeend",`<tr id="doc_table_row"><td><input type="text" value="${index+1}"></td><td><select id="doc_table_itemsSelect" type="text"></select></td><td><input type="text"></td></tr>`);
    add_select(document.querySelectorAll("#doc_table_row #doc_table_itemsSelect")[document.querySelectorAll("#doc_table_row #doc_table_itemsSelect").length-1], list_data_items);
})

document.addEventListener('click', async function(event) { 
    console.log("🔹 Клик по элементу:", event.target); // Выведет, по какому элементу был клик
    
    if (event.target.classList.contains("table_row_delete")) {
        console.log("✅ Клик по кнопке удаления!");
        
        let row = event.target.closest(".table_row");
        if (!row) {
            console.error("❌ Ошибка: строка таблицы не найдена!");
            return;
        }

        let num_doc_elem = row.querySelector("div:nth-child(2)");
        if (!num_doc_elem) {
            console.error("❌ Ошибка: Не найден номер документа!");
            return;
        }

        let num_doc = num_doc_elem.innerText.trim();
        console.log("📌 Удаляем документ с номером:", num_doc);

        await eel.collection_documents_delete(num_doc)();
        row.remove();
        console.log("🗑️ Документ удалён из таблицы!");
    }
});

/*------------------------------------------------------------------------------*/


document.addEventListener('DOMContentLoaded', () => {
    let addDocumentButton = document.querySelector('.section_table_add');
    let form = document.querySelector('#frame_doc');
    
    if (addDocumentButton) {
        console.log('Кнопка "Добавить запись" найдена');

        addDocumentButton.addEventListener('click', () => {
            console.log('Кнопка "Добавить запись" нажата');
            
            if (form) {
                console.log('Форма найдена, показываем форму');
                form.style.display = 'block'; // Показываем форму
            } else {
                console.error('Форма для добавления записи не найдена');
            }
        });
    } else {
        console.error('Кнопка "Добавить запись" не найдена');
    }
});





let nextDocNum = 1; // Начальное значение для нового документа

async function getIndividualObjectId(fio) {
    let individuals = await eel.collection_individuals_load_records()(); // Загружаем всех физ. лиц
    let found = individuals.find(ind => 
        `${ind.surname} ${ind.name} ${ind.patronymic}`.trim() === fio.trim()
    );
    
    if (found) {
        return found._id; 
    } else {
        console.warn(`⚠️ Физическое лицо "${fio}" не найдено!`);
        return null;
    }
}

frame_doc_confirm_but.addEventListener('click', async function() {
    try {
        if (frame_doc_k === 0) {
            let doc_num_dover = document.getElementById('doc_issue_get_num_doc').value.trim();

            let doc_home_org = document.getElementById('doc_home_org').options[document.getElementById('doc_home_org').selectedIndex]?.innerText.trim();
            let doc_consumer_org = document.getElementById('doc_consumer_org').options[document.getElementById('doc_consumer_org').selectedIndex]?.innerText.trim();
            let doc_payer_org = document.getElementById('doc_payer_org').options[document.getElementById('doc_payer_org').selectedIndex]?.innerText.trim();
            let doc_issue_get_from_org = document.getElementById('doc_issue_get_from_org').options[document.getElementById('doc_issue_get_from_org').selectedIndex]?.innerText.trim();

            let doc_issue_with_day = document.getElementById('doc_issue_with_day').value;
            let doc_issue_with_month = document.getElementById('doc_issue_with_month').value;
            let doc_issue_with_year = document.getElementById('doc_issue_with_year').value;
            let doc_issue_for_day = document.getElementById('doc_issue_for_day').value;
            let doc_issue_for_month = document.getElementById('doc_issue_for_month').value;
            let doc_issue_for_year = document.getElementById('doc_issue_for_year').value;
            let doc_issue_from_position = document.getElementById('doc_issue_from_position').value;

            let doc_issue_from_FIO_select = document.getElementById('doc_issue_from_FIO');
            let doc_issue_from_FIO_text = doc_issue_from_FIO_select.options[doc_issue_from_FIO_select.selectedIndex]?.innerText.trim();

            let doc_issue_from_FIO = await getIndividualObjectId(doc_issue_from_FIO_text);
            if (!doc_issue_from_FIO) {
                alert(`❌ Физ. лицо "${doc_issue_from_FIO_text}" не найдено в базе!`);
                return;
            }

            let doc_table_rows = [];
            document.querySelectorAll('#doc_table_row').forEach(row => {
                let material_value = row.querySelector('select').options[row.querySelector('select').selectedIndex]?.innerText.trim();
                let count = row.querySelector('input').value;
                doc_table_rows.push({ material_value, count });
            });

            if (!doc_num_dover || !doc_home_org || !doc_issue_with_day || !doc_issue_with_month || !doc_issue_with_year || !doc_consumer_org) {
                alert("❌ Заполните все обязательные поля!");
                return;
            }

            console.log("Передаваемые данные:", {
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
                doc_table_rows
            });

            await eel.collection_documents_add(
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
                doc_table_rows
            )();
            alert("✅ Документ успешно добавлен");
            await updateDocumentsTable();
        }
    } catch (error) {
        console.error("❌ Ошибка обработки формы:", error);
        alert("Произошла ошибка. Проверьте данные и попробуйте снова.");
    } finally {
        frame_doc.style.display = "none";
    }
});
