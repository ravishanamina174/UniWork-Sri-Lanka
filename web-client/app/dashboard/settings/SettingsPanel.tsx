'use client';

import { useState } from "react";
import { Check, MapPin, Bell, ShieldCheck } from "lucide-react";

type SettingsPanelProps = {
  email: string;
  role: string;
};

type Preferences = {
  backgroundLocation: boolean;
  buddyAlerts: boolean;
  emailAlerts: boolean;
  taskUpdates: boolean;
  campusRadius: boolean;
};

const roleLabels: Record<string, string> = {
  STUDENT_EARNER: "Student Earner",
  TASK_POSTER: "Task Poster",
  CORPORATE_CLIENT: "Corporate Client",
};

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
      <button 
        type="button" 
        role="switch" 
        aria-checked={checked} 
        aria-label={label} 
        onClick={onChange} 
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? "bg-[#6366F1]" : "bg-slate-200"}`}
      >
        <span 
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`} 
        />
      </button>
    </div>
  );
}

export default function SettingsPanel({ email, role }: SettingsPanelProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    backgroundLocation: true,
    buddyAlerts: true,
    emailAlerts: true,
    taskUpdates: true,
    campusRadius: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof Preferences) => {
    setSaved(false);
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  const savePreferences = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="max-w-4xl space-y-6 pb-24">
      {/* Account & Verification Section */}
      <section className="bg-white border border-slate-300 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Account & Verification Preferences</h2>
            <p className="mt-1 text-xs text-slate-500">Your verified identity details used across UniWorkSL.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Account email</p>
            <p className="mt-2 break-all text-sm font-bold text-slate-800">{email || "Verified account email"}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">✓ Verified</p>
          </div>
          <div className="rounded-sm border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Role</p>
            <p className="mt-2 text-sm font-bold text-slate-800">{roleLabels[role] || role}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">✓ Identity confirmed</p>
          </div>
        </div>
      </section>

      {/* Privacy & Geofencing Section */}
      <section className="bg-white border border-slate-300 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-50 border border-blue-200 text-[#007FFF]">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Privacy & Geofencing Controls</h2>
            <p className="mt-1 text-xs text-slate-500">Control safety features used while tasks are active.</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          <Toggle 
            label="Background GPS location sharing" 
            description="Share your location with an active task workspace for verified check-ins." 
            checked={preferences.backgroundLocation} 
            onChange={() => toggle("backgroundLocation")} 
          />
          <Toggle 
            label="Buddy System safety alerts" 
            description="Notify your trusted buddy when a safety check-in needs attention." 
            checked={preferences.buddyAlerts} 
            onChange={() => toggle("buddyAlerts")} 
          />
        </div>
      </section>

      {/* Notification Preferences Section */}
      <section className="bg-white border border-slate-300 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-amber-50 border border-amber-200 text-amber-700">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
            <p className="mt-1 text-xs text-slate-500">Choose which updates should reach you.</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          <Toggle 
            label="Email alerts" 
            description="Receive important account and application messages by email." 
            checked={preferences.emailAlerts} 
            onChange={() => toggle("emailAlerts")} 
          />
          <Toggle 
            label="Task status updates" 
            description="Get notified when an application or active task changes status." 
            checked={preferences.taskUpdates} 
            onChange={() => toggle("taskUpdates")} 
          />
          <Toggle 
            label="Campus radius notifications" 
            description="See nearby task opportunities based on your selected campus radius." 
            checked={preferences.campusRadius} 
            onChange={() => toggle("campusRadius")} 
          />
        </div>
      </section>

      {/* Save Button */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center pt-2">
        <button 
          type="button" 
          onClick={savePreferences} 
          className="bg-white hover:bg-[#6366F1] border-[0.7px] border-[#6366F1] text-slate-900 hover:text-white active:bg-[#4338CA] active:border-[#4338CA] text-xs font-medium py-3 px-6 rounded-sm transition-all shadow-sm tracking-wide inline-flex items-center gap-2"
        >
          <Check size={16} />
          Save Preferences
        </button>
        {saved && (
          <p role="status" className="text-xs font-semibold text-emerald-600">
            Preferences saved successfully.
          </p>
        )}
      </div>
    </div>
  );
}