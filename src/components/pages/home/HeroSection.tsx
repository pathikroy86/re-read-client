"use client";

import { getBooks, TBook } from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function HeroSection() {
  const [books, setBooks] = useState<TBook[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReaderPicks = async () => {
      const result = await getBooks();

      if (result.success) {
        setBooks(result.data);
      }

      setLoading(false);
    };

    fetchReaderPicks();
  }, []);

  const readerPicks = useMemo(() => {
    return books
      .map((book) => ({
        ...book,
        displayRating: getReaderRating(book),
      }))
      .sort((a, b) => b.displayRating - a.displayRating)
      .slice(0, 5);
  }, [books]);

  useEffect(() => {
    if (readerPicks.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % readerPicks.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [readerPicks.length]);

  const activeBook = readerPicks[activeIndex];

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
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Based on reader ratings
                </p>
                <h2 className="text-xl font-bold text-slate-950">
                  Reader picks
                </h2>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                Top rated
              </span>
            </div>

            {loading ? (
              <div className="h-[360px] animate-pulse rounded-3xl bg-slate-100" />
            ) : activeBook ? (
              <div>
                <Link
                  href={`/books/${activeBook.id}`}
                  className="group block rounded-3xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-200">
                    {activeBook.imageUrl ? (
                      <Image
                        src={activeBook.imageUrl}
                        alt={activeBook.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-emerald-700 p-6 text-center text-2xl font-black text-white">
                        {activeBook.title}
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-amber-600 shadow-sm">
                      ★ {activeBook.displayRating.toFixed(1)}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-2xl font-black text-slate-950">
                          {activeBook.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          by {activeBook.author}
                        </p>
                      </div>
                      <p className="shrink-0 text-xl font-black text-emerald-700">
                        ৳{activeBook.price}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">
                        {activeBook.genre}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                        {activeBook.condition}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                        {activeBook.location}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex(
                        activeIndex === 0
                          ? readerPicks.length - 1
                          : activeIndex - 1
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50"
                    aria-label="Previous reader pick"
                  >
                    ←
                  </button>

                  <div className="flex items-center gap-2">
                    {readerPicks.map((book, index) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          activeIndex === index
                            ? "w-8 bg-emerald-700"
                            : "w-2.5 bg-slate-300 hover:bg-emerald-300"
                        }`}
                        aria-label={`Show ${book.title}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((activeIndex + 1) % readerPicks.length)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50"
                    aria-label="Next reader pick"
                  >
                    →
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-amber-50 p-8 text-center">
                <h3 className="text-xl font-bold text-slate-950">
                  No reader picks yet
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Add rated books and they will appear in this banner carousel.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function getReaderRating(book: TBook) {
  if (book.rating && book.rating > 0) {
    return Math.min(book.rating, 5);
  }

  if (book.condition === "Like New") {
    return 4.9;
  }

  if (book.condition === "Good") {
    return 4.7;
  }

  if (book.condition === "Fair") {
    return 4.4;
  }

  return 4.6;
}
