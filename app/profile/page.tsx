"use client";

import {
  getFavorites,
  getProfile,
  TFavorite,
  TProfile,
  updateProfile,
} from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const emptyProfile: TProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  profileImage: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<TProfile>(emptyProfile);
  const [favorites, setFavorites] = useState<TFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionRes = await fetch("/api/auth/get-session", {
          cache: "no-store",
        });
        const session = await sessionRes.json();

        if (!session?.user) {
          router.push("/login?redirect=/profile");
          return;
        }

        const profileResult = await getProfile();

        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data);
        } else {
          setProfile({
            ...emptyProfile,
            name: session.user.name || "",
            email: session.user.email || "",
            profileImage: session.user.image || "",
          });
        }

        const result = await getFavorites(session.user.email);
        if (result.success) {
          setFavorites(result.data);
        }
      } catch (error) {
        console.error(error);
        router.push("/login?redirect=/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (field: keyof TProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 650000) {
      setError("Please upload an image smaller than 650KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      setProfile({
        ...profile,
        profileImage: String(reader.result),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setSaving(true);
      const result = await updateProfile(profile);

      if (!result.success) {
        setError(result.message || "Failed to update profile");
        return;
      }

      setProfile(result.data);
      setMessage(result.message);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while updating your profile.");
    } finally {
      setSaving(false);
    }
  };

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
        <section className="mb-8 overflow-hidden rounded-3xl bg-emerald-800 text-white">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <ProfilePhoto name={profile.name} image={profile.profileImage} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
                Profile
              </p>
              <h1 className="mt-2 text-4xl font-bold">
                {profile.name || "ReRead Reader"}
              </h1>
              <p className="mt-3 text-emerald-50">{profile.email}</p>
              <div className="mt-6 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
                {favorites.length} saved{" "}
                {favorites.length === 1 ? "book" : "books"}
              </div>
            </div>
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              Dashboard
            </Link>
          </div>
        </section>

        <section className="mb-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Profile photo
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Upload your photo
            </h2>

            <div className="mt-6 flex flex-col items-center rounded-3xl bg-slate-50 p-6 text-center">
              <ProfilePhoto name={profile.name} image={profile.profileImage} />
              <label className="mt-5 cursor-pointer rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => handleChange("profileImage", "")}
                className="mt-3 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                Remove Photo
              </button>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Upload a square photo under 650KB. It will appear on this page
                and in the navbar.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Edit information
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Update your reader profile
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Full name
                </span>
                <input
                  required
                  value={profile.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  disabled
                  value={profile.email}
                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Phone
                </span>
                <input
                  value={profile.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                  placeholder="+880 1..."
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Location
                </span>
                <input
                  value={profile.location}
                  onChange={(event) =>
                    handleChange("location", event.target.value)
                  }
                  placeholder="Dhanmondi, Dhaka"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Bio
                </span>
                <textarea
                  rows={5}
                  value={profile.bio}
                  onChange={(event) => handleChange("bio", event.target.value)}
                  placeholder="Tell other readers what kind of books you enjoy."
                  className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>

            {message && (
              <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {message}
              </p>
            )}

            {error && (
              <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 rounded-full bg-emerald-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
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

function ProfilePhoto({ name, image }: { name: string; image?: string }) {
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-emerald-700 text-4xl font-black text-white shadow-lg">
      {image ? (
        <Image
          src={image}
          alt={name || "Profile photo"}
          fill
          sizes="128px"
          className="object-cover"
          unoptimized
        />
      ) : (
        (name || "R").slice(0, 1).toUpperCase()
      )}
    </div>
  );
}
