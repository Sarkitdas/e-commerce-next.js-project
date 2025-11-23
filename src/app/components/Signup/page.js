// Signup page component
//src/app/components/Signup/page.js

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Headers from "@/app/components/Headers/page";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Signup successful! Please verify your email before logging in.");
        router.push("/components/login");
      } else if (response.status === 409) {
        // 409 = Conflict → user already exists
        alert(`Email already exists`);
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Headers />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br p-6">
        <form
          onSubmit={onSubmit}
          className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Sign Up
          </h2>

          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </span>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </span>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              required
              value={formData.address}
              onChange={handleChange}
              autoComplete="address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/components/login"
              className="text-blue-600 hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Page;
