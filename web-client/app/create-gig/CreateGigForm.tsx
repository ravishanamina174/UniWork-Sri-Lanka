"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Defaulting to Pelmadulla, Sabaragamuwa Province
const defaultCenter = {
  lat: 6.6191,
  lng: 80.5234,
};

export default function CreateGigForm({ clerkId }: { clerkId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Task Type Toggle State
  const [taskType, setTaskType] = useState<"remote" | "on-site">("remote");
  
  // Location States
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: "",
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
  });

  // Reverse Geocoding Function
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return;
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
  };

  // Map Click Handler
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
      fetchAddress(lat, lng);
    }
  }, []);

  // HTML5 Geolocation Handler
  const handleLocateMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter({ lat, lng });
          setSelectedLocation({ lat, lng });
          fetchAddress(lat, lng);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not fetch location. Please ensure location permissions are granted.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const structuredPayload: any = {
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget) || 0,
      deadline: formData.deadline,
      skills_required: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      poster_clerk_id: clerkId,
      task_type: taskType
    };

    if (taskType === "on-site" && selectedLocation) {
      structuredPayload.location = {
        type: "Point",
        coordinates: [selectedLocation.lng, selectedLocation.lat], // Longitude first for MongoDB GeoJSON
        address: address
      };
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/gigs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(structuredPayload),
      });

      if (res.ok) {
        alert("🎉 Task Card posted to marketplace ledger successfully!");
        router.push("/");
        router.refresh();
      } else {
        alert("❌ Failed to process database ingestion routing pipeline.");
      }
    } catch (err) {
      console.error("Pipeline failure connection error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-300 p-8 rounded-2xl">
      {/* Existing Text Inputs */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Task Project Title</label>
        <input
          required
          type="text"
          placeholder="e.g., Develop landing page using Tailwind CSS"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2d913e] transition-colors"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Description</label>
        <textarea
          required
          rows={4}
          placeholder="Break down details, expectations, constraints, or guidelines..."
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2d913e] transition-colors"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Budget Allocation (LKR / Total)</label>
          <input
            required
            type="number"
            placeholder="15000"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2d913e] transition-colors font-medium text-[#2d913e]"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Target Deadline</label>
          <input
            required
            type="date"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2d913e] transition-colors"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
        <input
          type="text"
          placeholder="React, TypeScript, UI Design, Content Writing"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2d913e] transition-colors"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
        />
      </div>

      {/* --- NEW: Location Section --- */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-slate-700">Task Location Requirements</label>
          
          {/* Toggle Switch */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setTaskType("remote")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                taskType === "remote" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Remote
            </button>
            <button
              type="button"
              onClick={() => setTaskType("on-site")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                taskType === "on-site" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              On-Site
            </button>
          </div>
        </div>

        {/* Map UI (Only loads if On-Site is selected) */}
        {taskType === "on-site" && (
          <div className="space-y-3 fade-in">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={isLocating}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors flex-shrink-0"
              >
                {isLocating ? "Locating..." : "📍 Locate Me"}
              </button>
              <input
                type="text"
                readOnly
                placeholder="Click on the map or locate yourself..."
                value={address}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none"
              />
            </div>
            
            <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200 relative z-0">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={14}
                  onClick={onMapClick}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                >
                  {selectedLocation && <Marker position={selectedLocation} />}
                </GoogleMap>
              ) : (
                <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
                  Loading Maps Interface...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || (taskType === "on-site" && !selectedLocation)}
        className="w-full py-3 bg-[#2d913e] hover:bg-[#2b6e36] text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-100 disabled:bg-slate-300 active:scale-[0.99] mt-6"
      >
        {loading ? "Publishing to Ecosystem..." : "Publish Task Card"}
      </button>
    </form>
  );
}