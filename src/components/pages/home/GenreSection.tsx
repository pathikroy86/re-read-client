"use client";

import { getBooks, TBook } from "@/service/api";
import { useEffect, useMemo, useState } from "react";

type TGenre = {
  name: string;
  count: number;
  icon: string;
};

export function GenreSection() {
  const [books, setBooks] = useState<TBook[]>([]);
  const [loading, setLoading] = useState(true);

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

  const genres: TGenre[] = useMemo(() => {
    const genreMap = books.reduce<Record<string, number>>((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genreMap)
      .map(([name, count]) => ({
        name,
        count,
        icon: name.charAt(0).toUpperCase(),
      }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

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
          <p className="mt-3 text-sm text-slate-500">
            These genre totals are calculated from the books stored in MongoDB.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : genres.length ? (
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
                <p className="mt-1 text-sm text-slate-500">
                  {genre.count} {genre.count === 1 ? "book" : "books"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="font-semibold text-amber-800">
              No genres found. Start the backend server or add book listings.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
