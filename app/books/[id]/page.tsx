"use client";

import { getBook, getBooks, TBook } from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [book, setBook] = useState<TBook | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<TBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      const result = await getBook(params.id);

      if (!result.success) {
        setError(result.message || "Book not found");
        setLoading(false);
        return;
      }

      setBook(result.data);

      const booksResult = await getBooks();
      if (booksResult.success) {
        const related = booksResult.data
          .filter(
            (item: TBook) =>
              item.genre === result.data.genre && item.id !== result.data.id
          )
          .slice(0, 4);
        setRelatedBooks(related);
      }

      setLoading(false);
    };

    fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <main className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-950">
            {error || "Book not found"}
          </h1>
          <p className="mt-3 text-slate-600">
            The listing may have been removed or the backend server is not
            running.
          </p>
          <button
            onClick={() => router.push("/explore")}
            className="mt-6 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Explore
          </button>
        </div>
      </main>
    );
  }

  const listedDate = new Date(book.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/explore"
          className="mb-6 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Explore
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-[420px] bg-slate-100">
              {book.imageUrl ? (
                <Image
                  src={book.imageUrl}
                  alt={book.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-500 p-8 text-center text-3xl font-bold text-white">
                  {book.title}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {book.genre}
              </span>
              <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                {book.condition}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {book.status}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              {book.title}
            </h1>
            <p className="mt-2 text-lg text-slate-600">by {book.author}</p>
            <p className="mt-5 text-3xl font-black text-emerald-700">
              ৳{book.price}
            </p>
            <p className="mt-5 leading-7 text-slate-600">
              {book.shortDescription}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800">
                Save to Favorites
              </button>
              <a
                href={`mailto:${book.ownerEmail || "seller@reread.app"}`}
                className="rounded-full border border-emerald-200 px-6 py-3 text-center text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Contact Owner
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Overview
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Description
            </h2>
            <p className="mt-4 leading-8 text-slate-600">
              {book.fullDescription}
            </p>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Key information
            </p>
            <div className="mt-5 space-y-4">
              <Info label="Condition" value={book.condition} />
              <Info label="Location" value={book.location} />
              <Info label="Language" value={book.language} />
              <Info label="Edition" value={book.edition} />
              <Info label="Listed" value={listedDate} />
              <Info label="Owner" value={book.ownerName || "ReRead Seller"} />
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Reader reviews
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-5">
            <p className="text-amber-500">★★★★★</p>
            <p className="mt-2 text-slate-600">
              4.8 — Clean copy and exactly as described.
            </p>
          </div>
        </section>

        {relatedBooks.length > 0 && (
          <section className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Related books
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              More from {book.genre}
            </h2>

            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedBooks.map((item) => (
                <Link
                  href={`/books/${item.id}`}
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-40 bg-slate-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-emerald-700 p-4 text-center font-bold text-white">
                        {item.title}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      ৳{item.price} · {item.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-right text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
