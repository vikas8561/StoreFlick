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
    console.log("🧪 [getCart] userId:", userId);

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log("🚫 No cart found, sending empty");
      return res.status(200).json({ cartItems: [] });
    }

    console.log("✅ Cart found:", cart.cartItems);
    return res.status(200).json({ cartItems: cart.cartItems });
  } catch (err) {
    console.error("❌ getCart failed:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateCart = async (req, res) => {
  const { userId, cartItems } = req.body;

  if (!userId || !Array.isArray(cartItems)) {
    return res
      .status(400)
      .json({ message: "Invalid input: userId or cartItems missing/invalid" });
  }

  try {
    console.log("🛒 Updating cart for user:", userId);
    console.log("📦 Incoming cart items:", cartItems);

    let cart = await Cart.findOne({ userId });

    if (cart) {
      // ✅ Just overwrite instead of merge to prevent duplication
      cart.cartItems = cartItems;
      await cart.save();

      console.log("✅ Cart updated (overwritten)");
      return res
        .status(200)
        .json({ message: "Cart updated", cartItems: cart.cartItems });
    } else {
      // Create new cart
      cart = await Cart.create({ userId, cartItems });

      console.log("🆕 New cart created");
      return res.status(201).json({ message: "Cart created", cartItems });
    }
  } catch (err) {
    console.error("❌ Failed to update cart:", err);
    return res
      .status(500)
      .json({ message: "Failed to update cart", error: err.message });
  }
};

// Export in CommonJS format
module.exports = {
  getCart,
  updateCart,
};
