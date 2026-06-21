"use client";

import { useState } from "react";
import { 
  FaUser, 
  FaUsers, 
  FaTicketAlt, 
  FaAd,
  FaBars,
  FaTimes,
  FaCheck,
  FaBan,
  FaLock
} from "react-icons/fa";

export default function AdminDashboard({ session }) {
  // 🔒 ROLE SECURITY GUARD: Only allow visibility if user role is explicitly 'admin'
  if (!session || session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-200">
        <div className="text-center p-8 bg-base-100 rounded-3xl border border-base-content/10 max-w-md w-full shadow-xl">
          <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <FaLock size={26} />
          </div>
          <h3 className="text-xl font-black text-base-content tracking-tight">Access Denied</h3>
          <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
            You do not have the required administrative privileges to access this control terminal layer.
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

  // Navigation active tab layout state management
  const [activeTab, setActiveTab] = useState("Manage Ticket");
  // Mobile sidebar visibility state toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: "Profile", label: "Profile", icon: <FaUser /> },
    { id: "Manage Users", label: "Manage Users", icon: <FaUsers /> },
    { id: "Manage Ticket", label: "Manage Ticket", icon: <FaTicketAlt /> },
    { id: "Advertise Tickets", label: "Advertise Tickets", icon: <FaAd /> },
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";

  // Mock tickets data mirroring the exact 8 items shown in image_08b034.png
  const [tickets, setTickets] = useState([
    { id: 1, name: "myBusTicket", from: "Dhaka", to: "Khulna", type: "Bus", price: 450, quantity: 50, status: "Pending", photo: "" },
    { id: 2, name: "Bus4", from: "Rajshahi", to: "Ctg", type: "Bus", price: 520, quantity: 80, status: "Approved", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=60&w=100" },
    { id: 3, name: "Bus3", from: "Dhaka", to: "Gazipur", type: "Bus", price: 100, quantity: 40, status: "Approved", photo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=60&w=100" },
    { id: 4, name: "Train2", from: "Khulna", to: "Gazipur", type: "Train", price: 540, quantity: 300, status: "Approved", photo: "https://images.unsplash.com/photo-1515165504668-7894413032c7?auto=format&fit=crop&q=60&w=100" },
    { id: 5, name: "Bus1", from: "Ctg", to: "Khulna", type: "Bus", price: 540, quantity: 54, status: "Approved", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=60&w=100" },
    { id: 6, name: "Train", from: "Khulna", to: "Rajshahi", type: "Train", price: 450, quantity: 250, status: "Approved", photo: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=60&w=100" },
    { id: 7, name: "Airways", from: "Dhaka", to: "Ctg", type: "Flight", price: 5000, quantity: 40, status: "Approved", photo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=60&w=100" },
    { id: 8, name: "Dhaka Express", from: "Dhaka", to: "Khulna", type: "Bus", price: 450, quantity: 41, status: "Approved", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=60&w=100" },
  ]);

  const handleApprove = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "Approved" } : t));
  };

  const handleReject = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "Rejected" } : t));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-base-content transition-colors duration-200 relative overflow-x-hidden">
      
      {/* MOBILE TOP BAR NAVIGATION HEADER */}
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

      {/* BACKDROP SCENE OVERLAY SHADOW LAYERING FOR MOBILE MENU */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* LEFT SIDEBAR MANAGEMENT PANEL */}
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

        {/* Dynamic Sidebar Nav Tabs Mapping */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
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

      {/* RIGHT CONTENT WORKSPACE VIEWPORT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 min-w-0 w-full overflow-y-auto">
        
        {/* RENDER DYNAMIC TICKETS SYSTEM TABLE VIEW */}
        {activeTab === "Manage Ticket" && (
          <div className="w-full bg-base-100 rounded-2xl border border-base-content/10 p-4 sm:p-6 shadow-xl transition-all">
            
            {/* Header Content Counter Layout Element Matching image_08b034.png */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                Total <span className="text-emerald-500 font-black">({tickets.length})</span> Tickets Found
              </h2>
            </div>

            {/* RESPONSIVE SCROLL CONTAINMENT WRAPPER OVERFLOW BOUNDS */}
            <div className="overflow-x-auto w-full rounded-xl border border-base-content/5">
              <table className="table table-zebra w-full text-sm">
                
                {/* Table Title Headings */}
                <thead>
                  <tr className="bg-base-200 text-base-content/70 font-bold border-b border-base-content/10 text-xs sm:text-sm">
                    <th className="py-4">#</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Transport Type</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                {/* Table Body Iteration Lists Matching image_08b034.png UI rows layout exactly */}
                <tbody className="text-base-content/90">
                  {tickets.map((ticket, index) => (
                    <tr key={ticket.id} className="hover:bg-base-200/50 transition-colors border-b border-base-content/5">
                      {/* Number Counter Column index */}
                      <td className="font-semibold text-base-content/50 py-4">{index + 1}</td>
                      
                      {/* Thumbnail View Frame box */}
                      <td>
                        <div className="avatar">
                          <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-md bg-base-200 overflow-hidden flex items-center justify-center border border-base-content/5 shadow-sm">
                            {ticket.photo ? (
                              <img src={ticket.photo} alt={ticket.name} className="object-cover w-full h-full" />
                            ) : (
                              <span className="text-[10px] text-base-content/30 font-mono">No Image</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Info Parameter Elements columns */}
                      <td className="font-bold tracking-tight max-w-[120px] truncate">{ticket.name}</td>
                      <td className="font-medium">{ticket.from}</td>
                      <td className="font-medium">{ticket.to}</td>
                      
                      {/* Badge Styling for transport categories */}
                      <td>
                        <span className={`badge badge-sm rounded-md font-semibold ${
                          ticket.type === 'Flight' ? 'badge-primary' : ticket.type === 'Train' ? 'badge-secondary' : 'badge-accent'
                        }`}>
                          {ticket.type}
                        </span>
                      </td>

                      <td className="font-bold font-mono text-emerald-600 dark:text-emerald-400">৳{ticket.price}</td>
                      <td className="font-medium font-mono pl-4">{ticket.quantity}</td>
                      
                      {/* Interaction Action Trigger Execution Panel cells */}
                      <td>
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => handleApprove(ticket.id)}
                            disabled={ticket.status === "Approved"}
                            className={`btn btn-xs h-7 min-h-0 px-2.5 rounded-md font-bold tracking-wide uppercase transition-all flex items-center gap-1 border-none ${
                              ticket.status === "Approved" 
                                ? "bg-emerald-500/20 text-emerald-500 cursor-not-allowed" 
                                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                            }`}
                          >
                            <FaCheck size={10} /> {ticket.status === "Approved" ? "Approved" : "Approve"}
                          </button>
                          
                          <button 
                            onClick={() => handleReject(ticket.id)}
                            disabled={ticket.status === "Rejected"}
                            className={`btn btn-xs h-7 min-h-0 px-2.5 rounded-md font-bold tracking-wide uppercase transition-all flex items-center gap-1 border-none ${
                              ticket.status === "Rejected" 
                                ? "bg-error/20 text-error cursor-not-allowed" 
                                : "bg-error text-white hover:bg-red-600 shadow-sm"
                            }`}
                          >
                            <FaBan size={10} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        )}

        {/* PROFILE TAB INTERFACE VIEWS */}
        {activeTab === "Profile" && (
          <div className="w-full max-w-2xl bg-base-100 border border-base-content/15 rounded-3xl overflow-hidden shadow-xl mx-auto">
            <div className="h-32 sm:h-44 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem] opacity-30" />
            </div>
            <div className="px-4 sm:px-8 pb-8 relative flex flex-col items-center -mt-12 text-center">
              <div className="avatar mb-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-base-100 object-cover bg-base-200 shadow-2xl">
                  <img src={session?.user?.image || defaultAvatar} alt={session?.user?.name} />
                </div>
              </div>
              <span className="badge bg-purple-600 border-none text-white font-black text-[10px] uppercase tracking-widest px-3 py-2.5 rounded-full mb-2 shadow-sm">
                {session?.user?.role || "System Admin"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-base-content capitalize">
                {session?.user?.name || "Admin Terminal"}
              </h2>
              <p className="text-xs text-base-content/50 font-medium tracking-wide mt-1 break-all">
                {session?.user?.email || "admin@ticketbari.com"}
              </p>
            </div>
          </div>
        )}

        {/* COMPLEMENTARY FALLBACK SUB PANELS PLACEHOLDERS FOR OTHER OPTIONS */}
        {activeTab !== "Profile" && activeTab !== "Manage Ticket" && (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-content/10 p-6 sm:p-10 max-w-md w-full shadow-md mx-auto">
            <h3 className="text-lg font-bold capitalize">{activeTab} Panel</h3>
            <p className="text-xs text-base-content/60 mt-1">Real-time system configuration controls are initialized for administration nodes.</p>
          </div>
        )}

      </main>
    </div>
  );
}