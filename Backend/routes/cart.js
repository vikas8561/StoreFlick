const express = require('express');
const {getCart, updateCart} = require('../controllers/cartController.js');

const router = express.Router();

// GET /api/cart/:userId
router.get("/:userId", getCart);

// POST /api/cart
router.post("/", updateCart);

module.exports = router;
