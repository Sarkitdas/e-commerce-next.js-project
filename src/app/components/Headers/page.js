"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const menuRef = useRef(null);

  const [hasToken, setHasToken] = React.useState(false);

  React.useEffect(() => {
  const fetchTokenStatus = async () => {
    try {
      const res = await fetch("/api/decode");
      const data = await res.json();

      // If email exists, token exists
      setHasToken(!!data.email); 
    } catch (err) {
      console.error(err);
      setHasToken(false); // treat error as no token
    }
  };

  fetchTokenStatus();
}, []);


  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/login", { method: "GET" }); // clear the token cookie
      setHasToken(false);
      router.push("/components/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await fetch("/api/login", { method: "GET" }); // clear the token cookie
      setHasToken(false);
      router.push("/components/Signup");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="text-gray-600 body-font shadow-sm">
      <div className="container mx-auto flex flex-wrap p-4 md:p-5 flex-col md:flex-row items-center">
        {/* Brand */}
        <a
          href="/"
          className="flex title-font font-medium items-center text-gray-900 mb-3 md:mb-0 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-8 h-8 md:w-10 md:h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-lg md:text-xl">Sarkit'sHUB</span>
        </a>

        {/* Nav: text is slightly smaller on small devices */}
        <nav className="cursor-pointer md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-sm md:text-base justify-center gap-3 md:gap-4 mb-3 md:mb-0">
      
      <span
        onClick={() => router.push("/components/Cart")}
        className="hover:text-gray-900 cursor-pointer"
      >
        Cart
      </span>
      
      <span
        onClick={() => router.push("/components/Order")}
        className="hover:text-gray-900 cursor-pointer"
      >
        Orders
      </span>

    </nav>

        {/* Dropdown */}
        <div
          ref={menuRef}
          className="relative inline-block text-left w-full md:w-auto"
        >
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition cursor-pointer w-full md:w-auto text-sm md:text-base"
            aria-expanded={open}
            aria-haspopup="true"
          >
            Menu
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white border overflow-hidden text-center z-50">
              <button
                onClick={() => {
                  router.push("/components/Profile");
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </button>

              <button
                onClick={
                  hasToken
                    ? handleSignup
                    : () => router.push("/components/Signup")
                }
                disabled={loading}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Create Account
              </button>

              <button
                onClick={
                  hasToken
                    ? handleLogout
                    : () => router.push("/components/login")
                }
                disabled={loading}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 disabled:opacity-60 cursor-pointer"
              >
                {loading
                  ? hasToken
                    ? "Logging out..."
                    : "Redirecting..."
                  : hasToken
                  ? "Logout here!"
                  : "Login here"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Page;
