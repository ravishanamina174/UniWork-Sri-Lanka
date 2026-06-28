import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserRole } from '@/config/navigation';

export default async function DashboardHome() {
  // 1. Authenticate user via Clerk
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userRole: UserRole = 'STUDENT_EARNER'; // Fallback default
  let shouldRedirectToOnboard = false;

  try {
    // 2. Fetch the real user role from your backend
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (backendRes.status === 404) {
      shouldRedirectToOnboard = true;
    } else if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.role) {
        userRole = data.role as UserRole;
      }
    }
  } catch (err) {
    console.error("Dashboard role fetch error:", err);
  }

  // 3. Redirect if the user hasn't completed onboarding
  if (shouldRedirectToOnboard) redirect("/onboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500">Here is your {userRole} dashboard.</p>
        </div>
      </div>
      
      {/* Wireframe Content Box */}
      <div className="h-64 w-full bg-white border border-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">Dashboard Metrics Wireframe</span>
      </div>
    </div>
  );
}