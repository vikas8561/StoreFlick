// src/pages/CartPage.tsx
import React from "react";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    alert("Your order has been placed!");
    navigate("/order-success");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Cart Items */}
            <ul className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => navigate(`/product/${item.id}`)}
                      title="View Product"
                    />

                    {/* Product Info */}
                    <div>
                      <h3
                        className="font-semibold text-lg text-gray-900 cursor-pointer hover:underline"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>

                      {/* Quantity & Remove Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-xl font-bold flex items-center justify-center transition"
                        >
                          −
                        </button>
                        <span className="text-md font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-xl font-bold flex items-center justify-center transition"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 px-3 py-1 bg-red-100 text-red-600 font-semibold rounded hover:bg-red-200 transition text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total for this product */}
                  <p className="font-semibold text-gray-800 text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Right: Summary */}
            <div className="w-full md:w-1/3 bg-white p-6 rounded shadow-md h-fit">
              <h4 className="text-2xl font-bold mb-4 text-gray-800">
                Cart Summary
              </h4>
              <div className="text-gray-700 space-y-2">
                <p>
                  🧺 Total Items:{" "}
                  <span className="font-semibold">{totalItems}</span>
                </p>
                <p>
                  💰 Total Cost:{" "}
                  <span className="font-semibold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </p>
              </div>

              <button
                className="mt-6 w-full bg-teal-600 text-white py-3 rounded font-semibold hover:bg-teal-700 transition"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
