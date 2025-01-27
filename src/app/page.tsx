import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import WavingHand from "../assets/Waving Hand.png";
import AnalysisSVG from "../assets/analysis-animate.svg";
import FinanceSVG from "../assets/finance-animate.svg";
import DataSVG from "../assets/financial-data-animate.svg";
import RevenueSVG from "../assets/revenue-animate.svg";
import Greeting from "./Greeting";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  const userData = JSON.parse(JSON.stringify({ ...user }));
  const username = user?.firstName;
  const suffix = username ? `${username}` : "";

  return (
    <div>
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
        {/* <div className="flex flex-col lg:px-7">
          <div className="flex gap-11 lg:gap-16 flex-col md:flex-row">
            <Image
              src={AnalysisSVG}
              alt="Analysis SVG"
              className=" lg:w-[350px] lg:h-[350px] md:w-[300px] md:h-[300px] w-[300px] h-[300px] self-center"
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center lg:px-10">
              <h1 className=" text-center sm:text-left text-xl sm:text-2xl md:text-[28px] font-bold pb-3 ">
                Comprehensive Analysis
              </h1>
              <p className=" text-sm sm:text-base lg:text-lg text-justify lg:pr-10">
                Gain actionable insights with powerful financial analysis tools.
                Visualize your financial health through charts and metrics,
                helping you make data-driven decisions and track performance
                over time.
              </p>
            </div>
          </div>
          <div className="flex gap-11 lg:gap-16 md:flex-row-reverse flex-col">
            <Image
              src={FinanceSVG}
              alt="Finance SVG"
              className=" lg:w-[350px] lg:h-[350px] md:w-[300px] md:h-[300px] w-[300px] h-[300px] self-center lg:self-end"
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center lg:px-10">
              <h1 className=" text-center sm:text-left text-xl sm:text-2xl md:text-[28px] font-bold pb-3 ">
                Financial Data Tracking
              </h1>
              <p className=" text-sm sm:text-base lg:text-lg text-justify ">
                Stay organized by securely syncing your accounts and monitoring
                your financial data. Our platform brings together all your bank
                accounts, credit cards, and investments for a clear, centralized
                view.
              </p>
            </div>
          </div>
          <div className="flex gap-11 lg:gap-16 flex-col md:flex-row">
            <Image
              src={DataSVG}
              alt="Financial Data SVG"
              className=" lg:w-[350px] lg:h-[350px] md:w-[300px] md:h-[300px] w-[300px] h-[300px] self-center"
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center lg:px-10">
              <h1 className=" text-center sm:text-left text-xl sm:text-2xl md:text-[28px] font-bold pb-3 ">
                Investment Management
              </h1>
              <p className=" text-sm sm:text-base lg:text-lg text-justify lg:pr-10">
                Effortlessly monitor and manage your investment portfolio. Track
                real-time market data, review asset performance, and make
                informed investment choices, all in one place.
              </p>
            </div>
          </div>
          <div className="flex gap-11 lg:gap-16 md:flex-row-reverse flex-col">
            <Image
              src={RevenueSVG}
              alt="Revenue SVG"
              className=" lg:w-[350px] lg:h-[350px] md:w-[300px] md:h-[300px] w-[300px] h-[300px] self-center lg:self-end"
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center lg:px-10">
              <h1 className=" text-center sm:text-left text-xl sm:text-2xl md:text-[28px] font-bold pb-3 ">
                Revenue, Budget & Expense Monitoring
              </h1>
              <p className=" text-sm sm:text-base lg:text-lg text-justify ">
                Keep a close eye on your income, expenses, and budgets. Set
                financial goals, track your spending patterns, and create custom
                budgets to stay on track and maximize savings.
              </p>
            </div>
          </div>
        </div> */}
      </section>
    </div>
  );
}
