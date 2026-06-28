import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TopHeader from '@/components/dashboard/TopHeader';
import Navigation from '@/components/dashboard/Navigation';
import { UserRole } from '@/config/navigation';
import Navbar from "@/components/Navbar";

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
    <>
      <Navbar />
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col md:flex-row font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Floating Blue Pill Navbar */}
      <Navigation userRole={userRole} />
      
      {/* Main Content Area - Styled like a Notion Canvas */}
      <main className="flex-1 md:py-4 md:pr-4 pb-24 md:pb-4 w-full max-w-[1600px] mx-auto h-screen md:overflow-y-auto">

          {children}

      </main>
    </div>
    </>
  );
}