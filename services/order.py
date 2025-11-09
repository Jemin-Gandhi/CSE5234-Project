import os
import json
from uuid import uuid4

import mysql.connector
from mysql.connector import errorcode


HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST",
}


def _response(status: int, body: dict | list | None = None) -> dict:
    response = {
        "isBase64Encoded": False,
        "statusCode": status,
        "headers": HEADERS,
    }
    if body is not None:
        response["body"] = json.dumps(body)
    return response


def _format_body(body: object) -> dict | None:
    if isinstance(body, str):
        try:
            body = json.loads(body)
        except json.JSONDecodeError:
            return None

    if not body or not isinstance(body, dict):
        return None
    return body


def _connect_to_db():
    try:
        return mysql.connector.connect(
            host=os.environ.get('DB_HOST'),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASSWORD'),
            database=os.environ.get('DB_NAME'),
        )
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
        raise


def _save_order(order: dict, items: dict):
    cnx = _connect_to_db()
    cursor = cnx.cursor()
    insert_order = ("INSERT INTO ORDERS "
                    "(CUSTOMER_NAME, ORDER_CONFIRMATION_NUMBER, SHIPPING_INFO_CONFIRMATION_NUMBER, PAYMENT_INFO_CONFIRMATION_NUMBER)"
                    " VALUES (%s, %s, %s, %s)")
    confirmation_number = uuid4().hex[:10].upper()
    order_data = (order.get("name"), confirmation_number, order.get("shipping_info"), order.get("payment_info"))
    cursor.execute(insert_order, order_data)
    order_id = cursor.lastrowid
    cnx.commit()

    for item in items:
        insert_item = ("INSERT INTO ORDER_LINE_ITEM (ORDER_ID, NAME, QUANTITY, PRICE) VALUES (%s, %s, %s, %s)")
        item_data = (order_id, item.get("name"), item.get("quantity"), item.get("price"))
        cursor.execute(insert_item, item_data)
        cnx.commit()
    cursor.close()
    cnx.close()
    return confirmation_number


def lambda_handler(event, context):
    if event["requestContext"]["http"]["method"] != "POST":
        return _response(404, {"error": "Not found"})

    body = _format_body(event.get("body", None))
    if not body:
        return _response(400, {"Invalid JSON format": f"{body}"})

    try:
        confirmation_number = _save_order(body.get("orders"), body.get("items"))
    except Exception as e:
        return _response(500, {"error": f"{str(e)}"})

    return _response(200, {"confirmation_number": f"{confirmation_number}"})
