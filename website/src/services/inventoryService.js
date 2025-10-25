const INVENTORY_API_BASE = 'http://localhost:5002/inventory-management';

class InventoryService {
  /**
   * Fetch all inventory items
   * @returns {Promise<Array>} Array of inventory items
   */
  async getAllItems() {
    try {
      const response = await fetch(`${INVENTORY_API_BASE}/inventory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all items:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific item by ID
   * @param {number} itemId - The ID of the item to fetch
   * @returns {Promise<Object>} The inventory item
   */
  async getItemById(itemId) {
    try {
      const response = await fetch(`${INVENTORY_API_BASE}/inventory/items/${itemId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Item not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching item ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Search items by name
   * @param {string} name - The name to search for
   * @returns {Promise<Array>} Array of matching inventory items
   */
  async getItemsByName(name) {
    try {
      const response = await fetch(`${INVENTORY_API_BASE}/inventory/items?name=${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error searching items by name "${name}":`, error);
      throw error;
    }
  }

  /**
   * Reserve items in inventory
   * @param {Array} items - Array of items with id and quantity
   * @returns {Promise<Object>} Reservation result
   */
  async reserveItems(items) {
    try {
      const response = await fetch(`${INVENTORY_API_BASE}/inventory/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error reserving items:', error);
      throw error;
    }
  }

  /**
   * Check service health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${INVENTORY_API_BASE.replace('/inventory-management', '')}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking service health:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const inventoryService = new InventoryService();
export default inventoryService;
