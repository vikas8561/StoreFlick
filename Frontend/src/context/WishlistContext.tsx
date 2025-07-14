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

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  totalItems: number;
  clearWishlist: () => void;
}

// ---------- CONTEXT ----------
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
export const useWishlist = () => {
  const c = useContext(WishlistContext);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
};

// ---------- HELPERS ----------
const getLocalWishlist = (): Product[] => {
  try {
    const stored = localStorage.getItem("wishlistItems");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalWishlist = (items: Product[]) => {
  localStorage.setItem("wishlistItems", JSON.stringify(items));
};

const clearLocalWishlist = () => {
  localStorage.removeItem("wishlistItems");
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
export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
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

  // Initialize wishlist on mount
  useEffect(() => {
    if (initialized) return;
    
    const initializeWishlist = async () => {
      const userId = getUserId();
      const localItems = getLocalWishlist();
      console.log("🚀 Initializing wishlist. User logged in:", !!userId, "Local items:", localItems.length);
      
      if (userId) {
        // User is logged in, try to load from backend
        try {
          const response = await axios.get(`/api/wishlist/${userId}`);
          const dbItems = response.data.wishlistItems || [];
          console.log("📥 Backend wishlist items:", dbItems.length);
          
          if (dbItems.length > 0) {
            // If we have local items, merge them
            if (localItems.length > 0) {
              console.log("🔄 Merging local and backend items during init...");
              const mergedItems = mergeWishlists(localItems, dbItems);
              setWishlistItems(mergedItems);
              // Save merged items to backend
              await axios.post("/api/wishlist", {
                userId,
                wishlistItems: mergedItems,
              });
              console.log("✅ Merged and saved to backend:", mergedItems.length, "items");
            } else {
              setWishlistItems(dbItems);
              console.log("✅ Using backend items:", dbItems.length, "items");
            }
          } else if (localItems.length > 0) {
            // No backend items, but we have local items
            setWishlistItems(localItems);
            // Save local items to backend
            await axios.post("/api/wishlist", {
              userId,
              wishlistItems: localItems,
            });
            console.log("✅ Saved local items to backend:", localItems.length, "items");
          }
        } catch (error) {
          console.log("❌ Backend load failed, using localStorage:", error);
          setWishlistItems(localItems);
        }
      } else {
        // Not logged in, use local items
        setWishlistItems(localItems);
        console.log("✅ Using local items (not logged in):", localItems.length, "items");
      }
      
      setInitialized(true);
    };

    initializeWishlist();
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
        const localItems = getLocalWishlist();
        console.log("📦 Local wishlist items:", localItems.length);
        
        if (localItems.length > 0) {
          // Merge local wishlist with backend
          try {
            console.log("🔄 Merging local wishlist with backend...");
            const response = await axios.post("/api/wishlist/merge", {
              userId,
              localWishlistItems: localItems,
            });
            const mergedItems = response.data.wishlistItems;
            console.log("✅ Wishlist merged successfully:", mergedItems.length, "items");
            setWishlistItems(mergedItems);
            clearLocalWishlist(); // Clear local storage after merge
          } catch (error) {
            console.error("❌ Failed to merge wishlist:", error);
            // Keep local items if merge fails
            setWishlistItems(localItems);
          }
        } else {
          // No local items, try to load from backend
          try {
            console.log("📥 Loading wishlist from backend...");
            const response = await axios.get(`/api/wishlist/${userId}`);
            const dbItems = response.data.wishlistItems || [];
            console.log("✅ Loaded wishlist from backend:", dbItems.length, "items");
            setWishlistItems(dbItems);
          } catch (error) {
            console.error("❌ Failed to load wishlist from backend:", error);
          }
        }
      } else {
        // User logged out, clear wishlist
        console.log("🚪 User logged out, clearing wishlist");
        setWishlistItems([]);
        clearLocalWishlist();
      }
    };

    // Check immediately
    handleAuthChange();
    
    // Set up interval to monitor auth changes
    const interval = setInterval(handleAuthChange, 1000);
    
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Save wishlist changes
  useEffect(() => {
    if (!initialized) return;

    const userId = getUserId();
    console.log("💾 Saving wishlist changes. Items:", wishlistItems.length, "User logged in:", !!userId);
    
    if (userId) {
      // Save to backend for logged-in users
      const saveToBackend = async () => {
        try {
          await axios.post("/api/wishlist", {
            userId,
            wishlistItems: wishlistItems,
          });
          console.log("✅ Wishlist saved to backend successfully");
        } catch (error) {
          console.error("❌ Failed to save wishlist to backend:", error);
          // Fallback to localStorage if backend fails
          saveLocalWishlist(wishlistItems);
          console.log("💾 Fallback: Saved to localStorage");
        }
      };
      saveToBackend();
    } else {
      // Save to localStorage for non-logged users
      saveLocalWishlist(wishlistItems);
      console.log("💾 Saved to localStorage (not logged in)");
    }
  }, [wishlistItems, initialized]);

  // Merge wishlists helper function
  const mergeWishlists = (localItems: Product[], dbItems: Product[]): Product[] => {
    const map = new Map();

    // Add DB items first
    dbItems.forEach(item => {
      map.set(item.id, item);
    });

    // Add local items (will overwrite if duplicate)
    localItems.forEach(item => {
      map.set(item.id, item);
    });

    return Array.from(map.values());
  };

  // Wishlist operations
  const toggleWishlist = async (product: Product) => {
    console.log("🔄 Toggling wishlist for:", product.title);
    const userId = getUserId();
    setWishlistItems((current) => {
      const exists = current.find(item => item.id === product.id);
      let updated;
      if (exists) {
        console.log("🗑️ Removing from wishlist:", product.title);
        updated = current.filter(item => item.id !== product.id);
      } else {
        console.log("➕ Adding to wishlist:", product.title);
        updated = [...current, product];
      }
      // Immediately update backend/localStorage
      if (userId) {
        axios.post("/api/wishlist", { userId, wishlistItems: updated })
          .then(() => console.log("✅ Wishlist updated in backend"))
          .catch((error) => {
            console.error("❌ Failed to update wishlist in backend:", error);
            saveLocalWishlist(updated);
            console.log("💾 Fallback: Saved to localStorage");
          });
      } else {
        saveLocalWishlist(updated);
        console.log("💾 Saved to localStorage (not logged in)");
      }
      return updated;
    });
  };

  const removeFromWishlist = async (id: number) => {
    console.log("🗑️ Removing from wishlist, item ID:", id);
    const userId = getUserId();
    setWishlistItems((current) => {
      const updated = current.filter(item => item.id !== id);
      // Immediately update backend/localStorage
      if (userId) {
        axios.post("/api/wishlist", { userId, wishlistItems: updated })
          .then(() => console.log("✅ Wishlist updated in backend"))
          .catch((error) => {
            console.error("❌ Failed to update wishlist in backend:", error);
            saveLocalWishlist(updated);
            console.log("💾 Fallback: Saved to localStorage");
          });
      } else {
        saveLocalWishlist(updated);
        console.log("💾 Saved to localStorage (not logged in)");
      }
      return updated;
    });
  };

  const isInWishlist = (id: number) => {
    return wishlistItems.some(item => item.id === id);
  };

  const clearWishlist = async () => {
    console.log("🧹 Clearing entire wishlist");
    const userId = getUserId();
    setWishlistItems([]);
    if (userId) {
      axios.post("/api/wishlist", { userId, wishlistItems: [] })
        .then(() => console.log("✅ Wishlist cleared in backend"))
        .catch((error) => {
          console.error("❌ Failed to clear wishlist in backend:", error);
          saveLocalWishlist([]);
          console.log("💾 Fallback: Cleared in localStorage");
        });
    } else {
      saveLocalWishlist([]);
      console.log("💾 Cleared in localStorage (not logged in)");
    }
  };

  const totalItems = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        totalItems,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}; 