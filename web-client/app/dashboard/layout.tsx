import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TopHeader from '@/components/dashboard/TopHeader';
import Navigation from '@/components/dashboard/Navigation';
import { UserRole } from '@/config/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    console.error("Layout role fetch error context sync:", err);
  }

  // 3. Redirect if the user hasn't completed onboarding
  if (shouldRedirectToOnboard) redirect("/onboard");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Header (Visible only on smaller screens) */}
      <TopHeader />
      
      {/* Dynamic Navigation (Sidebar on desktop, Bottom bar on mobile) */}
      <Navigation userRole={userRole} />
      
      {/* Main Content Area - pb-24 ensures content isn't hidden behind mobile bottom nav */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}