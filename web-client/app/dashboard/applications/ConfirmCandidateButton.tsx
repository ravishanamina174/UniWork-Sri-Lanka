"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ConfirmCandidateButtonProps {
  applicationId: string;
  initialStatus: string;
}

export default function ConfirmCandidateButton({
  applicationId,
  initialStatus,
}: ConfirmCandidateButtonProps) {
  const [status, setStatus] = useState<string>(initialStatus || "pending");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (status === "approve") return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/applications/${applicationId}/confirm`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "approve" }),
        }
      );

      if (res.ok) {
        setStatus("approve");
        router.refresh();
      } else {
        console.error("Failed to confirm candidate");
      }
    } catch (error) {
      console.error("Error updating candidate status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "approve") {
    return (
      <button
        disabled
        className="w-full shrink-0 bg-emerald-50 border border-emerald-300 text-emerald-700 text-sm font-semibold py-1.5 px-4 rounded-[8px] transition-all duration-200 tracking-wide flex items-center justify-center gap-1.5 cursor-default"
      >
        <span>✓</span> Candidate Confirmed
      </button>
    );
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="w-full shrink-0 bg-white hover:bg-[#f1f3f5] border border-slate-300 hover:border-[#6366F1] text-slate-800 hover:text-[#4338CA] text-sm font-medium py-2.5 px-4 rounded-[8px] transition-all duration-200 tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {loading ? "Confirming..." : "Confirm Candidate"}
    </button>
  );
}