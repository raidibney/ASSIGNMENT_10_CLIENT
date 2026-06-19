"use client";

import Link from "next/link";
import {
  FaTicketAlt,
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaCcVisa,
  FaCcMastercard,
  FaArrowRight,
} from "react-icons/fa";
import { SiStripe } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="relative w-full transition-colors duration-300 bg-base-200 border-t border-base-content/10 mt-20 overflow-hidden">
      
      {/* Sci-Fi Background Glow Elements */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/[0.01] dark:bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/[0.01] dark:bg-orange-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">

        {/* Top/Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Premium Brand Meta */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white text-xl shadow-[0_4px_15px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-transform duration-300">
                <FaTicketAlt className="transform -rotate-12" />
              </div>
              <div>
                <h2 className="font-black text-2xl tracking-tight leading-none text-base-content">
                  Ticket<span className="text-amber-500">Bari</span>
                </h2>
                <p className="text-[10px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-widest mt-1">
                  Travel Smart
                </p>
              </div>
            </Link>

            <p className="text-sm font-light text-base-content/70 leading-relaxed mt-2">
              Book bus, train, launch & flight tickets easily. Fast, secure, and high-performance transit routing architecture across Bangladesh.
            </p>
          </div>

          {/* Column 2: Quick Navigation Channels */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/40 mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "All Tickets", path: "/tickets" },
                { label: "Contact Us", path: "/contact" },
                { label: "About Platform", path: "/about" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-base-content/70 hover:text-amber-500 transition-colors duration-200"
                  >
                    <FaArrowRight className="text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-500" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Telemetry Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/40 mb-5">
              Contact Info
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-base-content/80 group">
                <div className="w-8 h-8 rounded-lg bg-base-300 border border-base-content/5 flex items-center justify-center text-amber-500 group-hover:border-amber-500/20 transition-colors">
                  <FaEnvelope className="text-xs" />
                </div>
                <span className="group-hover:text-base-content transition-colors">support@ticketbari.com</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-base-content/80 group">
                <div className="w-8 h-8 rounded-lg bg-base-300 border border-base-content/5 flex items-center justify-center text-amber-500 group-hover:border-amber-500/20 transition-colors">
                  <FaPhone className="text-xs" />
                </div>
                <span className="group-hover:text-base-content transition-colors">+880 1XXX-XXXXXX</span>
              </div>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-base-content/80 group hover:text-amber-500 transition-colors w-fit"
              >
                <div className="w-8 h-8 rounded-lg bg-base-300 border border-base-content/5 flex items-center justify-center text-amber-500 group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-slate-950 group-hover:border-transparent transition-all">
                  <FaFacebook className="text-xs" />
                </div>
                <span>Facebook Network</span>
              </a>
            </div>
          </div>

          {/* Column 4: Encryption & Payment Layers */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/40 mb-5">
              Payment Nodes
            </h3>

            <p className="text-sm font-light text-base-content/70 mb-5 leading-relaxed">
              Multi-layered cryptographic protocol gateways ensuring fully secure checkouts.
            </p>

            {/* Futuristic Payment Pill Grid */}
            <div className="flex flex-wrap items-center gap-3 text-2xl text-base-content/60">
              <div className="px-3 py-1.5 rounded-xl bg-base-300/60 border border-base-content/5 flex items-center justify-center shadow-sm hover:text-base-content hover:border-base-content/10 transition-colors">
                <SiStripe className="text-lg" />
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-base-300/60 border border-base-content/5 flex items-center justify-center shadow-sm hover:text-base-content hover:border-base-content/10 transition-colors">
                <FaCcVisa className="text-lg" />
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-base-300/60 border border-base-content/5 flex items-center justify-center shadow-sm hover:text-base-content hover:border-base-content/10 transition-colors">
                <FaCcMastercard className="text-lg" />
              </div>
            </div>
          </div>

        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-base-content/10 mt-16 mb-8" />

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs font-light text-base-content/50">
            © {new Date().getFullYear()} TicketBari. All rights reserved. Built with secure protocol pipelines.
          </p>
          
          <div className="flex items-center gap-6 text-xs font-medium text-base-content/40">
            <Link href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Matrix</Link>
            <Link href="/terms" className="hover:text-amber-500 transition-colors">Terms of Fleet</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;