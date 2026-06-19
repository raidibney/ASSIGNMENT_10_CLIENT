"use client";

import Link from "next/link";
import { FaBus, FaTrain, FaPlane, FaShip, FaArrowRight, FaTicketAlt } from "react-icons/fa";

// Upgraded realistic, mock data matching each distinct transport type
const featuredTickets = [
  {
    id: 1,
    route: "Dhaka ➔ Cox's Bazar",
    price: "1,200",
    quantity: 12,
    transport: "Bus",
    icon: FaBus,
    tag: "Scania Multi-Axle",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    glowColor: "group-hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    route: "Dhaka ➔ Chattogram",
    price: "850",
    quantity: 4,
    transport: "Train",
    icon: FaTrain,
    tag: "Subarna Express",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    glowColor: "group-hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    image: "https://images.unsplash.com/photo-1532103054090-334e6e60ae29?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    route: "Dhaka ➔ Barishal",
    price: "1,500",
    quantity: 28,
    transport: "Launch",
    icon: FaShip,
    tag: "Luxury Semi-VIP",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    glowColor: "group-hover:shadow-[0_8px_24px_rgba(6,182,212,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    route: "Dhaka ➔ Jashore",
    price: "3,800",
    quantity: 7,
    transport: "Flight",
    icon: FaPlane,
    tag: "Premium Economy",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    glowColor: "group-hover:shadow-[0_8px_24px_rgba(244,63,94,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    route: "Dhaka ➔ Sylhet",
    price: "700",
    quantity: 42,
    transport: "Bus",
    icon: FaBus,
    tag: "Ena E-Class",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    glowColor: "group-hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    route: "Chattogram ➔ Cox's Bazar",
    price: "450",
    quantity: 19,
    transport: "Train",
    icon: FaTrain,
    tag: "Tourist Special",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    glowColor: "group-hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)] dark:group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=600",
  },
];

const AdvertisementSection = () => {
  return (
    /* UPDATED: Uses DaisyUI base background fields to dynamically scale theme colors */
    <section className="relative w-full transition-colors duration-300 py-24 overflow-hidden bg-base-100 text-base-content">
      
      {/* Sci-Fi Lighting Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.02] dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.02] dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-4">
            <FaTicketAlt className="text-xs" /> Hot Deals
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-base-content">
            Featured <span className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">Tickets</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-4 mb-3" />
          <p className="max-w-md font-light sm:text-lg text-base-content/70">
            Handpicked premier routes curated for optimal speed, comfort, and security.
          </p>
        </div>

        {/* Dynamic Ticket Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTickets.map((ticket) => {
            const TransportIcon = ticket.icon;

            return (
              <div
                key={ticket.id}
                className={`group relative rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 border bg-base-200/50 border-base-content/10 hover:border-base-content/20 ${ticket.glowColor}`}
              >
                {/* Visual Header Image Container */}
                <div className="relative h-52 w-full overflow-hidden">
                  {/* FIXED: Dynamic color fading layer replacing hardcoded dark fallback grids */}
                  <div className="absolute inset-0 bg-gradient-to-t from-base-200/80 via-transparent to-transparent z-10" />
                  <img
                    src={ticket.image}
                    alt={ticket.route}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Floating Transport Type Indicator */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-base-100/90 border border-base-content/10 backdrop-blur-md rounded-xl text-xs font-bold text-base-content shadow-lg">
                    <TransportIcon className="text-amber-500 dark:text-amber-400" />
                    {ticket.transport}
                  </div>

                  {/* Quantity Left Indicator Badge */}
                  <div className={`absolute top-4 right-4 z-20 text-xs px-2.5 py-1 rounded-lg font-bold border backdrop-blur-md ${
                    ticket.quantity <= 5 
                      ? "text-rose-600 border-rose-300 bg-base-100/90 dark:text-rose-400 dark:border-rose-300/30 animate-pulse" 
                      : "text-base-content/80 border-base-content/10 bg-base-100/90"
                  }`}>
                    {ticket.quantity} seats left
                  </div>
                </div>

                {/* Card Context Body */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-transparent">
                  <div>
                    {/* Route Title */}
                    <h3 className="text-xl font-bold tracking-wide mb-2 text-base-content group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                      {ticket.route}
                    </h3>

                    {/* Sub-Brand specification Label */}
                    <div className={`inline-block text-[11px] px-2.5 py-0.5 rounded-md font-bold border tracking-wide mb-5 ${ticket.badgeColor}`}>
                      {ticket.tag}
                    </div>

                    {/* Detailed Data Elements Splitter Row */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-b mb-6 border-base-content/5">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-bold mb-0.5 text-base-content/40">Price Structure</p>
                        <p className="text-2xl font-black tracking-tight text-base-content">
                          <span className="text-amber-500 dark:text-amber-400 text-lg font-bold mr-0.5">৳</span>
                          {ticket.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wider font-bold mb-0.5 text-base-content/40">Instant Class</p>
                        <p className="text-sm font-semibold mt-1 text-base-content/80">Guaranteed Seat</p>
                      </div>
                    </div>
                  </div>

                  {/* Call To Action Interactivity Link Container */}
                  <div className="w-full">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="relative overflow-hidden group/btn flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-base-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 rounded-xl border border-base-content/5 hover:border-transparent text-sm font-bold transition-all duration-300 tracking-wide text-base-content hover:text-slate-950 dark:hover:text-slate-950"
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

      </div>
    </section>
  );
};

export default AdvertisementSection;