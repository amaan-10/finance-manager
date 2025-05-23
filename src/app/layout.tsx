// app/layout.tsx
import Link from "next/link";
import "./globals.css"; // Import global styles
import { ClerkProvider } from "@clerk/nextjs";

import { IBM_Plex_Mono, Courier_Prime, Roboto_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navbar from "./Navbar";
import { LoaderProvider } from "./../context/LoaderContext";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster";

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  fallback: ["serif"],
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  fallback: ["serif"],
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  fallback: ["serif"],
  adjustFontFallback: false,
});

export const metadata = {
  title: "Personal Finance Manager",
  description: "Manage your expenses and investments efficiently.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${GeistSans.className}`}>
          <LoaderProvider>
            <Navbar />
            <main className="px-10">{children}</main>
            <Toaster />
            <Footer />
          </LoaderProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
