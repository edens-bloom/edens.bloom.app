import { create } from "zustand";
import type { CartItem, BloomState, Product } from "../models/types";
import { productService, authService } from "../services";

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
      const response = await productService.fetchAll();
      set({ products: response, isLoading: false });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // No longer needed but kept for interface compatibility
  fetchCart: async () => {},

  addToCart: async (product: Product, quantity: number = 1) => {
    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, ...product, quantity: item.quantity + qty }
            : item,
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: qty }];
      }
      saveCart(newCart);
      return { cart: newCart };
    });
  },

  removeFromCart: async (productId: number) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== productId);
      saveCart(newCart);
      return { cart: newCart };
    });
  },

  updateQuantity: async (productId: number, quantity: number) => {
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

  toggleWishlist: (productId: number) => {
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

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(username, password);

      const {
        token,
        data: { user },
      } = response;

      localStorage.setItem("bloom_token", token);
      localStorage.setItem("bloom_user", JSON.stringify(user));

      set({ user, token, isLoading: false });
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      set({
        error: errorMessage,
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

  addProduct: async (productData: Product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.create(productData);
      const newProduct = response.data?.product || response;

      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add product";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  updateProduct: async (id: number, productData: Partial<Product>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.update(id, productData);
      // Handle both { product: {...} } and direct product response
      const updatedProduct =
        response.data?.product || response.data || response;
      console.log("LOGGING", id, updatedProduct);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updatedProduct } : p,
        ),
        isLoading: false,
      }));
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  deleteProduct: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await productService.delete(id);

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete product";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },
}));

// Helper to save cart to localStorage
const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("bloom_cart", JSON.stringify(cart));
};
