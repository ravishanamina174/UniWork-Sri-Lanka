"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Send, Sparkles, Copy, Check } from "lucide-react";

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

  // --- NEW AI STATES ---
  const [aiSuggestions, setAiSuggestions] = useState({ title: "", description: "" });
  const [loadingAi, setLoadingAi] = useState({ title: false, description: false });
  const [copied, setCopied] = useState({ title: false, description: false });

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

  // --- NEW AI HANDLERS ---
  const handleEnhance = async (field: "title" | "description") => {
    const textToEnhance = field === "title" ? formData.title : formData.description;
    if (!textToEnhance.trim()) return alert(`Please enter a ${field} first.`);

    setLoadingAi((prev) => ({ ...prev, [field]: true }));
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/gigs/enhance-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToEnhance, field_type: field }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiSuggestions((prev) => ({ ...prev, [field]: data.enhanced_text }));
      } else {
        alert("Failed to get AI suggestion.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleCopy = (field: "title" | "description", text: string) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [field]: false })), 2000);
  };

  // Helper to calculate words
  const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 p-8 rounded-2xl w-full">
      {/* --- TITLE SECTION --- */}
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
        
        {/* AI Title UI */}
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleEnhance("title")}
            disabled={loadingAi.title}
            className="self-start text-xs font-medium text-[#2d913e] flex items-center gap-1 hover:underline transition-all"
          >
            <Sparkles size={14} /> {loadingAi.title ? "Analyzing..." : "Write with AI"}
          </button>
          
          {aiSuggestions.title && (
            <div className="p-3 bg-[#f3f9f4] border border-[#2d913e]/30 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
              <p className="text-sm text-slate-700 flex-1">{aiSuggestions.title}</p>
              <button 
                type="button" 
                onClick={() => handleCopy("title", aiSuggestions.title)} 
                className="text-slate-500 hover:text-[#2d913e] bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition-all"
                title="Copy Suggestion"
              >
                {copied.title ? <Check size={16} className="text-[#2d913e]" /> : <Copy size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- DESCRIPTION SECTION --- */}
      <div>
        <div className="flex justify-between items-end mb-1">
          <label className="block text-sm font-semibold text-slate-700">Detailed Description</label>
          <span className={`text-xs ${wordCount >= 200 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            {wordCount}/200 words
          </span>
        </div>
        <textarea
          required
          rows={4}
          placeholder="Break down details, expectations, constraints, or guidelines... (Max 100 words)"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2d913e] transition-colors"
          value={formData.description}
          onChange={(e) => {
            const text = e.target.value;
            const words = text.trim().split(/\s+/).filter(Boolean);
            if (words.length <= 200 || text.length < formData.description.length) {
              setFormData({ ...formData, description: text });
            }
          }}
        />

        {/* AI Description UI */}
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleEnhance("description")}
            disabled={loadingAi.description}
            className="self-start text-xs font-medium text-[#2d913e] flex items-center gap-1 hover:underline transition-all"
          >
            <Sparkles size={14} /> {loadingAi.description ? "Drafting..." : "Write with AI"}
          </button>
          
          {aiSuggestions.description && (
            <div className="p-3 bg-[#f3f9f4] border border-[#2d913e]/30 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
              <p className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">{aiSuggestions.description}</p>
              <button 
                type="button" 
                onClick={() => handleCopy("description", aiSuggestions.description)} 
                className="text-slate-500 hover:text-[#2d913e] bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition-all"
                title="Copy Suggestion"
              >
                {copied.description ? <Check size={16} className="text-[#2d913e]" /> : <Copy size={16} />}
              </button>
            </div>
          )}
        </div>
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
        className="w-full py-3 bg-white hover:bg-[#e8e9ec] text-[#28292b] border border-[#afb2b6] md:text-[14px] text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-[0.99] mt-6 flex items-center justify-center gap-2 "
      >
        {loading ? "Publishing to Ecosystem..." : <>Publish Task Card <Send size={16} color="#189e49" /></>}

      </button>
    </form>
  );
}