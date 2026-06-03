import { create } from "zustand";
import { produce, type Draft } from "immer";
import type {
  CartState,
  BloomState,
  Product,
  SelectedProduct,
  User,
  CartItem,
} from "../models/types";
import { productService, authService } from "../services";
import calculatePrice from "../utils/calculatePrice";
import orderService from "../services/orderService";

// Initialize empty cart state
const initializeCart = (): CartState => ({
  items: [],
  subTotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  shippingFee: 0,
  totalAmount: 0,
});

const getSelectedProductSubTotal = (product: SelectedProduct): number => {
  const pricedProduct = calculatePrice(product);
  return pricedProduct.subTotal ?? 0;
};

// const loadCart = (): CartState => {
//   const raw = localStorage.getItem("bloom_cart");
//   if (!raw) return initializeCart();

//   try {
//     const parsed = JSON.parse(raw);

//     if (Array.isArray(parsed)) {
//       const items = parsed.map((product: SelectedProduct) => ({
//         item: calculatePrice(product),
//         quantity: product.quantity,
//         subtotal: getSelectedProductSubTotal(product),
//       }));
//       const subtotal = items.reduce(
//         (sum, item) => sum + (item.subtotal || 0),
//         0,
//       );
//       return {
//         items,
//         subtotal,
//         tax_amount: 0,
//         discount_amount: 0,
//         shipping_fee: 0,
//         total_amount: subtotal,
//       };
//     }

//     const parsedItems = (parsed.items || []) as Array<{
//       item: SelectedProduct;
//       quantity?: number;
//       subtotal?: number;
//     }>;
//     const items = parsedItems.map((entry) => ({
//       item: calculatePrice(entry.item),
//       quantity: Number(entry.quantity || 0),
//       subtotal: Number(entry.subtotal || 0),
//     }));

//     return {
//       items,
//       subtotal: Number(parsed.subtotal || 0),
//       tax_amount: Number(parsed.tax_amount || 0),
//       discount_amount: Number(parsed.discount_amount || 0),
//       shipping_fee: Number(parsed.shipping_fee || 0),
//       total_amount: Number(parsed.total_amount || 0),
//     };
//   } catch {
//     return initializeCart();
//   }
// };

export const useStore = create<BloomState>((set, get) => {
  const setDraft = (fn: (draft: Draft<BloomState>) => void) => set(produce(fn));

  return {
    products: [],
    selectedProduct: {} as SelectedProduct,
    cart: JSON.parse(
      localStorage.getItem("bloom_cart") || JSON.stringify(initializeCart()),
    ) as CartState,
    wishlist: JSON.parse(localStorage.getItem("bloom_wishlist") || "[]"),
    user: JSON.parse(localStorage.getItem("bloom_user") || "null"),
    token: localStorage.getItem("bloom_token"),
    isLoading: false,
    loading: { fetchById: false },
    error: null,
    orders: [],

    setSelectedProduct: (product: SelectedProduct) =>
      setDraft((state) => {
        state.selectedProduct = product;
      }),

    updateSelectedProduct: (product: SelectedProduct) => {
      setDraft((state) => {
        state.selectedProduct = product;
      });
    },

    onConfirm: async () => {
      const { user, cart } = get();
      if (!user || !user.phoneNumber) {
        throw new Error(
          "Please provide valid contact details before confirming the order.",
        );
      }
      const order = await orderService.orderConfirm(user, cart);
      setDraft((state) => {
        state.orders.unshift(order);
      });
      return order;
    },

    fetchOrders: async () => {
      setDraft((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await orderService.fetchAllOrders();
        const orders =
          response?.data?.orders ||
          response?.orders ||
          response?.data ||
          response ||
          [];

        setDraft((state) => {
          state.orders = Array.isArray(orders) ? orders : [];
          state.isLoading = false;
        });
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch orders";
        setDraft((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
      }
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
              subTotal: existing.price,
            });
          }
        });
        return;
      }

      if (!Object.hasOwn(existing, "addOns")) {
        setDraft((state) => {
          state.loading.fetchById = true;
        });
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
            state.loading.fetchById = false;
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
            state.loading.fetchById = false;
          });
        }
      }
    },

    addToCart: async (product: SelectedProduct) => {
      setDraft((state) => {
        const index = state.cart?.items?.findIndex(
          (item: SelectedProduct) =>
            item.id === product.id &&
            item.price === product.price &&
            item.selectedAddOnId === product.selectedAddOnId,
        );
        if (index !== -1) {
          const existingItem = state.cart.items[index];
          existingItem.quantity += product.quantity;
        } else {
          state.cart.items.push({ ...calculatePrice(product) });
        }
        updateCartTotals(state.cart);
        saveCart(state.cart);
      });
    },

    removeFromCart: async (cartItem: CartItem) => {
      setDraft((state) => {
        const index = state.cart?.items?.findIndex(
          (item: CartItem) =>
            item.id === cartItem.id &&
            item.price === cartItem.price &&
            item.selectedAddOnId === cartItem.selectedAddOnId,
        );
        if (index !== -1) state.cart.items.splice(index, 1);
        updateCartTotals(state.cart);
        saveCart(state.cart);
      });
    },

    updateCart: (cart: SelectedProduct) => {
      setDraft((state) => {
        const index = state.cart?.items?.findIndex(
          (item: CartItem) =>
            item.id === cart.id &&
            item.price === cart.price &&
            item.selectedAddOnId === cart.selectedAddOnId,
        );
        if (index !== -1) {
          const updatedItem = calculatePrice(cart);
          state.cart.items[index] = updatedItem;
          getSelectedProductSubTotal(updatedItem);
        }
        updateCartTotals(state.cart);
        saveCart(state.cart);
      });
    },

    // updateQuantity: async (productId: number, quantity: number) => {
    //   setDraft((state) => {
    //     const existing = state.cart.items.find(
    //       (item: CartItemData) => item.item.id === productId,
    //     );
    //     if (existing) {
    //       existing.quantity = Math.max(0, quantity);
    //       existing.item = calculatePrice({
    //         ...existing.item,
    //         quantity: existing.quantity,
    //       });
    //       existing.subtotal = getSelectedProductSubTotal(existing.item);
    //     }
    //     state.cart.items = state.cart.items.filter(
    //       (item: CartItemData) => item.quantity > 0,
    //     );
    //     updateCartTotals(state.cart);
    //     saveCart(state.cart);
    //   });
    // },

    clearCart: async () => {
      const newCart = initializeCart();
      saveCart(newCart);
      setDraft((state) => {
        state.cart = newCart;
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
      return cart.totalAmount;
    },

    getCartCount: () => {
      const { cart } = get();
      return cart?.items?.reduce((count, item) => count + item.quantity, 0);
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

    updateUser: async (user: Partial<User>) => {
      setDraft((state) => {
        state.user = { ...state.user, ...user } as User;
      });
      saveUser(get().user);
    },
  };
});

// Helper to save cart to localStorage
const saveCart = (cart: CartState) => {
  localStorage.setItem("bloom_cart", JSON.stringify(cart));
};

// Helper to update cart totals
const updateCartTotals = (cart: CartState) => {
  cart.subTotal = cart.items.reduce(
    (sum, item) => sum + (item.subTotal || 0),
    0,
  );
  cart.totalAmount =
    cart.subTotal + cart.taxAmount + cart.shippingFee - cart.discountAmount;
};

const saveUser = (user: User | null) => {
  localStorage.setItem("bloom_user", JSON.stringify(user));
};
