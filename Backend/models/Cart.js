const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  thumbnail: String,
  quantity: Number,
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  cartItems: [cartItemSchema],
});

module.exports = mongoose.model('Cart', cartSchema);
