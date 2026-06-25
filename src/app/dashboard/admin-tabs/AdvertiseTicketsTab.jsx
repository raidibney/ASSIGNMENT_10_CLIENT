import React from "react";
import { FaBullhorn, FaStar, FaBan } from "react-icons/fa";

export default function AdvertiseTicketsTab({ tickets, loadingTickets, fetchAllSystemTickets, handleAdvertiseStatusUpdate }) {
  return (
    <div className="w-full bg-base-100 rounded-3xl border border-base-content/10 p-4 sm:p-6 shadow-xl transition-all">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content flex items-center gap-2">
            <FaBullhorn className="text-amber-500" /> Manage Advertisement Stream
          </h2>
          <p className="text-xs text-base-content/60 mt-0.5">Approve or reject advertisement flags for verified transport options.</p>
        </div>
        <button 
          onClick={fetchAllSystemTickets} 
          className="btn btn-xs h-8 bg-base-200 hover:bg-base-300 font-bold px-3 rounded-lg text-xs"
        >
          Sync Data Node
        </button>
      </div>

      {loadingTickets ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="loading loading-spinner loading-md text-amber-500" />
          <p className="text-xs font-mono text-base-content/40 uppercase tracking-widest">Querying Operational Database Data Vectors...</p>
        </div>
      ) : tickets.filter(t => t.status === "Approved").length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-base-content/10 rounded-2xl">
          <p className="text-sm font-semibold opacity-60">No approved tickets are available for advertisement mapping.</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full rounded-xl border border-base-content/5">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="bg-base-200 text-base-content/70 font-bold border-b border-base-content/10 text-xs sm:text-sm">
                <th className="py-4">Photo</th>
                <th>Name</th>
                <th>Route Route</th>
                <th>Transport Type</th>
                <th>Price</th>
                <th className="text-center">Ad Status</th>
                <th className="text-center">Advertisement Actions</th>
              </tr>
            </thead>
            <tbody className="text-base-content/90">
              {tickets
                .filter(ticket => ticket.status === "Approved")
                .map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-base-200/50 transition-colors border-b border-base-content/5">
                    <td>
                      <div className="avatar">
                        <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-md bg-base-200 overflow-hidden flex items-center justify-center border border-base-content/5 shadow-sm">
                          {ticket.imageUrl || ticket.photo ? (
                            <img 
                              src={ticket.imageUrl || ticket.photo} 
                              alt={ticket.title || ticket.name} 
                              className="object-cover w-full h-full" 
                              onError={(e) => { e.target.style.display='none'; }} 
                            />
                          ) : (
                            <span className="text-[10px] text-base-content/30 font-mono">No Image</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-bold tracking-tight max-w-[120px] truncate">{ticket.title || ticket.name}</td>
                    <td className="font-medium text-xs">{ticket.from} ➔ {ticket.to}</td>
                    <td>
                      <span className="badge badge-sm rounded-md font-semibold badge-ghost">
                        {ticket.transportType || ticket.type}
                      </span>
                    </td>
                    <td className="font-bold font-mono text-emerald-600 dark:text-emerald-400">৳{ticket.price}</td>
                    <td className="text-center">
                      <span className={`text-[10px] uppercase font-black px-2 py-1 rounded border tracking-wider ${
                        ticket.isAdvertised === "Approved" 
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                          : ticket.isAdvertised === "Rejected"
                          ? "bg-error/10 text-error border-error/20"
                          : "bg-slate-500/10 text-base-content/40 border-base-content/10"
                      }`}>
                        {ticket.isAdvertised || "Not Requested"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => handleAdvertiseStatusUpdate(ticket._id, "Approved")}
                          disabled={ticket.isAdvertised === "Approved"}
                          className={`btn btn-xs h-7 min-h-0 px-2.5 rounded-md font-bold tracking-wide uppercase transition-all flex items-center gap-1 border-none ${
                            ticket.isAdvertised === "Approved" 
                              ? "bg-amber-500/20 text-amber-500 cursor-not-allowed" 
                              : "bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-sm font-black"
                          }`}
                        >
                          <FaStar size={10} /> Live Promo
                        </button>
                        <button 
                          onClick={() => handleAdvertiseStatusUpdate(ticket._id, "Rejected")}
                          disabled={ticket.isAdvertised === "Rejected"}
                          className={`btn btn-xs h-7 min-h-0 px-2.5 rounded-md font-bold tracking-wide uppercase transition-all flex items-center gap-1 border-none ${
                            ticket.isAdvertised === "Rejected" 
                              ? "bg-error/20 text-error cursor-not-allowed" 
                              : "bg-error text-white hover:bg-red-600 shadow-sm"
                          }`}
                        >
                          <FaBan size={10} /> Pull Ad
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
  );
}