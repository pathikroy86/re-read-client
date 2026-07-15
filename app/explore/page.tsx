"use client";

import { getBooks, TBook } from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const booksPerPage = 8;

export default function ExplorePage() {
  const [books, setBooks] = useState<TBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [condition, setCondition] = useState("All");
  const [location, setLocation] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      const result = await getBooks();

      if (result.success) {
        setBooks(result.data);
      }

      setLoading(false);
    };

    fetchBooks();
  }, []);

  const genres = useMemo(
    () => ["All", ...Array.from(new Set(books.map((book) => book.genre)))],
    [books]
  );

  const conditions = useMemo(
    () => ["All", ...Array.from(new Set(books.map((book) => book.condition)))],
    [books]
  );

  const locations = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(books.map((book) => book.location.split(",").pop()?.trim() || book.location))
      ),
    ],
    [books]
  );

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(keyword) ||
          book.author.toLowerCase().includes(keyword)
      );
    }

    if (genre !== "All") {
      result = result.filter((book) => book.genre === genre);
    }

    if (condition !== "All") {
      result = result.filter((book) => book.condition === condition);
    }

    if (location !== "All") {
      result = result.filter((book) => book.location.includes(location));
    }

    if (sort === "Price Low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "Price High") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "Newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [books, search, genre, condition, location, sort]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage) || 1;
  const visibleBooks = filteredBooks.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  );

  const clearFilters = () => {
    setSearch("");
    setGenre("All");
    setCondition("All");
    setLocation("All");
    setSort("Newest");
    setPage(1);
  };

  const handleFilterChange = (callback: () => void) => {
    callback();
    setPage(1);
  };

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-emerald-800 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
            Explore books
          </p>
          <h1 className="mt-2 text-4xl font-bold">Find your next used book</h1>
          <p className="mt-3 max-w-2xl text-emerald-50">
            These listings are loaded from your MongoDB database through the
            Express backend.
          </p>
        </div>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleFilterChange(() => setSearch(event.target.value))
              }
              placeholder="Search title or author"
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            <select
              value={genre}
              onChange={(event) =>
                handleFilterChange(() => setGenre(event.target.value))
              }
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {genres.map((item) => (
                <option key={item} value={item}>
                  Genre: {item}
                </option>
              ))}
            </select>

            <select
              value={condition}
              onChange={(event) =>
                handleFilterChange(() => setCondition(event.target.value))
              }
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {conditions.map((item) => (
                <option key={item} value={item}>
                  Condition: {item}
                </option>
              ))}
            </select>

            <select
              value={location}
              onChange={(event) =>
                handleFilterChange(() => setLocation(event.target.value))
              }
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  Location: {item}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) =>
                handleFilterChange(() => setSort(event.target.value))
              }
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Price Low">Price: Low to High</option>
              <option value="Price High">Price: High to Low</option>
            </select>
          </div>
        </section>

        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm font-medium text-slate-600">
            Showing {visibleBooks.length} of {filteredBooks.length} books
          </p>
          <button
            onClick={clearFilters}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear filters
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : visibleBooks.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleBooks.map((book) => (
              <article
                key={book.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 bg-slate-100">
                  {book.imageUrl ? (
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-500 p-6 text-center text-xl font-bold text-white">
                      {book.title}
                    </div>
                  )}
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
                  <h2 className="text-lg font-bold text-slate-950">
                    {book.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                    {book.shortDescription}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-emerald-700">
                        ৳{book.price}
                      </p>
                      <p className="text-xs text-slate-500">{book.location}</p>
                    </div>
                    <Link
                      href={`/books/${book.id}`}
                      className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No books match your filters
            </h2>
            <p className="mt-2 text-slate-600">
              Try another title, genre, condition, or location.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && filteredBooks.length > booksPerPage && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
