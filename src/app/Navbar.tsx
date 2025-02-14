"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useLoader } from "@/context/LoaderContext";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 375);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headers = new Headers();

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

  const FunZoneLink = ({
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
    <>
      <header>
        <nav>
          <div className="p-5 flex items-center font-extrabold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" h-[30px] w-[30px] font-normal"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="m6,9c-3.421,0-6,1.505-6,3.5v8c0,1.995,2.579,3.5,6,3.5s6-1.505,6-3.5v-8c0-1.995-2.579-3.5-6-3.5Zm4,7.5c0,.529-1.519,1.5-4,1.5s-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348Zm-4-5.5c2.481,0,4,.971,4,1.5s-1.519,1.5-4,1.5-4-.971-4-1.5,1.519-1.5,4-1.5Zm0,11c-2.481,0-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348c0,.529-1.519,1.5-4,1.5ZM24,5v14c0,2.757-2.243,5-5,5h-5c-.553,0-1-.448-1-1s.447-1,1-1h5c1.654,0,3-1.346,3-3V5c0-1.654-1.346-3-3-3h-10c-1.654,0-3,1.346-3,3v1c0,.552-.447,1-1,1s-1-.448-1-1v-1C4,2.243,6.243,0,9,0h10c2.757,0,5,2.243,5,5Zm-11,5c-.553,0-1-.448-1-1s.447-1,1-1h5v-2h-8v.5c0,.552-.447,1-1,1s-1-.448-1-1v-.5c0-1.103.897-2,2-2h8c1.103,0,2,.897,2,2v2c0,1.103-.897,2-2,2h-5Zm1,8c0-.552.447-1,1-1h4c.553,0,1,.448,1,1s-.447,1-1,1h-4c-.553,0-1-.448-1-1Zm0-4v-1c0-.552.447-1,1-1s1,.448,1,1v1c0,.552-.447,1-1,1s-1-.448-1-1Zm6,0c0,.552-.447,1-1,1s-1-.448-1-1v-1c0-.552.447-1,1-1s1,.448,1,1v1Z" />
            </svg>
            <h1 className=" pl-3 text-lg md:text-xl">SpendLess</h1>
          </div>
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

                <FunZoneLink className="ml-4 md:ml-0" href="/fun-zone">
                  Fun-zone
                </FunZoneLink>
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
                  href="/fun-zone"
                >
                  Fun-Zone
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
                <UserButton showName={!isMobile} />
              </SignedIn>
            </span>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
