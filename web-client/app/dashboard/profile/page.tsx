import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileView from "./ProfileView";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userRole = "STUDENT_EARNER";
  let baseEmail = "";
  let profileData = null;

  try {
    // 1. Fetch the real user role and base info from PostgreSQL
    const authRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      next: { revalidate: 0 }
    });

    if (authRes.status === 404) {
      redirect("/onboard");
    } else if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.role) userRole = authData.role;
      if (authData.email) baseEmail = authData.email;
    }

    // 2. Try to fetch extended profile data from MongoDB
    const profileRes = await fetch(`http://127.0.0.1:8000/api/v1/profiles/${userId}`, {
      cache: "no-store"
    });

    if (profileRes.ok) {
      profileData = await profileRes.json();
    }
    // If it returns 404, it's fine! It just means they haven't saved a profile to Mongo yet.

  } catch (err) {
    console.error("Error communicating with backend for profile sync:", err);
  }

  return (
    <ProfileView 
      userId={userId} 
      userRole={userRole} 
      baseEmail={baseEmail} 
      initialProfile={profileData} 
    />
  );
}