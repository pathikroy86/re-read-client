import Link from "next/link";

const values = [
  {
    title: "Affordable reading",
    description:
      "ReRead helps readers discover gently used books at student-friendly and family-friendly prices.",
  },
  {
    title: "Local exchange",
    description:
      "Listings are designed around nearby pickup, simple contact, and clear owner information.",
  },
  {
    title: "Longer book life",
    description:
      "Every resale keeps a good book in circulation and makes shelves more useful for the next reader.",
  },
];

const steps = [
  "Readers add books with honest condition, location, price, and description.",
  "Buyers explore books by genre, condition, location, and price.",
  "Interested readers save favorites or contact the owner from the details page.",
];

const numbers = [
  { value: "40+", label: "real books listed" },
  { value: "12+", label: "genres available" },
  { value: "3", label: "simple exchange steps" },
  { value: "24/7", label: "book browsing" },
];

export default function AboutPage() {
  return (
    <main className="bg-slate-50">
      <section className="relative overflow-hidden bg-emerald-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-300 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
              About ReRead
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              A cleaner, simpler way to give books a second life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
              ReRead is a used book marketplace built for readers who want to
              buy, sell, and save books without complicated steps. It keeps the
              experience focused: browse real listings, view clear details, save
              favorites, and contact the owner.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/explore"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
              >
                Explore Books
              </Link>
              <Link
                href="/items/add"
                className="rounded-full border border-white/40 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Add Your Book
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Marketplace focus
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Used books, real readers
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  ReRead
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl bg-slate-50 p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {numbers.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-black text-emerald-700">
                  {item.value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Our mission
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Make reading more reachable for everyone.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Many great books sit unused after one reader finishes them. ReRead
              turns those books into useful listings with clear descriptions,
              fair prices, and owner contact details, so another reader can pick
              them up with confidence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                  📚
                </div>
                <h3 className="text-lg font-bold text-slate-950">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-950 p-8 text-white shadow-sm sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                Join the reading loop
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Ready to find your next pre-loved book?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Start with the Explore page, save your favorites, and contact
                book owners when a listing feels right.
              </p>
            </div>

            <Link
              href="/explore"
              className="rounded-full bg-emerald-600 px-7 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
