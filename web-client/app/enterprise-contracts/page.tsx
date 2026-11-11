import { BriefcaseBusiness, Clock3, UsersRound } from "lucide-react";

const options = [
  {
    icon: BriefcaseBusiness,
    title: "Quick purchase",
    description: "Request a ready-to-coordinate group for a defined shift, such as event setup, registration desks, product sampling, or venue support.",
  },
  {
    icon: Clock3,
    title: "Time-assigned workforce",
    description: "Plan recurring or longer assignments with a clear schedule, headcount, task brief, and on-site contact for the student team.",
  },
  {
    icon: UsersRound,
    title: "A coordinated student team",
    description: "Tell us the number of people, location, date, and responsibilities. UniWorkSL helps you organise the request and connect with available students.",
  },
];

export default function EnterpriseContractsPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#37352f] font-sans">
      <main className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <section className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#007fff]">For corporate clients</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Reliable hands for the work in between.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#787774] sm:text-lg">
            Use UniWorkSL when your business needs capable student support for a quick activation or a scheduled block of physical work.
          </p>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Enterprise contract options">
          {options.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl border border-[#e3e3df] bg-white p-6 shadow-[0_4px_16px_rgba(55,53,47,0.04)]">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8efff] text-[#3674c5]"><Icon size={21} /></div>
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#787774]">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-8 rounded-xl border border-[#deded9] bg-white p-6 shadow-[0_8px_24px_rgba(55,53,47,0.04)] sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#787774]">Quick purchase pricing</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">One clear platform fee, separate from student pay.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#787774]">
              For a quick request, UniWorkSL charges a base platform fee of <strong className="text-[#37352f]">LKR 100</strong>. Student compensation is agreed separately and is typically around <strong className="text-[#37352f]">LKR 1,500 to 3,000 per day per student</strong>, depending on the role, duration, and requirements.
            </p>
          </div>
          <div className="rounded-lg border border-[#e6e2dc] bg-[#f7f7f5] px-6 py-5 text-center md:min-w-44">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#787774]">Base fee</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-[#007fff]">LKR 100</p>
          </div>
        </section>

        <p className="mt-8 max-w-2xl text-sm leading-6 text-[#787774]">Share your headcount, task brief, location, and preferred timing with your UniWorkSL contact to begin planning a contract.</p>
      </main>
    </div>
  );
}