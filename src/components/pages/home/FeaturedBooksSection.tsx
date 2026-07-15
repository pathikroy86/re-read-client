import Link from "next/link";

const books = [
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 420,
    genre: "Business",
    condition: "Like New",
    location: "Dhaka",
    color: "from-emerald-700 to-emerald-500",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 650,
    genre: "Technology",
    condition: "Good",
    location: "Chattogram",
    color: "from-slate-900 to-slate-600",
  },
  {
    title: "Ikigai",
    author: "Hector Garcia",
    price: 380,
    genre: "Self-help",
    condition: "Like New",
    location: "Sylhet",
    color: "from-amber-500 to-orange-400",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 520,
    genre: "History",
    condition: "Good",
    location: "Rajshahi",
    color: "from-cyan-700 to-teal-500",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 400,
    genre: "Finance",
    condition: "Fair",
    location: "Khulna",
    color: "from-red-500 to-amber-500",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    price: 480,
    genre: "Memoir",
    condition: "Good",
    location: "Barishal",
    color: "from-indigo-700 to-violet-500",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    price: 450,
    genre: "Productivity",
    condition: "Like New",
    location: "Dhaka",
    color: "from-blue-800 to-sky-500",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 300,
    genre: "Fiction",
    condition: "Good",
    location: "Chattogram",
    color: "from-yellow-600 to-amber-400",
  },
];

export default function FeaturedBooksSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Featured books
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Fresh listings from local readers
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all books
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.title}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`flex h-48 items-center justify-center bg-gradient-to-br ${book.color} p-6 text-center text-xl font-bold text-white`}
              >
                {book.title}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {book.genre}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {book.condition}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-950">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  Carefully used copy available from a verified ReRead reader.
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-emerald-700">
                      ৳{book.price}
                    </p>
                    <p className="text-xs text-slate-500">{book.location}</p>
                  </div>
                  <Link
                    href="/explore"
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
