import Link from "next/link";

const articles = [
  {
    title: "How to check a used book before buying",
    summary:
      "A quick checklist for edition, page quality, markings, binding, and fair pricing.",
    date: "12 July 2026",
  },
  {
    title: "Five ways to make old books last longer",
    summary:
      "Simple storage and care habits that protect paperbacks from humidity and dust.",
    date: "10 July 2026",
  },
  {
    title: "Why second-hand reading is better for students",
    summary:
      "Used books reduce cost, increase access, and keep useful learning materials in motion.",
    date: "8 July 2026",
  },
];

export function ReadingJournalSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Reading journal
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Practical guides for smarter reading
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Read all articles
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-sm font-medium text-slate-500">
                {article.date}
              </p>
              <h3 className="mt-3 text-xl font-bold text-slate-950">
                {article.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {article.summary}
              </p>
              <Link
                href="/blog"
                className="mt-5 inline-flex text-sm font-semibold text-emerald-700"
              >
                Continue reading
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
