"use client";

import { getBook, getBooks, saveFavorite, TBook } from "@/service/api";
import { Modal, useOverlayState } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const contactModal = useOverlayState();
  const [book, setBook] = useState<TBook | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<TBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [savingFavorite, setSavingFavorite] = useState(false);

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
  const ownerName = book.ownerName || "ReRead Seller";
  const ownerEmail = book.ownerEmail || "seller@reread.app";

  const handleSaveFavorite = async () => {
    setFavoriteMessage("");
    setFavoriteError("");

    try {
      setSavingFavorite(true);
      const sessionRes = await fetch("/api/auth/get-session", {
        cache: "no-store",
      });
      const session = await sessionRes.json();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const result = await saveFavorite({
        bookId: book.id,
        userEmail: session.user.email,
        userName: session.user.name,
      });

      if (!result.success) {
        setFavoriteError(result.message || "Failed to save favorite");
        return;
      }

      setFavoriteMessage(result.message);
    } catch (error) {
      console.error(error);
      setFavoriteError("Something went wrong while saving this book");
    } finally {
      setSavingFavorite(false);
    }
  };

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
              <button
                onClick={handleSaveFavorite}
                disabled={savingFavorite}
                className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
              >
                {savingFavorite ? "Saving..." : "Save to Favorites"}
              </button>
              <Modal state={contactModal}>
                <Modal.Trigger className="rounded-full border border-emerald-200 px-6 py-3 text-center text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50">
                  Contact Owner
                </Modal.Trigger>
                <Modal.Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
                  <Modal.Container
                    placement="center"
                    size="md"
                    className="w-full max-w-lg outline-none"
                  >
                    <Modal.Dialog className="relative rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl outline-none">
                      <Modal.CloseTrigger className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900" />

                      <Modal.Header className="rounded-t-3xl bg-emerald-700 px-6 py-6 text-white">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
                            Owner information
                          </p>
                          <Modal.Heading className="mt-2 text-2xl font-bold">
                            Contact {ownerName}
                          </Modal.Heading>
                        </div>
                      </Modal.Header>

                      <Modal.Body className="space-y-5 px-6 py-6">
                        <div className="rounded-2xl bg-slate-50 p-5">
                          <p className="text-sm font-semibold text-slate-500">
                            Book
                          </p>
                          <h3 className="mt-1 text-lg font-bold text-slate-950">
                            {book.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {book.location} · ৳{book.price}
                          </p>
                        </div>

                        <div className="grid gap-3">
                          <OwnerInfo label="Owner name" value={ownerName} />
                          <OwnerInfo label="Email address" value={ownerEmail} />
                          <OwnerInfo label="Location" value={book.location} />
                          <OwnerInfo label="Listing status" value={book.status} />
                        </div>

                        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                          Message the owner to confirm availability, pickup
                          place, and final book condition before meeting.
                        </p>
                      </Modal.Body>

                      <Modal.Footer className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
                        <Modal.CloseTrigger className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                          Close
                        </Modal.CloseTrigger>
                        <a
                          href={`mailto:${ownerEmail}?subject=Interested in ${encodeURIComponent(
                            book.title
                          )}`}
                          className="rounded-full bg-emerald-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
                        >
                          Send Email
                        </a>
                      </Modal.Footer>
                    </Modal.Dialog>
                  </Modal.Container>
                </Modal.Backdrop>
              </Modal>
            </div>

            {favoriteMessage && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {favoriteMessage}
              </p>
            )}

            {favoriteError && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {favoriteError}
              </p>
            )}
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
              <Info label="Owner" value={ownerName} />
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

function OwnerInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
