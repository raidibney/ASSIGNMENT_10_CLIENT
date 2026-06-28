"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import VendorDashboard from "./components/VendorDashboard";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetch(`http://localhost:7000/api/users`);
        
        if (res.ok) {
          const allUsers = await res.json();
          // ✅ FIX 1: Case-insensitive email comparison to prevent false mismatches
          const matchedUser = allUsers.find(
            u => u.email?.toLowerCase() === session.user.email?.toLowerCase()
          );
          
          if (matchedUser) {
            setProfileData(matchedUser);
          }
        }
      } catch (err) {
        console.warn("Could not establish handshake with port 7000 API server. Using auth session defaults.", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  // 1. Loading Matrix Skeleton Tracker Guard
  if (isPending || (session?.user && loadingProfile)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-[#010313]">
        <span className="loading loading-spinner loading-lg text-amber-500" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Decrypting Identity Matrix Permissions...
        </p>
      </div>
    );
  }

  // 2. Clear Unauthenticated Access Route Blocker
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-[#010313]">
        <h2 className="text-2xl font-black text-rose-500 uppercase tracking-tight">Access Denied</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-sm">
          No authenticated authorization signature found. Please sign in to terminal network coordinates.
        </p>
      </div>
    );
  }

  // ✅ FIX 2: Safely trim spaces and fall back gracefully
  const rawRole = profileData?.role || session?.user?.role || "user";
  const activeUserRole = rawRole.trim().toLowerCase();

  // 🔍 DEBUG LOGS: Check your browser console to see exactly what's passing through
  console.log("--- RBAC Debug Matrix ---");
  console.log("Fetched Profile Data:", profileData);
  console.log("Session User object:", session?.user);
  console.log("Resolved Active Role:", activeUserRole);

  // =========================================================================
  // 🔀 DYNAMIC VIEW CONDITIONAL DISPATCH MATRIX
  // =========================================================================
  if (activeUserRole === "admin") {
    return <AdminDashboard profileData={profileData} session={session} />;
  }

  if (activeUserRole === "vendor") {
    return <VendorDashboard profileData={profileData} session={session} />;
  }

  return <UserDashboard profileData={profileData} session={session} />;
}