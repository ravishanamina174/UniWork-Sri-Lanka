import { API_BASE_URL } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsPanel from "./SettingsPanel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let email = "";
  let role = "STUDENT_EARNER";
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/user/clerk/${userId}`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      email = data.email || "";
      role = data.role || role;
    }
  } catch (error) {
    console.error("Failed to load settings account details:", error);
  }

  return (
    <div className="min-h-screen px-4 py-8 font-sans text-slate-900 sm:px-8 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p><h1 className="mt-2 text-2xl font-bold tracking-tight">Settings</h1><p className="mt-1 text-sm text-slate-500">Manage account verification, privacy, and notification preferences.</p></div>
        <SettingsPanel email={email} role={role} />
      </div>
    </div>
  );
}
