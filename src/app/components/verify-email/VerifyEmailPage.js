"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Headers from "@/app/components/Headers/page";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`/api/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage("Email verified successfully! You can now login.");
        } else {
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch(() => {
        setMessage("Verification failed due to server error.");
      });
  }, [token]);

  return (
    <>
      <Headers />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
        <div
          className="max-w-md w-full bg-white rounded-2xl p-8 text-center"
          style={{ boxShadow: "0 0 30px rgba(0,0,0,0.25)" }}
        >
          <div className="flex justify-center mb-6">
            {message.includes("successfully") ? (
              <svg
                className="w-16 h-16 text-green-500 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-16 h-16 text-red-500 animate-shake"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
            Email Verification
          </h1>

          <p className="text-gray-600 mb-6">{message}</p>

          <a
            href="/components/login"
            className="inline-block px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-600 transition duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    </>
  );
}
