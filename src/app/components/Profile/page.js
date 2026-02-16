"use client";

import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  MapPin, 
  LogOut, 
  Camera, 
  ShieldCheck, 
  Loader2, 
  ChevronRight 
} from "lucide-react";
import Headers from "@/app/components/Headers/page";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    address: "Loading...",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setUserData({
            name: result.data.name,
            email: result.data.email,
            address: result.data.address,
          });
        }
      })
      .catch((err) => console.error("Fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    // Add your logout API logic here if needed
    router.push("/components/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Headers />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[120px] -z-10" />

        <div className="max-w-xl w-full relative">
          {/* Profile Card */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-white overflow-hidden">
            
            {/* Header/Cover Section */}
            <div className="h-40 bg-gradient-to-br from-gray-900 to-indigo-900 relative">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>

            {/* Avatar Section */}
            <div className="relative px-8 pb-8">
              <div className="relative -mt-20 mb-6 inline-block">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden border-2 border-indigo-100">
                    <img 
                      src="/profile.png" 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <User size={48} style={{display: 'none'}} />
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 p-2.5 bg-white text-gray-700 rounded-2xl shadow-lg border border-gray-100 hover:text-indigo-600 transition-colors active:scale-90">
                  <Camera size={18} />
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  {userData.name}
                  <ShieldCheck size={20} className="text-emerald-500" />
                </h2>
                <p className="text-gray-500 font-medium uppercase text-[10px] tracking-[0.2em]">Verified Member</p>
              </div>

              {/* Data Rows */}
              <div className="space-y-3">
                <ProfileInfoBox 
                  icon={<Mail size={18} />} 
                  label="Email Address" 
                  value={userData.email} 
                />
                <ProfileInfoBox 
                  icon={<MapPin size={18} />} 
                  label="Primary Address" 
                  value={userData.address} 
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <button 
                   onClick={() => router.push("/components/Order")}
                   className="flex items-center justify-center gap-2 py-4 px-6 bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
                >
                  My Orders <ChevronRight size={16} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-4 px-6 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all active:scale-95"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-400 text-xs font-medium tracking-widest uppercase">
            Account created with Daily Market Security
          </p>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENT FOR INFO ROWS ---
const ProfileInfoBox = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100/50 group hover:bg-white hover:shadow-md hover:shadow-indigo-100/30 transition-all">
    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-sm transition-colors">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

export default Page;