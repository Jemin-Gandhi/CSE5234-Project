from __future__ import annotations

import json
import os
from uuid import uuid4

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


def _format_body(body: dict | str | None) -> dict | None:
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


def _execute_query(query: str, data: tuple | None = None):
    cnx = _connect_to_db()
    cursor = cnx.cursor()
    cursor.execute(query, data)
    cnx.commit()
    cursor.close()
    cnx.close()

def _persist_payment_info(body: dict):
    insert_query = (
        "INSERT INTO shipping_info "
        "(payment_info_confirmation_number, holder_name, card_num, exp_date, cvv) "
        "VALUES (%s, %s, %s, %s, %s)"
    )
    confirmation_number = uuid4().hex[:10].upper()
    insert_data = (
        confirmation_number,
        body["card_holder_name"],
        body["credit_card_num"],
        body["expir_date"],
        body["cvvCode"],
    )
    _execute_query(insert_query, insert_data)
    return confirmation_number


def lambda_handler(event: dict, context):
    if event["requestContext"]["http"]["method"] != "POST":
        return _response(404, {"error": "Not found"})

    body = _format_body(event.get("body", None))
    if not body:
        return _response(400, {"Invalid JSON format": f"{body}"})

    try:
        confirmation_number = _persist_payment_info(body)
    except Exception as e:
        print(e)
        return _response(500, {"error": "Internal server error"})

    return _response(200, {"confirmation_number": confirmation_number})
