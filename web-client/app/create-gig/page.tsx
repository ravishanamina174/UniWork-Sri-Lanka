import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreateGigForm from "./CreateGigForm";

export default async function CreateGigPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let userRole: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT" = "STUDENT_EARNER";

  // Fetch verified status validation from PostgreSQL
  try {
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`);
    if (backendRes.ok) {
      const data = await backendRes.json();
      userRole = data.role;
    }
  } catch (err) {
    console.error("Backend validation error on route initialization", err);
  }

  // Guard routing logic: send back to dashboard if user is a student earner
  if (userRole === "STUDENT_EARNER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#191919]">
      <Navbar userRole={userRole} />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create a New Task Card</h1>
          <p className="text-slate-500 mt-1">Fill out the specifications below to deploy your requirement to the platform network.</p>
        </div>
        <CreateGigForm clerkId={userId} />
      </main>
    </div>
  );
}