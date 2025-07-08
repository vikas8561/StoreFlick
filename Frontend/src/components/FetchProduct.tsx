import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../context/SearchContext";
import useDebounce from "../hooks/useDebounce";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";


interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

interface ProductApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const FetchProduct: React.FC = () => {
  const { searchTerm } = useSearch();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let url = `https://dummyjson.com/products?limit=${limit}&skip=${
          (page - 1) * limit
        }`;
        if (debouncedSearchTerm.trim()) {
          url = `https://dummyjson.com/products/search?q=${debouncedSearchTerm}&limit=${limit}&skip=${
            (page - 1) * limit
          }`;
        }

        const response = await axios.get<ProductApiResponse>(url);
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, debouncedSearchTerm]);

  const totalPages = Math.ceil(totalProducts / limit);

  const handleAddToCart = (product: Product) => {
  addToCart(product);
};


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {loading ? (
        <div className="text-center text-lg text-gray-600 mt-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 mt-8">{error}</div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center text-gray-600 mt-8">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{product.title}</h2>
                    <p className="text-yellow-600">⭐ {product.rating}/5</p>
                    <p className="text-green-700 font-bold">${product.price}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-sm px-9 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition cursor-pointer"
                    >
                      View Details
                    </button>

                    <button title="view"
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
                    >
                      <ShoppingCart size={20} className="text-teal-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FetchProduct;
