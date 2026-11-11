"use client";

import { ArrowDown, Banknote, CheckCircle2, ClipboardList, Search, UserRound } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find a task that fits your day",
    icon: Search,
    accent: "bg-[#e8f3eb] text-[#448361]",
    description: "Browse nearby physical tasks and check the location, timing, requirements, and student compensation before you apply.",
    tip: "Tip: Keep your availability and preferred travel area current so the right tasks are easier to spot.",
  },
  {
    number: "02",
    title: "Send a clear request",
    icon: ClipboardList,
    accent: "bg-[#fff1d8] text-[#b87918]",
    description: "Open the task brief, introduce yourself, and explain why you are a good fit. A short, specific message helps the task poster decide quickly.",
    tip: "Tip: Mention relevant experience, your available time, and anything you will bring to the task.",
  },
  {
    number: "03",
    title: "Confirm the assignment",
    icon: UserRound,
    accent: "bg-[#e7efff] text-[#3674c5]",
    description: "Once the poster confirms you, review the agreed time, meeting point, deliverables, and payment details in your task workspace.",
    tip: "Tip: Ask questions before starting so expectations are clear for everyone.",
  },
  {
    number: "04",
    title: "Complete the work safely",
    icon: CheckCircle2,
    accent: "bg-[#f3eaf8] text-[#916bc7]",
    description: "Arrive prepared, follow the task instructions, and use the workspace to keep communication and progress visible from start to finish.",
    tip: "Tip: Share a completion update or proof of delivery when the task calls for it.",
  },
  {
    number: "05",
    title: "Receive your direct payment",
    icon: Banknote,
    accent: "bg-[#ffe5e1] text-[#c35d51]",
    description: "After the task is approved, your agreed compensation is released directly to you in LKR. Your completed work also strengthens your UniWorkSL profile.",
    tip: "Tip: Keep your payment details accurate and build a reliable record through consistent delivery.",
  },
];

export default function PhysicalPage() {
  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#37352f] font-sans selection:bg-blue-100">
      <main className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="mb-12 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e6e2dc] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#787774] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#007fff]" /> Physical tasks
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">From task discovery to payment.</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#787774] sm:text-lg">
            A simple path for getting useful work done on campus, nearby, and in your community.
          </p>
        </header>

        <section className="relative" aria-label="How physical tasks work">
          <div className="absolute bottom-8 left-[1.25rem] top-8 hidden w-px bg-[#e6e2dc] sm:block" aria-hidden="true" />
          <div className="space-y-3 sm:space-y-4">
            {steps.map(({ number, title, icon: Icon, accent, description, tip }) => (
              <details key={number} className="group relative rounded-xl border border-[#e6e2dc] bg-white/85 shadow-[0_4px_16px_rgba(55,53,47,0.03)] backdrop-blur-sm open:border-[#cbd5e1]">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-5 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-[#f7f7f5] text-xs font-bold text-[#787774] shadow-sm">{number}</span>
                  <span className="flex-1 text-base font-semibold text-slate-900 sm:text-lg">{title}</span>
                  <ArrowDown size={18} className="shrink-0 text-[#787774] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="border-t border-[#ededed] px-4 pb-6 pt-5 pl-[4.5rem] sm:px-6 sm:pl-[5.5rem]">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${accent}`}><Icon size={20} /></div>
                  <p className="max-w-2xl text-sm leading-7 text-[#505050]">{description}</p>
                  <p className="mt-4 max-w-2xl rounded-lg bg-[#f7f7f5] px-4 py-3 text-xs font-medium leading-5 text-[#787774]">{tip}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}