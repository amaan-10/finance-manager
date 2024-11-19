// app/clientComponent.tsx
"use client"; // This directive enables client-side features

import Image from "next/image";
import React, { useEffect, useState } from "react";
import WavingHand from "../assets/Waving Hand.png";
interface Suffix {
  suffix: string;
  userData: object;
}

const Greeting: React.FC<Suffix> = ({ suffix, userData }) => {
  const [greeting, setGreeting] = useState<string>("");
  //console.log(userData);
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
      <span className="inline">{greeting ? greeting : "Good Morning"}</span>
      {suffix ? (
        ", "
      ) : (
        <span className=" inline-flex flex-row">
          !
          <Image
            className="ml-2 h-[34px] w-[38px] sm:h-[28px] sm:w-[32px] md:h-[34px] md:w-[38px] self-center justify-center"
            src={WavingHand}
            alt="Waving Hand"
          />
        </span>
      )}
    </div>
  );
};

export default Greeting;
