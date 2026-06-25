import React from "react";

export default function ProfileTab({ session, defaultAvatar }) {
  return (
    <div className="w-full max-w-2xl bg-base-100 border border-base-content/15 rounded-3xl overflow-hidden shadow-xl mx-auto">
      <div className="h-32 sm:h-44 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem] opacity-30" />
      </div>
      <div className="px-4 sm:px-8 pb-8 relative flex flex-col items-center -mt-12 text-center">
        <div className="avatar mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-base-100 object-cover bg-base-200 shadow-2xl overflow-hidden">
            <img src={session?.user?.image || defaultAvatar} alt={session?.user?.name || "Admin Portrait"} />
          </div>
        </div>
        <span className="badge bg-purple-600 border-none text-white font-black text-[10px] uppercase tracking-widest px-3 py-2.5 rounded-full mb-2 shadow-sm">
          {session?.user?.role || "System Admin"}
        </span>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-base-content capitalize">
          {session?.user?.name || "Admin Terminal"}
        </h2>
        <p className="text-xs text-base-content/50 font-medium tracking-wide mt-1 break-all">
          {session?.user?.email || "admin@ticketbari.com"}
        </p>
      </div>
    </div>
  );
}