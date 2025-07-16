import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

axios.defaults.baseURL = "https://storeflick.onrender.com";

// ---------- TYPES ----------
interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  totalItems: number;
  totalCost: number;
  clearCart: () => void;
}

// ---------- CONTEXT ----------
const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
};

// ---------- HELPERS ----------
const getLocalCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items: CartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const clearLocalCart = () => {
  localStorage.removeItem("cartItems");
};

const getUserId = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user)._id : null;
  } catch {
    return null;
  }
};

// ---------- PROVIDER ----------
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [initialized, setInitialized] = useState(false);

  // Check authentication status
  const checkAuthStatus = () => {
    const userId = getUserId();
    const newAuthStatus = !!userId;
    
    if (newAuthStatus !== isLoggedIn) {
      setIsLoggedIn(newAuthStatus);
      return true; // Auth status changed
    }
    return false; // No change
  };

  // Initialize cart on mount
  useEffect(() => {
    if (initialized) return;
    
    const initializeCart = async () => {
      const userId = getUserId();
      const localItems = getLocalCart();
      console.log("🚀 Initializing cart. User logged in:", !!userId, "Local items:", localItems.length);
      
      if (userId) {
        // User is logged in, try to load from backend
        try {
          const response = await axios.get(`/api/cart/${userId}`);
          const dbItems = response.data.cartItems || [];
          console.log("📥 Backend cart items:", dbItems.length);
          
          if (dbItems.length > 0) {
            // If we have local items, merge them
            if (localItems.length > 0) {
              console.log("🔄 Merging local and backend items during init...");
              const mergedItems = mergeCarts(localItems, dbItems);
              setCartItems(mergedItems);
              // Save merged items to backend
              await axios.post("/api/cart", {
                userId,
                cartItems: mergedItems,
              });
              console.log("✅ Merged and saved to backend:", mergedItems.length, "items");
            } else {
              setCartItems(dbItems);
              console.log("✅ Using backend items:", dbItems.length, "items");
            }
          } else if (localItems.length > 0) {
            // No backend items, but we have local items
            setCartItems(localItems);
            // Save local items to backend
            await axios.post("/api/cart", {
              userId,
              cartItems: localItems,
            });
            console.log("✅ Saved local items to backend:", localItems.length, "items");
          }
        } catch (error) {
          console.log("❌ Backend load failed, using localStorage:", error);
          setCartItems(localItems);
        }
      } else {
        // Not logged in, use local items
        setCartItems(localItems);
        console.log("✅ Using local items (not logged in):", localItems.length, "items");
      }
      
      setInitialized(true);
    };

    initializeCart();
  }, [initialized]);

  // Monitor authentication changes
  useEffect(() => {
    const handleAuthChange = async () => {
      const authChanged = checkAuthStatus();
      
      if (!authChanged) return;
      
      const userId = getUserId();
      console.log("🔄 Auth status changed. User logged in:", !!userId);
      
      if (userId) {
        // User logged in
        const localItems = getLocalCart();
        console.log("📦 Local cart items:", localItems.length);
        
        if (localItems.length > 0) {
          // Merge local cart with backend
          try {
            console.log("🔄 Merging local cart with backend...");
            const response = await axios.post("/api/cart/merge", {
              userId,
              localCartItems: localItems,
            });
            const mergedItems = response.data.cartItems;
            console.log("✅ Cart merged successfully:", mergedItems.length, "items");
            setCartItems(mergedItems);
            clearLocalCart(); // Clear local storage after merge
          } catch (error) {
            console.error("❌ Failed to merge cart:", error);
            // Keep local items if merge fails
            setCartItems(localItems);
          }
        } else {
          // No local items, try to load from backend
          try {
            console.log("📥 Loading cart from backend...");
            const response = await axios.get(`/api/cart/${userId}`);
            const dbItems = response.data.cartItems || [];
            console.log("✅ Loaded cart from backend:", dbItems.length, "items");
            setCartItems(dbItems);
          } catch (error) {
            console.error("❌ Failed to load cart from backend:", error);
          }
        }
      } else {
        // User logged out, clear cart
        console.log("🚪 User logged out, clearing cart");
        setCartItems([]);
        clearLocalCart();
      }
    };

    // Check immediately
    handleAuthChange();
    
    // Set up interval to monitor auth changes
    const interval = setInterval(handleAuthChange, 1000);
    
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Save cart changes
  useEffect(() => {
    if (!initialized) return;

    const userId = getUserId();
    console.log("💾 Saving cart changes. Items:", cartItems.length, "User logged in:", !!userId);
    
    if (userId) {
      // Save to backend for logged-in users
      const saveToBackend = async () => {
        try {
          await axios.post("/api/cart", {
            userId,
            cartItems: cartItems,
          });
          console.log("✅ Cart saved to backend successfully");
        } catch (error) {
          console.error("❌ Failed to save cart to backend:", error);
          // Fallback to localStorage if backend fails
          saveLocalCart(cartItems);
          console.log("💾 Fallback: Saved to localStorage");
        }
      };
      saveToBackend();
    } else {
      // Save to localStorage for non-logged users
      saveLocalCart(cartItems);
      console.log("💾 Saved to localStorage (not logged in)");
    }
  }, [cartItems, initialized]);

  // Merge carts helper function
  const mergeCarts = (localItems: CartItem[], dbItems: CartItem[]): CartItem[] => {
    const map = new Map();

    [...dbItems, ...localItems].forEach((item) => {
      if (map.has(item.id)) {
        const existing = map.get(item.id);
        map.set(item.id, {
          ...item,
          quantity: existing.quantity + item.quantity,
        });
      } else {
        map.set(item.id, item);
      }
    });

    return Array.from(map.values());
  };

  // Cart operations
  const addToCart = (product: Product) => {
    console.log("➕ Adding to cart:", product.title);
    setCartItems((current) => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        console.log("📈 Increasing quantity for:", product.title);
        return current.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      console.log("🆕 Adding new item:", product.title);
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    console.log("🗑️ Removing from cart, item ID:", id);
    setCartItems((current) => 
      current.filter(item => item.id !== id)
    );
  };

  const increaseQuantity = (id: number) => {
    console.log("📈 Increasing quantity for item ID:", id);
    setCartItems((current) =>
      current.map(item =>
        item.id === id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    console.log("📉 Decreasing quantity for item ID:", id);
    setCartItems((current) =>
      current
        .map(item =>
          item.id === id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    console.log("🧹 Clearing entire cart");
    setCartItems([]);
    clearLocalCart();
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        totalItems,
        totalCost,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
