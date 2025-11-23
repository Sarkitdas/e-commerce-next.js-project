"use client";


import React, { useEffect, useState } from "react";
import Headers from "@/app/components/Headers/page"

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order"); // your GET API route
        const data = await res.json();
        if (data.status === "success") {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
    <Headers/>
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-100 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order #{order._id.slice(-6)}
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleString()}
                </span>
              </div>

              <div className="grid gap-4 border-b border-gray-300 pb-4 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 bg-white p-3 rounded-md"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">{item.weight}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-6 text-gray-700 font-medium text-sm">
                <div>Tax: ${order.totaltax}</div>
                <div>Shipping: ${order.totalshipping}</div>
                <div>Total: ${order.totalPrice}</div>
              </div>

              <div className="mt-3 text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default OrderPage;
