"use client";

import { useState, useEffect } from "react";
import { 
  FaUser, 
  FaPlusCircle, 
  FaTicketAlt, 
  FaClipboardList, 
  FaChartLine, 
  FaEdit,
  FaBars,
  FaTimes,
  FaLock,
  FaTrashAlt
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

  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [fetchingTickets, setFetchingTickets] = useState(false);

  // Modal & Update Tracking State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "", from: "", to: "", transportType: "", price: "", quantity: "", departureTime: "", imageUrl: ""
  });
  const [editPerks, setEditPerks] = useState({
    AC: false, WiFi: false, Food: false, TV: false, ChargingPort: false, Breakfast: false
  });

  const menuItems = [
    { id: "Profile", label: "Profile", icon: <FaUser /> },
    { id: "Add tickets", label: "Add tickets", icon: <FaPlusCircle /> },
    { id: "My Added tickets", label: "My Added tickets", icon: <FaTicketAlt /> },
    { id: "Requested Bookings", label: "Requested Bookings", icon: <FaClipboardList /> },
    { id: "Revenue Overview", label: "Revenue Overview", icon: <FaChartLine /> },
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", from: "", to: "", transportType: "", price: "", quantity: "", departureTime: "", imageUrl: ""
  });
  
  const [perks, setPerks] = useState({
    AC: false, WiFi: false, Food: false, TV: false, ChargingPort: false, Breakfast: false
  });

  const fetchVendorTickets = async () => {
    if (!session?.user?.email) return;
    setFetchingTickets(true);
    try {
      const response = await fetch(`http://localhost:7000/api/tickets/vendor?email=${session.user.email}`);
      if (response.ok) {
        const data = await response.json();
        setMyTickets(data);
      }
    } catch (err) {
      console.error("Backend node network parsing anomaly:", err);
    } finally {
      setFetchingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === "My Added tickets") {
      fetchVendorTickets();
    }
  }, [activeTab]);

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
    const payload = { 
      ...formData, 
      perks: selectedPerks,
      vendorName: session?.user?.name || "Anonymous Vendor",
      vendorEmail: session?.user?.email || "vendor@gmail.com"
    };

    try {
      const response = await fetch("http://localhost:7000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Ticket added successfully!");
        setFormData({ title: "", from: "", to: "", transportType: "", price: "", quantity: "", departureTime: "", imageUrl: "" });
        setPerks({ AC: false, WiFi: false, Food: false, TV: false, ChargingPort: false, Breakfast: false });
        fetchVendorTickets();
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

  // 🛠️ open editing environment system fields mapper
  const openEditModal = (ticket) => {
    setEditingTicketId(ticket._id);
    setEditFormData({
      title: ticket.title || "",
      from: ticket.from || "",
      to: ticket.to || "",
      transportType: ticket.transportType || "",
      price: ticket.price || "",
      quantity: ticket.quantity || "",
      departureTime: ticket.departureTime ? ticket.departureTime.substring(0, 16) : "",
      imageUrl: ticket.imageUrl || ""
    });

    // Reset and check assigned list mapping
    const baselinePerks = { AC: false, WiFi: false, Food: false, TV: false, ChargingPort: false, Breakfast: false };
    if (ticket.perks && Array.isArray(ticket.perks)) {
      ticket.perks.forEach(perk => {
        if (baselinePerks[perk] !== undefined) baselinePerks[perk] = true;
      });
    }
    setEditPerks(baselinePerks);
    setIsEditModalOpen(true);
  };

  // 📝 Save updated fields controller
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedPerks = Object.keys(editPerks).filter(key => editPerks[key]);
    const payload = { ...editFormData, perks: selectedPerks };

    try {
      const response = await fetch(`http://localhost:7000/api/tickets/${editingTicketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Ticket updated successfully!");
        setIsEditModalOpen(false);
        fetchVendorTickets();
      } else {
        const data = await response.json();
        alert(`Update Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update execution matrix pipeline.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete configuration item route trigger
  const handleDeleteTicket = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to delete this ticket entry permanently?")) return;
    
    try {
      const response = await fetch(`http://localhost:7000/api/tickets/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        alert("Ticket deleted successfully!");
        fetchVendorTickets();
      } else {
        alert("Failed to wipe ticket instance data from infrastructure node.");
      }
    } catch (err) {
      console.error(err);
      alert("Connection processing fault encountered upon drop call.");
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

      {/* RIGHT CONTENT DISPLAY WINDOW */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 flex items-center justify-center min-w-0">
        
        {/* RENDER PROFILE CONTENT PANEL */}
        {activeTab === "Profile" && (
          <div className="w-full max-w-2xl bg-base-100 border border-base-content/15 rounded-3xl overflow-hidden shadow-xl transition-all">
            <div className="h-32 sm:h-44 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem] opacity-30" />
            </div>

            <div className="px-4 sm:px-8 pb-8 relative flex flex-col items-center -mt-12 sm:text-center">
              <div className="avatar mb-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-base-100 object-cover bg-base-200 shadow-2xl">
                  <img 
                    src={session?.user?.image || defaultAvatar} 
                    alt={session?.user?.name} 
                  />
                </div>
              </div>

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

        {/* FULLY RESPONSIVE INTEGRATED ADD TICKET FORM PANEL */}
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

        {/* 🟢 RENDER CONNECTED LIVE TICKETS LIST STREAM WITH UPDATE/DELETE CONTROLS */}
        {activeTab === "My Added tickets" && (
          <div className="w-full max-w-4xl bg-base-100 border border-base-content/15 rounded-3xl p-6 sm:p-8 shadow-xl transition-all">
            <div className="mb-6 flex items-center justify-between border-b border-base-content/10 pb-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <FaTicketAlt size={22} />
                <h2 className="text-xl sm:text-2xl font-black tracking-wide">My Added Tickets</h2>
              </div>
              <span className="badge badge-neutral text-xs font-mono font-bold px-3 py-2.5 rounded-lg">
                Total: {myTickets.length}
              </span>
            </div>

            {fetchingTickets ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="loading loading-spinner loading-md text-emerald-500" />
                <p className="text-xs text-base-content/50 font-mono uppercase tracking-widest">Querying Cloud Database Nodes...</p>
              </div>
            ) : myTickets.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
                <p className="text-sm font-semibold opacity-60">No tickets found on your vendor node.</p>
                <p className="text-xs opacity-40 mt-1">Tickets you create using the "Add Tickets" menu link will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTickets.map((ticket) => (
                  <div key={ticket._id} className="bg-base-200/40 border border-base-content/5 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between p-4 relative">
                    <div>
                      {ticket.imageUrl && (
                        <img 
                          src={ticket.imageUrl} 
                          alt={ticket.title} 
                          className="w-full h-32 object-cover rounded-xl mb-3 error-fallback"
                          onError={(e) => e.target.style.display='none'}
                        />
                      )}
                      
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-base text-base-content tracking-tight truncate max-w-[70%]">{ticket.title}</h4>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="badge badge-sm bg-teal-500/10 text-teal-500 border border-teal-500/20 font-bold px-2 py-2 rounded-md">
                            {ticket.transportType}
                          </span>
                          
                          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border tracking-wider mt-1 ${
                            ticket.status === "Approved" 
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                              : ticket.status === "Rejected"
                              ? "bg-error/10 text-error border-error/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                          }`}>
                            {ticket.status || "pending"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-base-content/60 mt-1.5 font-medium">
                        Route: <span className="text-base-content font-semibold">{ticket.from}</span> → <span className="text-base-content font-semibold">{ticket.to}</span>
                      </p>
                      <p className="text-xs text-base-content/50 font-mono mt-1">
                        Departure: {new Date(ticket.departureTime).toLocaleString()}
                      </p>
                      
                      {ticket.perks && ticket.perks.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {ticket.perks.map((perk, idx) => (
                            <span key={idx} className="bg-base-300 text-base-content/70 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {perk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ACTION PANEL MATRIX FOR UPDATE / DELETE OPERATIONS */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-base-content/10 mt-4 pt-3 gap-3">
                      <div className="flex justify-between sm:block">
                        <span className="text-[10px] uppercase font-mono block tracking-wider opacity-40">Price & Available Qty</span>
                        <div className="text-sm font-bold text-base-content/80">
                          <span className="text-emerald-500 font-black text-base mr-1.5">{ticket.price} BDT</span> 
                          <span className="text-xs">({ticket.quantity} Left)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 justify-end">
                        <button 
                          onClick={() => openEditModal(ticket)}
                          className="btn btn-xs h-8 px-2.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white border border-blue-500/10 rounded-lg flex items-center gap-1 font-bold transition-all"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTicket(ticket._id)}
                          className="btn btn-xs h-8 px-2.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/10 rounded-lg flex items-center gap-1 font-bold transition-all"
                        >
                          <FaTrashAlt size={11} /> Delete
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPLEMENTARY SUB-PANELS PLACEHOLDERS */}
        {activeTab !== "Profile" && activeTab !== "Add tickets" && activeTab !== "My Added tickets" && (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-content/10 p-6 sm:p-10 max-w-md w-full shadow-md">
            <h3 className="text-lg font-bold capitalize">{activeTab} Panel</h3>
            <p className="text-xs text-base-content/60 mt-1">Real-time information streams are being calculated for optimization views.</p>
          </div>
        )}

      </main>

      {/* 📝 OVERLAY UPDATE FIELD DIALOG CONTROLLER (MODAL) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 border border-base-content/15 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-base-content/50 hover:text-base-content p-1"
            >
              <FaTimes size={18} />
            </button>
            
            <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
              <FaEdit /> Modify Ticket Fields
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5">
              <div className="form-control">
                <label className="label text-xs font-bold tracking-wide opacity-70">Ticket Title</label>
                <input 
                  type="text" required value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({...prev, title: e.target.value}))}
                  className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm focus:outline-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-bold tracking-wide opacity-70">From</label>
                  <input 
                    type="text" required value={editFormData.from}
                    onChange={(e) => setEditFormData(prev => ({...prev, from: e.target.value}))}
                    className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="label text-xs font-bold tracking-wide opacity-70">To</label>
                  <input 
                    type="text" required value={editFormData.to}
                    onChange={(e) => setEditFormData(prev => ({...prev, to: e.target.value}))}
                    className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="label text-xs font-bold tracking-wide opacity-70">Type</label>
                  <select 
                    value={editFormData.transportType}
                    onChange={(e) => setEditFormData(prev => ({...prev, transportType: e.target.value}))}
                    className="select select-bordered w-full bg-base-200/50 rounded-xl text-sm"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Flight">Flight</option>
                    <option value="Launch">Launch</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs font-bold tracking-wide opacity-70">Price (BDT)</label>
                  <input 
                    type="number" required min="1" value={editFormData.price}
                    onChange={(e) => setEditFormData(prev => ({...prev, price: e.target.value}))}
                    className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="label text-xs font-bold tracking-wide opacity-70">Quantity</label>
                  <input 
                    type="number" required min="1" value={editFormData.quantity}
                    onChange={(e) => setEditFormData(prev => ({...prev, quantity: e.target.value}))}
                    className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold tracking-wide opacity-70">Departure Matrix Time</label>
                <input 
                  type="datetime-local" required value={editFormData.departureTime}
                  onChange={(e) => setEditFormData(prev => ({...prev, departureTime: e.target.value}))}
                  className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">Perks</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1">
                  {Object.keys(editPerks).map((perk) => (
                    <label key={perk} className="flex items-center gap-2 cursor-pointer text-xs select-none">
                      <input 
                        type="checkbox" checked={editPerks[perk]}
                        onChange={(e) => setEditPerks(prev => ({ ...prev, [perk]: e.target.checked }))}
                        className="checkbox checkbox-xs checkbox-info rounded-md shrink-0" 
                      />
                      <span className="text-base-content/80 truncate">{perk.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold tracking-wide opacity-70">Image URL</label>
                <input 
                  type="url" value={editFormData.imageUrl}
                  onChange={(e) => setEditFormData(prev => ({...prev, imageUrl: e.target.value}))}
                  className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center gap-3 justify-end pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-sm h-10 px-4 btn-ghost rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={loading}
                  className="btn btn-sm h-10 px-5 bg-blue-600 text-white font-bold border-none rounded-xl tracking-wide uppercase shadow-md hover:bg-blue-700"
                >
                  {loading ? <span className="loading loading-spinner loading-xs" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}