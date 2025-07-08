import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
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
}

// ---------- CONTEXT ----------
const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
};

// ---------- HELPERS ----------
const getInitialCart = (): CartItem[] => {
  try {
    const s = localStorage.getItem("cartItems");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const sanitizeCartItems = (items: CartItem[]) =>
  items.map(({ id, title, price, thumbnail, quantity }) => ({
    id,
    title,
    price,
    thumbnail,
    quantity,
  }));

const areCartsDifferent = (a: CartItem[], b: CartItem[]) => {
  if (a.length !== b.length) return true;
  const map = new Map<number, CartItem>();
  a.forEach((item) => map.set(item.id, item));
  for (const item of b) {
    const match = map.get(item.id);
    if (!match || match.quantity !== item.quantity) return true;
  }
  return false;
};

// ---------- PROVIDER ----------
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [synced, setSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSyncingRef = useRef(false);
  const initializedRef = useRef(false);

  const getUserId = () =>
    JSON.parse(localStorage.getItem("user") || "null")?._id || null;

  const [userId, setUserId] = useState<string | null>(null);

  // On initial mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const currentUserId = getUserId();
    if (currentUserId) {
      setUserId(currentUserId);
      setSynced(false);
    } else {
      const stored = getInitialCart();
      setCartItems(stored);
      setSynced(true);
    }
  }, []);

  // Detect login/logout
  useEffect(() => {
    const interval = setInterval(() => {
      const currentUserId = getUserId();

      if (!currentUserId && userId) {
        // Logout
        setCartItems([]);
        localStorage.removeItem("cartItems");
        setUserId(null);
        setSynced(false);
        setIsLoading(false);
        isSyncingRef.current = false;
      } else if (currentUserId && currentUserId !== userId) {
        // Login or switch
        setUserId(currentUserId);
        setSynced(false);
        setIsLoading(false);
        isSyncingRef.current = false;
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userId]);

  // Sync cart after login
  useEffect(() => {
    if (!userId || synced || isLoading || isSyncingRef.current) return;

    const syncCart = async () => {
      try {
        isSyncingRef.current = true;
        setIsLoading(true);

        const localCart = getInitialCart();
        const res = await axios.get(`/api/cart/${userId}`);
        const dbCart: CartItem[] = res.data?.cartItems || [];

        const mergedMap = new Map<number, CartItem>();
        dbCart.forEach((item) => mergedMap.set(item.id, { ...item }));

        localCart.forEach((item) => {
          if (mergedMap.has(item.id)) {
            const existing = mergedMap.get(item.id)!;
            mergedMap.set(item.id, {
              ...existing,
              quantity: existing.quantity + item.quantity,
            });
          } else {
            mergedMap.set(item.id, { ...item });
          }
        });

        const mergedCart = Array.from(mergedMap.values());

        const shouldUpdate =
          localCart.length > 0 && areCartsDifferent(mergedCart, dbCart);

        if (shouldUpdate) {
          await axios.post("/api/cart", {
            userId,
            cartItems: sanitizeCartItems(mergedCart),
          });
        }

        localStorage.removeItem("cartItems");
        setCartItems(mergedCart);
        setSynced(true);
      } catch (err) {
        console.error("❌ Cart sync failed:", err);
        const fallback = getInitialCart();
        setCartItems(fallback);
        setSynced(true);
      } finally {
        isSyncingRef.current = false;
        setIsLoading(false);
      }
    };

    syncCart();
  }, [userId, synced, isLoading]);

  // Auto-save
  useEffect(() => {
    if (isSyncingRef.current || isLoading) return;

    if (!userId || !synced) {
      if (!userId) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }
      return;
    }

    const saveToBackend = async () => {
      try {
        await axios.post("/api/cart", {
          userId,
          cartItems: sanitizeCartItems(cartItems),
        });
      } catch (err) {
        console.error("❌ Auto-save failed:", err);
      }
    };

    saveToBackend();
  }, [cartItems, userId, synced, isLoading]);

  // Cart Operations
  const addToCart = (p: Product) => {
    if (isSyncingRef.current) return;
    setCartItems((curr) => {
      const existing = curr.find((c) => c.id === p.id);
      if (existing) {
        return curr.map((c) =>
          c.id === p.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...curr, { ...p, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    if (isSyncingRef.current) return;
    setCartItems((curr) => curr.filter((c) => c.id !== id));
  };

  const increaseQuantity = (id: number) => {
    if (isSyncingRef.current) return;
    setCartItems((curr) =>
      curr.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    if (isSyncingRef.current) return;
    setCartItems((curr) =>
      curr
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalCost = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
