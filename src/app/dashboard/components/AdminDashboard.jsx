"use client";

import { useState, useEffect } from "react";
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
  
  // Real-time API structural collection container nodes
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const menuItems = [
    { id: "Profile", label: "Profile", icon: <FaUser /> },
    { id: "Manage Users", label: "Manage Users", icon: <FaUsers /> },
    { id: "Manage Ticket", label: "Manage Ticket", icon: <FaTicketAlt /> },
    { id: "Advertise Tickets", label: "Advertise Tickets", icon: <FaAd /> },
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";

  // 📡 Network Stream Reader: Connects and parses collection database records via PORT 7000
  const fetchAllSystemTickets = async () => {
    setLoadingTickets(true);
    try {
      const response = await fetch("http://localhost:7000/api/tickets/admin");
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (err) {
      console.error("Failed fetching live admin core registry data:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  // Triggers stream lookup hook array configurations when matching constraints load
  useEffect(() => {
    if (activeTab === "Manage Ticket") {
      fetchAllSystemTickets();
    }
  }, [activeTab]);

  // 🛠️ Mutation Executor: Patches state data records dynamically using MongoDB document keys
  const handleStatusUpdate = async (ticketId, nextStatusState) => {
    try {
      const response = await fetch(`http://localhost:7000/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatusState })
      });

      if (response.ok) {
        // Optimistic UI state matrix refresh loops down directly without full reloading metrics
        setTickets(prev => 
          prev.map(ticket => 
            ticket._id === ticketId ? { ...ticket, status: nextStatusState } : ticket
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Status state update error anomaly:", err);
      alert("Failed connection matrix sync configuration changes with cluster nodes.");
    }
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
            
            {/* Header Content Counter Layout Element */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                Total <span className="text-emerald-500 font-black">({tickets.length})</span> Tickets Found
              </h2>
              <button 
                onClick={fetchAllSystemTickets} 
                className="btn btn-xs h-8 bg-base-200 hover:bg-base-300 font-bold px-3 rounded-lg text-xs"
              >
                Sync Data Node
              </button>
            </div>

            {loadingTickets ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <span className="loading loading-spinner loading-md text-emerald-500" />
                <p className="text-xs font-mono text-base-content/40 uppercase tracking-widest">Querying Operational Database Data Vectors...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
                <p className="text-sm font-semibold opacity-60">No tickets exist within the database stream.</p>
              </div>
            ) : (
              /* RESPONSIVE SCROLL CONTAINMENT WRAPPER OVERFLOW BOUNDS */
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
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body Iteration Lists */}
                  <tbody className="text-base-content/90">
                    {tickets.map((ticket, index) => (
                      <tr key={ticket._id} className="hover:bg-base-200/50 transition-colors border-b border-base-content/5">
                        {/* Number Counter Column index */}
                        <td className="font-semibold text-base-content/50 py-4">{index + 1}</td>
                        
                        {/* Thumbnail View Frame box */}
                        <td>
                          <div className="avatar">
                            <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-md bg-base-200 overflow-hidden flex items-center justify-center border border-base-content/5 shadow-sm">
                              {ticket.imageUrl || ticket.photo ? (
                                <img src={ticket.imageUrl || ticket.photo} alt={ticket.title || ticket.name} className="object-cover w-full h-full error-fallback" onError={(e) => e.target.style.display='none'} />
                              ) : (
                                <span className="text-[10px] text-base-content/30 font-mono">No Image</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Info Parameter Elements columns */}
                        <td className="font-bold tracking-tight max-w-[120px] truncate">{ticket.title || ticket.name}</td>
                        <td className="font-medium">{ticket.from}</td>
                        <td className="font-medium">{ticket.to}</td>
                        
                        {/* Badge Styling for transport categories */}
                        <td>
                          <span className={`badge badge-sm rounded-md font-semibold ${
                            ticket.transportType === 'Flight' || ticket.type === 'Flight' ? 'badge-primary' : ticket.transportType === 'Train' || ticket.type === 'Train' ? 'badge-secondary' : 'badge-accent'
                          }`}>
                            {ticket.transportType || ticket.type}
                          </span>
                        </td>

                        <td className="font-bold font-mono text-emerald-600 dark:text-emerald-400">৳{ticket.price}</td>
                        <td className="font-medium font-mono pl-4">{ticket.quantity}</td>
                        
                        {/* Status Label Tracking Indicator */}
                        <td>
                          <span className={`text-[10px] uppercase font-black px-2 py-1 rounded border tracking-wider ${
                            ticket.status === "Approved" 
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                              : ticket.status === "Rejected"
                              ? "bg-error/10 text-error border-error/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                          }`}>
                            {ticket.status || "pending"}
                          </span>
                        </td>

                        {/* Interaction Action Trigger Execution Panel cells */}
                        <td>
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => handleStatusUpdate(ticket._id, "Approved")}
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
                              onClick={() => handleStatusUpdate(ticket._id, "Rejected")}
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
            )}

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