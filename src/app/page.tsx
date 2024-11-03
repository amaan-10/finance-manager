import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import WavingHand from "../assets/Waving Hand.png";
import AnalysisSVG from "../assets/analysis-animate.svg";
import FinanceSVG from "../assets/finance-animate.svg";
import DataSVG from "../assets/financial-data-animate.svg";
import RevenueSVG from "../assets/revenue-animate.svg";

export default async function Home() {
  const user = await currentUser();
  const username = user?.firstName;
  const suffix = username ? `, ${username}` : "";

  // Get the current hour
  const currentHour = new Date().getHours();
  let greeting: string;

  // Determine greeting based on the time of day
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17 && currentHour < 24) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  return (
    <div>
      <section>
        <span className=" text-3xl font-bold mt-5 mb-2 flex gap-2">
          {greeting}
          {currentHour}
          {suffix}!
          <Image height={30} width={36} src={WavingHand} alt="Waving Hand" />
        </span>

        <p className="text-lg">
          Welcome to Personal Finance Manager <br />
          Track your expenses, create budgets, and manage your investments.
        </p>
        <div className="flex flex-col px-7">
          <div className="flex gap-16">
            <Image
              src={AnalysisSVG}
              alt="Analysis SVG"
              width={350}
              height={350}
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center px-10">
              <h1 className=" text-[28px] font-bold pb-3 ">
                Comprehensive Analysis
              </h1>
              <p className=" text-lg text-justify pr-10">
                Gain actionable insights with powerful financial analysis tools.
                Visualize your financial health through charts and metrics,
                helping you make data-driven decisions and track performance
                over time.
              </p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-16">
            <Image
              src={FinanceSVG}
              alt="Finance SVG"
              className=" self-end"
              width={350}
              height={350}
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center px-10">
              <h1 className=" text-[28px] font-bold pb-3 ">
                Financial Data Tracking
              </h1>
              <p className=" text-lg text-justify ">
                Stay organized by securely syncing your accounts and monitoring
                your financial data. Our platform brings together all your bank
                accounts, credit cards, and investments for a clear, centralized
                view.
              </p>
            </div>
          </div>
          <div className="flex gap-16">
            <Image
              src={DataSVG}
              alt="Financial Data SVG"
              width={350}
              height={350}
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center px-10">
              <h1 className=" text-[28px] font-bold pb-3 ">
                Investment Management
              </h1>
              <p className=" text-lg text-justify pr-10">
                Effortlessly monitor and manage your investment portfolio. Track
                real-time market data, review asset performance, and make
                informed investment choices, all in one place.
              </p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-16">
            <Image
              src={RevenueSVG}
              alt="Revenue SVG"
              className=" self-end"
              width={350}
              height={350}
              unoptimized // This ensures the GIF is not optimized, preserving the animation.
            />
            <div className=" self-center pr-10">
              <h1 className=" text-[28px] font-bold pb-3 pl-5">
                Revenue, Budget & Expense Monitoring
              </h1>
              <p className=" text-lg text-justify pl-5">
                Keep a close eye on your income, expenses, and budgets. Set
                financial goals, track your spending patterns, and create custom
                budgets to stay on track and maximize savings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
