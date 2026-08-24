'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Mail, Phone, Building2, Loader2, AlertCircle } from 'lucide-react';
import TaskMap from "@/components/TaskMap";

interface TaskDetailsProps {
  applicationId: string;
}

// --- Helper Functions Styled to Exactly Match TaskMarketplace ---
const getCategoryBadge = (title: string, skills: string[]) => {
  const text = (title || "").toLowerCase() + (skills || []).join(" ").toLowerCase();
  if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("figma")) {
    return { label: "UI/UX Design", classes: "bg-[#EAFAEA] text-[#2E7D32]" };
  }
  if (text.includes("map") || text.includes("field") || text.includes("hardware") || text.includes("physical") || text.includes("cctv")) {
    return { label: "On-Site Task", classes: "bg-[#FFF3E0] text-[#E65100]" };
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

export default function TaskDetailsBoard({ applicationId }: TaskDetailsProps) {
  const [appData, setAppData] = useState<any>(null);
  const [gigData, setGigData] = useState<any>(null);
  const [posterData, setPosterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Application to get references
        const appRes = await fetch(`http://127.0.0.1:8000/api/v1/applications/${applicationId}`);
        if (!appRes.ok) throw new Error("Failed to load application");
        const appInfo = await appRes.json();
        setAppData(appInfo);

        // 2. Concurrently fetch Gig Details and Poster Profile
        const [gigRes, posterRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/v1/gigs/${appInfo.gig_id}`),
          fetch(`http://127.0.0.1:8000/api/v1/profiles/${appInfo.poster_clerk_id}`)
        ]);

        if (gigRes.ok) setGigData(await gigRes.json());
        if (posterRes.ok) setPosterData(await posterRes.json());
        
      } catch (err) {
        console.error("Error loading task board data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) fetchData();
  }, [applicationId]);

  // Calculate day countdown
  const calculateDaysLeft = (deadlineStr: string) => {
    if (!deadlineStr || deadlineStr === "TBD") return 0;
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    
    // Normalize to midnight
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20 bg-white border border-gray-200 rounded-xl">
        <Loader2 className="animate-spin text-[#6366F1] w-8 h-8" />
      </div>
    );
  }

  if (!appData || !gigData || !posterData) {
    return (
      <div className="w-full flex gap-2 justify-center items-center py-10 bg-red-50 text-red-500 border border-red-100 rounded-xl">
        <AlertCircle size={20} /> Failed to load complete task board data.
      </div>
    );
  }

  const category = getCategoryBadge(gigData.title, gigData.skills_required);
  const daysLeft = calculateDaysLeft(appData.task_deadline);

  return (
<div className="grid grid-cols-12 gap-4 md:gap-6 w-[90%] md:max-w-4xl mx-auto">
      
      {/* 1. Gig Details Area (Full Width Horizontal Card) */}
      <div className="col-span-12 bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xs transition-shadow">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side Info */}
          <div className="flex-1 lg:max-w-[40%] flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${category.classes}`}>
                {category.label}
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Calendar size={12} /> {appData.task_deadline || "TBD"}
              </span>
            </div>
            
            <h3 className="font-bold text-xl text-slate-900 leading-tight">
              {gigData.title}
            </h3>
            
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <Building2 size={14} className="text-slate-400" />
              {posterData.display_name}
            </p>

            <div className="mt-1">
              <div className="text-2xl font-black text-[#007FFF] tracking-tight">
                LKR {gigData.budget?.toLocaleString() || 0}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium bg-slate-50 border border-slate-100 py-1.5 px-2.5 rounded w-fit text-slate-600">
              <MapPin size={12} className="text-red-500" />
              Specific location pinned on map
            </div>
          </div>

          {/* Right Side Info */}
          <div className="flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 flex flex-col">
            <h4 className="text-sm font-bold text-slate-700 mb-2">Task Description</h4>
            <p className="text-sm text-slate-600 flex-1 whitespace-pre-wrap">
              {gigData.description}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {gigData.skills_required?.length === 0 ? (
                  <span className="text-[11px] text-slate-400 italic">General Task</span>
                ) : (
                  gigData.skills_required?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-sm ${getSkillBadgeColor(index)}`}
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Day Count Down */}
      <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[200px] hover:shadow-xs ">
        <div className="w-12 h-12 bg-[#f4f6fc] text-[#566b7b] rounded-full flex items-center justify-center mb-3">
          <Calendar size={24} />
        </div>
        <h3 className="text-sm font-bold text-[#4d5154] uppercase tracking-wider mb-1">Deadline</h3>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-[41px] font-black text-slate-800">{daysLeft}</span>
          <span className="text-lg font-bold text-slate-400">Days</span>
        </div>
        <p className="text-xs font-medium text-slate-500 mt-2 text-center">
          {daysLeft === 0 ? "Deadline has passed or is today" : `Until ${appData.task_deadline}`}
        </p>
      </div>

      {/* 3. Posters Details */}
      <div className="col-span-12 md:col-span-8 bg-white rounded-xl border border-gray-200 p-6 min-h-[200px] hover:shadow-xs ">
        <h3 className="font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <User className="text-[#c27f13]" size={18}/> Corporate Client Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company / Name</p>
            <p className="text-sm font-semibold text-slate-800">{posterData.display_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Email</p>
            <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <Mail size={14} className="text-slate-400"/> {posterData.email || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
            <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <Phone size={14} className="text-slate-400"/> {posterData.phone_number || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address / Location</p>
            <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400"/> {posterData.address || "Not provided"}
            </p>
          </div>
          <div className="sm:col-span-2 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">About</p>
            <p className="text-sm text-slate-600 italic">
              {posterData.bio ? `"${posterData.bio}"` : "No bio provided."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Task Starter (Empty UI) */}
      <div className="col-span-12 md:col-span-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex items-center justify-center min-h-[160px]">
         <p className="text-slate-400 font-medium">Task Starter Component (Coming Soon)</p>
      </div>

      {/* 5. Map Component */}
      {gigData.task_type === 'remote' ? (
        <div className="col-span-12 md:col-span-6 bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center min-h-[500px]">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
            <MapPin size={24} />
          </div>
          <p className="text-slate-500 font-medium">Remote Task</p>
          <p className="text-xs text-slate-400 mt-1">No physical location required</p>
        </div>
      ) : (
        <div className="col-span-12 md:col-span-6 bg-white rounded-xl border border-gray-200 p-6 min-h-[500px] hover:shadow-xs flex flex-col group/card">
          <h3 className="font-bold text-[16px] text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="text-[#1d9c45]" size={18}/> Task Location
          </h3>
          
          <div className="flex-1 bg-slate-50/80 border border-slate-200 rounded-lg flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group min-h-[180px] w-full">
            
            {/* Interactive Pigeon Map Background */}
            <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <TaskMap coordinates={gigData.location?.coordinates} />
            </div>

            {/* Map Pin Box - UI overlay on top of the map */}
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-[6px] border border-slate-200 shadow-sm flex flex-col items-center z-10 w-[95%] transition-transform duration-300 group-hover:-translate-y-1 mt-auto">
              <span className="text-sm font-semibold text-slate-700 leading-snug truncate w-full">
                {gigData.location?.address || "Exact location pinned on map"}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}