"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Package, 
  Calendar, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Clock,
  Box,
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

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const triggerAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order");
        const data = await res.json();
        if (data.status === "success") {
          setOrders(data.data);
        } else {
          triggerAlert("Could not sync orders", "error");
        }
      } catch (error) {
        triggerAlert("Network error fetching orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [triggerAlert]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Headers />

      {alert.show && (
        <CustomAlert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert(prev => ({ ...prev, show: false }))} 
        />
      )}

      <main className="max-w-5xl mx-auto w-full px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Package className="text-indigo-600" size={32} />
            My Orders
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your recent purchases and delivery status.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading History...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
              <Box size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">When you buy medicines or groceries, they will appear here.</p>
            <a href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95">
              Start Shopping <ChevronRight size={18} />
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 overflow-hidden">
                {/* Order Top Bar */}
                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Placed On</p>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                        <Calendar size={14} className="text-indigo-500" />
                        {new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Items List */}
                <div className="p-8">
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 group/item">
                        <div className="relative w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                            onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Product"; }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900 group-hover/item:text-indigo-600 transition-colors">{item.name}</h4>
                          <p className="text-xs font-medium text-gray-500">{item.weight}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-gray-900">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Totals */}
                  <div className="mt-10 pt-8 border-t border-dashed border-gray-200 flex flex-wrap justify-between items-end gap-6">
                    <div className="flex items-center gap-4 bg-indigo-50/50 px-6 py-4 rounded-2xl">
                       <Truck className="text-indigo-600" size={20} />
                       <div>
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Delivery Type</p>
                         <p className="text-sm font-bold text-indigo-900">Standard Doorstep</p>
                       </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        <span>Tax: ${order.totaltax}</span>
                        <span>Shipping: ${order.totalshipping}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-500 uppercase">Total Amount:</span>
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">${order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// --- HELPER COMPONENT FOR STATUS BADGE ---
const StatusBadge = ({ status }) => {
  const configs = {
    pending: { bg: "bg-amber-50", text: "text-amber-600", icon: <Clock size={14} />, label: "Processing" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-600", icon: <CheckCircle2 size={14} />, label: "Delivered" },
    cancelled: { bg: "bg-rose-50", text: "text-rose-600", icon: <AlertCircle size={14} />, label: "Cancelled" },
  };

  const config = configs[status.toLowerCase()] || configs.pending;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] ${config.bg} ${config.text} border border-current/10`}>
      {config.icon}
      {config.label}
    </div>
  );
};

export default OrderPage;