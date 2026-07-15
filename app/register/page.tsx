"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type TRegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: TRegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TRegisterForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof TRegisterForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Name is required";
    }

    if (formData.name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    }

    if (!formData.email.includes("@")) {
      return "Please enter a valid email address";
    }

    if (!formData.password) {
      return "Password is required";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      return "Password must include at least one letter and one number";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

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

      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await res.json().catch(() => ({
        message: "Registration failed. Please try again.",
      }));

      if (!res.ok) {
        setError(result?.message || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created successfully!");
      setFormData(initialForm);

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
        <section className="bg-emerald-800 p-8 text-white sm:p-10 lg:p-12">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50">
            Join ReRead
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            Start giving great books a second story.
          </h1>
          <p className="mt-4 leading-7 text-emerald-50">
            Create an account to list your used books, manage your listings,
            save favorites, and connect with nearby readers.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="rounded-2xl bg-white/10 p-5">
              <h2 className="font-semibold">List books clearly</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">
                Add title, author, price, genre, condition, and description.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <h2 className="font-semibold">Manage your own items</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">
                View and delete your listings from the protected dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-950">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your details to register as a ReRead reader.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="reader@reread.app"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(event) =>
                  handleChange("password", event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  handleChange("confirmPassword", event.target.value)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
