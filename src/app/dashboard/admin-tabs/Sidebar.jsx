import React from "react";
import { FaUsers, FaTicketAlt, FaBullhorn, FaUserShield, FaSignOutAlt, FaBars } from "react-icons/fa";

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, onLogout }) {
  const tabs = [
    { id: "Manage Users", label: "Manage Users", icon: <FaUsers /> },
    { id: "Manage Ticket", label: "Manage Ticket", icon: <FaTicketAlt /> },
    { id: "Advertise Tickets", label: "Advertise Promo", icon: <FaBullhorn /> },
    { id: "Profile", label: "Profile Specs", icon: <FaUserShield /> }
  ];

  return (
    <>
      {/* Mobile Glassmorphic Header Navbar */}
      <header className="lg:hidden w-full h-16 bg-[#010313]/80 backdrop-blur-md border-b border-base-content/10 fixed top-0 left-0 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">TB</div>
          <span className="font-black text-sm tracking-wider uppercase text-white">TicketBari Terminal</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="btn btn-ghost btn-sm text-white text-base"
        >
          <FaBars />
        </button>
      </header>

      {/* Primary Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#010313] border-r border-base-content/10 flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="w-full">
          {/* Brand Identity Header */}
          <div className="hidden lg:flex items-center gap-3 mb-8 px-2 pt-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20">
              TB
            </div>
            <div>
              <h1 className="font-black text-sm tracking-widest text-white uppercase">TicketBari</h1>
              <p className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase font-bold">Admin Stream</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-200
                  ${activeTab === tab.id 
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 scale-[1.02]" 
                    : "text-base-content/70 hover:bg-base-200/50 hover:text-base-content"
                  }
                `}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-4 border-t border-base-content/5 w-full">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wide uppercase text-error hover:bg-error/10 transition-all duration-200"
          >
            <FaSignOutAlt className="text-sm" /> Exit Terminal
          </button>
        </div>
      </aside>

      {/* Overlay Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  );
}