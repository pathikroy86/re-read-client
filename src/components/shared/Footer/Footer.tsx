import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700">
              R
            </span>
            <span>ReRead</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            A friendly used book marketplace where readers discover affordable
            books and give old favorites a new home.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Quick links</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/">Home</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>Email: hello@reread.app</p>
            <p>Phone: +880 1700 000000</p>
            <p>Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-400">
        © 2026 ReRead. All rights reserved.
      </div>
    </footer>
  );
}
