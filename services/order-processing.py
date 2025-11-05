from __future__ import annotations

import json
import os
from errno import errorcode
from uuid import uuid4

import requests
import mysql.connector
from mysql.connector import errorcode

ROOT_URL = os.environ.get('ROOT_URL')
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


def _validate_section(section: object, name: str) -> dict:
    if not isinstance(section, dict):
        section = _format_body(section)
        if section is None:
            raise ValueError(f"Order {name} details must be an object")
    return section


def _fetch_item(item_id: int) -> dict:
    url = f'{ROOT_URL.rstrip('/')}/inventory-management/inventory/items/{item_id}'
    try:
        response = requests.get(url, timeout=10)
    except requests.exceptions.Timeout as e:
        raise RuntimeError(f"{e}\nInventory service timed out: {url}") from e

    if response.status_code == 404:
        raise ValueError(f"Item {item_id} not found")

    if not response.ok:
        raise RuntimeError(f"Inventory service error: {response.status_code}: {response.text}")

    return response.json()


def _reserve_items(items: list[dict]) -> dict:
    url = f'{ROOT_URL.rstrip("/")}/inventory-management/inventory/items'
    try:
        response = requests.post(url, json={"items": items}, timeout=10)
    except requests.exceptions.Timeout as e:
        raise RuntimeError(f"{e}\nInventory service timed out: {url}") from e

    if response.status_code == 409:
        return {"status": 409, "body": response.json()}

    if not response.ok:
        raise RuntimeError(f"Inventory service error: {response.status_code}: {response.text}")

    return {"status": 200, "body": response.json()}


def _validate_items(items: object) -> list[dict]:
    if not isinstance(items, list) or not items:
        raise ValueError(f"Invalid order format: {items}")

    validated_items: list[dict] = []
    for item in items:
        if not isinstance(item, dict) or "id" not in item:
            raise ValueError(f"Invalid item format. Items must be a dictionary with id and quantity")
        try:
            item_id = int(item.get("id"))
            quantity = int(item.get("quantity"))
        except (TypeError, ValueError):
            raise ValueError(f"Invalid order format. Key {item.get('id')} and quantity {item.get('quantity')} must be integers")
        if quantity <= 0:
            raise ValueError("Quantity to reserve must be greater than 0")
        validated_items.append({"id": item_id, "quantity": quantity})
    return validated_items


def _validate_item_quantities(items: list[dict]) -> tuple[list[dict], list[dict]]:
    summaries: list[dict] = []
    insufficient: list[dict] = []

    for item in items:
        try:
            inventory_item = _fetch_item(item["id"])
        except ValueError as exc:
            raise ValueError(f"Invalid order format. Item {item['id']} not found") from exc
        except RuntimeError as exc:
            raise RuntimeError(f"Inventory service error: {exc}") from exc

        available = int(inventory_item.get("availableTickets", 0))
        if item["quantity"] > available:
            insufficient.append({
                "id": item["id"],
                "name": inventory_item.get("name", "Unknown"),
                "requested": item["quantity"],
                "available": available
            })
        else:
            summaries.append({
                "id": item["id"],
                "name": inventory_item.get("name", "Unknown"),
                "quantity": item["quantity"],
                "price": float(inventory_item.get("price", 0.0))
            })
    return summaries, insufficient


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


def _execute_query(query: str, data: tuple | None = None):
    cnx = _connect_to_db()
    cursor = cnx.cursor()
    cursor.execute(query, data)
    id = cursor.lastrowid
    cnx.commit()
    cursor.close()
    cnx.close()
    return id


def _save_order_to_database(items: list[dict], payment: dict, shipping: dict) -> str:
    payment_response = requests.post(f'{ROOT_URL.rstrip("/")}/payment', json=payment)
    shipping_response = requests.post(f'{ROOT_URL.rstrip("/")}/shipping', json=shipping)
    if not payment_response.ok or not shipping_response.ok:
        raise RuntimeError("Error saving order to database")

    insert_order = ("INSERT INTO ORDERS "
                    "(CUSTOMER_NAME, ORDER_CONFIRMATION_NUMBER, SHIPPING_INFO_CONFIRMATION_NUMBER, PAYMENT_INFO_CONFIRMATION_NUMBER)"
                    " VALUES (%s, %s, %s, %s)")
    confirmation_number = uuid4().hex[:10].upper()
    order_data = (
        shipping.get("name"),
        confirmation_number,
        shipping_response.json().get("confirmation_number"),
        payment_response.json().get("confirmation_number"),
    )
    order_id = _execute_query(insert_order, order_data)

    for item in items:
        insert_item = ("INSERT INTO ORDER_LINE_ITEM "
                       "(ORDER_ID, ITEM_NAME, QUANTITY, PRICE)"
                       " VALUES (%s, %s, %s, %s)")
        item_data = (
            order_id,
            item.get("name"),
            item.get("quantity"),
            item.get("price"),
        )
        _execute_query(insert_item, item_data)
    return confirmation_number





def lambda_handler(event: dict, context):
    if event["requestContext"]["http"]["method"] != "POST":
        return _response(404, {"error": "Not found"})

    body = _format_body(event.get("body", None))
    if not body:
        return _response(400, {"Invalid JSON format": f"{body}"})

    try:
        items = _validate_items(body.get("items"))
        payment = _validate_section(body.get("payment"), "payment")
        shipping = _validate_section(body.get("shipping"), "shipping")
    except ValueError as exc:
        return _response(400, {"error": str(exc)})

    try:
        summaries, insufficient = _validate_item_quantities(items)
    except ValueError as exc:
        return _response(404, {"Error": repr(exc)})
    except RuntimeError as exc:
        return _response(502, {"Error": repr(exc)})

    try:
        reservation_result = _reserve_items(items)
    except RuntimeError as exc:
        return _response(502, {"Reservation error": repr(exc)})

    if reservation_result["status"] == 409:
        return _response(409, reservation_result["body"])

    confirmation_number = _save_order_to_database(items, payment, shipping)
    return _response(200,{"confirmation_number": confirmation_number, "items": summaries})