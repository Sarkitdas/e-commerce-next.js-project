"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  LayoutGrid, 
  Pill, 
  Apple, 
  ChevronDown, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  ImageOff
} from "lucide-react";

// --- CUSTOM BEAUTIFUL ALERT COMPONENT ---
const CustomAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-emerald-50/90 border-emerald-200 text-emerald-900 shadow-emerald-100",
    error: "bg-rose-50/90 border-rose-200 text-rose-900 shadow-rose-100",
  };

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-500 ${styles[type]}`}>
      <div className="flex-shrink-0">
        {type === "success" ? (
          <CheckCircle2 size={22} className="text-emerald-600" />
        ) : (
          <AlertCircle size={22} className="text-rose-600" />
        )}
      </div>
      <p className="font-bold text-sm tracking-tight">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-4 p-1.5 hover:bg-black/5 rounded-full transition-colors active:scale-90"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [email, setEmail] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  
  const router = useRouter();

  const triggerAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/todos");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        triggerAlert("Failed to load products", "error");
      }
    };
    fetchProducts();
  }, [triggerAlert]);

  // Fetch user email
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetch("/api/decode");
        const data = await res.json();
        setEmail(data.email || "");
      } catch (error) {
        console.error("Auth status not found");
      }
    };
    fetchEmail();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const addedCart = async (productId, price, image, name, weight) => {
    if (!email) {
      triggerAlert("Please log in to add items!", "error");
      setTimeout(() => router.push("/components/login"), 1500);
      return;
    }

    setLoadingId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, weight, price, image }),
      });
      const data = await res.json();

      if (data.success) {
        triggerAlert(`${name} added to your cart!`, "success");
      } else {
        triggerAlert(data.message || "Could not add item", "error");
      }
    } catch (error) {
      triggerAlert("Network error, try again", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const loadMore = () => setVisibleCount((prev) => prev + 20);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 relative">
      
      {/* ALERTS */}
      {alert.show && (
        <CustomAlert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert(prev => ({ ...prev, show: false }))} 
        />
      )}

      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase bg-indigo-50 rounded-full">
            Premium Essentials
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6">
            Daily <span className="text-indigo-600 italic">Market</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Your trusted source for verified medicine and fresh daily groceries.
          </p>
          
          {/* CATEGORY FILTERS */}
          <div className="flex justify-center gap-4 mt-12 flex-wrap px-4">
            <CategoryButton 
              active={selectedCategory === null} 
              onClick={() => setSelectedCategory(null)}
              icon={<LayoutGrid size={20} />}
              label="All Items"
              color="gray"
            />
            <CategoryButton 
              active={selectedCategory === "medicine"} 
              onClick={() => setSelectedCategory("medicine")}
              icon={<Pill size={20} />}
              label="Medicine"
              color="indigo"
            />
            <CategoryButton 
              active={selectedCategory === "groceries"} 
              onClick={() => setSelectedCategory("groceries")}
              icon={<Apple size={20} />}
              label="Groceries"
              color="green"
            />
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {visibleProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 overflow-hidden flex flex-col"
            >
              {/* IMAGE WITH FALLBACK */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/400x500/f8fafc/6366f1?text=Product+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* CARD CONTENT */}
              <div className="p-7 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors mb-2">
                    {product.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-tighter rounded-lg">
                    {product.weight}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                    <span className="text-2xl font-black text-gray-900 leading-none">{product.price}</span>
                  </div>
                  
                  {/* CENTERING ICON BUTTON */}
                  <button
                    onClick={() => addedCart(product._id, product.price, product.image, product.name, product.weight)}
                    disabled={loadingId === product._id}
                    className="relative flex items-center justify-center w-14 h-14 bg-gray-900 text-white rounded-2xl font-bold transition-all duration-300 hover:bg-indigo-600 hover:w-36 group/btn active:scale-95 disabled:opacity-50 overflow-hidden"
                  >
                    {loadingId === product._id ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        {/* Icon remains centered in the first 3.5rem of space */}
                        <div className="absolute left-0 w-14 flex items-center justify-center">
                          <ShoppingCart size={22} />
                        </div>
                        {/* Text appears only on hover */}
                        <span className="ml-10 whitespace-nowrap text-[10px] font-black tracking-tighter opacity-0 group-hover/btn:opacity-100 transition-all duration-300 translate-x-4 group-hover/btn:translate-x-2">
                          ADD TO CART
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-24 text-center">
            <button
              onClick={loadMore}
              className="group inline-flex items-center gap-3 px-12 py-5 bg-white border border-gray-200 rounded-full font-black text-gray-800 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 shadow-sm hover:shadow-2xl active:scale-95"
            >
              LOAD MORE PRODUCTS
              <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryButton = ({ active, onClick, icon, label, color }) => {
  const themes = {
    indigo: active ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-indigo-600" : "bg-white text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/30",
    green: active ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100 border-emerald-600" : "bg-white text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/30",
    gray: active ? "bg-gray-900 text-white shadow-xl shadow-gray-200 border-gray-900" : "bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 border-2 ${themes[color]}`}
    >
      {icon}
      {label}
    </button>
  );
};

export default ProductsPage;