from __future__ import annotations

import json
import os
from uuid import uuid4

import requests
import boto3

ROOT_URL = os.environ.get('ROOT_URL')
HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST",
}
BUSINESS_ID = 1234567


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
        print(f"Sending inventory service post request")
        response = requests.post(url, json={"items": items}, timeout=5)
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
            name = item.get("name", "Unknown")
            quantity = int(item.get("quantity"))
            price = float(item.get("price", 0.0))
        except (TypeError, ValueError):
            raise ValueError(f"Invalid order format. Key {item.get('id')} and quantity {item.get('quantity')} must be integers")
        if quantity <= 0:
            raise ValueError("Quantity to reserve must be greater than 0")
        validated_items.append({"id": item_id, "name": name, "quantity": quantity, "price": price})
    return validated_items


def _save_order_to_database(items: list[dict], payment: dict, shipping: dict) -> str:
    payment_response = requests.post(f'{ROOT_URL.rstrip("/")}/payment', json=payment)
    if not payment_response.ok:
        raise RuntimeError("Error saving payment data")

    shipping_confirmation_number = uuid4().hex[:10].upper()
    orders = {
        "orders": {
            "customer_name": shipping.get("name"),
            "shipping_info": shipping_confirmation_number,
            "payment_info": payment_response.json().get("confirmation_number"),
        },
        "items": items
    }
    order_response = requests.post(f'{ROOT_URL.rstrip("/")}/orders', json=orders)
    if not order_response.ok:
        raise RuntimeError("Error saving order data")

    shipping["confirmation_number"] = shipping_confirmation_number
    shipping["business_id"] = BUSINESS_ID
    shipping["num_packets"] = len(items)
    shipping["weight"] = sum([1.0 * items[i]['quantity'] for i in range(len(items))])

    sns = boto3.client('sns')
    sns.publish(
        TopicArn=os.environ.get('SHIPPING_TOPIC_ARN'),
        Message=json.dumps(shipping),
    )

    return order_response.json().get("confirmation_number")


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
        reservation_result = _reserve_items(items)
    except RuntimeError as exc:
        return _response(502, {"Reservation error": repr(exc)})

    if reservation_result["status"] == 409:
        return _response(409, reservation_result["body"])

    confirmation_number = _save_order_to_database(items, payment, shipping)
    return _response(200,{"confirmation_number": confirmation_number, "items": items})
