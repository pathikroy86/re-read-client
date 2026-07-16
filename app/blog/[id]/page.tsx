"use client";

import { addBlogComment, getBlog, TBlog } from "@/service/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type TUser = {
  name: string;
  email: string;
};

export default function BlogDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<TBlog | null>(null);
  const [user, setUser] = useState<TUser | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  const refreshBlog = async () => {
    const result = await getBlog(params.id);

    if (!result.success) {
      setError(result.message || "Blog not found");
      setLoading(false);
      return;
    }

    setBlog(result.data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const blogResult = await getBlog(params.id);

        if (!blogResult.success) {
          setError(blogResult.message || "Blog not found");
          setLoading(false);
          return;
        }

        setBlog(blogResult.data);

        const res = await fetch("/api/auth/get-session", {
          cache: "no-store",
        });
        const session = await res.json();
        setUser(session?.user || null);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while loading this blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [params.id]);

  const handleComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCommentError("");
    setCommentSuccess("");

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);
      const result = await addBlogComment(params.id, {
        comment,
        userName: user.name,
        userEmail: user.email,
      });

      if (!result.success) {
        setCommentError(result.message || "Failed to add comment");
        return;
      }

      setComment("");
      setCommentSuccess("Comment added successfully.");
      await refreshBlog();
    } catch (error) {
      console.error(error);
      setCommentError("Something went wrong while adding your comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="text-2xl font-black text-slate-950">
            {error || "Blog not found"}
          </h1>
          <p className="mt-3 text-slate-600">
            The blog may have been removed or the backend server is not running.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white"
          >
            Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  const createdAt = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/blog"
          className="mb-6 inline-flex text-sm font-bold text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Blogs
        </Link>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div
            className="flex min-h-80 items-center justify-center bg-emerald-800 bg-cover bg-center p-8 text-center text-4xl font-black text-white sm:text-5xl"
            style={
              blog.coverImage
                ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.35), rgba(15, 23, 42, 0.65)), url(${blog.coverImage})` }
                : undefined
            }
          >
            {!blog.coverImage && blog.bookTitle}
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                {blog.category}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                {blog.readTime}
              </span>
              <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
                {blog.commentsCount} comments
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {blog.title}
            </h1>
            <p className="mt-4 text-lg font-semibold text-slate-600">
              About: {blog.bookTitle}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Written by {blog.authorName} · {createdAt}
            </p>

            <p className="mt-8 rounded-3xl bg-emerald-50 p-6 text-lg leading-8 text-emerald-900">
              {blog.excerpt}
            </p>

            <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">
              {blog.content}
            </div>
          </div>
        </article>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Discussion
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Comments
              </h2>
            </div>

            {!user && (
              <Link
                href="/login"
                className="rounded-full border border-emerald-200 px-5 py-2 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                Login to Comment
              </Link>
            )}
          </div>

          <form onSubmit={handleComment} className="rounded-3xl bg-slate-50 p-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Write a comment
              </span>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder={
                  user
                    ? "Share your response to this blog..."
                    : "Login first to add a comment"
                }
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>

            {commentSuccess && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {commentSuccess}
              </p>
            )}

            {commentError && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {commentError}
              </p>
            )}
          </form>

          <div className="mt-8 space-y-4">
            {blog.comments?.length ? (
              blog.comments.map((item) => {
                const commentDate = new Date(item.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                );

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <p className="font-bold text-slate-950">
                          {item.userName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.userEmail}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        {commentDate}
                      </p>
                    </div>
                    <p className="mt-4 leading-7 text-slate-600">
                      {item.comment}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
                <h3 className="text-xl font-bold text-slate-950">
                  No comments yet
                </h3>
                <p className="mt-2 text-slate-600">
                  Be the first reader to start the discussion.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
