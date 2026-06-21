"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { FaTicketAlt, FaSun, FaMoon, FaUser, FaSignOutAlt, FaThLarge, FaHome, FaExclamationTriangle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
// 🟢 Import your BetterAuth client wrapper instance
import { authClient } from "@/lib/auth-client"; 

const Navbar = () => {
  const router = useRouter();
  
  // --- BETTERAUTH SESSION HOOK ---
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session; 

  // --- THEME PROVIDER SWITCHER ---
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // --- STATE MANAGEMENT ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 🟢 Modal visibility state
  const [isLoggingOut, setIsLoggingOut] = useState(false);       // 🟢 Inner loader button state

  // Ensure component is fully mounted to safely read matching client theme settings
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // --- LOGOUT ENGINE ---
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    const logoutToast = toast.loading("Terminating session authorization...");
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Personalized dynamic toast notification message
            toast.success(`See you soon, ${session?.user?.name || "traveler"}!`, { 
              id: logoutToast,
              duration: 4000
            });
            setShowLogoutModal(false);
            setMobileMenuOpen(false);
            router.push("/login");
            router.refresh();
          }
        }
      });
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to safely close connection.", { id: logoutToast });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Fallback default avatar avatar if the database field is empty/null
  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";

  return (
    <>
      {/* Nav panel background uses daisyUI semantic base color layers */}
      <nav className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-base-content/10 bg-base-100/80 text-base-content backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* LEFT: PREMIUM BRAND LOGO */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white text-xl shadow-[0_4px_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-300">
                  <FaTicketAlt className="transform -rotate-12" />
                </div>
                <div>
                  <h1 className="font-black text-2xl tracking-tight leading-none text-base-content">
                    Ticket<span className="text-amber-500">Bari</span>
                  </h1>
                  <p className="text-[10px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-widest mt-1">
                    Travel Smart
                  </p>
                </div>
              </Link>
            </div>

            {/* CENTER: DESKTOP NAVIGATION ITEMS */}
            <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-full border border-base-content/5 bg-base-200">
              <Link 
                href="/" 
                className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all text-base-content/70 hover:text-base-content hover:bg-base-300"
              >
                Home
              </Link>
              <Link 
                href="/tickets" 
                className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all text-base-content/70 hover:text-base-content hover:bg-base-300"
              >
                All Tickets
              </Link>
              <Link 
                href="/dashboard" 
                className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all text-base-content/70 hover:text-base-content hover:bg-base-300"
              >
                Dashboard
              </Link>
            </div>

            {/* RIGHT: CONFIGURATIONS & PROFILE OVERLAYS */}
            <div className="hidden lg:flex items-center gap-4">
              
              {/* Interactive Theme Toggler */}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl border border-base-content/10 bg-base-200 text-base-content hover:scale-105 transition-all duration-200 outline-none min-w-[46px] min-h-[46px] flex items-center justify-center cursor-pointer"
                aria-label="Toggle Theme"
              >
                {mounted && (theme === "dark" ? <FaSun className="text-lg text-amber-400" /> : <FaMoon className="text-lg text-slate-700" />)}
              </button>

              {/* User Access Dynamic Logic Rendering */}
              {isPending ? (
                <div className="w-32 h-11 bg-base-200 animate-pulse rounded-xl" />
              ) : !isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-sm font-bold text-base-content/80 hover:text-base-content transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="dropdown dropdown-end">
                  <div 
                    tabIndex={0} 
                    role="button" 
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl border border-base-content/10 bg-base-200 hover:bg-base-300 transition-all cursor-pointer"
                  >
                    <img
                      src={session.user.image || defaultAvatar}
                      alt={session.user.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/50"
                    />
                    <div className="text-left max-w-[120px]">
                      <p className="text-xs font-bold text-base-content leading-none truncate">
                        {session.user.name}
                      </p>
                      <span className="text-[9px] text-base-content/50 block truncate mt-0.5">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                  
                  <ul 
                    tabIndex={0} 
                    className="dropdown-content menu p-2 mt-2 shadow-2xl bg-base-100 border border-base-content/10 rounded-2xl w-56 text-sm gap-1 z-[100]"
                  >
                    <li className="menu-title px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-base-content/40">Account</li>
                    <li>
                      <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base-content/80 hover:bg-base-200">
                        <FaUser className="text-amber-500 text-xs" /> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base-content/80 hover:bg-base-200">
                        <FaThLarge className="text-amber-500 text-xs" /> Dashboard
                      </Link>
                    </li>
                    <div className="h-px bg-base-content/10 my-1" />
                    <li>
                      {/* 🟢 Triggers Modal Confirmation instead of direct deletion */}
                      <button 
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 w-full text-left"
                      >
                        <FaSignOutAlt className="text-xs" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* MOBILE RESPONSIVE HAMBURGER BUTTON */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-base-content/10 bg-base-200 text-base-content min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                {mounted && (theme === "dark" ? <FaSun size={18} className="text-amber-400" /> : <FaMoon size={18} />)}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl border border-base-content/10 bg-base-200 text-base-content"
              >
                {mobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full p-6 z-50 bg-base-100 border-b border-base-content/10 shadow-2xl">
            <div className="flex flex-col gap-4">
              
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200 text-base-content font-semibold"
              >
                <FaHome className="text-amber-500 text-sm" /> Home
              </Link>
              <Link 
                href="/tickets" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200 text-base-content font-semibold"
              >
                <FaTicketAlt className="text-amber-500 text-sm" /> All Tickets
              </Link>
              <Link 
                href="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200 text-base-content font-semibold"
              >
                <FaThLarge className="text-amber-500 text-sm" /> Dashboard
              </Link>

              <div className="h-px bg-base-content/10 my-1" />

              {isPending ? (
                <div className="w-full h-12 bg-base-200 animate-pulse rounded-xl" />
              ) : !isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-sm font-bold border border-base-content/10 rounded-xl text-base-content bg-transparent"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-base-content/10 bg-base-200 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={session.user.image || defaultAvatar} 
                      alt={session.user.name} 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="max-w-[180px]">
                      <p className="text-sm font-bold text-base-content truncate">{session.user.name}</p>
                      <span className="text-[10px] text-base-content/60 block truncate">{session.user.email}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-3 text-center text-xs rounded-lg font-medium bg-base-300 text-base-content"
                    >
                      My Profile
                    </Link>
                    {/* 🟢 Triggers Modal Confirmation on Mobile view */}
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="py-2 px-3 text-center text-xs bg-rose-500/10 text-rose-500 rounded-lg font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </nav>

      {/* 🟢 PREMIUM CONFIRMATION MODAL INTERACTION LAYER */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Blur overlay filter */}
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)} 
          />
          
          {/* Central Modal Base Container */}
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-2xl text-center transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-4">
              <FaExclamationTriangle className="text-xl" />
            </div>
            
            <h3 className="text-lg font-black tracking-tight text-base-content uppercase">
              Terminate Connection?
            </h3>
            <p className="mt-2 text-xs text-base-content/60 leading-relaxed font-medium">
              Are you sure you want to log out of your TicketBari transit profile terminal?
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="btn btn-outline flex-1 border-base-content/10 hover:bg-base-200 rounded-xl font-bold text-xs uppercase tracking-wider h-11 min-h-0 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogoutConfirm}
                className="btn flex-1 bg-gradient-to-r from-rose-500 to-red-600 border-none text-white font-black rounded-xl shadow-lg hover:shadow-rose-500/20 uppercase tracking-wider text-xs h-11 min-h-0 transition-all"
              >
                {isLoggingOut ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Disconnect"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;