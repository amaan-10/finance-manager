// app/layout.tsx
import Link from "next/link";
import "./globals.css"; // Import global styles
import { ClerkProvider } from "@clerk/nextjs";

import { IBM_Plex_Mono, Courier_Prime, Roboto_Mono } from "next/font/google";
import { ReactNode } from "react";
import Navbar from "./Navbar";

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
              <div className=" md:p-5 p-10 px-5 flex items-center font-extrabold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" md:w-[30px] md:h-[30px] sm:w-[40px] sm:h-[40px] xs:w-[50px] xs:h-[50px] w-[60px] h-[60px] font-normal"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="m6,9c-3.421,0-6,1.505-6,3.5v8c0,1.995,2.579,3.5,6,3.5s6-1.505,6-3.5v-8c0-1.995-2.579-3.5-6-3.5Zm4,7.5c0,.529-1.519,1.5-4,1.5s-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348Zm-4-5.5c2.481,0,4,.971,4,1.5s-1.519,1.5-4,1.5-4-.971-4-1.5,1.519-1.5,4-1.5Zm0,11c-2.481,0-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348c0,.529-1.519,1.5-4,1.5ZM24,5v14c0,2.757-2.243,5-5,5h-5c-.553,0-1-.448-1-1s.447-1,1-1h5c1.654,0,3-1.346,3-3V5c0-1.654-1.346-3-3-3h-10c-1.654,0-3,1.346-3,3v1c0,.552-.447,1-1,1s-1-.448-1-1v-1C4,2.243,6.243,0,9,0h10c2.757,0,5,2.243,5,5Zm-11,5c-.553,0-1-.448-1-1s.447-1,1-1h5v-2h-8v.5c0,.552-.447,1-1,1s-1-.448-1-1v-.5c0-1.103.897-2,2-2h8c1.103,0,2,.897,2,2v2c0,1.103-.897,2-2,2h-5Zm1,8c0-.552.447-1,1-1h4c.553,0,1,.448,1,1s-.447,1-1,1h-4c-.553,0-1-.448-1-1Zm0-4v-1c0-.552.447-1,1-1s1,.448,1,1v1c0,.552-.447,1-1,1s-1-.448-1-1Zm6,0c0,.552-.447,1-1,1s-1-.448-1-1v-1c0-.552.447-1,1-1s1,.448,1,1v1Z" />
                </svg>

                <h1 className=" pl-3 text-lg md:text-xl">SpendLess</h1>
              </div>
              <Navbar />
            </nav>
          </header>
          <main className="px-10">{children}</main>
          <footer className=" px-10 py-10 text-sm sm:text-base text-gray-500">
            © 2025 SpendLess | Personal Finance Manager
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
