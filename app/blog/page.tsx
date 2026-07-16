"use client";

import { getBlogs, TBlog } from "@/service/api";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<TBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await getBlogs();

      if (result.success) {
        setBlogs(result.data);
      }

      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(blogs.map((blog) => blog.category)))];
  }, [blogs]);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || blog.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
              ReRead Blog
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Share your thoughts about books you love.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Write reflections, reading notes, reviews, and recommendations
              about any book. Readers can discuss each post through comments.
            </p>
          </div>

          <Link
            href="/blog/write"
            className="rounded-full bg-white px-7 py-3 text-center text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
          >
            Write a Blog
          </Link>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Search by blog, book, or writer..."
            />

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
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-3xl bg-slate-200"
                />
              ))}
            </div>
          ) : filteredBlogs.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center">
              <h2 className="text-2xl font-black text-slate-950">
                No blogs found
              </h2>
              <p className="mt-3 text-slate-600">
                Write the first ReRead blog or adjust your search filters.
              </p>
              <Link
                href="/blog/write"
                className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white"
              >
                Write a Blog
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function BlogCard({ blog }: { blog: TBlog }) {
  const createdAt = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className="flex h-52 items-center justify-center bg-emerald-700 bg-cover bg-center p-6 text-center text-2xl font-black text-white"
        style={
          blog.coverImage
            ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.45)), url(${blog.coverImage})` }
            : undefined
        }
      >
        {!blog.coverImage && blog.bookTitle}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {blog.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {blog.readTime}
          </span>
        </div>

        <h2 className="text-xl font-black text-slate-950">{blog.title}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          About: {blog.bookTitle}
        </p>
        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
          {blog.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-bold text-slate-950">
              {blog.authorName}
            </p>
            <p className="text-xs text-slate-500">
              {createdAt} · {blog.commentsCount} comments
            </p>
          </div>

          <Link
            href={`/blog/${blog.id}`}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  );
}
