import os
import json
from uuid import uuid4
from typing import Dict, List, Optional, Union

import requests
import mysql.connector
from mysql.connector import errorcode

ROOT_URL = os.environ.get('ROOT_URL')
HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST",
}

def _response(status: int, body: Union[Dict, List, None] = None) -> dict:
    response = {
        "isBase64Encoded": False,
        "statusCode": status,
        "headers": HEADERS,
    }
    if body is not None:
        response["body"] = json.dumps(body)
    return response

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

def _execute_query(query: str, data: tuple = None, fetch_one=False, fetch_all=False):
    cnx = _connect_to_db()
    cursor = cnx.cursor(dictionary=True)  # Return results as dictionary
    try:
        if data is not None:
            cursor.execute(query, data)
        else:
            cursor.execute(query)

        if fetch_one:
            return cursor.fetchone()
        if fetch_all:
            return cursor.fetchall()

        # For INSERT/UPDATE/DELETE
        cnx.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        cnx.close()
  
def get_all_inventory() -> dict:
    try:
        # Get all vacations
        get_vacations = (
            "SELECT * "
            "FROM Vacation "
            "ORDER BY id;"
        )
        vacations = _execute_query(get_vacations, fetch_all=True)

        if not vacations:
            return _response(404, {"error": "No vacations found"})

        # Get all images, includes, highlights
        get_images = (
            "SELECT imageURL, vacationId "
            "FROM Image "
            "ORDER BY vacationId, id;"
        )
        images = _execute_query(get_images, fetch_all=True)

        get_includes = (
            "SELECT amenityDescription, vacationId "
            "FROM Include "
            "ORDER BY vacationId, id;"
        )
        includes = _execute_query(get_includes, fetch_all=True)

        get_highlights = (
            "SELECT highlightDescription, vacationId "
            "FROM Highlight "
            "ORDER BY vacationId, id;"
        )
        highlights = _execute_query(get_highlights, fetch_all=True)

        # Group related data by vacation ID
        inventory: Dict[int, dict] = {}
        for vacation in vacations:
            vid = vacation["id"]
            inventory[vid] = {
                "id": vacation["id"],
                "name": vacation.get("name"),
                "location": vacation.get("location"),
                "price": float(vacation.get("price", 0.0)),
                "duration": vacation.get("duration"),
                "departureDate": vacation["departureDate"].isoformat() if vacation.get("departureDate") else None,
                "shortDescription": vacation.get("shortDescription"),
                "description": vacation.get("description"),
                "availableTickets": vacation.get("availableTickets"),
                "images": [],
                "includes": [],
                "highlights": [],
            }

        # Add images
        for img in images or []:
            vid = img.get("vacationId")
            if vid in inventory:
                inventory[vid]["images"].append(img.get("imageURL"))

        # Add includes
        for inc in includes or []:
            vid = inc.get("vacationId")
            if vid in inventory:
                inventory[vid]["includes"].append(inc.get("amenityDescription"))

        # Add highlights
        for high in highlights or []:
            vid = high.get("vacationId")
            if vid in inventory:
                inventory[vid]["highlights"].append(high.get("highlightDescription"))

        return _response(200, inventory)

    except Exception as e:
        return _response(500, {"error": f"Database error: {str(e)}"})
  
def get_item_by_id(item_id: int) -> dict:
    try:
        item_id = int(item_id)
    except (TypeError, ValueError):
        return _response(400, {"error": "Invalid item ID"})

    try:
        get_vacation = (
            "SELECT * "
            "FROM Vacation "
            "WHERE id = %s;"
        )
        vacation = _execute_query(get_vacation, (item_id,), fetch_one=True)

        if not vacation:
            return _response(404, {"error": f"Item {item_id} not found"})

        # call the other 3 tables to get Image, Include, Highlight
        get_images = (
            "SELECT imageURL "
            "FROM Image "
            "WHERE vacationId = %s "
            "ORDER BY id;"
        )
        images = _execute_query(get_images, (item_id,), fetch_all=True)

        get_includes = (
            "SELECT amenityDescription "
            "FROM Include "
            "WHERE vacationId = %s "
            "ORDER BY id;"
        )
        includes = _execute_query(get_includes, (item_id,), fetch_all=True)

        get_highlights = (
            "SELECT highlightDescription "
            "FROM Highlight "
            "WHERE vacationId = %s "
            "ORDER BY id;"
        )
        highlights = _execute_query(get_highlights, (item_id,), fetch_all=True)

        result = {
            "id": vacation.get("id"),
            "name": vacation.get("name"),
            "location": vacation.get("location"),
            "price": float(vacation.get("price", 0.0)),
            "duration": vacation.get("duration"),
            "departureDate": vacation["departureDate"].isoformat() if vacation.get("departureDate") else None,
            "shortDescription": vacation.get("shortDescription"),
            "description": vacation.get("description"),
            "availableTickets": vacation.get("availableTickets"),
            "images": [img.get("imageURL") for img in (images or [])],
            "includes": [inc.get("amenityDescription") for inc in (includes or [])],
            "highlights": [h.get("highlightDescription") for h in (highlights or [])],
        }

        return _response(200, result)

    except Exception as e:
        return _response(500, {"error": f"Database error: {str(e)}"})

def get_items_by_name(name_query: str) -> dict:
    print("querying items by name")
    if not name_query or not name_query.strip():
        return _response(400, {"error": "Name parameter is required"})
    try:
        # Use lowercase comparison in SQL by lowering the parameter
        get_vacation = (
            "SELECT * "
            "FROM Vacation "
            "WHERE LOWER(name) LIKE %s "
            "ORDER BY id;"
        )
        vacations = _execute_query(get_vacation, (f"%{name_query.lower()}%",), fetch_all=True)

        if not vacations:
            return _response(404, {"error": f"No items found with name {name_query}"})

        results: List[dict] = []
        for vacation in vacations:
            vacation_id = vacation["id"]

            # Get images
            get_images = (
                "SELECT imageURL "
                "FROM Image "
                "WHERE vacationId = %s "
                "ORDER BY id;"
            )
            images = _execute_query(get_images, (vacation_id,), fetch_all=True)

            # Get includes
            get_includes = (
                "SELECT amenityDescription "
                "FROM Include "
                "WHERE vacationId = %s "
                "ORDER BY id;"
            )
            includes = _execute_query(get_includes, (vacation_id,), fetch_all=True)

            # Get highlights
            get_highlights = (
                "SELECT highlightDescription "
                "FROM Highlight "
                "WHERE vacationId = %s "
                "ORDER BY id;"
            )
            highlights = _execute_query(get_highlights, (vacation_id,), fetch_all=True)

            result = {
                "id": vacation.get("id"),
                "name": vacation.get("name"),
                "location": vacation.get("location"),
                "price": float(vacation.get("price", 0.0)),
                "duration": vacation.get("duration"),
                "departureDate": vacation["departureDate"].isoformat() if vacation.get("departureDate") else None,
                "shortDescription": vacation.get("shortDescription"),
                "description": vacation.get("description"),
                "availableTickets": vacation.get("availableTickets"),
                "images": [img.get("imageURL") for img in (images or [])],
                "includes": [inc.get("amenityDescription") for inc in (includes or [])],
                "highlights": [h.get("highlightDescription") for h in (highlights or [])],
            }
            results.append(result)

        return _response(200, results)

    except Exception as e:
        return _response(500, {"error": f"Database error: {str(e)}"})


def reserve_items(request_data: dict) -> dict:
    if not isinstance(request_data, dict):
        try:
            request_data = json.loads(request_data)
        except json.JSONDecodeError:
            return _response(400, {'error': 'Invalid request format'})

    items_to_reserve = request_data.get('items', [])
    if not isinstance(items_to_reserve, list) or not items_to_reserve:
        return _response(400, {'error': 'Items must be a non-empty list'})

    cnx = None
    try:
        cnx = _connect_to_db()
        cursor = cnx.cursor(dictionary=True)
        
        # Start transaction
        cnx.start_transaction()
        
        insufficient_items = []
        
        # Check availability for each item
        for item_request in items_to_reserve:
            item_id = int(item_request['id'])
            quantity = int(item_request.get('quantity', 0))
            
            if quantity <= 0:
                cnx.rollback()
                return _response(400, {'error': 'Quantity must be greater than 0'})
            
            # Lock row and get current availability
            get_inventory = ("SELECT id, name, availableTickets "
                            "FROM Vacation "
                            "WHERE id = %s "
                            "FOR UPDATE;")
            cursor.execute(get_inventory, (item_id,))
            vacation = cursor.fetchone()
            
            if not vacation:
                cnx.rollback()
                return _response(404, {'error': f'Item {item_id} not found'})
            
            available_quantity = vacation['availableTickets']
            
            if quantity > available_quantity:
                insufficient_items.append({
                    'id': item_id,
                    'name': vacation['name'],
                    'requested': quantity,
                    'available': available_quantity
                })
        
        # If any items are insufficient, rollback
        if insufficient_items:
            cnx.rollback()
            return _response(409, {
                'error': 'Insufficient inventory',
                'items': insufficient_items
            })
        
        # All items available, update quantities
        for item_request in items_to_reserve:
            item_id = int(item_request['id'])
            quantity = int(item_request['quantity'])
            
            update_quantity = ("UPDATE Vacation "
                               "SET availableTickets = availableTickets - %s "
                               "WHERE id = %s;")
            cursor.execute(update_quantity, (quantity, item_id))
        
        # Commit transaction
        cnx.commit()
        cursor.close()
        cnx.close()
        
        return _response(200, {'message': 'Items reserved successfully'})
    
    except Exception as e:
        if cnx:
            cnx.rollback()
            cnx.close()
        return _response(500, {'error': f'Reserve handling error: {str(e)}'})

        
# AWS Lambda handler function
def lambda_handler(event: dict, context) -> dict:
    """AWS Lambda handler for inventory management service"""
    try:
        # Extract HTTP method and path from event
        requestContext = event.get('requestContext', {})
        http = requestContext.get('http', {})
        path = http.get('path', '')
        method = http.get('method', '')

        query_params = event.get('queryStringParameters', {})
        path_params = event.get('pathParameters', {})
        body = event.get('body', {})
        
        if isinstance(body, str):
            try:
                request_data = json.loads(body) if body else {}
            except json.JSONDecodeError:
                request_data = {}
        else:
            request_data = body
        
        # Debug logging
        print(f"Method: {method}, Path: {path}, PathParams: {path_params}, QueryParams: {query_params}")
        
        # Route requests based on path and method
        if path == '/inventory-management/inventory' and method == 'GET':
            return get_all_inventory()
        elif path.startswith('/inventory-management/inventory/items') and method == 'GET':
            # Check if we have an ID in path parameters or path
            item_id = None
            if path_params.get('id'):
                item_id = path_params['id']
            elif path.startswith('/inventory-management/inventory/items/'):
                # Extract from path if no path parameters
                path_parts = path.rstrip('/').split('/')
                if len(path_parts) > 0 and path_parts[-1].isdigit():
                    item_id = int(path_parts[-1])
            
            if item_id is not None:
                return get_item_by_id(item_id)
            else:
                # Search by name — check pathParams first, then query string
                name_query = (
                    path_params.get('name') or
                    query_params.get('name', '')
                )
                return get_items_by_name(name_query)
        elif path == '/inventory-management/inventory/items' and method == 'POST':
            return reserve_items(request_data)
        else:
            return _response(404, {'error': f"Path '{path}' not found"})
    
    except Exception as e:
        return _response(500, {'Main routing error': str(e), 'message': repr(e)})  # Catch any unexpected errors
      