// web-client/app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const { userId } = await auth();

  // 1. Guard: Secure page via Clerk instantly on the server side
  if (!userId) {
    redirect("/sign-in");
  }

  let profileExists = false;

  try {
    // 2. Query your FastAPI backend directly from the Next.js server
    const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // Do not cache this request; ensure it checks the DB dynamically every reload
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      profileExists = data.exists;
    }
  } catch (err) {
    console.error("⚠️ Backend connection failed from Next.js server context:", err);
    // Safe fallback: If your backend is completely offline during development, 
    // keep them on the home screen instead of breaking the app layout loop.
    profileExists = true; 
  }

  // 3. If the user is authenticated but not onboarded in our databases, redirect them cleanly
  if (!profileExists) {
    redirect("/onboard");
  }

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden font-sans flex flex-col">
      
      {/* --- MATCHING BACKGROUND ARTWORK (Synchronized with Sign-In page style) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* Shape 1: Top Right abstract fluid mesh */}
        <div 
          className="absolute top-[-5%] right-[-10%] w-[50vw] h-[50vw] min-w-[400px] bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-500 opacity-10 blur-[90px]"
          style={{ clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 60%, 15% 30%)' }}
        />

        {/* Shape 2: Bottom Left sharp angular mesh */}
        <div 
          className="absolute bottom-[-10%] left-[-8%] w-[40vw] h-[45vw] min-w-[320px] bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 opacity-10 blur-[80px]"
          style={{ clipPath: 'polygon(0% 15%, 85% 0%, 100% 100%, 0% 100%)' }}
        />

        {/* Shape 3: Minor accent ambient illumination */}
        <div className="absolute top-[35%] left-[5%] w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-10 filter blur-2xl" />
      </div>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
          
          {/* Dashboard Header Banner */}
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Welcome Back!
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Here is what is happening with your student freelance profile today.
            </p>
          </div>

          {/* Dashboard Cards Matrix */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Card 1 */}
            <div className="bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-orange-100 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg mb-4">
                💼
              </div>
              <h3 className="text-lg font-bold text-slate-900">Available Gigs</h3>
              <p className="text-slate-500 text-sm mt-1">Explore tailored tech projects open for university students across Sri Lanka.</p>
              <div className="mt-4 text-xs font-semibold text-orange-500 inline-flex items-center gap-1 cursor-pointer">
                Browse listings &rarr;
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-pink-100 transition-all">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-lg mb-4">
                📩
              </div>
              <h3 className="text-lg font-bold text-slate-900">Active Applications</h3>
              <p className="text-slate-500 text-sm mt-1">Track the review status of your proposals and review incoming client interview tokens.</p>
              <div className="mt-4 text-xs font-semibold text-pink-500 inline-flex items-center gap-1 cursor-pointer">
                Check status &rarr;
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:col-span-2 lg:col-span-1 hover:border-blue-100 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg mb-4">
                💳
              </div>
              <h3 className="text-lg font-bold text-slate-900">Wallet & Earnings</h3>
              <p className="text-slate-500 text-sm mt-1">Keep track of your milestones safely escrowed and monitor your payout cycles securely.</p>
              <div className="mt-4 text-xs font-semibold text-blue-500 inline-flex items-center gap-1 cursor-pointer">
                View balances &rarr;
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}