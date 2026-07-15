"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type TLoginForm = {
  email: string;
  password: string;
};

const initialForm: TLoginForm = {
  email: "",
  password: "",
};

const demoUser: TLoginForm = {
  email: "reader@reread.app",
  password: "Reader123",
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TLoginForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof TLoginForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDemoLogin = () => {
    setFormData(demoUser);
    setError("");
    setSuccess("Demo credentials added. Click Login to continue.");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Email is required";
    }

    if (!formData.email.includes("@")) {
      return "Please enter a valid email address";
    }

    if (!formData.password) {
      return "Password is required";
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

      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: true,
        }),
      });

      const result = await res.json().catch(() => ({
        message: "Login failed. Please try again.",
      }));

      if (!res.ok) {
        setError(result?.message || "Invalid email or password.");
        return;
      }

      setSuccess("Login successful!");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 700);
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
            Welcome back
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            Read. Reuse. Repeat.
          </h1>
          <p className="mt-4 leading-7 text-emerald-50">
            Log in to manage your book listings, save favorite finds, and keep
            your reading marketplace organized.
          </p>

          <div className="mt-10 rounded-3xl bg-white/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Demo account
            </p>
            <div className="mt-4 space-y-2 text-sm text-emerald-50">
              <p>Email: reader@reread.app</p>
              <p>Password: Reader123</p>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="mt-5 rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300"
            >
              Use Demo Account
            </button>
          </div>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-950">
              Log in to ReRead
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email and password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={(event) =>
                  handleChange("password", event.target.value)
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New reader?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
