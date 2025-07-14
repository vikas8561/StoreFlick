const Cart = require("../models/Cart.js");
const express = require("express");

// Merge carts by summing quantities
const mergeCarts = (localItems, dbItems) => {
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

const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("🔍 Getting cart for user:", userId);

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log("📭 No cart found, returning empty");
      return res.status(200).json({ cartItems: [] });
    }

    console.log("✅ Cart found with", cart.cartItems.length, "items");
    console.log("📦 Cart items:", cart.cartItems.map(item => `${item.title} (${item.quantity})`));
    return res.status(200).json({ cartItems: cart.cartItems });
  } catch (err) {
    console.error("❌ getCart failed:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCart = async (req, res) => {
  const { userId, cartItems } = req.body;

  if (!userId || !Array.isArray(cartItems)) {
    console.log("❌ Invalid input - userId:", !!userId, "cartItems array:", Array.isArray(cartItems));
    return res
      .status(400)
      .json({ message: "Invalid input: userId or cartItems missing/invalid" });
  }

  try {
    console.log("🛒 Updating cart for user:", userId);
    console.log("📦 Cart items:", cartItems.length);
    console.log("📋 Items:", cartItems.map(item => `${item.title} (${item.quantity})`));

    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Update existing cart
      cart.cartItems = cartItems;
      await cart.save();
      console.log("✅ Cart updated successfully");
    } else {
      // Create new cart
      cart = await Cart.create({ userId, cartItems });
      console.log("🆕 New cart created successfully");
    }

    return res.status(200).json({ 
      message: "Cart updated successfully", 
      cartItems: cart.cartItems 
    });
  } catch (err) {
    console.error("❌ Failed to update cart:", err);
    return res
      .status(500)
      .json({ message: "Failed to update cart", error: err.message });
  }
};

// Merge cart items (for login sync)
const mergeCart = async (req, res) => {
  const { userId, localCartItems } = req.body;

  if (!userId || !Array.isArray(localCartItems)) {
    console.log("❌ Invalid merge input - userId:", !!userId, "localCartItems array:", Array.isArray(localCartItems));
    return res
      .status(400)
      .json({ message: "Invalid input: userId or localCartItems missing/invalid" });
  }

  try {
    console.log("🔄 Merging cart for user:", userId);
    console.log("📦 Local items:", localCartItems.length);
    console.log("📋 Local items:", localCartItems.map(item => `${item.title} (${item.quantity})`));

    let cart = await Cart.findOne({ userId });
    const dbCartItems = cart ? cart.cartItems : [];
    
    console.log("🗄️ Database items:", dbCartItems.length);
    console.log("📋 Database items:", dbCartItems.map(item => `${item.title} (${item.quantity})`));

    // Merge local and DB items (sum quantities for duplicates)
    const mergedItems = mergeCarts(localCartItems, dbCartItems);
    
    console.log("🔗 Merged items:", mergedItems.length);
    console.log("📋 Merged items:", mergedItems.map(item => `${item.title} (${item.quantity})`));

    if (cart) {
      // Update existing cart
      cart.cartItems = mergedItems;
      await cart.save();
      console.log("✅ Cart merged and updated successfully");
    } else {
      // Create new cart
      cart = await Cart.create({ userId, cartItems: mergedItems });
      console.log("🆕 New cart created with merged items successfully");
    }

    return res.status(200).json({ 
      message: "Cart merged successfully", 
      cartItems: cart.cartItems 
    });
  } catch (err) {
    console.error("❌ Failed to merge cart:", err);
    return res
      .status(500)
      .json({ message: "Failed to merge cart", error: err.message });
  }
};

module.exports = {
  getCart,
  updateCart,
  mergeCart,
};
