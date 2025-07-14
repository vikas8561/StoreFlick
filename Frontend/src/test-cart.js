// Test script for cart functionality
// Run this in browser console to test cart operations

const testCart = {
  // Test adding items to cart
  testAddToCart: () => {
    console.log("🧪 Testing add to cart...");
    const testProduct = {
      id: 999,
      title: "Test Product",
      price: 29.99,
      thumbnail: "https://via.placeholder.com/150"
    };
    
    // Simulate adding to cart
    localStorage.setItem("cartItems", JSON.stringify([testProduct]));
    console.log("✅ Test product added to localStorage");
    
    // Check if it's there
    const stored = localStorage.getItem("cartItems");
    console.log("📦 Stored cart:", stored);
  },
  
  // Test cart persistence
  testPersistence: () => {
    console.log("🧪 Testing cart persistence...");
    const stored = localStorage.getItem("cartItems");
    console.log("📦 Current cart in localStorage:", stored);
    
    const parsed = stored ? JSON.parse(stored) : [];
    console.log("📋 Parsed cart items:", parsed.length);
  },
  
  // Test cart clearing
  testClearCart: () => {
    console.log("🧪 Testing cart clearing...");
    localStorage.removeItem("cartItems");
    console.log("✅ Cart cleared from localStorage");
    
    const stored = localStorage.getItem("cartItems");
    console.log("📦 Cart after clearing:", stored);
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
  
  // Run all tests
  runAll: () => {
    console.log("🚀 Running all cart tests...");
    this.testAuth();
    this.testPersistence();
    this.testAddToCart();
    this.testPersistence();
    this.testClearCart();
    console.log("✅ All tests completed");
  }
};

// Make it available globally
window.testCart = testCart;

console.log("🧪 Cart test script loaded. Run testCart.runAll() to test everything."); 