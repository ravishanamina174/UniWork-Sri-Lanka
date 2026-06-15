// web-client/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden font-sans">
      {/* --- BACKGROUND ARTWORK --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] min-w-[350px] bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-500 opacity-20 blur-[80px]"
          style={{ clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 60%, 15% 30%)' }}
        />
        <div 
          className="absolute bottom-[-5%] left-[-5%] w-[30vw] h-[35vw] min-w-[280px] bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 opacity-15 blur-[60px]"
          style={{ clipPath: 'polygon(0% 15%, 85% 0%, 100% 100%, 0% 100%)' }}
        />
        <div className="absolute top-[40%] left-[12%] w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 mix-blend-multiply filter blur-xl" />
      </div>

      {/* --- FOREGROUND CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full max-w-md">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            UniWork<span className="text-orange-500">SL</span>
          </h1>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Student Gig Platform
          </p>
        </div>

        <div className="w-full flex justify-center">
          <SignIn 
            appearance={{
              variables: {
                colorPrimary: "#f97316",
                colorBackground: "#ffffff",
              },
              elements: {
                card: "shadow-none border-0 mx-auto bg-transparent",
                navbar: "hidden", 
                footer: "bg-transparent"
              }
            }}
          />       
        </div>
      </div>
    </div>
  );
}