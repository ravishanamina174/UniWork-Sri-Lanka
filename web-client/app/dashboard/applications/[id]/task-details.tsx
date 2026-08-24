'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, MapPin, User, Mail, Phone, Loader2, AlertCircle, 
  Play, CheckCircle2, Clock, KeyRound, ShieldCheck 
} from 'lucide-react';
import TaskMap from "@/components/TaskMap";

interface TaskDetailsProps {
  applicationId: string;
}

// --- Helper Functions ---
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
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Task Starter States
  const [taskState, setTaskState] = useState<any>(null);
  const [starterLoading, setStarterLoading] = useState(false);
  const [endCodeInput, setEndCodeInput] = useState('');
  const [starterError, setStarterError] = useState<string | null>(null);
  const [starterSuccess, setStarterSuccess] = useState<string | null>(null);

  // Fetch Task Starter Live State
  const fetchTaskStarterState = useCallback(async () => {
    if (!applicationId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/started-tasks/application/${applicationId}`);
      if (res.ok) {
        const data = await res.json();
        setTaskState(data);
      }
    } catch (err) {
      console.error("Error fetching task starter state:", err);
    }
  }, [applicationId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Application to get references
        const appRes = await fetch(`http://127.0.0.1:8000/api/v1/applications/${applicationId}`);
        if (!appRes.ok) throw new Error("Failed to load application");
        const appInfo = await appRes.json();
        setAppData(appInfo);

        // 2. Concurrently fetch Gig Details and STUDENT Profile
        const [gigRes, studentRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/v1/gigs/${appInfo.gig_id}`),
          fetch(`http://127.0.0.1:8000/api/v1/profiles/${appInfo.student_clerk_id}`) 
        ]);

        if (gigRes.ok) setGigData(await gigRes.json());
        if (studentRes.ok) setStudentData(await studentRes.json());

        await fetchTaskStarterState();
      } catch (err) {
        console.error("Error loading task board data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) fetchData();

    // Auto-polling interval for live state updates without refresh
    const interval = setInterval(() => {
      fetchTaskStarterState();
    }, 3000);

    return () => clearInterval(interval);
  }, [applicationId, fetchTaskStarterState]);

  // Task Starter Handlers
  const handleInitiateEnd = async () => {
    setStarterLoading(true);
    setStarterError(null);
    setStarterSuccess(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/started-tasks/initiate-end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: applicationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to initiate end.");
      setStarterSuccess("End request sent! Ask student for the code on their screen.");
      await fetchTaskStarterState();
    } catch (err: any) {
      setStarterError(err.message);
    } finally {
      setStarterLoading(false);
    }
  };

  const handleVerifyEndCode = async () => {
    if (endCodeInput.length !== 4) {
      setStarterError("Please enter a valid 4-digit code.");
      return;
    }
    setStarterLoading(true);
    setStarterError(null);
    setStarterSuccess(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/started-tasks/verify-end-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: applicationId, code: endCodeInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid code.");
      setStarterSuccess("Task closed successfully!");
      await fetchTaskStarterState();
    } catch (err: any) {
      setStarterError(err.message);
    } finally {
      setStarterLoading(false);
    }
  };

  // Calculate day countdown
  const calculateDaysLeft = (deadlineStr: string) => {
    if (!deadlineStr || deadlineStr === "TBD") return 0;
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    
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

  if (!appData || !gigData || !studentData) {
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
      
      {/* 1. Gig Details Area */}
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
              <User size={14} className="text-slate-400" />
              Applicant: {studentData.display_name}
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

      {/* 3. Student Details */}
      <div className="col-span-12 md:col-span-8 bg-white rounded-xl border border-gray-200 p-6 min-h-[200px] hover:shadow-xs ">
        <h3 className="font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <User className="text-[#c27f13]" size={18}/> Student Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Name</p>
            <p className="text-sm font-semibold text-slate-800">{studentData.display_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Email</p>
            <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <Mail size={14} className="text-slate-400"/> {studentData.email || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
            <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <Phone size={14} className="text-slate-400"/> {studentData.phone_number || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address / Location</p>
            <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400"/> {studentData.address || "Not provided"}
            </p>
          </div>
          <div className="sm:col-span-2 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">About</p>
            <p className="text-sm text-slate-600 italic">
              {studentData.bio ? `"${studentData.bio}"` : "No bio provided."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Task Starter Component (Poster View) */}
      <div className="col-span-12 md:col-span-6 bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-xs min-h-[220px]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Play className="text-[#FFC349]" size={18} /> Task Starter
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-[#615f59]">
              Poster Control
            </span>
          </div>

          {starterError && (
            <div className="mb-3 text-xs bg-red-50 text-red-600 border border-red-200 p-2.5 rounded-lg flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" /> {starterError}
            </div>
          )}

          {starterSuccess && (
            <div className="mb-3 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" /> {starterSuccess}
            </div>
          )}

          {/* COMPLETED STATE */}
          {taskState?.task_close ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex flex-col items-center justify-center text-center my-2">
              <CheckCircle2 className="text-emerald-600 mb-1" size={28} />
              <p className="text-sm font-bold text-emerald-900">Task Officially Closed</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Ended at: {taskState?.task_close_time ? new Date(taskState.task_close_time).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          ) : taskState?.task_start ? (
            /* ACTIVE STATE */
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" /> Student On Site & Working
                  </p>
                  <p className="text-[11px] text-blue-700 mt-1">
                    Started: {taskState?.task_start_time ? new Date(taskState.task_start_time).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              {!taskState?.end_code ? (
                <button
                  onClick={handleInitiateEnd}
                  disabled={starterLoading}
                  className="w-full py-2.5 bg-[#e66d22] hover:bg-[#d76f2f] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {starterLoading ? <Loader2 className="animate-spin" size={14} /> : <KeyRound size={14} />}
                  Task End With Code
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium">
                    Enter the 4-digit code displayed on student's screen to complete task:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={endCodeInput}
                      onChange={(e) => setEndCodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="4-Digit PIN"
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-center tracking-widest text-lg font-bold text-slate-800 focus:outline-none focus:border-[#007FFF]"
                    />
                    <button
                      onClick={handleVerifyEndCode}
                      disabled={starterLoading || endCodeInput.length !== 4}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {starterLoading ? <Loader2 className="animate-spin" size={14} /> : <ShieldCheck size={14} />} Confirm End
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* NOT STARTED STATE */
            <div className="space-y-3">
              {taskState?.start_code ? (
                <div className="bg-[#f7f7f7] border border-slate-200 rounded-lg p-4 text-center">
                  <p className="text-xs font-semibold text-black uppercase tracking-wider mb-1">
                    Provide This Start Code To Student
                  </p>
                  <p className="text-3xl font-black text-[#6FAF4F] tracking-widest my-1">
                    {taskState.start_code}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Student must enter this 4-digit code on their terminal to verify identity.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-500">
                    Waiting for student to initiate the task from their device...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
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
          <h3 className="font-bold text-[16px] text-slate-900 mb-4 flex items-center gap-2">
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