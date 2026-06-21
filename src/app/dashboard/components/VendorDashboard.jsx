"use client";

import { useState } from "react";
import { 
  FaUser, 
  FaPlusCircle, 
  FaTicketAlt, 
  FaClipboardList, 
  FaChartLine, 
  FaEdit 
} from "react-icons/fa";

export default function VendorDashboard({ session }) {
  // Navigation active tab index handling
  const [activeTab, setActiveTab] = useState("Profile");

  const menuItems = [
    { id: "Profile", label: "Profile", icon: <FaUser /> },
    { id: "Add tickets", label: "Add tickets", icon: <FaPlusCircle /> },
    { id: "My Added tickets", label: "My Added tickets", icon: <FaTicketAlt /> },
    { id: "Requested Bookings", label: "Requested Bookings", icon: <FaClipboardList /> },
    { id: "Revenue Overview", label: "Revenue Overview", icon: <FaChartLine /> },
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-base-content transition-colors duration-200">
      
      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 shrink-0">
        {/* Brand Logo Identity Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <img src="/logo.png" alt="TicketBari" className="h-8 onerror={(e) => e.target.style.display='none'}" />
          <span className="font-black text-xl tracking-tight text-white">
            Ticket<span className="text-amber-500">Bari</span>
          </span>
        </div>

        {/* Dynamic Sidebar Menu Link Array */}
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive 
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-md" 
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className={isActive ? "text-emerald-400" : "text-slate-500"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* RIGHT CONTENT DISPLAY WINDOW */}
      <main className="flex-1 p-8 flex items-center justify-center">
        
        {/* RENDER PROFILE CONTENT PANEL */}
        {activeTab === "Profile" && (
          <div className="w-full max-w-2xl bg-base-100 border border-base-content/15 rounded-3xl overflow-hidden shadow-xl transition-all">
            {/* Ambient Vector Banner Top Background */}
            <div className="h-44 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem] opacity-30" />
            </div>

            {/* User Metadata Presentation Identity Deck */}
            <div className="px-8 pb-8 relative flex flex-col items-center -mt-16">
              <div className="avatar mb-3">
                <div className="w-28 h-28 rounded-full ring-4 ring-base-100 object-cover bg-base-200 shadow-2xl">
                  <img 
                    src={session?.user?.image || defaultAvatar} 
                    alt={session?.user?.name} 
                  />
                </div>
              </div>

              {/* Role Badge Indicator Pill */}
              <span className="badge bg-amber-500 border-none text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-2.5 rounded-full mb-2 shadow-sm">
                {session?.user?.role || "Vendor"}
              </span>

              <h2 className="text-2xl font-black tracking-tight text-base-content capitalize">
                {session?.user?.name}
              </h2>
              <p className="text-xs text-base-content/50 font-medium tracking-wide mt-1">
                {session?.user?.email}
              </p>

              <button className="btn btn-md mt-6 bg-gradient-to-r from-teal-500 to-emerald-600 border-none text-white font-bold rounded-xl px-6 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <FaEdit size={14} /> Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* PLACEHOLDERS FOR COMPLEMENTARY SUB-PANELS */}
        {activeTab === "Add tickets" && (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-content/10 p-10 max-w-md w-full shadow-md">
            <h3 className="text-lg font-bold">Add New Transit Node</h3>
            <p className="text-xs text-base-content/60 mt-1">Configure parameters to deploy new passenger terminal lists.</p>
          </div>
        )}

        {activeTab !== "Profile" && activeTab !== "Add tickets" && (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-content/10 p-10 max-w-md w-full shadow-md">
            <h3 className="text-lg font-bold capitalize">{activeTab} Panel</h3>
            <p className="text-xs text-base-content/60 mt-1">Real-time information streams are being calculated for optimization views.</p>
          </div>
        )}

      </main>
    </div>
  );
}