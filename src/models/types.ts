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
  price?: number;
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

export interface CartItem extends SelectedProduct {
  subTotal: number;
}

export interface SelectedProduct extends Product {
  selectedAddOnId: number | null;
  selectedAddOnPrice: number;
  selectedImageUrl: string;
  subTotal: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
}

export interface User {
  id?: number;
  userName?: string;
  name?: string;
  email?: string;
  role?: "admin" | "user";
  phoneNumber?: string;
  address?: string;
}

export interface BloomState {
  products: Product[];
  cart: CartState;
  wishlist: number[];
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  selectedProduct: SelectedProduct;
  loading: { fetchById: boolean };
  setSelectedProduct: (product: SelectedProduct) => void;
  fetchProducts: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (product: SelectedProduct) => Promise<void>;
  removeFromCart: (item: CartItem) => void;
  // updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: SelectedProduct) => Promise<boolean>;
  updateProduct: (
    id: number,
    productData: Partial<Product>,
  ) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  fetchProductById: (id: number, isSelected?: boolean) => Promise<void>;
  updateSelectedProduct: (product: SelectedProduct) => void;
  updateCart: (item: SelectedProduct) => void;
  updateUser: (user: Partial<User>) => void;
}
