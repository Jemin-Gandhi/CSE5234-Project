import json
import os
from typing import Dict, Optional


HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}


def _response(status_code: int, body: Optional[Dict] = None) -> Dict:
    """Helper function to create a response dictionary"""
    body = body if body is not None else {}
    return {
        'statusCode': status_code,
        'headers': HEADERS,
        'body': json.dumps(body)
    }


def load_inventory_data() -> Dict:
    """Load all inventory items from JSON files in the data/products directory"""
    inventory = {}
    for filename in os.listdir('./data/products'):
        try:
            with open(f'./data/products/{filename}', 'r') as f:
                item = json.load(f)
                inventory[item.get("id")] = item
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading {filename}: {e}")
            continue
    return inventory


# Global inventory data (loaded once at startup)
INVENTORY_DATA = load_inventory_data()


def get_all_inventory() -> Dict:
    """Return all items in the inventory"""
    return _response(200, INVENTORY_DATA)


def get_item_by_id(item_id: int) -> Dict:
    """Return a specific item by ID"""
    try:
        int(item_id)
    except:
        return _response(400, {'error': 'Invalid item ID'})

    try:
        item = INVENTORY_DATA[int(item_id)]
    except KeyError:
        print(INVENTORY_DATA.keys())
        return _response(404, {'error': f'Item {item_id} not found'})

    return _response(200, item)


def get_items_by_name(name_query: str) -> Dict:
    """Return items filtered by name query parameter"""
    print("querying items by name")
    if not name_query or not name_query.strip():
        return _response(400, {'error': 'Name parameter is required'})

    # Case-insensitive search
    matching_items = []
    for item in INVENTORY_DATA.values():
        item_name = item.get('name', '').lower()
        if name_query.lower() in item_name:
            matching_items.append(item)

    if not matching_items:
        return _response(404, {'error': f'No items found with name {name_query}'})
    else:
        return _response(200, matching_items)


def reserve_items(request_data: Dict) -> Dict:
    """Reserve items in inventory (for order processing integration)"""
    if not isinstance(request_data, dict):
        try:
            request_data = json.loads(request_data)
        except json.JSONDecodeError:
            return _response(400, {'error': 'Invalid request format'})

    items_to_reserve = request_data['items']
    if not isinstance(items_to_reserve, list):
        return _response(400, {'error': 'Items must be a list'})

    # Check availability for each item
    insufficient_items = []
    try:
        for item_request in items_to_reserve:
            item_id = int(item_request['id'])
            quantity = item_request.get('quantity', 0)

            # Find the item in inventory
            try:
                inventory_item = INVENTORY_DATA[item_id]
            except KeyError as e:
                return _response(404, {'error': f'Item {item_id} not found'})

            available = inventory_item.get('availableTickets', 0)
            if quantity > available:
                insufficient_items.append({
                    'id': item_id,
                    'name': inventory_item.get('name'),
                    'requested': quantity,
                    'available': available
                })

        if insufficient_items:
            return _response(409, {
                'error': 'Insufficient inventory',
                'items': insufficient_items
            })

        # If we get here, all items are available
        # In a real system, you would update the inventory here
        return _response(200, {'message': 'Items reserved successfully'})

    except Exception as e:
        return _response(500, {'Reserve handling error': repr(e)})  # Catch any unexpected errors


def lambda_handler(event: Dict, context) -> Dict:
    """AWS Lambda handler for inventory management service"""
    try:
        # Extract HTTP method and path from event
        request_context = event.get('requestContext', {})
        http = request_context.get('http', {})
        path = http.get('path', '')
        method = http.get('method', '')

        query_params = event.get('queryStringParameters', {})
        path_params = event.get('pathParameters', {})
        body = event.get('body', {})

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
                # Search by name
                name_query = query_params.get('name', '')
                return get_items_by_name(name_query)
        elif path == '/inventory-management/inventory/items' and method == 'POST':
            return reserve_items(request_data)
        else:
            return _response(404, {'error': f"Path '{path}' not found"})

    except Exception as e:
        return _response(500, {'Main routing error': str(e), 'message': repr(e)})  # Catch any unexpected errors