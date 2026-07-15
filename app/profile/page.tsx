"use client";

import { getFavorites, TFavorite } from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TUser = {
  name: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<TUser | null>(null);
  const [favorites, setFavorites] = useState<TFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionRes = await fetch("/api/auth/get-session", {
          cache: "no-store",
        });
        const session = await sessionRes.json();

        if (!session?.user) {
          router.push("/login");
          return;
        }

        setUser(session.user);

        const result = await getFavorites(session.user.email);
        if (result.success) {
          setFavorites(result.data);
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-emerald-700">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl bg-emerald-800 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
            Profile
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            {user?.name || "ReRead Reader"}
          </h1>
          <p className="mt-3 text-emerald-50">{user?.email}</p>
          <div className="mt-6 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
            {favorites.length} saved {favorites.length === 1 ? "book" : "books"}
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Saved favorites
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Books you saved
              </h2>
            </div>
            <Link
              href="/explore"
              className="rounded-full bg-emerald-700 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Explore More Books
            </Link>
          </div>

          {favorites.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {favorites.map((favorite) => (
                <article
                  key={favorite.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 bg-slate-100">
                    {favorite.book.imageUrl ? (
                      <Image
                        src={favorite.book.imageUrl}
                        alt={favorite.book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-emerald-700 p-6 text-center text-xl font-bold text-white">
                        {favorite.book.title}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {favorite.book.genre}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {favorite.book.condition}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-950">
                      {favorite.book.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {favorite.book.author}
                    </p>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                      {favorite.book.shortDescription}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-emerald-700">
                          ৳{favorite.book.price}
                        </p>
                        <p className="text-xs text-slate-500">
                          {favorite.book.location}
                        </p>
                      </div>
                      <Link
                        href={`/books/${favorite.book.id}`}
                        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
              <h3 className="text-xl font-bold text-slate-950">
                No favorite books yet
              </h3>
              <p className="mt-2 text-slate-600">
                Open a book details page and click Save to Favorites.
              </p>
              <Link
                href="/explore"
                className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
              >
                Browse Books
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
