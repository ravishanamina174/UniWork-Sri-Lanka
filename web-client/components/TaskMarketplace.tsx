"use client";

import { useState } from "react";
import Link from "next/link"; // NEW: Import Link

export interface TaskGig {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills_required: string[];
  task_type?: "remote" | "on-site";
  location?: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
}

interface TaskMarketplaceProps {
  tasks: TaskGig[];
  userRole?: string; // Added userRole prop
}

export default function TaskMarketplace({ tasks, userRole }: TaskMarketplaceProps) {
  // State to track visible gigs, starting at 3
  const [visibleCount, setVisibleCount] = useState(3);
  
  // NEW: State to track which task descriptions are expanded
  const [expandedTasks, setExpandedTasks] = useState<{ [key: string]: boolean }>({});
  
  const toggleDescription = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  const getCategoryBadge = (title: string, skills: string[]) => {
    const text = title.toLowerCase() + skills.join(" ").toLowerCase();
    if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("figma")) {
      return { label: "UI/UX Design", classes: "bg-[#EAFAEA] text-[#2E7D32]" };
    }
    if (text.includes("map") || text.includes("field") || text.includes("hardware") || text.includes("physical")) {
      return { label: "On-Campus Task", classes: "bg-[#FFF3E0] text-[#E65100]" };
    }
    return { label: "Software & Tech", classes: "bg-[#E8F0FE] text-[#1A73E8]" };
  };

  const getSkillBadgeColor = (index: number) => {
    const colors = [
      "bg-[#4285F4] text-white", 
      "bg-[#34A853] text-white", 
      "bg-[#FBBC05] text-slate-900", 
      "bg-[#EA4335] text-white", 
      "bg-[#673AB7] text-white", 
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="max-w-[73rem] w-full mx-auto px-4 sm:px-6 pb-24 z-20">
      <div className="border-t border-slate-200/60 pt-12 mb-8 flex flex-col items-center text-center">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Quick Gigs & On-Campus Tasks
        </h2>
        <p className="text-base sm:text-lg font-medium text-[#989a9c] mt-2 max-w-xl">
          Grab a task, deliver the work, get paid directly, and level up your profile.
        </p>
      </div>

      {(!tasks || tasks.length === 0) ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 text-sm">
            No task entries active. Tasks posted will sync automatically here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.slice(0, visibleCount).map((task) => {
              const category = getCategoryBadge(task.title, task.skills_required || []);
              const isRemote = task.task_type === "remote";
              const isExpanded = !!expandedTasks[task.id];
              
              return (
                <div
                  key={task.id}
                  className="bg-white border border-slate-300 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#b0b1f7] transition-all flex flex-col overflow-hidden"
                >
                  <div className="p-5 sm:p-6 pb-4 flex-1 flex flex-col">
                    
                    {/* Category Pill & Deadline */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full ${category.classes}`}>
                        {category.label}
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-semibold flex items-center gap-1">
                        📅 {task.deadline}
                      </span>
                    </div>

                    {/* Main Title & Budget Container */}
                    <div className="mb-3">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-2 leading-snug min-h-[2.75rem]">
                        {task.title}
                      </h3>
                      <div className=" text-lg sm:text-xl font-black text-[#007FFF] tracking-tight">
                        LKR {task.budget?.toLocaleString() || 0}
                      </div>
                    </div>

                    {/* Location Indicator block */}
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-medium bg-slate-50 border border-slate-100 py-1.5 px-2.5 rounded-lg w-fit max-w-full">
                      {isRemote ? (
                        <>
                          <span className="text-slate-400">🌐</span>
                          <span className="text-slate-600">Remote Task</span>
                        </>
                      ) : (
                        <>
                          <span className="text-red-500">📍</span>
                          <span className="text-slate-600 line-clamp-1 truncate" title={task.location?.address}>
                            {task.location?.address || "Location specified on map"}
                          </span>
                        </>
                      )}
                    </div>

                    {/* CHANGED: Description Paragraph Container with "see more" toggle */}
                    <div className="mb-2 flex-1 flex flex-col items-start">
                      <p className={`text-xs text-slate-500 leading-relaxed transition-all ${!isExpanded ? "line-clamp-4" : ""}`}>
                        {task.description}
                      </p>
                      {task.description && task.description.length > 120 && (
                        <span 
                          onClick={() => toggleDescription(task.id)}
                          className="text-xs font-bold text-slate-700 cursor-pointer hover:text-[#6366F1] mt-1 transition-colors"
                        >
                          {isExpanded ? "see less" : "see more"}
                        </span>
                      )}
                    </div>

                    {/* Grid Aligned Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {(!task.skills_required || task.skills_required.length === 0) ? (
                        <span className="text-[10px] sm:text-xs text-slate-400 italic">General Task</span>
                      ) : (
                        task.skills_required.map((skill, index) => (
                          <span
                            key={index}
                            className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded ${getSkillBadgeColor(index)}`}
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Conditionally render the button based on userRole */}
                  {userRole === "STUDENT_EARNER" && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2">
                      {/* NEW: Wrap the button in a Link to the dynamic route */}
                      <Link href={`/task-req/${task.id}`}>
                        <button className="w-full bg-white hover:bg-[#6366F1] border-[0.7px] border-[#6366F1] text-black hover:text-white active:bg-[#4338CA] active:border-[#4338CA] text-xs font-medium py-2.5 px-4 rounded-xl transition-all shadow-sm tracking-wide">
                           Request Task
                        </button>
                      </Link>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < tasks.length && (
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="bg-white hover:bg-[#6366F1] border-[0.7px] border-[#6366F1] text-black hover:text-white active:bg-[#4338CA] active:border-[#4338CA] text-sm font-medium py-2 px-6 rounded-xl transition-all shadow-sm tracking-wide"
              >
                Load More Tasks
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}