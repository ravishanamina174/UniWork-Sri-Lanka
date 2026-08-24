// web-client/components/FeedbackSection.tsx
"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, MessageSquarePlus } from "lucide-react";

const SUGGESTION_CARDS = [
  "Improve UI/UX Design",
  "Simplify User Flow",
  "Faster Payout Processing",
  "More Task Categories",
  "Add Mobile App Version",
  "Enhance Chat System",
  "Student Verification Badges",
  "Location-based Filters",
  "Poster Ratings & Reviews",
  "Dispute Resolution Hub"
];

// Helper to generate the multi-colored border aesthetic matching your tags
const getTagTheme = (index: number, isSelected: boolean) => {
  const themes = [
    { default: "border-blue-200 text-[#28292b] hover:bg-blue-50", active: "border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500 shadow-sm" },
    { default: "border-emerald-200 text-[#28292b] hover:bg-emerald-50", active: "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500 shadow-sm" },
    { default: "border-amber-200 text-[#28292b] hover:bg-amber-50", active: "border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500 shadow-sm" },
    { default: "border-purple-200 text-[#28292b] hover:bg-purple-50", active: "border-purple-500 bg-purple-50 text-purple-800 ring-1 ring-purple-500 shadow-sm" },
    { default: "border-rose-200 text-[#28292b] hover:bg-rose-50", active: "border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500 shadow-sm" }
  ];
  const theme = themes[index % themes.length];
  return isSelected ? theme.active : `bg-white ${theme.default}`;
};

interface FeedbackSectionProps {
  userClerkId: string;
  userRole: string;
}

export default function FeedbackSection({ userClerkId, userRole }: FeedbackSectionProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Word count logic
  const words = description.trim() ? description.trim().split(/\s+/) : [];
  const wordCount = words.length;
  const isOverWordLimit = wordCount > 200;

  const toggleCard = (cardText: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardText) ? prev.filter((c) => c !== cardText) : [...prev, cardText]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (selectedCards.length === 0 && !description.trim()) {
      setStatusMessage({ type: "error", text: "Please select a card or write some feedback." });
      return;
    }

    if (isOverWordLimit) {
      setStatusMessage({ type: "error", text: "Keep feedback under 200 words." });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/feedback/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_clerk_id: userClerkId,
          user_role: userRole || "student",
          issue_cards: selectedCards,
          feedback_description: description
        })
      });

      if (res.ok) {
        setStatusMessage({ type: "success", text: "Thanks! Your thoughts have been sent to the team." });
        setSelectedCards([]);
        setDescription("");
      } else {
        const errorData = await res.json();
        setStatusMessage({ type: "error", text: errorData.detail || "Failed to send feedback." });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto p-6 md:p-10 bg-white border border-slate-200 rounded-[18px] mt-10 mb-20">
      
      <div className="mb-8 text-center md:text-left flex flex-col items-center md:items-start">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4 md:hidden">
          <MessageSquarePlus className="text-[#c68b4f]" size={28} />
        </div>
        <h2 className="text-2xl md:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
          <MessageSquarePlus className="text-[#31962f] hidden md:block" size={32} />
          Help Us Improve the Platform
        </h2>
        <p className="text-[#7f8185] font-light mt-2 text-[15px] max-w-2xl">
          Your feedback shapes our next features. Select some quick ideas below or drop us a detailed note.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* LEFT SIDE: Text Area & Submit */}
        <div className="flex flex-col h-full order-2 lg:order-1">
          <label className="block text-[#373839] font-semibold text-sm mb-3">
            Share your detailed thoughts
          </label>
          
          <div className="relative flex-grow flex flex-col">
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add your thoughts, feedback, or any friction you experienced..."
              className="w-full flex-grow bg-[#fcfcfc] border border-slate-200 rounded-2xl p-4 md:p-5 text-sm md:text-[13.5px] text-[#28292b] placeholder-[#8a8b8d] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
            />
            <div className={`absolute bottom-3 right-4 text-xs font-semibold ${isOverWordLimit ? "text-red-500" : "text-[#8a8b8d]"}`}>
              {wordCount} / 200 words
            </div>
          </div>

          {statusMessage && (
            <div className={`mt-4 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
              statusMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-3.5 px-6 ] hover:bg-[#e8e9ec] text-[#28292b] border border-[#afb2b6] text-sm md:text-[14px] font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {isSubmitting ? "Sending..." : <>Submit Feedback <Send size={16} /></>}
          </button>
        </div>

        {/* RIGHT SIDE: Multi-colored Suggestion Tags */}
        <div className="order-1 lg:order-2">
          <label className="block text-[#373839] font-semibold text-sm mb-3">
            Quick feature suggestions
          </label>
          
          <div className="flex flex-wrap gap-2 md:gap-3 mt-1">
            {SUGGESTION_CARDS.map((card, idx) => {
              const isSelected = selectedCards.includes(card);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleCard(card)}
                  className={`py-2 px-4 text-left rounded-xl text-[13px] md:text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${getTagTheme(idx, isSelected)}`}
                >
                  <span>{card}</span>
                  {isSelected && <CheckCircle2 size={16} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

      </form>
    </section>
  );
}