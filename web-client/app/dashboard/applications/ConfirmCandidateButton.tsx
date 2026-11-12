"use client";

import { API_BASE_URL } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

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
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (status === "approve") return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/applications/${applicationId}/confirm`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "approve" }),
        }
      );

      if (res.ok) {
        setStatus("approve");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Failed to confirm candidate.");
      }
    } catch (requestError) {
      console.error("Error updating candidate status:", requestError);
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "approve") {
    return <>
      <button disabled className="w-full shrink-0 bg-emerald-50 border border-emerald-300 text-emerald-600 text-[13px] font-semibold py-1.5 px-4 rounded-[8px] flex items-center justify-center gap-1.5 cursor-default">
        <span>✓</span> Candidate Confirmed
      </button>
      <Link href={`/dashboard/applications/${applicationId}`} className="w-full py-2.5 px-3 rounded-lg bg-white border border-[#2f96df85] text-[#2f96df] hover:bg-[#f3f8fbb0] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm">
        <span>💬</span> Open Task Workspace
      </Link>
    </>;
  }

  return (
    <>
      <button onClick={handleConfirm} disabled={loading} className="w-full shrink-0 bg-white hover:bg-[#f1f3f5] border border-slate-300 hover:border-[#6366F1] text-slate-800 hover:text-[#4338CA] text-sm font-medium py-2.5 px-4 rounded-[8px] transition-all duration-200 tracking-wide flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? "Confirming..." : "Confirm Candidate"}
      </button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </>
  );
}