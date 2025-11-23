"use client";

import React, { useEffect, useState } from "react";
import Headers from "@/app/components/Headers/page";

const Page = () => {
  const [userEmail, setUserEmail] = useState("Loading...");
  const [userName, setUserName] = useState("Loading...");
  const [userAddress, setUserAddress] = useState("Loading...");

  useEffect(() => {
  fetch("/api/profile", { credentials: "include" })
    .then((res) => res.json())
    .then((result) => {
      const data = result.data;
      setUserEmail(data.email);
      setUserName(data.name);
      setUserAddress(data.address);
    })
    .catch((err) => console.error("Fetch error", err));
}, []);

  return (
    <>
      <Headers />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="h-60 w-full bg-gradient-to-r rounded-xl shadow-lg text-white">
            <div className="flex flex-col items-center p-6">
              <img src="/profile.png" alt="User Avatar" className="w-35 h-35 object-cover text-white" />
              <span className="font-extrabold text-3xl tracking-wide text-gray-600 p-4">User Profile</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Name</span>
              <span className="text-gray-800 font-semibold">{userName}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Email</span>
              <span className="text-gray-800 font-semibold">{userEmail}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Address</span>
              <span className="text-gray-800 font-semibold text-right">{userAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
