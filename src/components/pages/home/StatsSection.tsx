const stats = [
  { label: "Available books", value: "1,280" },
  { label: "Active readers", value: "840" },
  { label: "Genres covered", value: "32" },
  { label: "Cities reached", value: "12" },
];

export function StatsSection() {
  return (
    <section className="bg-emerald-800 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur"
            >
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="mt-2 text-sm text-emerald-50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
