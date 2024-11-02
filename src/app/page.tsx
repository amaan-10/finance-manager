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
  return (
    <div>
      <section>
        <span className=" text-xl font-bold mt-4 mb-2 flex gap-2">
          Good Morning{suffix}!
          <Image height={24} width={28} src={WavingHand} alt="Waving Hand" />
        </span>

        <h2>Welcome to Personal Finance Manager</h2>
        <p>Track your expenses, create budgets, and manage your investments.</p>
        <div className="flex flex-col px-5">
          <Image
            src={AnalysisSVG}
            alt="Analysis SVG"
            width={350}
            height={350}
            unoptimized // This ensures the GIF is not optimized, preserving the animation.
          />
          <Image
            src={FinanceSVG}
            alt="Finance SVG"
            className=" self-end"
            width={350}
            height={350}
            unoptimized // This ensures the GIF is not optimized, preserving the animation.
          />
          <Image
            src={DataSVG}
            alt="Financial Data SVG"
            width={350}
            height={350}
            unoptimized // This ensures the GIF is not optimized, preserving the animation.
          />
          <Image
            src={RevenueSVG}
            alt="Revenue SVG"
            className=" self-end"
            width={350}
            height={350}
            unoptimized // This ensures the GIF is not optimized, preserving the animation.
          />
        </div>
      </section>
    </div>
  );
}
