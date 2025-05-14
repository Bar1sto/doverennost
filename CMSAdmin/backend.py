# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Импорт библиотек-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
import pymongo
import eel
import datetime
from bson import ObjectId

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Подключение к БД-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
db_client = pymongo.MongoClient('localhost', 27017)
current_db = db_client["CMSAdmiin"]

collection_documents = current_db["CMSAdmin.documents"]
collection_individuals = current_db["CMSAdmin.individuals"]
collection_organizations = current_db["CMSAdmin.organizations"]
collection_items = current_db["CMSAdmin.items"]
collection_vedomost = current_db["vedomost"]
collection_prikaz = current_db["CMSAdmin.prikaz"]
collection_order = current_db["CMSAdmin.order"]
# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции для приказов-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_




@eel.expose
def collection_order_load_records():
    orders = convert_ids(collection_order.find())
    print(f"Загруженные заказы: {orders}")
    return orders

@eel.expose
def collection_order_form_load_records(order_number):
    order = collection_order.find_one({"order_number": str(order_number)})
    print(f"Ищем заказ с номером: {order_number}, результат: {order}")
    if not order:
        return None
    return order

@eel.expose
def collection_order_add(
    organization,
    order_number,
    supplier,
    corresponding_account,
    document_number,
    issue_day, issue_month, issue_year,
    operation_type,
    material_values
):
    if collection_order.find_one({"order_number": order_number}):
        return 0
    collection_order.insert_one({
        "organization": organization,
        "order_number": order_number,
        "supplier": supplier,
        "corresponding_account": corresponding_account,
        "document_number": document_number,
        "issue_date": {
            "day": issue_day,
            "month": issue_month,
            "year": issue_year
        },
        "operation_type": operation_type,
        "material_values": material_values
    })
    return 1

@eel.expose
def collection_order_delete(order_number):
    result = collection_order.delete_one({"order_number": str(order_number)})
    if result.deleted_count > 0:
        print(f"✅ Заказ {order_number} успешно удалён!")
    else:
        print(f"❌ Ошибка: заказ {order_number} не найден в базе!")
    return result.deleted_count > 0

@eel.expose
def collection_order_update(
    order_number_old,
    organization,
    order_number,
    supplier,
    corresponding_account,
    document_number,
    issue_day, issue_month, issue_year,
    operation_type,
    material_values
):
    result = collection_order.update_one(
        {"order_number": order_number_old},
        {"$set": {
            "organization": organization,
            "order_number": order_number,
            "supplier": supplier,
            "corresponding_account": corresponding_account,
            "document_number": document_number,
            "issue_date": {
                "day": issue_day,
                "month": issue_month,
                "year": issue_year
            },
            "operation_type": operation_type,
            "material_values": material_values
        }}
    )
    return result.modified_count > 0

@eel.expose
def collection_order_print(order_number):
    return collection_order.find_one({"order_number": str(order_number)})

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Вспомогательные функции-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
def convert_ids(cursor):
    return [{**doc, "_id": str(doc["_id"])} for doc in cursor]




@eel.expose
def collection_prikaz_load_records():
    prikazes = convert_ids(collection_prikaz.find())
    print(f"Загруженные приказы: {prikazes}")
    return prikazes

@eel.expose
def collection_prikaz_form_load_records(order_number):
    prikaz = collection_prikaz.find_one({"order_number": str(order_number)})
    print(f"Ищем приказ с номером: {order_number}, результат: {prikaz}")
    if not prikaz:
        return None
    return prikaz

@eel.expose
def collection_prikaz_add(
    organization,
    order_number,
    issue_day, issue_month, issue_year,
    approval_day, approval_month, approval_year,
    entry_day, entry_month, entry_year,
    department,
    responsible_person,
    transfer_reason,
    comment,
    employees,
    from_org, to_org
):
    if collection_prikaz.find_one({"order_number": order_number}):
        return 0
    collection_prikaz.insert_one({
        "organization": organization,
        "order_number": order_number,
        "issue_date": {
            "day": issue_day,
            "month": issue_month,
            "year": issue_year
        },
        "approval_date": {
            "day": approval_day,
            "month": approval_month,
            "year": approval_year
        },
        "entry_date": {
            "day": entry_day,
            "month": entry_month,
            "year": entry_year
        },
        "department": department,
        "responsible_person": responsible_person,
        "transfer_reason": transfer_reason,
        "comment": comment,
        "employees": employees,
        "transfer_details": {
            "from_org": from_org,
            "to_org": to_org
        }
    })
    return 1


@eel.expose
def collection_prikaz_delete(order_number):
    result = collection_prikaz.delete_one({"order_number": str(order_number)})
    if result.deleted_count > 0:
        print(f"✅ Приказ {order_number} успешно удалён!")
    else:
        print(f"❌ Ошибка: приказ {order_number} не найден в базе!")
    return result.deleted_count > 0

@eel.expose
def collection_prikaz_update(
    order_number_old,
    organization,
    order_number,
    issue_day, issue_month, issue_year,
    approval_day, approval_month, approval_year,
    entry_day, entry_month, entry_year,
    department,
    responsible_person,
    transfer_reason,
    comment,
    employees,
    from_org, to_org
):
    result = collection_prikaz.update_one(
        {"order_number": order_number_old},
        {"$set": {
            "organization": organization,
            "order_number": order_number,
            "issue_date": {
                "day": issue_day,
                "month": issue_month,
                "year": issue_year
            },
            "approval_date": {
                "day": approval_day,
                "month": approval_month,
                "year": approval_year
            },
            "entry_date": {
                "day": entry_day,
                "month": entry_month,
                "year": entry_year
            },
            "department": department,
            "responsible_person": responsible_person,
            "transfer_reason": transfer_reason,
            "comment": comment,
            "employees": employees,
            "transfer_details": {
                "from_org": from_org,
                "to_org": to_org
            }
        }}
    )
    return result.modified_count > 0


@eel.expose
def collection_prikaz_print(order_number):
    return collection_prikaz.find_one({"order_number": str(order_number)})
# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Вспомогательные функции-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
def convert_ids(cursor):
    return [{**doc, "_id": str(doc["_id"])} for doc in cursor]

@eel.expose
def find_organization_by_id(organization_id):
    try:
        if isinstance(organization_id, str):
            organization_id = ObjectId(organization_id)
    except Exception as e:
        print(f"Ошибка при преобразовании ID: {e}")
        return None
    return collection_organizations.find_one({"_id": organization_id})

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции для пользователей-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
users_collection = current_db["users"]

@eel.expose
def get_user_by_id(fio_id):
    user = users_collection.find_one({"_id": fio_id})
    if user:
        return {"fio": user.get("fio", "Не указано")}
    return None

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции загрузки данных-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
@eel.expose
def collection_documents_form_load_records(num_doc):
    document = collection_documents.find_one({"num_dover": str(num_doc)})
    print(f"Ищем документ с номером: {num_doc}, результат: {document}")
    if not document:
        return None
    return document

@eel.expose
def collection_documents_load_records():
    documents = convert_ids(collection_documents.find())
    print(f"Загруженные документы: {documents}")
    return documents

@eel.expose
def collection_individuals_load_records():
    individuals = convert_ids(collection_individuals.find())
    return individuals

@eel.expose
def collection_organizations_load_records():
    organizations = convert_ids(collection_organizations.find({}))
    print(f"Загруженные организации: {organizations}")
    return organizations

@eel.expose
def collection_items_load_records():
    items = convert_ids(collection_items.find())
    return items

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции добавления данных-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
@eel.expose
def collection_documents_add(
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
        doc_table_rows):
    if collection_documents.find_one({"num_dover": doc_num_dover}):
        return 0
    collection_documents.insert_one({
        "num_dover": doc_num_dover,
        "home_org": doc_home_org,
        "issue_with": [{
            "day": doc_issue_with_day,
            "month": doc_issue_with_month,
            "year": doc_issue_with_year
        }],
        "issue_for": [{
            "day": doc_issue_for_day,
            "month": doc_issue_for_month,
            "year": doc_issue_for_year
        }],
        "consumer_org": doc_consumer_org,
        "payer_org": doc_payer_org,
        "issue_from": [{
            "position": doc_issue_from_position,
            "fio_id": doc_issue_from_FIO
        }],
        "get_from_org": doc_issue_get_from_org,
        "table": doc_table_rows
    })
    return 1

@eel.expose
def collection_individuals_add(surname, name, patronymic, serial, num, issue):
    if collection_individuals.find_one(
            {"surname": surname, "name": name, "patronymic": patronymic, "serial_passport": serial, "num_passport": num,
             "issued": issue}):
        return 0
    collection_individuals.insert_one(
        {"surname": surname, "name": name, "patronymic": patronymic, "serial_passport": serial, "num_passport": num,
         "issued": issue})
    return 1

@eel.expose
def collection_organizations_add(name, address):
    if collection_organizations.find_one({"name": name, "address": address}):
        return 0
    collection_organizations.insert_one({"name": name, "address": address})
    return 1

@eel.expose
def collection_items_add(name):
    if collection_items.find_one({"name": name}):
        return 0
    collection_items.insert_one({"name": name})
    return 1

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции удаления данных-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
@eel.expose
def collection_documents_delete(num_doc):
    result = collection_documents.delete_one({"num_dover": str(num_doc)})
    if result.deleted_count > 0:
        print(f"✅ Документ {num_doc} успешно удалён!")
    else:
        print(f"❌ Ошибка: документ {num_doc} не найден в базе!")

@eel.expose
def collection_individuals_delete(surname, name, patronymic, serial, num, issue):
    collection_individuals.delete_one(
        {"surname": surname, "name": name, "patronymic": patronymic, "serial_passport": serial, "num_passport": num,
         "issued": issue})

@eel.expose
def collection_organizations_delete(name, address):
    collection_organizations.delete_one({"name": name, "address": address})

@eel.expose
def collection_items_delete(name):
    collection_items.delete_one({"name": name})

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции обновления данных-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
@eel.expose
def collection_documents_update(
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
    doc_issue_from_FIO,
    doc_issue_get_from_org,
    doc_table_rows
):
    result = collection_documents.update_one(
        {"num_dover": doc_num_old},
        {"$set": {
            "num_dover": doc_num_dover,
            "home_org": doc_home_org,
            "issue_with": [{
                "day": doc_issue_with_day,
                "month": doc_issue_with_month,
                "year": doc_issue_with_year
            }],
            "issue_for": [{
                "day": doc_issue_for_day,
                "month": doc_issue_for_month,
                "year": doc_issue_for_year
            }],
            "consumer_org": doc_consumer_org,
            "payer_org": doc_payer_org,
            "issue_from": [{
                "position": doc_issue_from_position,
                "fio_id": doc_issue_from_FIO
            }],
            "get_from_org": doc_issue_get_from_org,
            "table": doc_table_rows
        }}
    )
    return result.modified_count > 0

@eel.expose
def collection_individuals_update(surname, name, patronymic, serial, num, issue, surname_new, name_new, patronymic_new,
                                  serial_new, num_new, issue_new):
    collection_individuals.update_one({
        "surname": surname,
        "name": name,
        "patronymic": patronymic,
        "serial_passport": serial,
        "num_passport": num, "issued": issue
    }, {'$set': {
        "surname": surname_new,
        "name": name_new,
        "patronymic": patronymic_new,
        "serial_passport": serial_new,
        "num_passport": num_new,
        "issued": issue_new}
    })

@eel.expose
def collection_organizations_update(name, address, name_new, address_new):
    collection_organizations.update_one({
        "name": name,
        "address": address
    }, {'$set': {
        "name": name_new,
        "address": address_new}
    })

@eel.expose
def collection_items_update(name, name_new):
    collection_items.update_one({
        "name": name
    }, {'$set': {
        "name": name_new}
    })

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции печати документов-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
@eel.expose
def collection_documents_print(num_dover):
    return collection_documents.find_one({"num_dover": str(num_dover)})

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции для ведомостей-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Функции для ведомостей-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

@eel.expose
def collection_vedomost_load_records():
    vedomosts = convert_ids(collection_vedomost.find())
    print(f"Загруженные ведомости: {vedomosts}")
    return vedomosts

@eel.expose
def collection_vedomost_form_load_records(num_ved):
    vedomost = collection_vedomost.find_one({"num_ved": str(num_ved)})
    print(f"Ищем ведомость с номером: {num_ved}, результат: {vedomost}")
    if not vedomost:
        return None
    return vedomost

@eel.expose
def collection_vedomost_add(num_ved, date, home_org, issuer, receiver, materials):
    if collection_vedomost.find_one({"num_ved": num_ved}):
        return 0
    collection_vedomost.insert_one({
        "num_ved": num_ved,
        "date": date,
        "home_org": home_org,
        "issuer": issuer,
        "receiver": receiver,
        "materials": materials
    })
    return 1

@eel.expose
def collection_vedomost_delete(num_ved):
    result = collection_vedomost.delete_one({"num_ved": str(num_ved)})
    if result.deleted_count > 0:
        print(f"✅ Ведомость {num_ved} успешно удалена!")
    else:
        print(f"❌ Ошибка: ведомость {num_ved} не найдена в базе!")
    return result.deleted_count > 0

@eel.expose
def collection_vedomost_update(
    num_ved_old,
    num_ved,
    date,
    home_org,
    issuer,
    receiver,
    materials
):
    result = collection_vedomost.update_one(
        {"num_ved": num_ved_old},
        {"$set": {
            "num_ved": num_ved,
            "date": date,
            "home_org": home_org,
            "issuer": issuer,
            "receiver": receiver,
            "materials": materials
        }}
    )
    return result.modified_count > 0

@eel.expose
def collection_vedomost_print(num_ved):
    return collection_vedomost.find_one({"num_ved": str(num_ved)})

# -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_Запуск приложения-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
eel.init("")
eel.start("index.html", mode="CHROME")