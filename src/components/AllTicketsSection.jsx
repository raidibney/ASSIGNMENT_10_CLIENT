"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaBus, FaTrain, FaPlane, FaShip, FaArrowRight, FaTicketAlt } from "react-icons/fa";

const BASE_API_URL = "http://localhost:7000/api";

export default function AllTicketsSection() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTickets();
  }, []);

  const fetchApprovedTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_API_URL}/tickets/approved`);
      if (!response.ok) throw new Error("Failed to load active ticketing manifests.");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error connecting to marketplace data vector:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Style Mapper Matrix: Generates visual metadata styling parameters dynamically matching vehicle contexts
  const getTransportStyles = (type) => {
    const normalizedType = type?.toLowerCase() || "";
    
    if (normalizedType === "flight" || normalizedType === "plane") {
      return {
        icon: FaPlane,
        badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        glowColor: "group-hover:shadow-[0_8px_24px_rgba(244,63,94,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
        fallbackImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600"
      };
    }
    if (normalizedType === "train") {
      return {
        icon: FaTrain,
        badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        glowColor: "group-hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
        fallbackImage: "https://images.unsplash.com/photo-1532103054090-334e6e60ae29?auto=format&fit=crop&q=80&w=600"
      };
    }
    if (normalizedType === "launch" || normalizedType === "ship" || normalizedType === "ferry") {
      return {
        icon: FaShip,
        badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
        glowColor: "group-hover:shadow-[0_8px_24px_rgba(6,182,212,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
        fallbackImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600"
      };
    }
    return {
      icon: FaBus,
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      glowColor: "group-hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      fallbackImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600"
    };
  };

  return (
    <section className="relative w-full py-24 overflow-hidden bg-base-100 text-base-content min-h-screen transition-colors duration-300">
      
      {/* Dynamic Grid Overlay Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
            <FaTicketAlt className="text-xs" /> Marketplace
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-base-content">
            Available <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500 bg-clip-text text-transparent">Tickets</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4 mb-3" />
          <p className="max-w-md font-mono text-xs uppercase tracking-widest opacity-60 text-base-content">
            Verified Operational Transit Inventories Available on Live Stream.
          </p>
        </div>

        {/* LOADING & EMPTY SYSTEM STATE LAYOUT MATRIX */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="loading loading-spinner loading-md text-emerald-500 dark:text-emerald-400" />
            <p className="text-xs font-mono opacity-60 uppercase tracking-widest">Querying active ledger items...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 border border-base-content/10 rounded-3xl max-w-xl mx-auto bg-base-200/20 backdrop-blur-md">
            <FaTicketAlt className="mx-auto text-4xl opacity-30 mb-4 text-emerald-500" />
            <p className="text-sm font-mono opacity-60">No tickets have been approved by administration endpoints yet.</p>
          </div>
        ) : (
          /* Re-engineered Premium Ticket Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => {
              const transportType = ticket.transportType || ticket.type || "Bus";
              const styles = getTransportStyles(transportType);
              const TransportIcon = styles.icon;

              return (
                <div
                  key={ticket._id}
                  className={`group relative rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col bg-base-200/40 border border-base-content/10 hover:border-emerald-500/30 hover:-translate-y-2 shadow-md ${styles.glowColor}`}
                >
                  {/* Visual Header Image Container */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-base-100/90 via-transparent to-transparent z-10" />
                    <img
                      src={ticket.imageUrl || ticket.photo || styles.fallbackImage}
                      alt={ticket.title || `${ticket.from} to ${ticket.to}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.src = styles.fallbackImage;
                      }}
                    />
                    
                    {/* Floating Transport Type Indicator */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-base-100/90 border border-base-content/10 backdrop-blur-md rounded-xl text-xs font-bold text-base-content uppercase tracking-wider">
                      <TransportIcon className="text-emerald-500 dark:text-emerald-400" />
                      {transportType}
                    </div>

                    {/* Quantity Left Indicator Badge */}
                    <div className={`absolute top-4 right-4 z-20 text-xs px-2.5 py-1 rounded-lg font-bold border backdrop-blur-md ${
                      Number(ticket.quantity) <= 5 
                        ? "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse" 
                        : "text-base-content/80 border-base-content/10 bg-base-100/90"
                    }`}>
                      {ticket.quantity || 0} seats left
                    </div>
                  </div>

                  {/* Card Context Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-transparent">
                    <div>
                      {/* Route Title */}
                      <h3 className="text-xl font-black tracking-tight mb-2 text-base-content group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors uppercase truncate">
                        {ticket.from} ➔ {ticket.to}
                      </h3>

                      {/* Sub-Brand specification Label */}
                      <div className={`inline-block text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold border uppercase tracking-wider mb-5 ${styles.badgeColor} max-w-full truncate`}>
                        {ticket.title || ticket.name || "Standard Pathway"}
                      </div>

                      {/* Detailed Data Elements Splitter Row */}
                      <div className="grid grid-cols-2 gap-4 py-3 border-t border-b mb-6 border-base-content/10 font-mono">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-bold mb-0.5 opacity-40">Price</p>
                          <p className="text-xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                            <span className="text-xs font-bold mr-0.5">৳</span>
                            {ticket.price || 0}
                          </p>
                        </div>
                        <div className="text-right truncate">
                          <p className="text-[10px] uppercase tracking-wider font-bold mb-0.5 opacity-40">Journey Date</p>
                          <p className="text-xs font-bold mt-1 text-base-content/80 truncate">
                            {ticket.journeyDate ? new Date(ticket.journeyDate).toLocaleDateString() : "Not Specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Call To Action Interactivity Link Container */}
                    <div className="w-full">
                      <Link
                        href={`/all-tickets/${ticket._id}`}
                        className="relative overflow-hidden group/btn flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-base-300 dark:bg-slate-950/40 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 rounded-xl border border-base-content/10 hover:border-transparent text-xs font-black uppercase tracking-wider transition-all duration-300 text-base-content hover:text-slate-950 dark:hover:text-slate-950"
                      >
                        <span>See Details</span>
                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}