"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

const STARTUP_LOADING_MS = 2500;
const FIRST_VISIT_KEY = "uniworksl-has-visited";
const LAST_HOME_LOADER_KEY = "uniworksl-last-home-loader";
const HOME_RELOAD_INTERVAL_MS = 4 * 60 * 1000;

export default function LoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let shouldShowLoader = false;

    try {
      const hasVisited = window.localStorage.getItem(FIRST_VISIT_KEY) === "true";
      const navigationType = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const isReload = navigationType?.type === "reload";
      const now = Date.now();
      const lastHomeLoader = Number(window.localStorage.getItem(LAST_HOME_LOADER_KEY) || 0);

      if (!hasVisited) {
        shouldShowLoader = true;
        window.localStorage.setItem(FIRST_VISIT_KEY, "true");
        window.localStorage.setItem(LAST_HOME_LOADER_KEY, String(now));
      } else if (pathname === "/" && isReload && now - lastHomeLoader >= HOME_RELOAD_INTERVAL_MS) {
        shouldShowLoader = true;
      }

      if (shouldShowLoader && pathname === "/" && hasVisited) {
        window.localStorage.setItem(LAST_HOME_LOADER_KEY, String(now));
      }
    } catch {
      // Storage can be unavailable in privacy-restricted browsers; the page remains usable.
    }

    const stateTimer = window.setTimeout(() => setIsLoading(shouldShowLoader), 0);

    return () => window.clearTimeout(stateTimer);
  }, [pathname]);

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
