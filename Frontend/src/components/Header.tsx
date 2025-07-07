import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const navLinks = [
    "Home",
    "Indian Wear",
    "Western Wear",
    "Footwear",
    "Sleepwear",
    "Personal Care",
  ];

  return (
    <header className="bg-gray-50 shadow-md p-4 w-full max-w-full sticky top-0 z-50">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-teal-600">
            <a href="/">StoreFlick</a>
          </div>

          {/* Desktop Nav + Search + Auth */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex space-x-6 text-gray-700 font-semibold text-xs">
              {navLinks.map((label, i) => (
                <p key={i} className="hover:text-pink-700 cursor-pointer">
                  {label === "Home" ? (
                    <Link to="/">Home</Link> // ✅ updated
                  ) : (
                    <a href="#">{label}</a>
                  )}
                </p>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="relative flex items-center">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <Search size={18} />
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-50 h-8 pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                type="text"
                placeholder="Search for products..."
              />
            </div>

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="border border-red-400 bg-white text-red-600 font-semibold px-4 py-1 hover:bg-red-500 hover:text-white rounded"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="border border-pink-300 bg-white text-pink-600 font-semibold px-4 py-1 hover:bg-teal-500 hover:text-white rounded"
              >
                Login
              </a>
            )}
          </div>

          {/* Cart Icon */}
          <div
            className="relative cursor-pointer ml-4"
            onClick={() => navigate("/cart")}
            title="View Cart"
          >
            <ShoppingCart
              size={28}
              className="text-gray-700 hover:text-teal-600"
            />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 space-y-4">
          <div className="flex flex-col space-y-2 text-gray-700 font-semibold">
            {navLinks.map((label, i) => (
              <p key={i} className="hover:text-pink-700 cursor-pointer">
                <a href="#">{label}</a>
              </p>
            ))}
          </div>

          <div className="flex items-center mt-2">
            <span className="absolute left-7 text-gray-700">
              <Search size={18} />
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="text"
              placeholder="Search for products..."
            />
          </div>

          <div className="flex justify-start mt-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="border border-red-400 bg-white text-red-600 font-semibold px-4 py-1 hover:bg-red-500 hover:text-white rounded"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="border border-pink-300 bg-white text-pink-600 font-semibold px-4 py-1 hover:bg-teal-500 hover:text-white rounded"
              >
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
