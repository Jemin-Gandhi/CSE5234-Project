// AWS API Gateway configuration - Hardcoded
const API_BASE_URL = 'https://bbxc8iwzfk.execute-api.us-east-2.amazonaws.com';
const ORDER_PATH = '/order-processing/order';

class OrderService {
  /**
   * Submit an order to AWS Lambda via API Gateway
   * @param {Object} orderData - Order data with items, payment, and shipping
   * @returns {Promise<Object>} Order confirmation with confirmation number
   */
  async submitOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}${ORDER_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Unknown error occurred' };
        }
        
        // Handle specific error codes
        if (response.status === 409) {
          // Insufficient inventory
          throw new Error(JSON.stringify({
            type: 'INSUFFICIENT_INVENTORY',
            message: errorData.error || 'Insufficient inventory',
            items: errorData.items || []
          }));
        } else if (response.status === 400) {
          // Validation error
          throw new Error(JSON.stringify({
            type: 'VALIDATION_ERROR',
            message: errorData.error || 'Invalid order data'
          }));
        } else if (response.status === 404) {
          // Item not found
          throw new Error(JSON.stringify({
            type: 'NOT_FOUND',
            message: errorData.error || 'One or more items not found'
          }));
        } else if (response.status === 502) {
          // Service error
          throw new Error(JSON.stringify({
            type: 'SERVICE_ERROR',
            message: 'Unable to process order. Please try again later.'
          }));
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const orderService = new OrderService();
export default orderService;
