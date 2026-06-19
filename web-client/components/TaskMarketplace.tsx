// web-client/components/TaskMarketplace.tsx
"use client";

export interface TaskGig {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills_required: string[];
}

interface TaskMarketplaceProps {
  tasks: TaskGig[];
}

export default function TaskMarketplace({ tasks }: TaskMarketplaceProps) {
  
  // Helper to dynamically assign badge styles based on task context
  const getCategoryBadge = (title: string, skills: string[]) => {
    const text = title.toLowerCase() + skills.join(" ").toLowerCase();
    if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("figma")) {
      return { label: "UI/UX Design", classes: "bg-[#EAFAEA] text-[#2E7D32]" };
    }
    if (text.includes("move") || text.includes("delivery") || text.includes("flyer") || text.includes("physical")) {
      return { label: "On-Campus Task", classes: "bg-[#FFF3E0] text-[#E65100]" };
    }
    return { label: "Software & Tech", classes: "bg-[#E8F0FE] text-[#1A73E8]" };
  };

  // Helper to cycle through colorful tag backgrounds inspired by your screenshot
  const getSkillBadgeColor = (index: number) => {
    const colors = [
      "bg-[#4285F4] text-white", // Royal Blue
      "bg-[#34A853] text-white", // Emerald Green
      "bg-[#FBBC05] text-slate-900", // Soft Amber
      "bg-[#EA4335] text-white", // Coral Red
      "bg-[#673AB7] text-white", // Deep Purple
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="max-w-[73rem] w-full mx-auto px-6 pb-24 z-20">
      <div className="border-t border-slate-200/60 pt-12 mb-8 flex flex-col items-center text-center">
        <h2 className="text-5xl font-bold tracking-tight text-slate-900">
            Quick Gigs & On-Campus Tasks
        </h2>
        <p className="text-lg font-medium text-[#989a9c] mt-2 max-w-xl">
          Grab a task, deliver the work, get paid directly, and level up your profile.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 text-sm">
            No task entries active. Tasks posted will sync automatically here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const category = getCategoryBadge(task.title, task.skills_required);
            
            return (
              <div
                key={task.id}
                className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all flex flex-col overflow-hidden"
              >
                {/* Visual Header Block with Top Action Details */}
                <div className="p-6 pb-4 flex-1 flex flex-col">
                  
                  {/* Category Pill Tag Group */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${category.classes}`}>
                      {category.label}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      📅 {task.deadline}
                    </span>
                  </div>

                  {/* Main Title & Budget Container */}
                  <div className="mb-3">
                    <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug min-h-[2.75rem]">
                      {task.title}
                    </h3>
                    <div className="mt-2 text-lg font-black text-[#007FFF] tracking-tight">
                      LKR {task.budget.toLocaleString()}
                    </div>
                  </div>

                  {/* Description Paragraph Container */}
                  <p className="text-xs text-slate-500 line-clamp-3 mb-5 leading-relaxed flex-1">
                    {task.description}
                  </p>

                  {/* Grid Aligned Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {task.skills_required.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">General Task</span>
                    ) : (
                      task.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded ${getSkillBadgeColor(index)}`}
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Full Width Integrated Interaction Action Button Block */}
                <div className="px-6 pb-6 pt-2">
                  <button className="w-full bg-[#6366F1] hover:bg-[#4F46E5] active:bg-[#4338CA] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm tracking-wide">
                    Explore More
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}