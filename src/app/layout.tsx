// app/layout.tsx
import Link from "next/link";
import "./globals.css"; // Import global styles
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { IBM_Plex_Mono, Courier_Prime, Roboto_Mono } from "next/font/google";

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
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
        <body className={`${roboto.className}`}>
          <header>
            <nav>
              <div className=" p-10 pt-10 flex items-center font-extrabold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 48 48"
                  fill="white"
                >
                  <g data-name="17-calculator">
                    <path d="M43 48H23a5.006 5.006 0 0 1-5-5V21a5.006 5.006 0 0 1 5-5h20a5.006 5.006 0 0 1 5 5v22a5.006 5.006 0 0 1-5 5zM23 18a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V21a3 3 0 0 0-3-3z" />
                    <path d="M27 35h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm-3-2h2v-2h-2zM35 35h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm-3-2h2v-2h-2zM43 35h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm-3-2h2v-2h-2zM27 43h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm-3-2h2v-2h-2zM35 43h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm-3-2h2v-2h-2zM43 43h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1zm-3-2h2v-2h-2zM19 24h25v2H19zM22 20h2v2h-2zM26 20h6v2h-6zM16 22H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h32a3 3 0 0 1 3 3v11h-2V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h13z" />
                    <path d="M16 18H7a1 1 0 0 1-1-1 1 1 0 0 0-1-1 1 1 0 0 1-1-1V7a1 1 0 0 1 1-1 1 1 0 0 0 1-1 1 1 0 0 1 1-1h24a1 1 0 0 1 1 1 1 1 0 0 0 1 1 1 1 0 0 1 1 1v7h-2V7.829A3.016 3.016 0 0 1 30.171 6H7.829A3.016 3.016 0 0 1 6 7.829v6.342A3.016 3.016 0 0 1 7.829 16H16zM16 26H7a3 3 0 0 1-3-3v-2h2v2a1 1 0 0 0 1 1h9z" />
                    <path d="M16 30h-6a3 3 0 0 1-3-3v-2h2v2a1 1 0 0 0 1 1h6zM19 14a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm0-4a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
                  </g>
                </svg>
                <h1 className=" pl-3 text-xl">
                  SpendLess | Personal Finance Manager
                </h1>
              </div>
              <div className="ml-5">
                <Link href="/">Home</Link>
                <SignedIn>
                  <Link href="/dashboard">Dashboard</Link>
                </SignedIn>
                <SignedOut>
                  <Link className=" text-gray-400" href="/dashboard">
                    Dashboard
                  </Link>
                </SignedOut>
                <span className="  mr-5 absolute right-0 sign-in-container">
                  <SignedOut>
                    <span className=" m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      <SignInButton />
                    </span>
                    <span className=" m-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                      <SignUpButton />
                    </span>
                  </SignedOut>
                  <SignedIn>
                    <UserButton showName />
                  </SignedIn>
                </span>
              </div>
            </nav>
          </header>
          <main className="px-10">{children}</main>
          <footer className=" px-10 py-7 text-gray-600">
            © 2024 SpendLess | Personal Finance Manager
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
