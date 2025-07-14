const Wishlist = require("../models/Wishlist.js");

// Get wishlist for a user
const getWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("🔍 Getting wishlist for user:", userId);

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      console.log("📭 No wishlist found, returning empty");
      return res.status(200).json({ wishlistItems: [] });
    }

    console.log("✅ Wishlist found with", wishlist.wishlistItems.length, "items");
    console.log("📦 Wishlist items:", wishlist.wishlistItems.map(item => `${item.title}`));
    return res.status(200).json({ wishlistItems: wishlist.wishlistItems });
  } catch (err) {
    console.error("❌ getWishlist failed:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update or create wishlist for a user
const updateWishlist = async (req, res) => {
  const { userId, wishlistItems } = req.body;

  if (!userId || !Array.isArray(wishlistItems)) {
    console.log("❌ Invalid input - userId:", !!userId, "wishlistItems array:", Array.isArray(wishlistItems));
    return res
      .status(400)
      .json({ message: "Invalid input: userId or wishlistItems missing/invalid" });
  }

  try {
    console.log("💝 Updating wishlist for user:", userId);
    console.log("📦 Wishlist items:", wishlistItems.length);
    console.log("📋 Items:", wishlistItems.map(item => `${item.title}`));

    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      // Update existing wishlist
      wishlist.wishlistItems = wishlistItems;
      await wishlist.save();
      console.log("✅ Wishlist updated successfully");
    } else {
      // Create new wishlist
      wishlist = await Wishlist.create({ userId, wishlistItems });
      console.log("🆕 New wishlist created successfully");
    }

    return res.status(200).json({ 
      message: "Wishlist updated successfully", 
      wishlistItems: wishlist.wishlistItems 
    });
  } catch (err) {
    console.error("❌ Failed to update wishlist:", err);
    return res
      .status(500)
      .json({ message: "Failed to update wishlist", error: err.message });
  }
};

// Merge wishlist items (for login sync)
const mergeWishlist = async (req, res) => {
  const { userId, localWishlistItems } = req.body;

  if (!userId || !Array.isArray(localWishlistItems)) {
    console.log("❌ Invalid merge input - userId:", !!userId, "localWishlistItems array:", Array.isArray(localWishlistItems));
    return res
      .status(400)
      .json({ message: "Invalid input: userId or localWishlistItems missing/invalid" });
  }

  try {
    console.log("🔄 Merging wishlist for user:", userId);
    console.log("📦 Local items:", localWishlistItems.length);
    console.log("📋 Local items:", localWishlistItems.map(item => `${item.title}`));

    let wishlist = await Wishlist.findOne({ userId });
    const dbWishlistItems = wishlist ? wishlist.wishlistItems : [];
    
    console.log("🗄️ Database items:", dbWishlistItems.length);
    console.log("📋 Database items:", dbWishlistItems.map(item => `${item.title}`));

    // Merge local and DB items (avoid duplicates)
    const mergedMap = new Map();
    
    // Add DB items first
    dbWishlistItems.forEach(item => {
      mergedMap.set(item.id, item);
    });

    // Add local items (will overwrite if duplicate)
    localWishlistItems.forEach(item => {
      mergedMap.set(item.id, item);
    });

    const mergedItems = Array.from(mergedMap.values());
    
    console.log("🔗 Merged items:", mergedItems.length);
    console.log("📋 Merged items:", mergedItems.map(item => `${item.title}`));

    if (wishlist) {
      // Update existing wishlist
      wishlist.wishlistItems = mergedItems;
      await wishlist.save();
      console.log("✅ Wishlist merged and updated successfully");
    } else {
      // Create new wishlist
      wishlist = await Wishlist.create({ userId, wishlistItems: mergedItems });
      console.log("🆕 New wishlist created with merged items successfully");
    }

    return res.status(200).json({ 
      message: "Wishlist merged successfully", 
      wishlistItems: wishlist.wishlistItems 
    });
  } catch (err) {
    console.error("❌ Failed to merge wishlist:", err);
    return res
      .status(500)
      .json({ message: "Failed to merge wishlist", error: err.message });
  }
};

module.exports = {
  getWishlist,
  updateWishlist,
  mergeWishlist,
}; 