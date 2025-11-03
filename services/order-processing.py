from __future__ import annotations

import json
from typing import Dict, List
from uuid import uuid4

import requests

ROOT_URL = "https://bbxc8iwzfk.execute-api.us-east-2.amazonaws.com/"
HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST",
}


def _response(status: int, body: Dict | List | None = None) -> Dict:
    response = {
        "isBase64Encoded": False,
        "statusCode": status,
        "headers": HEADERS,
    }
    if body is not None:
        response["body"] = json.dumps(body)
    return response


def _fetch_item(item_id: int) -> Dict:
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


def _reserve_items(items: List[Dict]) -> Dict:
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


def _validate_items(items: object) -> List[Dict]:
    if not isinstance(items, list) or not items:
        raise ValueError(f"Invalid order format: {items}")

    validated_items: List[Dict] = []
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


def _validate_section(section: object, name: str) -> Dict:
    if not isinstance(section, dict):
        raise ValueError(f"Order {name} details must be an object")
    return section


def lambda_handler(event: Dict, context):
    method = event["requestContext"]["http"]["method"]

    if not (method == "POST"):
        return _response(404, {"error": "Not found"})

    body = event.get("body") or "{}"
    if isinstance(body, str):
        try:
            body = json.loads(body)
        except json.JSONDecodeError as exc:
            return _response(400, {"Invalid JSON format": f"{str(exc)} {body}"})
    try:
        items = _validate_items(body.get("items"))
        _validate_section(body.get("payment"), "payment")
        _validate_section(body.get("shipping"), "shipping")
    except ValueError as exc:
        return _response(400, {"error": str(exc)})

    summaries: List[Dict] = []
    insufficient: List[Dict] = []

    for item in items:
        try:
            inventory_item = _fetch_item(item["id"])
        except ValueError as exc:
            return _response(404, {"error": repr(exc)})
        except RuntimeError as exc:
            return _response(502, {"Fetch error": repr(exc)})

        available = int(inventory_item.get("availableTickets", 0))
        if item["quantity"] > available:
            insufficient.append({
                "id": item["id"],
                "name": inventory_item.get("name", "Unknown"),
                "requested": item["quantity"],
                "available": available,
            })
            continue

        price = float(inventory_item.get("price", 0.0))
        summaries.append({
            "id": item["id"],
            "name": inventory_item.get("name", "Unknown"),
            "quantity": item["quantity"],
            "price": price,
        })

    if insufficient:
        return _response(409, {"error": "Insufficient inventory", "items": insufficient})

    try:
        reservation_result = _reserve_items(items)
    except RuntimeError as exc:
        return _response(502, {"Reservation error": repr(exc)})

    if reservation_result["status"] == 409:
        return _response(409, reservation_result["body"])

    return _response(
        status = 200,
        body = {
            "confirmation_number": uuid4().hex[:10].upper(),
            "items": summaries,
        },
    )
