"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrain, FaArrowRight, FaClock, FaCheckCircle, FaPlane, FaBus } from "react-icons/fa";

const LatestTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📡 Public Stream Reader: Connects and parses approved ticket vector streams
  useEffect(() => {
    const fetchApprovedTickets = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/tickets/approved");
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        }
      } catch (err) {
        console.error("Failed fetching live approved landing dataset layout:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTickets();
  }, []);

  // Helper utility function to render correct structural travel category icons dynamically
  const getTransportIcon = (type) => {
    const checkType = type?.toLowerCase();
    if (checkType === "flight" || checkType === "plane") return <FaPlane className="text-amber-500" />;
    if (checkType === "bus") return <FaBus className="text-amber-500" />;
    return <FaTrain className="text-amber-500" />; // Fallback default icon
  };

  return (
    <section className="relative w-full transition-colors duration-300 py-24 bg-base-100 text-base-content overflow-hidden">
      
      {/* Subtle background ambient mesh glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.01] dark:bg-amber-400/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-4 animate-pulse">
            <FaClock className="text-xs" /> Recently Added
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-base-content">
            Latest <span className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">Tickets</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-4 mb-3" />
          <p className="max-w-md font-light sm:text-lg text-base-content/70">
            Real-time deployment streams of newly approved transport pathways across the map.
          </p>
        </div>

        {/* LOADING STATE INDICATOR MATRIX */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="loading loading-spinner loading-md text-amber-500" />
            <p className="text-xs font-mono text-base-content/40 uppercase tracking-widest">Querying Active Journey Data Pools...</p>
          </div>
        ) : tickets.length === 0 ? (
          /* EMPTY SYSTEM STATE CORNER FALLBACK */
          <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl max-w-xl mx-auto bg-base-200/20 backdrop-blur-sm">
            <p className="text-sm font-semibold opacity-60">No active pathways matches found for current upcoming dates.</p>
          </div>
        ) : (
          /* Premium Active Live Grid layout */
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="group relative rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col border border-base-content/10 bg-base-200/40 hover:-translate-y-2 hover:border-amber-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.05)] dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
              >
                {/* Media Frame Layer */}
                <div className="relative h-44 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent z-10" />
                  <img
                    src={ticket.imageUrl || ticket.photo || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600"}
                    alt={ticket.title || ticket.name || "ticket"}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600";
                    }}
                  />

                  {/* Cyber badge for Transport class */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-base-100/90 border border-base-content/10 backdrop-blur-md rounded-lg text-[11px] font-bold text-base-content capitalize">
                    {getTransportIcon(ticket.transportType || ticket.type)} {ticket.transportType || ticket.type || "Transport"}
                  </div>

                  {/* Seat counts status / Quantity left */}
                  <div className="absolute top-3 right-3 z-20 text-[11px] px-2 py-1 rounded-lg font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
                    {ticket.quantity || 0} seats left
                  </div>
                </div>

                {/* Information Container Elements */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold tracking-wide text-base-content group-hover:text-amber-500 transition-colors truncate">
                      {ticket.from} ➔ {ticket.to}
                    </h3>
                    
                    {/* Micro line details displaying Target Journey Departure Date */}
                    <div className="flex items-center gap-1.5 mt-2 mb-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400/90">
                      <FaCheckCircle className="text-xs shrink-0" />
                      <span className="truncate">
                        {ticket.journeyDate ? `Date: ${ticket.journeyDate}` : "Free Snacks Included"}
                      </span>
                    </div>

                    {/* Horizontal split border separator */}
                    <div className="w-full h-px bg-base-content/5 mb-4" />
                  </div>

                  {/* Call Out Pricing & Navigation Button */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-base-content/40 block leading-none mb-1">
                        Fare Value
                      </span>
                      <p className="text-xl font-black tracking-tight text-base-content">
                        <span className="text-amber-500 text-sm font-bold mr-0.5">৳</span>
                        {ticket.price || 0}
                      </p>
                    </div>

                    <Link
                      href={`/tickets/${ticket._id}`}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-base-300 border border-base-content/5 text-base-content group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-slate-950 group-hover:border-transparent transition-all duration-300"
                      aria-label="See Ticket Details"
                    >
                      <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default LatestTickets;