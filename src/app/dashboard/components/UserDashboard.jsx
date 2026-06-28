"use client";

import { useState, useEffect } from "react";
import { FaUser, FaTicketAlt, FaHistory, FaHourglassHalf, FaCreditCard } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const BASE_API_URL = "http://localhost:7000/api";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Directly mapping to your active database profile setup
  const userEmail = "modi@gmail.com";

  useEffect(() => {
    async function fetchDashboardUser() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_API_URL}/users`);
        if (res.ok) {
          const users = await res.json();
          const match = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
          if (match) {
            setCurrentUser(match);
          }
        }
      } catch (err) {
        console.error("Dashboard profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (userEmail) fetchDashboardUser();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <span className="loading loading-spinner loading-lg text-emerald-500" />
        <p className="text-xs font-mono uppercase tracking-widest opacity-60">Loading Dashboard Manifest...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] text-base-content flex flex-col md:flex-row font-sans gap-6">
      <Toaster position="top-center" />
      
      {/* INTERNAL TAB TOGGLES MENU */}
      <div className="w-full md:w-56 flex flex-col gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`btn btn-sm justify-start font-mono text-xs uppercase ${
            activeTab === "profile" ? "btn-emerald bg-emerald-500/20 text-emerald-400 border-emerald-500" : "btn-ghost"
          }`}
        >
          <FaUser /> Profile Info
        </button>

        <button
          onClick={() => setActiveTab("tickets")}
          className={`btn btn-sm justify-start font-mono text-xs uppercase ${
            activeTab === "tickets" ? "btn-emerald bg-emerald-500/20 text-emerald-400 border-emerald-500" : "btn-ghost"
          }`}
        >
          <FaTicketAlt /> Booked Tickets
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`btn btn-sm justify-start font-mono text-xs uppercase ${
            activeTab === "transactions" ? "btn-emerald bg-emerald-500/20 text-emerald-400 border-emerald-500" : "btn-ghost"
          }`}
        >
          <FaHistory /> Paid History
        </button>
      </div>

      {/* DASHBOARD ROUTER CONTENT PORT */}
      <div className="flex-1 bg-base-200/30 border border-base-content/10 p-6 rounded-2xl backdrop-blur-md">
        {activeTab === "profile" && <UserProfileView user={currentUser} />}
        {activeTab === "tickets" && <UserBookedTicketsView userEmail={currentUser?.email} />}
        {activeTab === "transactions" && <UserTransactionHistoryView userEmail={currentUser?.email} />}
      </div>
    </div>
  );
}

function UserProfileView({ user }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black uppercase font-mono tracking-tight text-emerald-500">Identity Nodes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-300/20 p-4 rounded-xl border border-base-content/5">
        <div>
          <span className="text-[10px] font-mono uppercase opacity-40 block">User Name</span>
          <span className="text-sm font-bold capitalize">{user?.name || "Anonymous"}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase opacity-40 block">Email Anchor</span>
          <span className="text-sm font-mono">{user?.email || "N/A"}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase opacity-40 block">System Role</span>
          <span className="badge badge-sm badge-success uppercase font-mono font-bold mt-1">{user?.role}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase opacity-40 block">Database Object Key</span>
          <span className="text-xs font-mono opacity-60 block truncate mt-1">{user?._id}</span>
        </div>
      </div>
    </div>
  );
}

function UserBookedTicketsView({ userEmail }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_API_URL}/bookings/user?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchLogs();
  }, [userEmail]);

  if (loading) {
    return <span className="loading loading-spinner text-emerald-500 loading-md block mx-auto py-8" />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black uppercase font-mono tracking-tight text-emerald-500">My Orders Pipeline</h3>
      {bookings.length === 0 ? (
        <p className="text-xs font-mono opacity-50">No travel booking sequences captured for this account link.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bookings.map((item) => (
            <DashboardTicketCard key={item._id} item={item} onRefresh={fetchLogs} />
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardTicketCard({ item, onRefresh }) {
  const [countdown, setCountdown] = useState("");
  const [paying, setPaying] = useState(false);
  const status = item.status?.toLowerCase() || "pending";

  useEffect(() => {
    if (!item.journeyDate || status === "rejected") return;

    const timer = setInterval(() => {
      const delta = new Date(item.journeyDate).getTime() - new Date().getTime();
      if (delta <= 0) {
        setCountdown("EXPIRED/DEPARTED");
        clearInterval(timer);
      } else {
        const d = Math.floor(delta / (1000 * 60 * 60 * 24));
        const h = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((delta % (1000 * 60)) / 1000);
        setCountdown(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [item.journeyDate, status]);

  const handleMockStripePayment = async () => {
    try {
      setPaying(true);
      const fakeTxHash = `ch_stripe_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      const res = await fetch(`${BASE_API_URL}/bookings/${item._id}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: fakeTxHash })
      });

      if (res.ok) {
        toast.success("Stripe payload confirmed! Inventory balanced.");
        onRefresh();
      }
    } catch (err) {
      toast.error("Transaction exception occurred.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="bg-base-300/40 border border-base-content/10 p-4 rounded-xl flex flex-col justify-between gap-3">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-sm uppercase">{item.title}</h4>
            <p className="text-[10px] font-mono opacity-50 mt-0.5">Route: {item.from} ➔ {item.to}</p>
          </div>
          <span className={`badge badge-sm font-mono font-bold uppercase p-2 ${
            status === "paid" ? "badge-success" : status === "accepted" ? "badge-secondary" : "badge-warning"
          }`}>{status}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-3 bg-base-100/50 p-2 rounded-lg">
          <div>
            <span className="opacity-40 block text-[8px]">SEATS</span>
            <span>{item.quantity} Seat(s)</span>
          </div>
          <div>
            <span className="opacity-40 block text-[8px]">TOTAL DEBIT</span>
            <span className="text-emerald-500 font-bold">৳ {item.totalPrice}</span>
          </div>
        </div>
      </div>

      {countdown && (
        <div className="text-center font-mono text-[11px] bg-base-200/60 p-1.5 rounded-md">
          Time left: <span className="text-emerald-400 font-bold">{countdown}</span>
        </div>
      )}

      {status === "accepted" && (
        <button 
          onClick={handleMockStripePayment}
          disabled={paying}
          className="btn btn-xs btn-success text-slate-950 font-mono w-full tracking-wider mt-1"
        >
          {paying ? "Processing..." : "💳 Pay Now via Stripe"}
        </button>
      )}
    </div>
  );
}

function UserTransactionHistoryView({ userEmail }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/bookings/user?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const list = await res.json();
          setTxs(list.filter(b => b.status?.toLowerCase() === "paid"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (userEmail) fetchHistory();
  }, [userEmail]);

  if (loading) return <span className="loading loading-spinner text-emerald-500 block mx-auto" />;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black uppercase font-mono tracking-tight text-emerald-500">Payment Audit Logs</h3>
      <div className="overflow-x-auto">
        <table className="table table-xs w-full font-mono">
          <thead>
            <tr className="bg-base-200 opacity-60">
              <th>Stripe Token Ref</th>
              <th>Amount</th>
              <th>Transit Context</th>
            </tr>
          </thead>
          <tbody>
            {txs.length === 0 ? (
              <tr><td colSpan="3" className="text-center opacity-40 py-4">No cleared payments.</td></tr>
            ) : (
              txs.map(tx => (
                <tr key={tx._id} className="hover:bg-base-200/50">
                  <td className="text-emerald-400 font-bold">{tx.transactionId || "System-Fallback"}</td>
                  <td className="font-bold">৳{tx.totalPrice}</td>
                  <td className="uppercase font-sans font-bold">{tx.title}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}