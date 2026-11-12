import { API_BASE_URL } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import StudentTalentMatcher from "@/components/StudentTalentMatcher";

export const dynamic = "force-dynamic";

type ClientRole = "TASK_POSTER" | "CORPORATE_CLIENT";

export default async function TalentPoolPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let role: string | null = null;
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/user/clerk/${userId}`, { cache: "no-store" });
    if (response.ok) role = (await response.json()).role || null;
  } catch (error) {
    console.error("Failed to load Talent Pool role:", error);
  }

  if (role !== "TASK_POSTER" && role !== "CORPORATE_CLIENT") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-[18px] p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Talent Pool</h1>
          <p className="mt-2 text-sm text-slate-500">This workspace is available to Task Posters and Corporate Clients.</p>
          <Link href="/dashboard" className="inline-flex mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const clientRole: ClientRole = role;
  return (
    <main className="min-h-screen bg-[#F7F7F5] text-slate-900">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{clientRole === "CORPORATE_CLIENT" ? "Corporate Workspace" : "Poster Workspace"}</div>
        <StudentTalentMatcher />
      </div>
    </main>
  );
}
