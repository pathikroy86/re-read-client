"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const contactCards = [
  {
    title: "Email support",
    value: "support@reread.app",
    href: "mailto:support@reread.app",
    description: "For account help, listings, favorites, and general questions.",
  },
  {
    title: "Marketplace help",
    value: "seller@reread.app",
    href: "mailto:seller@reread.app",
    description: "For book owner contact issues and listing guidance.",
  },
  {
    title: "Response time",
    value: "Within 24 hours",
    href: "/explore",
    description: "Browse listings while our team reviews your message.",
  },
];

const faqs = [
  {
    question: "Can I contact a book owner directly?",
    answer:
      "Yes. Open any book details page and click Contact Owner to view owner information.",
  },
  {
    question: "Can I report incorrect book information?",
    answer:
      "Yes. Send us the book title and issue through the contact form so we can review it.",
  },
  {
    question: "Do I need an account to browse books?",
    answer:
      "No. Browsing and viewing book details are public. Saving favorites and adding books require login.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");

    const mailUrl = `mailto:support@reread.app?subject=${encodeURIComponent(
      subject || "ReRead support request"
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailUrl;
    setNotice("Your email app is opening with the message ready to send.");
  };

  return (
    <main className="overflow-hidden bg-slate-50">
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50" />
        <div className="absolute left-8 top-16 h-24 w-24 rounded-full bg-emerald-200/60 blur-2xl animate-float-soft" />
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-amber-200/70 blur-2xl animate-float-soft [animation-delay:1.2s]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Contact ReRead
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Need help with a book, listing, or account?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Send a message to the ReRead team. We help readers solve listing
              questions, owner contact issues, account access problems, and
              book marketplace guidance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:support@reread.app"
                className="rounded-full bg-emerald-700 px-6 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:-translate-y-1 hover:bg-emerald-800"
              >
                Email Support
              </a>
              <Link
                href="/explore"
                className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-center text-sm font-bold text-emerald-700 transition hover:-translate-y-1 hover:bg-emerald-50"
              >
                Browse Books
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:0.15s]">
            <div className="absolute -inset-4 rounded-[2rem] bg-emerald-200/40 blur-2xl animate-pulse-ring" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold text-emerald-300">
                  Live marketplace note
                </p>
                <h2 className="mt-3 text-3xl font-black">
                  Keep every exchange clear and safe.
                </h2>
                <p className="mt-4 leading-7 text-slate-300">
                  Before meeting a seller, confirm the final price, pickup
                  place, book condition, and availability through owner contact.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {["Ask", "Confirm", "Meet"].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-emerald-50 p-4 text-center"
                  >
                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="mt-3 text-sm font-bold text-slate-900">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {contactCards.map((card, index) => (
            <a
              key={card.title}
              href={card.href}
              className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                ✉️
              </div>
              <h2 className="text-lg font-bold text-slate-950">
                {card.title}
              </h2>
              <p className="mt-2 font-semibold text-emerald-700">
                {card.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Send a message
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Tell us how we can help
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Your name
                </span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Enter your name"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Email address
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="reader@example.com"
                />
              </label>
            </div>

            <label className="mt-5 grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Subject
              </span>
              <input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Book listing or account question"
              />
            </label>

            <label className="mt-5 grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Message
              </span>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="Write your message clearly..."
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-1 hover:bg-emerald-800 sm:w-auto"
            >
              Open Email App
            </button>

            {notice && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {notice}
              </p>
            )}
          </form>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Quick answers
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Before you send
            </h2>

            <div className="mt-6 space-y-4">
              {faqs.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl bg-slate-50 p-5 transition hover:bg-emerald-50"
                >
                  <h3 className="font-bold text-slate-950">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-amber-50 p-5">
              <p className="font-bold text-amber-900">Safety reminder</p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Meet in a public place, inspect the book before payment, and do
                not share sensitive account information with other users.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
