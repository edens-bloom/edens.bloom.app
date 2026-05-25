import { create } from "zustand";
import { produce, type Draft } from "immer";
import type {
  CartItem,
  BloomState,
  Product,
  SelectedProduct,
} from "../models/types";
import { productService, authService } from "../services";
import calculatePrice from "../utils/calculatePrice";

export const useStore = create<BloomState>((set, get) => {
  const setDraft = (fn: (draft: Draft<BloomState>) => void) => set(produce(fn));

  return {
    products: [],
    selectedProduct: {} as SelectedProduct,
    cart: JSON.parse(localStorage.getItem("bloom_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("bloom_wishlist") || "[]"),
    user: JSON.parse(localStorage.getItem("bloom_user") || "null"),
    token: localStorage.getItem("bloom_token"),
    isLoading: false,
    error: null,

    setSelectedProduct: (product: SelectedProduct) =>
      setDraft((state) => {
        state.selectedProduct = product;
      }),

    updateSelectedProduct: (product: SelectedProduct) => {
      setDraft((state) => {
        state.selectedProduct = product;
      });
    },

    fetchProducts: async () => {
      setDraft((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        const response = await productService.fetchAll();
        setDraft((state) => {
          state.products = response;
          state.isLoading = false;
        });
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch products";
        setDraft((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
      }
    },

    // No longer needed but kept for interface compatibility
    fetchCart: async () => {},

    fetchProductById: async (id: number, isSelected?: boolean) => {
      const existing = get().products.find(
        (p: Product) => p.id === id,
      ) as Product;
      if (existing && isSelected && Object.hasOwn(existing, "addOns")) {
        setDraft((state) => {
          if (isSelected) {
            state.selectedProduct = calculatePrice({
              ...existing,
              quantity: 1,
              selectedAddOnId: null,
              selectedAddOnPrice: 0,
              selectedImageUrl: existing.imageUrl,
            });
          }
        });
        return;
      }
      setDraft((state) => {
        state.isLoading = true;
        state.error = null;
      });
      if (!Object.hasOwn(existing, "addOns")) {
        try {
          const response = await productService.fetchById(id);

          setDraft((state) => {
            const index = state.products.findIndex((p: Product) => p.id === id);
            if (index !== -1) {
              if (!state.products[index].addOns && response.addOns) {
                state.products[index].addOns = response.addOns || [];
              }
            }
            state.isLoading = false;
            if (isSelected) {
              state.selectedProduct = calculatePrice({
                ...response,
                quantity: 1,
                selectedAddOnId: null,
                selectedAddOnPrice: 0,
                selectedImageUrl: response.imageUrl,
              });
            }
          });
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch product";

          setDraft((state) => {
            state.error = errorMessage;
            state.isLoading = false;
          });
        }
      }
    },

    addToCart: async (product: Product, quantity: number = 1) => {
      const qty = Math.max(1, Math.floor(Number(quantity) || 1));
      setDraft((state) => {
        const existing = state.cart.find(
          (item: CartItem) =>
            item.id === product.id && item.price === product.price,
        );
        if (existing) {
          Object.assign(existing, product);
          existing.quantity += qty;
        } else {
          state.cart.push({ ...product, quantity: qty });
        }
        saveCart(state.cart);
      });
    },

    removeFromCart: async (productId: number) => {
      setDraft((state) => {
        state.cart = state.cart.filter(
          (item: CartItem) => item.id !== productId,
        );
        saveCart(state.cart);
      });
    },

    updateCart: (cart: CartItem) => {
      setDraft((state) => {
        const index = state.cart.findIndex(
          (item: CartItem) => item.id === cart.id,
        );
        if (index !== -1) {
          state.cart[index] = cart;
        }
        state.cart = state.cart.filter((item: CartItem) => item.quantity > 0);
        saveCart(state.cart);
      });
    },

    updateQuantity: async (productId: number, quantity: number) => {
      setDraft((state) => {
        const existing = state.cart.find(
          (item: CartItem) => item.id === productId,
        );
        if (existing) {
          existing.quantity = Math.max(0, quantity);
        }
        state.cart = state.cart.filter((item: CartItem) => item.quantity > 0);
        saveCart(state.cart);
      });
    },

    clearCart: async () => {
      saveCart([]);
      setDraft((state) => {
        state.cart = [];
      });
    },

    toggleWishlist: (productId: number) => {
      setDraft((state) => {
        const index = state.wishlist.indexOf(productId);
        if (index !== -1) {
          state.wishlist.splice(index, 1);
        } else {
          state.wishlist.push(productId);
        }
        localStorage.setItem("bloom_wishlist", JSON.stringify(state.wishlist));
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
      setDraft((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        const response = await authService.login(username, password);

        const {
          token,
          data: { user },
        } = response;

        localStorage.setItem("bloom_token", token);
        localStorage.setItem("bloom_user", JSON.stringify(user));

        setDraft((state) => {
          state.user = user;
          state.token = token;
          state.isLoading = false;
        });
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setDraft((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        return false;
      }
    },

    logout: () => {
      localStorage.removeItem("bloom_token");
      localStorage.removeItem("bloom_user");
      setDraft((state) => {
        state.user = null;
        state.token = null;
      });
    },

    addProduct: async (productData: Product) => {
      setDraft((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        const response = await productService.create(productData);
        const newProduct = response.data?.product || response;

        setDraft((state) => {
          state.products.push(newProduct);
          state.isLoading = false;
        });
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add product";
        setDraft((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        return false;
      }
    },

    updateProduct: async (id: number, productData: Partial<Product>) => {
      setDraft((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        const response = await productService.update(id, productData);
        // Handle both { product: {...} } and direct product response
        const updatedProduct =
          response.data?.product || response.data || response;
        setDraft((state) => {
          const index = state.products.findIndex((p: Product) => p.id === id);
          if (index !== -1) {
            Object.assign(state.products[index], updatedProduct);
          }
          state.isLoading = false;
        });
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update product";
        setDraft((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        return false;
      }
    },

    deleteProduct: async (id: number) => {
      setDraft((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        await productService.delete(id);

        setDraft((state) => {
          state.products = state.products.filter((p: Product) => p.id !== id);
          state.isLoading = false;
        });
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete product";
        setDraft((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        return false;
      }
    },
  };
});

// Helper to save cart to localStorage
const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("bloom_cart", JSON.stringify(cart));
};
