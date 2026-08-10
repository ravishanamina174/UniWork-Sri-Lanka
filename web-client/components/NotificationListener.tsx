"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NotificationPayload {
  type: string;
  title: string;
  message: string;
  redirect_url: string;
}

export default function NotificationListener() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Connect to FastAPI WebSocket
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${user.id}`);

    // ADD THESE TWO LINES FOR DEBUGGING:
    ws.onopen = () => console.log(`🟢 WebSocket Connected for User: ${user.id}`);
    ws.onerror = (err) => console.error("🔴 WebSocket Connection Error:", err);

    ws.onmessage = (event) => {
      try {
        const data: NotificationPayload = JSON.parse(event.data);
        if (data.type === "APPLICATION_CONFIRMED") {
          setNotification(data);
        }
      } catch (err) {
        console.error("Error processing WebSocket event:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [user, isLoaded]);

  if (!notification) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-md w-full bg-white border border-emerald-200 shadow-xl rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-4 duration-300 font-sans">
      {/* Icon Badge */}
      <div className="w-9 h-9 rounded-full bg-[#EAFAEA] border border-emerald-200 flex items-center justify-center text-[#2E7D32] shrink-0 text-base">
        🎉
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
          Application Update
        </h4>
        <p className="text-sm font-semibold text-slate-900 leading-snug truncate">
          {notification.message}
        </p>
        
        {/* Redirect Action Button */}
        <button
          onClick={() => {
            router.push(notification.redirect_url);
            setNotification(null);
          }}
          className="mt-3 bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold py-1.5 px-3.5 rounded-md transition-all shadow-sm flex items-center gap-1.5"
        >
          Look at ➔
        </button>
      </div>

      {/* Manual Close Cross Button */}
      <button
        onClick={() => setNotification(null)}
        className="text-slate-400 hover:text-slate-700 text-lg leading-none p-1 rounded-md transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}