"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient({ clerkUserId }: { clerkUserId: string }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!clerkUserId) return;

    let mounted = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    (async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${clerkUserId}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!mounted) return;

        if (res.ok) {
          const data = await res.json();
          if (!data?.exists) {
            // New user -> go to onboarding
            if (mounted) router.push("/onboard");
            return;
          }
          // existing -> stay on home
        } else {
          // treat non-OK as new user to avoid leaving user stuck
          if (mounted) router.push("/onboard");
          return;
        }
      } catch (err) {
        // network error or timeout -> treat as new (safe default)
        console.error("HomeClient: backend check failed or timed out:", err);
        // Only navigate if the component is still mounted (avoid reacting to cleanup aborts)
        if (mounted) {
          router.push("/onboard");
        }
        return;
      } finally {
        clearTimeout(timeout);
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      // Mark as unmounted so async work doesn't trigger navigation or state updates.
      // Do NOT call `controller.abort()` here — aborting during cleanup caused
      // noisy AbortError exceptions in the browser console. The timeout will
      // still abort the fetch if needed when it fires.
      mounted = false;
      clearTimeout(timeout);
    };
  }, [clerkUserId, router]);

  // Minimal placeholder while the check runs. If redirected, router.push will navigate.
  if (checking) {
    return (
      <div className="w-full py-6 text-center text-sm text-gray-500">Verifying your account...</div>
    );
  }

  return null;
}
