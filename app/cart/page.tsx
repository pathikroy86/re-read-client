"use client";

import { getCartItems, removeCartItem, TCartItem } from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<TCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      const sessionRes = await fetch("/api/auth/get-session", {
        cache: "no-store",
      });
      const session = await sessionRes.json();

      if (!session?.user) {
        router.push("/login?redirect=/cart");
        return;
      }

      const result = await getCartItems();

      if (result.success) {
        setCartItems(result.data);
      }

      setLoading(false);
    };

    fetchCart();
  }, [router]);

  const handleRemove = async (id: string) => {
    const result = await removeCartItem(id);

    if (result.success) {
      setMessage(result.message);
      const cartResult = await getCartItems();

      if (cartResult.success) {
        setCartItems(cartResult.data);
      }
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.book.price, 0);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-emerald-700">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl bg-emerald-800 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
            Book cart
          </p>
          <h1 className="mt-2 text-4xl font-black">Books you added to cart</h1>
          <p className="mt-3 text-emerald-50">
            {cartItems.length} books · Total ৳{totalPrice}
          </p>
        </section>

        {message && (
          <p className="mb-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </p>
        )}

        {cartItems.length ? (
          <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="grid gap-5">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[120px_1fr_auto]"
                >
                  <div className="relative h-36 overflow-hidden rounded-2xl bg-slate-100 sm:h-32">
                    {item.book.imageUrl ? (
                      <Image
                        src={item.book.imageUrl}
                        alt={item.book.title}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-emerald-700 p-4 text-center font-bold text-white">
                        {item.book.title}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {item.book.genre}
                    </span>
                    <h2 className="mt-3 text-xl font-black text-slate-950">
                      {item.book.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.book.author} · {item.book.condition}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {item.book.shortDescription}
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <p className="text-xl font-black text-emerald-700">
                      ৳{item.book.price}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/books/${item.book.id}`}
                        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Cart summary
              </p>
              <div className="mt-5 space-y-3">
                <SummaryRow label="Total books" value={String(cartItems.length)} />
                <SummaryRow label="Estimated total" value={`৳${totalPrice}`} />
              </div>
              <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                ReRead does not process payment yet. Contact each book owner
                from the details page to confirm availability.
              </p>
            </aside>
          </section>
        ) : (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center">
            <h2 className="text-2xl font-black text-slate-950">
              Your cart is empty
            </h2>
            <p className="mt-3 text-slate-600">
              Add books from Explore or from any book details page.
            </p>
            <Link
              href="/explore"
              className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white"
            >
              Explore Books
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="font-bold text-slate-950">{value}</p>
    </div>
  );
}
