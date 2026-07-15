import type { Metadata } from "next";
import dns from "node:dns";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import "./globals.css";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const metadata: Metadata = {
  title: "ReRead - Used Book Marketplace",
  description: "Find affordable pre-owned books from readers near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
