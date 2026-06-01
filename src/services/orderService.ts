import apiClient from "../api/apiClient";
import type { CartState, User } from "../models/types";

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
};

export default orderService;
