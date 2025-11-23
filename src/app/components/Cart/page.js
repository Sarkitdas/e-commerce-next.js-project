"use client";

import React, { useMemo, useState, useEffect, use } from "react";
import Headers from "@/app/components/Headers/page";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  //fetch cart items from database

  useEffect(() => {
    const Cart = async () => {
      try {
        const dataCart = await fetch("/api/cart", {
          method: "GET",
        });
        const cartData = await dataCart.json();
        setCartItems(cartData);
      } catch (error) {
        console.error("Error fetching email or cart:", error);
      }
    };

    Cart();
  }, []);

  //total price calculation
  const totalPrice = useMemo(() => {
    const count = cartItems.length;
    const Shipping = count === 0 ? 0 : count <= 3 ? count + 1 : count;

    const tax = cartItems.length * 4;
    console.log("cartItems Length:", cartItems.length);

    if (!cartItems || cartItems.length === 0) return 0;

    const itemsTotal = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price); // convert string to number
      return acc + (isNaN(price) ? 0 : price);
    }, 0);

    return itemsTotal + Shipping + tax;
  }, [cartItems]);

  const totaltax = useMemo(() => cartItems.length * 4, [cartItems]);
  const totalshipping = useMemo(
    () =>
      cartItems.length === 0
        ? 0
        : cartItems.length <= 3
        ? cartItems.length + 1
        : cartItems.length,
    [cartItems]
  );

  ///////////////////////////////

  //remove button function
  const removeItem = async (productId) => {
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }), // ✅ send product
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setCartItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };


  //create order function
  const createOrder = async () => {
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, totalPrice,totaltax,totalshipping }), // ✅ send cart items and total price
      });
      const data = await res.json();
      console.log(data);  
      if (data.status === "success") {
        alert("Order Created Successfully");
        router.push("/components/Order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      <Headers />
      <div className="lg:max-w-5xl max-lg:max-w-2xl mx-auto bg-white p-4 mt-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-100 p-6 rounded-md">
            <h3 className="text-lg font-semibold text-slate-900">Your Cart</h3>
            <hr className="border-gray-300 mt-4 mb-8" />

            <div className="sm:space-y-6 space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="grid sm:grid-cols-3 items-center gap-4"
                >
                  <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
                    <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                      <img
                        src={item.image}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-slate-900">
                        {item.name}
                      </h4>
                      <span className="text-[12px]">{item.weight}</span>
                      <h6
                        onClick={() => removeItem(item.productId)}
                        className="text-xs font-medium text-red-500 cursor-pointer mt-1"
                      >
                        Remove
                      </h6>
                    </div>
                  </div>
                  <div className="sm:ml-auto">
                    <h4 className="text-[15px] font-semibold text-slate-900">
                      ${item.price}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-md p-6 md:sticky top-0 h-max">
            <h3 className="text-lg font-semibold text-slate-900">
              Order details
            </h3>
            <hr className="border-gray-300 mt-4 mb-8" />

            <ul className="text-slate-500 font-medium mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-sm">
                Discount{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  $0.00
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipping{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  ${totalshipping.toFixed(2)}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Tax{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  ${totaltax.toFixed(2)}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                Total{" "}
                <span className="ml-auto font-semibold">
                  ${totalPrice.toFixed(2)}
                </span>
              </li>
            </ul>
            <div className="mt-8 space-y-3">
              <button onClick={()=>createOrder(cartItems,totalPrice,totalshipping,totaltax)}
                type="button"
                className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
              >
                Checkout
              </button>
              <button
                onClick={() => router.push("/")}
                type="button"
                className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-transparent text-slate-900 border border-gray-300 rounded-md cursor-pointer"
              >
                Continue Shopping{" "}
              </button>
            </div>
            <div className="mt-6">
              <p className="text-slate-900 text-sm font-medium mb-2">
                Do you have a promo code?
              </p>
              <div className="flex border border-blue-600 overflow-hidden rounded-md">
                <input
                  type="email"
                  placeholder="Promo code"
                  className="w-full outline-0 bg-white text-slate-600 text-sm px-4 py-2.5"
                />
                <button
                  type="button"
                  className="flex items-center justify-center font-medium tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
