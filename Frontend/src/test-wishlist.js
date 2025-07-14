// Test script for wishlist functionality
// Run this in browser console to test wishlist operations

const testWishlist = {
  // Test adding items to wishlist
  testAddToWishlist: () => {
    console.log("🧪 Testing add to wishlist...");
    const testProduct = {
      id: 999,
      title: "Test Product",
      price: 29.99,
      thumbnail: "https://via.placeholder.com/150"
    };
    
    // Simulate adding to wishlist
    localStorage.setItem("wishlistItems", JSON.stringify([testProduct]));
    console.log("✅ Test product added to localStorage");
    
    // Check if it's there
    const stored = localStorage.getItem("wishlistItems");
    console.log("📦 Stored wishlist:", stored);
  },
  
  // Test wishlist persistence
  testPersistence: () => {
    console.log("🧪 Testing wishlist persistence...");
    const stored = localStorage.getItem("wishlistItems");
    console.log("📦 Current wishlist in localStorage:", stored);
    
    const parsed = stored ? JSON.parse(stored) : [];
    console.log("📋 Parsed wishlist items:", parsed.length);
  },
  
  // Test wishlist clearing
  testClearWishlist: () => {
    console.log("🧪 Testing wishlist clearing...");
    localStorage.removeItem("wishlistItems");
    console.log("✅ Wishlist cleared from localStorage");
    
    const stored = localStorage.getItem("wishlistItems");
    console.log("📦 Wishlist after clearing:", stored);
  },
  
  // Test user authentication
  testAuth: () => {
    console.log("🧪 Testing authentication...");
    const user = localStorage.getItem("user");
    console.log("👤 Current user:", user);
    
    if (user) {
      const parsed = JSON.parse(user);
      console.log("🆔 User ID:", parsed._id);
    } else {
      console.log("❌ No user logged in");
    }
  },
  
  // Test toggle functionality
  testToggle: () => {
    console.log("🧪 Testing wishlist toggle...");
    const testProduct = {
      id: 888,
      title: "Toggle Test Product",
      price: 19.99,
      thumbnail: "https://via.placeholder.com/150"
    };
    
    // Simulate toggle behavior
    const stored = localStorage.getItem("wishlistItems");
    const currentItems = stored ? JSON.parse(stored) : [];
    
    const exists = currentItems.find(item => item.id === testProduct.id);
    if (exists) {
      // Remove if exists
      const newItems = currentItems.filter(item => item.id !== testProduct.id);
      localStorage.setItem("wishlistItems", JSON.stringify(newItems));
      console.log("🗑️ Removed from wishlist");
    } else {
      // Add if doesn't exist
      const newItems = [...currentItems, testProduct];
      localStorage.setItem("wishlistItems", JSON.stringify(newItems));
      console.log("➕ Added to wishlist");
    }
    
    const updated = localStorage.getItem("wishlistItems");
    console.log("📦 Updated wishlist:", updated);
  },
  
  // Run all tests
  runAll: () => {
    console.log("🚀 Running all wishlist tests...");
    this.testAuth();
    this.testPersistence();
    this.testAddToWishlist();
    this.testToggle();
    this.testToggle(); // Should remove it
    this.testPersistence();
    this.testClearWishlist();
    console.log("✅ All tests completed");
  }
};

// Make it available globally
window.testWishlist = testWishlist;

console.log("🧪 Wishlist test script loaded. Run testWishlist.runAll() to test everything."); 