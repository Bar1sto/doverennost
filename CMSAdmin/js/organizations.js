//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Загрузка данных в таблицах-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

 //Таблица Организации
 async function collection_organizations_load_records() {
    let index = 0;
    let record = JSON.parse(JSON.stringify(await eel.collection_organizations_load_records()()));
    while (record[index]) {
        let table = document.querySelector('.section.organizations .section_table');
        let newElement = `<div class="table_row"><div>${index+1}</div><div>${record[index].name}</div><div>${record[index].address}</div><div><div class="table_row_change"></div><div class="table_row_delete"></div></div></div>`;
        table.insertAdjacentHTML( 'beforeend', newElement );
        index++;
    }
};

collection_organizations_load_records(); //вызов функции загрузки данных раздела Справочники(Организации)



//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//ДОБАВЛЕНИЕ ЗАПИСЕЙ-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//Форма ввода для организаций
async function collection_organizations_add() { 
    let frame_org_name = document.getElementById("frame_org_name").value;
    let frame_org_address = document.getElementById("frame_org_address").value;

    let selec_org_row=document.querySelectorAll(".section.organizations .table_row").length; //номер селектора (строки) последнего из таблицы для определния номера следующей строки

    //Добавление записи с условием проверки на наличие уже существущей записи
    if (await eel.collection_organizations_add(frame_org_name,frame_org_address)()) {
        let table = document.querySelector('.section.organizations .section_table');
        let newElement = `<div class="table_row"><div>${selec_org_row}</div><div>${frame_org_name}</div><div>${frame_org_address}</div><div><div class="table_row_change"></div><div class="table_row_delete"></div></div></div>`;
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

//Справочник Организации
document.addEventListener('click',  async function(){ 
    if (event.target.classList.contains("table_row_delete") && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains("organizations")){

        let organizations_name=event.target.parentElement.previousSibling.previousSibling.innerHTML;
        let organizations_address=event.target.parentElement.previousSibling.innerHTML;

        event.target.parentElement.parentElement.remove(); //удаление строки из таблицы
        await eel.collection_organizations_delete(organizations_name,organizations_address)(); //вызов функции из пайтона для удаления строки из базы данных в MongoDB

        //обновление нумерации записей в таблице
        let number_row=document.querySelectorAll(".section.organizations .table_row");
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

//Справочник Организации
document.addEventListener('click', async function(){ 
    if (event.target.classList.contains("table_row_change") && event.target.parentElement.parentElement.parentElement.parentElement.classList.contains("organizations")){

        current_row_org_name = event.target.parentElement.previousSibling.previousSibling;
        current_row_org_address = event.target.parentElement.previousSibling;

        frame_org_name.value=current_row_org_name.innerHTML; //занесение данных в форму из строчки в таблице
        frame_org_address.value=current_row_org_address.innerHTML; //--

        frame_org_update_show();

    }
});




//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//Фреймы-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//Фрейм организации-----------------------------------------------------
    //Перменные-_-_-_-_-_-_-_-_-_-_
    var frame_org_k=0;
    var frame_org=document.getElementById("frame_org");//Окно ввода физ.лиц
    var frame_org_exit=document.querySelector('.frame_org_exit');//Кнопка крестик(выйти) в окне добавления
    var frame_org_confirm_but=document.querySelector('.frame_org_cont .confirm_but');//Кнопка добавить в форме физ.лиц
    var section_organizations_addBut = document.querySelector('.section.organizations .section_table_add');//ннопка добавить в секции организации
    var current_row_org_name;
    var current_row_org_address;
//

//Выход из формы
frame_org_exit.addEventListener('click', () =>{
    frame_org.style.display="none";
});

//Отображение, если Форма используется для добавления нового документа(записи)
section_organizations_addBut.addEventListener('click', ()=>{
    document.querySelector(".frame_org_cont .frame_title").innerHTML="Форма добавления данных";
    document.querySelector(".frame_org_cont .confirm_but").innerHTML="Добавить";
    frame_org_name.value="";
    frame_org_address.value="";
    frame_org.style.display="flex";
    frame_org_k=0;
});

//Отображение, если Форма используется для обновления существующего документа(записи)
function frame_org_update_show(){
    document.querySelector(".frame_org_cont .frame_title").innerHTML="Форма обновления данных";
    document.querySelector(".frame_org_cont .confirm_but").innerHTML="Обновить";
    frame_org.style.display="flex";
    frame_org_k=1;
}

frame_org_confirm_but.addEventListener('click', async function() {
    if (frame_org_k==0) {
        collection_organizations_add();
    }
    else{
        await eel.collection_organizations_update(
            current_row_org_name.innerHTML,
            current_row_org_address.innerHTML,
            frame_org_name.value,
            frame_org_address.value)();//вызов функции обновления данных в пайтоне для изменения в MongoDB
        
        current_row_org_name.innerHTML = frame_org_name.value;
        current_row_org_address.innerHTML = frame_org_address.value;
    }
    frame_org.style.display="none";
});
