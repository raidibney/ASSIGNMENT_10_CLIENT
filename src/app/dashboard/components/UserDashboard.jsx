"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { 
  FaUser, FaTicketAlt, FaHistory, FaCalendarAlt, 
  FaMapMarkerAlt, FaHourglassHalf, FaCreditCard, FaLock 
} from "react-icons/fa";

// --- TIMER SUB-COMPONENT INSTANCE MATRIX ---
const TicketCountdown = ({ departureDate, status }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (status === "rejected") {
      setTimeLeft("");
      return;
    }

    const calculateTime = () => {
      const difference = new Date(departureDate) - new Date();
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

    calculateTime();
    const clockInterval = setInterval(calculateTime, 1000);
    return () => clearInterval(clockInterval);
  }, [departureDate, status]);

  if (status === "rejected") return null;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-mono font-bold mt-3 px-2.5 py-1.5 rounded-lg border ${
      isExpired 
        ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
        : "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse"
    }`}>
      <FaHourglassHalf className="text-[10px]" />
      <span>{timeLeft}</span>
    </div>
  );
};

// --- CORE CONTROL LAYER DASHBOARD VIEW ---
const UserDashboard = () => {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentProcessingId, setPaymentProcessingId] = useState(null);

  // Sync up and complete state data pipeline routing actions
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchDashboardPayloads = async () => {
      setLoading(true);
      try {
        // 1. Check Stripe URL redirect params context
        const isSuccess = searchParams.get("payment_success");
        const bookingId = searchParams.get("bookingId");
        
        // Handle successful payment intercept hooks
        if (isSuccess === "true" && bookingId) {
          const verifyToast = toast.loading("Confirming transfer processing logs...");
          const res = await fetch("http://localhost:7000/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, sessionId: localStorage.getItem("last_stripe_session") || "" })
          });
          if (res.ok) {
            toast.success("Ticket unlocked! Seat allocation confirmed.", { id: verifyToast });
            router.replace("/dashboard");
          } else {
            toast.error("Validation error checking payment statuses.", { id: verifyToast });
          }
        }

        // 2. Map data fetching streams paralel arrays
        const [profileRes, bookingsRes, transRes] = await Promise.all([
          fetch(`http://localhost:7000/api/users/profile?email=${session.user.email}`),
          fetch(`http://localhost:7000/api/bookings?email=${session.user.email}`),
          fetch(`http://localhost:7000/api/transactions?email=${session.user.email}`)
        ]);

        if (profileRes.ok) setProfileData(await profileRes.json());
        if (bookingsRes.ok) setBookings(await bookingsRes.json());
        if (transRes.ok) setTransactions(await transRes.json());

      } catch (err) {
        console.error("Dashboard connection node parsing anomalies:", err);
        toast.error("Failed loading data layers securely.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardPayloads();
  }, [session, searchParams, router]);

  // Trigger payment session pipeline sequences
  const handleCheckoutPayment = async (bookingId) => {
    setPaymentProcessingId(bookingId);
    const checkoutToast = toast.loading("Contacting Stripe core terminals...");
    try {
      const res = await fetch("http://localhost:7000/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize payment gateway.");

      // Retain tracking data session indicators context
      localStorage.setItem("last_stripe_session", data.id);
      
      // Dispatch browser frame direct push to stripe checkout address space
      toast.success("Redirecting to verification gate...", { id: checkoutToast });
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Stripe module initialization aborted.", { id: checkoutToast });
      setPaymentProcessingId(null);
    }
  };

  const getStatusBadgeStyles = (status) => {
    const config = {
      pending: "bg-amber-500/10 border-amber-500/20 text-amber-500",
      accepted: "bg-sky-500/10 border-sky-500/20 text-sky-500",
      rejected: "bg-rose-500/10 border-rose-500/20 text-rose-500",
      paid: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    };
    return config[status?.toLowerCase()] || "bg-base-300 text-base-content/70";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="loading loading-spinner loading-lg text-amber-500" />
        <p className="text-xs font-mono uppercase tracking-widest text-base-content/40">Synchronizing Identity Dashboard Matrix...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 text-base-content grid lg:grid-cols-[280px_1fr] gap-8">
      
      {/* SIDEBAR NAVIGATION BLOCK ELEMENT */}
      <aside className="w-full flex flex-col gap-2 p-4 rounded-3xl border border-base-content/10 bg-base-200/40 backdrop-blur-md h-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all uppercase cursor-pointer ${
            activeTab === "profile" 
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md" 
              : "hover:bg-base-300/60 text-base-content/80"
          }`}
        >
          <FaUser className="text-sm shrink-0" /> User Profile
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all uppercase cursor-pointer ${
            activeTab === "bookings" 
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md" 
              : "hover:bg-base-300/60 text-base-content/80"
          }`}
        >
          <FaTicketAlt className="text-sm shrink-0" /> My Booked Tickets
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all uppercase cursor-pointer ${
            activeTab === "transactions" 
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md" 
              : "hover:bg-base-300/60 text-base-content/80"
          }`}
        >
          <FaHistory className="text-sm shrink-0" /> Transaction History
        </button>
      </aside>

      {/* CORE DISPLAY WINDOW PORTAL VIEW AREA CONTAINER */}
      <main className="w-full min-h-[500px]">
        
        {/* A. USER PROFILE VIEW PANEL */}
        {activeTab === "profile" && (
          <div className="w-full p-8 rounded-3xl border border-base-content/10 bg-base-200/20 backdrop-blur-xl flex flex-col md:flex-row items-center md:items-start gap-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-3xl blur-md opacity-30 group-hover:opacity-40 transition-opacity" />
              <img 
                src={profileData?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                alt={profileData?.name} 
                className="w-36 h-36 rounded-3xl object-cover border-2 border-amber-500/20 relative z-10 shadow-xl"
              />
            </div>
            <div className="flex-1 w-full text-center md:text-left">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-500">
                {profileData?.role || "Passenger Transit Member"}
              </span>
              <h2 className="text-3xl font-black tracking-tight mt-3 mb-1 text-base-content">{profileData?.name}</h2>
              <p className="text-sm font-medium text-base-content/60 mb-6">{profileData?.email}</p>
              
              <div className="w-full h-px bg-base-content/10 mb-6" />
              
              <div className="grid sm:grid-cols-2 gap-4 max-w-xl text-left">
                <div className="p-4 rounded-2xl border border-base-content/5 bg-base-300/30">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest block mb-1">Account Sync Identifier</span>
                  <p className="text-xs font-mono font-bold truncate text-base-content/80">{profileData?._id}</p>
                </div>
                <div className="p-4 rounded-2xl border border-base-content/5 bg-base-300/30">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest block mb-1">Terminal Activity Access Node</span>
                  <p className="text-xs font-mono font-bold text-base-content/80">
                    {profileData?.lastActive ? new Date(profileData.lastActive).toLocaleDateString() : "Active Now"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B. USER BOOKINGS VIEW PANEL LAYOUT GRID */}
        {activeTab === "bookings" && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
            {bookings.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-base-content/10 rounded-3xl bg-base-200/20 backdrop-blur-sm max-w-xl mx-auto">
                <p className="text-sm font-bold opacity-50">No booking request listings found in active ledger sequences.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookings.map((booking) => {
                  const isExpired = new Date() > new Date(booking.departureDate);
                  return (
                    <div 
                      key={booking._id}
                      className="group flex flex-col rounded-2xl border border-base-content/10 bg-base-200/30 hover:border-amber-500/20 shadow-md backdrop-blur-md transition-all overflow-hidden"
                    >
                      {/* Thumbnail Media Box Stack Frame */}
                      <div className="relative h-36 w-full overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-base-200/90 via-transparent to-transparent z-10" />
                        <img 
                          src={booking.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400"} 
                          alt={booking.ticketTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className={`absolute top-3 left-3 z-20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getStatusBadgeStyles(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Info core detail panels block container elements mapping space */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold text-base-content truncate group-hover:text-amber-500 transition-colors">
                            {booking.ticketTitle}
                          </h4>
                          
                          <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/70 mt-2">
                            <FaMapMarkerAlt className="text-amber-500 text-[10px]" />
                            <span className="truncate">{booking.from} ➔ {booking.to}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-semibold text-base-content/50 mt-1.5">
                            <FaCalendarAlt className="text-amber-500 text-[10px]" />
                            <span>Departure: {new Date(booking.departureDate).toLocaleString()}</span>
                          </div>

                          {/* Dynamic Countdowns Handler */}
                          <TicketCountdown departureDate={booking.departureDate} status={booking.status} />

                          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-base-content/5 text-[11px]">
                            <div>
                              <span className="text-base-content/40 block uppercase font-bold leading-none mb-1">Seats reserved</span>
                              <p className="font-mono font-bold text-base-content">{booking.bookingQuantity} Tickets</p>
                            </div>
                            <div className="text-right">
                              <span className="text-base-content/40 block uppercase font-bold leading-none mb-1">Total billing value</span>
                              <p className="font-mono font-black text-base-content text-xs">৳ {booking.unitPrice * booking.bookingQuantity}</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Pay Now Call To Action engine container trigger rows */}
                        {booking.status === "accepted" && (
                          <div className="mt-4 pt-2">
                            {isExpired ? (
                              <button 
                                disabled
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-base-300 border border-base-content/10 text-base-content/30 cursor-not-allowed"
                              >
                                <FaLock className="text-[10px]" /> Departure Deadline Cleared
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCheckoutPayment(booking._id)}
                                disabled={paymentProcessingId === booking._id}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:from-base-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
                              >
                                {paymentProcessingId === booking._id ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  <>
                                    <FaCreditCard className="text-xs" /> Pay Securely via Stripe
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* C. STRIPE LOGS TRANSACTION LEDGER TABLE MODULE VIEW */}
        {activeTab === "transactions" && (
          <div className="w-full p-6 rounded-3xl border border-base-content/10 bg-base-200/20 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            {transactions.length === 0 ? (
              <div className="text-center py-16 opacity-50 font-bold">
                No verified payment transaction logs registered with this terminal.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="table w-full border-collapse">
                  <thead>
                    <tr className="border-b border-base-content/10 text-base-content/40 text-xs uppercase tracking-wider">
                      <th className="py-4 px-4 bg-transparent font-bold text-left">Transaction ID</th>
                      <th className="py-4 px-4 bg-transparent font-bold text-left">Ticket Title</th>
                      <th className="py-4 px-4 bg-transparent font-bold text-right">Amount</th>
                      <th className="py-4 px-4 bg-transparent font-bold text-right">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="border-b border-base-content/5 hover:bg-base-300/20 transition-colors text-xs font-medium">
                        <td className="py-4 px-4 font-mono font-bold text-amber-500">{tx.transactionId}</td>
                        <td className="py-4 px-4 text-base-content/80 max-w-[180px] truncate">{tx.ticketTitle}</td>
                        <td className="py-4 px-4 font-mono font-black text-right text-base-content">৳ {tx.amount}</td>
                        <td className="py-4 px-4 text-base-content/50 font-mono text-right">
                          {new Date(tx.paymentDate).toLocaleDateString()} {new Date(tx.paymentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default UserDashboard;