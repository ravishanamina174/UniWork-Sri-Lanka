"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGigForm({ clerkId }: { clerkId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const structuredPayload = {
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget) || 0,
      deadline: formData.deadline,
      skills_required: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      poster_clerk_id: clerkId
    };

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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#2d913e] hover:bg-[#2b6e36] text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-100 disabled:bg-slate-300 active:scale-[0.99]"
      >
        {loading ? "Publishing to Ecosystem..." : "Publish Task Card"}
      </button>
    </form>
  );
}