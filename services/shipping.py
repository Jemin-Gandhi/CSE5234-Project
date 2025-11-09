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
    id = cursor.lastrowid
    cnx.commit()
    cursor.close()
    cnx.close()
    return id

def _persist_shipping_info(body: dict):
    insert_query = (
        "INSERT INTO ADDRESS "
        "(NAME, ADDRESS1, ADDRESS2, CITY, STATE, POSTAL_CODE) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )
    insert_data = (
        body["name"],
        body["addressLine1"],
        body["addressLine2"],
        body["city"],
        body["state"],
        body["zip"],
    )
    address_id = _execute_query(insert_query, insert_data)

    insert_shipping_query = (
        "INSERT INTO SHIPPING_INFO "
        "(SHIPPING_INFO_CONFIRMATION_NUMBER, BUSINESS_ID, ADDRESS_ID, NUM_PACKETS, WEIGHT) "
        "VALUES (%s, %s, %s, %s, %s)"
    )
    insert_shipping_data = (
        body['confirmation_number'],
        body["business_id"],
        address_id,
        body["num_packets"],
        body['weight']
    )
    _execute_query(insert_shipping_query, insert_shipping_data)



def lambda_handler(event: dict, context):
    for record in event['Records']:
        message = record['Sns']['Message']
        body = _format_body(message)
        if not body:
            return _response(400, {"Invalid JSON format": f"{body}"})

        try:
            _persist_shipping_info(body)
        except Exception as e:
            print(e)
            return _response(500, {"error": "Internal server error"})

        print(_response(200, {}))
