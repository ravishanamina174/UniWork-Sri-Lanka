import { API_BASE_URL } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileView from "./ProfileView";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userRole = "STUDENT_EARNER";
  let baseEmail = "";
  let profileData = null;
  let professionalProfileData = null;

  try {
    const authRes = await fetch(`${API_BASE_URL}/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (authRes.status === 404) {
      redirect("/onboard");
    } else if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.role) userRole = authData.role;
      if (authData.email) baseEmail = authData.email;
    }

    // Fetch standard profile
    const profileRes = await fetch(`${API_BASE_URL}/api/v1/profiles/${userId}`, {
      cache: "no-store"
    });
    if (profileRes.ok) {
      profileData = await profileRes.json();
    }

    // Fetch professional worker profile if user is a student earner
    if (userRole === "STUDENT_EARNER") {
      const profRes = await fetch(`${API_BASE_URL}/api/v1/student-workers/profile/${userId}`, {
        cache: "no-store"
      });
      if (profRes.ok) {
        professionalProfileData = await profRes.json();
      }
    }

  } catch (err) {
    console.error("Error communicating with backend for profile sync:", err);
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex">
      
      {/* --- DOODLE ART: Top Left Accent --- */}
      <div className="hidden xl:block absolute top-12 left-10 opacity-70 text-slate-400 pointer-events-none select-none z-0">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 70 L 25 35 L 50 55 L 75 35 L 85 70 Z" fill="#F59E0B" fillOpacity="0.15" />
          <path d="M10 80 C 35 85, 65 85, 90 80" />
        </svg>
      </div>

      {/* --- DOODLE ART: Main Right Side Cluster --- */}
      <div className="hidden lg:block absolute right-8 lg:right-20 xl:right-40 top-24 opacity-80 text-slate-400 pointer-events-none select-none z-0 w-80 h-[600px]">
        <svg className="absolute top-10 left-0 w-full h-full opacity-40" viewBox="0 0 300 600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 6">
            <path d="M 200 50 C 300 150, 0 250, 150 400 C 250 500, 50 550, 100 600" />
        </svg>

        <svg className="absolute top-4 right-4" width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 50 L 90 20 L 60 90 L 50 60 L 10 50 Z" fill="#007FFF" fillOpacity="0.15" />
          <path d="M50 60 L 90 20" />
          <path d="M50 60 L 40 80 L 60 70" strokeDasharray="2 2" />
        </svg>

        <svg className="absolute top-48 left-0" width="85" height="85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50 15 C 25 15, 20 40, 30 55 C 35 65, 40 70, 40 80 L 60 80 C 60 70, 65 65, 70 55 C 80 40, 75 15, 50 15 Z" fill="#F59E0B" fillOpacity="0.15" />
          <path d="M40 85 L 60 85 M45 92 L 55 92" />
        </svg>

        <svg className="absolute bottom-32 right-8" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="40" fill="#EC4899" fillOpacity="0.05" />
          <circle cx="50" cy="50" r="25" fill="#EC4899" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="10" fill="#EC4899" fillOpacity="0.2" />
          <path d="M75 25 L 55 45" />
        </svg>
      </div>

      {/* Main Unified Profile Component */}
      <div className="relative z-10 w-full">
        <ProfileView 
          userId={userId} 
          userRole={userRole} 
          baseEmail={baseEmail} 
          initialProfile={profileData} 
          initialProfessionalProfile={professionalProfileData}
        />
      </div>
    </div>
  );
}