const faqs = [
  {
    question: "Can I browse without an account?",
    answer: "Yes. Visitors can explore books and view public details freely.",
  },
  {
    question: "Do I need login to list a book?",
    answer: "Yes. Creating and managing listings is protected for registered users.",
  },
  {
    question: "Does ReRead handle payments?",
    answer: "No. ReRead focuses on discovery, details, reviews, and owner contact.",
  },
  {
    question: "Can I save books for later?",
    answer: "Yes. Logged-in readers can save books to their favorites list.",
  },
];

export function FaqNewsletterSection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Common questions
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <h3 className="font-bold text-slate-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-emerald-800 p-8 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
            Newsletter
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Get fresh book alerts every week
          </h2>
          <p className="mt-4 text-emerald-50">
            Join the ReRead newsletter for new listings, reading tips, and book
            care guides.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-300"
            />
            <button
              type="button"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
