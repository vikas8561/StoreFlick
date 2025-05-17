import React, { useState } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-50 shadow-md p-4 w-full overflow-x-hidden max-w-full sticky top-0">
      {/* Top Row */}
      <div className="flex items-center justify-between flex-wrap">
        {/* Left - Logo and Cart */}
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-teal-600">
            <a href="/">StoreFlick</a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex space-x-6 text-gray-700 font-semibold text-xs">
              <p className="hover:text-pink-700 cursor-pointer">
                <a href="#">Home</a>
              </p>
              <p className="hover:text-pink-700 cursor-pointer">
                <a href="#">Indian Wear</a>
              </p>
              <p className="hover:text-pink-700 cursor-pointer">
                <a href="#">Western Wear</a>
              </p>
              <p className="hover:text-pink-700 cursor-pointer">
                <a href="#">Footwear</a>
              </p>
              <p className="hover:text-pink-700 cursor-pointer">
                <a href="#">Sleepwear</a>
              </p>
              <p className="hover:text-pink-700 cursor-pointer">
                <a href="#">Personal Care</a>
              </p>
            </nav>
            <div className="relative flex items-center">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <Search size={18} />
              </span>
              <input
                className="w-50 h-8 pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                type="text"
                placeholder="Search for products..."
              />
            </div>
            <button className="border border-pink-300 bg-white text-pink-600 font-semibold px-4 py-1 hover:bg-teal-500 hover:text-white rounded">
              <a href="/login">Login</a>
            </button>
          </div>
          {/* Cart - always visible */}
          <div className="relative cursor-pointer">
            <a href="#">
              <ShoppingCart
                size={28}
                className="text-gray-700 hover:text-teal-600"
              />
            </a>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
              2
            </span>
          </div>
        </div>

        {/* Right - Hamburger menu for small, nav for large */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu - toggled */}
      {menuOpen && (
        <div className="lg:hidden mt-4 space-y-4">
          <div className="flex flex-col space-y-2 text-gray-700 font-semibold">
            <p className="hover:text-pink-700 cursor-pointer">
              <a href="#"> Home </a>
            </p>
            <p className="hover:text-pink-700 cursor-pointer">
              <a href="#"> Indian Wear </a>
            </p>
            <p className="hover:text-pink-700 cursor-pointer">
              <a href="#"> Western Wear </a>
            </p>
            <p className="hover:text-pink-700 cursor-pointer">
              <a href="#"> Footwear </a>
            </p>
            <p className="hover:text-pink-700 cursor-pointer">
              <a href="#"> Sleepwear </a>
            </p>
            <p className="hover:text-pink-700 cursor-pointer">
              <a href="#"> Personal Care </a>
            </p>
          </div>
          <div className="flex items-center mt-2">
            <span className="absolute left-7 text-gray-700">
              <Search size={18} />
            </span>
            <input
              className="w-full h-8 pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="text"
              placeholder="Search for products..."
            />
          </div>
          <div className="flex justify-start mt-2">
            <button className="border border-pink-300 bg-white text-pink-600 font-semibold px-4 py-1 hover:bg-teal-500 hover:text-white rounded">
              <a href="/login">Login</a>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
