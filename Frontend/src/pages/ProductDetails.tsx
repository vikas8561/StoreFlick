// src/pages/ProductDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Header from "../components/Header";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  images: string[];
  thumbnail: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error || !product)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">
      {/* 🠔 Interactive Back Button */}
      <div className="mb-4">
        <button
          title="btn"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-medium rounded shadow-md hover:bg-teal-600 active:scale-95 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 cursor-pointer"
        >
          <ArrowLeft size={25} />
        </button>
      </div>

      {/* Product Details Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full md:w-1/2 object-cover rounded"
        />
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p className="text-green-700 font-semibold text-xl">
            ${product.price}
          </p>
          <p className="text-yellow-600">⭐ {product.rating} / 5</p>

          <div className="flex gap-3">
            <button 
              onClick={() => addToCart(product)} 
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center justify-center gap-2 transition duration-200"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>

            <button 
              onClick={() => toggleWishlist(product)} 
              className={`px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-200 ${
                isInWishlist(product.id)
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Heart 
                size={20} 
                className={isInWishlist(product.id) ? "fill-current" : ""} 
              />
              {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductDetails;
