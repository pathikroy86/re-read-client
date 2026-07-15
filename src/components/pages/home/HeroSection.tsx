import Link from "next/link";

const heroBooks = [
  {
    title: "Atomic Habits",
    price: 420,
    color: "bg-emerald-700",
    rotate: "rotate-1",
  },
  {
    title: "The Alchemist",
    price: 350,
    color: "bg-amber-500",
    rotate: "-rotate-1",
  },
  {
    title: "Deep Work",
    price: 520,
    color: "bg-slate-800",
    rotate: "rotate-2",
  },
];

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="mx-auto grid min-h-[calc(70vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            Used Book Marketplace
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Give great books a second story.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Find affordable pre-owned books from readers near you. Browse,
            review, save favorites, and list your own books with confidence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/explore"
              className="rounded-full bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              Explore Books
            </Link>
            <Link
              href="/items/add"
              className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-center text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Sell a Book
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -left-4 top-8 h-28 w-28 rounded-full bg-amber-200 blur-2xl" />
          <div className="absolute -right-6 bottom-10 h-32 w-32 rounded-full bg-emerald-200 blur-2xl" />
          <div className="relative rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Popular this week
                </p>
                <h2 className="text-xl font-bold text-slate-950">
                  Reader picks
                </h2>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                4.8 rating
              </span>
            </div>

            <div className="space-y-4">
              {heroBooks.map((book) => (
                <div
                  key={book.title}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div
                    className={`flex h-20 w-14 ${book.rotate} items-center justify-center rounded-xl ${book.color} text-center text-xs font-bold leading-tight text-white shadow-md`}
                  >
                    {book.title.split(" ")[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-950">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Pre-owned edition - Dhaka
                    </p>
                  </div>
                  <p className="font-bold text-emerald-700">৳{book.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
