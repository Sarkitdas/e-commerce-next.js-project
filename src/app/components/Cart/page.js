"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ChevronLeft, 
  TicketPercent, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  ShieldCheck,
  ReceiptText
} from "lucide-react";
import Headers from "@/app/components/Headers/page";

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
    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-8 duration-500 ${styles[type]}`}>
      <div className="flex-shrink-0">
        {type === "success" ? <CheckCircle2 size={22} className="text-emerald-600" /> : <AlertCircle size={22} className="text-rose-600" />}
      </div>
      <p className="font-bold text-sm tracking-tight">{message}</p>
      <button onClick={onClose} className="ml-4 p-1.5 hover:bg-black/5 rounded-full transition-colors active:scale-90">
        <X size={16} />
      </button>
    </div>
  );
};

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const triggerAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
  }, []);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  // Calculations
  const totaltax = useMemo(() => cartItems.length * 4, [cartItems]);
  const totalshipping = useMemo(() => 
    cartItems.length === 0 ? 0 : cartItems.length <= 3 ? cartItems.length + 1 : cartItems.length, 
  [cartItems]);

  const itemsSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')); // Handles "$10" or "10"
      return acc + (isNaN(price) ? 0 : price);
    }, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => itemsSubtotal + totalshipping + totaltax, [itemsSubtotal, totalshipping, totaltax]);

  // Actions
  const removeItem = async (productId) => {
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
        triggerAlert("Item removed from cart", "success");
      }
    } catch (error) {
      triggerAlert("Failed to remove item", "error");
    }
  };

  const createOrder = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, totalPrice, totaltax, totalshipping }),
      });
      const data = await res.json();
      if (data.status === "success") {
        triggerAlert("Order placed successfully!", "success");
        setTimeout(() => router.push("/components/Order"), 1500);
      }
    } catch (error) {
      triggerAlert("Checkout failed. Try again.", "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Headers />
      
      {alert.show && (
        <CustomAlert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert(prev => ({ ...prev, show: false }))} 
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <ShoppingBag size={48} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is empty</h2>
             <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't added any essentials to your cart yet.</p>
             <button 
               onClick={() => router.push("/")}
               className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95"
             >
               <ChevronLeft size={20} /> Start Shopping
             </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left side: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="group bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6 transition-all hover:shadow-xl hover:shadow-indigo-100/30">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">{item.weight}</p>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="mt-3 flex items-center gap-1.5 text-rose-500 font-bold text-xs hover:text-rose-700 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Summary */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm lg:sticky lg:top-8">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <ReceiptText className="text-indigo-600" size={20} />
                Order Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-tighter">
                  <span>Subtotal</span>
                  <span className="text-gray-900">${itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-tighter">
                  <span>Shipping</span>
                  <span className="text-gray-900">${totalshipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-tighter">
                  <span>Estimated Tax</span>
                  <span className="text-gray-900">${totaltax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="text-base font-black text-gray-900 uppercase">Total</span>
                  <span className="text-3xl font-black text-indigo-600 tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <TicketPercent size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  className="w-full pl-11 pr-24 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-sm"
                />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-colors">
                  Apply
                </button>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={createOrder}
                  disabled={isCheckingOut}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                >
                  {isCheckingOut ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>Complete Checkout <ArrowRight size={18} /></>
                  )}
                </button>
                <button 
                  onClick={() => router.push("/")}
                  className="w-full bg-white text-gray-900 border-2 border-gray-100 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-gray-300 transition-all active:scale-[0.98]"
                >
                  Back to Shop
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;