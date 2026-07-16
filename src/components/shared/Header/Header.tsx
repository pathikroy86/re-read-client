"use client";

import { getCartItems, getProfile } from "@/service/api";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TMenuItem = {
  title: string;
  url: string;
};

type TAuthUser = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<TAuthUser | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/get-session", {
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        if (!data?.user) {
          setUser(null);
          return;
        }

        const profileResult = await getProfile();
        const profile = profileResult.success ? profileResult.data : null;

        setUser({
          ...data.user,
          name: profile?.name || data.user.name,
          profileImage: profile?.profileImage || data.user.image || "",
        });
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    fetchUser();
    window.addEventListener("profile-updated", fetchUser);

    return () => window.removeEventListener("profile-updated", fetchUser);
  }, [pathname]);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      const result = await getCartItems();

      if (result.success) {
        setCartCount(result.data.length);
      }
    };

    fetchCartCount();
    window.addEventListener("cart-updated", fetchCartCount);

    return () => window.removeEventListener("cart-updated", fetchCartCount);
  }, [user, pathname]);

  const menuItems: TMenuItem[] = [
    { title: "Home", url: "/" },
    { title: "Explore", url: "/explore" },
    { title: "Blog", url: "/blog" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
    ...(user
      ? [
          { title: "Profile", url: "/profile" },
          { title: "Dashboard", url: "/dashboard" },
          { title: "Add Book", url: "/items/add" },
        ]
      : []),
  ];

  const handleNavigation = (url: string) => {
    router.push(url);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setCartCount(0);
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 text-left text-xl font-bold text-slate-900 transition-opacity hover:opacity-80"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            R
          </span>
          <span>ReRead</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                pathname === item.url ? "text-emerald-700" : "text-slate-600"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <button
                onClick={() => handleNavigation("/cart")}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 text-lg transition hover:bg-emerald-50"
                aria-label="Open cart"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-700 px-1.5 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <ProfileAvatar name={user.name} image={user.profileImage} />
              <button
                onClick={handleLogout}
                className="rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 text-slate-800 transition-colors hover:bg-emerald-50 lg:hidden"
        >
          {mobileOpen ? (
            <span className="text-2xl leading-none">×</span>
          ) : (
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 rounded-full bg-slate-800" />
              <span className="block h-0.5 w-5 rounded-full bg-slate-800" />
              <span className="block h-0.5 w-5 rounded-full bg-slate-800" />
            </span>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-emerald-100 bg-white px-4 py-5 shadow-sm lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.url}
                onClick={() => handleNavigation(item.url)}
                className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  pathname === item.url
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>

          <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-3 border-t border-slate-100 pt-4">
            {user ? (
              <>
                <button
                  onClick={() => handleNavigation("/cart")}
                  className="flex w-full items-center justify-between rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <span>Cart</span>
                  <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                </button>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProfileAvatar name={user.name} image={user.profileImage} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation("/login")}
                  className="w-full rounded-full border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function ProfileAvatar({ name, image }: { name: string; image?: string }) {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-700 text-sm font-bold text-white">
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  );
}
