export interface ProductPackageTier {
  id?: number | string;
  label?: string;
  price?: number | string;
  image?: string;
}

export interface ProductPackages {
  tier1?: ProductPackageTier;
  tier2?: ProductPackageTier;
  tier3?: ProductPackageTier;
}

export interface ProductAddon {
  id?: number;
  label?: string;
  price?: number | string;
  is_default?: boolean;
  image?: string;
  imageUrl: string;
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
  addOns?: ProductAddon[];
  inStock?: boolean;
  imageUrl: string;
}

export interface SelectedProduct extends Product {
  selectedAddOnId: number | null;
  selectedAddOnPrice: number;
  selectedImageUrl: string;
  subTotal?: number;
  quantity: number;
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
  selectedProduct: SelectedProduct;
  setSelectedProduct: (product: SelectedProduct) => void;
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
  updateProduct: (
    id: number,
    productData: Partial<Product>,
  ) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  fetchProductById: (id: number, isSelected?: boolean) => Promise<void>;
  updateSelectedProduct: (product: SelectedProduct) => void;
}
