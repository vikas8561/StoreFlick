import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const { totalItems, clearCart } = useCart();
  const { totalItems: wishlistItems, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    clearCart(); // Use cart context's clearCart function
    clearWishlist(); // Use wishlist context's clearWishlist function
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const navLinks = [
    "Home",
    "Footwear",
    "Sleepwear",
    "Personal Care",
  ];

  return (
    <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between flex-wrap">
        {/* Left Side */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold text-teal-600">
            StoreFlick
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-6 text-gray-700 font-semibold text-sm">
            {navLinks.map((label, i) => (
              <Link
                key={i}
                to={label === "Home" ? "/" : "#"}
                className="hover:text-pink-600 transition"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search + Cart + Auth (Desktop) */}
        <div className="hidden lg:flex items-center space-x-5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              placeholder="Search for products..."
            />
          </div>

          {/* Cart Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart
              size={26}
              className="text-gray-700 hover:text-teal-600 transition"
            />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </div>

          {/* Wishlist Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <Heart
              size={26}
              className="text-gray-700 hover:text-red-500 transition"
            />
            {wishlistItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {wishlistItems}
              </span>
            )}
          </div>

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-4 py-1 rounded-full text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold px-4 py-1 rounded-full text-sm transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden mt-4 space-y-4 animate-slide-down">
          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-2 text-gray-700 font-semibold text-sm">
            {navLinks.map((label, i) => (
              <Link
                key={i}
                to={label === "Home" ? "/" : "#"}
                className="hover:text-pink-600 transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile Search */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              placeholder="Search for products..."
            />
          </div>

          {/* Mobile Auth Button */}
          <div className="flex justify-start">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-4 py-1 rounded-full text-sm transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold px-4 py-1 rounded-full text-sm transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
