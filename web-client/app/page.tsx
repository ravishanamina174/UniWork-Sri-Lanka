import HeroSection from "@/components/HeroSection";
import TaskMarketplace from "@/components/TaskMarketplace";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#ffffff] text-[#191919] overflow-x-hidden font-sans flex flex-col selection:bg-slate-200/60">
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        
        {/* Hero Area */}
        <div>
          <HeroSection />
        </div>
        
        {/* The public homepage fetches task cards after its shell is visible. */}
        <TaskMarketplace userRole="STUDENT_EARNER" />
        <Footer />
      </div>
    </div>
  );
}