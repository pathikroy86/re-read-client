const genres = [
  { name: "Fiction", count: "124 books", icon: "F" },
  { name: "Technology", count: "86 books", icon: "T" },
  { name: "Business", count: "73 books", icon: "B" },
  { name: "Self-development", count: "95 books", icon: "S" },
  { name: "Academic", count: "148 books", icon: "A" },
];

export function GenreSection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Browse by genre
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Find your next read faster
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {genres.map((genre) => (
            <div
              key={genre.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
                {genre.icon}
              </div>
              <h3 className="font-bold text-slate-950">{genre.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{genre.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
