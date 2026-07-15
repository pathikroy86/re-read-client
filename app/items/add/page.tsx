"use client";

import { addBook } from "@/service/api";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type TUser = {
  name: string;
  email: string;
};

type TBookForm = {
  title: string;
  author: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  genre: string;
  condition: string;
  location: string;
  language: string;
  edition: string;
  imageUrl: string;
};

const initialForm: TBookForm = {
  title: "",
  author: "",
  shortDescription: "",
  fullDescription: "",
  price: "",
  genre: "",
  condition: "",
  location: "",
  language: "English",
  edition: "Paperback",
  imageUrl: "",
};

const genres = [
  "Fiction",
  "Technology",
  "Business",
  "Self-development",
  "Academic",
  "History",
  "Finance",
  "Memoir",
];

const conditions = ["Like New", "Good", "Fair", "Used"];

export default function AddBookPage() {
  const router = useRouter();
  const [user, setUser] = useState<TUser | null>(null);
  const [formData, setFormData] = useState<TBookForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/get-session", {
          cache: "no-store",
        });
        const data = await res.json();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setCheckingUser(false);
      }
    };

    checkUser();
  }, [router]);

  const handleChange = (field: keyof TBookForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Book title is required";
    if (formData.title.trim().length < 3) {
      return "Book title must be at least 3 characters";
    }
    if (!formData.author.trim()) return "Author name is required";
    if (!formData.shortDescription.trim()) {
      return "Short description is required";
    }
    if (!formData.fullDescription.trim()) {
      return "Full description is required";
    }
    if (!formData.price) return "Price is required";
    if (Number(formData.price) < 0 || Number(formData.price) > 100000) {
      return "Price must be between 0 and 100000";
    }
    if (!formData.genre) return "Please select a genre";
    if (!formData.condition) return "Please select book condition";
    if (!formData.location.trim()) return "Location is required";

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const result = await addBook({
        ...formData,
        ownerName: user?.name,
        ownerEmail: user?.email,
      });

      if (!result.success) {
        setError(result.message || "Failed to add book");
        return;
      }

      setSuccess("Book listing added successfully!");
      setFormData(initialForm);

      setTimeout(() => {
        router.push("/");
      }, 900);
    } catch (error) {
      console.error(error);
      setError("Backend is not reachable. Please start the Express server.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingUser) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-emerald-700">
            Checking your login...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Add Book
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Create a clear and trustworthy listing
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Share the title, condition, price, and useful notes so another
            reader knows exactly what they are getting.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="Atomic Habits"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(event) => handleChange("author", event.target.value)}
                placeholder="James Clear"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(event) => handleChange("price", event.target.value)}
                placeholder="420"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(event) =>
                  handleChange("location", event.target.value)
                }
                placeholder="Dhanmondi, Dhaka"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Genre
              </label>
              <select
                value={formData.genre}
                onChange={(event) => handleChange("genre", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Select genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(event) =>
                  handleChange("condition", event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(event) =>
                  handleChange("language", event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Edition
              </label>
              <input
                type="text"
                value={formData.edition}
                onChange={(event) =>
                  handleChange("edition", event.target.value)
                }
                placeholder="Paperback, 2018"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Optional image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(event) =>
                  handleChange("imageUrl", event.target.value)
                }
                placeholder="https://..."
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Short description
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(event) =>
                  handleChange("shortDescription", event.target.value)
                }
                placeholder="Practical habit-building guide in excellent condition."
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full description
              </label>
              <textarea
                value={formData.fullDescription}
                onChange={(event) =>
                  handleChange("fullDescription", event.target.value)
                }
                rows={6}
                placeholder="Explain the edition, visible condition, marks, missing pages, and why you are selling it."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
