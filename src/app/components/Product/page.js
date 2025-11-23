"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [email, setEmail] = useState(""); // Store decoded email
  const router = useRouter();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/todos");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch user email
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetch("/api/decode");
        const data = await res.json();
        setEmail(data.email);
      } catch (error) {
        console.error("Error decoding email:", error);
      }
    };

    fetchEmail();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Add to cart function
  const addedCart = async (productId, price, image,name,weight) => {
    if (!email) {
      alert("Please Log in First!");
      router.push("/components/login");
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name,
          weight,
          price,
          image,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
      } else {
        alert("Added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong!");
    }
  };

  const loadMore = () => setVisibleCount((prev) => prev + 20);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center py-12">
        <p className="mt-3 text-gray-500 text-lg sm:text-2xl">
          Browse products by category
        </p>
        <div className="mt-6 w-100 h-1 bg-gray-800 mx-auto rounded-full"></div>
      </div>

      {/* Category Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full shadow cursor-pointer ${
            selectedCategory === null
              ? "bg-gray-700 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedCategory("medicine")}
          className={`px-4 py-2 rounded-full shadow cursor-pointer ${
            selectedCategory === "medicine"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-100 hover:bg-indigo-200"
          }`}
        >
          Medicine
        </button>
        <button
          onClick={() => setSelectedCategory("groceries")}
          className={`px-4 py-2 rounded-full shadow cursor-pointer ${
            selectedCategory === "groceries"
              ? "bg-green-600 text-white"
              : "bg-green-100 hover:bg-green-200"
          }`}
        >
          Groceries
        </button>
      </div>

      {/* Products */}
      <h1 className="grid grid-cols-1 text-2xl font-bold py-4 text-center">
        All Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="w-full h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-1">{product.weight}</p>
              <p className="text-blue-600 font-bold">{product.price}</p>
            </div>
            <div className="flex justify-center py-4">
              <button
                onClick={() =>
                  addedCart(product["_id"], product.price, product.image,product.name,product.weight)
                }
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-light px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:from-green-500 hover:to-blue-600 transition transform duration-300 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredProducts.length && (
        <div className="text-center m-8">
          <button
            onClick={loadMore}
            className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
