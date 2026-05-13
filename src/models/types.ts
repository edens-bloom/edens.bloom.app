export interface ProductPackageTier {
  [key: string]: string | number | undefined;
}

export interface ProductPackages {
  tier1?: ProductPackageTier;
  tier2?: ProductPackageTier;
  tier3?: ProductPackageTier;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  plasticBagImage?: string;
  plasticBagTitle?: string;
  plasticBagPrice?: number;
  paperBagImage?: string;
  paperBagTitle?: string;
  paperBagPrice?: number;
  noBagImage?: string;
  noBagTitle?: string;
  noBagPrice?: number;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  icon?: string;
  packages?: ProductPackages;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
}

export interface BloomState {
  products: Product[];
  cart: CartItem[];
  wishlist: number[];
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Product) => Promise<boolean>;
}
