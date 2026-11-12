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
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-slate-900" : "bg-slate-200"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
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
    <div className="max-w-4xl space-y-6">
      <section className="rounded-[18px] border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={20} /></div>
          <div><h2 className="text-lg font-bold text-slate-900">Account & Verification Preferences</h2><p className="mt-1 text-sm text-slate-500">Your verified identity details used across UniWorkSL.</p></div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Account email</p><p className="mt-2 break-all text-sm font-semibold text-slate-800">{email || "Verified account email"}</p><p className="mt-1 text-xs text-emerald-700">Verified</p></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Role</p><p className="mt-2 text-sm font-semibold text-slate-800">{roleLabels[role] || role}</p><p className="mt-1 text-xs text-emerald-700">Identity confirmed</p></div>
        </div>
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><MapPin size={20} /></div><div><h2 className="text-lg font-bold text-slate-900">Privacy & Geofencing Controls</h2><p className="mt-1 text-sm text-slate-500">Control safety features used while tasks are active.</p></div></div>
        <div className="mt-4 divide-y divide-slate-100"><Toggle label="Background GPS location sharing" description="Share your location with an active task workspace for verified check-ins." checked={preferences.backgroundLocation} onChange={() => toggle("backgroundLocation")} /><Toggle label="Buddy System safety alerts" description="Notify your trusted buddy when a safety check-in needs attention." checked={preferences.buddyAlerts} onChange={() => toggle("buddyAlerts")} /></div>
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Bell size={20} /></div><div><h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2><p className="mt-1 text-sm text-slate-500">Choose which updates should reach you.</p></div></div>
        <div className="mt-4 divide-y divide-slate-100"><Toggle label="Email alerts" description="Receive important account and application messages by email." checked={preferences.emailAlerts} onChange={() => toggle("emailAlerts")} /><Toggle label="Task status updates" description="Get notified when an application or active task changes status." checked={preferences.taskUpdates} onChange={() => toggle("taskUpdates")} /><Toggle label="Campus radius notifications" description="See nearby task opportunities based on your selected campus radius." checked={preferences.campusRadius} onChange={() => toggle("campusRadius")} /></div>
      </section>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"><button type="button" onClick={savePreferences} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"><Check size={16} />Save Preferences</button>{saved && <p role="status" className="text-sm font-medium text-emerald-700">Preferences saved successfully.</p>}</div>
    </div>
  );
}
