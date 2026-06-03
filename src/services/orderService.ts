import apiClient from "../api/apiClient";
import type { CartState, User } from "../models/types";

export interface OrderWithCustomer {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  created_at: string;
  customer_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  addon_id: number | null;
  buy_quantity: number;
  free_quantity: number;
  total_quantity: number;
  price_at_order: number;
  addon_price_at_order: number;
  subtotal: number;
  product_name: string;
  image_url: string;
  addon_label: string | null;
}

export interface OrderDetail extends OrderWithCustomer {
  items: OrderItem[];
}

const orderService = {
  orderConfirm: async (user: User | null, cart: CartState) => {
    if (!user?.phoneNumber) {
      throw new Error("A valid phone number is required to confirm the order.");
    }

    try {
      const response = await apiClient.post(`/orders`, {
        user: {
          name: user.name || null,
          email: user.email || null,
          phoneNumber: user.phoneNumber,
          address: user.address || null,
        },
        cart,
      });
      return response.data;
    } catch (err: unknown) {
      const error = new Error("Failed to confirm order") as Error & {
        cause?: unknown;
      };
      error.cause = err;
      throw error;
    }
  },

  fetchAllOrders: async () => {
    try {
      const response = await apiClient.get(`/orders`);
      return response.data;
    } catch (err: unknown) {
      throw new Error("Failed to fetch orders");
    }
  },

  fetchOrderById: async (id: number) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (err: unknown) {
      throw new Error("Failed to fetch order details");
    }
  },
};

export default orderService;
