import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import WavingHand from "../assets/Waving Hand.png";

export default async function Home() {
  const user = await currentUser();
  const username = user?.username;
  const suffix = username ? `, ${username}` : "";
  return (
    <div>
      <section>
        <span className=" text-xl font-bold mt-4 flex gap-2">
          Good Morning{suffix}!
          <Image height={24} width={28} src={WavingHand} alt="Waving Hand" />
        </span>

        <h2>Welcome to Personal Finance Manager</h2>
        <p>Track your expenses, create budgets, and manage your investments.</p>
      </section>
    </div>
  );
}
