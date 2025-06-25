"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="m-5 z-50 flex justify-center pt-32 pb-10">
      {loading ? (
        <div className="flex w-full sm:w-[60%] md:w-[50%] lg:w-[35%] my-4 items-center justify-center rounded-lg border bg-white p-6 shadow-md">
          {/* Skeleton Loader */}
          <div className="animate-pulse w-full my-4">
            <div className="h-12 bg-gray-300 rounded mb-8"></div>
            <div className="flex gap-4 w-full h-10 mb-8">
              <div className="h-10 bg-gray-300 w-1/2 rounded mb-3"></div>
              <div className="h-10 bg-gray-300 w-1/2 rounded mb-3"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded mb-5"></div>
            <div className="h-10 bg-gray-300 rounded mb-5"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
