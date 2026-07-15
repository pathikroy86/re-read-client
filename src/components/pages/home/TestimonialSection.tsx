const testimonials = [
  {
    name: "Nadia Rahman",
    role: "University reader",
    quote:
      "I found two academic books in great condition and paid less than half the original price.",
  },
  {
    name: "Sakib Hasan",
    role: "Software learner",
    quote:
      "Selling my old programming books was simple. The listing form made the condition clear.",
  },
  {
    name: "Maliha Karim",
    role: "Fiction lover",
    quote:
      "The location filter helped me find books close to home. ReRead feels practical and friendly.",
  },
];

export function TestimonialSection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Reader testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Trusted by everyday readers
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-amber-500">★★★★★</p>
              <p className="mt-4 leading-7 text-slate-600">
                &quot;{item.quote}&quot;
              </p>
              <div className="mt-6">
                <h3 className="font-bold text-slate-950">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
