//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Загрузка данных в таблицах-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Таблица Товары
async function collection_items_load_records() {
    let table = document.querySelector('.section.items .section_table');
    table.innerHTML = ""; // Очистка таблицы перед загрузкой

    let index = 0;
    let record = JSON.parse(JSON.stringify(await eel.collection_items_load_records()()));
    console.log("Загруженные записи:", record); // Вывод в консоль

    while (record[index]) {
        console.log("Добавляется:", record[index].name); // Отладка
        let newElement = `<div class="table_row"><div>${index+1}</div><div>${record[index].name}</div><div><div class="table_row_change"></div><div class="table_row_delete"></div></div></div>`;
        table.insertAdjacentHTML('beforeend', newElement);
        index++;
    }
};


collection_items_load_records(); //Вызов функции загрузки данных раздела Справочники(Товары)



//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//ДОБАВЛЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//Форма ввода для товаров
async function collection_items_add() {
    let frame_items_name = document.getElementById("frame_items_name").value; //Наименование материальной ценности

    let selec_items_row=document.querySelectorAll(".section.items .table_row").length; //Номер селектора (строки) последнего из таблицы для определния номера следующей строки

    //Добавление записи с условием проверки на наличие уже существущей записи
    if (await eel.collection_items_add(frame_items_name)()) {
        let table = document.querySelector('.section.items .section_table'); //Определение таблицы из секции "Документы" в перменную
        let newElement = `<div class="table_row"><div>${selec_items_row}</div><div>${frame_items_name}</div><div><div class="table_row_change"></div><div class="table_row_delete"></div></div></div>`; //создание строки
        table.insertAdjacentHTML( 'beforeend', newElement ); //Добавление в конец внутри ТЕГА section_table строки из newElement
    }
    else{
        alert('Запись уже существует');
    }   
};




//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//УДАЛЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//Справочник Товары
document.addEventListener('click',  async function(){ 
    if (event.target.classList.contains("table_row_delete") && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains("items")){

        let items_name=event.target.parentElement.previousSibling.innerHTML;
        event.target.parentElement.parentElement.remove(); //удаление строки из таблицы
        await eel.collection_items_delete(items_name)(); //вызов функции из пайтона для удаления строки из базы данных в MongoDB
        
        //обновление нумерации записей в таблице
        let number_row=document.querySelectorAll(".section.items .table_row");
        let i=1;
        for (let num of number_row){
            if (num.firstChild.innerHTML!="№") {
                num.firstChild.innerHTML=i;
                i++;
            }
        }
    }
});




//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//ИЗМЕНЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//Справочник Товары
document.addEventListener('click', async function(){ 
    if (event.target.classList.contains("table_row_change") && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains("items")){

        current_row_items_name = event.target.parentElement.previousSibling;

        frame_items_name.value=current_row_items_name.innerHTML; //занесение данных в форму из строчки в таблице

        frame_items_update_show();
    }
});




//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Фреймы-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Фрейм товары-----------------------------------------------------
    //Перменные-_-_-_-_-_-_-_-_-_-_
    var frame_items_k=0;
    var frame_items=document.getElementById("frame_items");//Окно ввода физ.лиц
    var frame_items_exit=document.querySelector('.frame_items_exit');//Кнопка крестик(выйти) в окне добавления
    var frame_items_confirm_but=document.querySelector('.frame_items_cont .confirm_but');//Кнопка добавить в форме физ.лиц
    var section_items_addBut = document.querySelector('.section.items .section_table_add');//ннопка добавить в секции организации
    var current_row_items_name;
//

//Выход из формы
frame_items_exit.addEventListener('click', () =>{
    frame_items.style.display="none";
});

//Отображение, если Форма используется для добавления нового документа(записи)
section_items_addBut.addEventListener('click', ()=>{
    document.querySelector(".frame_items_cont .frame_title").innerHTML="Форма добавления данных";
    document.querySelector(".frame_items_cont .confirm_but").innerHTML="Добавить";
    frame_items_name.value="";
    frame_items.style.display="flex";
    frame_items_k=0;
});

//Отображение, если Форма используется для обновления существующего документа(записи)
function frame_items_update_show(){
    document.querySelector(".frame_items_cont .frame_title").innerHTML="Форма обновления данных";
    document.querySelector(".frame_items_cont .confirm_but").innerHTML="Обновить";
    frame_items.style.display="flex";
    frame_items_k=1;
}

frame_items_confirm_but.addEventListener('click', async function() {
    if (frame_items_k==0) {
        collection_items_add();
    }
    else{
        await eel.collection_items_update(
            current_row_items_name.innerHTML,
            frame_items_name.value
        )();//вызов функции обновления данных в пайтоне для изменения в MongoDB
        
        current_row_items_name.innerHTML = frame_items_name.value;
    }
    frame_items.style.display="none";
});
