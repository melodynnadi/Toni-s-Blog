import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_NAME, BLOG_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: BLOG_NAME,
    template: `%s | ${BLOG_NAME}`,
  },
  description: BLOG_TAGLINE,
  openGraph: {
    title: BLOG_NAME,
    description: BLOG_TAGLINE,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_NAME,
    description: BLOG_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 page-transition">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
