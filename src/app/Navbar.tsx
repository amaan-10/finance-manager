"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  const headers = new Headers(); // Placeholder: Replace with actual headers if needed

  const pathname = usePathname();

  const HomeLink = ({
    href,
    children,
    className,
  }: {
    className: string;
    href: string;
    children: ReactNode;
  }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={`${
          isActive ? " underline-offset-2 underline " : ""
        }${className}`}
      >
        {children}
      </Link>
    );
  };

  const DashboardLink = ({
    href,
    children,
    className,
  }: {
    className: string;
    href: string;
    children: ReactNode;
  }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={`${
          isActive ? " underline-offset-2 underline " : ""
        }${className}`}
      >
        <nav
          className={` md:hidden inline-flex transition-transform font-mono ${
            isActive ? "rotate-0 " : "-rotate-90"
          } mr-2`}
        >
          ▼ {/* Triangle symbol */}
        </nav>
        {children}
      </Link>
    );
  };

  const SplitItUpLink = ({
    href,
    children,
    className,
  }: {
    className: string;
    href: string;
    children: ReactNode;
  }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={`${
          isActive ? " underline-offset-2 underline " : ""
        }${className}`}
      >
        {children}
      </Link>
    );
  };

  const ChallengesLink = ({
    href,
    children,
    className,
  }: {
    className: string;
    href: string;
    children: ReactNode;
  }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        href={href}
        className={`${
          isActive ? " underline-offset-2 underline " : ""
        }${className}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div>
      <div className="mx-5 flex justify-between text-sm md:text-base">
        <span className=" flex-col inline-flex md:flex-row ">
          <SignedIn>
            <HomeLink className=" ml-4 md:ml-0" href="/">
              Home
            </HomeLink>

            <DashboardLink className="mt-0 " href="/dashboard">
              Dashboard
            </DashboardLink>

            <SplitItUpLink className="ml-4 md:ml-0" href="/split-it-up">
              SplitItUp
            </SplitItUpLink>

            <ChallengesLink className="ml-4 md:ml-0" href="/challenges">
              Challenges
            </ChallengesLink>
          </SignedIn>
          <SignedOut>
            <HomeLink className="" href="/">
              Home
            </HomeLink>
            <Link
              className=" mt-1 md:mt-0 text-gray-400 active:underline"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className=" mt-1 md:mt-0 text-gray-400 active:underline"
              href="/split-it-up"
            >
              SplitItUp
            </Link>
            <Link
              className=" mt-1 md:mt-0 text-gray-400 active:underline"
              href="/challenges"
            >
              Challenges
            </Link>
          </SignedOut>
        </span>
        <span className="mb-0 my-auto inline-flex md:inline sign-in-container">
          <SignedOut>
            <span className=" m-[6px] md:m-2 bg-blue-500 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base font-bold py-[6px] md:py-2 px-3 md:px-4 rounded">
              <SignInButton />
            </span>
            <span className=" m-[6px] md:m-2 bg-transparent hover:bg-blue-500 text-blue-700 text-xs sm:text-sm md:text-base font-semibold hover:text-white py-[6px] md:py-2 px-3 md:px-4 border border-blue-500 hover:border-transparent rounded">
              <SignUpButton />
            </span>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </span>
      </div>
    </div>
  );
};

export default Navbar;
