"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import VendorDashboard from "./components/VendorDashboard";

export default function DashboardRouter() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Route protection guard
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-screen w-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-amber-500" />
      </div>
    );
  }

  if (!session) return null;

  // 🟢 Dynamically render based on your custom database role
  const role = session.user.role || "user";

  if (role === "vendor") {
    return <VendorDashboard session={session} />;
  }

  if (role === "admin") {
    return (
      <div className="p-10 text-center text-base-content bg-base-100 min-h-screen">
        <h1 className="text-2xl font-black">Admin Console Panel Placeholder</h1>
      </div>
    );
  }

  // Fallback default: Regular User
  return (
    <div className="p-10 text-center text-base-content bg-base-100 min-h-screen">
      <h1 className="text-2xl font-black">User Profile Dashboard Placeholder</h1>
    </div>
  );
}