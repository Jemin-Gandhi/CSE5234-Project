from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from typing import List, Dict, Optional

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load inventory data from JSON files
def load_inventory_data() -> List[Dict]:
    """Load all inventory items from JSON files in the data/products directory"""
    inventory = []
    data_dir = os.path.join(os.path.dirname(__file__), 'data', 'products')
    
    if not os.path.exists(data_dir):
        return []
    
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            file_path = os.path.join(data_dir, filename)
            try:
                with open(file_path, 'r') as f:
                    item = json.load(f)
                    inventory.append(item)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading {filename}: {e}")
                continue
    
    return inventory

# Global inventory data (loaded once at startup)
INVENTORY_DATA = load_inventory_data()

@app.route('/inventory-management/inventory', methods=['GET'])
def get_all_inventory():
    """Return all items in the inventory"""
    return jsonify(INVENTORY_DATA)

@app.route('/inventory-management/inventory/items/<int:item_id>', methods=['GET'])
def get_item_by_id(item_id: int):
    """Return a specific item by ID"""
    for item in INVENTORY_DATA:
        if item.get('id') == item_id:
            return jsonify(item)
    
    return jsonify({'error': 'Item not found'}), 404

@app.route('/inventory-management/inventory/items', methods=['GET'])
def get_items_by_name():
    """Return items filtered by name query parameter"""
    name_query = request.args.get('name', '').strip()
    
    if not name_query:
        return jsonify({'error': 'Name parameter is required'}), 400
    
    # Case-insensitive search
    matching_items = []
    for item in INVENTORY_DATA:
        item_name = item.get('name', '').lower()
        if name_query.lower() in item_name:
            matching_items.append(item)
    
    return jsonify(matching_items)

@app.route('/inventory-management/inventory/items', methods=['POST'])
def reserve_items():
    """Reserve items in inventory (for order processing integration)"""
    try:
        data = request.get_json()
        if not data or 'items' not in data:
            return jsonify({'error': 'Invalid request format'}), 400
        
        items_to_reserve = data['items']
        if not isinstance(items_to_reserve, list):
            return jsonify({'error': 'Items must be a list'}), 400
        
        # Check availability for each item
        insufficient_items = []
        for item_request in items_to_reserve:
            item_id = item_request.get('id')
            quantity = item_request.get('quantity', 0)
            
            # Find the item in inventory
            inventory_item = None
            for item in INVENTORY_DATA:
                if item.get('id') == item_id:
                    inventory_item = item
                    break
            
            if not inventory_item:
                return jsonify({'error': f'Item {item_id} not found'}), 404
            
            available = inventory_item.get('availableTickets', 0)
            if quantity > available:
                insufficient_items.append({
                    'id': item_id,
                    'name': inventory_item.get('name'),
                    'requested': quantity,
                    'available': available
                })
        
        if insufficient_items:
            return jsonify({
                'error': 'Insufficient inventory',
                'items': insufficient_items
            }), 409
        
        # If we get here, all items are available
        # In a real system, you would update the inventory here
        return jsonify({'message': 'Items reserved successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'items_count': len(INVENTORY_DATA)})

if __name__ == '__main__':
    print(f"Starting inventory management service with {len(INVENTORY_DATA)} items")
    app.run(host='0.0.0.0', port=5002, debug=True)
