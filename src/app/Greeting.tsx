// app/clientComponent.tsx
"use client"; // This directive enables client-side features

import Image from "next/image";
import React, { useEffect, useState } from "react";
import WavingHand from "../assets/Waving Hand.png";
interface Suffix {
  suffix: string;
}

const Greeting: React.FC<Suffix> = ({ suffix }) => {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const currentDate = new Date(); // Client-side time
    const currentHour = currentDate.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting("Good Afternoon");
    } else if (currentHour >= 17 && currentHour < 24) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  return (
    <div>
      <span className="inline">{greeting}</span>
      {suffix ? (
        ","
      ) : (
        <span className=" inline-flex flex-row">
          !
          <Image
            className="ml-2 h-[34] w-[38] sm:h-[28] sm:w-[32] md:h-[34] md:w-[38] self-center justify-center"
            src={WavingHand}
            alt="Waving Hand"
          />
        </span>
      )}
    </div>
  );
};

export default Greeting;
