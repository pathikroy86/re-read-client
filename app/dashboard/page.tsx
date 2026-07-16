"use client";

import {
  getBooks,
  getBlogs,
  getCartItems,
  getContactMessages,
  getFavorites,
  TBlog,
  TBook,
  TCartItem,
  TContactMessage,
  TFavorite,
} from "@/service/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TUser = {
  name: string;
  email: string;
};

type TActivity = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "book" | "blog" | "favorite" | "cart" | "message";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<TUser | null>(null);
  const [myBooks, setMyBooks] = useState<TBook[]>([]);
  const [myBlogs, setMyBlogs] = useState<TBlog[]>([]);
  const [favorites, setFavorites] = useState<TFavorite[]>([]);
  const [cartItems, setCartItems] = useState<TCartItem[]>([]);
  const [messages, setMessages] = useState<TContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const sessionRes = await fetch("/api/auth/get-session", {
          cache: "no-store",
        });
        const session = await sessionRes.json();

        if (!session?.user) {
          router.push("/login");
          return;
        }

        setUser(session.user);

        const [booksResult, blogsResult, favoritesResult, cartResult, messageResult] =
          await Promise.all([
            getBooks(),
            getBlogs(),
            getFavorites(session.user.email),
            getCartItems(),
            getContactMessages(session.user.email),
          ]);

        if (booksResult.success) {
          const userBooks = booksResult.data.filter(
            (book: TBook) => book.ownerEmail === session.user.email
          );
          setMyBooks(userBooks);
        }

        if (blogsResult.success) {
          const userBlogs = blogsResult.data.filter(
            (blog: TBlog) => blog.authorEmail === session.user.email
          );
          setMyBlogs(userBlogs);
        }

        if (favoritesResult.success) {
          setFavorites(favoritesResult.data);
        }

        if (cartResult.success) {
          setCartItems(cartResult.data);
        }

        if (messageResult.success) {
          setMessages(messageResult.data);
        }
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const recentActivities = useMemo(() => {
    const bookActivities: TActivity[] = myBooks.map((book) => ({
      id: `book-${book.id}`,
      title: "Book listed",
      description: book.title,
      date: book.createdAt,
      type: "book",
    }));

    const favoriteActivities: TActivity[] = favorites.map((favorite) => ({
      id: `favorite-${favorite.id}`,
      title: "Book saved",
      description: favorite.book.title,
      date: favorite.createdAt,
      type: "favorite",
    }));

    const blogActivities: TActivity[] = myBlogs.map((blog) => ({
      id: `blog-${blog.id}`,
      title: "Blog published",
      description: blog.title,
      date: blog.createdAt,
      type: "blog",
    }));

    const messageActivities: TActivity[] = messages.map((message) => ({
      id: `message-${message.id}`,
      title: "Message sent",
      description: message.subject,
      date: message.createdAt,
      type: "message",
    }));

    const cartActivities: TActivity[] = cartItems.map((item) => ({
      id: `cart-${item.id}`,
      title: "Book added to cart",
      description: item.book.title,
      date: item.createdAt,
      type: "cart",
    }));

    return [
      ...bookActivities,
      ...blogActivities,
      ...favoriteActivities,
      ...cartActivities,
      ...messageActivities,
    ]
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 8);
  }, [myBooks, myBlogs, favorites, cartItems, messages]);

  const activityChartData = useMemo(
    () => [
      { name: "Books", value: myBooks.length, color: "#047857" },
      { name: "Blogs", value: myBlogs.length, color: "#7c3aed" },
      { name: "Favorites", value: favorites.length, color: "#d97706" },
      { name: "Cart", value: cartItems.length, color: "#0284c7" },
    ],
    [myBooks.length, myBlogs.length, favorites.length, cartItems.length]
  );

  const monthlyActivityData = useMemo(() => {
    const months = getLastSixMonths();

    const allActivities = [
      ...myBooks.map((book) => ({ date: book.createdAt, type: "books" })),
      ...myBlogs.map((blog) => ({ date: blog.createdAt, type: "blogs" })),
      ...favorites.map((favorite) => ({
        date: favorite.createdAt,
        type: "favorites",
      })),
      ...messages.map((message) => ({
        date: message.createdAt,
        type: "messages",
      })),
      ...cartItems.map((item) => ({
        date: item.createdAt,
        type: "cart",
      })),
    ];

    return months.map((month) => {
      const monthActivities = allActivities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return (
          activityDate.getFullYear() === month.year &&
          activityDate.getMonth() === month.month
        );
      });

      return {
        name: month.label,
        books: monthActivities.filter((activity) => activity.type === "books")
          .length,
        blogs: monthActivities.filter((activity) => activity.type === "blogs")
          .length,
        favorites: monthActivities.filter(
          (activity) => activity.type === "favorites"
        ).length,
        messages: monthActivities.filter(
          (activity) => activity.type === "messages"
        ).length,
        cart: monthActivities.filter((activity) => activity.type === "cart")
          .length,
      };
    });
  }, [myBooks, myBlogs, favorites, messages, cartItems]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-emerald-700">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-sm sm:p-10">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-52 w-52 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                User Dashboard
              </p>
              <h1 className="mt-2 text-4xl font-black">
                Welcome back, {user?.name || "Reader"}
              </h1>
              <p className="mt-3 text-slate-300">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/items/add"
                className="rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Add Book
              </Link>
              <Link
                href="/explore"
                className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore
              </Link>
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStat label="Books listed" value={myBooks.length} />
            <DashboardStat label="Blogs written" value={myBlogs.length} />
            <DashboardStat label="Saved favorites" value={favorites.length} />
            <DashboardStat label="Cart books" value={cartItems.length} />
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Activity overview
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Your activity mix
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A quick view of how your ReRead activity is distributed.
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={98}
                    paddingAngle={4}
                  >
                    {activityChartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {activityChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-sm font-semibold text-slate-600">
                    {item.name}: {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Monthly progress
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Activity over the last 6 months
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Books, blogs, favorites, cart, and messages grouped by month.
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                  <Bar dataKey="books" stackId="activity" fill="#047857" />
                  <Bar dataKey="blogs" stackId="activity" fill="#7c3aed" />
                  <Bar dataKey="favorites" stackId="activity" fill="#d97706" />
                  <Bar
                    dataKey="messages"
                    stackId="activity"
                    fill="#38bdf8"
                  />
                  <Bar
                    dataKey="cart"
                    stackId="activity"
                    fill="#0284c7"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Recent activity
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Everything you did
                </h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                Latest first
              </span>
            </div>

            {recentActivities.length ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No activity yet"
                description="Add a book, save a favorite, or send a message to start your activity timeline."
                href="/explore"
                buttonText="Start Exploring"
              />
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Account snapshot
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Your reading profile
            </h2>

            <div className="mt-6 rounded-3xl bg-emerald-50 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-700 text-2xl font-black text-white">
                {(user?.name || "R").slice(0, 1).toUpperCase()}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {user?.name || "ReRead Reader"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{user?.email}</p>
            </div>

            <div className="mt-6 grid gap-3">
              <QuickLink href="/profile" title="View profile and favorites" />
              <QuickLink href="/cart" title="View cart books" />
              <QuickLink href="/contact" title="Send a support message" />
              <QuickLink href="/items/add" title="Add another book" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-2">
          <DashboardPanel
            title="Books you listed"
            subtitle="Your active marketplace books"
            actionHref="/items/add"
            actionText="Add Book"
          >
            {myBooks.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {myBooks.slice(0, 4).map((book) => (
                  <BookMiniCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No books listed"
                description="Add your first used book and it will appear here."
                href="/items/add"
                buttonText="Add Book"
              />
            )}
          </DashboardPanel>

          <DashboardPanel
            title="Blogs you wrote"
            subtitle="Your reading journal posts"
            actionHref="/blog/write"
            actionText="Write Blog"
          >
            {myBlogs.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {myBlogs.slice(0, 4).map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      {blog.category}
                    </span>
                    <h3 className="mt-4 line-clamp-2 font-bold text-slate-950">
                      {blog.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {blog.commentsCount} comments · {blog.readTime}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No blogs written"
                description="Write about any book you love and it will appear here."
                href="/blog/write"
                buttonText="Write Blog"
              />
            )}
          </DashboardPanel>

          <DashboardPanel
            title="Saved favorite books"
            subtitle="Books you want to revisit"
            actionHref="/profile"
            actionText="View Profile"
          >
            {favorites.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {favorites.slice(0, 4).map((favorite) => (
                  <BookMiniCard key={favorite.id} book={favorite.book} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No favorites saved"
                description="Open a book details page and save it to favorites."
                href="/explore"
                buttonText="Explore Books"
              />
            )}
          </DashboardPanel>

          <DashboardPanel
            title="Books in your cart"
            subtitle="Books you are considering"
            actionHref="/cart"
            actionText="Open Cart"
          >
            {cartItems.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {cartItems.slice(0, 4).map((item) => (
                  <BookMiniCard key={item.id} book={item.book} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No cart books"
                description="Add books to cart from Explore or a book details page."
                href="/explore"
                buttonText="Explore Books"
              />
            )}
          </DashboardPanel>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Contact messages
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Messages you sent
              </h2>
            </div>

            <Link
              href="/contact"
              className="rounded-full bg-emerald-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Send New Message
            </Link>
          </div>

          {messages.length ? (
            <div className="grid gap-5">
              {messages.map((item) => (
                <MessageCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No contact messages yet"
              description="Send a message from the Contact page and it will appear here."
              href="/contact"
              buttonText="Go to Contact"
            />
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}

function ActivityItem({ activity }: { activity: TActivity }) {
  const date = new Date(activity.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const typeStyle = {
    book: "bg-emerald-100 text-emerald-700",
    blog: "bg-violet-100 text-violet-700",
    favorite: "bg-amber-100 text-amber-700",
    cart: "bg-cyan-100 text-cyan-700",
    message: "bg-sky-100 text-sky-700",
  }[activity.type];

  return (
    <div className="flex gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${typeStyle}`}
      >
        {activity.type === "book"
          ? "B"
          : activity.type === "blog"
            ? "W"
            : activity.type === "favorite"
              ? "F"
              : activity.type === "cart"
                ? "C"
                : "M"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <h3 className="font-bold text-slate-950">{activity.title}</h3>
          <p className="text-sm font-medium text-slate-500">{date}</p>
        </div>
        <p className="mt-1 truncate text-sm text-slate-600">
          {activity.description}
        </p>
      </div>
    </div>
  );
}

function DashboardPanel({
  title,
  subtitle,
  actionHref,
  actionText,
  children,
}: {
  title: string;
  subtitle: string;
  actionHref: string;
  actionText: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            {subtitle}
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>
        </div>
        <Link
          href={actionHref}
          className="rounded-full border border-emerald-200 px-5 py-2 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          {actionText}
        </Link>
      </div>
      {children}
    </section>
  );
}

function BookMiniCard({ book }: { book: TBook }) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="flex gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
    >
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-emerald-700 text-xs font-bold text-white">
            R
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-bold text-slate-950">{book.title}</h3>
        <p className="mt-1 truncate text-sm text-slate-500">{book.author}</p>
        <p className="mt-3 text-sm font-bold text-emerald-700">
          ৳{book.price}
        </p>
      </div>
    </Link>
  );
}

function MessageCard({ item }: { item: TContactMessage }) {
  const sentDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/50 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-slate-950">
              {item.subject}
            </h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {item.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Sent by {item.name} · {item.email}
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-500">{sentDate}</p>
      </div>

      <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
        {item.message}
      </p>
    </article>
  );
}

function EmptyState({
  title,
  description,
  href,
  buttonText,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        {buttonText}
      </Link>
    </div>
  );
}

function QuickLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
    >
      <span>{title}</span>
      <span>→</span>
    </Link>
  );
}

function getLastSixMonths() {
  const months = [];
  const today = new Date();

  for (let index = 5; index >= 0; index--) {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);

    months.push({
      label: date.toLocaleDateString("en-US", { month: "short" }),
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  return months;
}
