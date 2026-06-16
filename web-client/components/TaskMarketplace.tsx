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
  return (
    <section className="max-w-[68.5rem] w-full mx-auto px-6 pb-24 z-20">
      <div className="border-t border-slate-200/60 pt-12 mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Available Ecosystem Task Opportunities
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Explore transparent requirements sourced across regional student clusters.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 text-sm">
            No task entries active. Tasks posted will sync automatically here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                    {task.title}
                  </h3>
                  <span className="text-sm font-extrabold text-[#007FFF] bg-[#007FFF]/5 px-2.5 py-1 rounded-md whitespace-nowrap">
                    LKR {task.budget.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {task.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {task.skills_required.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-3">
                  <span>Deadline: {task.deadline}</span>
                  <button className="text-[#007FFF] font-semibold hover:underline">
                    View Spec
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}