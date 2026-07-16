"use client";

import { addToCart, getBooks, TBook } from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeaturedBooksSection() {
  const router = useRouter();
  const [books, setBooks] = useState<TBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const result = await getBooks();

      if (result.success) {
        setBooks(result.data.slice(0, 8));
      }

      setLoading(false);
    };

    fetchBooks();
  }, []);

  const handleAddToCart = async (bookId: string) => {
    const result = await addToCart({ bookId });

    if (result.message === "Please login first") {
      router.push("/login?redirect=/cart");
      return;
    }

    setMessage(result.message || "Book added to cart");
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Featured books
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Fresh listings from MongoDB
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all books
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : books.length ? (
          <>
            {message && (
              <p className="mb-6 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
                {message}
              </p>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((book) => (
                <div
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
                  <h3 className="text-lg font-bold text-slate-950">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                    {book.shortDescription}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-emerald-700">
                        ৳{book.price}
                      </p>
                      <p className="text-xs text-slate-500">{book.location}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(book.id)}
                        className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                      >
                        Add Cart
                      </button>
                      <Link
                        href={`/books/${book.id}`}
                        className="rounded-full bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="font-semibold text-amber-800">
              No books found. Start the Express server or add a book listing.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
