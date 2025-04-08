"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 375);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="absolute top-[50px] w-full px-5 z-50">
        <nav className="px-5 flex justify-between">
          <div className="flex items-center font-extrabold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 font-normal"
              viewBox="0 0 24 24"
              fill="black"
            >
              <path d="m6,9c-3.421,0-6,1.505-6,3.5v8c0,1.995,2.579,3.5,6,3.5s6-1.505,6-3.5v-8c0-1.995-2.579-3.5-6-3.5Zm4,7.5c0,.529-1.519,1.5-4,1.5s-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348Zm-4-5.5c2.481,0,4,.971,4,1.5s-1.519,1.5-4,1.5-4-.971-4-1.5,1.519-1.5,4-1.5Zm0,11c-2.481,0-4-.971-4-1.5v-1.348c1.046.533,2.435.848,4,.848s2.954-.315,4-.848v1.348c0,.529-1.519,1.5-4,1.5ZM24,5v14c0,2.757-2.243,5-5,5h-5c-.553,0-1-.448-1-1s.447-1,1-1h5c1.654,0,3-1.346,3-3V5c0-1.654-1.346-3-3-3h-10c-1.654,0-3,1.346-3,3v1c0,.552-.447,1-1,1s-1-.448-1-1v-1C4,2.243,6.243,0,9,0h10c2.757,0,5,2.243,5,5Zm-11,5c-.553,0-1-.448-1-1s.447-1,1-1h5v-2h-8v.5c0,.552-.447,1-1,1s-1-.448-1-1v-.5c0-1.103.897-2,2-2h8c1.103,0,2,.897,2,2v2c0,1.103-.897,2-2,2h-5Zm1,8c0-.552.447-1,1-1h4c.553,0,1,.448,1,1s-.447,1-1,1h-4c-.553,0-1-.448-1-1Zm0-4v-1c0-.552.447-1,1-1s1,.448,1,1v1c0,.552-.447,1-1,1s-1-.448-1-1Zm6,0c0,.552-.447,1-1,1s-1-.448-1-1v-1c0-.552.447-1,1-1s1,.448,1,1v1Z" />
            </svg>
            <h1 className=" pl-3 text-lg md:text-[22px]">SpendLess</h1>
          </div>
          <div className="flex justify-between items-center text-sm md:text-base">
            <span className="mb-0 my-auto inline-flex md:inline sign-in-container">
              <SignedOut>
                <span className=" m-[6px] md:m-2 bg-neutral-900 hover:bg-neutral-900/85 text-white text-xs sm:text-sm md:text-base font-bold py-2 md:py-[10px] px-3 md:px-4 border border-neutral-900 rounded-full">
                  <SignInButton />
                </span>
                <span className=" m-[6px] md:m-2 bg-transparent hover:bg-neutral-900 text-neutral-900 text-xs sm:text-sm md:text-base font-bold hover:text-white py-2 md:py-[10px] px-3 md:px-4 border border-neutral-700 hover:border-transparent rounded-full">
                  <SignUpButton />
                </span>
              </SignedOut>
              <SignedIn>
                <UserButton
                  showName={!isMobile}
                  appearance={{
                    elements: {
                      userButtonPopoverActionButtonText: {
                        color: "black",
                      },
                      userButtonBox: {
                        color: "black",
                      },
                      userButtonOuterIdentifier: {
                        color: "black",
                      },
                    },
                  }}
                />
              </SignedIn>
            </span>
          </div>
        </nav>
      </header>
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full max-w-2xl px-4 font-semibold">
        <nav className="backdrop-blur-md bg-white rounded-full px-2 py-1 flex items-center justify-center gap-2 border border-gray-200/20 shadow-sm">
          <Link
            href="/"
            className={cn(
              "px-5 py-2 mr-[-2px] rounded-full transition-all duration-200 hover:bg-gray-200",
              pathname === "/" && "bg-gray-200"
            )}
            onMouseEnter={() => setHoveredItem("home")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Home className="h-5 w-5 text-black" />
            <span className="sr-only">Home</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "pl-5 pr-[10px] py-2 rounded-full text-sm transition-all duration-200 flex items-center gap-1.5 hover:bg-gray-200",
                  (pathname?.startsWith("/finance") ||
                    hoveredItem === "finance") &&
                    "bg-gray-200"
                )}
                onMouseEnter={() => setHoveredItem("finance")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Finance
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="rounded-xl mt-1 bg-white/90 dark:bg-black/90 backdrop-blur-md border-gray-200/20 dark:border-gray-800/20"
            >
              <DropdownMenuItem asChild>
                <Link href="/finance" className="cursor-pointer">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finance/expenses" className="cursor-pointer">
                  Expenses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finance/budgets" className="cursor-pointer">
                  Budgets
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/finance/investments" className="cursor-pointer">
                  Investments
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/split-up"
            className={cn(
              "px-5 py-2 mr-[-2px] rounded-full text-sm transition-all duration-200 hover:bg-gray-200 text-black no-underline hover:no-underline",
              (pathname === "/split-it-up" || hoveredItem === "splitup") &&
                "bg-gray-200"
            )}
            onMouseEnter={() => setHoveredItem("splitup")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            Split Up
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "pl-5 pr-[10px] py-2 rounded-full text-sm transition-all duration-200 flex items-center gap-1.5 hover:bg-gray-200",
                  (pathname?.startsWith("/arena") || hoveredItem === "arena") &&
                    "bg-gray-200"
                )}
                onMouseEnter={() => setHoveredItem("arena")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Arena
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="rounded-xl mt-1 bg-white/90 dark:bg-black/90 backdrop-blur-md border-gray-200/20 dark:border-gray-800/20"
            >
              <DropdownMenuItem asChild>
                <Link href="/arena" className="cursor-pointer">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/arena/challenges" className="cursor-pointer">
                  Challenges
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/arena/rewards" className="cursor-pointer">
                  Rewards
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/arena/leaderboard" className="cursor-pointer">
                  Leaderboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/arena/history" className="cursor-pointer">
                  History
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </>
  );
}
