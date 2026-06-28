export default function StudentTasksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Available Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
            <div className="h-6 w-3/4 bg-gray-100 rounded" />
            <div className="h-8 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}