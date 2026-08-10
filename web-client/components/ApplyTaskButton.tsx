"use client";

import { useState, useEffect } from "react";

interface ApplyTaskButtonProps {
  gigId: string;
  studentClerkId: string;
}

export default function ApplyTaskButton({ gigId, studentClerkId }: ApplyTaskButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch specifically the student's applications on mount/refresh
    const checkApplicationStatus = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/applications/student/${studentClerkId}`, {
          cache: "no-store" // Ensure fresh data on every page reload
        });

        if (res.ok) {
          const applications = await res.json();
          
          // Check if this specific gig is in the student's application history and applied is true
          const hasApplied = applications.some(
            (app: any) => app.gig_id === gigId && app.applied === true
          );

          if (hasApplied) {
            setStatus("success");
          }
        }
      } catch (err) {
        console.error("Failed to fetch application status:", err);
      }
    };

    if (gigId && studentClerkId) {
      checkApplicationStatus();
    }
  }, [gigId, studentClerkId]);

  const handleApply = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_clerk_id: studentClerkId,
          gig_id: gigId,
          student_message: "I am highly interested in this task and available to start immediately.", // Default message
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Graceful fallback: If they somehow double-click and trigger the backend duplicate check
        if (res.status === 400 && data.detail === "You have already submitted an application for this task.") {
          setStatus("success");
          return;
        }
        throw new Error(data.detail || "Failed to submit application");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Application error:", err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  if (status === "success") {
    return (
      <button 
        disabled
        className="w-full sm:w-auto shrink-0 bg-[#EAFAEA] border-[0.7px] border-[#2E7D32] text-[#2E7D32] text-sm font-medium py-2 px-7 rounded-[5px] transition-all shadow-sm tracking-wide cursor-not-allowed"
      >
        Application Submitted ✓
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      <button
        onClick={handleApply}
        disabled={status === "loading"}
        className="w-full sm:w-auto shrink-0 bg-white hover:bg-[#6366F1] border-[0.7px] border-[#6366F1] text-black hover:text-white active:bg-[#4338CA] active:border-[#4338CA] text-sm font-medium py-2 px-7 rounded-[5px] transition-all shadow-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Applying..." : "Apply Task"}
      </button>
      
      {status === "error" && (
        <span className="text-xs text-red-500 font-medium w-full text-center sm:text-right">
          {errorMessage}
        </span>
      )}
    </div>
  );
}