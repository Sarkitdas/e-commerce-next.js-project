"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff 
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

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  
  const router = useRouter();

  const triggerAlert = useCallback((message, type = "success") => {
    setAlert({ show: true, message, type });
  }, []);

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

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        triggerAlert("Welcome back! Redirecting...", "success");
        setTimeout(() => router.push("/"), 1500);
      } else {
        triggerAlert(data.message || "Invalid email or password", "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      triggerAlert("A network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Headers />

      {/* RENDER ALERT */}
      {alert.show && (
        <CustomAlert 
          message={alert.message} 
          type={alert.type} 
          onClose={() => setAlert(prev => ({ ...prev, show: false }))} 
        />
      )}

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-200/40 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-200/40 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

        <div className="max-w-md w-full relative">
          <form
            onSubmit={onSubmit}
            className="relative bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white/50 transition-all duration-300 hover:shadow-indigo-200/50"
          >
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 font-medium">Please enter your details to sign in</p>
            </div>

            <div className="space-y-5">
              {/* Email Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-900 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 focus:bg-white transition-all outline-none text-gray-900 opacity-100 font-medium"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-900 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 focus:bg-white transition-all outline-none text-gray-900 opacity-100 font-medium"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 font-bold shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-sm font-medium text-gray-500 mt-8">
              New to Daily Market?{" "}
              <a 
                href="/components/Signup" 
                className="text-indigo-600 font-bold hover:underline transition-colors"
              >
                Create an account
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Page;
