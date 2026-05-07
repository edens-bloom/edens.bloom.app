import { create } from 'zustand';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface BloomState {
  cart: CartItem[];
  wishlist: number[]; // Product IDs
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useStore = create<BloomState>((set, get) => ({
  cart: [],
  wishlist: [],
  
  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  toggleWishlist: (productId) => {
    set((state) => ({
      wishlist: state.wishlist.includes(productId)
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId],
    }));
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
}));
