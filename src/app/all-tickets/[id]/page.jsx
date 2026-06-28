"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast"; 
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaTicketAlt, 
  FaChevronLeft, 
  FaBus,
  FaTrain,
  FaPlane,
  FaShip,
  FaCouch,
  FaHourglassHalf,
  FaUserLock
} from "react-icons/fa";

const BASE_API_URL = "http://localhost:7000/api";

// --- LIVE COUNTDOWN COMPONENT ---
const DepartureCountdown = ({ journeyDate }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!journeyDate) {
      setTimeLeft("No Date Provided");
      return;
    }

    const calculateRemainingIntervals = () => {
      let targetDateInstance;
      if (typeof journeyDate === "string") {
        if (journeyDate.includes("T")) {
          targetDateInstance = new Date(journeyDate);
        } else if (journeyDate.includes("-")) {
          const parts = journeyDate.split(" ")[0].split("-").map(Number);
          if (parts.length === 3) {
            targetDateInstance = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
          } else {
            targetDateInstance = new Date(journeyDate);
          }
        } else {
          targetDateInstance = new Date(journeyDate);
        }
      } else {
        targetDateInstance = new Date(journeyDate);
      }

      if (isNaN(targetDateInstance.getTime())) {
        setTimeLeft("Invalid Date Config");
        return;
      }

      const now = new Date();
      const difference = targetDateInstance.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft("Departure Passed");
        setIsExpired(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateRemainingIntervals();
    const intervalRunner = setInterval(calculateRemainingIntervals, 1000);
    return () => clearInterval(intervalRunner);
  }, [journeyDate]);

  return (
    <div className="bg-base-300/20 border border-base-content/5 p-4 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-xl ${
        isExpired 
          ? "bg-rose-500/10 text-rose-500" 
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      }`}>
        <FaHourglassHalf size={18} className={!isExpired ? "animate-spin [animation-duration:3s]" : ""} />
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase opacity-40">Departure Countdown</p>
        <p className={`text-sm font-mono font-bold mt-0.5 tracking-wide ${
          isExpired ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
        }`}>
          {timeLeft || "Calculating..."}
        </p>
      </div>
    </div>
  );
};

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id || params?.ticketId; 

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const authenticatedSessionEmail = "passenger.node@test.com"; 

  useEffect(() => {
    async function initializePagePipeline() {
      try {
        setLoading(true);
        if (authenticatedSessionEmail) {
          await fetchAndSyncDynamicUser(authenticatedSessionEmail);
        } else {
          setAuthLoading(false);
        }

        if (id && id !== "undefined") {
          await fetchTicketDetails();
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Pipeline breakdown:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    initializePagePipeline();
  }, [id]);

  const fetchAndSyncDynamicUser = async (email) => {
    try {
      setAuthLoading(true);

      const derivedName = email
        .split("@")[0]
        .split(/[._-]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      await fetch(`${BASE_API_URL}/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: derivedName,
          image: ""
        })
      });
      
      const userListResponse = await fetch(`${BASE_API_URL}/users`);
      if (userListResponse.ok) {
        const usersArray = await userListResponse.json();
        const matchedProfileNode = usersArray.find(u => u.email === email);
        
        if (matchedProfileNode) {
          setCurrentUser({
            id: matchedProfileNode._id,
            email: matchedProfileNode.email,
            name: matchedProfileNode.name && matchedProfileNode.name.toUpperCase() !== "ANONYMOUS USER" 
              ? matchedProfileNode.name 
              : derivedName,
            role: matchedProfileNode.role || "user"
          });
        }
      }
    } catch (err) {
      console.error("Dynamic auth syncing error anomaly:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchTicketDetails = async () => {
    const response = await fetch(`${BASE_API_URL}/tickets/${id}`);
    if (!response.ok) {
      const structuralFallbackText = await response.text();
      console.error(`Fetch target error (${response.status}):`, structuralFallbackText);
      throw new Error("Target payload delivered non-JSON data segments.");
    }
    const data = await response.json();
    setTicket(data);
  };

  const handleConfirmReservation = async () => {
    if (!currentUser) {
      toast.error("Please login to initialize terminal booking processes."); 
      return;
    }

    if (currentUser.role !== "user") {
      toast.error(`Booking Blocked: Your assigned role is '${currentUser.role}'. Only users can buy.`); 
      return;
    }

    if (selectedQuantity > Number(ticket.quantity)) {
      toast.error("Operation Rejected: Selection exceeds available stock parameters."); 
      return;
    }

    try {
      setBookingLoading(true);
      const completeCalculatedPrice = Number(ticket.price) * selectedQuantity;

      const response = await fetch(`${BASE_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: id,
          userEmail: currentUser.email,
          userName: currentUser.name,
          quantity: Number(selectedQuantity),
          totalPrice: completeCalculatedPrice,
          bookedAt: new Date().toISOString()
        }),
      });

      const ContentTypeHeader = response.headers.get("content-type");
      if (!ContentTypeHeader || !ContentTypeHeader.includes("application/json")) {
        const clearTextPayload = await response.text();
        throw new Error(`Server error: ${clearTextPayload}`);
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The booking transaction failed.");

      toast.success("Reservation securely saved in our registry!");
      
      setTicket(prev => ({ ...prev, quantity: prev.quantity - selectedQuantity }));
      
      setTimeout(() => {
        router.push("/my-bookings"); 
      }, 1500);

    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.message || "An exception occurred during transaction verification."); 
    } finally {
      setBookingLoading(false);
    }
  };

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

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 gap-4">
        <span className="loading loading-spinner loading-lg text-emerald-500" />
        <p className="text-xs font-mono tracking-widest uppercase opacity-60 text-base-content">
          Synchronizing travel manifest variables...
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
          <button onClick={() => router.push("/all-tickets")} className="btn btn-sm mt-6 bg-base-300 border-none rounded-xl text-base-content hover:bg-base-400">
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const transportType = ticket.transportType || ticket.type || "Bus";
  const styles = getTransportStyles(transportType);
  const TransportIcon = styles.icon;
  const isAuthorizedToBuy = currentUser && currentUser.role === "user";

  return (
    <main className="relative min-h-screen w-full py-16 px-6 lg:px-12 bg-base-100 text-base-content overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">

        <Link href="/all-tickets" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-base-content/60 hover:text-emerald-500 transition-colors mb-8 group">
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Ticket Marketplace
        </Link>

        <div className="bg-base-200/40 backdrop-blur-xl border border-base-content/10 rounded-3xl shadow-2xl overflow-hidden">
          
          <div className="relative h-64 md:h-80 w-full overflow-hidden border-b border-base-content/10">
            <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-black/20 z-10" />
            <img 
              src={ticket.imageUrl || ticket.photo || styles.fallbackImage} 
              alt={ticket.title || "Transit Banner"} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = styles.fallbackImage; }}
            />
            <div className="absolute bottom-6 left-6 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-base-100/90 border border-base-content/10 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">
              <TransportIcon className="text-emerald-500 text-sm" />
              <span>{transportType}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 border-b border-base-content/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-300/20">
            <div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-md tracking-widest">
                {ticket.status || "Active"} Profile Node
              </span>
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

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center bg-base-300/40 border border-base-content/5 rounded-2xl p-6 relative">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-mono uppercase opacity-40 flex items-center gap-1"><FaMapMarkerAlt className="text-emerald-500" /> Origin Station</span>
                <span className="text-xl font-extrabold text-base-content uppercase mt-1">{ticket.from}</span>
              </div>
              <div className="flex flex-col items-center justify-center py-4 md:py-0 border-y md:border-y-0 md:border-x border-base-content/10 my-2 md:my-0">
                <FaArrowRight className="text-emerald-500 text-lg animate-pulse" />
                <span className="text-[9px] font-mono uppercase opacity-30 mt-1 tracking-widest">Direct Route</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-mono uppercase opacity-40 flex items-center gap-1 justify-end">Destination Terminal <FaMapMarkerAlt className="text-emerald-500" /></span>
                <span className="text-xl font-extrabold text-base-content uppercase mt-1">{ticket.to}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-base-300/20 border border-base-content/5 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><FaCalendarAlt size={18} /></div>
                <div>
                  <p className="text-[10px] font-mono uppercase opacity-40">Scheduled Departure</p>
                  <p className="text-xs font-bold text-base-content mt-0.5">
                    {ticket.journeyDate ? new Date(ticket.journeyDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Not Configured"}
                  </p>
                </div>
              </div>

              <DepartureCountdown key={ticket.journeyDate || "loading"} journeyDate={ticket.journeyDate} />

              <div className="bg-base-300/20 border border-base-content/5 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500"><FaCouch size={18} /></div>
                <div>
                  <p className="text-[10px] font-mono uppercase opacity-40">Ticket Quantity Left</p>
                  <p className={`text-sm font-black mt-0.5 ${Number(ticket.quantity) <= 5 ? "text-rose-500 animate-pulse" : "text-base-content"}`}>
                    {ticket.quantity || 0} Seats Left
                  </p>
                </div>
              </div>
            </div>

            {isAuthorizedToBuy && Number(ticket.quantity) > 0 && (
              <div className="bg-base-300/10 border border-base-content/5 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-base-content/80">Select Seat Quantity:</span>
                <select 
                  className="select select-sm select-bordered rounded-xl bg-base-200 border-base-content/10 text-xs font-mono font-bold w-24 text-center"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                >
                  {[...Array(Math.min(10, Number(ticket.quantity)))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 bg-base-300/20 border-t border-base-content/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Total Estimated Price</p>
              <div className="flex items-baseline text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                <span className="text-lg font-bold mr-0.5">৳</span>
                <span>{Number(ticket.price || 0) * (isAuthorizedToBuy ? selectedQuantity : 1)}</span>
                <span className="text-xs text-base-content/50 font-normal ml-2">BDT total amount</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmReservation}
              disabled={bookingLoading || Number(ticket.quantity) <= 0 || !isAuthorizedToBuy}
              className={`btn btn-md w-full sm:w-auto px-8 border-none font-black rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all transform active:scale-95 text-slate-950 ${
                !isAuthorizedToBuy 
                  ? "bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 cursor-not-allowed" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              }`}
            >
              {bookingLoading ? (
                <><span className="loading loading-spinner loading-xs mr-2" />Locking...</>
              ) : !isAuthorizedToBuy ? (
                <>
                  <FaUserLock className="inline mr-1.5 mb-0.5 text-sm" />
                  {currentUser ? `${currentUser.role.toUpperCase()} Profile Blocked` : "Login Required"}
                </>
              ) : Number(ticket.quantity) <= 0 ? (
                "Sold Out"
              ) : (
                "Confirm & Book Reservation"
              )}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}