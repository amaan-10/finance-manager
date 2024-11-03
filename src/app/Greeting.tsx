// app/clientComponent.tsx
"use client"; // This directive enables client-side features

import React, { useEffect, useState } from "react";

const Greeting: React.FC = () => {
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
      <p>{greeting}</p>
    </div>
  );
};

export default Greeting;
