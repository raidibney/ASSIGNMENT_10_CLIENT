import React, { useState, useEffect } from "react";
import Sidebar from "../admin-tabs/Sidebar";
import ManageUsersTab from "../admin-tabs/ManageUsersTab";
import ManageTicketTab from "../admin-tabs/ManageTicketTab";
import AdvertiseTicketsTab from "../admin-tabs/AdvertiseTicketsTab";
import ProfileTab from "../admin-tabs/ProfileTab";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
// Change this URL if your production hosting environment uses a different domain endpoint
const BASE_API_URL = "http://localhost:7000/api";

export default function AdminDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState("Manage Users");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (activeTab === "Manage Users") {
      fetchAllSystemUsers();
    } else if (activeTab === "Manage Ticket" || activeTab === "Advertise Tickets") {
      fetchAllSystemTickets();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const matched = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
      setFilteredUsers(matched);
    }
  }, [searchQuery, users]);

  // =========================================================================
  // LIVE BACKEND CONNECTION ENDPOINTS
  // =========================================================================

  // 1. Fetch live system users from /api/users
  const fetchAllSystemUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${BASE_API_URL}/users`);
      if (!response.ok) throw new Error("Failed to pull users array matrix.");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching system user arrays:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 2. Fetch live database tickets from /api/tickets/admin
  const fetchAllSystemTickets = async () => {
    setLoadingTickets(true);
    try {
      const response = await fetch(`${BASE_API_URL}/tickets/admin`);
      if (!response.ok) throw new Error("Failed to query operational database vectors.");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error operational streaming vectors fault:", error);
    } finally {
      setLoadingTickets(false);
    }
  };

  // 3. Update User Roles with /api/users/:id/role
  const handleUserRoleMutation = async (userId, email, targetRole) => {
    try {
      const response = await fetch(`${BASE_API_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole, email: email }),
      });

      if (!response.ok) throw new Error("Failed user tier configuration save.");
      
      // Update local state directly
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: targetRole } : u))
      );
      
      // If user was marked as fraud, refresh tickets cache automatically since backend dropped them
      if (targetRole === "fraud") {
        fetchAllSystemTickets();
      }
    } catch (error) {
      console.error("User mutation processing disruption:", error);
    }
  };

  // 4. Admin Approve/Reject tickets with /api/tickets/:id/status
  const handleStatusUpdate = async (ticketId, nextStatus) => {
    try {
      const response = await fetch(`${BASE_API_URL}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) throw new Error("Failed modifying ticket document branch rules.");

      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: nextStatus } : t))
      );
    } catch (error) {
      console.error("Ticket operational state shift fault:", error);
    }
  };

  // 5. Admin Advertisement visibility management with /api/tickets/:id/advertise
  const handleAdvertiseStatusUpdate = async (ticketId, nextAdState) => {
    try {
      const response = await fetch(`${BASE_API_URL}/tickets/${ticketId}/advertise`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdvertised: nextAdState }),
      });

      if (!response.ok) throw new Error("Failed layout adjustment for ad flags.");

      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, isAdvertised: nextAdState } : t))
      );
    } catch (error) {
      console.error("Advertisement flow shift error:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#010313] text-base-content overflow-hidden relative font-sans">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onLogout={onLogout}
      />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-100 uppercase">
              {activeTab} Workspace
            </h1>
            <p className="text-xs text-base-content/60 font-mono uppercase tracking-wider mt-1">
              TicketBari Security Management Node
            </p>
          </div>

          {activeTab === "Manage Users" && (
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search network identity metadata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm h-10 w-full input-bordered bg-base-100 rounded-xl pl-4 pr-10 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          )}
        </div>

        {activeTab === "Manage Users" && (
          <ManageUsersTab 
            loadingUsers={loadingUsers}
            filteredUsers={filteredUsers}
            handleUserRoleMutation={handleUserRoleMutation}
            defaultAvatar={defaultAvatar}
          />
        )}

        {activeTab === "Manage Ticket" && (
          <ManageTicketTab 
            tickets={tickets}
            loadingTickets={loadingTickets}
            fetchAllSystemTickets={fetchAllSystemTickets}
            handleStatusUpdate={handleStatusUpdate}
          />
        )}

        {activeTab === "Advertise Tickets" && (
          <AdvertiseTicketsTab 
            tickets={tickets}
            loadingTickets={loadingTickets}
            fetchAllSystemTickets={fetchAllSystemTickets}
            handleAdvertiseStatusUpdate={handleAdvertiseStatusUpdate}
          />
        )}

        {activeTab === "Profile" && (
          <ProfileTab 
            session={session}
            defaultAvatar={defaultAvatar}
          />
        )}
      </main>
    </div>
  );
}