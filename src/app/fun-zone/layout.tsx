// app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const NavLink = ({
    href,
    children,
    className,
  }: {
    className: string;
    href: string;
    children: ReactNode;
  }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`${
          isActive ? " underline-offset-[1.5px] underline " : ""
        }${className}`}
      >
        {children}
      </Link>
    );
  };
  return (
    <div>
      <nav className=" flex-col inline-flex md:flex-row">
        <span>
          <span className="inline md:hidden">- </span>
          <NavLink className=" text-black" href="/fun-zone">
            Overview
          </NavLink>
        </span>
        <span>
          <span className="inline md:hidden">- </span>
          <NavLink
            className=" mt-[2px] md:mt-0 text-black"
            href="/fun-zone/challenges"
          >
            Challenges
          </NavLink>
        </span>
        <span>
          <span className="inline md:hidden">- </span>
          <NavLink
            className=" mt-[2px] md:mt-0 text-black"
            href="/fun-zone/rewards"
          >
            Rewards
          </NavLink>
        </span>
        <span>
          <span className="inline md:hidden">- </span>
          <NavLink
            className=" mt-[2px] md:mt-0 text-black"
            href="/fun-zone/leaderboard"
          >
            Leaderboard
          </NavLink>
        </span>
        <span>
          <span className="inline md:hidden">- </span>
          <NavLink
            className=" mt-[2px] md:mt-0 text-black"
            href="/fun-zone/history"
          >
            History
          </NavLink>
        </span>
      </nav>
      <div>{children}</div>
    </div>
  );
}
