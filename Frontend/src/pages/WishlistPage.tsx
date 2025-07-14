import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleRemoveFromWishlist = (id: number) => {
    removeFromWishlist(id);
  };

  const handleViewDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding products to your wishlist to see them here
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Heart className="mr-3 h-8 w-8 text-red-500" />
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col justify-between"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-3 cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleViewDetails(product.id)}
              />
              <div>
                <h2 
                  className="text-lg font-semibold line-clamp-2 mb-2 cursor-pointer hover:text-teal-600 transition"
                  onClick={() => handleViewDetails(product.id)}
                >
                  {product.title}
                </h2>
                <p className="text-green-700 font-bold text-lg">
                  ${product.price}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4 space-x-2">
                <button
                  onClick={() => handleViewDetails(product.id)}
                  className="flex-1 text-sm px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  title="Add to Cart"
                >
                  <ShoppingCart size={18} className="text-teal-600" />
                </button>

                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="p-2 bg-red-100 rounded hover:bg-red-200 transition"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage; 