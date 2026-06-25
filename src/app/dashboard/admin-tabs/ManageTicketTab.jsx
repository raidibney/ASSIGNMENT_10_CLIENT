import React from "react";
import { FaCheck, FaBan } from "react-icons/fa";

export default function ManageTicketTab({ tickets, loadingTickets, fetchAllSystemTickets, handleStatusUpdate }) {
  return (
    <div className="w-full bg-base-100 rounded-3xl border border-base-content/10 p-4 sm:p-6 shadow-xl transition-all">
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
        <div className="overflow-x-auto w-full rounded-xl border border-base-content/5">
          <table className="table table-zebra w-full text-sm">
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
            <tbody className="text-base-content/90">
              {tickets.map((ticket, index) => (
                <tr key={ticket._id} className="hover:bg-base-200/50 transition-colors border-b border-base-content/5">
                  <td className="font-semibold text-base-content/50 py-4">{index + 1}</td>
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
                  <td className="font-medium">{ticket.from}</td>
                  <td className="font-medium">{ticket.to}</td>
                  <td>
                    <span className={`badge badge-sm rounded-md font-semibold ${
                      ticket.transportType === 'Flight' || ticket.type === 'Flight' ? 'badge-primary' : ticket.transportType === 'Train' || ticket.type === 'Train' ? 'badge-secondary' : 'badge-accent'
                    }`}>
                      {ticket.transportType || ticket.type}
                    </span>
                  </td>
                  <td className="font-bold font-mono text-emerald-600 dark:text-emerald-400">৳{ticket.price}</td>
                  <td className="font-medium font-mono pl-4">{ticket.quantity}</td>
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
  );
}