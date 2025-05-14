//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Загрузка данных в таблицах-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Таблица Физ.Лица
async function collection_individuals_load_records() { 
    let index = 0;
    let record = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()()));
    while (record[index]){
        let table = document.querySelector('.section.individuals .section_table');
        let newElement = `<div class="table_row"><div>${index+1}</div><div>${record[index].surname}</div><div>${record[index].name}</div><div>${record[index].patronymic}</div><div>${record[index].serial_passport}</div><div>${record[index].num_passport}</div><div>${record[index].issued}</div><div><div class="table_row_change"></div><div class="table_row_delete"></div></div></div>`;
        table.insertAdjacentHTML( 'beforeend', newElement );
        index++;
    }
};

collection_individuals_load_records(); //вызов функции загрузки данных раздела Справочники(Физ.лица)




//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//ДОБАВЛЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//Форма ввода для физ.лиц
async function collection_individuals_add() {
    let frame_indiv_surn = document.getElementById("frame_indiv_surn").value; // Присваивание переменной значения поля Фамилия из формы
    let frame_indiv_name = document.getElementById("frame_indiv_name").value; // Присваивание переменной значения поля Имя из формы
    let frame_indiv_patr = document.getElementById("frame_indiv_patr").value; // Присваивание переменной значения поля Отчество из формы
    let frame_indiv_serial = document.getElementById("frame_indiv_serial").value; // Присваивание переменной значения поля Серия паспорта из формы
    let frame_indiv_num = document.getElementById("frame_indiv_num").value; // Присваивание переменной значения поля Номер паспорта из формы
    let frame_indiv_issue = document.getElementById("frame_indiv_issue").value; // Присваивание переменной значения поля Кем выдано из формы

    let selec_individ_row=document.querySelectorAll(".section.individuals .table_row").length; //номер селектора (строки) последнего из таблицы для определния номера следующей строки

    //Добавление записи с условием проверки на наличие уже существущей записи
    if (await eel.collection_individuals_add(frame_indiv_surn,frame_indiv_name,frame_indiv_patr,frame_indiv_serial,frame_indiv_num,frame_indiv_issue)()) {
        let table = document.querySelector('.section.individuals .section_table');
        let newElement = `<div class="table_row"><div>${selec_individ_row}</div><div>${frame_indiv_surn}</div><div>${frame_indiv_name}</div><div>${frame_indiv_patr}</div><div>${frame_indiv_serial}</div><div>${frame_indiv_num}</div><div>${frame_indiv_issue}</div><div><div class="table_row_change"></div><div class="table_row_delete"></div></div></div>`;
        table.insertAdjacentHTML( 'beforeend', newElement );
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

//Справочник Физические лица
document.addEventListener('click',  async function(){ 
    if (event.target.classList.contains("table_row_delete") && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains("individuals")){

        let surname = event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
        let name = event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
        let patronymic = event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
        let serial = event.target.parentElement.previousSibling.previousSibling.previousSibling.innerHTML;
        let num = event.target.parentElement.previousSibling.previousSibling.innerHTML;
        let issue = event.target.parentElement.previousSibling.innerHTML;

        event.target.parentElement.parentElement.remove(); //удаление строки из таблицы
        await eel.collection_individuals_delete(surname,name,patronymic,serial,num,issue)(); //вызов функции из пайтона для удаления строки из базы данных в MongoDB

        //обновление нумерации записей в таблице
        let number_row=document.querySelectorAll(".section.individuals .table_row");
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

//Справочник Физ.лица
document.addEventListener('click', async function(){ 
    if (event.target.classList.contains("table_row_change") && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains("individuals")){

        current_row_indiv_surname = event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling;
        current_row_indiv_name = event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling;
        current_row_indiv_patronymic = event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling;
        current_row_indiv_serial = event.target.parentElement.previousSibling.previousSibling.previousSibling;
        current_row_indiv_num = event.target.parentElement.previousSibling.previousSibling;
        current_row_indiv_issue = event.target.parentElement.previousSibling;
        
        frame_indiv_surn.value=current_row_indiv_surname.innerHTML; //занесение данных в форму из строчки в таблице
        frame_indiv_name.value=current_row_indiv_name.innerHTML; //--
        frame_indiv_patr.value=current_row_indiv_patronymic.innerHTML; //--
        frame_indiv_serial.value=current_row_indiv_serial.innerHTML; //--
        frame_indiv_num.value=current_row_indiv_num.innerHTML; //--
        frame_indiv_issue.value=current_row_indiv_issue.innerHTML; //--
        
        frame_indiv_update_show();

    }
});




//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Фреймы-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Фрейм физ.лиц-----------------------------------------------------
    //Перменные-_-_-_-_-_-_-_-_-_-_
    var frame_indiv_k=0;
    var frame_indiv=document.getElementById("frame_indiv");//Окно ввода физ.лиц
    var frame_indiv_exit=document.querySelector('.frame_indiv_exit');//Кнопка крестик(выйти) в окне добавления
    var frame_indiv_confirm_but=document.querySelector('.frame_indiv_cont .confirm_but');//Кнопка добавить в форме физ.лиц
    var section_individuals_addBut = document.querySelector('.section.individuals .section_table_add');//ннопка добавить в секции организации
    var current_row_indiv_surname;
    var current_row_indiv_name;
    var current_row_indiv_patronymic;
    var current_row_indiv_serial;
    var current_row_indiv_num;
    var current_row_indiv_issue;
//

//Выход из формы
frame_indiv_exit.addEventListener('click', () =>{
    frame_indiv.style.display="none";
}); 

//Отображение, если Форма используется для добавления нового документа(записи)
section_individuals_addBut.addEventListener('click', ()=>{
    document.querySelector(".frame_indiv_cont .frame_title").innerHTML="Форма добавления данных";
    document.querySelector(".frame_indiv_cont .confirm_but").innerHTML="Добавить";
    frame_indiv_surn.value="";
    frame_indiv_name.value="";
    frame_indiv_patr.value="";
    frame_indiv_serial.value="";
    frame_indiv_num.value="";
    frame_indiv_issue.value="";
    
    frame_indiv.style.display="flex";
    frame_indiv_k=0;
});

//Отображение, если Форма используется для обновления существующего документа(записи)
function frame_indiv_update_show(){
    document.querySelector(".frame_indiv_cont .frame_title").innerHTML="Форма обновления данных";
    document.querySelector(".frame_indiv_cont .confirm_but").innerHTML="Обновить";
    frame_indiv.style.display="flex";
    frame_indiv_k=1;
}


frame_indiv_confirm_but.addEventListener('click', async function() {
    if (frame_indiv_k==0) {
        collection_individuals_add();
    }
    else{
        await eel.collection_individuals_update(
            current_row_indiv_surname.innerHTML,
            current_row_indiv_name.innerHTML,
            current_row_indiv_patronymic.innerHTML,
            current_row_indiv_serial.innerHTML,
            current_row_indiv_num.innerHTML,
            current_row_indiv_issue.innerHTML,
            frame_indiv_surn.value,
            frame_indiv_name.value,
            frame_indiv_patr.value,
            frame_indiv_serial.value,
            frame_indiv_num.value,
            frame_indiv_issue.value
        )(); //вызов функции обновления данных в пайтоне для изменения в MongoDB
        
        current_row_indiv_surname.innerHTML = frame_indiv_surn.value;
        current_row_indiv_name.innerHTML = frame_indiv_name.value;
        current_row_indiv_patronymic.innerHTML = frame_indiv_patr.value;
        current_row_indiv_serial.innerHTML = frame_indiv_serial.value;
        current_row_indiv_num.innerHTML = frame_indiv_num.value;
        current_row_indiv_issue.innerHTML = frame_indiv_issue.value;
    }
    frame_indiv.style.display="none";
});
