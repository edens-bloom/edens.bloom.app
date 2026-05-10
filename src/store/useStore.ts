import { create } from "zustand";
import type { CartItem, BloomState } from "../models/types";
import apiClient from "../api/apiClient";

// Helper to save cart to localStorage
const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("bloom_cart", JSON.stringify(cart));
};

export const useStore = create<BloomState>((set, get) => ({
  products: [],
  cart: JSON.parse(localStorage.getItem("bloom_cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("bloom_wishlist") || "[]"),
  user: JSON.parse(localStorage.getItem("bloom_user") || "null"),
  token: localStorage.getItem("bloom_token"),
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/products");
      set({ products: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  // No longer needed but kept for interface compatibility
  fetchCart: async () => {},

  addToCart: async (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }
      saveCart(newCart);
      return { cart: newCart };
    });
  },

  removeFromCart: async (productId) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== productId);
      saveCart(newCart);
      return { cart: newCart };
    });
  },

  updateQuantity: async (productId, quantity) => {
    set((state) => {
      const newCart = state.cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0);
      saveCart(newCart);
      return { cart: newCart };
    });
  },

  clearCart: async () => {
    saveCart([]);
    set({ cart: [] });
  },

  toggleWishlist: (productId) => {
    set((state) => {
      const newWishlist = state.wishlist.includes(productId)
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId];
      localStorage.setItem("bloom_wishlist", JSON.stringify(newWishlist));
      return { wishlist: newWishlist };
    });
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
  },

  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      const {
        token,
        data: { user },
      } = response.data;

      localStorage.setItem("bloom_token", token);
      localStorage.setItem("bloom_user", JSON.stringify(user));

      set({ user, token, isLoading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("bloom_token");
    localStorage.removeItem("bloom_user");
    set({ user: null, token: null });
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/products", productData);
      const newProduct = response.data.data.product;

      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || err.message || "Failed to add product",
        isLoading: false,
      });
      return false;
    }
  },
}));
