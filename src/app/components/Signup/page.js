"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
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
        {type === "success" ? <CheckCircle2 size={22} className="text-emerald-600" /> : <AlertCircle size={22} className="text-rose-600" />}
      </div>
      <p className="font-bold text-sm tracking-tight">{message}</p>
      <button onClick={onClose} className="ml-4 p-1.5 hover:bg-black/5 rounded-full transition-colors active:scale-90">
        <X size={16} />
      </button>
    </div>
  );
};

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      triggerAlert("Passwords do not match", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        triggerAlert("Signup successful! Redirecting...", "success");
        setTimeout(() => router.push("/components/login"), 2000);
      } else if (response.status === 409) {
        triggerAlert("Email already exists", "error");
      } else {
        triggerAlert(data.message || "Signup failed", "error");
      }
    } catch (error) {
      triggerAlert("A network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

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

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-200/40 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

        <div className="max-w-lg w-full relative">
          <form
            onSubmit={onSubmit}
            className="relative bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white transition-all duration-300"
          >
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-gray-500 font-medium text-sm">Join the Daily Market family today</p>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-900 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text" name="name" placeholder="Saikat" required
                    value={formData.name} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-gray-900 opacity-100 font-medium"
                  />
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Delivery Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-900 group-focus-within:text-indigo-600 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text" name="address" placeholder="Madhabpur, City" required
                    value={formData.address} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-gray-900 opacity-100 font-medium"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-900 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" name="email" placeholder="you@example.com" required
                    value={formData.email} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-gray-900 opacity-100 font-medium"
                  />
                </div>
              </div>

              {/* Passwords Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-900 group-focus-within:text-indigo-600 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPass ? "text" : "password"} name="password" placeholder="••••••••" required
                      value={formData.password} onChange={handleChange}
                      className="w-full pl-11 pr-11 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-gray-900 opacity-100 font-medium"
                    />
                    <button 
                      type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-widest">Confirm</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPass ? "text" : "password"} name="confirmPassword" placeholder="••••••••" required
                      value={formData.confirmPassword} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-gray-900 opacity-100 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full mt-10 bg-gray-900 text-white py-4 rounded-2xl hover:bg-indigo-600 transition-all duration-300 font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-sm font-medium text-gray-500 mt-8">
              Already have an account?{" "}
              <a href="/components/login" className="text-indigo-600 font-bold hover:underline">Log in</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Page;
