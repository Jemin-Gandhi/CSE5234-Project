import inventoryService from '../services/inventoryService';

// Cache for products to avoid repeated API calls
let productsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all products from the inventory service
 * @returns {Promise<Array>} Array of products
 */
export const getAllProducts = async () => {
  try {
    // Check if we have valid cached data
    if (productsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      return productsCache;
    }

    // Fetch from inventory service
    const products = await inventoryService.getAllItems();
    
    // Update cache
    productsCache = products;
    cacheTimestamp = Date.now();
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Get a specific product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export const getProductById = async (id) => {
  try {
    return await inventoryService.getItemById(id);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

/**
 * Search products by name
 * @param {string} name - Name to search for
 * @returns {Promise<Array>} Array of matching products
 */
export const searchProductsByName = async (name) => {
  try {
    return await inventoryService.getItemsByName(name);
  } catch (error) {
    console.error(`Error searching products by name "${name}":`, error);
    return [];
  }
};

// For backward compatibility, export a default function that returns all products
const getProducts = async () => {
  return await getAllProducts();
};

export default getProducts;