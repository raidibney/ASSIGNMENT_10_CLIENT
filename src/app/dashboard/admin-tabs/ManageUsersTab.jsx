import React from "react";
import { FaSkullCrossbones } from "react-icons/fa";

export default function ManageUsersTab({ loadingUsers, filteredUsers, handleUserRoleMutation, defaultAvatar }) {
  return (
    <div className="bg-base-200/40 backdrop-blur-md rounded-3xl border border-base-content/10 shadow-xl overflow-hidden">
      {loadingUsers ? (
        <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-md text-emerald-500" />
          <p className="text-xs font-mono tracking-widest uppercase opacity-50">Mapping Client Structures...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-20 text-center opacity-50 text-sm font-medium">
          No system user profiles matched the requested criteria.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-base-content/10 text-xs font-black uppercase opacity-70 text-slate-300 tracking-wider">
                <th className="py-4 px-6">Identity Profile</th>
                <th className="py-4 px-6">System Access Tier</th>
                <th className="py-4 px-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5 text-sm font-medium">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-base-100/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-11 h-11 rounded-xl ring-2 ring-base-content/5 overflow-hidden">
                          <img 
                            src={user.photo || defaultAvatar} 
                            alt={user.name} 
                            className="object-cover w-full h-full"
                            onError={(e) => { e.target.src = defaultAvatar; }}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100">{user.name || "Anonymous Cluster Node"}</h4>
                        <p className="text-xs font-mono opacity-60 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 align-middle">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                      user.role === "admin" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      user.role === "vendor" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                      user.role === "fraud" ? "bg-stone-900 text-red-400 border-red-500/40 font-black animate-pulse" :
                      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}>
                      {user.role === "fraud" && <FaSkullCrossbones size={10} />}
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 align-middle">
                    {user.role !== "admin" && (
                      <>
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleUserRoleMutation(user._id, user.email, e.target.value)}
                          className="select select-bordered select-xs h-8 rounded-lg text-xs bg-base-100 font-bold max-w-[120px] inline-block focus:outline-none"
                        >
                          <option value="user">User</option>
                          <option value="vendor">Vendor</option>
                        </select>

                        {user.role !== "fraud" ? (
                          <button
                            onClick={() => handleUserRoleMutation(user._id, user.email, "fraud")}
                            className="btn btn-xs h-8 px-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-lg uppercase tracking-wider font-bold transition-all text-[10px]"
                            title="Flag as Fraud & Drop Ticket Pool Listings"
                          >
                            Flag Fraud
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserRoleMutation(user._id, user.email, "vendor")}
                            className="btn btn-xs h-8 px-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-lg uppercase tracking-wider font-bold transition-all text-[10px]"
                          >
                            Pardon Profile
                          </button>
                        )}
                      </>
                    )}
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