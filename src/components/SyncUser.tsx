"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SyncUser = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          //   console.log("User synced successfully");
        })
        .catch((err) => console.error("Error syncing user:", err));
    }
  }, [user, isLoaded]);

  return null;
};

export default SyncUser;
