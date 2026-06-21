"use client";

import { useState } from "react";
import { 
  FaUser, 
  FaPlusCircle, 
  FaTicketAlt, 
  FaClipboardList, 
  FaChartLine, 
  FaEdit,
  FaBars,
  FaTimes,
  FaLock
} from "react-icons/fa";

export default function VendorDashboard({ session }) {
  // 🔒 ROLE SECURITY GUARD: Only allow visibility if user role is explicitly 'vendor'
  if (!session || session?.user?.role !== "vendor") {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-200">
        <div className="text-center p-8 bg-base-100 rounded-3xl border border-base-content/10 max-w-md w-full shadow-xl">
          <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <FaLock size={26} />
          </div>
          <h3 className="text-xl font-black text-base-content tracking-tight">Access Denied</h3>
          <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
            You do not have the required vendor privileges to access this console layout panel.
          </p>
          <div className="mt-6">
            <a href="/" className="btn btn-sm h-10 px-6 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-none font-bold rounded-xl tracking-wide uppercase shadow-md hover:opacity-90">
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Navigation active tab index handling
  const [activeTab, setActiveTab] = useState("Profile");
  // Mobile responsive sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: "Profile", label: "Profile", icon: <FaUser /> },
    { id: "Add tickets", label: "Add tickets", icon: <FaPlusCircle /> },
    { id: "My Added tickets", label: "My Added tickets", icon: <FaTicketAlt /> },
    { id: "Requested Bookings", label: "Requested Bookings", icon: <FaClipboardList /> },
    { id: "Revenue Overview", label: "Revenue Overview", icon: <FaChartLine /> },
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";

  // --- FORM STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "",
    price: "",
    quantity: "",
    departureTime: "",
    imageUrl: ""
  });
  
  const [perks, setPerks] = useState({
    AC: false, WiFi: false, Food: false,
    TV: false, ChargingPort: false, Breakfast: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPerks(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedPerks = Object.keys(perks).filter(key => perks[key]);
    const payload = { ...formData, perks: selectedPerks };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Ticket added successfully!");
        setFormData({ title: "", from: "", to: "", transportType: "", price: "", quantity: "", departureTime: "", imageUrl: "" });
        setPerks({ AC: false, WiFi: false, Food: false, TV: false, ChargingPort: false, Breakfast: false });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-base-content transition-colors duration-200 relative overflow-x-hidden">
      
      {/* MOBILE HEADER TOP-BAR PANEL */}
      <div className="lg:hidden w-full bg-slate-900 text-slate-200 h-16 px-4 flex items-center justify-between absolute top-0 left-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg tracking-tight text-white">
            Ticket<span className="text-amber-500">Bari</span>
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-xl focus:outline-none text-slate-200 hover:text-white"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* BACKGROUND SHADOW LAYER FOR MOBILE SIDEBAR OPEN CLICKS */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* LEFT SIDEBAR PANEL (RESPONSIVE TRANSLATION) */}
      <aside className={`w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 fixed lg:static top-0 bottom-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Brand Logo Identity Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between lg:justify-start gap-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TicketBari" className="h-8 error-fallback" onError={(e) => e.target.style.display='none'} />
            <span className="font-black text-xl tracking-tight text-white">
              Ticket<span className="text-amber-500">Bari</span>
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Dynamic Sidebar Menu Link Array */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false); // Close mobile menu drawer on click selection
                }}
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 flex items-center justify-center min-w-0">
        
        {/* RENDER PROFILE CONTENT PANEL */}
        {activeTab === "Profile" && (
          <div className="w-full max-w-2xl bg-base-100 border border-base-content/15 rounded-3xl overflow-hidden shadow-xl transition-all">
            {/* Ambient Vector Banner Top Background */}
            <div className="h-32 sm:h-44 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem] opacity-30" />
            </div>

            {/* User Metadata Presentation Identity Deck */}
            <div className="px-4 sm:px-8 pb-8 relative flex flex-col items-center -mt-12 sm:text-center">
              <div className="avatar mb-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-base-100 object-cover bg-base-200 shadow-2xl">
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

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-base-content capitalize">
                {session?.user?.name}
              </h2>
              <p className="text-xs text-base-content/50 font-medium tracking-wide mt-1 break-all">
                {session?.user?.email}
              </p>

              <button className="btn btn-sm sm:btn-md mt-6 bg-gradient-to-r from-teal-500 to-emerald-600 border-none text-white font-bold rounded-xl px-6 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <FaEdit size={14} /> Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* 🟢 FULLY RESPONSIVE INTEGRATED ADD TICKET FORM PANEL */}
        {activeTab === "Add tickets" && (
          <div className="w-full max-w-2xl bg-base-100 border border-base-content/15 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl transition-all">
            <div className="text-center mb-6 flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400">
              <FaPlusCircle size={20} />
              <h2 className="text-xl sm:text-2xl font-black tracking-wide">Add New Ticket</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" name="title" placeholder="Ticket Title" required
                value={formData.title} onChange={handleInputChange}
                className="input input-bordered w-full bg-base-200/40 rounded-xl focus:outline-teal-500 text-sm"
              />

              {/* Responsive Layout Grid splitting on matching responsive breakpoint steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" name="from" placeholder="From (Location)" required
                  value={formData.from} onChange={handleInputChange}
                  className="input input-bordered w-full bg-base-200/40 rounded-xl text-sm"
                />
                <input 
                  type="text" name="to" placeholder="To (Location)" required
                  value={formData.to} onChange={handleInputChange}
                  className="input input-bordered w-full bg-base-200/40 rounded-xl text-sm"
                />
              </div>

              <select 
                name="transportType" required value={formData.transportType} onChange={handleInputChange}
                className="select select-bordered w-full bg-base-200/40 rounded-xl text-sm text-base-content/70"
              >
                <option value="" disabled>Select Transport Type</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Flight">Flight</option>
                <option value="Launch">Launch</option>
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="number" name="price" placeholder="Price (per unit)" required min="1"
                  value={formData.price} onChange={handleInputChange}
                  className="input input-bordered w-full bg-base-200/40 rounded-xl text-sm"
                />
                <input 
                  type="number" name="quantity" placeholder="Ticket Quantity" required min="1"
                  value={formData.quantity} onChange={handleInputChange}
                  className="input input-bordered w-full bg-base-200/40 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">Departure Date & Time</label>
                <input 
                  type="datetime-local" name="departureTime" required
                  value={formData.departureTime} onChange={handleInputChange}
                  className="input input-bordered w-full bg-base-200/40 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">Perks</label>
                {/* Fixed structure grid wrap boundaries layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
                  {Object.keys(perks).map((perk) => (
                    <label key={perk} className="flex items-center gap-2.5 cursor-pointer text-sm select-none">
                      <input 
                        type="checkbox" name={perk} checked={perks[perk]} onChange={handleCheckboxChange}
                        className="checkbox checkbox-xs checkbox-primary rounded-md shrink-0" 
                      />
                      <span className="text-base-content/80 font-medium text-xs sm:text-sm truncate">
                        {perk.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <input 
                type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleInputChange}
                className="input input-bordered w-full bg-base-200/40 rounded-xl text-sm"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60">
                <input type="text" readOnly value={session?.user?.name || "vendor"} className="input input-bordered w-full bg-base-300 rounded-xl text-sm cursor-not-allowed truncate" />
                <input type="text" readOnly value={session?.user?.email || "vendor@gmail.com"} className="input input-bordered w-full bg-base-300 rounded-xl text-sm cursor-not-allowed truncate" />
              </div>

              <button 
                type="submit" disabled={loading}
                className="btn w-full bg-gradient-to-r from-teal-600 via-cyan-700 to-indigo-900 text-white font-bold border-none rounded-xl tracking-wide uppercase mt-4 shadow-md"
              >
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Add Ticket"}
              </button>
            </form>
          </div>
        )}

        {/* COMPLEMENTARY SUB-PANELS PLACEHOLDERS */}
        {activeTab !== "Profile" && activeTab !== "Add tickets" && (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-content/10 p-6 sm:p-10 max-w-md w-full shadow-md">
            <h3 className="text-lg font-bold capitalize">{activeTab} Panel</h3>
            <p className="text-xs text-base-content/60 mt-1">Real-time information streams are being calculated for optimization views.</p>
          </div>
        )}

      </main>
    </div>
  );
}