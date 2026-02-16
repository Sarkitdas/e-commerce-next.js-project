"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShoppingCart, Package, LogOut, UserPlus, Menu, X, ChevronDown, Home } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Mobile menu state
  const [accountOpen, setAccountOpen] = useState(false); // Desktop dropdown state
  const [hasToken, setHasToken] = useState(false);
  const accountRef = useRef(null);

  // 1. Fetch Auth Status
  useEffect(() => {
    const fetchTokenStatus = async () => {
      try {
        const res = await fetch("/api/decode");
        const data = await res.json();
        setHasToken(!!data.email);
      } catch (err) {
        setHasToken(false);
      }
    };
    fetchTokenStatus();
  }, []);

  // 2. Prevent Background Scroll when Mobile Menu is Open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // 3. Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthAction = async (path, isLogout = false) => {
    setLoading(true);
    try {
      if (isLogout || hasToken) {
        await fetch("/api/login", { method: "GET" });
        setHasToken(false);
      }
      router.push(path);
      setOpen(false);
      setAccountOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN HEADER */}
      <header className="sticky top-0 z-[60] w-full bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Brand Logo */}
            <div 
              onClick={() => router.push("/")} 
              className="flex items-center gap-2 cursor-pointer group select-none relative z-[70]"
            >
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl transition-transform group-hover:rotate-12 group-active:scale-90">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Swift<span className="text-indigo-600">Shelf</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink onClick={() => router.push("/components/Cart")} icon={<ShoppingCart size={18}/>} label="Cart" />
              <NavLink onClick={() => router.push("/components/Order")} icon={<Package size={18}/>} label="Orders" />
              
              {/* Desktop Account Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-200 transition-all cursor-pointer"
                >
                  <User size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-gray-700">Account</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <DropdownItem onClick={() => {router.push("/components/Profile"); setAccountOpen(false)}} icon={<User size={16}/>} label="Profile" />
                    <DropdownItem onClick={() => handleAuthAction("/components/Signup")} icon={<UserPlus size={16}/>} label="Register" />
                    <div className="h-px bg-gray-100 my-2 mx-4" />
                    <button
                      disabled={loading}
                      onClick={() => handleAuthAction("/components/login", true)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut size={16} />
                      {loading ? "Waiting..." : hasToken ? "Logout" : "Login"}
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Toggle Button (Visible when menu is closed) */}
            {!open && (
              <button 
                className="md:hidden p-2 text-gray-900 cursor-pointer transition-all active:scale-75"
                onClick={() => setOpen(true)}
                aria-label="Open Menu"
              >
                <Menu size={32} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY - FULL SCREEN */}
      <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        
        {/* The Mask: High Opacity + Extreme Blur */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-3xl" />
        
        {/* Floating Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-100/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-100/50 rounded-full blur-[120px] animate-pulse" />

        {/* Close Button Inside Overlay */}
        <div className="absolute top-4 right-4 z-[110]">
          <button 
            className="p-4 text-gray-900 cursor-pointer hover:bg-gray-100/50 rounded-full transition-colors active:scale-90"
            onClick={() => setOpen(false)}
            aria-label="Close Menu"
          >
            <X size={36} />
          </button>
        </div>

        <nav className="relative h-full flex flex-col justify-center px-10 space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-500 uppercase ml-2 opacity-60">Navigation</p>
            <MobileLink onClick={() => {router.push("/"); setOpen(false)}} icon={<Home />} label="Home" />
            <MobileLink onClick={() => {router.push("/components/Cart"); setOpen(false)}} icon={<ShoppingCart />} label="My Cart" />
            <MobileLink onClick={() => {router.push("/components/Order"); setOpen(false)}} icon={<Package />} label="Orders" />
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-500 uppercase ml-2 opacity-60">Account</p>
            <MobileLink onClick={() => {router.push("/components/Profile"); setOpen(false)}} icon={<User />} label="Profile" />
            {!hasToken && (
              <MobileLink onClick={() => {router.push("/components/Signup"); setOpen(false)}} icon={<UserPlus />} label="Register" />
            )}
          </div>

          <div className="pt-6">
            <button 
              onClick={() => handleAuthAction("/components/login", true)}
              className="group w-full flex items-center justify-between bg-gray-900 text-white p-6 rounded-[2rem] font-bold shadow-2xl shadow-indigo-200 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-xl group-hover:bg-red-500 transition-colors">
                  <LogOut size={22} />
                </div>
                <span className="text-xl">{hasToken ? "Logout" : "Login"}</span>
              </div>
              <div className="bg-white/10 p-2 rounded-full">
                <ChevronDown className="-rotate-90" size={20} />
              </div>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

// COMPONENT: NavLink (Desktop)
const NavLink = ({ onClick, icon, label }) => (
  <button onClick={onClick} className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-semibold transition-all cursor-pointer">
    <span className="transition-transform group-hover:scale-110">{icon}</span>
    <span>{label}</span>
  </button>
);

// COMPONENT: DropdownItem (Desktop Account)
const DropdownItem = ({ onClick, icon, label }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer">
    {icon} {label}
  </button>
);

// COMPONENT: MobileLink (Full Screen Menu)
const MobileLink = ({ onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className="w-full flex items-center gap-6 text-3xl text-gray-900 font-black py-2 transition-all cursor-pointer active:translate-x-4 active:text-indigo-600"
  >
    <span className="text-indigo-600">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Navbar;