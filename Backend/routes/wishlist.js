const express = require('express');
const { getWishlist, updateWishlist, mergeWishlist } = require('../controllers/wishlistController.js');

const router = express.Router();

// GET /api/wishlist/:userId - Get user's wishlist
router.get("/:userId", getWishlist);

// POST /api/wishlist - Update user's wishlist
router.post("/", updateWishlist);

// POST /api/wishlist/merge - Merge local wishlist with database
router.post("/merge", mergeWishlist);

module.exports = router; 