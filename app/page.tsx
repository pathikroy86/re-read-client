export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
          Used Book Marketplace
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Give great books a second story.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Find affordable pre-owned books from readers near you. Browse,
          review, save favorites, and list your own books with ReRead.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/explore"
            className="rounded-full bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Explore Books
          </a>
          <a
            href="/items/add"
            className="rounded-full border border-emerald-200 px-6 py-3 text-center text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Sell a Book
          </a>
        </div>
      </div>
    </section>
  );
}
