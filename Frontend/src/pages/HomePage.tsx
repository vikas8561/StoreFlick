import React from "react";
import Header from "../components/Header";
import FetchProduct from "../components/FetchProduct";

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header with search bar */}
      <Header />

      {/* Product Listing (search handled via SearchContext) */}
      <main className="container mx-auto px-4 py-6">
        <FetchProduct />
      </main>
    </div>
  );
};

export default HomePage;
