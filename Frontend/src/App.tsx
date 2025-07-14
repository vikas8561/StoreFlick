import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProductDetails from "./pages/ProductDetails"; // ✅ imported
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrderSuccess from "./components/OrderSuccess";

const App: React.FC = () => {
  return (
      <SearchProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                {/* ✅ new route */}
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </SearchProvider>
  );
};

export default App;
