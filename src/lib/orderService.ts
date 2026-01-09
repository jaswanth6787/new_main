/**
 * Service for handling order operations with MongoDB backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface OrderData {
  fullName: string;
  phone: string;
  periodsStarted: string | Date;
  cycleLength: number;
  phase: string;
  totalQuantity: number;
  totalWeight: number;
  totalPrice: number;
  address: {
    house: string;
    area: string;
    landmark?: string;
    pincode: string;
    mapLink?: string;
    label?: string;
  };
  paymentMethod: string;
  message: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Submit order to MongoDB backend
 */
export const submitOrder = async (orderData: OrderData): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit order');
    }

    return data;
  } catch (error) {
    console.error('Error submitting order to database:', error);
    return {
      success: false,
      message: 'Failed to submit order',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get orders by phone number
 */
export const getOrdersByPhone = async (phone: string): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }

    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update order status');
    }

    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      message: 'Failed to update order status',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

