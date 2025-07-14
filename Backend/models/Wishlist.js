const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  thumbnail: String,
});

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  wishlistItems: [wishlistItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema); 