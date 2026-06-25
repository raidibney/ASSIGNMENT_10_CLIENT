"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaTicketAlt, 
  FaChevronLeft, 
  FaShieldAlt, 
  FaClock,
  FaBus,
  FaTrain,
  FaPlane,
  FaShip,
  FaCouch,
  FaCheckCircle
} from "react-icons/fa";

const BASE_API_URL = "http://localhost:7000/api";

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id || params?.ticketId; 

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
    } else {
      console.warn("Target index identifier signature is missing from dynamic parameters structure.");
      setLoading(false);
      setError(true);
    }
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await fetch(`${BASE_API_URL}/tickets/${id}`);
      if (!response.ok) throw new Error("Ticket not found in system matrix.");
      
      const data = await response.json();
      setTicket(data);
    } catch (err) {
      console.error("Error connecting to data node:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic context mapper matching vehicle presets
  const getTransportStyles = (type) => {
    const normalizedType = type?.toLowerCase() || "";
    if (normalizedType === "flight" || normalizedType === "plane") {
      return { icon: FaPlane, fallbackImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200" };
    }
    if (normalizedType === "train") {
      return { icon: FaTrain, fallbackImage: "https://images.unsplash.com/photo-1532103054090-334e6e60ae29?auto=format&fit=crop&q=80&w=1200" };
    }
    if (normalizedType === "launch" || normalizedType === "ship" || normalizedType === "ferry") {
      return { icon: FaShip, fallbackImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200" };
    }
    return { icon: FaBus, fallbackImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200" };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 gap-4">
        <span className="loading loading-spinner loading-lg text-emerald-500" />
        <p className="text-xs font-mono tracking-widest uppercase opacity-60 text-base-content">
          Decompressing travel manifest variables...
        </p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6 text-center">
        <div className="max-w-md bg-base-200/40 backdrop-blur-md border border-base-content/10 p-8 rounded-3xl shadow-xl">
          <FaTicketAlt className="mx-auto text-4xl text-rose-500 opacity-40 mb-4" />
          <h3 className="text-lg font-bold text-base-content">Data Sync Fault</h3>
          <p className="text-sm text-base-content/60 mt-2">
            The requested travel ticket parameter could not be verified against live database records.
          </p>
          <button 
            onClick={() => router.push("/all-tickets")} 
            className="btn btn-sm mt-6 bg-base-300 border-none rounded-xl text-base-content hover:bg-base-400"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const transportType = ticket.transportType || ticket.type || "Bus";
  const styles = getTransportStyles(transportType);
  const TransportIcon = styles.icon;

  return (
    <main className="relative min-h-screen w-full py-16 px-6 lg:px-12 bg-base-100 text-base-content overflow-hidden transition-colors duration-300">
      
      {/* Background Decoratives */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation Action Anchor */}
        <Link 
          href="/all-tickets" 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-base-content/60 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-8 group"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Ticket Marketplace
        </Link>

        {/* Premium Core Glassmorphic Presentation Container */}
        <div className="bg-base-200/40 backdrop-blur-xl border border-base-content/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Dynamic Banner Cover Image Frame */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden border-b border-base-content/10">
            <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-black/20 z-10" />
            <img 
              src={ticket.imageUrl || ticket.photo || styles.fallbackImage} 
              alt={ticket.title || "Transit Banner"} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = styles.fallbackImage; }}
            />
            
            {/* Floating Transport Icon Badge inside Banner */}
            <div className="absolute bottom-6 left-6 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-base-100/90 border border-base-content/10 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">
              <TransportIcon className="text-emerald-500 dark:text-emerald-400 text-sm" />
              <span>{transportType}</span>
            </div>
          </div>

          {/* Header Description Matrix Block */}
          <div className="p-6 md:p-8 border-b border-base-content/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-300/20">
            <div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-md tracking-widest">
                {ticket.status || "Active"} Profile Node
              </span>
              {/* Ticket Title Segment */}
              <h1 className="text-2xl md:text-4xl font-black text-base-content mt-3 uppercase tracking-tight">
                {ticket.title || "Standard Route Manifest"}
              </h1>
            </div>
            
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-mono uppercase opacity-40 tracking-wider">Assigned Provider</p>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-1 truncate max-w-[240px]" title={ticket.vendorEmail}>
                {ticket.vendorEmail || "system.provider@api.node"}
              </p>
            </div>
          </div>

          {/* Core Body Info Block */}
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Transit Route Layout Vector Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center bg-base-300/40 border border-base-content/5 rounded-2xl p-6 relative">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-mono uppercase opacity-40 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-emerald-500" /> Origin Station
                </span>
                <span className="text-xl font-extrabold text-base-content uppercase mt-1">{ticket.from}</span>
              </div>

              <div className="flex flex-col items-center justify-center py-4 md:py-0 border-y md:border-y-0 md:border-x border-base-content/10 my-2 md:my-0">
                <FaArrowRight className="text-emerald-500 dark:text-emerald-400 text-lg animate-pulse" />
                <span className="text-[9px] font-mono uppercase opacity-30 mt-1 tracking-widest">Direct Transit Route</span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-mono uppercase opacity-40 flex items-center gap-1 justify-end">
                  Destination Terminal <FaMapMarkerAlt className="text-emerald-500" />
                </span>
                <span className="text-xl font-extrabold text-base-content uppercase mt-1">{ticket.to}</span>
              </div>
            </div>

            {/* Structural Core Attribute Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Scheduled Departure Card */}
              <div className="bg-base-300/20 border border-base-content/5 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 dark:text-emerald-400">
                  <FaCalendarAlt size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase opacity-40">Scheduled Departure</p>
                  <p className="text-sm font-bold text-base-content mt-0.5">
                    {ticket.journeyDate 
                      ? new Date(ticket.journeyDate).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) 
                      : "Not Configured"}
                  </p>
                </div>
              </div>

              {/* Total Stock Available Card */}
              <div className="bg-base-300/20 border border-base-content/5 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <FaCouch size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase opacity-40">Ticket Quantity Left</p>
                  <p className={`text-sm font-black mt-0.5 ${Number(ticket.quantity) <= 5 ? "text-rose-500 animate-pulse" : "text-base-content"}`}>
                    {ticket.quantity || 0} Available Units
                  </p>
                </div>
              </div>

            </div>

            {/* Premium Perks & Features Container Segment */}
            <div className="bg-base-300/20 border border-base-content/5 p-6 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-base-content/50 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-emerald-500" /> Embedded Path System Perks
              </h3>
              
              {ticket.perks && ticket.perks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ticket.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-base-content/80 font-mono">
                      <FaCheckCircle className="text-emerald-500 text-sm flex-shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-base-content/70 font-mono"><FaCheckCircle className="text-emerald-500" /> Complimentary Mineral Water</div>
                  <div className="flex items-center gap-2.5 text-xs text-base-content/70 font-mono"><FaCheckCircle className="text-emerald-500" /> High-Speed Wi-Fi Terminal Matrix</div>
                  <div className="flex items-center gap-2.5 text-xs text-base-content/70 font-mono"><FaCheckCircle className="text-emerald-500" /> Premium Adjustable Lounger Seats</div>
                  <div className="flex items-center gap-2.5 text-xs text-base-content/70 font-mono"><FaCheckCircle className="text-emerald-500" /> Air Conditioning Escrow Environment</div>
                </div>
              )}
            </div>

            {/* Additional Info / Terms Box */}
            <div className="bg-amber-500/[0.03] border border-amber-500/20 rounded-2xl p-5 flex items-start gap-3">
              <FaClock className="text-amber-600 dark:text-amber-500/70 mt-0.5 flex-shrink-0" size={14} />
              <div className="text-xs text-base-content/70 space-y-1">
                <p className="font-bold text-amber-600 dark:text-amber-500/90 uppercase tracking-wider font-mono text-[10px]">Important Operational Note:</p>
                <p>Please arrive at the terminal platform gateway at least 30 minutes before your route departure configuration sequence initializes.</p>
              </div>
            </div>

          </div>

          {/* Checkout/Pricing Purchase Footer Section Bar */}
          <div className="p-6 md:p-8 bg-base-300/20 border-t border-base-content/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Price (per unit)</p>
              <div className="flex items-baseline text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                <span className="text-lg font-bold mr-0.5">৳</span>
                <span>{ticket.price || "0"}</span>
                <span className="text-xs text-base-content/50 font-normal ml-2">BDT flat rate inclusive taxes</span>
              </div>
            </div>

            <button className="btn btn-md w-full sm:w-auto px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-none text-slate-950 font-black rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all transform active:scale-95">
              Confirm & Book Reservation
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}