// app/layout.tsx
import Link from "next/link";
import "./globals.css"; // Import global styles
import {
  ClerkProvider,
  SignedOut,
  SignInButton,
  SignUpButton,
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
              <div className=" flex items-center font-extrabold">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M389.32 171.64a57.64 57.64 0 1 0-20.42-28l-25.38 38zM356.99 498.5l-223.13-23.62 23.08-270.5 223.98 19.1-23.93 275.02z"
                    style={{ fill: "#c6d0dc" }}
                  />
                  <path
                    transform="rotate(4.88 265.18 325.132)"
                    style={{ fill: "#fff" }}
                    d="M184.91 189.75h161v271.48h-161z"
                  />
                  <path
                    style={{ fill: "#59aee4" }}
                    d="M62.93 123.72h238.6v325.85H62.93z"
                  />
                  <path
                    style={{ fill: "#fff" }}
                    d="M62.93 155.89h238.6V388.4H62.93z"
                  />
                  <circle
                    cx="182.23"
                    cy="417.72"
                    r="12.47"
                    style={{ fill: "#e83e38" }}
                  />
                  <path
                    style={{ fill: "#548fbf" }}
                    d="M283.17 386.7h18.35v62.87h-18.35zM283.17 124.26h18.35v31.44h-18.35z"
                  />
                  <path
                    style={{ fill: "#c6d0dc" }}
                    d="M283.96 155.89h18.35v230.8h-18.35z"
                  />
                  <path
                    d="M381.86 148.89a57.65 57.65 0 1 0-20.41-28l-25.39 38z"
                    style={{ fill: "#f7c648" }}
                  />
                  <path
                    style={{ fill: "#ef835e" }}
                    d="m218.2 238.08-.06 12 11.83.05-27.95 27.94-11.08-11.08-33.37 33.36-10.51-10.51-34.87 34.87 8.48 8.48 26.39-26.38 10.51 10.51 33.37-33.36 11.08 11.08 35.94-35.93-.05 10.65 12 .06.15-31.59-31.86-.15z"
                  />
                  <path d="M102.26 222.04h-12v137.2h182v-12h-170v-125.2zM244.03 175.15h35.23v12h-35.23zM244.03 192.58h35.23v12h-35.23zM182.23 399.25a18.47 18.47 0 1 0 18.47 18.47 18.49 18.49 0 0 0-18.47-18.47zm0 24.94a6.47 6.47 0 1 1 6.47-6.47 6.47 6.47 0 0 1-6.47 6.47zM159.23 133.7h46v12h-46zM476.41 82.59a63.64 63.64 0 0 0-121.54 37.65l-32.05 47.94 57.74-12.53a63.64 63.64 0 0 0 95.85-73.06zm-43.89 69.2a51.72 51.72 0 0 1-47.1-7.39l-2.18-1.61-33.94 7.36 18.77-28.07-.94-2.79a51.64 51.64 0 1 1 65.39 32.5z" />
                  <path d="M423.88 98.22 415.12 96q-7.17-1.77-7.17-6.19a5.65 5.65 0 0 1 2.28-4.61 10.18 10.18 0 0 1 6.24-1.8h.59q7.29.09 9.31 5.84l8.84-2.19a13.12 13.12 0 0 0-6.66-8.23 22.38 22.38 0 0 0-6.41-2.35V65.63h-12v11.15a17.88 17.88 0 0 0-6.61 3.34 13.54 13.54 0 0 0-5.14 11.08 15 15 0 0 0 1.46 6.53 11.61 11.61 0 0 0 3.87 4.74 24.25 24.25 0 0 0 7.47 3l9.86 2.57c2.64.68 4.37 1.62 5.17 2.82a6.78 6.78 0 0 1 1.21 3.9 5.89 5.89 0 0 1-2.66 4.88 12.07 12.07 0 0 1-6.89 1.94h-1.53q-10.08-.28-11.65-7.65l-9 1.93a15.76 15.76 0 0 0 7.65 10 24.63 24.63 0 0 0 6.82 2.52v11.67h12v-11.43a21.07 21.07 0 0 0 9.43-3.91 14.21 14.21 0 0 0 5.72-11.95 14.83 14.83 0 0 0-2.72-8.63q-2.74-3.9-10.72-5.91zM359.14 243.71l4.55-51.88-36.86-3.24-1.05 12 24.91 2.19-3.51 39.92a26.73 26.73 0 0 0-13.65 6.1 27 27 0 0 0-9.53 18.34l12 1.05a15 15 0 0 1 5.31-10.26 14.81 14.81 0 0 1 4.8-2.72l-2.59 29.47a27 27 0 0 0-23.16 24.47l11.95 1.05a15.06 15.06 0 0 1 10.11-13l-2.58 29.47a26.65 26.65 0 0 0-13.65 6.1 27 27 0 0 0-9.52 18.38l11.95 1.05a15.07 15.07 0 0 1 5.28-10.2 14.75 14.75 0 0 1 4.81-2.72l-2.59 29.47a26.65 26.65 0 0 0-13.65 6.1 27 27 0 0 0-9.47 18.33l11.95 1.05a15.11 15.11 0 0 1 5.26-10.23 14.93 14.93 0 0 1 4.81-2.71l-7 80-64.67-5.67h44.2v-337.9H56.93v337.85h69.16l212.81 18.68 4.55-51.88a27.13 27.13 0 0 0 15-46.37 27.16 27.16 0 0 0 5.67-39.88 26.81 26.81 0 0 0-2-2.14 27.16 27.16 0 0 0 5.68-39.87 25.31 25.31 0 0 0-2-2.14 27.16 27.16 0 0 0 5.68-39.87 26.69 26.69 0 0 0-12.34-8.39zm-290.21-114h226.6v20H68.93zm0 32h226.6v219H68.93zm0 281.87V392.7h226.6v50.87zm285.75-46.73a15.13 15.13 0 0 1-10.12 13L347 382.3a15 15 0 0 1 7.71 14.54zm3.68-42a15.09 15.09 0 0 1-10.12 13l2.42-27.52a15 15 0 0 1 7.7 14.54zm3.69-42a15.11 15.11 0 0 1-10.12 13l2.42-27.53a14.93 14.93 0 0 1 4.26 3.52 15.08 15.08 0 0 1 3.44 10.98zm3.69-42a15.11 15.11 0 0 1-10.12 13l2.38-27.59a14.89 14.89 0 0 1 4.26 3.51 15.1 15.1 0 0 1 3.48 11.03z" />
                </svg> */}
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
                <h1 className=" pl-2 ">SpendLess | Personal Finance Manager</h1>
              </div>

              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>

              <span className=" absolute right-0 sign-in-container">
                <SignedOut>
                  <span className=" m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <SignInButton mode="modal" />
                  </span>
                  <span className=" m-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    <SignUpButton mode="modal" />
                  </span>
                </SignedOut>
              </span>
            </nav>
          </header>
          <main>{children}</main>
          <footer>© 2024 SpendLess | Personal Finance Manager</footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
