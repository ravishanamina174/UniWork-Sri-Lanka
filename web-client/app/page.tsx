"use client";

import { useEffect, useState } from "react";

interface MicroGig {
  id: string;
  title: string;
  budget: number;
  task_type: "DIGITAL" | "PHYSICAL";
  status: string;
  location_coordinates: string | null;
  description: string;
  skills: string[];
}

export default function CorporateDashboard() {
  const [gigs, setGigs] = useState<MicroGig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Connect directly to our backend engine gateway
    fetch("http://127.0.0.1:8000/gigs/dashboard-feed")
      .then((res) => {
        if (!res.ok) throw new Error("Failed connecting to backend endpoint");
        return res.json();
      })
      .then((payload) => {
        setGigs(payload.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Structural Header Section */}
      <header className="max-w-7xl mx-auto mb-12 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-400">
          UniWork Corporate Management Hub
        </h1>
        <p className="text-slate-400 mt-2">
          Review live undergraduate micro-consulting contracts across Sri Lankan campus clusters.
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 rounded-xl text-red-200">
            ⚠ System Sync Failure: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gigs.map((gig) => (
              <div 
                key={gig.id} 
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl transition hover:border-slate-600"
              >
                {/* Meta Labels Line */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    gig.task_type === "DIGITAL" 
                      ? "bg-purple-900/60 text-purple-300 border border-purple-500/30" 
                      : "bg-blue-900/60 text-blue-300 border border-blue-500/30"
                  }`}>
                    {gig.task_type} TASK
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-lg">
                    {gig.budget.toLocaleString()} LKR
                  </span>
                </div>

                {/* Core Text Body */}
                <h3 className="text-xl font-bold mb-2 text-slate-50">{gig.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{gig.description}</p>

                {/* Skill Matrix Tokens */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-md text-xs border border-slate-700">
                      #{skill}
                    </span>
                  ))}
                </div>

                {/* Geospatial Metadata Log */}
                <div className="border-t border-slate-700/60 pt-4 mt-2 flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>State: <strong className="text-amber-400">{gig.status}</strong></span>
                  <span className="truncate max-w-[200px]">
                    📍 {gig.location_coordinates ? gig.location_coordinates : "Remote (Cloud)"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}