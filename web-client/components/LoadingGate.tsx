"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const STARTUP_LOADING_MS = 2500;

export default function LoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

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
