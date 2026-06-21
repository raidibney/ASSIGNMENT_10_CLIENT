"use client";

import { useState } from "react";
import { FaTicketAlt, FaCloudUploadAlt } from "react-icons/fa";

export default function AddTicketForm({ session }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "",
    price: "",
    quantity: "",
    departureTime: "",
    imageUrl: ""
  });
  
  const [perks, setPerks] = useState({
    AC: false, WiFi: false, Food: false,
    TV: false, ChargingPort: false, Breakfast: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPerks(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Filter checked items to form an array of active perks
    const selectedPerks = Object.keys(perks).filter(key => perks[key]);

    const payload = {
      ...formData,
      perks: selectedPerks
    };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Ticket added successfully!");
        // Reset state values
        setFormData({ title: "", from: "", to: "", transportType: "", price: "", quantity: "", departureTime: "", imageUrl: "" });
        setPerks({ AC: false, WiFi: false, Food: false, TV: false, ChargingPort: false, Breakfast: false });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-base-100 border border-base-content/10 rounded-3xl p-8 shadow-xl mx-auto">
      
      {/* Title Header Matching image_08c71c.png */}
      <div className="text-center mb-6 flex items-center justify-center gap-2">
        <FaTicketAlt size={22} className="text-teal-500" />
        <h2 className="text-2xl font-black text-teal-600 tracking-wide dark:text-teal-400">Add New Ticket</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ticket Title */}
        <input 
          type="text" name="title" placeholder="Ticket Title" required
          value={formData.title} onChange={handleInputChange}
          className="input input-bordered w-full bg-base-200/50 rounded-xl focus:outline-teal-500 text-sm"
        />

        {/* Origin and Destination Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            type="text" name="from" placeholder="From (Location)" required
            value={formData.from} onChange={handleInputChange}
            className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
          />
          <input 
            type="text" name="to" placeholder="To (Location)" required
            value={formData.to} onChange={handleInputChange}
            className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
          />
        </div>

        {/* Transport Selector drop-down */}
        <select 
          name="transportType" required value={formData.transportType} onChange={handleInputChange}
          className="select select-bordered w-full bg-base-200/50 rounded-xl text-sm text-base-content/70"
        >
          <option value="" disabled>Select Transport Type</option>
          <option value="Bus">Bus</option>
          <option value="Train">Train</option>
          <option value="Flight">Flight</option>
          <option value="Launch">Launch</option>
        </select>

        {/* Price and Quantity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            type="number" name="price" placeholder="Price (per unit)" required min="1"
            value={formData.price} onChange={handleInputChange}
            className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
          />
          <input 
            type="number" name="quantity" placeholder="Ticket Quantity" required min="1"
            value={formData.quantity} onChange={handleInputChange}
            className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
          />
        </div>

        {/* Departure Details */}
        <div>
          <label className="label text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">Departure Date & Time</label>
          <input 
            type="datetime-local" name="departureTime" required
            value={formData.departureTime} onChange={handleInputChange}
            className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
          />
        </div>

        {/* Perks Grid Layout */}
        <div>
          <label className="label text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">Perks</label>
          <div className="grid grid-cols-2 gap-2 p-1">
            {Object.keys(perks).map((perk) => (
              <label key={perk} className="flex items-center gap-3 cursor-pointer text-sm">
                <input 
                  type="checkbox" name={perk} checked={perks[perk]} onChange={handleCheckboxChange}
                  className="checkbox checkbox-xs checkbox-primary rounded-md" 
                />
                <span className="text-base-content/80 font-medium">{perk.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Input field */}
        <input 
          type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleInputChange}
          className="input input-bordered w-full bg-base-200/50 rounded-xl text-sm"
        />

        {/* Locked Profile Fields matching image footprint bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60">
          <input type="text" readOnly value={session?.user?.name || "vendor"} className="input input-bordered w-full bg-base-300 rounded-xl text-sm cursor-not-allowed" />
          <input type="text" readOnly value={session?.user?.email || "vendor@gmail.com"} className="input input-bordered w-full bg-base-300 rounded-xl text-sm cursor-not-allowed" />
        </div>

        {/* Submission Execution Control Accent Button */}
        <button 
          type="submit" disabled={loading}
          className="btn w-full bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold border-none rounded-xl tracking-wide uppercase mt-4 shadow-md"
        >
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Add Ticket"}
        </button>
      </form>
    </div>
  );
}