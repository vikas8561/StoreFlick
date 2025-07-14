const express = require('express');
const { getCart, updateCart, mergeCart } = require('../controllers/cartController.js');

const router = express.Router();

// GET /api/cart/:userId - Get user's cart
router.get("/:userId", getCart);

// POST /api/cart - Update user's cart
router.post("/", updateCart);

// POST /api/cart/merge - Merge local cart with database
router.post("/merge", mergeCart);

module.exports = router;
