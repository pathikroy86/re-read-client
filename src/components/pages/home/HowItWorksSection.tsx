const steps = [
  {
    title: "Discover",
    text: "Search by title, author, genre, location, and price to find books nearby.",
  },
  {
    title: "Review details",
    text: "Check condition, edition, seller notes, photos, and reader reviews.",
  },
  {
    title: "Contact owner",
    text: "Save the book or contact the owner when you are ready to collect it.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              How ReRead works
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              A simple way to pass books forward
            </h2>
            <p className="mt-4 text-slate-600">
              ReRead keeps the marketplace focused: list a book, describe it
              clearly, and help another reader enjoy it at a fair price.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
