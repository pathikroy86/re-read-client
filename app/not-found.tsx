import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
        <div className="bg-emerald-800 p-8 text-white sm:p-10 lg:p-12">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50">
            404 Not Found
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            This page has slipped off the shelf.
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-emerald-50">
            The page you are looking for may have been moved, deleted, or never
            existed in the ReRead library.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl bg-white/10 p-5">
              <h2 className="font-semibold">Looking for books?</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">
                Browse the Explore page to find real listings from the ReRead
                database.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <h2 className="font-semibold">Want to add your own?</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">
                Logged-in readers can publish a used book listing in minutes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-emerald-100 text-5xl font-black text-emerald-700">
            R
          </div>

          <div className="mt-8 text-center">
            <p className="text-8xl font-black tracking-tight text-slate-950">
              404
            </p>
            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              Page not found
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
              Let&apos;s get you back to a working page before the plot gets
              too mysterious.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Back to Home
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-emerald-200 px-6 py-3 text-center text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Explore Books
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
