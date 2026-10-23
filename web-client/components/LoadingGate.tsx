
"use client";

import { useEffect, useRef, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const STARTUP_LOADING_MS = 2500;

const REPLAY_AFTER_MS = 2 * 60 * 1000;

const STORAGE_KEY = "uniworksl:loader:last-shown";

export default function LoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  // IMPORTANT: Never initially render the loading overlay.
  const [isLoading, setIsLoading] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      const lastShown = storedValue ? Number(storedValue) : 0;
      const now = Date.now();

      const shouldShow =
        !Number.isFinite(lastShown) ||
        lastShown <= 0 ||
        now - lastShown >= REPLAY_AFTER_MS;

      if (!shouldShow) {
        // Keep the overlay unmounted. No opacity flash.
        return;
      }

      // Record before showing, so an immediate refresh
      // doesn't start the animation again.
      window.localStorage.setItem(STORAGE_KEY, String(now));

      setIsLoading(true);
    } catch {
      // Storage may be unavailable in private browsing
      // or under restrictive browser settings.
      setIsLoading(true);
    }
  }, []);

  return (
    <>
      {children}

      {isLoading && (
        <LoadingScreen
          duration={STARTUP_LOADING_MS}
          onComplete={() => setIsLoading(false)}
        />
      )}
    </>
  );
}
