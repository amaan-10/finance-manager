import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import WavingHand from "../assets/Waving Hand.png";
import AnalysisSVG from "../assets/analysis-animate.svg";
import FinanceSVG from "../assets/finance-animate.svg";
import DataSVG from "../assets/financial-data-animate.svg";
import RevenueSVG from "../assets/revenue-animate.svg";
import Greeting from "./Greeting";
import Link from "next/link";
import SyncUser from "@/components/SyncUser";

export default async function Home() {
  const user = await currentUser();
  const userData = JSON.parse(JSON.stringify({ ...user }));
  const username = user?.firstName;
  const suffix = username ? `${username}` : "";

  return (
    <div>
      <SyncUser />
      <section className=" flex flex-col md:flex-row  h-[75vh] md:items-center ">
        <div className="md:w-1/2">
          <span className="text-[28px] sm:text-2xl md:text-3xl font-bold mt-5 mb-2 flex flex-wrap">
            <span>
              <Greeting suffix={suffix} userData={userData} />
            </span>
            <span className=" inline-flex flex-row">
              {suffix ? (
                <>
                  {suffix}!
                  <Image
                    className="ml-2 h-[34px] w-[38px] sm:h-[28px] sm:w-[32px] md:h-[34px] md:w-[38px] self-center justify-center"
                    src={WavingHand}
                    alt="Waving Hand"
                  />
                </>
              ) : (
                " "
              )}
            </span>
          </span>
          <p className=" text-base md:text-lg">
            Welcome to Personal Finance Manager <br />
            Track your expenses, create budgets, and manage your investments{" "}
            <br />
            Try splitting up your bills with{" "}
            <Link href={"/split-it-up"} className="cursor-pointer underline">
              SplitItUp
            </Link>
            .
          </p>

          <div className="mt-4 flex gap-4">
            <Link
              href={"/dashboard"}
              className="font-medium p-1 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Get Started
            </Link>
            <Link
              href={"https://github.com/amaan-10/finance-manager"}
              target="_blank"
              className="font-medium p-1 bg-gray-200 text-black hover:bg-gray-300"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className=" md:w-1/2 flex justify-center">
          <Image
            src={AnalysisSVG}
            alt="Analysis SVG"
            unoptimized // This ensures the GIF is not optimized, preserving the animation.
          />
        </div>
      </section>
    </div>
  );
}
