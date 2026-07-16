"use client";

import { addBlog } from "@/service/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type TUser = {
  name: string;
  email: string;
};

const categories = [
  "Book Review",
  "Reading Notes",
  "Recommendation",
  "Classic Books",
  "Study Guide",
  "Personal Reflection",
];

export default function WriteBlogPage() {
  const router = useRouter();
  const [user, setUser] = useState<TUser | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/get-session", {
          cache: "no-store",
        });
        const session = await res.json();

        if (!session?.user) {
          router.push("/login");
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setCheckingUser(false);
      }
    };

    fetchSession();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);
      const result = await addBlog({
        title,
        bookTitle,
        category,
        coverImage,
        excerpt,
        content,
        authorName: user.name,
        authorEmail: user.email,
      });

      if (!result.success) {
        setError(result.message || "Failed to publish blog");
        return;
      }

      router.push(`/blog/${result.data.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong while publishing your blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingUser) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-emerald-700">
            Checking your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex text-sm font-bold text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Blogs
        </Link>

        <section className="rounded-3xl bg-emerald-900 p-8 text-white shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
            Write a Blog
          </p>
          <h1 className="mt-3 text-4xl font-black">
            Publish your book thoughts
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-emerald-50">
            Share a review, reading lesson, favorite quote discussion, study
            note, or recommendation about any book.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Blog title
              </span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="What this blog is about"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Book name
              </span>
              <input
                required
                value={bookTitle}
                onChange={(event) => setBookTitle(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="The book you are writing about"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Category
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Cover image URL
              </span>
              <input
                value={coverImage}
                onChange={(event) => setCoverImage(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Optional image URL"
              />
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Short summary
              </span>
              <textarea
                required
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="A short preview for readers"
              />
            </label>

            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Full blog
              </span>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Write your full blog here..."
              />
            </label>
          </div>

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 rounded-full bg-emerald-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {submitting ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </main>
  );
}
